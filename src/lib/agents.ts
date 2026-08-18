// Single source of truth for the two agents' public details, plus the copy that
// drives their personal valuation landing pages at /sell/[agent].
//
// These pages replace the Ylopo-hosted "free home analysis" page that lives on
// john.doyouneedahome.com — same job (address-first seller capture), but on our
// own domain, in our own design system, feeding our own FUB pipeline.
//
// Adding a third agent means adding a record here; the route, sitemap entry,
// and /sell links all derive from this list.

/**
 * The fields a valuation form needs to address someone and route the lead.
 * `Agent` satisfies it, and so does the neutral team route used on /sell — the
 * main sell page no longer asks a visitor to choose an agent before they know
 * the team.
 */
export interface ValuationRoute {
  slug: string
  firstName: string
  name: string
  phone: string
  phoneHref: string
  email: string
  /** Applied to every FUB lead from this route so routing rules can pick it up. */
  crmTag: string
  /**
   * Passed to Follow Up Boss as `person.assignedTo`. FUB matches this on the
   * user's full name — it must be EXACTLY the display name on their FUB
   * account or the assignment silently won't stick. Undefined means "let FUB's
   * own lead distribution decide".
   */
  fubAssignedTo?: string
}

export interface Agent extends ValuationRoute {
  title: string
  credentials: string[]
  license: string
  photo: string
  /** Tailwind object-position class — these two headshots crop differently. */
  photoPosition: string
  /** Always set for a named agent — the lead lands directly in their queue. */
  fubAssignedTo: string
  /** Hero subhead, first person — this is the agent talking, not the brand. */
  pitch: string
  /** Three reasons to trust this specific agent with a valuation. */
  strengths: { title: string; body: string }[]
  bio: string
}

export const agents: Agent[] = [
  {
    slug: 'john',
    firstName: 'John',
    name: 'John Oliver',
    title: 'REALTOR®',
    credentials: ['SRS', 'ABR', 'RENE', 'RSPS'],
    license: '3355676',
    phone: '(561) 786-3630',
    phoneHref: 'tel:+15617863630',
    email: 'john@doyouneedahome.com',
    photo: '/images/Event-81.jpg',
    photoPosition: 'object-[center_25%]',
    crmTag: 'Agent: John Oliver',
    fubAssignedTo: 'John Oliver',
    pitch:
      "Tell me where your home is and I'll pull the actual comparable sales — not an automated estimate. You'll get a real number, how I arrived at it, and what I'd do to get you more than it.",
    strengths: [
      {
        title: 'Seller Representative Specialist',
        body: 'The SRS is the national designation for advanced seller representation. Fewer than one in twenty agents holds it — it means listing strategy is what I trained for specifically.',
      },
      {
        title: 'Certified Negotiation Expert',
        body: 'My RENE training is in negotiation, and that is where a listing makes or loses money. Inspection credits, repair demands, appraisal gaps — every one of those is a number I push back on for you.',
      },
      {
        title: 'Condo & Waterfront Focus',
        body: "Waterfront and condo valuations turn on details a generic estimate can't see — floor, view orientation, dockage, HOA health, assessment history. That's the segment I work in every day.",
      },
    ],
    bio: 'John Oliver brings honesty, dedication, and an exceptional work ethic to every real estate transaction. He specializes in helping buyers and sellers across Palm Beach County, with a particular focus on condos and waterfront properties. John is known for going above and beyond — clients consistently describe him as patient, knowledgeable, and genuinely invested in getting the best outcome for them.',
  },
  {
    slug: 'christine',
    firstName: 'Christine',
    name: 'Christine Dekant',
    title: 'REALTOR®',
    credentials: ['RENE', 'GRI', 'CLA', 'CPRES', 'REDM', 'C2EX'],
    license: '3264840',
    phone: '(561) 778-7042',
    phoneHref: 'tel:+15617787042',
    email: 'christine@doyouneedahome.com',
    photo: '/images/Christine-rooftop.png',
    photoPosition: 'object-top',
    crmTag: 'Agent: Christine Dekant',
    fubAssignedTo: 'Christine Dekant',
    pitch:
      "Send me your address and I'll show you what comparable homes actually sold for — with the reasoning behind the number. I came to real estate from accounting, so you'll get the math, not a sales pitch.",
    strengths: [
      {
        title: 'An Analyst First',
        body: 'I spent my first career as an accountant. I read a comp set the same way I read financials — what the numbers support, what they do not, and where an optimistic list price would cost you weeks on market.',
      },
      {
        title: 'Among the Most Credentialed in the County',
        body: 'RENE, GRI, CLA, CPRES, REDM, and C2EX. The CPRES matters more than most people expect — probate and estate sales have their own timeline and their own rules, and I handle them regularly.',
      },
      {
        title: 'Clients Who Come Back',
        body: 'Many of my clients have done three, four, or five transactions with me. That only happens if the first valuation you give someone turns out to be honest.',
      },
    ],
    bio: "Christine Dekant is one of Palm Beach County's most trusted REALTORS®, with a long track record of helping buyers find the right home and sellers achieve top dollar. She is known for her professionalism, deep market knowledge, responsiveness, and genuine care for every client she serves. Clients return to Christine time and again — many have completed three, four, or five transactions with her.",
  },
]

/**
 * The neutral route used by the main /sell pricing review. Visitors should not
 * have to pick an agent before they know the team, so the lead is assigned
 * internally instead: set FUB_TEAM_ASSIGNED_TO to a FUB user's exact display
 * name to send these to one person, or leave it unset and Follow Up Boss's own
 * lead distribution decides. The tag below is applied either way, so a FUB
 * automation can also route on it.
 */
export const TEAM_ROUTE_SLUG = 'team'

export const teamValuationRoute: ValuationRoute = {
  slug: TEAM_ROUTE_SLUG,
  firstName: 'Christine or John',
  name: 'DO Homes Group',
  phone: '(561) 783-7733',
  phoneHref: 'tel:+15617837733',
  email: 'info@doyouneedahome.com',
  crmTag: 'Seller Lead - Team Pricing Review',
}

export function getAgentBySlug(slug: string): Agent | undefined {
  return agents.find((a) => a.slug === slug)
}

/** An agent slug, or 'team' for the neutral /sell pricing review. */
export function getValuationRoute(slug: string | undefined): ValuationRoute | undefined {
  if (slug === TEAM_ROUTE_SLUG) return teamValuationRoute
  return getAgentBySlug(slug ?? '')
}

export function getAgentPaths(): { agent: string }[] {
  return agents.map((a) => ({ agent: a.slug }))
}
