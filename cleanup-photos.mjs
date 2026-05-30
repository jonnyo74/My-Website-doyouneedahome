import { readFile, unlink, readdir, stat } from 'fs/promises'
import { join, extname } from 'path'

// Read all source files to find referenced photo paths
const sources = [
  './src/lib/communities.ts',
  './src/app/page.tsx',
]

const referencedPaths = new Set()
for (const src of sources) {
  const content = await readFile(src, 'utf8')
  const matches = content.matchAll(/['"`](\/public\/[^'"`\n]+\.(jpg|jpeg|png|JPG|JPEG|PNG|png|gif|GIF|webp|WEBP|svg|SVG))[`'"`]/gi)
  for (const [, path] of matches) {
    // URL path /public/X maps to file public/public/X
    // Normalize: strip leading slash, convert to lowercase, use forward slashes
    const filePath = 'public/public' + path.slice('/public'.length)
    referencedPaths.add(filePath.toLowerCase().replace(/\\/g, '/'))
  }
}

console.log(`Found ${referencedPaths.size} referenced photos`)

// Walk public/public and delete unreferenced files
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

const exts = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.JPG', '.JPEG', '.PNG'])
const allFiles = (await walk('./public/public')).filter(f => exts.has(extname(f)))

let deleted = 0
let kept = 0
for (const file of allFiles) {
  const normalized = file.replace(/\\/g, '/').toLowerCase()
  if (referencedPaths.has(normalized)) {
    kept++
  } else {
    await unlink(file)
    deleted++
  }
}

console.log(`Kept: ${kept}, Deleted: ${deleted}`)
