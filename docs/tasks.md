# Hand of Yah -- Task Breakdown

**Approach:** Monolithic Next.js (Approach 1)
**Total Tasks:** 17 (grouped into 15 workstreams)
**Created:** 2026-03-27

---

## Task Dependency Graph

```
T1 (Scaffold)
 ├── T2 (Tailwind) ─── T8 (Global Styles) ─── T9 (UI Components)
 ├── T3 (Supabase)                              │
 ├── T4 (Sanity) ──── T11, T12 (Schemas) ────── T13 (GROQ Queries)
 ├── T5 (Stripe)                                 │
 ├── T6 (Listmonk)                               T14 (Studio)
 └── T7 (Types)
                    T10 (PortableText) ──┐
                                         │
 T15 (Root Layout) ─────────────────────┐│
 T16 (Header) ── T18 (MobileNav)       ││
 T17 (Footer)                          ││
 T19 (CartDrawer)                      ││
                                       ││
 T20 (Product Components) ─────────────┤│
 T21 (Subscription/AddToCart) ─────────┤│
 T22 (Shop + Category Pages) ─────────┤│
 T23 (Product Detail Page) ───────────┤│
                                      ││
 T24 (Cart State) ────────────────────┤│
 T25 (Cart Components) ──────────────┤│
 T26 (Cart Page) ────────────────────┤│
                                     ││
 T27 (Checkout API) ─────────────────┤│
 T28 (Stripe Webhook) ──────────────┤│
 T29 (Checkout Page) ───────────────┤│
 T30 (Success Page) ────────────────┤│
                                    ││
 T31 (Auth Pages) ──────────────────┤│
 T32 (Account Layout) ─────────────┤│
 T33 (Dashboard + Settings) ───────┤│
 T34 (Orders) ─────────────────────┤│
 T35 (Subscriptions) ──────────────┤│
 T36 (Wishlist) ───────────────────┤│
                                   ││
 T37 (Journal) ────────────────────┤│
 T38 (Learn) ──────────────────────┤│
 T39 (Ingredients) ────────────────┤│
 T40 (Info Pages + Contact/Newsletter API) ┤
                                   │
 T41 (Homepage) ───────────────────┤
 T42 (SEO) ────────────────────────┤
 T43 (Revalidation Webhook) ──────┤
 T44 (Performance) ────────────────┤
 T45 (E2E Tests) ─────────────────┤
 T46 (Deployment) ─────────────────┘
```

---

## G1: Project Scaffolding

### T1: Initialize Next.js 15 project with App Router and TypeScript

**Definition of Ready:**
- PRD and architecture documents reviewed
- Node.js 20.x installed locally
- Sanity project created (project ID and dataset name available)
- Supabase project created (URL and anon key available)
- Stripe account available (publishable and secret keys)

**Definition of Done:**
- `projects/handofya/web/` directory contains a valid Next.js 15 project
- `npm run build` succeeds with zero errors
- `npx tsc --noEmit` passes with strict mode
- `.gitignore` excludes node_modules, .next, .env.local
- `.env.local.example` lists all required environment variables with comments

**Files:**
- `projects/handofya/web/package.json`
- `projects/handofya/web/next.config.ts`
- `projects/handofya/web/tsconfig.json`
- `projects/handofya/web/postcss.config.js`
- `projects/handofya/web/.gitignore`
- `projects/handofya/web/.env.local.example`

**Depends on:** Nothing (first task)

---

### T2: Configure Tailwind with placeholder brand tokens

**Definition of Ready:**
- T1 complete

**Definition of Done:**
- `tailwind.config.ts` extends theme with colors (earthy palette placeholder), fontFamily (serif + sans placeholder), borderRadius, spacing
- Build succeeds
- Tokens are used by global styles in T8

**Files:** `projects/handofya/web/tailwind.config.ts`

**Depends on:** T1

---

### T3: Set up Supabase client singleton

**Definition of Ready:**
- T1 complete
- Supabase project created with auth enabled (magic link provider)

