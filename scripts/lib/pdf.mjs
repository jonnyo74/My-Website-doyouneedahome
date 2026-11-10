// A small, dependency-free PDF writer, just large enough to typeset the
// DO Homes Group guides in the site's own navy-and-gold treatment.
//
// Why not a library: the repo already ships a PDF *reader* (pdf-to-img, used to
// render covers) and adding a writer would be a second heavyweight dependency
// for a job that is a few hundred lines of layout. Everything here uses the 14
// standard PDF fonts, so no font embedding is needed and the files stay small.
//
// Only the ASCII range is supported on purpose — text is transliterated before
// it is drawn, so a stray em dash or curly quote can never corrupt a file.

const PAGE_W = 612 // US Letter, points
const PAGE_H = 792
const MARGIN_X = 62
const MARGIN_TOP = 66
const MARGIN_BOTTOM = 64

export const COLORS = {
  navy: [0.043, 0.098, 0.161], // #0B1929
  gold: [0.788, 0.663, 0.38], // #C9A961
  goldDark: [0.69, 0.561, 0.278], // #B08F47
  slate: [0.278, 0.333, 0.412], // #475569
  slateLight: [0.58, 0.639, 0.722], // #94A3B8
  white: [1, 1, 1],
  paper: [0.976, 0.98, 0.984], // #F8FAFC
  border: [0.886, 0.91, 0.941], // #E2E8F0
  // Year-over-year movement in the market-report tables. Both clear 4.5:1 on
  // white, so the colour is a reinforcement of the +/- sign rather than the
  // only thing carrying the meaning.
  up: [0.078, 0.435, 0.278], // #146F47
  down: [0.69, 0.165, 0.216], // #B02A37
}

// ── Font metrics (WinAnsi, chars 32–126) ─────────────────────────────────────
// Widths in 1/1000 em, taken from the standard-14 AFM tables.

function widths(spec) {
  const w = new Array(95).fill(0)
  for (const [range, value] of spec) {
    if (Array.isArray(range)) {
      for (let c = range[0]; c <= range[1]; c++) w[c - 32] = value
    } else {
      w[range - 32] = value
    }
  }
  return w
}

const HELVETICA = widths([
  [32, 278], [33, 278], [34, 355], [35, 556], [36, 556], [37, 889], [38, 667], [39, 191],
  [40, 333], [41, 333], [42, 389], [43, 584], [44, 278], [45, 333], [46, 278], [47, 278],
  [[48, 57], 556],
  [58, 278], [59, 278], [60, 584], [61, 584], [62, 584], [63, 556], [64, 1015],
  [65, 667], [66, 667], [67, 722], [68, 722], [69, 667], [70, 611], [71, 778], [72, 722],
  [73, 278], [74, 500], [75, 667], [76, 556], [77, 833], [78, 722], [79, 778], [80, 667],
  [81, 778], [82, 722], [83, 667], [84, 611], [85, 722], [86, 667], [87, 944], [88, 667],
  [89, 667], [90, 611],
  [91, 278], [92, 278], [93, 278], [94, 469], [95, 556], [96, 333],
  [97, 556], [98, 556], [99, 500], [100, 556], [101, 556], [102, 278], [103, 556], [104, 556],
  [105, 222], [106, 222], [107, 500], [108, 222], [109, 833], [110, 556], [111, 556], [112, 556],
  [113, 556], [114, 333], [115, 500], [116, 278], [117, 556], [118, 500], [119, 722], [120, 500],
  [121, 500], [122, 500], [123, 334], [124, 260], [125, 334], [126, 584],
])

const HELVETICA_BOLD = widths([
  [32, 278], [33, 333], [34, 474], [35, 556], [36, 556], [37, 889], [38, 722], [39, 238],
  [40, 333], [41, 333], [42, 389], [43, 584], [44, 278], [45, 333], [46, 278], [47, 278],
  [[48, 57], 556],
  [58, 333], [59, 333], [60, 584], [61, 584], [62, 584], [63, 611], [64, 975],
  [65, 722], [66, 722], [67, 722], [68, 722], [69, 667], [70, 611], [71, 778], [72, 722],
  [73, 278], [74, 556], [75, 722], [76, 611], [77, 833], [78, 722], [79, 778], [80, 667],
  [81, 778], [82, 722], [83, 667], [84, 611], [85, 722], [86, 667], [87, 944], [88, 667],
  [89, 667], [90, 611],
  [91, 333], [92, 278], [93, 333], [94, 584], [95, 556], [96, 333],
  [97, 556], [98, 611], [99, 556], [100, 611], [101, 556], [102, 333], [103, 611], [104, 611],
  [105, 278], [106, 278], [107, 556], [108, 278], [109, 889], [110, 611], [111, 611], [112, 611],
  [113, 611], [114, 389], [115, 556], [116, 333], [117, 611], [118, 556], [119, 778], [120, 556],
  [121, 556], [122, 500], [123, 389], [124, 280], [125, 389], [126, 584],
])

