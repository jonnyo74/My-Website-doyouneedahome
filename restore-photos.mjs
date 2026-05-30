import { readFile, copyFile, mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import { existsSync } from 'fs'

const SOURCE = 'C:/Users/johno/OneDrive - DO Homes Group/DO Homes Group Master/Website Folders/Doyouneedphotos'
const DEST = './public/public'

const sources = [
  './src/lib/communities.ts',
  './src/app/page.tsx',
]

const referencedPaths = []
for (const src of sources) {
  const content = await readFile(src, 'utf8')
  const matches = content.matchAll(/['"`](\/public\/[^'"`\n]+\.(jpg|jpeg|png|JPG|JPEG|PNG|gif|GIF|webp|WEBP|svg|SVG))[`'"`]/gi)
  for (const [, path] of matches) {
    referencedPaths.push(path)
  }
}

console.log(`Need ${referencedPaths.length} photos`)

let copied = 0
let missing = 0

for (const urlPath of referencedPaths) {
  // urlPath like /public/West Palm/IMG_1347.JPG
  // file lives at SOURCE/West Palm/IMG_1347.JPG
  const relativePath = urlPath.slice('/public/'.length) // e.g. West Palm/IMG_1347.JPG
  const srcFile = join(SOURCE, relativePath)
  const destFile = join(DEST, relativePath)

  if (!existsSync(srcFile)) {
    console.log(`  MISSING: ${relativePath}`)
    missing++
    continue
  }

  await mkdir(dirname(destFile), { recursive: true })
  await copyFile(srcFile, destFile)
  copied++
}

console.log(`Copied: ${copied}, Missing: ${missing}`)
