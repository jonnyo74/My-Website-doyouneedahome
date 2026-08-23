'use client'

import { useEffect, useRef } from 'react'

/**
 * Gentle rise-on-scroll. The hidden state is only ever applied from JS — and
 * only to elements still below the viewport — so nothing is invisible without
 * JavaScript and nothing above the fold flashes during hydration. The global
 * prefers-reduced-motion rule zeroes the transition, and matchMedia is checked
 * here too so reduced-motion users never even get the hidden frame.
 */
export default function Reveal({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // Already on screen (or nearly) — leave it alone.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return

    el.classList.add('sky-reveal-hidden')
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add('sky-reveal-in')
            observer.disconnect()
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
