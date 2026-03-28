# Hand of Yah

Premium artisanal skincare and wellness e-commerce site. "Skincare is self-care."

## Overview

Hand of Yah is a custom-built DTC skincare brand website built on Next.js (App Router) with Sanity for content, Stripe for payments and subscriptions, and Supabase for auth and customer data. It replaces a Squarespace site that failed to meet the brand's premium positioning requirements.

The design concept is "Sacred Apothecary" — warm earth tones, editorial typography (Cormorant Garamond serif + Outfit sans-serif), and a shopping experience modeled after Aesop's intentional, unhurried UX.

The site is live at handofya.com and is fully self-manageable: the owner can create and publish journal posts, update product content, and manage educational content without developer involvement through Sanity Studio at `/studio`.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| CMS | Sanity v3 |
| Payments | Stripe (Checkout Sessions + Subscriptions) |
| Auth | Supabase (Magic Link, passwordless) |
| Database | Supabase PostgreSQL |
| Email | Listmonk (self-hosted on Render) |
| Hosting | Vercel |
| Testing | Playwright (E2E) |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
cd web
npm install
```

### Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your credentials:

```bash
cp .env.local.example .env.local
```

| Group | Variable | Description |
|-------|----------|-------------|
| **Sanity** | `NEXT_PUBLIC_SANITY_PROJECT_ID` | Your Sanity project ID |
| | `NEXT_PUBLIC_SANITY_DATASET` | Dataset name (default: `production`) |
| | `SANITY_API_TOKEN` | Read token from Sanity dashboard |
| | `SANITY_REVALIDATE_SECRET` | Random string — validates ISR webhook calls |
| **Supabase** | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key (safe to expose) |
| | `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-only, never expose) |
| **Stripe** | `STRIPE_SECRET_KEY` | Server-side Stripe secret key |
| | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Client-side Stripe publishable key |
| | `STRIPE_WEBHOOK_SECRET` | Webhook signing secret from Stripe dashboard |
| **Listmonk** | `LISTMONK_URL` | Your Listmonk instance URL |
| | `LISTMONK_API_USER` | Listmonk API username |
| | `LISTMONK_API_PASSWORD` | Listmonk API password |
| | `LISTMONK_LIST_ID` | List ID for newsletter subscribers |
| **Site** | `NEXT_PUBLIC_SITE_URL` | Full site URL (default: `http://localhost:3000`) |

### Development

```bash
cd web
npm run dev
```

Open http://localhost:3000.

### Sanity Studio

Visit http://localhost:3000/studio to manage content. The Studio is embedded in the Next.js app — no separate deployment needed.

## Project Structure

