// In-page contents for long articles. Rendered twice on purpose: a collapsed
// <details> in the reading column below 1280px, and a sticky rail in the right
// margin from 1280px up. Only one is ever displayed, so assistive tech sees a
// single navigation landmark at any width.
//
// The rail is absolutely positioned against the column's own `relative`
// wrapper, which keeps the reading column centred exactly where every other
// article has it instead of shifting it left to make room.

interface Section {
  id: string
  label: string
}

function Links({ sections }: { sections: Section[] }) {
  return (
    <ol className="space-y-2.5 text-sm leading-6">
      {sections.map((s) => (
        <li key={s.id}>
          <a href={`#${s.id}`} className="rounded text-slate-600 transition hover:text-gold-600">
            {s.label}
          </a>
        </li>
      ))}
    </ol>
  )
}

export default function ArticleToc({ sections }: { sections: Section[] }) {
  if (sections.length < 3) return null
  return (
    <>
      <details className="group mt-8 rounded-xl border border-slate-200 xl:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl px-5 py-3.5 text-sm font-semibold text-slate-900 marker:hidden">
          In this guide
          <span aria-hidden="true" className="text-slate-400 transition group-open:rotate-180">
            ▾
          </span>
        </summary>
        <nav aria-label="In this guide" className="border-t border-slate-200 px-5 pb-4 pt-3">
          <Links sections={sections} />
        </nav>
      </details>

      <aside className="absolute inset-y-0 left-full ml-10 hidden w-48 xl:block">
        <nav aria-label="In this guide" className="sticky top-28">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">In this guide</p>
          <div className="mt-4 border-l border-slate-200 pl-4">
            <Links sections={sections} />
          </div>
        </nav>
      </aside>
    </>
  )
}
