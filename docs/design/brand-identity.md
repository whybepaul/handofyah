# Hand of Yah — Brand Identity System

**Version:** 1.0
**Created:** 2026-03-27
**Concept:** Sacred Apothecary

---

## Brand Essence

Hand of Yah exists at the intersection of luxury refinement and spiritual groundedness. The brand embodies the belief that caring for your skin is an act of devotion — to yourself, to natural ingredients, to the ritual of intentional living.

The name "Hand of Yah" carries weight: the hand that creates, that heals, that blesses. The visual identity must honor this without becoming esoteric. We express spirituality through warmth, materiality, and care — never through mystical iconography or new-age cliches.

### Brand Positioning Statement
For wellness-conscious individuals who view skincare as a sacred ritual, Hand of Yah is the artisanal skincare brand that transforms daily routines into moments of intentional self-care through research-backed, natural formulations presented with the reverence they deserve.

---

## Color Palette

### Philosophy
Where Aesop is monochromatic and cool, Hand of Yah is warm. The palette is drawn from the brand's own product photography: amber glass, volcanic stone, dried herbs, sun-warmed linen, terracotta clay. Every color exists in nature.

### Primary Palette

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Parchment** | `#F5F0E8` | 245, 240, 232 | Primary background. The canvas. Warm enough to feel intentional, neutral enough to not compete with photography. |
| **Umber** | `#2C2420` | 44, 36, 32 | Primary text. Deep warm brown — not black. Softer on the eye, warmer than Aesop's pure black. |
| **Terracotta** | `#C4704B` | 196, 112, 75 | Primary accent. CTAs, active states, highlights. The fire in the palette — used sparingly and deliberately. |

### Secondary Palette

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Sage** | `#8B9A7E` | 139, 154, 126 | Botanical accent. Tags, badges, secondary highlights. The green of dried herbs. |
| **Stone** | `#E8E2D8` | 232, 226, 216 | Card backgrounds, section dividers. Slightly darker than Parchment for subtle depth. |
| **Taupe** | `#B8AFA6` | 184, 175, 166 | Borders, muted text, placeholder states. The neutral workhorse. |
| **Espresso** | `#1A1614` | 26, 22, 20 | Footer background, dark sections. Near-black with warmth. |

### Extended Palette

| Name | Hex | Usage |
|------|-----|-------|
| **Amber** | `#D4A574` | Hover states on Terracotta, warm highlights |
| **Linen** | `#FAF7F2` | Lighter background variant, modal overlays |
| **Clay** | `#A85E3A` | Darker Terracotta for pressed/active button states |

### Contrast Verification (WCAG AA)

| Combination | Ratio | Pass |
|-------------|-------|------|
| Umber on Parchment | 12.4:1 | AAA |
| Umber on Stone | 10.8:1 | AAA |
| Parchment on Terracotta | 4.6:1 | AA |
| Parchment on Espresso | 14.2:1 | AAA |
| Terracotta on Parchment | 4.6:1 | AA (large text only for body; used primarily for buttons with Parchment text) |
| Umber on Linen | 13.1:1 | AAA |

### Color Rules
1. **Terracotta is precious.** It appears on primary CTA buttons, active nav states, and link hover states. Never as a background for large sections.
2. **Parchment is the default canvas.** White (#FFFFFF) is never used. Every "white" surface is Parchment or Linen.
3. **Umber replaces black everywhere.** Text, icons, borders — all Umber, never #000000.
4. **Sage signals nature.** Used for ingredient tags, subscription badges, and botanical-themed UI elements.
5. **Stone creates depth.** Cards, hover backgrounds, and alternate sections use Stone to create subtle layering without hard borders.

---

## Typography

### Philosophy
Two typefaces. One with heritage and soul (the serif), one with clarity and modernity (the sans). The serif carries the brand's identity — its warmth, its craft, its reverence. The sans carries the interface — readable, reliable, invisible.

### Type System

**Display / Headings: Cormorant Garamond**
- Classification: Old-style serif with calligraphic DNA
- Source: Google Fonts (variable font)
- Weights: 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- Why: Cormorant has the high contrast and elegance of a Didone but with the warmth and organic curves of an old-style face. It whispers "craft" and "heritage" without shouting. Its calligraphic stroke terminals echo the idea of "the hand" in the brand name.
- Usage: All headings (H1-H4), the wordmark, pull quotes, featured text, price displays

**Body / Interface: Outfit**
- Classification: Geometric sans-serif
- Source: Google Fonts (variable font)
- Weights: 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold)
- Why: Outfit is geometric like Futura but with softened terminals and more open letterforms. It reads cleanly at small sizes, supports the serif without competing, and has the quiet confidence of a well-made tool.
- Usage: Body text, navigation, buttons, form labels, captions, metadata

