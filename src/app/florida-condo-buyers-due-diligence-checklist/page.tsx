import type { Metadata } from 'next'
import { leadMagnets } from '@/lib/leadMagnets'
import LeadMagnetLanding from '@/components/leadMagnet/LeadMagnetLanding'
import CondoChecklistPreview from '@/components/leadMagnet/CondoChecklistPreview'

const magnet = leadMagnets['condo-due-diligence']

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

export default function CondoDueDiligencePage() {
  return (
    <LeadMagnetLanding magnet={magnet}>
      <CondoChecklistPreview />
    </LeadMagnetLanding>
  )
}
