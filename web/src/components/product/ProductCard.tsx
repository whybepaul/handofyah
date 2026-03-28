import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/lib/types'
import { urlFor } from '@/lib/sanity-image'

type ProductCardProps = {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { name, slug, price, images, category } = product
  const primaryImage = images?.[0]

  return (
    <Link
      href={`/shop/${slug.current}`}
      className="group block bg-stone"
      aria-label={`View ${name}`}
    >
      {/* Image — 4:5 aspect ratio */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/5' }}>
        {primaryImage ? (
          <Image
            src={urlFor(primaryImage).width(600).height(750).fit('crop').url()}
            alt={primaryImage.alt ?? name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
          />
        ) : (
          // Placeholder when no image is available
          <div className="flex h-full w-full items-center justify-center bg-stone px-6">
            <p className="font-display text-display-sm text-taupe text-center">{name}</p>
          </div>
        )}
      </div>

      {/* Card content — hover lift applied to the whole card */}
      <div
        className="pt-4 pb-6 px-0 transition-transform duration-200 ease-out group-hover:-translate-y-0.5"
        style={{ transform: 'translateY(0)' }}
      >
        {/* Category label */}
        {category?.name && (
          <p className="label-text mb-2">{category.name}</p>
        )}

        {/* Product name */}
        <h3 className="font-display text-display-sm text-umber mb-1 leading-tight">
          {name}
        </h3>

        {/* Price */}
        <p
          className="font-display text-umber/80"
          style={{
            fontSize: 'var(--font-size-price)',
            lineHeight: 'var(--font-size-price--line-height)',
            letterSpacing: 'var(--font-size-price--letter-spacing)',
          }}
        >
          ${price.toFixed(2)}
        </p>
      </div>
    </Link>
  )
}