**Definition of Done:**
- `lib/supabase.ts` exports `getSupabaseClient()` matching SecureClear pattern
- `lib/supabase-server.ts` exports server-side client using service role key
- `@supabase/supabase-js` and `@supabase/ssr` installed
- TypeScript compiles without errors

**Files:**
- `projects/handofya/web/src/lib/supabase.ts`
- `projects/handofya/web/src/lib/supabase-server.ts`

**Depends on:** T1

---

### T4: Set up Sanity client and configuration

**Definition of Ready:**
- T1 complete
- Sanity project ID and dataset name available

**Definition of Done:**
- `sanity/config.ts` exports project configuration
- `lib/sanity.ts` exports `sanityClient` and `sanityFetch<T>()` helper
- `lib/sanity-image.ts` exports `urlForImage()` builder
- `next-sanity`, `@sanity/image-url`, `@portabletext/react`, `sanity` installed
- `next.config.ts` allows Sanity CDN image domain
- TypeScript compiles without errors

**Files:**
- `projects/handofya/web/src/sanity/config.ts`
- `projects/handofya/web/src/lib/sanity.ts`
- `projects/handofya/web/src/lib/sanity-image.ts`

**Depends on:** T1

---

### T5: Set up Stripe server and client initialization

**Definition of Ready:**
- T1 complete
- Stripe account keys available

**Definition of Done:**
- `lib/stripe.ts` exports `getStripeServer()` singleton (server-only)
- `lib/stripe-client.ts` exports `getStripePromise()` for client-side
- `stripe`, `@stripe/stripe-js`, `@stripe/react-stripe-js` installed
- TypeScript compiles without errors

**Files:**
- `projects/handofya/web/src/lib/stripe.ts`
- `projects/handofya/web/src/lib/stripe-client.ts`

**Depends on:** T1

---

### T6: Create Listmonk API client

**Definition of Ready:**
- T1 complete
- Listmonk API documentation reviewed

**Definition of Done:**
- `lib/listmonk.ts` exports `sendTransactionalEmail()` and `addSubscriber()`
- Uses fetch with Basic Auth
- TypeScript compiles without errors

**Files:** `projects/handofya/web/src/lib/listmonk.ts`

**Depends on:** T1

---

### T7: Create shared TypeScript types and constants

**Definition of Ready:**
- T1 complete
- shape.md data structures reviewed

**Definition of Done:**
- `lib/types.ts` contains all interfaces: Product, Category, JournalPost, LearnArticle, Ingredient, Page, CartItem, Order, Subscription, WishlistItem, Customer, Address, CheckoutRequest, CheckoutResponse
- `lib/constants.ts` contains SITE_URL, CATEGORIES, SUBSCRIPTION_FREQUENCIES, SHIPPING_METHODS
- TypeScript compiles without errors

**Files:**
- `projects/handofya/web/src/lib/types.ts`
- `projects/handofya/web/src/lib/constants.ts`

**Depends on:** T1

---

## G2: Design System

### T8: Create global styles with Tailwind layers and component classes

**Definition of Ready:**
- T2 complete (Tailwind configured)

**Definition of Done:**
- `globals.css` contains Tailwind directives
- `@layer base` sets body defaults, smooth scrolling, antialiasing
- `@layer components` defines: `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.section-container`, `.input-field`, `.product-card`, heading and body text classes
- Build succeeds

**Files:** `projects/handofya/web/src/app/globals.css`

**Depends on:** T2

---

### T9: Build core UI components

**Definition of Ready:**
- T8 complete (global styles available)

**Definition of Done:**
- `Button.tsx` renders with variants (primary, secondary, ghost), sizes (sm, md, lg), disabled and loading states
- `Input.tsx` renders with label, error state, required indicator
- `NewsletterForm.tsx` accepts email, submits to POST /api/newsletter, shows success/error states
- `SocialShare.tsx` renders share buttons for copy-link, Instagram, Facebook, Twitter
- All components use Tailwind classes from globals.css
- TypeScript compiles without errors

