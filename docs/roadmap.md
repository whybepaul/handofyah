# Hand of Yah — Product Roadmap

## Pre-Launch: Service Setup and Content Population

These tasks connect the built codebase to live services. The code is ready — these are account setup, configuration, and content entry tasks.

### 0.1 Sanity CMS Setup
**Priority:** Blocking | **Effort:** Low | **Cost:** Free tier

1. Create a Sanity account at sanity.io (free, no credit card)
2. Create a project named "Hand of Yah"
3. Copy the Project ID and Dataset name
4. Add credentials to `web/.env.local`:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id`
   - `NEXT_PUBLIC_SANITY_DATASET=production`
   - `SANITY_API_TOKEN=` (generate a read token in Sanity dashboard)
   - `SANITY_REVALIDATE_SECRET=` (any random string for webhook auth)
5. Visit `localhost:3000/studio` — the Sanity Studio loads with all 7 content schemas ready
6. Add a CORS origin in Sanity dashboard for `localhost:3000` and the production domain

### 0.2 Content Population
**Priority:** Blocking | **Effort:** Medium (content writing)

Using the Studio at `/studio`, enter:
- Product categories (6: Face, Supplements, Hair Oils, Eye Cremes, Face Masques, Fragrances)
- Products with real photography, descriptions, ingredients, and pricing
- 2-3 journal posts (rewritten from current site or new)
- 2-3 learn articles
- Ingredient entries for all ingredients used across products
- Page content for About, FAQ, Shipping/Returns, Terms, Privacy
- All content reviewed and rewritten per brand voice guidelines

### 0.3 Supabase Setup
**Priority:** Blocking | **Effort:** Low | **Cost:** Free tier

1. Create a Supabase project (free tier: 500MB database, 50K auth users)
2. Create tables: `customers`, `orders`, `subscriptions`, `wishlists` (schemas in `shape.md`)
3. Enable email auth with magic link
4. Add credentials to `web/.env.local`

### 0.4 Stripe Setup
**Priority:** Blocking | **Effort:** Low

1. Create a Stripe account (or use existing)
2. Enable Stripe Tax for US compliance
3. Create products/prices matching the Sanity catalog
4. Set up subscription pricing (monthly, bi-monthly, quarterly)
5. Configure webhook endpoint pointing to `/api/webhooks/stripe`
6. Add API keys to `web/.env.local`

### 0.5 Listmonk Setup
**Priority:** Medium | **Effort:** Medium | **Cost:** Free (self-hosted)

1. Deploy Listmonk on Render (Docker container)
2. Configure SMTP relay (Amazon SES or Postmark recommended for deliverability)
3. Set up SPF, DKIM, DMARC records for handofya.com
4. Create email templates (order confirmation, subscription reminder)
5. Create a subscriber list for newsletter
6. Add Listmonk credentials to `web/.env.local`

### 0.6 Domain and Deployment
**Priority:** Blocking | **Effort:** Low

1. Connect the `web/` directory to a Vercel project
2. Add all environment variables to Vercel dashboard
3. Point handofya.com DNS to Vercel
4. Register handofyah.com as a redirect (domain mismatch fix)
5. Set up Sanity webhook to `/api/revalidate` for ISR
6. Verify production build, SSL, and all routes

### 0.7 Pre-Launch Checklist
- [ ] All products listed with real photography and reviewed copy
- [ ] No placeholder text on any page
- [ ] All social links point to actual brand profiles
- [ ] Contact form delivers to owner's email
- [ ] Newsletter signup creates subscriber in Listmonk
- [ ] Checkout flow tested end-to-end with Stripe test mode
- [ ] Magic link auth tested
- [ ] Mobile tested on real devices (iPhone, Android)
- [ ] Lighthouse mobile score 90+
- [ ] All pages have unique meta titles and descriptions
- [ ] sitemap.xml includes all public routes
- [ ] robots.txt blocks /api, /studio, /account

---

## Phase 2: Personalization and Engagement

### 2.1 Ingredient-Based Recommendations
**Priority:** High | **Effort:** Low | **Data needed:** Already available

Recommend products that share key ingredients with ones the customer has purchased or viewed. The Sanity ingredient cross-reference schema already supports this — needs a `getRelatedProducts(productId)` function that ranks by ingredient overlap.

- Add "You might also like" section to PDP (below current related products)
- Add "Based on your purchases" section to account dashboard
- Surface ingredient-driven suggestions in cart drawer ("Pairs well with...")

### 2.2 Skin Quiz and Product Recommendation Engine
**Priority:** High | **Effort:** Medium | **Data needed:** New product attributes + quiz UI

Interactive questionnaire that captures skin type, concerns, and goals, then maps responses to product attributes to generate a personalized routine.

- Add product attributes to Sanity: skin type suitability, concern targeting (dryness, aging, sensitivity, etc.)
- Build quiz UI (3-5 questions, progress indicator, results page)
- Decision tree or scoring algorithm to match quiz answers to products
- Save quiz results to customer profile for future personalization
- Generates a "Your Routine" page with 3-5 product recommendations

### 2.3 Product Reviews and Ratings
**Priority:** Medium | **Effort:** Medium | **Data needed:** New schema + moderation

Customer ratings and written reviews on product pages.

- Review schema in Supabase (customer_id, product_slug, rating, text, created_at)
- Moderation queue for the owner (approve/reject in Sanity or admin UI)
- Average rating display on product cards and PDP
- "Verified purchase" badge for reviewers who bought the product

### 2.4 Marketing Email Campaigns
**Priority:** Medium | **Effort:** Low | **Data needed:** Listmonk already deployed

Automated email flows beyond transactional emails.

- Welcome series (3 emails after signup)
- Abandoned cart recovery (triggered by cart age + no checkout)
- Post-purchase follow-up (usage tips, review request)
- Subscription renewal reminders (already partially built)
- Campaign templates in Listmonk for seasonal promotions

### 2.5 Product Bundles
**Priority:** Medium | **Effort:** Low | **Data needed:** New Sanity schema

Curated product sets organized by routine or skin type.

- Bundle schema in Sanity: name, products[], discount percentage, description
- Bundle listing page and bundle detail page
- "Complete the routine" bundles on PDP (complementary products)
- Cart support for bundle pricing

## Phase 3: Growth and Optimization

### 3.1 Collaborative Filtering ("Customers Also Bought")
**Priority:** Medium | **Effort:** Medium | **Data needed:** ~100+ orders

Co-purchase frequency analysis to surface "customers who bought X also bought Y."

- Background job to compute co-purchase matrix from order history
- Requires sufficient order volume before recommendations are meaningful
- Supplement ingredient-based recommendations, not replace them

### 3.2 Loyalty and Rewards Program
**Priority:** Low | **Effort:** High | **Data needed:** Points system design

Points-based rewards for purchases, reviews, and referrals.

- Points schema in Supabase
- Earn rules: points per dollar, bonus for reviews, referral bonus
- Redemption: discount codes generated from points balance
- Loyalty tier system (optional)

### 3.3 Referral Program
**Priority:** Low | **Effort:** Medium | **Data needed:** Referral tracking

Share-a-link program with discount incentives for both referrer and referee.

- Unique referral links per customer
- Discount code generation on successful referral
- Referral tracking in Supabase
- Dashboard for customers to see referral stats

### 3.4 Gift Cards
**Priority:** Low | **Effort:** Medium | **Data needed:** Stripe product

Digital gift cards purchasable and redeemable on the site.

- Gift card as a Stripe product with variable amount
- Email delivery with unique redemption code
- Balance tracking and partial redemption support

### 3.5 Multi-Currency Support
**Priority:** Low | **Effort:** Medium | **Data needed:** Stripe config

Support for CAD, GBP, EUR alongside USD.

- Currency selector in header
- Stripe multi-currency pricing
- Sanity price fields per currency (or conversion API)

### 3.6 Advanced Analytics Dashboard
**Priority:** Low | **Effort:** Medium | **Data needed:** Order + behavior data

Owner-facing dashboard with sales trends, customer cohorts, and LTV analysis.

- Sales by period, category, product
- Customer acquisition and retention metrics
- Subscription churn rate
- Top products and ingredient popularity
