'use client'

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import {
  allReports,
  marketReports,
  REPORT_EDITION,
  reportsCoverPath,
  selectReportForPath,
} from '@/lib/marketReports'
import { trackEvent } from '@/lib/analytics'
import { captureFirstTouchUtm } from '@/lib/utm'
import { DOWNLOADED_STORAGE_KEY } from './ReportLeadForm'
import MarketReportModal from './MarketReportModal'

const STICKY_DISMISSED_KEY = 'dhg-report-sticky-dismissed-at'
const STICKY_DISMISS_DAYS = 7
const EXIT_SHOWN_KEY = 'dhg-report-exit-shown-at'
const EXIT_SHOWN_DAYS = 30

// Pages that already carry their own report form/CTAs, plus conversion pages
// where an interruption would hurt more than help.
const EXCLUDED_PATH_PREFIXES = [
  '/palm-beach-county-single-family-home-market-report',
  '/palm-beach-county-condo-townhome-market-report',
  '/contact',
]

function readTimestamp(key: string): number | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? Number(raw) || null : null
  } catch {
    return null
  }
}

function withinDays(ts: number | null, days: number): boolean {
  return !!ts && Date.now() - ts < days * 24 * 60 * 60 * 1000
}

function hasDownloaded(): boolean {
  try {
    return !!localStorage.getItem(DOWNLOADED_STORAGE_KEY)
  } catch {
    return false
  }
}

/**
 * Sitewide lead-magnet layer mounted once in the root layout:
 * - compact dismissible mobile sticky bar after 25% scroll depth
 * - restrained desktop-only exit-intent offer (once per 30 days)
 * Both stand down permanently once a visitor has downloaded a report.
 */
export default function SiteLeadMagnets() {
  const pathname = usePathname()
  // Suppressed on excluded paths, and on Treasure Coast pages the PBC reports
  // don't cover — otherwise the sticky bar re-offers the wrong county's data.
  const excluded =
    EXCLUDED_PATH_PREFIXES.some((p) => pathname.startsWith(p)) || !reportsCoverPath(pathname)

  useEffect(() => {
    captureFirstTouchUtm()
  }, [])

  if (excluded) return null

  return (
    <>
      <StickyMobileReportBar pathname={pathname} />
      <ExitIntentReportOffer pathname={pathname} />
    </>
  )
}

function StickyMobileReportBar({ pathname }: { pathname: string }) {
  const [visible, setVisible] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [suppressed, setSuppressed] = useState(true)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const viewTrackedRef = useRef(false)

  const selection = selectReportForPath(pathname)
  const report = selection === 'both' ? null : marketReports[selection]

  // Re-evaluate suppression on route change (dismissal, prior download) —
  // render-phase adjustment; an effect calling setState here would trip the
  // react-compiler lint rule. localStorage helpers safely return false in SSR.
  const [lastPath, setLastPath] = useState<string | null>(null)
  if (lastPath !== pathname) {
    setLastPath(pathname)
    setSuppressed(hasDownloaded() || withinDays(readTimestamp(STICKY_DISMISSED_KEY), STICKY_DISMISS_DAYS))
    setVisible(false)
    setModalOpen(false)
  }

  // Reveal after the visitor scrolls at least 25% of the page.
  useEffect(() => {
    if (suppressed) return
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      if (scrollable <= 0) return
      if (window.scrollY / scrollable >= 0.25) {
        setVisible(true)
        if (!viewTrackedRef.current) {
          viewTrackedRef.current = true
          trackEvent('lead_magnet_view', {
            report_type: selection,
            report_edition: REPORT_EDITION,
            cta_location: 'mobile-sticky',
            page_url: pathname,
          })
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [suppressed, pathname, selection])

  if (suppressed || !visible) return null

  const dismiss = () => {
    try {
      localStorage.setItem(STICKY_DISMISSED_KEY, String(Date.now()))
    } catch {
      // ignore
    }
    setSuppressed(true)
  }

  const openModal = () => {
    trackEvent('lead_magnet_click', {
      report_type: selection,
      report_edition: REPORT_EDITION,
      cta_location: 'mobile-sticky',
      page_url: pathname,
    })
    setModalOpen(true)
  }

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-report-gold/40 bg-navy-950/95 px-4 py-3 backdrop-blur-sm lg:hidden">
        <div className="flex items-center gap-3">
          <img
            src={(report ?? allReports[0]).coverImage}
            alt=""
            aria-hidden="true"
            width={34}
            height={44}
            loading="lazy"
            className="h-11 w-[2.125rem] flex-shrink-0 rounded shadow-md"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              Free {REPORT_EDITION} Market Report
            </p>
            <p className="truncate text-xs text-white/50">
              {report ? report.category : 'Palm Beach County'} · Instant PDF download
            </p>
          </div>
          <button
            ref={triggerRef}
            type="button"
            onClick={openModal}
            className="flex-shrink-0 rounded-full bg-report-gold px-4 py-2 text-xs font-semibold text-navy-950 transition hover:bg-report-gold-dark"
          >
            Download
          </button>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss market report offer"
            className="-mr-1 flex-shrink-0 rounded-full p-1.5 text-white/60 transition hover:text-white"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      <MarketReportModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selection={selection}
        ctaLocation="mobile-sticky"
        pageCategory="site"
        returnFocusRef={triggerRef}
      />
    </>
  )
}

function ExitIntentReportOffer({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false)
  const armedRef = useRef(false)

  const selection = selectReportForPath(pathname)

  useEffect(() => {
    // Desktop only — exit intent via mouse leaving the viewport top.
    if (typeof window === 'undefined') return
    if (!window.matchMedia('(pointer: fine)').matches || window.innerWidth < 1024) return
    if (hasDownloaded() || withinDays(readTimestamp(EXIT_SHOWN_KEY), EXIT_SHOWN_DAYS)) return

    // Arm after a grace period so an immediate bounce isn't intercepted.
    const armTimer = setTimeout(() => {
      armedRef.current = true
    }, 10_000)

    const onMouseOut = (e: MouseEvent) => {
      if (!armedRef.current || e.relatedTarget || e.clientY > 10) return
      armedRef.current = false
      try {
        localStorage.setItem(EXIT_SHOWN_KEY, String(Date.now()))
      } catch {
        // ignore
      }
      trackEvent('lead_magnet_view', {
        report_type: selection,
        report_edition: REPORT_EDITION,
        cta_location: 'exit-intent',
        page_url: pathname,
      })
      setOpen(true)
    }

    document.addEventListener('mouseout', onMouseOut)
    return () => {
      clearTimeout(armTimer)
      document.removeEventListener('mouseout', onMouseOut)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <MarketReportModal
      isOpen={open}
      onClose={() => setOpen(false)}
      selection={selection}
      ctaLocation="exit-intent"
      pageCategory="site"
      headline="Before You Go"
      intro="Download the latest Palm Beach County Market Report and see what buyers and sellers need to know right now."
    />
  )
}
