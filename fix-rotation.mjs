import sharp from 'sharp'
import { readdir, stat } from 'fs/promises'
import { join, extname } from 'path'

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

const exts = new Set(['.jpg', '.jpeg', '.JPG', '.JPEG', '.png', '.PNG'])
const files = (await walk('./public/public')).filter(f => exts.has(extname(f)))

console.log(`Fixing rotation on ${files.length} images...`)
let fixed = 0

for (const file of files) {
  try {
    const tmp = file + '.rot'
    await sharp(file).rotate().toFile(tmp)
    const { rename, unlink } = await import('fs/promises')
    await unlink(file)
    await rename(tmp, file)
    fixed++
  } catch (e) {
    console.error(`  skip: ${file} — ${e.message}`)
  }
}

console.log(`Done. Fixed rotation on ${fixed} images.`)
