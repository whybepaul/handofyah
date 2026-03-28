'use client'

import { useEffect, useRef, ReactNode } from 'react'

type ScrollRevealProps = {
  children: ReactNode
  className?: string
  /** Delay in milliseconds before the transition starts once visible */
  delay?: number
}

/**
 * ScrollReveal wraps any content in a div that fades up into view when it
 * enters the viewport. Uses IntersectionObserver (threshold 0.15) and fires
 * once — the observer disconnects after the element becomes visible so there
 * is no reverse animation on scroll-up.
 *
 * CSS for `.scroll-reveal` and `.scroll-reveal.revealed` lives in globals.css.
 * The `prefers-reduced-motion` media query there disables the animation for
 * users who prefer reduced motion.
 */
export function ScrollReveal({ children, className = '', delay = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('revealed')
          observer.unobserve(el)
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`scroll-reveal${className ? ` ${className}` : ''}`}
      style={delay > 0 ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
