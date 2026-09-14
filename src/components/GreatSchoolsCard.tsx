/**
 * GreatSchools is the third-party source for school ratings, so our own pages
 * don't have to carry grades that go stale every year.
 *
 * The slug map is deliberately explicit. GreatSchools does not mirror our
 * community slugs, and a miss does not 404 — it 301s to the generic Florida
 * landing page, which is a dead end for the reader. Every entry below was
 * checked against a live response on 2026-09-14; re-check before adding one.
 *
 * Cities with no GreatSchools page of their own (Westlake, Port Salerno,
 * Ocean Ridge, Manalapan) are intentionally absent: pointing them at a
 * neighbouring city would assert a school relationship we can't support, so
 * the card renders nothing and the page's district guidance stands alone.
 */
const GREATSCHOOLS_CITY: Record<string, string> = {
  'boca-raton': 'boca-raton',
  'boynton-beach': 'boynton-beach',
  'delray-beach': 'delray-beach',
  'hobe-sound': 'hobe-sound',
  'juno-beach': 'juno-beach',
  'jupiter': 'jupiter',
  'lake-worth-beach': 'lake-worth-beach',
  'loxahatchee': 'loxahatchee',
  'north-palm-beach': 'north-palm-beach',
  'palm-beach': 'palm-beach',
  'palm-beach-gardens': 'palm-beach-gardens',
  'palm-city': 'palm-city',
  'royal-palm-beach': 'royal-palm-beach',
  // Singer Island is part of Riviera Beach; GreatSchools files it there.
  'singer-island': 'riviera-beach',
  'stuart': 'stuart',
  'tequesta': 'tequesta',
  'wellington': 'wellington',
  'west-palm-beach': 'west-palm-beach',
  // Note the period — 'port-st-lucie' redirects to the state page.
  'port-st-lucie': 'port-st.-lucie',
}

export function greatSchoolsCity(citySlug: string): string | undefined {
  return GREATSCHOOLS_CITY[citySlug]
}

export default function GreatSchoolsCard({
  citySlug,
  cityName,
}: {
  citySlug: string
  cityName: string
}) {
  const gsCity = greatSchoolsCity(citySlug)
  if (!gsCity) return null

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="text-lg font-semibold text-gray-900">Nearby Schools</h3>
      <p className="mt-2 text-sm text-gray-600">
        GreatSchools is a nonprofit that provides ratings, test scores, and parent reviews for public
        and private schools across the country — a helpful starting point for anyone researching
        schools in {cityName}.
      </p>
      <a
        href={`https://www.greatschools.org/florida/${gsCity}/`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
      >
        View Schools on GreatSchools<span className="sr-only"> for {cityName}</span> →
      </a>
      <p className="mt-4 text-xs text-gray-500 leading-relaxed">
        School data provided by GreatSchools.org. School assignments, boundaries, and ratings may
        change. Buyers should verify all school information directly with the appropriate school
        district.
      </p>
    </div>
  )
}
