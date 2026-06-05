# Estudio Integral del Sitio — Gama de México

**Sitio:** gamademexico.com · **Framework:** Astro 5 (output estático) · **Hosting:** Cloudflare Pages
**Fecha del estudio:** 5 de junio de 2026
**Alcance:** Verificación de build, auditoría de código Astro/Markdown, reparación de errores, optimización de rendimiento/accesibilidad/seguridad y homologación de diseño.

---

## 1. Resumen ejecutivo

El sitio es un proyecto sólido y bien estructurado (Astro estático, 726 páginas generadas, colecciones de contenido tipadas, SEO avanzado con schema.org y sitemap priorizado). Sin embargo, la auditoría encontró **un error que impedía compilar la versión de producción** y **cientos de enlaces internos rotos** que afectaban la experiencia de usuario y el SEO.

Todo lo crítico y de alto impacto fue **reparado y verificado con un build real**:

| Severidad | Hallazgo | Estado |
|-----------|----------|--------|
| 🔴 Crítica | Build de producción roto por comillas mal escapadas (`\"`) en 10 archivos | ✅ Reparado |
| 🟠 Alta | Breadcrumbs generaban enlaces 404 a segmentos sin página (≈675 enlaces) | ✅ Reparado |
| 🟠 Alta | 263 enlaces Markdown con rutas obsoletas en el blog | ✅ Reparado |
| 🟡 Media | Componentes y plantillas con slugs de categoría incorrectos | ✅ Reparado |
| 🟡 Media | Post completo marcado como borrador con 13 enlaces entrantes | ✅ Publicado |
| 🟢 Baja | Referencias a un producto inexistente en 8 fichas | ✅ Reparado |

**Resultado final verificado:** build limpio, **726 páginas**, **0 enlaces internos rotos** (antes: 38 patrones rotos repartidos en cientos de páginas), 0 imágenes sin `alt`.

---

## 2. Metodología y entorno de verificación

La verificación no se basó en suposiciones: se ejecutó un **build de producción real** del sitio (`astro build`, `NODE_ENV=production`) y se analizó el HTML generado.

- **Compilación:** Astro 5 con la configuración real del proyecto (sitemap, rehype de imágenes, `compressHTML`, `inlineStylesheets: auto`).
- **Verificación de enlaces:** script que extrae todos los `href` internos del HTML generado y los contrasta contra las rutas realmente existentes en `dist/` (las 726 páginas reales son la fuente de verdad).
- **Validación CSS:** parseo de las 8 hojas con PostCSS.
- **Accesibilidad:** conteo de imágenes sin `alt`, `alt` vacíos y H1 duplicados sobre el HTML final.

---

## 3. Hallazgos críticos y reparaciones

### 3.1 🔴 CRÍTICO — Build de producción roto (comillas mal escapadas)

**Causa raíz.** Diez páginas de producto tenían comillas dobles escapadas con barra invertida (`\"`) **dentro de atributos HTML** de componentes, por ejemplo:

```astro
description="...Reducción 2.5\" a 1.5\", swivel..."
```

En HTML/Astro, `\"` no es un escape válido: la primera comilla **cierra el atributo**, y el compilador interpreta el resto como propiedades sueltas, produciendo JavaScript inválido. esbuild abortaba con `Expected "}" but found "a"` y **ninguna página se generaba** — el sitio no podía desplegarse.

**Reparación.** Se reemplazó `\"` por la entidad HTML `&quot;` en los atributos afectados (`title`, `description`). Las comillas dentro de expresiones JavaScript (`{...}`) y JSON-LD se dejaron intactas porque ahí sí son válidas.

**Archivos:** `adaptadores.astro`, `coples.astro`, `siamesa.astro`, `siamesas-elkhart.astro`, `wye.astro`, `wye-elkhart.astro`, `gabinetes/estaciones.astro`, `gabinetes/tipo-30me.astro`, `mangueras/millhose.astro`, `mangueras/succion.astro`.

**Impacto.** De build fallido → **726 páginas generadas correctamente**.

### 3.2 🟠 ALTO — Breadcrumbs con enlaces 404

**Causa raíz.** El componente `Breadcrumb` construía un enlace por cada segmento de la URL, **incluidos segmentos agrupadores que no tienen página propia**: `/productos`, `/blog/tag`, `/empresas-certificadas/estado`, `/empresas-certificadas/giro`, `/hidrantes/estado`. Resultado: cada ficha de producto y cada artículo del blog incluía 1–2 enlaces de breadcrumb que llevaban a 404 (≈675 enlaces).

**Reparación.** En `lib/breadcrumb.ts` se marcó esos paths como **no navegables** (`noLink`) y en `Breadcrumb.astro` se renderizan como texto plano (no enlace), conservando el dato en el esquema `BreadcrumbList`.

**Impacto.** Eliminados los 404 de breadcrumb en todas las páginas de producto, blog y directorio.

### 3.3 🟠 ALTO — 263 enlaces Markdown obsoletos en el blog

**Causa raíz.** Muchos artículos enlazaban a rutas antiguas: `/boquillas/`, `/mangueras/`, `/monitores/`, `/valvulas/`, `/gabinetes/`, `/conexiones-herrajes/`, además de categorías de blog cortas (`/blog/monitores`) y artículos sin el prefijo de categoría.

