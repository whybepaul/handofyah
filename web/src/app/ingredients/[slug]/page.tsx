import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { sanityFetch } from '@/lib/sanity'
import { INGREDIENT_BY_SLUG_QUERY, ALL_INGREDIENT_SLUGS_QUERY } from '@/sanity/lib/queries'
import { Ingredient, Product } from '@/lib/types'
import { PortableTextRenderer } from '@/components/content/PortableText'
import { ProductGrid } from '@/components/product/ProductGrid'

// The INGREDIENT_BY_SLUG_QUERY returns the ingredient with a reverse-lookup `products` field
type IngredientWithProducts = Ingredient & {
  products?: Product[]
}

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await sanityFetch<string[]>(ALL_INGREDIENT_SLUGS_QUERY)
  return (slugs ?? []).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const ingredient = await sanityFetch<IngredientWithProducts | null>(
    INGREDIENT_BY_SLUG_QUERY,
    { slug }
  )

  if (!ingredient) return {}

  return {
    title: `${ingredient.name} | Hand of Yah`,
    description: `Learn about ${ingredient.name} — its benefits and the products it appears in.`,
  }
}

export default async function IngredientDetailPage({ params }: Props) {
  const { slug } = await params

  let ingredient: IngredientWithProducts | null = null
  try {
    ingredient = await sanityFetch<IngredientWithProducts | null>(
      INGREDIENT_BY_SLUG_QUERY,
      { slug }
    )
  } catch {
    // Sanity unavailable — treat as not found
  }

  if (!ingredient) notFound()

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto py-16 lg:py-20">
      {/* Back link */}
      <Link
        href="/ingredients"
        className="font-body text-body-sm text-umber/70 hover:text-terracotta transition-colors duration-200 flex items-center gap-2 mb-10"
      >
        <span aria-hidden="true">&#8592;</span> All Ingredients
      </Link>

      {/* Ingredient name */}
      <h1 className="font-display text-display-lg text-umber mb-8 leading-tight">
        {ingredient.name}
      </h1>

      {/* Description — Portable Text */}
      {ingredient.description && ingredient.description.length > 0 && (
        <div className="mb-10">
          <PortableTextRenderer value={ingredient.description} />
        </div>
      )}

      {/* Benefits list */}
      {ingredient.benefits && ingredient.benefits.length > 0 && (
        <section className="mb-12">
          <h2 className="font-display text-display-md text-umber mb-4">Key Benefits</h2>
          <ul className="space-y-3">
            {ingredient.benefits.map((benefit, i) => (
              <li key={i} className="flex items-start gap-3 font-body text-body text-umber/80">
                <span
                  className="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-terracotta"
                  aria-hidden="true"
                />
                {benefit}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Products containing this ingredient */}
      {ingredient.products && ingredient.products.length > 0 && (
        <section className="pt-10 border-t border-taupe/20 max-w-none" style={{ maxWidth: 'none' }}>
          <h2 className="font-display text-display-md text-umber mb-8">
            Products Containing {ingredient.name}
          </h2>
          <ProductGrid products={ingredient.products} />
        </section>
      )}
    </div>
  )
}
