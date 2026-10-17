import Link from 'next/link'
import Image from 'next/image'
import { getCommunityBySlug, type CommunityItem } from '@/lib/communities'
import { marketTrendsCity } from '@/lib/articles'
import MarketTrendsBlock from '@/components/MarketTrendsBlock'
import YlopoResultsWidget from '@/components/YlopoResultsWidget'
import YlopoInit from '@/components/YlopoInit'
import AbacoaListings from '@/components/AbacoaListings'
import AbacoaRetrieved from '@/components/AbacoaRetrieved'
import GreatSchoolsCard from '@/components/GreatSchoolsCard'

const SEARCH_URL = 'https://search.doyouneedahome.com'
const SITE = 'https://www.doyouneedahome.com'

// Until a village has its own photos, the hero is the Abacoa Town Center shot
// John confirmed, captioned as the Town Center, never as the village.
const FALLBACK_HERO = {
  src: '/images/abacoa/abacoa-town-center-sunset-street.jpg',
  alt: 'Palm-lined main street of Abacoa Town Center in Jupiter, Florida, at sunset',
  caption: 'Abacoa Town Center',
}

const CHECKLIST = [
  'Master association documents and current dues for this address',
  'Village association documents, budget and rules',
  'Rental, pet and parking rules',
  'Reserves and any special assessment, passed or proposed',
  'Current application requirements and timelines',
]

const eyebrow = 'text-xs font-semibold uppercase tracking-[0.28em] text-report-gold-text'
const h2 = 'mt-2 font-serif text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl'
const btnPrimary =
  'inline-flex items-center justify-center rounded-full bg-report-gold px-7 py-3.5 text-sm font-semibold text-navy-950 shadow-sm transition hover:bg-report-gold-light'
const btnGhostDark =
  'inline-flex items-center justify-center rounded-full border border-white/50 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10'

/** Questions answered only from data the village already carries. */
function buildFaqs(v: CommunityItem): { q: string; a: string }[] {
  if (v.faqs?.length) return v.faqs
  const out: { q: string; a: string }[] = []
  const style = v.quickFacts.find((f) => /home style/i.test(f.label))
  const beds = v.quickFacts.find((f) => /bedrooms/i.test(f.label))
  if (style) {
    out.push({
      q: `What kinds of homes are in ${v.name}?`,
      a: `${style.value}.${beds ? ` ${beds.value}.` : ''}`,
    })
  }
  const walk = v.commuteTimes?.find((c) => /town center/i.test(c.destination))
  if (walk) {
    out.push({
      q: `How close is ${v.name} to Abacoa Town Center?`,
      a: `${walk.time}. Actual distance depends on the address, so we suggest walking the route before you buy.`,
    })
  }
  const schools = v.schoolList?.find((g) => /public/i.test(g.category))
  if (schools) {
    out.push({
      q: `What public schools serve ${v.name}?`,
      a: `${schools.schools.map((s) => s.name).join(', ')}. School assignments change, so confirm the current zone for any address with Palm Beach County Schools.`,
    })
  }
  out.push({
    q: `What should I ask about the HOA in ${v.name}?`,
    a: `${v.name} is part of Abacoa, so ask for both the master association and the village association documents: dues, rental and pet rules, parking, reserves and any assessments.`,
  })
  return out
}

