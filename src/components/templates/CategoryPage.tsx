'use client'

import Link from 'next/link'
import YlopoMarketTrendsWidget from '@/components/YlopoMarketTrendsWidget'
import YlopoResultsWidget from '@/components/YlopoResultsWidget'
import YlopoInit from '@/components/YlopoInit'
import Breadcrumbs from '@/components/Breadcrumbs'
import GreatSchoolsCard from '@/components/GreatSchoolsCard'

export default function CategoryPage({
  data,
  categoryKey,
  citySlug,
}: {
  data: any
  categoryKey: string
  citySlug?: string
}) {
  const category = data.categories[categoryKey]
  const cityKey = citySlug || data.slug

  if (!category) {
    return <div className="min-h-screen bg-white px-6 py-24 sm:px-8">Category not found</div>
  }

  return (
    <div className="min-h-screen bg-white">
      <YlopoInit city={data.name} />
      <Breadcrumbs
        items={[
          { label: data.name, href: `/${cityKey}` },
          { label: category.name, href: `/${cityKey}/${categoryKey}` },
        ]}
      />

      <section className="mx-auto max-w-4xl px-6 py-12 sm:px-8 sm:py-20">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          {category.name} in {data.name}
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Explore our curated selection of {category.name.toLowerCase()} in {data.name}. Each community offers
          unique lifestyle benefits and amenities.
        </p>
      </section>

      <section className="py-12 sm:py-20">
        <div className="mx-auto max-w-4xl px-6 sm:px-8">
          <h2 className="text-2xl font-bold text-gray-900">Featured Communities</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {category.communities?.map((slug: string) => {
              const community = data.communities[slug]
              if (!community) return null
              return (
                <div
                  key={slug}
                  className="rounded-lg border border-gray-200 bg-white p-6 hover:border-blue-400 hover:shadow-md transition-all"
                >
                  <h3 className="text-lg font-semibold text-gray-900">{community.name}</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Discover what makes this community special
                  </p>
                  <Link
                    href={`/${cityKey}/${categoryKey}/${slug}`}
                    className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    View Community<span className="sr-only"> — {community.name}</span> →
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-12 sm:py-20">
        <div className="mx-auto max-w-4xl px-6 sm:px-8">
          <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <div className="mt-8 space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900">What makes these {category.name.toLowerCase()}?</h3>
              <p className="mt-2 text-gray-600">
                Each community in this category shares distinctive lifestyle characteristics that appeal to
                specific buyer profiles.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">How do these communities compare?</h3>
              <p className="mt-2 text-gray-600">
                Review individual community pages to see detailed comparisons of amenities, pricing, and buyer
                fit.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">What's the typical price range?</h3>
              <p className="mt-2 text-gray-600">
                Price ranges vary significantly by community. Visit individual pages for specific market data.
              </p>
            </div>
          </div>
        </div>
      </section>

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

      <section className="py-12 sm:py-20">
        <div className="mx-auto max-w-4xl px-6 sm:px-8">
          <GreatSchoolsCard citySlug={cityKey} cityName={data.name} />
        </div>
      </section>

      <section className="bg-blue-50 py-12 sm:py-20">
        <div className="mx-auto max-w-2xl px-6 text-center sm:px-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Not sure which community is right for you?
          </h2>
          <p className="mt-4 text-gray-600">
            Let's talk through your lifestyle needs and find the perfect fit.
          </p>
          <a
            href="tel:5617837733"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            Call John Oliver: 561-783-7733
          </a>
        </div>
      </section>
    </div>
  )
}
