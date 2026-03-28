# Test Specifications: Hand of Yah Website Redesign

**Feature:** handofya-redesign
**Created:** 2026-03-27
**Status:** Draft — defines Phase 6 implementation "done" criteria
**PRD Reference:** `docs/prd.md`
**Architecture Reference:** `docs/architecture.md`

Every user story from the PRD (US-1 through US-10) maps to at least one test. Every chain trace assumption from the architecture is covered by a verification test.

---

## Success Paths

| ID | Test Name | Given | When | Then |
|----|-----------|-------|------|------|
| SP-001 | Homepage loads with all key sections | A visitor navigates to `/` | The page finishes loading | The hero section, featured products grid, journal preview, newsletter signup form, and footer are all visible |
| SP-002 | Homepage hero has a shop entry point | The homepage is loaded | The visitor views the hero section | A call-to-action link pointing to `/shop` is visible |
| SP-003 | Shop page displays product grid | A visitor navigates to `/shop` | The page finishes loading | Products are displayed in a grid; each product card shows a name, category, and price |
| SP-004 | Shop page product grid is three columns on desktop | The shop page is loaded at desktop viewport (1280px) | The visitor views the product grid | Products are arranged in three columns |
| SP-005 | Category page filters products by Face | A visitor navigates to `/shop/face` | The page finishes loading | Only products in the Face category are listed; no products from other categories appear |
| SP-006 | Category page filters products by Supplements | A visitor navigates to `/shop/supplements` | The page finishes loading | Only Supplement products are listed |
| SP-007 | All six category routes are reachable | A visitor navigates to each of: `/shop/face`, `/shop/supplements`, `/shop/hair-oils`, `/shop/eye-cremes`, `/shop/face-masques`, `/shop/fragrances` | Each page finishes loading | Every category page returns a 200 status and displays a visible heading |
| SP-008 | Product detail page renders required fields | A visitor navigates to `/shop/[product-slug]` for an existing product | The page finishes loading | The product name, price, at least one image, description, ingredient list, usage instructions, and an add-to-cart button are all visible |
| SP-009 | Product detail page subscription toggle is present | A visitor views a subscription-eligible product detail page | The page finishes loading | A toggle or control labelled "Subscribe" or "Subscribe & Save" is visible alongside the one-time purchase option |
| SP-010 | Subscription toggle shows price difference | A visitor is on a subscription-eligible product detail page | The visitor activates the subscription toggle | The page displays the recurring price, which is distinct from the one-time price |
| SP-011 | Subscription frequency options are selectable | The subscription toggle is active on a product detail page | The visitor opens the frequency selector | The options "Monthly", "Every 2 months", and "Every 3 months" (or equivalent) are available |
| SP-012 | Add to cart updates cart state | A visitor is on a product detail page | The visitor clicks "Add to Cart" | The cart item count in the header increments and the cart drawer opens showing the added product |
| SP-013 | Cart drawer shows line item details | An item has been added to the cart | The visitor opens the cart drawer | The line item shows the product image, name, unit price, quantity selector, and line total |
| SP-014 | Cart page shows all required pricing fields | A visitor navigates to `/cart` with items in the cart | The page finishes loading | The cart displays a subtotal, estimated shipping, estimated tax, and an order total |
| SP-015 | Cart quantity controls increment and decrement | A visitor is on the `/cart` page | The visitor clicks the increment button on a line item | The quantity increases by one and the line total and order total update accordingly |
| SP-016 | Cart remove button removes a line item | A visitor is on the `/cart` page with multiple items | The visitor clicks the remove button on one line item | That item disappears from the cart and the totals update |
| SP-017 | Checkout creates a Stripe session and redirects | A visitor has items in the cart and clicks "Checkout" | The checkout flow calls `POST /api/checkout` | The API returns a Stripe Checkout URL and the browser redirects to a Stripe-hosted URL |
| SP-018 | Magic link signup sends a confirmation message | A visitor navigates to `/signup` and enters a valid email | The visitor submits the form | A message confirming that a magic link has been sent to the email address is visible |
| SP-019 | Auth callback creates customer record | A user follows a valid magic link to `/auth/callback` | The callback page processes the token | The user is redirected to `/account` and is authenticated |
| SP-020 | Authenticated user sees account dashboard | A logged-in user navigates to `/account` | The page finishes loading | The account dashboard displays sections for orders, subscriptions, and wishlist |
| SP-021 | Order history shows past orders | A logged-in user with past orders navigates to `/account/orders` | The page finishes loading | At least one order is listed with an order ID, date, and status |
| SP-022 | Subscription management page lists active subscriptions | A logged-in user with active subscriptions navigates to `/account/subscriptions` | The page finishes loading | Each active subscription shows the product name, frequency, status, and action buttons |
| SP-023 | Subscription frequency can be changed | A logged-in user is on `/account/subscriptions` | The user selects a new frequency and confirms | The subscription record updates to reflect the new frequency |
| SP-024 | Subscription can be paused | A logged-in user is on `/account/subscriptions` | The user clicks "Pause" on an active subscription | The subscription status changes to "paused" |
| SP-025 | Subscription can be cancelled | A logged-in user is on `/account/subscriptions` | The user clicks "Cancel" on an active subscription | A confirmation prompt is shown; after confirmation, the subscription status changes to "cancelled" |
| SP-026 | Wishlist add persists across sessions | A logged-in user adds a product to the wishlist | The user navigates away and returns to `/account/wishlist` | The product is still listed in the wishlist |
| SP-027 | Wishlist remove works | A logged-in user navigates to `/account/wishlist` with saved items | The user clicks the remove button on a product | The product is removed from the wishlist and the list updates |
| SP-028 | Journal listing shows posts | A visitor navigates to `/journal` | The page finishes loading | A list of journal posts is visible, each showing a featured image, publication date, title, and excerpt |
| SP-029 | Journal post renders rich text body | A visitor navigates to `/journal/[post-slug]` for an existing post | The page finishes loading | The post title, publication date, featured image, and rich text body are all visible |
| SP-030 | Learn hub displays educational articles | A visitor navigates to `/learn` | The page finishes loading | A list of learn articles is visible, each with a title |
| SP-031 | Learn article renders correctly | A visitor navigates to `/learn/[topic-slug]` | The page finishes loading | The article title and body content are visible |
| SP-032 | Ingredient database is browsable | A visitor navigates to `/ingredients` | The page finishes loading | A list or index of ingredients is displayed |
| SP-033 | Ingredient database has a search input | A visitor is on `/ingredients` | The page finishes loading | A search input field is present |
| SP-034 | Ingredient search filters results | A visitor is on `/ingredients` and types a known ingredient name | The search query is entered | The displayed ingredient list narrows to matching items |
| SP-035 | Contact form submits successfully | A visitor navigates to `/contact` and fills in all required fields | The visitor submits the form | A success confirmation message is displayed |
| SP-036 | Newsletter signup creates a subscriber | A visitor finds the newsletter signup form and enters a valid email | The visitor submits the form | A success confirmation message is displayed |
| SP-037 | Footer contains navigation, social, and legal links | Any page is loaded | The visitor views the footer | Links to FAQ, Shipping & Returns, Terms, Privacy, and social media accounts are present |