**Files:**
- `projects/handofya/web/src/components/ui/Button.tsx`
- `projects/handofya/web/src/components/ui/Input.tsx`
- `projects/handofya/web/src/components/ui/NewsletterForm.tsx`
- `projects/handofya/web/src/components/ui/SocialShare.tsx`

**Depends on:** T8

---

### T10: Build content rendering components

**Definition of Ready:**
- T4 complete (Sanity client available)
- T8 complete (global styles available)

**Definition of Done:**
- `PortableText.tsx` wraps `@portabletext/react` with custom serializers for headings, images (using Sanity image pipeline), links, lists, block quotes
- Component renders Sanity Portable Text content correctly
- TypeScript compiles without errors

**Files:** `projects/handofya/web/src/components/content/PortableText.tsx`

**Depends on:** T4, T8

---

## G3: Sanity CMS Schemas and Studio

### T11: Create Sanity schemas (Product, Category, Ingredient)

**Definition of Ready:**
- T4 complete (Sanity config available)
- shape.md data models reviewed

**Definition of Done:**
- `product.ts` schema matches shape.md Product model with all fields, validation rules, and preview configuration
- `category.ts` schema with name, slug, description, order
- `ingredient.ts` schema with name, slug, description (Portable Text), benefits array
- All schemas export valid Sanity document definitions
- TypeScript compiles without errors

**Files:**
- `projects/handofya/web/src/sanity/schemas/product.ts`
- `projects/handofya/web/src/sanity/schemas/category.ts`
- `projects/handofya/web/src/sanity/schemas/ingredient.ts`

**Depends on:** T4

---

### T12: Create Sanity schemas (Journal, Learn, Page)

**Definition of Ready:**
- T4 complete

**Definition of Done:**
- `journalPost.ts` schema with all fields from shape.md
- `journalCategory.ts` schema with name and slug
- `learnArticle.ts` schema with relatedProducts references
- `page.ts` generic page schema for About, FAQ, Terms, etc.
- `index.ts` exports all schemas as a single array
- TypeScript compiles without errors

**Files:**
- `projects/handofya/web/src/sanity/schemas/journalPost.ts`
- `projects/handofya/web/src/sanity/schemas/journalCategory.ts`
- `projects/handofya/web/src/sanity/schemas/learnArticle.ts`
- `projects/handofya/web/src/sanity/schemas/page.ts`
- `projects/handofya/web/src/sanity/schemas/index.ts`

**Depends on:** T4

---

### T13: Create GROQ query library

**Definition of Ready:**
- T11 and T12 complete (schemas define the queryable structure)

**Definition of Done:**
- `queries.ts` contains typed GROQ strings for: allProducts, productsByCategory, productBySlug, allCategories, allJournalPosts (paginated), journalPostBySlug, allLearnArticles, learnArticleBySlug, allIngredients, ingredientBySlug, pageBySlug, featuredProducts, relatedProducts
- Each query selects only the fields needed by its page component (no over-fetching)
- TypeScript compiles without errors

**Files:** `projects/handofya/web/src/sanity/lib/queries.ts`

**Depends on:** T11, T12

---

### T14: Embed Sanity Studio at /studio route

**Definition of Ready:**
- T11 and T12 complete (schemas available for Studio)
- Sanity project configured with CORS origin for localhost and production domain

**Definition of Done:**
- `/studio` route renders the Sanity Studio UI
- Studio shows all document types: Products, Categories, Journal Posts, Learn Articles, Ingredients, Pages
- Studio uses Sanity's built-in authentication
- `npm run build` succeeds (Studio route builds correctly)

**Files:** `projects/handofya/web/src/app/studio/[[...tool]]/page.tsx`

**Depends on:** T11, T12

---

## G4: Global Layout

### T15: Build root layout with metadata, fonts, and page shell

**Definition of Ready:**
- T8, T9 complete (styles and components available)

**Definition of Done:**
- `layout.tsx` exports metadata (title, description, OG tags for handofya.com)
- Fonts loaded (self-hosted or via next/font)
- Body has Header, main (children), Footer
- HTML lang="en"
- Build succeeds

