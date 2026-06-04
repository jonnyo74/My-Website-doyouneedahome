'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Article } from '@/lib/articles'

interface RegionGroup {
  region: string
  group: string
  cities: { name: string; posts: Article[] }[]
}

export default function BlogRegionTabs({ regions }: { regions: RegionGroup[] }) {
  const [active, setActive] = useState(0)
  const current = regions[active]

  return (
    <section className="bg-white px-6 py-16 sm:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Tab bar */}
        <div className="mb-10 flex flex-wrap gap-2 border-b border-slate-200 pb-0">
          {regions.map((r, i) => (
            <button
              key={r.region}
              onClick={() => setActive(i)}
              className={`mb-[-1px] rounded-t-xl border border-b-0 px-5 py-2.5 text-sm font-semibold transition ${
                i === active
                  ? 'border-slate-200 bg-white text-gold-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {r.region}
            </button>
          ))}
        </div>

        {/* City groups */}
        <div className="space-y-12">
          {current.cities.map(({ name, posts }) => (
            <div key={name}>
              <h3 className="mb-5 font-serif text-xl font-semibold text-slate-800">{name}</h3>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card transition hover:shadow-card-hover"
                  >
                    {post.heroImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={post.heroImage} alt={post.h1} className="h-40 w-full object-cover" />
                    )}
                    <div className="flex flex-1 flex-col gap-3 p-6">
                      <span className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                        {post.type}
                      </span>
                      <span className="flex-1 text-base font-semibold leading-6 text-slate-800 transition group-hover:text-gold-600">
                        {post.h1}
                      </span>
                      <span className="text-xs font-semibold text-gold-600">Read more →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
