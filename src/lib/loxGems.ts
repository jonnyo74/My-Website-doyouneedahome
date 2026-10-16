// Copy for the two visual modules in the Loxahatchee hidden-gems guide. Facts in the Acreage Pines
// glance card come from Palm Beach County Environmental Resources Management (checked 2026-10-16).
// Kept in a data file so a test can guard the wording: no canals, fishing, paddling, night-sky or
// informal-access language, and nothing that reads as a document or association reference.

export const GEM_TEST_HEADING = 'The Loxahatchee Hidden-Gem Test'
export const GEM_TEST_HEADING_ID = 'the-loxahatchee-hidden-gem-test'
export const GEM_TEST_INTRO = 'A Loxahatchee hidden gem is usually one of three things:'

export const GEM_TEST_ITEMS: ReadonlyArray<{ title: string; text: string }> = [
  { title: 'A small place with a big sense of space', text: 'Trails, boardwalks, wetlands, pines, and quiet green space.' },
  { title: 'A glimpse into horse-country life', text: 'The culture is visible long before someone owns a horse.' },
  {
    title: 'An ordinary moment that feels extraordinary elsewhere',
    text: 'A sunset, a quiet park, a morning walk, or a home-centered weekend.',
  },
]

export const GLANCE_HEADING = 'Acreage Pines at a Glance'
export const GLANCE_HEADING_ID = 'acreage-pines-at-a-glance'
export const GLANCE_SOURCE = {
  label: 'Palm Beach County Environmental Resources Management',
  href: 'https://discover.pbc.gov/erm/NaturalAreas/Acreage-Pines.aspx',
  checked: 'October 16, 2026',
}

export const GLANCE_ROWS: ReadonlyArray<{ label: string; value: string }> = [
  { label: 'Where', value: 'West end of Acreage Pines Community Park, 6405 140th Ave. N., Loxahatchee' },
  { label: 'Open', value: 'Sunrise to sunset, 365 days a year, according to Palm Beach County' },
  { label: 'Size', value: '124 acres of wetlands and pine lands' },
  { label: 'On the ground', value: 'A boardwalk, a paved nature trail and a sandy hiking trail' },
  {
    label: 'The county points out',
    value: 'Cypress trees, the endangered giant wild pine airplant, and a hiking trail through slash pines and saw palmettos',
  },
]