---

## Failure Scenarios

| ID | Test Name | Given | When | Then |
|----|-----------|-------|------|------|
| FS-001 | Invalid email on magic link signup shows error | A visitor navigates to `/signup` | The visitor enters a malformed email (e.g. "notanemail") and submits | An inline validation error is shown; no network request is made |
| FS-002 | Checkout with empty cart redirects to shop | A visitor navigates to `/checkout` with an empty cart | The page loads | The visitor is redirected to `/shop` with an appropriate message |
| FS-003 | Accessing /account without auth redirects to /login | An unauthenticated visitor navigates to `/account` | The page attempts to load | The visitor is redirected to `/login` |
| FS-004 | Accessing /account/orders without auth redirects to /login | An unauthenticated visitor navigates to `/account/orders` | The page attempts to load | The visitor is redirected to `/login` |
| FS-005 | Stripe webhook with invalid signature returns 400 | A request is sent to `POST /api/webhooks/stripe` | The request has a missing or incorrect `Stripe-Signature` header | The endpoint returns HTTP 400 |
| FS-006 | Contact form with missing required fields shows validation errors | A visitor is on the `/contact` page | The visitor submits the form with one or more required fields empty | Inline validation errors appear for each missing required field; the form is not submitted |
| FS-007 | Newsletter signup with already-subscribed email handles gracefully | A visitor enters an email that is already subscribed to the newsletter | The visitor submits the form | A non-error message is shown (e.g. "You're already subscribed" or a generic success message); no crash |
| FS-008 | Non-existent product slug returns 404 | A visitor navigates to `/shop/this-product-does-not-exist` | The page loads | The response status is 404 and a "not found" message is displayed |
| FS-009 | Non-existent journal post slug returns 404 | A visitor navigates to `/journal/this-post-does-not-exist` | The page loads | The response status is 404 |
| FS-010 | Stripe API failure during checkout shows error message | A visitor initiates checkout but the Stripe API returns an error | `POST /api/checkout` responds with an error | A user-facing error message is shown; the visitor is not left on a blank page |

