# Hand of Yah — Design Critique and New Direction

A side-by-side analysis of what is wrong with the current handofya.com and how the redesign fixes each problem. This document is the rationale for every design decision in the new site.

**Audit date:** 2026-03-27
**Method:** Playwright automated screenshots (11 captures across desktop, tablet, mobile), manual content review, and Four Pillars visual assessment

---

## The Honest Assessment

The current site does more damage than good. Placeholder text from the Squarespace template is live on the homepage. The hero section has no headline. Products advertised on the homepage do not exist in the shop. Paid products have spelling errors in their names. One product image has "DALL-E" in the filename. Social media links point to Squarespace's corporate accounts, not the brand's. There is no About page, no brand story, no reason for anyone to trust this business.

Every one of these issues compounds into a single message: this brand is not real, not careful, and not worth your money. It would be better to take the current site offline, finish it properly, and relaunch than to leave it up in this state.

The redesign addresses every issue structurally, not cosmetically. What follows is a point-by-point breakdown.

---

## Overall Score

| Pillar | Current | New Target |
|--------|---------|------------|
| Visual Hierarchy and Layout | 3/10 | 9/10 |
| Typography and Readability | 4/10 | 9/10 |
| Color and Brand Expression | 5/10 | 9/10 |
| Interaction and Polish | 3/10 | 9/10 |
| **Overall** | **3.75/10** | **9/10** |

---

## 1. The Domain Does Not Match the Brand Name

The brand is called "Hand of Yah" but the domain is handofya.com, missing the "h." Customers hearing the name will type handofyah.com and get nothing. Search engines treat the two spellings as different terms, diluting SEO. For a premium brand, this mismatch signals a lack of attention to detail.

**The fix:** Register handofyah.com and redirect it to the primary domain. If handofyah.com becomes the primary, redirect handofya.com. Either way, both domains must resolve. The new site includes canonical URL declarations on every page and consistent spelling in all metadata and structured data. This is a decision for the owner, but it must be resolved before launch.

---

## 2. The Site Shipped Unfinished

The homepage contains Squarespace placeholder text ("This is example content"), Latin filler titles, and template setup instructions visible to the public. For a brand charging $40-48 per product, this tells visitors nobody reviewed the site before publishing.

**The fix:** The PRD explicitly forbids it. No placeholder text, no "coming soon" sections, no lorem ipsum. Every page ships with real, reviewed content or does not ship. The CMS (Sanity) provides draft/publish workflow so incomplete content stays hidden until the owner publishes it.

---

## 3. The Homepage Sells Products That Do Not Exist

The homepage promotes skincare, supplements, face masques, eye creme, and hair oil. None of these categories exist in the shop. The actual shop sells essential oils, colognes, and empty bottles. A visitor clicking "Shop Now" expecting skincare lands on a cologne page and leaves.

**The fix:** The homepage's "Featured Products" section is dynamically fetched from the same database that powers the shop. It only shows products with `status: active` and `featured: true`. It is structurally impossible for the homepage to advertise products that are not in the shop.

---

## 4. Paid Products Have Spelling Errors

"Lavander" instead of Lavender. "Eua de Parfume" instead of Eau de Parfum, repeated multiple times. If a brand cannot spell what it is selling, customers will not trust what is inside the bottle.

**The fix:** All existing content goes through a mandatory review-and-rewrite process during migration. The ingredient database uses structured references: each ingredient name is defined once in the CMS and referenced by every product that uses it, eliminating per-product typos.

---

## 5. An AI-Generated Product Image Is Live

The Darteri cologne product image has "DALL-E" in the filename. For a brand whose positioning is artisanal, natural, and hand-crafted, using AI-generated imagery is directly contradictory. Customers who notice this will question whether anything about the brand is genuine.

**The fix:** The brand identity document defines explicit photography direction: real products on real surfaces with real lighting. The existing amber bottle photography on the current site proves the owner can produce genuine product images. The redesign requires all photography to be authentic. The CMS stores image metadata, making it easy to audit every image source.

---

## 6. Product URLs Expose the Template

Cinnamon oil lives at `/body-wash-nwdwl`. Rose is at `/salt-soak-3f7lk`. These auto-generated Squarespace slugs are SEO poison (search engines use URL structure as a relevance signal) and tell technically-aware visitors that the site was never configured.

**The fix:** Every product URL follows a clean pattern: `/shop/rosehip-facial-oil`, `/shop/ginger-root-creme`. The Sanity CMS auto-generates slugs from product names with manual override capability.

---

## 7. Social Links Go to Squarespace

The social media icons in the footer link to Squarespace's corporate accounts, not Hand of Yah's actual profiles. A visitor clicking the Instagram icon expects to see the brand's feed and instead lands on Squarespace's marketing page.

**The fix:** Social links in the new footer are clearly labeled and will point to the brand's actual profiles. They are easy to update in the code without touching the CMS.

---

## 8. There Is No Brand Story