```
projects/handofya/
├── web/                          # Next.js app (deploys to Vercel)
│   ├── src/
│   │   ├── app/                  # Pages and API routes (App Router)
│   │   ├── components/           # React components
│   │   ├── lib/                  # Utility libraries (Sanity, Supabase, Stripe, cart)
│   │   └── sanity/               # CMS schemas and GROQ queries
│   ├── tests/                    # Playwright E2E tests
│   ├── public/                   # Static assets
│   ├── .env.local.example        # Environment variable template
│   └── playwright.config.ts      # Playwright configuration
└── docs/
    ├── prd.md                    # Product requirements
    ├── architecture.md           # Architecture decisions
    ├── roadmap.md                # Product roadmap and pre-launch checklist
    ├── CHANGELOG.md              # Change history
    ├── design/                   # Brand identity, design tokens, prototype
    ├── specs/                    # Phase 1.5 spec artifacts (shape, standards, plan)
    ├── sessions/                 # Session notes by date
    └── tests.md                  # Test specifications (91 framework-agnostic tests)
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage — hero, featured products, journal preview, brand story |
| `/shop` | All products grid |
| `/shop/category/[category]` | Category pages: `face`, `supplements`, `hair-oils`, `eye-cremes`, `face-masques`, `fragrances` |
| `/shop/[slug]` | Product detail page (SSG with ISR) |
| `/journal` | Journal listing page |
| `/journal/[slug]` | Individual journal post |
| `/learn` | Learn hub — educational articles |
| `/learn/[slug]` | Individual learn article |
| `/ingredients` | Ingredient database with search |
| `/ingredients/[slug]` | Individual ingredient page |
| `/about` | Brand story and philosophy |
| `/faq` | Frequently asked questions |
| `/contact` | Contact form |
| `/shipping-returns` | Shipping and returns policy |
| `/terms` | Terms of service |
| `/privacy` | Privacy policy |
| `/cart` | Cart page |
| `/checkout` | Checkout (redirects to Stripe hosted checkout) |
| `/checkout/success` | Order confirmation page |
| `/login` | Magic link sign-in |
| `/signup` | Account creation |
| `/auth/callback` | Supabase auth callback handler |
| `/account` | Customer account dashboard |
| `/account/orders` | Order history |
| `/account/subscriptions` | Subscription management (pause, cancel, resume) |
| `/account/wishlist` | Saved products |
| `/account/settings` | Account settings |
| `/studio/[[...tool]]` | Embedded Sanity Studio (owner-only) |

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/checkout` | Creates a Stripe Checkout Session; validates prices server-side against Sanity |
| `POST` | `/api/webhooks/stripe` | Handles Stripe events: creates orders, links to customer accounts, triggers confirmation emails |
| `GET` | `/api/orders` | Returns authenticated customer's order history from Supabase |
| `GET` | `/api/subscriptions` | Returns authenticated customer's active subscriptions |
| `PATCH` | `/api/subscriptions/[id]` | Updates a subscription status (pause/resume/cancel) — syncs with Stripe API |
| `GET` | `/api/wishlist` | Returns authenticated customer's wishlist items |
| `POST` | `/api/wishlist` | Adds a product to wishlist |
| `DELETE` | `/api/wishlist/[slug]` | Removes a product from wishlist |
| `POST` | `/api/contact` | Submits contact form |
| `POST` | `/api/newsletter` | Adds an email address to the Listmonk newsletter list |
| `POST` | `/api/revalidate` | ISR revalidation webhook — called by Sanity on content publish |

## Design System

**Concept:** Sacred Apothecary

**Fonts:**
- Display / headings: Cormorant Garamond (Google Fonts, variable)
- Body / UI: Outfit (Google Fonts, variable)

**Color Palette:**

| Name | Hex | Usage |
|------|-----|-------|
| Parchment | `#F5F0E8` | Primary background (replaces white everywhere) |
| Umber | `#2C2420` | Primary text (replaces black everywhere) |
| Terracotta | `#C4704B` | Primary CTA buttons, active states, link hover |
| Sage | `#8B9A7E` | Ingredient tags, subscription badges |
| Stone | `#E8E2D8` | Card backgrounds, section dividers |
| Taupe | `#B8AFA6` | Borders, muted text, placeholders |
| Espresso | `#1A1614` | Footer background, dark sections |
| Amber | `#D4A574` | Hover states on Terracotta |
| Linen | `#FAF7F2` | Lighter background variant, modal overlays |
| Clay | `#A85E3A` | Pressed/active button states |

Full documentation: `docs/design/brand-identity.md`, `docs/design/design-tokens.md`.

## CMS Content Types

The Sanity schema has 7 document types, accessible through the Studio at `/studio`:

| Schema | Key Fields | Notes |
|--------|-----------|-------|
| `product` | name, slug, price, description (Portable Text), ingredients (references), usageInstructions (Portable Text), category (reference), images, subscriptionEligible, featured, status, seo | Supports SSG with ISR |
| `category` | name, slug, description, order | 6 categories: Face, Supplements, Hair Oils, Eye Cremes, Face Masques, Fragrances |
| `ingredient` | name, slug, description (Portable Text), benefits | Cross-referenced by product; powers ingredient database |
| `journalPost` | title, slug, featuredImage, body (Portable Text), excerpt, category (reference), publishedAt, seo | Blog-style editorial content |
| `journalCategory` | name, slug | Tags for journal posts |
| `learnArticle` | title, slug, featuredImage, body (Portable Text), relatedProducts (references), seo | Educational content hub |
| `page` | title, slug, body (Portable Text), seo | Static pages: About, FAQ, Shipping, Terms, Privacy |

