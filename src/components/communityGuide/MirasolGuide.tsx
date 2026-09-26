/**
 * Mirasol buyer's guide — the membership, cost and amenity sections that make
 * up most of /communities/mirasol. Rendered by the community page through
 * `communityGuides` in ./index.ts.
 *
 * Every dollar figure is a *reported* fee-schedule figure, not a quote. Sources
 * (checked 2026-09-26), all titled as MCA membership fee schedules:
 *   2023 — "Updated October 31, 2022" (the club's own CDN link is now dead;
 *          read via the Wayback Machine)
 *   2024 — "Updated October 31, 2023"
 *   2025 — "Updated October 30, 2024"
 *   2026 — "Updated November 7 / December 11, 2025"
 * The 2024–2026 PDFs circulate on brokerage sites, not the club's. The brief
 * this page was built from listed the 2024 dues under 2025; the 2025 PDF shows
 * $30,908 / $18,544 / $7,726.
 *
 * When a newer schedule arrives, add a row to FEE_SCHEDULES and revise the
 * interpretation notes below the table by hand — the percentages are written
 * out, not computed.
 */

const MEMBERSHIPS = [
  {
    name: 'Golf Membership',
    tag: 'Most requested · waiting list',
    summary: 'Full use of the club, golf included.',
    items: [
      'Full golf privileges, greens fees included',
      'Tee times open for sign-up 14 days ahead',
      'Racquet sports, aquatics and fitness',
      'Spa and salon',
      'Dining and social facilities',
    ],
  },
  {
    name: 'Sports Membership',
    tag: null,
    summary: 'Everything but full golf.',
    items: [
      'Unlimited racquet sports',
      'Aquatics and fitness',
      'Spa and salon',
      'Dining and social facilities',
      'Limited in-season golf (November–April), paying greens and cart fees',
      'Off-season golf (May–October), paying cart fees',
    ],
  },
  {
    name: 'Social Membership',
    tag: null,
    summary: 'The club without golf or racquets.',
    items: ['Dining', 'Aquatics', 'Social facilities'],
  },
] as const

type Fee = { contribution: string; dues: string }

const FEE_SCHEDULES: Array<{ year: string; golf: Fee; sports: Fee; social: Fee }> = [
  {
    year: '2023',
    golf: { contribution: '$175,000', dues: '$26,985' },
    sports: { contribution: '$110,000', dues: '$16,190' },
    social: { contribution: '$85,000', dues: '$6,745' },
  },
  {
    year: '2024',
    golf: { contribution: '$200,000', dues: '$29,316' },
    sports: { contribution: '$125,000', dues: '$17,589' },
    social: { contribution: '$100,000', dues: '$7,328' },
  },
  {
    year: '2025',
    golf: { contribution: '$230,000', dues: '$30,908' },
    sports: { contribution: '$145,000', dues: '$18,544' },
    social: { contribution: '$115,000', dues: '$7,726' },
  },
  {
    year: '2026',
    golf: { contribution: '$300,000', dues: '$33,671' },
    sports: { contribution: '$175,000', dues: '$20,202' },
    social: { contribution: '$115,000', dues: '$8,417' },
  },
]

const TIERS = [
  { key: 'golf', label: 'Golf' },
  { key: 'sports', label: 'Sports' },
  { key: 'social', label: 'Social' },
] as const

const FEE_DISCLAIMER =
  'Reported fee-schedule figures. Membership terms, taxes, assessments, availability, and refund provisions can change. Confirm the current schedule directly with Mirasol before contract.'

const AMENITIES = [
  {
    heading: 'Golf',
    items: [
      'Two 18-hole championship courses: Sunrise by Tom Fazio and Sunset by Arthur Hills',
      'A large practice range with chipping and putting greens',
      'Golf Learning Center, opened December 2023, with TrackMan, Swing Catalyst, a Zen Green Stage, SAM PuttLab and Toptracer',
    ],
  },
  {
    heading: 'Racquet sports',
    items: [
      'A dedicated tennis center with 15 clay courts',
      'Six outdoor pickleball courts',
      'Clinics, leagues, social play and competitive programming',
    ],
  },
  {
    heading: 'Wellness',
    items: [
      'The Esplanade fitness center, with Pilates, spin and group-exercise studios',
      'Spa, salon and café',
      'Saltwater pool, activity pool, hot tub and a beach-entry children’s pool',
    ],
  },
  {
    heading: 'Club life',
    items: [
      'Solstice dining room and the Grille Room',
      'Bars, patios and a ballroom',
      'Card rooms, a library and member-run interest groups',
    ],
  },
  {
    heading: 'Families',
    items: [
      'Sports Complex with a recreation building and synthetic-turf field',
      'Basketball, playground, bocce and pickleball',
      'Events and camps',
    ],
  },
  {
    heading: 'The community',
    items: [
      '23 neighborhoods on about 2,300 acres',
      'About 850 acres of habitat and preserve',
      'Audubon Cooperative Sanctuary status',
    ],
  },
] as const

