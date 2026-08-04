import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import {
  getArticleBySlug,
  getArticlePaths,
  marketTrendsCity,
  visibleArticles,
} from '@/lib/articles'
import { getCommunityBySlug } from '@/lib/communities'
import Prose from '@/components/Prose'
import CitySearchButtons from '@/components/CitySearchButtons'
import YlopoMarketTrendsWidget from '@/components/YlopoMarketTrendsWidget'
import YlopoResultsWidget from '@/components/YlopoResultsWidget'
import LocalExpertNote from '@/components/LocalExpertNote'
import YlopoInit from '@/components/YlopoInit'
import MarketReportCTA from '@/components/leadMagnet/MarketReportCTA'
import { selectReportForArticle, reportsCoverCity } from '@/lib/marketReports'
import { SITE_URL } from '@/lib/site'

const SITE = SITE_URL
const PHONE = { display: '(561) 786-3630', href: 'tel:+15617863630' }

type Props = { params: Promise<{ slug: string }> }

// Split an article body at the "## " heading nearest ~30% through the content
// (within a 22–45% window) so an inline report CTA can sit between the two
// halves. Short articles (< 500 words) aren't interrupted — returns null.
function splitBodyForInlineCta(body: string): [string, string] | null {
  if (body.split(/\s+/).length < 500) return null
  const lines = body.split('\n')
  const target = lines.length * 0.3
  let bestIndex = -1
  let bestDistance = Infinity
  lines.forEach((line, i) => {
    if (!line.startsWith('## ')) return
    const position = i / lines.length
    if (position < 0.22 || position > 0.45) return
    const distance = Math.abs(i - target)
    if (distance < bestDistance) {
      bestDistance = distance
      bestIndex = i
    }
  })
  if (bestIndex <= 0) return null
  return [lines.slice(0, bestIndex).join('\n'), lines.slice(bestIndex).join('\n')]
}

