import type { Metadata } from 'next'
import { sanityFetch } from '@/lib/sanity'
import { PAGE_BY_SLUG_QUERY } from '@/sanity/lib/queries'
import { Page } from '@/lib/types'
import { PortableTextRenderer } from '@/components/content/PortableText'

export const metadata: Metadata = {
  title: 'Terms of Service | Hand of Yah',
  description: 'Terms and conditions governing use of the Hand of Yah website and services.',
}

export default async function TermsPage() {
  const page = await sanityFetch<Page | null>(PAGE_BY_SLUG_QUERY, { slug: 'terms' })

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto py-16 lg:py-20">
      <h1 className="font-display text-display-lg text-umber mb-8 leading-tight">
        {page?.title ?? 'Terms of Service'}
      </h1>

      {page?.body && page.body.length > 0 ? (
        <PortableTextRenderer value={page.body} />
      ) : (
        <div className="space-y-6">
          <p className="font-body text-body text-umber/85 leading-relaxed">
            Our Terms of Service are being finalized. By using this website you agree to
            our terms, which will be published here in full shortly.
          </p>
          <p className="font-body text-body text-umber/85 leading-relaxed">
            For questions, please{' '}
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
