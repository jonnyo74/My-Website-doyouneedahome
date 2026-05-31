'use client'

import YlopoMarketTrendsWidget from '@/components/YlopoMarketTrendsWidget'

export default function SubCommunity({ data, masterKey, subKey }: { data: any; masterKey: string; subKey: string }) {
  const master = data.masters[masterKey]
  const sub = master.subcommunities[subKey]

  return (
    <main>
      <section>
        <h1>{sub.name} at {master.name}</h1>
        <p>Sub-community overview for {sub.name} within {master.name}.</p>
      </section>

      <section>
        <h2>Community profile</h2>
        <p>Details, amenities, and buyer fit for {sub.name}.</p>
      </section>

      <section className="mt-16">
        <YlopoMarketTrendsWidget city={data.name} />
      </section>
    </main>
  )
}
