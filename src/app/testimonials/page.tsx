import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Client Testimonials | DO Homes Group',
  description:
    'Read client reviews for Christine Dekant and John Oliver at DO Homes Group, Premier Brokers International.',
}

const christineReviews = [
  { quote: 'Christine listed and sold my home within 3 days.', author: 'Dave Hetzel', role: 'Seller' },
  { quote: 'A true professional! This is the third time we have worked with her.', author: 'Nancy Fletcher', role: 'Seller' },
  { quote: "She isn't just trying to sell you a house, she is helping find a home.", author: 'Joel Antoine', role: 'Buyer' },
  { quote: 'Christine kept us updated, was pro-active and always followed through.', author: 'Susan Greco', role: 'Seller' },
  { quote: 'She is always available, very knowledgeable and super responsive.', author: 'Kelley Herrmann', role: 'Title Company' },
  { quote: 'Christine is an incredible realtor and was so supportive to my demanding needs.', author: 'Paula Szabo', role: 'Seller' },
  { quote: 'Christine went above and beyond to accommodate my needs.', author: 'John and Sue', role: 'Buyer' },
  { quote: 'Working with Christine was flawless — she is on top of every situation.', author: 'Louann Agrusa', role: 'Buyer' },
  { quote: 'My family has purchased 5 homes with her and will continue to do so.', author: 'MK', role: 'Buyer' },
  { quote: 'Christine will go above and beyond to help you in every way.', author: 'Hamza Majeed', role: 'Buyer' },
  { quote: 'Christine was truly a blessing. Our situation was not easy.', author: 'Emi Majeed', role: 'Buyer' },
  { quote: "I couldn't have been more pleased! I received multiple offers.", author: 'Roxanne Quiles', role: 'Seller' },
  { quote: 'She negotiated a very fair deal on a short sale.', author: 'Leo and Jeanne', role: 'Buyer' },
  { quote: 'In sales everyone talks about service but Christine provides it.', author: 'Ian Moyer', role: 'Buyer' },
  { quote: 'Christine was very attentive and responsive to our needs.', author: 'Pat Vetillo', role: 'Seller' },
]

const johnReviews = [
  { quote: 'John went above and beyond would be an understatement.', author: 'Felicia', role: 'Buyer' },
  { quote: 'John is fair, honest & has your best interest.', author: 'Michelle Probert', role: 'Seller & Buyer' },
  { quote: "We didn't just buy a condo, we have a new friend.", author: 'William Woody', role: 'Buyer' },
  { quote: 'We highly recommend John Oliver as a professional realtor.', author: "Moh'd Khourma", role: 'Seller & Buyer' },
  { quote: 'I would absolutely recommend John to anyone in the area.', author: 'Shea Peterson', role: 'Seller' },
  { quote: 'He is a very good professional, he has a lot of patience.', author: 'Ernector Claussell', role: 'Seller' },
  { quote: 'Thank you John for going above and beyond.', author: 'Cody Learn', role: 'Seller & Buyer' },
  { quote: 'Thankfully, we had John Oliver by our side.', author: 'Kara Dery', role: 'Buyer' },
  { quote: "I couldn't have asked for a better realtor.", author: 'Leslie Guzman', role: 'Buyer' },
  { quote: 'John was always on the lookout for my perfect home.', author: 'Amy Morse', role: 'Buyer' },
  { quote: 'He went above and beyond to make sure our needs were met.', author: 'Janet Bostick', role: 'Seller' },
  { quote: 'John helped me find a perfect house with everything I needed.', author: 'Yakov Hadash', role: 'Buyer' },
  { quote: 'John made the home buying process so easy.', author: 'Kara Cowser', role: 'Buyer' },
  { quote: "You won't find a more honorable or knowledgeable Realtor.", author: 'Patty Ray', role: 'Buyer' },
  { quote: 'John treats your property as if it were his.', author: 'Mikhail Vinogradov', role: 'Buyer' },
]

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-sky-50 via-blue-50 to-white px-6 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-600">Reviews</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold text-slate-900 sm:text-5xl">
            What Our Clients Say
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Hundreds of buyers and sellers across Palm Beach County have trusted DO Homes Group to
            guide them through one of life's biggest decisions. Here's what they have to say.
          </p>
        </div>
      </section>

      <AgentSection name="Christine Dekant" title="REALTOR® · RENE · GRI · CLA · CPRES" reviews={christineReviews} bg="white" />
      <AgentSection name="John Oliver" title="REALTOR® · ABR · RENE · SRS" reviews={johnReviews} bg="slate" />
    </div>
  )
}

function AgentSection({
  name,
  title,
  reviews,
  bg,
}: {
  name: string
  title: string
  reviews: { quote: string; author: string; role: string }[]
  bg: 'white' | 'slate'
}) {
  return (
    <section className={`px-6 py-16 sm:px-8 ${bg === 'slate' ? 'bg-slate-50' : 'bg-white'}`}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 border-b border-slate-200 pb-6">
          <h2 className="font-serif text-2xl font-semibold text-slate-900">{name}</h2>
          <p className="mt-1 text-sm font-medium text-gold-600">{title}</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {reviews.map((r) => (
            <div
              key={r.author + r.quote}
              className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-card"
            >
              <div className="flex gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <p className="flex-1 text-sm leading-7 text-slate-600">"{r.quote}"</p>
              <div className="border-t border-slate-100 pt-4">
                <p className="text-sm font-semibold text-slate-900">{r.author}</p>
                <p className="text-xs text-slate-500">{r.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
