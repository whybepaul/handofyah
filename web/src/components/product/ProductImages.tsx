'use client'

import { useState } from 'react'
import Image from 'next/image'
import { SanityImage } from '@/lib/types'
import { urlFor } from '@/lib/sanity-image'

type ProductImagesProps = {
  images: SanityImage[]
  productName: string
}

export function ProductImages({ images, productName }: ProductImagesProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  // Placeholder state when no images are provided
  if (!images || images.length === 0) {
    return (
      <div
        className="relative w-full bg-stone flex items-center justify-center"
        style={{ aspectRatio: '4/5' }}
      >
        <p className="font-display text-display-sm text-taupe text-center px-8">
          {productName}
        </p>
      </div>
    )
  }

  const activeImage = images[activeIndex]

  return (
    <div>
      {/* Main image — 4:5 aspect ratio */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/5' }}>
        <Image
          src={urlFor(activeImage).width(900).height(1125).fit('crop').url()}
          alt={activeImage.alt ?? productName}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
          className="object-cover"
        />
      </div>

      {/* Thumbnail strip — only shown when there are multiple images */}
      {images.length > 1 && (
        <div className="mt-4 flex gap-3">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1} of ${images.length}`}
              className={[
                'relative flex-shrink-0 overflow-hidden transition-opacity duration-200',
                activeIndex === index
                  ? 'opacity-100 ring-1 ring-umber'
                  : 'opacity-50 hover:opacity-75',
              ].join(' ')}
              style={{ width: '72px', aspectRatio: '4/5' }}
            >
              <Image
                src={urlFor(image).width(144).height(180).fit('crop').url()}
                alt={image.alt ?? `${productName} — view ${index + 1}`}
                fill
                sizes="72px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
