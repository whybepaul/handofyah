'use client'

import type { CartItem } from '@/lib/types'
import { formatSubscriptionLabel } from '@/lib/constants'

type CartLineItemProps = {
  item: CartItem
  onRemove: () => void
  onUpdateQuantity: (quantity: number) => void
}

export function CartLineItem({ item, onRemove, onUpdateQuantity }: CartLineItemProps) {
  const lineTotal = (item.price * item.quantity).toFixed(2)

  return (
    <div className="flex gap-4 py-4 border-b border-umber/10 last:border-0">
      {/* Text content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-body text-body text-umber font-medium leading-snug truncate">
              {item.productName}
            </p>
            {item.subscription && (
              <span className="inline-block mt-1 px-2 py-0.5 bg-sage/20 text-sage font-body rounded-sm"
                style={{ fontSize: 'var(--font-size-label)', letterSpacing: 'var(--font-size-label--letter-spacing)' }}>
                {formatSubscriptionLabel(item.subscription.frequency)}
              </span>
            )}
          </div>

          {/* Remove button */}
          <button
            onClick={onRemove}
            aria-label={`Remove ${item.productName}`}
            className="text-taupe hover:text-terracotta transition-colors shrink-0 mt-0.5"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Quantity + price row */}
        <div className="flex items-center justify-between mt-3">
          {/* Quantity controls */}
          <div className="flex items-center border border-umber/20 rounded-sm">
            <button
              onClick={() => onUpdateQuantity(item.quantity - 1)}
              aria-label="Decrease quantity"
              className="px-2.5 py-1 text-umber hover:text-terracotta transition-colors font-body"
              style={{ fontSize: 'var(--font-size-body)' }}
            >
              −
            </button>
            <span
              className="px-3 py-1 font-body text-umber border-x border-umber/20 tabular-nums"
              style={{ fontSize: 'var(--font-size-body-sm)' }}
            >
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.quantity + 1)}
              aria-label="Increase quantity"
              className="px-2.5 py-1 text-umber hover:text-terracotta transition-colors font-body"
              style={{ fontSize: 'var(--font-size-body)' }}
            >
              +
            </button>
          </div>

          {/* Line total */}
          <span className="font-body text-umber tabular-nums"
            style={{ fontSize: 'var(--font-size-price)' }}>
            ${lineTotal}
          </span>
        </div>
      </div>
    </div>
  )
}

