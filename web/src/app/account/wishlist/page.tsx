'use client'

import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/lib/supabase'
import { WishlistItem } from '@/lib/types'
import { WishlistGrid } from '@/components/account/WishlistGrid'

export default function AccountWishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const supabase = getSupabaseClient()

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (cancelled) return

      if (!session?.access_token) {
        setLoading(false)
        return
      }

      setToken(session.access_token)

      try {
        const res = await fetch('/api/wishlist', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })

        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const data = await res.json()
        if (!cancelled) setItems(data)
      } catch {
        if (!cancelled) setError('Could not load your wishlist. Please try again later.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  async function handleRemove(productSlug: string) {
    if (!token) return

    const res = await fetch(`/api/wishlist/${encodeURIComponent(productSlug)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })

    if (res.ok || res.status === 204) {
      setItems((prev) => prev.filter((item) => item.productSlug !== productSlug))
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="font-display text-display-lg text-umber">Wishlist</h1>

      {loading && (
        <div
          className="h-8 w-8 rounded-full border-2 border-terracotta border-t-transparent animate-spin"
          role="status"
          aria-label="Loading wishlist"
        />
      )}

      {!loading && error && (
        <p className="font-body text-body text-terracotta">{error}</p>
      )}

      {!loading && !error && (
        <WishlistGrid items={items} onRemove={handleRemove} />
      )}
    </div>
  )
}
