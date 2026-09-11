'use client'

import { useMemo, useState } from 'react'
import { paddleCommunities } from '@/lib/paddle/communities'
import type { AccessTier, PaddleCommunity, RouteOut, Sourcing } from '@/lib/paddle/types'

/**
 * The communities table.
 *
 * A table rather than a card grid because the whole point of the page is
 * comparison: a buyer needs to see at a glance that two communities on the same
 * stretch of river offer completely different access. Detail lives in a row that
 * expands in place, so following one community never costs you your position in
 * the list.
 */

const TIER_LABEL: Record<AccessTier, string> = {
  racks: 'Racks',
  shared: 'Shared',
  lot: 'Per lot',
  slip: 'Slip',
}

/** Tier colours are semantic, not decorative — they encode how open the access is. */
const TIER_CLASS: Record<AccessTier, string> = {
  racks: 'border-brand-green-dark text-brand-green-dark',
  shared: 'border-gold-600 text-gold-700',
  lot: 'border-report-gold-dark text-report-gold-text',
  slip: 'border-slate-400 text-slate-600',
}

const ROUTE_LABEL: Record<RouteOut, string> = {
  open: 'Open',
  bridged: 'Bridged',
  lift: 'Lift',
  closed: 'Closed',
}

const ROUTE_CLASS: Record<RouteOut, string> = {
  open: 'border-brand-green-dark text-brand-green-dark',
  bridged: 'border-report-gold-dark text-report-gold-text',
  lift: 'border-gold-700 text-gold-700',
  closed: 'border-slate-400 text-slate-600',
}

const ROUTE_DETAIL: Record<RouteOut, string> = {
  open: 'Clear run to the inlet, no fixed bridges reported',
  bridged: 'Fixed bridges between here and open water',
  lift: 'Boats leave by travel lift, not under their own power',
  closed: 'No outlet',
}

const SOURCING_LABEL: Record<Sourcing, string> = {
  confirmed: 'Confirmed',
  corroborated: 'Corroborated',
  single: 'Single source',
}

const TIER_FILTERS: { id: AccessTier | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'racks', label: 'Kayak racks or launch' },
  { id: 'shared', label: 'Shared dock or ramp' },
  { id: 'lot', label: 'Waterfront lot only' },
  { id: 'slip', label: 'Marina slip' },
]

const AREA_FILTERS: { id: 'all' | 'north' | 'south'; label: string }[] = [
  { id: 'all', label: 'Everywhere' },
  { id: 'north', label: 'Jupiter & Tequesta' },
  { id: 'south', label: 'Gardens, Juno & NPB' },
]

/**
 * Badge.
 *
 * The white fill is load-bearing, not decoration. An open row is tinted
 * `bg-gold-50`, and the badge tones were tuned against white: on that tint
 * brand-green-dark drops to 4.29:1 and report-gold-text to 4.48:1, both under
 * the 4.5:1 AA floor. Painting the chip white keeps every tone on the
 * background it was measured against, whatever the row underneath is doing.
 */
function Badge({ label, className }: { label: string; className: string }) {
  return (
    <span
      className={`inline-block whitespace-nowrap border bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${className}`}
    >
      {label}
    </span>
  )
}

