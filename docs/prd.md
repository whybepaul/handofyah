# Hand of Yah -- Website Redesign PRD

**Document version:** 1.0
**Created:** 2026-03-27
**Status:** Draft -- Pending Sign-off (Phase 1 Gate)
**Design flag:** `critical`
**Project type:** Standalone (own repository)
**Domain:** handofya.com

---

## Spec Artifacts
Decision rationale: [`docs/specs/2026-03-27-1200-handofya-redesign/`](specs/2026-03-27-1200-handofya-redesign/)

---

## Table of Contents

1. [Overview](#1-overview)
2. [Problem Statement](#2-problem-statement)
3. [Target Users](#3-target-users)
4. [User Stories](#4-user-stories)
5. [Functional Requirements](#5-functional-requirements)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [Pages and Routes](#7-pages-and-routes)
8. [Design Requirements](#8-design-requirements)
9. [Brand Identity Development](#9-brand-identity-development)
10. [E-Commerce Requirements](#10-e-commerce-requirements)
11. [Content Strategy](#11-content-strategy)
12. [Integration Requirements](#12-integration-requirements)
13. [Scope](#13-scope)
14. [Content Migration](#14-content-migration)
15. [Constraints and Assumptions](#15-constraints-and-assumptions)
16. [Success Metrics](#16-success-metrics)
17. [Optional Enhancements (Not in Scope)](#17-optional-enhancements-not-in-scope)

---

## 1. Overview

### Project Summary

Hand of Yah is a premium artisanal skincare and wellness brand with the philosophy "Skincare is self-care." The brand sells natural beauty products with a moderate spiritual and holistic undertone through its website at handofya.com.

The current Squarespace site fails to meet design quality standards and limits the brand's ability to express its premium positioning. This project is a complete redesign and re-platform: a custom-built, Aesop-inspired e-commerce experience that elevates the brand, gives the owner full control over content, and delivers a modern shopping experience with subscriptions, customer accounts, and an active journal.

### Goals

1. **Elevate brand perception** -- Deliver a design that communicates premium, artisanal quality on par with brands like Aesop
2. **Improve shopping experience** -- Intuitive product discovery, seamless checkout, subscription support
3. **Enable content ownership** -- Owner-managed CMS for products, journal posts, and educational content without developer dependency
4. **Establish brand identity** -- Develop a complete brand identity system (no existing guidelines exist)
5. **Build for growth** -- Modern architecture that supports future features (loyalty program, skin quiz, reviews) without re-platforming

### Success Criteria (MVP Launch)

- Site is live on handofya.com with all product categories shoppable
- Owner can independently create and publish journal posts and update product content
- Stripe checkout with subscription support is functional
- Customer accounts with order history and wishlists are operational
- Lighthouse performance score of 90+ on mobile
- All existing products are listed with rewritten copy

---

## 2. Problem Statement

### Current State

The Hand of Yah website (Squarespace) has the following problems:

**Design quality failure.** The site is poorly laid out and does not meet the design quality standards expected of a premium skincare brand. For a product category where visual presentation directly influences purchase decisions, the current design undermines brand credibility.

**Platform limitations.** Squarespace constrains customization. The owner cannot achieve the visual sophistication, interaction patterns, or performance characteristics needed to compete with modern DTC skincare brands.

**Broken content.** The current site contains placeholder and demo content -- "example content" in summary blocks, category links pointing to null values, generic Squarespace demo text in the journal. This erodes trust.

**No subscription support.** Squarespace does not natively support the recurring order model the owner wants.

**Limited control.** Performance optimization, SEO fine-tuning, and custom functionality are constrained by the platform.

### Desired State

A custom-built site that:
- Looks and feels like a premium skincare brand (Aesop-tier visual quality)
- Gives the owner complete content control through an intuitive CMS
- Supports subscriptions, customer accounts, and wishlists natively
- Loads fast, ranks well in search, and converts visitors to customers
- Can be extended with features like product reviews, skin quizzes, and loyalty programs in future phases

---

## 3. Target Users

### Primary Persona: The Intentional Shopper

- **Demographics:** Women 28-45, urban/suburban, household income $75K+
- **Psychographics:** Views skincare as a ritual, not a chore. Reads ingredient lists. Willing to pay more for natural, artisanal products. Follows skincare influencers and reads beauty journals. Values brands with a point of view.
- **Behavior:** Researches before buying. Reads 2-3 product pages before adding to cart. Returns to brands she trusts. Likely to subscribe if the product works.
- **Devices:** 65% mobile, 25% desktop, 10% tablet
- **Pain points with current site:** Poor layout makes products hard to evaluate. Placeholder content feels unprofessional. Cannot subscribe to products.

### Secondary Persona: The Gift Buyer

- **Demographics:** Men and women 30-55, shopping for a partner, friend, or family member
- **Psychographics:** Knows the recipient cares about skincare. Looking for something premium that feels special. Influenced heavily by visual presentation and packaging photography.
- **Behavior:** Browses by category. Reads product descriptions for gifting context. Wants a smooth, fast checkout. May not create an account.
- **Devices:** 50% mobile, 40% desktop, 10% tablet

### Tertiary Persona: The Brand Owner (Admin)

- **Demographics:** Non-technical business owner
- **Needs:** Update product listings, publish journal posts, manage orders, view basic analytics. Must be able to do all of this without a developer.
- **Pain points:** Current Squarespace backend is limiting. Wants more control without more complexity.

---

## 4. User Stories

### Browsing and Discovery

**US-1.** As a visitor, I can land on a homepage that immediately communicates premium quality and brand identity so that I trust this is a serious skincare brand worth exploring.

**US-2.** As a shopper, I can browse products by category (Face, Supplements, Hair Oils, Eye Cremes, Face Masques, Fragrances) so that I can find products relevant to my needs.

**US-3.** As a shopper, I can view a product detail page with high-quality imagery, full ingredient list, usage instructions, and pricing so that I can make an informed purchase decision.

### Shopping and Checkout

**US-4.** As a shopper, I can add products to a cart, adjust quantities, and proceed to checkout so that I can complete a purchase.

**US-5.** As a shopper, I can subscribe to a product for recurring delivery (monthly, bi-monthly, quarterly) so that I never run out of products I use regularly.

**US-6.** As a returning customer, I can log in to my account, view order history, and manage my wishlist so that I can track past purchases and save products for later.

### Content

**US-7.** As a visitor, I can read journal posts about skincare, wellness, and the brand's philosophy so that I build a relationship with the brand beyond transactions.

**US-8.** As a shopper, I can explore an ingredient database that explains what each ingredient does and why it is used so that I trust the formulations.

### Administration

**US-9.** As the brand owner, I can create and publish journal posts, update product information, and manage page content through an intuitive CMS without developer help so that I maintain my site independently.

**US-10.** As the brand owner, I can view and manage orders, subscriptions, and customer information so that I can fulfill orders and handle customer service.

---

## 5. Functional Requirements

### Product Catalog (FR-1 through FR-5)

**FR-1.** The system must display products organized into six categories: Face, Supplements, Hair Oils, Eye Cremes, Face Masques, and Fragrances.

**FR-2.** Each product page must display: product name, price, product images (multiple, zoomable), full description, complete ingredient list, usage instructions, and an add-to-cart button.

**FR-3.** Each product page must offer a one-time purchase option and a subscription option (with selectable frequency: monthly, every 2 months, every 3 months).

**FR-4.** The system must display a collection/category page for each product category with a grid of products showing image, name, and price.

**FR-5.** Product data (name, description, price, images, ingredients, categories) must be managed through the CMS by the brand owner.

### Shopping Cart and Checkout (FR-6 through FR-9)

**FR-6.** The system must provide a persistent shopping cart that supports both one-time and subscription line items, with the ability to adjust quantities and remove items.

**FR-7.** The system must process payments through Stripe in USD only.

**FR-8.** The system must support guest checkout (no account required) and authenticated checkout (for logged-in users).

**FR-9.** The system must collect shipping address, calculate shipping costs, and apply tax based on destination.

### Customer Accounts (FR-10 through FR-12)

**FR-10.** The system must allow customers to create an account with email and password, log in, and log out.

**FR-11.** Authenticated customers must be able to view their order history with order status, and manage active subscriptions (pause, cancel, change frequency).

**FR-12.** Authenticated customers must be able to maintain a wishlist of saved products.

### Content and Journal (FR-13 through FR-15)

**FR-13.** The system must display a journal (blog) with paginated post listings and individual post pages. Posts must support rich text, images, and embedded media.

**FR-14.** The system must include a "Learn" section with educational content about skincare, ingredients, and routines, managed through the CMS.

**FR-15.** The system must include an ingredient database -- a browsable, searchable collection of ingredients used across products, each with a description of its purpose and benefits.

### Informational Pages (FR-16 through FR-18)

**FR-16.** The system must include the following informational pages, all editable through the CMS: About/Brand Story, FAQs, Shipping and Returns, Contact, Terms of Service, Privacy Policy.

**FR-17.** The Contact page must include a contact form that sends submissions to the brand owner's email.

**FR-18.** The site must include a global header with navigation (Shop dropdown by category, Journal, Learn, About, Account, Cart) and a footer with secondary links (FAQs, Shipping, Terms, Privacy, Social links).

### Email (FR-19)

**FR-19.** The system must support email collection (newsletter signup) and transactional emails (order confirmation, shipping notification, subscription reminders) through a self-hosted email solution.

---

## 6. Non-Functional Requirements

### Performance (NFR-1 through NFR-3)

**NFR-1.** All pages must achieve a Lighthouse performance score of 90 or higher on mobile.

**NFR-2.** Largest Contentful Paint (LCP) must be under 2.5 seconds on a 4G connection.

**NFR-3.** Product images must be served in modern formats (WebP/AVIF) with responsive sizing and lazy loading below the fold.

### SEO (NFR-4 through NFR-5)

**NFR-4.** All pages must render with complete HTML content on first load (SSR or SSG) for search engine crawlability. Each page must have unique, descriptive meta titles, meta descriptions, and Open Graph tags.

**NFR-5.** The site must generate a dynamic sitemap.xml and robots.txt. Product pages must include structured data (JSON-LD) for Product, Offer, and BreadcrumbList schemas. Journal posts must include Article schema.

### Accessibility (NFR-6)

**NFR-6.** The site must meet WCAG 2.1 Level AA compliance. All images must have alt text. All interactive elements must be keyboard-navigable. Color contrast must meet minimum ratios.

### Security (NFR-7)

**NFR-7.** All pages must be served over HTTPS. Customer passwords must be hashed. Payment data must never touch the application server (Stripe handles PCI compliance). The CMS admin interface must require authentication.

### Reliability (NFR-8)

**NFR-8.** The site must target 99.9% uptime. Checkout and payment flows must handle Stripe API failures gracefully with user-facing error messages and retry guidance.

---

## 7. Pages and Routes

```
/                           Home
/shop                       All products
/shop/face                  Category: Face
/shop/supplements           Category: Supplements
/shop/hair-oils             Category: Hair Oils
/shop/eye-cremes            Category: Eye Cremes
/shop/face-masques          Category: Face Masques
/shop/fragrances            Category: Fragrances
/shop/[product-slug]        Individual product page
/journal                    Journal listing (paginated)
/journal/[post-slug]        Individual journal post
/learn                      Learn hub (educational content)
/learn/[topic-slug]         Individual learn article
/ingredients                Ingredient database (browsable/searchable)
/ingredients/[ingredient]   Individual ingredient page
/about                      Brand story
/contact                    Contact form
/cart                       Shopping cart
/checkout                   Checkout flow
/account                    Account dashboard (authenticated)
/account/orders             Order history
/account/subscriptions      Subscription management
/account/wishlist           Wishlist
/account/settings           Account settings
/faq                        Frequently asked questions
/shipping-returns           Shipping and returns policy
/terms                      Terms of service
/privacy                    Privacy policy
```

**Note:** No Stockists page. Hand of Yah is direct-to-consumer only.

---

## 8. Design Requirements

### Design Flag: `critical`

This is a premium, brand-critical website. Visual design quality is the single most important factor in the redesign. The site must look and feel like it belongs alongside Aesop, Byredo, and Le Labo -- not like a Squarespace template. This project requires `/frontend-design` skill invocation during implementation.

### Visual Direction: Aesop-Inspired

The design language draws from Aesop's approach: restrained luxury, typographic confidence, editorial photography, and calm interaction design. Hand of Yah is not Aesop -- it has its own identity with moderate spiritual/holistic undertones -- but Aesop sets the quality bar.

**Core principles:**

1. **Visual stillness.** Every page should feel calm and uncluttered. One focal point per viewport. Generous whitespace. No visual noise.

2. **Typographic hierarchy.** Typography carries the design. Use a refined type system (see Brand Identity section) with clear hierarchy: bold for labels, regular for body, consistent sizing scale. Every word should feel chosen.

3. **Editorial photography.** Product images are the primary visual asset. Soft, natural lighting. Texture and materiality visible. Lifestyle imagery shows the ritual of use, not just the product. No generic stock photos.

4. **Monochromatic with warmth.** Neutral, earthy color palette as the foundation -- soft grays, warm taupes, muted creams. Brand accent color used sparingly and intentionally.

5. **Grid discipline.** Three-column grid as the structural foundation. Consistent heights. Symmetrical imagery. Alignment to the grid is non-negotiable.

6. **Calm motion.** Transitions should be smooth and deliberate. Page transitions, hover states, and scroll-triggered reveals should feel effortless. No bounce, no overshoot, no playful animation. Motion serves navigation, not decoration.

### Responsive Design

- **Mobile-first.** 65% of traffic is expected to be mobile. Design mobile layouts first, then expand.
- **Breakpoints:** Mobile (< 768px), Tablet (768px - 1024px), Desktop (> 1024px), Wide (> 1440px)
- **Touch targets:** Minimum 44x44px on mobile
- **Navigation:** Full horizontal nav on desktop. Slide-out drawer on mobile with smooth animation.
- **Product grids:** 1 column on mobile, 2 on tablet, 3 on desktop

### Key Page Design Notes

**Homepage:**
- Hero section: single striking product or lifestyle image, minimal text, clear entry point to shop
- Featured products: curated grid (3 items on desktop), not a full catalog dump
- Journal preview: 1-2 recent posts with editorial-quality imagery
- Brand story teaser: single paragraph with link to About page
- Newsletter signup: minimal form, integrated into the page flow
- No carousels. No sliders. Static, confident composition.

**Product Detail Page:**
- Large product image (left or top on mobile), zoomable
- Product name, price, subscription toggle, add-to-cart -- all above the fold
- Below the fold: full description, ingredient list (expandable), usage instructions
- Related products at bottom (3-item grid)
- Design reference: Aesop's PDP with its clean two-column layout

**Collection Pages:**
- Category name as page heading, optional short description
- Product grid: image, name, price. No ratings, no badges, no visual clutter.
- Consistent image aspect ratios across all products

**Journal:**
- Magazine-style listing: featured post at top (large image), grid of recent posts below
- Individual posts: editorial layout with generous margins, pull quotes, inline images
- Author and date displayed subtly

**Cart:**
- Slide-out drawer on desktop (not a separate page) with option to view full cart page
- Line items with image thumbnail, name, quantity, price, subscription badge if applicable
- Clear progression to checkout

**Checkout:**
- Single-page checkout (inspired by Aesop)
- Steps: Shipping info, Shipping method, Payment (Stripe Elements), Review and confirm
- Minimal distractions -- no header nav, no footer, just the checkout flow and a link back to cart

---

## 9. Brand Identity Development

**No existing brand guidelines exist.** The redesign must include the creation of a complete brand identity system. This is a prerequisite for design work and should be completed before page design begins.

### Brand Identity Deliverables

**9.1 Logo refinement.** Evaluate the current logo. If it meets quality standards, refine for digital use (SVG, favicon, social media sizes). If it does not, propose a revision that aligns with the new visual direction.

**9.2 Color palette.** Define a primary palette (3-4 colors) and an extended palette (2-3 supporting colors). The palette should:
- Be rooted in neutral, earthy tones (reference: Aesop's muted grays, warm taupes, pale yellows)
- Include at least one warm accent for calls-to-action and highlights
- Work on both light and dark backgrounds
- Meet WCAG AA contrast requirements for all text-background combinations

**9.3 Typography.** Select a type system of 2 fonts maximum:
- A heading/display typeface with personality (serif or refined sans-serif)
- A body typeface optimized for screen readability
- Define a complete type scale: sizes, weights, line heights, letter spacing for headings (H1-H4), body, captions, buttons, and navigation
- Typefaces must be web-licensed and performant (variable font preferred)

**9.4 Photography direction.** Document the photography style:
- Product photography: angles, lighting, backgrounds, styling
- Lifestyle photography: setting, mood, subject, color grading
- Provide 3-5 reference images as a mood board

**9.5 Brand voice.** Document the tone for all written content:
- Calm, knowledgeable, warm. Not clinical, not mystical.
- Holistic philosophy is present but grounded -- spirituality expressed through care and intention, not esoteric language
- Write as a trusted friend who happens to be a skincare expert

**9.6 Brand guidelines document.** Compile all of the above into a single reference document (PDF or dedicated page in the CMS) that the owner can share with photographers, copywriters, and future collaborators.

---

## 10. E-Commerce Requirements

### Product Management

**EC-1.** Products are managed in the CMS (Sanity or equivalent). Each product record includes: name, slug, price, description (rich text), ingredients (structured list), usage instructions, category assignment, images (multiple, ordered), subscription eligibility flag, and active/draft status.

**EC-2.** Categories are fixed for MVP (Face, Supplements, Hair Oils, Eye Cremes, Face Masques, Fragrances). A product can belong to one primary category.

### Cart

**EC-3.** The cart must persist across sessions for authenticated users (server-side) and across browser sessions for guests (local storage with cookie fallback).

**EC-4.** Each cart line item must display: product image, product name, unit price, quantity selector, line total, and a subscription badge with frequency if applicable.

**EC-5.** The cart must show a subtotal, estimated shipping, estimated tax, and order total.

### Checkout

**EC-6.** Checkout must be a single-page flow: shipping information, shipping method selection, payment via Stripe Elements, order review and confirmation.

**EC-7.** Guest checkout must be supported. Guests are offered the option to create an account after completing their order.

**EC-8.** Successful checkout must: create an order record, trigger a confirmation email, decrement inventory (if tracked), and create a Stripe subscription for subscription items.

### Subscriptions

**EC-9.** Customers must be able to select subscription frequency at the product level: every 1 month, every 2 months, or every 3 months.

**EC-10.** Subscription management (via account dashboard) must allow: view active subscriptions, change frequency, skip next delivery, pause subscription, cancel subscription.

**EC-11.** The system must send reminder emails before each subscription renewal (configurable: 3 days before, 7 days before).

### Shipping and Tax

**EC-12.** Shipping rates may be flat-rate, free-above-threshold, or calculated -- the specific model is a business decision for the owner. The system must support at least flat-rate and free-above-threshold at launch.

**EC-13.** Tax calculation must be handled for US domestic orders. Integration with a tax calculation service (Stripe Tax or similar) is recommended to ensure compliance across states.

### Inventory

**EC-14.** Basic inventory tracking is optional for MVP. If implemented: track stock quantity per product, display "Out of Stock" when quantity reaches zero, prevent add-to-cart for out-of-stock products.

---

## 11. Content Strategy

### Journal (Blog)

The journal is an MVP priority. It is central to the brand's content marketing and SEO strategy.

**CS-1.** The owner must be able to create, edit, and publish journal posts through the CMS. Posts support: title, featured image, rich text body (headings, paragraphs, lists, inline images, embedded video), excerpt, publication date, and SEO metadata (meta title, meta description).

**CS-2.** Journal posts must be categorized (categories managed in CMS) and display in reverse chronological order on the listing page.

**CS-3.** Each journal post must include social sharing buttons (copy link, share to Instagram, Facebook, Twitter) and related posts at the bottom.

### Learn Section

**CS-4.** The Learn section is a curated collection of educational articles about skincare routines, ingredient science, and wellness practices. Content structure matches journal posts but serves an evergreen educational purpose rather than a time-based editorial one.

**CS-5.** Learn articles should be linkable from product pages where relevant (e.g., a Face Masque product page links to a "How to Use a Face Masque" learn article).

### Ingredient Database

**CS-6.** Each ingredient is a CMS-managed record with: name, description (what it is, where it comes from), benefits (what it does for skin/body), and a list of products that contain it.

**CS-7.** The ingredient index page must be browsable (alphabetical or grouped) and searchable. Each ingredient links to its detail page, and from there to the products that use it.

### Content Rewrite

**CS-8.** All existing content from the Squarespace site must be reviewed and rewritten, not migrated as-is. Product descriptions, about page copy, and any journal posts worth keeping must be rewritten to match the new brand voice. See Section 14 for migration details.

---

## 12. Integration Requirements

### Payment: Stripe

**INT-1.** Stripe is the sole payment processor. Integration includes: Stripe Checkout or Stripe Elements for payment collection, Stripe Subscriptions for recurring billing, Stripe Webhooks for order fulfillment events (payment_intent.succeeded, invoice.paid, customer.subscription.updated, etc.).

### CMS: Headless CMS (Sanity Recommended)

**INT-2.** A headless CMS must serve as the content management layer. The CMS must support: structured content modeling, rich text editing, image management with transformations, a preview/draft workflow, and a non-technical-friendly editing interface. Sanity is the recommended option based on its Studio UI, real-time collaboration, and Next.js integration. Final CMS selection is an architecture-phase decision.

### Email: Self-Hosted

**INT-3.** Email must be self-hosted (not a SaaS platform like Klaviyo or Mailchimp). This covers two concerns:

- **Transactional email:** Order confirmations, shipping notifications, subscription reminders, password resets. These must be reliable and immediate.
- **Marketing email:** Newsletter sends, promotional campaigns. The owner must be able to compose and send emails through a web interface.

Candidate solutions to evaluate during architecture phase: Listmonk (open-source newsletter + transactional), Mautic (open-source marketing automation), or a custom solution using an SMTP relay (Amazon SES, Postmark) with a simple admin UI.

**INT-3a.** Regardless of solution, the site must include a newsletter signup form (email collection) on the homepage footer and optionally on other pages.

### Analytics

**INT-4.** The site must include privacy-respecting analytics. Recommended: Plausible, Fathom, or Vercel Analytics. Google Analytics is acceptable if the owner prefers it. Analytics must track: page views, top products, conversion funnel (product view to cart to checkout to purchase), traffic sources.

### Social Media

**INT-5.** The site must link to the brand's social accounts (Instagram, Facebook, Twitter/X, YouTube) in the footer and optionally display an Instagram feed on the homepage or about page. Social sharing must be available on journal posts and product pages.

---

## 13. Scope

### MVP (Phase 1 -- This PRD)

Everything described in Sections 5-12 above is in scope for MVP:

- Complete brand identity development
- Homepage, all collection pages, product detail pages
- Shopping cart and single-page checkout via Stripe (USD only)
- Subscription support (monthly, bi-monthly, quarterly)
- Customer accounts with order history, subscription management, and wishlists
- Journal (blog) with CMS management
- Learn section with CMS management
- Ingredient database
- About, Contact, FAQ, Shipping/Returns, Terms, Privacy pages
- Newsletter signup with self-hosted email
- Transactional emails (order confirmation, shipping, subscription reminders)
- SEO optimization (structured data, sitemap, meta tags)
- Responsive design (mobile-first)
- Deployed on Vercel

### Phase 2 (Post-MVP -- Not in This PRD)

The following are acknowledged future needs but are explicitly out of scope for this PRD:

- Product reviews and ratings system
- Skin quiz / product recommendation engine
- Loyalty/rewards program
- Referral program
- Gift cards
- Product bundles organized by skin type
- Personalized logged-in experience with tailored recommendations
- How-to video content integrated into product pages
- Location/climate-based content personalization
- Advanced inventory management with low-stock alerts
- Multi-language support
- Marketing email campaigns (MVP covers transactional only; campaign tooling is Phase 2)
- Advanced analytics dashboard for the owner

---

## 14. Content Migration

### Approach: Review and Rewrite

Content from the current Squarespace site will not be migrated as-is. The existing content has quality issues (placeholder text, demo content, inconsistent voice). The migration process is:

1. **Audit.** Catalog all existing content: product listings, journal posts, page copy, images.
2. **Triage.** For each content item, decide: rewrite, discard, or use as-is (expected to be rare).
3. **Rewrite.** All product descriptions, page copy, and viable journal posts are rewritten to match the new brand voice (see Section 9.5).
4. **Photography.** Evaluate existing product photography. If quality is sufficient, migrate images. If not, flag for new photography (this is a business decision with cost implications).
5. **CMS entry.** All final content is entered into the new CMS. No automated migration from Squarespace is planned.

### Content Inventory (Known)

| Content type | Estimated count | Migration action |
|---|---|---|
| Products | Small catalog (est. 15-30) | Rewrite all descriptions and ingredients |
| Product images | Unknown | Evaluate quality; migrate or reshoot |
| Journal posts | Few (mostly demo content) | Discard demo; rewrite any real posts |
| Page copy (About, FAQ, etc.) | 6-8 pages | Rewrite all |
| Lifestyle/brand images | Unknown | Evaluate; keep high-quality, replace rest |

---

## 15. Constraints and Assumptions

### Constraints

1. **USD only.** No multi-currency support in MVP. Single currency simplifies checkout, tax calculation, and subscription billing.
2. **Self-hosted email.** The owner has specifically requested no SaaS email platforms. This adds infrastructure complexity and must be factored into the architecture and hosting plan (likely a separate service on Render or a VPS).
3. **Owner-managed content.** The CMS must be intuitive enough for a non-technical user. Any content workflow that requires developer intervention for routine updates is a failure.
4. **Vercel hosting.** Frontend deployment is on Vercel. This is a hard constraint.
5. **Stripe only.** No PayPal, Apple Pay, or alternative payment methods in MVP. (Note: Stripe supports Apple Pay and Google Pay natively through Payment Request Button -- enabling these within Stripe is low effort and should be considered.)
6. **No existing brand guidelines.** Brand identity must be developed as part of this project. This is a prerequisite that gates visual design work.

### Assumptions

1. The product catalog is small (under 50 SKUs). Architecture decisions assume a small catalog that does not require faceted search, filtering by multiple attributes, or pagination beyond basic load-more.
2. Order volume is low to moderate. The system does not need to handle flash-sale traffic spikes or warehouse management system integration at launch.
3. The owner will provide or commission product photography. The project team is responsible for photography direction (Section 9.4) but not for the photography itself.
4. Content rewriting is handled as part of this project. The timeline must account for copywriting effort.
5. DNS for handofya.com can be pointed to Vercel when ready. The owner controls the domain.

### Suggested Tech Stack

The following is a recommendation for the architecture phase. Final decisions are made in Phase 3/4.

| Layer | Recommendation | Rationale |
|---|---|---|
| Frontend | Next.js 14+ (App Router) | SSR/SSG for SEO, React ecosystem, Vercel-native |
| CMS | Sanity | Best-in-class Studio UI for non-technical owners, real-time preview, structured content |
| Payments | Stripe (Checkout + Subscriptions) | Owner's choice; excellent subscription support |
| Auth | Supabase Auth or NextAuth.js | Customer accounts, session management |
| Database | Supabase (PostgreSQL) | Orders, customers, wishlists, subscriptions metadata |
| Email | Listmonk on Render (or similar) | Self-hosted, open-source, web UI for newsletters, SMTP relay for transactional |
| Hosting | Vercel (frontend), Render (API/email) | Owner's existing infrastructure preferences |
| Analytics | Plausible or Vercel Analytics | Privacy-respecting, lightweight |

---

## 16. Success Metrics

### Launch KPIs (Measured at 30 and 90 days post-launch)

| Metric | Target | How measured |
|---|---|---|
| Lighthouse performance (mobile) | 90+ | Lighthouse CI on every deploy |
| Largest Contentful Paint | < 2.5s on 4G | Lighthouse / Web Vitals |
| Cumulative Layout Shift | < 0.1 | Lighthouse / Web Vitals |
| Bounce rate (homepage) | < 45% | Analytics |
| Average session duration | > 2 minutes | Analytics |
| Cart abandonment rate | < 70% | Analytics (funnel tracking) |
| Conversion rate (visit to purchase) | > 1.5% | Analytics + Stripe |
| Subscription adoption | > 10% of orders include a subscription item | Stripe dashboard |
| Organic search impressions | 2x baseline within 90 days | Google Search Console |
| Content publishing frequency | Owner publishes 2+ journal posts/month | CMS activity log |
| WCAG compliance | AA on all pages | Automated + manual audit |

### Qualitative Success Criteria

- The owner feels confident managing content independently
- First-time visitors describe the site as "premium" or "beautiful" (gather via post-launch survey or user testing)
- No broken links, placeholder content, or demo text on any page at launch

---

## 17. Optional Enhancements (Not in Scope)

The following features were identified during analysis as valuable but are not part of the MVP. They are documented here for future planning.

| Enhancement | Description | Recommended phase |
|---|---|---|
| Product reviews | Customer ratings and written reviews on product pages | Phase 2 |
| Skin quiz | Interactive questionnaire that recommends products based on skin type, concerns, and goals | Phase 2 |
| Loyalty program | Points-based rewards for purchases, reviews, referrals | Phase 2 |
| Referral program | Share-a-link program with discount incentives | Phase 2 |
| Gift cards | Digital gift cards purchasable and redeemable on the site | Phase 2 |
| Product bundles | Curated sets organized by skin type or routine (e.g., "Morning Ritual") | Phase 2 |
| Personalized recommendations | Tailored product suggestions based on purchase history and browsing behavior | Phase 2 |
| Video content | How-to videos embedded in product pages and learn articles | Phase 2 |
| Multi-language | Site content in additional languages | Phase 3 |
| Multi-currency | Support for CAD, GBP, EUR, etc. | Phase 3 |
| Advanced analytics | Owner-facing dashboard with sales trends, customer cohorts, LTV | Phase 3 |
| Marketing automation | Automated email flows (welcome series, abandoned cart, win-back) | Phase 2 |
| Apple Pay / Google Pay | One-tap payment via Stripe Payment Request Button (low effort, could be promoted to MVP) | Phase 1.5 |

---

## Constraint Architecture

### Must Do (Non-Negotiable)

1. **Brand identity first.** Complete brand guidelines (color, type, photography direction, voice) before any page design begins. Design without guidelines will be rejected.
2. **Mobile-first design.** All layouts designed for mobile viewport first, then expanded. No desktop-first designs adapted down.
3. **Owner-manageable content.** Every piece of content the owner might want to update (products, journal, pages, FAQs) must be editable through the CMS without developer involvement.
4. **Single-page checkout.** The checkout flow must not span multiple pages. Stripe Elements embedded directly in the checkout page.
5. **Real product content at launch.** No lorem ipsum, no placeholder images, no "coming soon" sections. Every page that ships must have real, rewritten content.

### Must Not Do

1. **No template aesthetics.** The site must not look like a theme or template. No generic hero carousels, no cookie-cutter product grids, no stock UI patterns. Every element must feel intentional and branded.
2. **No visual noise.** No pop-ups, no slide-in promotions, no notification bars, no chat widgets, no floating action buttons. The design must breathe.
3. **No feature creep into MVP.** Do not implement Phase 2 features (reviews, quiz, loyalty, etc.) during MVP development, even if "it would be easy to add." Ship the defined scope.
4. **No SaaS email platforms.** Do not integrate Klaviyo, Mailchimp, ConvertKit, or similar. Email is self-hosted per owner's requirement.
5. **No multi-currency.** USD only. Do not add currency selectors or conversion logic.

### Preferences (Trade-off Guidance)

| When this conflicts with this | Prefer | Because |
|---|---|---|
| Design polish vs. feature count | Design polish | This is a premium brand. One beautiful page beats three mediocre ones. |
| Page load speed vs. high-res imagery | Speed, with progressive enhancement | Serve optimized images by default; allow zoom for full resolution. Users leave slow sites. |
| CMS flexibility vs. design consistency | Design consistency | Constrain CMS options (e.g., fixed layout blocks) so the owner cannot accidentally break the design. |
| Self-hosted email reliability vs. SaaS convenience | Self-hosted (owner's requirement) | Accept the operational overhead. Mitigate with monitoring and fallback SMTP relay. |
| Subscription UX complexity vs. simple checkout | Simple checkout | Subscription option should be a toggle on the product page, not a separate flow. Keep checkout unified. |

### Escalation Triggers

1. **Photography gap.** If existing product photography is evaluated and found insufficient for the design quality standard, escalate immediately. New photography requires time and budget that affects timeline.
2. **Self-hosted email complexity.** If the self-hosted email solution proves unreliable during development (deliverability issues, spam filtering, infrastructure cost), escalate to discuss whether a managed SMTP relay (SES, Postmark) is acceptable as the transport layer.
3. **CMS limitations.** If the selected CMS cannot support a content model needed for MVP (e.g., ingredient cross-referencing, subscription product configuration), escalate before building workarounds.
4. **Brand identity disagreement.** If the owner rejects the proposed brand identity direction after two revision rounds, escalate to discuss whether to bring in an external brand designer.
5. **Scope pressure.** If during development there is pressure to add Phase 2 features to MVP, escalate. Do not silently expand scope.
