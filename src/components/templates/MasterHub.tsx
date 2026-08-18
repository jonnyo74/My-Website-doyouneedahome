'use client'

import Link from 'next/link'
import YlopoMarketTrendsWidget from '@/components/YlopoMarketTrendsWidget'
import YlopoResultsWidget from '@/components/YlopoResultsWidget'
import YlopoInit from '@/components/YlopoInit'
import Breadcrumbs from '@/components/Breadcrumbs'
import GreatSchoolsCard from '@/components/GreatSchoolsCard'

export default function MasterHub({ data, masterKey, citySlug }: { data: any; masterKey: string; citySlug?: string }) {
  const master = data.masters[masterKey]
  const cityKey = citySlug || data.slug

  if (!master) {
    return <div className="min-h-screen bg-white px-6 py-24 sm:px-8">Master community not found</div>
  }

  const subkeys = Object.keys(master.subcommunities || {})

  return (
    <div className="min-h-screen bg-white">
      <YlopoInit city={data.name} />
      <Breadcrumbs
        items={[
          { label: data.name, href: `/${cityKey}` },
          { label: master.name, href: `/${cityKey}/${masterKey}` },
        ]}
      />

      <section className="mx-auto max-w-4xl px-6 py-12 sm:px-8 sm:py-20">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          {master.name} Master-Planned Community
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          A premier master-planned community in {data.name} featuring diverse neighborhoods and lifestyle options.
        </p>
      </section>

      <section className="bg-gray-50 py-12 sm:py-20">
        <div className="mx-auto max-w-4xl px-6 sm:px-8">
          <h2 className="text-2xl font-bold text-gray-900">Community Overview</h2>
          <p className="mt-4 text-gray-600">
            {master.name} is a large-scale, master-planned development offering multiple neighborhoods with distinct
            character and price points. Whether you're seeking golf course living, luxury estates, or low-maintenance
            subdivisions, {master.name} has options to match your lifestyle.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div className="rounded-lg border border-gray-200 p-6">
              <p className="text-3xl font-bold text-blue-600">{subkeys.length}</p>
              <p className="mt-2 text-gray-600">Neighborhoods</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-6">
              <p className="text-3xl font-bold text-blue-600">Multiple</p>
              <p className="mt-2 text-gray-600">Price Points</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-6">
              <p className="text-3xl font-bold text-blue-600">Diverse</p>
              <p className="mt-2 text-gray-600">Home Styles</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20">
        <div className="mx-auto max-w-4xl px-6 sm:px-8">
          <h2 className="text-2xl font-bold text-gray-900">{master.name} Neighborhoods</h2>
          <p className="mt-2 text-gray-600">Explore the {subkeys.length} unique neighborhoods within {master.name}</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {subkeys.map((key) => {
              const sub = master.subcommunities[key]
              return (
                <Link
                  key={key}
                  href={`/${cityKey}/${masterKey}/${key}`}
                  className="rounded-lg border border-gray-200 bg-white p-6 hover:border-blue-400 hover:shadow-md transition-all"
                >
                  <h3 className="text-lg font-semibold text-gray-900">{sub.name}</h3>
                  <p className="mt-2 text-sm text-gray-600">Unique neighborhood within {master.name}</p>
                  <p className="mt-4 text-sm font-medium text-blue-600">Explore →</p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-12 sm:py-20">
        <div className="mx-auto max-w-4xl px-6 sm:px-8">
          <h2 className="text-2xl font-bold text-gray-900">Community Amenities</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            <li className="flex items-center text-gray-600">
              <span className="mr-3 inline-block h-2 w-2 rounded-full bg-blue-600"></span>
              Championship golf courses
            </li>
            <li className="flex items-center text-gray-600">
              <span className="mr-3 inline-block h-2 w-2 rounded-full bg-blue-600"></span>
              Upscale clubs and dining
            </li>
            <li className="flex items-center text-gray-600">
              <span className="mr-3 inline-block h-2 w-2 rounded-full bg-blue-600"></span>
              World-class amenities
            </li>
            <li className="flex items-center text-gray-600">
              <span className="mr-3 inline-block h-2 w-2 rounded-full bg-blue-600"></span>
              Active lifestyle programs
            </li>
          </ul>
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
            Ready to explore {master.name}?
          </h2>
          <p className="mt-4 text-gray-600">
            Let's find the perfect neighborhood within {master.name} for your lifestyle.
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
