// Just enough TrueType parsing to embed a font in a PDF: the advance widths for
// the ASCII range, and the handful of FontDescriptor metrics a reader requires.
//
// Why embed at all: with the standard-14 fonts a PDF carries no glyph outlines,
// so a reader without real Helvetica substitutes something else. It honours the
// advance widths we declare but draws narrower glyphs inside them, which reads
// as badly-tracked text — and that is exactly what happens when the cover
// images are rasterised at build time. Embedding makes every renderer agree.
//
// The font used is Liberation Sans (SIL Open Font License), which ships inside
// pdfjs-dist and is metrically compatible with Helvetica/Arial.

import { readFile } from 'node:fs/promises'

function tableDirectory(buf) {
  const numTables = buf.readUInt16BE(4)
  const tables = {}
  for (let i = 0; i < numTables; i++) {
    const p = 12 + i * 16
    tables[buf.toString('latin1', p, p + 4).trim()] = {
      offset: buf.readUInt32BE(p + 8),
      length: buf.readUInt32BE(p + 12),
    }
  }
  return tables
}

/** Unicode code point -> glyph id, via the (3,1) format-4 cmap subtable. */
function buildCmap(buf, cmapOffset) {
  const numSubtables = buf.readUInt16BE(cmapOffset + 2)
  let subtableOffset = null
  for (let i = 0; i < numSubtables; i++) {
    const p = cmapOffset + 4 + i * 8
    const platform = buf.readUInt16BE(p)
    const encoding = buf.readUInt16BE(p + 2)
    const offset = buf.readUInt32BE(p + 4)
    if ((platform === 3 && encoding === 1) || (platform === 0 && subtableOffset === null)) {
      subtableOffset = cmapOffset + offset
    }
  }
  if (subtableOffset === null) throw new Error('No usable cmap subtable')
  if (buf.readUInt16BE(subtableOffset) !== 4) throw new Error('Only cmap format 4 is supported')

  const segCount = buf.readUInt16BE(subtableOffset + 6) / 2
  const endBase = subtableOffset + 14
  const startBase = endBase + segCount * 2 + 2
  const deltaBase = startBase + segCount * 2
  const rangeBase = deltaBase + segCount * 2

  return (code) => {
    for (let i = 0; i < segCount; i++) {
      const end = buf.readUInt16BE(endBase + i * 2)
      if (code > end) continue
      const start = buf.readUInt16BE(startBase + i * 2)
      if (code < start) return 0
      const delta = buf.readInt16BE(deltaBase + i * 2)
      const rangeOffset = buf.readUInt16BE(rangeBase + i * 2)
      if (rangeOffset === 0) return (code + delta) & 0xffff
      const glyphAddr = rangeBase + i * 2 + rangeOffset + (code - start) * 2
      const gid = buf.readUInt16BE(glyphAddr)
      return gid === 0 ? 0 : (gid + delta) & 0xffff
    }
    return 0
  }
}

/**
 * Load a TrueType file and return everything the PDF writer needs.
 * `widths` is indexed 0..94 for character codes 32..126, in 1/1000 em — the
 * same shape the writer's built-in metric tables use.
 */
export async function loadTrueType(file, { baseFont }) {
  const data = await readFile(file)
  const tables = tableDirectory(data)
  for (const required of ['head', 'hhea', 'hmtx', 'cmap', 'OS/2']) {
    if (!tables[required]) throw new Error(`${file} is missing the ${required} table`)
  }

  const unitsPerEm = data.readUInt16BE(tables.head.offset + 18)
  const scale = (v) => Math.round((v * 1000) / unitsPerEm)

  const numberOfHMetrics = data.readUInt16BE(tables.hhea.offset + 34)
  const hmtx = tables.hmtx.offset
  const advance = (gid) => {
    const i = Math.min(gid, numberOfHMetrics - 1)
    return data.readUInt16BE(hmtx + i * 4)
  }

  const lookup = buildCmap(data, tables.cmap.offset)
  const widths = []
  for (let code = 32; code <= 126; code++) widths.push(scale(advance(lookup(code))))

  const os2 = tables['OS/2'].offset
  const head = tables.head.offset

  return {
    baseFont,
    data,
    widths,
    descriptor: {
      flags: 32, // nonsymbolic
      italicAngle: 0,
      ascent: scale(data.readInt16BE(os2 + 68)), // sTypoAscender
      descent: scale(data.readInt16BE(os2 + 70)), // sTypoDescender
      capHeight: scale(data.readInt16BE(os2 + 68)),
      stemV: 80,
      bbox: [
        scale(data.readInt16BE(head + 36)),
        scale(data.readInt16BE(head + 38)),
        scale(data.readInt16BE(head + 40)),
        scale(data.readInt16BE(head + 42)),
      ],
    },
  }
}
