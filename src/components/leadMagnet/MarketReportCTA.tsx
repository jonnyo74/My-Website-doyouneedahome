'use client'

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from 'react'
import {
  marketReports,
  REPORT_EDITION,
  type ReportSelection,
} from '@/lib/marketReports'
import { trackEvent } from '@/lib/analytics'
import MarketReportModal from './MarketReportModal'

export interface MarketReportCTAProps {
  /** Which report to promote — 'both' opens a picker in the modal. */
  selection: ReportSelection
  variant: 'inline' | 'sidebar' | 'end-of-article'
  /** Page bucket for analytics/CRM, e.g. 'community', 'blog', 'buy' */
  pageCategory: string
  /** Overrides the default CTA button label */
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

export default function MarketReportCTA({
  selection,
  variant,
  pageCategory,
  buttonLabel,
  className = '',
}: MarketReportCTAProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const report = selection === 'both' ? null : marketReports[selection]
  const ctaLocation = variant

  const analyticsParams = {
    report_type: selection,
    report_edition: REPORT_EDITION,
    cta_location: ctaLocation,
    page_category: pageCategory,
  }

  useViewTracking(containerRef, analyticsParams)

  const handleClick = () => {
    trackEvent('lead_magnet_click', analyticsParams)
    setOpen(true)
  }

  const headline = report?.ctaHeadline ?? `Get the ${REPORT_EDITION} Palm Beach County Market Update`
  const description =
    report?.ctaDescription ??
    'Local prices, inventory, and negotiating conditions for single family homes, condos, and townhomes — free instant PDF downloads.'
  const covers = report ? [report] : [marketReports['single-family'], marketReports['condo-townhome']]

  const modal = (
    <MarketReportModal
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
            Free Market Report
          </p>
          <div className="mt-4 flex justify-center gap-3">
            {covers.map((r) => (
              <img
                key={r.type}
                src={r.coverImage}
                alt={r.coverAlt}
                width={report ? 150 : 110}
                height={report ? 194 : 142}
                loading="lazy"
                className={`rounded-lg shadow-lg ring-1 ring-white/10 ${report ? 'w-36' : 'w-[6.8rem]'}`}
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
            {buttonLabel ?? 'Download the Free Report'}
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
            {covers.map((r) => (
              <img
                key={r.type}
                src={r.coverImage}
                alt={r.coverAlt}
                width={130}
                height={168}
                loading="lazy"
                className="w-28 rounded-lg shadow-xl ring-1 ring-white/10 sm:w-32"
              />
            ))}
          </div>
          <div className="text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-report-gold">
              Buying or Selling in Palm Beach County?
            </p>
            <h3 className="mt-2 font-serif text-2xl font-semibold leading-snug text-white">{headline}</h3>
            <p className="mt-3 text-sm leading-7 text-white/60">{description}</p>
            <button
              ref={triggerRef}
              type="button"
              onClick={handleClick}
              className="mt-5 inline-flex items-center justify-center rounded-full bg-report-gold px-8 py-3.5 text-sm font-semibold text-navy-950 transition hover:bg-report-gold-dark"
            >
              {buttonLabel ?? 'Get Instant Access'}
            </button>
            <p className="mt-3 text-xs text-white/60">
              Free instant PDF · Updated with the latest Palm Beach County market data
            </p>
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
        {covers.map((r) => (
          <img
            key={r.type}
            src={r.coverImage}
            alt={r.coverAlt}
            width={72}
            height={93}
            loading="lazy"
            className="w-[4.5rem] rounded shadow-lg ring-1 ring-white/10"
          />
        ))}
      </div>
      <div className="min-w-0 flex-1 text-center sm:text-left">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-report-gold">
          Free {REPORT_EDITION} Market Report
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
        {buttonLabel ?? 'Download the Free Report'}
      </button>
      {modal}
    </div>
  )
}
