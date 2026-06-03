'use client'

interface Props {
  city: string
  neighborhood?: string
}

export default function YlopoResultsWidget({ city, neighborhood }: Props) {
  const location = neighborhood
    ? { neighborhood, city, state: 'FL' }
    : { city, state: 'FL' }

  return (
    <div
      className="YLOPO_resultsWidget overflow-hidden rounded-2xl"
      data-search={JSON.stringify({ locations: [location], limit: 6, minPrice: 600000 })}
    />
  )
}
