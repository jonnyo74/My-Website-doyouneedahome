import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Client Testimonials | DO Homes Group',
  description:
    'Read client reviews for Christine Dekant and John Oliver at DO Homes Group, Premier Brokers International.',
  alternates: { canonical: '/testimonials' },
}

const christinePhotos = [
  '/images/christine.jpg',
  '/images/christine-award-2.jpg',
  '/images/Christine-rooftop.png',
]

const johnPhotos = [
  '/images/john.jpg',
  '/images/john-professional.jpg',
  '/images/headshot2018.jpg',
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
  { quote: 'Christine is one of the best in the area. She is professional and knows more than 99% of the other agents out there. Would highly recommend!', author: 'John Oliver', role: 'Industry Peer' },
  { quote: 'In my search for a property in Palm Beach County, I was very fortunate to connect with Christine Dekant. She is the most knowledgeable and professional agent I have ever worked with.', author: 'John Duque', role: 'Buyer' },
  { quote: 'Christine is an excellent real estate agent. I can\'t say enough good things about her. She was always ready to help us with answers to our questions, always gave us good advice. I highly recommend her to anyone that wants to buy or sell.', author: 'Maria Carlos', role: 'Buyer' },
  { quote: 'Christine worked very hard to find the perfect home for me. She helped me navigate the buying process. I am so happy with my selection and plan to live here a very long time. I will refer Christine to all my friends and relatives for all their real estate needs.', author: 'Margaret Harris', role: 'Buyer' },
  { quote: 'Christine works very hard to help in selling and buying a home. She goes out of her way to make it an easy process. Couldn\'t have gotten through it without her help.', author: 'Christine Rascoll', role: 'Buyer & Seller' },
]

