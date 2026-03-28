import type { Metadata } from 'next'
import { sanityFetch } from '@/lib/sanity'
import {
  FEATURED_PRODUCTS_QUERY,
  RECENT_JOURNAL_POSTS_QUERY,
} from '@/sanity/lib/queries'
import { Product, JournalPost } from '@/lib/types'
import {
  HeroSection,
  PhilosophySection,
  FeaturedProductsSection,
  BrandStorySection,
  IngredientsBannerSection,
  JournalPreviewSection,
} from './HomeSections'

export const metadata: Metadata = {
  title: 'Hand of Yah — Skincare is Self-Care',
  description:
    'Premium artisanal skincare and wellness products crafted with intention, rooted in nature.',
}

export default async function HomePage() {
  // Fetch featured products and recent journal posts in parallel.
  // Gracefully degrade to empty arrays if Sanity is unavailable.
  let featuredProducts: Product[] = []
  let recentPosts: JournalPost[] = []
  try {
    ;[featuredProducts, recentPosts] = await Promise.all([
      sanityFetch<Product[]>(FEATURED_PRODUCTS_QUERY),
      sanityFetch<JournalPost[]>(RECENT_JOURNAL_POSTS_QUERY),
    ])
    featuredProducts = featuredProducts ?? []
    recentPosts = recentPosts ?? []
  } catch {
    // Sanity unavailable — sections will render their placeholder zero-states
  }

  return (
    <>
      <HeroSection />
      <PhilosophySection />
      <FeaturedProductsSection products={featuredProducts} />
      <BrandStorySection />
      <IngredientsBannerSection />
      <JournalPreviewSection posts={recentPosts} />
    </>
  )
}
