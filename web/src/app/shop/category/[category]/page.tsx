import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { sanityFetch } from '@/lib/sanity'
import {
  PRODUCTS_BY_CATEGORY_QUERY,
  CATEGORY_BY_SLUG_QUERY,
} from '@/sanity/lib/queries'
import { Product, Category } from '@/lib/types'
import { PRODUCT_CATEGORIES } from '@/lib/constants'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { ProductGrid } from '@/components/product/ProductGrid'

type Props = {
  params: Promise<{ category: string }>
}

// Pre-generate all known category pages at build time
export async function generateStaticParams() {
  return PRODUCT_CATEGORIES.map((cat) => ({ category: cat.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categorySlug } = await params

  const category = await sanityFetch<Category | null>(CATEGORY_BY_SLUG_QUERY, {
    slug: categorySlug,
  })

  // Fall back to the constant name if Sanity has no matching document yet
  const constantMatch = PRODUCT_CATEGORIES.find((c) => c.slug === categorySlug)
  const title = category?.name ?? constantMatch?.name ?? categorySlug

  return {
    title,
    description: category?.description ?? undefined,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category: categorySlug } = await params

  // Validate slug against known categories — prevents arbitrary URL access
  const isValidCategory = PRODUCT_CATEGORIES.some((c) => c.slug === categorySlug)
  if (!isValidCategory) {
    notFound()
  }

  // Fetch the category document for description/display name
  let category: Category | null = null
  let products: Product[] = []
  try {
    ;[category, products] = await Promise.all([
      sanityFetch<Category | null>(CATEGORY_BY_SLUG_QUERY, { slug: categorySlug }),
      sanityFetch<Product[]>(PRODUCTS_BY_CATEGORY_QUERY, { category: categorySlug }),
    ])
    products = products ?? []
  } catch {
    // Sanity unavailable — render with constant fallback name and empty product grid
  }

  // Use the constant as a display-name fallback while Sanity is empty
  const constantMatch = PRODUCT_CATEGORIES.find((c) => c.slug === categorySlug)
  const displayName = category?.name ?? constantMatch?.name ?? categorySlug

  return (
    <div className="container-content section-padding">
      <SectionHeader title={displayName} />
      {category?.description && (
        <p className="font-body text-body-lg text-umber/80 mb-12 max-w-prose">
          {category.description}
        </p>
      )}
      <ProductGrid products={products} />
    </div>
  )
}
