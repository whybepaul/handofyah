import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { sanityFetch } from '@/lib/sanity'
import { JOURNAL_POST_BY_SLUG_QUERY, ALL_JOURNAL_SLUGS_QUERY } from '@/sanity/lib/queries'
import { JournalPost } from '@/lib/types'
import { PortableTextRenderer } from '@/components/content/PortableText'
import { urlFor } from '@/lib/sanity-image'
import { SITE_URL } from '@/lib/constants'
import { CopyLinkButton } from '@/components/ui/CopyLinkButton'
import { formatDate } from '@/components/content/JournalCard'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await sanityFetch<string[]>(ALL_JOURNAL_SLUGS_QUERY)
  return (slugs ?? []).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await sanityFetch<JournalPost | null>(JOURNAL_POST_BY_SLUG_QUERY, { slug })

  if (!post) return {}

  return {
    title: post.seo?.metaTitle ?? post.title,
    description: post.seo?.metaDescription ?? post.excerpt,
    openGraph: {
      title: post.seo?.metaTitle ?? post.title,
      description: post.seo?.metaDescription ?? post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      ...(post.featuredImage && {
        images: [urlFor(post.featuredImage).width(1200).height(630).fit('crop').url()],
      }),
    },
  }
}

export default async function JournalPostPage({ params }: Props) {
  const { slug } = await params

  let post: JournalPost | null = null
  try {
    post = await sanityFetch<JournalPost | null>(JOURNAL_POST_BY_SLUG_QUERY, { slug })
  } catch {
    // Sanity unavailable — treat as not found
  }

  if (!post) notFound()

  // JSON-LD Article structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    url: `${SITE_URL}/journal/${post.slug.current}`,
    ...(post.featuredImage && {
      image: urlFor(post.featuredImage).width(1200).height(630).url(),
    }),
    publisher: {
      '@type': 'Organization',
      name: 'Hand of Yah',
      url: SITE_URL,
    },
  }

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />

      <article className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto py-16 lg:py-20">
        {/* Date and category */}
        <ScrollReveal delay={0}>
          <div className="flex items-center gap-3 mb-4">
            <time dateTime={post.publishedAt} className="label-text text-taupe">
              {formatDate(post.publishedAt)}
            </time>
            {post.category?.name && (
              <>
                <span className="text-taupe/40" aria-hidden="true">·</span>
                <span className="label-text text-terracotta">{post.category.name}</span>
              </>
            )}
          </div>
        </ScrollReveal>

        {/* Title */}
        <ScrollReveal delay={80}>
          <h1 className="font-display text-display-lg text-umber mb-8 leading-tight">
            {post.title}
          </h1>
        </ScrollReveal>

        {/* Featured image — full width within prose container */}
        {post.featuredImage && (
          <ScrollReveal delay={160}>
            <div className="relative w-full overflow-hidden mb-10" style={{ aspectRatio: '16/9' }}>
              <Image
                src={urlFor(post.featuredImage).width(1200).height(675).fit('crop').url()}
                alt={post.featuredImage.alt ?? post.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 48rem"
                className="object-cover"
              />
            </div>
          </ScrollReveal>
        )}

        {/* Body rendered with Portable Text */}
        {post.body && (
          <ScrollReveal delay={post.featuredImage ? 240 : 160}>
            <PortableTextRenderer value={post.body} />
          </ScrollReveal>
        )}

        {/* Footer: sharing + back link */}
        <div className="mt-16 pt-8 border-t border-taupe/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link
            href="/journal"
            className="font-body text-body-sm text-umber/70 hover:text-terracotta transition-colors duration-200 flex items-center gap-2"
          >
            <span aria-hidden="true">&#8592;</span> Back to Journal
          </Link>

          <CopyLinkButton url={`${SITE_URL}/journal/${post.slug.current}`} />
        </div>
      </article>
    </>
  )
}
