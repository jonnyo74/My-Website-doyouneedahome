import type { Metadata } from 'next'
import { leadMagnets } from '@/lib/leadMagnets'
import LeadMagnetLanding from '@/components/leadMagnet/LeadMagnetLanding'
import RelocationComparison from '@/components/leadMagnet/RelocationComparison'

const magnet = leadMagnets['relocation-decision-guide']

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

export default function RelocationGuidePage() {
  return (
    <LeadMagnetLanding magnet={magnet}>
      <RelocationComparison />
    </LeadMagnetLanding>
  )
}
