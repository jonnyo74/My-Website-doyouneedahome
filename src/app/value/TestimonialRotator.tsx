'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import Link from 'next/link'

// Seller-relevant quotes, word for word from /testimonials. If one is edited or
// removed there, update it here too.
const quotes = [
  { quote: 'Christine listed and sold my home within 3 days.', author: 'Dave H.', role: 'Seller' },
  { quote: "I couldn't have been more pleased! I received multiple offers.", author: 'Roxanne Q.', role: 'Seller' },
  { quote: 'Christine kept us updated, was pro-active and always followed through.', author: 'Susan G.', role: 'Seller' },
  { quote: 'John is fair, honest & has your best interest.', author: 'Michelle P.', role: 'Seller & Buyer' },
  {
    quote:
      "John helped us through a difficult time selling my father's house after he passed away. He was professional, compassionate, and got it done.",
    author: 'Shea P.',
    role: 'Seller',
  },
  { quote: 'Worked 2 deals for me and John was exceptional.', author: 'Dawn F.', role: 'Buyer & Seller' },
]

const INTERVAL_MS = 7000

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)'
function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_QUERY)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}
function getReducedMotion() {
  return window.matchMedia(REDUCED_QUERY).matches
}

export default function TestimonialRotator() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [hovering, setHovering] = useState(false)

  // Anyone who asked for reduced motion gets a static first quote and can step
  // through manually; nothing advances on its own (WCAG 2.2.2 / 2.3.3).
  const reduced = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false)

  const running = !paused && !hovering && !reduced
  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setActive((i) => (i + 1) % quotes.length), INTERVAL_MS)
    return () => clearInterval(id)
  }, [running])

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Client reviews"
      className="mt-8 max-w-xl rounded-3xl border border-white/25 bg-white/10 p-6 text-white"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={() => setHovering(false)}
    >
      <p className="text-sm font-semibold uppercase tracking-[0.2em]">
        <span aria-hidden="true">★★★★★ </span>What our sellers say
      </p>

      {/* All quotes share one grid cell so the box keeps the height of the
          longest one; only the active quote is visible to anyone. */}
      <div className="mt-4 grid" aria-live={running ? 'off' : 'polite'}>
        {quotes.map((q, i) => (
          <figure
            key={q.author}
            aria-hidden={i !== active}
            className={`col-start-1 row-start-1 transition-opacity duration-500 motion-reduce:transition-none ${
              i === active ? 'opacity-100' : 'invisible opacity-0'
            }`}
          >
            <blockquote className="font-serif text-xl leading-8">&ldquo;{q.quote}&rdquo;</blockquote>
            <figcaption className="mt-3 text-sm">
              {q.author}, {q.role}
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
        <div className="flex items-center gap-1">
          {quotes.map((q, i) => (
            <button
              key={q.author}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show review ${i + 1} of ${quotes.length}`}
              aria-current={i === active}
              className="flex h-6 w-6 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span
                className={`block h-2.5 w-2.5 rounded-full ${i === active ? 'bg-white' : 'bg-white/40'}`}
              />
            </button>
          ))}
        </div>
        {!reduced && (
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="rounded-full px-2 py-1 text-xs font-semibold underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {paused ? 'Play' : 'Pause'}
            <span className="sr-only"> review rotation</span>
          </button>
        )}
        <Link
          href="/testimonials"
          className="ml-auto text-sm font-semibold underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Read all reviews
        </Link>
      </div>
    </section>
  )
}
