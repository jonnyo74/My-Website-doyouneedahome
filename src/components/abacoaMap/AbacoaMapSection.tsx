import Link from 'next/link'
import AbacoaMapLazy from './AbacoaMapLazy'
import {
  COUNTY_PARCELS,
  COUNTY_ROADS,
  DAKOTA_VILLAGES,
  MAP_HEADINGS,
  MAP_LANDMARKS,
  MAP_VILLAGES,
  MASTER_PLAN_URL,
  POA_DIRECTORY_URL,
  getMapVillage,
  mapDescription,
  type MapView,
} from '@/lib/abacoaMap'

// The server-rendered half of every Abacoa map: heading, legend, the ordinary
// HTML links that still work if the interactive map never loads, and the
// sources. The map itself is the lazy client component.

const link = 'font-semibold text-gold-600 underline-offset-4 hover:text-gold-700 hover:underline'

function Swatch({ kind }: { kind: 'village' | 'unlinked' | 'landmark' | 'selected' | 'rental' | 'road' }) {
  const base = 'inline-block shrink-0 align-middle'
  switch (kind) {
    case 'village':
      return <span aria-hidden="true" className={`${base} h-4 w-8 rounded-full border-2 border-report-gold bg-white`} />
    case 'unlinked':
      return <span aria-hidden="true" className={`${base} h-4 w-8 rounded-full border-2 border-dashed border-slate-400 bg-slate-100`} />
    case 'landmark':
      return <span aria-hidden="true" className={`${base} h-4 w-8 rounded-sm bg-navy-950`} />
    case 'selected':
      return <span aria-hidden="true" className={`${base} h-4 w-8 rounded-full border-[3px] border-report-gold bg-navy-950`} />
    case 'rental':
      return <span aria-hidden="true" className={`${base} h-4 w-8 rounded-sm border-2 border-dashed border-orange-700 bg-orange-50`} />
    case 'road':
      return <span aria-hidden="true" className={`${base} h-1.5 w-8 rounded bg-amber-700`} />
  }
}

function Legend({ view }: { view: MapView }) {
  const items: [Parameters<typeof Swatch>[0]['kind'], string][] =
    view.view === 'village'
      ? [['selected', 'Selected village (dark label, star and thick outline)'], ['village', 'Other villages with a guide'], ['landmark', 'Landmark']]
      : view.view === 'dakota'
        ? [['road', 'Dakota Drive (county road centerline)'], ['village', 'Village the street passes or borders'], ['rental', 'Rental community, not for sale']]
        : [['village', 'Village with a guide (opens the guide)'], ['unlinked', 'Neighborhood with no guide yet'], ['landmark', 'Landmark']]
  return (
    <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-700" aria-label="Map key">
      {items.map(([k, text]) => (
        <li key={k} className="flex items-center gap-2">
          <Swatch kind={k} />
          {text}
        </li>
      ))}
    </ul>
  )
}

export default function AbacoaMapSection({
  view,
  id,
  intro,
}: {
  view: MapView
  /** Anchor id for the block, so another page can link straight to it. */
  id?: string
  intro?: string
}) {
  const selected = view.view === 'village' ? getMapVillage(view.slug) : undefined
  const heading =
    view.view === 'hub' ? MAP_HEADINGS.hub : view.view === 'dakota' ? MAP_HEADINGS.dakota : MAP_HEADINGS.village(selected?.name ?? 'this village')
  const headingId = `${id ?? 'abacoa-map'}-heading`
  const description = mapDescription(view)

  const guideLinks =
    view.view === 'dakota'
      ? MAP_VILLAGES.filter((v) => DAKOTA_VILLAGES.includes(v.slug))
      : MAP_VILLAGES.filter((v) => v.guide)

  const pinOnly = MAP_VILLAGES.filter((v) => v.pinNote && (view.view === 'hub' || selected?.slug === v.slug))

  return (
    <div id={id} className="scroll-mt-24" role="group" aria-labelledby={headingId}>
      <h3 id={headingId} className="font-serif text-2xl font-semibold text-slate-900">
        {heading}
      </h3>
      {intro && <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">{intro}</p>}

      <figure className="mt-4">
        <AbacoaMapLazy view={view} description={description} />
        <figcaption className="sr-only">{description}</figcaption>
        <Legend view={view} />
      </figure>

      {view.view === 'village' && (
        <p className="mt-3 text-sm">
          <Link href="/communities/abacoa#abacoa-map" className={link}>
            View all Abacoa villages →
          </Link>
        </p>
      )}

      {/* Ordinary links: the same destinations, available without the map. */}
      <nav aria-label={view.view === 'dakota' ? 'Villages along Dakota Drive' : 'Abacoa village guides'} className="mt-4">
        <p className="text-sm font-semibold text-slate-900">
          {view.view === 'dakota' ? 'Guides for the villages along Dakota Drive' : 'Village guides'}
        </p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {guideLinks.map((v) => (
            <li key={v.slug}>
              <Link
                href={`/communities/${v.slug}`}
                aria-current={selected?.slug === v.slug ? 'page' : undefined}
                className={`inline-flex rounded-full border px-4 py-1.5 text-sm font-semibold transition hover:border-report-gold hover:text-gold-600 ${
                  selected?.slug === v.slug ? 'border-slate-900 bg-slate-900 text-white hover:text-white' : 'border-slate-200 text-slate-800'
                }`}
              >
                {selected?.slug === v.slug ? `★ ${v.name}` : v.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <details className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
        <summary className="cursor-pointer font-semibold text-slate-900">Map sources</summary>
        <div className="mt-3 space-y-3 leading-6">
          <p>
            Village outlines are Palm Beach County Property Appraiser parcels filed under each village’s recorded
            plat, dissolved into one shape. Dakota Drive and the major roads are Palm Beach County Engineering road
            centerlines. Pins mark the centre of the county parcel at a published address, so they show where a place
            is, not where its entrance is. Outlines are for orientation. They do not show which association, school
            zone or taxing area an individual address is in, and map distance is not a walking time.
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li><a className={link} href={MASTER_PLAN_URL} target="_blank" rel="noopener noreferrer">Town of Jupiter: Abacoa master site plan</a></li>
            <li><a className={link} href={POA_DIRECTORY_URL} target="_blank" rel="noopener noreferrer">Abacoa POA neighborhood directory</a></li>
            <li><a className={link} href={COUNTY_PARCELS} target="_blank" rel="noopener noreferrer">Palm Beach County parcel layer (PARCEL_INFO)</a></li>
            <li><a className={link} href={COUNTY_ROADS} target="_blank" rel="noopener noreferrer">Palm Beach County road centerlines</a></li>
            <li><a className={link} href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">Basemap: OpenStreetMap contributors</a></li>
          </ul>
          {pinOnly.length > 0 && (
            <ul className="space-y-1">
              {pinOnly.map((v) => (
                <li key={v.slug}><span className="font-semibold">{v.name}:</span> {v.pinNote}</li>
              ))}
            </ul>
          )}
          {view.view !== 'dakota' && (
            <p>
              Landmark pins: {MAP_LANDMARKS.map((l) => l.name).join(', ')}.
            </p>
          )}
          {view.view === 'dakota' && (
            <p>
              Dakota at Abacoa is shown at the centre of the county plat named Dakota. The Abacoa POA gives its leasing
              office as 3334 S. Bismark Lane. Somerset condominiums also have Dakota Drive addresses in the MLS but have
              no guide yet.
            </p>
          )}
        </div>
      </details>
    </div>
  )
}