**Files:** `projects/handofya/web/src/app/layout.tsx`

**Depends on:** T8, T9

---

### T16: Build Header with desktop navigation and mobile trigger

**Definition of Ready:**
- T8, T9 complete

**Definition of Done:**
- Desktop: logo (left), nav links center (Shop dropdown, Journal, Learn, About), icons right (Account, Cart with count badge)
- Mobile: logo (left), hamburger + cart icon (right)
- Shop dropdown shows 6 categories
- Sticky on scroll
- Keyboard navigable
- TypeScript compiles without errors

**Files:** `projects/handofya/web/src/components/layout/Header.tsx`

**Depends on:** T8, T9

---

### T17: Build Footer

**Definition of Ready:**
- T8, T9 complete

**Definition of Done:**
- Navigation links, policy links, newsletter form, social media icons, copyright
- Responsive layout
- TypeScript compiles without errors

**Files:** `projects/handofya/web/src/components/layout/Footer.tsx`

**Depends on:** T8, T9

---

### T18: Build MobileNav slide-out drawer

**Definition of Ready:**
- T16 complete (Header triggers MobileNav)

**Definition of Done:**
- Slide-out animation (smooth transform + opacity)
- All nav links present with expandable Shop categories
- Focus trap active when open
- ESC key closes drawer
- Aria attributes for accessibility
- TypeScript compiles without errors

**Files:** `projects/handofya/web/src/components/layout/MobileNav.tsx`

**Depends on:** T8, T16

---

### T19: Build CartDrawer slide-out component

**Definition of Ready:**
- T8, T9 complete

**Definition of Done:**
- Slides in from right
- Shows cart line items with thumbnails, names, quantities, prices, subscription badges
- Shows subtotal
- "View Cart" and "Checkout" buttons
- Empty state with "Continue Shopping" link
- Focus trap and ESC to close
- TypeScript compiles without errors

**Files:** `projects/handofya/web/src/components/layout/CartDrawer.tsx`

**Depends on:** T8, T9

---

## G5: Product Catalog

### T20: Build product components

**Definition of Ready:**
- T8 complete (styles)
- T13 complete (GROQ queries available)

**Definition of Done:**
- `ProductCard.tsx` displays product image (next/image + Sanity CDN), name, price, link to detail page
- `ProductGrid.tsx` renders responsive grid (1/2/3 columns)
- `ProductImages.tsx` renders gallery with main image + thumbnails, zoom on interaction
- All images have consistent aspect ratios
- TypeScript compiles without errors

**Files:**
- `projects/handofya/web/src/components/product/ProductCard.tsx`
- `projects/handofya/web/src/components/product/ProductGrid.tsx`
- `projects/handofya/web/src/components/product/ProductImages.tsx`

**Depends on:** T8, T13

---

### T21: Build SubscriptionToggle and AddToCart components

**Definition of Ready:**
- T8, T9 complete

**Definition of Done:**
- `SubscriptionToggle.tsx` toggles between one-time and subscription; shows frequency dropdown when subscription selected
- `AddToCart.tsx` adds item to cart with correct subscription metadata; shows loading state; opens CartDrawer on success
- TypeScript compiles without errors

**Files:**
- `projects/handofya/web/src/components/product/SubscriptionToggle.tsx`
- `projects/handofya/web/src/components/product/AddToCart.tsx`

**Depends on:** T8, T9

---

### T22: Build Shop page and Category pages

**Definition of Ready:**
- T13, T15, T20 complete

**Definition of Done:**
- `/shop` renders all active products in a grid
- `/shop/[category]` renders products filtered by category with heading and description
- `generateStaticParams()` returns all 6 category slugs
- `generateMetadata()` returns unique title/description per category
- `npm run build` succeeds (SSG pages generated)

**Files:**
- `projects/handofya/web/src/app/(shop)/shop/page.tsx`
- `projects/handofya/web/src/app/(shop)/shop/[category]/page.tsx`

**Depends on:** T13, T15, T20

---

### T23: Build Product Detail Page

**Definition of Ready:**
- T13, T15, T20, T21, T10 complete

