'use client'

import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/lib/supabase'
import { Subscription } from '@/lib/types'
import { SubscriptionCard } from '@/components/account/SubscriptionCard'

export default function AccountSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [mutationError, setMutationError] = useState<string | null>(null)
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
        const res = await fetch('/api/subscriptions', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })

        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const data = await res.json()
        if (!cancelled) setSubscriptions(data)
      } catch {
        if (!cancelled) setError('Could not load your subscriptions. Please try again later.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  async function handleUpdate(id: string, changes: Partial<Subscription>) {
    if (!token) return

    try {
      setMutationError(null)
      const res = await fetch(`/api/subscriptions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(changes),
      })

      if (!res.ok) throw new Error('Failed to update subscription')

      const updated: Subscription = await res.json()
      setSubscriptions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...updated } : s))
      )
    } catch (err) {
      setMutationError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  async function handleCancel(id: string) {
    if (!token) return

    try {
      setMutationError(null)
      const res = await fetch(`/api/subscriptions/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) throw new Error('Failed to cancel subscription')

      const updated: Subscription = await res.json()
      setSubscriptions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...updated } : s))
      )
    } catch (err) {
      setMutationError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="font-display text-display-lg text-umber">Subscriptions</h1>

      {mutationError && (
        <p className="text-terracotta font-body text-body-sm mb-4">{mutationError}</p>
      )}

      {loading && (
        <div
          className="h-8 w-8 rounded-full border-2 border-terracotta border-t-transparent animate-spin"
          role="status"
          aria-label="Loading subscriptions"
        />
      )}

      {!loading && error && (
        <p className="font-body text-body text-terracotta">{error}</p>
      )}

      {!loading && !error && subscriptions.length === 0 && (
        <div className="py-16 text-center space-y-4">
          <p className="font-display text-display-sm text-taupe">No active subscriptions</p>
          <a
            href="/shop"
            className="btn-text text-terracotta underline underline-offset-2 hover:text-umber transition-colors"
          >
            Browse the shop
          </a>
        </div>
      )}

      {!loading && !error && subscriptions.length > 0 && (
        <div className="space-y-4">
          {subscriptions.map((sub) => (
            <SubscriptionCard
              key={sub.id}
              subscription={sub}
              onUpdate={handleUpdate}
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}
    </div>
  )
}
