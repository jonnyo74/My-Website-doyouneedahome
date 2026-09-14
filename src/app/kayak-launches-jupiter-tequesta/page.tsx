import type { Metadata } from 'next'
import Breadcrumbs from '@/components/Breadcrumbs'
import LaunchExplorer from '@/components/paddle/LaunchExplorer'
import PaddleCrossLink from '@/components/paddle/PaddleCrossLink'
import { LAUNCH_DISCLAIMER, launches } from '@/lib/paddle/launches'

export const metadata: Metadata = {
  title: 'Public Kayak Launches in Jupiter & Tequesta | DO Homes Group',
  description:
    'Every public kayak, canoe and paddleboard launch on the Loxahatchee River, Jupiter Inlet and Intracoastal — with parking, fees, tide notes and what each one means if you are buying nearby.',
  alternates: { canonical: '/kayak-launches-jupiter-tequesta' },
  openGraph: {
    title: 'Public Kayak Launches in Jupiter & Tequesta',
    description:
      'Where you can actually drop a kayak on the Loxahatchee River system — mapped, rated for skill, and read through a homebuyer’s lens.',
  },
}

/**
 * Structured data for the launches.
 *
 * An ItemList of Places with coordinates, so the sites can surface in local
 * results on their own terms. Deliberately excludes Trapper Nelson and the
 * unconfirmed preserves — marking a water-access-only landing or a facility
 * that may not be open as a visitable Place would be telling search engines
 * something we have just spent the page saying is not true.
 */
function launchJsonLd() {
  const listed = launches.filter(
    (site) => site.kind !== 'water-only' && site.kind !== 'unconfirmed'
  )
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Public kayak launches in Jupiter and Tequesta, Florida',
    numberOfItems: listed.length,
    itemListElement: listed.map((site, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Place',
        name: site.name,
        description: site.launch,
        address: {
          '@type': 'PostalAddress',
          streetAddress: site.address,
          addressRegion: 'FL',
          addressCountry: 'US',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: site.lat,
          longitude: site.lng,
        },
        isAccessibleForFree: site.free,
      },
    })),
  }
}

export default function KayakLaunchesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Content is authored in this repo, not user input — there is nothing here
        // to escape beyond JSON encoding.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(launchJsonLd()) }}
      />

      <Breadcrumbs items={[{ label: 'Kayak launches', href: '/kayak-launches-jupiter-tequesta' }]} />

      <div className="mx-auto max-w-6xl px-6 pb-20 sm:px-8">
        <header className="border-b border-slate-200 pb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-600">
            Loxahatchee River · Jupiter Inlet · Intracoastal
          </p>
          <h1 className="mt-4 max-w-4xl font-serif text-4xl font-semibold leading-tight text-navy-950 sm:text-5xl">
            Where you can actually drop a kayak in Jupiter &amp; Tequesta
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
            Eleven public put-ins across the Wild &amp; Scenic Northwest Fork, the tidal river, the
            inlet and the Intracoastal — mapped, rated for skill, and read through the lens that
            matters when you are house hunting: how close is it to the front door.
          </p>
        </header>

        <dl className="grid gap-6 border-b border-slate-200 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { n: '8', l: 'Public launches you can drive to' },
            { n: '7', l: 'That cost nothing to use' },
            { n: '0', l: 'Owned by the Village of Tequesta' },
            { n: '8.5 mi', l: 'Designated paddling trail, Riverbend to Jonathan Dickinson' },
          ].map((stat) => (
            <div key={stat.l}>
              <dd className="font-serif text-3xl font-semibold text-navy-950">{stat.n}</dd>
              <dt className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {stat.l}
              </dt>
            </div>
          ))}
        </dl>

        <div className="py-10">
          <LaunchExplorer />
        </div>

        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
          <h2 className="font-serif text-2xl font-semibold text-navy-950">
            The Riverside Drive problem
          </h2>
          <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-slate-600">
            <p>
              Riverside Drive is the most beautiful stretch of road on this river and it has{' '}
              <strong className="text-navy-900">no public access of any kind</strong> — no park, no
              street-end, no right-of-way, no seawall steps, on either the Jupiter or the Tequesta
              side. Every parcel from Center Street north is private residential frontage. The
              bridges in that reach — Alt A1A, Tequesta Drive and the FEC rail crossing — have no
              shoulder parking and no legal shoreline access.
            </p>
            <p>
              Two names that circulate locally and should not:{' '}
              <strong className="text-navy-900">
                “Riverside Drive Park” is a subdivision, not a park
              </strong>{' '}
              — 195 homes, with no municipal facility of that name.{' '}
              <strong className="text-navy-900">
                Loxahatchee River Road is a private gated community
              </strong>{' '}
              of roughly 54 homes. And <strong className="text-navy-900">Cato’s Bridge</strong> is a
              roadside snorkelling spot on S. Beach Road near Coral Cove, nowhere near Riverside
              Drive and not a designated launch.
            </p>
            <p>
              Which makes the corridor a clean piece of buyer maths: on Riverside Drive, water
              access comes with the deed or it does not come at all. The nearest public put-in to
              the middle of it is <strong className="text-navy-900">Sawfish Bay Park</strong>,
              two-tenths of a mile north of Center Street on Alt A1A — under a mile from the Jupiter
              end, and a bridge crossing from the Tequesta end.
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
          <h2 className="font-serif text-2xl font-semibold text-navy-950">Before you drive out</h2>
          <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-slate-600">
            {[
              ['Jonathan Dickinson concessions are closed as of 2026.', 'No rentals, no Loxahatchee Queen tours, no River Store. Bring your own boat, or rent upriver at Riverbend.'],
              ['Trailer parking permits differ by park.', 'Palm Beach County publishes $15 a day at Burt Reynolds and $10 at Waterway Park. Car-top boats do not need one — confirm at the pay station.'],
              ['DuBois Park parking is free today,', 'but a beach-parking fee has been floated more than once by the County. Worth re-checking each season.'],
              ['Trapper Nelson’s operating days conflict between sources', '— the state park says Wednesday to Monday, the FDEP paddling guide says Thursday to Monday. Call the park before you commit to a seven-mile round trip.'],
              ['Sims Creek and Jones Creek launches are designed and permitted but not confirmed open.', 'Town of Jupiter Natural Resources: (561) 741-2565.'],
              ['“Cato’s Bridge” and Loxahatchee River Road appear in local chatter, not in any official inventory.', 'No agency publishes a sanctioned launch or legal parking at either. Treated here as unverified.'],
            ].map(([lead, rest]) => (
              <li key={lead} className="relative pl-6">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-2 h-2 w-2 rounded-full border-2 border-gold-500"
                />
                <strong className="text-navy-900">{lead}</strong> {rest}
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-10">
          <PaddleCrossLink to="communities" />
        </div>

        <p className="mt-10 border-t border-slate-200 pt-6 text-sm leading-relaxed text-slate-500">
          Compiled September 2026 from the Town of Jupiter, Palm Beach County Parks and
          Environmental Resources Management, the FDEP Loxahatchee River Paddling Guide, Florida
          State Parks, the Bureau of Land Management, the Village of Tequesta and the Jupiter Inlet
          District. {LAUNCH_DISCLAIMER}
        </p>
      </div>
    </>
  )
}
