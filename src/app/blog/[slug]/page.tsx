import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import {
  getArticleBySlug,
  getArticlePaths,
  marketTrendsCity,
  visibleArticles,
  type ArticleEditorial,
} from '@/lib/articles'
import { WORKSHEET_HEADING, WORKSHEET_HEADING_ID } from '@/lib/carryingCost'
import CarryingCostWorksheet from '@/components/article/CarryingCostWorksheet'
import KeyFactors from '@/components/article/KeyFactors'
import DiscoveryGuide from '@/components/article/DiscoveryGuide'
import ComparisonShortlist from '@/components/article/ComparisonShortlist'
import ComparisonGuide from '@/components/article/ComparisonGuide'
import { ProjectStatusCard, ProjectTimeline, ProjectTracking } from '@/components/article/ProjectStatus'
import ArticleChecklist from '@/components/article/ArticleChecklist'
import { getCommunityBySlug } from '@/lib/communities'
import Prose from '@/components/Prose'
import CitySearchButtons from '@/components/CitySearchButtons'
import MarketTrendsBlock from '@/components/MarketTrendsBlock'
import YlopoResultsWidget from '@/components/YlopoResultsWidget'
import LocalExpertNote from '@/components/LocalExpertNote'
import YlopoInit from '@/components/YlopoInit'
import DeferredContactCta from '@/components/DeferredContactCta'
import LeadMagnetCTA from '@/components/leadMagnet/LeadMagnetCTA'
import EditorialHero from '@/components/article/EditorialHero'
import QuickFit from '@/components/article/QuickFit'
import ArticleToc from '@/components/article/ArticleToc'
import { selectMagnetForArticle } from '@/lib/leadMagnetRouting'
import { articleSections } from '@/lib/headingId'
import { AUTHORS } from '@/lib/authors'
import { SITE_URL } from '@/lib/site'

const SITE = SITE_URL

// Some image paths carry a literal space (the off-convention
// `public/public/<City>/` tree), which is legal on disk but not in a URL that
// goes into OG tags or JSON-LD. next/image encodes its own optimizer URL; these
// absolute URLs have to be encoded here.
const absoluteImage = (path: string) => encodeURI(`${SITE}${path}`)
const PHONE = { display: '(561) 786-3630', href: 'tel:+15617863630' }

type Props = { params: Promise<{ slug: string }> }

