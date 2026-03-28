import type { Metadata } from 'next'
import { sanityFetch } from '@/lib/sanity'
import { PRODUCTS_QUERY } from '@/sanity/lib/queries'
import { Product } from '@/lib/types'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { ProductGrid } from '@/components/product/ProductGrid'

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Browse all Hand of Yah skincare and wellness products.',
}

export default async function ShopPage() {
  let products: Product[] = []
  try {
    products = await sanityFetch<Product[]>(PRODUCTS_QUERY) ?? []
  } catch {
    // Sanity unavailable — ProductGrid will render its empty state
  }

  return (
    <div className="container-content section-padding">
      <SectionHeader title="Shop" />
      <ProductGrid products={products} />
    </div>
  )
}
