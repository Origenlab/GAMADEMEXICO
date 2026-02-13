#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, 'public');
const IMG_DIR = path.join(PUBLIC_DIR, 'img');
const SCAN_DIRS = [path.join(ROOT, 'src'), path.join(ROOT, 'public')];
const IMAGE_EXTS = new Set(['.avif', '.webp', '.jpg', '.jpeg', '.png', '.gif', '.svg']);
const RASTER_EXTS = new Set(['.avif', '.webp', '.jpg', '.jpeg', '.png', '.gif']);
const TEXT_EXTS = new Set(['.astro', '.md', '.mdx', '.ts', '.js', '.json', '.html', '.css', '.txt', '.xml', '.mjs']);

function walk(dir, onFile) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walk(full, onFile);
    else onFile(full, st);
  }
}

function getDims(file) {
  try {
    const out = execSync(`sips -g pixelWidth -g pixelHeight ${JSON.stringify(file)}`, { encoding: 'utf8' });
    const w = Number((out.match(/pixelWidth:\s*(\d+)/) || [])[1] || 0);
    const h = Number((out.match(/pixelHeight:\s*(\d+)/) || [])[1] || 0);
    return { w, h };
  } catch {
    return { w: 0, h: 0 };
  }
}

const images = [];
walk(PUBLIC_DIR, (file, st) => {
  const ext = path.extname(file).toLowerCase();
  if (!IMAGE_EXTS.has(ext)) return;
  images.push({
    full: file,
    rel: '/' + path.relative(PUBLIC_DIR, file).replace(/\\/g, '/'),
    ext,
    size: st.size,
  });
});

const refs = new Set();
const refRegex = /\/img\/[^\s"'`)><]+/g;
for (const dir of SCAN_DIRS) {
  walk(dir, (file) => {
    const ext = path.extname(file).toLowerCase();
    if (!TEXT_EXTS.has(ext)) return;
    const txt = fs.readFileSync(file, 'utf8');
    let m;
    while ((m = refRegex.exec(txt))) refs.add(m[0]);
  });
}

const missing = [];
for (const ref of refs) {
  if (!fs.existsSync(path.join(PUBLIC_DIR, ref))) missing.push(ref);
}

const allPublicImg = [];
walk(IMG_DIR, (file) => {
  const ext = path.extname(file).toLowerCase();
  if (!IMAGE_EXTS.has(ext)) return;
  allPublicImg.push('/' + path.relative(PUBLIC_DIR, file).replace(/\\/g, '/'));
});

const unused = allPublicImg.filter((p) => !refs.has(p));

const dimsCount = new Map();
const small = [];
const tooLarge = [];
for (const img of images) {
  if (!RASTER_EXTS.has(img.ext)) continue;
  const { w, h } = getDims(img.full);
  if (!w || !h) continue;
  const key = `${w}x${h}`;
  dimsCount.set(key, (dimsCount.get(key) || 0) + 1);
  if (w < 300 || h < 300) small.push({ ...img, w, h });
  if (w > 2000 || h > 2000) tooLarge.push({ ...img, w, h });
}

const extStats = new Map();
let totalSize = 0;
for (const img of images) {
  totalSize += img.size;
  const current = extStats.get(img.ext) || { count: 0, size: 0 };
  current.count += 1;
  current.size += img.size;
  extStats.set(img.ext, current);
}

const cdnBase = (process.env.PUBLIC_EWWW_CDN_BASE || '').trim();

console.log('IMAGE AUDIT REPORT');
console.log('==================');
console.log(`images_total: ${images.length}`);
console.log(`images_total_size_mb: ${(totalSize / 1024 / 1024).toFixed(2)}`);
console.log(`referenced_img_paths: ${refs.size}`);
console.log(`missing_img_files: ${missing.length}`);
console.log(`unused_img_files: ${unused.length}`);
console.log(`small_images_lt_300px: ${small.length}`);
console.log(`oversized_images_gt_2000px: ${tooLarge.length}`);
console.log(`ewww_cdn_env_configured: ${cdnBase ? 'yes' : 'no'}`);
if (cdnBase) console.log(`ewww_cdn_base: ${cdnBase}`);

console.log('\nformat_breakdown:');
for (const [ext, stat] of [...extStats.entries()].sort((a, b) => b[1].size - a[1].size)) {
  console.log(`  ${ext}: ${stat.count} files, ${(stat.size / 1024 / 1024).toFixed(2)} MB`);
}

console.log('\ntop_dimensions:');
for (const [dim, count] of [...dimsCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10)) {
  console.log(`  ${dim}: ${count}`);
}

if (missing.length) {
  console.log('\nmissing_examples:');
  for (const item of missing.slice(0, 20)) console.log(`  ${item}`);
}

if (unused.length) {
  console.log('\nunused_examples:');
  for (const item of unused.slice(0, 20)) console.log(`  ${item}`);
}

const failOnMissing = process.argv.includes('--fail-on-missing');
if (failOnMissing && missing.length > 0) {
  console.error('\nFAIL: missing image references detected.');
  process.exit(1);
}
