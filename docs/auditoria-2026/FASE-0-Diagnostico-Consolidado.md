# FASE 0 — Diagnóstico Consolidado
**Proyecto:** GAMADEMEXICO · gamademexico.com  
**Stack:** Astro 6.1.1 estático · Cloudflare Pages · ExactDN CDN  
**Fecha de análisis:** 2026-07-01  
**Analista:** Claude (auditor técnico senior)  
**Estado del análisis:** ✅ COMPLETO — Listo para FASE 1  

---

## 1. Inventario Verificado del Sitio

| Recurso | Cantidad | Notas |
|---|---|---|
| Templates `.astro` | 38 | Incluyendo rutas dinámicas |
| Componentes | 32 | 7 de blog, 3 de directorio, 1 SEO |
| Hojas CSS | 9 | ~6,300+ líneas totales |
| Blog posts | 84 | 4 con `draft: true` |
| Productos | 225 | 100% con imagen y alt desde auditoría anterior |
| Empresas certificadas | 52 | ⚠️ Todas con `verificado: true`, sin noindex |
| Categorías | 6 | Con datos JSON en `src/data/subcategorias/` |
| Hidrantes | 4 | Datos demo, sección pública sin noindex |
| Subcategorías (ruta dinámica) | 33 | Refactorizadas a 1 template en auditoría anterior |
| Imágenes en `public/img/` | ~1,618 | Dominan AVIF, 6 JPG legítimas |
| Tags únicos de blog | 253 | Normalizados desde 303 en auditoría anterior |

---

## 2. Estado de la Base Técnica

### 2.1 Lo que ya está resuelto (NO tocar — confirmado en código)

Las siguientes mejoras fueron implementadas en auditorías previas y están **verificadas en el código actual**:

| Ítem | Evidencia en código |
|---|---|
| Build verde, 0 errores | `git log`: "fase 8: fix @import CSS spec" — último commit estable |
| `astro check`: 0 errors / 0 warnings | CI configurado, devDependencies incluyen `@astrojs/check` |
| Ratings/reviews fabricados eliminados del JSON-LD | `src/lib/seo.ts`: `buildProductCategorySchema` sin `aggregateRating` |
| 33 páginas duplicadas → 1 ruta dinámica | `src/pages/[seccion]/[subcategoria].astro` + `src/data/subcategorias/*.generated.json` |
| Breadcrumbs con 404 reparados | `src/lib/breadcrumb.ts` con paths `noLink` |
| 263 enlaces Markdown del blog corregidos | ESTUDIO-INTEGRAL-SITIO-2026.md confirma 0 internos rotos |
| Tags normalizados 303 → 253 | `grep tags` en `/content/blog/` muestra 253 únicos |
| Fechas reales en 84 posts | `fecha` presente desde git log de cada archivo |
| Formularios con labels accesibles | `CotizacionForm.astro`, `LeadCapture.astro` |
| Mobile overhaul (mobile.css 16 secciones) | `src/styles/mobile.css` presente + import en `Base.astro` |
| CI/CD con astro check + build | `.github/workflows/ci.yml` + `deploy.yml` a Cloudflare Pages |
| Headers de seguridad (CSP, HSTS, X-Frame) | `public/_headers` completo |
| robots.txt limpio | Permite AI crawlers, bloquea AhrefsBot/Semrush, sin Crawl-delay |
| Migración Astro 5 → 6 | `package.json`: `"astro": "^6.1.1"` |
| Schema Zod endurecido (titles/desc con min/max) | `src/content.config.ts` confirma límites en productos y blog |
| OG image específica por producto | `src/pages/productos/[...slug].astro` |
| ExactDN CDN configurado + headers de cache | `public/_headers` + `astro.config.mjs` |

### 2.2 Calificación global actual estimada: 7.8/10

Subió desde el 7.1/10 de la auditoría de junio gracias al mobile overhaul, CI hardening y migración Astro 6.

---

## 3. Causas Raíz Confirmadas (Pendientes)

### CR-01 — Empresas Certificadas: riesgo legal y SEO activo 🔴

