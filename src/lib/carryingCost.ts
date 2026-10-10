// Monthly ownership-cost arithmetic for the carrying-cost worksheet on the
// cost-of-living articles. Pure and dependency-free so it can be tested on its
// own. Every figure is supplied by the reader — nothing here holds a rate,
// premium, tax or fee of its own, and nothing is stored or sent anywhere.

export const WORKSHEET_HEADING = 'Estimate your monthly Boca carrying cost'
/** Matches headingId(WORKSHEET_HEADING), so the table of contents can link to it. */
export const WORKSHEET_HEADING_ID = 'estimate-your-monthly-boca-carrying-cost'

/** The North Palm Beach variant uses the extended fields with waterfront-oriented hints. */
export const NPB_WORKSHEET_HEADING = 'Estimate your monthly North Palm Beach ownership cost'
export const NPB_WORKSHEET_HEADING_ID = 'estimate-your-monthly-north-palm-beach-ownership-cost'

/** The Wellington variant adds assessments, transportation and other recurring costs. */
export const WELLINGTON_WORKSHEET_HEADING = 'Estimate your monthly Wellington ownership cost'
export const WELLINGTON_WORKSHEET_HEADING_ID = 'estimate-your-monthly-wellington-ownership-cost'

export type FieldKey =
  | 'purchasePrice'
  | 'downPaymentPct'
  | 'interestRatePct'
  | 'loanTermYears'
  | 'annualPropertyTax'
  | 'annualInsurance'
  | 'monthlyFlood'
  | 'monthlyHoa'
  | 'monthlyClub'
  | 'monthlyUpkeep'
  | ExtendedFieldKey

/** Only present in the extended (Wellington) worksheet. */
export type ExtendedFieldKey = 'annualAssessments' | 'monthlyTransport' | 'monthlyOther'

/** Raw text as typed. Blank means "not entered", never zero. The extended keys are optional. */
export type WorksheetInputs = Record<Exclude<FieldKey, ExtendedFieldKey>, string> &
  Partial<Record<ExtendedFieldKey, string>>

export const LOAN_TERMS = [30, 20, 15, 10] as const

// Upper bounds exist only to catch typos (an extra zero, a price pasted into
// the rate box), not to judge what is realistic.
const LIMITS: Record<FieldKey, { min: number; max: number; label: string }> = {
  purchasePrice: { min: 1, max: 100_000_000, label: 'Purchase price' },
  downPaymentPct: { min: 0, max: 100, label: 'Down payment' },
  interestRatePct: { min: 0, max: 25, label: 'Interest rate' },
  loanTermYears: { min: 1, max: 50, label: 'Loan term' },
  annualPropertyTax: { min: 0, max: 5_000_000, label: 'Annual property tax' },
  annualInsurance: { min: 0, max: 5_000_000, label: 'Annual homeowners insurance' },
  monthlyFlood: { min: 0, max: 500_000, label: 'Monthly flood insurance' },
  monthlyHoa: { min: 0, max: 500_000, label: 'Monthly HOA' },
  monthlyClub: { min: 0, max: 500_000, label: 'Monthly club dues' },
  monthlyUpkeep: { min: 0, max: 500_000, label: 'Monthly utilities and maintenance' },
  annualAssessments: { min: 0, max: 5_000_000, label: 'Annual non-ad valorem assessments' },
  monthlyTransport: { min: 0, max: 500_000, label: 'Monthly transportation' },
  monthlyOther: { min: 0, max: 500_000, label: 'Other monthly recurring costs' },
}

/**
 * Parses what a person actually types into a money or percent box:
 * "$1,250,000", "6.75%", " 20 ". Returns null for blank, NaN for anything
 * that isn't a number, so the two can be told apart.
 */
export function parseAmount(raw: string): number | null {
  const cleaned = raw.replace(/[\s$,%]/g, '')
  if (cleaned === '') return null
  // Reject partial numbers like "1.2.3" or "12abc" that parseFloat would accept.
  if (!/^-?(\d+\.?\d*|\.\d+)$/.test(cleaned)) return Number.NaN
  return Number(cleaned)
}

/** An error message for one field, or null when it is blank or valid. */
export function validateField(key: FieldKey, raw: string | undefined): string | null {
  const value = parseAmount(raw ?? '')
  if (value === null) return null
  const { min, max, label } = LIMITS[key]
  if (Number.isNaN(value)) return `${label} must be a number.`
  if (value < min) return min === 0 ? `${label} can't be negative.` : `${label} must be more than zero.`
  if (value > max) return `${label} looks too large — check for an extra digit.`
  return null
}

/**
 * Standard fixed-rate amortization: M = L·r / (1 − (1 + r)^−n), with r the
 * monthly rate and n the number of payments. A 0% rate divides evenly.
 */
export function monthlyPrincipalAndInterest(loan: number, annualRatePct: number, years: number): number {
  const n = years * 12
  if (loan <= 0 || n <= 0) return 0
  const r = annualRatePct / 100 / 12
  if (r === 0) return loan / n
  return (loan * r) / (1 - Math.pow(1 + r, -n))
}

