import { createImageUrlBuilder } from '@sanity/image-url'
import { sanityConfig } from '@/sanity/config'

// The builder is created lazily so that module evaluation at build time does
// not throw when NEXT_PUBLIC_SANITY_PROJECT_ID is absent (e.g. CI without .env.local).
let builder: ReturnType<typeof createImageUrlBuilder> | null = null

function getBuilder() {
  if (!builder) {
    if (!sanityConfig.projectId) {
      throw new Error('Sanity project ID is not configured')
    }
    builder = createImageUrlBuilder({
      projectId: sanityConfig.projectId,
      dataset: sanityConfig.dataset,
    })
  }
  return builder
}

export function urlFor(source: { asset: { _ref: string } }) {
  return getBuilder().image(source)
}
