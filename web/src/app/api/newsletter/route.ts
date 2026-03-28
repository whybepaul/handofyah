import { z } from 'zod'
import { addSubscriber } from '@/lib/listmonk'

const newsletterSchema = z.object({
  email: z.string().email('Valid email is required'),
})

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const result = newsletterSchema.safeParse(body)
  if (!result.success) {
    return Response.json(
      { error: 'Validation failed', issues: result.error.issues },
      { status: 400 }
    )
  }

  const { email } = result.data

  try {
    await addSubscriber(email)
  } catch (err) {
    // Listmonk returns a 409 when the subscriber already exists.
    // Treat duplicates as a success to avoid leaking subscriber status.
    const message = err instanceof Error ? err.message : String(err)
    if (message.includes('409') || message.toLowerCase().includes('already exists')) {
      return Response.json({ ok: true, message: 'Already subscribed' })
    }
    console.error('[newsletter] subscription error', err)
    return Response.json({ error: 'Could not subscribe' }, { status: 500 })
  }

  return Response.json({ ok: true })
}
