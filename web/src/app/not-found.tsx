import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container-content section-padding text-center min-h-[60vh] flex flex-col items-center justify-center">
      <h1 className="font-display text-display-lg text-umber mb-4">Page not found</h1>
      <p className="font-body text-body text-taupe mb-8 max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/" className="btn-primary">Return home</Link>
    </div>
  )
}
