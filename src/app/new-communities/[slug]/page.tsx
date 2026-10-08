import type { Metadata } from 'next'
import { permanentRedirect } from 'next/navigation'
import { getCommunityBySlug } from '@/lib/communities'

export const metadata: Metadata = { robots: { index: false, follow: true } }

// Old Ylopo URLs: /new-communities/<name>-real-estate. Send each to its
// /communities/<name> page when we have built one, otherwise to the index so
// Search Console sees a clean 308 instead of a redirect that ends in a 404.
export default async function LegacyNewCommunity({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const base = slug.replace(/-real-estate$/, '')
  permanentRedirect(getCommunityBySlug(base) ? `/communities/${base}` : '/communities')
}
