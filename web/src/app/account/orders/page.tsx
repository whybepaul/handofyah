'use client'

import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/lib/supabase'
import { Order } from '@/lib/types'
import { OrderList } from '@/components/account/OrderList'

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    const supabase = getSupabaseClient()

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (cancelled) return

      if (!session?.access_token) {
        setLoading(false)
        return
      }

      try {
        const res = await fetch('/api/orders', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })

        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const data = await res.json()
        if (!cancelled) setOrders(data)
      } catch {
        if (!cancelled) setError('Could not load your orders. Please try again later.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="space-y-8">
      <h1 className="font-display text-display-lg text-umber">Order history</h1>

      {loading && (
        <div
          className="h-8 w-8 rounded-full border-2 border-terracotta border-t-transparent animate-spin"
          role="status"
          aria-label="Loading orders"
        />
      )}

      {!loading && error && (
        <p className="font-body text-body text-terracotta">{error}</p>
      )}

      {!loading && !error && <OrderList orders={orders} />}
    </div>
  )
}