**Definition of Done:**
- `/shop/[slug]` renders two-column layout (desktop) or single column (mobile)
- Displays: ProductImages, product name, price, SubscriptionToggle (if eligible), AddToCart, description (PortableText), ingredients with links, usage instructions, related products (3-item grid)
- `generateStaticParams()` returns all product slugs
- `generateMetadata()` uses product SEO fields
- `npm run build` succeeds

**Files:** `projects/handofya/web/src/app/(shop)/shop/[slug]/page.tsx`

**Depends on:** T13, T15, T20, T21, T10

---

## G6: Shopping Cart

### T24: Implement cart state management

**Definition of Ready:**
- T7 complete (CartItem type defined)

**Definition of Done:**
- `lib/cart.ts` exports: getCart(), addToCart(), updateQuantity(), removeFromCart(), clearCart(), getCartTotal()
- Guest cart persists in localStorage
- Cart state shared across components (React context or zustand)
- Header cart badge updates reactively on add/remove
- TypeScript compiles without errors

**Files:** `projects/handofya/web/src/lib/cart.ts`

**Depends on:** T7

---

### T25: Build CartLineItem and CartSummary components

**Definition of Ready:**
- T8, T9, T24 complete

**Definition of Done:**
- `CartLineItem.tsx` shows image, name, price, quantity selector, line total, subscription badge, remove button
- `CartSummary.tsx` shows subtotal, shipping estimate, tax estimate, total, checkout button
- TypeScript compiles without errors

**Files:**
- `projects/handofya/web/src/components/cart/CartLineItem.tsx`
- `projects/handofya/web/src/components/cart/CartSummary.tsx`

**Depends on:** T8, T9, T24

---

### T26: Build full Cart page

**Definition of Ready:**
- T24, T25, T15 complete

**Definition of Done:**
- `/cart` renders cart line items and summary
- Empty state shows "Your cart is empty" with link to /shop
- "Proceed to Checkout" links to /checkout
- Uses (checkout) route group
- Build succeeds

**Files:** `projects/handofya/web/src/app/(checkout)/cart/page.tsx`

**Depends on:** T24, T25, T15

---

## G7: Stripe Checkout and Subscriptions

### T27: Build checkout API route

**Definition of Ready:**
- T5, T3, T7 complete
- Stripe account configured with products/prices (or using dynamic price_data)
- Zod installed

**Definition of Done:**
- POST /api/checkout validates input with Zod
- Creates or retrieves Stripe Customer for authenticated users
- Creates Stripe Checkout Session (mode: payment or subscription)
- Returns { sessionId, url }
- Handles errors with appropriate status codes (400, 401, 500)
- TypeScript compiles without errors

**Files:** `projects/handofya/web/src/app/api/checkout/route.ts`

**Depends on:** T5, T3, T7

---

### T28: Build Stripe webhook handler

**Definition of Ready:**
- T5, T3, T6, T7 complete
- Stripe webhook secret available

**Definition of Done:**
- POST /api/webhooks/stripe verifies Stripe signature
- Handles: checkout.session.completed (creates order, sends email), invoice.paid (creates renewal order), customer.subscription.updated (updates subscription), customer.subscription.deleted (marks cancelled)
- Order records inserted in Supabase with correct schema
- Confirmation email sent via Listmonk
- Returns 200 on success, 400 on invalid signature
- TypeScript compiles without errors

**Files:** `projects/handofya/web/src/app/api/webhooks/stripe/route.ts`

**Depends on:** T5, T3, T6, T7

---

### T29: Build checkout page

**Definition of Ready:**
- T24, T27, T8, T9 complete

**Definition of Done:**
- `/checkout` renders single-page checkout form (shipping address, shipping method)
- Uses (checkout) route group with minimal layout (no full header/footer)
- On submit: calls POST /api/checkout, redirects to Stripe
- Loading and error states handled
- Accessible form with proper labels and validation
- Build succeeds

**Files:**
- `projects/handofya/web/src/app/(checkout)/checkout/page.tsx`
- `projects/handofya/web/src/app/(checkout)/layout.tsx`

