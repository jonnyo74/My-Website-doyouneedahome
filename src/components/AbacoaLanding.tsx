import Link from 'next/link'
import Image from 'next/image'
import { getCommunityBySlug } from '@/lib/communities'
import { getArticlesByCity, marketTrendsCity } from '@/lib/articles'
import MarketTrendsBlock from '@/components/MarketTrendsBlock'
import YlopoResultsWidget from '@/components/YlopoResultsWidget'
import YlopoInit from '@/components/YlopoInit'
import AbacoaListings from '@/components/AbacoaListings'
import AbacoaRetrieved from '@/components/AbacoaRetrieved'

const SEARCH_URL = 'https://search.doyouneedahome.com'
// Ylopo can only resolve real municipalities in the city filter, so the Abacoa
// search is Jupiter plus an Abacoa neighborhood filter (see YlopoResultsWidget).
const ABACOA_SEARCH =
  `${SEARCH_URL}/search?area=Jupiter&hvl=3&s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1` +
  `&s[locations][0][neighborhood]=Abacoa&s[locations][0][city]=Jupiter&s[locations][0][state]=FL&s[minPrice]=400000`

/**
 * Photos of Abacoa that John has confirmed are Abacoa. Add new shots here and
 * the gallery picks them up; nothing else on the page assumes a count.
 */
export const ABACOA_PHOTOS: { src: string; alt: string; caption: string; w: number; h: number }[] = [
  {
    src: '/images/abacoa/abacoa-town-center-palm-boulevard.jpg',
    alt: 'Palm-lined main street in Abacoa Town Center at sunset, with shops and apartments on both sides and a few people walking',
    caption: 'Abacoa Town Center at sunset — shops and restaurants at street level, homes above.',
    w: 1500,
    h: 2000,
  },
]
const HERO = {
  src: '/images/abacoa/abacoa-town-center-sunset-street.jpg',
  alt: 'Looking down the palm-lined main street of Abacoa Town Center in Jupiter, Florida, under a pink and grey sunset sky',
}

// Villages that already have pages. Order is the order we want buyers to see them.
const VILLAGE_SLUGS = [
  'antigua', 'canterbury-place', 'charleston-court', 'dakota', 'mallory-creek', 'martinique',
  'newhaven', 'osceola-woods', 'tuscany', 'valencia', 'windsor-park',
]

const CHECKLIST = [
  { t: 'Master association', d: 'Ask for the master association’s current documents, what it covers, and what it costs for this exact address.' },
  { t: 'Village association', d: 'Many villages have their own association on top of the master one. Get both budgets and both sets of rules.' },
  { t: 'Rental and pet rules', d: 'Minimum lease terms, rental caps, and pet limits are set village by village. Confirm them before you rely on them.' },
  { t: 'Reserves and assessments', d: 'Ask for the latest budget, reserve funding, and any special assessment passed or proposed.' },
  { t: 'Application requirements', d: 'Approval steps, fees, and timelines change. Ask the association for the current application, not last year’s.' },
]

const crumbs = [
  { name: 'Home', url: 'https://www.doyouneedahome.com/' },
  { name: 'Communities', url: 'https://www.doyouneedahome.com/communities' },
  { name: 'Jupiter', url: 'https://www.doyouneedahome.com/communities/jupiter' },
  { name: 'Abacoa', url: 'https://www.doyouneedahome.com/communities/abacoa' },
]

const eyebrow = 'text-xs font-semibold uppercase tracking-[0.28em] text-report-gold-text'
const h2 = 'mt-2 font-serif text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl'
const btnPrimary =
  'inline-flex items-center justify-center rounded-full bg-report-gold px-7 py-3.5 text-sm font-semibold text-navy-950 shadow-sm transition hover:bg-report-gold-light'
const btnGhostDark =
  'inline-flex items-center justify-center rounded-full border border-white/50 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10'

