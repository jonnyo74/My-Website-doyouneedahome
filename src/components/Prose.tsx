import { Fragment, type ReactNode } from 'react'

/**
 * Minimal markdown renderer for article bodies.
 * Supports: ## h2, ### h3, - bullet lists, > blockquote, **bold** inline, and paragraphs.
 * Intentionally dependency-free.
 */

function renderInline(text: string, keyBase: string): ReactNode[] {
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
    if (line.startsWith('### ')) {
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
