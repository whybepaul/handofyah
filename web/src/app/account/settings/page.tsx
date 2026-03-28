'use client'

import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function AccountSettingsPage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const supabase = getSupabaseClient()

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) return
      setEmail(session.user.email ?? '')
      setUserId(session.user.id)

      // Load existing customer name
      const { data } = await supabase
        .from('customers')
        .select('name')
        .eq('id', session.user.id)
        .maybeSingle()

      if (data?.name) {
        setName(data.name)
      }
    })
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setNameError('')
    setSaved(false)

    if (!userId) return

    setSaving(true)

    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase
        .from('customers')
        .update({ name: name.trim() })
        .eq('id', userId)

      if (error) {
        setNameError('Could not save changes. Please try again.')
      } else {
        setSaved(true)
      }
    } catch {
      setNameError('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8 max-w-lg">
      <h1 className="font-display text-display-lg text-umber">Settings</h1>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Email is read-only for magic link auth */}
        <Input
          label="Email address"
          type="email"
          name="email"
          value={email}
          readOnly
          disabled
          className="opacity-60 cursor-not-allowed"
        />

        <Input
          label="Name"
          type="text"
          name="name"
          autoComplete="name"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={nameError}
        />

        <div className="flex items-center gap-4">
          <Button
            type="submit"
            variant="primary"
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save changes'}
          </Button>

          {saved && (
            <p className="font-body text-sm text-sage">Changes saved.</p>
          )}
        </div>
      </form>
    </div>
  )
}
