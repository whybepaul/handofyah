import { MetadataRoute } from 'next'
import { sanityFetch } from '@/lib/sanity'
import {
  ALL_PRODUCT_SLUGS_QUERY,
  ALL_JOURNAL_SLUGS_QUERY,
  ALL_LEARN_SLUGS_QUERY,
  ALL_INGREDIENT_SLUGS_QUERY,
} from '@/sanity/lib/queries'
import { SITE_URL, PRODUCT_CATEGORIES } from '@/lib/constants'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL

  // Static pages with their relative priorities
  const staticPages = [
    '',
    '/shop',
    '/journal',
    '/learn',
    '/ingredients',
    '/about',
    '/contact',
    '/faq',
    '/shipping-returns',
    '/terms',
    '/privacy',
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1.0 : 0.8,
  }))

  // One entry per product category browse page
  const categoryPages = PRODUCT_CATEGORIES.map(({ slug }) => ({
    url: `${baseUrl}/shop/category/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Fetch all dynamic slugs from Sanity in parallel
  const [productSlugs, journalSlugs, learnSlugs, ingredientSlugs] = await Promise.all([
    sanityFetch<string[]>(ALL_PRODUCT_SLUGS_QUERY),
    sanityFetch<string[]>(ALL_JOURNAL_SLUGS_QUERY),
    sanityFetch<string[]>(ALL_LEARN_SLUGS_QUERY),
    sanityFetch<string[]>(ALL_INGREDIENT_SLUGS_QUERY),
  ])

  const productPages = productSlugs.map((slug) => ({
    url: `${baseUrl}/shop/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  const journalPages = journalSlugs.map((slug) => ({
    url: `${baseUrl}/journal/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const learnPages = learnSlugs.map((slug) => ({
    url: `${baseUrl}/learn/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const ingredientPages = ingredientSlugs.map((slug) => ({
    url: `${baseUrl}/ingredients/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  return [
    ...staticPages,
    ...categoryPages,
    ...productPages,
    ...journalPages,
    ...learnPages,
    ...ingredientPages,
  ]
}
