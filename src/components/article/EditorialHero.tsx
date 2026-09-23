import Link from 'next/link'
import { getImageProps } from 'next/image'
import { preload } from 'react-dom'
import type { ArticleEditorial } from '@/lib/articles'

// Below this width the hero stacks: an art-directed crop on top, text on a
// solid panel underneath. Kept in one place because the <source> media query
// and both preload hints have to agree on it exactly.
const WIDE_MEDIA = '(min-width: 768px)'
const NARROW_MEDIA = '(max-width: 767.98px)'

type Crop = { src: string; width: number; height: number }

interface Props {
  editorial: ArticleEditorial
  h1: string
  image: Crop & { alt: string; credit?: string }
  breadcrumb: { cityName: string; cityHref?: string }
  byline: { authorName?: string; updatedIso: string; updatedLabel: string }
}

// Class sets for the two surfaces the text can sit on. `dark` is the overlay
// hero's white-on-scrim; `light` is navy-on-slate for the split hero, where
// the photo never sits behind text and no scrim is needed.
const TONES = {
  dark: {
    nav: 'text-white/80',
    navLink: 'rounded hover:text-white',
    navCurrent: 'text-white/90',
    navCurrentLink: 'rounded text-white/90 hover:text-white',
    eyebrow: 'text-gold-100',
    h1: 'text-white',
    deck: 'text-white/90',
    byline: 'border-white/20 text-white/80',
    author: 'text-white',
    secondary: 'text-white decoration-white/40 hover:decoration-white',
  },
  light: {
    nav: 'text-slate-600',
    navLink: 'rounded hover:text-slate-900',
    navCurrent: 'text-slate-700',
    navCurrentLink: 'rounded text-slate-700 hover:text-slate-900',
    eyebrow: 'text-gold-600',
    h1: 'text-slate-900',
    deck: 'text-slate-700',
    byline: 'border-slate-300 text-slate-600',
    author: 'text-slate-900',
    secondary: 'text-slate-900 decoration-slate-400 hover:decoration-slate-900',
  },
  // The split hero's opt-in ivory panel (editorial.heroTone === 'warm'). Same
  // as `light` except the eyebrow, which takes the true report gold; #7A6029
  // holds 5.5:1 on the ivory background.
  warm: {
    nav: 'text-slate-600',
    navLink: 'rounded hover:text-slate-900',
    navCurrent: 'text-slate-700',
    navCurrentLink: 'rounded text-slate-700 hover:text-slate-900',
    eyebrow: 'text-report-gold-badge',
    h1: 'text-slate-900',
    deck: 'text-slate-700',
    byline: 'border-report-gold-light text-slate-600',
    author: 'text-slate-900',
    secondary: 'text-slate-900 decoration-slate-400 hover:decoration-slate-900',
  },
} as const

function HeroText({
  editorial,
  h1,
  breadcrumb,
  byline,
  tone,
}: Omit<Props, 'image'> & { tone: keyof typeof TONES }) {
  const t = TONES[tone]
  return (
    <>
      <nav aria-label="Breadcrumb" className={`flex flex-wrap items-center gap-2 text-xs ${t.nav}`}>
        <Link href="/" className={t.navLink}>Home</Link>
        <span aria-hidden="true">/</span>
        <Link href="/blog" className={t.navLink}>Blog</Link>
        <span aria-hidden="true">/</span>
        {breadcrumb.cityHref ? (
          <Link href={breadcrumb.cityHref} className={t.navCurrentLink}>
            {breadcrumb.cityName}
          </Link>
        ) : (
          <span className={t.navCurrent}>{breadcrumb.cityName}</span>
        )}
      </nav>

      <p className={`mt-4 text-xs font-semibold uppercase tracking-[0.24em] md:mt-5 ${t.eyebrow}`}>
        {editorial.eyebrow}
      </p>
      <h1 className={`mt-3 font-serif text-[1.875rem] font-semibold leading-[1.15] sm:text-4xl lg:text-[2.75rem] ${t.h1}`}>
        {h1}
      </h1>
      <p className={`mt-4 text-base leading-7 md:text-lg md:leading-8 ${t.deck}`}>{editorial.deck}</p>

      <p className={`mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 border-t pt-4 text-sm ${t.byline}`}>
        {byline.authorName && (
          <>
            <span>
              By <span className={`font-semibold ${t.author}`}>{byline.authorName}</span>
            </span>
            <span aria-hidden="true">·</span>
          </>
        )}
        <span>
          Updated <time dateTime={byline.updatedIso}>{byline.updatedLabel}</time>
        </span>
      </p>

      <div className="mt-5 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6 md:mt-6">
        <Link
          href={editorial.primaryCta.href}
          className="inline-flex items-center justify-center rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gold-600"
        >
          {editorial.primaryCta.label}
        </Link>
        <Link
          href={editorial.secondaryCta.href}
          className={`inline-flex items-center gap-1.5 rounded text-sm font-semibold underline underline-offset-4 transition ${t.secondary}`}
        >
          {editorial.secondaryCta.label}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </>
  )
}