const INVESTMENT = [
  {
    when: '2016',
    status: 'Completed',
    text: 'A $40 million facility enhancement program was completed with the November 2016 opening of the Esplanade, aquatics and tennis facilities.',
  },
  {
    when: 'December 2023',
    status: 'Completed',
    text: 'The Golf Learning Center opened.',
  },
  {
    when: 'Approved February 2024',
    status: 'Under construction',
    text: 'A two-story golf amenities building of about 40,000 square feet, with a new pro shop, indoor cart storage and a restaurant, plus a new maintenance building. The City’s latest report (May 2026) said construction was underway, with completion anticipated by fall 2026.',
  },
  {
    when: 'Approved March 2025',
    status: 'Opening not confirmed',
    text: 'An indoor pickleball building with seven courts, replacing the former sales center. The same City report said construction was underway and anticipated completion by spring 2026. We have not seen an opening announcement.',
  },
  {
    when: '2028–2029',
    status: 'Planned',
    text: 'The club’s master plan, announced in 2024, schedules renovations of the Sunset course in 2028 and the Sunrise course in 2029.',
  },
] as const

const SECTION = 'scroll-mt-28'
const EYEBROW = 'text-xs font-semibold uppercase tracking-[0.28em] text-gold-600'
const H2 = 'mt-1 font-serif text-2xl font-semibold text-slate-900 sm:text-3xl'

function Check() {
  return (
    <svg className="mt-1.5 h-3.5 w-3.5 flex-shrink-0 text-gold-500" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M13.485 3.515a1 1 0 0 1 0 1.414l-7 7a1 1 0 0 1-1.414 0l-3-3a1 1 0 1 1 1.414-1.414L6 9.808l6.293-6.293a1 1 0 0 1 1.192 0z" />
    </svg>
  )
}

