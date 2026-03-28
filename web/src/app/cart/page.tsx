'use client'

import type { Metadata } from 'next'
import Link from 'next/link'
import { CartLineItem } from '@/components/cart/CartLineItem'
import { CartSummary } from '@/components/cart/CartSummary'
import { Button } from '@/components/ui/Button'
import { useCart } from '@/lib/cart'

// Metadata cannot be exported from a 'use client' file in Next.js App Router.
// The page title is set via the title tag in the layout metadata template.
// If a static metadata export is needed, split into a server wrapper + client component.

export default function CartPage() {
  const { cart, removeItem, updateQuantity } = useCart()
  const hasItems = cart.items.length > 0

  return (
    <div className="container-content section-padding">
      <h1 className="font-display text-display-md text-umber mb-8">Your cart</h1>

      {hasItems ? (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">
          {/* Line items */}
          <div>
            <div className="divide-y divide-umber/10">
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

            <div className="mt-6">
              <Link
                href="/shop"
                className="font-body text-body-sm text-taupe underline decoration-taupe/40 hover:text-umber hover:decoration-umber transition-colors"
              >
                Continue shopping
              </Link>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:sticky lg:top-8">
            <CartSummary />
          </div>
        </div>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-6">
          <p className="font-body text-body-lg text-taupe">Your cart is empty</p>
          <Button href="/shop">Continue shopping</Button>
        </div>
      )}
    </div>
  )
}