function Credit({ credit }: { credit?: string }) {
  if (!credit) return null
  return (
    <span className="absolute bottom-2 right-3 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white/90">
      {credit}
    </span>
  )
}

export default function EditorialHero(props: Props) {
  const { editorial, image } = props
  // Tailwind needs whole class names, so both variants are written out.
  const stacked = editorial.mobileAspect === '16/9' ? 'aspect-[16/9]' : 'aspect-[3/2]'
  const panel = editorial.heroLayout === 'split' ? editorial.panelImage : undefined
  const split = Boolean(panel)
  // Desktop candidate: the tall panel crop in the split layout, the wide crop
  // otherwise. The split panel fills about half the viewport, so its `sizes`
  // says so and the optimizer isn't asked for a full-width file.
  const desktopCrop: Crop = panel ?? image
  const desktopSizes = split ? '(min-width: 768px) 45vw, 100vw' : '100vw'

  const common = { alt: image.alt, quality: 75 }
  // Pass only src/width/height — `image` also carries alt and credit, which
  // getImageProps would otherwise forward as stray <img> attributes.
  const crop = (c: Crop) => ({ src: c.src, width: c.width, height: c.height })
  const wide = getImageProps({ ...common, sizes: desktopSizes, ...crop(desktopCrop) }).props
  const narrow = getImageProps({ ...common, sizes: '100vw', ...crop(editorial.mobileImage) }).props

  // Art direction means two LCP candidates, so next/image's own `preload`
  // can't be used — it would fetch one crop on every screen. Each hint is
  // scoped to the viewport that will actually paint it.
  preload(wide.src, { as: 'image', imageSrcSet: wide.srcSet, imageSizes: desktopSizes, fetchPriority: 'high', media: WIDE_MEDIA })
  preload(narrow.src, { as: 'image', imageSrcSet: narrow.srcSet, imageSizes: '100vw', fetchPriority: 'high', media: NARROW_MEDIA })

  const picture = (
    <picture>
      <source media={WIDE_MEDIA} srcSet={wide.srcSet} sizes={desktopSizes} width={desktopCrop.width} height={desktopCrop.height} />
      <img
        src={narrow.src}
        srcSet={narrow.srcSet}
        sizes="100vw"
        width={editorial.mobileImage.width}
        height={editorial.mobileImage.height}
        alt={image.alt}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
    </picture>
  )

  if (split) {
    const warm = editorial.heroTone === 'warm'
    return (
      <header className={warm ? 'border-b border-report-gold-light/60 bg-[#FBF7EF]' : 'border-b border-slate-200 bg-slate-50'}>
        <div className="mx-auto grid max-w-7xl md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:items-center md:gap-10 md:px-8 lg:gap-16">
          {/* Photo first in source so it leads on phones; the grid moves it
              right on wider screens. aspect-ratio reserves its box before it
              paints, so nothing below shifts. */}
          <div className={`relative ${stacked} overflow-hidden md:order-2 md:my-10 md:aspect-[4/5] md:max-h-[640px] md:rounded-sm lg:my-12`}>
            {picture}
            <Credit credit={image.credit} />
          </div>
          <div className="px-6 pb-9 pt-6 sm:px-8 md:order-1 md:px-0 md:py-12">
            <div className="max-w-xl">
              <HeroText {...props} tone={warm ? 'warm' : 'light'} />
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="relative bg-navy-950 md:aspect-[16/9] md:min-h-[600px] lg:aspect-[2.2/1] lg:max-h-[780px]">
      {/* The box reserves its height from aspect-ratio before the image
          arrives, so nothing below shifts when it paints. */}
      <div className={`relative ${stacked} overflow-hidden md:absolute md:inset-0 md:aspect-auto`}>
        {picture}
        {/* Scrim only where text sits: a left-weighted wash on wide screens.
            Keeps every overlaid line at or above WCAG AA against the
            brightest pixel the crop can put behind it. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden bg-gradient-to-r from-navy-950/90 via-navy-950/75 via-45% to-navy-950/10 md:block"
        />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 hidden h-1/2 bg-gradient-to-t from-navy-950/60 to-transparent md:block" />
        <Credit credit={image.credit} />
      </div>

      <div className="relative md:absolute md:inset-0 md:flex md:items-end">
        <div className="mx-auto w-full max-w-6xl px-6 pb-9 pt-6 sm:px-8 md:pb-14 md:pt-10 lg:pb-16">
          <div className="max-w-2xl">
            <HeroText {...props} tone="dark" />
          </div>
        </div>
      </div>
    </header>
  )
}
