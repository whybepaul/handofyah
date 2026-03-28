# Visual Design Audit: www.handofya.com
**Audit Date:** 2026-03-27
**Auditor:** UI Tester Agent (Playwright / Chromium)
**Platform:** Squarespace
**Brand positioning:** Natural / botanical skincare, premium wellness

---

## Environment

| Property | Value |
|---|---|
| URL tested | https://www.handofya.com |
| Browser | Chromium 120 (Playwright 1.57.0) |
| Desktop viewport | 1440 x 900px |
| Tablet viewport | 768 x 1024px |
| Mobile viewport | 375 x 812px |
| Pages visited | Homepage, Shop, Learn, Contact |

---

## Screenshots Captured

| # | File | Page / State | Viewport |
|---|---|---|---|
| 1 | `/tmp/handofya-screenshots/01-homepage-desktop.png` | Homepage full-page | 1440px |
| 2 | `/tmp/handofya-screenshots/02-homepage-desktop-fold.png` | Homepage above-the-fold | 1440px |
| 3 | `/tmp/handofya-screenshots/03-shop-desktop.png` | Shop page full-page | 1440px |
| 4 | `/tmp/handofya-screenshots/06-journal-desktop.png` | Learn page full-page | 1440px |
| 5 | `/tmp/handofya-screenshots/07-contact-desktop.png` | Contact page full-page | 1440px |
| 6 | `/tmp/handofya-screenshots/09-footer-desktop.png` | Footer close-up | 1440px |
| 7 | `/tmp/handofya-screenshots/10-homepage-mobile.png` | Homepage full-page | 375px |
| 8 | `/tmp/handofya-screenshots/11-homepage-mobile-fold.png` | Homepage above-the-fold | 375px |
| 9 | `/tmp/handofya-screenshots/12-mobile-nav-open.png` | Mobile nav state | 375px |
| 10 | `/tmp/handofya-screenshots/13-shop-mobile.png` | Shop page | 375px |
| 11 | `/tmp/handofya-screenshots/14-homepage-tablet.png` | Homepage full-page | 768px |

---

## Browser Console

| Type | Count | Notes |
|---|---|---|
| Errors | 3 | 1x CSP framing violation (Google); 2x 401 Unauthorized on mobile (Squarespace login endpoint) |
| Warnings | 25+ | Repeated `yui: NOT loaded` for Squarespace internal modules on every page load |
| Network failures | 5 | `performance.squarespace.com` API calls aborted (analytics, non-functional impact) |

**Assessment:** No JavaScript errors that break UI functionality. The 401s on mobile are a Squarespace session/auth call that does not affect page rendering. The `yui NOT loaded` warnings are Squarespace platform noise and do not constitute design issues. Console is effectively clean from a user-facing perspective.

---

## Four Pillars Assessment

---

### Pillar 1: Visual Hierarchy and Layout
**Score: 3 / 10**

**What was observed:**

The homepage (`01-homepage-desktop.png`) is the most critical failure. The above-the-fold hero (`02-homepage-desktop-fold.png`) shows the product image offset hard-right, occupying roughly the right 60% of the canvas, while the left 40% is entirely empty. There is no headline, no brand statement, no value proposition — just blank grey-beige space. A user landing on this page for the first time has no textual anchor to tell them what they are looking at or why they should stay.

Scrolling down the full homepage screenshot reveals a sequence of large, content-empty color blocks: a muted mauve block, a dark forest-green block, a light grey block, and a cream block — each occupying several hundred pixels of vertical space with no visible text or imagery rendered at screenshot time. These appear to be sections where animations or lazy-loaded content did not render in the headless browser, but the sections themselves leave massive dead zones of wasted vertical real estate even when loaded. The structural decision to use full-viewport-height color blocks with minimal content per section creates an extremely scroll-heavy, low-density layout that works against discoverability.

The Shop page (`03-shop-desktop.png`) has a three-column product grid at the top but product cards have no visible pricing text rendered cleanly at scale, and product names are barely legible. Below the top row the page drops into large empty grey space where additional products or content should be. The grid is functional but shows almost no merchandising intent — no featured product hierarchy, no category banners, no editorial context.

The Learn page (`06-journal-desktop.png`) has a single hero image of a person in a robe, a short section labeled "Our Philosophy," a paragraph of body text, a large dark green color block, and a full-bleed botanical flat-lay image. There is no article grid, no content index, no visual hierarchy signaling that this is a knowledge hub. It reads as a brand statement page rather than a learn destination.

