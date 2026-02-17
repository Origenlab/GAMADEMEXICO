#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const BLOG_DIR = path.join(process.cwd(), 'src', 'content', 'blog');
const CHECK_ONLY = process.argv.includes('--check');

const categoryToCatalog = {
  monitores: '/monitores-contra-incendios',
  boquillas: '/boquillas-contra-incendios',
  mangueras: '/mangueras-contra-incendios',
  valvulas: '/valvulas-contra-incendios',
  'conexiones-herrajes': '/conexiones-herrajes-contra-incendios',
  'gabinetes-hidrantes': '/gabinetes-hidrantes-contra-incendios',
};

const categoryToBlog = {
  monitores: '/blog/monitores-contra-incendios',
  boquillas: '/blog/boquillas-contra-incendios',
  mangueras: '/blog/mangueras-contra-incendios',
  valvulas: '/blog/valvulas-contra-incendios',
  'conexiones-herrajes': '/blog/conexiones-herrajes-contra-incendios',
  'gabinetes-hidrantes': '/blog/gabinetes-hidrantes-contra-incendios',
};

const categoryToLabel = {
  monitores: 'Monitores contra incendios',
  boquillas: 'Boquillas contra incendios',
  mangueras: 'Mangueras contra incendios',
  valvulas: 'Válvulas contra incendios',
  'conexiones-herrajes': 'Conexiones y herrajes contra incendios',
  'gabinetes-hidrantes': 'Gabinetes e hidrantes contra incendios',
};

const categoryRecommended = {
  monitores: [
    '/blog/monitores-contra-incendios/manual-tecnico-monitores-contra-incendios-empresas',
    '/blog/monitores-contra-incendios/auditoria-monitores-contra-incendios-empresas-mexico',
  ],
  boquillas: [
    '/blog/boquillas-contra-incendios/ingenieria-boquillas-contra-incendios-proyectos-industriales',
    '/blog/boquillas-contra-incendios/cumplimiento-legal-boquillas-contra-incendios-mexico-2026',
  ],
  mangueras: [
    '/blog/mangueras-contra-incendios/lineamientos-mangueras-contra-incendios-empresas-mexico',
    '/blog/mangueras-contra-incendios/como-elegir-manguera-contra-incendios',
  ],
  valvulas: [
    '/blog/valvulas-contra-incendios/normativa-nfpa-valvulas-contra-incendios',
    '/servicios/mantenimiento',
  ],
  'conexiones-herrajes': ['/conexiones-herrajes-contra-incendios', '/servicios/asesoria'],
  'gabinetes-hidrantes': [
    '/blog/gabinetes-hidrantes-contra-incendios/requisitos-legales-equipos-contra-incendios-mexico-empresas',
    '/blog/gabinetes-hidrantes-contra-incendios/inspeccion-proteccion-civil-equipos-contra-incendios-empresas-mexico',
  ],
};

function extractField(source, field) {
  const match = source.match(new RegExp(`^${field}:\\s*"([^"]+)"`, 'm'));
  return match ? match[1] : '';
}

function buildInterlinkBlock(category) {
  const label = categoryToLabel[category] || 'equipos contra incendios';
  const catalog = categoryToCatalog[category] || '/equipos';
  const blogHub = categoryToBlog[category] || '/blog';
  const recommended = categoryRecommended[category] || ['/blog', '/equipos'];

  return [
    '---',
    '',
    '## Interlinking recomendado Gama de México',
    '',
    'Para facilitar tu navegación técnica y comercial dentro del sitio, revisa estas rutas estratégicas:',
    '',
    `- [Catálogo de ${label}](${catalog})`,
    `- [Guías del blog sobre ${label.toLowerCase()}](${blogHub})`,
    '- [Todos los equipos contra incendios](/equipos)',
    '- [Asesoría técnica especializada](/servicios/asesoria)',
    '- [Solicitar cotización empresarial](/servicios/cotizaciones)',
    `- [Artículo recomendado 1](${recommended[0]})`,
    `- [Artículo recomendado 2](${recommended[1]})`,
    '',
  ].join('\n');
}

function buildInlineImageBlock(image, imageAlt, category) {
  const label = imageAlt || `Imagen técnica de ${categoryToLabel[category] || 'equipos contra incendios'}`;
  return [
    '## Imagen técnica de referencia',
    '',
    `![${label}](${image})`,
    '*Descripción técnica: referencia visual del equipo y su aplicación en proyectos de protección contra incendios en México.*',
    '',
  ].join('\n');
}

function normalizeArticle(filePath) {
  const source = fs.readFileSync(filePath, 'utf8');
  const category = extractField(source, 'categoria');
  const image = extractField(source, 'imagen');
  const imageAlt = extractField(source, 'imagenAlt');

  const hasInterlink = /##\s+Interlinking recomendado Gama de México|##\s+Interlinking estratégico|Rutas estratégicas para tu proyecto/i.test(source);
  const inlineImages = (source.match(/!\[[^\]]*\]\([^)]+\)/g) || []).length;

  let output = source;
  let changed = false;

  if (!hasInterlink) {
    output = `${output.trimEnd()}\n\n${buildInterlinkBlock(category)}`;
    changed = true;
  }

  if (inlineImages === 0 && image) {
    output = `${output.trimEnd()}\n\n${buildInlineImageBlock(image, imageAlt, category)}`;
    changed = true;
  }

  if (changed && !CHECK_ONLY) {
    fs.writeFileSync(filePath, output.endsWith('\n') ? output : `${output}\n`);
  }

  return { changed, hasInterlink: hasInterlink || changed, inlineImages: inlineImages + (inlineImages === 0 && image ? 1 : 0) };
}

function main() {
  if (!fs.existsSync(BLOG_DIR)) {
    console.error(`[normalize-blog-content] Directory not found: ${BLOG_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(BLOG_DIR)
    .filter((name) => name.endsWith('.md'))
    .sort()
    .map((name) => path.join(BLOG_DIR, name));

  let changedCount = 0;
  let missingInterlink = 0;
  let missingInlineImage = 0;

  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8');
    const hasInterlink = /##\s+Interlinking recomendado Gama de México|##\s+Interlinking estratégico|Rutas estratégicas para tu proyecto/i.test(source);
    const inlineImages = (source.match(/!\[[^\]]*\]\([^)]+\)/g) || []).length;

    if (!hasInterlink) missingInterlink += 1;
    if (inlineImages === 0) missingInlineImage += 1;

    const result = normalizeArticle(file);
    if (result.changed) {
      changedCount += 1;
      console.log(`[normalize-blog-content] Updated: ${path.basename(file)}`);
    }
  }

  const mode = CHECK_ONLY ? 'check' : 'write';
  console.log(`[normalize-blog-content] Mode: ${mode}`);
  console.log(`[normalize-blog-content] Files scanned: ${files.length}`);
  console.log(`[normalize-blog-content] Files updated: ${changedCount}`);
  console.log(`[normalize-blog-content] Missing interlink before run: ${missingInterlink}`);
  console.log(`[normalize-blog-content] Missing inline image before run: ${missingInlineImage}`);

  if (CHECK_ONLY && (missingInterlink > 0 || missingInlineImage > 0)) {
    process.exitCode = 2;
  }
}

main();
