// Script loading is handled by YlopoInit on the parent page — do not reload here.
interface Props {
  city: string
  neighborhood?: string
  minPrice?: number
  propertyTypes?: string[]
  limit?: number
}

export default function YlopoResultsWidget({ city, neighborhood, minPrice = 600000, propertyTypes, limit = 6 }: Props) {
  const location = neighborhood
    ? { neighborhood, city, state: 'FL' }
    : { city, state: 'FL' }

  // Site-wide floor — never show listings under $400K regardless of caller.
  const effectiveMinPrice = Math.max(minPrice, 400000)
  const search: Record<string, unknown> = { locations: [location], limit, minPrice: effectiveMinPrice, sortBy: 'listdate' }
  if (propertyTypes?.length) search.propertyTypes = propertyTypes

  return (
    <div
      className="YLOPO_resultsWidget overflow-hidden rounded-2xl"
      data-search={JSON.stringify(search)}
    />
  )
}
