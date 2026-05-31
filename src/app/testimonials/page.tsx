import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Client Testimonials | DO Homes Group',
  description:
    'Read client reviews for Christine Dekant and John Oliver at DO Homes Group, Premier Brokers International.',
}

const christinePhotos = [
  '/images/christine.jpg',
  '/images/Christine-rooftop.png',
  '/images/christine-award-2.jpg',
]

const johnPhotos = [
  '/images/Event-81.jpg',
  '/images/john-oliver.jpg.jpg',
  '/images/5.jpg',
  '/images/headshot2018.jpg',
  '/images/john-professional.jpg',
]

const christineReviews = [
  { quote: 'Christine listed and sold my home within 3 days.', author: 'Dave H.', role: 'Seller' },
  { quote: 'A true professional! This is the third time we have worked with her.', author: 'Nancy F.', role: 'Seller' },
  { quote: "She isn't just trying to sell you a house, she is helping find a home.", author: 'Joel A.', role: 'Buyer' },
  { quote: 'Christine kept us updated, was pro-active and always followed through.', author: 'Susan G.', role: 'Seller' },
  { quote: 'She is always available, very knowledgeable and super responsive.', author: 'Kelley H.', role: 'Title Company' },
  { quote: 'Christine is an incredible realtor and was so supportive to my demanding needs.', author: 'Paula S.', role: 'Seller' },
  { quote: 'Christine went above and beyond to accommodate my needs.', author: 'John & Sue', role: 'Buyer' },
  { quote: 'Working with Christine was flawless — she is on top of every situation.', author: 'Louann A.', role: 'Buyer' },
  { quote: 'My family has purchased 5 homes with her and will continue to do so.', author: 'M.K.', role: 'Buyer' },
  { quote: 'Christine will go above and beyond to help you in every way.', author: 'Hamza M.', role: 'Buyer' },
  { quote: 'Christine was truly a blessing. Our situation was not easy.', author: 'Emi M.', role: 'Buyer' },
  { quote: "I couldn't have been more pleased! I received multiple offers.", author: 'Roxanne Q.', role: 'Seller' },
  { quote: 'She negotiated a very fair deal on a short sale.', author: 'Leo & Jeanne', role: 'Buyer' },
  { quote: 'In sales everyone talks about service but Christine provides it.', author: 'Ian M.', role: 'Buyer' },
  { quote: 'Christine was very attentive and responsive to our needs.', author: 'Pat V.', role: 'Seller' },
]

const johnReviews = [
  { quote: 'John went above and beyond would be an understatement.', author: 'Felicia', role: 'Buyer' },
  { quote: 'John is fair, honest & has your best interest.', author: 'Michelle P.', role: 'Seller & Buyer' },
  { quote: "We didn't just buy a condo, we have a new friend.", author: 'William W.', role: 'Buyer' },
  { quote: 'We highly recommend John Oliver as a professional realtor.', author: "Moh'd K.", role: 'Seller & Buyer' },
  { quote: 'I would absolutely recommend John to anyone in the area.', author: 'Shea P.', role: 'Seller' },
  { quote: 'He is a very good professional, he has a lot of patience.', author: 'Ernector C.', role: 'Seller' },
  { quote: 'Thank you John for going above and beyond.', author: 'Cody L.', role: 'Seller & Buyer' },
  { quote: 'Thankfully, we had John Oliver by our side.', author: 'Kara D.', role: 'Buyer' },
  { quote: "I couldn't have asked for a better realtor.", author: 'Leslie G.', role: 'Buyer' },
  { quote: 'John was always on the lookout for my perfect home.', author: 'Amy M.', role: 'Buyer' },
  { quote: 'He went above and beyond to make sure our needs were met.', author: 'Janet B.', role: 'Seller' },
  { quote: 'John helped me find a perfect house with everything I needed.', author: 'Yakov H.', role: 'Buyer' },
  { quote: 'John made the home buying process so easy.', author: 'Kara C.', role: 'Buyer' },
  { quote: "You won't find a more honorable or knowledgeable Realtor.", author: 'Patty R.', role: 'Buyer' },
  { quote: 'John treats your property as if it were his.', author: 'Mikhail V.', role: 'Buyer' },
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
            Hundreds of buyers and sellers across Palm Beach County have trusted Christine and John
            to guide them through one of life's biggest decisions. Here's what they have to say.
          </p>
        </div>
      </section>

      <AgentSection
        name="Christine Dekant"
        title="REALTOR® · RENE · GRI · CLA · CPRES"
        reviews={christineReviews}
        photos={christinePhotos}
        bg="white"
      />
      <AgentSection
        name="John Oliver"
        title="REALTOR® · ABR · RENE · SRS"
        reviews={johnReviews}
        photos={johnPhotos}
        bg="slate"
      />
    </div>
  )
}

function AgentSection({
  name, title, reviews, photos, bg,
}: {
  name: string
  title: string
  reviews: { quote: string; author: string; role: string }[]
  photos: string[]
  bg: 'white' | 'slate'
}) {
  return (
    <section className={`px-6 py-16 sm:px-8 ${bg === 'slate' ? 'bg-slate-50' : 'bg-white'}`}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center gap-5 border-b border-slate-200 pb-6">
          <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-2xl">
            <Image src={photos[0]} alt={name} fill className="object-cover object-top" sizes="56px" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-semibold text-slate-900">{name}</h2>
            <p className="mt-0.5 text-sm font-medium text-gold-600">{title}</p>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {reviews.map((r, i) => {
            const photo = photos[i % photos.length]
            return (
              <div
                key={r.author + r.quote}
                className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-card"
              >
                <div className="flex gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <svg key={j} width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="flex-1 text-sm leading-7 text-slate-600">"{r.quote}"</p>
                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{r.author}</p>
                    <p className="text-xs text-slate-500">{r.role}</p>
                  </div>
                  <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-xl">
                    <Image src={photo} alt={name} fill className="object-cover object-top" sizes="36px" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
