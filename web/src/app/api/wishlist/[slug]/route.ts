import { NextRequest } from 'next/server'
import { getSupabaseServiceClient } from '@/lib/supabase-server'
import { getAuthedUser } from '@/lib/auth'

// DELETE /api/wishlist/[slug] — remove a product from the wishlist
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const user = await getAuthedUser(request)
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { slug } = await params
  const supabase = getSupabaseServiceClient()

  const { error } = await supabase
    .from('wishlists')
    .delete()
    .eq('customer_id', user.id)
    .eq('product_slug', slug)

  if (error) {
    console.error('[DELETE /api/wishlist/[slug]]', error)
    return Response.json({ error: 'Failed to remove from wishlist' }, { status: 500 })
  }

  return new Response(null, { status: 204 })
}
