import { Fragment, type ReactNode } from 'react'
import Link from 'next/link'

/**
 * Minimal markdown renderer for article bodies.
 * Supports: ## h2, ### h3, - bullet lists, > blockquote, **bold** and
 * [label](url) inline, paragraphs, and standalone images. Dependency-free.
 *
 * Images use markdown syntax on their own line, with an optional caption:
 *   ![alt text](/images/jupiter/jupiter-inlet.jpg)
 *   ![alt text](/images/jupiter/jupiter-inlet.jpg "Caption shown beneath")
 */

// ![alt](src) or ![alt](src "caption") — the whole line, nothing else on it.
const IMAGE_LINE = /^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)$/

function renderBold(text: string, keyBase: string): ReactNode[] {
  // Split on **bold** segments
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={`${keyBase}-b${i}`} className="font-semibold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return <Fragment key={`${keyBase}-t${i}`}>{part}</Fragment>
  })
}

function renderInline(text: string, keyBase: string): ReactNode[] {
  // Split on [label](url) links, then handle **bold** within each segment
  const parts = text.split(/(\[[^\]]+\]\([^)\s]+\))/g)
  return parts.flatMap((part, i) => {
    const m = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/)
    if (!m) return renderBold(part, `${keyBase}-${i}`)
    const [, label, href] = m
    const cls = 'font-medium text-gold-600 underline decoration-gold-300 underline-offset-2 transition hover:text-gold-700'
    if (href.startsWith('/')) {
      return (
        <Link key={`${keyBase}-l${i}`} href={href} className={cls}>
          {renderBold(label, `${keyBase}-l${i}`)}
        </Link>
      )
    }
    return (
      <a key={`${keyBase}-l${i}`} href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {renderBold(label, `${keyBase}-l${i}`)}
      </a>
    )
  })
}

export default function Prose({ content, className = '' }: { content: string; className?: string }) {
  const lines = content.split('\n')
  const blocks: ReactNode[] = []
  let para: string[] = []
  let list: string[] = []
  let key = 0

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

  for (const raw of lines) {
    const line = raw.trimEnd()
    const image = line.match(IMAGE_LINE)
    if (image) {
      flushPara(); flushList()
      const [, alt, src, caption] = image
      blocks.push(
        <figure key={`f${key++}`} className="mt-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className="w-full rounded-2xl border border-slate-200 object-cover shadow-card"
          />
          {caption && (
            <figcaption className="mt-3 text-center text-sm italic leading-6 text-slate-500">
              {caption}
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
        <h2 key={`h2${key++}`} className="mt-10 font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">
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
  flushPara(); flushList()

  return <div className={className}>{blocks}</div>
}
