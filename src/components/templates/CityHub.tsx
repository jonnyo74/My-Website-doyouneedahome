'use client'

import Link from 'next/link'
import YlopoMarketTrendsWidget from '@/components/YlopoMarketTrendsWidget'
import YlopoResultsWidget from '@/components/YlopoResultsWidget'
import Breadcrumbs from '@/components/Breadcrumbs'

export default function CityHub({ data, citySlug }: { data: any; citySlug?: string }) {
  const categories = data.categories ? Object.keys(data.categories) : []
  const communities = data.communities ? Object.keys(data.communities) : []
  const masters = data.masters ? Object.keys(data.masters) : []
  const cityKey = citySlug || data.slug

  return (
    <main className="min-h-screen bg-white">
      <Breadcrumbs items={[{ label: data.name, href: `/${cityKey}` }]} />

      <section className="mx-auto max-w-4xl px-6 py-12 sm:px-8 sm:py-20">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          {data.name} Homes & Real Estate
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Discover premium communities, lifestyle neighborhoods, and luxury homes in {data.name}, Florida.
        </p>
      </section>

      <section className="bg-gray-50 py-12 sm:py-20">
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

      <section className="py-12 sm:py-20">
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

      {masters.length > 0 && (
        <section className="bg-gray-50 py-12 sm:py-20">
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

      <section className="py-12 sm:py-20">
        <div className="mx-auto max-w-4xl px-6 sm:px-8">
          <YlopoMarketTrendsWidget city={data.name} />
        </div>
      </section>

      <section className="py-12 sm:py-20">
        <div className="mx-auto max-w-4xl px-6 sm:px-8">
          <YlopoResultsWidget city={data.name} />
        </div>
      </section>

      <section className="bg-blue-50 py-12 sm:py-20">
        <div className="mx-auto max-w-2xl px-6 text-center sm:px-8">
          <h2 className="text-2xl font-bold text-gray-900">Ready to explore {data.name}?</h2>
          <p className="mt-4 text-gray-600">
            Let's find your perfect home in this vibrant community.
          </p>
          <a
            href="tel:5617837733"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            Call John Oliver: 561-783-7733
          </a>
        </div>
      </section>
    </main>
  )
}