// Renders one slice of the article body. When the article defines an
// interactive tool and its target "## " heading falls inside this slice, the
// tool is spliced in directly before that heading; otherwise it's plain Prose.
// The inline magnet CTA splits the body in two, so either half may hold it.
function BodyWithTool({ content, tool }: { content: string; tool?: ArticleEditorial['tool'] }) {
  if (!tool) return <Prose content={content} />
  const lines = content.split('\n')
  const at = lines.findIndex((line) => line.trimEnd() === `## ${tool.beforeSection}`)
  if (at < 0) return <Prose content={content} />
  return (
    <>
      <Prose content={lines.slice(0, at).join('\n')} />
      <CarryingCostWorksheet />
      <Prose content={lines.slice(at).join('\n')} />
    </>
  )
}

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
  const image = a.heroImage ? absoluteImage(a.heroImage) : undefined
  return {
    title: a.metaTitle,
    description: a.metaDescription,
    keywords: [a.primaryKeyword, ...a.secondaryKeywords],
    alternates: { canonical: url },
    // Tells the sitewide sticky bar and exit-intent offer which magnet this
    // page chose, so they can't offer something different from the in-page CTAs.
    other: { 'lead-magnet-selection': selectMagnetForArticle(a) },
    openGraph: {
      title: a.metaTitle,
      description: a.metaDescription,
      url,
      type: 'article',
      publishedTime: a.publishedDate ?? a.updated,
      modifiedTime: a.updated,
      images: image
        ? [{ url: image, width: a.heroImageWidth, height: a.heroImageHeight, alt: a.heroImageAlt ?? a.h1 }]
        : undefined,
    },
    // Without this the card falls back to the sitewide og-image.jpg from the
    // root layout, so every article shares one generic social preview.
    twitter: {
      card: 'summary_large_image',
      title: a.metaTitle,
      description: a.metaDescription,
      images: image ? [{ url: image, alt: a.heroImageAlt ?? a.h1 }] : undefined,
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
  // One contextually chosen magnet for the whole page: Treasure Coast articles
  // get a Treasure Coast offer, relocation articles get the decision guide, and
  // condo-building articles get the due-diligence checklist.
  const magnetSelection = selectMagnetForArticle(article)
  // An article that places its magnet CTA explicitly never also gets the
  // automatic mid-body one.
  const bodyParts = article.editorial?.magnetPlacement ? null : splitBodyForInlineCta(article.body)

  // Editorial layout is opt-in per article, and needs the wide hero's
  // intrinsic size to art-direct it — without that, fall back to the standard hero.
  const editorial =
    article.editorial && article.heroImage && article.heroImageWidth && article.heroImageHeight
      ? {
          ...article.editorial,
          heroImage: {
            src: article.heroImage,
            width: article.heroImageWidth,
            height: article.heroImageHeight,
            alt: article.heroImageAlt ?? article.h1,
            credit: article.heroImageCredit,
          },
        }
      : undefined
  const sections = editorial?.tableOfContents ? articleSections(article.body) : []
  // The worksheet is its own section, so it gets a contents entry directly
  // before the section it's rendered in front of.
  if (editorial?.tool?.kind === 'carrying-cost-worksheet') {
    const at = sections.findIndex((s) => s.label === editorial.tool?.beforeSection)
    if (at >= 0) sections.splice(at, 0, { id: WORKSHEET_HEADING_ID, label: WORKSHEET_HEADING })
  }

  // ---- JSON-LD structured data ----
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.h1,
    description: article.metaDescription,
    datePublished: article.publishedDate ?? article.updated,
    dateModified: article.updated,
    // An ImageObject when the intrinsic size is on record, so the dimensions
    // and alt text travel with the image; the bare URL otherwise.
    image: !article.heroImage
      ? undefined
      : article.heroImageWidth && article.heroImageHeight
        ? {
            '@type': 'ImageObject',
            url: absoluteImage(article.heroImage),
            width: article.heroImageWidth,
            height: article.heroImageHeight,
            caption: article.heroImageAlt ?? article.h1,
          }
        : absoluteImage(article.heroImage),
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    // Match the byline: the named agent where the article has one.
    author: article.author
      ? {
          '@type': 'Person',
          name: AUTHORS[article.author].name,
          url: `${SITE}/team`,
          worksFor: { '@type': 'Organization', name: 'DO Homes Group' },
        }
      : { '@type': 'Organization', name: 'DO Homes Group' },
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
      {editorial ? (
        <>
        <EditorialHero
          editorial={editorial}
          h1={article.h1}
          image={editorial.heroImage}
          breadcrumb={{
            cityName: article.cityName,
            cityHref: community ? `/communities/${community.slug}` : undefined,
          }}
          byline={{
            authorName: article.author ? AUTHORS[article.author].name : undefined,
            updatedIso: article.updated,
            // Noon UTC so the calendar date can't roll back a day in any US zone.
            updatedLabel: new Date(`${article.updated}T12:00:00Z`).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              timeZone: 'UTC',
            }),
          }}
        />
        {/* Marks a hero that stands in for the subject rather than showing it —
            a representative photo, or artwork that is subject to change. */}
        {article.heroImageCaption && (
          <p className="mx-auto max-w-6xl px-6 pt-3 text-xs italic leading-5 text-slate-500 sm:px-8">
            {article.heroImageCaption}
          </p>
        )}
        </>
      ) : article.heroImage ? (
        <>
        <section className="relative h-[52vh] min-h-[380px] overflow-hidden">
          {/* The hero is the LCP element on every article, so it's preloaded
              (Next 16 replaced the deprecated `priority` prop with `preload`)
              and served through the optimizer for responsive AVIF/WebP variants.
              `fill` over the fixed-height section keeps layout stable without
              hardcoding intrinsic dimensions per article. */}
          <Image
            src={article.heroImage}
            alt={article.heroImageAlt ?? article.h1}
            fill
            preload
            sizes="100vw"
            className="object-cover"
            style={article.heroImagePosition ? { objectPosition: article.heroImagePosition } : undefined}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent" />
          {article.heroImageCredit && (
            <span className="absolute bottom-2 right-3 rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-white/80">{article.heroImageCredit}</span>
          )}
          <div className="absolute inset-0 flex flex-col justify-end px-6 pb-10 sm:px-8">
            <div className="mx-auto w-full max-w-3xl">
              <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-xs text-white/80">
                <Link href="/" className="hover:text-white">Home</Link>
                <span aria-hidden="true">/</span>
                <Link href="/blog" className="hover:text-white">Blog</Link>
                <span aria-hidden="true">/</span>
                {community ? (
                  <Link href={`/communities/${community.slug}`} className="text-white/90 hover:text-white">
                    {article.cityName}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-white/90">{article.cityName}</span>
                )}
              </nav>
              <h1 className="font-serif text-3xl font-semibold text-white sm:text-4xl">{article.h1}</h1>
            </div>
          </div>
        </section>
        {article.heroImageCaption && (
          <p className="mx-auto max-w-3xl px-6 pt-4 text-xs italic leading-5 text-slate-500 sm:px-8">
            {article.heroImageCaption}
          </p>
        )}
        </>
      ) : (
        <section className="bg-gradient-to-br from-sky-50 via-blue-50 to-white px-6 py-14 sm:px-8">
          <div className="mx-auto max-w-3xl">
            <h1 className="font-serif text-3xl font-semibold text-slate-900 sm:text-4xl">{article.h1}</h1>
          </div>
        </section>
      )}

      {/* Single Ylopo script initializer — fires once on mount, picks up all widget divs */}
      <YlopoInit city={article.cityName} />
      {/* Keeps the FUB contact card off the opening copy until the reader scrolls. */}
      <DeferredContactCta />

      {/* Comparison articles open with a full-width shortlist, wider than the reading column. */}
      {editorial?.comparison && <ComparisonShortlist comparison={editorial.comparison} />}

      {/* Due-diligence articles lead with the thing a buyer should act on. */}
      {editorial?.checklist && <ArticleChecklist data={editorial.checklist} />}

      {/* Civic projects lead with how mature the project actually is. */}
      {editorial?.civicProject && <ProjectStatusCard status={editorial.civicProject.status} />}

      <div className="mx-auto max-w-3xl px-6 py-12 sm:px-8">
        {editorial?.keyFactors && <KeyFactors data={editorial.keyFactors} />}
        {editorial?.quickFit && <QuickFit data={editorial.quickFit} />}
        {editorial?.guide && <DiscoveryGuide guide={editorial.guide} />}
        {editorial?.comparison && <ComparisonGuide comparison={editorial.comparison} />}

        <div className="relative">
          {sections.length > 0 && <ArticleToc sections={sections} />}

          {/* Body — with an inline report CTA about a third of the way through */}
          {bodyParts ? (
            <>
              <BodyWithTool content={bodyParts[0]} tool={editorial?.tool} />
              <LeadMagnetCTA
                selection={magnetSelection}
                variant="inline"
                pageCategory="blog"
                className="mt-10"
              />
              <BodyWithTool content={bodyParts[1]} tool={editorial?.tool} />
            </>
          ) : (
            <BodyWithTool content={article.body} tool={editorial?.tool} />
          )}
        </div>

        {/* Sourced milestones, then where to watch for the next one. */}
        {editorial?.civicProject && (
          <>
            <ProjectTimeline timeline={editorial.civicProject.timeline} />
            <ProjectTracking tracking={editorial.civicProject.tracking} />
          </>
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

        {/* Report CTA moved out of the reading flow, for articles that ask. */}
        {editorial?.magnetPlacement === 'after-expert-note' && (
          <LeadMagnetCTA selection={magnetSelection} variant="inline" pageCategory="blog" className="mt-10" />
        )}

        {/* Market trends — omitted where Ylopo has no single-family data for the
            city, rather than rendering a heading over an empty box. The block
            drops itself the same way if the widget never loads at runtime. */}
        {trends && (
          <div className="mt-12">
            <MarketTrendsBlock
              city={trends.city}
              heading={`${trends.city} Market Trends`}
              caption={
                trends.substituted
                  ? `Live MLS data for ${trends.city} — the closest market with full single-family coverage. ${article.cityName} is not reported separately.`
                  : 'Live data from the local MLS.'
              }
            />
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

        {/* Listings widget — single-family houses $500k+ for the article's city */}
        <div className="mt-12">
          <h2 className="font-serif text-2xl font-semibold text-slate-900">
            Homes for Sale in {article.cityName}
          </h2>
          <p className="mt-2 text-sm text-slate-500">Single-family homes $500k+, updated daily.</p>
          <div className="mt-5">
            <YlopoResultsWidget
              city={article.cityName}
              minPrice={500000}
              propertyTypes={['house']}
              limit={6}
            />
          </div>
        </div>

        {/* End-of-article lead-magnet CTA — or, on editorial pages that define
            one, a different next step, since the hero and the inline block
            have already made the same offer. */}
        {editorial?.closingStep ? (
          <div className="mt-12 flex flex-col gap-4 border-y border-slate-200 py-7 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-600">
                {editorial.closingStep.eyebrow}
              </p>
              <p className="mt-2 max-w-md leading-7 text-slate-700">{editorial.closingStep.text}</p>
            </div>
            <Link
              href={editorial.closingStep.cta.href}
              className="inline-flex shrink-0 items-center justify-center rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-gold-500 hover:text-gold-600"
            >
              {editorial.closingStep.cta.label}
            </Link>
          </div>
        ) : editorial?.magnetPlacement ? null : (
          <div className="mt-12">
            <LeadMagnetCTA
              selection={magnetSelection}
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
          <p className="text-xs italic leading-relaxed text-slate-500">
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
