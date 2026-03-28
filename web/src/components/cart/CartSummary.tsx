'use client'

import { Button } from '@/components/ui/Button'
import { useCart } from '@/lib/cart'
import { FREE_SHIPPING_THRESHOLD } from '@/lib/constants'

export function CartSummary() {
  const { cart } = useCart()
  const qualifiesForFreeShipping = cart.subtotal >= FREE_SHIPPING_THRESHOLD

  return (
    <div className="bg-stone/40 p-6 space-y-4">
      <h2 className="font-display text-display-sm text-umber">Order summary</h2>

      {/* Line items */}
      <div className="space-y-2 border-b border-umber/10 pb-4">
        <div className="flex justify-between font-body text-body text-umber">
          <span>Subtotal</span>
          <span className="tabular-nums">${cart.subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between font-body text-body-sm text-taupe">
          <span>Shipping</span>
          <span>
            {qualifiesForFreeShipping ? (
              <span className="text-sage font-medium">Free</span>
            ) : (
              'Calculated at checkout'
            )}
          </span>
        </div>

        <div className="flex justify-between font-body text-body-sm text-taupe">
          <span>Tax</span>
          <span>Calculated at checkout</span>
        </div>
      </div>

      {/* Total estimate */}
      <div className="flex justify-between font-body font-medium text-umber"
        style={{ fontSize: 'var(--font-size-price)' }}>
        <span>Estimated total</span>
        <span className="tabular-nums">${cart.subtotal.toFixed(2)}</span>
      </div>

      {!qualifiesForFreeShipping && (
        <p className="font-body text-taupe"
          style={{ fontSize: 'var(--font-size-body-sm)' }}>
          Add ${(FREE_SHIPPING_THRESHOLD - cart.subtotal).toFixed(2)} more for free shipping
        </p>
      )}

      {/* CTA */}
      <Button href="/checkout" fullWidth>
        Proceed to checkout
      </Button>
    </div>
  )
}
