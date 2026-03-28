import { NextRequest } from 'next/server'
import { getSupabaseServiceClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '').trim()

  if (!token) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getSupabaseServiceClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser(token)

  if (userError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Excludes internal fields (stripe_subscription_id, stripe_payment_intent_id, customer_id)
  // not needed by the client.
  const { data: subscriptions, error } = await supabase
    .from('subscriptions')
    .select('id, product_slug, frequency, status, next_billing_date, created_at')
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[GET /api/subscriptions]', error)
    return Response.json({ error: 'Failed to fetch subscriptions' }, { status: 500 })
  }

  return Response.json(subscriptions ?? [])
}
