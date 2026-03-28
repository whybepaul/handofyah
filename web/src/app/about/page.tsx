import type { Metadata } from 'next'
import { sanityFetch } from '@/lib/sanity'
import { PAGE_BY_SLUG_QUERY } from '@/sanity/lib/queries'
import { Page } from '@/lib/types'
import { PortableTextRenderer } from '@/components/content/PortableText'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

export const metadata: Metadata = {
  title: 'About | Hand of Yah',
  description:
    'Premium artisanal skincare crafted with intention, rooted in nature. Learn the story behind Hand of Yah.',
}

// Hardcoded fallback content derived from brand-identity.md brand voice section
const FALLBACK_PARAGRAPHS = [
  `Hand of Yah was born from a simple but profound belief: that the most powerful skincare is the kind that works with your body, not against it. We source ingredients from the earth — plants, oils, and botanicals with centuries of use behind them — and combine them with modern formulation science to create products that deliver results you can feel.`,
  `Every formula we create begins with a question: what does the skin actually need? Not what trends say it needs, not what lab-generated compounds can approximate, but what nature has always provided. Our answer is rooted in transparency, quality, and respect for the body's own intelligence.`,
  `We believe skincare is self-care — a daily ritual that deserves the same intention you bring to what you eat, how you move, and who you spend time with. Hand of Yah is here to make that ritual meaningful.`,
]

export default async function AboutPage() {
  let page: Page | null = null
  try {
    page = await sanityFetch<Page | null>(PAGE_BY_SLUG_QUERY, { slug: 'about' })
  } catch {
    // Sanity unavailable — render hardcoded fallback content
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto py-16 lg:py-20">
      <ScrollReveal delay={0}>
        <h1 className="font-display text-display-lg text-umber mb-8 leading-tight">
          {page?.title ?? 'Crafted with intention, rooted in nature'}
        </h1>
      </ScrollReveal>

      <ScrollReveal delay={80}>
        {page?.body && page.body.length > 0 ? (
          <PortableTextRenderer value={page.body} />
        ) : (
          <div className="space-y-6">
            {FALLBACK_PARAGRAPHS.map((paragraph, i) => (
              <p key={i} className="font-body text-body text-umber/85 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </ScrollReveal>
    </div>
  )
}
