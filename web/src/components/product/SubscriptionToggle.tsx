'use client'

import { useState } from 'react'
import { SUBSCRIPTION_FREQUENCIES, SUBSCRIPTION_DISCOUNT } from '@/lib/constants'

export type SubscriptionSelection =
  | { type: 'one-time' }
  | { type: 'subscription'; frequency: string }

type SubscriptionToggleProps = {
  price: number
  onSelectionChange: (selection: SubscriptionSelection) => void
}

export function SubscriptionToggle({ price, onSelectionChange }: SubscriptionToggleProps) {
  const [selected, setSelected] = useState<'one-time' | 'subscription'>('one-time')
  const [frequency, setFrequency] = useState<string>(SUBSCRIPTION_FREQUENCIES[0].value)

  const discountedPrice = price * (1 - SUBSCRIPTION_DISCOUNT)

  function handleTypeChange(type: 'one-time' | 'subscription') {
    setSelected(type)
    if (type === 'one-time') {
      onSelectionChange({ type: 'one-time' })
    } else {
      onSelectionChange({ type: 'subscription', frequency })
    }
  }

  function handleFrequencyChange(value: string) {
    setFrequency(value)
    onSelectionChange({ type: 'subscription', frequency: value })
  }

  return (
    <div className="space-y-3">
      {/* One-time option */}
      <label
        className={[
          'flex items-center gap-3 cursor-pointer border p-4 transition-colors duration-200',
          selected === 'one-time'
            ? 'border-umber bg-stone'
            : 'border-taupe/50 hover:border-taupe',
        ].join(' ')}
      >
        {/* Custom radio button */}
        <span
          className={[
            'flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors duration-200',
            selected === 'one-time' ? 'border-terracotta' : 'border-taupe',
          ].join(' ')}
        >
          {selected === 'one-time' && (
            <span className="w-2 h-2 rounded-full bg-terracotta" />
          )}
        </span>

        <input
          type="radio"
          name="purchase-type"
          value="one-time"
          checked={selected === 'one-time'}
          onChange={() => handleTypeChange('one-time')}
          className="sr-only"
        />

        <span className="font-body text-body text-umber font-medium">One-time purchase</span>

        <span
          className="ml-auto font-display text-umber"
          style={{
            fontSize: 'var(--font-size-price)',
            lineHeight: 'var(--font-size-price--line-height)',
            letterSpacing: 'var(--font-size-price--letter-spacing)',
          }}
        >
          ${price.toFixed(2)}
        </span>
      </label>

      {/* Subscribe option */}
      <label
        className={[
          'flex items-start gap-3 cursor-pointer border p-4 transition-colors duration-200',
          selected === 'subscription'
            ? 'border-umber bg-stone'
            : 'border-taupe/50 hover:border-taupe',
        ].join(' ')}
      >
        {/* Custom radio button */}
        <span
          className={[
            'flex-shrink-0 w-4 h-4 mt-0.5 rounded-full border-2 flex items-center justify-center transition-colors duration-200',
            selected === 'subscription' ? 'border-terracotta' : 'border-taupe',
          ].join(' ')}
        >
          {selected === 'subscription' && (
            <span className="w-2 h-2 rounded-full bg-terracotta" />
          )}
        </span>

        <input
          type="radio"
          name="purchase-type"
          value="subscription"
          checked={selected === 'subscription'}
          onChange={() => handleTypeChange('subscription')}
          className="sr-only"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-body text-body text-umber font-medium">Subscribe</span>
            {/* Sage "Save 10%" badge */}
            <span className="inline-flex items-center px-2 py-0.5 bg-sage/20 text-sage font-body font-semibold uppercase"
              style={{
                fontSize: 'var(--font-size-label)',
                letterSpacing: 'var(--font-size-label--letter-spacing)',
              }}
            >
              Save 10%
            </span>
          </div>

          {/* Frequency dropdown — visible when subscribe is selected */}
          {selected === 'subscription' && (
            <div className="mt-3">
              <select
                value={frequency}
                onChange={(e) => handleFrequencyChange(e.target.value)}
                className="w-full border-b border-umber bg-transparent font-body text-body text-umber pb-2 pr-6 focus:outline-none focus:border-terracotta transition-colors duration-200 cursor-pointer appearance-none"
                aria-label="Subscription frequency"
              >
                {SUBSCRIPTION_FREQUENCIES.map((freq) => (
                  <option key={freq.value} value={freq.value}>
                    {freq.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <span
          className="ml-auto flex-shrink-0 font-display text-terracotta"
          style={{
            fontSize: 'var(--font-size-price)',
            lineHeight: 'var(--font-size-price--line-height)',
            letterSpacing: 'var(--font-size-price--letter-spacing)',
          }}
        >
          ${discountedPrice.toFixed(2)}
        </span>
      </label>
    </div>
  )
}
