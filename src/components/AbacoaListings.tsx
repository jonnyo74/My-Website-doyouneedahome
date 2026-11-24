'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import ContactForm from '@/components/ContactForm'
import { trackEvent } from '@/lib/analytics'
import {
  classifyProbe,
  getAbacoaScope,
  scopeFullSearchUrl,
  scopeProbeUrl,
  type AbacoaScope,
  type ProbeOutcome,
} from '@/lib/abacoaScopes'

// Wraps the Ylopo results widget for an Abacoa route and decides what the
// visitor sees. The widget div is rendered by the server (AbacoaScopeWidget)
// and passed in as children; Ylopo fills it asynchronously after its script
// loads, and gives no signal when it has nothing to show or has failed. So this
// component asks the provider the same question itself, which is the only way
// to tell a real "no homes" from a broken feed:
//
//   loading      waiting for the provider
//   results      the scope has active homes; the widget is shown
//   empty        the provider answered with zero rows: a verified empty
//   unavailable  the provider failed, timed out, or returned rows outside the
//                scope. Nothing is claimed about inventory.
//
// The widget must stay mounted and full-width in every state (it sizes its
// charts from its container). It is hidden with opacity and zero height plus
// `inert`, never display:none.

const PROBE_TIMEOUT_MS = 8_000
const WIDGET_WAIT_MS = 12_000
// When the probe itself failed, the widget is the only hope; give it less time.
const WIDGET_RESCUE_MS = 6_000
// After giving up, keep watching this long for the widget to appear anyway.
const LATE_RECOVERY_MS = 45_000
const CACHE_MS = 60_000

type View = 'loading' | 'results' | 'empty' | 'unavailable'

// Keyed by scope slug so one route's answer can never be shown on another, and
// only definite answers are kept: a failure is retried on the next visit.
const cache = new Map<string, { at: number; outcome: ProbeOutcome }>()
let callbackSeq = 0

function probeScope(scope: AbacoaScope): Promise<ProbeOutcome> {
  const hit = cache.get(scope.slug)
  if (hit && Date.now() - hit.at < CACHE_MS) return Promise.resolve(hit.outcome)

  return new Promise((resolve) => {
    const name = `__abacoaProbe${callbackSeq++}`
    const w = window as unknown as Record<string, unknown>
    const script = document.createElement('script')
    let done = false
    const finish = (raw: unknown, failure?: 'error' | 'timeout') => {
      if (done) return
      done = true
      clearTimeout(timer)
      delete w[name]
      script.remove()
      const outcome = classifyProbe(raw, scope, failure)
      if (outcome.state === 'results' || outcome.state === 'empty') {
        cache.set(scope.slug, { at: Date.now(), outcome })
      }
      resolve(outcome)
    }
    const timer = setTimeout(() => finish(null, 'timeout'), PROBE_TIMEOUT_MS)
    w[name] = (body: unknown) => finish(body)
    script.onerror = () => finish(null, 'error')
    script.src = scopeProbeUrl(scope, name)
    script.async = true
    document.body.appendChild(script)
  })
}

/**
 * Ylopo's card renders the photo link with only a status badge ("NEW") as its
 * text and the alt text "static-google-map", and an icon button with no name.
 * Neither says which home it is. This gives each one an address-based name,
 * read from the card's own address block, and keeps the map image from being
 * announced as noise. It is idempotent, so it is safe to re-run whenever the
 * widget re-renders.
 */
function labelWidgetCards(root: HTMLElement, hiddenIds: string[] = []) {
  root.querySelectorAll<HTMLElement>('.gallery-grid-item, .grid-view-item').forEach((item) => {
    const href = item.querySelector('a')?.getAttribute('href') ?? ''
    const hide = hiddenIds.some((id) => href.includes(`/detail/${id}`))
    if (item.hidden !== hide) item.hidden = hide
    item.style.display = hide ? 'none' : ''
  })
  root.querySelectorAll<HTMLElement>('.gallery-card-b').forEach((card) => {
    const street = card.querySelector('.gallery-card-b-address-block .layout > div')?.textContent?.trim()
    if (!street) return
    const place = card.querySelector('.gallery-card-b-address-block .locality')?.textContent?.replace(/\s+/g, ' ').trim()
    const address = place ? `${street}, ${place}` : street
    const status = card.querySelector('.listing-status-flag')?.textContent?.trim()
    const link = card.querySelector<HTMLAnchorElement>('.gallery-card-b-image-container a')
    const label = `${address}${status ? `, ${status}` : ''}: view listing`
    if (link && link.getAttribute('aria-label') !== label) link.setAttribute('aria-label', label)
    card.querySelectorAll('img.static-google-map').forEach((img) => img.setAttribute('alt', ''))
    const toggle = card.querySelector<HTMLButtonElement>('button.card-icon')
    if (toggle && !toggle.getAttribute('aria-label')) toggle.setAttribute('aria-label', `Map and photo for ${street}`)
  })
}

