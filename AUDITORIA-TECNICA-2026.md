# Auditoría Técnica Integral — gamademexico.com

**Fecha:** 10 de junio de 2026
**Stack:** Astro 5.17 (static) + Markdown Content Collections + GitHub Pages + CDN ExactDN
**Alcance:** Arquitectura, componentes, layouts, Markdown, SEO técnico, rendimiento, accesibilidad, seguridad, UX, escalabilidad
**Inventario auditado:** 69 páginas `.astro` · 1 layout · 31 componentes · 372 archivos Markdown (84 blog, 225 productos, 53 empresas, 6 categorías, 4 hidrantes) · 8 hojas CSS (6,323 líneas)

---

## 1. Resumen Ejecutivo

El proyecto tiene una base sólida: SEO on-page bien trabajado (canonical, OG completo, JSON-LD en todas las plantillas, sitemap, robots), JS mínimo (~6 KB), fuente auto-hospedada, imágenes vía CDN con srcset, skip-link y buena semántica. Está claramente por encima del promedio de sitios PyME.

Sin embargo, la auditoría detectó **3 problemas críticos** que comprometen el SEO y la operación, **1 de los cuales tenía el build roto en producción**:

1. **Build roto** — 5 artículos de blog usaban la categoría `equipos-bomberos`, inexistente en el schema Zod. `npm run build` fallaba: ningún cambio podía desplegarse. **✅ Corregido en esta auditoría.**
2. **Datos estructurados fabricados** — `buildProductCategorySchema()` emitía en 33 páginas un rating fijo de 4.9★ con 48 reseñas inventadas, reseñas firmadas por personas ficticias y un rango de precios falso ($1–$999,999). Esto viola las directrices de Google sobre reseñas auto-otorgadas y fabricadas; el riesgo es una **acción manual** que elimine todos los rich results del dominio. **✅ Corregido.**
3. **Riesgo legal en `empresas-certificadas`** — 53 páginas afirman que empresas reales e identificables (Four Seasons, BMW, Pemex, Liverpool, hospitales ABC…) están "certificadas por Gama de México" con `verificado: true`, sin fuente ni autorización aparente. Riesgo de reclamación por uso de marca y publicidad engañosa, además de riesgo SEO por contenido no confiable. **⚠️ No se modificó: requiere decisión de negocio (ver §2.3).**

El problema estructural dominante es la **duplicación masiva de código**: 33 páginas de subcategoría suman ~8,545 líneas con ~85% de código idéntico, y el único layout (`Base.astro`, 24 props) concentra demasiadas responsabilidades. La refactorización propuesta (§12) reduce esas 33 páginas a 1 layout + archivos de datos, recortando ~5,000 líneas.

**Calificación global: 7.1/10** → con el roadmap completo (§14): nivel empresarial 9+.

### Cambios ya aplicados en esta auditoría ✅

| Cambio | Archivos | Impacto |
|---|---|---|
| Build reparado: categoría `equipos-bomberos` añadida a enum + mapeos de labels/slugs | `content.config.ts`, `lib/blogHelpers.ts` | 5 posts vuelven a publicarse; deploy desbloqueado |
| Eliminados ratings/reseñas fabricados y precios falsos del schema Product | `lib/seo.ts` | Elimina riesgo de penalización Google |
| Eliminados ratings 4.7–5.0 y reseñas con autores ficticios generados por hash del slug en el directorio de empresas (¡sobre negocios de terceros!) | `pages/empresas-certificadas/[slug].astro` | Elimina el riesgo SEO/legal más grave del JSON-LD; verificado: 0 `ratingValue` en las 770 páginas de `dist/` |
| 5 posts de blog: titles >70 chars y descriptions >165 chars reescritos a rango SEO | `content/blog/*-trajes-*.md`, `equipo-proteccion-*.md` | SERPs sin truncar |
| Schema Zod endurecido: `imagen` e `imagenAlt` ahora obligatorios (blog y productos), con validación de ruta `/img/` | `content.config.ts` | Imposible publicar contenido sin imagen/alt |
| Componentes muertos eliminados: `OptimizedImage.astro`, `ResponsiveImage.astro` (0 imports) | `src/components/` | −194 líneas de código muerto |
| `BlogCard`: añadidos `width`/`height` a la imagen (era la única sin dimensiones) | `components/blog/BlogCard.astro` | Menos CLS en listados de blog |
| `og:image:type` dinámico según extensión (antes siempre `image/jpeg` aunque fuera `.avif`) | `layouts/Base.astro` | Metadatos OG correctos |
| `robots.txt` limpiado: eliminados grupos por-bot que **anulaban** las reglas `Disallow` del grupo `*`, `Crawl-delay` (ignorado por Google) y `Disallow: /api/` inexistente | `public/robots.txt` | Rastreo coherente |
| **Refactor mayor (§12.1) ejecutado:** las 33 páginas de subcategoría (8,545 líneas, ~85% duplicadas) se reemplazaron por 1 ruta dinámica + capa de datos tipada. **Paridad HTML verificada 33/33** contra el build anterior (diff normalizado). URLs idénticas, sin redirects. Bonus: ancla `#catalogo` del CTA del hero reparada en las 22 páginas donde estaba rota, y doble escape de entidades corregido en metas | `src/pages/[seccion]/[subcategoria].astro`, `src/data/subcategorias/*`, `scripts/extract-subcategorias.mjs` | −8,500 líneas de código duplicado; mantenimiento en un solo template |

