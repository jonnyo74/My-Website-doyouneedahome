import Link from 'next/link'
import YlopoInit from '@/components/YlopoInit'
import AdmiralsCoveListings from '@/components/AdmiralsCoveListings'
import ClubInquiry from '@/components/clubCommunity/ClubInquiry'
import ClubMembershipCta from '@/components/clubCommunity/ClubMembershipCta'
import ClubQuickFacts from '@/components/clubCommunity/ClubQuickFacts'
import InquiryLink from '@/components/clubCommunity/InquiryLink'
import ScrollTable from '@/components/clubCommunity/ScrollTable'
import ReviewedBy from '@/components/clubCommunity/ReviewedBy'
import SoldListings from '@/components/clubCommunity/SoldListings'
import SourceRegister from '@/components/clubCommunity/SourceRegister'
import {
  INQUIRY_ID,
  btnGhostDark,
  btnOutline,
  btnPrimary,
  card,
  eyebrow,
  h2,
  h3,
  lead,
  section,
  summaryCls,
  td,
  textLink,
  th,
  wrap,
} from '@/components/clubCommunity/ui'
import { scopeSearch } from '@/lib/abacoaScopes'
import {
  ADMIRALS_COVE_SCOPE,
  ADMIRALS_LEAD_CTA,
  EAST_SIDE_SCOPE,
  GOLF_VILLAGE_SCOPE,
  PRICE_BANDS,
  admiralsSearchUrl,
  admiralsSoldSearchUrl,
  soldSearch,
} from '@/lib/admiralsCoveScope'
import {
  AMENITIES,
  BOAT_CHECKLIST,
  BRIDGES,
  COMPARE,
  COSTS,
  COUNTS,
  DOCK_RULES,
  DUE_DILIGENCE,
  FAQS,
  MAP_DESCRIPTION,
  MEMBERSHIP_QUESTIONS,
  MEMBERSHIP_STRUCTURE,
  NOT_VERIFIED,
  QUICK_FACTS,
  REVIEWED,
  SIDES,
  SOURCES,
  URLS,
} from '@/lib/admiralsCove'
import { SITE_URL } from '@/lib/site'

// The Admirals Cove page, and the pattern for every club community after it.
// Facts read lib/admiralsCove, listing surfaces read lib/admiralsCoveScope, and
// the blocks under components/clubCommunity are community-agnostic. Section
// order is the buyer's path: what it is, what is for sale, how it is laid out,
// what the club costs and requires, the boat, the golf, what has sold, what to
// check, what else to compare, then one form.

const NAME = 'Admirals Cove'
const PAGE = `${SITE_URL}/communities/admirals-cove`
const ext = { target: '_blank', rel: 'noopener noreferrer' } as const

const JUMP: [string, string][] = [
  ['#listings', 'Homes for sale'],
  ['#layout', 'East Side vs Golf Village'],
  ['#membership', 'Membership'],
  ['#costs', 'Cost of ownership'],
  ['#boating', 'Boating'],
  ['#golf', 'Golf and club'],
  ['#sales', 'Recent sales'],
  ['#due-diligence', 'Before you buy'],
  ['#faqs', 'FAQs'],
]

// John Oliver's own photographs. Captions say only what the frame shows.
const PHOTO_DIR = '/images/admirals-cove'
const PHOTOS: Record<'arrival' | 'clubhouse', { src: string; alt: string; caption: string }[]> = {
  arrival: [
    {
      src: `${PHOTO_DIR}/entrance-sign.jpg`,
      alt: 'A low stone wall lettered “Admirals Cove” behind clipped hedges, with palms and oaks above it',
      caption: 'The Admirals Cove entrance sign.',
    },
    {
      src: `${PHOTO_DIR}/royal-palms.jpg`,
      alt: 'A double row of tall royal palms against a blue sky with white clouds',
      caption: 'Royal palms line the drive.',
    },
  ],
  clubhouse: [
    {
      src: `${PHOTO_DIR}/clubhouse-lobby.jpg`,
      alt: 'A clubhouse lobby with blue armchairs, a polished stone floor, a large arrangement of white orchids and glass doors to a covered entrance',
      caption: 'The lobby of the main clubhouse.',
    },
    {
      src: `${PHOTO_DIR}/clubhouse-chandelier.jpg`,
      alt: 'A chandelier of hundreds of small gold pieces suspended on wires through a double-height lobby',
      caption: 'The chandelier above the lobby.',
    },
    {
      src: `${PHOTO_DIR}/clubhouse-bar.jpg`,
      alt: 'A bar with walnut panelling, a backlit stone panel and glass shelves of bottles, with windows onto palms and water behind',
      caption: 'One of the clubhouse bars.',
    },
  ],
}

