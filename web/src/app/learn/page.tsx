import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { sanityFetch } from '@/lib/sanity'
import { LEARN_ARTICLES_QUERY } from '@/sanity/lib/queries'
import { LearnArticle } from '@/lib/types'
import { urlFor } from '@/lib/sanity-image'
import { SITE_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Learn | Hand of Yah',
  description: 'Deepen your knowledge of natural skincare, ingredients, and wellness rituals.',
}

export default async function LearnPage() {
  let articles: LearnArticle[] = []
  try {
    articles = await sanityFetch<LearnArticle[]>(LEARN_ARTICLES_QUERY) ?? []
  } catch {
    // Sanity unavailable — render empty state
  }

  const jsonLd = articles.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Hand of Yah Learn',
        itemListElement: articles.map((article, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: `${SITE_URL}/learn/${article.slug.current}`,
          name: article.title,
        })),
      }
    : null

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
          }}
        />
      )}
      <div className="container-content section-padding">
        <h1 className="font-display text-display-lg text-umber mb-12">Learn</h1>

        {(!articles || articles.length === 0) ? (
          <p className="font-body text-body text-taupe">No articles yet. Check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link
                key={article._id}
                href={`/learn/${article.slug.current}`}
                className="group block"
                aria-label={`Read ${article.title}`}
              >
                {/* Featured image — 3:2 aspect ratio */}
                <div className="relative w-full overflow-hidden mb-4" style={{ aspectRatio: '3/2' }}>
                  {article.featuredImage ? (
                    <Image
                      src={urlFor(article.featuredImage).width(720).height(480).fit('crop').url()}
                      alt={article.featuredImage.alt ?? article.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-stone px-6">
                      <p className="font-display text-display-sm text-taupe text-center">
                        {article.title}
                      </p>
                    </div>
                  )}
                </div>

                {/* Title */}
                <h2 className="font-display text-display-sm text-umber group-hover:text-terracotta transition-colors duration-200 leading-tight">
                  {article.title}
                </h2>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
