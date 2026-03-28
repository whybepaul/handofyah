'use client'

import { useEffect } from 'react'
import Link from 'next/link'

type MobileNavProps = {
  open: boolean
  onClose: () => void
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  useEffect(() => {
    if (!open) return
    // Only lock if not already locked by another overlay
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-espresso/50 z-50 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-[300px] bg-parchment z-50 transform transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex justify-end p-6">
          <button onClick={onClose} aria-label="Close menu" className="text-umber p-1">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <nav className="px-8">
          <ul className="space-y-6">
            {[
              { href: '/shop', label: 'Shop' },
              { href: '/learn', label: 'Learn' },
              { href: '/journal', label: 'Journal' },
              { href: '/about', label: 'About' },
              { href: '/account', label: 'Account' },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onClose}
                  className="font-display text-display-sm text-umber hover:text-terracotta transition-colors duration-200 block"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  )
}