function Photo({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <figure>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        width={1600}
        height={1067}
        loading="lazy"
        decoding="async"
        className="aspect-[3/2] w-full rounded-2xl object-cover"
      />
      <figcaption className="mt-2 text-xs leading-5 text-slate-500">{caption} Photo: John Oliver.</figcaption>
    </figure>
  )
}

const bullet = <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-report-gold" aria-hidden="true" />

/** The eight facts a buyer wants first. The full sourced table sits in a panel below them. */
const GLANCE: { label: string; value: string }[] = [
  { label: 'Where', value: 'Town of Jupiter · ZIP 33477 (East Side) and 33458 (Golf Village)' },
  { label: 'Homes', value: `About 890: houses, townhomes and ${COUNTS.eastCondos} condominiums` },
  { label: 'On the water', value: `${COUNTS.waterLots.eastHouses} East Side house lots back onto the canals or Intracoastal` },
  { label: 'Golf', value: '45 holes: the East Course and three Golf Village nines' },
  { label: 'Marina', value: 'Private club marina for vessels up to 165 feet' },
  { label: 'The club', value: 'Member-owned equity club since 1999' },
  { label: 'Security', value: 'Gated, 24-hour security and a marine patrol' },
  { label: 'Associations', value: 'Master POA, Golf Village POA and four condominium associations' },
]

