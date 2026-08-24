import type { Metadata } from 'next'
import Image from 'next/image'
import { SITE_URL } from '@/lib/site'
import { ARRIVAL, CLUB, LIVING, PHOTOS, slice, UPSTAIRS, WATERFRONT } from './photos'
import GalleryImage from './GalleryImage'
import Lightbox from './Lightbox'
import Reveal from './Reveal'
import ShowingRequestForm from './ShowingRequestForm'
import StickyBar from './StickyBar'
import './skyward.css'

// ─────────────────────────────────────────────────────────────────────────────
// 8804 Skyward Street — standalone marketing page. This static route
// deliberately shadows /listings/[slug] for this address: the Lotus HOA
// prohibits for-sale signs, so this page plus MLS syndication is the entire
// top of the funnel and gets a bespoke treatment instead of the site template.
// The site Header/Footer are suppressed for this route in SiteChrome.tsx.
//
// Facts on this page are seller/John-verified. Deliberately NOT claimed
// anywhere below, per John: exposure/orientation and EV charging (unverified),
// and the pool is described as custom saltwater — not "L-shaped".
// ─────────────────────────────────────────────────────────────────────────────

const URL_PATH = '/listings/8804-skyward-street'
const OG_IMAGE = '/images/listings/8804-skyward-street/og-skyward-active.jpg'
const TITLE = '8804 Skyward Street — Lakefront in Lotus | Boca Raton, FL'
const DESCRIPTION =
  'A 2021-built waterfront Sumatra Select in guard-gated Lotus: 5 en-suite bedrooms, 6.5 baths, 4,932 sq ft, a custom heated saltwater pool on a marble deck, impact glass throughout, and a whole-house generator. Offered at $2,799,999.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL_PATH },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}${URL_PATH}`,
    type: 'website',
    images: [
      {
        url: `${SITE_URL}${OG_IMAGE}`,
        width: 1200,
        height: 630,
        alt: 'Front elevation of 8804 Skyward Street, a contemporary two-story home in Lotus, Boca Raton',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [`${SITE_URL}${OG_IMAGE}`],
  },
}

// ── Room dimensions (from the builder plan; disclaimed below the tables) ─────

const GROUND_FLOOR: Array<[string, string]> = [
  ['Primary Bedroom', `15'0" × 18'0"`],
  ['Great Room', `19'8" × 22'10"`],
  ['Kitchen', `14'0" × 11'6"`],
  ['Breakfast Area', `16'0" × 11'10"`],
  ['Dining Room', `15'8" × 12'6"`],
  ['Club Room / Den', `15'4" × 17'10"`],
  ['Covered Patio', `35'8" × 9'6"`],
  ['2-Car Garage', `20'0" × 20'0"`],
  ['1-Car Garage', `19'0" × 11'8"–13'4"`],
]

const UPPER_FLOOR: Array<[string, string]> = [
  ['Media Room', `18'2" × 18'10"`],
  ['Loft', `15'8" × 16'0"`],
  ['Bedroom 2', `15'6" × 14'0"`],
  ['Bedroom 3', `12'0" × 15'0"`],
  ['Bedroom 4', `14'6" × 13'2"`],
  ['Bedroom 5', `16'4" × 12'6"`],
]

// ── Gallery layout ───────────────────────────────────────────────────────────
// Rows cycle full → pair → pair inside each chapter, preserving John's exact
// 46-photo order. Pairs crop to 3:2 so rows line up; the lightbox shows the
// uncropped frame.

const SIZES_FULL = '(min-width: 1440px) 1360px, 100vw'
const SIZES_HALF = '(min-width: 1440px) 672px, (min-width: 640px) 50vw, 100vw'

function PhotoGrid({ range }: { range: readonly [number, number] }) {
  const [start] = range
  const photos = slice(range)
  const rows: React.ReactNode[] = []
  let i = 0
  let cycle = 0
  while (i < photos.length) {
    const remaining = photos.length - i
    if (cycle % 3 === 0 || remaining === 1) {
      const index = start + i
      rows.push(
        <Reveal key={index}>
          <GalleryImage photo={photos[i]} index={index} sizes={SIZES_FULL} />
        </Reveal>
      )
      i += 1
    } else {
      const index = start + i
      rows.push(
        <Reveal key={index}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            <GalleryImage photo={photos[i]} index={index} sizes={SIZES_HALF} crop="aspect-[3/2]" />
            <GalleryImage photo={photos[i + 1]} index={index + 1} sizes={SIZES_HALF} crop="aspect-[3/2]" />
          </div>
        </Reveal>
      )
      i += 2
    }
    cycle += 1
  }
  return <div className="space-y-4 sm:space-y-5">{rows}</div>
}

