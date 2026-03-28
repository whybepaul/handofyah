'use client'

import { useState } from 'react'
import { Product } from '@/lib/types'
import { SubscriptionToggle, SubscriptionSelection } from '@/components/product/SubscriptionToggle'
import { AddToCart } from '@/components/product/AddToCart'

type PDPInteractivePanelProps = {
  product: Product
}

/**
 * Client component that manages shared state between SubscriptionToggle and
 * AddToCart on the Product Detail Page. The parent page is a Server Component,
 * so this thin wrapper handles the client boundary.
 */
export function PDPInteractivePanel({ product }: PDPInteractivePanelProps) {
  const [selection, setSelection] = useState<SubscriptionSelection>({ type: 'one-time' })

  return (
    <div className="space-y-4">
      {product.subscriptionEligible && (
        <SubscriptionToggle
          price={product.price}
          onSelectionChange={setSelection}
        />
      )}
      <AddToCart product={product} selection={selection} />
    </div>
  )
}
