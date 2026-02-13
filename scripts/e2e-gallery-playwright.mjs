#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const DOMAIN = process.env.GALLERY_BASE_URL || 'https://gamademexico.com';
const PRODUCTS_DIR = path.join(process.cwd(), 'src', 'content', 'productos');
const OUT_JSON = path.join(process.cwd(), 'docs', 'E2E-GALERIAS-PLAYWRIGHT.json');
const OUT_MD = path.join(process.cwd(), 'docs', 'E2E-GALERIAS-PLAYWRIGHT.md');
const CONCURRENCY = Number(process.env.GALLERY_CONCURRENCY || 8);

function getSlugs() {
  return fs
    .readdirSync(PRODUCTS_DIR)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
    .map((f) => f.replace(/\.(md|mdx)$/i, ''))
    .sort();
}

async function runPool(items, limit, worker) {
  let index = 0;
  const results = new Array(items.length);
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (index < items.length) {
      const current = index++;
      results[current] = await worker(items[current]);
    }
  });
  await Promise.all(runners);
  return results;
}

async function testUrl(browser, slug) {
  const url = `${DOMAIN}/productos/${slug}`;
  const context = await browser.newContext();
  const page = await context.newPage();
  try {
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    const status = response ? response.status() : 0;
    if (status !== 200) {
      await context.close();
      return { slug, url, ok: false, reason: `status_${status}` };
    }

    const main = page.locator('#main-product-image');
    const thumbs = page.locator('.thumbnail');

    if ((await main.count()) < 1) {
      await context.close();
      return { slug, url, ok: false, reason: 'missing_main_image' };
    }

    const thumbCount = await thumbs.count();
    if (thumbCount < 2) {
      await context.close();
      return { slug, url, ok: false, reason: `insufficient_thumbnails_${thumbCount}` };
    }

    const firstSrc = await main.first().getAttribute('src');
    await thumbs.nth(1).click({ timeout: 10000 });
    await page.waitForTimeout(150);
    const secondSrc = await main.first().getAttribute('src');

    const activeCount = await page.locator('.thumbnail.thumbnail--active').count();
    const secondIsActive = await thumbs.nth(1).evaluate((el) =>
      el.classList.contains('thumbnail--active')
    );

    const changed = !!firstSrc && !!secondSrc && firstSrc !== secondSrc;
    const ok = changed && activeCount >= 1 && secondIsActive;
    await context.close();

    return {
      slug,
      url,
      ok,
      reason: ok ? 'ok' : 'click_did_not_update_main_image',
      details: { thumbCount, firstSrc, secondSrc, activeCount, secondIsActive },
    };
  } catch (error) {
    await context.close();
    return { slug, url, ok: false, reason: 'exception', error: String(error) };
  }
}

function writeReports(results) {
  const ok = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok);
  const report = {
    generatedAt: new Date().toISOString(),
    domain: DOMAIN,
    total: results.length,
    passed: ok,
    failed: failed.length,
    failures: failed,
  };
  fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2));

  const lines = [];
  lines.push('# E2E Galerias (Playwright)');
  lines.push('');
  lines.push(`Fecha: ${report.generatedAt}`);
  lines.push(`Dominio: ${DOMAIN}`);
  lines.push('');
  lines.push('## Resumen');
  lines.push(`- Productos probados: **${report.total}**`);
  lines.push(`- Exitosos: **${report.passed}**`);
  lines.push(`- Fallidos: **${report.failed}**`);
  lines.push('');
  if (failed.length) {
    lines.push('## Fallas');
    failed.forEach((f) => lines.push(`- \`${f.slug}\`: ${f.reason} (${f.url})`));
  } else {
    lines.push('## Resultado');
    lines.push('- Todas las galerias cambiaron correctamente al hacer clic en thumbnails.');
  }
  lines.push('');
  lines.push(`JSON: \`${path.relative(process.cwd(), OUT_JSON)}\``);
  fs.writeFileSync(OUT_MD, `${lines.join('\n')}\n`);
}

async function main() {
  const slugs = getSlugs();
  const browser = await chromium.launch({ headless: true });
  const results = await runPool(slugs, CONCURRENCY, (slug) => testUrl(browser, slug));
  await browser.close();

  writeReports(results);
  const failed = results.filter((r) => !r.ok);
  console.log(`total=${results.length} passed=${results.length - failed.length} failed=${failed.length}`);
  console.log(`md=${path.relative(process.cwd(), OUT_MD)}`);
  console.log(`json=${path.relative(process.cwd(), OUT_JSON)}`);
  if (failed.length) {
    process.exitCode = 2;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
