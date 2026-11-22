import type { Metadata } from 'next'
import LaunchPrintChart from '@/components/paddle/LaunchPrintChart'

export const metadata: Metadata = {
  title: 'Printable Kayak Launch Chart: Jupiter & Tequesta | DO Homes Group',
  description:
    'A one-table, print-ready chart of every public kayak and paddleboard launch in Jupiter and Tequesta, with sources. No form required.',
  // A second rendering of the same data: the map page is the one to index and
  // the one links should consolidate on.
  alternates: { canonical: '/kayak-launches-jupiter-tequesta' },
  robots: { index: false, follow: true },
}

export default function KayakLaunchPrintPage() {
  return <LaunchPrintChart />
}
