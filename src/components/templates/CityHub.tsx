'use client'

import YlopoMarketTrendsWidget from '@/components/YlopoMarketTrendsWidget'

export default function CityHub({ data }: { data: any }) {
  return (
    <main>
      <section>
        <h1>{data.name} Real Estate & Lifestyle Guide</h1>
        <p>City overview, buyer fit, and lifestyle intro.</p>
      </section>

      <section>
        <h2>Featured Categories</h2>
        <ul>
          {data.categories && Object.keys(data.categories).map((key) => (
            <li key={key}>{data.categories[key].name}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Featured Communities</h2>
        <ul>
          {data.communities && Object.keys(data.communities).slice(0, 8).map((key) => (
            <li key={key}>{data.communities[key].name}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Market Snapshot</h2>
        <p>Market context and recent trends for {data.name}.</p>
      </section>

      <section className="mt-16">
        <YlopoMarketTrendsWidget city={data.name} />
      </section>
    </main>
  )
}
