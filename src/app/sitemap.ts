import type { MetadataRoute } from 'next'
import { cities, neighborhoods } from '@/lib/communities'
import { articles } from '@/lib/articles'
import { listings } from '@/lib/listings'
import { SITE_URL } from '@/lib/site'

const BASE = SITE_URL

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/communities`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/buy`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/sell`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/team`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/contact`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/blog`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE}/testimonials`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/canadahomeseller`, changeFrequency: 'monthly', priority: 0.6 },
  ]

  const cityPages: MetadataRoute.Sitemap = cities.map((c) => ({
    url: `${BASE}/communities/${c.slug}`,
    changeFrequency: 'weekly',
    priority: 0.85,
  }))

  const neighborhoodPages: MetadataRoute.Sitemap = neighborhoods.map((n) => ({
    url: `${BASE}/communities/${n.slug}`,
    changeFrequency: 'weekly',
    priority: 0.75,
  }))

  // Only published (live) blog articles belong in the sitemap.
  const blogPages: MetadataRoute.Sitemap = articles
    .filter((a) => a.published)
    .map((a) => ({
      url: `${BASE}/blog/${a.slug}`,
      changeFrequency: 'monthly',
      priority: 0.7,
    }))

  const listingPages: MetadataRoute.Sitemap = listings
    .filter((l) => l.status !== 'Sold')
    .map((l) => ({
      url: `${BASE}/listings/${l.slug}`,
      changeFrequency: 'daily',
      priority: 0.85,
    }))

  return [...staticPages, ...cityPages, ...neighborhoodPages, ...blogPages, ...listingPages]
}
