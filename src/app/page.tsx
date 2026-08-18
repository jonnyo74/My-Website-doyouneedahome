import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { cities } from '@/lib/communities'
import { getActiveListings } from '@/lib/listings'
import CommunityCard from '@/components/CommunityCard'
import ListingCard from '@/components/ListingCard'
import DualReportCTA from '@/components/leadMagnet/DualReportCTA'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

// No location filter — a bare state=FL param breaks Ylopo's search (returns
// zero results); omitting locations entirely falls back to the account's
// configured default market area, which actually works.
const SEARCH_URL = 'https://search.doyouneedahome.com/search?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[minPrice]=400000'

const testimonials = [
  { quote: 'Christine listed and sold my home within 3 days.', author: 'Dave H.', role: 'Seller', agent: 'Christine Dekant' },
  { quote: 'A true professional! This is the third time we have worked with her.', author: 'Nancy F.', role: 'Seller', agent: 'Christine Dekant' },
  { quote: "She isn't just trying to sell you a house, she is helping find a home.", author: 'Joel A.', role: 'Buyer', agent: 'Christine Dekant' },
  { quote: 'John made the entire process remarkably smooth and stress-free.', author: 'Nancy M.', role: 'Out-of-State Buyer — South Palm Beach', agent: 'John Oliver' },
  { quote: 'John is fair, honest & has your best interest.', author: 'Michelle P.', role: 'Seller & Buyer', agent: 'John Oliver' },
  { quote: "We didn't just buy a condo, we have a new friend.", author: 'William W.', role: 'Buyer', agent: 'John Oliver' },
]

const stripPhotos = [
  { src: '/images/ibis/ibis-photos-001.png', label: 'Ibis G&CC' },
  { src: '/images/jupiter/jupiter-003.jpg', label: 'Jupiter' },
  { src: '/images/west-palm-beach/waterfront-024.jpg', label: 'West Palm Beach' },
  { src: '/images/singer-island/singer-island-0035.jpeg', label: 'Singer Island' },
  { src: '/images/juno-beach/juno-beach-025.jpg', label: 'Juno Beach' },
]

