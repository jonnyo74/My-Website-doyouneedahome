import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog | DO Homes Group',
  description:
    'Real estate insights, market updates, and community guides for Palm Beach County and the Treasure Coast from Christine Dekant & John Oliver at Premier Brokers International.',
}

const regions = [
  {
    name: 'Northern Palm Beach County',
    description: 'Jupiter, Palm Beach Gardens, Tequesta, Juno Beach & North Palm Beach',
    posts: [
      { tag: 'Market Update', title: 'Jupiter Real Estate Market: What Buyers Need to Know' },
      { tag: 'Community Guide', title: 'Living in Palm Beach Gardens: Golf, Schools & Lifestyle' },
      { tag: 'Buying Guide', title: 'Tequesta & Juno Beach: Hidden Gems on the Barrier Island' },
    ],
  },
  {
    name: 'Central Palm Beach County',
    description: 'West Palm Beach, Palm Beach, Wellington, Royal Palm Beach & Lake Worth Beach',
    posts: [
      { tag: 'Market Update', title: 'West Palm Beach Condo Market: Trends & Top Picks' },
      { tag: 'Community Guide', title: "Wellington's Equestrian Season: How It Affects Real Estate" },
      { tag: 'Buying Guide', title: 'Palm Beach Island vs. West Palm Beach: Which Is Right for You?' },
    ],
  },
  {
    name: 'Southern Palm Beach County',
    description: 'Boca Raton, Delray Beach & Boynton Beach',
    posts: [
      { tag: 'Market Update', title: 'Boca Raton Luxury Market: Country Clubs & Coastal Estates' },
      { tag: 'Community Guide', title: 'Delray Beach: Atlantic Avenue Living & the Real Estate Market' },
      { tag: 'Buying Guide', title: 'Boynton Beach: Best Value in South Palm Beach County' },
    ],
  },
  {
    name: 'Treasure Coast',
    description: 'Stuart, Port St. Lucie, Hutchinson Island & surrounding areas',
    posts: [
      { tag: 'Market Update', title: 'Treasure Coast Real Estate: Growth, Value & Opportunity' },
      { tag: 'Community Guide', title: "Stuart, Florida: The Sailfish Capital's Real Estate Scene" },
      { tag: 'Buying Guide', title: 'Port St. Lucie: Why Buyers Are Moving North of Palm Beach' },
    ],
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-br from-sky-50 via-blue-50 to-white px-6 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-600">Blog</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold text-slate-900 sm:text-5xl">
            Real Estate Insights
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Market updates, buying and selling guides, and community spotlights for
            Palm Beach County and the Treasure Coast — from Christine & John at Premier Brokers International.
          </p>
        </div>
      </section>

      {/* Regional Sections */}
      {regions.map((region, i) => (
        <section
          key={region.name}
          className={`px-6 py-16 sm:px-8 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
        >
          <div className="mx-auto max-w-7xl">
            {/* Section header */}
            <div className="mb-10 border-b border-slate-200 pb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-600">
                {region.description}
              </p>
              <h2 className="mt-2 font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">
                {region.name}
              </h2>
            </div>

            {/* Post cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {region.posts.map((post) => (
                <div
                  key={post.title}
                  className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-card"
                >
                  <span className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                    {post.tag}
                  </span>
                  <h3 className="flex-1 text-base font-semibold leading-6 text-slate-800">
                    {post.title}
                  </h3>
                  <span className="text-xs font-semibold text-slate-400">Coming soon</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="bg-white px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-600">Stay Informed</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-slate-900">
            Have a Question About a Specific Market?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-600">
            Reach out directly — Christine and John respond the same day.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-gold-500 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gold-600"
            >
              Contact Us
            </Link>
            <Link
              href="/communities"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-8 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-gold-500 hover:text-gold-600"
            >
              Explore Communities
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
