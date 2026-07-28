import Link from 'next/link'
import CommunityCard from '@/components/CommunityCard'
import MarketReportCTA from '@/components/leadMagnet/MarketReportCTA'
import { cities, neighborhoods } from '@/lib/communities'

export const metadata = {
  title: 'Communities | DO Homes Group',
  description:
    'Explore Palm Beach County cities, neighborhoods, and gated communities — with local expertise from DO Homes Group at Premier Brokers International.',
  alternates: { canonical: '/communities' },
}

export default function CommunitiesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-sky-50 via-blue-50 to-white px-6 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-600">
            Communities
          </p>
          <h1 className="mt-3 font-serif text-4xl font-semibold text-slate-900 sm:text-5xl">
            Explore Palm Beach County
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            From beachfront Jupiter to the equestrian estates of Wellington, DO Homes Group serves
            buyers and sellers across 21 cities and 60+ neighborhoods throughout Palm Beach County
            and the Treasure Coast.
          </p>
        </div>
      </section>

      {/* Cities */}
      <section className="bg-white px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gold-600">Cities</p>
              <h2 className="mt-1 font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">
                21 Markets, Deep Local Knowledge
              </h2>
            </div>
            <p className="text-sm text-slate-500">Each city page includes neighborhoods, pricing, and lifestyle details.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {cities.map((community) => (
              <CommunityCard key={community.slug} community={community} />
            ))}
          </div>
        </div>
      </section>

      {/* Market report CTA */}
      <section className="px-6 pb-16 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <MarketReportCTA selection="both" variant="inline" pageCategory="communities-index" />
        </div>
      </section>

      {/* Neighborhoods */}
      <section className="bg-slate-50 px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gold-600">
                Neighborhoods &amp; Communities
              </p>
              <h2 className="mt-1 font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">
                Gated Communities &amp; Planned Developments
              </h2>
            </div>
            <p className="text-sm text-slate-500">
              Click any neighborhood to explore amenities, home types, and active listings.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {neighborhoods.map((community) => (
              <CommunityCard key={community.slug} community={community} />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-white px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-600">Not sure where to start?</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-slate-900">
            Let Us Match You to the Right Community
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-600">
            Tell us your priorities — schools, commute, lifestyle, budget — and our local experts
            will point you toward the neighborhoods that fit best.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full bg-gold-500 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gold-600"
            >
              Talk to an Agent
            </Link>
            <a
              href="https://search.doyouneedahome.com/search?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][state]=FL&s[minPrice]=400000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border border-slate-300 px-8 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-gold-500 hover:text-gold-600"
            >
              Search All Listings
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
