'use client'

import dynamic from 'next/dynamic'
import { useCallback, useMemo, useRef, useState } from 'react'
import { LAUNCH_DISCLAIMER, MAP_CENTRE, MAP_ZOOM, launches } from '@/lib/paddle/launches'
import type { LaunchSite } from '@/lib/paddle/types'

/**
 * Leaflet touches `window` at import time, so the map is client-only. The
 * `ssr: false` option is only legal inside a Client Component, which is why
 * this wrapper lives here rather than in the server page.
 */
const LaunchMap = dynamic(() => import('./LaunchMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[420px] w-full animate-pulse rounded-2xl bg-slate-200 sm:h-[520px]" />
  ),
})

type FilterId = 'all' | 'hand' | 'free' | 'calm' | 'wild'

const FILTERS: { id: FilterId; label: string }[] = [
  { id: 'all', label: 'Everything' },
  { id: 'hand', label: 'Hand launch' },
  { id: 'free', label: 'Free' },
  { id: 'calm', label: 'Calm / beginner' },
  { id: 'wild', label: 'Wild & Scenic' },
]

function passes(site: LaunchSite, filter: FilterId): boolean {
  switch (filter) {
    case 'hand':
      return site.kind === 'hand'
    case 'free':
      return site.free
    case 'calm':
      return site.beginnerFriendly
    case 'wild':
      return site.group === 'wild'
    default:
      return true
  }
}

const KIND_LABEL: Record<LaunchSite['kind'], string> = {
  hand: 'Hand launch',
  ramp: 'Ramp + paddle access',
  'water-only': 'Paddle-in only',
  unconfirmed: 'Confirm before you drive',
}

const SOURCING_LABEL: Record<LaunchSite['sourcing'], string> = {
  confirmed: 'Confirmed by the managing agency',
  corroborated: 'Corroborated across sources',
  single: 'Single source — verify',
}

/**
 * `figure` is illustrative, not documentary.
 *
 * The caption claims the SUBJECT and never the place. The frame is stock, and
 * although the photographer tagged it “Loxahatchee, Florida” that tag means the
 * Acreage community in western Palm Beach County, not the Loxahatchee River.
 * The ecology is right — bald cypress, cabbage palm, sword fern, blackwater —
 * so it shows a reader what this water looks like without asserting it is this
 * river. See public/images/hobe-sound/SOURCES.md.
 */
const GROUPS: {
  id: LaunchSite['group']
  title: string
  kicker: string
  blurb: string
  figure?: { src: string; alt: string; caption: string; credit: string }
}[] = [
  {
    id: 'tidal',
    title: 'The tidal river, the inlet & the Intracoastal',
    kicker: 'Salt water · everyday paddling',
    blurb:
      'This is the stretch that matters if you want to paddle before work. All of it is tidal, and all of it drains through one narrow inlet — which is exactly why the launch you live near decides whether you are on flat water or fighting a hard ebb.',
  },
  {
    id: 'wild',
    title: 'Upriver — the Wild & Scenic Northwest Fork',
    kicker: 'Fresh water · cypress · portages',
    blurb:
      'Florida’s first federally designated Wild & Scenic river. Two dams to portage, log jams after storms, and a landing at Trapper Nelson’s you can only reach by boat. The day-trip half of the system, not the before-work half.',
    figure: {
      src: '/images/hobe-sound/stock-kayak-cypress-river.jpg',
      alt: 'A kayaker paddling a narrow blackwater river beneath bald cypress and cabbage palms',
      caption:
        'Bald cypress, cabbage palm and tannin-dark water — the character of a Florida blackwater river above the tide line.',
      credit: 'Photo by Chase Baker / Unsplash',
    },
  },
  {
    id: 'other',
    title: 'On the map, not on the road',
    kicker: 'Destinations & unconfirmed sites',
    blurb:
      'Two categories worth knowing so you do not waste a Saturday: places you can only arrive at by water, and town projects where the launch is designed and permitted but the open date is not public. Call before you load the roof rack.',
  },
]

function Spec({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <>
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">{label}</dt>
      <dd className={`text-sm ${warn ? 'text-report-gold-badge' : 'text-slate-600'}`}>{value}</dd>
    </>
  )
}

