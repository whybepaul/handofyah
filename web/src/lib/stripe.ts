import Stripe from 'stripe'

/**
 * Factory that creates a Stripe client on demand, so module evaluation at
 * build time does not throw when STRIPE_SECRET_KEY is absent. Route handlers
 * that call getStripe() will only run at request time in production.
 */
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error('Missing STRIPE_SECRET_KEY environment variable')
  }
  return new Stripe(key, {
    // Using the API version bundled with stripe v21; update when upgrading.
    apiVersion: '2026-03-25.dahlia',
    typescript: true,
  })
}

/**
 * Convenience proxy for callers that use `stripe.someMethod(...)`. Defers
 * Stripe construction until a property is accessed, preventing build-time
 * failures when STRIPE_SECRET_KEY is not set.
 */
export const stripe: Stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return getStripe()[prop as keyof Stripe]
  },
})