const TIMES_BOLD = widths([
  [32, 250], [33, 333], [34, 555], [35, 500], [36, 500], [37, 1000], [38, 833], [39, 278],
  [40, 333], [41, 333], [42, 500], [43, 570], [44, 250], [45, 333], [46, 250], [47, 278],
  [[48, 57], 500],
  [58, 333], [59, 333], [60, 570], [61, 570], [62, 570], [63, 500], [64, 930],
  [65, 722], [66, 667], [67, 722], [68, 722], [69, 667], [70, 611], [71, 778], [72, 778],
  [73, 389], [74, 500], [75, 778], [76, 667], [77, 944], [78, 722], [79, 778], [80, 611],
  [81, 778], [82, 722], [83, 556], [84, 667], [85, 722], [86, 722], [87, 1000], [88, 722],
  [89, 722], [90, 667],
  [91, 333], [92, 278], [93, 333], [94, 581], [95, 500], [96, 333],
  [97, 500], [98, 556], [99, 444], [100, 556], [101, 444], [102, 333], [103, 500], [104, 556],
  [105, 278], [106, 333], [107, 556], [108, 278], [109, 833], [110, 556], [111, 500], [112, 556],
  [113, 556], [114, 444], [115, 389], [116, 333], [117, 556], [118, 500], [119, 722], [120, 500],
  [121, 500], [122, 444], [123, 394], [124, 220], [125, 394], [126, 520],
])

const FONTS = {
  body: { ref: 'F1', base: 'Helvetica', widths: HELVETICA },
  bold: { ref: 'F2', base: 'Helvetica-Bold', widths: HELVETICA_BOLD },
  serif: { ref: 'F3', base: 'Times-Bold', widths: TIMES_BOLD },
}

/**
 * Swap the standard-14 fonts for embedded TrueType faces. Call once, before
 * building any document, with the result of loadTrueType() from ./ttf.mjs. The
 * widths tables are replaced too, so wrapping is measured against the glyphs
 * that will actually be drawn.
 *
 * Without this the PDFs still render correctly in any reader that has real
 * Helvetica, but a reader that substitutes draws narrow glyphs on Helvetica's
 * advances and the tracking looks wrong — including in the build-time
 * rasteriser that produces the cover images.
 */
export function setEmbeddedFonts({ body, bold }) {
  FONTS.body.embedded = body
  FONTS.body.widths = body.widths
  FONTS.bold.embedded = bold
  FONTS.bold.widths = bold.widths
  // The guides previously set headings in Times-Bold. Everything now shares one
  // embedded family so all five PDFs are self-contained and consistent.
  FONTS.serif.embedded = bold
  FONTS.serif.widths = bold.widths
}

export const PAGE_SIZE = { width: PAGE_W, height: PAGE_H, marginX: MARGIN_X }

/**
 * Reduce text to the printable ASCII range. Every guide's source content lives
 * in JSON written by hand, so smart punctuation is common and would otherwise
 * be silently dropped by the standard-font encoding.
 */
export function toAscii(input) {
  return String(input)
    .replace(/[‘’‛]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—−]/g, '-')
    .replace(/[…]/g, '...')
    .replace(/[   ]/g, ' ')
    .replace(/[®]/g, '(R)')
    .replace(/[°]/g, ' deg')
    .replace(/[•✦⚑✓]/g, '-')
    .replace(/[^\x20-\x7E\n]/g, '')
}

function textWidth(text, font, size) {
  let total = 0
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i)
    total += code >= 32 && code <= 126 ? font.widths[code - 32] : font.widths[0]
  }
  return (total * size) / 1000
}