---

## Empty States

| ID | Test Name | Given | When | Then |
|----|-----------|-------|------|------|
| ES-001 | Empty cart shows message and link to shop | A visitor navigates to `/cart` with no items in the cart | The page finishes loading | A message indicating the cart is empty is shown, alongside a link to `/shop` |
| ES-002 | No orders shows empty state message | A logged-in user with no past orders navigates to `/account/orders` | The page finishes loading | An empty state message (e.g. "No orders yet") is displayed; no error is thrown |
| ES-003 | Empty wishlist shows empty state message | A logged-in user with no wishlist items navigates to `/account/wishlist` | The page finishes loading | An empty state message (e.g. "No saved items") is displayed |
| ES-004 | No active subscriptions shows empty state message | A logged-in user with no subscriptions navigates to `/account/subscriptions` | The page finishes loading | An empty state message is displayed; no error is thrown |
| ES-005 | Category with no products shows empty state | A visitor navigates to a category page that has no active products | The page finishes loading | An empty state message is displayed rather than a blank grid |

---

## Edge Cases

| ID | Test Name | Given | When | Then |
|----|-----------|-------|------|------|
| EC-001 | Cart persists across page refreshes for guests | A guest visitor adds a product to the cart | The visitor refreshes the page | The cart item is still present (persisted via localStorage) |
| EC-002 | Cart merges on login | A guest has one item in their cart and then logs in (their account has a different item in the server-side cart) | Login completes | The cart contains both items — the guest item and the account item |
| EC-003 | Subscription and one-time items coexist in cart | A visitor adds one subscription item and one one-time item to the cart | The visitor views the cart | Both items appear with their correct type labels (one-time vs. subscription); the checkout handles them both |
| EC-004 | Product with a long name does not break product card layout | A product with a very long name (> 60 characters) is displayed on a category page | The visitor views the product grid | The card layout does not overflow or break; the text wraps or truncates gracefully |
| EC-005 | Multiple rapid add-to-cart clicks do not create duplicates | A visitor clicks "Add to Cart" five times in quick succession on the same product | The cart is opened | The cart shows the product only once with a quantity of 1 (or incremented, not duplicated) |
| EC-006 | Checkout session URL is a Stripe URL | A valid `POST /api/checkout` request is made with a non-empty cart | The API processes the request | The response contains a URL beginning with `https://checkout.stripe.com/` |
| EC-007 | Sanity Studio loads at /studio without route conflict | An authenticated Sanity user navigates to `/studio` | The page finishes loading | The Sanity Studio interface loads without a 404 or conflict with other app routes |

---

## Accessibility

| ID | Test Name | Given | When | Then |
|----|-----------|-------|------|------|
| A11Y-001 | Homepage passes axe-core automated checks | The homepage is loaded | An axe-core accessibility scan is run against the rendered page | No critical or serious violations are reported |
| A11Y-002 | Shop page passes axe-core automated checks | The `/shop` page is loaded | An axe-core scan is run | No critical or serious violations are reported |
| A11Y-003 | Product detail page passes axe-core automated checks | A product detail page is loaded | An axe-core scan is run | No critical or serious violations are reported |
| A11Y-004 | Cart page passes axe-core automated checks | The `/cart` page is loaded with items | An axe-core scan is run | No critical or serious violations are reported |
| A11Y-005 | All product images have non-empty alt text | A category or product page is loaded | The rendered HTML is inspected | Every `<img>` element rendered from product data has a non-empty `alt` attribute |
| A11Y-006 | All interactive elements are keyboard-navigable | Any page is loaded | The visitor uses the Tab key to cycle through interactive elements | Focus moves through all buttons, links, and form inputs in a logical order with a visible focus indicator |
| A11Y-007 | Mobile navigation is accessible via keyboard | The site is viewed at a mobile viewport | The visitor activates the mobile menu via keyboard | The mobile navigation drawer opens and all links within it are reachable via Tab |
| A11Y-008 | Color contrast meets WCAG AA for body text | Any page with body text is loaded | An axe-core scan checks contrast ratios | All text-background combinations meet a minimum 4.5:1 contrast ratio |

