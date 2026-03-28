'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MobileNav } from './MobileNav'
import { CartDrawer } from './CartDrawer'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-parchment/80 backdrop-blur-xl shadow-header' : 'bg-parchment/95 backdrop-blur-sm'}`}
      >
        <div className="container-content flex items-center justify-between h-[72px]">
          {/* Wordmark */}
          <Link
            href="/"
            className="font-display text-xl font-normal uppercase tracking-[0.15em] text-umber"
          >
            Hand of Yah
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex gap-10">
            {[
              { href: '/shop', label: 'Shop' },
              { href: '/learn', label: 'Learn' },
              { href: '/journal', label: 'Journal' },
              { href: '/about', label: 'About' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="font-body text-nav font-medium uppercase text-umber hover:text-terracotta transition-colors duration-200"
                style={{ letterSpacing: '0.06em' }}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-6">
            <Link
              href="/account"
              className="hidden md:block font-body text-nav font-medium text-umber hover:text-terracotta transition-colors duration-200"
            >
              Account
            </Link>
            <button
              onClick={() => setCartOpen(true)}
              aria-label="Open cart"
              className="text-umber hover:text-terracotta transition-colors duration-200"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
            </button>
            <button
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open menu"
              className="md:hidden p-1"
            >
              <span className="block w-6 h-[1.5px] bg-umber mb-[5px]" />
              <span className="block w-6 h-[1.5px] bg-umber" />
            </button>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-[72px]" />

      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
