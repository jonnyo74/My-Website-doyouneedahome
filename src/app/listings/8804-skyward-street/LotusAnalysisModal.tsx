'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { trackEvent } from '@/lib/analytics'
import { onOpenAnalysis } from './analysisBus'
import { ANALYSIS_PAGE_CATEGORY } from './analysisEvents'
import LotusAnalysisForm from './LotusAnalysisForm'

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

// Prefer a real field for initial focus — the Close button is first in DOM
// order and would otherwise steal focus ahead of the address input.
const INITIAL_FOCUS_SELECTOR = 'input:not([type="hidden"]):not([tabindex="-1"]), textarea'

/**
 * Single dialog for the whole page, mounted once. Opens via analysisBus from
 * either seller CTA, closes on Esc / backdrop / the close button, and returns
 * focus to the CTA that opened it.
 *
 * Deliberately not the site-wide LeadMagnetModal: that one is styled in the
 * brand navy/gold and is bound to the market-report magnets. This page has its
 * own .sky- design language and the modal has to look like it belongs to it.
 * No new dependency — same hand-rolled dialog the Lightbox on this page uses,
 * plus the focus trap from LeadMagnetModal.
 */
export default function LotusAnalysisModal() {
  const [origin, setOrigin] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)

  const isOpen = origin !== null

  useEffect(
    () =>
      onOpenAnalysis((from) => {
        returnFocusRef.current = document.activeElement as HTMLElement | null
        setSubmitted(false)
        setOrigin(from)
      }),
    []
  )

  const close = useCallback(() => {
    setOrigin(null)
    returnFocusRef.current?.focus()
  }, [])

  // Open side effects: scroll lock, open event, initial focus.
  useEffect(() => {
    if (!isOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    trackEvent('seller_form_open', {
      cta_location: origin,
      page_category: ANALYSIS_PAGE_CATEGORY,
    })

    const focusTimer = setTimeout(() => {
      const first =
        dialogRef.current?.querySelector<HTMLElement>(INITIAL_FOCUS_SELECTOR) ??
        dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)
      first?.focus()
    }, 0)

    return () => {
      clearTimeout(focusTimer)
      document.body.style.overflow = prevOverflow
    }
    // Bind once per open, not per origin change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  // Escape to close + focus trap while open.
  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close()
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
  }, [isOpen, close])

  if (!isOpen) return null

  return (
    <div className="sky-modal-layer">
      {/* Backdrop click is a convenience for pointer users only — keyboard
          users close with Esc (bound above) or the labeled close button. */}
      <div className="sky-modal-scrim" onClick={close} aria-hidden="true" />

      <div className="sky-modal-scroll">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="sky-analysis-title"
          className="sky-modal-panel"
        >
          <button
            type="button"
            onClick={close}
            className="sky-modal-close"
            aria-label="Close the property analysis request"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {/* The header collapses to a screen-reader-only title after a
              successful submit — the confirmation carries its own heading and
              two stacked headlines on a phone would push it off screen. */}
          {submitted ? (
            <h2 id="sky-analysis-title" className="sr-only">
              Your Lotus property analysis has been requested
            </h2>
          ) : (
            <div className="pr-10">
              <p className="sky-label sky-label--dark">Lotus Homeowners</p>
              <h2
                id="sky-analysis-title"
                className="sky-display mt-3 text-[1.75rem] leading-[1.12] text-[#f5f2eb] sm:text-3xl"
              >
                A detailed look at your property.
              </h2>
              <p className="mt-4 text-sm leading-6 text-[#f5f2eb]/70">
                Four details and John can start. Property-specific, reviewed before it is sent,
                and no obligation.
              </p>
            </div>
          )}

          <div className={submitted ? '' : 'mt-7'}>
            <LotusAnalysisForm
              ctaLocation={origin}
              idPrefix="lotus-analysis"
              onSuccess={() => setSubmitted(true)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
