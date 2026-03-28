# Implementation Plan: Hand of Yah Website Redesign

## Overview
Complete redesign and re-platform of handofya.com from Squarespace to a custom Next.js + Sanity CMS + Stripe e-commerce site, deployed on Vercel.

## Implementation Sequence

### Pre-Development: Brand Identity
1. Develop color palette (neutral/earthy foundation + warm accent)
2. Select typography system (2 fonts max: display + body)
3. Define photography direction and mood board
4. Document brand voice guidelines
5. Compile brand guidelines document

### Phase A: Foundation
1. Scaffold Next.js 14+ project with App Router
2. Configure Sanity Studio with content models (products, journal, learn, ingredients, pages)
3. Set up Supabase (auth, database for orders/customers/wishlists)
4. Implement design system: tokens, components, grid, type scale
5. Global layout: header nav, footer, responsive breakpoints

### Phase B: Commerce Core
1. Product listing pages (category grids)
2. Product detail pages (images, description, ingredients, subscription toggle)
3. Shopping cart (slide-out drawer + full page)
4. Stripe integration (Checkout/Elements, Subscriptions)
5. Single-page checkout flow
6. Order confirmation + transactional email (Listmonk)

### Phase C: Customer Accounts
1. Auth flow (signup, login, logout, password reset)
2. Account dashboard
3. Order history
4. Subscription management (pause, cancel, change frequency)
5. Wishlist

### Phase D: Content
1. Journal listing + post pages
2. Learn hub + article pages
3. Ingredient database (index + detail pages)
4. About, Contact, FAQ, Shipping/Returns pages
5. Newsletter signup integration

### Phase E: Polish and Launch
1. SEO (meta tags, structured data, sitemap, robots.txt)
2. Performance optimization (image optimization, lazy loading, caching)
3. Accessibility audit (WCAG 2.1 AA)
4. Content entry (rewritten product copy, journal posts, page content)
5. DNS cutover and go-live

## Dependencies
- Brand identity gates all visual component work (Phase A step 4+)
- Sanity content models gate content entry (Phase D step 5)
- Stripe account setup gates checkout testing (Phase B step 4+)
- Listmonk deployment gates transactional email (Phase B step 6)

## Risk Areas
- Self-hosted email deliverability
- Photography quality (may need reshoots)
- Content rewriting volume (15-30 products + pages)
- Brand identity approval cycles
