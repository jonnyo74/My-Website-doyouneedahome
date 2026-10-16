// Content for the "Would you use the freedom, or just maintain it?" self-check
// in the Loxahatchee living-in guide. Plain questions and plain outcomes: no
// scores shown, no prices, no promises about what any parcel allows.

export type FreedomChoice = 'yes' | 'maybe' | 'no'

export interface FreedomQuestion {
  id: string
  prompt: string
  hint: string
}

export const FREEDOM_QUESTIONS: FreedomQuestion[] = [
  {
    id: 'use-the-land',
    prompt: 'Would you genuinely use the land for animals, projects, privacy, gardening, equipment or outdoor life?',
    hint: 'Think about a normal month, not the best weekend you can imagine.',
  },
  {
    id: 'dirt-road',
    prompt: 'Does dirt-road character feel charming to you, or inconvenient?',
    hint: 'Roads can be paved, unpaved or maintained differently from one area to the next.',
  },
  {
    id: 'asks-more',
    prompt: 'Would you enjoy a property that asks more of you?',
    hint: 'Mowing, gates, drainage, trees, equipment and weather are more visible out here.',
  },
  {
    id: 'groceries',
    prompt: 'Is a trip for groceries a fair trade for a wider sky at home?',
    hint: 'Errands, restaurants, services and schools generally mean getting in the car.',
  },
  {
    id: 'less-managed',
    prompt: 'Does a less managed neighborhood feel liberating, or stressful?',
    hint: 'Fewer uniform rules can mean more freedom, and also more variety next door.',
  },
]

export const FREEDOM_CHOICES: Array<{ key: FreedomChoice; label: string }> = [
  { key: 'yes', label: 'Yes, that is me' },
  { key: 'maybe', label: 'Not sure' },
  { key: 'no', label: 'Honestly, no' },
]

export type FreedomOutcomeKey = 'use-it' | 'test-it' | 'look-elsewhere'

export interface FreedomOutcome {
  key: FreedomOutcomeKey
  heading: string
  body: string
  next: Array<{ label: string; href: string }>
}

export const FREEDOM_OUTCOMES: Record<FreedomOutcomeKey, FreedomOutcome> = {
  'use-it': {
    key: 'use-it',
    heading: 'You would probably use the freedom.',
    body:
      'Your answers sound like someone who wants room and would put it to work. The next step is to match that picture to a real parcel, because what is possible depends on the exact parcel, zoning, jurisdiction, permits and any property-specific restrictions.',
    next: [
      { label: 'Read the Loxahatchee local guide', href: '/blog/local-guide-to-loxahatchee-florida' },
      { label: 'Compare the areas', href: '/blog/best-neighborhoods-in-loxahatchee-florida' },
    ],
  },
  'test-it': {
    key: 'test-it',
    heading: 'Test it before you commit to it.',
    body:
      'You like parts of the picture and are unsure about others. That is a healthy place to be. Spend a few ordinary days out here, run a normal errand loop, and see whether the trade feels fair. The pros and cons guide lays the trade-offs out plainly.',
    next: [
      { label: 'Weigh the pros and cons', href: '/blog/pros-and-cons-of-living-in-loxahatchee-florida' },
      { label: 'Compare with nearby towns', href: '/blog/loxahatchee-vs-nearby-cities' },
    ],
  },
  'look-elsewhere': {
    key: 'look-elsewhere',
    heading: 'Somewhere closer in may suit you better.',
    body:
      'There is nothing wrong with wanting walkable errands, a lively town center or a more uniform neighborhood. An acre you never use can become a lot of mowing, maintenance and distance. Comparing the nearby alternatives side by side is a good next step.',
    next: [
      { label: 'Compare with nearby towns', href: '/blog/loxahatchee-vs-nearby-cities' },
      { label: 'See what the money buys nearby', href: '/blog/cost-of-living-in-loxahatchee-florida' },
    ],
  },
}

const POINTS: Record<FreedomChoice, number> = { yes: 2, maybe: 1, no: 0 }

/** Maps a full set of answers to an outcome. Returns null until every question is answered. */
export function freedomOutcome(answers: Partial<Record<string, FreedomChoice>>): FreedomOutcome | null {
  if (FREEDOM_QUESTIONS.some((q) => !answers[q.id])) return null
  const total = FREEDOM_QUESTIONS.reduce((n, q) => n + POINTS[answers[q.id] as FreedomChoice], 0)
  const max = FREEDOM_QUESTIONS.length * 2
  if (total >= max * 0.75) return FREEDOM_OUTCOMES['use-it']
  if (total >= max * 0.4) return FREEDOM_OUTCOMES['test-it']
  return FREEDOM_OUTCOMES['look-elsewhere']
}
