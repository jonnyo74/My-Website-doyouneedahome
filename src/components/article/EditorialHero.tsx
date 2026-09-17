import Link from 'next/link'
import { getImageProps } from 'next/image'
import { preload } from 'react-dom'
import type { ArticleEditorial } from '@/lib/articles'

// Below this width the hero stacks: an art-directed crop on top, text on a
// solid panel underneath. Kept in one place because the <source> media query
// and both preload hints have to agree on it exactly.
const WIDE_MEDIA = '(min-width: 768px)'
const NARROW_MEDIA = '(max-width: 767.98px)'

interface Props {
  editorial: ArticleEditorial
  h1: string
  image: { src: string; width: number; height: number; alt: string; credit?: string }
  breadcrumb: { cityName: string; cityHref?: string }
  byline: { authorName?: string; updatedIso: string; updatedLabel: string }
}

export default function EditorialHero({ editorial, h1, image, breadcrumb, byline }: Props) {
  const common = { alt: image.alt, sizes: '100vw', quality: 75 }
  const wide = getImageProps({ ...common, src: image.src, width: image.width, height: image.height }).props
  const narrow = getImageProps({
    ...common,
    src: editorial.mobileImage.src,
    width: editorial.mobileImage.width,
    height: editorial.mobileImage.height,
  }).props

  // Art direction means two LCP candidates, so next/image's own `preload`
  // can't be used — it would fetch one crop on every screen. Each hint is
  // scoped to the viewport that will actually paint it.
  preload(wide.src, { as: 'image', imageSrcSet: wide.srcSet, imageSizes: '100vw', fetchPriority: 'high', media: WIDE_MEDIA })
  preload(narrow.src, { as: 'image', imageSrcSet: narrow.srcSet, imageSizes: '100vw', fetchPriority: 'high', media: NARROW_MEDIA })

  return (
    <header className="relative bg-navy-950 md:aspect-[16/9] md:min-h-[600px] lg:aspect-[2.2/1] lg:max-h-[780px]">
      {/* The box reserves its height from aspect-ratio before the image
          arrives, so nothing below shifts when it paints. */}
      <div className="relative aspect-[3/2] overflow-hidden md:absolute md:inset-0 md:aspect-auto">
        <picture>
          <source media={WIDE_MEDIA} srcSet={wide.srcSet} sizes="100vw" width={image.width} height={image.height} />
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
        {/* Scrim only where text sits: a left-weighted wash on wide screens.
            Keeps every overlaid line at or above WCAG AA against the
            brightest pixel the crop can put behind it. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden bg-gradient-to-r from-navy-950/90 via-navy-950/75 via-45% to-navy-950/10 md:block"
        />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 hidden h-1/2 bg-gradient-to-t from-navy-950/60 to-transparent md:block" />
        {image.credit && (
          <span className="absolute bottom-2 right-3 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white/90">
            {image.credit}
          </span>
        )}
      </div>

      <div className="relative md:absolute md:inset-0 md:flex md:items-end">
        <div className="mx-auto w-full max-w-6xl px-6 pb-9 pt-6 sm:px-8 md:pb-14 md:pt-10 lg:pb-16">
          <div className="max-w-2xl">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-white/80">
              <Link href="/" className="rounded hover:text-white">Home</Link>
              <span aria-hidden="true">/</span>
              <Link href="/blog" className="rounded hover:text-white">Blog</Link>
              <span aria-hidden="true">/</span>
              {breadcrumb.cityHref ? (
                <Link href={breadcrumb.cityHref} className="rounded text-white/90 hover:text-white">
                  {breadcrumb.cityName}
                </Link>
              ) : (
                <span className="text-white/90">{breadcrumb.cityName}</span>
              )}
            </nav>

            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.24em] text-gold-100">
              {editorial.eyebrow}
            </p>
            <h1 className="mt-3 font-serif text-[1.875rem] font-semibold leading-[1.15] text-white sm:text-4xl lg:text-[2.75rem]">
              {h1}
            </h1>
            <p className="mt-4 text-base leading-7 text-white/90 md:text-lg md:leading-8">{editorial.deck}</p>

            <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-white/20 pt-4 text-sm text-white/80">
              {byline.authorName && (
                <>
                  <span>
                    By <span className="font-semibold text-white">{byline.authorName}</span>
                  </span>
                  <span aria-hidden="true">·</span>
                </>
              )}
              <span>
                Updated <time dateTime={byline.updatedIso}>{byline.updatedLabel}</time>
              </span>
            </p>

            <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
              <Link
                href={editorial.primaryCta.href}
                className="inline-flex items-center justify-center rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gold-600"
              >
                {editorial.primaryCta.label}
              </Link>
              <Link
                href={editorial.secondaryCta.href}
                className="inline-flex items-center gap-1.5 rounded text-sm font-semibold text-white underline decoration-white/40 underline-offset-4 transition hover:decoration-white"
              >
                {editorial.secondaryCta.label}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
