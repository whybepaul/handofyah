import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/revalidate?secret=<SANITY_REVALIDATE_SECRET>
 *
 * Sanity webhook endpoint for on-demand ISR revalidation.
 * Configure this URL in the Sanity dashboard under API → Webhooks.
 * The body is the Sanity document that was created/updated/deleted.
 */
export async function POST(request: NextRequest) {
  if (!process.env.SANITY_REVALIDATE_SECRET) {
    console.error('SANITY_REVALIDATE_SECRET is not configured')
    return NextResponse.json({ message: 'Server misconfiguration' }, { status: 500 })
  }

  const secret = request.nextUrl.searchParams.get('secret')

  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { _type, slug } = body

    // Revalidate the relevant paths based on the document type that changed
    switch (_type) {
      case 'product':
        revalidatePath('/shop')
        revalidatePath(`/shop/${slug?.current}`)
        revalidatePath('/') // homepage shows featured products
        break

      case 'category':
        revalidatePath('/shop')
        break

      case 'journalPost':
        revalidatePath('/journal')
        revalidatePath(`/journal/${slug?.current}`)
        revalidatePath('/') // homepage shows recent journal posts
        break

      case 'learnArticle':
        revalidatePath('/learn')
        revalidatePath(`/learn/${slug?.current}`)
        break

      case 'ingredient':
        revalidatePath('/ingredients')
        revalidatePath(`/ingredients/${slug?.current}`)
        break

      case 'page':
        revalidatePath(`/${slug?.current}`)
        break

      default:
        // Fallback: revalidate the homepage for any unknown type
        revalidatePath('/')
    }

    return NextResponse.json({ revalidated: true })
  } catch {
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 })
  }
}
