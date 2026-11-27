// Inquiry types for club-community pages. The browser sends only the KEY; the
// server looks the labels up here, so untrusted input never becomes a CRM tag.
// Shared by the form (client), /api/contact-requests (server) and the tests.

export const CLUB_INQUIRY_TYPES = {
  'membership-fees': {
    /** Option text in the form, and the button label on CTAs that preselect it. */
    label: 'Request Current Membership Fees',
    /** Classification in the CRM, after the community name: "Admirals Cove — Membership Information". */
    crmLabel: 'Membership Information',
    /** A stable, community-independent tag an automation can key on. */
    tag: 'Membership Fee Request',
    placeholder: 'Which membership category are you considering, and which home or price range?',
  },
  'membership-check': {
    label: 'Check Membership for a Specific Home',
    crmLabel: 'Membership Check for a Home',
    tag: 'Membership Check Request',
    placeholder: 'The address or listing link, and the membership category you want (for example, Full Golf).',
  },
  'ownership-costs': {
    label: 'Request Current Ownership Costs',
    crmLabel: 'Ownership Costs',
    tag: 'Ownership Cost Request',
    placeholder: 'The home or home type you are weighing. We will gather club, association, tax and insurance figures for it.',
  },
  'boat-fit': {
    label: 'Find a Waterfront Home That Fits Your Boat',
    crmLabel: 'Boat Fit Search',
    tag: 'Boat Fit Search',
    placeholder: 'Your boat: length overall, beam, draft and height above the water. Lift or in the water?',
  },
  'private-showing': {
    label: 'Request a Private Showing',
    crmLabel: 'Private Showing',
    tag: 'Showing Request',
    placeholder: 'The address or listing link (or several), and the days that suit you.',
  },
  'listing-alerts': {
    label: 'Receive New Listings',
    crmLabel: 'Listing Alerts',
    tag: 'Listing Alert Request',
    placeholder: 'Home type, price range and anything the home must have.',
  },
  'club-options': {
    label: 'Discuss Your Country Club Options',
    crmLabel: 'Club Comparison',
    tag: 'Club Comparison Request',
    placeholder: 'What matters most: golf, the boat, the price, the membership terms?',
  },
} as const

export type ClubInquiryType = keyof typeof CLUB_INQUIRY_TYPES

export function isClubInquiryType(v: unknown): v is ClubInquiryType {
  return typeof v === 'string' && Object.prototype.hasOwnProperty.call(CLUB_INQUIRY_TYPES, v)
}

/** "Admirals Cove — Membership Information" */
export function inquiryClassification(pageName: string | undefined, type: ClubInquiryType): string {
  const label = CLUB_INQUIRY_TYPES[type].crmLabel
  return pageName ? `${pageName} — ${label}` : label
}