export default function AbacoaListings({
  slug,
  children,
  scope: scopeOverride,
  areaNote = 'Abacoa, Jupiter',
  submitLabel,
}: {
  slug: string
  children: React.ReactNode
  /** A scope from outside lib/abacoaScopes (e.g. lib/colonyScope). Must be a module-level constant. */
  scope?: AbacoaScope
  /** Parenthetical in the pre-filled alert message that says where the scope is. */
  areaNote?: string
  /** Replaces the alert form's "Send Message" button label. */
  submitLabel?: string
}) {
  const scope = scopeOverride ?? getAbacoaScope(slug)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [view, setView] = useState<View>('loading')
  const [comingSoon, setComingSoon] = useState(0)
  const hiddenIdsRef = useRef<string[]>([])
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!scope) return
    let cancelled = false
    let observer: MutationObserver | undefined
    let widgetTimer: ReturnType<typeof setTimeout> | undefined
    const el = wrapRef.current?.querySelector('.YLOPO_resultsWidget') as HTMLElement | null

    const waitForCards = (onReady: () => void, onGiveUp: () => void, ms: number = WIDGET_WAIT_MS) => {
      if (!el) return onGiveUp()
      if (el.childElementCount > 0) return onReady()
      observer = new MutationObserver(() => {
        if (el.childElementCount > 0) {
          observer?.disconnect()
          clearTimeout(widgetTimer)
          onReady()
        }
      })
      observer.observe(el, { childList: true })
      widgetTimer = setTimeout(() => {
        observer?.disconnect()
        if (el.childElementCount > 0) onReady()
        else onGiveUp()
      }, ms)
    }

    // Keep the card names current for as long as this scope is on screen.
    let labelTimer: ReturnType<typeof setTimeout> | undefined
    const labeler = new MutationObserver(() => {
      clearTimeout(labelTimer)
      labelTimer = setTimeout(() => el && labelWidgetCards(el, hiddenIdsRef.current), 50)
    })
    if (el) {
      labelWidgetCards(el)
      labeler.observe(el, { childList: true, subtree: true })
    }

    // Show the unavailable message, but keep watching: a slow connection or a
    // late script can still fill the widget, and then the cards should win.
    const giveUp = () => {
      if (cancelled) return
      setView('unavailable')
      waitForCards(() => !cancelled && setView('results'), () => {}, LATE_RECOVERY_MS)
    }

    probeScope(scope).then((outcome) => {
      if (cancelled) return
      if (outcome.state === 'empty') {
        setView('empty')
        return
      }
      if (outcome.state === 'results') {
        // Strictly Active: when every in-scope row is Coming Soon the honest
        // answer is the empty state, not a card for a home that is not active.
        if (outcome.active === 0) {
          setComingSoon(outcome.comingSoon)
          setView('empty')
          return
        }
        setComingSoon(outcome.comingSoon)
        hiddenIdsRef.current = outcome.hiddenIds
        if (el) labelWidgetCards(el, outcome.hiddenIds)
        waitForCards(() => !cancelled && setView('results'), giveUp)
        return
      }
      // Probe failed. Rows outside the scope are never shown. A plain failure
      // can still be rescued by the widget rendering on its own.
      if (outcome.reason === 'out-of-scope') {
        setView('unavailable')
        return
      }
      waitForCards(() => !cancelled && setView('results'), giveUp, WIDGET_RESCUE_MS)
    })

    return () => {
      cancelled = true
      observer?.disconnect()
      labeler.disconnect()
      clearTimeout(labelTimer)
      clearTimeout(widgetTimer)
    }
  }, [scope, attempt])

  if (!scope) return null
  const showWidget = view === 'results' || view === 'loading'
  const fullSearch = scopeFullSearchUrl(scope)

  return (
    <div>
      <div
        ref={wrapRef}
        className={view === 'loading' ? 'relative min-h-[420px]' : view === 'results' ? '' : 'h-0 overflow-hidden'}
      >
        <div
          className={view === 'results' ? '' : 'opacity-0'}
          {...(showWidget ? {} : { inert: true, 'aria-hidden': true })}
        >
          {children}
        </div>
        {view === 'loading' && (
          <div className="absolute inset-0" role="status" aria-live="polite">
            <span className="sr-only">Loading {scope.name} listings</span>
            <div className="grid animate-pulse gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <div key={i} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <div className="h-44 bg-slate-100" />
                  <div className="space-y-3 p-5">
                    <div className="h-5 w-1/2 rounded bg-slate-200" />
                    <div className="h-4 w-3/4 rounded bg-slate-100" />
                    <div className="h-4 w-1/3 rounded bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {view === 'empty' && (
        <div role="status" className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
          <h3 className="font-serif text-xl font-semibold text-slate-900">
            No active homes for sale in {scope.name} right now
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-slate-600">
            {comingSoon > 0
              ? `${comingSoon === 1 ? 'One home is' : `${comingSoon} homes are`} listed as Coming Soon, which is not active yet. `
              : ''}
            We can tell you the day one comes up.
          </p>
          <AlertRequest
            scope={scope}
            openLabel={`Request ${scope.name} listing alerts`}
            kind="alerts"
            areaNote={areaNote}
            submitLabel={submitLabel}
          />
        </div>
      )}

      {view === 'unavailable' && (
        <div role="status" className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
          <h3 className="font-serif text-xl font-semibold text-slate-900">
            {scope.name} listings are temporarily unavailable
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-slate-600">
            We could not confirm the current {scope.name} listings, so we are not showing a count. This
            can happen with a content blocker or a slow connection. The {scope.name} search below uses the
            same area, or we can send you matching homes directly.
          </p>
          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={fullSearch}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gold-600"
            >
              Open the {scope.name} search →
            </a>
          </div>
          <button
            type="button"
            onClick={() => {
              cache.delete(scope.slug)
              setView('loading')
              setAttempt((n) => n + 1)
            }}
            className="mt-4 text-sm font-semibold text-gold-600 underline-offset-4 hover:text-gold-700 hover:underline"
          >
            Try loading the listings again
          </button>
          <AlertRequest
            scope={scope}
            openLabel={`Ask about ${scope.name} homes`}
            kind="contact"
            areaNote={areaNote}
            submitLabel={submitLabel}
          />
        </div>
      )}
    </div>
  )
}

