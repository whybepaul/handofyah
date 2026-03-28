import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Order confirmed',
}

type SearchParams = Promise<{ session_id?: string }>

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { session_id } = await searchParams

  return (
    <div className="container-content section-padding">
      <div className="max-w-xl mx-auto text-center space-y-8 py-12">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-sage/20 flex items-center justify-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-sage"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h1 className="font-display text-display-md text-umber">
            Thank you for your order
          </h1>
          <p className="font-body text-body text-taupe">
            Your order has been confirmed. You will receive a confirmation email shortly.
          </p>
        </div>

        {/* Order reference */}
        {session_id && (
          <div className="bg-stone/40 px-6 py-4 rounded-sm text-left space-y-1">
            <p className="label-text">Order reference</p>
            <p
              className="font-body text-umber break-all"
              style={{ fontSize: 'var(--font-size-body-sm)' }}
            >
              {session_id}
            </p>
          </div>
        )}

        {/* What happens next */}
        <div className="text-left space-y-3">
          <h2 className="font-display text-display-sm text-umber">What happens next?</h2>
          <ul className="space-y-2 font-body text-body-sm text-taupe list-disc list-inside">
            <li>We will send a confirmation email with your order details.</li>
            <li>Your order will be carefully prepared and shipped within 2–3 business days.</li>
            <li>You will receive a tracking number once your order ships.</li>
          </ul>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button href="/shop">Continue shopping</Button>
          <Button href="/account/orders" variant="secondary">
            View your orders
          </Button>
        </div>

        {/* Support link */}
        <p className="font-body text-taupe" style={{ fontSize: 'var(--font-size-body-sm)' }}>
          Questions?{' '}
          <Link
            href="/contact"
            className="text-umber underline decoration-umber/30 hover:decoration-umber transition-colors"
          >
            Contact us
          </Link>
        </p>
      </div>
    </div>
  )
}
