import Link from 'next/link'
import {
  LAUNCH_COUNT,
  PADDLE_COMMUNITY_LINKS,
  paddleCommunityCount,
} from '@/lib/paddle/crossLinks'

/**
 * The paddle guides, offered from a community page.
 *
 * Rendered under "Parks & Outdoor Activities", which is where a reader is
 * already thinking about what they would do outdoors here, rather than in the
 * resource list at the bottom — those links are external, open in a new tab and
 * carry an outbound arrow, and these are our own pages.
 *
 * The copy names what the reader gets rather than saying "learn more", and the
 * counts come from the data so they cannot drift from the guides themselves.
 */
export default function PaddleCommunityLink({ slug, name }: { slug: string; name: string }) {
  const config = PADDLE_COMMUNITY_LINKS[slug]
  if (!config) return null

  const inTable = config.communities && config.townMatch ? paddleCommunityCount(config.townMatch) : 0

  return (
    <div>
      <h2 className="font-serif text-2xl font-semibold text-slate-900">On the water</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {config.launches && (
          <Link
            href="/kayak-launches-jupiter-tequesta"
            className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-gold-500/40 hover:bg-gold-50"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gold-600">
              Public launches
            </p>
            <p className="mt-1 text-sm font-semibold text-navy-950">
              Where you can drop a kayak near {name}
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              All {LAUNCH_COUNT} public put-ins on the Loxahatchee River, the Jupiter Inlet and the
              Intracoastal — mapped, with parking, fees and tide notes.
            </p>
          </Link>
        )}
        {inTable > 0 && (
          <Link
            href="/communities-with-kayak-launches"
            className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-gold-500/40 hover:bg-gold-50"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gold-600">
              Resident access
            </p>
            <p className="mt-1 text-sm font-semibold text-navy-950">
              {inTable} {name} {inTable === 1 ? 'community' : 'communities'} with their own water
              access
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Graded by whether every resident can use the water or only the waterfront lot — plus
              the ones marketing a retention pond.
            </p>
          </Link>
        )}
      </div>
    </div>
  )
}