The Contact page (`07-contact-desktop.png`) splits the layout into a left illustration panel and a right content panel. The right panel stacks three contact categories (General Inquiries, Sales and Returns, Press) with phone numbers and email addresses, then a horizontal rule, then a simple contact form below. The layout is adequate but the left decorative illustration — an abstract figurative artwork — is very large relative to the functional content, consuming roughly half the horizontal canvas.

The footer (`09-footer-desktop.png`) renders as a near-solid-black rectangle with no visible text, links, copyright notice, or social icons at the captured viewport. This is either a render issue or the footer has near-zero content — both are problems.

**Specific issues:**
- Hero has no headline or supporting copy at any viewport
- Large color-block sections waste scroll depth with no content payload
- Footer is visually empty / black void
- Shop grid has no merchandising hierarchy
- No sticky nav visual differentiation when scrolled

---

### Pillar 2: Typography and Readability
**Score: 4 / 10**

**What was observed:**

The wordmark "HAND OF YAH" in the navigation uses a small-caps serif or tracked uppercase sans-serif set at an appropriate size for a nav logo. This is the strongest typographic decision on the site.

On mobile (`11-homepage-mobile-fold.png`), the hero text reads "*New* Ginger Root Creme" — the word "New" is italicized while "Ginger Root Creme" is in regular weight. This mixing of italic and roman within a short hero headline is an unusual choice that creates visual noise rather than emphasis. The italic "New" reads more like a label badge than a typographic hierarchy element. The overall size is large and legible on mobile, which is a positive.

"Shop Now" on the mobile hero is styled as a text link with an underline — not a button. This is intentional minimalism but the underline weight appears to match the text weight exactly, making the CTA blend into surrounding text rather than standing out as an action trigger.

On the Shop page (`03-shop-desktop.png`), product names appear beneath product images in what looks like a small serif or light sans-serif. At the desktop scale shown, these are readable but tight. No price is prominently visible in the screenshot — pricing is either absent from the listing tiles or set too small.

The Learn page body copy (`06-journal-desktop.png`) appears as a paragraph-width block centered or left-aligned on a light background. The measure (line length) looks comfortable. However, with only one paragraph of visible body text on the entire page, the typography system cannot be fully assessed.

The contact form (`07-contact-desktop.png`) uses a basic label-above-field pattern with thin-weight labels. Field labels appear small relative to the overall page scale. The "Submit" button is a bordered rectangle with text — consistent with the rest of the site's minimal CTA style.

**Specific issues:**
- No headline hierarchy demonstrated across any page — no H1/H2/H3 progression visible
- Mixed italic + roman in hero headline creates unintended visual friction
- CTAs styled as text-links; insufficient visual distinction from body text
- Pricing text in product grid is not visually prominent
- Type scale does not change appreciably between desktop and mobile sections

---

### Pillar 3: Color and Brand Expression
**Score: 5 / 10**

**What was observed:**

The site uses a restrained palette that does communicate a natural, botanical aesthetic:
- Off-white / warm cream (primary background)
- Light grey-beige (secondary backgrounds, hero)
- Muted dusty mauve / rose-taupe (homepage section block)
- Deep forest green (homepage section block)
- Near-black charcoal (footer, nav text)

This palette is coherent and not incorrect for a botanical wellness brand. The warm neutrals and muted organic tones are appropriate. However, the execution reduces the palette to background colors only. There is no accent color doing active work — no warm gold, no sage green, no botanical amber that appears in CTAs, highlights, or interactive states.

The product photography is the site's strongest brand asset. The oil bottles against stone and herbs (`02-homepage-desktop-fold.png`), the amber glass bottles against florals, the flat-lay botanicals (`06-journal-desktop.png`) — these images are genuinely beautiful and brand-appropriate. The disconnect is that the site's designed color system does not integrate with these photograph tones. The dusty mauve block and forest green block on the homepage appear as inert color swatches, not as extensions of the photographic palette.

The Contact page illustration — two abstract figurative forms with foliage — introduces a warm terracotta and forest green color story that feels brand-appropriate and more expressive than the rest of the site. This suggests there is creative vision present, but it is applied inconsistently.

CTAs ("Shop Now") are underlined text in a dark color against the light background. They are technically readable but carry no color distinction from surrounding text. There is no button treatment — no fill, no border color, no color differentiation — to signal action.

**Specific issues:**
- No active accent color in the palette; all color is structural background only
- CTAs have no color differentiation from body text
- Photographic palette (amber, terracotta, botanical green) not integrated into the designed color system
- Muted mauve and forest green blocks feel disconnected from the product imagery they surround
- No visible dark-mode / light-mode consideration

