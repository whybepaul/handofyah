import { PortableText as SanityPortableText, PortableTextComponents } from '@portabletext/react'
import { PortableTextBlock, ArbitraryTypedObject } from '@portabletext/types'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity-image'

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="font-display text-display-md text-umber mt-12 mb-4">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-display text-display-sm text-umber mt-8 mb-3">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="font-body text-body text-umber/85 mb-6 leading-relaxed">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="font-display text-display-sm text-umber italic border-l-2 border-terracotta pl-6 my-8">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target={value?.href?.startsWith('http') ? '_blank' : undefined}
        rel={value?.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="text-terracotta underline decoration-terracotta/30 hover:decoration-terracotta transition-colors"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null
      return (
        <figure className="my-8">
          <Image
            src={urlFor(value).width(1200).url()}
            alt={value.alt || ''}
            width={1200}
            height={800}
            className="w-full"
          />
          {value.caption && (
            <figcaption className="font-body text-body-sm text-taupe mt-3 text-center">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-6 mb-6 space-y-2">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-6 mb-6 space-y-2">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="font-body text-body text-umber/85">{children}</li>
    ),
    number: ({ children }) => (
      <li className="font-body text-body text-umber/85">{children}</li>
    ),
  },
}

export function PortableTextRenderer({ value }: { value: unknown[] }) {
  // Sanity stores Portable Text as plain objects; we cast here since the
  // @portabletext/react types require TypedObject, which these objects satisfy
  // at runtime. The types.ts schema uses unknown[] for portability.
  const typedValue = value as (PortableTextBlock | ArbitraryTypedObject)[]
  return (
    <div className="max-w-prose">
      <SanityPortableText value={typedValue} components={components} />
    </div>
  )
}
