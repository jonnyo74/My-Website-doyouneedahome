'use client'

import YlopoMarketTrendsWidget from '@/components/YlopoMarketTrendsWidget'

export default function CommunityPage({ data, communityKey }: { data: any; communityKey: string }) {
  const community = data.communities[communityKey]

  return (
    <main>
      <section>
        <h1>Homes in {community.name}, {data.name}</h1>
        <p>Community overview and lifestyle description.</p>
      </section>

      <section>
        <h2>What buyers should know</h2>
        <p>Home styles, amenities, and buyer fit for {community.name}.</p>
      </section>

      <section className="mt-16">
        <YlopoMarketTrendsWidget city={data.name} />
      </section>
    </main>
  )
}
