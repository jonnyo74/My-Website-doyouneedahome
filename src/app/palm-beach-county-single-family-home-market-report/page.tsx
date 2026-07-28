import type { Metadata } from 'next'
import { marketReports } from '@/lib/marketReports'
import MarketReportLanding from '@/components/leadMagnet/MarketReportLanding'

const report = marketReports['single-family']

export const metadata: Metadata = {
  title: `Palm Beach County Single Family Home Market Report (${report.edition}) | Free PDF`,
  description: `Free ${report.edition} Palm Beach County single family home market report: $700K median price, 1,482 closed sales, 3.9 months of inventory. ${report.dataMonth} MLS data — instant download.`,
  alternates: { canonical: report.landingPage },
  openGraph: {
    title: report.title,
    description: `Free ${report.edition} report on Palm Beach County home prices, inventory, and negotiating conditions — instant PDF download.`,
    url: report.landingPage,
    images: [{ url: report.coverImageLarge, width: 960, height: 1242, alt: report.coverAlt }],
  },
}

export default function SingleFamilyReportPage() {
  return (
    <MarketReportLanding
      report={report}
      otherReport={marketReports['condo-townhome']}
      subheadline="See what is happening with home prices, inventory, sales activity, buyer demand, and negotiating conditions across Palm Beach County."
      internalLinks={[
        { label: 'Buying in Palm Beach County', href: '/buy' },
        { label: 'Selling Your Home', href: '/sell' },
        { label: 'All Communities', href: '/communities' },
        { label: 'Jupiter Real Estate', href: '/communities/jupiter' },
        { label: 'Palm Beach Gardens Real Estate', href: '/communities/palm-beach-gardens' },
        { label: 'Wellington Real Estate', href: '/communities/wellington' },
        { label: 'West Palm Beach Real Estate', href: '/communities/west-palm-beach' },
        { label: 'Boca Raton Real Estate', href: '/communities/boca-raton' },
        { label: 'Relocation Guides & Blog', href: '/blog' },
      ]}
    />
  )
}
