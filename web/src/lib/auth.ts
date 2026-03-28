import { getSupabaseServiceClient } from './supabase-server'

/**
 * Extracts and verifies the Bearer token from the Authorization header.
 * Returns the authenticated Supabase user, or null if the token is missing or invalid.
 *
 * Used by API route handlers that require an authenticated user.
 */
export async function getAuthedUser(request: Request) {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token) return null

  const supabase = getSupabaseServiceClient()
  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || !user) return null
  return user
}
