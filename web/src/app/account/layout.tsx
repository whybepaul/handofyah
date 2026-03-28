// TODO: Move auth check to Next.js middleware for true server-side protection.
// Current client-side check prevents data access (API routes verify tokens)
// but the account layout HTML is briefly visible before redirect.
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase'

const NAV_LINKS = [
  { href: '/account', label: 'Dashboard' },
  { href: '/account/orders', label: 'Orders' },
  { href: '/account/subscriptions', label: 'Subscriptions' },
  { href: '/account/wishlist', label: 'Wishlist' },
  { href: '/account/settings', label: 'Settings' },
] as const

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let cancelled = false
    const supabase = getSupabaseClient()

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return
      if (!session) {
        router.replace('/login')
      } else {
        setChecking(false)
      }
    })

    return () => {
      cancelled = true
    }
  }, [router])

  if (checking) {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center">
        <div
          className="h-10 w-10 rounded-full border-2 border-terracotta border-t-transparent animate-spin"
          role="status"
          aria-label="Loading"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-parchment">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
          {/* Sidebar navigation */}
          <nav
            className="lg:w-48 flex-shrink-0"
            aria-label="Account navigation"
          >
            <ul className="flex flex-row flex-wrap gap-4 lg:flex-col lg:gap-1">
              {NAV_LINKS.map(({ href, label }) => {
                // Exact match for dashboard, prefix match for sub-routes
                const isActive =
                  href === '/account'
                    ? pathname === '/account'
                    : pathname.startsWith(href)

                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`font-body text-body transition-colors duration-150 ${
                        isActive
                          ? 'text-terracotta font-medium'
                          : 'text-umber hover:text-terracotta'
                      }`}
                    >
                      {label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Page content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  )
}
