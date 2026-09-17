'use client'

import { useId, useMemo, useState } from 'react'
import {
  calculateWorksheet,
  formatUsd,
  LOAN_TERMS,
  WORKSHEET_HEADING,
  WORKSHEET_HEADING_ID,
  type FieldKey,
  type WorksheetInputs,
} from '@/lib/carryingCost'

// Educational, client-side only: inputs live in component state and are gone
// on reload. Nothing is submitted, stored, or sent to analytics.

// Structural defaults only. Down payment and term are the shape of a loan, not
// a market figure; rate, price, tax, insurance and fees stay blank because any
// number we pre-filled would read as a claim about Boca.
const DEFAULTS: WorksheetInputs = {
  purchasePrice: '',
  downPaymentPct: '20',
  interestRatePct: '',
  loanTermYears: '30',
  annualPropertyTax: '',
  annualInsurance: '',
  monthlyFlood: '',
  monthlyHoa: '',
  monthlyClub: '',
  monthlyUpkeep: '',
}

type Unit = '$' | '%'
interface FieldDef {
  key: FieldKey
  label: string
  unit: Unit
  hint?: string
}

const GROUPS: Array<{ legend: string; fields: FieldDef[] }> = [
  {
    legend: 'Financing',
    fields: [
      { key: 'purchasePrice', label: 'Purchase price', unit: '$' },
      { key: 'downPaymentPct', label: 'Down payment', unit: '%', hint: '100 for an all-cash purchase' },
      { key: 'interestRatePct', label: 'Interest rate', unit: '%', hint: 'From your lender quote' },
    ],
  },
  {
    legend: 'Taxes and insurance',
    fields: [
      { key: 'annualPropertyTax', label: 'Annual property tax', unit: '$', hint: "At a reset assessment — not the seller's bill" },
      { key: 'annualInsurance', label: 'Annual homeowners insurance', unit: '$', hint: 'An actual quote for this address' },
      { key: 'monthlyFlood', label: 'Monthly flood insurance', unit: '$', hint: 'Leave blank or 0 if not required' },
    ],
  },
  {
    legend: 'Community and running costs',
    fields: [
      { key: 'monthlyHoa', label: 'Monthly HOA', unit: '$' },
      { key: 'monthlyClub', label: 'Monthly club dues', unit: '$', hint: 'Include any food and beverage minimum ÷ 12' },
      { key: 'monthlyUpkeep', label: 'Monthly utilities and maintenance', unit: '$', hint: 'Electric, water, lawn, pest, pool' },
    ],
  },
]

const inputBase =
  'block w-full rounded-lg border bg-white py-2.5 text-base text-slate-900 placeholder:text-slate-400 transition focus:border-gold-500'

