'use client'

import Link from 'next/link'
import YlopoMarketTrendsWidget from '@/components/YlopoMarketTrendsWidget'
import YlopoResultsWidget from '@/components/YlopoResultsWidget'
import YlopoInit from '@/components/YlopoInit'
import Breadcrumbs from '@/components/Breadcrumbs'
import GreatSchoolsCard from '@/components/GreatSchoolsCard'
import type { CommunityItem } from '@/lib/communities'

export default function CityHub({
  data,
  citySlug,
  cityData,
}: {
  data: any
  citySlug?: string
  cityData?: CommunityItem
}) {
  const categories = data.categories ? Object.keys(data.categories) : []
  const communities = data.communities ? Object.keys(data.communities) : []
  const masters = data.masters ? Object.keys(data.masters) : []
  const cityKey = citySlug || data.slug

  const photos = cityData?.photos?.filter(Boolean) ?? []

  return (
    <main className="min-h-screen bg-white">
      <YlopoInit city={data.name} />
      <Breadcrumbs items={[{ label: data.name, href: `/${cityKey}` }]} />

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-12 sm:px-8 sm:py-16">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          {data.name} Real Estate
        </h1>
        <p className="mt-4 text-lg leading-8 text-gray-600 max-w-2xl">
          {cityData?.description ?? `Discover premium communities, lifestyle neighborhoods, and luxury homes in ${data.name}, Florida.`}
        </p>
      </section>

      {/* 1 — Listing Widget */}
      <section className="bg-gray-50 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Homes for Sale in {data.name}</h2>
          <YlopoResultsWidget city={data.name} />
        </div>
      </section>

      {/* 2 — About */}
      {cityData?.overview && (
        <section className="py-12 sm:py-20">
          <div className="mx-auto max-w-4xl px-6 sm:px-8">
            <h2 className="text-2xl font-bold text-gray-900">About {data.name}</h2>
            <div className="mt-6 prose prose-gray max-w-none">
              {cityData.overview.split('\n\n').map((para, i) => (
                <p key={i} className="mt-4 text-gray-600 leading-7">{para}</p>
              ))}
            </div>
            {cityData.quickFacts && cityData.quickFacts.length > 0 && (
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {cityData.quickFacts.map((fact) => (
                  <div key={fact.label} className="rounded-lg border border-gray-200 p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{fact.label}</p>
                    <p className="mt-1 text-sm text-gray-700">{fact.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 3 — Agent Quote */}
      <section className="bg-gray-900 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-6 sm:px-8">
          <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
            <img
              src="/images/john-professional.jpg"
              alt="John Oliver"
              className="w-24 h-24 rounded-full object-cover flex-shrink-0 border-2 border-white/20"
            />
            <div>
              <blockquote className="text-lg font-medium text-white leading-8">
                &ldquo;{cityData?.lifestyle?.split('.')[0] ?? `${data.name} is one of our most rewarding markets to work in`}. Whether you're searching for a private club estate, a waterfront home, or an established residential neighborhood, we know every pocket of this city.&rdquo;
              </blockquote>
              <p className="mt-4 text-sm text-gray-400">— John Oliver &amp; Christine Dekant, DO Homes Group</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 — Why [City] */}
      {cityData?.localLoves && cityData.localLoves.length > 0 && (
        <section className="py-12 sm:py-20">
          <div className="mx-auto max-w-4xl px-6 sm:px-8">
            <h2 className="text-2xl font-bold text-gray-900">Why {data.name}?</h2>
            <p className="mt-2 text-gray-500 text-sm">What our clients love most about living here</p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {cityData.localLoves.map((item, i) => (
                <li key={i} className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4">
                  <span className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-600"></span>
                  <span className="text-sm text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 5 — Gallery */}
      {photos.length > 0 && (
        <section className="bg-gray-50 py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-6 sm:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{data.name} in Photos</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {photos.slice(0, 6).map((src, i) => (
                <div key={i} className="aspect-[4/3] overflow-hidden rounded-lg bg-gray-200">
                  <img
                    src={src}
                    alt={`${data.name} real estate — photo ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Neighborhood navigation */}
      {categories.length > 0 && (
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-6 sm:px-8">
            <h2 className="text-2xl font-bold text-gray-900">Explore by Lifestyle</h2>
            <p className="mt-2 text-gray-600">Find homes based on what matters to you</p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {categories.map((key) => {
                const category = data.categories[key]
                return (
                  <Link
                    key={key}
                    href={`/${cityKey}/${key}`}
                    className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <p className="mt-2 text-sm text-gray-600">
                      {category.communities?.length || 0} communities
                    </p>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {communities.length > 0 && (
        <section className="bg-gray-50 py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-6 sm:px-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Communities</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {communities.slice(0, 6).map((key) => {
                const community = data.communities[key]
                const category = community.categories?.[0]
                return (
                  <div key={key} className="rounded-lg border border-gray-200 p-6 hover:border-blue-400 transition-colors">
                    <h3 className="font-semibold text-gray-900">{community.name}</h3>
                    {category && (
                      <p className="mt-1 text-sm text-gray-600">
                        {data.categories[category]?.name || category}
                      </p>
                    )}
                    <Link
                      href={`/${cityKey}/${category}/${key}`}
                      className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      Learn More →
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {masters.length > 0 && (
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-6 sm:px-8">
            <h2 className="text-2xl font-bold text-gray-900">Master-Planned Communities</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {masters.map((key) => {
                const master = data.masters[key]
                return (
                  <Link
                    key={key}
                    href={`/${cityKey}/${key}`}
                    className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-semibold text-gray-900">{master.name}</h3>
                    <p className="mt-2 text-sm text-gray-600">
                      {Object.keys(master.subcommunities || {}).length} neighborhoods
                    </p>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* GreatSchools */}
      <section className="bg-gray-50 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-6 sm:px-8">
          <GreatSchoolsCard citySlug={cityKey} cityName={data.name} />
        </div>
      </section>

      {/* Market Trends */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-6 sm:px-8">
          <YlopoMarketTrendsWidget city={data.name} />
        </div>
      </section>

      {/* 6 — Start Your Search CTA */}
      <section className="bg-blue-50 py-12 sm:py-20">
        <div className="mx-auto max-w-2xl px-6 text-center sm:px-8">
          <h2 className="text-2xl font-bold text-gray-900">Ready to start your search in {data.name}?</h2>
          <p className="mt-4 text-gray-600">
            We know every community, price point, and lifestyle fit in this market. Let's find the right one for you.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="tel:5617837733"
              className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
              Call: 561-783-7733
            </a>
            <a
              href="/contact"
              className="inline-block rounded-lg border border-blue-600 px-6 py-3 font-medium text-blue-600 hover:bg-blue-50"
            >
              Send a Message
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
