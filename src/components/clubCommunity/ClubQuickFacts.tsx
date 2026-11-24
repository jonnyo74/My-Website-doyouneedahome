import ScrollTable from './ScrollTable'
import { td, th } from './ui'

export interface QuickFact {
  label: string
  value: string
  source: string
  url?: string
}

/** A sourced quick-facts table: every row names where the fact came from. */
export default function ClubQuickFacts({ facts, caption }: { facts: QuickFact[]; caption: string }) {
  return (
    <ScrollTable label={caption}>
      <table className="w-full min-w-[36rem]">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-slate-100">
          <tr>
            <th scope="col" className={th}>Fact</th>
            <th scope="col" className={th}>Detail</th>
            <th scope="col" className={th}>Source</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {facts.map((f) => (
            <tr key={f.label}>
              <th scope="row" className={`${td} w-44 text-left font-semibold text-slate-900`}>{f.label}</th>
              <td className={td}>{f.value}</td>
              <td className={`${td} w-52 text-xs text-slate-600`}>
                {f.url ? (
                  <a href={f.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-slate-900">
                    {f.source}
                  </a>
                ) : (
                  f.source
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollTable>
  )
}