Build verificado tras los cambios: **`npm run build` → Complete! sin errores.**

### Segunda ronda de implementación ✅ (mismo día)

| Cambio | Archivos | Impacto |
|---|---|---|
| **CI de validación**: workflow que ejecuta `astro check` + validación de contenido + build en cada push/PR | `.github/workflows/ci.yml` | Un build roto ya no puede llegar a `main` |
| **Tooling**: `typescript`, `@astrojs/check`, `prettier` + scripts `check`/`format` | `package.json` | Type-checking y formato disponibles |
| **92 errores de TypeScript → 0** (`astro check`: 0 errors, 0 warnings): guards de null en `main.ts`, fechas opcionales con fallback estable, props muertas eliminadas en 8 páginas, casts TS retirados de scripts inline, enum del sitemap tipado | 25 archivos | Código verificable estáticamente; CI puede exigirlo |
| **`fecha` real en los 84 posts** (16 sin fecha alguna + 68 solo con `fechaActualizacion`), obtenida del primer commit de cada archivo (`git log --diff-filter=A`) | `src/content/blog/*.md` | `datePublished` presente en el JSON-LD Article de todo el blog; orden cronológico real |
| **58 titles y 66 descriptions de productos reescritos a rango SEO** (corte en límite de oración/segmento, nunca a media palabra) + límites `min/max` añadidos al schema Zod de productos | `src/content/productos/*.md`, `content.config.ts` | 0 metas truncadas en SERP; imposible reintroducirlas |
| **Tags normalizados**: 303 → 253 únicos (fusión conservadora de duplicados singular/plural, variantes "México" y sinónimos evidentes; 38 posts tocados) | `src/content/blog/*.md` | −48 páginas de tag thin-content; señales consolidadas |
| **Formularios accesibles**: `<label>` asociados (`.sr-only` nueva utilidad), `inputmode`, id de formulario **determinista** (antes `Math.random` → HTML distinto en cada build) | `CotizacionForm.astro`, `LeadCapture.astro`, `global.css` | WCAG 3.3.2; builds reproducibles |
| **LCP de producto**: `fetchpriority="high"` en imagen principal; **`ogImage` específica por producto** (antes usaban el fallback global) | `productos/[...slug].astro` | Mejor LCP; previews correctas al compartir 225 productos |
| Pesos de Inter auditados: los 5 (400–800) tienen uso real en CSS — se conservan (verificado, no supuesto) | — | Sin regresión tipográfica |

Build final: **722 páginas, 0 errores** (las 48 páginas menos son exactamente los tags fusionados). `astro check`: **0 errors / 0 warnings**.

---

## 2. Problemas Críticos Detectados

### 2.1 Build roto por categoría inválida — ✅ CORREGIDO

- **Descripción:** `src/content/blog/` contenía 5 posts con `categoria: "equipos-bomberos"`, valor ausente del enum Zod en `content.config.ts`. Astro abortaba el build con `InvalidContentEntryDataError`.
- **Impacto:** Crítico — imposible desplegar el sitio; los 5 artículos (cluster completo de trajes/EPP) nunca se publicaron.
- **Causa raíz:** El contenido se genera (n8n/manual) sin validar contra el schema antes de commitear.
- **Solución aplicada:** enum ampliado + `CATEGORY_LABELS`/`CATEGORY_SLUGS`/`SLUG_TO_CATEGORY` actualizados (los mapas tampoco cubrían `equipos-contra-incendios`, usado por 65 posts, que generaba URLs sin etiqueta legible).
- **Prevención:** añadir `astro check`/build a CI antes de merge (ver §11.4).

### 2.2 JSON-LD con reseñas y ratings fabricados — ✅ CORREGIDO

- **Descripción:** `buildProductCategorySchema()` (`src/lib/seo.ts`) emitía en cada una de las 33 páginas de categoría/subcategoría:
  - `aggregateRating: 4.9` con `ratingCount: 48` **hardcodeados**;
  - reseñas de autores ficticios (el mismo "Ing. Carlos Mendoza" en varias páginas) con fecha por defecto `2025-01-15`;
  - `AggregateOffer` con `lowPrice: 1` / `highPrice: 999999` / `offerCount: 50` inventados.
- **Impacto:** Crítico — las directrices de Google prohíben reseñas no generadas por usuarios reales y datos de oferta falsos. La detección (algorítmica o revisión manual) conlleva pérdida de todos los rich results e incluso degradación de confianza del dominio.
- **Solución aplicada:** el schema Product se conserva (name, brand, image, offers con seller) pero sin rating/review/precios falsos. Las interfaces se mantuvieron para no romper las 33 páginas que llaman la función.
- **Recomendación futura:** si se implementa recolección real de reseñas (Google Business Profile, Trustpilot), reintroducir `aggregateRating` desde esa fuente de datos.

