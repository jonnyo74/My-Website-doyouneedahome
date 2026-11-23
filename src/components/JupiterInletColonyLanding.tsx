import Link from 'next/link'
import ContactForm from '@/components/ContactForm'
import YlopoInit from '@/components/YlopoInit'
import ColonyListings from '@/components/ColonyListings'
import ColonyTownMap, { COLONY_MAP_DESCRIPTION } from '@/components/ColonyTownMap'
import MarketTrendsBlock from '@/components/MarketTrendsBlock'
import AbacoaRetrieved from '@/components/AbacoaRetrieved'
import { marketTrendsCity } from '@/lib/articles'
import { scopeFullSearchUrl, scopeSearch } from '@/lib/abacoaScopes'
import { COLONY_LEAD_CTA, COLONY_SCOPE, GREATER_JUPITER_SEARCH_URL } from '@/lib/colonyScope'
import {
  COLONY_CHECKED,
  COMPARE,
  DUE_DILIGENCE,
  FAQS,
  PARCELS,
  PROPERTY_TYPES,
  SALES_PERIOD,
  SCHOOL_FINDER_URL,
  SOURCES,
  salesSummary,
  usd,
} from '@/lib/colonyGuide'
import { SITE_URL } from '@/lib/site'

// The Jupiter Inlet Colony page. Section order is the buyer's path: listings,
// where the town is, what each kind of lot involves, what has sold, what else
// to compare, then the form. Every listing surface reads lib/colonyScope and
// every fact reads lib/colonyGuide.

const eyebrow = 'text-xs font-semibold uppercase tracking-[0.28em] text-report-gold-text'
const h2 = 'mt-2 font-serif text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl'
const btnPrimary =
  'inline-flex items-center justify-center rounded-full bg-report-gold px-7 py-3.5 text-center text-sm font-semibold text-navy-950 shadow-sm transition hover:bg-report-gold-light'
const btnGhostDark =
  'inline-flex items-center justify-center rounded-full border border-white/50 px-7 py-3.5 text-center text-sm font-semibold text-white transition hover:border-white hover:bg-white/10'
const textLink = 'font-semibold text-gold-600 underline-offset-4 hover:text-gold-700 hover:underline'
const section = 'px-6 py-14 sm:px-8 sm:py-16'

const INQUIRY = '#colony-inquiry'

