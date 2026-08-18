import type { Metadata } from 'next'
import Link from 'next/link'
import { cities } from '@/lib/communities'
import DualReportCTA from '@/components/leadMagnet/DualReportCTA'

// No location filter — a bare state=FL param breaks Ylopo's search (returns
// zero results); omitting locations entirely falls back to the account's
// configured default market area, which actually works.
const SEARCH_URL = 'https://search.doyouneedahome.com/search?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[minPrice]=400000'

export const metadata: Metadata = {
  title: 'Buy a Home in Palm Beach County | DO Homes Group',
  description:
    'Search all MLS listings across Palm Beach County and the Treasure Coast. DO Homes Group at Premier Brokers International helps buyers find the right home.',
  alternates: { canonical: '/buy' },
}

const steps = [
  {
    number: '01',
    title: 'Get Pre-Approved',
    body: 'Before you start searching, we help you connect with a trusted lender to understand your buying power and get pre-approved so you can move quickly when you find the right home.',
  },
  {
    number: '02',
    title: 'Search Homes',
    body: 'Browse real-time MLS listings filtered by community, price, and features on our dedicated search site. We send you alerts as new properties hit the market.',
  },
  {
    number: '03',
    title: 'Tour Properties',
    body: 'We schedule and accompany you to showings, provide honest assessments of each property, and help you compare your options so you make a confident decision.',
  },
  {
    number: '04',
    title: 'Make an Offer',
    body: 'We negotiate on your behalf with a strategy built on current market data, comparable sales, and your goals — maximizing value and minimizing stress.',
  },
  {
    number: '05',
    title: 'Close with Confidence',
    body: 'From inspection through closing, we coordinate every step and stay in direct communication so nothing falls through the cracks.',
  },
]

export default function BuyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-sky-50 via-blue-50 to-white px-6 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-600">Buying</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold text-slate-900 sm:text-5xl">
            Find Your Home in Palm Beach County
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Whether you're relocating, upsizing, or investing, DO Homes Group guides you through every
            step of the buying process with local expertise and direct communication.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a
              href={SEARCH_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-gold-500 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gold-600"
            >
              Search All Listings
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-8 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-gold-500 hover:text-gold-600"
            >
              Talk to an Agent
            </Link>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-white px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-600">How It Works</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-slate-900">The Buying Process</h2>
          <div className="mt-10 space-y-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="flex gap-6 rounded-3xl border border-slate-200 bg-white p-7 shadow-card"
              >
                <p className="flex-shrink-0 font-serif text-3xl font-semibold text-gold-500/40">
                  {step.number}
                </p>
                <div>
                  <h3 className="font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Condo hand-off */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-5">
            <p className="text-sm leading-6 text-slate-600">
              Condo shopping in West Palm Beach? Our sister site profiles every building in the city —
              start there, then come back for everything else.
            </p>
            <a
              href="https://www.condowpb.com"
              className="inline-flex flex-shrink-0 items-center rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-gold-500 hover:text-gold-600"
            >
              CondoWPB.com →
            </a>
          </div>
        </div>
      </section>

      {/* Market reports */}
      <section className="bg-slate-50 px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <DualReportCTA
            pageCategory="buy"
            intro="Understand today's market before you make a move. Free July 2026 reports with local prices, inventory, and negotiating conditions — instant PDF download, no obligation."
          />
        </div>
      </section>

      {/* Communities */}
      <section className="bg-white px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-600">Where We Work</p>
              <h2 className="mt-3 font-serif text-3xl font-semibold text-slate-900">Communities We Serve</h2>
            </div>
            <Link href="/communities" className="text-sm font-semibold text-gold-600 transition hover:text-gold-700">
              All communities →
            </Link>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((city) => (
              <Link
                key={city.slug}
                href={`/communities/${city.slug}`}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm shadow-card transition hover:border-gold-500/40 hover:shadow-card-hover"
              >
                <span className="font-medium text-slate-800">{city.name}</span>
                <span className="text-xs text-slate-500">{city.region}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-gold-700 to-gold-500 px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white">Ready to Search?</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-white sm:text-4xl">
            Start Your Home Search Today
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white">
            Browse real-time MLS listings or call us directly — we respond the same day.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href={SEARCH_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-gold-700 shadow transition hover:bg-blue-50"
            >
              Search Homes
            </a>
            <a
              href="tel:+15617837733"
              className="inline-flex items-center justify-center rounded-full border border-white/40 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-white/80 hover:bg-white/10"
            >
              Call (561) 783-7733
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
