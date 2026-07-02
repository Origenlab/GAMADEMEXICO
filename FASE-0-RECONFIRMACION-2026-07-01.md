# FASE 0 — Reconfirmación de Realidad
**Fecha:** 2026-07-01  
**Ejecutado por:** Director Técnico / Claude  
**Alcance:** Estado exacto de gamademexico.com — local vs producción vs CF Pages

---

## HALLAZGO CRÍTICO: Arquitectura de Despliegue Rota

### Situación real confirmada con evidencia

El sitio gamademexico.com **NO está siendo servido desde Cloudflare Pages** (donde se despliega el código actual). Está siendo servido desde **GitHub Pages** con un build del ~15 de junio de 2026.

| Capa | URL | Origen real | Build en producción |
|---|---|---|---|
| **Live (usuario real)** | gamademexico.com | GitHub Pages (Fastly CDN) | ~15 Jun 2026 |
| **CF Pages** | gamademexico.pages.dev | Cloudflare Pages | ~24 Jun 2026 (parcial) |
| **Código local** | — | Repositorio main | 1 Jul 2026 (latest) |

**Evidencia de origen GH Pages:**
- Headers: `x-github-request-id`, `via: 1.1 varnish`, `x-fastly-request-id` en TODAS las respuestas de gamademexico.com
- `last-modified: Mon, 15 Jun 2026 19:09:16 GMT` en robots.txt y home
- CNAME file en root del repo: `gamademexico.com` (GitHub Pages custom domain)

**Por qué sucedió:**
1. El proyecto migró de GitHub Pages a Cloudflare Pages el **19 Jun 2026** (commit `1fdc416`)
2. El deploy.yml fue actualizado para usar Wrangler/CF Pages
3. El DNS **NUNCA fue actualizado** para apuntar a CF Pages
4. GitHub Pages sigue activo sirviendo el build del 15 Jun — todos los commits posteriores van a CF Pages (gamademexico.pages.dev) pero no al dominio real

---

## Tabla de Estado por Frente

| Frente | Hallazgo exacto | Estado local | Estado CF Pages (pages.dev) | Estado Prod (GH Pages) | Riesgo | Prioridad | Acción |
|---|---|---|---|---|---|---|---|
| **DNS / Despliegue** | DNS apunta a GH Pages, no CF Pages | ✅ código correcto | ✅ funciona en pages.dev | ❌ build Jun 15 | CRÍTICO | **P0** | Frank: cambiar DNS en CF Dashboard |
| **robots.txt — AI Scrape Shield** | CF reemplaza robots.txt en edge con versión que bloquea GPTBot, ClaudeBot, Google-Extended, Bytespider, Applebot-Extended, meta-externalagent, Amazonbot | ✅ correcto en repo | ✅ sirve versión correcta | ❌ CF AI Scrape Shield activo | CRÍTICO | **P0** | Frank: deshabilitar AI Scrape Shield en CF Dashboard |
| **llms.txt** | Existe en dist/ y public/ — sirve 200 en pages.dev | ✅ | ✅ 200 OK | ❌ 404 | ALTO | P1 | Se resuelve con fix DNS |
| **Canonical home** | dist/index.html tiene canonical `/index` en lugar de `/` — bug introducido con `build.format:'file'` | ❌ BUG en código | ❌ bug en build | ✅ correcto (build antiguo) | ALTO | P1 | **CORREGIDO** en Base.astro (commit pendiente de push) |
| **SearchAction falso** | En seo.ts ya eliminado; CF Pages (pages.dev) lo sigue mostrando porque está en build ~Jun 24, antes del commit 7f47064 | ✅ eliminado en código | ❌ build stale | ❌ presente | ALTO | P1 | Se resuelve con DNS fix + re-deploy |
| **Canonicals blog** | getBlogCanonical() corregida en commit 805ff81 (Jul 1) | ✅ | ❌ build stale | ❌ sin corregir | ALTO | P1 | Se resuelve con DNS fix |
| **Breadcrumb duplicado** | Eliminado en commit 34ed228 (Jul 1) | ✅ | ❌ build stale | ❌ duplicado | MEDIO | P2 | Se resuelve con DNS fix |
| **Noindex hidrantes demo** | Añadido en commit 5798463 (Jul 1) | ✅ | ❌ build stale | ❌ sin noindex | MEDIO | P2 | Se resuelve con DNS fix |
| **Redirects 301 empresas-certificadas** | 52 redirects marca→anónimo en commit 6c0bfd7 (Jul 1) | ✅ | ❌ build stale | ❌ | MEDIO | P2 | Se resuelve con DNS fix |
| **Organization schema** | @id y alternateName añadidos en commit 337fc58 (Jun 24) | ✅ | ✅ (en build Jun 24) | ❌ versión sin @id | MEDIO | P2 | Se resuelve con DNS fix |
| **Prefetch optimizado** | prefetchAll:false + defaultStrategy:viewport en commit f8d1395 | ✅ | ❌ build stale | ❌ | BAJO | P3 | Se resuelve con DNS fix |
| **git index.lock / HEAD.lock** | Archivos lock huérfanos en .git/ impiden commits desde el workspace | ❌ bloqueado | — | — | OPERATIVO | P0 | Frank: `rm .git/index.lock .git/HEAD.lock .git/objects/maintenance.lock` |

---

## Hallazgos que ERAN falsos positivos

| Hallazgo previo reportado | Realidad confirmada |
|---|---|
| "sitemap.xml responde 404" | El sitemap existe como `sitemap-index.xml`. El 404 de `/sitemap.xml` es esperado — el reference correcto es `/sitemap-index.xml` (ya referenciado en robots.txt). No es un problema. |
| "No hay SearchAction en código" | SearchAction SÍ fue eliminado del código (seo.ts). Sigue apareciendo en prod y CF Pages porque esos entornos sirven builds anteriores. No hay nada que corregir en el código. |
| "Schema Product no existe" | Sí existe. Product, BreadcrumbList, FAQPage, TechArticle, Organization, LocalBusiness — todos presentes. |

---

## Estado del deploy.yml (CI/CD)

El workflow actual `deploy.yml` hace:
1. `npm run check` (astro check — TypeScript)
2. `npm run build` con `PUBLIC_EWWW_CDN_BASE`
3. `wrangler pages deploy dist` → Cloudflare Pages

El step `npm run check` fue **añadido en el último commit** (c8f54ab). Esto puede haber bloqueado algunos deploys anteriores si generaba errores de tipo. En CI (ubuntu-latest + npm ci), el build corre sin los EPERM de node_modules/.vite que ocurren en el sandbox local.

---

## Estado: CERRADO PARCIAL

- Diagnóstico: ✅ Completo y verificado con evidencia real
- Acción de código: ✅ Fix canonical ejecutado (pendiente push)
- Acción de DNS: ⏳ Requiere intervención manual de Frank en CF Dashboard
- Acción de AI Scrape Shield: ⏳ Requiere intervención manual de Frank en CF Dashboard
