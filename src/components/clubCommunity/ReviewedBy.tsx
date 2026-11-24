import Image from 'next/image'
import Link from 'next/link'
import { agents } from '@/lib/agents'

/**
 * Who stands behind a community guide. Names, designations and license
 * numbers come from lib/agents, the same record the team page uses. It makes
 * no claim about club membership or past sales in the community.
 */
export default function ReviewedBy({ community, reviewed }: { community: string; reviewed: string }) {
  return (
    <div>
      <p className="max-w-3xl leading-8 text-slate-600">
        This guide to {community} was researched and is kept by John Oliver and Christine Dekant of DO Homes
        Group, licensed Florida real estate agents with Premier Brokers International. We work as buyer’s and
        seller’s agents across northern Palm Beach County. We are not affiliated with the club or the
        associations, and nothing here speaks for them. Last reviewed {reviewed}.
      </p>
      <ul className="mt-8 grid gap-5 md:grid-cols-2">
        {agents.map((a) => (
          <li key={a.slug} className="flex items-center gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-full bg-slate-100">
              <Image src={a.photo} alt={a.name} fill sizes="80px" className={`object-cover ${a.photoPosition}`} />
            </div>
            <div className="min-w-0">
              <p className="font-serif text-xl font-semibold text-slate-900">{a.name}</p>
              <p className="text-sm text-slate-600">
                {a.title} · {a.credentials.join(' · ')}
              </p>
              <p className="mt-1 text-xs text-slate-500">Florida license #{a.license}</p>
              <p className="mt-2 text-sm">
                <a href={a.phoneHref} className="font-semibold text-slate-900 hover:underline">{a.phone}</a>
                <span className="text-slate-400"> · </span>
                <Link href="/team" className="font-semibold text-gold-600 hover:underline">Profile</Link>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
