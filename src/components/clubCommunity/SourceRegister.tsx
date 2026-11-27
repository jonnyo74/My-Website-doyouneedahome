export interface SourceGroup {
  group: string
  items: { label: string; url: string; used: string }[]
}

/** The visible research register: each source, and what it was used for. */
export default function SourceRegister({
  groups,
  notVerified,
  reviewed,
  recordsDate,
}: {
  groups: SourceGroup[]
  /** What was looked for and could not be confirmed from a primary source. */
  notVerified: string[]
  reviewed: string
  recordsDate: string
}) {
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <div>
        {groups.map((g) => (
          <div key={g.group} className="mb-7">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-700">{g.group}</h3>
            <ul className="mt-3 space-y-2.5 text-sm leading-6">
              {g.items.map((s) => (
                <li key={s.label}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="font-medium text-gold-600 underline underline-offset-2 hover:text-gold-700">
                    {s.label}
                  </a>
                  <span className="text-slate-600">. {s.used}.</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-700">Last reviewed</h3>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            Club, association, Town and federal sources: <strong>{reviewed}</strong>.
            <br />
            County parcel records: <strong>{recordsDate}</strong>.
          </p>
          <p className="mt-3 text-xs leading-6 text-slate-600">
            A date changes only when that material has been read again. Brokerage pages, ours included, are not
            used as evidence for any fact here.
          </p>
        </div>
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-700">What we could not verify</h3>
          <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-700">
            {notVerified.map((n) => (
              <li key={n} className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-400" aria-hidden="true" />
                {n}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
