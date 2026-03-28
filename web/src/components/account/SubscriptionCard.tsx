'use client'

import { useState } from 'react'
import { Subscription } from '@/lib/types'
import { SUBSCRIPTION_FREQUENCIES } from '@/lib/constants'
import { Button } from '@/components/ui/Button'

type Props = {
  subscription: Subscription
  onUpdate: (id: string, changes: Partial<Subscription>) => Promise<void>
  onCancel: (id: string) => Promise<void>
}

const STATUS_STYLES: Record<Subscription['status'], string> = {
  active: 'bg-sage/20 text-sage',
  paused: 'bg-amber/20 text-amber-800',
  cancelled: 'bg-terracotta/20 text-terracotta',
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function SubscriptionCard({ subscription, onUpdate, onCancel }: Props) {
  const [confirmingCancel, setConfirmingCancel] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const isPaused = subscription.status === 'paused'
  const isCancelled = subscription.status === 'cancelled'

  async function handleFrequencyChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const frequency = e.target.value as Subscription['frequency']
    setActionLoading(true)
    try {
      await onUpdate(subscription.id, { frequency })
    } finally {
      setActionLoading(false)
    }
  }

  async function handlePauseResume() {
    setActionLoading(true)
    try {
      await onUpdate(subscription.id, { status: isPaused ? 'active' : 'paused' })
    } finally {
      setActionLoading(false)
    }
  }

  async function handleCancel() {
    setActionLoading(true)
    try {
      await onCancel(subscription.id)
      setConfirmingCancel(false)
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="border border-umber/10 bg-linen p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="font-display text-display-sm text-umber">
            {subscription.productName ?? subscription.productSlug}
          </h2>
          {!isCancelled && (
            <p className="font-body text-sm text-taupe">
              Next billing: {formatDate(subscription.nextBillingDate)}
            </p>
          )}
        </div>
        <span
          className={`shrink-0 inline-block rounded-full px-3 py-0.5 font-body text-xs font-medium capitalize ${STATUS_STYLES[subscription.status]}`}
        >
          {subscription.status}
        </span>
      </div>

      {/* Frequency selector — only for active/paused subscriptions */}
      {!isCancelled && (
        <div className="flex items-center gap-3">
          <label
            htmlFor={`freq-${subscription.id}`}
            className="label-text whitespace-nowrap"
          >
            Frequency
          </label>
          <select
            id={`freq-${subscription.id}`}
            value={subscription.frequency}
            onChange={handleFrequencyChange}
            disabled={actionLoading}
            className="bg-transparent border-0 border-b border-umber/20 font-body text-sm text-umber py-1 focus:border-terracotta focus:outline-none transition-colors duration-200 disabled:opacity-50"
          >
            {SUBSCRIPTION_FREQUENCIES.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Action buttons */}
      {!isCancelled && (
        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={handlePauseResume}
            disabled={actionLoading}
          >
            {isPaused ? 'Resume' : 'Pause'}
          </Button>

          {!confirmingCancel ? (
            <Button
              type="button"
              variant="text"
              onClick={() => setConfirmingCancel(true)}
              disabled={actionLoading}
              className="text-terracotta"
            >
              Cancel subscription
            </Button>
          ) : (
            <div className="flex items-center gap-3">
              <span className="font-body text-sm text-umber">Are you sure?</span>
              <Button
                type="button"
                variant="text"
                onClick={handleCancel}
                disabled={actionLoading}
                className="text-terracotta"
              >
                {actionLoading ? 'Cancelling…' : 'Yes, cancel'}
              </Button>
              <Button
                type="button"
                variant="text"
                onClick={() => setConfirmingCancel(false)}
                disabled={actionLoading}
              >
                Keep it
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
