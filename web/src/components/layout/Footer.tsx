import Link from 'next/link'
import { PRODUCT_CATEGORIES, SITE_NAME } from '@/lib/constants'
import { NewsletterForm } from '@/components/ui/NewsletterForm'

export function Footer() {
  return (
    <footer className="bg-espresso text-parchment pt-16 pb-8">
      <div className="container-content">
        {/* Newsletter section */}
        <div className="text-center mb-16 pb-16 border-b border-parchment/10">
          <h2 className="font-display text-display-md text-parchment mb-3">Stay connected</h2>
          <p className="font-body text-body text-taupe mb-8">
            Skincare rituals, new arrivals, and journal entries. No noise.
          </p>
          <NewsletterForm />
        </div>

        {/* Footer grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-16">
          <div>
            <span className="font-display text-lg font-normal uppercase tracking-[0.15em] text-parchment block mb-4">
              {SITE_NAME}
            </span>
            <p className="font-display text-base font-light italic text-taupe leading-relaxed">
              Skincare is self-care.
              <br />
              Crafted with intention, rooted in nature.
            </p>
          </div>

          <div>
            <h3 className="font-body text-label font-semibold uppercase text-taupe mb-5" style={{ letterSpacing: '0.08em' }}>
              Shop
            </h3>
            <ul className="space-y-3">
              {PRODUCT_CATEGORIES.map(({ name, slug }) => (
                <li key={slug}>
                  <Link
                    href={`/shop/category/${slug}`}
                    className="font-body text-body-sm text-parchment/80 hover:text-amber transition-colors duration-200"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-body text-label font-semibold uppercase text-taupe mb-5" style={{ letterSpacing: '0.08em' }}>
              Company
            </h3>
            <ul className="space-y-3">
              {[
                { href: '/about', label: 'Our story' },
                { href: '/ingredients', label: 'Ingredients' },
                { href: '/journal', label: 'Journal' },
                { href: '/contact', label: 'Contact' },
                { href: '/faq', label: 'FAQ' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-body text-body-sm text-parchment/80 hover:text-amber transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-body text-label font-semibold uppercase text-taupe mb-5" style={{ letterSpacing: '0.08em' }}>
              Connect
            </h3>
            <div className="flex gap-5">
              {['IG', 'FB', 'YT', 'X'].map((platform) => (
                <a
                  key={platform}
                  href="#"
                  className="font-body text-label font-medium uppercase text-parchment/60 hover:text-parchment transition-colors duration-200"
                  style={{ letterSpacing: '0.08em' }}
                >
                  {platform}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="border-t border-parchment/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-label text-taupe">
            &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <div className="flex gap-6">
            {[
              { href: '/terms', label: 'Terms' },
              { href: '/privacy', label: 'Privacy' },
              { href: '/shipping-returns', label: 'Shipping' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="font-body text-label text-taupe hover:text-parchment transition-colors duration-200"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