function DetailPanel({ community }: { community: PaddleCommunity }) {
  return (
    <div className="grid gap-6 py-2 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <div className="space-y-3">
        <blockquote className="border-l-4 border-gold-300 pl-4 font-serif text-lg italic leading-snug text-navy-900">
          “{community.quote}”
        </blockquote>
        <p className="text-[15px] leading-relaxed text-slate-600">{community.detail}</p>
        <p className="border-l-4 border-report-gold-dark pl-4 text-[15px] leading-relaxed text-navy-900">
          {community.flag}
        </p>
      </div>
      <dl className="grid h-fit grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2">
        <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
          Housing
        </dt>
        <dd className="text-sm text-slate-600">{community.housing}</dd>
        <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">Water</dt>
        <dd className="text-sm text-slate-600">{community.water}</dd>
        <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
          Route out
        </dt>
        <dd className="text-sm text-slate-600">{ROUTE_DETAIL[community.route]}</dd>
        <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
          Sourcing
        </dt>
        <dd className="text-sm text-slate-600">{SOURCING_LABEL[community.sourcing]}</dd>
        <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
          Sources
        </dt>
        <dd className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
          {community.sources.map((source) => (
            <a
              key={source.href}
              href={source.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-600 underline underline-offset-4 hover:text-gold-700"
            >
              {source.label}
            </a>
          ))}
        </dd>
      </dl>
    </div>
  )
}

export default function CommunityTable() {
  const [tier, setTier] = useState<AccessTier | 'all'>('all')
  const [area, setArea] = useState<'all' | 'north' | 'south'>('all')
  const [openId, setOpenId] = useState<string | null>(null)

  const rows = useMemo(
    () =>
      paddleCommunities.filter(
        (c) => (tier === 'all' || c.tier === tier) && (area === 'all' || c.area === area)
      ),
    [tier, area]
  )

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Access
        </span>
        {TIER_FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={tier === f.id}
            onClick={() => setTier(f.id)}
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
              tier === f.id
                ? 'border-gold-500 bg-gold-500 text-white'
                : 'border-slate-300 text-slate-600 hover:border-gold-400 hover:text-navy-900'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Area
        </span>
        {AREA_FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={area === f.id}
            onClick={() => setArea(f.id)}
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
              area === f.id
                ? 'border-gold-500 bg-gold-500 text-white'
                : 'border-slate-300 text-slate-600 hover:border-gold-400 hover:text-navy-900'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm text-slate-600" aria-live="polite">
        Showing {rows.length} of {paddleCommunities.length} communities. Select a row for the
        detail, the source’s own words, and what to verify.
      </p>

      {/* The table is wider than a phone. It scrolls inside its own container so
          the page body never scrolls sideways. */}
      <div className="mt-3 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-card">
        <table className="w-full min-w-[820px] border-collapse text-left">
          <caption className="sr-only">
            Communities with resident water access, by how open that access is
          </caption>
          <thead>
            <tr className="bg-slate-50">
              {['Community', 'Access', 'Open to', 'Water', 'Route out', 'Sourcing'].map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="whitespace-nowrap border-b border-slate-200 px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((community) => {
              const open = openId === community.id
              return [
                <tr key={community.id} className={open ? 'bg-gold-50' : undefined}>
                  <th scope="row" className="border-b border-slate-100 px-4 py-3 font-normal">
                    <button
                      type="button"
                      onClick={() => setOpenId(open ? null : community.id)}
                      aria-expanded={open}
                      aria-controls={`community-${community.id}`}
                      className="text-left"
                    >
                      <span className="block text-[15px] font-medium text-navy-950">
                        {community.name}
                      </span>
                      <span className="mt-0.5 block text-[11px] uppercase tracking-wider text-slate-600">
                        {community.town} · {open ? 'Hide detail' : 'Show detail'}
                      </span>
                    </button>
                  </th>
                  <td className="border-b border-slate-100 px-4 py-3">
                    <Badge label={TIER_LABEL[community.tier]} className={TIER_CLASS[community.tier]} />
                  </td>
                  <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-600">
                    {community.openTo}
                  </td>
                  <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-600">
                    {community.water}
                  </td>
                  <td className="border-b border-slate-100 px-4 py-3">
                    <Badge
                      label={ROUTE_LABEL[community.route]}
                      className={ROUTE_CLASS[community.route]}
                    />
                  </td>
                  <td className="border-b border-slate-100 px-4 py-3 text-[11px] uppercase tracking-wider text-slate-600">
                    {SOURCING_LABEL[community.sourcing]}
                  </td>
                </tr>,
                open ? (
                  <tr key={`${community.id}-detail`} id={`community-${community.id}`}>
                    <td colSpan={6} className="border-b border-slate-200 bg-gold-50 px-4 pb-6">
                      <DetailPanel community={community} />
                    </td>
                  </tr>
                ) : null,
              ]
            })}
          </tbody>
        </table>
      </div>

      <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-600">
        <li className="flex items-center gap-2">
          <Badge label="Racks" className={TIER_CLASS.racks} /> Kayak or SUP storage, or a
          purpose-built launch
        </li>
        <li className="flex items-center gap-2">
          <Badge label="Shared" className={TIER_CLASS.shared} /> A dock, ramp or shoreline any
          resident can use
        </li>
        <li className="flex items-center gap-2">
          <Badge label="Per lot" className={TIER_CLASS.lot} /> Docks belong to individual waterfront
          homes
        </li>
        <li className="flex items-center gap-2">
          <Badge label="Slip" className={TIER_CLASS.slip} /> Marina access is a separate purchase or
          lease
        </li>
      </ul>
    </div>
  )
}