No About page. No founder. No "why." At $40-48 price points, customers need a reason to buy from this brand over any other. The current site provides zero emotional or rational justification for its prices.

**The fix:** The new site includes a dedicated About page with the brand's story, a philosophy strip on the homepage ("Skincare is self-care"), a Brand Story section with the narrative "Crafted with intention, rooted in nature," and an ingredient database that builds trust through transparency. The brand voice guidelines ensure all copy communicates warmth, expertise, and purpose.

---

## 9. No Reviews, No Testimonials, No Proof

Nothing on the site provides evidence that anyone has used these products. No reviews, no testimonials, no press mentions, no UGC. At premium pricing, social proof is not optional.

**The fix:** Product reviews are scoped for Phase 2 of the roadmap. For MVP launch, the journal and ingredient database serve as trust-building mechanisms: educational content demonstrates expertise, ingredient transparency demonstrates honesty. Post-MVP, the review system will include verified purchase badges and a moderation queue.

---

## 10. The Logo Does Not Fit the Brand

The current wordmark uses a heavy slab-serif typeface with thick, blocky strokes. It reads as western saloon, tattoo parlor, or craft brewery. A customer seeing this logo would never associate it with premium skincare.

| Quality | Current | New |
|---------|---------|-----|
| Typeface | Heavy slab-serif | Cormorant Garamond (calligraphic serif) |
| Weight | Ultra bold | Regular (400) |
| Feel | Aggressive, loud | Refined, warm, quiet confidence |
| Category signal | Barbershop, brewery | Luxury skincare, apothecary |
| Implementation | Image file | Live text (scalable, editable) |

**The fix:** The wordmark is rendered as live text in Cormorant Garamond, uppercase, letter-spacing 0.15em. The calligraphic stroke terminals echo "the hand" in the brand name. A companion monogram or botanical mark can be developed later, but the heavy slab-serif must not carry forward.

---

## 11. The Hero Has No Headline

The desktop hero shows a product image in the right 60% of the viewport. The left 40% is completely blank. No headline, no brand statement, no value proposition. A first-time visitor has no textual context about what they are looking at or why they should stay. On mobile, the "Shop Now" CTA is an underlined text link, and the cookie consent banner blocks it entirely.

**The fix:** The hero is a two-column layout with a clear hierarchy: overline ("New Arrival"), headline ("Ginger Root Creme" at 4.5rem), subtitle (one sentence), and a proper terracotta CTA button. On mobile, the image stacks above the copy with the CTA below, never blocked by a consent banner.

---

## 12. The Homepage Is Empty Color Blocks

Below the hero, the homepage scrolls through large sections that render as flat color planes (mauve, forest green, light gray, cream) with no content inside them. The scroll experience is a series of painted voids. Whether these are lazy-load failures or genuinely empty sections, the result is the same: a visitor sees nothing that explains the brand, showcases products, or invites engagement.

**The fix:** Every section earns its space. The new homepage has six purposeful sections: a philosophy strip, featured products (3 cards dynamically pulled from the shop), a brand story block, an ingredients banner, a journal preview (2 recent posts), and a newsletter signup. No section exists without content.

---

## 13. There Is No Typographic Hierarchy

No page demonstrates a clear heading progression. The hero headline mixes italic and roman weight in a single phrase without intent. CTAs are indistinguishable from body text. Product names are barely legible. No type scale has been defined.

