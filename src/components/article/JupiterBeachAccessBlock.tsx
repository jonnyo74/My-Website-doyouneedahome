'use client'

import dynamic from 'next/dynamic'
import { useId, useState } from 'react'
import {
  ACCESS_POINTS,
  DOG_CORRIDOR,
  GUARDED_AREAS,
  LAYERS,
  MAP_CAPTION,
  MAP_HEADING,
  MAP_HEADING_ID,
  NUMBERING_NOTES,
  SOURCES,
  type LayerId,
} from '@/lib/jupiterBeachAccess'

/**
 * Page-scoped block for /blog/jupiter-beach-access-guide: layer toggles, the
 * map, the required caption, and a plain-text list of every point.
 *
 * Leaflet touches `window` at import time, so the map itself is client-only
 * (`ssr: false` is legal only inside a Client Component, which is why the
 * dynamic import sits here). The toggles and the list are ordinary markup and
 * do server-render, so a reader with no JavaScript, or a screen reader, gets
 * the same points as the map in a form they can use.
 *
 * The map and its loading placeholder share one height class so the space is
 * reserved before the chunk arrives: no layout shift when the map paints.
 */
const MAP_HEIGHT = 'h-[420px] sm:h-[520px]'

const JupiterBeachAccessMap = dynamic(() => import('./JupiterBeachAccessMap'), {
  ssr: false,
  loading: () => (
    <div aria-hidden="true" className={`${MAP_HEIGHT} w-full animate-pulse rounded-2xl bg-slate-200`} />
  ),
})

const ALL_ON: Record<LayerId, boolean> = { parks: true, ada: true, dogs: true, guarded: true }

function Swatch({ shape, color }: { shape: 'dot' | 'square' | 'ring' | 'line'; color: string }) {
  const base = 'inline-block shrink-0'
  if (shape === 'line') {
    return <span aria-hidden="true" className={`${base} h-1 w-5 rounded-full`} style={{ background: color }} />
  }
  if (shape === 'ring') {
    return (
      <span
        aria-hidden="true"
        className={`${base} h-3.5 w-3.5 rounded-full border-2`}
        style={{ borderColor: color, background: `${color}33` }}
      />
    )
  }
  return (
    <span
      aria-hidden="true"
      className={`${base} h-3.5 w-3.5 ${shape === 'square' ? 'rounded-sm' : 'rounded-full'}`}
      style={{ background: color }}
    />
  )
}

function OfficialLink({ href, label = 'Official page' }: { href: string; label?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded font-medium text-gold-600 underline decoration-gold-300 underline-offset-2 transition hover:text-gold-700"
    >
      {label}
    </a>
  )
}

export default function JupiterBeachAccessBlock() {
  const [visible, setVisible] = useState<Record<LayerId, boolean>>(ALL_ON)
  const legendId = useId()
  const listId = useId()

  const parks = ACCESS_POINTS.filter((p) => p.layer === 'parks')
  const ada = ACCESS_POINTS.filter((p) => p.layer === 'ada')
  const placed = (layer: LayerId) =>
    layer === 'dogs'
      ? 1
      : layer === 'guarded'
        ? GUARDED_AREAS.length
        : ACCESS_POINTS.filter((p) => p.layer === layer && p.position).length

  return (
    <section aria-labelledby={MAP_HEADING_ID} className="mt-12 scroll-mt-28">
      <h2 id={MAP_HEADING_ID} className="font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">
        {MAP_HEADING}
      </h2>
      <p className="mt-3 leading-7 text-slate-600">
        The parks and lots the Town and County name, the guarded swimming areas, and the dog corridor, on one map.
        Select a marker for the name, who runs it, the address and a link to its official page.
      </p>

      <fieldset className="mt-5" aria-describedby={legendId}>
        <legend className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Show on map</legend>
        <p id={legendId} className="sr-only">
          Each checkbox shows or hides one layer of the map. The list after the map does not change.
        </p>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
          {LAYERS.map((layer) => {
            const n = placed(layer.id)
            return (
              <label
                key={layer.id}
                className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded text-sm text-slate-700 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold-500"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-400 accent-gold-500"
                  checked={visible[layer.id]}
                  onChange={(e) => setVisible((v) => ({ ...v, [layer.id]: e.target.checked }))}
                  aria-label={`${layer.label}${n === 0 ? ', none placed on the map' : ''}`}
                />
                <Swatch shape={layer.shape} color={layer.swatch} />
                <span>
                  {layer.label}
                  {n === 0 && <span className="text-slate-500"> (none placed)</span>}
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <figure className="mt-4">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-card">
          <JupiterBeachAccessMap visible={visible} />
        </div>
        <figcaption className="mt-2 text-xs italic leading-5 text-slate-500 sm:text-sm sm:leading-6">
          {MAP_CAPTION}
        </figcaption>
      </figure>

      <details className="group mt-6 rounded-xl border border-slate-200">
        <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl px-5 py-3.5 text-sm font-semibold text-slate-900 marker:hidden">
          Every point on this map, as a list
          <span aria-hidden="true" className="text-slate-400 transition group-open:rotate-180">
            ▾
          </span>
        </summary>
        <div id={listId} className="border-t border-slate-200 px-5 pb-5 pt-3 text-sm leading-6 text-slate-600">
          <h3 className="mt-2 font-semibold text-slate-900">Parks and parking lots, south to north</h3>
          <ol className="mt-2 space-y-3">
            {parks.map((p) => (
              <li key={p.id}>
                <span className="font-medium text-slate-900">{p.name}</span>
                {' '}· {p.operator} · {p.address} · <OfficialLink href={p.href} />
                {p.note && <span className="block text-slate-500">{p.note}</span>}
              </li>
            ))}
          </ol>

          <h3 className="mt-6 font-semibold text-slate-900">ADA-accessible crossovers</h3>
          <p className="mt-1 text-slate-500">
            Per the Town&apos;s <OfficialLink href={SOURCES.townBeaches} label="Beaches page" /> and{' '}
            <OfficialLink href={SOURCES.townCrossovers} label="Dune Crossover Information" />. Not drawn on the map:
            no source read for this map places an individual crossover. Use the Town&apos;s{' '}
            <OfficialLink href={SOURCES.townMap} label="Jupiter Area Beaches map" /> for their locations.
          </p>
          <ul className="mt-2 space-y-2">
            {ada.map((p) => (
              <li key={p.id}>
                <span className="font-medium text-slate-900">{p.name}</span> · {p.operator}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-slate-500">{NUMBERING_NOTES}</p>

          <h3 className="mt-6 font-semibold text-slate-900">Dog-friendly corridor</h3>
          <p className="mt-1">
            <span className="font-medium text-slate-900">{DOG_CORRIDOR.name}</span> · {DOG_CORRIDOR.operator} ·{' '}
            {DOG_CORRIDOR.from} north to {DOG_CORRIDOR.to.toLowerCase()} · <OfficialLink href={DOG_CORRIDOR.href} />
          </p>

          <h3 className="mt-6 font-semibold text-slate-900">Guarded swimming areas</h3>
          <ul className="mt-2 space-y-2">
            {GUARDED_AREAS.map((g) => (
              <li key={g.id}>
                <span className="font-medium text-slate-900">{g.name}</span> · {g.operator} ·{' '}
                <OfficialLink href={g.href} />
                {g.note && <span className="block text-slate-500">{g.note}</span>}
              </li>
            ))}
          </ul>
        </div>
      </details>
    </section>
  )
}