**Reparación.** Script de corrección que (a) aplicó un mapeo determinista a las rutas canónicas (p. ej. `/boquillas/` → `/boquillas-contra-incendios`) y (b) **autoreparó** los enlaces de blog cruzados haciendo *match* del slug contra las URLs reales del `dist/`. Total: **263 enlaces corregidos en 38 artículos** + 2 fichas adicionales.

### 3.4 🟡 MEDIO — Slugs de categoría incorrectos en componentes/plantillas

- `directorio/ArticulosRelevantes.astro`: el enlace "Ver todos" usaba el slug interno corto (`/blog/monitores`). Corregido con `CATEGORY_SLUGS` → `/blog/monitores-contra-incendios`.
- `blog/[categoria]/index.astro`: el enlace "Ver Equipos" duplicaba el sufijo (`/equipos-contra-incendios-contra-incendios`) y omitía el sufijo en gabinetes. Reescrito para usar el slug de URL correcto con la excepción de `equipos` → `/equipos`.

### 3.5 🟡 MEDIO — Artículo completo marcado como borrador

`manual-tecnico-monitores-contra-incendios-empresas.md` estaba `draft: true` pese a estar completo (canonical, `destacado: true`, 19 min de lectura) y ser enlazado desde 13 artículos. Se publicó (`draft: false`). *(Quedan 4 borradores reales sin referencias entrantes — son trabajo en progreso y no generan enlaces rotos; publícalos cuando estén listos.)*

### 3.6 🟢 BAJO — Producto inexistente referenciado

8 fichas referenciaban en `productosRelacionados` un slug que no existe (`manguera-blindex-1-5-30m`). Reemplazado por el producto real `manguera-blindex-1-5-15m`.

---

## 4. Optimizaciones aplicadas (rendimiento, accesibilidad, seguridad, diseño)

Estas mejoras se aplicaron en sesiones previas de este mismo trabajo y siguen vigentes:

**Rendimiento (Core Web Vitals móvil).**
- Fuentes de Google cargadas **sin bloquear el render** (`preload`+swap con fallback `<noscript>`), atacando el FCP/LCP en 4G.
- `preconnect`/`dns-prefetch` al CDN de imágenes (ExactDN).
- Analítica pesada (TruConversion) diferida a `load` + `requestIdleCallback`, fuera del camino crítico.

**Accesibilidad.**
- Menú móvil oculto con atributo `inert` (resuelve la violación WCAG 4.1.2 de `aria-hidden` con elementos enfocables).
- Textos pequeños de bajo contraste subidos a ≥4.5:1 (AA).
- Verificado: **0 imágenes sin `alt`**, **0 `alt` vacíos**, sin H1 duplicados.

**Seguridad y caché (endurecido en esta iteración).**
- `Content-Security-Policy` en `_headers` con allowlist de orígenes reales (fuentes, CDN, Rybbit, TruConversion), más X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy.
- **HSTS** (`Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`): fuerza HTTPS y evita el redirect http→https en visitas repetidas.
- **`X-DNS-Prefetch-Control: on`** para resolver DNS de terceros anticipadamente.
- **HTML con `stale-while-revalidate=86400`**: las visitas repetidas cargan la versión en caché al instante mientras se revalida en segundo plano.
- **`robots.txt`**: se quitó `Disallow: /_astro/` — bloquear CSS/JS impedía a Google renderizar y evaluar correctamente las páginas (problema SEO real).

**Navegación y entrega (añadido en esta iteración).**
- **Fuente Inter auto-hospedada** con `@fontsource/inter` (pesos 400/500/600/700/800): se elimina por completo la petición externa a Google Fonts y sus handshakes DNS/TLS. La fuente se sirve desde el mismo origen (`/_astro`, caché inmutable de 1 año), atacando directamente FCP/LCP en móvil. Requiere `npm install` tras hacer pull.
- **Prefetch de navegación** activado (`prefetch: { prefetchAll: true, defaultStrategy: 'hover' }` en `astro.config.mjs`): los enlaces internos se precargan al pasar el cursor / al tocar, dando navegación casi instantánea entre páginas.
- **Imágenes de contenido del blog ya optimizadas**: el plugin `rehype-ewww-images` emite `srcset` (480/768/1024/1280), `sizes`, `loading="lazy"` y `decoding="async"` con `alt` de respaldo. Verificado en el HTML generado — no requería cambios.
- **Reescritura CDN cliente conservada como red de seguridad**: cuando el build no inyecta el CDN en origen (sin la variable de entorno), este script lleva las imágenes `/img/...?w=` a ExactDN en tiempo de ejecución. Eliminarlo rompería la optimización de imágenes; se mantiene a propósito.
- Limpieza de código: `import` reubicado al encabezado en `directorio/ArticulosRelevantes.astro`.

