import type { Metadata } from 'next'
import { sanityFetch } from '@/lib/sanity'
import { PAGE_BY_SLUG_QUERY } from '@/sanity/lib/queries'
import { Page } from '@/lib/types'
import { PortableTextRenderer } from '@/components/content/PortableText'
import { Accordion } from '@/components/ui/Accordion'

export const metadata: Metadata = {
  title: 'FAQ | Hand of Yah',
  description: 'Answers to common questions about shipping, returns, ingredients, and subscriptions.',
}

const HARDCODED_FAQ = [
  {
    title: 'How long does shipping take?',
    content:
      'Standard shipping takes 5–7 business days. Expedited shipping (2–3 business days) is available at checkout. All orders ship from our facility and you will receive a tracking number once your order is on its way.',
  },
  {
    title: 'What is your return policy?',
    content:
      'We accept returns within 30 days of delivery on unopened, unused products in original packaging. If you received a damaged or incorrect item, contact us and we will make it right — no return required.',
  },
  {
    title: 'Are your ingredients natural and safe?',
    content:
      'Yes. Every ingredient we use is listed transparently in our Ingredient Database. We avoid parabens, sulfates, synthetic fragrances, and other known irritants. Our formulas are dermatologist-reviewed and suitable for sensitive skin.',
  },
  {
    title: 'How do subscriptions work?',
    content:
      'Subscribe to any eligible product at checkout and save 10%. You choose your frequency — monthly, every 2 months, or quarterly. You can pause or cancel at any time from your account dashboard, with no fees or penalties.',
  },
  {
    title: 'Do you offer free shipping?',
    content:
      'Yes — orders over $75 qualify for free standard shipping automatically. No code required.',
  },
  {
    title: 'Are your products vegan and cruelty-free?',
    content:
      'All Hand of Yah products are cruelty-free. The majority of our formulas are vegan; any product containing beeswax or honey is labeled clearly on the product page.',
  },
]

export default async function FaqPage() {
  let page: Page | null = null
  try {
    page = await sanityFetch<Page | null>(PAGE_BY_SLUG_QUERY, { slug: 'faq' })
  } catch {
    // Sanity unavailable — render hardcoded FAQ accordion
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto py-16 lg:py-20">
      <h1 className="font-display text-display-lg text-umber mb-12 leading-tight">
        {page?.title ?? 'Frequently Asked Questions'}
      </h1>

      {page?.body && page.body.length > 0 ? (
        <PortableTextRenderer value={page.body} />
      ) : (
        <Accordion items={HARDCODED_FAQ} />
      )}
    </div>
  )
}