// ── Small building blocks ────────────────────────────────────────────────────

function SectionHeading({
  label,
  title,
  children,
  dark = false,
}: {
  label: string
  title: string
  children?: React.ReactNode
  dark?: boolean
}) {
  return (
    <Reveal>
      <p className={`sky-label ${dark ? 'sky-label--dark' : ''}`}>{label}</p>
      <h2 className={`sky-display sky-h2 mt-4 max-w-3xl ${dark ? 'text-[#f5f2eb]' : ''}`}>{title}</h2>
      {children}
    </Reveal>
  )
}

function SpecList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="sky-label border-b border-[#16140f] pb-3">{title}</h3>
      <ul className="mt-4 space-y-3">
      {items.map((item) => (
        <li key={item} className="text-[15px] leading-7 text-[#3f3a31]">
          {item}
        </li>
      ))}
      </ul>
    </div>
  )
}

function NumberRow({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-[#d9d2c3] py-3.5">
      <dt className="text-[13px] font-medium uppercase tracking-[0.12em] text-[#6b6355]">{label}</dt>
      <dd className="sky-num text-right text-[15px] text-[#16140f]">
        {value}
        {note && <span className="mt-0.5 block text-xs font-normal normal-case text-[#6b6355]">{note}</span>}
      </dd>
    </div>
  )
}

function DimensionsTable({ caption, note, rows }: { caption: string; note: string; rows: Array<[string, string]> }) {
  return (
    <div className="sky-table-wrap">
      <table className="sky-table">
        <caption>
          <span className="font-serif text-xl text-[#16140f]">{caption}</span>
          <span className="mt-1 block text-[13px] text-[#6b6355]">{note}</span>
        </caption>
        <thead>
          <tr>
            <th scope="col">Room</th>
            <th scope="col">Dimensions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([room, dims]) => (
            <tr key={room}>
              <th scope="row">{room}</th>
              <td>{dims}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function SkywardStreetPage() {
  const url = `${SITE_URL}${URL_PATH}`

  const listingSchema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: '8804 Skyward Street, Boca Raton, FL 33496',
    url,
    datePosted: '2026-08-23',
    image: [
      `${SITE_URL}${PHOTOS[0].src}`,
      `${SITE_URL}${PHOTOS[4].src}`,
      `${SITE_URL}${PHOTOS[12].src}`,
    ],
    about: {
      '@type': 'SingleFamilyResidence',
      name: '8804 Skyward Street',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '8804 Skyward Street',
        addressLocality: 'Boca Raton',
        addressRegion: 'FL',
        postalCode: '33496',
        addressCountry: 'US',
      },
      numberOfBedrooms: 5,
      numberOfFullBathrooms: 6,
      numberOfPartialBathrooms: 1,
      floorSize: { '@type': 'QuantitativeValue', value: 4932, unitCode: 'FTK' },
      yearBuilt: 2021,
    },
    offers: {
      '@type': 'Offer',
      price: 2799999,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url,
      seller: {
        '@type': 'RealEstateAgent',
        name: 'John Oliver',
        telephone: '(561) 786-3630',
        email: 'john@doyouneedahome.com',
        worksFor: { '@type': 'RealEstateOrganization', name: 'Premier Brokers International' },
      },
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Boca Raton Real Estate', item: `${SITE_URL}/communities/boca-raton` },
      { '@type': 'ListItem', position: 3, name: '8804 Skyward Street', item: url },
    ],
  }

  return (
    <div className="sky-root">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listingSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <StickyBar />
      <Lightbox />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section id="sky-hero" className="relative flex min-h-svh flex-col justify-end">
        <div className="sky-hero-media">
          <Image
            src={PHOTOS[0].src}
            alt={PHOTOS[0].alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#16140f]/85 via-[#16140f]/25 to-[#16140f]/10" />

        <div className="relative mx-auto w-full max-w-6xl px-5 pb-24 pt-40 sm:px-8 sm:pb-28">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#f5f2eb]/85">
            Lotus &middot; Boca Raton, Florida &middot; Active on BeachesMLS
          </p>
          <h1 className="sky-display sky-h1 mt-4 text-[#f5f2eb]">8804 Skyward Street</h1>
          <p className="sky-num mt-5 font-serif text-3xl text-[#f5f2eb] sm:text-4xl">$2,799,999</p>

          <dl className="sky-num mt-8 flex flex-wrap items-center gap-x-0 gap-y-3 text-[#f5f2eb]">
            {[
              ['5', 'Bedrooms'],
              ['6.5', 'Baths'],
              ['4,932', 'SF Under Air'],
            ].map(([n, label], i) => (
              <div
                key={label}
                className={`flex items-baseline gap-2 pr-6 ${i > 0 ? 'border-l border-[#f5f2eb]/30 pl-6' : ''}`}
              >
                <dt className="sr-only">{label}</dt>
                <dd className="text-xl font-medium sm:text-2xl">{n}</dd>
                <dd className="text-[11px] uppercase tracking-[0.18em] text-[#f5f2eb]/70">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="absolute bottom-0 left-1/2 hidden -translate-x-1/2 flex-col items-center pb-4 sm:flex" aria-hidden="true">
          <span className="sky-cue-line" />
        </div>
      </section>

      {/* ── Arrival ───────────────────────────────────────────────────────── */}
      <section className="px-5 pb-6 pt-20 sm:px-8 sm:pt-28">
        <div className="mx-auto max-w-6xl">
          <SectionHeading label="The Listing" title="Built 2021. On the lake. Behind the Lotus gate.">
            <p className="sky-lede mt-6 max-w-3xl">
              8804 Skyward Street is a Sumatra Select from GL Homes&rsquo; Bali Collection — the big
              two-story — on a waterfront homesite in Lotus, and waterfront was never a large share
              of what Lotus released. Five bedrooms, every one of them en suite. A 22-foot entry
              under a curved staircase. And behind the house, open water.
            </p>
          </SectionHeading>
        </div>
        <div className="mx-auto mt-14 max-w-[1400px]">
          <Reveal>
            <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
              {slice(ARRIVAL).map((photo, i) => (
                <GalleryImage
                  key={photo.src}
                  photo={photo}
                  index={ARRIVAL[0] + i}
                  sizes="(min-width: 1440px) 448px, (min-width: 640px) 33vw, 100vw"
                  crop="aspect-[4/3]"
                />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── The Waterfront ────────────────────────────────────────────────── */}
      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <SectionHeading label="The Waterfront" title="The value driver is the water behind it.">
            <div className="mt-6 max-w-3xl space-y-5">
              <p className="sky-body">
                This lot doesn&rsquo;t look across a canal into a neighbor&rsquo;s screen enclosure —
                it opens onto the lake itself. The pool came in 2022, built custom rather than
                from the builder&rsquo;s catalog: saltwater, heated, a main body sized for actual
                swimming and an offset shallow sun shelf finished in deep blue glass-mosaic tile with
                bubblers, the whole thing wrapped in a marble deck.
              </p>
              <p className="sky-body">
                Nearly 36 feet of covered lanai runs the back of the house under a 10-foot ceiling
                with fans, and a full cabana bath opens directly onto it — wet feet never cross the
                kitchen.
              </p>
            </div>
          </SectionHeading>

          <Reveal>
            <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-y border-[#d9d2c3] py-8 sm:grid-cols-4">
              {[
                ['Custom pool', 'Saltwater · heated · built 2022'],
                ['Sun shelf', 'Blue glass mosaic · bubblers'],
                ['Marble deck', 'Pool surround and rear patio'],
                [`Lanai 35'8" × 9'6"`, '10-ft ceiling · full cabana bath'],
              ].map(([term, detail]) => (
                <div key={term}>
                  <dt className="font-serif text-lg text-[#16140f]">{term}</dt>
                  <dd className="mt-1 text-[13px] leading-6 text-[#6b6355]">{detail}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
        <div className="mx-auto mt-14 max-w-[1400px]">
          <PhotoGrid range={WATERFRONT} />
        </div>
      </section>

      {/* ── The Main Floor ────────────────────────────────────────────────── */}
      <section className="bg-[#ece7dc] px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <SectionHeading label="The Main Floor" title="Ten-foot ceilings, and a kitchen built to be used.">
            <div className="mt-6 max-w-3xl space-y-5">
              <p className="sky-body">
                Cabinetry runs to the ceiling. The counters are white quartz around an oversized
                island, the backsplash is hexagonal tile, and the equipment is built in: wall ovens,
                a gas cooktop under a vented hood, and integrated refrigeration. The kitchen opens
                across the breakfast area into a 19&rsquo;8&rdquo; × 22&rsquo;10&rdquo; great room
                whose sliders pocket back to the lanai.
              </p>
              <p className="sky-body">
                A formal dining room and a club room/den sit off the two-story foyer. And the floor
                plan&rsquo;s quiet advantage: the kitchen, the laundry, and the primary suite all sit
                on the ground floor — full single-level living, with the media room, gym, and loft
                up the curved stair.
              </p>
            </div>
          </SectionHeading>
        </div>
        <div className="mx-auto mt-14 max-w-[1400px]">
          <PhotoGrid range={LIVING} />
        </div>
      </section>

      {/* ── Primary suite + upstairs ──────────────────────────────────────── */}
      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <SectionHeading label="The Primary Suite & The Second Floor" title="The primary stays downstairs. The noise stays up.">
            <div className="mt-6 max-w-3xl space-y-5">
              <p className="sky-body">
                The primary suite is 15 by 18 feet under a coffered ceiling that steps from 10 to 11
                feet, with windows facing the pool and the lake, two walk-in closets, and sound
                insulation in the walls. The bath carries a Roman tub, a separate glass shower, a
                dual vanity with a seated station, and a private water closet.
              </p>
              <p className="sky-body">
                Every bedroom in the house is en suite, each with its own bath. Upstairs, under
                9&rsquo;4&rdquo; ceilings and wood floors: the guest suites, a sound-insulated media
                room, a home gym with a full mirrored wall, and a loft open to the foyer below.
              </p>
            </div>
          </SectionHeading>
        </div>
        <div className="mx-auto mt-14 max-w-[1400px]">
          <PhotoGrid range={UPSTAIRS} />
        </div>
      </section>

      {/* ── The House (specs) ─────────────────────────────────────────────── */}
      <section className="border-y border-[#d9d2c3] bg-[#ece7dc] px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <SectionHeading label="The House" title="The expensive decisions are already made." />

          <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
            <Reveal>
              <div className="grid gap-10 sm:grid-cols-2">
                <SpecList
                  title="Construction & Systems"
                  items={[
                    'CBS construction — stucco over block, stone-veneer accent',
                    'Tile roof, installed 2021',
                    'Impact glass windows and doors throughout — no shutters to hang',
                    'Whole-house generator',
                    'Public water and public sewer',
                    'Flood Zone X — outside the special flood hazard area; finished floor at 19.8 ft NAVD88',
                    'Pool barrier permitted and finaled (PBC B-2021-045257)',
                  ]}
                />
                <SpecList
                  title="Interior"
                  items={[
                    '10-ft ceilings on the ground floor, 9\'4" up — smooth finish throughout',
                    'Every bedroom en suite; primary suite on the ground floor',
                    'Two-story foyer with a 22-ft entry and curved staircase',
                    'Wood floors on the upper level',
                    'Built-in closets and central vacuum',
                    'Sound insulation at the primary suite and media room',
                  ]}
                />
                <SpecList
                  title="Garage & Grounds"
                  items={[
                    '3-car garage — 701 sq ft, epoxy floors',
                    '0.1802-acre lakefront homesite',
                    'Custom heated saltwater pool (2022) on a marble deck',
                    "Covered lanai, 35'8\" × 9'6\", with fans and a cabana bath",
                  ]}
                />
                <SpecList
                  title="On File"
                  items={[
                    "Seller's disclosure reports no water intrusion, no defects, no open permits, no claims, and no litigation — read it yourself; we send it with the MLS sheet",
                    'Sellers prefer a 60-day close and may consider a short post-closing occupancy',
                  ]}
                />
              </div>
            </Reveal>

            <Reveal>
              <div className="border border-[#16140f] p-7 sm:p-8">
                <h3 className="sky-label">The Numbers</h3>
                <dl className="mt-4">
                  <NumberRow label="Price" value="$2,799,999" />
                  <NumberRow label="Status" value="Active" note="BeachesMLS" />
                  <NumberRow label="Living Area" value="4,932 sq ft" note="under air" />
                  <NumberRow label="Total" value="6,263 sq ft" note="incl. garage, porches & two-story volume" />
                  <NumberRow label="Lot" value="0.1802 acres" note="lakefront" />
                  <NumberRow label="Built" value="2021" note="GL Homes · Sumatra Select, Bali Collection" />
                  <NumberRow label="Taxes (2025)" value="$17,787" note="reflects the sellers' homestead exemption" />
                  <NumberRow label="HOA" value="$720 / month" note="billed quarterly at $2,160" />
                  <NumberRow label="Capital Contribution" value="$4,320" note="buyer pays at closing — two quarterly assessments" />
                </dl>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Room dimensions ───────────────────────────────────────────────── */}
      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <SectionHeading label="Room Dimensions" title="The rooms, measured." />
          <Reveal>
            <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
              <DimensionsTable
                caption="Ground floor"
                note="10-ft ceilings unless noted; primary bedroom coffered 10'–11'"
                rows={GROUND_FLOOR}
              />
              <DimensionsTable caption="Upper floor" note={`9'4" ceilings`} rows={UPPER_FLOOR} />
            </div>
            <p className="mt-8 text-[13px] leading-6 text-[#6b6355]">
              Dimensions are from the builder&rsquo;s plan, are approximate, and should be
              independently verified by the buyer.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Lotus ─────────────────────────────────────────────────────────── */}
      <section className="bg-[#ece7dc] px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <SectionHeading label="The Community" title="Lotus — 804 homes, built out, resale only.">
            <div className="mt-6 max-w-3xl space-y-5">
              <p className="sky-body">
                Lotus is a guard-gated GL Homes community off Lyons Road in west Boca Raton, and it
                is finished: 804 homes, built out, with no construction traffic and no builder
                lottery. The only way in is a resale.
              </p>
              <p className="sky-body">
                At its center is a 26,000-square-foot clubhouse: a resort pool, a lap pool, a
                whirlpool spa, and an interactive water play area outside; an indoor sports court, a
                fitness center, and game and card rooms inside; and Luna Bistro running a
                full-service pool bar and lounge. Lighted clay tennis and pickleball courts sit
                alongside. The gate is manned, and the HOA covers landscape maintenance at each
                home, basic house-alarm monitoring, security, and access to all of it.
              </p>
            </div>
          </SectionHeading>
        </div>
        <div className="mx-auto mt-14 max-w-[1400px]">
          <PhotoGrid range={CLUB} />
        </div>
      </section>

      {/* ── Showing ───────────────────────────────────────────────────────── */}
      <section id="showing" className="sky-anchor bg-[#16140f] px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
            <div>
              <SectionHeading dark label="Private Showings" title="Seeing it is by appointment." />
              <Reveal>
                <ul className="mt-8 space-y-5">
                  {[
                    'Showings are private, by appointment, with 24 hours’ notice.',
                    'The listing agent accompanies every showing. There is no lockbox.',
                    'Lotus is guard-gated: every guest must be pre-registered at the gate. John confirms your appointment first — the gate clears no one before that.',
                    'The sellers prefer a 60-day close and may consider a short post-closing occupancy.',
                  ].map((item) => (
                    <li key={item} className="flex gap-4 text-[15px] leading-7 text-[#f5f2eb]/80">
                      <span aria-hidden="true" className="mt-3 h-px w-6 flex-shrink-0 bg-[#93c4cb]" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-12 border-t border-[#f5f2eb]/20 pt-8">
                  <p className="sky-label sky-label--dark">Listing Agent</p>
                  <p className="mt-3 font-serif text-2xl text-[#f5f2eb]">John Oliver</p>
                  <p className="mt-1 text-sm text-[#f5f2eb]/70">
                    Premier Brokers International
                    <br />
                    9123 N. Military Trail, Suite 104, Palm Beach Gardens, FL 33410
                  </p>
                  <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
                    <a href="tel:+15617863630" className="text-[#93c4cb] underline-offset-4 transition hover:text-[#f5f2eb] hover:underline">
                      (561) 786-3630
                    </a>
                    <a href="mailto:john@doyouneedahome.com" className="text-[#93c4cb] underline-offset-4 transition hover:text-[#f5f2eb] hover:underline">
                      john@doyouneedahome.com
                    </a>
                  </div>
                </div>
              </Reveal>
            </div>

            <Reveal>
              <ShowingRequestForm />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#f5f2eb]/15 bg-[#16140f] px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="font-serif text-lg text-[#f5f2eb]">
            8804 Skyward Street, Boca Raton, FL 33496 <span className="text-[#f5f2eb]/50">·</span>{' '}
            <span className="sky-num">$2,799,999</span>
          </p>
          <p className="mt-3 text-sm text-[#f5f2eb]/70">
            Listed by John Oliver · Premier Brokers International · 9123 N. Military Trail, Suite
            104, Palm Beach Gardens, FL 33410 · (561) 786-3630
          </p>
          <div className="mt-8 max-w-4xl space-y-3 border-t border-[#f5f2eb]/15 pt-6 text-xs leading-6 text-[#f5f2eb]/50">
            <p>
              All measurements, room counts, and features are approximate, are drawn from builder
              plans, public records, and seller-provided information, and are to be independently
              verified by the buyer.
            </p>
            <p>
              Taxes shown are the 2025 bill and reflect the sellers&rsquo; homestead exemption.
              Property taxes are generally reassessed after a sale; a buyer should estimate taxes
              based on the purchase price rather than the current bill.
            </p>
            <p>
              Listing information is deemed reliable but is not guaranteed. Listed on BeachesMLS.
              Equal Housing Opportunity — Premier Brokers International does not discriminate on the
              basis of race, color, religion, sex, national origin, familial status, or disability.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
