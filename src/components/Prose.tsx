import { Fragment, type ReactNode } from 'react'
import Link from 'next/link'
import { headingId } from '@/lib/headingId'

/**
 * Minimal markdown renderer for article bodies.
 * Supports: ## h2, ### h3, - bullet lists, - [ ] checklists, > blockquote, **bold**, *italic*
 * and [label](url) inline, paragraphs, and standalone images. Dependency-free.
 *
 * Images use markdown syntax on their own line, with an optional caption:
 *   ![alt text](/images/jupiter/jupiter-inlet.jpg)
 *   ![alt text](/images/jupiter/jupiter-inlet.jpg "Caption shown beneath")
 *
 * Several images can be grouped into a two-column gallery by fencing them:
 *   ::: gallery            (or "::: gallery portrait" for 3:4 frames)
 *   ![alt](/a.jpg "Caption")
 *   ![alt](/b.jpg "Caption")
 *   :::
 * In a landscape gallery an odd final image spans both columns at 16:9.
 */

// ![alt](src) or ![alt](src "caption") — the whole line, nothing else on it.
const IMAGE_LINE = /^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)$/
const GALLERY_OPEN = /^:::\s*gallery(?:\s+(portrait))?$/

type GalleryImage = { alt: string; src: string; caption?: string; credit?: string }

// Caption may carry an optional photo credit after a ` || ` delimiter:
//   ![alt](/img.jpg "Caption text || Photo by Jane Doe / Unsplash")
// Captions without the delimiter are unaffected.
function splitCaption(raw: string | undefined) {
  const [caption, credit] = (raw ?? '').split(' || ')
  return { caption: caption || undefined, credit: credit || undefined }
}

function renderEmphasis(text: string, keyBase: string): ReactNode[] {
  // Split on **bold** and *italic* segments. The alternation must try the
  // double-asterisk form first, since ** also starts a valid * match.
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*\n]+\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={`${keyBase}-b${i}`} className="font-semibold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      )
    }
    if (part.length > 2 && part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={`${keyBase}-i${i}`} className="italic">
          {part.slice(1, -1)}
        </em>
      )
    }
    return <Fragment key={`${keyBase}-t${i}`}>{part}</Fragment>
  })
}

function renderInline(text: string, keyBase: string): ReactNode[] {
  // Split on [label](url) links, then handle **bold** / *italic* within each segment
  const parts = text.split(/(\[[^\]]+\]\([^)\s]+\))/g)
  return parts.flatMap((part, i) => {
    const m = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/)
    if (!m) return renderEmphasis(part, `${keyBase}-${i}`)
    const [, label, href] = m
    const cls = 'font-medium text-gold-600 underline decoration-gold-300 underline-offset-2 transition hover:text-gold-700'
    if (href.startsWith('/')) {
      return (
        <Link key={`${keyBase}-l${i}`} href={href} className={cls}>
          {renderEmphasis(label, `${keyBase}-l${i}`)}
        </Link>
      )
    }
    return (
      <a key={`${keyBase}-l${i}`} href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {renderEmphasis(label, `${keyBase}-l${i}`)}
      </a>
    )
  })
}