const johnReviews = [
  { quote: 'Purchasing a home in South Palm Beach while living in New Jersey could have been overwhelming, but John made the entire process remarkably smooth and stress-free. If you\'re looking for a realtor who is honest, knowledgeable, dependable, and genuinely cares about his clients, we recommend John Oliver without hesitation.', author: 'Nancy M.', role: 'Out-of-State Buyer' },
  { quote: 'John went above and beyond would be an understatement.', author: 'Felicia', role: 'Buyer' },
  { quote: 'John is fair, honest & has your best interest.', author: 'Michelle P.', role: 'Seller & Buyer' },
  { quote: "We didn't just buy a condo, we have a new friend.", author: 'William W.', role: 'Buyer' },
  { quote: 'We highly recommend John Oliver as a professional realtor.', author: "Moh'd K.", role: 'Seller & Buyer' },
  { quote: 'John helped us through a difficult time selling my father\'s house after he passed away. He was professional, compassionate, and got it done.', author: 'Shea P.', role: 'Seller' },
  { quote: 'He is a very good professional, he has a lot of patience dealing with this property sale. I strongly recommend his business.', author: 'Ernector C.', role: 'Seller' },
  { quote: 'John has helped me through both the buying and selling processes of my home. He treats you like a friend and handles everything with total professionalism.', author: 'Cody L.', role: 'Seller & Buyer' },
  { quote: 'As first-time home buyers, my husband and I were understandably nervous about navigating the complex world of real estate. John made us feel at ease every step of the way.', author: 'Kara D.', role: 'Buyer' },
  { quote: "I couldn't have asked for a better realtor. John and his team are great! This was my first time buying a house and the process was seamless.", author: 'Leslie G.', role: 'Buyer' },
  { quote: 'John was always on the lookout for my perfect home. He spent countless days going with me from one place to another until we found the right one.', author: 'Amy M.', role: 'Buyer' },
  { quote: 'He went above and beyond to make sure our needs were met.', author: 'Janet B.', role: 'Seller' },
  { quote: 'John helped me find a perfect house with everything I needed.', author: 'Yakov H.', role: 'Buyer' },
  { quote: 'John made the home buying process so easy.', author: 'Kara C.', role: 'Buyer' },
  { quote: "You won't find a more honorable or knowledgeable Realtor. John has helped me purchase 2 properties and both times found the right property at the right price.", author: 'Patty R.', role: 'Buyer' },
  { quote: "John treats your property as if it were his and genuinely wants to help. It is such a rarity in this business. I am truly grateful to have found him.", author: 'Mikhail V.', role: 'Buyer' },
  { quote: 'Recently worked with John Oliver on one of his listings. Being real estate media creators, we were impressed by his professionalism and the way he goes above and beyond for his clients.', author: 'Jatin Shah', role: 'Industry Partner' },
  { quote: 'Worked 2 deals for me and John was exceptional.', author: 'Dawn F.', role: 'Buyer & Seller' },
  { quote: 'It was a dynamic time in the market in terms of home value, interest rates, and buyer/seller demand. John helped us navigate every challenge with expertise and patience.', author: 'Michael F.', role: 'Buyer' },
  { quote: 'Great experience and very professional.', author: 'Dorca R.', role: 'Buyer' },
  { quote: 'I had no doubt after meeting John that he was trustworthy. Great experience working with him and his team.', author: 'Austin J.', role: 'Buyer' },
  { quote: 'Professional, Personable, Patient, and Passionate are the highlights of John Oliver. Having worked with him, I have been a raving fan ever since.', author: 'JDS', role: 'Buyer' },
  { quote: 'John Oliver is such an amazing Realtor! He is caring, very hard working, responds quickly, and is up to date with today\'s market. I highly recommend him!', author: 'Vickie H.', role: 'Buyer' },
  { quote: 'If you are looking for a realtor that is going to work day and night to find your dream home, look no further! John is that person.', author: 'Channing C.', role: 'Buyer' },
  { quote: 'From the moment my sister and I met John, we knew straight away he was the right person. He was extremely professional, knowledgeable, and made us feel at home.', author: 'Alcia M.', role: 'Buyer' },
  { quote: 'My entire experience working with John Oliver to purchase my dream condo in West Palm on the Intracoastal was exceptional. I will never use another realtor.', author: 'Anita F.', role: 'Buyer' },
  { quote: 'John was very patient during an extended virtual search while we were living out of the country. He visited properties on our behalf and gave honest assessments every time.', author: 'Carolyn H.', role: 'Buyer' },
  { quote: 'John Oliver goes above and beyond for his clients. He is professional with a great sense of humor, always available, and puts his clients first. Highly recommend!', author: 'Christine D.', role: 'Industry Peer' },
  { quote: 'John went above and beyond to help me find a new home. I was short on time to purchase and from day one John was fully committed to finding the right fit.', author: 'Keith H.', role: 'Buyer' },
  { quote: "Can't say enough awesome things about John! He is great at what he does, super friendly, timely and responsive!", author: 'Brittany M.', role: 'Buyer' },
  { quote: 'John is absolutely wonderful to work with. Thorough, professional, extremely honest and upfront. John and his team are top notch.', author: 'Roxy R.', role: 'Buyer' },
  { quote: 'I would recommend John because he is a great listener and a very good communicator. He is always on top of his game and super personable.', author: 'Amanda D.', role: 'Buyer' },
  { quote: 'If you want a great real estate agent to help you find your home or sell your current home, John is the guy for you!', author: 'C. Afonso', role: 'Buyer' },
  { quote: 'John is passionate about his clients and works tirelessly until the client is 100% satisfied. Could not ask for a more sound and honest Real Estate Agent.', author: 'Dream 2020', role: 'Buyer' },
  { quote: 'This guy is awesome! Super cool to work with, always on the ball. You can tell he cares about his clients and what they are looking for.', author: 'David M.', role: 'Buyer' },
  { quote: 'I had John help me find my first home and years later selling and buying another. I recommend him for everyone and anyone. Truly the best realtor I have ever met!', author: 'Nova', role: 'Buyer & Seller' },
  { quote: 'John is one of the best in the business. He\'s involved with every detail from start to finish, is an ace at communicating, and has a team of professionals he can turn to in a moment\'s notice.', author: 'Kimberly N.', role: 'Industry Peer' },
  { quote: 'I have been working with John for 3 years as his transaction coordinator and it just keeps getting better! John is a professional, hard working, honest and ethical Realtor.', author: 'Bernadine J.', role: 'Transaction Coordinator' },
  { quote: 'John is great — a realtor who will take care of you. He is genuine and sincere. Not your used car salesman type. A pleasure to work with.', author: 'Kathleen S.', role: 'Client' },
  { quote: 'John is one of the most honest, straightforward, caring people you\'ll ever meet. He actually listens to what your needs are and will go above and beyond to meet them.', author: 'Alicia A.', role: 'Buyer' },
  { quote: 'Thanks John for your help! I appreciate your responsiveness to my questions and knowledge of the area. Very professional and courteous!', author: 'Amanda S.', role: 'Buyer' },
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
        title="REALTOR® · ABR · RENE · RSPS · SRS"
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
            // Hash author name for deterministic but varied photo selection
            const hash = r.author.split('').reduce((acc, c) => acc + c.charCodeAt(0), i)
            const photo = photos[hash % photos.length]
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
