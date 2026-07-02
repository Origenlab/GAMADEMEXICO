# FASE 3 — Schema Audit: Correcto, Coherente, Sin Señales Falsas
**Fecha:** 2026-07-01  
**Estado:** ✅ CERRADO — implementado, commiteado, desplegado y verificado en producción

---

## Metodología

Auditoría exhaustiva de todos los schemas JSON-LD emitidos por el sitio. Se leyó `src/lib/seo.ts` completo y se rastreó cada builder hacia las páginas que lo usan. Criterios de evaluación:

1. ¿El `@type` es coherente con el tipo de página?
2. ¿Hay campos con valores fabricados, aproximados o de terceros presentados como propios?
3. ¿Hay bloques `Offer` sin `price` que generan errores en Google Rich Results Test?
4. ¿Hay schema que genere expectativas falsas en Google (SearchAction sin endpoint real, ratings inventados, precios de competidores como propios)?

---

## Inventario de Schemas por Página

| Página / Template | Schemas emitidos | Estado |
|---|---|---|
| `index.astro` | Organization + LocalBusiness + WebSite + FAQ | ✅ Correcto |
| `equipos.astro` | Organization + CollectionPage + Breadcrumb + FAQ | ✅ Correcto |
| `boquillas/monitores/válvulas/gabinetes/conexiones.astro` | Organization + Product + ItemList + Breadcrumb + FAQ | ✅ Correcto (tras fix) |
| `[seccion]/[subcategoria].astro` | Organization + Product + Breadcrumb + FAQ | ✅ Correcto (tras fix) |
| `productos/[...slug].astro` | Organization + Product (price condicional real) + Breadcrumb + FAQ | ✅ Correcto |
| `servicios/*.astro` (7 páginas) | Organization + Service + Breadcrumb + FAQ | ✅ Correcto |
| `cotizar.astro` | Organization + Service + Breadcrumb + FAQ | ✅ Correcto |
| `blog/[categoria]/[slug].astro` | Organization + TechArticle + Breadcrumb | ✅ Correcto |
| `blog/[categoria]/index.astro` | Organization + Breadcrumb | ✅ Correcto |
| `blog/index.astro` | Organization + Breadcrumb | ✅ Correcto |
| `blog/tag/[tag].astro` | Organization + Breadcrumb | ✅ Correcto |
| `contacto.astro` | Organization + LocalBusiness + Breadcrumb + FAQ | ✅ Correcto |
| `nosotros.astro` | Organization + LocalBusiness + Breadcrumb + FAQ | ✅ Correcto |
| `precios/index.astro` | Organization + FAQ + Breadcrumb | ✅ Correcto (tras fix) |
| `empresas-certificadas/index.astro` | Organization + Breadcrumb + FAQ | ✅ Correcto |
| `empresas-certificadas/[slug].astro` | derivado de frontmatter | ✅ Correcto |
| `empresas-certificadas/giro/[giro].astro` | Organization + Breadcrumb | ✅ Correcto |
| `empresas-certificadas/estado/[estado].astro` | Organization + Breadcrumb | ✅ Correcto |

---

## Hallazgos — Issues Encontrados y Corregidos

### Issue 1 (ALTO) — `buildProductCategorySchema`: `Offer` sin `price`

**Archivo:** `src/lib/seo.ts` → función `buildProductCategorySchema()`  
**Afectaba:** 5 páginas de categoría estáticas + todas las rutas `[seccion]/[subcategoria].astro`

**Problema:**
```json
"offers": {
  "@type": "Offer",
  "availability": "https://schema.org/InStock",
  "priceCurrency": "MXN"
  // ← SIN price ni priceValidUntil
}
```

Google's Rich Results Test requiere `price` o `priceValidUntil` para que un `Product` con `Offer` califique para rich results. Un `Offer` sin `price` es un **error de validación** (no solo advertencia).

Adicionalmente, una página de CATEGORÍA no es un producto con precio único — es un conjunto de productos. Las páginas de categoría ya emiten `ItemList` (via `buildItemListSchema`) que representa el catálogo correctamente.

**Fix:** Eliminar el bloque `offers` completo de `buildProductCategorySchema`. El schema `Product` sin `offers` es válido — comunica la entidad (tipo de producto + marca) sin prometer precio.

```ts
// ANTES
return {
  '@type': 'Product',
  ...
  offers: {
    '@type': 'Offer',
    availability: 'https://schema.org/InStock',
    priceCurrency: 'MXN',
    seller: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  },
};

// DESPUÉS
return {
  '@type': 'Product',
  name, description, image, url, brand, manufacturer, category
  // sin offers
};
```

