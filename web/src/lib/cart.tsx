'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from 'react'
import type { CartItem, Cart } from './types'

// ── Types ──────────────────────────────────────────────────────────────────

type CartContextType = {
  cart: Cart
  addItem: (item: CartItem) => void
  removeItem: (productSlug: string, subscriptionFrequency?: string) => void
  updateQuantity: (productSlug: string, quantity: number, subscriptionFrequency?: string) => void
  clearCart: () => void
  itemCount: number
}

// ── Helpers ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'hand_of_yah_cart'
// Legacy key used before the storage key was standardised (keep for migration)
const LEGACY_STORAGE_KEY = 'handofyah_cart'

function emptyCart(): Cart {
  return { items: [], subtotal: 0, itemCount: 0 }
}

/**
 * Two cart items are considered the same when they share the same product slug
 * AND the same subscription configuration (or both are one-time purchases).
 */
function isSameItem(a: CartItem, b: CartItem): boolean {
  if (a.productSlug !== b.productSlug) return false
  // Both one-time
  if (!a.subscription && !b.subscription) return true
  // One subscription, one not
  if (!a.subscription || !b.subscription) return false
  return a.subscription.frequency === b.subscription.frequency
}

function computeTotals(items: CartItem[]): Pick<Cart, 'subtotal' | 'itemCount'> {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  return { subtotal, itemCount }
}

function loadFromStorage(): Cart {
  if (typeof window === 'undefined') return emptyCart()
  try {
    // Migrate cart data from the old storage key to the new one
    const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY)
    if (legacy && !window.localStorage.getItem(STORAGE_KEY)) {
      window.localStorage.setItem(STORAGE_KEY, legacy)
      window.localStorage.removeItem(LEGACY_STORAGE_KEY)
    }

    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyCart()
    const parsed = JSON.parse(raw) as Cart
    // Recompute totals from stored items to guard against stale values
    const { subtotal, itemCount } = computeTotals(parsed.items ?? [])
    return { items: parsed.items ?? [], subtotal, itemCount }
  } catch {
    return emptyCart()
  }
}

function saveToStorage(cart: Cart): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
  } catch {
    // Silently fail — storage might be unavailable (private mode quota)
  }
}

// ── Context ────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextType | null>(null)

// ── Provider ───────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>(emptyCart)
  // Tracks whether the provider has hydrated from localStorage.
  // Prevents saveToStorage from clobbering stored cart with empty state
  // during the initial render before hydration runs.
  const hasHydrated = useRef(false)

  // Hydrate from localStorage on first render (client only)
  useEffect(() => {
    setCart(loadFromStorage())
    hasHydrated.current = true
  }, [])

  // Persist on every change — only after hydration to avoid overwriting
  // a valid stored cart with the initial empty state
  useEffect(() => {
    if (hasHydrated.current) {
      saveToStorage(cart)
    }
  }, [cart])

  const addItem = useCallback((incoming: CartItem) => {
    setCart((prev) => {
      const existingIndex = prev.items.findIndex((i) => isSameItem(i, incoming))

      let nextItems: CartItem[]
      if (existingIndex !== -1) {
        // Increment quantity of the existing item
        nextItems = prev.items.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + incoming.quantity }
            : item
        )
      } else {
        nextItems = [...prev.items, incoming]
      }

      const { subtotal, itemCount } = computeTotals(nextItems)
      return { items: nextItems, subtotal, itemCount }
    })
  }, [])

  const removeItem = useCallback(
    (productSlug: string, subscriptionFrequency?: string) => {
      setCart((prev) => {
        const nextItems = prev.items.filter((item) => {
          if (item.productSlug !== productSlug) return true
          // Match by subscription frequency if provided
          if (subscriptionFrequency !== undefined) {
            return item.subscription?.frequency !== subscriptionFrequency
          }
          // No frequency specified — remove all variants of this slug
          return false
        })
        const { subtotal, itemCount } = computeTotals(nextItems)
        return { items: nextItems, subtotal, itemCount }
      })
    },
    []
  )

  const updateQuantity = useCallback(
    (productSlug: string, quantity: number, subscriptionFrequency?: string) => {
      if (quantity <= 0) {
        removeItem(productSlug, subscriptionFrequency)
        return
      }
      setCart((prev) => {
        const nextItems = prev.items.map((item) => {
          if (item.productSlug !== productSlug) return item
          const frequencyMatches =
            subscriptionFrequency !== undefined
              ? item.subscription?.frequency === subscriptionFrequency
              : !item.subscription
          return frequencyMatches ? { ...item, quantity } : item
        })
        const { subtotal, itemCount } = computeTotals(nextItems)
        return { items: nextItems, subtotal, itemCount }
      })
    },
    [removeItem]
  )

  const clearCart = useCallback(() => {
    setCart(emptyCart())
  }, [])

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount: cart.itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function useCart(): CartContextType {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used inside a <CartProvider>')
  }
  return ctx
}