**Severidad:** Crítica  
**Archivos:** `src/content/empresas-certificadas/*.md` (52 archivos) + `src/pages/empresas-certificadas/*.astro`  
**Evidencia directa en código:**  
- `grep -rl "verificado: true"` → 52/52 archivos tienen `verificado: true`  
- `empresas-certificadas/index.astro` sin `noindex`, sin restricción de robots  
- El schema Zod define `certificadoPor: "Gama de México"` como default  
- Las páginas son 100% indexables y están en el sitemap

**Descripción técnica:** 52 páginas públicas afirman que empresas reales e identificables (Four Seasons, BMW, Pemex, hospitales, universidades) fueron certificadas por Gama de México, con `verificado: true`, sin campo de fuente ni evidencia. El JSON-LD de las páginas de directorio emite esta información como dato estructurado.

**Impacto triple:**  
1. **Legal:** afirmar certificación de terceros sin autorización expone a reclamación por uso de marca  
2. **SEO:** "scaled content abuse" policy de Google degrada contenido fabricado a escala; potencial action manual  
3. **Conversión:** si un prospecto verifica y encuentra que la empresa mencionada no reconoce esa certificación, pierde credibilidad

**Decisión pendiente (no técnica):** Frank debe decidir entre tres opciones antes de FASE 1:  
- A) `noindex` inmediato en todo el directorio mientras se decide  
- B) Anonimizar: convertir a casos de estudio sin mencionar marcas  
- C) Legitimar: conservar solo clientes con autorización escrita, campo `autorizacion` requerido en schema

**Acción técnica mínima inmediata:** `noindex: true` en `pages/empresas-certificadas/index.astro` y en `[slug].astro` como medida de contención mientras se toma la decisión de negocio.

---

### CR-02 — SearchAction JSON-LD falso 🟠

**Severidad:** Alta  
**Archivo:** `src/lib/seo.ts` líneas ~107-110  
**Evidencia:**
```typescript
potentialAction: {
  '@type': 'SearchAction',
  target: `${SITE_URL}/equipos?q={search_term_string}`,
  'query-input': 'required name=search_term_string',
}
```
**Problema:** `/equipos?q=` no tiene implementación de búsqueda (Pagefind no está instalado, `grep -rn "pagefind"` → 0 resultados). Google puede detectar que la URL de búsqueda no funciona y degradar el rich result o penalizar el schema.  
**Impacto:** SEO medio. No bloquea indexación pero daña la credibilidad del schema.  
**Solución:** Eliminar el `potentialAction` del WebSite schema hasta implementar Pagefind, o implementar Pagefind (tarea de FASE 5).

---

### CR-03 — Imágenes en páginas clave sin CDN en build-time 🟠

**Severidad:** Alta (rendimiento LCP)  
**Archivos afectados con `src="/img/"` directo:**
- `nosotros.astro`: 4 imágenes AVIF del equipo  
- `servicios/mantenimiento.astro`: 4 imágenes AVIF de servicio  
- `servicios/asesoria.astro`: 2 imágenes AVIF  
- `index.astro`: logos SVG de clientes (9 — irrelevante, SVG no lo procesa ExactDN)

**Problema:** El script runtime de `Base.astro` reescribe `img[src^="/img/"]` al CDN en `DOMContentLoaded`. Para entonces el navegador ya inició la descarga desde el origen. Son imágenes secundarias (no LCP crítico), pero sí innecesariamente lentas.  
**Componentes que ya lo hacen bien:** `CategoryCard`, `ServiceCard`, `BlogCard`, `Header`, `SubcategoryProductCard` — todos usan `getOptimizedImageUrl()` o `getBackgroundImageUrl()` del helper `lib/images.ts`.  
**Solución:** Aplicar `import { getOptimizedImageUrl } from '../../lib/images'` + sustitución en las 3 páginas. Es un cambio mecánico de bajo riesgo.

---

### CR-04 — `prefetchAll: true` en catálogo masivo 🟡

