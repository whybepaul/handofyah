# References and Prior Art: Hand of Yah

## Design Inspiration

### Aesop (Primary Reference)
- **Work & Co case study:** https://work.co/clients/aesop/
- Design philosophy: immersive digital storefront inspired by in-store experience
- Typography: Suisse Int'l + Zapf Humanist (Optima variant) for web; Neue Helvetica for packaging
- Color palette: monochromatic with muted yellows (#ffefb5), dark taupe (#69615f), dark brown (#544d4b), light gray (#d3d1d4)
- UX patterns: three-column grid, shoppable navigation with elegant motion, one-page checkout
- Results: 15% higher conversion within 60 days of launch
- Fonts in Use: https://fontsinuse.com/uses/20234/aesop-logo-website-and-packaging

### Luxury Skincare Branding (2026 Principles)
- Source: https://www.itsdianadesign.com/blog/how-to-make-a-skincare-brand-look-luxury-a-2026-perspective
- Key principle: "Visual stillness" — restraint, breathing room, uncluttered navigation
- Photography: editorial, intentional, soft lighting, natural textures (stone, linen, water)
- Typography: serif or refined sans-serif; every word should feel chosen
- Avoid: crowding, generic stock photos, visual noise, inconsistency

### NN/g Design Analysis
- Source: https://www.nngroup.com/articles/why-does-a-design-look-good-part2/
- Aesop analysis: monochromatic palette, consistent heights, symmetrical imagery, type variation for hierarchy

## Current Site Audit
- Visual audit report: `../visual-audit.md`
- Overall score: 3.75/10 across Four Pillars
- 11 Playwright screenshots in `/tmp/handofya-screenshots/`
- Key finding: strong product photography, but Squarespace implementation fails to present it

## Technology References
- Next.js App Router: https://nextjs.org/docs/app
- Sanity CMS: https://www.sanity.io/docs
- Stripe Subscriptions: https://stripe.com/docs/billing/subscriptions
- Stripe Elements: https://stripe.com/docs/payments/elements
- Supabase Auth: https://supabase.com/docs/guides/auth
- Listmonk (self-hosted email): https://listmonk.app/docs/
- Vercel deployment: https://vercel.com/docs

## Infrastructure Preferences (from memory)
- Frontend: Vercel
- API: Render
- Database: Supabase
