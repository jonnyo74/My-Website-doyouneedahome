'use client'

import Link from 'next/link'
import YlopoMarketTrendsWidget from '@/components/YlopoMarketTrendsWidget'
import YlopoResultsWidget from '@/components/YlopoResultsWidget'
import YlopoInit from '@/components/YlopoInit'
import Breadcrumbs from '@/components/Breadcrumbs'
import GreatSchoolsCard from '@/components/GreatSchoolsCard'

export default function CommunityPage({
  data,
  communityKey,
  categoryKey,
  citySlug,
}: {
  data: any
  communityKey: string
  categoryKey?: string
  citySlug?: string
}) {
  const community = data.communities[communityKey]
  const category = categoryKey ? data.categories[categoryKey] : null
  const cityKey = citySlug || data.slug
  const allCommunities = Object.keys(data.communities)
  const similarCommunities = allCommunities.filter(
    (k) => k !== communityKey && community.categories?.some((cat: string) => data.communities[k].categories?.includes(cat))
  ).slice(0, 3)

  if (!community) {
    return <div className="min-h-screen bg-white px-6 py-24 sm:px-8">Community not found</div>
  }

  return (
    <main className="min-h-screen bg-white">
      <YlopoInit city={data.name} />
      <Breadcrumbs
        items={[
          { label: data.name, href: `/${cityKey}` },
          ...(category ? [{ label: category.name, href: `/${cityKey}/${categoryKey}` }] : []),
          { label: community.name, href: `/${cityKey}${categoryKey ? `/${categoryKey}` : ''}/${communityKey}` },
        ]}
      />

      <section className="mx-auto max-w-4xl px-6 py-12 sm:px-8 sm:py-20">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          {community.name} Homes for Sale in {data.name}
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Discover what makes {community.name} one of {data.name}'s most desirable communities.
        </p>
      </section>

      <section className="bg-gray-50 py-12 sm:py-20">
        <div className="mx-auto max-w-4xl px-6 sm:px-8">
          <h2 className="text-2xl font-bold text-gray-900">Community Overview</h2>
          <p className="mt-4 text-gray-600">
            {community.name} is a premier community in {data.name} offering a unique lifestyle experience tailored
            to discerning buyers. This page provides comprehensive details about the community's amenities, home
            styles, and neighborhood character.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-20">
        <div className="mx-auto max-w-4xl px-6 sm:px-8">
          <h2 className="text-2xl font-bold text-gray-900">Key Details</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900">Location</h3>
              <p className="mt-2 text-gray-600">{data.name}, Florida</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900">Home Styles</h3>
              <p className="mt-2 text-gray-600">Single-family homes, condos, townhomes</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900">Price Range</h3>
              <p className="mt-2 text-gray-600">Varies by home style and size</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900">Buyer Profile</h3>
              <p className="mt-2 text-gray-600">View full community page for details</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-12 sm:py-20">
        <div className="mx-auto max-w-4xl px-6 sm:px-8">
          <h2 className="text-2xl font-bold text-gray-900">Amenities & Features</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            <li className="flex items-center text-gray-600">
              <span className="mr-3 inline-block h-2 w-2 rounded-full bg-blue-600"></span>
              Community amenities
            </li>
            <li className="flex items-center text-gray-600">
              <span className="mr-3 inline-block h-2 w-2 rounded-full bg-blue-600"></span>
              HOA information available
            </li>
            <li className="flex items-center text-gray-600">
              <span className="mr-3 inline-block h-2 w-2 rounded-full bg-blue-600"></span>
              Schools overview
            </li>
            <li className="flex items-center text-gray-600">
              <span className="mr-3 inline-block h-2 w-2 rounded-full bg-blue-600"></span>
              Local dining & shopping
            </li>
          </ul>
        </div>
      </section>

      {similarCommunities.length > 0 && (
        <section className="py-12 sm:py-20">
          <div className="mx-auto max-w-4xl px-6 sm:px-8">
            <h2 className="text-2xl font-bold text-gray-900">Similar Communities</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {similarCommunities.map((key) => {
                const similar = data.communities[key]
                const similarCategory = similar.categories?.[0]
                return (
                  <Link
                    key={key}
                    href={`/${cityKey}${similarCategory ? `/${similarCategory}` : ''}/${key}`}
                    className="rounded-lg border border-gray-200 p-6 hover:border-blue-400 transition-colors"
                  >
                    <h3 className="font-semibold text-gray-900">{similar.name}</h3>
                    <p className="mt-2 text-sm text-blue-600">Compare →</p>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <section className="bg-gray-50 py-12 sm:py-20">
        <div className="mx-auto max-w-4xl px-6 sm:px-8">
          <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <div className="mt-8 space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900">What's the average home price in {community.name}?</h3>
              <p className="mt-2 text-gray-600">Prices vary by home style and location. Contact us for current market data.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Is there an HOA?</h3>
              <p className="mt-2 text-gray-600">HOA details vary by specific subdivision. We can provide detailed information.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">What schools serve this area?</h3>
              <p className="mt-2 text-gray-600">Contact us for a comprehensive school guide for {community.name}.</p>
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
          <h2 className="text-2xl font-bold text-gray-900">Want to learn more about {community.name}?</h2>
          <p className="mt-4 text-gray-600">
            I'd love to show you homes and help you understand what makes this community special.
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
