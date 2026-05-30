export default function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-600">{title}</p>
      {subtitle ? (
        <p className="max-w-2xl font-serif text-3xl font-semibold text-slate-900 sm:text-4xl">{subtitle}</p>
      ) : null}
    </div>
  )
}
