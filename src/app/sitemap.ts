import type { MetadataRoute } from 'next'
import { cities, neighborhoods } from '@/lib/communities'
import { articles } from '@/lib/articles'
import { listings } from '@/lib/listings'
import { agents } from '@/lib/agents'
import { publishedLeadMagnets } from '@/lib/leadMagnets'
import { SITE_URL } from '@/lib/site'
import { discoverImageUrls } from '@/lib/discoverPhotos'

const BASE = SITE_URL

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/communities`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/buy`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/sell`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/team`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/contact`, changeFrequency: 'monthly', priority: 0.7 },
    // The analyzer is a tool, not a content page — its value is the interaction,
    // and every property view lives on a query string that must not be indexed.
    // Only the bare entry point belongs here.
    { url: `${BASE}/sun-shade`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/blog`, changeFrequency: 'weekly', priority: 0.6 },
    // Paired paddle-access guides. The launch map answers an informational
    // query and the communities table a transactional one, which is why they
    // are two URLs rather than one — they should rank for different searches.
    { url: `${BASE}/kayak-launches-jupiter-tequesta`, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/communities-with-kayak-launches`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/testimonials`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/privacy-policy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/accessibility`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/canadahomeseller`, changeFrequency: 'monthly', priority: 0.6 },
  ]

  // Lead-magnet landing pages. Only published magnets are listed — an offer
  // whose content isn't verified yet 404s in production and must not be here.
  const leadMagnetPages: MetadataRoute.Sitemap = publishedLeadMagnets.map((m) => ({
    url: `${BASE}${m.landingPage}`,
    changeFrequency: m.kind === 'market-report' ? 'monthly' : 'yearly',
    priority: 0.8,
  }))

  // lastModified is emitted only where the record carries a real edit date;
  // a fabricated "now" on every URL would teach Google to ignore the field.
  const cityPages: MetadataRoute.Sitemap = cities.map((c) => ({
    url: `${BASE}/communities/${c.slug}`,
    ...(c.dateModified && { lastModified: c.dateModified }),
    changeFrequency: 'weekly',
    priority: 0.85,
  }))

  const neighborhoodPages: MetadataRoute.Sitemap = neighborhoods.map((n) => ({
    url: `${BASE}/communities/${n.slug}`,
    ...(n.dateModified && { lastModified: n.dateModified }),
    changeFrequency: 'weekly',
    priority: 0.75,
  }))

  // Only published (live) blog articles belong in the sitemap.
  const blogPages: MetadataRoute.Sitemap = articles
    .filter((a) => a.published)
    .map((a) => {
      // Image sitemap entries only for posts that carry the DTPB photos.
      const images = discoverImageUrls(a.slug)
      return {
        url: `${BASE}/blog/${a.slug}`,
        lastModified: a.updated,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
        ...(images.length > 0 && { images }),
      }
    })

  // Per-agent valuation landing pages — high priority, they're the seller entry point.
  const agentPages: MetadataRoute.Sitemap = agents.map((a) => ({
    url: `${BASE}/sell/${a.slug}`,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const listingPages: MetadataRoute.Sitemap = listings
    .filter((l) => l.status !== 'Sold')
    .map((l) => ({
      url: `${BASE}/listings/${l.slug}`,
      changeFrequency: 'daily',
      priority: 0.85,
    }))

  return [
    ...staticPages,
    ...leadMagnetPages,
    ...agentPages,
    ...cityPages,
    ...neighborhoodPages,
    ...blogPages,
    ...listingPages,
  ]
}
