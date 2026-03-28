'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'

export default function AccountDashboardPage() {
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    const supabase = getSupabaseClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        setEmail(session.user.email)
      }
    })
  }, [])

  async function handleSignOut() {
    const supabase = getSupabaseClient()
    await supabase.auth.signOut()
    try {
      sessionStorage.removeItem('hoy_session')
    } catch {
      // non-fatal
    }
    router.replace('/')
  }

  return (
    <div className="space-y-10">
      <div className="space-y-1">
        <h1 className="font-display text-display-lg text-umber">Your account</h1>
        {email && (
          <p className="font-body text-body text-taupe">{email}</p>
        )}
      </div>

      {/* Quick-links grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { href: '/account/orders', label: 'Orders', description: 'View your order history' },
          { href: '/account/subscriptions', label: 'Subscriptions', description: 'Manage your recurring deliveries' },
          { href: '/account/wishlist', label: 'Wishlist', description: 'Saved products' },
        ].map(({ href, label, description }) => (
          <Link
            key={href}
            href={href}
            className="group block rounded-none border border-umber/10 bg-linen p-6 hover:border-terracotta/40 transition-colors duration-200"
          >
            <h2 className="font-display text-display-sm text-umber group-hover:text-terracotta transition-colors">
              {label}
            </h2>
            <p className="mt-1 font-body text-sm text-taupe">{description}</p>
          </Link>
        ))}
      </div>

      <div>
        <Button
          type="button"
          variant="secondary"
          onClick={handleSignOut}
        >
          Log out
        </Button>
      </div>
    </div>
  )
}
