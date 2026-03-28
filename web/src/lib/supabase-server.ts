import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Module-level singleton to avoid creating a new client on every request.
// This is safe because the service role credentials are static for the
// lifetime of the server process.
let serviceClient: SupabaseClient | null = null

export function getSupabaseServiceClient(): SupabaseClient {
  if (!serviceClient) {
    serviceClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  }
  return serviceClient
}
