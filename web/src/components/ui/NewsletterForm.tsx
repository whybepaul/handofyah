'use client'

import { useState } from 'react'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <p className="font-body text-sage text-center">Thank you for subscribing.</p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md mx-auto gap-0">
      <input
        type="email"
        placeholder="Your email address"
        aria-label="Email address"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 font-body text-body-sm text-umber bg-parchment border border-umber/15 border-r-0 px-5 py-4 outline-none focus:border-terracotta transition-colors duration-200 placeholder:text-taupe"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="font-body text-button font-medium uppercase text-parchment bg-terracotta border border-terracotta px-6 py-4 hover:bg-clay hover:border-clay transition-colors duration-300 cursor-pointer whitespace-nowrap disabled:opacity-50"
        style={{ letterSpacing: '0.04em' }}
      >
        {status === 'loading' ? '...' : 'Subscribe'}
      </button>
    </form>
  )
}
