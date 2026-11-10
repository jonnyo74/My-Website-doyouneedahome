// Where each personal-reply offer is placed. Kept out of articles.ts (a very
// large content file) and dependency-free, so both the blog page and the
// download-confirmation client component can import it cheaply.

import type { OfferKey } from './offerRequests.ts'
import type { LeadMagnetKey } from './leadMagnets.ts'

/** Blog article slug → offers shown after the article body, in order. */
export const ARTICLE_OFFERS: Record<string, OfferKey[]> = {
  'best-neighborhoods-in-jupiter-florida': ['neighborhood-shortlist'],
  'best-neighborhoods-in-stuart-florida': ['neighborhood-shortlist', 'boat-fit'],
  'waterfront-homes-port-salerno-buyers-guide': ['boat-fit'],
  'cost-of-living-in-singer-island-florida': ['condo-building-review'],
}

/** Guide download → offer shown on its download confirmation. */
export const DOWNLOAD_CONFIRMATION_OFFERS: Partial<Record<LeadMagnetKey, OfferKey>> = {
  'relocation-decision-guide': 'neighborhood-shortlist',
  'condo-due-diligence': 'condo-building-review',
}
