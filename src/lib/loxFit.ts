// Copy for the "Loxahatchee fit" decision card in the lifestyle-fit guide.
// Kept in a data file so a test can guard the wording: it is lifestyle copy
// only, with no land-use, utility, commute or association claims.

export const FIT_HEADING = 'The Loxahatchee Fit Card'
export const FIT_HEADING_ID = 'the-loxahatchee-fit-card'

export const FIT_LEAD = 'You will probably love Loxahatchee if you choose:'

export const FIT_ROWS: ReadonlyArray<{ choose: string; over: string }> = [
  { choose: 'Space', over: 'over walkability' },
  { choose: 'Personal projects', over: 'over plug-and-play amenities' },
  { choose: 'A country rhythm', over: 'over a dense neighborhood rhythm' },
  { choose: 'A home that supports your hobbies', over: 'over a home that only shelters them' },
  { choose: 'A little more distance', over: 'in exchange for a little more freedom' },
]

export const FIT_CLOSING =
  'The question is not whether Loxahatchee is convenient enough. The question is whether the life you want gets bigger when you have room to live it.'