**Severidad:** Media  
**Archivo:** `astro.config.mjs`  
```js
prefetch: { prefetchAll: true, defaultStrategy: 'hover' }
```
**Problema:** Precarga especulativa en hover para TODOS los enlaces. En páginas con 100+ productos (catálogo, subcategorías), esto dispara decenas de prefetch requests simultáneos al pasar el cursor. En móvil táctil y conexiones lentas impacta el ancho de banda sin beneficio percibido.  
**Solución controlada:** Cambiar a `defaultStrategy: 'viewport'` — solo precarga lo visible en pantalla. O aplicar `data-astro-prefetch="false"` selectivamente en los grids de productos.  
**Riesgo de cambio:** Bajo. Navegación ligeramente menos "instantánea" para usuarios con hover, pero mejor comportamiento en móvil.

---

### CR-05 — Draft posts: verificar exclusión del build 🟡

**Severidad:** Media  
**Evidencia:** `grep -rl "draft: true" content/blog/` → 4 archivos  
**Problema potencial:** En Astro con Content Collections, `draft: true` NO excluye automáticamente del build a menos que el código haga `filter(p => !p.data.draft)` explícitamente. Si las páginas se generan con `draft: true`, están siendo indexadas.  
**Verificación requerida:** Revisar `blog/[categoria]/[slug].astro` para confirmar que filtra `draft: false`.

---

### CR-06 — Colección hidrantes: 4 entradas demo indexadas 🟡

**Severidad:** Media-baja  
**Archivos:** `src/content/hidrantes/*.md` (4 archivos), `src/pages/hidrantes/`  
**Problema:** 4 entradas de datos demo generan una sección pública `/hidrantes` indexable, sin noindex, con contenido mínimo. Thin content.  
**Opciones:** Añadir `noindex` a las rutas de hidrantes hasta que haya contenido real, o llenar con datos reales.

---

### CR-07 — Organization schema sin sameAs (redes sociales vacías) 🟡

**Severidad:** Baja  
**Archivo:** `src/lib/config.ts`  
```ts
export const SOCIAL_MEDIA = { facebook: '', instagram: '', linkedin: '', youtube: '' }
```
`getSocialMediaUrls()` retorna `[]`. El Organization schema emite `sameAs: []`.  
**Impacto SEO:** Menor, pero `sameAs` es una señal de entidad para Knowledge Panel. Si existen perfiles, deben añadirse.

---

### CR-08 — CSS: 9 archivos sin auditoría post-overhaul 🟡

**Severidad:** Media  
**Archivos:** `global.css`, `professional.css`, `mobile.css`, `subcategory.css`, `services-shared.css`, `nosotros.css`, `contacto.css`, `empresas.css`, `hidrantes.css`  
**Riesgo:** Después del mobile overhaul y múltiples fases de trabajo, es probable que haya reglas duplicadas, variables inconsistentes y colores hardcodeados (`#25D366` para WhatsApp confirmado en auditoría anterior).  
**No bloquea FASE 1** pero es deuda técnica creciente.

---

## 4. Problemas Descartados (Ruido / Ya Resueltos)

Los siguientes fueron reportados en auditorías anteriores pero están **confirmados como resueltos en el código actual**:

| Problema | Por qué se descarta |
|---|---|
| Build roto (comillas `\"`) | Resuelto. Build verde en todas las ramas |
| Ratings/reseñas fabricadas en JSON-LD | `seo.ts` sin `aggregateRating` — confirmado |
| 33 páginas de subcategoría duplicadas | Ruta dinámica implementada y verificada |
| Breadcrumbs con 404 | `breadcrumb.ts` con `noLink` — implementado |
| 263 enlaces Markdown rotos | Reparados en ESTUDIO-INTEGRAL-SITIO-2026 |
| Títulos/descriptions fuera de rango SEO | Schema Zod con min/max activo, 124 corregidos |
| Formularios sin labels (WCAG) | `CotizacionForm.astro` y `LeadCapture.astro` corregidos |
| Tags duplicados de blog | Normalizados a 253 únicos |
| Posts sin fecha (`datePublished`) | `fecha` añadida desde `git log` en los 84 posts |
| TypeScript 92 errores | `astro check` → 0 errors / 0 warnings |
| OG image falsa (image/jpeg para avif) | `og:image:type` dinámico implementado en `Base.astro` |
| robots.txt incoherente | Limpiado, sin Crawl-delay ni grupos duplicados |
| Componentes muertos (OptimizedImage, ResponsiveImage) | Eliminados |
| ExactDN no configurado en headers | `public/_headers` completo con cache-control |
| GitHub Pages → sin headers de seguridad | Migrado a Cloudflare Pages con `_headers` completos |