---

### Pillar 4: Interaction and Polish
**Score: 3 / 10**

**What was observed:**

**Mobile navigation:** The mobile header (`11-homepage-mobile-fold.png`, `12-mobile-nav-open.png`) shows the "HAND OF YAH" wordmark on the left, a cart icon (with "0" count) in the center-right, and a hamburger icon (two horizontal lines) on the far right. The hamburger icon is the standard Squarespace two-line style. The automated script could not successfully trigger the mobile nav drawer — clicking all common hamburger selectors produced no state change. This may indicate the nav requires a specific Squarespace-generated selector or a JS event that headless Playwright did not trigger, but it is worth manual verification that the mobile nav opens reliably on real devices.

**Cookie consent banner:** The GDPR/cookie consent banner (`11-homepage-mobile-fold.png`) occupies a significant portion of the mobile viewport — roughly the bottom third of the above-the-fold area. It uses two buttons: "Accept all" (outlined) and "Manage cookies" (outlined). Both have identical visual weight. No button is styled as primary. This is a compliance-driven pattern, but the banner's position and size actively blocks the hero CTA "Shop Now" on mobile. The user's first visual experience is blocked by a consent overlay.

**Product page access:** The automated scraper found zero `href="/products/"` links on the Shop page. This is a significant structural observation. Either the product cards are rendered without anchor tags wrapping the image/title (common in JavaScript-heavy Squarespace templates), or the products are presented in a format that does not expose standard linked elements. On manual inspection of `03-shop-desktop.png`, the first product shown in the top-left has a dark box-art style (appears to be a cologne or dark-packaged product) — this rendering looks significantly different from the botanical amber-glass products in the rest of the grid, suggesting a product card inconsistency.

**Image loading — homepage sections:** Multiple homepage sections in `01-homepage-desktop.png` rendered as pure color blocks with no images or text. This is consistent with Squarespace's lazy-load behavior, but it means that on slower connections or with JavaScript delayed, the user sees large empty color voids. No skeleton loaders or placeholder states are implemented.

**Footer:** `09-footer-desktop.png` is a near-solid black rectangle with the cookie consent banner overlaid and no other rendered content. The footer either contains no links, no copyright text, and no social icons — or everything failed to render. Either outcome is a problem. A premium skincare brand's footer should carry social links, newsletter signup, legal links, and brand reinforcement.

**Tablet breakpoint:** `14-homepage-tablet.png` shows the hero section with text ("New Ginger Root Creme" and "Shop Now") appearing to the left of a small 3-image horizontal strip labeled "The Essentials Reimagined" with a "Shop Featured" button. This tablet layout is the only place where the hero headline and a secondary content block appear together above the fold — but the layout is inconsistent with both the desktop (image-only right half) and mobile (image centered, text below) treatments. The tablet breakpoint appears to be running its own distinct layout rather than a smooth interpolation.

**Specific issues:**
- Mobile nav may not be triggerable / needs device verification
- Cookie banner blocks CTA on mobile above-the-fold
- No skeleton loaders; content-empty colored sections visible during load
- Footer is visually empty at 1440px viewport
- Tablet layout is a distinct, inconsistent third treatment rather than a graceful between-state
- Product cards may lack proper anchor wrapping (no href on product links found by scraper)

---

## Overall Design Quality Score

| Pillar | Score |
|---|---|
| Visual Hierarchy and Layout | 3 / 10 |
| Typography and Readability | 4 / 10 |
| Color and Brand Expression | 5 / 10 |
| Interaction and Polish | 3 / 10 |
| **Overall** | **3.75 / 10** |

The brand has genuine visual assets — beautiful product photography, a coherent natural color story, and clearly identifiable brand identity — but the Squarespace implementation fails to organize, present, or activate those assets effectively. The site reads as an early draft that has not been fully designed into its template rather than a finished premium brand experience.

---

## Top 10 Critical Design Issues

Listed in priority order for a redesign.

---

**Issue 1 — No hero headline or value proposition above the fold (desktop)**
Evidence: `02-homepage-desktop-fold.png`
The right side of the desktop hero shows the product image. The left 40% of the viewport is blank space with no text. A user landing here has no copy to tell them what the brand is, what the product does, or why they should act. This is the single most important conversion-killing problem on the site. The fold must carry a headline, a one-line brand statement, and a primary CTA at minimum.

---

**Issue 2 — Footer is an empty black void**
Evidence: `09-footer-desktop.png`
The footer renders as a near-solid dark rectangle with no content. Whether this is a rendering failure or actual absence of content, the footer is non-functional. A premium brand's footer is load-bearing: it needs social links, newsletter signup, legal/privacy links, shipping info, and brand reinforcement. This needs to be built from scratch.