---

## SEO

| ID | Test Name | Given | When | Then |
|----|-----------|-------|------|------|
| SEO-001 | Homepage has unique meta title and description | The homepage is loaded | The rendered HTML `<head>` is inspected | A `<title>` and `<meta name="description">` tag are present with non-empty, brand-relevant content |
| SEO-002 | Product pages have unique meta title and description | A product detail page is loaded | The rendered HTML `<head>` is inspected | A `<title>` containing the product name and a `<meta name="description">` are present |
| SEO-003 | Product pages have JSON-LD Product schema | A product detail page is loaded | The rendered HTML is inspected for `<script type="application/ld+json">` | A Product schema object with `@type: "Product"`, `name`, `offers`, and `description` is present |
| SEO-004 | Journal posts have JSON-LD Article schema | A journal post page is loaded | The rendered HTML is inspected for `<script type="application/ld+json">` | An Article schema object with `@type: "Article"`, `headline`, and `datePublished` is present |
| SEO-005 | All pages have Open Graph tags | Any public page is loaded | The rendered HTML `<head>` is inspected | `og:title`, `og:description`, and `og:image` meta tags are present |
| SEO-006 | Sitemap.xml exists and is accessible | A request is made to `/sitemap.xml` | The response is received | The response status is 200 and the content type is `application/xml`; the body contains at least one `<url>` entry |
| SEO-007 | robots.txt exists and permits crawling | A request is made to `/robots.txt` | The response is received | The response status is 200; the content does not contain `Disallow: /` for all paths |
| SEO-008 | Category pages have unique meta titles | Each of the six category pages is loaded | The rendered `<title>` is inspected | Each category page has a unique title containing the category name |

---

## Integration Points (Chain Trace Assumption Verification)

| ID | Test Name | Given | When | Then |
|----|-----------|-------|------|------|
| INT-001 | Supabase signInWithOtp triggers email send confirmation | A mocked Supabase `signInWithOtp()` is called with a valid email | The magic link signup form is submitted | The Supabase client `signInWithOtp` is called once with the submitted email; the UI displays a "check your email" message |
| INT-002 | POST /api/checkout returns a Stripe Checkout URL | A valid cart payload is sent to `POST /api/checkout` (Stripe API mocked) | The route handler processes the request | The response contains a `url` field starting with `https://checkout.stripe.com/` and a 200 status |
| INT-003 | Stripe webhook payment_intent.succeeded creates order in Supabase | A valid `payment_intent.succeeded` event is sent to `POST /api/webhooks/stripe` with correct signature | The webhook handler processes the event | A record is inserted into the Supabase `orders` table with status `paid` |
| INT-004 | Stripe webhook invoice.paid creates renewal order for subscriptions | A valid `invoice.paid` event with a subscription ID is sent to `POST /api/webhooks/stripe` | The webhook handler processes the event | A new order record is created in Supabase for the subscription renewal |
| INT-005 | POST /api/revalidate triggers ISR revalidation | A Sanity webhook sends a `POST /api/revalidate` request with the correct secret | The route handler processes the request | The handler calls `revalidatePath()` for the affected route and returns HTTP 200 |
| INT-006 | Sanity Studio at /studio loads without route conflict | The Next.js app is running and a user navigates to `/studio` | The page renders | The Sanity Studio interface is present; no 404, no conflict with other app routes |
| INT-007 | POST /api/newsletter calls Listmonk addSubscriber | A visitor submits the newsletter form with a valid email (Listmonk API mocked) | The form data is sent to `POST /api/newsletter` | The Listmonk API is called with the subscriber email and the configured list ID; the response is 200 |
| INT-008 | Stripe webhook with invalid signature returns 400 | A request is sent to `POST /api/webhooks/stripe` | The `Stripe-Signature` header is absent or incorrect | `stripe.webhooks.constructEvent()` throws and the handler returns HTTP 400 |
