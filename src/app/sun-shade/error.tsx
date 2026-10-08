'use client'

import { useEffect } from 'react'

/**
 * Fallback for an unexpected crash inside the analyzer. Without it, any
 * uncaught client error blanked the whole page — which is how a Safari
 * history-API throw looked on a phone.
 */
export default function SunShadeError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="font-serif text-2xl font-semibold text-navy-950">
        The analyzer hit a snag
      </h1>
      <p className="mt-2 text-slate-600">
        Nothing is wrong with your address or link. Reload the tool and try again.
      </p>
      <details className="mt-4 text-left text-xs text-slate-500">
        <summary className="cursor-pointer text-center">Error details</summary>
        <pre className="mt-2 whitespace-pre-wrap break-words rounded-lg bg-slate-100 p-3">
          {error.name}: {error.message}
          {error.digest ? `\nDigest: ${error.digest}` : ''}
          {`\n${(error.stack ?? '').split('\n').slice(1, 5).join('\n')}`}
        </pre>
      </details>
      <button
        type="button"
        onClick={() => unstable_retry()}
        className="mt-6 rounded-xl bg-gold-500 px-5 py-3 text-sm font-semibold text-white hover:bg-gold-600"
      >
        Reload the analyzer
      </button>
    </div>
  )
}
