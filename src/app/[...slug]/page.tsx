import siteMap from '@/lib/siteMap.json'
import CityHub from '@/components/templates/CityHub'
import CategoryPage from '@/components/templates/CategoryPage'
import CommunityPage from '@/components/templates/CommunityPage'
import MasterHub from '@/components/templates/MasterHub'
import SubCommunity from '@/components/templates/SubCommunity'

export const dynamicParams = true
export const revalidate = 60

export default function Page({ params }: { params: { slug?: string[] } }) {
  const slug = params.slug ?? []
  if (slug.length === 0) {
    return <div className="min-h-screen bg-white px-6 py-24 sm:px-8">Page not found</div>
  }

  const cityKey = slug[0]
  const city = (siteMap as any).cities?.[cityKey]
  if (!city) {
    return <div className="min-h-screen bg-white px-6 py-24 sm:px-8">City not found</div>
  }

  if (slug.length === 1) {
    return <CityHub data={city} />
  }

  if (slug.length === 2) {
    const second = slug[1]
    if (city.categories?.[second]) {
      return <CategoryPage data={city} categoryKey={second} />
    }
    if (city.masters?.[second]) {
      return <MasterHub data={city} masterKey={second} />
    }
    if (city.communities?.[second]) {
      return <CommunityPage data={city} communityKey={second} />
    }
    return <div className="min-h-screen bg-white px-6 py-24 sm:px-8">Page not found</div>
  }

  if (slug.length === 3) {
    const masterKey = slug[1]
    const subKey = slug[2]
    if (city.masters?.[masterKey]?.subcommunities?.[subKey]) {
      return <SubCommunity data={city} masterKey={masterKey} subKey={subKey} />
    }
    return <div className="min-h-screen bg-white px-6 py-24 sm:px-8">Page not found</div>
  }

  return <div className="min-h-screen bg-white px-6 py-24 sm:px-8">Page not found</div>
}
