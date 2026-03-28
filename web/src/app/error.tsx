'use client'

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="container-content section-padding text-center min-h-[60vh] flex flex-col items-center justify-center">
      <h1 className="font-display text-display-lg text-umber mb-4">Something went wrong</h1>
      <p className="font-body text-body text-taupe mb-8 max-w-md">
        We encountered an unexpected error. Please try again.
      </p>
      <button onClick={reset} className="btn-primary">Try again</button>
    </div>
  )
}
