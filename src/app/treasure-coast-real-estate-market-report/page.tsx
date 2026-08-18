import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { leadMagnets } from '@/lib/leadMagnets'
import LeadMagnetLanding from '@/components/leadMagnet/LeadMagnetLanding'
import TreasureCoastMarketTables from '@/components/leadMagnet/TreasureCoastMarketTables'
import treasureCoastMarket from '@/content/treasure-coast-market.json'

const magnet = leadMagnets['treasure-coast-market-report']

// `published` is derived from the dataStatus in src/content/treasure-coast-market.json.
// If a future month's figures are cleared back to null, this route returns to
// 404-in-production / dev-preview-only rather than shipping placeholders.
export const metadata: Metadata = {
  title: magnet.metaTitle,
  description: magnet.metaDescription,
  alternates: { canonical: magnet.landingPage },
  robots: magnet.published ? undefined : { index: false, follow: false },
  openGraph: {
    title: magnet.title,
    description: magnet.ctaDescription,
    url: magnet.landingPage,
    images: [{ url: magnet.coverImageLarge, width: 960, height: 1242, alt: magnet.coverAlt }],
  },
}

export default function TreasureCoastMarketReportPage() {
  if (!magnet.published && process.env.NODE_ENV === 'production') notFound()

  return (
    <LeadMagnetLanding
      magnet={magnet}
      devPreviewNotice={
        magnet.published
          ? undefined
          : 'DEVELOPMENT PREVIEW — this report has no verified Martin or St. Lucie County data yet. This page returns 404 in production.'
      }
    >
      {magnet.published ? (
        <TreasureCoastMarketTables />
      ) : (
        <section className="px-6 py-16 sm:px-8">
          <div className="mx-auto max-w-3xl rounded-3xl border-2 border-dashed border-red-400 bg-red-50 p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-red-700">
              Development placeholder
            </p>
            <h2 className="mt-2 font-serif text-2xl font-semibold text-slate-900">
              Verified data still required before publishing
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-700">
              Fill every statistic slot in{' '}
              <code className="rounded bg-white px-1.5 py-0.5 text-xs">
                src/content/treasure-coast-market.json
              </code>{' '}
              from a real Martin County / St. Lucie County MLS snapshot, set{' '}
              <code className="rounded bg-white px-1.5 py-0.5 text-xs">dataStatus</code>, generate
              the PDF, and this page publishes itself — including becoming the default offer on
              every Treasure Coast page.
            </p>
            <ol className="mt-6 list-decimal space-y-2 pl-5 text-sm leading-7 text-slate-700">
              {treasureCoastMarket.requiredData.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </div>
        </section>
      )}
    </LeadMagnetLanding>
  )
}
