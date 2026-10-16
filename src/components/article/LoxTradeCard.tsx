import { TRADE_HEADING, TRADE_HEADING_ID, TRADE_INTRO, TRADE_PAIRS } from '@/lib/loxTrade'

export { TRADE_HEADING, TRADE_HEADING_ID }

// A static, scannable "what you get / what you trade" ledger. No state, no inputs.
export default function LoxTradeCard() {
  return (
    <section aria-labelledby={TRADE_HEADING_ID} className="mt-12 rounded-3xl border border-lime-900/20 bg-[#f4efdf] p-6 sm:p-9">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-lime-900">The Loxahatchee exchange</p>
      <h2 id={TRADE_HEADING_ID} className="mt-2 scroll-mt-28 font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">
        {TRADE_HEADING}
      </h2>
      <p className="mt-3 leading-7 text-slate-700">{TRADE_INTRO}</p>

      <ol className="mt-6 space-y-4">
        {TRADE_PAIRS.map((p, i) => (
          <li key={p.gives} className="overflow-hidden rounded-2xl border border-lime-900/20 bg-white">
            <div className="grid md:grid-cols-2">
              <div className="p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-900">
                  <span aria-hidden="true">{i + 1} · </span>What Loxahatchee gives you
                </p>
                <p className="mt-2 font-serif text-lg font-semibold leading-snug text-slate-900">{p.gives}</p>
              </div>
              <div className="border-t border-lime-900/15 bg-[#faf7ee] p-5 sm:p-6 md:border-l md:border-t-0">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-800">What it asks from you</p>
                <p className="mt-2 font-serif text-lg font-semibold leading-snug text-slate-900">{p.asks}</p>
              </div>
            </div>
            <p className="border-t border-lime-900/15 px-5 py-3 text-sm leading-6 text-slate-600 sm:px-6">{p.note}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
