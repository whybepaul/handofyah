'use client'

import { useState } from 'react'
import { Product } from '@/lib/types'
import { SubscriptionSelection } from './SubscriptionToggle'
import { useCart } from '@/lib/cart'
import { SUBSCRIPTION_DISCOUNT } from '@/lib/constants'

type AddToCartProps = {
  product: Pick<Product, '_id' | 'name' | 'slug' | 'price' | 'images'>
  selection: SubscriptionSelection
}

export function AddToCart({ product, selection }: AddToCartProps) {
  const [isAdding, setIsAdding] = useState(false)
  const { addItem } = useCart()

  function handleAddToCart() {
    if (isAdding) return
    setIsAdding(true)

    addItem({
      productSlug: product.slug.current,
      productName: product.name,
      price:
        selection.type === 'subscription'
          ? product.price * (1 - SUBSCRIPTION_DISCOUNT)
          : product.price,
      quantity: 1,
      image: product.images?.[0],
      subscription:
        selection.type === 'subscription'
          ? { frequency: selection.frequency as 'monthly' | 'bimonthly' | 'quarterly' }
          : undefined,
    })

    // Show brief "Added" confirmation state, then reset
    setTimeout(() => setIsAdding(false), 1000)
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding}
      className={[
        'btn-primary w-full text-center',
        isAdding ? 'opacity-60 cursor-not-allowed' : '',
      ].join(' ')}
      aria-label={isAdding ? 'Added to cart' : 'Add to cart'}
    >
      {isAdding ? 'Added!' : 'Add to cart'}
    </button>
  )
}
