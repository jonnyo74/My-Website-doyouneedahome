import type { Metadata } from 'next'
import { marketReports } from '@/lib/marketReports'
import MarketReportLanding from '@/components/leadMagnet/MarketReportLanding'

const report = marketReports['condo-townhome']

export const metadata: Metadata = {
  title: `Palm Beach County Condo & Townhome Market Report (${report.edition}) | Free PDF`,
  description: `Free ${report.edition} Palm Beach County condo & townhome market report: $325K median price, 974 closed sales, 7.2 months of inventory, 59% cash sales. ${report.dataMonth} MLS data — instant download.`,
  alternates: { canonical: report.landingPage },
  openGraph: {
    title: report.title,
    description: `Free ${report.edition} report on Palm Beach County condo & townhome prices, inventory, cash activity, and buyer leverage — instant PDF download.`,
    url: report.landingPage,
    images: [{ url: report.coverImageLarge, width: 960, height: 1242, alt: report.coverAlt }],
  },
}

export default function CondoTownhomeReportPage() {
  return (
    <MarketReportLanding
      report={report}
      otherReport={marketReports['single-family']}
      subheadline="Understand current condo and townhome prices, inventory, cash activity, buyer leverage, association concerns, and the outlook for Palm Beach County."
      internalLinks={[
        { label: 'Buying in Palm Beach County', href: '/buy' },
        { label: 'Selling Your Condo or Townhome', href: '/sell' },
        { label: 'All Communities', href: '/communities' },
        { label: 'West Palm Beach Real Estate', href: '/communities/west-palm-beach' },
        { label: 'Singer Island Real Estate', href: '/communities/singer-island' },
        { label: 'Juno Beach Real Estate', href: '/communities/juno-beach' },
        { label: 'Palm Beach Real Estate', href: '/communities/palm-beach' },
        { label: 'Boca Raton Real Estate', href: '/communities/boca-raton' },
        { label: 'Relocation Guides & Blog', href: '/blog' },
      ]}
    />
  )
}
