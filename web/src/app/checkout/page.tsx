'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useCart } from '@/lib/cart'
import { formatSubscriptionLabel } from '@/lib/constants'
import type { ShippingAddress } from '@/lib/types'

// ── Types ──────────────────────────────────────────────────────────────────

type FormState = {
  email: string
  name: string
  line1: string
  line2: string
  city: string
  state: string
  postalCode: string
  country: string
}

type FormErrors = Partial<Record<keyof FormState, string>>

const EMPTY_FORM: FormState = {
  email: '',
  name: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'US',
}

// ── Validation ─────────────────────────────────────────────────────────────

function validateForm(values: FormState): FormErrors {
  const errors: FormErrors = {}
  if (!values.email) errors.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    errors.email = 'Please enter a valid email address'
  if (!values.name) errors.name = 'Full name is required'
  if (!values.line1) errors.line1 = 'Street address is required'
  if (!values.city) errors.city = 'City is required'
  if (!values.state) errors.state = 'State / province is required'
  if (!values.postalCode) errors.postalCode = 'Postal code is required'
  if (!values.country) errors.country = 'Country is required'
  return errors
}

// ── Component ──────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, itemCount } = useCart()
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  // Track whether the cart has completed its localStorage hydration so we
  // don't redirect a customer with items before the first render settles.
  const hydrated = useRef(false)

  // On the first render itemCount is always 0 (cart starts as emptyCart() and
  // hydrates from localStorage inside a separate useEffect in CartProvider).
  // We mark hydrated on the second time this effect fires, which is when the
  // cart context has been populated from storage.
  useEffect(() => {
    if (!hydrated.current) {
      hydrated.current = true
      return
    }
    if (itemCount === 0) {
      router.replace('/shop')
    }
  }, [itemCount, router])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    // Clear field-level error on change
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setServerError(null)

    const validationErrors = validateForm(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setSubmitting(true)

    const shippingAddress: ShippingAddress = {
      name: form.name,
      line1: form.line1,
      line2: form.line2 || undefined,
      city: form.city,
      state: form.state,
      postalCode: form.postalCode,
      country: form.country,
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.items,
          shippingAddress,
          customerEmail: form.email,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setServerError(data.error ?? 'Something went wrong. Please try again.')
        return
      }

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url
      }
    } catch {
      setServerError('Network error. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Don't render if cart is empty (redirect is in progress)
  if (itemCount === 0) return null

  return (
    <div className="container-content section-padding">
      <h1 className="font-display text-display-md text-umber mb-10">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
        {/* Shipping form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-8">
          {/* Contact */}
          <fieldset className="space-y-4">
            <legend className="label-text mb-4 block">Contact information</legend>
            <Input
              label="Email address"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              error={errors.email}
              placeholder="you@example.com"
            />
          </fieldset>

          {/* Shipping address */}
          <fieldset className="space-y-4">
            <legend className="label-text mb-4 block">Shipping address</legend>

            <Input
              label="Full name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
              error={errors.name}
              placeholder="Jane Smith"
            />

            <Input
              label="Street address"
              type="text"
              name="line1"
              value={form.line1}
              onChange={handleChange}
              autoComplete="address-line1"
              error={errors.line1}
              placeholder="123 Main St"
            />

            <Input
              label="Apartment, suite, etc. (optional)"
              type="text"
              name="line2"
              value={form.line2}
              onChange={handleChange}
              autoComplete="address-line2"
              placeholder="Apt 4B"
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City"
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                autoComplete="address-level2"
                error={errors.city}
                placeholder="New York"
              />
              <Input
                label="State / Province"
                type="text"
                name="state"
                value={form.state}
                onChange={handleChange}
                autoComplete="address-level1"
                error={errors.state}
                placeholder="NY"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Postal code"
                type="text"
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                autoComplete="postal-code"
                error={errors.postalCode}
                placeholder="10001"
              />
              <Input
                label="Country"
                type="text"
                name="country"
                value={form.country}
                onChange={handleChange}
                autoComplete="country"
                error={errors.country}
                placeholder="US"
              />
            </div>
          </fieldset>

          {/* Server error */}
          {serverError && (
            <p className="font-body text-body-sm text-terracotta" role="alert">
              {serverError}
            </p>
          )}

          <Button type="submit" fullWidth disabled={submitting}>
            {submitting ? 'Redirecting to payment…' : 'Pay with Stripe'}
          </Button>
        </form>

        {/* Order summary */}
        <div className="bg-stone/40 p-6 space-y-4 lg:sticky lg:top-8">
          <h2 className="font-display text-display-sm text-umber">Order summary</h2>

          <div className="space-y-3 border-b border-umber/10 pb-4">
            {cart.items.map((item) => (
              <div
                key={`${item.productSlug}-${item.subscription?.frequency ?? 'onetime'}`}
                className="flex justify-between gap-4"
              >
                <div className="min-w-0">
                  <span className="font-body text-body-sm text-umber truncate block">
                    {item.productName}
                  </span>
                  {item.subscription && (
                    <span className="font-body text-taupe block"
                      style={{ fontSize: 'var(--font-size-label)' }}>
                      {formatSubscriptionLabel(item.subscription.frequency)}
                    </span>
                  )}
                  <span className="font-body text-taupe"
                    style={{ fontSize: 'var(--font-size-label)' }}>
                    Qty {item.quantity}
                  </span>
                </div>
                <span className="font-body text-body-sm text-umber tabular-nums shrink-0">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between font-body font-medium text-umber"
            style={{ fontSize: 'var(--font-size-price)' }}>
            <span>Subtotal</span>
            <span className="tabular-nums">${cart.subtotal.toFixed(2)}</span>
          </div>
          <p className="font-body text-taupe" style={{ fontSize: 'var(--font-size-body-sm)' }}>
            Shipping and taxes calculated at checkout
          </p>
        </div>
      </div>
    </div>
  )
}

