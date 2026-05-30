import type { MetadataRoute } from 'next'
import { cities, neighborhoods } from '@/lib/communities'

const BASE = 'https://www.doyouneedahome.com'

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

  return [...staticPages, ...cityPages, ...neighborhoodPages]
}
