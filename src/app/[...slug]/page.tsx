import { notFound, permanentRedirect } from 'next/navigation'
import siteMap from '@/lib/siteMap.json'
import { cities, communities } from '@/lib/communities'
import CityHub from '@/components/templates/CityHub'
import CategoryPage from '@/components/templates/CategoryPage'
import CommunityPage from '@/components/templates/CommunityPage'
import MasterHub from '@/components/templates/MasterHub'
import SubCommunity from '@/components/templates/SubCommunity'

export const dynamicParams = true
export const revalidate = 60

// Legacy hierarchy (/jupiter/gated-communities/...) superseded by flat
// /communities/* pages — keep reachable URLs out of the index.
//
// These still need a descriptive <title> (WCAG 2.4.2): without one every page
// in this family inherited the generic site title, so a screen-reader user
// with several tabs open could not tell them apart. noindex is unchanged, so
// this has no bearing on search.
export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug: rawSlug } = await params
  const slug = rawSlug ?? []
  const city = (siteMap as any).cities?.[slug[0]]
  const cityName = city?.name

  let name: string | undefined
  if (cityName && slug.length >= 2) {
    const second = slug[1]
    const third = slug[2]
    name =
      city.masters?.[second]?.subcommunities?.[third]?.name ??
      city.categories?.[second]?.name ??
      city.masters?.[second]?.name ??
      city.communities?.[second]?.name ??
      city.communities?.[third]?.name
  }

  const title = cityName
    ? `${name ? `${name} — ` : ''}${cityName} Real Estate | DO Homes Group`
    : 'DO Homes Group | Palm Beach County Real Estate'

  return { title, robots: { index: false, follow: false } }
}

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug: rawSlug } = await params
  const slug = rawSlug ?? []
  if (slug.length === 0) {
    notFound()
  }

  const cityKey = slug[0]

  // Bare legacy city URLs (/jupiter) 308 to the canonical flat page.
  if (slug.length === 1 && communities.some(c => c.slug === cityKey)) {
    permanentRedirect(`/communities/${cityKey}`)
  }

  const city = (siteMap as any).cities?.[cityKey]
  if (!city) {
    notFound()
  }

  if (slug.length === 1) {
    const cityData = cities.find(c => c.slug === cityKey)
    return <CityHub data={city} citySlug={cityKey} cityData={cityData} />
  }

  if (slug.length === 2) {
    const second = slug[1]
    if (city.categories?.[second]) {
      return <CategoryPage data={city} categoryKey={second} citySlug={cityKey} />
    }
    if (city.masters?.[second]) {
      return <MasterHub data={city} masterKey={second} citySlug={cityKey} />
    }
    if (city.communities?.[second]) {
      return <CommunityPage data={city} communityKey={second} citySlug={cityKey} />
    }
    notFound()
  }

  if (slug.length === 3) {
    const categoryKey = slug[1]
    const communityKey = slug[2]

    // Check if it's a master community sub-community
    if (city.masters?.[categoryKey]?.subcommunities?.[communityKey]) {
      return <SubCommunity data={city} masterKey={categoryKey} subKey={communityKey} citySlug={cityKey} />
    }

    // Check if it's a category community
    if (city.categories?.[categoryKey]?.communities?.includes(communityKey)) {
      return <CommunityPage data={city} communityKey={communityKey} categoryKey={categoryKey} citySlug={cityKey} />
    }

    notFound()
  }

  notFound()
}
