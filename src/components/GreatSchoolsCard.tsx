export default function GreatSchoolsCard({
  citySlug,
  cityName,
}: {
  citySlug: string
  cityName: string
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="text-lg font-semibold text-gray-900">Nearby Schools</h3>
      <p className="mt-2 text-sm text-gray-600">
        GreatSchools is a nonprofit that provides ratings, test scores, and parent reviews for public
        and private schools across the country — a helpful starting point for families researching{' '}
        {cityName}.
      </p>
      <a
        href={`https://www.greatschools.org/florida/${citySlug}/`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
      >
        View Schools on GreatSchools →
      </a>
      <p className="mt-4 text-xs text-gray-400 leading-relaxed">
        School data provided by GreatSchools.org. Ratings are one of many factors to consider — we
        recommend visiting schools directly and consulting your local school district for the most
        current information.
      </p>
    </div>
  )
}
