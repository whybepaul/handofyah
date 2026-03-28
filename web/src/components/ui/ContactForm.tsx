'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

type FormState = {
  name: string
  email: string
  subject: string
  message: string
}

type FieldErrors = Partial<Record<keyof FormState, string>>

function validateForm(data: FormState): FieldErrors {
  const errors: FieldErrors = {}
  if (!data.name.trim()) errors.name = 'Name is required.'
  if (!data.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address.'
  }
  if (!data.subject.trim()) errors.subject = 'Subject is required.'
  if (!data.message.trim()) errors.message = 'Message is required.'
  return errors
}

export function ContactForm() {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    // Clear field-level error when the user starts correcting it
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const fieldErrors = validateForm(form)
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors)
      return
    }

    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('success')
        setForm({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="py-12 text-center">
        <p className="font-display text-display-md text-umber mb-3">Message sent</p>
        <p className="font-body text-body text-umber/75">
          Thank you for reaching out. We&apos;ll be in touch within 1–2 business days.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      <Input
        label="Name"
        name="name"
        id="contact-name"
        type="text"
        autoComplete="name"
        value={form.name}
        onChange={handleChange}
        error={errors.name}
        required
      />

      <Input
        label="Email"
        name="email"
        id="contact-email"
        type="email"
        autoComplete="email"
        value={form.email}
        onChange={handleChange}
        error={errors.email}
        required
      />

      <Input
        label="Subject"
        name="subject"
        id="contact-subject"
        type="text"
        value={form.subject}
        onChange={handleChange}
        error={errors.subject}
        required
      />

      {/* Textarea — styled to match the Input component's underline style */}
      <div className="space-y-1">
        <label htmlFor="contact-message" className="label-text block">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          value={form.message}
          onChange={handleChange}
          required
          className="w-full bg-transparent border-0 border-b border-umber/20 font-body text-body text-umber py-3 placeholder:text-taupe focus:border-terracotta focus:outline-none transition-colors duration-200 resize-none"
          placeholder="How can we help?"
        />
        {errors.message && (
          <p className="text-sm text-terracotta">{errors.message}</p>
        )}
      </div>

      {status === 'error' && (
        <p className="font-body text-body-sm text-terracotta">
          Something went wrong. Please try again.
        </p>
      )}

      <Button
        type="submit"
        disabled={status === 'loading'}
        className="disabled:opacity-50"
      >
        {status === 'loading' ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  )
}
