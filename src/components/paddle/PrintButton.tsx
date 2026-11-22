'use client'

/** Opens the browser's print dialog, which is also where "Save as PDF" lives. */
export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center rounded-xl bg-gold-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gold-700"
    >
      Print or save as PDF
    </button>
  )
}
