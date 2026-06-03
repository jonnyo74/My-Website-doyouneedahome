import Link from 'next/link'
import Image from 'next/image'
import {
  getCommunityBySlug,
  getCommunityPaths,
  getLinkedNeighborhoods,
  getParentCity,
  cities,
} from '@/lib/communities'
import { getAgentQuotes } from '@/lib/agentQuotes'
import YlopoMarketTrendsWidget from '@/components/YlopoMarketTrendsWidget'
import YlopoResultsWidget from '@/components/YlopoResultsWidget'
import TransportMapWrapper from '@/components/TransportMapWrapper'
import CitySearchButtons from '@/components/CitySearchButtons'

const SEARCH_URL = 'https://search.doyouneedahome.com'

function searchUrl(city: string, opts: {
  minPrice?: number
  maxPrice?: number
  amenities?: string[]
  propertyTypes?: string[]
} = {}) {
  const c = encodeURIComponent(city)
  let url = `${SEARCH_URL}/search?area=${c}&hvl=3&s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=${c}&s[locations][0][state]=FL`
  if (opts.minPrice) url += `&s[minPrice]=${opts.minPrice}`
  if (opts.maxPrice) url += `&s[maxPrice]=${opts.maxPrice}`
  if (opts.amenities) opts.amenities.forEach((a, i) => { url += `&s[amenities][${i}]=${encodeURIComponent(a)}` })
  if (opts.propertyTypes) opts.propertyTypes.forEach((t, i) => { url += `&s[propertyTypes][${i}]=${encodeURIComponent(t)}` })
  return url
}

const MEMBERSHIP_AMENITY = 'sa_rapb_membership_required'
const SENIOR_AMENITY = 'sa_is_senior_community'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return getCommunityPaths()
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const community = getCommunityBySlug(slug)
  if (!community) return { title: 'Community not found' }
  return {
    title: `${community.name} Real Estate | DO Homes Group`,
    description: community.description,
  }
}

