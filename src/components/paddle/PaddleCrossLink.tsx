import Link from 'next/link'

/**
 * The link between the two paddle guides.
 *
 * They are deliberately separate pages — one answers "where can I put a boat in
 * the water" and the other "which neighbourhood should I buy in", which are
 * different searches by different people at different stages. This card is what
 * moves a reader from the first question to the second, so it states the other
 * page's actual value rather than saying "read more".
 */
export default function PaddleCrossLink({ to }: { to: 'launches' | 'communities' }) {
  const target =
    to === 'communities'
      ? {
          href: '/communities-with-kayak-launches',
          heading: 'Which communities have their own launch?',
          body: 'Forty-plus neighbourhoods from Tequesta to North Palm Beach with resident water access, graded by whether the water belongs to every resident or only to the waterfront lot — plus the eighteen that market “waterfront” and deliver a retention pond.',
          cta: 'See communities with water access',
        }
      : {
          href: '/kayak-launches-jupiter-tequesta',
          heading: 'Where can anyone put a boat in?',
          body: 'Every public kayak and paddleboard launch on the Loxahatchee River system, the Jupiter Inlet and the Intracoastal — mapped, rated for skill, with parking, fees and the tide notes that decide whether a morning goes well.',
          cta: 'Open the public launch map',
        }

  return (
    <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-sky-50 to-white p-5 sm:p-6">
      <h2 className="font-serif text-xl font-semibold text-slate-900">{target.heading}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">{target.body}</p>
      <Link
        href={target.href}
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gold-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gold-600"
      >
        {target.cta}
      </Link>
    </div>
  )
}
