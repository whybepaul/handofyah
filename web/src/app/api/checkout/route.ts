import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { SITE_URL, FREE_SHIPPING_THRESHOLD, SUBSCRIPTION_DISCOUNT } from '@/lib/constants'
import { sanityFetch } from '@/lib/sanity'

export const dynamic = 'force-dynamic'

// ── Validation schema ──────────────────────────────────────────────────────

const CartItemSchema = z.object({
  productSlug: z.string().min(1),
  productName: z.string().min(1),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  subscription: z
    .object({
      frequency: z.enum(['monthly', 'bimonthly', 'quarterly']),
    })
    .optional(),
})

const ShippingAddressSchema = z.object({
  name: z.string().min(1),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(2),
})

const CheckoutRequestSchema = z.object({
  items: z.array(CartItemSchema).min(1),
  shippingAddress: ShippingAddressSchema,
  customerEmail: z.string().email(),
})

// ── Types ──────────────────────────────────────────────────────────────────

type ValidatedItem = z.infer<typeof CartItemSchema>
type SubscriptionFrequency = 'monthly' | 'bimonthly' | 'quarterly'

// ── Interval mapping ───────────────────────────────────────────────────────

const FREQUENCY_TO_INTERVAL: Record<
  SubscriptionFrequency,
  { interval: 'month'; interval_count: number }
> = {
  monthly: { interval: 'month', interval_count: 1 },
  bimonthly: { interval: 'month', interval_count: 2 },
  quarterly: { interval: 'month', interval_count: 3 },
}

