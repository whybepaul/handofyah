import { NextRequest } from 'next/server'
import { getSupabaseServiceClient } from '@/lib/supabase-server'
import { getAuthedUser } from '@/lib/auth'

// GET /api/wishlist — list all wishlist items for the authenticated user
export async function GET(request: NextRequest) {
  const user = await getAuthedUser(request)
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getSupabaseServiceClient()

  const { data, error } = await supabase
    .from('wishlists')
    .select('id, product_slug, created_at')
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[GET /api/wishlist]', error)
    return Response.json({ error: 'Failed to fetch wishlist' }, { status: 500 })
  }

  return Response.json(data ?? [])
}

// POST /api/wishlist — add a product to the wishlist
export async function POST(request: NextRequest) {
  const user = await getAuthedUser(request)
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const { productSlug } = body

  if (!productSlug || typeof productSlug !== 'string') {
    return Response.json({ error: 'productSlug is required' }, { status: 400 })
  }

  const supabase = getSupabaseServiceClient()

  // Upsert to avoid duplicate entries for the same product
  const { data, error } = await supabase
    .from('wishlists')
    .upsert(
      { customer_id: user.id, product_slug: productSlug },
      { onConflict: 'customer_id,product_slug' }
    )
    .select()
    .single()

  if (error) {
    console.error('[POST /api/wishlist]', error)
    return Response.json({ error: 'Failed to add to wishlist' }, { status: 500 })
  }

  return Response.json(data, { status: 201 })
}
