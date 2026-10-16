// Copy for the two decision modules in the Loxahatchee vs. nearby cities guide. Lifestyle language only:
// no prices, lot sizes, taxes, commute or school claims, no association or utility language, and no
// ranking. Section anchors must match the ## headings in the article body (checked by the test).

export const LIVES_HEADING = 'Five Daily Lives'
export const LIVES_HEADING_ID = 'five-daily-lives'
export const LIVES_INTRO =
  'Five places, five different answers to the same question: what should shape your weekday, your weekend and your home life? Pick the row that sounds like the life you want.'

export const LIVES: ReadonlyArray<{
  place: string
  rhythm: string
  great: string
  less: string
  anchor: string
}> = [
  {
    place: 'Loxahatchee',
    rhythm: 'Country-paced, home-centered, acreage-oriented',
    great: 'You want room, privacy, projects and outdoor life',
    less: 'You want errands, restaurants and activity close at hand',
    anchor: 'loxahatchee-when-the-home-becomes-the-destination',
  },
  {
    place: 'Wellington',
    rhythm: 'Established village life with deep equestrian character',
    great: 'You want a fuller village routine with horse-country culture in plain sight',
    less: 'You want a more informal acreage setting',
    anchor: 'wellington-village-life-with-real-equestrian-gravity',
  },
  {
    place: 'Royal Palm Beach',
    rhythm: 'Parks, programming, services and suburban ease',
    great: 'You want a family-friendly community rhythm and routine convenience',
    less: 'You want land to be the centerpiece',
    anchor: 'royal-palm-beach-the-everyday-ease-choice',
  },
  {
    place: 'Westlake',
    rhythm: 'Newer-city energy and a more structured setting',
    great: 'You want contemporary planning and a newer-built environment',
    less: 'You want a mature rural landscape',
    anchor: 'westlake-new-city-energy-and-a-different-structure',
  },
  {
    place: 'Jupiter Farms',
    rhythm: 'Northern acreage life with its own character',
    great: 'You want acreage with a north-county orientation',
    less: 'You want to be closer to the Wellington-side lifestyle',
    anchor: 'jupiter-farms-the-other-acreage-conversation',
  },
]

export const QUESTIONS_HEADING = 'Answer These Three Questions'
export const QUESTIONS_HEADING_ID = 'answer-these-three-questions'
export const QUESTIONS_INTRO = 'There is no scoring here. Answer honestly, then follow whichever sections your answers point to.'

export const QUESTIONS: ReadonlyArray<{
  q: string
  options: ReadonlyArray<{ if: string; look: ReadonlyArray<{ place: string; anchor: string }> }>
}> = [
  {
    q: 'Do you want your land to be part of your daily life, or do you want more of life close to your front door?',
    options: [
      {
        if: 'Land is part of daily life',
        look: [
          { place: 'Loxahatchee', anchor: LIVES[0].anchor },
          { place: 'Jupiter Farms', anchor: LIVES[4].anchor },
        ],
      },
      {
        if: 'More of life close to the front door',
        look: [
          { place: 'Royal Palm Beach', anchor: LIVES[2].anchor },
          { place: 'Wellington', anchor: LIVES[1].anchor },
          { place: 'Westlake', anchor: LIVES[3].anchor },
        ],
      },
    ],
  },
  {
    q: 'Would you rather create your own weekend at home, or have more nearby parks, programming, restaurants and activity?',
    options: [
      {
        if: 'Create my own weekend at home',
        look: [
          { place: 'Loxahatchee', anchor: LIVES[0].anchor },
          { place: 'Jupiter Farms', anchor: LIVES[4].anchor },
        ],
      },
      {
        if: 'More nearby parks, programming and activity',
        look: [
          { place: 'Royal Palm Beach', anchor: LIVES[2].anchor },
          { place: 'Wellington', anchor: LIVES[1].anchor },
        ],
      },
    ],
  },
  {
    q: 'Are you looking for country character, a mature village, a classic suburb, a new city, or northern acreage?',
    options: [
      { if: 'Country character', look: [{ place: 'Loxahatchee', anchor: LIVES[0].anchor }] },
      { if: 'A mature village', look: [{ place: 'Wellington', anchor: LIVES[1].anchor }] },
      { if: 'A classic suburb', look: [{ place: 'Royal Palm Beach', anchor: LIVES[2].anchor }] },
      { if: 'A new city', look: [{ place: 'Westlake', anchor: LIVES[3].anchor }] },
      { if: 'Northern acreage', look: [{ place: 'Jupiter Farms', anchor: LIVES[4].anchor }] },
    ],
  },
]