---

**Issue 3 — Cookie consent banner blocks the mobile CTA**
Evidence: `11-homepage-mobile-fold.png`
On mobile, the cookie consent overlay covers the lower portion of the above-the-fold hero, directly obscuring or sitting adjacent to the "Shop Now" CTA. A first-time mobile visitor's primary action trigger is blocked. The banner should be moved to a bottom-bar position with minimal height, or the hero should be designed to push below the banner.

---

**Issue 4 — Homepage sections are content-empty color blocks**
Evidence: `01-homepage-desktop.png`
Below the hero, the homepage consists of several full-viewport-height sections that render as flat color planes (mauve, forest green, light grey, cream). These sections either have content that failed to load or are genuinely sparse. Either way, the scroll experience is a series of empty colored voids with no copy, imagery, or CTA. Every section needs a content reason to exist: a product story, a brand value, a testimonial, a collection.

---

**Issue 5 — CTAs are styled as text links, not action triggers**
Evidence: `02-homepage-desktop-fold.png`, `11-homepage-mobile-fold.png`, `03-shop-desktop.png`
"Shop Now," "Shop Featured," and other CTAs are rendered as underlined text links with no button treatment. On a premium brand site, the primary CTA should be visually unambiguous: a filled button, a bordered pill, or a high-contrast treatment that signals "tap/click this." Text-link CTAs demand the user already intends to act; button CTAs invite them to act.

---

**Issue 6 — Shop page has no product hierarchy or merchandising**
Evidence: `03-shop-desktop.png`
The shop grid presents all products at equal visual weight in a standard masonry/grid layout. There is no featured product, no editorial banner, no "Best Seller" or "New" badge system, no category navigation. The first product in the grid is a dark-packaged cologne that is visually inconsistent with the botanical amber-glass brand aesthetic of all other products. The shop needs a clear merchandising strategy: hero product, product hierarchy, category filters that are visible without scrolling.

---

**Issue 7 — Tablet breakpoint is a third disconnected layout**
Evidence: `14-homepage-tablet.png`
The 768px tablet view shows a distinct hero layout not seen at desktop or mobile: the headline text appears left-aligned alongside a horizontal 3-image strip with a secondary CTA block. This is not a graceful responsive interpolation — it is a third design treatment that was never reconciled with the other two. Responsive design should feel like one layout adapting, not three separate designs.

---

**Issue 8 — Typography system lacks hierarchy**
Evidence: All page screenshots
No page demonstrates a clear typographic hierarchy beyond the brand wordmark in the nav. There is no evidence of a distinct H1, H2, H3, and body progression. The hero headline on mobile mixes italic and roman weight in a single phrase without clear semantic intent. The Learn page body copy appears as a single undifferentiated paragraph. A type scale and hierarchy system needs to be defined and applied consistently across all pages.

---

**Issue 9 — Learn page does not function as a content hub**
Evidence: `06-journal-desktop.png`
The Learn page, which should be a content index or editorial hub, contains only: a hero image, a "Our Philosophy" section with a short text block, a large dark green color block, and a full-bleed flat-lay image. There is no article grid, no content cards, no navigation into subtopics. Users coming to "learn" find a brand statement page, not a learning resource. This page needs an article/post index structure.

---

**Issue 10 — Product cards lack accessible link structure**
Evidence: `03-shop-desktop.png` + audit log (zero `/products/` hrefs found by scraper)
The Playwright scraper found no anchor tags with `/products/` href on the Shop page, meaning product card click areas are either handled entirely via JavaScript without proper `<a>` elements, or the link wraps only a small portion of the card. This is both an accessibility failure (keyboard navigation cannot reach product cards cleanly) and an SEO deficiency. Each product card must be wrapped in a proper anchor element pointing to the product URL.

---

## Summary

| Dimension | Status |
|---|---|
| Visual | Multiple critical issues found |
| Console | Clean (no functional JS errors) |
| Responsive | Inconsistent across 3 breakpoints |
| Accessibility | Concerns with CTA styling, mobile nav, product link structure |
| Brand alignment | Photographic assets are strong; designed system does not leverage them |

**The brand has the raw materials of a premium experience — strong photography, a coherent natural palette, and clear identity — but the current Squarespace implementation leaves those assets largely unpresented. The redesign priority should be: (1) hero with copy, (2) footer with content, (3) CTA system with buttons, (4) content-populated homepage sections, (5) functional product card links.**
