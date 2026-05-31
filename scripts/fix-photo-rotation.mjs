import sharp from 'sharp'
import { readdir, writeFile } from 'fs/promises'
import { join, extname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const PUBLIC_DIR = join(__dirname, '..', 'public', 'public')

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await walk(full)))
    } else {
      const ext = extname(entry.name).toLowerCase()
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        files.push(full)
      }
    }
  }
  return files
}

const files = await walk(PUBLIC_DIR)
console.log(`Found ${files.length} images`)

let fixed = 0
for (const file of files) {
  try {
    const img = sharp(file)
    const meta = await img.metadata()
    if (meta.orientation && meta.orientation !== 1) {
      // .rotate() with no args auto-rotates per EXIF and strips the orientation tag
      const buf = await sharp(file).rotate().toBuffer()
      await writeFile(file, buf)
      console.log(`Fixed: ${file.split('public\\public\\')[1]} (was orientation ${meta.orientation})`)
      fixed++
    }
  } catch (e) {
    console.error(`Error processing ${file}:`, e.message)
  }
}

console.log(`\nDone — fixed ${fixed} of ${files.length} images`)