## Commerce

**Cart:** Guest cart stored in `localStorage`. Authenticated user cart persists to Supabase. Subscription items (monthly / every 2 months / every 3 months) are marked at add-to-cart time.

**Checkout:** Redirects to Stripe hosted checkout. Prices are validated server-side against Sanity before creating the session — client-side price tampering is rejected.

**Subscriptions:** 10% discount on all subscription-eligible products. Customers can pause, resume, or cancel from `/account/subscriptions`. Changes sync immediately to Stripe.

**Free shipping threshold:** $75 USD.

**Order flow:** Stripe webhook (`payment_intent.succeeded`) creates the order in Supabase, links it to the customer account by email, and triggers an order confirmation email via Listmonk.

## Deployment

### Vercel

1. Connect the `web/` directory to a Vercel project
2. Add all environment variables from `.env.local.example` to the Vercel dashboard
3. Set the root directory to `web/` in Vercel project settings
4. Deploy — the build runs `next build` and outputs static/ISR pages

### Sanity

1. Create a project at sanity.io (free tier is sufficient)
2. Copy the Project ID and Dataset name into your environment variables
3. Add CORS origins for `localhost:3000` and your production domain in the Sanity dashboard
4. Set up a webhook pointing to `https://yourdomain.com/api/revalidate?secret=YOUR_SANITY_REVALIDATE_SECRET` to trigger ISR on content publish

### Supabase

1. Create a project at supabase.com (free tier: 500 MB database, 50K auth users)
2. Enable Email auth with magic link in Authentication settings
3. Create the following tables (see `docs/specs/2026-03-27-1200-handofya-redesign/shape.md` for full schemas):
   - `customers` — account profiles linked to Supabase auth users
   - `orders` — order records created by the Stripe webhook
   - `subscriptions` — active subscription records linked to Stripe subscription IDs
   - `wishlists` — saved product slugs per customer
4. Add your Supabase URL and keys to your environment variables

### Stripe

1. Add your Stripe API keys to environment variables
2. Enable Stripe Tax for US compliance
3. Create products and prices in the Stripe dashboard to match your Sanity catalog
4. Create subscription prices (monthly, bi-monthly, quarterly) for eligible products
5. Configure the webhook endpoint in the Stripe dashboard pointing to `/api/webhooks/stripe`
6. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### Listmonk (Email)

1. Deploy Listmonk on Render using the official Docker image (see Listmonk docs for Render setup)
2. Configure an SMTP relay — Amazon SES or Postmark recommended for deliverability
3. Set up SPF, DKIM, and DMARC DNS records for handofya.com
4. Create an order confirmation transactional template and a newsletter subscriber list
5. Copy your Listmonk URL, credentials, and list ID to environment variables

## Testing

The test suite is Playwright E2E, covering all critical flows: product browsing, add to cart, checkout, auth, subscriptions, and wishlists.

```bash
cd web
npx playwright test
```

Run a specific test file:

```bash
npx playwright test tests/checkout.spec.ts
```

See `docs/tests.md` for the full test specification (91 framework-agnostic specs).

## Documentation

| File | Contents |
|------|----------|
| `docs/prd.md` | Product requirements, user stories, functional requirements |
| `docs/architecture.md` | Architecture decision record — three approaches evaluated, Approach 1 chosen |
| `docs/design/brand-identity.md` | Color palette, typography, brand voice, logo, spacing |
| `docs/design/design-tokens.md` | CSS custom properties and Tailwind token reference |
| `docs/design/design-prototype.md` | Design prototype and visual review notes |
| `docs/roadmap.md` | Pre-launch checklist and post-launch feature roadmap |
| `docs/CHANGELOG.md` | Full change history across all phases |
| `docs/tests.md` | Test specifications |
| `docs/specs/` | Phase 1.5 spec artifacts: data models, API surface, standards, references |

## License

TBD
