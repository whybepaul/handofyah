import { NextRequest } from 'next/server'
import { z } from 'zod'
import { getSupabaseServiceClient } from '@/lib/supabase-server'
import { stripe } from '@/lib/stripe'
import { getAuthedUser } from '@/lib/auth'

// ── Validation schema ──────────────────────────────────────────────────────

const PatchSubscriptionSchema = z.object({
  frequency: z.enum(['monthly', 'bimonthly', 'quarterly']).optional(),
  status: z.enum(['active', 'paused', 'cancelled']).optional(),
})

// ── Interval mapping ───────────────────────────────────────────────────────

const FREQUENCY_TO_INTERVAL: Record<
  'monthly' | 'bimonthly' | 'quarterly',
  { interval: 'month'; interval_count: number }
> = {
  monthly: { interval: 'month', interval_count: 1 },
  bimonthly: { interval: 'month', interval_count: 2 },
  quarterly: { interval: 'month', interval_count: 3 },
}

// PATCH /api/subscriptions/[id] — update frequency or pause/resume
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthedUser(request)
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const rawBody = await request.json().catch(() => ({}))
  const parsed = PatchSubscriptionSchema.safeParse(rawBody)

  if (!parsed.success) {
    return Response.json(
      { error: 'Invalid fields', details: parsed.error.issues },
      { status: 400 }
    )
  }

  const allowed = parsed.data
  if (Object.keys(allowed).length === 0) {
    return Response.json({ error: 'No valid fields to update' }, { status: 400 })
  }

  const supabase = getSupabaseServiceClient()

  // Verify ownership and retrieve the Stripe subscription ID in one query
  const { data: existing } = await supabase
    .from('subscriptions')
    .select('id, stripe_subscription_id')
    .eq('id', id)
    .eq('customer_id', user.id)
    .maybeSingle()

  if (!existing) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  const stripeSubId: string | null = existing.stripe_subscription_id ?? null

  // Sync changes to Stripe before persisting to Supabase
  if (stripeSubId) {
    try {
      if (allowed.frequency) {
        const { interval, interval_count } = FREQUENCY_TO_INTERVAL[allowed.frequency]
        // Fetch the subscription to get the current price ID for update
        const stripeSub = await stripe.subscriptions.retrieve(stripeSubId, {
          expand: ['items'],
        })
        const itemId = stripeSub.items.data[0]?.id
        if (itemId) {
          await stripe.subscriptions.update(stripeSubId, {
            items: [
              {
                id: itemId,
                price_data: {
                  currency: 'usd',
                  recurring: { interval, interval_count },
                  // Carry forward the existing unit amount and product
                  unit_amount: stripeSub.items.data[0].price.unit_amount ?? undefined,
                  product: stripeSub.items.data[0].price.product as string,
                },
              },
            ],
          })
        }
      }

      if (allowed.status === 'paused') {
        await stripe.subscriptions.update(stripeSubId, {
          pause_collection: { behavior: 'void' },
        })
      } else if (allowed.status === 'active') {
        await stripe.subscriptions.update(stripeSubId, {
          pause_collection: '' as unknown as null, // Stripe SDK: empty string clears the field
        })
      }
    } catch (stripeErr) {
      const message = stripeErr instanceof Error ? stripeErr.message : 'Stripe error'
      console.error('[PATCH /api/subscriptions/[id]] Stripe error:', stripeErr)
      return Response.json({ error: `Stripe sync failed: ${message}` }, { status: 502 })
    }
  }

  // Persist changes to Supabase only after Stripe succeeds
  const { data, error } = await supabase
    .from('subscriptions')
    .update(allowed)
    .eq('id', id)
    .eq('customer_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('[PATCH /api/subscriptions/[id]]', error)
    return Response.json({ error: 'Failed to update subscription' }, { status: 500 })
  }

  return Response.json(data)
}

// DELETE /api/subscriptions/[id] — cancel subscription
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthedUser(request)
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const supabase = getSupabaseServiceClient()

  // Verify ownership and retrieve the Stripe subscription ID in one query
  const { data: existing } = await supabase
    .from('subscriptions')
    .select('id, stripe_subscription_id')
    .eq('id', id)
    .eq('customer_id', user.id)
    .maybeSingle()

  if (!existing) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  const stripeSubId: string | null = existing.stripe_subscription_id ?? null

  // Cancel in Stripe before updating Supabase to keep them in sync
  if (stripeSubId) {
    try {
      await stripe.subscriptions.cancel(stripeSubId)
    } catch (stripeErr) {
      const message = stripeErr instanceof Error ? stripeErr.message : 'Stripe error'
      console.error('[DELETE /api/subscriptions/[id]] Stripe error:', stripeErr)
      return Response.json({ error: `Stripe sync failed: ${message}` }, { status: 502 })
    }
  }

  // Soft-cancel: mark as cancelled rather than deleting the record
  const { data, error } = await supabase
    .from('subscriptions')
    .update({ status: 'cancelled' })
    .eq('id', id)
    .eq('customer_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('[DELETE /api/subscriptions/[id]]', error)
    return Response.json({ error: 'Failed to cancel subscription' }, { status: 500 })
  }

  return Response.json(data)
}