function wrap(text, font, size, maxWidth, charSpace = 0) {
  // textWidth measures glyph advances only, so letter-spacing has to be added
  // back in or a spaced-out label wraps far too late.
  const measure = (s) => textWidth(s, font, size) + charSpace * Math.max(0, s.length - 1)
  const words = text.split(/\s+/).filter(Boolean)
  const lines = []
  let line = ''
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word
    if (measure(candidate) <= maxWidth || !line) {
      line = candidate
    } else {
      lines.push(line)
      line = word
    }
  }
  if (line) lines.push(line)
  return lines
}

function escape(text) {
  return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
}

function rgb(color) {
  return color.map((c) => c.toFixed(3)).join(' ')
}

// ── Document ─────────────────────────────────────────────────────────────────

export class PdfDoc {
  /**
   * @param {{title: string, author: string, subject?: string, runningHeader?: string}} meta
   */
  constructor(meta) {
    this.meta = meta
    this.pages = []
    this.ops = null
    this.y = 0
    this.contentWidth = PAGE_W - MARGIN_X * 2
    this.suppressChrome = false
    /** name -> { data: Buffer, width, height } JPEG XObjects. */
    this.images = new Map()
    /** Pages that opt out of the default footer (covers, custom chrome). */
    this.noFooter = new Set()
  }

  /**
   * Register a JPEG for drawing. Must be baseline JPEG bytes — callers run
   * source images through sharp first, which also normalises PNGs that happen
   * to carry a .jpg extension.
   */
  addImage(name, data, width, height) {
    this.images.set(name, { data, width, height })
    return this
  }

  drawImage(name, x, y, w, h) {
    if (!this.images.has(name)) throw new Error(`Unknown image: ${name}`)
    this.ops.push('q', `${w} 0 0 ${h} ${x.toFixed(2)} ${y.toFixed(2)} cm`, `/${name} Do`, 'Q')
    return this
  }

  strokeRect(x, y, w, h, color, lineWidth = 1) {
    this.ops.push(
      `${rgb(color)} RG`,
      `${lineWidth} w`,
      `${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re S`,
    )
    return this
  }

