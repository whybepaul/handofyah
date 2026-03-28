import type { Metadata } from 'next'
import { sanityFetch } from '@/lib/sanity'
import { PAGE_BY_SLUG_QUERY } from '@/sanity/lib/queries'
import { Page } from '@/lib/types'
import { PortableTextRenderer } from '@/components/content/PortableText'

export const metadata: Metadata = {
  title: 'Shipping & Returns | Hand of Yah',
  description: 'Shipping timelines, return policy, and how to start a return with Hand of Yah.',
}

export default async function ShippingReturnsPage() {
  const page = await sanityFetch<Page | null>(PAGE_BY_SLUG_QUERY, { slug: 'shipping-returns' })

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto py-16 lg:py-20">
      <h1 className="font-display text-display-lg text-umber mb-8 leading-tight">
        {page?.title ?? 'Shipping & Returns'}
      </h1>

      {page?.body && page.body.length > 0 ? (
        <PortableTextRenderer value={page.body} />
      ) : (
        <div className="space-y-6">
          <p className="font-body text-body text-umber/85 leading-relaxed">
            Our detailed shipping and returns policy is being updated. Please check back shortly,
            or{' '}
            <a href="/contact" className="text-terracotta underline decoration-terracotta/30 hover:decoration-terracotta transition-colors">
              contact us
            </a>{' '}
            with any questions.
          </p>
          <p className="font-body text-body text-umber/85 leading-relaxed">
            Standard shipping: 5–7 business days. Free on orders over $75.
            Returns accepted within 30 days on unopened products.
          </p>
        </div>
      )}
    </div>
  )
}