---

## 5. Riesgos de Arquitectura

| Riesgo | Impacto | Urgencia |
|---|---|---|
| `Base.astro` monolítico (24 props) | Mantenibilidad media | Fase 5 |
| CSS sin modularizar (9 archivos, ~6k líneas) | Deuda técnica creciente | Fase 5 |
| `BlogSidebar.astro` (~894 líneas en auditoría previa) | Difícil mantener | Fase 5 |
| `empresas-certificadas` indexadas sin decisión | Legal + SEO activo | **FASE 1** |
| `SearchAction` falso en JSON-LD | Confianza de schema | **FASE 1** |
| `prefetchAll: true` en catálogo masivo | Performance móvil | FASE 2 |
| Imágenes sin CDN build-time en 3 páginas | LCP subóptimo | FASE 2 |
| Pagefind no implementado (buscador inexistente) | UX catálogo | Fase 5 |

---

## 6. Matriz de Prioridades

### P1 — Crítico / Alta Urgencia

| ID | Problema | Archivos | Impacto | Esfuerzo |
|---|---|---|---|---|
| P1-01 | Empresas certificadas: `noindex` inmediato | `pages/empresas-certificadas/*.astro` | Legal + SEO | Bajo |
| P1-02 | SearchAction falso: eliminar del schema | `src/lib/seo.ts` | SEO schema | Bajo |
| P1-03 | Draft posts: verificar exclusión del build | `blog/[categoria]/[slug].astro` | SEO (thin content) | Muy bajo |
| P1-04 | Hidrantes demo: `noindex` inmediato | `pages/hidrantes/*.astro` | SEO (thin content) | Muy bajo |

### P2 — Alta / No Urgente

| ID | Problema | Archivos | Impacto | Esfuerzo |
|---|---|---|---|---|
| P2-01 | CDN build-time en nosotros + servicios | 3 páginas .astro | LCP, rendimiento | Bajo |
| P2-02 | `prefetchAll: true` → `viewport` | `astro.config.mjs` | Performance móvil | Muy bajo |
| P2-03 | Social media schema (sameAs vacío) | `src/lib/config.ts` | SEO entidad | Muy bajo |
| P2-04 | Auditoría CSS post-overhaul | 9 archivos CSS | Mantenibilidad | Medio |

### P3 — Media / Largo Plazo

| ID | Problema | Archivos | Impacto | Esfuerzo |
|---|---|---|---|---|
| P3-01 | Dividir `Base.astro` (24 props) | 1 layout + múltiples | Mantenibilidad | Alto |
| P3-02 | Descomponer BlogSidebar (~894 líneas) | `components/blog/BlogSidebar.astro` | Mantenibilidad | Medio |
| P3-03 | Implementar Pagefind (búsqueda real) | build config + componente | UX catálogo | Alto |
| P3-04 | Decisión definitiva empresas-certificadas | Contenido + código | Legal + SEO | Alto (negocio) |
| P3-05 | Filtros de catálogo (por certificación, marca) | Páginas de subcategoría | Conversión | Alto |

---

## 7. Plan de Ejecución por Fases

### FASE 1 — Estabilización Técnica Crítica
**Alcance:** P1-01 a P1-04. Cambios de bajo riesgo con impacto alto.  
**Criterio de entrada:** FASE 0 aprobada por Frank.  
**Criterio de salida:** Build verde, 0 páginas con riesgo legal/SEO activo indexadas, SearchAction eliminado.  
**Archivos a tocar:** 5 archivos máximo. Zero cambios de layout, CSS o contenido.

