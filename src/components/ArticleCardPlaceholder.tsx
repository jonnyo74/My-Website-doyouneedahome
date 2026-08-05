/**
 * Stand-in for an article hero while a city still has no photography.
 *
 * Deliberately carries no text: the city name already appears as the section
 * heading, in the type chip and in the article title, so repeating it a fourth
 * time made a row of cards read as unfinished. A soft horizon motif reads as
 * designed instead, and the seed shifts the gradient and wave slightly per
 * article so adjacent cards are not identical.
 */
export default function ArticleCardPlaceholder({ seed }: { seed: string }) {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 360

  const rotate = (h % 24) - 12 // -12deg .. +11deg
  const lift = (h % 14) - 7 // vertical nudge for the horizon line

  return (
    <div
      aria-hidden
      className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-slate-100 via-white to-gold-50"
    >
      <svg
        viewBox="0 0 400 160"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        style={{ transform: `rotate(${rotate * 0.15}deg) scale(1.08)` }}
      >
        <path
          d={`M0 ${104 + lift} Q 100 ${88 + lift} 200 ${102 + lift} T 400 ${96 + lift} V160 H0 Z`}
          className="fill-gold-500/10"
        />
        <path
          d={`M0 ${122 + lift} Q 120 ${110 + lift} 240 ${120 + lift} T 400 ${114 + lift} V160 H0 Z`}
          className="fill-gold-500/15"
        />
      </svg>
    </div>
  )
}
