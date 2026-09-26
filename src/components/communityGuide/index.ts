import type { ComponentType } from 'react'
import { MirasolClosingCta, MirasolGuide } from './MirasolGuide'

/**
 * Long-form buyer's guides for communities whose purchase decision can't be
 * told through the generic data fields — Mirasol, where the club membership
 * attached to the home matters as much as the house.
 *
 * `Guide` renders after the overview; `Closing` renders after the FAQs and
 * receives the page's listings search URL.
 */
export type CommunityGuide = {
  Guide: ComponentType
  Closing?: ComponentType<{ searchHref: string }>
}

export const communityGuides: Record<string, CommunityGuide> = {
  mirasol: { Guide: MirasolGuide, Closing: MirasolClosingCta },
}
