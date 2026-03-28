export const SITE_NAME = 'Hand of Yah'
export const SITE_TAGLINE = 'Skincare is self-care'
export const SITE_DESCRIPTION = 'Premium artisanal skincare and wellness products crafted with intention, rooted in nature.'
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://handofya.com'

export const PRODUCT_CATEGORIES = [
  { name: 'Face', slug: 'face' },
  { name: 'Supplements', slug: 'supplements' },
  { name: 'Hair Oils', slug: 'hair-oils' },
  { name: 'Eye Cremes', slug: 'eye-cremes' },
  { name: 'Face Masques', slug: 'face-masques' },
  { name: 'Fragrances', slug: 'fragrances' },
] as const

export const SUBSCRIPTION_FREQUENCIES = [
  { value: 'monthly', label: 'Every month', months: 1 },
  { value: 'bimonthly', label: 'Every 2 months', months: 2 },
  { value: 'quarterly', label: 'Every 3 months', months: 3 },
] as const

/**
 * Returns the human-readable label for a subscription frequency.
 * Derives from SUBSCRIPTION_FREQUENCIES so the two never diverge.
 */
export function formatSubscriptionLabel(frequency: string): string {
  const match = SUBSCRIPTION_FREQUENCIES.find((f) => f.value === frequency)
  return match ? match.label : frequency
}

export const SUBSCRIPTION_DISCOUNT = 0.10 // 10% off

export const FREE_SHIPPING_THRESHOLD = 75 // USD
