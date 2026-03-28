'use client'

import { useState } from 'react'
import Link from 'next/link'
import { getSupabaseClient } from '@/lib/supabase'
import { SITE_URL } from '@/lib/constants'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }

    setLoading(true)

    try {
      const supabase = getSupabaseClient()
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${SITE_URL}/auth/callback`,
        },
      })

      if (authError) {
        setError(authError.message)
      } else {
        setSubmitted(true)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center space-y-4">
          <h1 className="font-display text-display-lg text-umber">Check your email</h1>
          <p className="font-body text-body text-taupe">
            We sent a magic link to <strong className="text-umber">{email}</strong>.
            Click the link in your email to sign in.
          </p>
          <p className="font-body text-sm text-taupe">
            Didn&apos;t receive it?{' '}
            <button
              type="button"
              onClick={() => { setSubmitted(false); setEmail('') }}
              className="text-terracotta underline underline-offset-2 hover:text-umber transition-colors"
            >
              Try again
            </button>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-parchment flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="font-display text-display-lg text-umber">Welcome back</h1>
          <p className="font-body text-body text-taupe">
            Enter your email to receive a magic sign-in link.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <Input
            label="Email address"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Sending…' : 'Send magic link'}
          </Button>
        </form>

        <p className="text-center font-body text-sm text-taupe">
          New here?{' '}
          <Link
            href="/signup"
            className="text-terracotta underline underline-offset-2 hover:text-umber transition-colors"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}
