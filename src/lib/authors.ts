// The two article authors. Read by the Local Expert Note, the editorial hero
// byline, and the BlogPosting JSON-LD, so a name or credential changes once.

export type AuthorId = 'john' | 'christine'

export const AUTHORS: Record<AuthorId, { name: string; title: string; photo: string }> = {
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
