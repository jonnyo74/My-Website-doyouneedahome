// Loads the embedded PDF font family once, for every generator script.
//
// Liberation Sans (SIL Open Font License) ships inside pdfjs-dist, which is
// already a devDependency for rendering the cover images. It is metrically
// compatible with Helvetica/Arial, so the layout is unchanged from the
// standard-14 metrics the writer falls back to.

import { createRequire } from 'node:module'
import path from 'node:path'
import { loadTrueType } from './ttf.mjs'
import { setEmbeddedFonts } from './pdf.mjs'

const fontsDir = path.join(
  path.dirname(createRequire(import.meta.url).resolve('pdfjs-dist/package.json')),
  'standard_fonts',
)

export async function installFonts() {
  const [body, bold] = await Promise.all([
    loadTrueType(path.join(fontsDir, 'LiberationSans-Regular.ttf'), { baseFont: 'LiberationSans' }),
    loadTrueType(path.join(fontsDir, 'LiberationSans-Bold.ttf'), { baseFont: 'LiberationSans-Bold' }),
  ])
  setEmbeddedFonts({ body, bold })
}