### 2.3 Directorio "empresas-certificadas": contenido sobre empresas reales sin fuente — ⚠️ PENDIENTE DE DECISIÓN

- **Descripción:** 53 archivos en `src/content/empresas-certificadas/` describen empresas reales (Four Seasons Reforma, BMW SLP, Refinería Pemex Tula, Liverpool, hospitales, universidades) con afirmaciones específicas sobre sus sistemas contra incendios, `verificado: true` en el 100%, `certificadoPor: "Gama de México"` y fechas de certificación genéricas. No existe campo de fuente, evidencia ni autorización.
- **Impacto:** Crítico —
  - **Legal:** afirmar públicamente que una empresa identificable tiene cierto sistema certificado por ti, sin su autorización, expone a reclamaciones por uso indebido de marca y publicidad engañosa (especialmente grave si ocurre un siniestro en una de esas instalaciones).
  - **SEO/confianza:** Google degrada contenido fabricado a escala (políticas de "scaled content abuse").
- **Prioridad:** Crítico.
- **Opciones (decisión de negocio, no se aplicó ninguna):**
  1. **Eliminar la colección** y las rutas `/empresas-certificadas/*` (con 410/redirects).
  2. **Anonimizar:** convertir a casos de estudio sin marcas ("Hotel 5 estrellas en Reforma"), `noindex` opcional.
  3. **Legitimar:** conservar solo clientes reales con autorización escrita; añadir campos `fuente` y `autorizacionCliente` obligatorios al schema y poner `verificado: false` por defecto.
- **Beneficio esperado:** eliminación de un pasivo legal y de un foco de desconfianza algorítmica.

---

## 3. Problemas Importantes (Prioridad Alta)

### 3.1 Duplicación masiva: 33 páginas de subcategoría ~85% idénticas — ✅ RESUELTO

> **Implementado en esta auditoría.** Arquitectura final:
> - `src/data/subcategorias/types.ts` — contrato tipado (`SubcategoryDef`)
> - `src/data/subcategorias/*.generated.json` — datos extraídos 1:1 de las páginas originales con `scripts/extract-subcategorias.mjs` (extracción programática, cero transcripción manual)
> - `src/data/subcategorias/index.ts` — agregador con validación de integridad en build (rutas duplicadas, metas vacíos, filtros vacíos fallan el build)
> - `src/pages/[seccion]/[subcategoria].astro` — template único
>
> Verificación: build de 770 páginas OK; **diff de paridad 33/33 idéntico** (normalizando hashes de scope CSS, nombres de bundle, comentarios HTML y el id aleatorio del formulario que ya variaba entre builds); las 33 URLs presentes en el sitemap; conjunto de reglas CSS idéntico. Para crear una nueva subcategoría ahora basta añadir un objeto al JSON correspondiente.

- **Archivos:** `src/pages/{boquillas,monitores,mangueras,valvulas,conexiones,gabinetes}/*.astro` — 33 archivos, **8,545 líneas**.
- **Descripción:** cada página repite imports, fetch de colección, filtrado, definición del arreglo `subcategorias` (≈50 líneas idénticas por categoría), construcción de schemas y todo el template HTML. Solo cambian: textos del hero, FAQs, filtro de subcategoría y metadatos.
- **Impacto:** Alto — un cambio de estructura exige tocar 33 archivos; alta probabilidad de divergencia (ya hay inconsistencias menores entre ellas); crecer a nuevas categorías es copiar-pegar 270 líneas.
- **Solución:** layout `SubcategoryPage.astro` + datos por subcategoría (ver código completo en §12.1). Reducción estimada: **−5,000 líneas (−59%)**.

### 3.2 Reescritura de URLs de imagen en runtime (ExactDN) en vez de build

- **Archivo:** `src/layouts/Base.astro` líneas 147–164.
- **Descripción:** un script inline reescribe `img[src^="/img/"]` hacia el CDN en `DOMContentLoaded`. Para entonces el navegador **ya inició la descarga de los originales** desde GitHub Pages: doble petición para imágenes tempranas, y el LCP (hero) se sirve sin optimización CDN en la primera carga.
- **Impacto:** Alto — LCP y ancho de banda. El proyecto ya tiene la solución a medias: `lib/images.ts` (`getOptimizedImageUrl`) y el plugin rehype reescriben en build, pero solo algunos componentes los usan.
- **Solución:** usar `getOptimizedImageUrl()` en **todos** los `<img>` de componentes/páginas (en build) y dejar el script inline solo como red de seguridad temporal, o eliminarlo. Verificar con `grep -rn 'src="/img/' src/` los que faltan.
- **Beneficio:** mejor LCP, sin descargas duplicadas, menos JS inline.

### 3.3 `Base.astro` monolítico (24 props, 9 componentes incondicionales)

- **Descripción:** un único layout gestiona SEO, geo-tags, analytics, hero, trust bar, CTA, lead capture, sticky CTA y WhatsApp. 24 props con prefijo `hero*` delatan que el hero debería ser composición, no configuración.
- **Impacto:** Alto — fricción de mantenimiento, props-drilling, imposible variar estructura por tipo de página sin más flags.
- **Solución:** dividir en `BaseHead` (SEO+head) + layouts especializados (`PageLayout`, `SubcategoryPage`, `ArticleLayout`, `LegalLayout`) que compongan `Base` mínimo. Ver §12.2.