export default function AdmiralsCoveLanding() {
  const allUrl = admiralsSearchUrl()

  const ld = (o: unknown) => ({ __html: JSON.stringify(o).replace(/</g, '\\u003c') })
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      ['Home', `${SITE_URL}/`],
      ['Communities', `${SITE_URL}/communities`],
      ['Jupiter', `${SITE_URL}/communities/jupiter`],
      [NAME, PAGE],
    ].map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })),
  }
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }
  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': PAGE,
    url: PAGE,
    name: 'Admirals Cove, Jupiter, Florida: homes, membership, golf and marina',
    dateModified: REVIEWED.factsIso,
    about: {
      '@type': 'Place',
      name: NAME,
      address: { '@type': 'PostalAddress', addressLocality: 'Jupiter', addressRegion: 'FL', postalCode: '33477', addressCountry: 'US' },
    },
    author: [
      { '@type': 'Person', name: 'John Oliver', jobTitle: 'REALTOR®', url: `${SITE_URL}/team` },
      { '@type': 'Person', name: 'Christine Dekant', jobTitle: 'REALTOR®', url: `${SITE_URL}/team` },
    ],
    publisher: { '@type': 'RealEstateAgent', name: 'DO Homes Group', url: SITE_URL },
  }

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={ld(breadcrumbSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={ld(pageSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={ld(faqSchema)} />

      {/* Hero. John Oliver's own photograph of the entrance, taken from the
          public road. The overlay keeps the white text at AA contrast. */}
      <section className="relative isolate overflow-hidden bg-navy-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/admirals-cove/entrance.jpg"
          alt=""
          width={1600}
          height={1067}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[center_45%]"
        />
        {/* Phones get an even tint (the text runs full width); wider screens fade to the photo on the right. */}
        <div className="absolute inset-0 -z-10 bg-navy-950/85 sm:hidden" aria-hidden="true" />
        <div className="absolute inset-0 -z-10 hidden bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/30 sm:block" aria-hidden="true" />
        <div className={`${wrap} w-full px-6 pb-12 pt-12 sm:px-8 sm:pt-16`}>
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-white/85">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/communities" className="hover:text-white">Communities</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/communities/jupiter" className="hover:text-white">Jupiter</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-white">{NAME}</li>
            </ol>
          </nav>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-report-gold-light">
            Jupiter, Florida · Country club, golf and marina community
          </p>
          <h1 className="mt-3 max-w-4xl font-serif text-4xl font-semibold leading-[1.08] text-white sm:text-6xl">
            Admirals Cove Homes for Sale
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/90">
            Admirals Cove is a gated club community of about 890 homes in
            the Town of Jupiter, in two parts. The East Side runs to the Intracoastal Waterway, with canals
            behind most of its houses, the main clubhouse and a private marina. Golf Village, across Alternate
            A1A, is houses and townhomes around 27 holes. The club has 45 holes in all and has been owned by
            its members since 1999.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <a href="#listings" className={btnPrimary}>See Admirals Cove homes for sale</a>
            <InquiryLink type="membership-fees" className={btnGhostDark} />
          </div>
          <nav aria-label="On this page" className="mt-10 border-t border-white/15 pt-5">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/85">
              {JUMP.map(([href, label]) => (
                <li key={href}>
                  <a href={href} className="underline-offset-4 hover:text-white hover:underline">{label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {/* Overview and quick facts */}
      <section className={section} aria-labelledby="ac-overview">
        <div className={wrap}>
          <p className={eyebrow}>Overview</p>
          <h2 id="ac-overview" className={h2}>What sets Admirals Cove apart</h2>
          <div className="mt-4 max-w-3xl space-y-5 leading-8 text-slate-600">
            <p>
              Few communities in Palm Beach County put a boat behind the house, 45 holes of golf and a full club
              inside one set of gates. In Admirals Cove,{' '}
              <strong className="text-slate-900">
                {COUNTS.waterLots.eastHouses} of the {COUNTS.waterLots.eastHousesTotal} house lots on the East Side
                back onto the canals or the Intracoastal
              </strong>
              , and the run to the ocean passes two drawbridges and no fixed bridge.
            </p>
            <p>
              It is two communities with one club. The East Side has the water, the marina and the main clubhouse.
              Golf Village, across Alternate A1A, has three nine-hole courses, its own clubhouse and no boat access.
              The club has been member-owned since 1999.
            </p>
          </div>

          <h3 className={`mt-10 ${h3}`}>At a glance</h3>
          <dl className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
            {GLANCE.map((g) => (
              <div key={g.label} className="border-l-2 border-report-gold pl-4">
                <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">{g.label}</dt>
                <dd className="mt-1 text-sm leading-6 text-slate-900">{g.value}</dd>
              </div>
            ))}
          </dl>
          <details className="group mt-6">
            <summary className={summaryCls}>All quick facts, with sources</summary>
            <div className="mt-4">
              {/* Sources are named but not linked here: outbound links to the club,
                  which runs its own brokerage, live only in the sources section. */}
              <ClubQuickFacts facts={QUICK_FACTS.map(({ label, value, source }) => ({ label, value, source }))} caption="Admirals Cove quick facts, each with its source" />
            </div>
          </details>
        </div>
      </section>

      {/* Scoped listings */}
      <section id="listings" className={`scroll-mt-24 bg-slate-50 ${section}`} aria-labelledby="ac-listings">
        <div className={wrap}>
          <p className={eyebrow}>Live MLS feed · Admirals Cove only</p>
          <h2 id="ac-listings" className={h2}>Homes for sale in Admirals Cove</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            Active listings inside the gates only, East Side and Golf Village, at any price. Some homes are
            entered in more than one MLS and can appear twice; that is the feed, not two homes.
          </p>
          <a href={allUrl} {...ext} className={`mt-3 inline-block text-sm ${textLink}`}>
            Open all Admirals Cove homes in the full search →
          </a>
          <div className="mt-6">
            <YlopoInit city="Admirals Cove" />
            <AdmiralsCoveListings>
              <div
                className="YLOPO_resultsWidget overflow-hidden rounded-2xl"
                data-search={JSON.stringify(scopeSearch(ADMIRALS_COVE_SCOPE))}
              />
            </AdmiralsCoveListings>
          </div>

          <h3 className={`mt-12 ${h3}`}>Search by area or home type</h3>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { t: 'East Side', d: 'The side with the canals, the marina and the main clubhouse.', u: admiralsSearchUrl(EAST_SIDE_SCOPE) },
              { t: 'Golf Village', d: 'Houses and townhomes west of Alternate A1A.', u: admiralsSearchUrl(GOLF_VILLAGE_SCOPE) },
              { t: 'Condominiums', d: 'Captains Way, Waterside, Spyglass and Nautical Way.', u: admiralsSearchUrl(ADMIRALS_COVE_SCOPE, { propertyTypes: ['condo'] }) },
              { t: 'Single-family houses', d: 'Both sides of Admirals Cove.', u: admiralsSearchUrl(ADMIRALS_COVE_SCOPE, { propertyTypes: ['house'] }) },
            ].map((x) => (
              <li key={x.t} className={`flex flex-col ${card}`}>
                <p className="font-semibold text-slate-900">{x.t}</p>
                <p className="mt-1.5 flex-1 text-sm leading-6 text-slate-600">{x.d}</p>
                <a href={x.u} {...ext} className={`mt-3 text-sm ${textLink}`} aria-label={`Search ${x.t} homes in Admirals Cove`}>
                  Search {x.t.toLowerCase().replace('east side', 'East Side').replace('golf village', 'Golf Village')} →
                </a>
              </li>
            ))}
          </ul>

          <h3 className={`mt-12 ${h3}`}>Search by price</h3>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
            Each band opens the full search for Admirals Cove only.
          </p>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {PRICE_BANDS.map((b) => (
              <li key={b.label}>
                <a
                  href={admiralsSearchUrl(ADMIRALS_COVE_SCOPE, b.filter)}
                  {...ext}
                  className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition hover:border-report-gold-dark"
                >
                  <span className="font-serif text-lg font-semibold text-slate-900">{b.label}</span>
                  <span className="mt-3 text-sm font-semibold text-gold-600">Search →</span>
                </a>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-sm leading-7 text-slate-600">
            Looking for a dock that fits your boat, or a home on the golf course? The search filters cannot tell
            those apart reliably, so we check each listing by hand.{' '}
            <InquiryLink type="boat-fit" className={textLink}>Waterfront homes for your boat →</InquiryLink>{' '}
            <InquiryLink type="listing-alerts" className={textLink}>Golf-front homes →</InquiryLink>
          </p>
        </div>
      </section>

      {/* Layout: map and the two sides */}
      <section id="layout" className={`scroll-mt-24 ${section}`} aria-labelledby="ac-layout">
        <div className={wrap}>
          <p className={eyebrow}>Layout</p>
          <h2 id="ac-layout" className={h2}>East Side vs. Golf Village</h2>
          <p className={lead}>
            Alternate A1A and the railway beside it split Admirals Cove in two. The East Side holds{' '}
            {COUNTS.east} residences and everything on the water. Golf Village holds {COUNTS.golfVillage}. They
            share one club and little else: different associations, different home types and different
            prices.
          </p>

          <figure className="mt-8">
            {/* On a phone the map keeps a readable size and scrolls sideways. */}
            <div
              role="region"
              aria-label="Map of Admirals Cove. Scrolls sideways on small screens."
              // A scrollable region must be keyboard-focusable (WCAG 2.1.1).
              // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
              tabIndex={0}
              className="overflow-x-auto rounded-2xl border border-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-report-gold-dark"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/admirals-cove/admirals-cove-map.svg"
                alt="Map of Admirals Cove showing East Side homes between Alternate A1A and the Intracoastal Waterway, Golf Village homes west of Alternate A1A, the canals, the golf courses, the main clubhouse, the marina and the Golf Village clubhouse"
                width={1000}
                height={792}
                loading="lazy"
                decoding="async"
                className="h-auto w-full min-w-[720px]"
              />
            </div>
            <p className="mt-2 text-xs text-slate-500 md:hidden">Swipe the map sideways to see the Intracoastal side.</p>
            <figcaption className="mt-3 text-xs leading-6 text-slate-500">
              Drawn from Palm Beach County parcel, water and road data ({REVIEWED.records}). Boundaries are
              approximate, not a survey.
            </figcaption>
            <p className="sr-only">{MAP_DESCRIPTION}</p>
          </figure>

          <ScrollTable label="East Side and Golf Village compared" className="mt-10">
            <table className="w-full min-w-[44rem]">
              <caption className="sr-only">East Side and Golf Village at Admirals Cove compared</caption>
              <thead className="bg-slate-100">
                <tr>
                  <td className={th} />
                  <th scope="col" className={th}>East Side</th>
                  <th scope="col" className={th}>Golf Village</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {SIDES.map((r) => (
                  <tr key={r.row}>
                    <th scope="row" className={`${td} w-48 text-left font-semibold text-slate-900`}>{r.row}</th>
                    <td className={td}>{r.east}</td>
                    <td className={td}>{r.golfVillage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollTable>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <a href={admiralsSearchUrl(EAST_SIDE_SCOPE)} {...ext} className={btnOutline}>Explore East Side Homes</a>
            <a href={admiralsSearchUrl(GOLF_VILLAGE_SCOPE)} {...ext} className={btnOutline}>Explore Golf Village Homes</a>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {PHOTOS.arrival.map((p) => (
              <Photo key={p.src} {...p} />
            ))}
          </div>
        </div>
      </section>

      {/* Membership */}
      <section id="membership" className={`scroll-mt-24 bg-slate-50 ${section}`} aria-labelledby="ac-membership">
        <div className={wrap}>
          <p className={eyebrow}>The club</p>
          <h2 id="ac-membership" className={h2}>How Admirals Cove membership works</h2>
          <p className={lead}>
            The Club at Admirals Cove is a member-owned equity club, separate from the property owners
            associations. Brokerages and listings describe membership as required with a purchase; the club’s
            public pages do not state the rule. Get the club’s written answer for the specific home, and its
            current fee schedule, <strong className="text-slate-900">before you sign a contract</strong>.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {MEMBERSHIP_STRUCTURE.slice(0, 4).map((m) => (
              <div key={m.title} className={card}>
                <h3 className="font-semibold text-slate-900">{m.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{m.body}</p>
              </div>
            ))}
          </div>
          <details className="group mt-6">
            <summary className={summaryCls}>Eight questions for the membership office</summary>
            <ol className="mt-4 max-w-3xl list-decimal space-y-2 pl-5 text-sm leading-7 text-slate-700">
              {MEMBERSHIP_QUESTIONS.map((q) => <li key={q}>{q}</li>)}
            </ol>
          </details>

          <div className="mt-10">
            <ClubMembershipCta community={NAME} slug="admirals-cove" />
          </div>
        </div>
      </section>

      {/* Cost of ownership */}
      <section id="costs" className={`scroll-mt-24 ${section}`} aria-labelledby="ac-costs">
        <div className={wrap}>
          <p className={eyebrow}>Buyer guide</p>
          <h2 id="ac-costs" className={h2}>The total cost of owning in Admirals Cove</h2>
          <p className={lead}>
            Two homes at the same price can cost very different amounts to own. A canal-front house carries a
            seawall, a dock and more insurance; a condominium adds a third association; golf and social
            memberships are priced far apart.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {COSTS.map((g) => (
              <div key={g.group} className={card}>
                <h3 className="font-semibold text-slate-900">{g.group}</h3>
                <ul className="mt-3 space-y-1.5 text-sm leading-6 text-slate-600">
                  {g.items.map((i) => <li key={i.name}>{i.name}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-3xl leading-8 text-slate-600">
            <strong className="text-slate-900">The seller’s tax bill is not yours.</strong> Florida caps how fast
            an owner’s assessed value can rise, and a sale resets it to market value the next January 1. Use the
            purchase price, not the current bill, and apply for the Homestead exemption by March 1 if it will be
            your permanent home.{' '}
            <a href={URLS.papaHomestead} {...ext} className={textLink}>Homestead, Palm Beach County ↗</a>
          </p>
          <InquiryLink type="ownership-costs" className={`mt-6 ${btnPrimary}`} />
        </div>
      </section>

      {/* Boating */}
      <section id="boating" className={`scroll-mt-24 bg-slate-50 ${section}`} aria-labelledby="ac-boating">
        <div className={wrap}>
          <p className={eyebrow}>On the water</p>
          <h2 id="ac-boating" className={h2}>Boating, docks and the marina</h2>
          <p className={lead}>
            Canals open off the Intracoastal Waterway and branch through the East Side. Whether a home suits your
            boat comes down to the lot, the dock, the depth and the bridges.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="min-w-0">
              <h3 className={h3}>The route to the ocean</h3>
              <p className="mt-4 leading-8 text-slate-600">
                North on the Intracoastal, under the Indiantown Road bridge, east under the US-1 bridge and out
                through Jupiter Inlet: two drawbridges, no fixed bridge. NOAA calls the inlet hazardous for small
                boats and advises local knowledge, worst on an ebb tide against an east wind. Lake Worth Inlet,
                to the south, is the deep-water alternative.
              </p>
            </div>
            <div className="min-w-0">
              <h3 className={h3}>Bridges between Admirals Cove and Jupiter Inlet</h3>
              <ScrollTable label="Bridges between Admirals Cove and Jupiter Inlet" className="mt-4">
                <table className="w-full min-w-[30rem]">
                  <caption className="sr-only">Bridges on the route from Admirals Cove to Jupiter Inlet</caption>
                  <thead className="bg-slate-100">
                    <tr>
                      <th scope="col" className={th}>Bridge</th>
                      <th scope="col" className={th}>Clearance closed</th>
                      <th scope="col" className={th}>Opens</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {BRIDGES.map((b) => (
                      <tr key={b.name}>
                        <th scope="row" className={`${td} text-left`}>
                          <span className="font-semibold text-slate-900">{b.name}</span>
                          <span className="mt-1 block text-xs font-normal text-slate-600">{b.type}. {b.where}.</span>
                        </th>
                        <td className={td}>{b.clearance}</td>
                        <td className={td}>{b.opens}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollTable>
              <p className="mt-3 text-xs leading-6 text-slate-500">
                Sources: <a href={URLS.coastPilotIcw} {...ext} className="underline">NOAA Coast Pilot 4, chapter 12</a>;{' '}
                <a href={URLS.bridgeRule} {...ext} className="underline">33 CFR 117.261</a>;{' '}
                <a href={URLS.fdotBridge} {...ext} className="underline">Florida DOT</a>. Clearances are at the center
                of the span at mean high water and schedules change. Confirm with the bridge tender on VHF 9.
              </p>
            </div>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <div className={card}>
              <h3 className="font-serif text-xl font-semibold text-slate-900">A dock behind the house</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                The master association sets the boat length each lot may keep:
              </p>
              <ul className="mt-3 space-y-2.5 text-sm leading-6 text-slate-700">
                {DOCK_RULES.slice(0, 4).map((r) => <li key={r} className="flex gap-3">{bullet}<span>{r}</span></li>)}
              </ul>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                The association’s map marks canal depths of 4 to 8 feet. The owner maintains the dock.{' '}
                <a href={URLS.mpoaDocks} {...ext} className={textLink}>Dock rules ↗</a>
              </p>
            </div>
            <div className={card}>
              <h3 className="font-serif text-xl font-semibold text-slate-900">The club marina</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                The club says its marina takes vessels up to 165 feet, with annual, seasonal and transient
                dockage. It publishes no slip count, and other sites disagree, so confirm fit, power and
                availability with the marina office before you count on a slip.
              </p>
              <InquiryLink type="boat-fit" className={`mt-4 inline-block text-sm ${textLink}`}>
                Ask us about marina dockage →
              </InquiryLink>
            </div>
          </div>

          <details className="group mt-8">
            <summary className={summaryCls}>Boating buyer’s checklist</summary>
            <dl className="mt-5 grid gap-x-8 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
              {BOAT_CHECKLIST.map((c) => (
                <div key={c.item} className="border-l-2 border-report-gold pl-4">
                  <dt className="text-sm font-semibold text-slate-900">{c.item}</dt>
                  <dd className="text-sm leading-6 text-slate-600">{c.why}</dd>
                </div>
              ))}
            </dl>
          </details>
          <div className="mt-8 rounded-3xl bg-white p-7 shadow-card sm:flex sm:items-center sm:justify-between sm:gap-8">
            <p className="max-w-2xl text-sm leading-7 text-slate-700">
              No search filter can tell you whether your boat fits a dock. Send us the length, beam, draft and
              height, and we will go through the listings by hand and tell you which ones are worth a visit.
            </p>
            <InquiryLink type="boat-fit" className={`mt-5 flex-shrink-0 sm:mt-0 ${btnPrimary}`} />
          </div>
        </div>
      </section>

      {/* Golf and club amenities */}
      <section id="golf" className={`scroll-mt-24 ${section}`} aria-labelledby="ac-golf">
        <div className={wrap}>
          <p className={eyebrow}>The club</p>
          <h2 id="ac-golf" className={h2}>Golf and club amenities</h2>
          <p className={lead}>
            Forty-five holes, a marina, a hotel for your guests and a racquets program. Which of these your
            membership category includes is for the club to confirm.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {AMENITIES.map((a) => (
              <div key={a.title} className={card}>
                <h3 className="font-semibold text-slate-900">{a.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{a.body}</p>
              </div>
            ))}
          </div>
          <h3 className={`mt-12 ${h3}`}>Inside the main clubhouse</h3>
          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            {PHOTOS.clubhouse.map((p) => (
              <Photo key={p.src} {...p} />
            ))}
          </div>
          <p className="mt-6 text-sm text-slate-600">
            <InquiryLink type="club-options" className={textLink}>Talk through the club with us →</InquiryLink>
          </p>
        </div>
      </section>

      {/* Recently sold: a live MLS widget, so it never goes stale */}
      <section id="sales" className={`scroll-mt-24 bg-slate-50 ${section}`} aria-labelledby="ac-sales">
        <div className={wrap}>
          <p className={eyebrow}>Live MLS feed · Recently sold</p>
          <h2 id="ac-sales" className={h2}>Recently sold in Admirals Cove</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            The most recent closed sales inside the gates, East Side and Golf Village, newest first. This list
            updates itself from the MLS as homes close.
          </p>
          <a href={admiralsSoldSearchUrl()} {...ext} className={`mt-3 inline-block text-sm ${textLink}`}>
            See every Admirals Cove sale in the full search →
          </a>
          <div className="mt-6">
            {/* Our own cards: the Ylopo widget shows the list price on sold homes. */}
            <SoldListings search={soldSearch(12)} count={6} community={NAME} fullSearchUrl={admiralsSoldSearchUrl()} />
          </div>
          <div className="mt-8 rounded-3xl bg-white p-7 shadow-card sm:flex sm:items-center sm:justify-between sm:gap-8">
            <p className="max-w-2xl text-sm leading-7 text-slate-700">
              A sale price says nothing about condition, whether the house was bought to be rebuilt, or what the
              buyer paid the club. We will walk you through the sales on the streets you are considering.
            </p>
            <InquiryLink type="private-showing" className={`mt-5 flex-shrink-0 sm:mt-0 ${btnPrimary}`}>
              Ask for a sales review
            </InquiryLink>
          </div>
        </div>
      </section>

      {/* Due diligence */}
      <section id="due-diligence" className={`scroll-mt-24 ${section}`} aria-labelledby="ac-dd">
        <div className={wrap}>
          <p className={eyebrow}>Before you buy</p>
          <h2 id="ac-dd" className={h2}>What to verify for any Admirals Cove address</h2>
          <p className={lead}>
            Check each of these for the specific home, with your attorney, inspector, marine contractor and
            insurance agent. Tap one to open it.
          </p>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {DUE_DILIGENCE.map((d) => (
              <details key={d.title} className="group rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                <summary className="cursor-pointer list-none font-semibold text-slate-900 marker:hidden [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {d.title}
                    <span aria-hidden="true" className="text-report-gold-text transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-7 text-slate-600">{d.body}</p>
                {d.link && (
                  <a href={d.link.url} {...ext} className={`mt-2 inline-block text-sm ${textLink}`}>
                    {d.link.label} ↗
                  </a>
                )}
              </details>
            ))}
          </div>
          <p className="mt-6 text-sm leading-7 text-slate-600">
            Schools follow the address and can change. Look up any address with the School District of Palm
            Beach County’s <a href={URLS.schoolFinder} {...ext} className={textLink}>Find My School tool ↗</a>.
          </p>
        </div>
      </section>

      {/* Compare */}
      <section className={`bg-slate-50 ${section}`} aria-labelledby="ac-compare">
        <div className={wrap}>
          <p className={eyebrow}>Compare</p>
          <h2 id="ac-compare" className={h2}>If Admirals Cove is on your list, look at these too</h2>
          <ScrollTable label="Admirals Cove compared with nearby communities" className="mt-8">
            <table className="w-full min-w-[52rem]">
              <caption className="sr-only">Admirals Cove compared with nearby club and waterfront communities</caption>
              <thead className="bg-slate-100">
                <tr>
                  <th scope="col" className={th}>Community</th>
                  <th scope="col" className={th}>Golf</th>
                  <th scope="col" className={th}>Boating</th>
                  <th scope="col" className={th}>Homes</th>
                  <th scope="col" className={th}>How it differs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="bg-report-gold/10">
                  <th scope="row" className={`${td} text-left font-semibold text-slate-900`}>
                    Admirals Cove
                    <span className="mt-1 block text-xs font-normal text-slate-600">Jupiter, on the Intracoastal</span>
                  </th>
                  <td className={td}>45 holes</td>
                  <td className={td}>Canal-front lots and a club marina</td>
                  <td className={td}>Houses, townhomes and condominiums</td>
                  <td className={td}>Golf, boat and a full club behind one gate.</td>
                </tr>
                {COMPARE.map((c) => (
                  <tr key={c.href}>
                    <th scope="row" className={`${td} text-left`}>
                      <Link href={c.href} className={textLink}>{c.name}</Link>
                      <span className="mt-1 block text-xs font-normal text-slate-600">{c.where}</span>
                    </th>
                    <td className={td}>{c.golf}</td>
                    <td className={td}>{c.boating}</td>
                    <td className={td}>{c.homes}</td>
                    <td className={td}>{c.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollTable>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5">
            <InquiryLink type="club-options" className={btnOutline} />
            <Link href="/communities/jupiter" className={`text-sm ${textLink}`}>All Jupiter communities →</Link>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section id="faqs" className={`scroll-mt-24 ${section}`} aria-labelledby="ac-faqs">
        <div className={wrap}>
          <p className={eyebrow}>Buyer questions</p>
          <h2 id="ac-faqs" className={h2}>Admirals Cove FAQs</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {FAQS.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-card">
                <summary className="cursor-pointer list-none font-semibold text-slate-900 marker:hidden [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {f.q}
                    <span aria-hidden="true" className="text-report-gold-text transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-7 text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* The one form */}
      <section id={INQUIRY_ID} className={`scroll-mt-24 bg-navy-950 ${section}`} aria-labelledby="ac-inquiry">
        <div className={`${wrap} grid gap-10 lg:grid-cols-[1fr_minmax(0,28rem)] lg:items-start`}>
          <div className="text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-report-gold-light">Ask DO Homes Group</p>
            <h2 id="ac-inquiry" className="mt-2 font-serif text-3xl font-semibold leading-tight sm:text-4xl">
              Current fees, real costs and the right home
            </h2>
            <p className="mt-4 max-w-xl leading-8 text-white/90">
              Choose what you need and tell us a little about the home or the boat. We will reply with the
              current documents, not a brochure: the club’s fee schedule, the association charges, the recent
              sales on the streets you like, and the listings that fit.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-white/90">
              <li>· The club’s current membership fee schedule</li>
              <li>· A line-by-line cost of ownership for a specific home</li>
              <li>· Waterfront homes checked against your boat</li>
              <li>· A private showing, with gate access arranged</li>
            </ul>
            <p className="mt-6 text-sm text-white/85">
              Would you rather talk? Call{' '}
              <a href="tel:+15617837733" className="font-semibold text-white underline underline-offset-4">(561) 783-7733</a>.
            </p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
            <ClubInquiry community={NAME} labels={{ 'listing-alerts': ADMIRALS_LEAD_CTA }} />
          </div>
        </div>
      </section>

      {/* Who wrote it */}
      <section className={section} aria-labelledby="ac-authors">
        <div className={wrap}>
          <p className={eyebrow}>Who is behind this guide</p>
          <h2 id="ac-authors" className={h2}>Researched and reviewed by DO Homes Group</h2>
          <div className="mt-5">
            <ReviewedBy community={NAME} reviewed={REVIEWED.facts} />
          </div>
        </div>
      </section>

      {/* Sources */}
      <section id="sources" className={`scroll-mt-24 border-t border-slate-200 ${section}`} aria-labelledby="ac-sources">
        <div className={wrap}>
          <p className={eyebrow}>Research and sources</p>
          <h2 id="ac-sources" className={h2}>Where this page’s facts come from</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            Every fact here comes from the club, the associations, a government body or a public record, checked{' '}
            {REVIEWED.facts}.
          </p>
          <details className="group mt-5">
            <summary className={summaryCls}>Sources and what we could not confirm</summary>
            <div className="mt-6">
              <SourceRegister groups={SOURCES} notVerified={NOT_VERIFIED} reviewed={REVIEWED.facts} recordsDate={REVIEWED.records} />
            </div>
          </details>
          <p className="mt-10 text-xs leading-6 text-slate-500">
            This page is for information only and is not legal, tax, insurance, engineering or financial
            advice. Club rules, membership terms, fees, association assessments, flood maps, bridge schedules
            and school assignments change. Verify anything that matters to your decision with the club, the
            association, the Town of Jupiter, your insurer and your own advisers before you sign. DO Homes
            Group is not affiliated with The Club at Admirals Cove or any Admirals Cove association. DO Homes
            Group at Premier Brokers International is committed to Equal Housing Opportunity.
          </p>
        </div>
      </section>
    </div>
  )
}