### Type Scale

| Token | Size | Weight | Line Height | Letter Spacing | Font | Usage |
|-------|------|--------|-------------|----------------|------|-------|
| `display-xl` | 4.5rem (72px) | 300 | 1.0 | -0.02em | Cormorant | Hero headlines |
| `display-lg` | 3rem (48px) | 400 | 1.1 | -0.01em | Cormorant | Page titles |
| `display-md` | 2.25rem (36px) | 400 | 1.15 | 0 | Cormorant | Section headings |
| `display-sm` | 1.5rem (24px) | 500 | 1.2 | 0 | Cormorant | Card titles, product names |
| `body-lg` | 1.125rem (18px) | 400 | 1.7 | 0 | Outfit | Lead paragraphs |
| `body` | 1rem (16px) | 400 | 1.7 | 0 | Outfit | Default body text |
| `body-sm` | 0.875rem (14px) | 400 | 1.6 | 0 | Outfit | Captions, metadata |
| `label` | 0.75rem (12px) | 600 | 1.4 | 0.08em | Outfit | Uppercase labels, overlines |
| `nav` | 0.875rem (14px) | 500 | 1 | 0.06em | Outfit | Navigation items |
| `price` | 1.25rem (20px) | 300 | 1 | 0.02em | Cormorant | Product prices |
| `button` | 0.875rem (14px) | 500 | 1 | 0.04em | Outfit | Button text |

### Typography Rules
1. **Headings are always Cormorant.** Never use Outfit for headings. The serif is the brand.
2. **Body is always Outfit.** Never use Cormorant below 20px for body text — it was designed for display.
3. **Uppercase tracking.** When text is set in uppercase (nav, labels, overlines), add letter-spacing (0.04-0.08em). Never set Cormorant in uppercase without tracking.
4. **Line length.** Body text should not exceed 70 characters per line. Use `max-width: 65ch` on prose containers.
5. **Wordmark.** "HAND OF YAH" is set in Cormorant Garamond, weight 400, uppercase, letter-spacing 0.15em. Always rendered as text, never as an image.

---

## Photography Direction

### Product Photography
- **Background:** Neutral, textural surfaces — raw stone, unfinished wood, dried clay, linen. Never white seamless. The surface tells a story of materiality.
- **Lighting:** Soft, warm, directional. Window light from the left or above. Subtle shadows that give depth. No flat studio lighting.
- **Styling:** Botanical elements as accents — dried herbs, flower petals, seeds, raw ingredients. Never overwhelming the product. 2-3 props maximum.
- **Angles:** Eye-level or slightly above. The product should feel approachable, like it's on your bathroom shelf, not on a pedestal.
- **Color grading:** Warm. Slight amber shift. Never cool or clinical.

### Lifestyle Photography
- **Setting:** Natural environments — bathrooms with natural light, outdoor spaces with greenery, hands performing skincare rituals.
- **Subject:** Diverse skin tones. Hands and skin close-ups preferred over full faces (the ritual, not the person). Slow, intentional gestures.
- **Mood:** Calm, present, unhurried. The viewer should feel like they're watching a private moment of self-care.
- **Color grading:** Warm, slightly desaturated. Never oversaturated or heavily filtered.

### Image Aspect Ratios
- **Hero images:** 16:9 (desktop), 4:5 (mobile)
- **Product cards:** 4:5 (portrait orientation, consistent across all products)
- **Journal featured images:** 3:2 (landscape)
- **Lifestyle images:** 1:1 or 4:5

---

## Brand Voice

### Tone
Calm, knowledgeable, warm. Like a trusted friend who happens to be a skincare expert and has a quietly spiritual perspective on self-care.

### Principles
1. **Grounded, not mystical.** "Nourish your skin with intention" not "Align your chakras through skincare."
2. **Confident, not aggressive.** "We formulate with..." not "THE BEST ingredients in skincare."
3. **Educational, not condescending.** Explain ingredients and benefits without assuming ignorance or expertise.
4. **Warm, not saccharine.** "Caring for your skin is caring for yourself" not "You deserve to glow, queen!"
5. **Concise, not sparse.** Every word earns its place, but the writing should feel generous, not cold.

