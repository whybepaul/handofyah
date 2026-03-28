import Link from 'next/link'
import Image from 'next/image'
import { WishlistItem } from '@/lib/types'
import { urlFor } from '@/lib/sanity-image'

type Props = {
  items: WishlistItem[]
  onRemove: (productSlug: string) => void
}

export function WishlistGrid({ items, onRemove }: Props) {
  if (items.length === 0) {
    return (
      <div className="py-16 text-center space-y-4">
        <p className="font-display text-display-sm text-taupe">No saved items</p>
        <Link
          href="/shop"
          className="btn-text text-terracotta underline underline-offset-2 hover:text-umber transition-colors"
        >
          Browse the shop
        </Link>
      </div>
    )
  }

  return (
    <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <li key={item.id} className="group relative">
          <Link
            href={`/shop/${item.productSlug}`}
            className="block"
            aria-label={`View ${item.productName ?? item.productSlug}`}
          >
            {/* Product image */}
            <div className="relative w-full overflow-hidden bg-stone" style={{ aspectRatio: '4/5' }}>
              {item.productImage ? (
                <Image
                  src={urlFor(item.productImage).width(400).height(500).fit('crop').url()}
                  alt={item.productImage.alt ?? item.productName ?? item.productSlug}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center px-4">
                  <p className="font-display text-display-sm text-taupe text-center">
                    {item.productName ?? item.productSlug}
                  </p>
                </div>
              )}
            </div>

            {/* Name and price */}
            <div className="pt-3 pb-1">
              {item.productName && (
                <h3 className="font-display text-display-sm text-umber leading-tight">
                  {item.productName}
                </h3>
              )}
              {item.productPrice !== undefined && (
                <p className="font-display text-umber/80 text-sm mt-0.5">
                  ${item.productPrice.toFixed(2)}
                </p>
              )}
            </div>
          </Link>

          {/* Remove button */}
          <button
            type="button"
            onClick={() => onRemove(item.productSlug)}
            className="mt-1 font-body text-xs text-taupe hover:text-terracotta underline underline-offset-2 transition-colors"
            aria-label={`Remove ${item.productName ?? item.productSlug} from wishlist`}
          >
            Remove
          </button>
        </li>
      ))}
    </ul>
  )
}