export default function AbacoaVillageLanding({ slug }: { slug: string }) {
  const v = getCommunityBySlug(slug)
  if (!v) return null
  const trends = marketTrendsCity('Jupiter')
  const location = v.ylopoLocation ?? v.name
  const searchUrl =
    `${SEARCH_URL}/search?area=Jupiter&hvl=3&s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1` +
    `&s[locations][0][neighborhood]=${encodeURIComponent(location)}&s[locations][0][city]=Jupiter&s[locations][0][state]=FL&s[minPrice]=400000`
  const hasOwnPhotos = Boolean(v.photos?.length)
  const hero = hasOwnPhotos
    ? { src: v.photos![0], alt: `${v.name}, an Abacoa village in Jupiter, Florida`, caption: '' }
    : FALLBACK_HERO
  const gallery = (v.photos ?? []).slice(1)
  const faqs = buildFaqs(v)
  const siblings = (v.similarNeighborhoods ?? [])
    .map((s) => getCommunityBySlug(s))
    .filter((c): c is CommunityItem => Boolean(c))
  const paras = v.overview.split('\n\n')

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      ['Home', `${SITE}/`],
      ['Communities', `${SITE}/communities`],
      ['Jupiter', `${SITE}/communities/jupiter`],
      ['Abacoa', `${SITE}/communities/abacoa`],
      [v.name, `${SITE}/communities/${v.slug}`],
    ].map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })),
  }
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="relative isolate flex min-h-[520px] items-end overflow-hidden bg-navy-950 lg:min-h-[560px]">
        <Image src={hero.src} alt={hero.alt} fill priority sizes="100vw" className="-z-10 object-cover object-[50%_40%]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950 via-navy-950/60 to-navy-950/20" />
        <div className="mx-auto w-full max-w-7xl px-6 pb-12 pt-28 sm:px-8">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-white/85">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/communities/jupiter" className="hover:text-white">Jupiter</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/communities/abacoa" className="hover:text-white">Abacoa</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-white">{v.name}</li>
            </ol>
          </nav>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-report-gold-light">
            An Abacoa village · Jupiter, Florida
          </p>
          <h1 className="mt-3 font-serif text-5xl font-semibold leading-[1.05] text-white sm:text-6xl">
            {v.name} Homes for Sale
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-white/90">{v.description}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <a href="#listings" className={btnPrimary}>See {v.name} listings</a>
            <Link href="/contact" className={btnGhostDark}>Speak with a local expert</Link>
          </div>
          {hero.caption && <p className="mt-5 text-xs text-white/75">Photo: {hero.caption}</p>}
        </div>
      </section>

      {/* Listings first */}
      <section id="listings" className="scroll-mt-24 px-6 py-14 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className={eyebrow}>Live MLS feed</p>
              <h2 className={h2}>Homes for sale in {v.name}</h2>
            </div>
            <a
              href={searchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-gold-600 underline-offset-4 hover:text-gold-700 hover:underline"
            >
              Open the full {v.name} search →
            </a>
          </div>
          <YlopoInit city="Jupiter" />
          <AbacoaListings searchUrl={searchUrl}>
            <YlopoResultsWidget city="Jupiter" neighborhood={location} minPrice={400000} limit={6} />
          </AbacoaListings>
          <p className="mt-4 text-sm text-slate-600">
            Not seeing the right home? Browse{' '}
            <Link href="/communities/abacoa" className="font-semibold text-gold-600 hover:text-gold-700">
              all of Abacoa
            </Link>{' '}
            or{' '}
            <Link href="/contact" className="font-semibold text-gold-600 hover:text-gold-700">
              ask us about off-market options
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Market */}
      {trends && (
        <section className="bg-slate-50 px-6 py-14 sm:px-8 sm:py-16" aria-labelledby="village-market">
          <div className="mx-auto max-w-7xl">
            <p className={eyebrow}>Market context</p>
            <h2 id="village-market" className={h2}>Jupiter market context</h2>
            <p className="mt-3 max-w-3xl text-slate-600">
              This feed reports Jupiter as a whole, not {v.name}. Use it for direction, then compare
              recent sales inside the village. <span className="font-semibold text-slate-700"><AbacoaRetrieved /></span>.
            </p>
            <div className="mt-6 min-w-0">
              <MarketTrendsBlock
                city={trends.city}
                heading="Jupiter, FL market trends"
                caption="Live Ylopo market data for Jupiter, FL. Individual villages are not reported separately."
                frameClassName="mt-4"
              />
            </div>
          </div>
        </section>
      )}

      {/* About */}
      <section className="px-6 py-14 sm:px-8 sm:py-16" aria-labelledby="village-about">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          <div>
            <p className={eyebrow}>About the village</p>
            <h2 id="village-about" className={h2}>About {v.name}</h2>
            <div className="mt-5 space-y-4 leading-8 text-slate-600">
              {paras.map((p) => (<p key={p.slice(0, 24)}>{p}</p>))}
            </div>
          </div>
          <div>
            <p className={eyebrow}>Living here</p>
            <h2 className={h2}>What it’s like to live in {v.name}</h2>
            {v.lifestyle && <p className="mt-5 leading-8 text-slate-600">{v.lifestyle}</p>}
            {v.highlights && (
              <ul className="mt-6 space-y-3">
                {v.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-sm leading-7 text-slate-700">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-report-gold" aria-hidden="true" />
                    {h}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* Gallery: only when the village has its own photos */}
      {gallery.length > 0 && (
        <section className="bg-slate-50 px-6 py-14 sm:px-8 sm:py-16" aria-labelledby="village-gallery">
          <div className="mx-auto max-w-7xl">
            <h2 id="village-gallery" className={h2}>A look at {v.name}</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((src, i) => (
                <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                  <Image src={src} alt={`${v.name} in Abacoa, Jupiter, photo ${i + 2}`} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* At a glance + prices */}
      <section className="px-6 py-14 sm:px-8 sm:py-16" aria-labelledby="village-glance">
        <div className="mx-auto max-w-7xl">
          <p className={eyebrow}>At a glance</p>
          <h2 id="village-glance" className={h2}>{v.name} at a glance</h2>
          <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {v.quickFacts.map((f) => (
              <div key={f.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-report-gold-text">{f.label}</dt>
                <dd className="mt-2 text-sm leading-7 text-slate-700">{f.value}</dd>
              </div>
            ))}
          </dl>
          {v.priceRanges && v.priceRanges.length > 0 && (
            <p className="mt-5 text-sm text-slate-600">
              Typical range:{' '}
              {v.priceRanges.map((p) => `${p.type}, ${p.range}`).join('; ')}. Ranges are approximate and
              change with the market, so ask us for a current valuation.
            </p>
          )}
        </div>
      </section>

      {/* Schools + commute */}
      <section className="bg-slate-50 px-6 py-14 sm:px-8 sm:py-16" aria-labelledby="village-practical">
        <div className="mx-auto max-w-7xl">
          <p className={eyebrow}>The practical side</p>
          <h2 id="village-practical" className={h2}>Schools and getting around</h2>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {v.commuteTimes && (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
                <h3 className="font-serif text-xl font-semibold text-slate-900">Getting around</h3>
                <dl className="mt-4 divide-y divide-slate-100">
                  {v.commuteTimes.map((c) => (
                    <div key={c.destination} className="flex items-baseline justify-between gap-4 py-2.5 text-sm">
                      <dt className="text-slate-600">{c.destination}</dt>
                      <dd className="font-semibold text-slate-900">{c.time}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-3 text-xs text-slate-500">Approximate; varies with traffic and address.</p>
              </div>
            )}
            {v.schoolList && (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
                <h3 className="font-serif text-xl font-semibold text-slate-900">Schools</h3>
                <div className="mt-4 space-y-4">
                  {v.schoolList.map((g) => (
                    <div key={g.category}>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-report-gold-text">{g.category}</p>
                      <ul className="mt-2 space-y-1 text-sm text-slate-700">
                        {g.schools.map((s) => (<li key={s.name}>{s.name}</li>))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="mt-6"><GreatSchoolsCard citySlug="jupiter" cityName={v.name} /></div>
          <p className="mt-4 text-xs leading-6 text-slate-500">
            School assignments and boundaries change. Confirm the current zone for any address with Palm Beach County Schools.
          </p>
        </div>
      </section>

      {/* Association checklist */}
      <section className="px-6 py-14 sm:px-8 sm:py-16" aria-labelledby="village-hoa">
        <div className="mx-auto max-w-7xl">
          <p className={eyebrow}>Associations</p>
          <h2 id="village-hoa" className={h2}>Before you buy in {v.name}</h2>
          <p className="mt-3 max-w-3xl leading-8 text-slate-600">
            Abacoa is a master-planned community of villages, and a village can have its own association
            on top of the master one. We don’t quote fees or rules here because they differ by village
            and change. Ask for these for the exact address:
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {CHECKLIST.map((c) => (
              <li key={c} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-7 text-slate-700 shadow-card">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-report-gold" aria-hidden="true" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50 px-6 py-14 sm:px-8 sm:py-16" aria-labelledby="village-faq">
        <div className="mx-auto max-w-4xl">
          <h2 id="village-faq" className={h2}>Questions about {v.name}</h2>
          <dl className="mt-8 space-y-4">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
                <dt className="font-semibold text-slate-900">{f.q}</dt>
                <dd className="mt-2 text-sm leading-7 text-slate-600">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* More villages */}
      <section className="px-6 py-14 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <p className={eyebrow}>Keep exploring</p>
          <h2 className={h2}>Other Abacoa villages</h2>
          <ul className="mt-6 flex flex-wrap gap-3">
            {siblings.map((s) => (
              <li key={s.slug}>
                <Link href={`/communities/${s.slug}`} className="inline-flex rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-card transition hover:border-report-gold hover:text-gold-600">
                  {s.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/communities/abacoa" className="inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700">
                All of Abacoa →
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <section className="bg-navy-950 px-6 py-14 text-center text-white sm:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-3xl font-semibold sm:text-4xl">Want to tour {v.name}?</h2>
          <p className="mt-3 text-white/90">Tell us what matters and we’ll walk it with you.</p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href={searchUrl} target="_blank" rel="noopener noreferrer" className={btnPrimary}>Search {v.name} homes</a>
            <Link href="/contact" className={btnGhostDark}>Speak with a local expert</Link>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <p className="text-xs leading-6 text-slate-500">
            Community details on this page, including association rules, fees, amenities and school
            assignments, change often and are for information only. Verify anything that matters to
            your decision directly with the association, the school district and the City of Jupiter.
            DO Homes Group at Premier Brokers International is committed to Equal Housing Opportunity.
          </p>
        </div>
      </section>
    </div>
  )
}
