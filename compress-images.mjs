import sharp from 'sharp'
import { readdir, stat } from 'fs/promises'
import { join, extname } from 'path'

const ROOT = './public/public'
const MAX_WIDTH = 1920
const QUALITY = 82

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const e of entries) {
    const full = join(dir, e.name)
    if (e.isDirectory()) files.push(...await walk(full))
    else files.push(full)
  }
  return files
}

const exts = new Set(['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'])
const files = (await walk(ROOT)).filter(f => exts.has(extname(f)))

console.log(`Compressing ${files.length} images...`)
let saved = 0
let done = 0

for (const file of files) {
  const before = (await stat(file)).size
  try {
    const img = sharp(file)
    const meta = await img.metadata()
    if (meta.width > MAX_WIDTH) img.resize(MAX_WIDTH)
    const ext = extname(file).toLowerCase()
    if (ext === '.png') {
      await img.png({ quality: QUALITY, compressionLevel: 9 }).toFile(file + '.tmp')
    } else {
      await img.jpeg({ quality: QUALITY, mozjpeg: true }).toFile(file + '.tmp')
    }
    const after = (await stat(file + '.tmp')).size
    if (after < before) {
      const { rename, unlink } = await import('fs/promises')
      await unlink(file)
      await rename(file + '.tmp', file)
      saved += before - after
    } else {
      const { unlink } = await import('fs/promises')
      await unlink(file + '.tmp')
    }
  } catch (e) {
    console.error(`  skip: ${file} — ${e.message}`)
  }
  done++
  if (done % 20 === 0) console.log(`  ${done}/${files.length} done, saved ${(saved/1024/1024).toFixed(0)} MB so far`)
}

console.log(`Done. Total saved: ${(saved/1024/1024).toFixed(0)} MB`)