  #circlePath(cx, cy, r) {
    const k = 0.5523 * r
    return [
      `${(cx + r).toFixed(2)} ${cy.toFixed(2)} m`,
      `${(cx + r).toFixed(2)} ${(cy + k).toFixed(2)} ${(cx + k).toFixed(2)} ${(cy + r).toFixed(2)} ${cx.toFixed(2)} ${(cy + r).toFixed(2)} c`,
      `${(cx - k).toFixed(2)} ${(cy + r).toFixed(2)} ${(cx - r).toFixed(2)} ${(cy + k).toFixed(2)} ${(cx - r).toFixed(2)} ${cy.toFixed(2)} c`,
      `${(cx - r).toFixed(2)} ${(cy - k).toFixed(2)} ${(cx - k).toFixed(2)} ${(cy - r).toFixed(2)} ${cx.toFixed(2)} ${(cy - r).toFixed(2)} c`,
      `${(cx + k).toFixed(2)} ${(cy - r).toFixed(2)} ${(cx + r).toFixed(2)} ${(cy - k).toFixed(2)} ${(cx + r).toFixed(2)} ${cy.toFixed(2)} c`,
    ]
  }

  /**
   * Draw an image clipped to a circle. Doing the mask here rather than baking a
   * circular photo in sharp keeps the edge exact — a pre-masked JPEG flattened
   * onto the page colour leaves a faintly visible square once JPEG compression
   * has shifted the flat background.
   */
  drawImageInCircle(name, cx, cy, r) {
    this.ops.push('q', ...this.#circlePath(cx, cy, r), 'W n')
    this.drawImage(name, cx - r, cy - r, r * 2, r * 2)
    this.ops.push('Q')
    return this
  }

  /** Circle from four Bézier arcs — used for the gold ring on cover portraits. */
  strokeCircle(cx, cy, r, color, lineWidth = 1.5) {
    this.ops.push(
      `${rgb(color)} RG`,
      `${lineWidth} w`,
      ...this.#circlePath(cx, cy, r),
      'S',
    )
    return this
  }

  /** Measure a string without drawing it. */
  measure(text, fontKey, size) {
    return textWidth(toAscii(text), FONTS[fontKey], size)
  }

  /** Absolutely-positioned text, with optional centering about `x`. */
  textAt(text, x, y, { font = 'body', size = 10, color = COLORS.slate, charSpace = 0, align = 'left' } = {}) {
    const clean = toAscii(text)
    const f = FONTS[font]
    let drawX = x
    if (align !== 'left') {
      const w = textWidth(clean, f, size) + charSpace * Math.max(0, clean.length - 1)
      drawX = align === 'center' ? x - w / 2 : x - w
    }
    this.#text(clean, drawX, y, { font: f, size, color, charSpace })
    return this
  }

  /** Wrapped, centered block used on the cover. Returns the new y. */
  centeredBlock(text, y, { font = 'body', size = 10, color = COLORS.white, leading, maxWidth } = {}) {
    const f = FONTS[font]
    const width = maxWidth ?? this.contentWidth
    const step = leading ?? size * 1.35
    let cursor = y
    for (const line of wrap(toAscii(text), f, size, width)) {
      this.textAt(line, PAGE_W / 2, cursor, { font, size, color, align: 'center' })
      cursor -= step
    }
    return cursor
  }

  // ── page management ────────────────────────────────────────────────────────

  newPage({ background = null, chrome = true } = {}) {
    this.ops = []
    this.pages.push(this.ops)
    this.suppressChrome = !chrome
    if (background) {
      this.rect(0, 0, PAGE_W, PAGE_H, background)
    }
    this.y = PAGE_H - MARGIN_TOP
    if (chrome) this.#drawRunningHeader()
    return this
  }

  #drawRunningHeader() {
    if (!this.meta.runningHeader) return
    this.rect(0, PAGE_H - 26, PAGE_W, 26, COLORS.navy)
    this.#text(toAscii(this.meta.runningHeader), MARGIN_X, PAGE_H - 18, {
      font: FONTS.bold,
      size: 7.5,
      color: COLORS.gold,
      charSpace: 1.1,
    })
  }

  /** Ensure `needed` points of vertical space remain, starting a page if not. */
  ensure(needed) {
    if (this.y - needed < MARGIN_BOTTOM) this.newPage()
    return this
  }

  // ── primitives ─────────────────────────────────────────────────────────────

  rect(x, y, w, h, color) {
    this.ops.push(`${rgb(color)} rg`, `${x} ${y} ${w} ${h} re f`)
    return this
  }

  #text(text, x, y, { font, size, color, charSpace = 0 }) {
    this.ops.push(
      'BT',
      `${rgb(color)} rg`,
      `/${font.ref} ${size} Tf`,
      charSpace ? `${charSpace} Tc` : '0 Tc',
      `1 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} Tm`,
      `(${escape(text)}) Tj`,
      'ET',
    )
    return this
  }

  // ── flowing content ────────────────────────────────────────────────────────

  spacer(points) {
    this.y -= points
    return this
  }

  rule(color = COLORS.border) {
    this.ensure(14)
    this.rect(MARGIN_X, this.y - 4, this.contentWidth, 0.8, color)
    this.y -= 14
    return this
  }

  eyebrow(text, color = COLORS.goldDark) {
    this.ensure(22)
    this.#text(toAscii(text).toUpperCase(), MARGIN_X, this.y - 9, {
      font: FONTS.bold,
      size: 8,
      color,
      charSpace: 1.4,
    })
    this.y -= 22
    return this
  }

  /** Section eyebrow with the gold rule beneath it, as on the market reports. */
  sectionMark(text) {
    this.ensure(34)
    this.#text(toAscii(text).toUpperCase(), MARGIN_X, this.y - 9, {
      font: FONTS.bold,
      size: 8,
      color: COLORS.goldDark,
      charSpace: 1.7,
    })
    this.y -= 18
    this.rect(MARGIN_X, this.y, this.contentWidth, 0.9, COLORS.goldDark)
    this.y -= 24
    return this
  }

  /**
   * Row of headline figures: tinted tile, gold cap rule, big navy number,
   * letterspaced label, optional year-over-year line.
   */
  statTiles(tiles, { height = 62, gap = 10 } = {}) {
    this.ensure(height + 20)
    const w = (this.contentWidth - gap * (tiles.length - 1)) / tiles.length
    const top = this.y
    tiles.forEach((tile, i) => {
      const x = MARGIN_X + i * (w + gap)
      this.rect(x, top - height, w, height, COLORS.paper)
      this.rect(x, top - 2.4, w, 2.4, COLORS.gold)
      this.textAt(tile.value, x + w / 2, top - 26, {
        font: 'bold',
        size: 17,
        color: COLORS.navy,
        align: 'center',
      })
      this.textAt(tile.label.toUpperCase(), x + w / 2, top - 40, {
        font: 'body',
        size: 6.4,
        color: COLORS.slate,
        charSpace: 0.7,
        align: 'center',
      })
      if (tile.sub) {
        this.textAt(tile.sub.toUpperCase(), x + w / 2, top - 51, {
          font: 'body',
          size: 6.4,
          color: COLORS.slateLight,
          charSpace: 0.7,
          align: 'center',
        })
      }
    })
    this.y = top - height - 20
    return this
  }

  /**
   * Year-over-year comparison table. `rows` are [label, thisYear, lastYear,
   * change] and the change cell is coloured by its leading sign.
   */
  comparisonTable(headers, rows) {
    const rowH = 21
    const headH = 20
    this.ensure(headH + rows.length * rowH + 16)
    const widths = [0.4, 0.2, 0.2, 0.2].map((f) => f * this.contentWidth)
    const xs = widths.reduce((acc, w, i) => [...acc, acc[i] + w], [MARGIN_X])
    const top = this.y

    this.rect(MARGIN_X, top - headH, this.contentWidth, headH, COLORS.navy)
    headers.forEach((h, i) => {
      const centered = i > 0
      this.textAt(h, centered ? xs[i] + widths[i] / 2 : xs[i] + 10, top - 13.5, {
        font: 'bold',
        size: 7.8,
        color: i === 0 ? COLORS.white : COLORS.gold,
        align: centered ? 'center' : 'left',
      })
    })

    rows.forEach((row, r) => {
      const rowTop = top - headH - r * rowH
      if (r % 2) this.rect(MARGIN_X, rowTop - rowH, this.contentWidth, rowH, COLORS.paper)
      row.forEach((cell, i) => {
        const centered = i > 0
        let color = COLORS.slate
        let font = 'body'
        if (i === 0) {
          color = COLORS.navy
          font = 'bold'
        } else if (i === 3) {
          font = 'bold'
          color = cell.startsWith('-') ? COLORS.down : cell.startsWith('+') ? COLORS.up : COLORS.slate
        }
        this.textAt(cell, centered ? xs[i] + widths[i] / 2 : xs[i] + 10, rowTop - 13.5, {
          font,
          size: 8.2,
          color,
          align: centered ? 'center' : 'left',
        })
      })
    })

    const bottom = top - headH - rows.length * rowH
    this.rect(MARGIN_X, bottom, this.contentWidth, 0.7, COLORS.border)
    this.y = bottom - 16
    return this
  }

  /** Centered navy call-to-action block. */
  callout({ heading, body, link }) {
    const size = 9
    const leading = 14
    const pad = 20
    const lines = wrap(toAscii(body), FONTS.body, size, this.contentWidth - pad * 2)
    const height = pad * 2 + 22 + lines.length * leading + (link ? 22 : 0)
    this.ensure(height + 18)
    const top = this.y
    this.rect(MARGIN_X, top - height, this.contentWidth, height, COLORS.navy)

    let ty = top - pad - 12
    this.textAt(heading, PAGE_W / 2, ty, { font: 'bold', size: 13, color: COLORS.white, align: 'center' })
    ty -= 22
    for (const line of lines) {
      this.textAt(line, PAGE_W / 2, ty, { font: 'body', size, color: COLORS.white, align: 'center' })
      ty -= leading
    }
    if (link) {
      ty -= 6
      this.textAt(link, PAGE_W / 2, ty, { font: 'bold', size: 9.5, color: COLORS.gold, align: 'center' })
    }
    this.y = top - height - 18
    return this
  }

  heading(text, { size = 19, color = COLORS.navy, gap = 12 } = {}) {
    const lines = wrap(toAscii(text), FONTS.serif, size, this.contentWidth)
    this.ensure(lines.length * (size + 5) + gap)
    for (const line of lines) {
      this.#text(line, MARGIN_X, this.y - size, { font: FONTS.serif, size, color })
      this.y -= size + 5
    }
    this.y -= gap
    return this
  }

  subheading(text, { color = COLORS.navy } = {}) {
    const size = 11
    const lines = wrap(toAscii(text), FONTS.bold, size, this.contentWidth)
    this.ensure(lines.length * (size + 4) + 6)
    for (const line of lines) {
      this.#text(line, MARGIN_X, this.y - size, { font: FONTS.bold, size, color })
      this.y -= size + 4
    }
    this.y -= 6
    return this
  }

  paragraph(text, { size = 9.6, leading = 14.6, color = COLORS.slate, indent = 0, gap = 11 } = {}) {
    const width = this.contentWidth - indent
    const lines = wrap(toAscii(text), FONTS.body, size, width)
    for (const line of lines) {
      this.ensure(leading)
      this.#text(line, MARGIN_X + indent, this.y - size, { font: FONTS.body, size, color })
      this.y -= leading
    }
    this.y -= gap
    return this
  }

  /** A bullet with an optional bold lead-in ("Title. Body text..."). */
  bullet(title, body) {
    const size = 9.6
    const leading = 14.4
    const indent = 16
    this.ensure(leading * 2)
    this.rect(MARGIN_X + 3, this.y - 6.5, 3.2, 3.2, COLORS.gold)

    if (title) {
      const titleLines = wrap(toAscii(title), FONTS.bold, size, this.contentWidth - indent)
      for (const line of titleLines) {
        this.ensure(leading)
        this.#text(line, MARGIN_X + indent, this.y - size, {
          font: FONTS.bold,
          size,
          color: COLORS.navy,
        })
        this.y -= leading
      }
    }
    if (body) {
      this.paragraph(body, { size, leading, indent, gap: title ? 9 : 7 })
    } else {
      this.y -= 4
    }
    return this
  }

  /** Label on the left, wrapped value on the right — the comparison layout. */
  labelledRow(label, value, { labelWidth = 132 } = {}) {
    const size = 9.2
    const leading = 13.6
    const labelSize = 7.4
    const labelCharSpace = 0.8
    const gutter = 12
    const valueWidth = this.contentWidth - labelWidth
    const valueLines = wrap(toAscii(value), FONTS.body, size, valueWidth)
    // The label is letter-spaced and set in the gutter column, so it has to wrap
    // on its own budget — left unwrapped, a long label runs straight under the
    // value and the two collide.
    const labelLines = wrap(
      toAscii(label).toUpperCase(),
      FONTS.bold,
      labelSize,
      labelWidth - gutter,
      labelCharSpace,
    )
    this.ensure(Math.max(labelLines.length, valueLines.length) * leading + 6)

    const top = this.y
    let ly = top
    for (const line of labelLines) {
      this.#text(line, MARGIN_X, ly - size, {
        font: FONTS.bold,
        size: labelSize,
        color: COLORS.slateLight,
        charSpace: labelCharSpace,
      })
      ly -= leading
    }
    let vy = top
    for (const line of valueLines) {
      this.#text(line, MARGIN_X + labelWidth, vy - size, {
        font: FONTS.body,
        size,
        color: COLORS.slate,
      })
      vy -= leading
    }
    this.y = Math.min(ly, vy) - 5
    return this
  }

  /** Panel with a tinted background — used for callouts and disclaimers. */
  panel(lines, { fill = COLORS.paper, accent = COLORS.gold, title = null } = {}) {
    const size = 8.6
    const leading = 13
    const pad = 14
    const wrapped = lines.flatMap((line) =>
      wrap(toAscii(line), FONTS.body, size, this.contentWidth - pad * 2 - 6),
    )
    const titleLines = title
      ? wrap(toAscii(title), FONTS.bold, 9.6, this.contentWidth - pad * 2 - 6)
      : []
    const height = pad * 2 + wrapped.length * leading + titleLines.length * 15
    this.ensure(height + 12)

    const top = this.y
    this.rect(MARGIN_X, top - height, this.contentWidth, height, fill)
    this.rect(MARGIN_X, top - height, 3, height, accent)

    let ty = top - pad
    for (const line of titleLines) {
      this.#text(line, MARGIN_X + pad + 6, ty - 9.6, {
        font: FONTS.bold,
        size: 9.6,
        color: COLORS.navy,
      })
      ty -= 15
    }
    for (const line of wrapped) {
      this.#text(line, MARGIN_X + pad + 6, ty - size, {
        font: FONTS.body,
        size,
        color: COLORS.slate,
      })
      ty -= leading
    }
    this.y = top - height - 16
    return this
  }

  /** Full-bleed navy cover. */
  cover({ eyebrow, title, subtitle, statLines = [], byline, footnote }) {
    this.newPage({ background: COLORS.navy, chrome: false })

    this.rect(0, PAGE_H - 150, PAGE_W, 5, COLORS.gold)

    let y = PAGE_H - 216
    this.#text(toAscii(eyebrow).toUpperCase(), MARGIN_X, y, {
      font: FONTS.bold,
      size: 9,
      color: COLORS.gold,
      charSpace: 2.6,
    })

    y -= 48
    for (const line of wrap(toAscii(title), FONTS.serif, 31, this.contentWidth - 40)) {
      this.#text(line, MARGIN_X, y, { font: FONTS.serif, size: 31, color: COLORS.white })
      y -= 38
    }

    y -= 12
    for (const line of wrap(toAscii(subtitle), FONTS.body, 11.5, this.contentWidth - 70)) {
      this.#text(line, MARGIN_X, y, { font: FONTS.body, size: 11.5, color: COLORS.slateLight })
      y -= 17
    }

    if (statLines.length) {
      y -= 26
      this.rect(MARGIN_X, y + 12, 46, 2, COLORS.gold)
      y -= 16
      for (const line of statLines) {
        this.#text(toAscii(line), MARGIN_X, y, {
          font: FONTS.bold,
          size: 10,
          color: COLORS.gold,
        })
        y -= 18
      }
    }

    this.#text(toAscii(byline), MARGIN_X, 128, {
      font: FONTS.bold,
      size: 10.5,
      color: COLORS.white,
    })
    let fy = 110
    for (const line of wrap(toAscii(footnote), FONTS.body, 8.6, this.contentWidth - 60)) {
      this.#text(line, MARGIN_X, fy, { font: FONTS.body, size: 8.6, color: COLORS.slateLight })
      fy -= 12.5
    }
    return this
  }

  // ── output ─────────────────────────────────────────────────────────────────

  #paintFooters() {
    const bar = this.meta.footerBar
    this.pages.forEach((ops, i) => {
      if (i === 0 || this.noFooter.has(i)) return // cover carries no footer
      if (bar) {
        // Navy footer band: house style on the market reports.
        ops.push(`${rgb(COLORS.navy)} rg`, `0 0 ${PAGE_W} 30 re f`)
        ops.push(
          'BT',
          `${rgb(COLORS.slateLight)} rg`,
          `/${FONTS.body.ref} 7 Tf`,
          '0 Tc',
          `1 0 0 1 ${MARGIN_X} 12 Tm`,
          `(${escape(toAscii(bar))}) Tj`,
          'ET',
        )
        const label = `Page ${i + 1}`
        const w = textWidth(label, FONTS.bold, 7)
        ops.push(
          'BT',
          `${rgb(COLORS.gold)} rg`,
          `/${FONTS.bold.ref} 7 Tf`,
          '0 Tc',
          `1 0 0 1 ${(PAGE_W - MARGIN_X - w).toFixed(2)} 12 Tm`,
          `(${escape(label)}) Tj`,
          'ET',
        )
        return
      }
      const label = `${this.meta.author}  |  Page ${i + 1} of ${this.pages.length}`
      ops.push(
        'BT',
        `${rgb(COLORS.slateLight)} rg`,
        `/${FONTS.body.ref} 7.6 Tf`,
        '0 Tc',
        `1 0 0 1 ${MARGIN_X} 40 Tm`,
        `(${escape(toAscii(label))}) Tj`,
        'ET',
      )
    })
  }

  toBuffer() {
    this.#paintFooters()

    const objects = []
    const add = (body) => {
      objects.push(body)
      return objects.length // 1-based object number
    }

    // Fonts. When an embedded face is configured the glyph outlines travel with
    // the file; otherwise we fall back to the standard 14 and state /Widths so a
    // substituting reader at least advances correctly.
    const fontRefs = {}
    const embeddedFileRefs = new Map()
    for (const font of Object.values(FONTS)) {
      if (font.embedded) {
        const { baseFont, data, descriptor } = font.embedded
        if (!embeddedFileRefs.has(baseFont)) {
          embeddedFileRefs.set(
            baseFont,
            add(
              `<< /Length ${data.length} /Length1 ${data.length} >>\n` +
                `stream\n${data.toString('latin1')}\nendstream`,
            ),
          )
        }
        const descriptorRef = add(
          `<< /Type /FontDescriptor /FontName /${baseFont} /Flags ${descriptor.flags} ` +
            `/FontBBox [${descriptor.bbox.join(' ')}] /ItalicAngle ${descriptor.italicAngle} ` +
            `/Ascent ${descriptor.ascent} /Descent ${descriptor.descent} ` +
            `/CapHeight ${descriptor.capHeight} /StemV ${descriptor.stemV} ` +
            `/FontFile2 ${embeddedFileRefs.get(baseFont)} 0 R >>`,
        )
        fontRefs[font.ref] = add(
          `<< /Type /Font /Subtype /TrueType /BaseFont /${baseFont} /Encoding /WinAnsiEncoding ` +
            `/FirstChar 32 /LastChar 126 /Widths [${font.widths.join(' ')}] ` +
            `/FontDescriptor ${descriptorRef} 0 R >>`,
        )
        continue
      }
      fontRefs[font.ref] = add(
        `<< /Type /Font /Subtype /Type1 /BaseFont /${font.base} /Encoding /WinAnsiEncoding ` +
          `/FirstChar 32 /LastChar 126 /Widths [${font.widths.join(' ')}] >>`,
      )
    }

    // JPEG images ride as DCTDecode XObjects — the encoded bytes go into the
    // stream untouched, which is why callers must hand over baseline JPEG.
    const imageRefs = {}
    for (const [name, img] of this.images) {
      imageRefs[name] = add(
        `<< /Type /XObject /Subtype /Image /Width ${img.width} /Height ${img.height} ` +
          `/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${img.data.length} >>\n` +
          `stream\n${img.data.toString('latin1')}\nendstream`,
      )
    }

    const pagesObjNumber = objects.length + 1
    add('') // placeholder for the Pages node, filled in below

    const pageNumbers = []
    for (const ops of this.pages) {
      const stream = ops.join('\n')
      const contentNumber = add(
        `<< /Length ${Buffer.byteLength(stream, 'latin1')} >>\nstream\n${stream}\nendstream`,
      )
      const fontEntries = Object.entries(fontRefs)
        .map(([ref, num]) => `/${ref} ${num} 0 R`)
        .join(' ')
      const imageEntries = Object.entries(imageRefs)
        .map(([name, num]) => `/${name} ${num} 0 R`)
        .join(' ')
      const xobject = imageEntries ? ` /XObject << ${imageEntries} >>` : ''
      pageNumbers.push(
        add(
          `<< /Type /Page /Parent ${pagesObjNumber} 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] ` +
            `/Resources << /Font << ${fontEntries} >>${xobject} >> /Contents ${contentNumber} 0 R >>`,
        ),
      )
    }

    objects[pagesObjNumber - 1] =
      `<< /Type /Pages /Count ${pageNumbers.length} /Kids [${pageNumbers
        .map((n) => `${n} 0 R`)
        .join(' ')}] >>`

    const infoNumber = add(
      `<< /Title (${escape(toAscii(this.meta.title))}) /Author (${escape(
        toAscii(this.meta.author),
      )}) /Subject (${escape(toAscii(this.meta.subject ?? ''))}) /Producer (DO Homes Group) >>`,
    )
    const catalogNumber = add(`<< /Type /Catalog /Pages ${pagesObjNumber} 0 R >>`)

    let pdf = '%PDF-1.4\n'
    const offsets = [0]
    objects.forEach((body, i) => {
      offsets.push(Buffer.byteLength(pdf, 'latin1'))
      pdf += `${i + 1} 0 obj\n${body}\nendobj\n`
    })

    const xrefOffset = Buffer.byteLength(pdf, 'latin1')
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
    for (let i = 1; i <= objects.length; i++) {
      pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`
    }
    pdf +=
      `trailer\n<< /Size ${objects.length + 1} /Root ${catalogNumber} 0 R ` +
      `/Info ${infoNumber} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`

    return Buffer.from(pdf, 'latin1')
  }
}
