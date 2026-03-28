import { createClient } from 'next-sanity'
import { sanityConfig } from '@/sanity/config'

/**
 * sanityFetch is the single entry point for all Sanity data fetching.
 *
 * When NEXT_PUBLIC_SANITY_PROJECT_ID is absent (e.g. CI build without
 * .env.local), the function returns an empty result instead of throwing so
 * that pages render their empty states rather than crashing the build.
 *
 * In production, the env var is always present so the real Sanity client is
 * used for every fetch.
 */
export async function sanityFetch<T>(
  query: string,
  params?: Record<string, unknown>
): Promise<T> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    // No Sanity configuration — return an empty value so pages can still
    // render their zero-state UI during builds without credentials.
    return ([] as unknown) as T
  }

  const client = createClient(sanityConfig)
  return client.fetch<T>(query, params ?? {})
}

/**
 * Direct Sanity client for use outside of data-fetching helpers (e.g. the
 * Studio route). Only call this when you know the project ID is configured.
 */
export const sanityClient = new Proxy(
  {} as ReturnType<typeof createClient>,
  {
    get(_target, prop) {
      return createClient(sanityConfig)[prop as keyof ReturnType<typeof createClient>]
    },
  }
)
