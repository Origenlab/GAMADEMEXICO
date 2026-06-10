// =============================================================================
// Extractor de datos de páginas de subcategoría (auditoría 2026)
// Convierte las 33 páginas .astro duplicadas en módulos de datos tipados.
// Uso: node scripts/extract-subcategorias.mjs
// Genera: src/data/subcategorias/<seccion>.generated.json + reporte en consola
// =============================================================================
import fs from 'node:fs';
import path from 'node:path';

const SECCIONES = ['boquillas', 'monitores', 'mangueras', 'valvulas', 'conexiones', 'gabinetes'];
const OUT_DIR = 'src/data/subcategorias';

const lit = (code) => new Function(`return (${code})`)();

/** Decodifica entidades HTML: los textos se guardan limpios y Astro re-escapa al renderizar. */
const decode = (s) =>
  s === undefined
    ? undefined
    : s
        .replace(/&quot;|&#34;/g, '"')
        .replace(/&apos;|&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;|&#38;/g, '&');

/** Extrae un literal balanceado que empieza en `open` tras `anchor`. */
function balanced(src, anchor, open, close) {
  const i = src.indexOf(anchor);
  if (i === -1) return null;
  const start = src.indexOf(open, i + anchor.length - 1);
  if (start === -1) return null;
  let depth = 0;
  for (let j = start; j < src.length; j++) {
    const ch = src[j];
    if (ch === open) depth++;
    else if (ch === close) { depth--; if (depth === 0) return src.slice(start, j + 1); }
  }
  return null;
}

/** Atributo string de un componente: attr="valor" */
const attrStr = (block, name) => {
  const m = block.match(new RegExp(`${name}="((?:[^"\\\\]|\\\\.)*)"`, 's'));
  return m ? decode(m[1]) : undefined;
};
/** Atributo expresión: attr={ ... } balanceado */
function attrExpr(block, name) {
  const anchor = `${name}={`;
  const i = block.indexOf(anchor);
  if (i === -1) return undefined;
  let depth = 0;
  for (let j = i + anchor.length - 1; j < block.length; j++) {
    if (block[j] === '{') depth++;
    else if (block[j] === '}') { depth--; if (depth === 0) return block.slice(i + anchor.length, j); }
  }
  return undefined;
}
/** Bloque de un componente desde <Nombre hasta /> o > */
function componentBlock(src, name) {
  const i = src.indexOf(`<${name}`);
  if (i === -1) return null;
  const end = src.indexOf('/>', i);
  return end === -1 ? null : src.slice(i, end + 2);
}
const text1 = (src, re) => { const m = src.match(re); return m ? decode(m[1].trim()) : undefined; };

function extractPage(file, seccion) {
  const src = fs.readFileSync(file, 'utf8');
  const slug = path.basename(file, '.astro');
  const parts = src.split(/^---$/m);
  const fm = parts[1];
  const tpl = parts.slice(2).join('---');

  // ---- frontmatter ----
  const categoria = text1(fm, /data\.categoria === '([\w-]+)'/);
  const filterSubcats = [...fm.matchAll(/p\.data\.subcategoria === '([\w-]+)'/g)].map((m) => m[1]);
  const idIncludes = [...fm.matchAll(/p\.id\.includes\('([^']+)'\)/g)].map((m) => m[1]);
  const subcategoriasNav = lit(balanced(fm, 'const subcategorias = [', '[', ']'));
  const faqs = lit(balanced(fm, 'const faqItems = [', '[', ']'));
  const schemaObj = lit(balanced(fm, 'buildProductCategorySchema(', '{', '}'));
  const breadcrumb = lit(balanced(fm, 'buildBreadcrumbSchema(', '[', ']'));

  // ---- props del Layout ----
  const layoutBlock = tpl.slice(tpl.indexOf('<Layout'), tpl.indexOf('>', tpl.indexOf('<Layout')) + 1);
  const heroMetrics = lit(attrExpr(layoutBlock, 'heroMetrics'));

  // ---- hero-content slot (HTML verbatim) ----
  const heroContentHtml = text1(tpl, /<Fragment slot="hero-content">([\s\S]*?)<\/Fragment>/);

  // ---- secciones del template ----
  const catalogTitle = text1(tpl, /catalog-header__title">([\s\S]*?)<\/h2>/);
  const catalogDesc = text1(tpl, /catalog-header__desc">([\s\S]*?)<\/p>/);
  const hasEmpty = tpl.includes('catalog-empty');
  const emptyTitle = hasEmpty ? text1(tpl, /catalog-empty__title">([\s\S]*?)<\/h3>/) : undefined;
  const emptyText = hasEmpty ? text1(tpl, /catalog-empty__text">([\s\S]*?)<\/p>/) : undefined;
  const techTitle = text1(tpl, /tech-info__title">([\s\S]*?)<\/h3>/);
  const techItems = [...tpl.matchAll(/tech-info__label">([\s\S]*?)<\/span>\s*<span class="tech-info__value">([\s\S]*?)<\/span>/g)]
    .map((m) => ({ label: m[1].trim(), value: m[2].trim() }));
  const ctaTitle = text1(tpl, /subcat-cta-final__title">([\s\S]*?)<\/h3>/);
  const ctaDesc = text1(tpl, /subcat-cta-final__desc">([\s\S]*?)<\/p>/);
  // Botón del CTA final: primer btn--primary DESPUÉS del bloque subcat-cta-final
  const ctaButton = text1(tpl.slice(tpl.indexOf('subcat-cta-final')), /btn btn--primary">([\s\S]*?)<\/a>/);
  // Botón del estado vacío: primer btn--primary dentro del bloque catalog-empty
  const emptyButton = hasEmpty
    ? text1(tpl.slice(tpl.indexOf('catalog-empty')), /btn btn--primary">([\s\S]*?)<\/a>/)
    : undefined;

  // ---- ProductSidebar ----
  const sb = componentBlock(tpl, 'ProductSidebar');
  const sidebar = {
    navTitulo: attrStr(sb, 'navTitulo'),
    baseUrl: attrStr(sb, 'baseUrl'),
    backLinkHref: attrStr(sb, 'backLinkHref'),
    backLinkTexto: attrStr(sb, 'backLinkTexto'),
    certificaciones: lit(attrExpr(sb, 'certificaciones')),
    marcas: attrExpr(sb, 'marcas') ? lit(attrExpr(sb, 'marcas')) : undefined,
    aplicaciones: attrExpr(sb, 'aplicaciones') ? lit(attrExpr(sb, 'aplicaciones')) : undefined,
    productosRelacionados: lit(attrExpr(sb, 'productosRelacionados')),
  };

  // ---- RelatedProductsGrid ----
  const rg = componentBlock(tpl, 'RelatedProductsGrid');
  const related = {
    titulo: attrStr(rg, 'titulo'),
    subtitulo: attrStr(rg, 'subtitulo'),
    maxProductos: rg.includes('maxProductos') ? Number(attrExpr(rg, 'maxProductos')) : undefined,
    verTodosLink: attrStr(rg, 'verTodosLink'),
    verTodosTexto: attrStr(rg, 'verTodosTexto'),
  };

  // ---- CotizacionForm ----
  const cf = componentBlock(tpl, 'CotizacionForm');
  const cotizacion = {
    titulo: attrStr(cf, 'titulo'),
    tipoEquipo: attrStr(cf, 'tipoEquipo'),
    pagina: attrStr(cf, 'pagina'),
  };

  // ---- validaciones de uniformidad ----
  const warnings = [];
  if (attrStr(layoutBlock, 'activePage') !== 'equipos') warnings.push('activePage != equipos');
  if (!/heroShowRightContent=\{true\}/.test(layoutBlock)) warnings.push('heroShowRightContent != true');
  const navActive = subcategoriasNav.filter((s) => s.activo).map((s) => s.slug);
  if (navActive.length !== 1 || navActive[0] !== slug) warnings.push(`nav activo=${navActive} != slug=${slug}`);

  return {
    seccion,
    slug,
    categoria,
    filter: { subcategorias: filterSubcats, ...(idIncludes.length ? { idIncludes } : {}) },
    meta: {
      title: attrStr(layoutBlock, 'title'),
      description: attrStr(layoutBlock, 'description'),
    },
    hero: {
      title: attrStr(layoutBlock, 'heroTitle'),
      intro: attrStr(layoutBlock, 'heroIntro'),
      badge: attrStr(layoutBlock, 'heroBadge'),
      metrics: heroMetrics,
      primaryText: attrStr(layoutBlock, 'heroPrimaryText'),
      primaryLink: attrStr(layoutBlock, 'heroPrimaryLink'),
      secondaryText: attrStr(layoutBlock, 'heroSecondaryText'),
      secondaryLink: attrStr(layoutBlock, 'heroSecondaryLink'),
      contentHtml: heroContentHtml,
    },
    schema: schemaObj,
    breadcrumb,
    catalog: { title: catalogTitle, desc: catalogDesc },
    ...(hasEmpty ? { empty: { title: emptyTitle, text: emptyText, buttonText: emptyButton } } : {}),
    techInfo: { title: techTitle, items: techItems },
    // El bloque CTA final solo existe en 22 de las 33 páginas originales
    ...(ctaTitle ? { ctaFinal: { title: ctaTitle, desc: ctaDesc, buttonText: ctaButton } } : {}),
    sidebar: { ...sidebar, subcategorias: subcategoriasNav.map(({ activo, ...rest }) => rest) },
    related,
    cotizacion,
    faqs,
    _warnings: warnings,
  };
}

fs.mkdirSync(OUT_DIR, { recursive: true });
let total = 0;
for (const seccion of SECCIONES) {
  const dir = `src/pages/${seccion}`;
  const pages = fs.readdirSync(dir).filter((f) => f.endsWith('.astro')).sort();
  const out = [];
  for (const f of pages) {
    try {
      const data = extractPage(path.join(dir, f), seccion);
      if (data._warnings.length) console.warn(`⚠ ${seccion}/${f}:`, data._warnings.join('; '));
      delete data._warnings;
      // valores undefined fuera del JSON
      out.push(JSON.parse(JSON.stringify(data)));
      total++;
    } catch (e) {
      console.error(`✖ ERROR ${seccion}/${f}: ${e.message}`);
      process.exitCode = 1;
    }
  }
  fs.writeFileSync(path.join(OUT_DIR, `${seccion}.generated.json`), JSON.stringify(out, null, 2) + '\n');
  console.log(`✓ ${seccion}: ${out.length} páginas → ${OUT_DIR}/${seccion}.generated.json`);
}
console.log(`Total: ${total} páginas extraídas`);