### 3.4 Metadatos de productos fuera de rango SEO (sin validación)

- **Datos verificados:** de 225 productos, **58 titles >70 chars** y **66 descriptions >165 chars** (peores: 216 chars). El schema `productos` no valida longitudes (el de blog sí).
- **Impacto:** Alto — titles/descriptions truncados en SERP en ~26% del catálogo; CTR perdido.
- **Solución:** (1) script de reescritura asistida de los 66 peores; (2) al terminar, añadir `.min/.max` al schema como en blog. No se aplicó el límite hoy para no romper el build con 66 archivos pendientes de redacción.

### 3.5 16 posts sin fecha + `fechaActualizacion` clonada

- **Datos:** 16/84 posts sin `fecha` ni `fechaActualizacion`; 68 posts comparten exactamente `fechaActualizacion: 2026-03-19` (batch update).
- **Impacto:** Alto-Medio — `Article` JSON-LD sin `datePublished` pierde elegibilidad de rich results; el orden cronológico del blog es arbitrario; fechas de actualización idénticas restan credibilidad.
- **Solución:** completar `fecha` con la fecha real de publicación (git log la conserva: `git log --follow --format=%as -- <archivo> | tail -1`) y hacer el campo obligatorio en el schema.

### 3.6 Formularios sin `<label>` explícitos

- **Archivos:** `CotizacionForm.astro`, `LeadCapture.astro`, `pages/contacto.astro`.
- **Impacto:** Alto (accesibilidad) — incumple WCAG 2.2 (3.3.2 / 4.1.2); lectores de pantalla anuncian campos sin nombre; los placeholders desaparecen al escribir.
- **Solución:** `<label for>` asociado (visible o `.sr-only`), `autocomplete` (`name`, `email`, `tel`, `organization`), y `aria-invalid` + mensaje de error vinculado con `aria-describedby` en la validación.

### 3.7 Tags de blog sin normalizar

- **Datos:** tags duplicados por variante: `hidrante` (3) vs `hidrantes` (11), `sprinkler` (7) vs `rociador` (4), mezcla de espacios/camelCase/guiones (`"acoplamientos Storz NST"` vs `proteccióncontraincendios`).
- **Impacto:** Medio-Alto — las páginas `/blog/tag/[tag]` se fragmentan en variantes con 1-3 posts (thin content indexable).
- **Solución:** lista canónica de tags + transform Zod (lowercase, trim, espacios→guiones) + script de migración una sola vez. Ejemplo en §12.4.

---

## 4. Problemas Menores (Prioridad Media/Baja)

| # | Problema | Archivos | Prioridad | Solución |
|---|---|---|---|---|
| 4.1 | 13 archivos sueltos en raíz: reportes viejos (`AUDITORIA-*.md`, `ZACARIAS-*.md`…), scripts Python con rutas absolutas de otra máquina (`/Users/carsolio/Desktop`) | raíz del repo | Baja | Mover docs a `docs/`, scripts a `tools/`; borrar obsoletos |
| 4.2 | Carpetas de referencia pesadas dentro del repo (`referencia-elkhart`, `video-traje-bombero`, `whisk-references`, `aqueon-blog`) | raíz | Baja | Sacar del repo o añadir a `.gitignore` si son material de trabajo |
| 4.3 | `package.json` sin `typescript`, `@astrojs/check`, `prettier`; no hay `lint`/`type-check` | `package.json` | Media | `npm i -D typescript @astrojs/check prettier` + scripts; `build: "astro check && astro build"` |
| 4.4 | `certificaciones` de productos sin enum: ~12 variantes de "UL", ~8 de "FM" | `content.config.ts` + 225 md | Media | Enum canónico + script de normalización |
| 4.5 | 21 productos Elkhart sin `precioReferencia` | `content/productos/elkhart-*.md` | Media | Definir política: precio o `"Por cotización"` explícito |
| 4.6 | 74/84 posts sin imágenes inline en el cuerpo (solo hero) | `content/blog/` | Media | Ampliar `normalize-blog-content.mjs`; meta: ≥1 imagen por cada ~600 palabras |
| 4.7 | Componentes gigantes: `BlogSidebar.astro` (894 líneas), `SidebarDirectorio.astro` (712), `EmpresasRecomendadas.astro` (566) | `src/components/` | Media | Descomponer (ver §8) |
| 4.8 | CSS: 6,323 líneas en 8 archivos con utilidades repetidas y colores hardcodeados (`#25D366`) | `src/styles/` | Media | Sistema de variables + carpetas `components/`/`layouts/` |
| 4.9 | Colección `hidrantes` con 4 entradas (¿demo?): genera sección pública con cobertura 0.02% | `content/hidrantes/`, `pages/hidrantes/` | Baja | Decidir: poblar, `noindex` o retirar |
| 4.10 | `priority`/`changefreq` en sitemap: Google los ignora (no es error, es mantenimiento inútil) | `astro.config.mjs` | Baja | Simplificar o conservar (inofensivo) |
| 4.11 | Twitter Cards apuntan a `@gamademexico` — verificar que la cuenta exista | `Base.astro` | Baja | Confirmar o retirar `twitter:site` |
| 4.12 | `set:html` en 4 puntos con contenido interno (riesgo bajo, pero sin contrato) | `ServiceCard`, `SectionHeader`, `blog/[categoria]/index` | Baja | Documentar que solo acepta strings internos; nunca pasar input externo |

