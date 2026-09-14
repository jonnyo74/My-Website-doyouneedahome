import type { Metadata } from 'next'
import Breadcrumbs from '@/components/Breadcrumbs'
import CommunityTable from '@/components/paddle/CommunityTable'
import PaddleCrossLink from '@/components/paddle/PaddleCrossLink'
import {
  COMMUNITY_DISCLAIMER,
  excludedCommunities,
  paddleCommunities,
  southernPublicAnchors,
} from '@/lib/paddle/communities'

export const metadata: Metadata = {
  title: 'Communities With Their Own Kayak Launch | DO Homes Group',
  description:
    'Which Jupiter, Tequesta, Palm Beach Gardens, Juno Beach and North Palm Beach communities give residents real water access — kayak racks, shared docks, per-lot docks or a marina slip — and which market “waterfront” over a retention pond.',
  alternates: { canonical: '/communities-with-kayak-launches' },
  openGraph: {
    title: 'Communities With Their Own Kayak Launch',
    description:
      'Resident water access from Jupiter to North Palm Beach, graded by whether you can actually use it.',
  },
}

const TRAPS = [
  {
    kicker: 'Trap one',
    title: '“Community dock” that isn’t',
    body: 'Most of what gets sold as community water access is a private dock attached to a specific lot. Buy the non-waterfront house in the same subdivision and you have a view, not a launch.',
  },
  {
    kicker: 'Trap two',
    title: '“Ocean access” under a 4½-foot bridge',
    body: 'The Center Street bridge over Sims Creek clears 4.5 feet at high water. Island Way clears 12. Tequesta Drive clears about 14. Irrelevant in a kayak — fatal to the boat someone was picturing when they read the listing.',
  },
  {
    kicker: 'Trap three',
    title: 'A lake is not the river',
    body: 'River Ridge in Tequesta advertises two lakes for light recreation where kayaking is allowed. They are landlocked. Forty-three of its 173 homes touch the North Fork; forty-eight look at a pond with no outlet.',
  },
]

const QUESTIONS = [
  {
    k: 'Who owns it',
    q: 'Which entity controls the water?',
    a: 'Juno Isles’ boat lift belongs to a Boat Owner’s Association separate from the civic association. Mariner’s Cove splits across four sub-associations with different water rights. Ask for the entity name, not the amenity name.',
  },
  {
    k: 'Who can use it',
    q: 'All residents, or a list?',
    a: 'Jonathan’s Landing kayak racks require POA registration and space is limited. Tequesta Country Club’s ramp needs a key that costs extra on top of voluntary association dues. Anchorage Point’s dockage is stated as being for waterview homes.',
  },
  {
    k: 'Clearance',
    q: 'What is the lowest fixed bridge between here and the inlet?',
    a: 'Get the number, not the phrase “ocean access.” Sims Creek: 4.5 feet. Island Way: 12. Tequesta Drive: about 14.',
  },
  {
    k: 'Outlet',
    q: 'Does this water actually go anywhere?',
    a: 'Jonathan’s Landing has racks on both its saltwater and its freshwater courses — one reaches the ocean, the other is closed. Mariner’s Cove’s freshwater basin requires a travel lift over the seawall.',
  },
  {
    k: 'Storage',
    q: 'Where does the boat live between paddles?',
    a: 'Prosperity Harbor permits paddleboards at the day docks but bans storage there. Many associations ban racks on docks, balconies and side yards. This is a document question, not a showing question.',
  },
  {
    k: 'Still true?',
    q: 'Confirm anything marked “single source.”',
    a: 'A dock that existed when a marketing page was written may be permitted-out, storm-damaged or restricted now. One call to the association settles it, and it is the call that protects you.',
  },
]

