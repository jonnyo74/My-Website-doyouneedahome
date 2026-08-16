// Script loading is handled by YlopoInit on the parent page — do not reload here.
interface Props {
  city: string
  neighborhood?: string
  minPrice?: number
  propertyTypes?: string[]
  limit?: number
}

export default function YlopoResultsWidget({ city, neighborhood, minPrice = 600000, propertyTypes, limit = 6 }: Props) {
  // Ylopo files a place under exactly one of `community`, `neighborhood`, or
  // `subdivision`, and which one is not predictable from our side — Abacoa is a
  // neighborhood, Sonoma Isles is a community, El Cid is a subdivision. Querying
  // the wrong key returns zero results with no error, which is how every
  // community page except Abacoa ended up with an empty listings widget.
  // Locations are OR'd, so we send all three and let the matching one answer.
  // Check a name with:
  //   portal.ylopo.com/api/1.0/autocomplete?q=<name>&partyWebsite=search.doyouneedahome.com
  const locations = neighborhood
    ? [
        { community: neighborhood, city, state: 'FL' },
        { neighborhood, city, state: 'FL' },
        { subdivision: neighborhood, city, state: 'FL' },
      ]
    : [{ city, state: 'FL' }]

  // Site-wide floor — never show listings under $400K regardless of caller.
  const effectiveMinPrice = Math.max(minPrice, 400000)
  const search: Record<string, unknown> = { locations, limit, minPrice: effectiveMinPrice, sortBy: 'listdate' }
  if (propertyTypes?.length) search.propertyTypes = propertyTypes

  return (
    <div
      className="YLOPO_resultsWidget overflow-hidden rounded-2xl"
      data-search={JSON.stringify(search)}
    />
  )
}
