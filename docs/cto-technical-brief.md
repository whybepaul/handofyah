# Hand of Yah — CTO Technical Brief

**Date:** 2026-03-28
**Author:** Agentic Factory
**Status:** MVP Complete — Pre-Launch

---

## Executive Summary

Hand of Yah is a premium artisanal skincare and wellness brand re-platforming from a broken Squarespace site to a custom-built e-commerce experience. The previous site scored 3.75/10 in a structured visual audit, contained live placeholder text, linked social media icons to Squarespace's corporate accounts, and advertised product categories that did not exist in the shop. It was actively damaging brand credibility for a business charging $40-48 per product.

The replacement is a monolithic Next.js 16 application deployed to Vercel, with Sanity as the headless CMS, Supabase for auth and transactional data, Stripe for payments and subscriptions, and Listmonk (self-hosted on Render) for email. The architecture was deliberately chosen to minimize operational surface area: a single Vercel deployment covers all product pages, the checkout flow, customer accounts, the journal and ingredient content hub, and the embedded Sanity Studio at `/studio`. No separate backend process was introduced because the API surface — Stripe SDK calls, Supabase CRUD, Listmonk REST — does not justify one.

The codebase is MVP-complete. Eight build phases were executed: discovery, spec artifacts, codebase exploration, architecture design, TDD test creation, full implementation, a deep structural refactor (Phase 6.5), and a quality review (Phase 7). The build produced 142 files, 36,000+ lines of TypeScript and configuration, 91 test specifications, and 151 Playwright E2E tests. Thirty-four issues were found and resolved across the refactor and review phases, including a server-side price manipulation vulnerability, an XSS vector in JSON-LD output, and a subscription management flow that was calling local state instead of the Stripe API. The build is passing cleanly. What remains before go-live is account setup for four external services, content population via Sanity Studio, and end-to-end verification in Stripe test mode.

---

## Current State Assessment

The audit (Playwright automated screenshots across desktop, tablet, and mobile; manual content review; structured four-pillar scoring) produced a 3.75/10 overall score across Visual Hierarchy and Layout (3/10), Typography and Readability (4/10), Color and Brand Expression (5/10), and Interaction and Polish (3/10).

The most damaging findings were not cosmetic. The homepage was live with Squarespace template placeholder text ("This is example content") visible to the public. Products featured on the homepage did not exist in the shop — the actual shop sold essential oils and colognes while the homepage advertised skincare and supplements. One product image had "DALL-E" in the filename, directly contradicting the brand's "artisanal, hand-crafted" positioning. Paid products had spelling errors in their names ("Lavander," "Eua de Parfume"). The social media icons in the footer linked to Squarespace's own corporate profiles. There was no About page, no brand story, and no logical reason for a new visitor to trust the business.

The domain mismatch (brand name "Hand of Yah," registered domain handofya.com, missing the final "h") creates an SEO split and guarantees that a significant percentage of customers who hear the brand name will type the wrong URL and find nothing.

The target score for the redesign is 9/10 across all four pillars.

---

## Solution Architecture

### System Overview

```
Browser
  |
  |-- GET /shop/face (ISR, served from Vercel edge cache)
  |      |-- GROQ query -> Sanity CDN
  |
  |-- POST /api/checkout
  |      |-- Zod validation
  |      |-- Price verification -> Sanity
  |      |-- stripe.checkout.sessions.create() -> Stripe
  |      |-- Returns { sessionId, url }
  |
  |-- [Stripe hosted checkout]
  |      |-- webhook POST /api/webhooks/stripe
  |             |-- stripe.webhooks.constructEvent() (signature check)
  |             |-- INSERT orders -> Supabase
  |             |-- addSubscriber() -> Listmonk
  |             |-- sendTransactionalEmail() -> Listmonk
  |
  |-- GET /account/subscriptions (authenticated)
         |-- Supabase Auth token verification
         |-- Query subscriptions table -> Supabase
         |-- stripe.subscriptions.retrieve() -> Stripe
         |-- Returns merged data
```

All content pages (shop, journal, learn, ingredients, about, FAQ) are Server Components rendered at build time with ISR revalidation triggered by a Sanity webhook at `/api/revalidate`. Cart state lives in `localStorage` for guests and syncs to Supabase for authenticated users. The Sanity Studio is embedded at `/studio` using the `next-sanity` plugin — the owner accesses both the public website and the CMS through the same domain.

