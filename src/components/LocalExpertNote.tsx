interface Props {
  author: 'john' | 'christine'
  funFact: string
}

const AUTHORS = {
  john: {
    name: 'John Oliver',
    title: 'REALTOR® · ABR · RENE · RSPS · SRS',
    photo: '/images/john-professional.jpg',
  },
  christine: {
    name: 'Christine Dekant',
    title: 'REALTOR® · RENE · GRI · CLA · CPRES · REDM · C2EX',
    photo: '/images/christine.jpg',
  },
}

export default function LocalExpertNote({ author, funFact }: Props) {
  const person = AUTHORS[author]

  return (
    <aside className="my-10 flex gap-4 rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 via-blue-50 to-white p-5 sm:p-6">
      {/* Headshot */}
      <div className="shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={person.photo}
          alt={person.name}
          className="h-14 w-14 rounded-full object-cover object-top ring-2 ring-sky-200 sm:h-16 sm:w-16"
        />
      </div>

      {/* Content */}
      <div className="min-w-0">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-sky-600">
          Local Expert Note
        </p>
        <p className="text-sm leading-relaxed text-slate-700">{funFact}</p>
        <p className="mt-2 text-xs font-medium text-slate-500">
          — {person.name}, {person.title}
        </p>
      </div>
    </aside>
  )
}
