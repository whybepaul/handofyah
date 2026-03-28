'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()
  // Guard against the effect running twice in React strict mode
  const processed = useRef(false)

  useEffect(() => {
    if (processed.current) return
    processed.current = true

    const supabase = getSupabaseClient()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const user = session.user

          // Ensure a customer record exists in public.customers
          const { data: existing } = await supabase
            .from('customers')
            .select('id')
            .eq('id', user.id)
            .maybeSingle()

          if (!existing) {
            await supabase.from('customers').insert({
              id: user.id,
              email: user.email,
            })
          }

          // Cache session for fast reloads
          try {
            sessionStorage.setItem(
              'hoy_session',
              JSON.stringify({ userId: user.id, email: user.email })
            )
          } catch {
            // sessionStorage may be unavailable in some environments; non-fatal
          }

          subscription.unsubscribe()
          router.replace('/account')
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  return (
    <div className="min-h-screen bg-parchment flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <div
          className="mx-auto h-10 w-10 rounded-full border-2 border-terracotta border-t-transparent animate-spin"
          role="status"
          aria-label="Signing you in"
        />
        <p className="font-body text-body text-taupe">Signing you in&hellip;</p>
      </div>
    </div>
  )
}