**The fix:** A two-font system with a defined 10-level type scale. Cormorant Garamond carries all headings and display text (the brand's voice). Outfit carries all body text and interface elements (clean, invisible, supportive). Sizes range from 4.5rem (hero) down to 0.75rem (labels). Every element has an assigned level.

---

## 14. The Color Palette Is Passive

The palette is coherent (warm neutrals, botanical tones) but does no active work. There is no accent color. CTAs have the same color as surrounding text. The product photography contains beautiful warm tones (amber glass, terracotta stone) but the designed color system does not integrate with them.

**The fix:** Seven named colors, each with a defined role. Parchment (#F5F0E8) replaces white everywhere. Umber (#2C2420) replaces black. Terracotta (#C4704B) is the accent, used only on primary CTAs, active states, and hover — its scarcity makes it effective. The palette is drawn from the brand's own product photography: amber glass, volcanic stone, dried herbs, sun-warmed linen.

---

## 15. CTAs Are Text Links, Not Buttons

Every call to action on the current site is an underlined text link. There are no buttons anywhere. This forces the user to already intend to act in order to notice the CTA. It does not invite action.

**The fix:** Three CTA tiers. Primary: terracotta fill, parchment text, square edges, 16px/32px padding (confident, unmistakable). Secondary: transparent fill with umber border (supporting actions). Text link: underline slides in on hover (inline navigation). The terracotta button is the strongest visual signal on every page.

---

## 16. The Footer Is Empty

The footer renders as a solid black rectangle with no content. No links, no social icons, no copyright, no newsletter signup.

**The fix:** A fully populated four-column footer on an espresso background. Brand statement with tagline, shop category links, company links (About, Ingredients, Journal, Contact, FAQ), social connections, and a newsletter signup form. Copyright and legal links at the bottom.

---

## 17. The Shop Has No Merchandising

All products carry equal visual weight. No featured products, no category navigation, no editorial context. One product (dark cologne) is visually inconsistent with the botanical amber-glass brand. The scraper found zero proper anchor tags on product cards, meaning they may not be clickable or crawlable.

**The fix:** Product cards on stone backgrounds with 4:5 image ratios, category labels, product names in serif, prices in light weight. Hover effects with subtle lift and shadow. Every card is a proper `<a>` element. Category pages at `/shop/category/[slug]` for all six categories. Clean, consistent merchandising.

---

## 18. Mobile Is Not Optimized

With 65% of expected traffic coming from mobile devices, the mobile experience is the primary experience for most customers. The current site fails this majority in multiple ways.

The cookie consent banner occupies the bottom third of the mobile viewport, directly covering the "Shop Now" CTA. A first-time mobile visitor's first action is blocked. The tablet breakpoint (768px) renders a third layout that shares no visual logic with either the desktop or mobile views — it is a disconnected design, not a responsive adaptation. The mobile navigation hamburger could not be triggered during automated Playwright testing, raising concerns about touch-target reliability on real devices. Product cards have no visible pricing at mobile scale. There are no loading indicators when content lazy-loads, leaving large color voids visible while the user waits.

Beyond these bugs, there is no evidence of mobile-first design thinking. Text sizes do not adapt between breakpoints. Touch targets are not sized for fingers. The cart experience is not optimized for one-handed use. The checkout flow has no mobile-specific accommodations.

**The fix:** The new site is designed mobile-first. Every layout starts at 375px and expands outward, not the other way around.

Specific mobile optimizations in the new build:
- **Responsive breakpoints:** 375px (mobile), 768px (tablet), 1024px (desktop), 1440px (wide) — one fluid system, not three disconnected layouts
- **Touch targets:** Minimum 44x44px on all interactive elements (buttons, links, form inputs, nav items)
- **Mobile navigation:** Full-screen slide-out drawer from the right with smooth 300ms animation, close button, and all primary + secondary navigation links accessible
- **Cart drawer:** Slides in from the right, works identically on mobile and desktop, with quantity controls sized for touch
- **Checkout:** Single-page flow with form fields sized for mobile keyboards, shipping address autocomplete, and a sticky "Pay" button at the bottom
- **Product grid:** 1 column on mobile (full-width cards for maximum image impact), 2 on tablet, 3 on desktop
- **Typography scaling:** Display headings scale down from 4.5rem (desktop) to 2.75rem (mobile). Body text stays at 1rem for readability.
- **Image optimization:** Next.js `<Image>` component serves responsive sizes via `srcset`. Mobile devices receive smaller images, reducing data usage and load time.
- **No content-blocking overlays:** Cookie consent uses a slim bottom bar that never covers page content or CTAs
- **Performance targets:** LCP under 2.5s on a 4G connection, Lighthouse mobile score of 90+

---

## 19. The Learn Page Is Not a Content Hub

The Learn page has a hero image, one paragraph, a color block, and a flat-lay photo. No article grid, no content index, no subtopics. A user clicking "Learn" finds a brand statement, not education.

**The fix:** A proper content hub. Journal with magazine-style listing (featured post hero, grid of recent posts). Learn section with article grid and cross-linking to related products. Ingredient database with search, alphabetical browsing, and detail pages that show which products contain each ingredient. All CMS-managed so the owner can publish without a developer.

---

## 20. No Motion Design

No hover states on products. No scroll animations. No loading states. The site feels static and unfinished rather than intentionally minimal.

**The fix:** Motion follows the "Sacred Apothecary" principle: smooth, unhurried, organic. Content fades up on scroll (600ms ease-out). Product cards lift on hover (2px, 300ms). Nav links get a terracotta underline that slides in (300ms). Header gains a subtle shadow on scroll. No bounce, no parallax, no scroll hijacking. Motion serves navigation, not decoration.

---

## Summary

The current site has one genuine asset: beautiful product photography. Amber glass bottles on stone, botanical flat-lays, natural materials lit with warm light. Everything else fails.

The redesign preserves those photographic assets and builds a complete design system around them. The concept, "Sacred Apothecary," positions Hand of Yah at the intersection of luxury refinement and spiritual groundedness. Where competitors are either cold and clinical or generic and boho, Hand of Yah is warm. The one skincare site that feels like stepping into a candlelit space with stone counters, amber glass, and dried botanicals.

Every problem documented above has a structural fix in the new architecture. The Sanity CMS prevents content mismatches. Clean URLs are enforced by the schema. Spelling errors are eliminated through structured references. Brand identity is defined before any page is designed. And nothing ships without real content.
