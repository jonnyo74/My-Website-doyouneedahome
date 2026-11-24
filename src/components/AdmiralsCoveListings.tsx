'use client'

import AbacoaListings from '@/components/AbacoaListings'
import { ADMIRALS_COVE_SCOPE, ADMIRALS_LEAD_CTA } from '@/lib/admiralsCoveScope'

/**
 * The scoped listings block for Admirals Cove. Reuses the Abacoa listings
 * wrapper (loading, results, verified-empty and feed-unavailable states) with
 * this community's own scope.
 */
export default function AdmiralsCoveListings({ children }: { children: React.ReactNode }) {
  return (
    <AbacoaListings
      slug={ADMIRALS_COVE_SCOPE.slug}
      scope={ADMIRALS_COVE_SCOPE}
      areaNote="Admirals Cove, Jupiter"
      submitLabel={ADMIRALS_LEAD_CTA}
    >
      {children}
    </AbacoaListings>
  )
}
