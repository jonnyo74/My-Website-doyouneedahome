'use client'

import { useEffect, useRef } from 'react'
import { trackEvent } from '@/lib/analytics'
import { openAnalysis } from './analysisBus'
import { ANALYSIS_PAGE_CATEGORY } from './analysisEvents'

/**
 * The button that opens the Lotus property-analysis modal, plus the
 * once-per-page-view impression event for the section it sits in.
 *
 * Rendered as a small client island inside otherwise server-rendered sections
 * so the surrounding copy, headings, and layout stay in the static payload.
 */
export default function SellerCta({
  ctaLocation,
  label = 'Analyze My Lotus Home',
  variant = 'solid',
  className = '',
}: {
  /** Identifies the placement in GA4 — 'seller-band' or 'seller-footer'. */
  ctaLocation: string
  label?: string
  /** 'solid' = filled paper button, 'outline' = hairline on a dark ground. */
  variant?: 'solid' | 'outline'
  className?: string
}) {
  const ref = useRef<HTMLButtonElement>(null)

  // Impression: fires once, the first time this CTA is actually on screen.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        trackEvent('seller_cta_view', {
          cta_location: ctaLocation,
          page_category: ANALYSIS_PAGE_CATEGORY,
        })
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ctaLocation])

  const base =
    'sky-cta inline-flex w-full items-center justify-center px-8 text-[11px] font-semibold uppercase tracking-[0.2em] transition sm:w-auto'
  const skin =
    variant === 'solid'
      ? 'bg-[#f5f2eb] text-[#16140f] hover:bg-white'
      : 'border border-[#93c4cb]/60 text-[#f5f2eb] hover:border-[#93c4cb] hover:bg-[#93c4cb]/10'

  return (
    <button
      ref={ref}
      type="button"
      className={`${base} ${skin} ${className}`}
      onClick={() => {
        trackEvent('seller_cta_click', {
          cta_location: ctaLocation,
          page_category: ANALYSIS_PAGE_CATEGORY,
        })
        openAnalysis(ctaLocation)
      }}
    >
      {label}
    </button>
  )
}
