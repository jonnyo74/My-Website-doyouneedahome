import type { Metadata } from 'next'
import { leadMagnets } from '@/lib/leadMagnets'
import LeadMagnetLanding from '@/components/leadMagnet/LeadMagnetLanding'
import CountyMarketTables from '@/components/leadMagnet/CountyMarketTables'
// The same August 2026 data and narrative files the PDF is built from.
import martinMarket from '../../../scripts/pbc-county-report/data/martin-market-2026-08.json'
import martinNarrative from '../../../scripts/pbc-county-report/data/martin-narrative-2026-08.json'

const magnet = leadMagnets['martin-county-market-report']

export const metadata: Metadata = {
  title: magnet.metaTitle,
  description: magnet.metaDescription,
  alternates: { canonical: magnet.landingPage },
  openGraph: {
    title: magnet.title,
    description: magnet.ctaDescription,
    url: magnet.landingPage,
    images: [{ url: magnet.coverImageLarge, width: 960, height: 1242, alt: magnet.coverAlt }],
  },
}

export default function MartinCountyMarketReportPage() {
  return (
    <LeadMagnetLanding magnet={magnet}>
      <CountyMarketTables data={martinMarket} localLine={martinNarrative.insights.localLine} />
    </LeadMagnetLanding>
  )
}