// ── POST handler ───────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // Guest checkout is intentional (PRD FR-8). No auth required.
  // Authenticated users get their email pre-filled from the session.
  try {
    const body = await request.json()
    const parsed = CheckoutRequestSchema.safeParse(body)

    if (!parsed.success) {
      return Response.json(
        { error: 'Invalid request', details: parsed.error.issues },
        { status: 400 }
      )
    }

    const { items, shippingAddress, customerEmail } = parsed.data

    // W7: Block mixed carts — Stripe sessions cannot mix payment and subscription modes
    const hasSubscription = items.some((item) => item.subscription)
    const hasOneTime = items.some((item) => !item.subscription)

    if (hasSubscription && hasOneTime) {
      return NextResponse.json(
        { error: 'Subscription and one-time items cannot be purchased together. Please check out separately.' },
        { status: 400 }
      )
    }

    // C2: Verify canonical prices from Sanity to prevent client-submitted price tampering
    const productSlugs = items.map((item) => item.productSlug)
    const sanityProducts = await sanityFetch<
      Array<{ slug: { current: string }; price: number; name: string }>
    >(
      `*[_type == "product" && slug.current in $slugs && status == "active"]{ slug, price, name }`,
      { slugs: productSlugs }
    )

    if (sanityProducts.length === 0 && process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
      // Sanity is configured but returned no products — reject to prevent fraud
      return NextResponse.json(
        { error: 'One or more products could not be verified. Please refresh and try again.' },
        { status: 400 }
      )
    }

    const priceMap = new Map(sanityProducts.map((p) => [p.slug.current, p.price]))

    // Resolve the authoritative price for each item. In development (no Sanity),
    // fall back to the client-submitted price with a warning.
    function getVerifiedPrice(item: ValidatedItem): number {
      const canonicalPrice = priceMap.get(item.productSlug)
      if (canonicalPrice === undefined) {
        if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
          // Production: Sanity is configured — this slug was not found above
          throw new Error(`Product not found or inactive: ${item.productSlug}`)
        }
        // Development: no Sanity configured — trust client price (already includes discount if applicable)
        console.warn(`[checkout] No canonical price for ${item.productSlug}; using client-submitted price`)
        return item.price
      }
      return item.subscription
        ? canonicalPrice * (1 - SUBSCRIPTION_DISCOUNT)
        : canonicalPrice
    }

    // Separate one-time and subscription items
    const oneTimeItems = items.filter((item) => !item.subscription)
    const subscriptionItems = items.filter(
      (item): item is ValidatedItem & { subscription: { frequency: SubscriptionFrequency } } =>
        item.subscription !== undefined
    )

    // Build Stripe line_items for one-time purchases using canonical prices
    let oneTimeLineItems: Stripe.Checkout.SessionCreateParams.LineItem[]
    let subscriptionLineItems: Stripe.Checkout.SessionCreateParams.LineItem[]
    try {
      oneTimeLineItems = oneTimeItems.map((item) => ({
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(getVerifiedPrice(item) * 100), // dollars to cents
          product_data: {
            name: item.productName,
            metadata: { productSlug: item.productSlug },
          },
        },
        quantity: item.quantity,
      }))

      // Build Stripe line_items for subscription items using canonical prices
      subscriptionLineItems = subscriptionItems.map((item) => {
        const freq = item.subscription.frequency
        const { interval, interval_count } = FREQUENCY_TO_INTERVAL[freq]
        return {
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(getVerifiedPrice(item) * 100),
            recurring: { interval, interval_count },
            product_data: {
              name: `${item.productName} (${frequencyLabel(freq)})`,
              metadata: { productSlug: item.productSlug, frequency: freq },
            },
          },
          quantity: item.quantity,
        }
      })
    } catch (priceError) {
      const message = priceError instanceof Error ? priceError.message : 'Price verification failed'
      return NextResponse.json({ error: message }, { status: 400 })
    }

    const allLineItems = [...oneTimeLineItems, ...subscriptionLineItems]

    // Determine checkout mode. Stripe requires all line items to have the same
    // recurring configuration in 'subscription' mode. If both types exist, use
    // 'subscription' and flag this as a known limitation for production.
    const mode: Stripe.Checkout.SessionCreateParams.Mode =
      subscriptionItems.length > 0 ? 'subscription' : 'payment'

    // Build shipping options (payment mode only — Stripe doesn't support
    // custom shipping options in subscription mode)
    // Use line item unit_amounts already computed above to keep subtotal consistent
    const subtotal =
      [...oneTimeLineItems, ...subscriptionLineItems].reduce(
        (sum, li) =>
          sum + ((li.price_data as { unit_amount: number }).unit_amount / 100) * (li.quantity ?? 1),
        0
      )

    const shippingOptions: Stripe.Checkout.SessionCreateParams.ShippingOption[] =
      subtotal >= FREE_SHIPPING_THRESHOLD
        ? [
            {
              shipping_rate_data: {
                type: 'fixed_amount',
                fixed_amount: { amount: 0, currency: 'usd' },
                display_name: 'Free shipping',
                delivery_estimate: {
                  minimum: { unit: 'business_day', value: 5 },
                  maximum: { unit: 'business_day', value: 7 },
                },
              },
            },
          ]
        : [
            {
              shipping_rate_data: {
                type: 'fixed_amount',
                fixed_amount: { amount: 795, currency: 'usd' },
                display_name: 'Standard shipping',
                delivery_estimate: {
                  minimum: { unit: 'business_day', value: 5 },
                  maximum: { unit: 'business_day', value: 7 },
                },
              },
            },
            {
              shipping_rate_data: {
                type: 'fixed_amount',
                fixed_amount: { amount: 1495, currency: 'usd' },
                display_name: 'Express shipping',
                delivery_estimate: {
                  minimum: { unit: 'business_day', value: 2 },
                  maximum: { unit: 'business_day', value: 3 },
                },
              },
            },
          ]

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: allLineItems,
      customer_email: customerEmail,
      automatic_tax: { enabled: true },
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      // Shipping options are only supported in payment mode
      ...(mode === 'payment' && { shipping_options: shippingOptions }),
      metadata: {
        shippingName: shippingAddress.name,
        shippingLine1: shippingAddress.line1,
        shippingLine2: shippingAddress.line2 ?? '',
        shippingCity: shippingAddress.city,
        shippingState: shippingAddress.state,
        shippingPostalCode: shippingAddress.postalCode,
        shippingCountry: shippingAddress.country,
      },
      success_url: `${SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/cart`,
    })

    return Response.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('[checkout] Error creating Stripe session:', error)
    return Response.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────

function frequencyLabel(frequency: SubscriptionFrequency): string {
  switch (frequency) {
    case 'monthly':
      return 'monthly'
    case 'bimonthly':
      return 'every 2 months'
    case 'quarterly':
      return 'quarterly'
    default: {
      // Exhaustiveness guard — TypeScript ensures all cases are handled
      const _exhaustive: never = frequency
      return _exhaustive
    }
  }
}