export function generateStaticParams() {
  return getArticlePaths()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const a = getArticleBySlug(slug)
  if (!a) return { title: 'Article not found' }
  const url = `${SITE}/blog/${a.slug}`
  const image = a.heroImage ? `${SITE}${a.heroImage}` : undefined
  return {
    title: a.metaTitle,
    description: a.metaDescription,
    keywords: [a.primaryKeyword, ...a.secondaryKeywords],
    alternates: { canonical: url },
    openGraph: {
      title: a.metaTitle,
      description: a.metaDescription,
      url,
      type: 'article',
      images: image ? [{ url: image }] : undefined,
    },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) notFound()

  const community = getCommunityBySlug(article.citySlug)
  const related = (article.internalLinks ?? [])
    .map((s) => visibleArticles().find((a) => a.slug === s))
    .filter((a): a is NonNullable<typeof a> => Boolean(a))

  const trends = marketTrendsCity(article.cityName)
  const url = `${SITE}/blog/${article.slug}`
  const reportSelection = selectReportForArticle(article)
  // The reports are Palm Beach County data — don't offer them on Treasure Coast pages.
  const showReportCta = reportsCoverCity(article.citySlug)
  const bodyParts = showReportCta ? splitBodyForInlineCta(article.body) : null

  // ---- JSON-LD structured data ----
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.h1,
    description: article.metaDescription,
    datePublished: article.updated,
    dateModified: article.updated,
    image: article.heroImage ? `${SITE}${article.heroImage}` : undefined,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: { '@type': 'Organization', name: 'DO Homes Group' },
    publisher: { '@type': 'Organization', name: 'DO Homes Group' },
  }
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: article.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}/blog` },
      { '@type': 'ListItem', position: 3, name: article.h1, item: url },
    ],
  }

  return (
    <article className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero */}
      {article.heroImage ? (
        <section className="relative h-[52vh] min-h-[380px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={article.heroImage} alt={article.h1} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          {article.heroImageCredit && (
            <span className="absolute bottom-2 right-3 text-[10px] text-white/40">{article.heroImageCredit}</span>
          )}
          <div className="absolute inset-0 flex flex-col justify-end px-6 pb-10 sm:px-8">
            <div className="mx-auto w-full max-w-3xl">
              <nav className="mb-4 flex items-center gap-2 text-xs text-white/70">
                <Link href="/" className="hover:text-white">Home</Link>
                <span>/</span>
                <Link href="/blog" className="hover:text-white">Blog</Link>
                <span>/</span>
                {community ? (
                  <Link href={`/communities/${community.slug}`} className="text-white/90 hover:text-white">
                    {article.cityName}
                  </Link>
                ) : (
                  <span className="text-white/90">{article.cityName}</span>
                )}
              </nav>
              <h1 className="font-serif text-3xl font-semibold text-white sm:text-4xl">{article.h1}</h1>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-gradient-to-br from-sky-50 via-blue-50 to-white px-6 py-14 sm:px-8">
          <div className="mx-auto max-w-3xl">
            <h1 className="font-serif text-3xl font-semibold text-slate-900 sm:text-4xl">{article.h1}</h1>
          </div>
        </section>
      )}

      {/* Single Ylopo script initializer — fires once on mount, picks up all widget divs */}
      <YlopoInit city={article.cityName} />

      <div className="mx-auto max-w-3xl px-6 py-12 sm:px-8">
        {/* Body — with an inline report CTA about a third of the way through */}
        {bodyParts ? (
          <>
            <Prose content={bodyParts[0]} />
            <MarketReportCTA
              selection={reportSelection}
              variant="inline"
              pageCategory="blog"
              className="mt-10"
            />
            <Prose content={bodyParts[1]} />
          </>
        ) : (
          <Prose content={article.body} />
        )}

        {/* City page link */}
        {community && (
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-600">Community Guide</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Neighborhoods, schools, prices, and lifestyle — all in one place.
              </p>
            </div>
            <Link
              href={`/communities/${community.slug}`}
              className="inline-flex items-center rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-gold-500 hover:text-gold-600"
            >
              Living in {article.cityName} →
            </Link>
          </div>
        )}

        {/* Local expert note */}
        {article.funFact && article.author && (
          <LocalExpertNote author={article.author} funFact={article.funFact} />
        )}

        {/* Market trends — omitted where Ylopo has no single-family data for the
            city, rather than rendering a heading over an empty box. */}
        {trends && (
          <div className="mt-12">
            <h2 className="font-serif text-2xl font-semibold text-slate-900">{trends.city} Market Trends</h2>
            <p className="mt-2 text-sm text-slate-500">
              {trends.substituted
                ? `Live MLS data for ${trends.city} — the closest market with full single-family coverage. ${article.cityName} is not reported separately.`
                : 'Live data from the local MLS.'}
            </p>
            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
              <YlopoMarketTrendsWidget city={trends.city} />
            </div>
          </div>
        )}

        {/* Conversion block — search buttons */}
        {community?.savedSearches?.length ? (
          <div className="mt-12">
            <CitySearchButtons
              eyebrow="Ready to look?"
              heading={`Explore Homes in ${article.cityName}`}
              searches={community.savedSearches}
              phone={PHONE}
            />
          </div>
        ) : (
          <div className="mt-12 rounded-3xl border border-slate-200 bg-gradient-to-br from-sky-50 via-blue-50 to-white p-7 text-center sm:p-9">
            <h2 className="font-serif text-2xl font-semibold text-slate-900">Thinking about {article.cityName}?</h2>
            <p className="mt-3 text-slate-600">We're local experts — let's find the right home for your move.</p>
            <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href="https://search.doyouneedahome.com/search?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[minPrice]=400000" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-full bg-gold-500 px-7 py-3 text-sm font-semibold text-white transition hover:bg-gold-600">Search Homes</a>
              <Link href="/contact" className="inline-flex items-center justify-center rounded-full border border-slate-300 px-7 py-3 text-sm font-semibold text-slate-700 transition hover:border-gold-500 hover:text-gold-600">Talk to a Local Expert</Link>
            </div>
          </div>
        )}

        {/* Listings widget — SFR $500k+ for the article's city */}
        <div className="mt-12">
          <h2 className="font-serif text-2xl font-semibold text-slate-900">
            Homes for Sale in {article.cityName}
          </h2>
          <p className="mt-2 text-sm text-slate-500">Single-family homes $500k+, updated daily.</p>
          <div className="mt-5">
            <YlopoResultsWidget
              city={article.cityName}
              minPrice={500000}
              propertyTypes={['SFR']}
              limit={6}
            />
          </div>
        </div>

        {/* End-of-article report CTA */}
        {showReportCta && (
          <div className="mt-12">
            <MarketReportCTA
              selection={reportSelection}
              variant="end-of-article"
              pageCategory="blog"
            />
          </div>
        )}

        {/* FAQ */}
        {article.faqs.length > 0 && (
          <div className="mt-14">
            <h2 className="font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">Frequently Asked Questions</h2>
            <div className="mt-6 space-y-4">
              {article.faqs.map((f) => (
                <details key={f.q} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
                  <summary className="cursor-pointer list-none font-semibold text-slate-900 marker:hidden">
                    {f.q}
                  </summary>
                  <p className="mt-3 leading-7 text-slate-600">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Internal links */}
        {related.length > 0 && (
          <div className="mt-14 border-t border-slate-100 pt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-600">Keep Reading</p>
            <ul className="mt-4 space-y-2">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={`/blog/${r.slug}`} className="font-medium text-slate-700 transition hover:text-gold-600">
                    {r.h1} →
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Neighborhood-choice note — ranking-style articles */}
        {article.type === 'Best Neighborhoods In' && (
          <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm leading-relaxed text-slate-600">
              Communities below are grouped by objective characteristics — price range, property type,
              waterfront and golf access, HOA structure, lot size, and location. The best community
              depends on your individual goals, budget, lifestyle, and housing preferences. We encourage
              buyers to visit neighborhoods personally and independently verify any information
              important to their home search.
            </p>
          </div>
        )}

        {/* Disclaimer — every article */}
        <div className="mt-12 border-t border-slate-100 pt-6">
          <p className="text-xs italic leading-relaxed text-slate-400">
            This article is provided by DO Homes Group at Premier Brokers International for informational
            purposes only and does not constitute legal, financial, tax, or investment advice. Market
            statistics, pricing, availability, HOA fees, and community details change frequently and may
            have changed since publication. School assignments, boundaries, and ratings may change —
            verify all school information directly with the appropriate school district, and consult
            official public safety resources for any crime data relevant to your search. Verify all
            details independently and consult the appropriate licensed professionals before making any
            real estate decision. DO Homes Group is committed to Equal Housing Opportunity and does not
            discriminate on the basis of race, color, religion, sex, handicap, familial status, or
            national origin.
          </p>
        </div>
      </div>
    </article>
  )
}