**Depends on:** T24, T27, T8, T9

---

### T30: Build checkout success page

**Definition of Ready:**
- T28, T29 complete

**Definition of Done:**
- `/checkout/success` reads session_id, displays order confirmation
- Shows order number, items, total, shipping address
- Clears cart from localStorage
- Link to /account/orders for authenticated users
- Account creation prompt for guest checkouts
- Build succeeds

**Files:** `projects/handofya/web/src/app/(checkout)/checkout/success/page.tsx`

**Depends on:** T28, T29

---

## G8: Customer Accounts

### T31: Build auth pages (login, signup, callback)

**Definition of Ready:**
- T3, T8, T9 complete
- Supabase auth configured with magic link provider
- Email redirect URL configured in Supabase dashboard

**Definition of Done:**
- `/login` and `/signup` render email input with "Send Magic Link" button
- Success state shows "Check your email" message
- `/auth/callback` handles magic link redirect following SecureClear pattern
- Creates customer record in Supabase on first login
- Redirects to /account after successful auth
- Build succeeds

**Files:**
- `projects/handofya/web/src/app/(auth)/login/page.tsx`
- `projects/handofya/web/src/app/(auth)/signup/page.tsx`
- `projects/handofya/web/src/app/(auth)/auth/callback/page.tsx`

**Depends on:** T3, T8, T9

---

### T32: Build account layout with auth guard

**Definition of Ready:**
- T3, T8, T15 complete

**Definition of Done:**
- `(account)/layout.tsx` checks auth session on mount
- Redirects to /login if not authenticated
- Renders account shell with sidebar navigation (Dashboard, Orders, Subscriptions, Wishlist, Settings)
- Mobile: responsive navigation
- Build succeeds

**Files:** `projects/handofya/web/src/app/(account)/layout.tsx`

**Depends on:** T3, T8, T15

---

### T33: Build account dashboard and settings

**Definition of Ready:**
- T32 complete

**Definition of Done:**
- `/account` shows welcome message, quick links, recent order summary
- `/account/settings` shows name (editable), email (read-only), logout button
- Build succeeds

**Files:**
- `projects/handofya/web/src/app/(account)/account/page.tsx`
- `projects/handofya/web/src/app/(account)/account/settings/page.tsx`

**Depends on:** T32

---

### T34: Build order history

**Definition of Ready:**
- T32, T3, T7 complete

**Definition of Done:**
- GET /api/orders returns authenticated customer's orders
- `/account/orders` lists orders with date, number, status, total
- Orders are expandable to show line items
- Build succeeds

**Files:**
- `projects/handofya/web/src/app/api/orders/route.ts`
- `projects/handofya/web/src/app/(account)/account/orders/page.tsx`
- `projects/handofya/web/src/components/account/OrderList.tsx`

**Depends on:** T32, T3, T7

---

### T35: Build subscription management

**Definition of Ready:**
- T32, T5, T3, T7 complete

**Definition of Done:**
- GET /api/subscriptions returns customer subscriptions with Stripe details
- PATCH /api/subscriptions/[id] updates frequency, pauses, or resumes
- DELETE /api/subscriptions/[id] cancels (at period end)
- All endpoints verify auth and subscription ownership
- `/account/subscriptions` lists subscriptions with status, frequency, next billing date
- Action buttons: change frequency, pause/resume, cancel
- Build succeeds

**Files:**
- `projects/handofya/web/src/app/api/subscriptions/route.ts`
- `projects/handofya/web/src/app/api/subscriptions/[id]/route.ts`
- `projects/handofya/web/src/app/(account)/account/subscriptions/page.tsx`
- `projects/handofya/web/src/components/account/SubscriptionCard.tsx`

**Depends on:** T32, T5, T3, T7

---

### T36: Build wishlist

**Definition of Ready:**
- T32, T3, T7, T20 complete

