import office from './officeAddress.json'

// Single source of truth for the site's canonical base URL.
// The site is served at the www subdomain — keep this in sync with DNS/hosting.
export const SITE_URL = 'https://www.doyouneedahome.com'

// Single source of truth for the office address. The raw record lives in
// officeAddress.json so scripts/generate-guide-pdfs.mjs (plain Node, no TS) reads
// the same values. Every page, footer and JSON-LD block renders from this.
export const OFFICE_ADDRESS = {
  ...office,
  /** "4658 Northlake Blvd, Suite 103" */
  streetLine: `${office.street}, ${office.suite}`,
  /** "Palm Beach Gardens, FL 33418" */
  cityLine: `${office.city}, ${office.state} ${office.zip}`,
  /** The whole address on one line. */
  oneLine: `${office.street}, ${office.suite}, ${office.city}, ${office.state} ${office.zip}`,
  /** schema.org PostalAddress for JSON-LD. */
  jsonLd: {
    '@type': 'PostalAddress',
    streetAddress: `${office.street}, ${office.suite}`,
    addressLocality: office.city,
    addressRegion: office.state,
    postalCode: office.zip,
    addressCountry: office.country,
  },
} as const
