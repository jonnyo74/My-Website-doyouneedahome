import type { Metadata } from 'next'
import Link from 'next/link'
import { getActiveListings } from '@/lib/listings'
import { agents } from '@/lib/agents'
import ListingCard from '@/components/ListingCard'
import DualReportCTA from '@/components/leadMagnet/DualReportCTA'

export const metadata: Metadata = {
  title: 'Sell Your Home | DO Homes Group',
  description:
    'List your Palm Beach County home with DO Homes Group at Premier Brokers International. Get a free valuation and expert marketing strategy.',
  alternates: { canonical: '/sell' },
}

const steps = [
  {
    number: '01',
    title: 'Free Home Valuation',
    body: "We analyze comparable sales, current market conditions, and your home's unique features to determine the right list price — one that attracts buyers and maximizes your return.",
  },
  {
    number: '02',
    title: 'Listing Strategy',
    body: 'We create a custom marketing plan including professional photography, MLS exposure, digital advertising, and community-specific outreach to reach the right buyers.',
  },
  {
    number: '03',
    title: 'Showings & Offers',
    body: 'We manage showings on your schedule, keep you updated throughout the process, and present every offer with a clear breakdown so you can make informed decisions.',
  },
  {
    number: '04',
    title: 'Negotiation',
    body: 'Our agents negotiate with your best interests at the forefront — protecting your equity, managing contingencies, and pushing for the strongest possible terms.',
  },
  {
    number: '05',
    title: 'Close & Move On',
    body: "We coordinate with title, inspectors, and attorneys to ensure a smooth closing. You'll have a direct line to your agent every step of the way.",
  },
]

export default function SellPage() {
  const activeListings = getActiveListings()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-sky-50 via-blue-50 to-white px-6 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-600">Selling</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold text-slate-900 sm:text-5xl">
            Sell Your Home With Confidence
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            DO Homes Group delivers a proven marketing strategy, honest pricing guidance, and
            hands-on service from listing day to closing day — so you get top dollar without the stress.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a
              href="#valuation"
              className="inline-flex items-center justify-center rounded-full bg-gold-500 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gold-600"
            >
              Get a Free Valuation
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

      {/* Process */}
      <section className="bg-white px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-600">How It Works</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-slate-900">The Selling Process</h2>
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
        </div>
      </section>

      {/* Market reports */}
      <section className="bg-white px-6 pb-4 pt-2 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <DualReportCTA
            pageCategory="sell"
            headline="Know the Market Before You List"
            intro="Pick the report that matches your property. Free July 2026 editions with the prices, inventory, and buyer activity that determine what your home is worth today — instant PDF download."
          />
        </div>
      </section>

      {/* Why us */}
      <section className="bg-slate-50 px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-card">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-600">Why DO Homes Group</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-slate-900">
              Local Knowledge. Proven Results.
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {[
                { stat: '24 Years', label: 'Combined real estate experience across our team' },
                { stat: '5★', label: 'Client rating across all reviews' },
              ].map(({ stat, label }) => (
                <div key={stat} className="rounded-2xl bg-slate-50 p-6 text-center">
                  <p className="font-serif text-4xl font-semibold text-gold-600">{stat}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Current Listings */}
      {activeListings.length > 0 && (
        <section className="bg-white px-6 py-16 sm:px-8">
          <div className="mx-auto max-w-5xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-600">See Our Marketing</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-slate-900">
              Homes We&apos;re Currently Marketing
            </h2>
            <p className="mt-3 max-w-2xl text-slate-600">
              A look at how we present a listing — professional photography, a dedicated property
              page, and a clear path for buyers to reach out.
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {activeListings.map((listing, i) => (
                <ListingCard key={listing.slug} listing={listing} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Valuation CTA */}
      <section id="valuation" className="bg-gradient-to-br from-gold-700 to-gold-500 px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-100">Free Valuation</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-white sm:text-4xl">
            What Is Your Home Worth?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-blue-100">
            Pick the agent you&rsquo;d like to work with and send us the address. You&rsquo;ll hear
            back the same day, and get a no-obligation comparative market analysis — built by hand
            from real comparable sales, not an automated estimate — within 48 hours.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            {agents.map((agent) => (
              <Link
                key={agent.slug}
                href={`/sell/${agent.slug}`}
                className="inline-flex w-full items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-gold-700 shadow transition hover:bg-blue-50 sm:w-auto"
              >
                Free CMA from {agent.firstName}
              </Link>
            ))}
          </div>
          <p className="mt-5 text-sm text-blue-100">
            Prefer to talk first?{' '}
            <a href="tel:+15617837733" className="font-semibold underline underline-offset-4">
              Call (561) 783-7733
            </a>
          </p>
        </div>
      </section>
    </div>
  )
}