export interface WorksheetLine {
  key:
    | 'principalInterest'
    | 'propertyTax'
    | 'insurance'
    | 'flood'
    | 'hoa'
    | 'club'
    | 'upkeep'
    | 'assessments'
    | 'transport'
    | 'other'
  /** True for the lines that make up the cost of the home itself, as opposed to additional costs. */
  housing: boolean
  label: string
  /** null when the reader hasn't supplied what this line needs. */
  monthly: number | null
  /** Short explanation of how the line was derived, or what's missing. */
  detail: string
}

export interface WorksheetResult {
  lines: WorksheetLine[]
  /** Sum of the lines that could be calculated. */
  total: number
  /** Sum of the housing lines only (everything except transportation and other costs). */
  housingTotal: number
  /** How many lines are included in the total. */
  counted: number
  loanAmount: number | null
  errors: Partial<Record<FieldKey, string>>
}

const usd = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

export function calculateWorksheet(inputs: WorksheetInputs): WorksheetResult {
  const errors: Partial<Record<FieldKey, string>> = {}
  const value = (key: FieldKey): number | null => {
    const error = validateField(key, inputs[key])
    if (error) {
      errors[key] = error
      return null
    }
    return parseAmount(inputs[key] ?? '')
  }
  // The extended lines appear only when the worksheet supplies those inputs, so the
  // original worksheet's results are unchanged.
  const extended = inputs.annualAssessments !== undefined

  const price = value('purchasePrice')
  const downPct = value('downPaymentPct')
  const rate = value('interestRatePct')
  const term = value('loanTermYears')

  let loanAmount: number | null = null
  let principalInterest: WorksheetLine
  if (price !== null && downPct !== null && rate !== null && term !== null) {
    loanAmount = price * (1 - downPct / 100)
    principalInterest = {
      key: 'principalInterest',
      housing: true,
      label: 'Mortgage principal and interest',
      monthly: monthlyPrincipalAndInterest(loanAmount, rate, term),
      detail: `${usd(loanAmount)} loan at ${rate}% over ${term} years`,
    }
  } else {
    // "valid" when something was typed but rejected, so the line doesn't claim
    // a field is empty while the reader is looking at text in it.
    const need = (key: FieldKey, name: string, v: number | null) =>
      v === null && (errors[key] ? `a valid ${name}` : name)
    const missing = [
      need('purchasePrice', 'price', price),
      need('downPaymentPct', 'down payment', downPct),
      need('interestRatePct', 'interest rate', rate),
      need('loanTermYears', 'loan term', term),
    ].filter(Boolean)
    principalInterest = {
      key: 'principalInterest',
      housing: true,
      label: 'Mortgage principal and interest',
      monthly: null,
      detail: `Needs ${missing.join(', ')}`,
    }
  }

  const annualTax = value('annualPropertyTax')
  const annualInsurance = value('annualInsurance')
  const monthly = (key: FieldKey) => value(key)

  const line = (
    key: WorksheetLine['key'],
    label: string,
    housing: boolean,
    monthlyValue: number | null,
    detail: string,
  ): WorksheetLine => ({ key, housing, label, monthly: monthlyValue, detail })

  const assessmentsAnnual = extended ? value('annualAssessments') : null
  const lines: WorksheetLine[] = [
    principalInterest,
    line('propertyTax', 'Property tax', true, annualTax === null ? null : annualTax / 12, annualTax === null ? 'Not entered' : `${usd(annualTax)} a year ÷ 12`),
    line('insurance', 'Homeowners insurance', true, annualInsurance === null ? null : annualInsurance / 12, annualInsurance === null ? 'Not entered' : `${usd(annualInsurance)} a year ÷ 12`),
    line('flood', 'Flood insurance', true, monthly('monthlyFlood'), 'Monthly, as entered'),
    line('hoa', 'HOA dues', true, monthly('monthlyHoa'), 'Monthly, as entered'),
    ...(extended
      ? [
          line(
            'assessments',
            'Non-ad valorem assessments',
            true,
            assessmentsAnnual === null ? null : assessmentsAnnual / 12,
            assessmentsAnnual === null ? 'Not entered' : `${usd(assessmentsAnnual)} a year ÷ 12`,
          ),
        ]
      : []),
    line('club', 'Club dues', true, monthly('monthlyClub'), 'Monthly, as entered'),
    line('upkeep', 'Utilities and maintenance', true, monthly('monthlyUpkeep'), 'Monthly, as entered'),
    ...(extended
      ? [
          line('transport', 'Transportation', false, monthly('monthlyTransport'), 'Monthly, as entered'),
          line('other', 'Other recurring costs', false, monthly('monthlyOther'), 'Monthly, as entered'),
        ]
      : []),
  ]
  for (const l of lines) {
    if (l.monthly === null && l.detail === 'Monthly, as entered') l.detail = 'Not entered'
  }

  const counted = lines.filter((l) => l.monthly !== null)
  return {
    lines,
    total: counted.reduce((sum, l) => sum + (l.monthly ?? 0), 0),
    housingTotal: counted.filter((l) => l.housing).reduce((sum, l) => sum + (l.monthly ?? 0), 0),
    counted: counted.length,
    loanAmount,
    errors,
  }
}

export const formatUsd = usd
