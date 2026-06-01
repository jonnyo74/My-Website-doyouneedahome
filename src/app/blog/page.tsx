import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllVisibleSorted, regionForCity, REGION_ORDER, groupForRegion } from '@/lib/articles'

export const metadata: Metadata = {
  title: 'Blog | DO Homes Group',
  description:
    'Real estate insights, market updates, and community guides for Palm Beach County and the Treasure Coast from Christine Dekant & John Oliver at Premier Brokers International.',
}

export default function BlogPage() {
  const all = getAllVisibleSorted()
  const regionsPresent = REGION_ORDER.filter((r) => all.some((a) => regionForCity(a.citySlug) === r))

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

      {/* Article sections grouped by region → city */}
      {regionsPresent.length === 0 ? (
        <section className="px-6 py-20 text-center sm:px-8">
          <p className="text-slate-500">New relocation guides are publishing soon — check back shortly.</p>
        </section>
      ) : (
        regionsPresent.map((region, i) => {
          const regionArticles = all.filter((a) => regionForCity(a.citySlug) === region)
          const regionCities = Array.from(new Set(regionArticles.map((a) => a.cityName)))
          return (
            <section
              key={region}
              className={`px-6 py-16 sm:px-8 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
            >
              <div className="mx-auto max-w-7xl">
                <div className="mb-10 border-b border-slate-200 pb-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-600">
                    {groupForRegion(region)}
                  </p>
                  <h2 className="mt-2 font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">
                    {region}
                  </h2>
                </div>

                <div className="space-y-12">
                  {regionCities.map((city) => {
                    const posts = regionArticles.filter((a) => a.cityName === city)
                    return (
                      <div key={city}>
                        <h3 className="mb-4 font-serif text-xl font-semibold text-slate-800">{city}</h3>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                          {posts.map((post) => (
                            <Link
                              key={post.slug}
                              href={`/blog/${post.slug}`}
                              className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card transition hover:shadow-card-hover"
                            >
                              {post.heroImage && (
                                <>
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={post.heroImage} alt={post.h1} className="h-40 w-full object-cover" />
                                </>
                              )}
                              <div className="flex flex-1 flex-col gap-3 p-6">
                                <span className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                                  {post.type}
                                </span>
                                <span className="flex-1 text-base font-semibold leading-6 text-slate-800 transition group-hover:text-gold-600">
                                  {post.h1}
                                </span>
                                <span className="text-xs font-semibold text-gold-600">Read more →</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </section>
          )
        })
      )}

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
