// Script loading is handled by YlopoInit on the parent page — do not reload here.
import { getAbacoaScope, scopeSearch } from '@/lib/abacoaScopes'

/**
 * The Ylopo results widget for one Abacoa route, driven entirely by the
 * verified scope in lib/abacoaScopes. Unlike YlopoResultsWidget it applies no
 * price floor, so condos and townhomes under $400K are included.
 */
export default function AbacoaScopeWidget({ slug }: { slug: string }) {
  const scope = getAbacoaScope(slug)
  if (!scope) return null
  return (
    <div
      className="YLOPO_resultsWidget overflow-hidden rounded-2xl"
      data-search={JSON.stringify(scopeSearch(scope))}
    />
  )
}
