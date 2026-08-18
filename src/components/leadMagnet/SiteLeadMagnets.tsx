'use client'

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  isLeadMagnetKey,
  magnetsForSelection,
  type LeadMagnetSelection,
} from '@/lib/leadMagnets'
import { isGlobalOfferExcluded, selectMagnetForPath } from '@/lib/leadMagnetRouting'
import { hasDownloaded } from '@/lib/leadMagnetState'
import { trackEvent } from '@/lib/analytics'
import { captureFirstTouchUtm } from '@/lib/utm'
import LeadMagnetModal from './LeadMagnetModal'

const STICKY_DISMISSED_KEY = 'dhg-report-sticky-dismissed-at'
const STICKY_DISMISS_DAYS = 7
const EXIT_SHOWN_KEY = 'dhg-report-exit-shown-at'
const EXIT_SHOWN_DAYS = 30

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

/**
 * True once the visitor holds every magnet this page would offer. Suppression
 * is per magnet and per edition, so taking the single-family report no longer
 * silences the relocation guide, and next month's report is a fresh offer.
 */
function alreadyHasSelection(selection: LeadMagnetSelection): boolean {
  return magnetsForSelection(selection).every((m) => hasDownloaded(m.key, m.edition))
}

/**
 * The magnet this page already decided on, published as
 * `<meta name="lead-magnet-selection">` by the community and blog routes. The
 * sitewide layer only knows the pathname, which is a coarser signal — reading
 * the page's own answer keeps the sticky bar and the exit-intent offer from
 * promoting something different from the CTAs in the page body. Falls back to
 * the pathname on routes that don't publish one.
 */
function selectionForPage(pathname: string): LeadMagnetSelection {
  if (typeof document !== 'undefined') {
    const declared = document
      .querySelector('meta[name="lead-magnet-selection"]')
      ?.getAttribute('content')
    if (declared === 'pbc-both' || isLeadMagnetKey(declared ?? undefined)) {
      return declared as LeadMagnetSelection
    }
  }
  return selectMagnetForPath(pathname)
}

/**
 * Sitewide lead-magnet layer mounted once in the root layout:
 * - compact dismissible mobile sticky bar after 25% scroll depth
 * - restrained desktop-only exit-intent offer (once per 30 days)
 * Which magnet appears is decided by src/lib/leadMagnetRouting.ts, so a
 * Treasure Coast page never sees Palm Beach County report language.
 */
export default function SiteLeadMagnets() {
  const pathname = usePathname()
  // Suppressed on the magnets' own landing pages, on /contact, and across the
  // seller valuation funnel — all of which already carry their own form.
  const excluded = isGlobalOfferExcluded(pathname)

  useEffect(() => {
    captureFirstTouchUtm()
  }, [])

  if (excluded) return null

  return (
    <>
      <StickyMobileBar pathname={pathname} />
      <ExitIntentOffer pathname={pathname} />
    </>
  )
}

