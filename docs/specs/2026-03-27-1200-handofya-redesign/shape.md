# Data Structures and API Surface: Hand of Yah

## Sanity CMS Content Models

### Product
```typescript
{
  _type: 'product'
  name: string
  slug: { current: string }
  price: number
  description: PortableText  // Rich text
  ingredients: Ingredient[]  // References
  usageInstructions: PortableText
  category: Reference<Category>
  images: Image[]  // Ordered array
  subscriptionEligible: boolean
  status: 'active' | 'draft'
  seo: { metaTitle: string, metaDescription: string }
}
```

### Category
```typescript
{
  _type: 'category'
  name: string  // Face, Supplements, Hair Oils, Eye Cremes, Face Masques, Fragrances
  slug: { current: string }
  description: string
  order: number
}
```

### Journal Post
```typescript
{
  _type: 'journalPost'
  title: string
  slug: { current: string }
  featuredImage: Image
  body: PortableText
  excerpt: string
  category: Reference<JournalCategory>
  publishedAt: datetime
  seo: { metaTitle: string, metaDescription: string }
}
```

### Learn Article
```typescript
{
  _type: 'learnArticle'
  title: string
  slug: { current: string }
  featuredImage: Image
  body: PortableText
  relatedProducts: Reference<Product>[]
  seo: { metaTitle: string, metaDescription: string }
}
```

### Ingredient
```typescript
{
  _type: 'ingredient'
  name: string
  slug: { current: string }
  description: PortableText
  benefits: string[]
  // Reverse lookup: products containing this ingredient
}
```

### Page (generic CMS pages)
```typescript
{
  _type: 'page'
  title: string
  slug: { current: string }
  body: PortableText
  seo: { metaTitle: string, metaDescription: string }
}
```

## Supabase Database Schema

### customers
```sql
id UUID PK (maps to auth.users.id)
email TEXT NOT NULL
name TEXT
stripe_customer_id TEXT UNIQUE
created_at TIMESTAMPTZ DEFAULT now()
```

### orders
```sql
id UUID PK DEFAULT gen_random_uuid()
customer_id UUID FK -> customers.id (nullable for guest checkout)
stripe_payment_intent_id TEXT UNIQUE
status TEXT CHECK (pending, paid, shipped, delivered, cancelled)
subtotal INTEGER  -- cents
shipping INTEGER  -- cents
tax INTEGER  -- cents
total INTEGER  -- cents
shipping_address JSONB
line_items JSONB  -- snapshot of cart at checkout
created_at TIMESTAMPTZ DEFAULT now()
```

### subscriptions
```sql
id UUID PK DEFAULT gen_random_uuid()
customer_id UUID FK -> customers.id
stripe_subscription_id TEXT UNIQUE
product_slug TEXT NOT NULL
frequency TEXT CHECK (monthly, bimonthly, quarterly)
status TEXT CHECK (active, paused, cancelled)
next_billing_date TIMESTAMPTZ
created_at TIMESTAMPTZ DEFAULT now()
```

### wishlists
```sql
id UUID PK DEFAULT gen_random_uuid()
customer_id UUID FK -> customers.id
product_slug TEXT NOT NULL
created_at TIMESTAMPTZ DEFAULT now()
UNIQUE(customer_id, product_slug)
```

## API Routes (Next.js Route Handlers)

### Commerce
- `POST /api/cart` — Add item to cart
- `PATCH /api/cart` — Update quantity
- `DELETE /api/cart` — Remove item
- `POST /api/checkout` — Create Stripe Checkout Session / Payment Intent
- `POST /api/webhooks/stripe` — Stripe webhook handler

### Subscriptions
- `GET /api/subscriptions` — List customer subscriptions
- `PATCH /api/subscriptions/[id]` — Update frequency, pause, resume
- `DELETE /api/subscriptions/[id]` — Cancel subscription

### Account
- `GET /api/orders` — List customer orders
- `GET /api/wishlist` — Get wishlist
- `POST /api/wishlist` — Add to wishlist
- `DELETE /api/wishlist/[slug]` — Remove from wishlist

### Content
- `POST /api/contact` — Submit contact form
- `POST /api/newsletter` — Subscribe to newsletter (Listmonk API)

## Stripe Integration Points
- `stripe.checkout.sessions.create()` — One-time purchases
- `stripe.subscriptions.create()` — Recurring orders
- `stripe.webhooks.constructEvent()` — Webhook verification
- Events: payment_intent.succeeded, invoice.paid, customer.subscription.updated, customer.subscription.deleted
