import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { sanityFetch } from '@/lib/sanity'
import { LEARN_ARTICLE_BY_SLUG_QUERY, ALL_LEARN_SLUGS_QUERY } from '@/sanity/lib/queries'
import { LearnArticle } from '@/lib/types'
import { PortableTextRenderer } from '@/components/content/PortableText'
import { ProductGrid } from '@/components/product/ProductGrid'
import { urlFor } from '@/lib/sanity-image'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await sanityFetch<string[]>(ALL_LEARN_SLUGS_QUERY)
  return (slugs ?? []).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await sanityFetch<LearnArticle | null>(LEARN_ARTICLE_BY_SLUG_QUERY, { slug })

  if (!article) return {}

  return {
    title: article.seo?.metaTitle ?? article.title,
    description: article.seo?.metaDescription,
    openGraph: {
      title: article.seo?.metaTitle ?? article.title,
      description: article.seo?.metaDescription,
      type: 'article',
      ...(article.featuredImage && {
        images: [urlFor(article.featuredImage).width(1200).height(630).fit('crop').url()],
      }),
    },
  }
}

export default async function LearnArticlePage({ params }: Props) {
  const { slug } = await params

  let article: LearnArticle | null = null
  try {
    article = await sanityFetch<LearnArticle | null>(LEARN_ARTICLE_BY_SLUG_QUERY, { slug })
  } catch {
    // Sanity unavailable — treat as not found
  }

  if (!article) notFound()

  return (
    <article className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto py-16 lg:py-20">
      {/* Title */}
      <h1 className="font-display text-display-lg text-umber mb-8 leading-tight">
        {article.title}
      </h1>

      {/* Featured image */}
      {article.featuredImage && (
        <div className="relative w-full overflow-hidden mb-10" style={{ aspectRatio: '16/9' }}>
          <Image
            src={urlFor(article.featuredImage).width(1200).height(675).fit('crop').url()}
            alt={article.featuredImage.alt ?? article.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 48rem"
            className="object-cover"
          />
        </div>
      )}

      {/* Body */}
      {article.body && <PortableTextRenderer value={article.body} />}

      {/* Related products */}
      {article.relatedProducts && article.relatedProducts.length > 0 && (
        <section className="mt-16 pt-10 border-t border-taupe/20 max-w-none">
          <h2 className="font-display text-display-md text-umber mb-8">Related Products</h2>
          <ProductGrid products={article.relatedProducts} />
        </section>
      )}

      {/* Back link */}
      <div className="mt-12 pt-8 border-t border-taupe/20">
        <Link
          href="/learn"
          className="font-body text-body-sm text-umber/70 hover:text-terracotta transition-colors duration-200 flex items-center gap-2"
        >
          <span aria-hidden="true">&#8592;</span> Back to Learn
        </Link>
      </div>
    </article>
  )
}
