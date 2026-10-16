// Copy for the two visual modules in the Loxahatchee cost-of-living guide. Kept in a data file so a
// test can guard the wording: explanatory only, with no dollar figures, percentages, or universal
// utility, tax, insurance, land-use or association claims.

export const EQUATION_HEADING = 'The Loxahatchee Cost Equation'
export const EQUATION_HEADING_ID = 'the-loxahatchee-cost-equation'
export const EQUATION_INTRO =
  'There is no single Loxahatchee number. There are four ways to look at the cost, and each one changes with the household.'

export const EQUATION_LENSES: ReadonlyArray<{ lens: string; changes: string }> = [
  {
    lens: 'Home purchase',
    changes: 'Buyers may prioritize land, privacy, and usable outdoor space over location close to daily services.',
  },
  {
    lens: 'Monthly ownership',
    changes: 'Taxes, utilities, insurance, and upkeep depend heavily on the specific home and its setup.',
  },
  {
    lens: 'Daily life',
    changes: 'A car-centered routine can change how households budget time, fuel, and errands.',
  },
  {
    lens: 'Lifestyle spending',
    changes:
      'The right buyer may choose to spend more on the home, land, hobbies, animals, or outdoor projects, and less elsewhere.',
  },
]

export const VALUE_HEADING = 'Where the Value Shows Up'
export const VALUE_HEADING_ID = 'where-the-value-shows-up'
export const VALUE_INTRO =
  'These are lifestyle values, not financial returns. Nothing here is a promise about what a home will be worth or save.'

export const VALUE_CARDS: ReadonlyArray<{ title: string; text: string }> = [
  { title: 'Room to use', text: 'Space that supports a fuller home life: the garden, the project, the long dinner outside.' },
  { title: 'Room to breathe', text: 'Privacy and visual openness, with sky and green in the view instead of a neighbor’s roofline.' },
  { title: 'Room to choose', text: 'A less standardized daily rhythm, shaped by what you want to do with the day.' },
]