**Definition of Done:**
- GET /api/wishlist returns customer's wishlist items
- POST /api/wishlist adds a product slug
- DELETE /api/wishlist/[slug] removes a product
- All endpoints verify auth
- `/account/wishlist` renders grid of wishlisted products (images fetched from Sanity)
- Heart icon on ProductCard toggles wishlist state
- Build succeeds

**Files:**
- `projects/handofya/web/src/app/api/wishlist/route.ts`
- `projects/handofya/web/src/app/api/wishlist/[slug]/route.ts`
- `projects/handofya/web/src/app/(account)/account/wishlist/page.tsx`
- `projects/handofya/web/src/components/account/WishlistGrid.tsx`

**Depends on:** T32, T3, T7, T20

---

## G9: Content Pages

### T37: Build Journal pages

**Definition of Ready:**
- T13, T15, T10, T8 complete

**Definition of Done:**
- `/journal` renders paginated listing: featured post (large) + grid of recent posts
- `/journal/[slug]` renders post with editorial layout, PortableText body, featured image, date, social sharing, related posts
- `generateStaticParams()` and `generateMetadata()` implemented
- Build succeeds

**Files:**
- `projects/handofya/web/src/app/(content)/journal/page.tsx`
- `projects/handofya/web/src/app/(content)/journal/[slug]/page.tsx`
- `projects/handofya/web/src/components/content/JournalCard.tsx`

**Depends on:** T13, T15, T10, T8

---

### T38: Build Learn pages

**Definition of Ready:**
- T13, T15, T10, T8 complete

**Definition of Done:**
- `/learn` renders article grid
- `/learn/[slug]` renders article with PortableText body and related products section
- `generateStaticParams()` and `generateMetadata()` implemented
- Build succeeds

**Files:**
- `projects/handofya/web/src/app/(content)/learn/page.tsx`
- `projects/handofya/web/src/app/(content)/learn/[slug]/page.tsx`

**Depends on:** T13, T15, T10, T8

---

### T39: Build Ingredient database pages

**Definition of Ready:**
- T13, T15, T10, T8 complete

**Definition of Done:**
- `/ingredients` renders browsable (alphabetical) and searchable list
- Client-side search filters ingredients as user types
- `/ingredients/[slug]` shows ingredient detail with description, benefits, and products containing it (reverse GROQ lookup)
- Build succeeds

**Files:**
- `projects/handofya/web/src/app/(content)/ingredients/page.tsx`
- `projects/handofya/web/src/app/(content)/ingredients/[slug]/page.tsx`
- `projects/handofya/web/src/components/content/IngredientList.tsx`

**Depends on:** T13, T15, T10, T8

---

### T40: Build informational pages and API routes

**Definition of Ready:**
- T13, T15, T10, T6, T8, T9 complete

**Definition of Done:**
- `/about`, `/faq`, `/shipping-returns`, `/terms`, `/privacy` render CMS-managed content from Sanity
- `/contact` renders contact form (name, email, message)
- POST /api/contact validates with Zod, sends email via Listmonk, rate-limited
- POST /api/newsletter calls Listmonk addSubscriber()
- Build succeeds

**Files:**
- `projects/handofya/web/src/app/(content)/about/page.tsx`
- `projects/handofya/web/src/app/(content)/contact/page.tsx`
- `projects/handofya/web/src/app/api/contact/route.ts`
- `projects/handofya/web/src/app/(content)/faq/page.tsx`
- `projects/handofya/web/src/app/(content)/shipping-returns/page.tsx`
- `projects/handofya/web/src/app/(content)/terms/page.tsx`
- `projects/handofya/web/src/app/(content)/privacy/page.tsx`
- `projects/handofya/web/src/app/api/newsletter/route.ts`

**Depends on:** T13, T15, T10, T6, T8, T9

---

## G10: Homepage

### T41: Build Homepage

**Definition of Ready:**
- T13, T15, T20, T9, T10 complete
- At least placeholder content in Sanity (featured products, journal post)

**Definition of Done:**
- `/` renders hero section (single image, minimal text, CTA), featured products grid (3), journal preview (1-2 posts), brand story teaser, newsletter signup
- No carousel, no slider, no visual noise
- Mobile-first responsive layout
- Server Component with ISR
- Build succeeds

