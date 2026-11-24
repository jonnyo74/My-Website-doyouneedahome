import { publishableFees } from '@/lib/clubFees'
import InquiryLink from './InquiryLink'
import { btnGhostDark, btnPrimary } from './ui'

const money = (n: number) => `$${n.toLocaleString('en-US')}`

/**
 * The membership fee block for any club community. It never contains a typed
 * dollar figure. If lib/clubFees holds a verified, in-date record for the
 * community it shows that record with its dates and source; otherwise (the
 * normal case) it explains why and offers the current schedule on request.
 *
 *   <ClubMembershipCta community="Admirals Cove" slug="admirals-cove" />
 */
export default function ClubMembershipCta({ community, slug }: { community: string; slug: string }) {
  const fees = publishableFees(slug)
  return (
    <aside
      aria-labelledby="club-fees-heading"
      className="rounded-3xl bg-navy-950 p-7 text-white sm:p-10"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-report-gold-light">Current figures, on request</p>
      <h3 id="club-fees-heading" className="mt-2 font-serif text-2xl font-semibold leading-tight sm:text-3xl">
        {`${community} Membership Fees & Annual Dues`}
      </h3>
      <p className="mt-4 max-w-3xl leading-8 text-white/90">
        Membership and ownership costs vary depending on the property, the membership category and the
        club’s current requirements. Initiation fees, annual dues, capital contributions and availability
        all change. Our team can help you obtain current information and understand the total cost of
        ownership before you make a decision.
      </p>

      {fees.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-2xl bg-white/5 p-4">
          <table className="w-full text-left text-sm">
            <caption className="pb-3 text-left text-xs text-white/85">
              Effective {fees[0].effectiveFrom} to {fees[0].effectiveTo}. Source: {fees[0].source}. Verified{' '}
              {fees[0].verifiedOn}. Confirm with the club before relying on any figure.
            </caption>
            <thead className="text-xs uppercase tracking-wider text-white/85">
              <tr>
                <th scope="col" className="py-2 pr-4 font-semibold">Category</th>
                <th scope="col" className="py-2 pr-4 font-semibold">Initiation</th>
                <th scope="col" className="py-2 font-semibold">Annual dues</th>
              </tr>
            </thead>
            <tbody>
              {fees.map((f) => (
                <tr key={f.category} className="border-t border-white/15">
                  <th scope="row" className="py-2 pr-4 font-medium">{f.category}</th>
                  <td className="py-2 pr-4">{f.initiationFee != null ? money(f.initiationFee) : 'Ask the club'}</td>
                  <td className="py-2">{f.annualDues != null ? money(f.annualDues) : 'Ask the club'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
        <InquiryLink type="membership-fees" className={btnPrimary}>
          {`Request Current ${community} Membership Information`}
        </InquiryLink>
        <InquiryLink type="ownership-costs" className={btnGhostDark}>
          Understand the Total Cost of Ownership
        </InquiryLink>
      </div>
      <p className="mt-5 text-xs leading-6 text-white/85">
        We do not print fee figures on this page because they change each club year. We are a real estate
        team, not the club: the club sets and confirms its own fees and decides on every membership.
      </p>
    </aside>
  )
}