export default function CommunitiesWithKayakLaunchesPage() {
  return (
    <>
      <Breadcrumbs
        items={[{ label: 'Communities with kayak launches', href: '/communities-with-kayak-launches' }]}
      />

      <div className="mx-auto max-w-6xl px-6 pb-20 sm:px-8">
        <header className="border-b border-slate-200 pb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-600">
            Jupiter · Tequesta · Palm Beach Gardens · Juno Beach · North Palm Beach
          </p>
          <h1 className="mt-4 max-w-4xl font-serif text-4xl font-semibold leading-tight text-navy-950 sm:text-5xl">
            Which communities let you launch from home
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
            {paddleCommunities.length} neighbourhoods with resident water access, sorted by the only
            question that matters: can <em>you</em> use it, or does it belong to the person who
            bought the waterfront lot? Plus the {excludedCommunities.length} that market “waterfront”
            and deliver a retention pond.
          </p>
        </header>

        <div className="grid gap-8 border-b border-slate-200 py-8 md:grid-cols-3">
          {TRAPS.map((trap) => (
            <div key={trap.kicker}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-report-gold-text">
                {trap.kicker}
              </p>
              <h2 className="mt-2 font-serif text-lg font-semibold leading-snug text-navy-950">
                {trap.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{trap.body}</p>
            </div>
          ))}
        </div>

        <div className="py-10">
          <CommunityTable />
        </div>

        <section className="border-t border-slate-200 pt-10">
          <h2 className="font-serif text-2xl font-semibold text-navy-950 sm:text-3xl">
            Water that isn’t water
          </h2>
          <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-slate-600">
            These have lakes, ponds, canals or nautical names, and no paddling value whatsoever.
            They are here because leaving them out is how a buyer ends up disappointed at the
            closing table — and because being able to say “no, that one’s a retention pond” is worth
            more than another listing.
          </p>
          <ul className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {excludedCommunities.map((c) => (
              <li
                key={c.name}
                className={`border-l-2 pl-4 ${
                  c.notable ? 'border-report-gold-dark' : 'border-slate-300'
                }`}
              >
                <p
                  className={`text-[15px] font-medium ${
                    c.notable ? 'text-report-gold-text' : 'text-navy-950'
                  }`}
                >
                  {c.name} <span className="font-normal text-slate-500">— {c.town}</span>
                </p>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">{c.why}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12 border-t border-slate-200 pt-10">
          <h2 className="font-serif text-2xl font-semibold text-navy-950 sm:text-3xl">
            The public launches that carry this market
          </h2>
          <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-slate-600">
            Very few HOAs down here built a launch, and this is why. Several communities’ “kayak
            access” claims resolve to one of these on inspection.
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {southernPublicAnchors.map((anchor) => (
              <div key={anchor.name} className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="font-serif text-lg font-semibold text-navy-950">{anchor.name}</h3>
                <p className="mt-1 text-[11px] uppercase tracking-wider text-slate-500">
                  {anchor.where}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{anchor.note}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 border-t border-slate-200 pt-10">
          <h2 className="font-serif text-2xl font-semibold text-navy-950 sm:text-3xl">
            Six questions before the offer
          </h2>
          <ul className="mt-6 max-w-4xl space-y-5">
            {QUESTIONS.map((item) => (
              <li key={item.k} className="grid gap-4 sm:grid-cols-[auto_minmax(0,1fr)]">
                <span className="h-fit whitespace-nowrap border border-gold-400 px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-gold-700">
                  {item.k}
                </span>
                <p className="text-[15px] leading-relaxed text-slate-600">
                  <strong className="text-navy-900">{item.q}</strong> {item.a}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
          <h2 className="font-serif text-2xl font-semibold text-navy-950">
            Two corrections worth carrying into a showing
          </h2>
          <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-slate-600">
            <p>
              <strong className="text-navy-900">
                Jupiter Yacht Club does not have a private kayak launch.
              </strong>{' '}
              The paddleboard launching people attribute to JYC is on the Town of Jupiter’s public
              Riverwalk, which happens to run through the property. It is a fine amenity — it just
              is not theirs, and it is not exclusive.
            </p>
            <p>
              <strong className="text-navy-900">
                Azure Palm Beaches does not have a kayak launch either.
              </strong>{' '}
              A major listing portal shows one on its building page; on inspection it resolves to
              Bert Winters Park, a public county facility down the road.
            </p>
            <p>
              Both errors are live on the internet right now. Knowing them is a two-sentence
              demonstration that you read past the marketing copy.
            </p>
          </div>
        </section>

        <div className="mt-10">
          <PaddleCrossLink to="launches" />
        </div>

        <p className="mt-10 border-t border-slate-200 pt-6 text-sm leading-relaxed text-slate-500">
          Compiled September 2026 from association and POA sites where they exist, and from
          brokerage community pages and listing remarks where they do not — each graded in the table
          above. {COMMUNITY_DISCLAIMER}
        </p>
      </div>
    </>
  )
}
