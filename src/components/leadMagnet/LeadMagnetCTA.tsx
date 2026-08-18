'use client'

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { magnetsForSelection, type LeadMagnetSelection } from '@/lib/leadMagnets'
import { hasDownloaded, subscribeToDownloads } from '@/lib/leadMagnetState'
import { trackEvent } from '@/lib/analytics'
import LeadMagnetModal from './LeadMagnetModal'
import NextStepCTA from './NextStepCTA'

export interface LeadMagnetCTAProps {
  /** Which magnet to promote — 'pbc-both' opens a two-report picker. */
  selection: LeadMagnetSelection
  variant: 'inline' | 'sidebar' | 'end-of-article'
  /** Page bucket for analytics/CRM, e.g. 'community', 'blog', 'buy' */
  pageCategory: string
  /** Overrides the magnet's own CTA button label */
  buttonLabel?: string
  className?: string
}

/** Fires lead_magnet_view once when at least half the CTA scrolls into view. */
function useViewTracking(
  ref: React.RefObject<HTMLElement | null>,
  params: Record<string, string | undefined>,
) {
  const seenRef = useRef(false)
  useEffect(() => {
    const el = ref.current
    if (!el || seenRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !seenRef.current) {
          seenRef.current = true
          trackEvent('lead_magnet_view', { ...params, page_url: window.location.pathname })
          observer.disconnect()
        }
      },
      { threshold: 0.5 },
    )
    observer.observe(el)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

export default function LeadMagnetCTA({
  selection,
  variant,
  pageCategory,
  buttonLabel,
  className = '',
}: LeadMagnetCTAProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const covers = magnetsForSelection(selection)
  const magnet = covers.length === 1 ? covers[0] : null

  // localStorage can only be read after mount, so the server snapshot is always
  // "not downloaded" and the CTA swaps to its next-step variant on hydration —
  // and again the moment a download completes in the modal on this same page.
  // Only meaningful for a single magnet: the two-report picker stands as long as
  // either report is still on offer.
  // The snapshot returns a boolean read straight from storage, so it is stable
  // between calls within a render and needs no manual memoization.
  const alreadyHave = useSyncExternalStore(
    subscribeToDownloads,
    () => (magnet ? hasDownloaded(magnet.key, magnet.edition) : false),
    () => false,
  )

  const ctaLocation = variant

  const analyticsParams = {
    magnet_key: selection,
    magnet_id: magnet?.id,
    magnet_edition: magnet?.edition,
    report_type: selection,
    report_edition: magnet?.edition,
    cta_location: ctaLocation,
    page_category: pageCategory,
  }

  useViewTracking(containerRef, analyticsParams)

  const handleClick = () => {
    trackEvent('lead_magnet_click', analyticsParams)
    setOpen(true)
  }

  if (magnet && alreadyHave) {
    return (
      <NextStepCTA
        magnet={magnet}
        ctaLocation={ctaLocation}
        pageCategory={pageCategory}
        compact={variant === 'inline'}
        className={className}
      />
    )
  }

  const eyebrow = magnet?.ctaEyebrow ?? 'Free Palm Beach County Market Reports'
  const headline =
    magnet?.ctaHeadline ?? 'Get the Latest Palm Beach County Market Report'
  const description =
    magnet?.ctaDescription ??
    'Local prices, inventory, and negotiating conditions for single family homes, condos, and townhomes — free instant PDF downloads.'
  const label = buttonLabel ?? magnet?.ctaButtonLabel ?? 'Download the Free Report'

  const modal = (
    <LeadMagnetModal
      isOpen={open}
      onClose={() => setOpen(false)}
      selection={selection}
      ctaLocation={ctaLocation}
      pageCategory={pageCategory}
      returnFocusRef={triggerRef}
    />
  )

  if (variant === 'sidebar') {
    return (
      <div
        ref={containerRef}
        className={`overflow-hidden rounded-3xl border border-report-gold/40 bg-navy-950 shadow-card ${className}`}
      >
        <div className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-report-gold">
            {eyebrow}
          </p>
          <div className="mt-4 flex justify-center gap-3">
            {covers.map((m) => (
              <img
                key={m.key}
                src={m.coverImage}
                alt={m.coverAlt}
                width={magnet ? 150 : 110}
                height={magnet ? 194 : 142}
                loading="lazy"
                className={`rounded-lg shadow-lg ring-1 ring-white/10 ${magnet ? 'w-36' : 'w-[6.8rem]'}`}
              />
            ))}
          </div>
          <h3 className="mt-5 font-serif text-lg font-semibold leading-snug text-white">{headline}</h3>
          <p className="mt-2 text-sm leading-6 text-white/60">{description}</p>
          <button
            ref={triggerRef}
            type="button"
            onClick={handleClick}
            className="mt-5 w-full rounded-full bg-report-gold px-5 py-3 text-sm font-semibold text-navy-950 transition hover:bg-report-gold-dark"
          >
            {label}
          </button>
          <p className="mt-3 text-center text-[11px] text-white/60">
            Instant download · No obligation
          </p>
        </div>
        {modal}
      </div>
    )
  }

  if (variant === 'end-of-article') {
    return (
      <div
        ref={containerRef}
        className={`overflow-hidden rounded-3xl border border-report-gold/40 bg-navy-950 ${className}`}
      >
        <div className="grid items-center gap-6 p-7 sm:grid-cols-[auto_1fr] sm:p-9">
          <div className="flex justify-center gap-3">
            {covers.map((m) => (
              <img
                key={m.key}
                src={m.coverImage}
                alt={m.coverAlt}
                width={130}
                height={168}
                loading="lazy"
                className="w-28 rounded-lg shadow-xl ring-1 ring-white/10 sm:w-32"
              />
            ))}
          </div>
          <div className="text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-report-gold">
              {eyebrow}
            </p>
            <h3 className="mt-2 font-serif text-2xl font-semibold leading-snug text-white">{headline}</h3>
            <p className="mt-3 text-sm leading-7 text-white/60">{description}</p>
            <button
              ref={triggerRef}
              type="button"
              onClick={handleClick}
              className="mt-5 inline-flex items-center justify-center rounded-full bg-report-gold px-8 py-3.5 text-sm font-semibold text-navy-950 transition hover:bg-report-gold-dark"
            >
              {label}
            </button>
            <p className="mt-3 text-xs text-white/60">Free instant PDF · No obligation</p>
          </div>
        </div>
        {modal}
      </div>
    )
  }

  // 'inline' — horizontal band
  return (
    <div
      ref={containerRef}
      className={`flex flex-col items-center gap-5 rounded-2xl border border-report-gold/40 bg-navy-950 p-6 sm:flex-row ${className}`}
    >
      <div className="flex flex-shrink-0 gap-2">
        {covers.map((m) => (
          <img
            key={m.key}
            src={m.coverImage}
            alt={m.coverAlt}
            width={72}
            height={93}
            loading="lazy"
            className="w-[4.5rem] rounded shadow-lg ring-1 ring-white/10"
          />
        ))}
      </div>
      <div className="min-w-0 flex-1 text-center sm:text-left">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-report-gold">
          {eyebrow}
        </p>
        <h3 className="mt-1 font-serif text-lg font-semibold leading-snug text-white">{headline}</h3>
        <p className="mt-1 text-sm leading-6 text-white/60">{description}</p>
      </div>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleClick}
        className="flex-shrink-0 whitespace-nowrap rounded-full bg-report-gold px-6 py-3 text-sm font-semibold text-navy-950 transition hover:bg-report-gold-dark"
      >
        {label}
      </button>
      {modal}
    </div>
  )
}
