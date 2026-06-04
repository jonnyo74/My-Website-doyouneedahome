import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllVisibleSorted, getRecentArticles, regionForCity, REGION_ORDER, groupForRegion } from '@/lib/articles'
import BlogRegionTabs from '@/components/BlogRegionTabs'

export const metadata: Metadata = {
  title: 'Blog | DO Homes Group',
  description:
    'Real estate insights, market updates, and community guides for Palm Beach County and the Treasure Coast from Christine Dekant & John Oliver at Premier Brokers International.',
}

export default function BlogPage() {
  const all = getAllVisibleSorted()
  const recent = getRecentArticles(4)
  const regionsPresent = REGION_ORDER.filter((r) => all.some((a) => regionForCity(a.citySlug) === r))

  const regionGroups = regionsPresent.map((region) => {
    const regionArticles = all.filter((a) => regionForCity(a.citySlug) === region)
    const cityNames = Array.from(new Set(regionArticles.map((a) => a.cityName)))
    return {
      region,
      group: groupForRegion(region),
      cities: cityNames.map((name) => ({
        name,
        posts: regionArticles.filter((a) => a.cityName === name),
      })),
    }
  })

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-slate-800 to-slate-700 px-6 py-20 sm:px-10 sm:py-28">
        {/* subtle texture overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[url('/images/jupiter-oceanfront-condo.jpg')] bg-cover bg-center opacity-10" />
        <div className="relative mx-auto max-w-5xl">
          <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-14">

            {/* Text */}
            <div className="flex-1 text-center lg:text-left">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-400">Real Estate Insights</p>
              <h1 className="mt-3 font-serif text-4xl font-semibold text-white sm:text-5xl lg:text-6xl">
                Local Knowledge.<br className="hidden sm:block" /> Straight Talk.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                Market updates, buying and selling guides, and community spotlights for
                Palm Beach County and the Treasure Coast — written by Christine & John, agents who actually live here.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <a
                  href="#latest"
                  className="inline-flex items-center justify-center rounded-full bg-gold-500 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gold-600"
                >
                  Browse Articles
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full border border-white/30 px-7 py-3 text-sm font-semibold text-white transition hover:border-white/60"
                >
                  Ask Us a Question
                </Link>
              </div>
            </div>

            {/* Agent headshots */}
            <div className="flex shrink-0 gap-6">
              {/* Christine */}
              <div className="flex flex-col items-center gap-3">
                <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white/20 shadow-xl sm:h-40 sm:w-40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/christine.jpg"
                    alt="Christine Dekant"
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-white">Christine Dekant</p>
                  <p className="text-xs text-gold-400">REALTOR® · RENE · GRI · CLA</p>
                </div>
              </div>
              {/* John */}
              <div className="flex flex-col items-center gap-3">
                <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white/20 shadow-xl sm:h-40 sm:w-40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/john-professional.jpg"
                    alt="John Oliver"
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-white">John Oliver</p>
                  <p className="text-xs text-gold-400">REALTOR® · ABR · RENE · SRS</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Recently Published */}
      {recent.length > 0 && (
        <section id="latest" className="bg-slate-50 px-6 py-16 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 border-b border-slate-200 pb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-600">Latest</p>
              <h2 className="mt-2 font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">Recently Published</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {recent.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card transition hover:shadow-card-hover"
                >
                  {post.heroImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.heroImage} alt={post.h1} className="h-40 w-full object-cover" />
                  )}
                  <div className="flex flex-1 flex-col gap-3 p-6">
                    <span className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                      {post.cityName}
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
        </section>
      )}

      {/* Browse by Region — tabbed */}
      {regionGroups.length > 0 && (
        <>
          <div className="bg-white px-6 pt-16 sm:px-8">
            <div className="mx-auto max-w-7xl border-b border-slate-200 pb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-600">All Guides</p>
              <h2 className="mt-2 font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">Browse by Area</h2>
            </div>
          </div>
          <BlogRegionTabs regions={regionGroups} />
        </>
      )}

      {regionGroups.length === 0 && (
        <section className="px-6 py-20 text-center sm:px-8">
          <p className="text-slate-500">New relocation guides are publishing soon — check back shortly.</p>
        </section>
      )}

      {/* CTA */}
      <section className="bg-slate-50 px-6 py-16 sm:px-8">
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