export default function Home() {
  const activeListings = getActiveListings()

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] overflow-hidden bg-slate-900">
        {/* Background photo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/olara/olara-hero.jpg"
          alt="Palm Beach County luxury real estate"
          className="absolute inset-0 h-full w-full object-cover opacity-85"
        />
        {/* Gradient overlay — lighter so rendering shows through */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        <div className="relative mx-auto max-w-7xl px-6 pt-28 pb-20 sm:px-8 sm:pt-36 sm:pb-28">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-8">
              {/* gold-200 not gold-400: measured against the hero photo under
                  its overlay, gold-400 drops below 4.5:1 across ~40% of the
                  area this line covers. gold-200 clears it everywhere. */}
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-200">
                Premier Brokers International
              </p>
              <h1 className="font-serif text-5xl font-semibold leading-tight text-white sm:text-6xl">
                Find Your Home<br />in Palm Beach County
              </h1>
              <p className="max-w-xl text-lg leading-8 text-white/80">
                Christine Dekant &amp; John Oliver — local REALTORS® helping buyers and sellers
                across Palm Beach County and the Treasure Coast.
              </p>
              <div className="YLOPO_searchWidget" />
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full border border-white/40 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
                >
                  Contact Us
                </Link>
              </div>
              <div className="border-t border-white/20 pt-8">
                <Link
                  href="/testimonials"
                  className="inline-flex items-center justify-center rounded-full border border-white/40 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
                >
                  See What Our Clients Say →
                </Link>
              </div>
            </div>

            {/* Agent photos */}
            <div className="relative flex gap-4">
              <div className="relative aspect-[3/4] w-1/2 overflow-hidden rounded-3xl bg-slate-700 shadow-2xl ring-1 ring-white/10">
                <Image
                  src="/images/christine.jpg"
                  alt="Christine Dekant"
                  fill
                  className="object-cover object-top"
                  priority
                  sizes="(max-width: 1024px) 25vw, 20vw"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                  <p className="font-semibold text-white">Christine Dekant</p>
                  <p className="text-xs text-white/80">REALTOR® · RENE · GRI · CLA · CPRES · REDM · C2EX</p>
                </div>
              </div>
              <div className="relative mt-10 aspect-[3/4] w-1/2 overflow-hidden rounded-3xl bg-slate-700 shadow-2xl ring-1 ring-white/10">
                <Image
                  src="/images/john.jpg"
                  alt="John Oliver"
                  fill
                  className="object-cover object-top"
                  priority
                  sizes="(max-width: 1024px) 25vw, 20vw"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                  <p className="font-semibold text-white">John Oliver</p>
                  <p className="text-xs text-white/80">REALTOR® · ABR · RENE · RSPS · SRS</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Three CTA Cards ───────────────────────────────────────── */}
      <section className="bg-white px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 sm:grid-cols-3">
            <CtaCard
              eyebrow="Buying"
              title="Find Your Dream Home"
              body="Browse all active MLS listings across Palm Beach County and the Treasure Coast."
              href={SEARCH_URL}
              external
              cta="Search Listings"
              accent="blue"
            />
            <CtaCard
              eyebrow="Selling"
              title="List Your Home With Us"
              body="Our proven marketing strategy gets you maximum exposure and top dollar."
              href="/sell"
              cta="Learn More"
              accent="green"
            />
            <CtaCard
              eyebrow="Valuation"
              title="Get a Free Home Valuation"
              body="Find out what your home is worth in today's market with a personalized analysis."
              href="/sell#valuation"
              cta="Request Valuation"
              accent="blue"
            />
          </div>
        </div>
      </section>

      {/* ── Current Listings ─────────────────────────────────────── */}
      {activeListings.length > 0 && (
        <section className="bg-slate-50 px-6 py-20 sm:px-8">
          <div className="mx-auto max-w-7xl space-y-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-600">Current Listings</p>
                <h2 className="font-serif text-3xl font-semibold text-slate-900 sm:text-4xl">
                  Homes We&apos;re Currently Marketing
                </h2>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {activeListings.map((listing, i) => (
                <ListingCard key={listing.slug} listing={listing} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Photo Strip ───────────────────────────────────────────── */}
      <section className="px-6 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-600">
              Palm Beach County
            </p>
            <Link href="/communities" className="text-xs font-semibold text-slate-500 transition hover:text-gold-600">
              Explore communities →
            </Link>
          </div>
          {/* Desktop bento */}
          <div className="hidden h-[400px] grid-cols-3 grid-rows-2 gap-1.5 overflow-hidden rounded-2xl md:grid">
            <div className="relative col-span-1 row-span-2 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={stripPhotos[0].src} alt={stripPhotos[0].label} className="h-full w-full object-cover transition duration-700 hover:scale-105" />
              <span className="absolute bottom-3 left-4 text-xs font-semibold text-white drop-shadow">{stripPhotos[0].label}</span>
            </div>
            {stripPhotos.slice(1).map((p) => (
              <div key={p.src} className="relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt={p.label} className="h-full w-full object-cover transition duration-700 hover:scale-105" />
                <span className="absolute bottom-2 left-3 text-xs font-semibold text-white drop-shadow">{p.label}</span>
              </div>
            ))}
          </div>
          {/* Mobile 2-col */}
          <div className="grid grid-cols-2 gap-1.5 overflow-hidden rounded-2xl md:hidden">
            {stripPhotos.slice(0, 4).map((p) => (
              <div key={p.src} className="relative aspect-[4/3] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt={p.label} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Market Reports ────────────────────────────────────────── */}
      <section className="bg-white px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <DualReportCTA pageCategory="home" />
        </div>
      </section>

      {/* ── Featured Communities ──────────────────────────────────── */}
      <section className="bg-slate-50 px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-600">Communities</p>
              <h2 className="font-serif text-3xl font-semibold text-slate-900 sm:text-4xl">
                Explore Palm Beach County
              </h2>
            </div>
            <Link href="/communities" className="text-sm font-semibold text-gold-600 transition hover:text-gold-700">
              All communities →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {cities.map((city) => (
              <CommunityCard key={city.slug} community={city} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────────────── */}
      <section className="bg-white px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 rounded-3xl border border-slate-200 bg-white p-10 shadow-card lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-600">Your Agents</p>
                <h2 className="font-serif text-3xl font-semibold text-slate-900">Meet the Team</h2>
              </div>
              <p className="leading-7 text-slate-600">
                Christine Dekant and John Oliver are licensed REALTORS® with Premier Brokers International,
                serving Palm Beach County with local expertise, direct communication, and a proven record
                of getting results.
              </p>
              <Link
                href="/team"
                className="inline-flex rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-gold-500 hover:text-gold-600"
              >
                Meet the Team
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <AgentCard
                name="Christine Dekant"
                credentials="RENE · GRI · CLA · CPRES"
                phone="(561) 778-7042"
                phoneHref="tel:+15617787042"
                email="christine@doyouneedahome.com"
              />
              <AgentCard
                name="John Oliver"
                credentials="ABR · RENE · RSPS · SRS"
                phone="(561) 786-3630"
                phoneHref="tel:+15617863630"
                email="john@doyouneedahome.com"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────── */}
      <section className="bg-slate-50 px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-600">Client Reviews</p>
              <h2 className="font-serif text-3xl font-semibold text-slate-900 sm:text-4xl">
                What Our Clients Say
              </h2>
            </div>
            <Link href="/testimonials" className="text-sm font-semibold text-gold-600 transition hover:text-gold-700">
              All reviews →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.author} className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
                <div className="flex gap-1 text-amber-400">
                  <span className="sr-only">Rated 5 out of 5 stars.</span>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="flex-1 text-sm leading-7 text-slate-600">"{t.quote}"</p>
                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.author}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                  <p className="text-xs font-medium text-gold-600">{t.agent}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────── */}
      <section className="bg-white px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Ends on gold-600 rather than gold-500: the pale blue copy below
              only clears 4.5:1 against the darker end of the gradient. */}
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-gold-700 to-gold-600 p-10 text-center shadow-lg">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white">Get Started</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-white sm:text-4xl">
              Ready to Make Your Move?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white">
              Call us at (561) 783-7733 or send a message — we respond the same day.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a
                href="tel:+15617837733"
                className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-gold-700 shadow transition hover:bg-blue-50"
              >
                Call (561) 783-7733
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-white/40 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-white/80 hover:bg-white/10"
              >
                Send a Message
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function CtaCard({
  eyebrow, title, body, href, external, cta, accent,
}: {
  eyebrow: string; title: string; body: string; href: string; external?: boolean; cta: string; accent: 'blue' | 'green'
}) {
  const borderColor = accent === 'green' ? 'border-brand-green/30 hover:border-brand-green/60' : 'border-gold-500/30 hover:border-gold-500/60'
  const eyebrowColor = accent === 'green' ? 'text-brand-green-dark' : 'text-gold-600'
  const ctaColor = accent === 'green' ? 'text-brand-green-dark hover:text-brand-green' : 'text-gold-600 hover:text-gold-700'

  return (
    <div className={`flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-7 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover ${borderColor}`}>
      <p className={`text-xs font-semibold uppercase tracking-[0.24em] ${eyebrowColor}`}>{eyebrow}</p>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
      </div>
      {/* The card heading is a sibling, not part of the link, so on its own
          "Learn More" tells a screen-reader user nothing about where it goes.
          The hidden suffix carries the card title into the link's name. */}
      {external ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={`inline-flex text-sm font-semibold transition ${ctaColor}`}>
          {cta}<span className="sr-only"> — {title}</span> →
        </a>
      ) : (
        <a href={href} className={`inline-flex text-sm font-semibold transition ${ctaColor}`}>
          {cta}<span className="sr-only"> — {title}</span> →
        </a>
      )}
    </div>
  )
}

function AgentCard({
  name, credentials, phone, phoneHref, email,
}: {
  name: string; credentials: string; phone: string; phoneHref: string; email: string
}) {
  return (
    <div className="space-y-3 rounded-2xl bg-slate-50 p-5">
      <div>
        <p className="font-semibold text-slate-900">{name}</p>
        <p className="mt-0.5 text-xs font-medium text-gold-600">REALTOR®</p>
      </div>
      <p className="text-xs text-slate-500">{credentials}</p>
      {/* py-1 on each link: stacked 16–20px text links sat ~22px apart, which
          misses both the 24px target size and the 24px spacing exception
          (WCAG 2.2 — 2.5.8). Padding absorbs it without moving anything. */}
      <div className="border-t border-slate-200 pt-2">
        <a href={phoneHref} className="block py-1 text-sm text-slate-700 transition hover:text-gold-600">
          {phone}
        </a>
        <a href={`mailto:${email}`} className="block truncate py-1 text-xs text-slate-500 transition hover:text-gold-600">
          {email}
        </a>
      </div>
    </div>
  )
}
