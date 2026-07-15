import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getListingBySlug, getListingPaths, type ListingAgentInfo } from '@/lib/listings'
import { getCommunityBySlug } from '@/lib/communities'
import YlopoInit from '@/components/YlopoInit'
import YlopoResultsWidget from '@/components/YlopoResultsWidget'
import { SITE_URL } from '@/lib/site'

const SITE = SITE_URL
const OFFICE_PHONE = { display: '(561) 783-7733', href: 'tel:+15617837733' }
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

const currency = (n: number) => `$${n.toLocaleString('en-US')}`

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return getListingPaths()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const listing = getListingBySlug(slug)
  if (!listing) return { title: 'Listing not found' }

  const url = `${SITE}/listings/${listing.slug}`
  const title = listing.metaTitle ?? `${listing.address} | ${listing.city}, ${listing.state} Real Estate`
  const description =
    listing.metaDescription ??
    `${listing.propertyType} in ${listing.city}, ${listing.state}. ${listing.beds} bed, ${listing.bathsFull} bath, ${listing.livingSqft.toLocaleString()} sq ft. ${currency(listing.price)}.`
  const ogImage = listing.heroPhoto ? `${SITE}${encodeURI(listing.heroPhoto.src)}` : `${SITE}/images/og-image.jpg`

  return {
    title,
    description,
    alternates: { canonical: `/listings/${listing.slug}` },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: listing.address }],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function ListingPage({ params }: Props) {
  const { slug } = await params
  const listing = getListingBySlug(slug)
  if (!listing) notFound()

  const community = getCommunityBySlug(listing.citySlug)
  const url = `${SITE}/listings/${listing.slug}`
  const fullBaths = listing.bathsFull
  const halfBaths = listing.bathsHalf
  const bathsDisplay = halfBaths > 0 ? `${fullBaths}.${halfBaths === 1 ? 5 : halfBaths}` : `${fullBaths}`
  const heroPhoto = listing.heroPhoto
  const contactCtx = `listing=${encodeURIComponent(listing.address)}&source=listing-page&mls=${listing.mlsNumber}`

  // ---- JSON-LD structured data ----
  const listingSchema = {
    '@context': 'https://schema.org',
    '@type': 'SingleFamilyResidence',
    name: listing.address,
    address: {
      '@type': 'PostalAddress',
      streetAddress: listing.address,
      addressLocality: listing.city,
      addressRegion: listing.state,
      postalCode: listing.zip,
      addressCountry: 'US',
    },
    numberOfRooms: listing.beds,
    numberOfBathroomsTotal: fullBaths + halfBaths,
    floorSize: { '@type': 'QuantitativeValue', value: listing.livingSqft, unitCode: 'FTK' },
    yearBuilt: listing.yearBuilt,
    url,
    offers: {
      '@type': 'Offer',
      price: listing.price,
      priceCurrency: 'USD',
      availability: listing.status === 'Active' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url,
      seller: {
        '@type': 'RealEstateAgent',
        name: listing.listingAgent.name,
        telephone: listing.listingAgent.phone,
        email: listing.listingAgent.email,
      },
    },
  }
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
      { '@type': 'ListItem', position: 2, name: `${listing.city} Real Estate`, item: `${SITE}/communities/${listing.citySlug}` },
      { '@type': 'ListItem', position: 3, name: listing.address, item: url },
    ],
  }

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listingSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* ── Hero ──────────────────────────────────────────────────── */}
      {heroPhoto ? (
        <section className="relative h-[76vh] min-h-[560px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroPhoto.src}
            alt={heroPhoto.alt}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end px-6 pb-12 sm:px-8">
            <div className="mx-auto w-full max-w-7xl">
              <nav className="mb-5 flex flex-wrap items-center gap-2 text-xs text-white/60">
                <Link href="/" className="transition hover:text-white">Home</Link>
                <span>/</span>
                <Link href={`/communities/${listing.citySlug}`} className="transition hover:text-white">
                  {listing.city} Real Estate
                </Link>
                <span>/</span>
                <span className="text-white/90">{listing.address}</span>
              </nav>

              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                  {listing.status}
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
                  {listing.subdivision ? `${listing.subdivision} · ` : ''}{listing.city}, {listing.state}
                </span>
              </div>

              <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                {listing.address}
              </h1>
              <p className="mt-2 text-lg text-white/80">
                {listing.city}, {listing.state} {listing.zip}
              </p>

              <p className="mt-5 font-serif text-3xl font-semibold text-white sm:text-4xl">
                {currency(listing.price)}
              </p>

              <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-sm text-white/90">
                <span><strong className="font-semibold text-white">{listing.beds}</strong> Beds</span>
                <span><strong className="font-semibold text-white">{bathsDisplay}</strong> Baths</span>
                <span><strong className="font-semibold text-white">{listing.livingSqft.toLocaleString()}</strong> Sq Ft</span>
                <span><strong className="font-semibold text-white">{listing.propertyType}</strong></span>
              </div>

              <div className="mt-7 flex flex-wrap gap-4">
                <a
                  href={`/contact?${contactCtx}&action=schedule-showing`}
                  className="inline-flex items-center rounded-full bg-gold-500 px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gold-600"
                >
                  Schedule a Private Showing
                </a>
                <a
                  href={`mailto:${listing.listingAgent.email}?subject=${encodeURIComponent(`Question about ${listing.address}`)}&body=${encodeURIComponent(`Hi ${listing.listingAgent.name}, I'd like more information about ${listing.address}, ${listing.city}, ${listing.state} ${listing.zip} (MLS# ${listing.mlsNumber}).`)}`}
                  className="inline-flex items-center rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
                >
                  Ask a Question
                </a>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-gradient-to-br from-sky-50 via-blue-50 to-white px-6 py-14 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <Link href="/" className="hover:text-gold-600">Home</Link>
              <span>/</span>
              <Link href={`/communities/${listing.citySlug}`} className="hover:text-gold-600">
                {listing.city} Real Estate
              </Link>
              <span>/</span>
              <span className="text-slate-700">{listing.address}</span>
            </nav>

            <div className="grid gap-10 lg:grid-cols-[1fr_340px] lg:items-start">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                    {listing.status}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
                    {listing.subdivision ? `${listing.subdivision} · ` : ''}{listing.city}, {listing.state}
                  </span>
                </div>

                <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
                  {listing.address}
                </h1>
                <p className="mt-2 text-lg text-slate-600">
                  {listing.city}, {listing.state} {listing.zip}
                </p>

                <p className="mt-6 font-serif text-3xl font-semibold text-gold-700 sm:text-4xl">
                  {currency(listing.price)}
                </p>

                <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-700">
                  <span><strong className="font-semibold text-slate-900">{listing.beds}</strong> Beds</span>
                  <span><strong className="font-semibold text-slate-900">{bathsDisplay}</strong> Baths</span>
                  <span><strong className="font-semibold text-slate-900">{listing.livingSqft.toLocaleString()}</strong> Sq Ft</span>
                  <span><strong className="font-semibold text-slate-900">{listing.propertyType}</strong></span>
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    href={`/contact?${contactCtx}&action=schedule-showing`}
                    className="inline-flex items-center rounded-full bg-gold-500 px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gold-600"
                  >
                    Schedule a Private Showing
                  </a>
                  <a
                    href={`mailto:${listing.listingAgent.email}?subject=${encodeURIComponent(`Question about ${listing.address}`)}&body=${encodeURIComponent(`Hi ${listing.listingAgent.name}, I'd like more information about ${listing.address}, ${listing.city}, ${listing.state} ${listing.zip} (MLS# ${listing.mlsNumber}).`)}`}
                    className="inline-flex items-center rounded-full border border-slate-300 px-7 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-gold-500 hover:text-gold-600"
                  >
                    Ask a Question
                  </a>
                </div>
              </div>

              {/* Sidebar CTA */}
              <aside className="hidden lg:block">
                <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-card">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-600">
                    Interested in this home?
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Reach out to the listing team directly for a private showing, the MLS sheet, or
                    answers on financing and ownership costs.
                  </p>
                  <div className="mt-5 space-y-3">
                    <a
                      href={`/contact?${contactCtx}&action=schedule-showing`}
                      className="flex w-full items-center justify-center rounded-full bg-gold-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gold-600"
                    >
                      Schedule a Showing
                    </a>
                    <a
                      href={listing.listingAgent.phoneHref}
                      className="flex w-full items-center justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-gold-500 hover:text-gold-600"
                    >
                      Call {listing.listingAgent.phone}
                    </a>
                  </div>
                  <div className="mt-6 border-t border-slate-100 pt-5 space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{listing.listingAgent.name}</p>
                      <p className="text-xs text-slate-400">{listing.listingAgent.credentials}</p>
                    </div>
                    {listing.coListingAgent && (
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{listing.coListingAgent.name}</p>
                        <p className="text-xs text-slate-400">{listing.coListingAgent.credentials}</p>
                      </div>
                    )}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      )}

      {/* ── Main content ─────────────────────────────────────────── */}
      <section className="px-6 py-14 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[1fr_320px] lg:items-start">
            <div className="space-y-14">

              {/* Photo gallery / placeholder */}
              <div>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-600">
                    Photos{listing.photos.length > 0 ? ` (${listing.photos.length + (heroPhoto ? 1 : 0)})` : ''}
                  </p>
                  {listing.virtualTourUrl && (
                    <a
                      href={listing.virtualTourUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-gold-600 transition hover:text-gold-700"
                    >
                      View Full Photo Tour ↗
                    </a>
                  )}
                </div>

                {listing.photos.length > 0 ? (
                  <>
                    {/* Bento grid — first 5 photos */}
                    <div className="hidden overflow-hidden rounded-2xl md:grid md:h-[460px] md:grid-cols-3 md:grid-rows-2 md:gap-1.5">
                      {listing.photos.slice(0, 5).map((photo, i) => (
                        <a
                          key={photo.src}
                          href={photo.src}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`relative overflow-hidden ${i === 0 ? 'col-span-1 row-span-2' : ''}`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={photo.src}
                            alt={photo.alt}
                            loading={i === 0 ? 'eager' : 'lazy'}
                            className="h-full w-full object-cover transition duration-500 hover:scale-105"
                          />
                        </a>
                      ))}
                    </div>

                    {/* Mobile 2-col grid — first 5 photos */}
                    <div className="grid grid-cols-2 gap-1.5 overflow-hidden rounded-2xl md:hidden">
                      {listing.photos.slice(0, 4).map((photo, i) => (
                        <a key={photo.src} href={photo.src} target="_blank" rel="noopener noreferrer" className="relative aspect-[4/3] overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={photo.src} alt={photo.alt} loading={i === 0 ? 'eager' : 'lazy'} className="h-full w-full object-cover" />
                        </a>
                      ))}
                    </div>

                    {/* Remaining photos */}
                    {listing.photos.length > 5 && (
                      <div className="mt-1.5 grid grid-cols-2 gap-1.5 overflow-hidden rounded-2xl sm:grid-cols-3 lg:grid-cols-4">
                        {listing.photos.slice(5).map((photo) => (
                          <a key={photo.src} href={photo.src} target="_blank" rel="noopener noreferrer" className="relative aspect-[4/3] overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={photo.src} alt={photo.alt} loading="lazy" className="h-full w-full object-cover transition duration-500 hover:scale-105" />
                          </a>
                        ))}
                      </div>
                    )}
                    <p className="mt-3 text-xs text-slate-400">Click any photo to view it full-size.</p>
                  </>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
                    <p className="font-semibold text-slate-700">Listing photos coming soon</p>
                    <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                      Professional photography for this home is being added to the site. In the
                      meantime, view the complete photo tour below.
                    </p>
                    {listing.virtualTourUrl && (
                      <a
                        href={listing.virtualTourUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gold-600"
                      >
                        View Full Photo Tour ↗
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Floor Plan */}
              {listing.floorPlan && (
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-slate-900">Floor Plan</h2>
                  <a
                    href={listing.floorPlan.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 block overflow-hidden rounded-2xl border border-slate-200"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={listing.floorPlan.src} alt={listing.floorPlan.alt} loading="lazy" className="w-full" />
                  </a>
                  <p className="mt-3 text-xs text-slate-400">
                    Floor plan measurements are approximate and should be independently verified.
                  </p>
                </div>
              )}

              {/* Overview */}
              <div>
                <h2 className="font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">
                  About This Home
                </h2>
                <div className="mt-4 space-y-4">
                  {listing.overview.map((p, i) => (
                    <p key={i} className="leading-8 text-slate-600">{p}</p>
                  ))}
                </div>
              </div>

              {/* Highlights */}
              <div>
                <h2 className="font-serif text-2xl font-semibold text-slate-900">Property Highlights</h2>
                <ul className="mt-5 space-y-3">
                  {listing.highlights.map((h) => (
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

              {/* Quick facts grid */}
              <div>
                <h2 className="font-serif text-2xl font-semibold text-slate-900">At a Glance</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Fact label="Bedrooms / Bathrooms" value={`${listing.beds} bed / ${bathsDisplay} bath`} />
                  <Fact label="Living Area" value={`${listing.livingSqft.toLocaleString()} sq ft${listing.livingSqftSource ? ` (${listing.livingSqftSource})` : ''}`} />
                  {listing.totalUnderRoofSqft && (
                    <Fact label="Total Under Roof" value={`${listing.totalUnderRoofSqft.toLocaleString()} sq ft`} />
                  )}
                  {listing.lotSqft && (
                    <Fact label="Lot Size" value={`${listing.lotSqft.toLocaleString()} sq ft (${listing.lotAcres} acres)`} />
                  )}
                  <Fact label="Year Built" value={`${listing.yearBuilt}`} />
                  <Fact label="Stories" value={`${listing.stories}`} />
                  {listing.garageSpaces !== undefined && (
                    <Fact label="Garage" value={`${listing.garageSpaces} space${listing.garageSpaces === 1 ? '' : 's'}, attached`} />
                  )}
                  {listing.parkingTotal !== undefined && (
                    <Fact label="Total Parking" value={`${listing.parkingTotal} vehicles`} />
                  )}
                  {listing.pool && (
                    <Fact label="Pool" value={`Private, ${listing.pool.size ?? ''}`.trim()} />
                  )}
                  <Fact label="Waterfront" value={listing.waterfront ? 'Yes' : 'No'} />
                  {listing.view && <Fact label="View" value={listing.view} />}
                  <Fact label="HOA" value={listing.hoa.hasHoa ? (listing.hoa.fee ?? 'Yes') : 'None'} />
                  {listing.roof && (
                    <Fact label="Roof" value={`${listing.roof}${listing.roofYear ? ` (${listing.roofYear})` : ''}`} />
                  )}
                  {listing.taxAnnual && (
                    <Fact label={`${listing.taxYear ?? ''} Annual Taxes`} value={currency(Math.round(listing.taxAnnual))} />
                  )}
                </div>
              </div>

              {/* Room dimensions */}
              {listing.roomDimensions && listing.roomDimensions.length > 0 && (
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-slate-900">Room Dimensions</h2>
                  <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
                    {listing.roomDimensions.map((r, i) => (
                      <div
                        key={r.name}
                        className={`flex items-center justify-between px-6 py-3.5 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
                      >
                        <span className="text-sm font-medium text-slate-700">{r.name}</span>
                        <span className="text-sm text-slate-500">{r.dimensions}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-slate-400">
                    Room dimensions are approximate and should be independently verified.
                  </p>
                </div>
              )}

              {/* Interior & Kitchen */}
              {(listing.interiorFeatures?.length || listing.appliances?.length || listing.flooring?.length) && (
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-slate-900">Interior & Kitchen</h2>
                  <div className="mt-5 grid gap-6 sm:grid-cols-2">
                    {listing.interiorFeatures && listing.interiorFeatures.length > 0 && (
                      <FeatureList title="Interior Features" items={listing.interiorFeatures} />
                    )}
                    {listing.appliances && listing.appliances.length > 0 && (
                      <FeatureList title="Appliances" items={listing.appliances} />
                    )}
                    {listing.flooring && listing.flooring.length > 0 && (
                      <FeatureList title="Flooring" items={listing.flooring} />
                    )}
                  </div>
                </div>
              )}

              {/* Exterior, Pool & Outdoor Living */}
              {(listing.exteriorFeatures?.length || listing.pool || listing.lotFeatures?.length) && (
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-slate-900">Exterior, Pool & Outdoor Living</h2>
                  <div className="mt-5 grid gap-6 sm:grid-cols-2">
                    {listing.pool && (
                      <FeatureList title="Pool" items={listing.pool.features ?? ['Private pool']} />
                    )}
                    {listing.exteriorFeatures && listing.exteriorFeatures.length > 0 && (
                      <FeatureList title="Outdoor Living" items={listing.exteriorFeatures} />
                    )}
                    {listing.lotFeatures && listing.lotFeatures.length > 0 && (
                      <FeatureList title="Lot & Landscaping" items={listing.lotFeatures} />
                    )}
                  </div>
                </div>
              )}

              {/* Systems & Mechanical */}
              {(listing.cooling?.length || listing.heating?.length || listing.roof || listing.solar || listing.stormProtection) && (
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-slate-900">Systems & Mechanical Updates</h2>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {listing.roof && <Fact label="Roof" value={`${listing.roof}${listing.roofYear ? ` — installed ${listing.roofYear}` : ''}`} />}
                    {listing.cooling && <Fact label="Cooling" value={listing.cooling.join(', ')} />}
                    {listing.heating && <Fact label="Heating" value={listing.heating.join(', ')} />}
                    {listing.solar && <Fact label="Solar" value={listing.solar} />}
                    {listing.stormProtection && <Fact label="Storm Protection" value={listing.stormProtection} />}
                    {listing.sewer && <Fact label="Sewer" value={listing.sewer} />}
                    {listing.waterSource && <Fact label="Water Source" value={listing.waterSource} />}
                    {listing.constructionMaterials && <Fact label="Construction" value={listing.constructionMaterials.join(', ')} />}
                  </div>
                </div>
              )}

              {/* Confirmed upgrades */}
              {listing.upgrades && listing.upgrades.length > 0 && (
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-slate-900">Confirmed Upgrades</h2>
                  <ul className="mt-5 space-y-2">
                    {listing.upgrades.map((u) => (
                      <li key={u.item} className="text-sm leading-7 text-slate-600">
                        · {u.item}{u.year ? ` (${u.year})` : ''}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* HOA & Community */}
              <div>
                <h2 className="font-serif text-2xl font-semibold text-slate-900">
                  HOA & Community — {listing.subdivision ?? listing.city}
                </h2>
                <p className="mt-4 leading-8 text-slate-600">{listing.hoa.notes}</p>
                {listing.leasing && (
                  <p className="mt-3 leading-8 text-slate-600">
                    <strong className="font-semibold text-slate-900">Leasing: </strong>
                    {listing.leasing.permitted ? 'Permitted.' : 'Not permitted.'} {listing.leasing.notes}
                  </p>
                )}
                {listing.pets && (
                  <p className="mt-3 leading-8 text-slate-600">
                    <strong className="font-semibold text-slate-900">Pets: </strong>
                    {listing.pets.allowed ? 'Allowed.' : 'Not allowed.'} {listing.pets.notes}
                  </p>
                )}
                {community && (
                  <Link
                    href={`/communities/${community.slug}`}
                    className="mt-4 inline-flex text-sm font-semibold text-gold-600 transition hover:text-gold-700"
                  >
                    Explore {community.name} Real Estate →
                  </Link>
                )}
              </div>

              {/* Financial & Ownership Considerations */}
              {listing.ownershipConsiderations && listing.ownershipConsiderations.length > 0 && (
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-slate-900">Financial & Ownership Considerations</h2>
                  <ul className="mt-5 space-y-3">
                    {listing.ownershipConsiderations.map((item) => (
                      <li key={item} className="text-sm leading-7 text-slate-600">· {item}</li>
                    ))}
                  </ul>
                  {listing.financingTermsAccepted && (
                    <p className="mt-4 text-sm text-slate-500">
                      <strong className="font-semibold text-slate-700">Financing accepted: </strong>
                      {listing.financingTermsAccepted.join(', ')}
                    </p>
                  )}
                </div>
              )}

              {/* Lifestyle & Location */}
              {listing.locationNotes && listing.locationNotes.length > 0 && (
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-slate-900">Location & Lifestyle</h2>
                  <ul className="mt-5 space-y-3">
                    {listing.locationNotes.map((item) => (
                      <li key={item} className="text-sm leading-7 text-slate-600">· {item}</li>
                    ))}
                  </ul>
                  {community?.commuteTimes && community.commuteTimes.length > 0 && (
                    <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
                      {community.commuteTimes.map((c, i) => (
                        <div key={c.destination} className={`flex items-center justify-between px-6 py-3.5 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                          <span className="text-sm text-slate-700">{c.destination}</span>
                          <span className="text-sm font-semibold text-gold-600">{c.time}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Assigned schools */}
              {listing.assignedSchools && listing.assignedSchools.length > 0 && (
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-slate-900">Assigned Public Schools</h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Per the Martin County School District. School assignments can change — verify current boundaries directly with the district.
                  </p>
                  <ul className="mt-4 space-y-1.5">
                    {listing.assignedSchools.map((s) => (
                      <li key={s.name} className="text-sm leading-7 text-slate-600">
                        · <span className="font-medium text-slate-700">{s.level}:</span> {s.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Buyer CTA section */}
              <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-sky-50 via-blue-50 to-white p-7 sm:p-9">
                <h2 className="font-serif text-2xl font-semibold text-slate-900">Ready to Learn More?</h2>
                <p className="mt-3 text-slate-600">
                  Reach out any time — we&apos;ll confirm availability, answer questions on financing or
                  ownership costs, and get you the MLS sheet.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <a href={`/contact?${contactCtx}&action=schedule-showing`} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-card transition hover:border-gold-500/40 hover:shadow-card-hover">
                    <span className="font-semibold text-slate-900">Schedule a Private Showing</span>
                    <span className="text-gold-600">→</span>
                  </a>
                  <a href={`mailto:${listing.listingAgent.email}?subject=${encodeURIComponent(`MLS sheet request — ${listing.address}`)}&body=${encodeURIComponent(`Hi ${listing.listingAgent.name}, could you send me the full MLS sheet / property brochure for ${listing.address} (MLS# ${listing.mlsNumber})?`)}`} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-card transition hover:border-gold-500/40 hover:shadow-card-hover">
                    <span className="font-semibold text-slate-900">Request the MLS Sheet</span>
                    <span className="text-gold-600">→</span>
                  </a>
                  <a href={`mailto:${listing.listingAgent.email}?subject=${encodeURIComponent(`Financing question — ${listing.address}`)}`} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-card transition hover:border-gold-500/40 hover:shadow-card-hover">
                    <span className="font-semibold text-slate-900">Ask About Financing</span>
                    <span className="text-gold-600">→</span>
                  </a>
                  <a href={`mailto:${listing.listingAgent.email}?subject=${encodeURIComponent(`Is ${listing.address} still available?`)}`} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-card transition hover:border-gold-500/40 hover:shadow-card-hover">
                    <span className="font-semibold text-slate-900">Is It Still Available?</span>
                    <span className="text-gold-600">→</span>
                  </a>
                </div>
              </div>

              {/* Related searches */}
              <div>
                <h2 className="font-serif text-2xl font-semibold text-slate-900">Continue Your Search</h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <a href={searchUrl(listing.city)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-card transition hover:border-gold-500/40 hover:shadow-card-hover">
                    <div>
                      <p className="font-semibold text-slate-900">Homes for Sale in {listing.city}</p>
                      <p className="text-xs text-slate-500">All active listings, updated daily</p>
                    </div>
                    <span className="text-gold-600">→</span>
                  </a>
                  <a href={searchUrl(listing.city, { propertyTypes: ['house'], minPrice: 500000, maxPrice: 750000 })} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-card transition hover:border-gold-500/40 hover:shadow-card-hover">
                    <div>
                      <p className="font-semibold text-slate-900">Single-Family Homes $500K–$750K</p>
                      <p className="text-xs text-slate-500">Comparable price range in {listing.city}</p>
                    </div>
                    <span className="text-gold-600">→</span>
                  </a>
                  <Link href={`/communities/${listing.citySlug}`} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-card transition hover:border-gold-500/40 hover:shadow-card-hover">
                    <div>
                      <p className="font-semibold text-slate-900">{listing.city} Community Guide</p>
                      <p className="text-xs text-slate-500">Schools, lifestyle & neighborhoods</p>
                    </div>
                    <span className="text-gold-600">→</span>
                  </Link>
                  <Link href="/buy" className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-card transition hover:border-gold-500/40 hover:shadow-card-hover">
                    <div>
                      <p className="font-semibold text-slate-900">Buying in Palm Beach & Martin County</p>
                      <p className="text-xs text-slate-500">Our full home-buying guide</p>
                    </div>
                    <span className="text-gold-600">→</span>
                  </Link>
                </div>
              </div>

              {/* Other homes for sale nearby (live MLS feed) */}
              <div>
                <h2 className="font-serif text-2xl font-semibold text-slate-900">
                  Other Homes for Sale in {listing.city}
                </h2>
                <p className="mt-2 text-sm text-slate-500">Live MLS data, updated daily.</p>
                <div className="mt-5">
                  <YlopoInit city={listing.city} />
                  <YlopoResultsWidget city={listing.city} minPrice={400000} propertyTypes={['SFR']} limit={6} />
                </div>
              </div>

              {/* Agents */}
              <div className="space-y-5">
                <h2 className="font-serif text-2xl font-semibold text-slate-900">Listing Team</h2>
                <AgentBlurb agent={listing.listingAgent} brokerage={listing.brokerage} />
                {listing.coListingAgent && <AgentBlurb agent={listing.coListingAgent} brokerage={listing.brokerage} />}
              </div>

              {/* Disclaimer */}
              <div className="border-t border-slate-100 pt-8 text-xs leading-6 text-slate-400">
                <p>
                  Listing information is deemed reliable but is not guaranteed. Square footage, lot
                  size, taxes, HOA details, and all other information should be independently
                  verified by the buyer. Equal Housing Opportunity — {listing.brokerage} does not
                  discriminate on the basis of race, color, religion, sex, national origin,
                  familial status, or disability. MLS# {listing.mlsNumber}
                  {listing.domCount ? ` · Listed ${listing.listingDateDisplay ?? ''} · ${listing.domCount} days on market` : ''}.
                </p>
              </div>
            </div>

            {/* Sticky sidebar (desktop) */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-card">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-600">
                    {currency(listing.price)}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {listing.beds} bed · {bathsDisplay} bath · {listing.livingSqft.toLocaleString()} sq ft
                  </p>
                  <div className="mt-5 space-y-3">
                    <a
                      href={`/contact?${contactCtx}&action=schedule-showing`}
                      className="flex w-full items-center justify-center rounded-full bg-gold-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gold-600"
                    >
                      Schedule a Showing
                    </a>
                    <a
                      href={listing.listingAgent.phoneHref}
                      className="flex w-full items-center justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-gold-500 hover:text-gold-600"
                    >
                      Call {listing.listingAgent.phone}
                    </a>
                  </div>
                </div>

                {listing.virtualTourUrl && (
                  <a
                    href={listing.virtualTourUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-card transition hover:border-gold-500/40"
                  >
                    <p className="font-semibold text-slate-900">View Full Photo Tour ↗</p>
                  </a>
                )}

                <Link
                  href={`/communities/${listing.citySlug}`}
                  className="block text-sm text-slate-400 transition hover:text-slate-600"
                >
                  ← {listing.city} Real Estate
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
              href={`/contact?${contactCtx}&action=schedule-showing`}
              className="flex w-full items-center justify-center rounded-full bg-gold-500 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-gold-600"
            >
              Schedule a Private Showing
            </a>
            <a
              href={listing.listingAgent.phoneHref}
              className="flex w-full items-center justify-center rounded-full border border-slate-200 px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-gold-500 hover:text-gold-600"
            >
              Call {listing.listingAgent.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Bottom banner CTA */}
      <section className="bg-gradient-to-br from-gold-700 to-gold-500 px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-100">
            {listing.address}
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-white sm:text-4xl">
            Ready to See It in Person?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-blue-100">
            {`Contact ${listing.listingAgent.name} directly, or call the office and we'll connect you with the listing team.`}
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href={`/contact?${contactCtx}&action=schedule-showing`}
              className="inline-flex items-center rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-gold-700 shadow transition hover:bg-blue-50"
            >
              Schedule a Private Showing
            </a>
            <a
              href={OFFICE_PHONE.href}
              className="inline-flex items-center rounded-full border border-white/40 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-white/80 hover:bg-white/10"
            >
              Call {OFFICE_PHONE.display}
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">{label}</p>
      <p className="mt-2 text-sm leading-7 text-slate-600">{value}</p>
    </div>
  )
}

function FeatureList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">{title}</p>
      <ul className="mt-3 space-y-1.5">
        {items.map((item) => (
          <li key={item} className="text-sm leading-7 text-slate-600">· {item}</li>
        ))}
      </ul>
    </div>
  )
}

function AgentBlurb({ agent, brokerage }: { agent: ListingAgentInfo; brokerage: string }) {
  return (
    <div className="flex gap-6 rounded-3xl border border-slate-200 bg-white p-7 shadow-card">
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl">
        <Image src={agent.photo} alt={agent.name} fill className="object-cover object-top" sizes="80px" />
      </div>
      <div className="flex flex-col justify-center gap-1.5">
        <div>
          <p className="font-semibold text-slate-900">{agent.name}</p>
          <p className="text-xs text-gold-600">{agent.role} · {agent.credentials}</p>
          <p className="text-xs text-slate-400">{brokerage} · License #{agent.license}</p>
        </div>
        <div className="mt-1 flex gap-4">
          <a href={agent.phoneHref} className="text-sm font-semibold text-gold-600 transition hover:text-gold-700">
            {agent.phone}
          </a>
          <a href={`mailto:${agent.email}`} className="text-sm font-semibold text-gold-600 transition hover:text-gold-700">
            Email
          </a>
        </div>
      </div>
    </div>
  )
}