---

## 5. Oportunidades de Optimización

1. **Ruta dinámica para subcategorías** — la mejora #1 del proyecto (§12.1).
2. **Imágenes responsive uniformes** — unificar todo en `lib/images.ts`; los componentes que ya lo usan (CategoryCard, ServiceCard, BlogCard, Header) están bien; faltan los `<img>` directos de páginas.
3. **Validación en CI** — GitHub Action con `astro check && astro build` + `content:blog:check` en cada PR. El bug del build roto (§2.1) habría sido imposible.
4. **Fuentes:** se importan 5 pesos de Inter (400–800). Auditar uso real; cada peso ≈15-25 KB woff2. Probablemente 400/600/700 bastan. Considerar `font-display: swap` verificado y subset latin.
5. **`inlineStylesheets: 'auto'`** con 6,323 líneas CSS puede inflar cada HTML; medir y considerar `'never'` + caché del CSS externo si el CSS compartido supera ~30 KB por página.
6. **Búsqueda interna real** — `WebSite` JSON-LD declara `SearchAction` hacia `/equipos?q=` ; implementar la búsqueda (Pagefind es ideal para Astro estático) o retirar el SearchAction.
7. **Imágenes pesadas en `/public/img`** — ejecutar `npm run audit:images` periódicamente; convertir restos JPG/PNG a AVIF como ya hace la mayoría del catálogo.

---

## 6. Mejoras SEO

**Estado actual (bueno):** canonical correcto y coherente con `trailingSlash: 'never'`; robots meta con `max-image-preview:large`; OG completo con locale `es_MX`; sitemap-index referenciado; `lang="es-MX"`; BreadcrumbList JSON-LD; FAQPage; Organization/LocalBusiness/WebSite; geo-tags; 404 controlada.

**Aplicado hoy:** §2.1, §2.2, robots.txt coherente, og:image:type dinámico, 5 titles/descriptions de blog corregidos.

**Pendiente recomendado, en orden de impacto:**

1. **Decisión sobre empresas-certificadas (§2.3)** — mayor riesgo SEO restante.
2. **Titles/descriptions de productos (§3.4)** — 26% del catálogo truncado en SERP.
3. **`datePublished` real en blog (§3.5)**.
4. **OG image específica por producto** — hoy el fallback global se usa en muchas páginas; los productos tienen `imagen` propia: pasarla como `ogImage` en `productos/[...slug].astro` si no se hace ya; ideal generar variantes 1200×630.
5. **FAQ visible = FAQ schema** — donde el HTML de FAQs y el array `faqItems` viven separados, derivar ambos del mismo dato (el layout de §12.1 lo resuelve por diseño).
6. **Enlazado interno del cluster trajes/EPP** — los 5 posts reparados son un cluster nuevo (`/blog/equipos-bomberos/`); enlazarlos desde posts de monitores/mangueras relacionados y desde el hub del blog.
7. **Consistencia de arquitectura URL** — categorías en raíz (`/monitores-contra-incendios`) y subcategorías cortas (`/monitores/ul-listed`) es aceptable; **no migrar** (el coste de redirects supera el beneficio). Documentar la convención.

---

## 7. Mejoras de Rendimiento

**Estado actual:** JS propio mínimo; analytics defer; TruConversion tras `load`+idle (bien); preconnect al CDN; AVIF dominante; `loading="lazy"` y `decoding="async"` generalizados; Inter auto-hospedada.

**Plan priorizado:**

| # | Acción | Métrica | Prioridad |
|---|---|---|---|
| 1 | Migrar reescritura CDN de runtime a build (§3.2) | LCP, bytes | Alta |
| 2 | `fetchpriority="high"` + sin `loading="lazy"` en la imagen hero/LCP de cada plantilla | LCP | Alta |
| 3 | Auditar pesos de Inter; quitar 500/800 si no se usan | FCP, bytes | Media |
| 4 | Medir tamaño HTML resultante de `inlineStylesheets:'auto'`; dividir CSS por layout (§4.8) | TTFB/bytes | Media |
| 5 | `width`/`height` en todo `<img>` restante (páginas) — componentes ya cubiertos ✅ | CLS | Media |
| 6 | Lighthouse CI o PageSpeed API en CI con presupuesto (LCP<2.5s, CLS<0.1, INP<200ms) | todas | Media |
| 7 | Revisar `prefetchAll: true`: en páginas con cientos de enlaces (catálogo) genera tráfico especulativo; valorar `defaultStrategy: 'viewport'` solo para nav principal | bytes | Baja |

---

## 8. Mejoras de Arquitectura

