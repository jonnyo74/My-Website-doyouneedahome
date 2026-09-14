import type { SolarPosition } from '@/lib/sunshade/types'

/**
 * Sky dial: where the sun is, and how high.
 *
 * Read it as a sky dome seen from directly above the property. The compass
 * bearing is the angle around the dial; the sun's ELEVATION is the distance
 * from the centre — dead centre is straight overhead, the rim is the horizon.
 * That is the standard sun-path projection, and it means a Florida June noon
 * (sun almost overhead, tiny shadows) and a December noon (sun well to the
 * south, long shadows) look obviously different at a glance, which a plain
 * arrow would not convey.
 */

const SIZE = 132
const CENTRE = SIZE / 2
const RIM = 52

export default function SunCompass({ sun }: { sun: SolarPosition }) {
  // Clamp below the horizon to the rim so the marker never leaves the dial.
  const elevation = Math.max(0, Math.min(90, sun.elevationDeg))
  const radius = RIM * (1 - elevation / 90)
  const angle = ((sun.azimuthDeg - 90) * Math.PI) / 180
  const sunX = CENTRE + radius * Math.cos(angle)
  const sunY = CENTRE + radius * Math.sin(angle)

  const cardinals = [
    { label: 'N', x: CENTRE, y: 13 },
    { label: 'E', x: SIZE - 11, y: CENTRE + 4 },
    { label: 'S', x: CENTRE, y: SIZE - 6 },
    { label: 'W', x: 11, y: CENTRE + 4 },
  ]

  return (
    <div className="flex items-center gap-4">
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        aria-hidden="true"
        className="shrink-0"
      >
        <circle cx={CENTRE} cy={CENTRE} r={RIM} fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
        <circle cx={CENTRE} cy={CENTRE} r={RIM * 0.5} fill="none" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 4" />
        <line x1={CENTRE} y1={CENTRE - RIM} x2={CENTRE} y2={CENTRE + RIM} stroke="#E2E8F0" strokeWidth="1" />
        <line x1={CENTRE - RIM} y1={CENTRE} x2={CENTRE + RIM} y2={CENTRE} stroke="#E2E8F0" strokeWidth="1" />

        {cardinals.map((c) => (
          <text
            key={c.label}
            x={c.x}
            y={c.y}
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fill="#64748B"
          >
            {c.label}
          </text>
        ))}

        {sun.isDaylight && (
          <>
            <line
              x1={CENTRE}
              y1={CENTRE}
              x2={sunX}
              y2={sunY}
              stroke="#C9A961"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx={sunX} cy={sunY} r="11" fill="#C9A961" opacity="0.25" />
            <circle cx={sunX} cy={sunY} r="6.5" fill="#C9A961" stroke="white" strokeWidth="2" />
          </>
        )}
        <circle cx={CENTRE} cy={CENTRE} r="2.5" fill="#94A3B8" />
      </svg>

      <dl className="min-w-0 space-y-2">
        <div>
          <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Sun direction
          </dt>
          <dd className="text-lg font-semibold text-navy-900">
            {Math.round(sun.azimuthDeg)}° {sun.compass}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Sun elevation
          </dt>
          <dd className="text-lg font-semibold text-navy-900">
            {sun.isDaylight ? `${Math.round(sun.elevationDeg)}°` : 'Below horizon'}
          </dd>
        </div>
      </dl>
    </div>
  )
}