function StickyMobileBar({ pathname }: { pathname: string }) {
  const [visible, setVisible] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [dismissed, setDismissed] = useState(true)
  const [hasMagnet, setHasMagnet] = useState(false)
  const [selection, setSelection] = useState<LeadMagnetSelection>(() =>
    selectMagnetForPath(pathname),
  )
  const triggerRef = useRef<HTMLButtonElement>(null)
  const viewTrackedRef = useRef(false)

  const magnets = magnetsForSelection(selection)
  const primary = magnets[0]

  // Re-evaluate on route change (dismissal, prior download) — render-phase
  // adjustment; an effect calling setState here would trip the react-compiler
  // lint rule. The storage helpers safely return false during SSR.
  const [lastPath, setLastPath] = useState<string | null>(null)
  if (lastPath !== pathname) {
    const next = selectionForPage(pathname)
    setLastPath(pathname)
    setSelection(next)
    setDismissed(withinDays(readTimestamp(STICKY_DISMISSED_KEY), STICKY_DISMISS_DAYS))
    setHasMagnet(alreadyHasSelection(next))
    setVisible(false)
    setModalOpen(false)
  }

  // Reveal after the visitor scrolls at least 25% of the page.
  useEffect(() => {
    if (dismissed) return
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      if (scrollable <= 0) return
      if (window.scrollY / scrollable >= 0.25) {
        setVisible(true)
        if (!viewTrackedRef.current) {
          viewTrackedRef.current = true
          trackEvent('lead_magnet_view', {
            magnet_key: selection,
            report_type: selection,
            magnet_edition: primary.edition,
            report_edition: primary.edition,
            cta_location: 'mobile-sticky',
            page_url: pathname,
          })
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [dismissed, pathname, selection, primary.edition])

  if (dismissed || !visible) return null

  const dismiss = () => {
    try {
      localStorage.setItem(STICKY_DISMISSED_KEY, String(Date.now()))
    } catch {
      // ignore
    }
    setDismissed(true)
  }

  const openModal = () => {
    trackEvent('lead_magnet_click', {
      magnet_key: selection,
      report_type: selection,
      magnet_edition: primary.edition,
      report_edition: primary.edition,
      cta_location: 'mobile-sticky',
      page_url: pathname,
    })
    setModalOpen(true)
  }

  // Already downloaded — offer the logical next step instead of the same PDF.
  const nextStep = hasMagnet ? primary.nextStep : null

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-report-gold/40 bg-navy-950/95 px-4 py-3 backdrop-blur-sm lg:hidden">
        <div className="flex items-center gap-3">
          {!nextStep && (
            <img
              src={primary.coverImage}
              alt=""
              aria-hidden="true"
              width={34}
              height={44}
              loading="lazy"
              className="h-11 w-[2.125rem] flex-shrink-0 rounded shadow-md"
            />
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              {nextStep ? nextStep.headline : `Free ${primary.shortTitle}`}
            </p>
            <p className="truncate text-xs text-white/60">
              {nextStep ? nextStep.description : `${primary.category} · Instant PDF download`}
            </p>
          </div>
          {nextStep ? (
            <Link
              href={nextStep.href}
              onClick={() =>
                trackEvent('lead_magnet_next_step_click', {
                  magnet_key: primary.key,
                  report_type: primary.key,
                  cta_location: 'mobile-sticky',
                  page_url: pathname,
                })
              }
              className="flex-shrink-0 rounded-full bg-report-gold px-4 py-2 text-xs font-semibold text-navy-950 transition hover:bg-report-gold-dark"
            >
              Go
            </Link>
          ) : (
            <button
              ref={triggerRef}
              type="button"
              onClick={openModal}
              className="flex-shrink-0 rounded-full bg-report-gold px-4 py-2 text-xs font-semibold text-navy-950 transition hover:bg-report-gold-dark"
            >
              Download
            </button>
          )}
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss this offer"
            className="-mr-1 flex-shrink-0 rounded-full p-1.5 text-white/60 transition hover:text-white"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      <LeadMagnetModal
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

function ExitIntentOffer({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false)
  const armedRef = useRef(false)

  const [selection, setSelection] = useState<LeadMagnetSelection>(() =>
    selectMagnetForPath(pathname),
  )
  const [lastPath, setLastPath] = useState<string | null>(null)
  if (lastPath !== pathname) {
    setLastPath(pathname)
    setSelection(selectionForPage(pathname))
    setOpen(false)
  }
  const primary = magnetsForSelection(selection)[0]

  useEffect(() => {
    // Desktop only — exit intent via mouse leaving the viewport top.
    if (typeof window === 'undefined') return
    if (!window.matchMedia('(pointer: fine)').matches || window.innerWidth < 1024) return
    // Never interrupt someone to re-offer a download they already have.
    if (alreadyHasSelection(selection)) return
    if (withinDays(readTimestamp(EXIT_SHOWN_KEY), EXIT_SHOWN_DAYS)) return

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
        magnet_key: selection,
        report_type: selection,
        magnet_edition: primary.edition,
        report_edition: primary.edition,
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
    <LeadMagnetModal
      isOpen={open}
      onClose={() => setOpen(false)}
      selection={selection}
      ctaLocation="exit-intent"
      pageCategory="site"
      headline="Before You Go"
      intro={primary.ctaDescription}
    />
  )
}