1. **`SubcategoryPage.astro` + datos** (§12.1) — elimina la duplicación dominante.
2. **Dividir `Base.astro`** (§12.2) — `BaseHead.astro` reutilizable + layouts por tipo de página; el hero pasa a ser slot/composición, no 12 props.
3. **Descomponer componentes gigantes** — `BlogSidebar` (894 líneas) → TOC (ya existe), RecentPosts, CategoryLinks, CtaBox; `SidebarDirectorio` (712) y `EmpresasRecomendadas` (566) análogo.
4. **Patrón de props:** pasar `product={entry}` (CollectionEntry) en lugar de 8 props sueltas en `SubcategoryProductCard` y similares.
5. **Higiene de repo:** `docs/` para reportes, `tools/` para scripts Python/sh (con rutas relativas), borrar lo obsoleto (§4.1, §4.2).
6. **Tooling:** TypeScript + `@astrojs/check` + Prettier + CI (§4.3). El `tsconfig` ya extiende `strict` — aprovecharlo.
7. **Convención de estilos:** variables de diseño en `:root` (colores, espaciado, tipografía) como única fuente de verdad; los 8 CSS actuales consumen variables.

---

## 9. Mejoras de UX

1. **Búsqueda de catálogo** (Pagefind) — 225 productos sin buscador obliga a navegar 3 niveles. Mayor mejora de conversión disponible.
2. **Formularios:** labels visibles (§3.6), validación con mensajes claros junto al campo, estado de envío (spinner/confirmación), y conservar el formulario corto (nombre, contacto, mensaje).
3. **Precio "Por cotización" explícito** en los 21 productos sin precio — la ausencia silenciosa parece error; un CTA claro convierte mejor.
4. **Filtros en listados** de subcategoría (por certificación, diámetro, marca) — los datos ya existen en frontmatter.
5. **Breadcrumb en móvil** — verificar que no haga overflow con títulos largos de producto.
6. **Sticky CTA móvil + WhatsAppBubble simultáneos** pueden saturar la parte baja de la pantalla en móviles pequeños; consolidar en una sola barra.
7. **Cluster trajes/EPP recién publicado:** darle entrada visible desde el menú o el hub de blog (hoy 5 artículos huérfanos de navegación).

---

## 10. Mejoras de Accesibilidad

**Bien:** skip-link, `main` landmark, `lang="es-MX"`, aria-labels en redes/WhatsApp, `aria-hidden` en SVG decorativos, alt generalizado.

1. **Labels de formulario** (§3.6) — el incumplimiento WCAG más claro. Crítico-A11y.
2. **Contraste:** revisar pares como `#666` sobre fondos grises claros en cards/footers; objetivo 4.5:1 (texto normal). Ajustar variables, no casos sueltos.
3. **`:focus-visible`** consistente en nav, cards clicables y botones (verificar tras consolidar CSS).
4. **Touch targets ≥44px** en sticky CTA, paginación y chips de tags.
5. **TOC del blog:** marcar el enlace activo con `aria-current="true"`.
6. **Hero metrics y badges:** asegurar que no transmiten información solo por color.
7. **Auditoría automática:** añadir `axe-core` al e2e de Playwright existente (`scripts/e2e-gallery-playwright.mjs` ya da la base).

---

## 11. Mejoras de Seguridad

Sitio estático en GitHub Pages: superficie reducida. Aun así:

1. **`set:html` (4 usos):** hoy reciben strings internos — riesgo real bajo. Regla: nunca conectarlos a frontmatter editable por terceros o a parámetros de URL. Si el contenido necesita HTML, sanitizar (`sanitize-html`) en build.
2. **Headers:** GitHub Pages no permite headers custom. Opciones: (a) migrar a Cloudflare Pages/Netlify para CSP, HSTS, X-Content-Type-Options, Permissions-Policy; o (b) `<meta http-equiv="Content-Security-Policy">` como paliativo parcial (no cubre todos los directives).
3. **Scripts de terceros (Rybbit, TruConversion, ExactDN):** fijar con Subresource Integrity no es viable (scripts dinámicos), así que documentar el riesgo de cadena de suministro y revisar periódicamente qué cargan.
4. **CI con `npm audit`** (nivel `high`) y Dependabot para Astro y Playwright.
5. **Variables de entorno:** `.env.example` está bien; confirmar que solo claves `PUBLIC_*` llegan al cliente (correcto hoy).
6. **Formularios:** validar también en el endpoint receptor (el HTML client-side es bypasseable); añadir honeypot/turnstile contra spam.

---

## 12. Refactorización Recomendada + 13. Ejemplos de Código Mejorado

### 12.1 La gran refactorización: 33 páginas → 1 layout + datos

**Paso 1 — datos por categoría** (`src/data/subcategorias.ts`):

