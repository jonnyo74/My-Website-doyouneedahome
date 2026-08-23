'use client'

import { useEffect, useState } from 'react'

/**
 * Quiet ink bar that slides in once the hero has scrolled away: address,
 * price, and the one action that matters. Anchors to the showing form.
 */
export default function StickyBar() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('sky-hero')
    if (!hero) return
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { rootMargin: '-64px 0px 0px 0px' }
    )
    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      className={`fixed inset-x-0 top-0 z-40 border-b border-[#f5f2eb]/15 bg-[#16140f]/95 backdrop-blur-sm transition-transform duration-300 ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
      aria-hidden={!visible}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <p className="min-w-0 truncate font-serif text-sm text-[#f5f2eb] sm:text-base">
          8804 Skyward Street
          <span className="sky-num ml-3 hidden text-[#f5f2eb]/60 sm:inline">$2,799,999</span>
        </p>
        <a
          href="#showing"
          tabIndex={visible ? 0 : -1}
          className="flex-shrink-0 border border-[#93c4cb]/60 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f5f2eb] transition hover:border-[#93c4cb] hover:bg-[#93c4cb]/10 sm:px-5"
        >
          Request a Showing
        </a>
      </div>
    </div>
  )
}