**Files:** `projects/handofya/web/src/app/page.tsx`

**Depends on:** T13, T15, T20, T9, T10

---

## G11: SEO

### T42: Implement SEO (sitemap, robots, structured data)

**Definition of Ready:**
- All page routes built (T22, T23, T37-T41)

**Definition of Done:**
- `/sitemap.xml` dynamically generated from Sanity content (all product, journal, learn, ingredient slugs + static pages)
- `/robots.txt` allows crawlers, disallows /studio and /api, references sitemap
- Product pages include JSON-LD Product + Offer schema
- Journal posts include JSON-LD Article schema
- All pages include BreadcrumbList schema
- Every page has unique meta title, description, and OG tags via `generateMetadata()`
- Canonical URLs on all pages
- Build succeeds and sitemap contains expected URLs

**Files:**
- `projects/handofya/web/src/app/sitemap.ts`
- `projects/handofya/web/src/app/robots.ts`

**Depends on:** T22, T23, T37, T38, T39, T40, T41

---

## G12: Sanity Revalidation Webhook

### T43: Build Sanity revalidation webhook

**Definition of Ready:**
- T22, T23, T37 complete (pages exist to revalidate)

**Definition of Done:**
- POST /api/revalidate verifies Sanity webhook secret
- Determines affected paths by document type
- Calls `revalidateTag()` or `revalidatePath()` for affected pages
- Returns { revalidated: true, paths: [...] }
- TypeScript compiles without errors

**Files:** `projects/handofya/web/src/app/api/revalidate/route.ts`

**Depends on:** T22, T23, T37

---

## G13: Performance Optimization

### T44: Performance optimization pass

**Definition of Ready:**
- All pages and components built (T41 complete)

**Definition of Done:**
- All images use next/image with Sanity CDN, responsive srcset, WebP/AVIF, lazy loading below fold
- Fonts loaded with font-display: swap and preloaded
- Bundle analyzed: no unnecessary client JS on Server Component pages
- Stripe.js loaded only on checkout page
- ISR revalidation times set (products: 3600s, journal: 3600s, pages: 86400s)
- Lighthouse mobile score 90+ on homepage, product page, and journal page
- LCP < 2.5s, CLS < 0.1

**Files:** Various (optimization across existing files)

**Depends on:** T41, T42

---

## G14: Testing

### T45: Set up Playwright and write E2E tests

**Definition of Ready:**
- All pages built (T41 complete)

**Definition of Done:**
- `playwright.config.ts` configured for Chromium, Firefox, WebKit
- Test files cover: layout, products, cart, checkout, account, content
- API calls mocked using `page.route()` (SecureClear pattern)
- All tests pass: `npx playwright test --reporter=list`

**Files:**
- `projects/handofya/web/playwright.config.ts`
- `projects/handofya/web/tests/layout.spec.ts`
- `projects/handofya/web/tests/product.spec.ts`
- `projects/handofya/web/tests/cart.spec.ts`
- `projects/handofya/web/tests/checkout.spec.ts`
- `projects/handofya/web/tests/account.spec.ts`
- `projects/handofya/web/tests/content.spec.ts`

**Depends on:** T41

---

## G15: Deployment Configuration

### T46: Configure Vercel deployment and Listmonk on Render

**Definition of Ready:**
- T44 and T45 complete (app optimized and tested)
- Vercel account available
- Render account available
- Domain DNS access for handofya.com

**Definition of Done:**
- Vercel project configured: root directory, build command, env vars, custom domain
- Listmonk running on Render: Docker container, PostgreSQL, SMTP relay
- SPF/DKIM/DMARC DNS records configured for handofya.com
- Stripe webhook endpoint registered pointing to production URL
- Sanity webhook configured to call /api/revalidate on publish
- Site accessible at handofya.com
- Listmonk accessible at listmonk.handofya.com (or subdomain)

**Files:** `projects/handofya/web/vercel.json` (if needed)

**Depends on:** T44, T45