```ts
import type { FAQItem } from '../lib/seo';

export interface SubcategoryDef {
  categoria: 'monitores' | 'boquillas' | 'mangueras' | 'valvulas' | 'conexiones-herrajes' | 'gabinetes-hidrantes';
  slug: string;            // p.ej. 'blindex' → /mangueras/blindex
  nombre: string;          // 'Manguera Blindex'
  descripcionCorta: string;// para sidebar
  title: string;           // <title> SEO
  description: string;     // meta description
  heroTitle: string;
  heroIntro: string;
  imagen: string;          // imagen para Product schema y OG
  faqs: FAQItem[];
}

export const SUBCATEGORIAS: SubcategoryDef[] = [
  {
    categoria: 'mangueras',
    slug: 'blindex',
    nombre: 'Manguera Blindex',
    descripcionCorta: 'Resistente a llama y químicos',
    title: 'Manguera Blindex Contra Incendios | Gama de México',
    description: 'Manguera blindex forro nitrilo resistente a hidrocarburos…',
    heroTitle: 'Manguera Blindex Contra Incendios',
    heroIntro: '…',
    imagen: '/img/mangueras-contra-incendios/manguera-blindex-1-5-15m-detalle.avif',
    faqs: [ { pregunta: '…', respuesta: '…' } ],
  },
  // …las otras 32, migradas con script desde las páginas actuales
];
```

**Paso 2 — ruta dinámica única** (`src/pages/[categoria]/[subcategoria].astro`) que reemplaza los 33 archivos:

```astro
---
import Base from '../../layouts/Base.astro';
import '../../styles/subcategory.css';
import { getCollection } from 'astro:content';
import SubcategoryProductCard from '../../components/SubcategoryProductCard.astro';
import ProductSidebar from '../../components/ProductSidebar.astro';
import RelatedProductsGrid from '../../components/RelatedProductsGrid.astro';
import CotizacionForm from '../../components/CotizacionForm.astro';
import Faq from '../../components/Faq.astro';
import { SUBCATEGORIAS } from '../../data/subcategorias';
import { buildProductCategorySchema, buildBreadcrumbSchema, buildFAQSchema, buildOrganizationSchema } from '../../lib/seo';
import { CATEGORY_LABELS, CATEGORY_SLUGS } from '../../lib/blogHelpers';

export async function getStaticPaths() {
  return SUBCATEGORIAS.map((def) => ({
    params: { categoria: def.categoria, subcategoria: def.slug },
    props: { def },
  }));
}

const { def } = Astro.props;
const todas = (await getCollection('productos', ({ data }) => data.categoria === def.categoria))
  .sort((a, b) => a.data.orden - b.data.orden);
const productos = todas.filter((p) => p.data.subcategoria === def.slug);
const relacionados = todas.filter((p) => p.data.subcategoria !== def.slug);
const hermanas = SUBCATEGORIAS
  .filter((s) => s.categoria === def.categoria)
  .map((s) => ({ slug: s.slug, nombre: s.nombre, descripcion: s.descripcionCorta, activo: s.slug === def.slug }));

const structuredData = [
  buildOrganizationSchema(),
  buildProductCategorySchema({ name: def.heroTitle, description: def.description, image: def.imagen, url: `/${def.categoria}/${def.slug}`, category: CATEGORY_LABELS[def.categoria] }),
  buildBreadcrumbSchema([
    { name: 'Inicio', url: '/' },
    { name: 'Equipos', url: '/equipos' },
    { name: CATEGORY_LABELS[def.categoria], url: `/${CATEGORY_SLUGS[def.categoria]}` },
  ]),
  buildFAQSchema(def.faqs), // ← FAQ schema y FAQ visible salen del MISMO dato
];
---
<Base title={def.title} description={def.description} ogImage={def.imagen}
      heroTitle={def.heroTitle} heroIntro={def.heroIntro} structuredData={structuredData}>
  <!-- template único: grid de productos, sidebar con `hermanas`, FAQ con def.faqs, CotizacionForm -->
</Base>
```

Las URLs actuales (`/mangueras/blindex`) **se conservan idénticas** — cero redirects. Migración segura: mover una categoría a la vez, comparar HTML generado en `dist/` antes/después (`diff`), borrar las páginas estáticas al validar.

### 12.2 `BaseHead.astro` extraído (para diversificar layouts sin duplicar SEO)

```astro
---
// src/components/BaseHead.astro — todo el <head> SEO reutilizable
interface Props { title: string; description: string; canonical?: string; ogImage?: string; ogType?: string; noindex?: boolean; structuredData?: object[]; }
// …lógica actual de Base.astro líneas 77–84…
---
<title>{title}</title>
<!-- meta description, robots, canonical, OG, Twitter, icons, preconnect, JSON-LD -->
```

`Base.astro` queda como composición: `<BaseHead {...seo} /> + TopBar/Header/Footer + <slot />`, y layouts especializados (`ArticleLayout`, `LegalLayout` sin hero/CTA) componen sin flags.

### 12.3 Schema Zod de productos endurecido (aplicar tras corregir los 66 metadatos)

```ts
title: z.string().min(20).max(70, 'Se trunca en SERP'),
description: z.string().min(80).max(165, 'Google trunca >165'),
certificaciones: z.array(z.enum(['UL Listed','FM Approved','NFPA 1961','NFPA 1962','NFPA 1964','NOM-002-STPS-2010' /* …lista canónica */])).optional(),
precioReferencia: z.string().regex(/^\$[\d,]+(\.\d{2})?\s*(USD|MXN)?.*$|^Por cotización$/i).optional(),
```

### 12.4 Normalización de tags

