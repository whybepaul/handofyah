# Applicable Standards: Hand of Yah

## Design Standards
- WCAG 2.1 Level AA compliance (all pages)
- Mobile-first responsive design (breakpoints: 375, 768, 1024, 1440)
- Minimum touch target: 44x44px on mobile
- Color contrast: minimum 4.5:1 for normal text, 3:1 for large text

## Performance Standards
- Lighthouse Performance: 90+ (mobile)
- LCP: < 2.5s on 4G
- CLS: < 0.1
- FID/INP: < 200ms
- Images: WebP/AVIF with responsive srcset, lazy loading below fold

## SEO Standards
- Unique meta title and description per page
- JSON-LD structured data: Product, Offer, BreadcrumbList, Article
- Dynamic sitemap.xml and robots.txt
- SSR/SSG for all public pages (no client-only rendering for indexable content)
- Canonical URLs on all pages

## Security Standards
- HTTPS everywhere
- Stripe handles PCI compliance (no card data on our server)
- Password hashing via Supabase Auth (bcrypt)
- CSRF protection on all form submissions
- Content Security Policy headers
- Rate limiting on API routes (auth, contact, newsletter)

## Code Standards
- TypeScript strict mode
- ESLint + Prettier
- Component-based architecture (React Server Components where possible)
- Sanity GROQ queries typed with Sanity TypeGen
- API routes with input validation (Zod)
- Environment variables for all secrets (.env.local, never committed)

## E-Commerce Standards
- PCI DSS compliance via Stripe (no card data stored)
- Tax compliance for US domestic orders (Stripe Tax)
- Subscription billing follows Stripe best practices (idempotency keys, webhook verification)
- Cart persistence: server-side for authenticated, localStorage for guests

## Email Standards (Self-Hosted)
- SPF, DKIM, DMARC records configured for handofya.com
- Transactional emails sent within 30 seconds of triggering event
- Unsubscribe link in all marketing emails (CAN-SPAM compliance)
- Double opt-in for newsletter subscriptions
