import Link from 'next/link'
import Image from 'next/image'
import { getCommunityBySlug } from '@/lib/communities'
import { VILLAGES } from '@/lib/abacoaVillages'
import { marketTrendsCity } from '@/lib/articles'
import MarketTrendsBlock from '@/components/MarketTrendsBlock'
import AbacoaScopeWidget from '@/components/AbacoaScopeWidget'
import { getAbacoaScope, scopeFullSearchUrl } from '@/lib/abacoaScopes'
import YlopoInit from '@/components/YlopoInit'
import AbacoaListings from '@/components/AbacoaListings'
import AbacoaRetrieved from '@/components/AbacoaRetrieved'
import GreatSchoolsCard from '@/components/GreatSchoolsCard'
import AbacoaMapSection from '@/components/abacoaMap/AbacoaMapSection'

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

export default function AbacoaVillageLanding({ slug }: { slug: string }) {
  const v = getCommunityBySlug(slug)
  const c = VILLAGES[slug]
  if (!v || !c) return null
  const trends = marketTrendsCity('Jupiter')
  // Every listing surface on this page reads the same verified scope. A page
  // with no scope (Dakota Drive, a street guide) shows no inventory at all.
  const scope = getAbacoaScope(slug)
  const searchUrl = scope ? scopeFullSearchUrl(scope) : undefined
  const hasOwnPhotos = Boolean(v.photos?.length)
  const hero = hasOwnPhotos
    ? { src: v.photos![0], alt: `${v.name}, an Abacoa village in Jupiter, Florida`, caption: '' }
    : FALLBACK_HERO
  const gallery = (v.photos ?? []).slice(1)
  const faqs = c.faqs
  const siblings = c.related
    .map((s) => getCommunityBySlug(s))
    .filter((x): x is NonNullable<typeof x> => Boolean(x))
  const h1 = c.heading ?? `${v.name} Homes for Sale`

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
              <li><Link href="/communities" className="hover:text-white">Communities</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/communities/jupiter" className="hover:text-white">Jupiter</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/communities/abacoa" className="hover:text-white">Abacoa</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-white">{v.name}</li>
            </ol>
          </nav>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-report-gold-light">
            {scope ? 'An Abacoa village' : 'A street guide'} · Jupiter, Florida
          </p>
          <h1 className="mt-3 font-serif text-5xl font-semibold leading-[1.05] text-white sm:text-6xl">
            {h1}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-white/90">{c.tagline}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:gap-4">
            {scope ? (
              <a href="#listings" className={btnPrimary}>See {v.name} listings</a>
            ) : (
              <Link href="/communities/canterbury-place" className={btnPrimary}>Canterbury Place homes for sale</Link>
            )}
            <Link href="/contact" className={btnGhostDark}>Speak with a local expert</Link>
          </div>
          {hero.caption && <p className="mt-5 text-xs text-white/75">Photo: {hero.caption}</p>}
        </div>
      </section>

      {/* Listings first. Only routes with a verified scope show inventory. */}
      {scope ? (
        <section id="listings" className="scroll-mt-24 px-6 py-14 sm:px-8 sm:py-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className={eyebrow}>Live MLS feed</p>
                <h2 className={h2}>{c.listingsHeading ?? `Homes for sale in ${v.name}`}</h2>
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
            <YlopoInit key={`init-${slug}`} city="Jupiter" />
            <AbacoaListings key={`listings-${slug}`} slug={slug}>
              <AbacoaScopeWidget slug={slug} />
            </AbacoaListings>
            <p className="mt-4 text-sm text-slate-600">
              Looking beyond {v.name}?{' '}
              <Link href="/communities/abacoa#listings" className="font-semibold text-gold-600 hover:text-gold-700">
                Browse all of Abacoa →
              </Link>
            </p>
          </div>
        </section>
      ) : (
        <section id="listings" className="scroll-mt-24 px-6 py-14 sm:px-8 sm:py-16">
          <div className="mx-auto max-w-7xl rounded-3xl border border-slate-200 bg-slate-50 p-8">
            <p className={eyebrow}>Where to search</p>
            <h2 className={h2}>Search the village, not the street</h2>
            <p className="mt-3 max-w-3xl leading-8 text-slate-600">
              The MLS files a home under its village, not its street, so Dakota Drive is not a
              searchable area. We do not show a Dakota Drive listing feed because no filter can tell a
              Canterbury Place townhome from a Somerset condo on the same street.
            </p>
            <ul className="mt-5 flex flex-wrap gap-3">
              <li>
                <Link href="/communities/canterbury-place#listings" className={btnPrimary}>
                  Canterbury Place homes for sale →
                </Link>
              </li>
              <li>
                <Link
                  href="/communities/abacoa#listings"
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 px-7 py-3.5 text-sm font-semibold text-slate-800 transition hover:border-report-gold hover:text-gold-600"
                >
                  All Abacoa homes for sale
                </Link>
              </li>
            </ul>
          </div>
        </section>
      )}

      {!scope && (
        <section className="px-6 pb-4 sm:px-8" aria-label="Dakota Drive map">
          <div className="mx-auto max-w-7xl">
            <AbacoaMapSection view={{ view: 'dakota' }} id="dakota-map" />
          </div>
        </section>
      )}

      {/* About */}
      <section className="px-6 py-14 sm:px-8 sm:py-16" aria-labelledby="village-about">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          <div>
            <p className={eyebrow}>{scope ? 'About the village' : 'The street guide'}</p>
            <h2 id="village-about" className={h2}>{scope ? `About ${v.name}` : 'How Dakota Drive addresses are filed'}</h2>
            <div className="mt-5 space-y-4 leading-8 text-slate-600">
              {c.story.map((p) => (<p key={p.slice(0, 24)}>{p}</p>))}
            </div>
            {c.guideLink && (
              <p className="mt-5 text-sm leading-7 text-slate-600">
                <Link href={c.guideLink.href} className="font-semibold text-gold-600 hover:text-gold-700">
                  {c.guideLink.text} →
                </Link>
              </p>
            )}
          </div>
          <div>
            <p className={eyebrow}>{scope ? 'Living here' : 'Along the street'}</p>
            <h2 className={h2}>{scope ? `What it’s like to live in ${v.name}` : 'Villages along Dakota Drive'}</h2>
            <p className="mt-5 leading-8 text-slate-600">{c.living}</p>
            {c.highlights.length > 0 && (
              <ul className="mt-6 space-y-3">
                {c.highlights.map((h) => (
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
          <h2 id="village-glance" className={h2}>{scope ? `${v.name} at a glance` : 'Dakota Drive at a glance'}</h2>
          <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {c.facts.map((f) => (
              <div key={f.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-report-gold-text">{f.label}</dt>
                <dd className="mt-2 text-sm leading-7 text-slate-700">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Location + schools */}
      <section className="bg-slate-50 px-6 py-14 sm:px-8 sm:py-16" aria-labelledby="village-practical">
        <div className="mx-auto max-w-7xl">
          <p className={eyebrow}>The practical side</p>
          <h2 id="village-practical" className={h2}>Where it sits and schools</h2>
          {scope && (
            <div className="mt-8">
              <AbacoaMapSection view={{ view: 'village', slug }} id="village-map" />
            </div>
          )}
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
              <h3 className="font-serif text-xl font-semibold text-slate-900">Where it sits</h3>
              <ul className="mt-4 space-y-2.5 text-sm leading-7 text-slate-600">
                {c.location.map((l) => (
                  <li key={l} className="flex items-start gap-3">
                    <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-report-gold" aria-hidden="true" />
                    {l}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-slate-500">
                Distances to Town Center, the beaches and I-95 vary by address, so we measure them for you on a tour.
              </p>
            </div>
            <GreatSchoolsCard citySlug="jupiter" cityName={v.name} />
          </div>
          <p className="mt-4 text-xs leading-6 text-slate-500">
            School assignments follow the address, not the village, and boundaries change. Check any address with the{' '}
            <a
              href="https://www.palmbeachschools.org/studentsparents/student-registration/student-enrollment-and-demographics"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-slate-700"
            >
              Palm Beach County Schools attendance boundary maps (elementary, middle and high)
            </a>
            .
          </p>
        </div>
      </section>

      {/* Association checklist */}
      <section className="px-6 py-14 sm:px-8 sm:py-16" aria-labelledby="village-hoa">
        <div className="mx-auto max-w-7xl">
          <p className={eyebrow}>Associations</p>
          <h2 id="village-hoa" className={h2}>{scope ? `Before you buy in ${v.name}` : 'What to verify for this address'}</h2>
          <p className="mt-3 max-w-3xl leading-8 text-slate-600">{c.association}</p>
          <p className="mt-4 text-sm font-semibold text-slate-900">Checklist for any address:</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {CHECKLIST.map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-7 text-slate-700 shadow-card">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-report-gold" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50 px-6 py-14 sm:px-8 sm:py-16" aria-labelledby="village-faq">
        <div className="mx-auto max-w-4xl">
          <h2 id="village-faq" className={h2}>{scope ? `Questions about ${v.name}` : 'Questions about Dakota Drive addresses'}</h2>
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

      {/* Market */}
      {trends && (
        <section className="px-6 py-14 sm:px-8 sm:py-16" aria-labelledby="village-market">
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
                headingLevel="h3"
                caption="Live Ylopo market data for Jupiter, FL. Individual villages are not reported separately."
                frameClassName="mt-4"
              />
            </div>
          </div>
        </section>
      )}

      {/* More villages */}
      <section className="px-6 py-14 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <p className={eyebrow}>Keep exploring</p>
          <h2 className={h2}>{scope ? 'Other Abacoa villages' : 'Explore the villages'}</h2>
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
          <h2 className="font-serif text-3xl font-semibold sm:text-4xl">
            {scope ? `Want to tour ${v.name}?` : 'Want help with a Dakota Drive address?'}
          </h2>
          <p className="mt-3 text-white/90">Tell us what matters and we’ll walk it with you.</p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {searchUrl ? (
              <a href={searchUrl} target="_blank" rel="noopener noreferrer" className={btnPrimary}>Search {v.name} homes</a>
            ) : (
              <Link href="/communities/canterbury-place#listings" className={btnPrimary}>Canterbury Place homes</Link>
            )}
            <Link href="/contact" className={btnGhostDark}>Speak with a local expert</Link>
          </div>
        </div>
      </section>

      <section className="bg-white" aria-labelledby="village-sources">
        <div className="mx-auto max-w-4xl px-6 pt-10">
          <h2 id="village-sources" className="text-sm font-semibold text-slate-700">
            Sources for this page
          </h2>
          <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm">
            {c.sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-gold-600 underline underline-offset-2 hover:text-gold-700">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <p className="text-xs leading-6 text-slate-500">
            Details on this page were compiled in October 2026 and checked in November 2026 against the Abacoa
            Property Owners’ Assembly, village association websites, Florida Division of Corporations and county
            records; details taken only from listings are marked as such. Association rules, fees, amenities and
            school assignments change often and are for information only. Verify anything that matters to
            your decision directly with the association, the school district and the Town of Jupiter.
            DO Homes Group at Premier Brokers International is committed to Equal Housing Opportunity.
          </p>
        </div>
      </section>
    </div>
  )
}
