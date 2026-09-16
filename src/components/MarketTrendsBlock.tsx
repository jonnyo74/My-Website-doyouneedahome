'use client'

import { TrendsSkeleton, useYlopoWidgetContent } from '@/components/YlopoMarketTrendsWidget'

/**
 * Heading + caption + framed Ylopo trends widget, as a single unit.
 *
 * The heading lives in here rather than on the page so that it disappears with
 * the widget: when Ylopo never fills the container, the whole block collapses
 * instead of leaving "<City> Market Trends" above an empty box.
 *
 * All props are plain strings — this is a client component rendered from server
 * pages, so nothing here may take a callback.
 */
export default function MarketTrendsBlock({
  city,
  heading,
  caption,
  frameClassName = 'mt-5',
}: {
  city: string
  heading: string
  caption: string
  /** Spacing above the bordered frame — pages differ slightly. */
  frameClassName?: string
}) {
  const { ref, state } = useYlopoWidgetContent(city)

  if (state === 'empty') return null

  return (
    <div>
      <h2 className="font-serif text-2xl font-semibold text-slate-900">{heading}</h2>
      <p className="mt-2 text-sm text-slate-500">{caption}</p>
      <div
        className={`${frameClassName} relative overflow-hidden rounded-2xl border border-slate-200 ${
          state === 'loading' ? 'min-h-[420px]' : ''
        }`}
      >
        <div
          ref={ref}
          className={`YLOPO_marketTrendsWidget ${state === 'loading' ? 'opacity-0' : ''}`}
          data-searchlocation={JSON.stringify({ simpleSearchCity: city, simpleSearchState: 'FL' })}
        />
        {state === 'loading' && (
          <div className="absolute inset-0">
            <TrendsSkeleton />
          </div>
        )}
      </div>
    </div>
  )
}