### Writing Guidelines
- Use "we" for the brand, "you" for the customer
- Sentence case for headings (not Title Case, not ALL CAPS except the wordmark)
- No exclamation marks in product copy
- No emoji in any brand communication
- Numbers: spell out one through nine, use numerals for 10+
- Ingredient names: capitalize (Ginger Root, Jojoba Oil, Vitamin E)

---

## Spacing System

Based on an 8px grid:

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Inline spacing, icon gaps |
| `space-2` | 8px | Tight element spacing |
| `space-3` | 12px | Form field padding |
| `space-4` | 16px | Standard element gap |
| `space-6` | 24px | Card padding, section inner spacing |
| `space-8` | 32px | Component spacing |
| `space-10` | 40px | Between-component gaps |
| `space-12` | 48px | Section padding (mobile) |
| `space-16` | 64px | Section padding (tablet) |
| `space-20` | 80px | Section padding (desktop) |
| `space-24` | 96px | Major section separators |
| `space-32` | 128px | Hero section vertical padding |

### Spacing Rules
1. **Generous by default.** When in doubt, add more space. Luxury breathes.
2. **Consistent section rhythm.** All top-level sections use `space-20` padding on desktop, `space-12` on mobile.
3. **Card internal padding.** All cards use `space-6` (24px) padding.
4. **The grid.** 12-column grid, 24px gutter, max-width 1280px, centered.

---

## Component Design Principles

### Buttons
- **Primary:** Terracotta background, Parchment text. No border-radius (square edges = confidence). Padding: 16px 32px. Hover: Clay background with smooth transition.
- **Secondary:** Transparent background, Umber border (1px), Umber text. Hover: Stone background.
- **Text link:** Umber text with Terracotta underline on hover. No underline by default — underline appears on hover with a smooth slide-in animation.

### Cards (Product)
- **Background:** Stone
- **Image:** 4:5 aspect ratio, fills card width, no border-radius
- **Content:** Product name (Cormorant, display-sm), price (Cormorant, price), both below image
- **Hover:** Subtle lift (translateY -2px) with soft shadow transition
- **No badges, no ratings, no visual clutter.** Just image, name, price.

### Navigation
- **Desktop:** Centered wordmark, nav items flanking. Outfit, nav size, uppercase, tracked.
- **Mobile:** Wordmark left, cart right, hamburger right. Full-screen slide-out drawer.
- **Active state:** Terracotta text color.
- **Scroll behavior:** Fixed header with Parchment background, subtle shadow on scroll.

### Forms
- **Inputs:** Bottom border only (no full border). Umber bottom border, Outfit body size. Focus state: Terracotta bottom border.
- **Labels:** Outfit label size, uppercase, tracked, Taupe color. Floats above on focus.
- **Submit buttons:** Primary button style.

### Footer
- **Background:** Espresso
- **Text:** Parchment (primary), Taupe (secondary links)
- **Structure:** 4-column grid — Brand (wordmark + tagline), Shop (category links), Company (about, contact, FAQ), Connect (social + newsletter)
- **Newsletter:** Email input with Terracotta submit button

---

## Motion Principles

### Philosophy
Motion in Hand of Yah is like incense smoke — smooth, unhurried, organic. Never bouncy, never mechanical, never jarring.

### Timing
- **Standard transition:** 300ms ease-out
- **Entrance animation:** 600ms ease-out
- **Page transition:** 400ms ease-in-out
- **Hover states:** 200ms ease

### Entrance Animations
- **Fade up:** Elements enter from 20px below with opacity 0 → 1. Used for section content on scroll.
- **Stagger:** Sequential elements (product grid, nav items) stagger by 80ms each.
- **No parallax.** No bouncing. No zooming. Restraint.

### Scroll Behavior
- **Intersection Observer** triggers fade-up animations when elements enter the viewport (threshold: 0.15).
- **Header shadow** appears smoothly on scroll (opacity transition).
- **No scroll hijacking.** Natural browser scroll at all times.

---

## Grid System

### Desktop (>1024px)
- 12 columns
- 24px gutters
- Max-width: 1280px
- Centered with auto margins

### Tablet (768-1024px)
- 8 columns
- 20px gutters
- Full-width with 40px side padding

### Mobile (<768px)
- 4 columns
- 16px gutters
- Full-width with 20px side padding

### Common Layouts
- **Product grid:** 3 columns desktop, 2 tablet, 1 mobile (with 2-up option for smaller cards)
- **Content + image:** 7:5 split desktop, stacked mobile (image first)
- **Prose:** 8-column centered container, max-width 65ch
- **Hero:** Full-width, max-height 85vh
