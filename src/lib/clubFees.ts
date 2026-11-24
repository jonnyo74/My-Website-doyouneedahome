// The one place a country club's dollar figures may live.
//
// POLICY (applies to every club community page on the site):
//  * Community pages never hard-code an initiation fee, annual dues, a capital
//    contribution or a minimum. They explain the STRUCTURE and send the reader
//    to the fee-request form.
//  * If a figure is ever published, it is published from a record here, and
//    only while that record is verified and inside its effective dates.
//    `publishableFees()` enforces that: an expired, future-dated or unverified
//    record is never returned, so a stale schedule drops off the page by
//    itself. Nobody has to remember to edit a page when a club reprices.
//  * `status: 'internal'` is for a figure we hold for our own reference (to
//    answer a buyer who asks) but have not confirmed with the club in writing.
//    It is never shown.
//
// To publish a schedule: get it from the club in writing, add one record per
// category with status 'verified', the club's effective and expiry dates, the
// source and today's date as `verifiedOn`. To retire one: do nothing. It
// expires.

export type FeeStatus =
  /** Confirmed in writing by the club for these dates. May be shown. */
  | 'verified'
  /** Held for reference only. Never shown. */
  | 'internal'
  /** Known to be superseded. Never shown. */
  | 'superseded'

export interface ClubFeeRecord {
  /** Community slug, e.g. 'admirals-cove'. */
  community: string
  /** Membership category as the club names it, e.g. 'Golf'. */
  category: string
  initiationFee?: number
  annualDues?: number
  /** Anything charged on top of dues: capital dues, assessments, minimums. */
  additional?: { label: string; amount: number }[]
  /** ISO dates, inclusive. A record with no expiry is never publishable. */
  effectiveFrom: string
  effectiveTo: string
  source: string
  /** ISO date this record was last checked against the source. */
  verifiedOn: string
  status: FeeStatus
}

/**
 * No record is published today. Under the policy above, figures go to buyers
 * who ask, from the club's current sheet, not onto evergreen pages.
 */
export const CLUB_FEES: ClubFeeRecord[] = []

const iso = (d: Date) => d.toISOString().slice(0, 10)

/** Records that may be shown on `today`: verified, started, not expired. */
export function publishableFees(
  community: string,
  today: Date = new Date(),
  records: ClubFeeRecord[] = CLUB_FEES,
): ClubFeeRecord[] {
  const day = iso(today)
  return records.filter(
    (r) =>
      r.community === community &&
      r.status === 'verified' &&
      !!r.effectiveTo &&
      r.effectiveFrom <= day &&
      day <= r.effectiveTo,
  )
}