export default function AbacoaLanding() {
  const villages = VILLAGE_SLUGS.map((s) => getCommunityBySlug(s)).filter(
    (c): c is NonNullable<typeof c> => Boolean(c),
  )
  const abacoa = getCommunityBySlug('abacoa')
  const story = abacoa?.overview.split('\n\n') ?? []
  const trends = marketTrendsCity('Jupiter')
  const guides = getArticlesByCity('jupiter').slice(0, 4)
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.url })),
  }

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative isolate flex min-h-[640px] items-end overflow-hidden bg-navy-950 lg:h-[82vh]">
        <Image src={HERO.src} alt={HERO.alt} fill priority sizes="100vw" className="-z-10 object-cover object-[50%_40%]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950 via-navy-950/60 to-navy-950/20" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950/70 via-transparent to-transparent" />
        <div className="mx-auto w-full max-w-7xl px-6 pb-14 pt-32 sm:px-8 lg:pb-20">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-white/85">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/communities" className="hover:text-white">Communities</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/communities/jupiter" className="hover:text-white">Jupiter</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-white">Abacoa</li>
            </ol>
          </nav>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-report-gold-light">
            Jupiter, Florida · Master-planned villages
          </p>
          <h1 className="mt-3 max-w-3xl font-serif text-5xl font-semibold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
            Abacoa Homes for Sale
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/90 sm:text-xl">
            Walk to dinner, ball games and the town green. Abacoa is Jupiter’s master-planned,
            village-by-village community, and each village lives a little differently.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <a href="#listings" className={btnPrimary}>Search Abacoa homes</a>
            <Link href="/contact" className={btnGhostDark}>Speak with a local expert</Link>
          </div>
        </div>
      </section>

      {/* ── Listings ─────────────────────────────────────────── */}
      <section id="listings" className="scroll-mt-24 px-6 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className={eyebrow}>Live MLS feed</p>
              <h2 className={h2}>Homes for sale in Abacoa</h2>
              <p className="mt-3 max-w-2xl text-slate-600">
                Filtered to Abacoa itself, not all of Jupiter, and showing homes from $400K up.
              </p>
            </div>
            <a
              href={ABACOA_SEARCH}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-gold-600 underline-offset-4 transition hover:text-gold-700 hover:underline"
            >
              Open the full Abacoa search →
            </a>
          </div>
          <YlopoInit city="Jupiter" />
          <AbacoaListings searchUrl={ABACOA_SEARCH}>
            <YlopoResultsWidget city="Jupiter" neighborhood="Abacoa" minPrice={400000} limit={6} />
          </AbacoaListings>
        </div>
      </section>

      {/* ── The story + what it's like ───────────────────────── */}
      {abacoa && (
        <section className="bg-slate-50 px-6 py-16 sm:px-8 sm:py-20" aria-labelledby="abacoa-story">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
            <div>
              <p className={eyebrow}>The story</p>
              <h2 id="abacoa-story" className={h2}>A town built to feel like a town</h2>
              <div className="mt-5 space-y-4 leading-8 text-slate-600">
                {story.map((para) => (<p key={para.slice(0, 24)}>{para}</p>))}
              </div>
            </div>
            <div>
              <p className={eyebrow}>Living here</p>
              <h2 className={h2}>What it’s like to live in Abacoa</h2>
              {abacoa.lifestyle && <p className="mt-5 leading-8 text-slate-600">{abacoa.lifestyle}</p>}
              {abacoa.localLoves && (
                <ul className="mt-6 space-y-3">
                  {abacoa.localLoves.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm leading-7 text-slate-700">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-report-gold" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── Gallery ──────────────────────────────────────────── */}
      {ABACOA_PHOTOS.length > 0 && (
        <section className="bg-slate-50 px-6 py-16 sm:px-8 sm:py-20" aria-labelledby="abacoa-gallery">
          <div className="mx-auto max-w-7xl">
            <p className={eyebrow}>On the ground</p>
            <h2 id="abacoa-gallery" className={h2}>A Look at Abacoa</h2>
            <div
              className={`mt-8 grid gap-4 ${
                ABACOA_PHOTOS.length === 1 ? 'md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-center' : 'sm:grid-cols-2 lg:grid-cols-3'
              }`}
            >
              {ABACOA_PHOTOS.map((p) => (
                <figure key={p.src} className="overflow-hidden rounded-3xl bg-white shadow-card">
                  <Image
                    src={p.src}
                    alt={p.alt}
                    width={p.w}
                    height={p.h}
                    sizes="(min-width: 768px) 45vw, 100vw"
                    className="h-auto w-full object-cover"
                  />
                  <figcaption className="px-5 py-4 text-sm leading-6 text-slate-600">{p.caption}</figcaption>
                </figure>
              ))}
              {ABACOA_PHOTOS.length === 1 && (
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-slate-900">
                    A town center you can actually walk
                  </h3>
                  <p className="mt-3 leading-8 text-slate-600">
                    Abacoa was planned around its Town Center, with dining, shops and Roger Dean
                    Chevrolet Stadium close to the homes around it. How close depends on the village,
                    which is why we start every Abacoa search with the question: how often do you
                    want to leave the car at home?
                  </p>
                  <Link href="/contact" className="mt-5 inline-flex text-sm font-semibold text-gold-600 hover:text-gold-700">
                    Tour a village with us →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── Villages ─────────────────────────────────────────── */}
      <section className="px-6 py-16 sm:px-8 sm:py-20" aria-labelledby="abacoa-villages">
        <div className="mx-auto max-w-7xl">
          <p className={eyebrow}>Eleven villages</p>
          <h2 id="abacoa-villages" className={h2}>Explore Abacoa’s Villages</h2>
          <p className="mt-3 max-w-2xl text-slate-600">
            Same address, very different homes. Start with the village, then the house.
          </p>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {villages.map((v) => (
              <li key={v.slug}>
                <Link
                  href={`/communities/${v.slug}`}
                  className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:border-report-gold hover:shadow-card-hover"
                >
                  <span className="h-1 w-10 rounded-full bg-report-gold" aria-hidden="true" />
                  <h3 className="mt-4 font-serif text-xl font-semibold text-slate-900 group-hover:text-gold-600">
                    {v.name}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{v.description}</p>
                  <span className="mt-auto pt-4 text-sm font-semibold text-gold-600">Explore {v.name} →</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Schools, getting around, outdoors ────────────────── */}
      {abacoa && (
        <section className="px-6 py-16 sm:px-8 sm:py-20" aria-labelledby="abacoa-practical">
          <div className="mx-auto max-w-7xl">
            <p className={eyebrow}>The practical side</p>
            <h2 id="abacoa-practical" className={h2}>Schools, commute and outdoors</h2>
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {abacoa.schoolList && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
                  <h3 className="font-serif text-xl font-semibold text-slate-900">Schools</h3>
                  {abacoa.schoolOverview && <p className="mt-3 text-sm leading-7 text-slate-600">{abacoa.schoolOverview}</p>}
                  <a
                    href="https://www.greatschools.org/florida/jupiter/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex text-sm font-semibold text-gold-600 underline-offset-4 hover:text-gold-700 hover:underline"
                  >
                    See ratings and reviews on GreatSchools<span className="sr-only"> for Jupiter schools</span> →
                  </a>
                  <div className="mt-4 space-y-4">
                    {abacoa.schoolList.map((g) => (
                      <div key={g.category}>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-report-gold-text">{g.category}</p>
                        <ul className="mt-2 space-y-1 text-sm text-slate-700">
                          {g.schools.map((sc) => (<li key={sc.name}>{sc.name}</li>))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {abacoa.commuteTimes && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
                  <h3 className="font-serif text-xl font-semibold text-slate-900">Getting around</h3>
                  <dl className="mt-4 divide-y divide-slate-100">
                    {abacoa.commuteTimes.map((c) => (
                      <div key={c.destination} className="flex items-baseline justify-between gap-4 py-2.5 text-sm">
                        <dt className="text-slate-600">{c.destination}</dt>
                        <dd className="font-semibold text-slate-900">{c.time}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-3 text-xs text-slate-500">Approximate drive times; they vary with traffic and village.</p>
                </div>
              )}
              {abacoa.outdoorActivities && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
                  <h3 className="font-serif text-xl font-semibold text-slate-900">Parks and outdoors</h3>
                  <ul className="mt-4 space-y-2.5 text-sm leading-7 text-slate-600">
                    {abacoa.outdoorActivities.map((o) => (
                      <li key={o} className="flex items-start gap-3">
                        <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-report-gold" aria-hidden="true" />
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <p className="mt-6 text-xs leading-6 text-slate-500">
              School data and ratings provided by GreatSchools.org. School assignments and boundaries change. Confirm the current zone for any address with Palm Beach County Schools.
            </p>
          </div>
        </section>
      )}

      {/* ── Agent tip ────────────────────────────────────────── */}
      <section className="bg-navy-950 px-6 py-16 text-white sm:px-8 sm:py-20" aria-labelledby="abacoa-tip">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[auto_1fr] md:items-center">
          <Image
            src="/images/christine.jpg"
            alt="Christine Dekant, REALTOR"
            width={160}
            height={160}
            className="h-32 w-32 rounded-3xl object-cover object-top ring-2 ring-report-gold md:h-40 md:w-40"
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-report-gold-light">Abacoa Buyer Tip</p>
            <h2 id="abacoa-tip" className="mt-2 font-serif text-3xl font-semibold sm:text-4xl">
              Shop the village, not just the house
            </h2>
            <p className="mt-4 leading-8 text-white/90">
              Compare villages side by side before you fall for a floor plan. Abacoa has a master
              association plus village associations, so two homes a block apart can carry different
              rules and costs. Measure the real walk from the front door to Town Center. Then ask for
              the exact village’s HOA, rental and parking rules in writing before you write an offer.
            </p>
            <p className="mt-5 font-semibold">
              Christine Dekant <span className="font-normal text-white/80">· REALTOR® · </span>
              <a href="tel:+15617787042" className="text-report-gold-light hover:text-white">(561) 778-7042</a>
            </p>
          </div>
        </div>
      </section>

      {/* ── PUD / HOA ────────────────────────────────────────── */}
      <section className="px-6 py-16 sm:px-8 sm:py-20" aria-labelledby="abacoa-hoa">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[5fr_7fr]">
            <div>
              <p className={eyebrow}>PUD and associations</p>
              <h2 id="abacoa-hoa" className={h2}>How Abacoa is governed</h2>
              <p className="mt-4 leading-8 text-slate-600">
                Abacoa is a master-planned Planned Unit Development inside the City of Jupiter. It is
                made up of individual villages, and a village may have its own association with its own
                rules and costs on top of the community-wide one.
              </p>
              <p className="mt-4 leading-8 text-slate-600">
                We don’t quote fees or rules here because they change and differ by village. We’ll get
                you the current documents for the exact home you’re considering.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold text-slate-900">Buyer checklist</h3>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {CHECKLIST.map((c) => (
                  <li key={c.t} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
                    <p className="font-semibold text-slate-900">{c.t}</p>
                    <p className="mt-1.5 text-sm leading-7 text-slate-600">{c.d}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Market ───────────────────────────────────────────── */}
      <section className="bg-slate-50 px-6 py-16 sm:px-8 sm:py-20" aria-labelledby="abacoa-market">
        <div className="mx-auto max-w-7xl">
          <p className={eyebrow}>Market context</p>
          <h2 id="abacoa-market" className={h2}>Jupiter market context</h2>
          <p className="mt-3 max-w-3xl text-slate-600">
            The feed below reports Jupiter as a whole. It does not break out Abacoa, so read it as
            context for the area rather than as Abacoa numbers.{' '}
            <span className="font-semibold text-slate-700"><AbacoaRetrieved /></span>.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <div className="min-w-0">
              {trends && (
                <MarketTrendsBlock
                  city={trends.city}
                  heading="Jupiter, FL market trends"
                  caption="Live Ylopo market data for Jupiter, FL. Abacoa is not reported separately."
                  frameClassName="mt-4"
                />
              )}
            </div>
            <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
              <h3 className="font-serif text-xl font-semibold text-slate-900">What it means in Abacoa</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                <span className="font-semibold text-slate-900">Buyers:</span> use the town-wide trend for
                direction, then compare recent sales inside the specific village. Townhomes and single-family
                homes in Abacoa don’t move together.
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                <span className="font-semibold text-slate-900">Sellers:</span> price off your village’s recent
                closings and current competition, not a Jupiter average. Ask us for a village-level review.
              </p>
              <Link href="/contact" className="mt-4 inline-flex text-sm font-semibold text-gold-600 hover:text-gold-700">
                Request a village-level review →
              </Link>
            </aside>
          </div>
        </div>
      </section>

      {/* ── Guides & links ───────────────────────────────────── */}
      <section className="px-6 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <p className={eyebrow}>Keep exploring</p>
          <h2 className={h2}>Jupiter guides and next steps</h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <li>
              <Link href="/communities/jupiter" className="block rounded-2xl border border-slate-200 p-5 font-semibold text-slate-900 shadow-card transition hover:border-report-gold hover:text-gold-600">
                All of Jupiter →
              </Link>
            </li>
            {guides.map((a) => (
              <li key={a.slug}>
                <Link href={`/blog/${a.slug}`} className="block h-full rounded-2xl border border-slate-200 p-5 font-semibold leading-6 text-slate-900 shadow-card transition hover:border-report-gold hover:text-gold-600">
                  {a.h1}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/contact" className="block rounded-2xl border border-slate-200 p-5 font-semibold text-slate-900 shadow-card transition hover:border-report-gold hover:text-gold-600">
                Contact DO Homes Group →
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────── */}
      <section className="bg-navy-950 px-6 py-16 text-center text-white sm:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-3xl font-semibold sm:text-4xl">Ready to see Abacoa in person?</h2>
          <p className="mt-4 text-white/90">
            Tell us what matters, and we’ll walk the villages that fit with you.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href={ABACOA_SEARCH} target="_blank" rel="noopener noreferrer" className={btnPrimary}>
              Search Abacoa homes
            </a>
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
