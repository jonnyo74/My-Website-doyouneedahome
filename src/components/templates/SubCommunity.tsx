'use client'

import Link from 'next/link'
import YlopoMarketTrendsWidget from '@/components/YlopoMarketTrendsWidget'
import YlopoResultsWidget from '@/components/YlopoResultsWidget'
import YlopoInit from '@/components/YlopoInit'
import Breadcrumbs from '@/components/Breadcrumbs'
import GreatSchoolsCard from '@/components/GreatSchoolsCard'

export default function SubCommunity({
  data,
  masterKey,
  subKey,
  citySlug,
}: {
  data: any
  masterKey: string
  subKey: string
  citySlug?: string
}) {
  const master = data.masters[masterKey]
  const sub = master?.subcommunities?.[subKey]
  const cityKey = citySlug || data.slug
  const subkeys = Object.keys(master?.subcommunities || {})
  const currentIndex = subkeys.indexOf(subKey)
  const similarSubs = subkeys.filter((_, i) => Math.abs(i - currentIndex) <= 2 && _ !== subKey).slice(0, 2)

  if (!master || !sub) {
    return <div className="min-h-screen bg-white px-6 py-24 sm:px-8">Community not found</div>
  }

  return (
    <div className="min-h-screen bg-white">
      <YlopoInit city={data.name} />
      <Breadcrumbs
        items={[
          { label: data.name, href: `/${cityKey}` },
          { label: master.name, href: `/${cityKey}/${masterKey}` },
          { label: sub.name, href: `/${cityKey}/${masterKey}/${subKey}` },
        ]}
      />

      <section className="mx-auto max-w-4xl px-6 py-12 sm:px-8 sm:py-20">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          {sub.name} at {master.name}
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Discover homes in {sub.name}, a distinctive neighborhood within {master.name} in {data.name}, Florida.
        </p>
      </section>

      <section className="bg-gray-50 py-12 sm:py-20">
        <div className="mx-auto max-w-4xl px-6 sm:px-8">
          <h2 className="text-2xl font-bold text-gray-900">Neighborhood Profile</h2>
          <p className="mt-4 text-gray-600">
            {sub.name} offers a unique living experience within the {master.name} master-planned community,
            combining the benefits of master-planned amenities with a distinctive neighborhood character.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-20">
        <div className="mx-auto max-w-4xl px-6 sm:px-8">
          <h2 className="text-2xl font-bold text-gray-900">Key Details</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900">Master Community</h3>
              <p className="mt-2 text-gray-600">{master.name}</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900">City</h3>
              <p className="mt-2 text-gray-600">{data.name}, Florida</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900">Home Styles</h3>
              <p className="mt-2 text-gray-600">Varies by neighborhood</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900">Master Amenities</h3>
              <p className="mt-2 text-gray-600">Full {master.name} access</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-12 sm:py-20">
        <div className="mx-auto max-w-4xl px-6 sm:px-8">
          <h2 className="text-2xl font-bold text-gray-900">What Makes {sub.name} Special</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            <li className="flex items-start text-gray-600">
              <span className="mr-3 inline-block h-2 w-2 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
              <span>Distinctive neighborhood character within {master.name}</span>
            </li>
            <li className="flex items-start text-gray-600">
              <span className="mr-3 inline-block h-2 w-2 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
              <span>Access to all {master.name} amenities and clubs</span>
            </li>
            <li className="flex items-start text-gray-600">
              <span className="mr-3 inline-block h-2 w-2 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
              <span>Variety of home sizes and price points</span>
            </li>
            <li className="flex items-start text-gray-600">
              <span className="mr-3 inline-block h-2 w-2 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
              <span>Central location in {data.name}</span>
            </li>
          </ul>
        </div>
      </section>

      {similarSubs.length > 0 && (
        <section className="py-12 sm:py-20">
          <div className="mx-auto max-w-4xl px-6 sm:px-8">
            <h2 className="text-2xl font-bold text-gray-900">Other {master.name} Neighborhoods</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {similarSubs.map((key) => {
                const similar = master.subcommunities[key]
                return (
                  <Link
                    key={key}
                    href={`/${cityKey}/${masterKey}/${key}`}
                    className="rounded-lg border border-gray-200 p-6 hover:border-blue-400 transition-colors"
                  >
                    <h3 className="font-semibold text-gray-900">{similar.name}</h3>
                    <p className="mt-2 text-sm text-blue-600">Explore →</p>
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
              <h3 className="font-semibold text-gray-900">
                What's included with living in {sub.name}?
              </h3>
              <p className="mt-2 text-gray-600">
                Residents enjoy access to all {master.name} amenities, clubs, and community facilities.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">How does {sub.name} compare to other neighborhoods in {master.name}?</h3>
              <p className="mt-2 text-gray-600">
                Each neighborhood in {master.name} has distinct character and price points. We can help you understand the differences.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">What are current home prices in {sub.name}?</h3>
              <p className="mt-2 text-gray-600">
                Prices vary by home style and size. Contact us for current market data.
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
            Interested in {sub.name}?
          </h2>
          <p className="mt-4 text-gray-600">
            Let's explore what {sub.name} at {master.name} has to offer for your lifestyle.
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