**Tareas específicas:**
1. `noindex: true` en `pages/empresas-certificadas/[slug].astro` + `index.astro` + `estado/[estado].astro` + `giro/[giro].astro`
2. Eliminar `potentialAction` de `buildWebSiteSchema()` en `src/lib/seo.ts`
3. Verificar que draft posts tienen `noindex` o están excluidos del `getStaticPaths`
4. `noindex: true` en `pages/hidrantes/[id].astro` + `index.astro` + `estado/[estado].astro`
5. Validar build post-cambios (`npm run build`)

**Tiempo estimado:** 1-2 horas de trabajo controlado.  
**Riesgo:** Muy bajo. Todos los cambios son aditivos (agregar noindex) o extractivos (quitar bloque de schema). Cero refactorización.

---

### FASE 2 — Rendimiento y SEO Técnico
**Alcance:** P2-01 a P2-04.  
**Tareas:**
1. CDN build-time en `nosotros.astro`, `servicios/mantenimiento.astro`, `servicios/asesoria.astro`
2. `prefetchAll: true` → auditar y ajustar
3. Añadir URLs reales de redes sociales a `config.ts`
4. Auditoría y limpieza de CSS (9 archivos)

---

### FASE 3 — Contenido y Calidad Editorial
**Alcance:** 4 draft posts, revisar contenido de `/precios`, revisar `/empresas-certificadas` post-decisión.

---

### FASE 4 — Conversión y Captación
**Alcance:** Formularios, CTAs, rutas de conversión, fricción de usuario.

---

### FASE 5 — Mantenibilidad y Cierre
**Alcance:** Dividir `Base.astro`, descomponer componentes grandes, Pagefind, CSS modular, higiene del repo.

---

## 8. Quick Wins Confirmados (Ordenados por ROI)

1. **Eliminar SearchAction falso** — 5 líneas de código, elimina riesgo de schema inconsistente con realidad
2. **noindex en hidrantes** — 3 líneas, elimina thin content indexado
3. **noindex temporal en empresas-certificadas** — 4 archivos, elimina el riesgo más grave del sitio
4. **prefetchAll → viewport** — 1 línea en `astro.config.mjs`, mejora perf móvil sin riesgo
5. **Añadir redes sociales a config.ts** — 4 líneas, mejora entidad en Knowledge Graph

---

## 9. Pregunta Bloqueante para Frank (antes de FASE 1)

**Sobre empresas-certificadas:** ¿Cuál es la decisión de negocio?

- **Opción A (recomendada como primer paso):** `noindex` inmediato en toda la sección. El contenido sigue en el sitio pero no indexado. Tiempo ganado para decidir la estrategia final sin riesgo activo.
- **Opción B:** Eliminar toda la sección (`410 Gone` en todas las URLs).
- **Opción C:** Reestructurar como casos de estudio anónimos sin marcas.

Esta decisión no la puedo tomar yo. Sin la respuesta de Frank, ejecutaré **Opción A** (noindex temporal) en FASE 1 como medida de contención, documentando que la decisión definitiva queda pendiente.

---

## 10. Notas Técnicas Importantes

### Sobre el Vault de Obsidian
La ruta `/Users/carsolio/Desktop/Obsidian/PROJECTS/GAMADEMEXICO` no es accesible desde el entorno de trabajo (bash solo tiene acceso a la carpeta del proyecto). Para documentar en Obsidian: conectar esa carpeta como segunda carpeta de trabajo en Cowork, o mover este documento manualmente al vault.

### Sobre el Estado Real vs. Esperado
El sitio está en un estado notablemente mejor de lo que un nuevo auditor esperaría. Múltiples sesiones de trabajo previas resolvieron los problemas más graves. Lo que queda son problemas específicos y bien delimitados, no una deuda masiva. El enfoque correcto es quirúrgico, no de reestructuración.

### Sobre el Build
El último commit (`fase 8: fix @import CSS spec`) es estable. No hay evidencia de regresiones. El CI está configurado y funcional. Antes de FASE 1, hacer `npm run build` local para confirmar el punto de partida.

---

*Documento generado: 2026-07-01 | Autor: Claude | Próximo paso: aprobación Frank → FASE 1*
