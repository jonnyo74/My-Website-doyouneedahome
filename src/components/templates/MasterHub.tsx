'use client'

import YlopoMarketTrendsWidget from '@/components/YlopoMarketTrendsWidget'

export default function MasterHub({ data, masterKey }: { data: any; masterKey: string }) {
  const master = data.masters[masterKey]

  return (
    <main>
      <section>
        <h1>{master.name} — Overview & Neighborhoods</h1>
        <p>Master community hub page with sub-community links.</p>
      </section>

      <section>
        <h2>Sub-Communities</h2>
        <ul>
          {Object.keys(master.subcommunities).map((slug) => (
            <li key={slug}>{master.subcommunities[slug].name}</li>
          ))}
        </ul>
      </section>

      <section className="mt-16">
        <YlopoMarketTrendsWidget city={data.name} />
      </section>
    </main>
  )
}
