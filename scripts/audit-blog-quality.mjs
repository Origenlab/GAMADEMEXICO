#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const BLOG_DIR = path.join(process.cwd(), 'src', 'content', 'blog');
const PUBLIC_DIR = path.join(process.cwd(), 'public');

const MIN_TITLE = 20;
const MAX_TITLE = 70;
const MIN_DESC = 80;
const MAX_DESC = 165;
const MIN_INTERNAL_LINKS = 8;
const MIN_INLINE_IMAGES = 1;
const MIN_H2 = 1;

function readFiles() {
  return fs.readdirSync(BLOG_DIR)
    .filter((name) => name.endsWith('.md'))
    .sort()
    .map((name) => path.join(BLOG_DIR, name));
}

function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?/);
  return match ? match[1] : '';
}

function field(frontmatter, key) {
  const m = frontmatter.match(new RegExp(`^${key}:\\s*"([^"]*)"`, 'm'));
  return m ? m[1] : '';
}

function auditFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const frontmatter = extractFrontmatter(raw);
  const title = field(frontmatter, 'title');
  const description = field(frontmatter, 'description');
  const imagen = field(frontmatter, 'imagen');
  const imagenAlt = field(frontmatter, 'imagenAlt');

  const body = frontmatter ? raw.replace(/^---\n[\s\S]*?\n---\n?/, '') : raw;

  const internalLinks = (body.match(/\[[^\]]+\]\(\/(?!\/)[^)]+\)/g) || []).length;
  const inlineImages = (body.match(/!\[[^\]]*\]\([^)]+\)/g) || []).length;
  const inlineImagePaths = [...body.matchAll(/!\[[^\]]*\]\((\/img\/[^)\s]+)\)/g)].map((m) => m[1]);
  const brokenInlineImages = inlineImagePaths.filter((imgPath) => !fs.existsSync(path.join(PUBLIC_DIR, imgPath.replace(/^\/+/, ''))));
  const h2Count = (body.match(/^##\s+/gm) || []).length;
  const hasInterlink = /##\s+Interlinking recomendado Gama de México|##\s+Interlinking estratégico|Rutas estratégicas para tu proyecto/i.test(body);
  const heroImageExists = Boolean(imagen) && fs.existsSync(path.join(PUBLIC_DIR, imagen.replace(/^\/+/, '')));

  const checks = [
    {
      key: 'title_length',
      ok: title.length >= MIN_TITLE && title.length <= MAX_TITLE,
      detail: `${title.length}`,
      expected: `${MIN_TITLE}-${MAX_TITLE}`,
    },
    {
      key: 'description_length',
      ok: description.length >= MIN_DESC && description.length <= MAX_DESC,
      detail: `${description.length}`,
      expected: `${MIN_DESC}-${MAX_DESC}`,
    },
    {
      key: 'hero_image',
      ok: Boolean(imagen) && imagen.startsWith('/img/'),
      detail: imagen || 'missing',
      expected: 'starts with /img/',
    },
    {
      key: 'hero_image_file',
      ok: heroImageExists,
      detail: heroImageExists ? 'ok' : (imagen || 'missing'),
      expected: 'existing file in /public/img',
    },
    {
      key: 'hero_image_alt',
      ok: Boolean(imagenAlt),
      detail: imagenAlt ? 'ok' : 'missing',
      expected: 'required',
    },
    {
      key: 'interlink_block',
      ok: hasInterlink,
      detail: hasInterlink ? 'ok' : 'missing',
      expected: 'present',
    },
    {
      key: 'internal_links',
      ok: internalLinks >= MIN_INTERNAL_LINKS,
      detail: `${internalLinks}`,
      expected: `>= ${MIN_INTERNAL_LINKS}`,
    },
    {
      key: 'inline_images',
      ok: inlineImages >= MIN_INLINE_IMAGES,
      detail: `${inlineImages}`,
      expected: `>= ${MIN_INLINE_IMAGES}`,
    },
    {
      key: 'inline_image_files',
      ok: brokenInlineImages.length === 0,
      detail: brokenInlineImages.length ? brokenInlineImages.join(', ') : 'ok',
      expected: 'all inline /img paths must exist',
    },
    {
      key: 'h2_sections',
      ok: h2Count >= MIN_H2,
      detail: `${h2Count}`,
      expected: `>= ${MIN_H2}`,
    },
  ];

  const failed = checks.filter((c) => !c.ok);
  return {
    file: path.basename(filePath),
    checks,
    failed,
    ok: failed.length === 0,
    metrics: { internalLinks, inlineImages, h2Count, titleLength: title.length, descriptionLength: description.length },
  };
}

function printReport(results) {
  const okCount = results.filter((r) => r.ok).length;
  const failCount = results.length - okCount;

  console.log('Blog Quality Audit');
  console.log(`- Files scanned: ${results.length}`);
  console.log(`- Pass: ${okCount}`);
  console.log(`- Fail: ${failCount}`);
  console.log('');

  for (const r of results) {
    const status = r.ok ? 'PASS' : 'FAIL';
    console.log(`${status} ${r.file}`);
    if (!r.ok) {
      for (const f of r.failed) {
        console.log(`  - ${f.key}: got ${f.detail}, expected ${f.expected}`);
      }
    }
  }
}

function main() {
  if (!fs.existsSync(BLOG_DIR)) {
    console.error(`[audit-blog-quality] Directory not found: ${BLOG_DIR}`);
    process.exit(1);
  }

  const files = readFiles();
  const results = files.map(auditFile);
  printReport(results);

  const hasFail = results.some((r) => !r.ok);
  if (hasFail) {
    process.exitCode = 2;
  }
}

main();