export function MirasolGuide() {
  return (
    <div className="space-y-14">
      {/* In-page navigation — the guide is long, and most readers arrive
          wanting one answer (usually the cost). */}
      <nav aria-label="On this page" className="rounded-2xl border border-slate-200 bg-slate-50/70 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">On this page</p>
        <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
          {[
            ['#membership', 'Membership'],
            ['#membership-costs', 'Costs and dues'],
            ['#equity-payment', 'Equity payment'],
            ['#amenities', 'Amenities'],
            ['#club-investment', 'Investment'],
            ['#faqs', 'FAQ'],
          ].map(([href, label]) => (
            <li key={href}>
              <a href={href} className="text-gold-600 transition hover:text-gold-700 hover:underline">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── Membership ─────────────────────────────────────────────── */}
      <section id="membership" aria-labelledby="membership-heading" className={SECTION}>
        <p className={EYEBROW}>Read this before you tour</p>
        <h2 id="membership-heading" className={H2}>
          Membership Is Part of the Home Purchase
        </h2>
        <div className="mt-4 space-y-4 leading-8 text-slate-600">
          <p>
            At Mirasol, club membership comes with the home and is mandatory with ownership. Each
            home carries a membership category, and that category sets what you can use at the club
            and what you pay it every year.
          </p>
          <p>
            That means two similar homes can be very different purchases. Same square footage,
            same street, and one comes with full golf while the other doesn’t. The difference shows
            up in your access, your annual dues, and how many buyers will want the house when you
            sell.
          </p>
        </div>

        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {MEMBERSHIPS.map((m) => (
            <li
              key={m.name}
              className={`flex flex-col rounded-2xl border bg-white p-6 shadow-card ${
                m.tag ? 'border-gold-500/50 ring-1 ring-gold-500/20' : 'border-slate-200'
              }`}
            >
              <h3 className="font-serif text-xl font-semibold text-slate-900">{m.name}</h3>
              {m.tag && (
                <p className="mt-2 inline-flex self-start rounded-full bg-gold-50 px-3 py-1 text-xs font-semibold text-gold-700">
                  {m.tag}
                </p>
              )}
              <p className="mt-3 text-sm font-medium text-slate-700">{m.summary}</p>
              <ul className="mt-4 space-y-2">
                {m.items.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-6 text-slate-600">
                    <Check />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <aside
          aria-label="Golf membership availability"
          className="mt-8 rounded-2xl border-l-4 border-gold-500 bg-gold-50 p-6"
        >
          <p className="font-semibold text-slate-900">Golf is not something you can add at closing</p>
          <p className="mt-2 leading-7 text-slate-700">
            Golf is the membership buyers ask for most often. If a home does not carry Golf
            membership, a buyer may join the club’s upgrade waiting list, but availability and
            timing are not guaranteed. Confirm the membership category and any upgrade options
            before making an offer.
          </p>
        </aside>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Moving up or down a category</h3>
            <ul className="mt-3 space-y-2.5 text-sm leading-7 text-slate-600">
              <li>
                <strong className="font-semibold text-slate-800">Buying a higher category than you need:</strong>{' '}
                you may be able to downgrade, subject to club rules.
              </li>
              <li>
                <strong className="font-semibold text-slate-800">Buying a lower category than you want:</strong>{' '}
                you can’t buy the upgrade at closing. You can join the waiting list to upgrade, and
                a place on it is not a promise of when, or whether, Golf becomes available.
              </li>
              <li>
                Membership comes with the home, so there is no separate Golf membership to shop
                for on its own.
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">Confirm before you get attached</h3>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-7 text-slate-600 marker:font-semibold marker:text-gold-600">
              <li>The membership category that goes with this specific home, confirmed with the club</li>
              <li>If you want Golf and the home doesn’t carry it, the current upgrade waiting-list rules</li>
              <li>If the home carries more than you need, the club’s downgrade rules</li>
              <li>The current fee schedule and what is due at closing</li>
            </ol>
          </div>
        </div>

        <p className="mt-6 text-sm leading-7 text-slate-500">
          Golf and Social memberships are associated with the home. Club rules, categories and
          availability should be confirmed directly with Mirasol.
        </p>
      </section>

      {/* ── Costs ──────────────────────────────────────────────────── */}
      <section id="membership-costs" aria-labelledby="costs-heading" className={SECTION}>
        <p className={EYEBROW}>What it costs</p>
        <h2 id="costs-heading" className={H2}>
          Reported Membership Costs and Annual Dues
        </h2>
        <p className="mt-4 leading-8 text-slate-600">
          Each category has a one-time contribution paid at closing, called the Recreational
          Facilities Maintenance Contribution (RFMC), and annual club dues after that. Here is how
          the reported figures have moved across four annual schedules.
        </p>

        <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
          <strong className="font-semibold">Please note:</strong> {FEE_DISCLAIMER}
        </p>

        {/* Desktop / tablet: one table, years down, tiers across. */}
        <div className="mt-6 hidden overflow-hidden rounded-2xl border border-slate-200 md:block">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">
              Mirasol membership contribution and annual dues by schedule year and category. {FEE_DISCLAIMER}
            </caption>
            <thead className="bg-slate-50 text-slate-900">
              <tr>
                <th scope="col" className="px-5 py-4 font-semibold">Schedule year</th>
                {TIERS.map((t) => (
                  <th key={t.key} scope="col" className="px-5 py-4 font-semibold">
                    {t.label}
                    <span className="block text-xs font-normal text-slate-500">Contribution / annual dues</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {FEE_SCHEDULES.map((row) => (
                <tr key={row.year} className="bg-white">
                  <th scope="row" className="px-5 py-4 font-semibold text-slate-900">{row.year}</th>
                  {TIERS.map((t) => (
                    <td key={t.key} className="px-5 py-4 text-slate-700">
                      <span className="font-semibold text-slate-900">{row[t.key].contribution}</span>
                      <span className="text-slate-400"> / </span>
                      {row[t.key].dues}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Phone: one card per category, years inside. */}
        <div className="mt-6 space-y-4 md:hidden">
          {TIERS.map((t) => (
            <div key={t.key} className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-slate-900">{t.label}</h3>
              <dl className="mt-3 divide-y divide-slate-100">
                {FEE_SCHEDULES.map((row) => (
                  <div key={row.year} className="flex items-baseline justify-between gap-4 py-2.5 text-sm">
                    <dt className="text-slate-500">{row.year}</dt>
                    <dd className="text-right text-slate-700">
                      <span className="font-semibold text-slate-900">{row[t.key].contribution}</span>
                      <span className="block text-xs text-slate-500">{row[t.key].dues} annual dues</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>

        <h3 className="mt-8 text-base font-semibold text-slate-900">How to read these numbers</h3>
        <ul className="mt-3 space-y-3 text-sm leading-7 text-slate-600">
          <li className="flex gap-2.5">
            <Check />
            <span>
              Annual club dues rose about 8.6% from 2023 to 2024, 5.4% from 2024 to 2025, and 8.9%
              from 2025 to 2026, or roughly 25% over the three years. Each year’s increase was the
              same percentage for all three categories.
            </span>
          </li>
          <li className="flex gap-2.5">
            <Check />
            <span>
              The one-time contribution has moved most for Golf, from $175,000 in 2023 to $300,000
              for 2026. The Social contribution was unchanged from 2025 to 2026.
            </span>
          </li>
          <li className="flex gap-2.5">
            <Check />
            <span>
              There is no published automatic escalation formula, so don’t project future dues at a
              fixed annual rate. Budget from the current schedule.
            </span>
          </li>
          <li className="flex gap-2.5">
            <Check />
            <span>
              Club dues are separate from village HOA and MMMA assessments, property taxes, and any
              property-specific improvement-district charges. Ask for all of them together when
              you compare homes.
            </span>
          </li>
        </ul>

        <h3 className="mt-8 text-base font-semibold text-slate-900">Other club charges on the 2026 schedule</h3>
        <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Other one-time and recurring club charges listed on the 2026 Mirasol schedule</caption>
            <tbody className="divide-y divide-slate-200">
              {[
                ['MCA capital contribution, new buyer', '$25,000 one-time common-area fee, collected at closing'],
                ['Facilities Enhancement Project (FEP) assessment', '$172 (Golf), $169 (Sports) or $99 (Social) a month, scheduled to run through 2027'],
                ['Master Plan (MMP) Phase II special assessment', 'Scheduled to begin in 2027, when the FEP assessment ends. No amount listed'],
                ['Application fee', '$450 for two primary applicants, plus tax'],
                ['Service charge', '20% on all club services, with cash tips prohibited and no food minimum'],
              ].map(([label, value]) => (
                <tr key={label} className="bg-white">
                  <th scope="row" className="w-2/5 px-5 py-3.5 align-top font-semibold text-slate-900">{label}</th>
                  <td className="px-5 py-3.5 leading-6 text-slate-600">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm leading-7 text-slate-500">
          Village and MMMA dues, assessments and capital contributions are billed separately
          through Lang Management. Every sale needs two estoppels, one from the club (MCA) and one
          from Lang, so ask for both early.
        </p>
      </section>

      {/* ── Equity ─────────────────────────────────────────────────── */}
      <section id="equity-payment" aria-labelledby="equity-heading" className={SECTION}>
        <p className={EYEBROW}>The payment at closing</p>
        <h2 id="equity-heading" className={H2}>
          How the Equity Payment Works
        </h2>
        <p className="mt-4 leading-8 text-slate-600">
          The contribution you pay at closing is not necessarily all refundable. Any return is a
          seller’s return: it is paid under the club’s bylaws when you later sell. Here is how the
          2023 schedule described it. Treat it as history that explains the structure, not as
          the current terms.
        </p>

        <ol className="mt-6 space-y-4">
          {[
            <>
              The 2023 schedule called the payment the{' '}
              <strong className="font-semibold text-slate-900">Recreational Facilities Maintenance Contribution (RFMC)</strong>.
            </>,
            <>
              It split the RFMC into two parts: a{' '}
              <strong className="font-semibold text-slate-900">non-refundable initiation portion</strong> and a{' '}
              <strong className="font-semibold text-slate-900">defined equity portion</strong>.
            </>,
            <>
              For non-tenured owners under that schedule, 80% of the defined equity portion was
              eligible for return under the bylaws. That is 80% of the equity portion, not 80% of
              the whole payment.
            </>,
            <>
              The 2023 schedule’s examples of that eligible amount: Golf $80,000, Sports $51,200,
              Social $34,400. Owners who took title before July 1, 2017 (tenured members) were
              treated differently.
            </>,
          ].map((content, i) => (
            <li key={i} className="flex gap-4">
              <span
                aria-hidden="true"
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-navy-900 text-sm font-semibold text-white"
              >
                {i + 1}
              </span>
              <p className="pt-1 text-sm leading-7 text-slate-600">{content}</p>
            </li>
          ))}
        </ol>

        <p className="mt-6 leading-8 text-slate-600">
          One thing the later schedules make clear: the contribution has risen, but the examples
          of the eligible return have not. The 2024, 2025 and 2026 schedules show the same equity
          portions as 2023, so the increases went into the non-refundable initiation portion. On
          the 2026 schedule’s own Golf example, $200,000 of the $300,000 contribution is
          initiation.
        </p>

        <p className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm leading-7 text-slate-600">
          <strong className="font-semibold text-slate-900">Confirm with the club:</strong> whether
          you would qualify, how the seller’s status affects it, the timing, the current bylaws,
          today’s split between initiation and equity, and whether returns are paid from a queue.
          The schedules call their charts examples and say all fees are subject to change, so
          don’t treat any figure here as the refund you will receive.
        </p>
      </section>

      {/* ── Amenities ──────────────────────────────────────────────── */}
      <section id="amenities" aria-labelledby="amenities-heading" className={SECTION}>
        <p className={EYEBROW}>What membership pays for</p>
        <h2 id="amenities-heading" className={H2}>
          Amenities That Actually Matter
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {AMENITIES.map((a) => (
            <div key={a.heading} className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
              <h3 className="font-semibold text-slate-900">{a.heading}</h3>
              <ul className="mt-3 space-y-2">
                {a.items.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-6 text-slate-600">
                    <Check />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── Investment ─────────────────────────────────────────────── */}
      <section id="club-investment" aria-labelledby="investment-heading" className={SECTION}>
        <p className={EYEBROW}>Reinvestment</p>
        <h2 id="investment-heading" className={H2}>
          Recent and Ongoing Investment
        </h2>
        <p className="mt-4 leading-8 text-slate-600">
          Mirasol combines established club amenities with continuing reinvestment.
        </p>
        <ol className="mt-6 space-y-5 border-l-2 border-slate-200 pl-6">
          {INVESTMENT.map((item) => (
            <li key={item.text} className="relative">
              <span
                aria-hidden="true"
                className={`absolute -left-[31px] top-1.5 h-3 w-3 rounded-full ring-4 ring-white ${
                  item.status === 'Completed' ? 'bg-gold-500' : 'bg-slate-300'
                }`}
              />
              <p className="text-sm font-semibold text-slate-900">
                {item.when}
                <span
                  className={`ml-2 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    item.status === 'Completed' ? 'bg-gold-50 text-gold-700' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.status}
                </span>
              </p>
              <p className="mt-1.5 text-sm leading-7 text-slate-600">{item.text}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-sm leading-7 text-slate-500">
          Anticipated completion dates come from City of Palm Beach Gardens reports and can slip.
          Ask us for the current status before counting on either facility.
        </p>
      </section>
    </div>
  )
}

const MAILTO =
  'mailto:john@doyouneedahome.com' +
  `?subject=${encodeURIComponent('Mirasol membership schedule request')}` +
  `&body=${encodeURIComponent('Hi John,\n\nPlease send me the current Mirasol membership schedule.\n\nHomes or neighborhoods I am looking at:\n')}`

export function MirasolClosingCta({ searchHref }: { searchHref: string }) {
  return (
    <section
      id="membership-schedule"
      aria-labelledby="schedule-heading"
      className={`${SECTION} rounded-3xl bg-navy-950 p-7 text-white sm:p-10`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-300">Before you tour</p>
      <h2 id="schedule-heading" className="mt-2 font-serif text-2xl font-semibold sm:text-3xl">
        Know the Membership Before You Fall for the House
      </h2>
      <p className="mt-4 max-w-2xl leading-8 text-slate-300">
        Before you tour, we can confirm the home’s membership category, explain the reported
        carrying costs, request the current club schedule, and help you compare Golf, Sports, and
        Social membership homes.
      </p>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <a
          href={MAILTO}
          className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-navy-950 transition hover:bg-slate-100"
        >
          Get the Current Membership Schedule
        </a>
        <a
          href="tel:+15617837733"
          className="inline-flex items-center justify-center rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
        >
          Call (561) 783-7733
        </a>
        <a
          href={searchHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
        >
          Search Mirasol Homes
        </a>
      </div>
    </section>
  )
}