function AlertRequest({
  scope,
  openLabel,
  kind,
  areaNote,
  submitLabel,
}: {
  scope: AbacoaScope
  openLabel: string
  kind: 'alerts' | 'contact'
  areaNote: string
  submitLabel?: string
}) {
  const [open, setOpen] = useState(false)
  const message =
    kind === 'alerts'
      ? `Please send me new listing alerts for ${scope.name} (${areaNote}): active homes for sale only, any price, any property type.`
      : `I would like to hear about ${scope.name} (${areaNote}) homes for sale.`

  if (!open) {
    return (
      <div className="mt-5">
        <button
          type="button"
          onClick={() => {
            setOpen(true)
            trackEvent('abacoa_alert_cta_click', { scope: scope.slug, kind })
          }}
          className="inline-flex items-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-gold-500 hover:text-gold-600"
        >
          {openLabel}
        </button>
      </div>
    )
  }
  return (
    <div className="mx-auto mt-6 max-w-md rounded-2xl border border-slate-200 bg-white p-5 text-left">
      <ContactForm
        ctaPlacement="community-inline"
        pageName={scope.name}
        idPrefix={`alert-${scope.slug}`}
        initialMessage={message}
        submitLabel={submitLabel}
      />
      <p className="mt-3 text-xs text-slate-500">
        Prefer to talk first?{' '}
        <Link href="/contact" className="font-semibold text-gold-600 hover:text-gold-700">
          Contact DO Homes Group
        </Link>
      </p>
    </div>
  )
}