export default function CarryingCostWorksheet() {
  const [inputs, setInputs] = useState<WorksheetInputs>(DEFAULTS)
  // Errors only show once a field has been left, so typing "6." doesn't flash
  // an error mid-keystroke.
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({})
  const uid = useId()
  const result = useMemo(() => calculateWorksheet(inputs), [inputs])

  const set = (key: FieldKey, value: string) => setInputs((prev) => ({ ...prev, [key]: value }))
  const id = (key: string) => `${uid}-${key}`
  const headingId = WORKSHEET_HEADING_ID

  return (
    <section aria-labelledby={headingId} className="mt-12 border-y border-slate-200 py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-600">Planning worksheet</p>
      <h2 id={headingId} className="mt-2 scroll-mt-28 font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">
        {WORKSHEET_HEADING}
      </h2>
      <p className="mt-3 leading-7 text-slate-600">
        Enter the figures you have for one specific property. Anything you leave blank is simply left out of the
        total. Nothing you type is saved or sent anywhere.
      </p>

      <form noValidate onSubmit={(e) => e.preventDefault()} className="mt-8 space-y-8">
        {GROUPS.map((group) => (
          <fieldset key={group.legend}>
            <legend className="text-sm font-semibold text-slate-900">{group.legend}</legend>
            <div className="mt-3 grid gap-x-5 gap-y-4 sm:grid-cols-2">
              {group.fields.map((f) => {
                const error = touched[f.key] ? result.errors[f.key] : undefined
                const describedBy = [f.hint && id(`${f.key}-hint`), error && id(`${f.key}-error`)].filter(Boolean).join(' ') || undefined
                return (
                  <div key={f.key}>
                    <label htmlFor={id(f.key)} className="block text-sm font-medium text-slate-700">
                      {f.label}
                    </label>
                    <div className="relative mt-1.5">
                      {f.unit === '$' && (
                        <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500">
                          $
                        </span>
                      )}
                      <input
                        id={id(f.key)}
                        type="text"
                        inputMode="decimal"
                        autoComplete="off"
                        value={inputs[f.key]}
                        onChange={(e) => set(f.key, e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, [f.key]: true }))}
                        aria-invalid={error ? true : undefined}
                        aria-describedby={describedBy}
                        className={`${inputBase} ${f.unit === '$' ? 'pl-7 pr-3' : 'pl-3 pr-8'} ${
                          error ? 'border-red-600' : 'border-slate-300'
                        }`}
                      />
                      {f.unit === '%' && (
                        <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500">
                          %
                        </span>
                      )}
                    </div>
                    {f.hint && (
                      <p id={id(`${f.key}-hint`)} className="mt-1 text-xs leading-5 text-slate-500">
                        {f.hint}
                      </p>
                    )}
                    {error && (
                      <p id={id(`${f.key}-error`)} className="mt-1 text-xs font-medium leading-5 text-red-700">
                        {error}
                      </p>
                    )}
                  </div>
                )
              })}

              {group.legend === 'Financing' && (
                <div>
                  <label htmlFor={id('loanTermYears')} className="block text-sm font-medium text-slate-700">
                    Loan term
                  </label>
                  <select
                    id={id('loanTermYears')}
                    value={inputs.loanTermYears}
                    onChange={(e) => set('loanTermYears', e.target.value)}
                    className={`${inputBase} mt-1.5 border-slate-300 px-3`}
                  >
                    {LOAN_TERMS.map((t) => (
                      <option key={t} value={String(t)}>
                        {t} years
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </fieldset>
        ))}
      </form>

      {/* Results. Only the one-line summary below is a live region — announcing
          the whole table on every keystroke would be noise. */}
      <div className="mt-10 rounded-xl bg-slate-50 p-5 sm:p-6">
        <p className="sr-only" aria-live="polite">
          {result.counted === 0
            ? 'No figures entered yet.'
            : `Estimated monthly total ${formatUsd(result.total)}, ${result.counted} of ${result.lines.length} lines included.`}
        </p>
        <h3 className="font-serif text-xl font-semibold text-slate-900">Your monthly estimate</h3>
        <table className="mt-4 w-full border-collapse text-left text-sm">
          <caption className="sr-only">Estimated monthly carrying cost by line item</caption>
          <thead className="sr-only">
            <tr>
              <th scope="col">Cost</th>
              <th scope="col">Monthly</th>
            </tr>
          </thead>
          <tbody>
            {result.lines.map((line) => (
              <tr key={line.key} className="border-b border-slate-200 align-top">
                <th scope="row" className="py-2.5 pr-4 font-normal">
                  <span className="block text-slate-800">{line.label}</span>
                  <span className="block text-xs text-slate-500">{line.detail}</span>
                </th>
                <td className={`py-2.5 text-right tabular-nums ${line.monthly === null ? 'text-slate-400' : 'font-medium text-slate-900'}`}>
                  {line.monthly === null ? '—' : formatUsd(line.monthly)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" className="pt-4 pr-4 text-base font-semibold text-slate-900">
                Estimated monthly total
                <span className="block text-xs font-normal text-slate-500">
                  {result.counted === 0 ? 'Enter figures above to build a total' : `${result.counted} of ${result.lines.length} lines included`}
                </span>
              </th>
              <td className="pt-4 text-right align-top font-serif text-2xl font-semibold tabular-nums text-slate-900">
                {formatUsd(result.total)}
              </td>
            </tr>
          </tfoot>
        </table>

        <p className="mt-5 text-xs leading-5 text-slate-600">
          <strong className="font-semibold text-slate-700">Planning figures only.</strong> This adds up the numbers
          you entered — it is not a quote, a pre-approval, or financial advice, and it leaves out one-time costs such
          as closing costs, club initiation fees, and capital assessments. Verify the property tax, insurance, flood
          zone, HOA, club obligations, and financing terms for the specific property before you rely on the total.
        </p>
        <button
          type="button"
          onClick={() => {
            setInputs(DEFAULTS)
            setTouched({})
          }}
          className="mt-4 rounded text-sm font-semibold text-gold-600 underline decoration-gold-300 underline-offset-4 transition hover:text-gold-700"
        >
          Clear the worksheet
        </button>
      </div>
    </section>
  )
}