export default async function CommunityPage({ params }: Props) {
  const { slug } = await params
  const community = getCommunityBySlug(slug)

  if (!community) {
    return (
      <div className="min-h-screen bg-white px-6 py-24 sm:px-8">
        <h1 className="font-serif text-3xl font-semibold text-slate-900">Community not found</h1>
        <p className="mt-4 text-slate-600">The requested page does not exist.</p>
        <Link href="/communities" className="mt-6 inline-block text-gold-600 hover:text-gold-700">
          ← Back to Communities
        </Link>
      </div>
    )
  }

  const isCity = community.type === 'City'
  const linkedNeighborhoods = isCity ? getLinkedNeighborhoods(community) : []
  const parentCity = !isCity ? getParentCity(community.slug) : undefined
  const hasPhotos = community.photos && community.photos.length > 0
  const galleryPhotos = community.photos && community.photos.length > 1
    ? community.photos.slice(1, 6)
    : []
  // Alternate which agent leads per page
  const christineOnTop = community.slug.charCodeAt(0) % 2 === 0
  const quotes = getAgentQuotes(community.slug)
  // For neighborhoods, search by parent city not the neighborhood name
  const searchName = community.searchCity ?? community.name

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ──────────────────────────────────────────────────── */}
      {hasPhotos ? (
        <section className="relative h-[72vh] min-h-[520px] overflow-hidden">
          {/* Hero image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={community.photos![0]}
            alt={`${community.name} real estate`}
            className="h-full w-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end px-6 pb-12 sm:px-8">
            <div className="mx-auto w-full max-w-7xl">
              {/* Breadcrumb */}
              <nav className="mb-5 flex items-center gap-2 text-xs text-white/60">
                <Link href="/" className="transition hover:text-white">Home</Link>
                <span>/</span>
                <Link href="/communities" className="transition hover:text-white">Communities</Link>
                {parentCity && (
                  <>
                    <span>/</span>
                    <Link href={`/communities/${parentCity.slug}`} className="transition hover:text-white">
                      {parentCity.name}
                    </Link>
                  </>
                )}
                <span>/</span>
                <span className="text-white/90">{community.name}</span>
              </nav>

              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-400">
                {community.type} · {community.region}
              </p>
              <h1 className="mt-2 font-serif text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                {community.name} Real Estate
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
                {community.description}
              </p>
              <div className="mt-7 flex flex-wrap gap-4">
                <a
                  href={searchUrl(searchName)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full bg-gold-500 px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gold-600"
                >
                  Search {community.name} Listings →
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
                >
                  Talk to an Agent
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-gradient-to-br from-sky-50 via-blue-50 to-white px-6 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-7xl">
            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center gap-2 text-xs text-slate-500">
              <Link href="/" className="hover:text-gold-600">Home</Link>
              <span>/</span>
              <Link href="/communities" className="hover:text-gold-600">Communities</Link>
              {parentCity && (
                <>
                  <span>/</span>
                  <Link href={`/communities/${parentCity.slug}`} className="hover:text-gold-600">
                    {parentCity.name}
                  </Link>
                </>
              )}
              <span>/</span>
              <span className="text-slate-700">{community.name}</span>
            </nav>

            <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-600">
                  {community.type} · {community.region}
                </p>
                <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
                  {community.name} Real Estate
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                  {community.description}
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    href={searchUrl(searchName)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-full bg-gold-500 px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gold-600"
                  >
                    Search {community.name} Listings →
                  </a>
                  <Link
                    href="/contact"
                    className="inline-flex items-center rounded-full border border-slate-300 px-7 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-gold-500 hover:text-gold-600"
                  >
                    Talk to an Agent
                  </Link>
                </div>
              </div>

              {/* Sidebar CTA */}
              <aside className="hidden lg:block">
                <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-card">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-600">
                    Ready to buy or sell?
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Get a personalized market consultation from Christine or John — same-day response guaranteed.
                  </p>
                  <div className="mt-5 space-y-3">
                    <a
                      href={searchUrl(searchName)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center rounded-full bg-gold-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gold-600"
                    >
                      Search Listings
                    </a>
                    <Link
                      href="/contact"
                      className="flex w-full items-center justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-gold-500 hover:text-gold-600"
                    >
                      Contact Us
                    </Link>
                  </div>
                  <div className="mt-6 border-t border-slate-100 pt-5 space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Christine Dekant</p>
                      <a href="tel:+15617787042" className="mt-0.5 block text-sm text-slate-500 transition hover:text-gold-600">
                        (561) 778-7042
                      </a>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">John Oliver</p>
                      <a href="tel:+15617863630" className="mt-0.5 block text-sm text-slate-500 transition hover:text-gold-600">
                        (561) 786-3630
                      </a>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      )}

      {/* ── Live Listings ─────────────────────────────────────────── */}
      <section className="px-6 pt-14 pb-2 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-600">Live MLS Data</p>
              <h2 className="mt-1 font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">
                Homes for Sale in {community.name}
              </h2>
            </div>
            <a
              href={searchUrl(searchName, { minPrice: 600000 })}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-gold-600 transition hover:text-gold-700"
            >
              View all listings →
            </a>
          </div>
          <YlopoResultsWidget
            city={isCity ? community.name : (parentCity?.name ?? community.searchCity ?? community.name)}
            neighborhood={!isCity ? community.name : undefined}
          />

          {community.savedSearches && community.savedSearches.length > 0 && (
            <div className="mt-8">
              <CitySearchButtons
                eyebrow="Start Your Search"
                heading={`Popular Searches in ${community.name}`}
                searches={community.savedSearches}
              />
            </div>
          )}
        </div>
      </section>

      {/* ── Photo Gallery ──────────────────────────────────────────── */}
      {galleryPhotos.length > 0 && (
        <section className="px-6 pt-12 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-gold-600">
              A Look at {community.name}
            </p>

            {/* Desktop bento grid (4+ photos) */}
            {galleryPhotos.length >= 4 && (
              <div className="hidden overflow-hidden rounded-2xl md:grid md:h-[460px] md:grid-cols-3 md:grid-rows-2 md:gap-1.5">
                <div className="relative col-span-1 row-span-2 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={galleryPhotos[0]}
                    alt={`${community.name} 1`}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  />
                </div>
                {galleryPhotos.slice(1, 5).map((src, i) => (
                  <div key={i} className="relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`${community.name} ${i + 2}`}
                      className="h-full w-full object-cover transition duration-500 hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Desktop simple row (1–3 photos) */}
            {galleryPhotos.length < 4 && (
              <div className="hidden gap-1.5 overflow-hidden rounded-2xl md:flex md:h-[340px]">
                {galleryPhotos.map((src, i) => (
                  <div key={i} className="relative flex-1 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`${community.name} ${i + 1}`}
                      className="h-full w-full object-cover transition duration-500 hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Mobile 2-col grid */}
            <div className="grid grid-cols-2 gap-1.5 overflow-hidden rounded-2xl md:hidden">
              {galleryPhotos.slice(0, 4).map((src, i) => (
                <div key={i} className="relative aspect-[4/3] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`${community.name} ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Main content ───────────────────────────────────────────── */}
      <section className="px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[1fr_320px] lg:items-start">
            <div className="space-y-14">

              {/* Overview */}
              <div>
                <h2 className="font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">
                  About {community.name}
                </h2>
                <p className="mt-4 leading-8 text-slate-600">{community.overview}</p>
              </div>

              {/* Agent blurb — top */}
              <AgentBlurb
                name={christineOnTop ? 'Christine Dekant' : 'John Oliver'}
                credentials={christineOnTop ? 'REALTOR® · RENE · GRI · CLA' : 'REALTOR® · ABR · RENE · SRS'}
                photo={christineOnTop ? '/images/christine.jpg' : '/images/john.jpg'}
                phone={christineOnTop ? '(561) 778-7042' : '(561) 786-3630'}
                phoneHref={christineOnTop ? 'tel:+15617787042' : 'tel:+15617863630'}
                quote={christineOnTop ? quotes.christineQuote : quotes.johnQuote}
              />

              {/* Sub-Neighborhoods */}
              {community.subNeighborhoods && community.subNeighborhoods.length > 0 && (
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-slate-900">Neighborhoods Within {community.name}</h2>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {community.subNeighborhoods.map((n) => (
                      <div key={n.name} className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                        <p className="font-semibold text-slate-900">{n.name}</p>
                        <p className="mt-1.5 text-sm leading-6 text-slate-600">{n.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Highlights */}
              {community.highlights && community.highlights.length > 0 && (
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-slate-900">
                    Why {community.name}?
                  </h2>
                  <ul className="mt-5 space-y-3">
                    {community.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-3">
                        <span className="mt-1 flex-shrink-0 text-gold-500">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                            <path d="M13.485 3.515a1 1 0 0 1 0 1.414l-7 7a1 1 0 0 1-1.414 0l-3-3a1 1 0 1 1 1.414-1.414L6 9.808l6.293-6.293a1 1 0 0 1 1.192 0z" />
                          </svg>
                        </span>
                        <span className="text-sm leading-7 text-slate-600">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Lifestyle */}
              {community.lifestyle && (
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-slate-900">The {community.name} Lifestyle</h2>
                  <p className="mt-4 leading-8 text-slate-600">{community.lifestyle}</p>
                </div>
              )}

              {/* What Locals Love */}
              {community.localLoves && community.localLoves.length > 0 && (
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-slate-900">What Locals Love</h2>
                  <ul className="mt-5 space-y-3">
                    {community.localLoves.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-1 flex-shrink-0 text-gold-500">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                            <path d="M13.485 3.515a1 1 0 0 1 0 1.414l-7 7a1 1 0 0 1-1.414 0l-3-3a1 1 0 1 1 1.414-1.414L6 9.808l6.293-6.293a1 1 0 0 1 1.192 0z" />
                          </svg>
                        </span>
                        <span className="text-sm leading-7 text-slate-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quick Search Shortcuts */}
              {community.hasMembershipCommunities && (
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-slate-900">Quick Property Searches</h2>
                  <p className="mt-2 text-sm text-slate-500">Filtered searches for the most common buyer requests in {community.name}.</p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <a href={searchUrl(searchName, { propertyTypes: ['condo'], minPrice: 450000 })} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-card transition hover:border-gold-500/40 hover:shadow-card-hover">
                      <div>
                        <p className="font-semibold text-slate-900">Condos & Townhomes</p>
                        <p className="text-xs text-slate-500">$450K+ · All condo listings</p>
                      </div>
                      <span className="text-gold-600">→</span>
                    </a>
                    <a href={searchUrl(searchName, { amenities: [MEMBERSHIP_AMENITY] })} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-card transition hover:border-gold-500/40 hover:shadow-card-hover">
                      <div>
                        <p className="font-semibold text-slate-900">Membership Communities</p>
                        <p className="text-xs text-slate-500">Golf clubs · Country clubs · Private communities</p>
                      </div>
                      <span className="text-gold-600">→</span>
                    </a>
                    <a href={searchUrl(searchName, { amenities: [SENIOR_AMENITY] })} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-card transition hover:border-gold-500/40 hover:shadow-card-hover">
                      <div>
                        <p className="font-semibold text-slate-900">55+ Active Adult</p>
                        <p className="text-xs text-slate-500">Age-restricted communities</p>
                      </div>
                      <span className="text-gold-600">→</span>
                    </a>
                    <a href={searchUrl(searchName, { minPrice: 600000 })} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-card transition hover:border-gold-500/40 hover:shadow-card-hover">
                      <div>
                        <p className="font-semibold text-slate-900">All Homes $600K+</p>
                        <p className="text-xs text-slate-500">Every active listing above $600K</p>
                      </div>
                      <span className="text-gold-600">→</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Price Ranges */}
              {community.priceRanges && community.priceRanges.length > 0 && (
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-slate-900">
                    {community.name} Home Prices
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">Typical price ranges by home type in today's market.</p>
                  <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
                    {community.priceRanges.map((pr, i) => (
                      <a
                        key={pr.type}
                        href={searchUrl(searchName, { minPrice: pr.minPrice, maxPrice: pr.maxPrice, amenities: pr.amenities })}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-between px-6 py-4 transition hover:bg-gold-50 ${
                          i % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                        }`}
                      >
                        <span className="text-sm font-medium text-slate-700">{pr.type}</span>
                        <span className="text-sm font-semibold text-gold-600">{pr.range} →</span>
                      </a>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-slate-400">
                    Ranges are approximate and reflect current market conditions. Contact us for a precise valuation.
                  </p>
                  <a
                    href={searchUrl(searchName)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex text-sm font-semibold text-gold-600 transition hover:text-gold-700"
                  >
                    Browse active listings →
                  </a>
                </div>
              )}

              {/* Neighborhoods */}
              {linkedNeighborhoods.length > 0 && (
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-slate-900">
                    Neighborhoods & Communities in {community.name}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-slate-500">
                    Explore the featured neighborhoods and gated communities within {community.name}.
                    Each community has its own character, amenity set, and price profile.
                  </p>
                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    {linkedNeighborhoods.map((n) => (
                      <Link
                        key={n.slug}
                        href={`/communities/${n.slug}`}
                        className="group flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:border-gold-500/40 hover:shadow-card-hover"
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-600">
                          {n.type}
                        </p>
                        <h3 className="text-base font-semibold text-slate-900 group-hover:text-gold-600 transition">
                          {n.name}
                        </h3>
                        <p className="text-sm leading-6 text-slate-500">{n.description}</p>
                        <span className="mt-auto text-sm font-semibold text-gold-600 transition group-hover:text-gold-700">
                          Explore {n.name} →
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Schools */}
              {(community.schoolOverview || community.schoolList) && (
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-slate-900">Schools</h2>
                  {community.schoolOverview && (
                    <p className="mt-3 leading-8 text-slate-600">{community.schoolOverview}</p>
                  )}
                  {community.schoolList && (
                    <div className="mt-6 space-y-6">
                      {community.schoolList.map((group) => (
                        <div key={group.category}>
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">{group.category}</p>
                          <ul className="mt-3 space-y-1.5">
                            {group.schools.map((s) => (
                              <li key={s.name}>
                                {s.url ? (
                                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-sm leading-7 text-gold-600 transition hover:text-gold-700 hover:underline">
                                    · {s.name} ↗
                                  </a>
                                ) : (
                                  <span className="text-sm leading-7 text-slate-600">· {s.name}</span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Hospitals */}
              {community.hospitals && community.hospitals.length > 0 && (
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-slate-900">Nearby Hospitals</h2>
                  <div className="mt-5 space-y-3">
                    {community.hospitals.map((h) => (
                      <div key={h.name} className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5">
                        <div>
                          <a href={h.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-gold-600 transition hover:text-gold-700 hover:underline">
                            {h.name} ↗
                          </a>
                          {h.note && <p className="mt-1 text-sm text-slate-500">{h.note}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Commute Times + Map */}
              {(community.commuteTimes?.length || community.lat) && (
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-slate-900">Commute & Connectivity</h2>
                  {community.commuteTimes && community.commuteTimes.length > 0 && (
                    <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
                      {community.commuteTimes.map((c, i) => (
                        <div key={c.destination} className={`flex items-center justify-between px-6 py-3.5 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                          <span className="text-sm text-slate-700">{c.destination}</span>
                          <span className="text-sm font-semibold text-gold-600">{c.time}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {community.lat && community.lng && (
                    <div className="mt-6">
                      <p className="mb-3 text-sm text-slate-500">Airports, Brightline, and Tri-Rail near {community.name}</p>
                      <TransportMapWrapper lat={community.lat} lng={community.lng} cityName={community.name} />
                    </div>
                  )}
                </div>
              )}

              {/* Outdoor Activities */}
              {community.outdoorActivities && community.outdoorActivities.length > 0 && (
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-slate-900">Parks & Outdoor Activities</h2>
                  <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                    {community.outdoorActivities.map((item) => (
                      <li key={item} className="text-sm leading-7 text-slate-600">· {item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Dining */}
              {community.dining && community.dining.length > 0 && (
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-slate-900">Local Dining</h2>
                  <ul className="mt-5 space-y-2">
                    {community.dining.map((item) => (
                      <li key={item} className="text-sm leading-7 text-slate-600">· {item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Hidden Gems */}
              {community.hiddenGems && community.hiddenGems.length > 0 && (
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-slate-900">Hidden Gems</h2>
                  <ul className="mt-5 space-y-3">
                    {community.hiddenGems.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-1 flex-shrink-0 text-gold-500">✦</span>
                        <span className="text-sm leading-7 text-slate-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Key Links */}
              {community.keyLinks && community.keyLinks.length > 0 && (
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-slate-900">Local Resources & Links</h2>
                  {(() => {
                    const categories = [...new Set(community.keyLinks!.map(l => l.category))]
                    return (
                      <div className="mt-6 space-y-6">
                        {categories.map(cat => (
                          <div key={cat}>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">{cat}</p>
                            <div className="mt-3 grid gap-2 sm:grid-cols-2">
                              {community.keyLinks!.filter(l => l.category === cat).map(link => (
                                <a
                                  key={link.url}
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-gold-500/40 hover:bg-white hover:text-gold-600"
                                >
                                  {link.label}
                                  <span className="ml-2 flex-shrink-0 text-slate-400">↗</span>
                                </a>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  })()}
                </div>
              )}

              {/* Quick Facts */}
              <div>
                <h2 className="font-serif text-2xl font-semibold text-slate-900">
                  Market Snapshot
                </h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {community.quickFacts.map((fact) => (
                    <div key={fact.label} className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
                        {fact.label}
                      </p>
                      <p className="mt-2 text-sm leading-7 text-slate-600">{fact.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Agent blurb — bottom */}
              <AgentBlurb
                name={christineOnTop ? 'John Oliver' : 'Christine Dekant'}
                credentials={christineOnTop ? 'REALTOR® · ABR · RENE · SRS' : 'REALTOR® · RENE · GRI · CLA'}
                photo={christineOnTop ? '/images/john.jpg' : '/images/christine.jpg'}
                phone={christineOnTop ? '(561) 786-3630' : '(561) 778-7042'}
                phoneHref={christineOnTop ? 'tel:+15617863630' : 'tel:+15617787042'}
                quote={christineOnTop ? quotes.johnQuote : quotes.christineQuote}
              />

              {/* Market Trends */}
              <div>
                <h2 className="font-serif text-2xl font-semibold text-slate-900">
                  Market Trends
                </h2>
                <p className="mt-2 text-sm text-slate-500">Live market data for {community.name}, FL.</p>
                <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
                  <YlopoMarketTrendsWidget city={isCity ? community.name : (parentCity?.name ?? community.name)} />
                </div>
              </div>

              {/* Parent city link (neighborhood pages only) */}
              {parentCity && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-600">
                    Part of {parentCity.name}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {community.name} is a community within {parentCity.name}. Explore the full {parentCity.name} market for context on pricing, schools, and lifestyle.
                  </p>
                  <Link
                    href={`/communities/${parentCity.slug}`}
                    className="mt-4 inline-flex text-sm font-semibold text-gold-600 transition hover:text-gold-700"
                  >
                    Explore {parentCity.name} →
                  </Link>
                </div>
              )}
            </div>

            {/* Sticky sidebar (desktop) */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-card">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-600">
                    Your Local Experts
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Our team knows {community.name} inside and out. Tell us what you're looking for
                    and we'll send you homes that match before they hit Zillow.
                  </p>
                  <div className="mt-5 space-y-3">
                    <a
                      href={searchUrl(searchName)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center rounded-full bg-gold-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gold-600"
                    >
                      Search Listings
                    </a>
                    <Link
                      href="/contact"
                      className="flex w-full items-center justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-gold-500 hover:text-gold-600"
                    >
                      Contact Us
                    </Link>
                  </div>
                  <div className="mt-6 border-t border-slate-100 pt-5 space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Christine Dekant</p>
                      <p className="text-xs text-slate-400">REALTOR® · RENE · GRI · CLA</p>
                      <a href="tel:+15617787042" className="mt-1 block text-sm text-slate-500 transition hover:text-gold-600">
                        (561) 778-7042
                      </a>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">John Oliver</p>
                      <p className="text-xs text-slate-400">REALTOR® · ABR · RENE · SRS</p>
                      <a href="tel:+15617863630" className="mt-1 block text-sm text-slate-500 transition hover:text-gold-600">
                        (561) 786-3630
                      </a>
                    </div>
                  </div>
                </div>

                {/* Nearby communities */}
                {isCity && (
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-600">
                      Nearby Communities
                    </p>
                    <ul className="mt-4 space-y-2">
                      {cities
                        .filter((c) => c.slug !== community.slug)
                        .slice(0, 6)
                        .map((c) => (
                          <li key={c.slug}>
                            <Link
                              href={`/communities/${c.slug}`}
                              className="text-sm text-slate-600 transition hover:text-gold-600"
                            >
                              {c.name} →
                            </Link>
                          </li>
                        ))}
                    </ul>
                    <Link
                      href="/communities"
                      className="mt-4 block text-xs font-semibold text-gold-600 transition hover:text-gold-700"
                    >
                      All Communities →
                    </Link>
                  </div>
                )}

                <Link
                  href="/communities"
                  className="block text-sm text-slate-400 transition hover:text-slate-600"
                >
                  ← All Communities
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Mobile CTA */}
      <section className="px-6 pb-16 lg:hidden sm:px-8">
        <div className="mx-auto max-w-7xl rounded-3xl border border-slate-200 bg-white p-7 shadow-card">
          <div className="space-y-3">
            <a
              href={searchUrl(searchName)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center rounded-full bg-gold-500 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-gold-600"
            >
              Search {community.name} Listings →
            </a>
            <Link
              href="/contact"
              className="flex w-full items-center justify-center rounded-full border border-slate-200 px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-gold-500 hover:text-gold-600"
            >
              Talk to an Agent
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom search banner */}
      <section className="bg-gradient-to-br from-gold-700 to-gold-500 px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-100">
            {community.name} Listings
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-white sm:text-4xl">
            Ready to Find Your Home?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-blue-100">
            Browse all active MLS listings in {community.name} — updated daily. Or call us and
            we'll hand-pick homes that match your criteria.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href={searchUrl(searchName)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-gold-700 shadow transition hover:bg-blue-50"
            >
              Search {community.name} Listings
            </a>
            <a
              href="tel:+15617837733"
              className="inline-flex items-center rounded-full border border-white/40 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-white/80 hover:bg-white/10"
            >
              Call (561) 783-7733
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

function AgentBlurb({
  name, credentials, photo, phone, phoneHref, quote,
}: {
  name: string; credentials: string; photo: string; phone: string; phoneHref: string; quote: string
}) {
  return (
    <div className="flex gap-6 rounded-3xl border border-slate-200 bg-white p-7 shadow-card">
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl">
        <Image src={photo} alt={name} fill className="object-cover object-top" sizes="80px" />
      </div>
      <div className="flex flex-col justify-center gap-2">
        <div>
          <p className="font-semibold text-slate-900">{name}</p>
          <p className="text-xs text-gold-600">{credentials}</p>
        </div>
        <p className="text-sm leading-7 text-slate-600 italic">"{quote}"</p>
        <a href={phoneHref} className="text-sm font-semibold text-gold-600 transition hover:text-gold-700">
          {phone}
        </a>
      </div>
    </div>
  )
}
