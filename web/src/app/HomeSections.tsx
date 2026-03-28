'use client'

import Link from 'next/link'
import { Product, JournalPost } from '@/lib/types'
import { ProductCard } from '@/components/product/ProductCard'
import { JournalCard } from '@/components/content/JournalCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

// ── Placeholder product cards shown when Sanity has no featured products ──
function PlaceholderProductCard({
  name,
  imageUrl,
  imageAlt,
  delay,
}: {
  name: string
  imageUrl: string
  imageAlt: string
  delay?: number
}) {
  return (
    <ScrollReveal delay={delay}>
      <div className="block bg-stone">
        <div
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: '4/5' }}
        >
          <img
            src={imageUrl}
            alt={imageAlt}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
        <div className="pt-4 pb-6 px-0">
          <p className="label-text mb-2">Skincare</p>
          <h3 className="font-display text-display-sm text-umber mb-1 leading-tight">{name}</h3>
          <p className="font-display text-umber/80" style={{ fontSize: 'var(--font-size-price)' }}>
            $0.00
          </p>
        </div>
      </div>
    </ScrollReveal>
  )
}

// ── 1. Hero ──
export function HeroSection() {
  return (
    <section className="bg-stone overflow-hidden" style={{ paddingTop: '72px', minHeight: '85vh' }}>
      <div className="container-content h-full">
        {/*
         * Two-column grid: copy (40%) left, image (60%) right.
         * On mobile: stacked, image on top.
         */}
        <div
          className="grid items-center"
          style={{
            gridTemplateColumns: '2fr 3fr',
            gap: '4rem',
            minHeight: 'calc(85vh - 72px)',
          }}
        >
          {/* Copy column */}
          <div className="py-16 order-2 md:order-1">
            <ScrollReveal delay={0}>
              <p className="label-text text-terracotta mb-6">New Arrival</p>
            </ScrollReveal>

            <ScrollReveal delay={80}>
              <h1
                className="font-display text-umber mb-6"
                style={{
                  fontSize: 'clamp(2.75rem, 6vw, var(--font-size-display-xl))',
                  lineHeight: 'var(--font-size-display-xl--line-height)',
                  letterSpacing: 'var(--font-size-display-xl--letter-spacing)',
                  fontWeight: 300,
                }}
              >
                Ginger Root Creme
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={160}>
              <p
                className="font-body text-umber/80 mb-10"
                style={{
                  fontSize: 'var(--font-size-body-lg)',
                  lineHeight: 'var(--font-size-body-lg--line-height)',
                  maxWidth: '420px',
                }}
              >
                A warming, nourishing face creme powered by Ginger Root extract,
                Jojoba Oil, and Vitamin E — crafted to restore radiance with every ritual.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={240}>
              <Button variant="primary" href="/shop">
                Shop now
              </Button>
            </ScrollReveal>
          </div>

          {/* Image column — hero product photo */}
          <div
            className="order-1 md:order-2 w-full overflow-hidden"
            style={{ height: '85vh', marginTop: '-72px' }}
          >
            <img
              src="https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?w=1200&q=80"
              alt="Amber glass dropper bottle on wooden surface with warm candlelight"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

// ── 2. Philosophy strip ──
export function PhilosophySection() {
  return (
    <section className="bg-parchment section-padding">
      <div className="container-content text-center">
        <ScrollReveal>
          <blockquote
            className="font-display text-umber mx-auto"
            style={{
              fontSize: 'var(--font-size-display-md)',
              lineHeight: 1.3,
              fontWeight: 300,
              maxWidth: '700px',
            }}
          >
            {/* "self-care" is italic terracotta per brand spec */}
            Skincare is{' '}
            <em className="not-italic italic text-terracotta">self-care</em>.
            {' '}Every product is an invitation to pause, to nourish, to honor
            the skin you live in.
          </blockquote>
        </ScrollReveal>
      </div>
    </section>
  )
}

// ── 3. Featured products ──
export function FeaturedProductsSection({ products }: { products: Product[] }) {
  return (
    <section className="bg-parchment section-padding" style={{ paddingTop: 0 }}>
      <div className="container-content">
        <ScrollReveal>
          <SectionHeader
            title="The essentials"
            linkText="View all"
            linkHref="/shop"
          />
        </ScrollReveal>

        {products.length > 0 ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            style={{ gap: '1.5rem' }}
          >
            {products.map((product, index) => (
              <ScrollReveal key={product._id} delay={index * 80}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          /* Placeholder cards for zero-state (no Sanity data during build) */
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            style={{ gap: '1.5rem' }}
          >
            <PlaceholderProductCard
              name="Ginger Root Creme"
              imageUrl="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80"
              imageAlt="Glass jar of cream on marble surface with botanical elements"
              delay={0}
            />
            <PlaceholderProductCard
              name="Black Seed Hair Oil"
              imageUrl="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80"
              imageAlt="Amber facial oil bottle with dropper on clean surface"
              delay={80}
            />
            <PlaceholderProductCard
              name="Turmeric Clay Masque"
              imageUrl="https://images.unsplash.com/photo-1564894809611-1742fc40ed80?w=800&q=80"
              imageAlt="Clay masque texture with natural ingredients on stone surface"
              delay={160}
            />
          </div>
        )}
      </div>
    </section>
  )
}

// ── 4. Brand story ──
export function BrandStorySection() {
  return (
    <section className="bg-stone section-padding">
      <div className="container-content">
        {/*
         * Two-column: image left (5fr), copy right (7fr).
         * On mobile: stacked, image fills full width at 16:9.
         */}
        <div
          className="grid items-center gap-8 lg:gap-16"
          style={{ gridTemplateColumns: '5fr 7fr' }}
        >
          {/* Brand story lifestyle image */}
          <ScrollReveal delay={0}>
            <div className="overflow-hidden" style={{ aspectRatio: '3/4' }}>
              <img
                src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=1200&q=80"
                alt="Hands holding an amber glass bottle in warm natural light"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          </ScrollReveal>

          {/* Copy */}
          <ScrollReveal delay={120}>
            <div style={{ maxWidth: '500px' }}>
              <p className="label-text mb-6">Our story</p>

              <h2
                className="font-display text-umber mb-8"
                style={{
                  fontSize: 'var(--font-size-display-lg)',
                  lineHeight: 'var(--font-size-display-lg--line-height)',
                  letterSpacing: 'var(--font-size-display-lg--letter-spacing)',
                  fontWeight: 300,
                }}
              >
                Crafted with intention, rooted in nature
              </h2>

              <p
                className="font-body text-umber/85 mb-10"
                style={{
                  fontSize: 'var(--font-size-body)',
                  lineHeight: 1.8,
                }}
              >
                Hand of Yah began as a deeply personal practice — a belief that
                the products we put on our bodies should come from the same place
                as prayer: with intention, care, and reverence for what we are
                made of. Every formulation starts with a single question: what
                does this skin truly need? The answer is always found in nature,
                refined through research, and offered with love.
              </p>

              <Button variant="secondary" href="/about">
                Read our story
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

// ── 5. Ingredients banner ──
export function IngredientsBannerSection() {
  return (
    <section className="bg-espresso section-padding text-center">
      <div className="container-content">
        <ScrollReveal delay={0}>
          <p className="label-text text-amber mb-6">Transparency</p>
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <h2
            className="font-display text-parchment mx-auto mb-6"
            style={{
              fontSize: 'var(--font-size-display-lg)',
              lineHeight: 'var(--font-size-display-lg--line-height)',
              fontWeight: 300,
              maxWidth: '600px',
            }}
          >
            Every ingredient, explained
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={160}>
          <p
            className="font-body text-taupe mx-auto mb-10"
            style={{
              fontSize: 'var(--font-size-body)',
              maxWidth: '480px',
            }}
          >
            We believe you deserve to know exactly what goes into every product.
            Browse our full ingredient glossary — each one sourced, studied,
            and chosen for a reason.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={240}>
          {/*
           * On the dark espresso background the primary button uses parchment
           * background with espresso text per the prototype spec.
           */}
          <Link
            href="/ingredients"
            className="font-body font-medium uppercase inline-block transition-colors duration-300 ease-out cursor-pointer"
            style={{
              fontSize: 'var(--font-size-button)',
              lineHeight: 'var(--font-size-button--line-height)',
              letterSpacing: 'var(--font-size-button--letter-spacing)',
              padding: '1rem 2rem',
              background: 'var(--color-parchment)',
              color: 'var(--color-espresso)',
            }}
          >
            Explore ingredients
          </Link>
        </ScrollReveal>
      </div>
    </section>
  )
}

// ── 6. Journal preview ──
export function JournalPreviewSection({ posts }: { posts: JournalPost[] }) {
  return (
    <section className="bg-parchment section-padding">
      <div className="container-content">
        <ScrollReveal>
          <SectionHeader
            title="From the journal"
            linkText="Read all"
            linkHref="/journal"
          />
        </ScrollReveal>

        {posts.length > 0 ? (
          <div
            className="grid grid-cols-1 md:grid-cols-2"
            style={{ gap: '1.5rem' }}
          >
            {posts.map((post, index) => (
              <ScrollReveal key={post._id} delay={index * 80}>
                <JournalCard post={post} />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          /* Zero-state: two placeholder journal cards */
          <div
            className="grid grid-cols-1 md:grid-cols-2"
            style={{ gap: '1.5rem' }}
          >
            {[
              {
                title: 'The ritual of washing your face',
                excerpt:
                  'Why a two-minute practice at the end of your day can become one of the most grounding acts of self-care you own.',
                imageUrl: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&q=80',
                imageAlt: 'Person gently cleansing their face with a soft cloth in soft morning light',
              },
              {
                title: 'Ginger Root: what the research says',
                excerpt:
                  'Beyond the kitchen, Ginger Root extract has demonstrated meaningful antioxidant and anti-inflammatory activity in topical applications.',
                imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80',
                imageAlt: 'Fresh ginger root and botanical ingredients on a natural surface',
              },
            ].map(({ title, excerpt, imageUrl, imageAlt }, index) => (
              <ScrollReveal key={title} delay={index * 80}>
                <div className="block">
                  <div
                    className="relative w-full overflow-hidden mb-5"
                    style={{ aspectRatio: '3/2' }}
                  >
                    <img
                      src={imageUrl}
                      alt={imageAlt}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                  <h3 className="font-display text-display-sm text-umber mb-2 leading-tight">
                    {title}
                  </h3>
                  <p className="font-body text-body-sm text-umber/70 leading-relaxed line-clamp-2">
                    {excerpt}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
