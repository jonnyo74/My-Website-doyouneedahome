'use client'

import AbacoaListings from '@/components/AbacoaListings'
import { COLONY_LEAD_CTA, COLONY_SCOPE } from '@/lib/colonyScope'

/**
 * The scoped listings block for Jupiter Inlet Colony. It reuses the Abacoa
 * listings wrapper (loading, results, verified-empty and feed-unavailable
 * states, card labelling) with the Colony's own scope, so a true zero and a
 * broken feed are told apart the same way here as there.
 */
export default function ColonyListings({ children }: { children: React.ReactNode }) {
  return (
    <AbacoaListings
      slug={COLONY_SCOPE.slug}
      scope={COLONY_SCOPE}
      areaNote="Town of Jupiter Inlet Colony"
      submitLabel={COLONY_LEAD_CTA}
    >
      {children}
    </AbacoaListings>
  )
}
