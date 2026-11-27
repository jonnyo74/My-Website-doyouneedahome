import Link from 'next/link'
import YlopoInit from '@/components/YlopoInit'
import DeferredContactCta from '@/components/DeferredContactCta'
import BallenIslesListings from '@/components/BallenIslesListings'
import ClubInquiry from '@/components/clubCommunity/ClubInquiry'
import ClubMembershipCta from '@/components/clubCommunity/ClubMembershipCta'
import ClubQuickFacts from '@/components/clubCommunity/ClubQuickFacts'
import InquiryLink from '@/components/clubCommunity/InquiryLink'
import ScrollTable from '@/components/clubCommunity/ScrollTable'
import ReviewedBy from '@/components/clubCommunity/ReviewedBy'
import SoldListings from '@/components/clubCommunity/SoldListings'
import SourceRegister from '@/components/clubCommunity/SourceRegister'
import {
  INQUIRY_ID,
  btnGhostDark,
  btnOutline,
  btnPrimary,
  card,
  eyebrow,
  h2,
  h3,
  lead,
  section,
  summaryCls,
  td,
  textLink,
  th,
  wrap,
} from '@/components/clubCommunity/ui'
import { scopeSearch } from '@/lib/abacoaScopes'
import {
  BALLENISLES_LEAD_CTA,
  BALLENISLES_SCOPE,
  PRICE_BANDS,
  TYPE_SEARCHES,
  ballenIslesSearchUrl,
  ballenIslesSoldSearch,
  ballenIslesSoldSearchUrl,
} from '@/lib/ballenIslesScope'
import {
  BEFORE_OFFER,
  CATEGORIES,
  CLUB_CHARGES,
  COMPARE,
  COSTS,
  FAQS,
  HOME_TYPES,
  MEMBERSHIP_ANSWER,
  MEMBERSHIP_TABLE,
  NEIGHBORHOODS,
  NOT_VERIFIED,
  QUICK_FACTS,
  REVIEWED,
  SOURCES,
  URLS,
} from '@/lib/ballenIsles'
import { SITE_URL } from '@/lib/site'

// The BallenIsles page, built from the Admirals Cove club template
// (docs/country-club-page-playbook.md). Order follows the buyer's decision:
// what is for sale, what the membership means, which neighborhood, what it
// costs, what has sold, then one form. Facts live in lib/ballenIsles, listing
// scopes in lib/ballenIslesScope.

const NAME = 'BallenIsles'
const PAGE = `${SITE_URL}/communities/ballen-isles`
const ext = { target: '_blank', rel: 'noopener noreferrer' } as const

const JUMP: [string, string][] = [
  ['#listings', 'Listings'],
  ['#membership', 'Membership'],
  ['#neighborhoods', 'Neighborhoods'],
  ['#costs', 'Ownership Costs'],
  ['#sales', 'Recent Sales'],
  ['#faqs', 'FAQs'],
]

const SHOWING_LABEL = 'Arrange a Private Showing'

const bullet = <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-report-gold" aria-hidden="true" />