export default function Prose({ content, className = '' }: { content: string; className?: string }) {
  const lines = content.split('\n')
  const blocks: ReactNode[] = []
  let para: string[] = []
  let list: string[] = []
  let table: string[][] = []
  let gallery: { portrait: boolean; images: GalleryImage[] } | null = null
  let key = 0

  const flushGallery = () => {
    if (!gallery) return
    const { portrait, images } = gallery
    gallery = null
    if (!images.length) return
    blocks.push(
      <div key={`g${key++}`} className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
        {images.map((img, i) => {
          const wide = !portrait && images.length % 2 === 1 && i === images.length - 1
          return (
            <figure key={i} className={wide ? 'col-span-2' : undefined}>
              <a href={img.src} target="_blank" rel="noopener" className="block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className={`w-full rounded-xl border border-slate-200 object-cover shadow-card ${
                    wide ? 'aspect-[16/9]' : portrait ? 'aspect-[3/4]' : 'aspect-[4/3]'
                  }`}
                />
              </a>
              {(img.caption || img.credit) && (
                <figcaption className="mt-2 text-xs italic leading-5 text-slate-500 sm:text-sm sm:leading-6">
                  {img.caption}
                  {img.credit && <span className="mt-0.5 block not-italic">{img.credit}</span>}
                </figcaption>
              )}
            </figure>
          )
        })}
      </div>,
    )
  }

  const flushPara = () => {
    if (para.length) {
      const text = para.join(' ')
      blocks.push(
        <p key={`p${key++}`} className="mt-5 leading-8 text-slate-600">
          {renderInline(text, `p${key}`)}
        </p>,
      )
      para = []
    }
  }
  const flushList = () => {
    // A list whose every item starts with "[ ] " is a to-do checklist: square
    // markers instead of bullets. The squares are decorative — this is a
    // reading aid, not a form — so nothing is focusable and nothing is stored.
    const CHECK = '[ ] '
    if (list.length && list.every((item) => item.startsWith(CHECK))) {
      blocks.push(
        <ul key={`c${key++}`} className="mt-5 space-y-3">
          {list.map((item, i) => (
            <li key={i} className="flex gap-3 leading-7 text-slate-600">
              <span
                aria-hidden="true"
                className="mt-1.5 inline-block h-4 w-4 shrink-0 rounded-[3px] border-2 border-gold-500"
              />
              <span>{renderInline(item.slice(CHECK.length), `c${key}-${i}`)}</span>
            </li>
          ))}
        </ul>,
      )
      list = []
      return
    }
    if (list.length) {
      blocks.push(
        <ul key={`u${key++}`} className="mt-5 space-y-2 pl-5">
          {list.map((item, i) => (
            <li key={i} className="list-disc leading-7 text-slate-600 marker:text-gold-500">
              {renderInline(item, `u${key}-${i}`)}
            </li>
          ))}
        </ul>,
      )
      list = []
    }
  }
  const flushTable = () => {
    if (table.length) {
      const [head, ...rows] = table
      blocks.push(
        <div key={`tw${key++}`} className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b-2 border-slate-300">
                {head.map((cell, i) => (
                  <th key={i} className="py-2 pr-6 font-semibold text-slate-900">
                    {renderInline(cell, `th${key}-${i}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} className="border-b border-slate-200 last:border-0">
                  {row.map((cell, ci) => (
                    <td key={ci} className="py-2 pr-6 align-top leading-7 text-slate-600">
                      {renderInline(cell, `td${key}-${ri}-${ci}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      )
      table = []
    }
  }

  for (const raw of lines) {
    const line = raw.trimEnd()

    // Gallery fence: collect image lines until the closing ":::".
    const open = line.match(GALLERY_OPEN)
    if (open) {
      flushPara(); flushList(); flushTable(); flushGallery()
      gallery = { portrait: Boolean(open[1]), images: [] }
      continue
    }
    if (gallery) {
      if (line === ':::') { flushGallery(); continue }
      const img = line.match(IMAGE_LINE)
      if (img) gallery.images.push({ alt: img[1], src: img[2], ...splitCaption(img[3]) })
      continue
    }

    // Pipe tables: | Year | Event |  with a |---|---| separator row.
    if (/^\|.*\|$/.test(line)) {
      flushPara(); flushList()
      const cells = line.slice(1, -1).split('|').map((c) => c.trim())
      // Skip the separator row; everything else is header (first) then body.
      if (!cells.every((c) => /^:?-{2,}:?$/.test(c))) table.push(cells)
      continue
    }
    flushTable()

    const image = line.match(IMAGE_LINE)
    if (image) {
      flushPara(); flushList()
      const [, alt, src, rawCaption] = image
      const { caption, credit } = splitCaption(rawCaption)
      blocks.push(
        <figure key={`f${key++}`} className="mt-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className="w-full rounded-2xl border border-slate-200 object-cover shadow-card"
          />
          {(caption || credit) && (
            <figcaption className="mt-3 text-center text-sm italic leading-6 text-slate-500">
              {caption}
              {credit && (
                <span className="mt-1 block text-xs not-italic text-slate-500">{credit}</span>
              )}
            </figcaption>
          )}
        </figure>,
      )
    } else if (line.startsWith('### ')) {
      flushPara(); flushList()
      blocks.push(
        <h3 key={`h3${key++}`} className="mt-8 font-serif text-xl font-semibold text-slate-900">
          {renderInline(line.slice(4), `h3${key}`)}
        </h3>,
      )
    } else if (line.startsWith('## ')) {
      flushPara(); flushList()
      blocks.push(
        <h2 key={`h2${key++}`} id={headingId(line.slice(3))} className="mt-10 scroll-mt-28 font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">
          {renderInline(line.slice(3), `h2${key}`)}
        </h2>,
      )
    } else if (line.startsWith('- ')) {
      flushPara()
      list.push(line.slice(2))
    } else if (line.startsWith('> ')) {
      flushPara(); flushList()
      blocks.push(
        <blockquote key={`q${key++}`} className="mt-6 border-l-4 border-gold-400 pl-5 text-lg italic leading-8 text-slate-700">
          {renderInline(line.slice(2), `q${key}`)}
        </blockquote>,
      )
    } else if (line === '') {
      flushPara(); flushList()
    } else {
      flushList()
      para.push(line)
    }
  }
  flushPara(); flushList(); flushTable(); flushGallery()

  return <div className={className}>{blocks}</div>
}