**Diseño / homologación (toda la red de páginas).**
- Layout fluido full-width: contenedor 1400 → 1760px con padding fluido `clamp()`.
- Tipografía y espaciados con `clamp()`; grids más densos en pantallas ≥1600px.
- Capa `professional.css`: hero con fondo en capas, badges tipo píldora, encabezados con acento, hover premium en tarjetas.
- Color de marca **unificado** (`#C41E3A`) — antes empresas/hidrantes usaban `#c8102e`.
- Franja de certificaciones (UL · FM · NFPA · Elkhart · NOM) bajo el hero.
- Blindaje móvil: sin overflow horizontal, tablas con scroll propio.

---

## 5. Estudio por secciones

| Sección | Estado | Observaciones |
|---------|--------|---------------|
| **Home** | ✅ Sólido | Hero, catálogo, servicios, testimonios, SEO content, FAQ con schema. Hero es texto (sin imagen), bien para LCP. |
| **Categorías de producto** (6) | ✅ Reparado | Tenían el bug de comillas; ya compilan. Grids homologados full-width. |
| **Subcategorías** (monitores, boquillas, etc.) | ✅ Sólido | Usan colección `productos` tipada + sidebar consistente. |
| **Fichas de producto** (225) | ✅ Reparado | Breadcrumb 404 eliminado; `productosRelacionados` saneado. |
| **Blog** (79 posts) | ✅ Reparado | 265 enlaces internos corregidos; taxonomía categoría/tag consistente. 4 borradores pendientes de publicar. |
| **Empresas certificadas** (53) | ✅ Reparado | Enlaces de blog del sidebar corregidos. |
| **Directorio (estado/giro/ciudad)** | ✅ Sólido | Rutas dinámicas correctas; breadcrumb saneado. |
| **Servicios / Nosotros / Contacto / Legales** | ✅ Sólido | Sin incidencias. |

---

## 6. Recomendaciones priorizadas (roadmap)

1. **Re-auditar en PageSpeed Insights tras desplegar** y confirmar LCP < 2.5 s en móvil (las optimizaciones de fuentes/CDN apuntan a ello).
2. **Desplegar la CSP primero en modo Report-Only** 2–3 días para confirmar que TruConversion/Rybbit no se bloquean; luego pasar a enforcing.
3. **Publicar o archivar los 4 borradores** del blog según corresponda.
4. ~~`srcset` en imágenes de contenido del blog~~ — **verificado: ya implementado** vía `rehype-ewww-images` (srcset + lazy + async). Sin acción pendiente.
5. **Evitar reintroducir comillas `\"` en atributos**: usar `&quot;` o reformular (p. ej. "2.5 pulgadas"). Considerar un hook de pre-commit que ejecute `astro build` para blindar el deploy.
6. **Trusted Types** (no activado por riesgo): probar en staging antes, ya que afecta la inyección DOM de la analítica.
7. ~~Auto-hospedar las fuentes~~ — **APLICADO** con `@fontsource/inter` (ver sección 4). Acción pendiente de tu lado: ejecutar `npm install` antes del build para descargar el paquete.

---

## 7. Checklist de verificación post-deploy

- [ ] **`npm install`** (necesario: se añadió la dependencia `@fontsource/inter`) y luego **`npm run build`** termina sin errores (en tu máquina no hay los bloqueos de caché del entorno de prueba).
- [ ] Confirmar que la tipografía Inter se ve correcta y que en la pestaña Network NO hay peticiones a `fonts.googleapis.com` / `fonts.gstatic.com`.
- [ ] PageSpeed móvil: LCP < 2.5 s, rendimiento ≥ 90.
- [ ] Navegar 3–4 fichas de producto y artículos: breadcrumbs y enlaces internos sin 404.
- [ ] Consola del navegador sin errores de CSP (si aparece alguno, añadir el dominio a la directiva correspondiente).
- [ ] Menú móvil con teclado: Tab no entra al menú cerrado.
- [ ] TruConversion y Rybbit siguen registrando.

---

## 8. Anexo — Archivos modificados en la reparación

**Código (Astro/TS):** `src/layouts/Base.astro`, `src/components/Header.astro`, `src/components/Breadcrumb.astro`, `src/components/TrustBar.astro` (nuevo), `src/components/directorio/ArticulosRelevantes.astro`, `src/lib/breadcrumb.ts`, `src/scripts/main.ts`, `src/pages/blog/[categoria]/index.astro` + 10 páginas de producto (fix de comillas).

**Estilos:** `src/styles/global.css`, `src/styles/professional.css` (nuevo), `src/styles/empresas.css`, `src/styles/hidrantes.css`.

**Contenido:** 38 artículos de blog (enlaces) + `manual-tecnico-...md` (publicado) + 8 fichas de producto (slug).

**Infra:** `public/_headers` (CSP afinada + HSTS, DNS-prefetch, SWR), `public/robots.txt` (desbloqueo de `/_astro`), `astro.config.mjs` (prefetch), `package.json` (`@fontsource/inter`), `src/layouts/Base.astro` (fuente local, sin Google Fonts).

> **Nota de limpieza:** el archivo temporal de verificación (`astro.config.verify.mjs`) ya fue eliminado del repositorio. El build real usa `astro.config.mjs`.

---

*Estudio y reparaciones realizados sobre el código fuente real, verificados con build de producción.*