export default function BallenIslesLanding() {
  const allUrl = ballenIslesSearchUrl()

  const ld = (o: unknown) => ({ __html: JSON.stringify(o).replace(/</g, '\\u003c') })
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      ['Home', `${SITE_URL}/`],
      ['Communities', `${SITE_URL}/communities`],
      ['Palm Beach Gardens', `${SITE_URL}/communities/palm-beach-gardens`],
      [NAME, PAGE],
    ].map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })),
  }
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }
  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': PAGE,
    url: PAGE,
    name: 'BallenIsles Homes for Sale, Palm Beach Gardens: membership, neighborhoods and costs',
    dateModified: REVIEWED.factsIso,
    about: {
      '@type': 'Place',
      name: NAME,
      address: { '@type': 'PostalAddress', addressLocality: 'Palm Beach Gardens', addressRegion: 'FL', postalCode: '33418', addressCountry: 'US' },
    },
    author: [
      { '@type': 'Person', name: 'John Oliver', jobTitle: 'REALTOR®', url: `${SITE_URL}/team` },
      { '@type': 'Person', name: 'Christine Dekant', jobTitle: 'REALTOR®', url: `${SITE_URL}/team` },
    ],
    publisher: { '@type': 'RealEstateAgent', name: 'DO Homes Group', url: SITE_URL },
  }

  const groups = HOME_TYPES.map((h) => ({ ...h, hoods: NEIGHBORHOODS.filter((n) => n.type === h.type) }))

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={ld(breadcrumbSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={ld(pageSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={ld(faqSchema)} />

      <DeferredContactCta untilPast="bi-jump-links" />

      {/* Hero. No approved BallenIsles photograph exists in the repo, so the hero is type on navy. */}
      <section id="bi-hero" className="relative isolate overflow-hidden bg-navy-950">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-navy-950 via-navy-950 to-navy-800" aria-hidden="true" />
        <div className={`${wrap} w-full px-6 pb-12 pt-12 sm:px-8 sm:pt-16`}>
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-white/85">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/communities" className="hover:text-white">Communities</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/communities/palm-beach-gardens" className="hover:text-white">Palm Beach Gardens</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-white">{NAME}</li>
            </ol>
          </nav>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-report-gold-light">
            Palm Beach Gardens, Florida · Country club community
          </p>
          <h1 className="mt-3 max-w-4xl font-serif text-4xl font-semibold leading-[1.08] text-white sm:text-6xl">
            BallenIsles Homes for Sale
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/90">
            BallenIsles is a gated country club community in Palm Beach Gardens, with three golf courses and 33
            neighborhoods. Club membership comes with every purchase, so you are choosing two things at once: the
            home, and the membership that fits how you will use the club.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <a href="#listings" className={btnPrimary}>See BallenIsles Homes for Sale</a>
            <InquiryLink type="membership-fees" className={btnGhostDark} />
          </div>
          <nav id="bi-jump-links" aria-label="On this page" className="mt-10 border-t border-white/15 pt-5">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/85">
              {JUMP.map(([href, label]) => (
                <li key={href}>
                  <a href={href} className="underline-offset-4 hover:text-white hover:underline">{label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {/* Listings */}
      <section id="listings" className={`scroll-mt-24 ${section}`} aria-labelledby="bi-listings">
        <div className={wrap}>
          <p className={eyebrow}>Live MLS feed · BallenIsles only</p>
          <h2 id="bi-listings" className={h2}>Homes for sale in BallenIsles</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            Active listings inside the gates only, every neighborhood and home type. Nearby communities such as
            PGA National, Gardenia Isles and Old Palm are left out.
          </p>
          <a href={allUrl} {...ext} className={`mt-3 inline-block text-sm ${textLink}`}>
            Open all BallenIsles homes in the full search →
          </a>
          <div className="mt-6">
            <YlopoInit city="BallenIsles" />
            <BallenIslesListings>
              <div
                className="YLOPO_resultsWidget overflow-hidden rounded-2xl"
                data-search={JSON.stringify(scopeSearch(BALLENISLES_SCOPE))}
              />
            </BallenIslesListings>
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-2">
            <div>
              <h3 className={h3}>Search by home type</h3>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {TYPE_SEARCHES.map((x) => (
                  <li key={x.label} className={`flex flex-col ${card}`}>
                    <p className="font-semibold text-slate-900">{x.label}</p>
                    <p className="mt-1.5 flex-1 text-sm leading-6 text-slate-600">{x.note}</p>
                    <a href={ballenIslesSearchUrl(x.filter)} {...ext} className={`mt-3 text-sm ${textLink}`} aria-label={`Search ${x.label} in BallenIsles`}>
                      Search →
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className={h3}>Search by price</h3>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {PRICE_BANDS.map((b) => (
                  <li key={b.label}>
                    <a
                      href={ballenIslesSearchUrl(b.filter)}
                      {...ext}
                      className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition hover:border-report-gold-dark"
                    >
                      <span className="font-serif text-lg font-semibold text-slate-900">{b.label}</span>
                      <span className="mt-3 text-sm font-semibold text-gold-600">Search →</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-6 text-sm leading-7 text-slate-600">
            The feed cannot tell a golf view from a lake view.{' '}
            <InquiryLink type="listing-alerts" className={textLink}>Tell us what you want and we will match homes by hand →</InquiryLink>
          </p>
        </div>
      </section>

      {/* Membership */}
      <section id="membership" className={`scroll-mt-24 bg-slate-50 ${section}`} aria-labelledby="bi-membership">
        <div className={wrap}>
          <p className={eyebrow}>The club</p>
          <h2 id="bi-membership" className={h2}>How BallenIsles membership works</h2>
          <p className={lead}>
            BallenIsles Country Club is a mandatory membership equity club for residents. When you buy, you join.
            The decision is which of the four categories you join in, what it costs, and whether it is open to you
            for the home you want.
          </p>

          <h3 className={`mt-10 ${h3}`}>The four categories</h3>
          {/* Phones: one card per category. Wider screens: the comparison table. */}
          <ul className="mt-5 space-y-4 sm:hidden">
            {CATEGORIES.map((c) => (
              <li key={c.key} className={card}>
                <p className="font-serif text-lg font-semibold text-slate-900">{c.name}</p>
                <p className="text-xs text-slate-500">{c.short}</p>
                <dl className="mt-3 space-y-2 text-sm leading-6">
                  {MEMBERSHIP_TABLE.map((r) => (
                    <div key={r.row}>
                      <dt className="font-semibold text-slate-900">{r.row}</dt>
                      <dd className="text-slate-600">{r.cells[c.key]}</dd>
                    </div>
                  ))}
                </dl>
              </li>
            ))}
          </ul>
          <ScrollTable label="BallenIsles membership categories compared" className="mt-5 hidden sm:block">
            <table className="w-full min-w-[52rem]">
              <caption className="sr-only">What each BallenIsles membership category includes, as the club publishes it</caption>
              <thead className="bg-slate-100">
                <tr>
                  <td className={th} />
                  {CATEGORIES.map((c) => (
                    <th key={c.key} scope="col" className={th}>
                      {c.name}
                      <span className="mt-1 block text-[11px] font-normal normal-case tracking-normal text-slate-500">{c.short}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {MEMBERSHIP_TABLE.map((r) => (
                  <tr key={r.row}>
                    <th scope="row" className={`${td} w-40 text-left font-semibold text-slate-900`}>{r.row}</th>
                    {CATEGORIES.map((c) => <td key={c.key} className={td}>{r.cells[c.key]}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollTable>
          <p className="mt-3 text-xs leading-6 text-slate-500">
            From the club’s membership page and its 2026 membership schedule, read {REVIEWED.facts}. The club can
            change any of it.
          </p>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <div className={card}>
              <h3 className="font-serif text-xl font-semibold text-slate-900">
                “I found a house I like. Can I get the membership I want?”
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">What the club’s own material settles for every home:</p>
              <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-700">
                {MEMBERSHIP_ANSWER.settled.map((s) => <li key={s} className="flex gap-3">{bullet}<span>{s}</span></li>)}
              </ul>
            </div>
            <div className={card}>
              <h3 className="font-serif text-xl font-semibold text-slate-900">Ask the membership office before you offer</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                The club’s public material leaves these open. Get the answers for the specific address, in writing:
              </p>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-700">
                {MEMBERSHIP_ANSWER.askFirst.map((q) => <li key={q}>{q}</li>)}
              </ol>
              <InquiryLink type="membership-check" className={`mt-5 ${btnPrimary}`} />
            </div>
          </div>

          <h3 className={`mt-12 ${h3}`}>The charges to ask for</h3>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
            We do not print amounts: they change each year and depend on the category. These are the lines on the
            club’s schedule and the questions to put beside each.
          </p>
          <dl className="mt-5 grid gap-x-8 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
            {CLUB_CHARGES.map((c) => (
              <div key={c.name} className="border-l-2 border-report-gold pl-4">
                <dt className="text-sm font-semibold text-slate-900">{c.name}</dt>
                <dd className="text-sm leading-6 text-slate-600">{c.note}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10">
            <ClubMembershipCta community={NAME} slug="ballen-isles" />
          </div>
        </div>
      </section>

      {/* Neighborhoods */}
      <section id="neighborhoods" className={`scroll-mt-24 ${section}`} aria-labelledby="bi-neighborhoods">
        <div className={wrap}>
          <p className={eyebrow}>33 neighborhoods</p>
          <h2 id="bi-neighborhoods" className={h2}>Which BallenIsles neighborhoods to tour</h2>
          <p className={lead}>
            The club describes nearly 1,600 residences in 33 neighborhoods. Start with the kind of home, then the
            setting. Every neighborhood below shares the same club and the same gates.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {groups.map((g) => (
              <a key={g.type} href={`#hood-${g.type.split(' ')[0].toLowerCase()}`} className={`${card} block transition hover:border-report-gold-dark`}>
                <p className="font-serif text-lg font-semibold text-slate-900">{g.type}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">{g.hoods.length} neighborhoods</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{g.who}</p>
                <p className="mt-3 text-sm leading-6 text-slate-700"><span className="font-semibold">Check: </span>{g.check}</p>
              </a>
            ))}
          </div>

          {groups.map((g) => (
            <div key={g.type} id={`hood-${g.type.split(' ')[0].toLowerCase()}`} className="mt-10 scroll-mt-24">
              <h3 className={h3}>{g.type}</h3>
              <ul className="mt-4 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white sm:hidden">
                {g.hoods.map((n) => (
                  <li key={n.name} className="px-4 py-3">
                    <p className="font-semibold text-slate-900">
                      {n.name}
                      {n.homes != null && <span className="font-normal text-slate-500"> · {n.homes} homes</span>}
                    </p>
                    {n.setting && <p className="text-sm leading-6 text-slate-600">{n.setting}</p>}
                    <p className="text-xs leading-5 text-slate-500">{n.where}</p>
                  </li>
                ))}
              </ul>
              <ScrollTable label={`${g.type} neighborhoods in BallenIsles`} className="mt-4 hidden sm:block">
                <table className="w-full min-w-[40rem]">
                  <caption className="sr-only">{g.type} neighborhoods in BallenIsles: home count, setting and location</caption>
                  <thead className="bg-slate-100">
                    <tr>
                      <th scope="col" className={th}>Neighborhood</th>
                      <th scope="col" className={th}>Homes</th>
                      <th scope="col" className={th}>Setting</th>
                      <th scope="col" className={th}>Where</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {g.hoods.map((n) => (
                      <tr key={n.name}>
                        <th scope="row" className={`${td} text-left font-semibold text-slate-900`}>{n.name}</th>
                        <td className={td}>{n.homes ?? '—'}</td>
                        <td className={td}>{n.setting || '—'}</td>
                        <td className={td}>{n.where}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollTable>
            </div>
          ))}
          <p className="mt-4 text-xs leading-6 text-slate-500">
            Home counts, settings and locations as the club describes each neighborhood, read {REVIEWED.facts}.
            Some descriptions are dated; confirm views and lot position for the specific home.
          </p>

          <div className="mt-8 rounded-3xl bg-slate-50 p-7 sm:flex sm:items-center sm:justify-between sm:gap-8">
            <p className="max-w-2xl text-sm leading-7 text-slate-700">
              Tell us the home type, the setting and the price, and we will send the neighborhoods worth a visit
              with their recent sales.
            </p>
            <InquiryLink type="private-showing" className={`mt-5 flex-shrink-0 sm:mt-0 ${btnPrimary}`}>
              {SHOWING_LABEL}
            </InquiryLink>
          </div>
        </div>
      </section>

      {/* Costs */}
      <section id="costs" className={`scroll-mt-24 bg-slate-50 ${section}`} aria-labelledby="bi-costs">
        <div className={wrap}>
          <p className={eyebrow}>Ownership costs</p>
          <h2 id="bi-costs" className={h2}>The full cost of owning a specific home</h2>
          <p className={lead}>
            You pay the club, the master association, usually a neighborhood association, and the costs of the house
            itself. Every figure depends on the address and the membership category, so get each one for the home
            you are weighing.
          </p>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {COSTS.map((g) => (
              <div key={g.group} className={card}>
                <h3 className="font-semibold text-slate-900">{g.group}</h3>
                <dl className="mt-3 space-y-3 text-sm leading-6">
                  {g.items.map((i) => (
                    <div key={i.name}>
                      <dt className="font-medium text-slate-900">{i.name}</dt>
                      <dd className="text-slate-600">{i.how}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_minmax(0,22rem)] lg:items-start">
            <div>
              <h3 className={h3}>Before you make an offer</h3>
              <ol className="mt-5 space-y-4">
                {BEFORE_OFFER.map((b, i) => (
                  <li key={b.item} className="flex gap-4">
                    <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-navy-950 text-xs font-semibold text-white" aria-hidden="true">{i + 1}</span>
                    <div>
                      <p className="font-semibold text-slate-900">{b.item}</p>
                      <p className="text-sm leading-6 text-slate-600">{b.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-6 text-sm leading-7 text-slate-600">
                Look up any address on{' '}
                <a href={URLS.fema} {...ext} className={textLink}>FEMA’s flood map ↗</a>, its taxes on the{' '}
                <a href={URLS.papa} {...ext} className={textLink}>Property Appraiser’s site ↗</a>, and its schools with
                the district’s <a href={URLS.schoolFinder} {...ext} className={textLink}>Find My School tool ↗</a>.
              </p>
            </div>
            <aside className="rounded-3xl bg-navy-950 p-7 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-report-gold-light">One request</p>
              <p className="mt-2 font-serif text-2xl font-semibold leading-tight">The current fee schedule and costs for a home</p>
              <p className="mt-3 text-sm leading-7 text-white/90">
                We gather the club’s schedule, the association budgets and the tax estimate for the address you
                are considering.
              </p>
              <div className="mt-5 flex flex-col gap-3">
                <InquiryLink type="membership-fees" className={btnPrimary} />
                <InquiryLink type="membership-check" className={btnGhostDark} />
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Recent sales */}
      <section id="sales" className={`scroll-mt-24 ${section}`} aria-labelledby="bi-sales">
        <div className={wrap}>
          <p className={eyebrow}>Live MLS feed · Recently sold</p>
          <h2 id="bi-sales" className={h2}>Recently sold in BallenIsles</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            The most recent closed sales inside the gates, newest first, with the sold price and date. The list
            updates itself from the MLS as homes close.
          </p>
          <a href={ballenIslesSoldSearchUrl()} {...ext} className={`mt-3 inline-block text-sm ${textLink}`}>
            See every BallenIsles sale in the full search →
          </a>
          <div className="mt-6">
            <SoldListings search={ballenIslesSoldSearch(12)} count={6} community={NAME} fullSearchUrl={ballenIslesSoldSearchUrl()} />
          </div>
          <div className="mt-8 rounded-3xl bg-slate-50 p-7 sm:flex sm:items-center sm:justify-between sm:gap-8">
            <p className="max-w-2xl text-sm leading-7 text-slate-700">
              A sale price does not show the home’s condition, its view, or what the buyer paid the club. Ask us
              for the sales in the neighborhoods you are considering, with what we know about each.
            </p>
            <InquiryLink type="private-showing" className={`mt-5 flex-shrink-0 sm:mt-0 ${btnOutline}`}>
              {SHOWING_LABEL}
            </InquiryLink>
          </div>
        </div>
      </section>

      {/* At a glance + compare */}
      <section className={`bg-slate-50 ${section}`} aria-labelledby="bi-compare">
        <div className={wrap}>
          <p className={eyebrow}>Compare</p>
          <h2 id="bi-compare" className={h2}>Also touring in Palm Beach Gardens?</h2>
          <ul className="mt-6 grid gap-5 md:grid-cols-2">
            {COMPARE.map((c) => (
              <li key={c.href} className={card}>
                <Link href={c.href} className={`font-serif text-xl ${textLink}`}>{c.name} →</Link>
                <dl className="mt-3 space-y-1.5 text-sm leading-6 text-slate-700">
                  <div><dt className="inline font-semibold">Golf: </dt><dd className="inline">{c.golf}</dd></div>
                  <div><dt className="inline font-semibold">Membership: </dt><dd className="inline">{c.membership}</dd></div>
                </dl>
                <p className="mt-3 text-sm leading-6 text-slate-600">{c.note}</p>
              </li>
            ))}
          </ul>
          <details className="group mt-8">
            <summary className={summaryCls}>BallenIsles quick facts, with sources</summary>
            <div className="mt-4">
              <ClubQuickFacts facts={QUICK_FACTS} caption="BallenIsles quick facts, each with its source" />
            </div>
          </details>
        </div>
      </section>

      {/* FAQs */}
      <section id="faqs" className={`scroll-mt-24 ${section}`} aria-labelledby="bi-faqs">
        <div className={wrap}>
          <p className={eyebrow}>Buyer questions</p>
          <h2 id="bi-faqs" className={h2}>BallenIsles FAQs</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {FAQS.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-card">
                <summary className="cursor-pointer list-none font-semibold text-slate-900 marker:hidden [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {f.q}
                    <span aria-hidden="true" className="text-report-gold-text transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-7 text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* The one form */}
      <section id={INQUIRY_ID} className={`scroll-mt-24 bg-navy-950 ${section}`} aria-labelledby="bi-inquiry">
        <div className={`${wrap} grid gap-10 lg:grid-cols-[1fr_minmax(0,28rem)] lg:items-start`}>
          <div className="text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-report-gold-light">Ask DO Homes Group</p>
            <h2 id="bi-inquiry" className="mt-2 font-serif text-3xl font-semibold leading-tight sm:text-4xl">
              Fees, membership and a showing
            </h2>
            <p className="mt-4 max-w-xl leading-8 text-white/90">
              Pick what you need. For a specific home, put the address or the listing link in the message. Your
              phone number is optional.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-white/90">
              <li>· <strong>Request Current Membership Fees:</strong> the club’s schedule for the category you want</li>
              <li>· <strong>Check Membership for a Specific Home:</strong> what the club will confirm for that address</li>
              <li>· <strong>{SHOWING_LABEL}:</strong> with gate access arranged</li>
            </ul>
            <p className="mt-6 text-sm text-white/85">
              Would you rather talk? Call{' '}
              <a href="tel:+15617837733" className="font-semibold text-white underline underline-offset-4">(561) 783-7733</a>.
            </p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
            <ClubInquiry
              community={NAME}
              types={['membership-fees', 'membership-check', 'private-showing', 'ownership-costs', 'listing-alerts', 'club-options']}
              labels={{ 'private-showing': SHOWING_LABEL, 'listing-alerts': BALLENISLES_LEAD_CTA }}
            />
          </div>
        </div>
      </section>

      {/* Who wrote it */}
      <section className={section} aria-labelledby="bi-authors">
        <div className={wrap}>
          <p className={eyebrow}>Who is behind this guide</p>
          <h2 id="bi-authors" className={h2}>Researched and reviewed by DO Homes Group</h2>
          <div className="mt-5">
            <ReviewedBy community={NAME} reviewed={REVIEWED.facts} />
          </div>
        </div>
      </section>

      {/* Sources */}
      <section id="sources" className={`scroll-mt-24 border-t border-slate-200 ${section}`} aria-labelledby="bi-sources">
        <div className={wrap}>
          <p className={eyebrow}>Research and sources</p>
          <h2 id="bi-sources" className={h2}>Where this page’s facts come from</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            Club rules and community facts come from the club, the community association and public records,
            checked {REVIEWED.facts}. Listings and sales come live from the MLS.
          </p>
          <details className="group mt-5">
            <summary className={summaryCls}>Sources and what we could not confirm</summary>
            <div className="mt-6">
              <SourceRegister groups={SOURCES} notVerified={NOT_VERIFIED} reviewed={REVIEWED.facts} recordsDate={REVIEWED.facts} />
            </div>
          </details>
          <p className="mt-10 text-xs leading-6 text-slate-500">
            This page is for information only and is not legal, tax, insurance or financial advice. Club rules,
            membership terms, fees, association assessments and leasing rules change. Verify anything that matters to
            your decision with the club, the associations and your own advisers before you sign. DO Homes Group is
            not affiliated with BallenIsles Country Club or the BallenIsles Community Association. DO Homes Group at
            Premier Brokers International is committed to Equal Housing Opportunity.
          </p>
        </div>
      </section>
    </div>
  )
}
