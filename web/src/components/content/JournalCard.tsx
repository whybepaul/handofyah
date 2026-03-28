import Link from 'next/link'
import Image from 'next/image'
import { JournalPost } from '@/lib/types'
import { urlFor } from '@/lib/sanity-image'

type JournalCardProps = {
  post: JournalPost
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function JournalCard({ post }: JournalCardProps) {
  const { title, slug, featuredImage, excerpt, publishedAt, category } = post

  return (
    <Link
      href={`/journal/${slug.current}`}
      className="group block"
      aria-label={`Read ${title}`}
    >
      {/* Image — 3:2 aspect ratio */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '3/2' }}>
        {featuredImage ? (
          <Image
            src={urlFor(featuredImage).width(720).height(480).fit('crop').url()}
            alt={featuredImage.alt ?? title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-stone px-6">
            <p className="font-display text-display-sm text-taupe text-center">{title}</p>
          </div>
        )}
      </div>

      {/* Card content */}
      <div className="pt-4 pb-2">
        {/* Date and category */}
        <div className="flex items-center gap-3 mb-2">
          <time
            dateTime={publishedAt}
            className="label-text text-taupe"
          >
            {formatDate(publishedAt)}
          </time>
          {category?.name && (
            <>
              <span className="text-taupe/40" aria-hidden="true">·</span>
              <span className="label-text text-terracotta">{category.name}</span>
            </>
          )}
        </div>

        {/* Title — hover color change to terracotta */}
        <h3 className="font-display text-display-sm text-umber group-hover:text-terracotta transition-colors duration-200 mb-2 leading-tight">
          {title}
        </h3>

        {/* Excerpt */}
        {excerpt && (
          <p className="font-body text-body-sm text-umber/70 leading-relaxed line-clamp-2">
            {excerpt}
          </p>
        )}
      </div>
    </Link>
  )
}
