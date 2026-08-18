'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import type { Article } from '@/lib/articles'
import ArticleCardPlaceholder from '@/components/ArticleCardPlaceholder'

interface RegionGroup {
  region: string
  group: string
  cities: { name: string; posts: Article[] }[]
}

const slugifyRegion = (r: string) => r.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export default function BlogRegionTabs({ regions }: { regions: RegionGroup[] }) {
  const [active, setActive] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Keep the selected region in the URL so a refresh, or a back-navigation from
  // an article, returns to the tab the reader was on instead of resetting to the
  // first region. Read on mount rather than during render to avoid a hydration
  // mismatch; written with replaceState so tab switches don't pile up in history.
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get('region')
    if (!wanted) return
    const i = regions.findIndex((r) => slugifyRegion(r.region) === wanted)
    if (i > 0) setActive(i)
  }, [regions])

  const selectRegion = (i: number) => {
    setActive(i)
    const url = new URL(window.location.href)
    if (i === 0) url.searchParams.delete('region')
    else url.searchParams.set('region', slugifyRegion(regions[i].region))
    window.history.replaceState(null, '', url)
  }

  // Arrow / Home / End move between tabs and select as they go (automatic
  // activation — the panels are already rendered, so there's nothing to wait
  // for). Tab itself leaves the tablist and lands in the panel below.
  const onTabKeyDown = (e: React.KeyboardEvent, i: number) => {
    const last = regions.length - 1
    let next: number | null = null
    if (e.key === 'ArrowRight') next = i === last ? 0 : i + 1
    else if (e.key === 'ArrowLeft') next = i === 0 ? last : i - 1
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = last
    if (next === null) return
    e.preventDefault()
    selectRegion(next)
    tabRefs.current[next]?.focus()
  }

  const current = regions[active]
  const tabId = (i: number) => `blog-region-tab-${slugifyRegion(regions[i].region)}`
  const panelId = (i: number) => `blog-region-panel-${slugifyRegion(regions[i].region)}`

  return (
    <section className="bg-white px-6 py-16 sm:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Tab bar */}
        <div
          role="tablist"
          aria-label="Articles by region"
          className="mb-10 flex flex-wrap gap-2 border-b border-slate-200 pb-0"
        >
          {regions.map((r, i) => (
            <button
              key={r.region}
              ref={(el) => { tabRefs.current[i] = el }}
              type="button"
              role="tab"
              id={tabId(i)}
              aria-selected={i === active}
              aria-controls={panelId(i)}
              // Roving tabindex: the tablist is one Tab stop, not six.
              tabIndex={i === active ? 0 : -1}
              onClick={() => selectRegion(i)}
              onKeyDown={(e) => onTabKeyDown(e, i)}
              className={`mb-[-1px] rounded-t-xl border border-b-0 px-5 py-2.5 text-sm font-semibold transition ${
                i === active
                  ? 'border-slate-200 bg-white text-gold-600'
                  : 'border-transparent text-slate-600 hover:text-slate-800'
              }`}
            >
              {r.region}
            </button>
          ))}
        </div>

        {/* City groups */}
        <div
          role="tabpanel"
          id={panelId(active)}
          aria-labelledby={tabId(active)}
          tabIndex={0}
          className="space-y-12 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-gold-500"
        >
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
                    {post.heroImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={post.heroImage} alt={post.h1} className="h-40 w-full object-cover" />
                    ) : (
                      <ArticleCardPlaceholder seed={post.slug} />
                    )}
                    <div className="flex flex-1 flex-col gap-3 p-6">
                      <span className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
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
