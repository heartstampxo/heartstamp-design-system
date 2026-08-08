import sharp from 'sharp'
import { readdirSync, statSync, unlinkSync } from 'fs'
import path from 'path'

/**
 * One-time asset optimizer for the library.
 *
 * Converts every convert-worthy PNG under src/assets to an optimized WebP
 * (resized + compressed), so the Vite lib build embeds small data-URIs instead
 * of tens of MB.
 *
 * Run via `npm run optimize:images`:
 *  1. generates a `.webp` copy next to each source PNG (keep original during dev)
 *  2. prints the source list to delete once imports have been switched to `.webp`
 */

const ROOT = path.resolve(process.cwd(), 'src', 'assets')

const RULES = [
  { test: /stampy[/\\]home-bg\.png$/i, width: 1440, quality: 65 },
  { test: /stampy[/\\]mascot\.png$/i, width: 640, quality: 65 },
  { test: /hs-coin\.png$/i, width: 128, quality: 75 },
  { test: /promo-cards[/\\]/i, width: 600, quality: 80 },
  { test: /[/\\]Mascots[/\\]/i, width: 420, quality: 75 },
]

function ruleFor(file) {
  const rel = path.relative(ROOT, file)
  for (const rule of RULES) {
    if (rule.test.test(rel)) return rule
  }
  return { width: 512, quality: 75 }
}

function walk(dir) {
  const out = []
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith('.')) continue
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) out.push(...walk(full))
    else out.push(full)
  }
  return out
}

function isPng(file) {
  if (path.extname(file).toLowerCase() !== '.png') return false
  if (file.includes('Custom_Icons')) return false
  return statSync(file).size > 4 * 1024
}

async function main() {
  const files = walk(ROOT).filter(isPng)
  const report = []
  let totalBefore = 0
  let totalAfter = 0

  for (const file of files) {
    const outFile = file.replace(/\.png$/i, '.webp')
    if (outFile === file) continue
    const { width, quality } = ruleFor(file)
    const before = statSync(file).size

    await sharp(file).resize({ width, withoutEnlargement: true }).webp({ quality }).toFile(outFile)

    const after = statSync(outFile).size
    totalBefore += before
    totalAfter += after
    report.push({ file, outFile, before, after, width, quality })
  }

  for (const r of report) {
    console.log(
      `${(r.before / 1024 / 1024).toFixed(3)}MB → ${(r.after / 1024 / 1024).toFixed(3)}MB  ${path.relative(ROOT, r.outFile)} (maxw ${r.width}, q${r.quality})`
    )
  }

  console.log('\nTotal: ' + (totalBefore / 1024 / 1024).toFixed(2) + 'MB → ' + (totalAfter / 1024 / 1024).toFixed(2) + 'MB')
  console.log('\nDelete these originals after updating imports to the .webp siblings:')
  for (const r of report) console.log('  ' + r.file.replace(process.cwd() + '/', ''))
}

void main()