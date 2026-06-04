// Script loading is handled by YlopoInit on the parent page — do not reload here.
export default function YlopoMarketTrendsWidget({ city }: { city: string }) {
  return (
    <div
      className="YLOPO_marketTrendsWidget"
      data-searchlocation={JSON.stringify({ simpleSearchCity: city, simpleSearchState: 'FL' })}
    />
  )
}
