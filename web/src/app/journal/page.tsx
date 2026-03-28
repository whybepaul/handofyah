import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { sanityFetch } from '@/lib/sanity'
import { JOURNAL_POSTS_QUERY } from '@/sanity/lib/queries'
import { JournalPost } from '@/lib/types'
import { JournalCard, formatDate } from '@/components/content/JournalCard'
import { urlFor } from '@/lib/sanity-image'
import { SITE_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Journal | Hand of Yah',
  description: 'Insights, rituals, and stories from the Hand of Yah community.',
}

export default async function JournalPage() {
  let posts: JournalPost[] = []
  try {
    posts = await sanityFetch<JournalPost[]>(JOURNAL_POSTS_QUERY) ?? []
  } catch {
    // Sanity unavailable — render empty state rather than crashing
  }

  if (posts.length === 0) {
    return (
      <div className="container-content section-padding">
        <h1 className="font-display text-display-lg text-umber mb-6">Journal</h1>
        <p className="font-body text-body text-taupe">
          No posts yet. Check back soon.
        </p>
      </div>
    )
  }

  const [featured, ...rest] = posts

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Hand of Yah Journal',
    itemListElement: posts.map((post, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${SITE_URL}/journal/${post.slug.current}`,
      name: post.title,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
    <div className="container-content section-padding">
      {/* Page heading */}
      <h1 className="font-display text-display-lg text-umber mb-12">Journal</h1>

      {/* Featured post */}
      <Link
        href={`/journal/${featured.slug.current}`}
        className="group block mb-16 lg:mb-20"
        aria-label={`Read featured post: ${featured.title}`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Featured image */}
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: '3/2' }}>
            {featured.featuredImage ? (
              <Image
                src={urlFor(featured.featuredImage).width(1200).height(800).fit('crop').url()}
                alt={featured.featuredImage.alt ?? featured.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-stone">
                <p className="font-display text-display-md text-taupe text-center px-8">
                  {featured.title}
                </p>
              </div>
            )}
          </div>

          {/* Featured content */}
          <div className="lg:pl-8">
            <div className="flex items-center gap-3 mb-4">
              <time
                dateTime={featured.publishedAt}
                className="label-text text-taupe"
              >
                {formatDate(featured.publishedAt)}
              </time>
              {featured.category?.name && (
                <>
                  <span className="text-taupe/40" aria-hidden="true">·</span>
                  <span className="label-text text-terracotta">{featured.category.name}</span>
                </>
              )}
            </div>

            <h2 className="font-display text-display-lg text-umber group-hover:text-terracotta transition-colors duration-200 mb-4 leading-tight">
              {featured.title}
            </h2>

            {featured.excerpt && (
              <p className="font-body text-body text-umber/75 leading-relaxed">
                {featured.excerpt}
              </p>
            )}
          </div>
        </div>
      </Link>

      {/* Remaining posts grid */}
      {rest.length > 0 && (
        <>
          <hr className="border-taupe/20 mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {rest.map((post) => (
              <JournalCard key={post._id} post={post} />
            ))}
          </div>
        </>
      )}
    </div>
    </>
  )
}
