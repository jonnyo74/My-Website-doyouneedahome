'use client'

/* eslint-disable @next/next/no-img-element */

import { useEffect, useId, useRef, useState } from 'react'
import {
  marketReports,
  type ReportSelection,
  type ReportType,
} from '@/lib/marketReports'
import { trackEvent } from '@/lib/analytics'
import ReportLeadForm from './ReportLeadForm'

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

// Prefer a real form field for initial focus — the Close button is first in
// DOM order and would otherwise steal focus ahead of the First Name input.
const INITIAL_FOCUS_SELECTOR = 'input:not([type="hidden"]):not([tabindex="-1"]), select, textarea'

export interface MarketReportModalProps {
  isOpen: boolean
  onClose: () => void
  selection: ReportSelection
  ctaLocation: string
  pageCategory: string
  returnFocusRef?: React.RefObject<HTMLElement | null>
  headline?: string
  intro?: string
}

export default function MarketReportModal({
  isOpen,
  onClose,
  selection,
  ctaLocation,
  pageCategory,
  returnFocusRef,
  headline = 'Get the Latest Palm Beach County Market Report',
  intro,
}: MarketReportModalProps) {
  const [chosenType, setChosenType] = useState<ReportType | null>(
    selection === 'both' ? null : selection,
  )
  // Reset picker state each time the modal reopens (render-phase adjustment —
  // an effect calling setState here would trip the react-compiler lint rule).
  const [prevOpen, setPrevOpen] = useState(isOpen)
  if (prevOpen !== isOpen) {
    setPrevOpen(isOpen)
    if (isOpen) setChosenType(selection === 'both' ? null : selection)
  }
  const dialogRef = useRef<HTMLDivElement>(null)
  const uid = useId()
  const idPrefix = `report-modal-${ctaLocation}-${uid}`
  const titleId = `${idPrefix}-title`

  const report = chosenType ? marketReports[chosenType] : null

  // Open/close side effects: body scroll lock, initial focus, restore focus.
  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    trackEvent('lead_magnet_modal_open', {
      report_type: selection,
      cta_location: ctaLocation,
      page_category: pageCategory,
      page_url: window.location.pathname,
    })

    const focusTimer = setTimeout(() => {
      const first =
        dialogRef.current?.querySelector<HTMLElement>(INITIAL_FOCUS_SELECTOR) ??
        dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)
      first?.focus()
    }, 0)

    const triggerToRestore = returnFocusRef?.current

    return () => {
      clearTimeout(focusTimer)
      document.body.style.overflow = ''
      triggerToRestore?.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  // Escape to close + focus trap while open.
  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab') return

      const nodeList = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      if (!nodeList || nodeList.length === 0) return
      const focusables = Array.from(nodeList).filter((el) => !el.hasAttribute('disabled'))
      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 z-[9998] bg-navy-950/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="pointer-events-none fixed inset-0 z-[9999] overflow-y-auto">
        <div className="flex min-h-full items-start justify-center p-4 pb-10 pt-8 sm:pt-14">
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="pointer-events-auto relative max-h-[88vh] w-full max-w-md overflow-y-auto rounded-3xl border border-report-gold/30 bg-navy-950 p-6 shadow-2xl sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-1.5 text-white/40 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-report-gold"
              aria-label="Close dialog"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            <p className="pr-8 text-xs font-semibold uppercase tracking-[0.22em] text-report-gold">
              Free Instant Download
            </p>
            <h2 id={titleId} className="mt-1.5 pr-8 font-serif text-xl font-semibold leading-snug text-white">
              {headline}
            </h2>
            {intro && <p className="mt-2 text-sm leading-6 text-white/60">{intro}</p>}

            {report ? (
              <>
                <div className="mt-4 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-3.5">
                  <img
                    src={report.coverImage}
                    alt={report.coverAlt}
                    width={44}
                    height={57}
                    loading="lazy"
                    className="h-14 w-11 flex-shrink-0 rounded shadow-md"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-snug text-white">{report.title}</p>
                    <p className="mt-0.5 text-xs text-report-gold">
                      {report.edition} Edition · {report.dataMonth} market data
                    </p>
                  </div>
                  {selection === 'both' && (
                    <button
                      type="button"
                      onClick={() => setChosenType(null)}
                      className="ml-auto flex-shrink-0 text-xs font-semibold text-white/50 underline underline-offset-2 transition hover:text-white"
                    >
                      Change
                    </button>
                  )}
                </div>
                <div className="mt-5">
                  <ReportLeadForm
                    report={report}
                    ctaLocation={ctaLocation}
                    pageCategory={pageCategory}
                    idPrefix={idPrefix}
                    tone="dark"
                  />
                </div>
              </>
            ) : (
              <div className="mt-5 space-y-3">
                <p className="text-sm text-white/60">Which report would you like?</p>
                {(Object.keys(marketReports) as ReportType[]).map((type) => {
                  const r = marketReports[type]
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setChosenType(type)}
                      className="flex w-full items-center gap-4 rounded-2xl border border-white/15 bg-white/5 p-4 text-left transition hover:border-report-gold/60 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-report-gold"
                    >
                      <img
                        src={r.coverImage}
                        alt={r.coverAlt}
                        width={52}
                        height={67}
                        loading="lazy"
                        className="h-[4.2rem] w-13 flex-shrink-0 rounded shadow-md"
                      />
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold leading-snug text-white">{r.title}</span>
                        <span className="mt-1 block text-xs text-white/50">{r.ctaDescription}</span>
                      </span>
                      <span className="ml-auto flex-shrink-0 text-report-gold" aria-hidden="true">→</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
