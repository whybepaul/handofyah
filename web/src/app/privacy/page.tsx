import type { Metadata } from 'next'
import { sanityFetch } from '@/lib/sanity'
import { PAGE_BY_SLUG_QUERY } from '@/sanity/lib/queries'
import { Page } from '@/lib/types'
import { PortableTextRenderer } from '@/components/content/PortableText'

export const metadata: Metadata = {
  title: 'Privacy Policy | Hand of Yah',
  description: 'How Hand of Yah collects, uses, and protects your personal data.',
}

export default async function PrivacyPage() {
  const page = await sanityFetch<Page | null>(PAGE_BY_SLUG_QUERY, { slug: 'privacy' })

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto py-16 lg:py-20">
      <h1 className="font-display text-display-lg text-umber mb-8 leading-tight">
        {page?.title ?? 'Privacy Policy'}
      </h1>

      {page?.body && page.body.length > 0 ? (
        <PortableTextRenderer value={page.body} />
      ) : (
        <div className="space-y-6">
          <p className="font-body text-body text-umber/85 leading-relaxed">
            Our Privacy Policy is being finalized. We are committed to protecting your personal
            information and will publish our complete policy here shortly.
          </p>
          <p className="font-body text-body text-umber/85 leading-relaxed">
            We do not sell your personal data. For questions about your data, please{' '}
            <a href="/contact" className="text-terracotta underline decoration-terracotta/30 hover:decoration-terracotta transition-colors">
              contact us
            </a>
            .
          </p>
        </div>
      )}
    </div>
  )
}