```ts
const normalizaTag = (t: string) => t.toLowerCase().trim()
  .normalize('NFD').replace(/[̀-ͯ]/g, '')   // sin acentos
  .replace(/\s+/g, '-');
tags: z.array(z.string().transform(normalizaTag))
  .refine((ts) => new Set(ts).size === ts.length, 'Tags duplicados')
  .default([]),
```

Más script one-shot que reescriba el frontmatter existente y fusione `hidrante→hidrantes`, `sprinkler→rociadores`, etc.

### 12.5 CI mínima (`.github/workflows/ci.yml`)

```yaml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm run content:blog:check
      - run: npx astro check
      - run: npm run build
```

---

## 14. Roadmap de Implementación Priorizado

**Semana 1 — Críticos** *(parcialmente hecho hoy ✅)*
- [x] Reparar build (categoría inválida)
- [x] Eliminar ratings/reseñas fabricados del JSON-LD
- [x] Corregir 5 titles/descriptions de blog
- [x] Endurecer schema (imagen/imagenAlt obligatorios)
- [ ] **Decisión de negocio sobre empresas-certificadas (§2.3)**
- [ ] CI con build+check (§12.5) — 1 hora, evita regresiones

**Semanas 2–3 — Altos**
- [x] Refactor subcategorías a ruta dinámica (§12.1) — **hecho, paridad 33/33 verificada**
- [ ] Migrar reescritura CDN a build-time (§3.2)
- [ ] Reescribir 66 descriptions + 58 titles de productos; luego aplicar §12.3
- [ ] Labels y validación accesible en formularios
- [ ] Fechas reales en los 16 posts sin fecha

**Semana 4 — Medios**
- [ ] Dividir `Base.astro` (§12.2) y descomponer BlogSidebar/SidebarDirectorio
- [ ] Normalizar tags (§12.4) y certificaciones (§12.3)
- [ ] Sistema de variables CSS + reorganización de styles
- [ ] Higiene de repo (docs/, tools/, borrar obsoletos)
- [ ] tooling: typescript, @astrojs/check, prettier

**Mes 2 — Crecimiento**
- [ ] Búsqueda con Pagefind (y validar el SearchAction del JSON-LD)
- [ ] Filtros de catálogo por certificación/diámetro
- [ ] Lighthouse CI con presupuestos de rendimiento
- [ ] axe-core en e2e
- [ ] Evaluar migración a Cloudflare Pages (headers de seguridad reales)
- [ ] Estrategia de contenido: imágenes inline en blog, cluster EPP enlazado

---

## 15. Checklist Completo de Optimización

**SEO**
- [x] Canonical coherente con trailingSlash
- [x] OG completo + locale + image dims
- [x] JSON-LD sin datos fabricados ✅ *(corregido hoy)*
- [x] robots.txt coherente ✅ *(corregido hoy)*
- [x] Sitemap index referenciado
- [x] Titles ≤70 / descriptions ≤165 en productos ✅ *(124 metas corregidas + schema)*
- [x] datePublished real en 100% del blog ✅
- [x] OG image específica por producto ✅
- [ ] Decisión empresas-certificadas *(única crítica pendiente — requiere decisión de negocio)*
- [x] Tags canónicos sin duplicados ✅ *(303→253, fusión conservadora)*

**Rendimiento**
- [x] JS mínimo, analytics defer
- [x] width/height en imágenes de componentes ✅ *(BlogCard corregido hoy)*
- [x] Preconnect CDN, fuente auto-hospedada
- [ ] CDN en build-time (no runtime) *(parcial: componentes clave ya lo usan; resta migrar `<img>` directos de páginas)*
- [x] fetchpriority en imagen LCP de producto ✅
- [x] Auditoría de pesos de fuente ✅ *(los 5 pesos en uso; se conservan)*
- [ ] Presupuestos CWV en CI

**Arquitectura**
- [x] Componentes muertos eliminados ✅
- [x] Build verde ✅
- [x] Subcategorías → ruta dinámica ✅ *(−8,500 líneas, paridad HTML 33/33)*
- [ ] Base.astro dividido
- [ ] Componentes >500 líneas descompuestos
- [ ] CSS modular con variables
- [x] CI + type-check + prettier ✅ *(astro check: 0 errors / 0 warnings)*
- [ ] Repo limpio (docs/, tools/)

**Contenido**
- [x] Schema con imagen/alt obligatorios ✅
- [x] Categoría de blog validada (enum completo) ✅
- [x] Schema de productos con límites SEO ✅
- [ ] Certificaciones canónicas
- [ ] 21 productos sin precio resueltos
- [ ] Imágenes inline en posts (74 pendientes)

**Accesibilidad / Seguridad / UX**
- [x] Labels en todos los formularios ✅ *(CotizacionForm, LeadCapture; contacto/cotizar ya los tenían)*
- [ ] Contraste ≥4.5:1 verificado
- [ ] axe-core en e2e
- [ ] Política set:html documentada
- [ ] Headers de seguridad (evaluar hosting)
- [ ] Búsqueda interna + filtros de catálogo

---

*Informe generado por auditoría técnica automatizada + verificación manual de hallazgos. Los conteos (58 titles, 66 descriptions, 16 posts sin fecha, etc.) fueron medidos programáticamente sobre el repositorio el 2026-06-10.*
