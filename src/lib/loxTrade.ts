// Copy for the "What You Get / What You Trade" module in the Loxahatchee pros-and-cons guide.
// Kept in a data file so a test can guard the wording: lifestyle language only, with no land-use,
// utility, association, commute or price claims.

export const TRADE_HEADING = 'What You Get / What You Trade'
export const TRADE_HEADING_ID = 'what-you-get-what-you-trade'

export const TRADE_INTRO =
  'Almost everything people love about Loxahatchee has a quieter twin on the other side of the ledger. Here are the four trades that matter most.'

export const TRADE_PAIRS: ReadonlyArray<{ gives: string; asks: string; note: string }> = [
  {
    gives: 'More room to make home life your own',
    asks: 'More intention around errands and daily routines',
    note: 'A bigger canvas shapes how the day unfolds, and so does the planning that keeps the day running.',
  },
  {
    gives: 'Open sky, green space, and privacy',
    asks: 'Less of a walk-out-the-door suburban rhythm',
    note: 'Evenings can be wide open and quiet. A spontaneous coffee down the block is less the point.',
  },
  {
    gives: 'A home that can support hobbies and projects',
    asks: 'A greater appetite for using and caring for that space',
    note: 'Room is an invitation, and it works best for people who gladly accept it.',
  },
  {
    gives: 'More individuality in the landscape',
    asks: 'Less visual uniformity and fewer built-in amenities',
    note: 'Roads and lots have character instead of a shared template, and the feel changes from road to road.',
  },
]
