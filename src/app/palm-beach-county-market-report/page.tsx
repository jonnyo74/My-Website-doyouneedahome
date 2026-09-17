import type { Metadata } from 'next'
import { leadMagnets } from '@/lib/leadMagnets'
import LeadMagnetLanding from '@/components/leadMagnet/LeadMagnetLanding'
import CountyMarketTables from '@/components/leadMagnet/CountyMarketTables'
// The same August 2026 data file the PDF is built from.
import pbcMarket from '../../../scripts/pbc-county-report/data/pbc-market-2026-08.json'

const magnet = leadMagnets['palm-beach-county-market-report']

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

export default function PalmBeachCountyMarketReportPage() {
  return (
    <LeadMagnetLanding magnet={magnet}>
      <CountyMarketTables
        data={pbcMarket}
        localLine="County numbers blend dozens of very different communities, and your street, building or neighborhood can be moving differently."
      />
    </LeadMagnetLanding>
  )
}
