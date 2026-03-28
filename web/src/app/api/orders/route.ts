import { NextRequest } from 'next/server'
import { getSupabaseServiceClient } from '@/lib/supabase-server'
import { getAuthedUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const user = await getAuthedUser(request)
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getSupabaseServiceClient()

  // Fetch orders for this user, newest first.
  // Excludes internal fields (stripe_payment_intent_id, customer_id) not needed by the client.
  const { data: orders, error } = await supabase
    .from('orders')
    .select('id, status, subtotal, shipping, tax, total, line_items, shipping_address, created_at')
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[GET /api/orders]', error)
    return Response.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }

  return Response.json(orders ?? [])
}
