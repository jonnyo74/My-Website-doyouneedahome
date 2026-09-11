import type { PaddleCommunity } from './types'
import { paddleCommunities } from './communities'
import { launches } from './launches'

/**
 * Which community pages offer which paddle guide.
 *
 * The two guides do not cover the same ground, so neither does this map. The
 * launch guide is a river guide: it runs from Riverbend in western Jupiter down
 * to the inlet, and upriver into Jonathan Dickinson, which is a Hobe Sound
 * address in Martin County. The communities table is a housing document about
 * Jupiter, Tequesta, Palm Beach Gardens, Juno Beach and North Palm Beach — it
 * contains no Hobe Sound entries at all.
 *
 * So Hobe Sound gets the launches and not the table. Sending a Hobe Sound buyer
 * to a 42-row comparison with nothing of theirs in it is the kind of internal
 * link that teaches a reader our links are not worth following.
 */
export interface PaddleCommunityLinks {
  /** Offer the public-launch map. */
  launches: boolean
  /** Offer the resident-access table. Only where the table has rows for the town. */
  communities: boolean
  /** How the table's town is spelled in `communities.ts`, for the row count. */
  townMatch?: string
}

export const PADDLE_COMMUNITY_LINKS: Record<string, PaddleCommunityLinks> = {
  jupiter: { launches: true, communities: true, townMatch: 'Jupiter' },
  tequesta: { launches: true, communities: true, townMatch: 'Tequesta' },
  'palm-beach-gardens': { launches: true, communities: true, townMatch: 'Palm Beach Gardens' },
  'north-palm-beach': { launches: true, communities: true, townMatch: 'North Palm Beach' },
  'juno-beach': { launches: true, communities: true, townMatch: 'Juno Beach' },
  // The Wild & Scenic run and Trapper Nelson launch from here. No communities.
  'hobe-sound': { launches: true, communities: false },
}

/** Communities in the table for a town, counted from the data rather than hardcoded. */
export function paddleCommunityCount(townMatch: string): number {
  return paddleCommunities.filter((c: PaddleCommunity) => c.town.startsWith(townMatch)).length
}

/** Public launches the guide lists. Used for the launch card's one-line pitch. */
export const LAUNCH_COUNT = launches.length
