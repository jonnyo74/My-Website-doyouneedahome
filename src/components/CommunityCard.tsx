import Link from 'next/link'
import type { CommunityItem } from '@/lib/communities'

export default function CommunityCard({ community }: { community: CommunityItem }) {
  return (
    <Link
      href={`/communities/${community.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card transition hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-card-hover"
    >
      {/* Photo thumbnail */}
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
        {community.photos?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={community.photos[0]}
            alt={community.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-sky-100 via-blue-50 to-slate-100" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <span className="absolute bottom-3 left-4 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          {community.region}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-600">{community.type}</p>
        <h2 className="mt-2 text-xl font-semibold text-slate-900 transition group-hover:text-gold-600">
          {community.name}
        </h2>
        <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{community.description}</p>
        <span className="mt-5 inline-flex text-sm font-semibold text-gold-600 transition group-hover:text-gold-700">
          Explore {community.name} →
        </span>
      </div>
    </Link>
  )
}