function LaunchEntry({
  site,
  selected,
  onSelect,
  registerRef,
}: {
  site: LaunchSite
  selected: boolean
  onSelect: (id: string) => void
  registerRef: (id: string, el: HTMLElement | null) => void
}) {
  return (
    <article
      ref={(el) => registerRef(site.id, el)}
      id={`launch-${site.id}`}
      className={`scroll-mt-24 rounded-2xl border p-5 transition-colors sm:p-6 ${
        selected ? 'border-gold-400 bg-gold-50' : 'border-slate-200 bg-white'
      }`}
    >
      <div className="flex items-start gap-4">
        <span
          aria-hidden="true"
          className="mt-0.5 shrink-0 font-serif text-2xl font-semibold text-gold-600"
        >
          {String(site.n).padStart(2, '0')}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-xl font-semibold leading-snug text-navy-950">
            <button
              type="button"
              onClick={() => onSelect(site.id)}
              className="text-left hover:text-gold-600"
            >
              {site.name}
            </button>
          </h3>
          <p className="mt-1 text-xs uppercase tracking-wider text-slate-600">
            {site.address} · {site.operator}
          </p>

          <ul className="mt-3 flex flex-wrap gap-2" aria-label="Site at a glance">
            <li className="rounded-full border border-gold-200 bg-gold-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-gold-700">
              {KIND_LABEL[site.kind]}
            </li>
            {/* Opaque chips. A selected entry is tinted `bg-gold-50`, and both of
                these tones were tuned against white — on the tint brand-green-dark
                falls to 4.29:1 and report-gold-text to 4.48:1, under the AA floor.
                The border keeps the chip legible once the fill is white. */}
            <li
              className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${
                site.free
                  ? 'border-brand-green-dark/40 bg-white text-brand-green-dark'
                  : 'border-report-gold-dark/40 bg-white text-report-gold-badge'
              }`}
            >
              {site.free ? 'Free' : 'Paid entry'}
            </li>
            <li className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
              {SOURCING_LABEL[site.sourcing]}
            </li>
          </ul>

          <p className="mt-3 text-[15px] leading-relaxed text-slate-600">{site.description}</p>

          <div className="mt-4 border-l-4 border-gold-500 pl-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gold-600">
              Buyer’s angle
            </p>
            <p className="mt-1 text-[15px] leading-relaxed text-navy-900">{site.buyerAngle}</p>
          </div>

          <dl className="mt-4 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 border-t border-slate-100 pt-4">
            <Spec label="Water" value={site.water} />
            <Spec label="Launch" value={site.launch} />
            <Spec label="Parking" value={site.parking} />
            <Spec label="Hours" value={site.hours} />
            <Spec label="Conditions" value={site.conditions} warn />
            <Spec label="On site" value={site.onSite} />
            <Spec
              label="Position"
              value={`${site.lat.toFixed(5)}, ${site.lng.toFixed(5)}${
                site.coordsPublished ? '' : ' — derived from the mapped address'
              }`}
            />
          </dl>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${site.lat},${site.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-gold-600 underline underline-offset-4 hover:text-gold-700"
            >
              Directions
            </a>
            {site.sources.map((source) => (
              <a
                key={source.href}
                href={source.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 underline underline-offset-4 hover:text-gold-600"
              >
                {source.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}

export default function LaunchExplorer() {
  const [filter, setFilter] = useState<FilterId>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const entryRefs = useRef<Map<string, HTMLElement>>(new Map())

  const registerRef = useCallback((id: string, el: HTMLElement | null) => {
    if (el) entryRefs.current.set(id, el)
    else entryRefs.current.delete(id)
  }, [])

  const visibleIds = useMemo(
    () => launches.filter((site) => passes(site, filter)).map((site) => site.id),
    [filter]
  )

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id)
    const el = entryRefs.current.get(id)
    if (!el) return
    // Honour the OS setting here as well as in CSS — `scrollIntoView` is JS-driven
    // motion that the global `prefers-reduced-motion` rule cannot reach.
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' })
  }, [])

  const visible = useMemo(() => new Set(visibleIds), [visibleIds])

  return (
    <div className="space-y-8">
      <div>
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter launches">
          <span className="mr-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Show
          </span>
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
                filter === f.id
                  ? 'border-gold-500 bg-gold-500 text-white'
                  : 'border-slate-300 text-slate-600 hover:border-gold-400 hover:text-navy-900'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-card">
          <LaunchMap
            sites={launches}
            centre={MAP_CENTRE}
            zoom={MAP_ZOOM}
            visibleIds={visibleIds}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        </div>

        <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-600">
          <li>
            <span aria-hidden="true" className="mr-2 inline-block h-3 w-3 rounded-full bg-gold-500" />
            Hand launch — carry it in
          </li>
          <li>
            <span aria-hidden="true" className="mr-2 inline-block h-3 w-3 rounded-full bg-gold-700" />
            Concrete ramp plus paddle access
          </li>
          <li>
            <span
              aria-hidden="true"
              className="mr-2 inline-block h-3 w-3 rounded-full border-2 border-dashed border-brand-green-dark"
            />
            Reachable by water only
          </li>
          <li>
            <span
              aria-hidden="true"
              className="mr-2 inline-block h-3 w-3 rounded-full border-2 border-dashed border-report-gold-text"
            />
            Confirm before you drive
          </li>
        </ul>

        <p className="mt-3 max-w-3xl text-sm text-slate-500">
          Tap any pin to jump to its entry. {LAUNCH_DISCLAIMER}
        </p>
      </div>

      {GROUPS.map((group) => {
        const sites = launches.filter(
          (site) => site.group === group.id && visible.has(site.id)
        )
        if (sites.length === 0) return null
        return (
          <section key={group.id} className="space-y-4">
            <div className="border-b-2 border-navy-950 pb-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-600">
                {group.kicker}
              </p>
              <h2 className="mt-1 font-serif text-2xl font-semibold text-navy-950 sm:text-3xl">
                {group.title}
              </h2>
            </div>
            <p className="max-w-3xl text-[15px] leading-relaxed text-slate-600">{group.blurb}</p>
            {group.figure && (
              <figure className="max-w-3xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={group.figure.src}
                  alt={group.figure.alt}
                  width={1400}
                  height={1050}
                  loading="lazy"
                  className="w-full rounded-2xl border border-slate-200 object-cover shadow-card"
                />
                <figcaption className="mt-3 text-center text-sm italic leading-6 text-slate-600">
                  {group.figure.caption}
                  <span className="mt-1 block text-xs not-italic text-slate-600">
                    {group.figure.credit}
                  </span>
                </figcaption>
              </figure>
            )}
            <div className="space-y-4">
              {sites.map((site) => (
                <LaunchEntry
                  key={site.id}
                  site={site}
                  selected={site.id === selectedId}
                  onSelect={handleSelect}
                  registerRef={registerRef}
                />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
