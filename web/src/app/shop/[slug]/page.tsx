import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { sanityFetch } from '@/lib/sanity'
import { PRODUCT_BY_SLUG_QUERY, PRODUCTS_BY_CATEGORY_QUERY } from '@/sanity/lib/queries'
import { Product } from '@/lib/types'
import { SITE_NAME, SITE_URL } from '@/lib/constants'
import { urlFor } from '@/lib/sanity-image'
import { ProductImages } from '@/components/product/ProductImages'
import { ProductGrid } from '@/components/product/ProductGrid'
import { Accordion } from '@/components/ui/Accordion'
import { PortableTextRenderer } from '@/components/content/PortableText'
import { PDPInteractivePanel } from './PDPInteractivePanel'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await sanityFetch<Product | null>(PRODUCT_BY_SLUG_QUERY, { slug })

  if (!product) {
    return { title: 'Product not found' }
  }

  const title = product.seo?.metaTitle ?? product.name
  const description = product.seo?.metaDescription ?? undefined
  const imageUrl =
    product.images?.[0]
      ? urlFor(product.images[0]).width(1200).height(630).fit('crop').url()
      : undefined

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : [],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params

  let product: Product | null = null
  try {
    product = await sanityFetch<Product | null>(PRODUCT_BY_SLUG_QUERY, { slug })
  } catch {
    // Sanity unavailable — treat as not found
  }

  if (!product) {
    notFound()
  }

  // Fetch up to 3 products from the same category, excluding the current product
  const categorySlug = product.category?.slug?.current
  let relatedRaw: Product[] = []
  try {
    relatedRaw = categorySlug
      ? await sanityFetch<Product[]>(PRODUCTS_BY_CATEGORY_QUERY, {
          category: categorySlug,
        }) ?? []
      : []
  } catch {
    // Related products unavailable — omit the section silently
  }
  const related = relatedRaw.filter((p) => p._id !== product._id).slice(0, 3)

  // JSON-LD Product structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.seo?.metaDescription ?? undefined,
    url: `${SITE_URL}/shop/${product.slug.current}`,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: product.price.toFixed(2),
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/shop/${product.slug.current}`,
    },
    ...(product.images?.[0] && {
      image: urlFor(product.images[0]).width(1200).height(1500).fit('crop').url(),
    }),
  }

  // Build accordion items from optional rich-text and ingredient fields
  const accordionItems = []

  if (product.ingredients?.length > 0) {
    accordionItems.push({
      title: 'Ingredients',
      content: (
        <ul className="space-y-1">
          {product.ingredients.map((ing) => (
            <li key={ing._id} className="font-body text-body text-umber/80">
              {ing.name}
              {ing.benefits?.length > 0 && (
                <span className="text-taupe"> — {ing.benefits.join(', ')}</span>
              )}
            </li>
          ))}
        </ul>
      ),
    })
  }

  if (product.usageInstructions) {
    accordionItems.push({
      title: 'Usage instructions',
      content: (
        <PortableTextRenderer
          value={product.usageInstructions as unknown[]}
        />
      ),
    })
  }

  accordionItems.push({
    title: 'Shipping & returns',
    content: (
      <p className="font-body text-body text-umber/80">
        Free shipping on orders over $75. Returns accepted within 30 days of delivery for
        unopened products in original condition. Contact us to initiate a return.
      </p>
    ),
  })

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      <div className="container-content section-padding">
        {/* Two-column layout: image left, info right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left — sticky image gallery */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <ProductImages images={product.images ?? []} productName={product.name} />
          </div>

          {/* Right — product info */}
          <ScrollReveal delay={80}>
            <div>
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex items-center gap-2 font-body text-umber/50"
                style={{ fontSize: 'var(--font-size-body-sm)' }}
              >
                <li>
                  <Link href="/shop" className="hover:text-terracotta transition-colors duration-200">
                    Shop
                  </Link>
                </li>
                {product.category && (
                  <>
                    <li aria-hidden="true">/</li>
                    <li>
                      <Link
                        href={`/shop/category/${product.category.slug.current}`}
                        className="hover:text-terracotta transition-colors duration-200"
                      >
                        {product.category.name}
                      </Link>
                    </li>
                  </>
                )}
                <li aria-hidden="true">/</li>
                <li className="text-umber">{product.name}</li>
              </ol>
            </nav>

            {/* Product name */}
            <h1 className="font-display text-display-lg text-umber mb-4">
              {product.name}
            </h1>

            {/* Price */}
            <p
              className="font-display text-umber mb-8"
              style={{
                fontSize: 'var(--font-size-price)',
                lineHeight: 'var(--font-size-price--line-height)',
                letterSpacing: 'var(--font-size-price--letter-spacing)',
              }}
            >
              ${product.price.toFixed(2)}
            </p>

            {/* Interactive purchase panel — subscription toggle + add to cart */}
            <PDPInteractivePanel product={product} />

            {/* Description */}
            {product.description && (
              <div className="mt-10">
                <PortableTextRenderer value={product.description as unknown[]} />
              </div>
            )}

            {/* Expandable sections */}
            {accordionItems.length > 0 && (
              <div className="mt-10">
                <Accordion items={accordionItems} />
              </div>
            )}
            </div>
          </ScrollReveal>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <ScrollReveal>
            <section className="mt-24">
              <h2 className="font-display text-display-md text-umber mb-8">
                You may also like
              </h2>
              <ProductGrid products={related} />
            </section>
          </ScrollReveal>
        )}
      </div>
    </>
  )
}