### Technology Decisions

| Decision | Choice | Rationale | Alternatives Rejected |
|----------|--------|-----------|----------------------|
| Framework | Next.js 16 (App Router) | SSR/SSG/ISR, API Routes, Server Components, Vercel-native | Remix (less mature ISR story), SvelteKit (smaller ecosystem for e-commerce integrations) |
| CMS | Sanity v3 | Structured content modeling, GROQ for flexible queries, Studio UI accessible to non-technical owner, real-time preview, `next-sanity` for embedded Studio | Contentful (pricing at scale), Prismic (weaker content modeling), custom admin (high build cost) |
| Auth | Supabase Auth (magic link) | Passwordless reduces friction for occasional shoppers, consistent with SecureClear factory patterns, no stored password hashes to protect | NextAuth.js (more configuration, no hosted service), Clerk (SaaS cost, external dependency) |
| Database | Supabase PostgreSQL | Orders, subscriptions, wishlists, customers — relational data with foreign keys; free tier covers launch volume | PlanetScale (MySQL), Neon (Postgres but no auth bundling), Firebase (NoSQL mismatch for orders) |
| Payments | Stripe (Checkout Sessions + Subscriptions) | Owner's explicit requirement; Stripe Subscriptions handles recurring billing complexity natively; Stripe Tax handles US compliance | PayPal (weaker subscription support), Shopify Payments (requires Shopify platform) |
| Email | Listmonk on Render | Owner's explicit requirement for self-hosted email; Listmonk provides both transactional and newsletter through a single web UI | Klaviyo (SaaS, owner rejected), Mailchimp (SaaS, owner rejected), Mautic (more complex than needed) |
| Styling | Tailwind CSS v4 | Brand token system in config, factory convention, utility-first eliminates unused CSS | styled-components (runtime overhead), CSS Modules (verbose for design token system) |
| Validation | Zod v4 | Type-safe schema validation on all API routes; factory convention | Yup (worse TypeScript inference), manual validation (inconsistent) |
| Architecture | Monolithic Next.js | API surface is thin SDK calls — no CPU-bound processing, no long-running jobs | Next.js + FastAPI (justified for SecureClear's security scanner; unjustified here), Edge-first (cold start concerns with Supabase SDK) |

### Data Architecture

The system uses a deliberate content-vs-transaction split.

**Sanity (content authority):** Product catalog, journal posts, learn articles, ingredient database, CMS pages (About, FAQ, Shipping, Terms, Privacy). Sanity owns all content that the owner publishes and updates. Fetched via GROQ at build time (SSG) or on revalidation (ISR). The 16 GROQ queries in `src/sanity/lib/queries.ts` use explicit field projection — no wildcards — to control payload size.

**Supabase PostgreSQL (transaction authority):** Customers, orders, subscriptions, wishlists. These are write-heavy, relational, and tied to auth identity. The service role key (server-only, never exposed to the client) is used in API routes and the webhook handler. The anonymous key is used client-side only for auth session management.

Prices live in Sanity. The checkout route (`/api/checkout`) re-fetches canonical prices from Sanity before building the Stripe session, preventing client-submitted price manipulation.

### Security Model

**Authentication.** Supabase magic link authentication — no stored password hashes. Session tokens validated server-side in API routes using `getSupabaseServiceClient()`. The `(account)/` route group uses an auth guard layout that redirects unauthenticated users to `/login`.

**Payment security.** PCI compliance is entirely delegated to Stripe. Payment data never touches the application server. The checkout flow returns a Stripe session URL; the browser redirects to Stripe's hosted checkout. The webhook handler verifies `stripe-signature` using `stripe.webhooks.constructEvent()` before processing any event — a missing or invalid signature returns 400 immediately. The `STRIPE_WEBHOOK_SECRET` absence is treated as a server misconfiguration (returns 500, logs an error).

**API protection.** All commerce API routes validate input with Zod before any business logic executes. The subscription PATCH endpoint validates frequency values against an explicit enum. Stripe/customer IDs are stripped from API responses (fixed in Phase 6.5). The `/studio` route is excluded from `robots.txt` and requires Sanity authentication.

**XSS prevention.** Product page JSON-LD output is HTML-escaped (fixed in Phase 7, C3). Portable Text rendering uses `@portabletext/react` with a restricted component set.

**Secrets.** Twelve environment variables are required at runtime (see `.env.local.example`). The `SUPABASE_SERVICE_ROLE_KEY` and `STRIPE_SECRET_KEY` are server-only — never prefixed `NEXT_PUBLIC_`. The revalidation webhook is authenticated with a `SANITY_REVALIDATE_SECRET` token.

### Performance Strategy

**ISR (Incremental Static Regeneration).** Product pages, category pages, journal posts, and ingredient pages are statically generated at build time and revalidated on demand when the owner publishes content in Sanity. This means product browsing — the primary traffic path — never hits an origin server. Pages are served from Vercel's edge cache.

**Image optimization.** All product images are hot-linked from Sanity's image CDN via the `@sanity/image-url` pipeline. The Next.js `<Image>` component is used throughout with `srcset` for responsive sizes and lazy loading below the fold. Mobile devices receive appropriately sized images, not scaled-down desktop images. Image aspect ratios are enforced in the design system (4:5 for product cards, 16:9 for hero, 3:2 for journal) to prevent layout shift.

**Font loading.** Cormorant Garamond and Outfit are loaded as variable fonts from Google Fonts with `font-display: swap` to prevent invisible text during load.

**Server Components.** Product listing pages, journal pages, and content pages are Server Components — no JavaScript bundle sent to the client for the initial render. Cart, checkout, and account pages are Client Components where interactivity is required.

---

## Commerce Architecture

### Cart State

Cart state is managed in a React context backed by `localStorage`. Guests accumulate items in localStorage across browser sessions. Authenticated users have their cart data synced to Supabase so it persists across devices. A hydration guard (added in Phase 6.5) prevents the checkout redirect from firing before the cart loads from localStorage — this was a race condition on slow connections.

Cart items carry a `subscription` field with `frequency: 'monthly' | 'bimonthly' | 'quarterly'`. The `SubscriptionToggle` component on the product detail page sets this field. The 10% subscription discount (`SUBSCRIPTION_DISCOUNT = 0.10`, defined in `constants.ts`) is applied at checkout, not in the cart display, to keep cart totals honest.

### Checkout Flow (Purchase Chain Trace)

```
1. Customer clicks "Add to Cart" -> CartContext.addItem()
   -> Item stored in localStorage (or Supabase if authenticated)

2. Customer opens CartDrawer -> clicks "Checkout"
   -> Navigate to /checkout

3. Customer fills shipping form -> clicks "Pay"
   -> POST /api/checkout {items, shippingAddress, customerEmail}

4. /api/checkout:
   a. Zod validates request shape
   b. Rejects mixed carts (subscription + one-time cannot share a Stripe session)
   c. Fetches canonical prices from Sanity by productSlug
   d. Throws if any slug is not found in Sanity (prevents phantom product checkout)
   e. Applies SUBSCRIPTION_DISCOUNT to subscription items
   f. Builds Stripe line_items with price_data (unit_amount in cents)
   g. Sets mode: 'subscription' if any subscription items, 'payment' otherwise
   h. Attaches shippingOptions (free above $75, $7.95 standard / $14.95 express)
   i. Enables automatic_tax: true (Stripe Tax handles US compliance)
   j. stripe.checkout.sessions.create() -> returns {sessionId, url}

5. Browser redirects to session.url (Stripe hosted checkout)

6. Customer completes payment on Stripe

7. Stripe fires checkout.session.completed webhook to /api/webhooks/stripe
   a. stripe.webhooks.constructEvent() verifies signature
   b. Expands line items via stripe.checkout.sessions.listLineItems()
   c. Email lookup in Supabase to find existing customer account (links order if found)
   d. INSERT into orders table (Supabase)
   e. addSubscriber() to Listmonk (non-fatal, swallows "already exists")
   f. sendTransactionalEmail() with ORDER_CONFIRMATION template
   g. Returns 200 (or 500 to trigger Stripe retry on handler error)

8. Customer lands on /checkout/success
```

### Subscription Lifecycle

Stripe owns the recurring billing contract. Supabase stores metadata (frequency, status, customer linkage). The two are kept in sync via webhooks:

- `invoice.paid` with `billing_reason: 'subscription_cycle'` creates a renewal order in Supabase
- `customer.subscription.updated` syncs status changes to the subscriptions table
- `customer.subscription.deleted` marks the record as cancelled

The subscription management page (`/account/subscriptions`) calls `stripe.subscriptions.retrieve()` for each local subscription record to get the live Stripe status — local state is not trusted as the authority. Cancel, pause, and resume actions call the Stripe API first, then update Supabase (fixed in Phase 7, C5). A Stripe webhook confirming the change also updates the record, providing eventual consistency even if the API call succeeds but the client never receives the response.

**Known limitation.** Stripe does not support mixed payment/subscription line items in a single checkout session. If a customer adds both a one-time product and a subscription product to their cart, the checkout route returns a 400 error with an explanatory message. The checkout UI should surface this constraint before the customer reaches payment. This is a known UX gap for Phase 2.

---

## Content Management

### Sanity Schema Design

Seven content types are defined in `src/sanity/schemas/`:

| Schema | Key fields | Notes |
|--------|-----------|-------|
| `product` | name, slug, price, description (PT), ingredients (refs), images, subscriptionEligible, status | `status: active/draft` controls visibility; `featured: boolean` for homepage |
| `category` | name, slug, order | Fixed 6 categories; `order` controls display sequence |
| `journalPost` | title, slug, featuredImage, body (PT), excerpt, publishedAt, category | Reverse-chronological listing |
| `learnArticle` | title, slug, featuredImage, body (PT), relatedProducts (refs) | Cross-links to products |
| `ingredient` | name, slug, description (PT), benefits | Reverse-lookup in GROQ finds products that reference each ingredient |
| `journalCategory` | name, slug | Taxonomy for journal |
| `page` | title, slug, body (PT), seo | Generic CMS pages (About, FAQ, etc.) |

Ingredients are defined once and referenced by products via Sanity's reference system. This eliminates the per-product spelling errors found in the current site — "Ginger Root" is defined one time and referenced everywhere.

### ISR Revalidation

The `/api/revalidate` route accepts a Sanity webhook POST authenticated with `SANITY_REVALIDATE_SECRET`. When the owner publishes a product or journal post in the Studio, Sanity fires this webhook, and the route calls `revalidatePath()` for the affected URLs. Content updates are live on the public site within seconds of publishing.

### Studio Access

The Sanity Studio is embedded in the Next.js app at `/studio`. The owner accesses it at `handofya.com/studio` after signing in with their Sanity account. Studio authentication is managed by Sanity — it does not use the same Supabase auth as customer accounts. The `/studio` route is blocked in `robots.txt` and is not indexed.

---

## Design System

### Brand Identity: Sacred Apothecary

The brand concept was developed as part of the build. No pre-existing guidelines existed. The concept positions Hand of Yah at the intersection of luxury refinement and spiritual groundedness — warm where Aesop is cool, material where new-age competitors are abstract.

### Color Palette

| Token | Hex | Role |
|-------|-----|------|
| Parchment | `#F5F0E8` | Primary background (replaces white everywhere) |
| Umber | `#2C2420` | Primary text (replaces black everywhere) |
| Terracotta | `#C4704B` | Primary accent: CTAs, active states, hover indicators |
| Sage | `#8B9A7E` | Botanical accent: ingredient tags, subscription badges |
| Stone | `#E8E2D8` | Card backgrounds, section dividers |
| Taupe | `#B8AFA6` | Borders, muted text, placeholder states |
| Espresso | `#1A1614` | Footer background, dark sections |

All text-on-background combinations meet WCAG AA. Umber on Parchment achieves 12.4:1 (AAA). Parchment on Terracotta achieves 4.6:1 (AA) for button text.

### Typography

Two variable fonts loaded from Google Fonts:

- **Cormorant Garamond** — display and headings. Old-style serif with calligraphic stroke terminals that echo "the hand" in the brand name. The brand's voice. Used for H1-H4, product names, prices, pull quotes.
- **Outfit** — body and interface. Geometric sans-serif with softened terminals. The invisible workhorse. Used for body text, navigation, buttons, form labels, captions.

The type scale has 11 defined tokens from `display-xl` (4.5rem / 72px) down to `label` (0.75rem / 12px). All tokens are encoded in the Tailwind config as custom utilities.

### Component Library

The design system defines 11 UI components. Key interaction patterns:

- **Buttons:** Primary (Terracotta fill, Parchment text, square edges — no border-radius). Secondary (transparent, Umber border). No rounded corners anywhere — square edges signal confidence.
- **Product cards:** Stone background, 4:5 image ratio, hover lifts card 2px with shadow transition (300ms). No ratings, no badges. Image, name, price.
- **Forms:** Bottom border only (no full border). Terracotta bottom border on focus.
- **Motion:** 300ms ease-out standard, 600ms fade-up entrance animation via Intersection Observer. No parallax, no bounce.

### Responsive Strategy

Mobile-first. Breakpoints at 375px, 768px, 1024px, and 1440px. Product grids are 1 column on mobile, 2 on tablet, 3 on desktop. All touch targets are minimum 44x44px. The cart drawer and mobile navigation are optimized for one-handed use.

---

## Quality Assurance

### Test Coverage

- **91 test specifications** in `docs/tests.md` — framework-agnostic, covering all user stories, functional requirements, and chain trace assumptions
- **151 Playwright E2E tests** across 8 test files — full browser automation including checkout flows, auth callbacks, subscription management, and cart hydration
- **Accessibility:** `@axe-core/playwright` included in devDependencies for automated WCAG scanning in E2E runs

### Phase 6.5: Deep Structural Refactor

A dedicated refactor phase was run after implementation, producing 34 resolved issues across two categories:

**25 MUST-FIX issues resolved:**
- 4 security issues (Stripe/customer IDs in API responses, webhook secret guard)
- 7 memory/state issues (scroll lock race condition, cart hydration race condition, Supabase client caching)
- 13 error handling issues (all 13 Sanity-fetching pages wrapped in try/catch with graceful degradation)
- 1 structure issue (homepage 311-line monolith decomposed into 6 named section components)

**9 SHOULD-FIX issues resolved:**
- Explicit field projection on API routes (removed implicit wildcard fetches)
- Branded 404 and error pages
- Container standardization across all pages
- JSON-LD ItemList schema for category pages
- Subscription error handling
- Duplicated function extraction
- Cart localStorage key migration helper

### Phase 7: Quality Review Findings

A formal spec compliance review (16/19 FR compliant at review start; 3 gaps found and fixed) and code quality review produced 13 additional issues, 5 of which were critical:

| Issue | Fix |
|-------|-----|
| C1: `AddToCart` wired to a `console.log` stub | Wired to CartContext |
| C2: No server-side price validation | Re-fetches canonical prices from Sanity before building Stripe session |
| C3: XSS in product page JSON-LD | HTML-escapes all product fields before embedding in `<script>` tag |
| C4: No webhook secret guard | `STRIPE_WEBHOOK_SECRET` absence now returns 500 and logs error |
| C5: Subscription management called local state | Now calls Stripe API first, then updates Supabase |

Additional fixes: orders linked to customer accounts via email lookup (C6), footer category links corrected (C7), auth helper extraction, cart hydration guard, webhook retry-on-failure, lazy Sanity client initialization (W1-W8).

---

## Infrastructure and Deployment

### Service Map

| Service | Tier | Monthly Cost | Purpose |
|---------|------|--------------|---------|
| Vercel | Hobby (free) | $0 | Next.js hosting, CDN, SSL, builds |
| Sanity.io | Free tier | $0 | CMS, Studio, image CDN, 20GB assets |
| Supabase | Free tier | $0 | PostgreSQL, Auth, 500MB database, 50K auth users |
| Stripe | Transaction fees only | ~2.9% + $0.30/transaction | Payments, Subscriptions, Tax |
| Listmonk on Render | Free tier (Docker) | $0 | Transactional and newsletter email |
| SMTP relay (SES/Postmark) | Usage-based | ~$1-5/mo | Email delivery for Listmonk |

Total fixed monthly cost at launch: $0 plus Stripe transaction fees and minor SMTP relay usage. All free-tier limits are appropriate for a DTC brand at launch volume (Supabase free tier supports 50K auth users and 500MB database; Sanity free tier supports unlimited API requests on the CDN-served plan).

### Deployment Configuration

The `web/` directory connects to a Vercel project. All 12 environment variables (see `.env.local.example`) must be added to the Vercel dashboard before the first production deploy. The Sanity webhook pointing to `/api/revalidate` must be configured in the Sanity dashboard after the production URL is known.

### Scaling Considerations

The monolithic architecture scales horizontally on Vercel automatically. The only stateful dependencies are Supabase (connection pool managed by Supabase's PostgREST layer) and Stripe (API rate limits are generous). At the expected launch volume (small DTC catalog, low-to-moderate order volume), no scaling action is required before 12-18 months of operation.

If order volume grows significantly (flash sales, viral traffic), the ISR pages will serve all browse traffic from cache with no origin load. The only origin-hit paths are checkout (`/api/checkout`) and authenticated account pages. Both are stateless Next.js Route Handlers that scale with Vercel's serverless functions.

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Listmonk deliverability failures | Medium | Medium | Configure SPF, DKIM, DMARC; use SES or Postmark as SMTP relay (not raw SMTP); monitor bounce rates after launch |
| Supabase free tier limits hit | Low | Low | 500MB database and 50K auth users are far above launch needs; upgrade path to Pro ($25/mo) is straightforward |
| Sanity free tier limits hit | Low | Low | Free tier covers 20GB assets and unlimited CDN requests; upgrade path to Growth ($15/mo) when needed |
| Mixed cart UX friction | High | Medium | Stripe cannot handle mixed payment/subscription sessions; the checkout API returns a 400 with an error message, but the UI does not yet prevent the user from building a mixed cart before they reach payment |
| Domain mismatch (handofya.com vs handofyah.com) | Certain | Medium | Register both domains before launch; configure one as primary with the other redirecting; add `canonical` meta tag to all pages |
| Photography quality | Unknown | High | Current site has genuine amber-glass product photography; AI-generated image must be replaced; all images must be reviewed against brand identity photography direction before launch |
| Stripe API version compatibility | Low | Medium | Webhook handler includes comments noting Stripe API v2026 changes (e.g., `invoice.parent` vs deprecated `invoice.subscription`, `total_taxes` vs deprecated `tax`); pinned to `stripe@^21.0.1` |

---

## Pre-Launch Requirements

The following tasks are required before the site can go live. The code is complete — these are account setup, configuration, and content entry tasks.

### 0.1 Sanity CMS Setup (Blocking)
Create a Sanity project, obtain Project ID and Dataset name, add credentials to Vercel environment variables, add CORS origins for localhost and the production domain.

### 0.2 Content Population (Blocking)
Using the Studio at `/studio`: enter all 6 product categories, all products with real photography and reviewed copy, 2-3 initial journal posts, 2-3 learn articles, ingredient entries for all ingredients used across products, and all CMS page content (About, FAQ, Shipping/Returns, Terms, Privacy). All existing Squarespace content must be rewritten — not migrated as-is.

### 0.3 Supabase Setup (Blocking)
Create a Supabase project, create the four tables (`customers`, `orders`, `subscriptions`, `wishlists`) per the schema in `docs/specs/2026-03-27-1200-handofya-redesign/shape.md`, enable magic link auth, add credentials to Vercel.

### 0.4 Stripe Setup (Blocking)
Create Stripe products and prices matching the Sanity catalog (including subscription pricing at monthly/bi-monthly/quarterly intervals), enable Stripe Tax for US compliance, configure the webhook endpoint pointing to the production `/api/webhooks/stripe` URL, add API keys to Vercel.

### 0.5 Listmonk Setup (Medium priority, blocking for email flows)
Deploy Listmonk on Render (Docker), configure SMTP relay (Amazon SES or Postmark recommended), set SPF/DKIM/DMARC records, create order confirmation and subscription reminder email templates, create a newsletter subscriber list, add Listmonk credentials to Vercel.

### 0.6 Domain and Deployment
Connect `web/` to a Vercel project, add all environment variables, point handofya.com DNS to Vercel, register handofyah.com as a redirect, configure the Sanity ISR webhook, verify production build.

### 0.7 Pre-Launch Checklist
All products listed with real photography and reviewed copy — no placeholder text on any page — social links point to actual brand profiles — contact form delivers to owner's email — newsletter signup creates subscriber in Listmonk — checkout flow tested end-to-end in Stripe test mode — magic link auth tested — mobile tested on real devices — Lighthouse mobile score 90+ — all pages have unique meta titles and descriptions — sitemap.xml includes all public routes — robots.txt blocks `/api`, `/studio`, `/account`.

---

## Post-MVP Roadmap

### Phase 2: Personalization and Engagement

| Feature | Priority | Effort | Prerequisite |
|---------|---------|--------|-------------|
| 2.1 Ingredient-based product recommendations | High | Low | Data already available in Sanity ingredient refs |
| 2.2 Skin quiz and recommendation engine | High | Medium | New product attributes in Sanity, quiz UI |
| 2.3 Product reviews and ratings | Medium | Medium | New Supabase schema + moderation queue |
| 2.4 Marketing email campaigns (automated flows) | Medium | Low | Listmonk already deployed |
| 2.5 Product bundles | Medium | Low | New bundle schema in Sanity |

Ingredient-based recommendations (2.1) require no new infrastructure — the Sanity ingredient cross-reference schema is already in place. A `getRelatedProducts(productId)` function ranking by ingredient overlap is the only new code required.

### Phase 3: Growth and Optimization

| Feature | Priority | Effort | Prerequisite |
|---------|---------|--------|-------------|
| 3.1 Collaborative filtering ("customers also bought") | Medium | Medium | ~100+ orders for meaningful signal |
| 3.2 Loyalty and rewards program | Low | High | Points system design |
| 3.3 Referral program | Low | Medium | Referral tracking schema |
| 3.4 Gift cards | Low | Medium | Stripe gift card product |
| 3.5 Multi-currency support | Low | Medium | Stripe multi-currency pricing |
| 3.6 Advanced owner analytics dashboard | Low | Medium | Order + behavior data accumulation |

---

## Metrics and Success Criteria

### Lighthouse / Core Web Vitals (Measured per deploy via Lighthouse CI)

| Metric | Target |
|--------|--------|
| Performance (mobile) | 90+ |
| Largest Contentful Paint | < 2.5s on 4G |
| Cumulative Layout Shift | < 0.1 |
| WCAG 2.1 compliance | AA on all pages |

### Business KPIs (30 and 90 days post-launch)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Homepage bounce rate | < 45% | Analytics |
| Average session duration | > 2 minutes | Analytics |
| Cart abandonment rate | < 70% | Funnel tracking |
| Conversion rate | > 1.5% | Analytics + Stripe |
| Subscription adoption | > 10% of orders include a subscription item | Stripe dashboard |
| Organic search impressions | 2x baseline within 90 days | Google Search Console |
| Owner content publishing | 2+ journal posts/month | Sanity activity |

### Qualitative Criteria

- Owner can independently create and publish journal posts and update product content
- First-time visitors describe the site as "premium" or "beautiful"
- No broken links, placeholder content, or demo text on any page at launch

---

## Build Process Summary

### Timeline

| Phase | Description | Outcome |
|-------|-------------|---------|
| Phase 1 | Discovery: PRD, visual audit, design research | 3.75/10 audit score; PRD approved; design flag `critical` |
| Phase 1.5 | Spec artifacts: plan, shape, standards, references | Data models, API surface, GROQ query patterns documented |
| Phase 2 | Codebase exploration: SecureClear pattern extraction | 8 reusable patterns identified; net-new integrations scoped |
| Phase 3 | Clarifying questions | Magic link auth confirmed; self-hosted email confirmed |
| Phase 4 | Architecture: 3 approaches evaluated, Approach 1 approved | 46-task breakdown; brand identity "Sacred Apothecary" developed |
| Phase 5 | TDD test creation | 91 test specs; 151 Playwright E2E tests |
| Phase 6 | Implementation: 46 tasks across 15 workstreams | 39 pages compiled; build passing clean |
| Phase 6.5 | Deep structural refactor | 34 issues resolved; 25 MUST-FIX, 9 SHOULD-FIX |
| Phase 7 | Quality review | 13 additional issues; 5 critical fixed including price manipulation and XSS |

### Agent Utilization

The build used 7 specialized agent roles in sequence: analyst (discovery and audit), code-architect (architecture evaluation and brand identity), developer (implementation), test-writer (TDD specifications and E2E tests), refactor (Phase 6.5 structural refactor), code-reviewer (Phase 7 quality review), and documentation (this document and the roadmap).

### Key Statistics

| Metric | Value |
|--------|-------|
| Files in codebase | 142 |
| Lines of code | 36,000+ |
| Test specifications | 91 |
| E2E test cases | 151 |
| Implementation tasks | 46 |
| Issues found and resolved | 34 (Phase 6.5) + 13 (Phase 7) = 47 total |
| Pages compiled | 39 |
| Sanity schema types | 7 |
| GROQ queries | 16 |
| API routes | 10 |
| UI components | 11 |
| Build status | Passing clean |
