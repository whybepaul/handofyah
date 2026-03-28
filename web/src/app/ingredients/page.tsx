import type { Metadata } from 'next'
import { sanityFetch } from '@/lib/sanity'
import { INGREDIENTS_QUERY } from '@/sanity/lib/queries'
import { Ingredient } from '@/lib/types'
import { IngredientList } from '@/components/content/IngredientList'

export const metadata: Metadata = {
  title: 'Ingredients | Hand of Yah',
  description:
    'Explore the natural ingredients behind every Hand of Yah formula — their origins, benefits, and the products they appear in.',
}

export default async function IngredientsPage() {
  let ingredients: Ingredient[] = []
  try {
    ingredients = await sanityFetch<Ingredient[]>(INGREDIENTS_QUERY) ?? []
  } catch {
    // Sanity unavailable — IngredientList will render against an empty array
  }

  return (
    <div className="container-content section-padding">
      <div className="mb-12">
        <h1 className="font-display text-display-lg text-umber mb-4">Ingredient Database</h1>
        <p className="font-body text-body text-umber/75 max-w-2xl">
          We believe in full transparency. Browse every ingredient we use, learn about their
          benefits, and discover which products contain them.
        </p>
      </div>

      {/* Client component handles search filtering */}
      <IngredientList ingredients={ingredients ?? []} />
    </div>
  )
}
