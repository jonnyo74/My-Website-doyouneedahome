'use client'

import AbacoaListings from '@/components/AbacoaListings'
import { BALLENISLES_LEAD_CTA, BALLENISLES_SCOPE } from '@/lib/ballenIslesScope'

/**
 * The scoped listings block for BallenIsles. Reuses the Abacoa listings
 * wrapper (loading, results, verified-empty and feed-unavailable states) with
 * this community's own scope, as the Admirals Cove page does.
 */
export default function BallenIslesListings({ children }: { children: React.ReactNode }) {
  return (
    <AbacoaListings
      slug={BALLENISLES_SCOPE.slug}
      scope={BALLENISLES_SCOPE}
      areaNote="BallenIsles, Palm Beach Gardens"
      submitLabel={BALLENISLES_LEAD_CTA}
    >
      {children}
    </AbacoaListings>
  )
}
