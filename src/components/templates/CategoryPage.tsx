'use client'

import YlopoMarketTrendsWidget from '@/components/YlopoMarketTrendsWidget'

export default function CategoryPage({ data, categoryKey }: { data: any; categoryKey: string }) {
  const category = data.categories[categoryKey]

  return (
    <main>
      <section>
        <h1>{category.name} in {data.name}</h1>
        <p>Category overview and buyer fit for {data.name}.</p>
      </section>

      <section>
        <h2>Featured Communities</h2>
        <ul>
          {category.communities.map((slug: string) => (
            <li key={slug}>{data.communities[slug]?.name ?? slug}</li>
          ))}
        </ul>
      </section>

      <section className="mt-16">
        <YlopoMarketTrendsWidget city={data.name} />
      </section>
    </main>
  )
}
