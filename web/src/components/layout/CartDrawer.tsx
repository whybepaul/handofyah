'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { CartLineItem } from '@/components/cart/CartLineItem'
import { useCart } from '@/lib/cart'
import { FREE_SHIPPING_THRESHOLD } from '@/lib/constants'

type CartDrawerProps = {
  open: boolean
  onClose: () => void
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { cart, removeItem, updateQuantity } = useCart()
  const hasItems = cart.items.length > 0

  useEffect(() => {
    if (!open) return
    // Only lock if not already locked by another overlay
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  const shippingNote =
    cart.subtotal >= FREE_SHIPPING_THRESHOLD
      ? 'Free shipping'
      : `Free shipping over $${FREE_SHIPPING_THRESHOLD}`

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-espresso/50 z-50 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-[400px] max-w-full bg-parchment z-50 flex flex-col transform transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-umber/10">
          <h2 className="font-display text-display-sm text-umber">Your cart</h2>
          <button onClick={onClose} aria-label="Close cart" className="text-umber p-1">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        {hasItems ? (
          <>
            {/* Line items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {cart.items.map((item) => (
                <CartLineItem
                  key={`${item.productSlug}-${item.subscription?.frequency ?? 'onetime'}`}
                  item={item}
                  onRemove={() => removeItem(item.productSlug, item.subscription?.frequency)}
                  onUpdateQuantity={(qty) =>
                    updateQuantity(item.productSlug, qty, item.subscription?.frequency)
                  }
                />
              ))}
            </div>

            {/* Summary footer */}
            <div className="px-6 py-5 border-t border-umber/10 space-y-3">
              <div className="flex justify-between font-body text-body text-umber">
                <span>Subtotal</span>
                <span>${cart.subtotal.toFixed(2)}</span>
              </div>
              <p className="font-body text-body-sm text-taupe">{shippingNote}</p>
              <Button href="/checkout" fullWidth onClick={onClose}>
                Checkout
              </Button>
              <Link
                href="/cart"
                onClick={onClose}
                className="block text-center font-body text-body-sm text-umber underline decoration-umber/30 hover:decoration-umber transition-colors"
              >
                View full cart
              </Link>
            </div>
          </>
        ) : (
          <>
            {/* Empty state */}
            <div className="flex-1 flex flex-col items-center justify-center px-6">
              <p className="font-body text-body text-taupe mb-6">Your cart is empty</p>
              <Button href="/shop" onClick={onClose}>
                Continue shopping
              </Button>
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-umber/10">
              <Link
                href="/cart"
                onClick={onClose}
                className="block text-center font-body text-body-sm text-umber underline decoration-umber/30 hover:decoration-umber transition-colors"
              >
                View full cart
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  )
}