---

### Issue 2 (ALTO) — `precios/index.astro`: `serviceSchemas` con precios de competidores como propios

**Archivo:** `src/pages/precios/index.astro`  
**Problema:** El array `serviceSchemas` contenía 6 objetos `@type: Service` con `offers.priceSpecification` usando rangos de precios tomados de **otros distribuidores** (COGARSA, Extinflam/Vallen, distribuidores.mx, etc.), marcados como `availability: InStock` de Gama de México.

Esto era semánticamente falso en tres niveles:
1. Los precios eran referencias de mercado externas, no precios propios verificados
2. `availability: InStock` con precio ajeno ≠ oferta real del sitio
3. Google podría mostrar "desde $400 USD en gamademexico.com" cuando ese precio viene de un competidor

El contenido informativo de referencia de precios ya existía correctamente en el `FAQSchema` de la misma página (con los mismos precios referenciales, pero presentados como información, no como oferta).

**Fix:** Eliminar el array `serviceSchemas` completo. La página ahora emite:
```
Organization + FAQ (con info de precios referenciales) + BreadcrumbList
```

---

### Schemas verificados como correctos (sin cambios)

- **WebSite** (`buildWebSiteSchema`): ya sin `SearchAction` (eliminado en FASE 1 · commit `7f47064`)
- **Organization** (`buildOrganizationSchema`): `@id`, `sameAs`, `alternateName` — correcto
- **LocalBusiness** (`buildLocalBusinessSchema`): geo, openingHours, priceRange — correcto
- **Product individual** (`buildProductSchema`): `price` condicional — solo se añade si se parsea correctamente desde `precioReferencia`. Si el precio es "Consultar" u otro no-numérico, el `Offer` no incluye `price` pero eso está permitido para productos individuales con precio a cotizar
- **Service** (`buildServiceSchema`): tipo correcto para páginas de servicio (asesoría, envíos, instalación, mantenimiento, proyecto, garantía, cotizaciones)
- **TechArticle** (`buildArticleSchema`): tipo correcto para blog técnico
- **FAQ** (`buildFAQSchema`): solo en páginas con preguntas reales en el contenido
- **ItemList** (`buildItemListSchema`): correcto en páginas de categoría de catálogo
- **CollectionPage** (`buildCollectionPageSchema`): correcto en `/equipos` (hub de categorías)
- **BreadcrumbList** (`buildBreadcrumbSchema`): correcto en todas las páginas

---

## Commits

| Commit | Contenido |
|--------|-----------|
| `3ef2b88` | Schema audit: eliminar `offers` falso en categorías y `serviceSchemas` en precios |

---

## Verificación en Producción

Verificado tras deploy exitoso del commit `d5b319f8` (2026-07-02):

```bash
# Servidor
server: cloudflare  ← CF Pages activo, sin GH Pages
cf-ray: a14a02033d846f22-DFW

# Títulos FASE 2 + FASE 3 en producción
HOME:      Equipos Contra Incendios Certificados UL/FM en México ✅
EQUIPOS:   Equipos Contra Incendios UL/FM | Stock Inmediato en México ✅
BOQUILLAS: Boquillas Contra Incendios UL Listed | Turbo Jet y Pistola México ✅
PRECIOS:   Precios de Equipos Contra Incendios UL/FM en México ✅

# Infra
llms.txt:         200 ✅
sitemap-index.xml: 200 ✅

# robots.txt — sin inyección CF Block AI Scrapers
GPTBot:         Allow: / ✅
Google-Extended: Allow: / ✅
ClaudeBot:      Allow: / ✅
```

**Nota:** CF Pages sirve archivos estáticos directamente sin pasar por el WAF managed robots.txt injection. El paso 3 de FASE 1 (deshabilitar "Block AI Scrapers" en Cloudflare Dashboard) ya no es bloqueante — nuestro `robots.txt` se sirve limpio.

---

## Estado de cierre de FASE 3

| Frente | Implementado | Commit | Desplegado | Verificado en prod |
|--------|-------------|--------|------------|-------------------|
| `offers` sin price en categorías | ✅ | `3ef2b88` | ✅ `d5b319f8` | ✅ |
| `serviceSchemas` con precios ajenos en precios/ | ✅ | `3ef2b88` | ✅ `d5b319f8` | ✅ |
| Schema completo auditado | ✅ todos correctos | — | ✅ | ✅ |

**FASE 3 CERRADA.** Todo el schema estructurado del sitio es veraz, coherente con el tipo de página y sin señales que puedan generar penalizaciones de Google.
