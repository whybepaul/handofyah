// ── Sanity Content Types ──

export interface SanityImage {
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
}

export interface Category {
  _id: string
  name: string
  slug: { current: string }
  description?: string
  order: number
}

export interface Product {
  _id: string
  name: string
  slug: { current: string }
  price: number
  description: unknown[] // Portable Text
  ingredients: Ingredient[]
  usageInstructions: unknown[] // Portable Text
  category: Category
  images: SanityImage[]
  subscriptionEligible: boolean
  status: 'active' | 'draft'
  seo?: { metaTitle?: string; metaDescription?: string }
}

export interface JournalPost {
  _id: string
  title: string
  slug: { current: string }
  featuredImage: SanityImage
  body: unknown[] // Portable Text
  excerpt: string
  category?: { name: string; slug: { current: string } }
  publishedAt: string
  seo?: { metaTitle?: string; metaDescription?: string }
}

export interface LearnArticle {
  _id: string
  title: string
  slug: { current: string }
  featuredImage: SanityImage
  body: unknown[] // Portable Text
  relatedProducts?: Product[]
  seo?: { metaTitle?: string; metaDescription?: string }
}

export interface Ingredient {
  _id: string
  name: string
  slug: { current: string }
  description: unknown[] // Portable Text
  benefits: string[]
}

export interface Page {
  _id: string
  title: string
  slug: { current: string }
  body: unknown[] // Portable Text
  seo?: { metaTitle?: string; metaDescription?: string }
}

// ── Commerce Types ──

export interface CartItem {
  productSlug: string
  productName: string
  price: number
  quantity: number
  image?: SanityImage
  subscription?: {
    frequency: 'monthly' | 'bimonthly' | 'quarterly'
  }
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  itemCount: number
}

export interface Order {
  id: string
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  subtotal: number
  shipping: number
  tax: number
  total: number
  lineItems: CartItem[]
  shippingAddress: ShippingAddress
  createdAt: string
}

export interface ShippingAddress {
  name: string
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface Subscription {
  id: string
  stripeSubscriptionId: string
  productSlug: string
  productName?: string
  frequency: 'monthly' | 'bimonthly' | 'quarterly'
  status: 'active' | 'paused' | 'cancelled'
  nextBillingDate: string
  createdAt: string
}

export interface WishlistItem {
  id: string
  productSlug: string
  productName?: string
  productImage?: SanityImage
  productPrice?: number
  createdAt: string
}

// ── API Types ──

export interface CheckoutRequest {
  items: CartItem[]
  shippingAddress: ShippingAddress
  customerEmail: string
}

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}