export default function JupiterInletColonyLanding() {
  const searchUrl = scopeFullSearchUrl(COLONY_SCOPE)
  const sales = salesSummary()
  const trends = marketTrendsCity('Jupiter')

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      ['Home', `${SITE_URL}/`],
      ['Communities', `${SITE_URL}/communities`],
      ['Jupiter Inlet Colony', `${SITE_URL}/communities/jupiter-inlet-colony`],
    ].map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })),
  }
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }
  const ld = (o: unknown) => ({ __html: JSON.stringify(o).replace(/</g, '\\u003c') })

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={ld(breadcrumbSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={ld(faqSchema)} />

      {/* Hero. No photo: we have none taken inside the town, and a Jupiter
          photo here would say the opposite of the page. */}
      <section className="bg-navy-950">
        <div className="mx-auto w-full max-w-7xl px-6 pb-14 pt-12 sm:px-8 sm:pt-16">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-white/85">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/communities" className="hover:text-white">Communities</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-white">Jupiter Inlet Colony</li>
            </ol>
          </nav>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-report-gold-light">
            Town of Jupiter Inlet Colony · Palm Beach County
          </p>
          <h1 className="mt-3 font-serif text-4xl font-semibold leading-[1.08] text-white sm:text-6xl">
            Jupiter Inlet Colony Homes for Sale
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/90">
            A town of about 236 single-family homes at the southern tip of Jupiter Island, incorporated in
            1959. It has its own government and is not part of Jupiter. The Atlantic is on one side, the
            Intracoastal Waterway on the other and Jupiter Inlet at the end.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <a href="#listings" className={btnPrimary}>See Colony homes for sale</a>
            <a href={INQUIRY} className={btnGhostDark}>{COLONY_LEAD_CTA}</a>
          </div>
        </div>
      </section>

      {/* Scoped listings */}
      <section id="listings" className={`scroll-mt-24 ${section}`} aria-labelledby="colony-listings-heading">
        <div className="mx-auto max-w-7xl">
          {/* The full-search link stays on the left: the site's contact widget
              opens over the bottom-right corner on desktop and covered it there. */}
          <div className="mb-6">
            <p className={eyebrow}>Live MLS feed · Colony only</p>
            <h2 id="colony-listings-heading" className={h2}>Homes for sale in Jupiter Inlet Colony</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
              Only homes inside the town limits, at any price. The MLS files some Colony homes with a
              Jupiter mailing city; they are included. Nearby Jupiter and Tequesta homes are not.
            </p>
            <a href={searchUrl} target="_blank" rel="noopener noreferrer" className={`mt-3 inline-block text-sm ${textLink}`}>
              Open all Colony homes in the full search →
            </a>
          </div>
          <YlopoInit city="Jupiter Inlet Colony" />
          <ColonyListings>
            <div
              className="YLOPO_resultsWidget overflow-hidden rounded-2xl"
              data-search={JSON.stringify(scopeSearch(COLONY_SCOPE))}
            />
          </ColonyListings>

          <h3 className="mt-10 font-serif text-xl font-semibold text-slate-900">Narrow it down</h3>
          <ul className="mt-4 grid gap-4 md:grid-cols-3">
            <li className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
              <p className="font-semibold text-slate-900">All Colony homes</p>
              <p className="mt-1.5 flex-1 text-sm leading-6 text-slate-600">
                Every active listing inside the town, newest first, on the full search site. Below them the
                search site adds its own “similar listings nearby”. Those are outside the Colony.
              </p>
              <a href={searchUrl} target="_blank" rel="noopener noreferrer" className={`mt-3 text-sm ${textLink}`}>
                Search all Colony homes →
              </a>
            </li>
            <li className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
              <p className="font-semibold text-slate-900">Oceanfront homes</p>
              <p className="mt-1.5 flex-1 text-sm leading-6 text-slate-600">
                The search site’s oceanfront filter mislabels homes here, so we do not link to it. We check
                each listing against the lot and send you the ones on the Atlantic.
              </p>
              <a href={INQUIRY} className={`mt-3 text-sm ${textLink}`}>Ask for oceanfront homes →</a>
            </li>
            <li className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
              <p className="font-semibold text-slate-900">Inlet &amp; Intracoastal homes</p>
              <p className="mt-1.5 flex-1 text-sm leading-6 text-slate-600">
                No search filter picks these out reliably either. Tell us you want the waterway side and we
                will send matching homes, with what we know about each dock and seawall.
              </p>
              <a href={INQUIRY} className={`mt-3 text-sm ${textLink}`}>Ask for inlet &amp; Intracoastal homes →</a>
            </li>
          </ul>
          <p className="mt-6 text-xs leading-6 text-slate-500">
            Listings come from the MLS feed on our search site. This block shows active listings only. Open
            a listing for its full details and the listing brokerage.
          </p>
        </div>
      </section>

      {/* Town map */}
      <section className={`bg-slate-50 ${section}`} aria-labelledby="colony-map-heading">
        <div className="mx-auto max-w-7xl">
          <p className={eyebrow}>Where it is</p>
          <h2 id="colony-map-heading" className={h2}>The town on a map</h2>
        </div>
        <div className="mx-auto mt-8 grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start">
          <figure>
            <ColonyTownMap />
            <figcaption className="mt-3 text-xs leading-6 text-slate-500">
              For orientation only. The outline is Palm Beach County’s municipal boundary and the streets are
              county road centerlines, retrieved {COLONY_CHECKED}. It does not show lot lines, beach walkways
              or docks, and nothing on it means the public may cross private property.
            </figcaption>
          </figure>
          <div>
            <p className="leading-8 text-slate-600">
              The whole town is about 0.18 square miles: eight streets on a point of land with water on three
              sides. The one road in is Beach Road, which comes down the island through the Village of
              Tequesta and becomes Colony Road.
            </p>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
              <li><span className="font-semibold text-slate-900">East:</span> the Atlantic Ocean, along Ocean Drive.</li>
              <li><span className="font-semibold text-slate-900">South:</span> Jupiter Inlet. The Town of Jupiter is on the other side.</li>
              <li><span className="font-semibold text-slate-900">West:</span> the Intracoastal Waterway, along Lighthouse Drive.</li>
              <li><span className="font-semibold text-slate-900">Through the middle:</span> Colony Road, Beacon Lane and Shelter Lane, joined by Treasure Place, Pirates Place and Cove Place.</li>
              <li><span className="font-semibold text-slate-900">Town Hall:</span> 50 Colony Road, at the north end.</li>
              <li><span className="font-semibold text-slate-900">Jupiter Inlet Beach Club:</span> 244 Ocean Drive. A private club, not a public beach entrance.</li>
              <li>
                <span className="font-semibold text-slate-900">Jupiter Inlet Lighthouse:</span> a nearby landmark, not in
                the town. It is across the Intracoastal Waterway in Jupiter, at 500 Captain Armour’s Way.
              </li>
            </ul>
            <p className="sr-only">{COLONY_MAP_DESCRIPTION}</p>
          </div>
        </div>
      </section>

      {/* Property types and due diligence */}
      <section className={section} aria-labelledby="colony-types-heading">
        <div className="mx-auto max-w-7xl">
          <p className={eyebrow}>Buyer guide</p>
          <h2 id="colony-types-heading" className={h2}>Three kinds of lot, three sets of questions</h2>
          <p className="mt-3 max-w-3xl leading-8 text-slate-600">
            Every home here is single-family, and county records show {PARCELS.singleFamily} of them plus{' '}
            {PARCELS.vacant} vacant lots. What changes from one address to the next is the water: none, the
            ocean, or the inlet and Intracoastal.
          </p>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {PROPERTY_TYPES.map((t) => (
              <article key={t.id} className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
                <h3 className="font-serif text-2xl font-semibold text-slate-900">{t.title}</h3>
                <p className="mt-1 text-sm font-semibold text-report-gold-text">{t.where}</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">{t.body}</p>
                <p className="mt-4 text-sm font-semibold text-slate-900">Check first</p>
                <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
                  {t.check.map((c) => (
                    <li key={c} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-report-gold" aria-hidden="true" />
                      {c}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <h3 className="mt-14 font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">
            What to verify for any Colony address
          </h3>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {DUE_DILIGENCE.map((d) => (
              <div key={d.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <h4 className="font-semibold text-slate-900">{d.title}</h4>
                <p className="mt-2 text-sm leading-7 text-slate-600">{d.body}</p>
                {d.link && (
                  <a href={d.link.url} target="_blank" rel="noopener noreferrer" className={`mt-3 inline-block text-sm ${textLink}`}>
                    {d.link.label} ↗
                  </a>
                )}
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm leading-7 text-slate-600">
            Schools follow the address and can change. Look up any address with the School District of Palm
            Beach County’s{' '}
            <a href={SCHOOL_FINDER_URL} target="_blank" rel="noopener noreferrer" className={textLink}>
              Find My School tool ↗
            </a>
            .
          </p>

          <h3 id="faqs" className="mt-14 scroll-mt-24 font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">
            Questions buyers ask about Jupiter Inlet Colony
          </h3>
          <dl className="mt-6 grid gap-4 md:grid-cols-2">
            {FAQS.map((f) => (
              <div key={f.q} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
                <dt className="font-semibold text-slate-900">{f.q}</dt>
                <dd className="mt-2 text-sm leading-7 text-slate-600">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Recent sales */}
      <section className={`bg-slate-50 ${section}`} aria-labelledby="colony-sales-heading">
        <div className="mx-auto max-w-7xl">
          <p className={eyebrow}>Recent sales</p>
          <h2 id="colony-sales-heading" className={h2}>What has sold in the Colony</h2>
          {sales ? (
            <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
              <div>
                <p className="leading-8 text-slate-600">
                  County records show <strong className="text-slate-900">{sales.count} recorded sales</strong> of
                  single-family homes inside the town between {SALES_PERIOD.from} and {SALES_PERIOD.to}. Prices
                  ran from <strong className="text-slate-900">{usd(sales.low)}</strong> to{' '}
                  <strong className="text-slate-900">{usd(sales.high)}</strong>, with a median of{' '}
                  <strong className="text-slate-900">{usd(sales.median)}</strong>.
                </p>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  With {sales.count} sales, one oceanfront closing moves the median a long way, so read the
                  list, not the middle. A recorded price also does not tell you the condition of the house or
                  whether it was bought to be rebuilt.
                </p>
                <p className="mt-4 text-xs leading-6 text-slate-500">
                  Source: Palm Beach County Property Appraiser parcel records, retrieved {COLONY_CHECKED}.
                  Geography: parcels in the municipality of Jupiter Inlet Colony. Counted: the latest recorded
                  sale of each single-family parcel, where the county marks it a qualified sale by warranty
                  deed. A home that sold twice in the period appears once.
                  {SALES_PERIOD.excludedOtherUse > 0 &&
                    ` Left out: ${SALES_PERIOD.excludedOtherUse} qualified sale${SALES_PERIOD.excludedOtherUse === 1 ? '' : 's'} of a parcel the county now classes as vacant land.`}{' '}
                  These are public records, not MLS data, and recording can lag a closing by weeks.
                </p>
                <a href={INQUIRY} className={`mt-6 ${btnPrimary}`}>Ask for a Colony comp review</a>
              </div>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">
                    Recorded single-family sales in Jupiter Inlet Colony, {SALES_PERIOD.from} to {SALES_PERIOD.to}
                  </caption>
                  <thead className="bg-slate-100 text-xs uppercase tracking-wider text-slate-600">
                    <tr>
                      <th scope="col" className="px-5 py-3 font-semibold">Recorded</th>
                      <th scope="col" className="px-5 py-3 font-semibold">Street</th>
                      <th scope="col" className="px-5 py-3 text-right font-semibold">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sales.rows.map((r, i) => (
                      <tr key={`${r.month}-${r.street}-${i}`}>
                        <td className="px-5 py-3 text-slate-600">{r.month}</td>
                        <th scope="row" className="px-5 py-3 font-medium text-slate-900">{r.street}</th>
                        <td className="px-5 py-3 text-right font-semibold text-slate-900">{r.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="mt-6 max-w-3xl">
              <p className="leading-8 text-slate-600">
                Too few Colony homes have a recorded sale in the past twelve months to describe a price range
                honestly. We will pull the closed sales for the streets you care about and walk you through
                them.
              </p>
              <a href={INQUIRY} className={`mt-6 ${btnPrimary}`}>Ask for a Colony comp review</a>
            </div>
          )}

          {trends && (
            <div className="mt-14 border-t border-slate-200 pt-10">
              <h3 className="font-serif text-2xl font-semibold text-slate-900">Greater Jupiter Market Context</h3>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                This chart is for Jupiter as a whole, not the Colony. The provider does not report the Colony
                separately, and Jupiter’s numbers include condominiums and inland neighborhoods. Use it for the
                direction of the wider market only.{' '}
                <span className="font-semibold text-slate-700"><AbacoaRetrieved /></span>.
              </p>
              <div className="mt-4 min-w-0">
                <MarketTrendsBlock
                  city={trends.city}
                  heading="Jupiter, FL market trends (not Colony-specific)"
                  headingLevel="h3"
                  caption="Live Ylopo market data for Jupiter, FL. Jupiter Inlet Colony is not reported separately."
                  frameClassName="mt-4"
                />
              </div>
              <p className="mt-4 text-sm text-slate-600">
                Nearby, outside the Colony:{' '}
                <a href={GREATER_JUPITER_SEARCH_URL} target="_blank" rel="noopener noreferrer" className={textLink}>
                  browse Jupiter-area listings →
                </a>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Comparable communities */}
      <section className={section} aria-labelledby="colony-compare-heading">
        <div className="mx-auto max-w-7xl">
          <p className={eyebrow}>Compare</p>
          <h2 id="colony-compare-heading" className={h2}>If the Colony is on your list, look at these too</h2>
          <ul className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {COMPARE.map((c) => (
              <li key={c.href} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-report-gold-text">{c.kind}</p>
                <h3 className="mt-2 font-serif text-xl font-semibold text-slate-900">{c.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-7 text-slate-600">{c.why}</p>
                <Link href={c.href} className={`mt-4 text-sm ${textLink}`}>
                  {c.name} guide →
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Inquiry */}
      <section id="colony-inquiry" className={`scroll-mt-24 bg-navy-950 ${section}`} aria-labelledby="colony-inquiry-heading">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_minmax(0,28rem)] lg:items-start">
          <div className="text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-report-gold-light">Colony listings and sales</p>
            <h2 id="colony-inquiry-heading" className="mt-2 font-serif text-3xl font-semibold leading-tight sm:text-4xl">
              Get Colony listings and recent sales by email
            </h2>
            <p className="mt-4 max-w-xl leading-8 text-white/90">
              Tell us which side of town you want: interior, oceanfront, or inlet and Intracoastal. We will
              send the active Colony homes that fit and the recorded sales on those streets, and tell you
              when a new one is listed.
            </p>
            <p className="mt-4 text-sm text-white/85">
              Would you rather talk? Call{' '}
              <a href="tel:+15617837733" className="font-semibold text-white underline underline-offset-4">(561) 783-7733</a>.
            </p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
            <ContactForm
              ctaPlacement="community-inline"
              pageName="Jupiter Inlet Colony"
              idPrefix="colony-inquiry"
              submitLabel={COLONY_LEAD_CTA}
              messagePlaceholder="Interior, oceanfront, or inlet and Intracoastal? Your price range and timing."
            />
          </div>
        </div>
      </section>

      <section className="bg-white" aria-labelledby="colony-sources">
        <div className="mx-auto max-w-4xl px-6 pt-10">
          <h2 id="colony-sources" className="text-sm font-semibold text-slate-700">Sources for this page</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {SOURCES.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-gold-600 underline underline-offset-2 hover:text-gold-700">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <p className="text-xs leading-6 text-slate-500">
            Details on this page were checked on {COLONY_CHECKED} against Town of Jupiter Inlet Colony
            documents and Palm Beach County records. Town rules, assessments, club terms, flood maps and school
            assignments change and are given for information only. Verify anything that matters to your
            decision with the Town, the club, your insurer and the school district. DO Homes Group at Premier
            Brokers International is committed to Equal Housing Opportunity.
          </p>
        </div>
      </section>
    </div>
  )
}
