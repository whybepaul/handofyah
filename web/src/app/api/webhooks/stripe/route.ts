import { NextRequest } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { getSupabaseServiceClient } from '@/lib/supabase-server'
import { sendTransactionalEmail, addSubscriber } from '@/lib/listmonk'

// Raw body must be read for Stripe signature verification; disable caching.
export const dynamic = 'force-dynamic'

// ── Template IDs ───────────────────────────────────────────────────────────
// These must match the transactional template IDs configured in Listmonk.
const EMAIL_TEMPLATE_ORDER_CONFIRMATION = Number(
  process.env.LISTMONK_TEMPLATE_ORDER_CONFIRMATION ?? 1
)

// ── POST handler ───────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // Read raw body — required for Stripe signature verification
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig) {
    return new Response('Missing stripe-signature header', { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not configured')
    return new Response('Server misconfiguration', { status: 500 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[webhook] Signature verification failed:', message)
    return new Response(`Webhook error: ${message}`, { status: 400 })
  }

  const supabase = getSupabaseServiceClient()

  try {
    switch (event.type) {
      // ── Checkout session completed ─────────────────────────────────────
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        const customerEmail =
          session.customer_details?.email ?? (session.customer_email as string | null)
        const customerName = session.customer_details?.name ?? undefined

        // Retrieve full line items (the session object payload may be truncated)
        const lineItemsResponse = await stripe.checkout.sessions.listLineItems(session.id, {
          limit: 100,
        })

        // Derive payment intent ID — it can be a string or an expanded object
        const paymentIntentId =
          typeof session.payment_intent === 'string'
            ? session.payment_intent
            : (session.payment_intent?.id ?? null)

        // Look up customer account by email to link the order (null for guest checkout)
        let customerId: string | null = null
        if (customerEmail) {
          const { data: customer } = await supabase
            .from('customers')
            .select('id')
            .eq('email', customerEmail)
            .single()
          customerId = customer?.id ?? null
        }

        // Persist order to Supabase
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            customer_id: customerId,
            stripe_session_id: session.id,
            stripe_payment_intent_id: paymentIntentId,
            customer_email: customerEmail,
            customer_name: customerName,
            status: 'paid',
            subtotal: (session.amount_subtotal ?? 0) / 100,
            shipping: (session.total_details?.amount_shipping ?? 0) / 100,
            tax: (session.total_details?.amount_tax ?? 0) / 100,
            total: (session.amount_total ?? 0) / 100,
            currency: session.currency ?? 'usd',
            shipping_name: session.metadata?.shippingName ?? null,
            shipping_line1: session.metadata?.shippingLine1 ?? null,
            shipping_line2: session.metadata?.shippingLine2 ?? null,
            shipping_city: session.metadata?.shippingCity ?? null,
            shipping_state: session.metadata?.shippingState ?? null,
            shipping_postal_code: session.metadata?.shippingPostalCode ?? null,
            shipping_country: session.metadata?.shippingCountry ?? null,
            line_items: lineItemsResponse.data,
          })
          .select()
          .single()

        if (orderError) {
          console.error('[webhook] Failed to insert order:', orderError)
          return new Response('Order creation failed', { status: 500 })
        }

        // Add customer to mailing list and send confirmation email
        if (customerEmail) {
          try {
            await addSubscriber(customerEmail, customerName)
          } catch {
            // Non-fatal — subscriber may already exist
          }

          try {
            await sendTransactionalEmail(
              customerEmail,
              EMAIL_TEMPLATE_ORDER_CONFIRMATION,
              {
                customerName: customerName ?? customerEmail,
                orderId: order?.id ?? session.id,
                orderTotal: ((session.amount_total ?? 0) / 100).toFixed(2),
              }
            )
          } catch (emailErr) {
            console.error('[webhook] Failed to send order confirmation email:', emailErr)
          }
        }

        break
      }

      // ── Subscription invoice paid (renewal) ────────────────────────────
      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice

        // Only create a renewal order when it is not the initial payment
        // (billing_reason 'subscription_create' is handled by checkout.session.completed)
        if (invoice.billing_reason === 'subscription_cycle') {
          // In Stripe API v2026, subscription info is nested under invoice.parent
          const parentSubscriptionId =
            invoice.parent?.type === 'subscription_details'
              ? invoice.parent.subscription_details?.subscription
              : null

          const subscriptionId =
            typeof parentSubscriptionId === 'string'
              ? parentSubscriptionId
              : (parentSubscriptionId?.id ?? null)

          // Tax is reported via total_taxes in the new API version
          const taxAmount = invoice.total_taxes
            ? invoice.total_taxes.reduce((sum, t) => sum + (t.amount ?? 0), 0)
            : 0

          // Look up customer account to link the renewal order
          let renewalCustomerId: string | null = null
          if (invoice.customer_email) {
            const { data: renewalCustomer } = await supabase
              .from('customers')
              .select('id')
              .eq('email', invoice.customer_email)
              .single()
            renewalCustomerId = renewalCustomer?.id ?? null
          }

          await supabase.from('orders').insert({
            customer_id: renewalCustomerId,
            stripe_invoice_id: invoice.id,
            stripe_subscription_id: subscriptionId,
            customer_email: invoice.customer_email,
            status: 'paid',
            subtotal: (invoice.subtotal ?? 0) / 100,
            tax: taxAmount / 100,
            total: (invoice.amount_paid ?? 0) / 100,
            currency: invoice.currency ?? 'usd',
            line_items: invoice.lines?.data ?? [],
            is_renewal: true,
          })
        }

        break
      }

      // ── Subscription updated ───────────────────────────────────────────
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription

        // current_period_end was removed in API v2026; use billing_cycle_anchor
        // as a reference point. In production, query the subscription schedule
        // for the exact next billing date.
        await supabase
          .from('subscriptions')
          .update({ status: subscription.status })
          .eq('stripe_subscription_id', subscription.id)

        break
      }

      // ── Subscription deleted/cancelled ────────────────────────────────
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        await supabase
          .from('subscriptions')
          .update({ status: 'cancelled' })
          .eq('stripe_subscription_id', subscription.id)

        break
      }

      default:
        // Unhandled event types are silently ignored — return 200 so Stripe
        // does not retry them.
        break
    }
  } catch (handlerError) {
    console.error(`[webhook] Handler error for ${event.type}:`, handlerError)
    // Return 500 so Stripe retries the event
    return new Response('Internal handler error', { status: 500 })
  }

  return new Response('OK', { status: 200 })
}
