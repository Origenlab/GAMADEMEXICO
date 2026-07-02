# FASE 0 — Reconfirmación de Realidad
**Fecha:** 2026-07-01  
**Estado:** ✅ CERRADO — evidencia completa recolectada

---

## Metodología

Todos los hallazgos se verificaron directamente contra producción:
- `curl -s -I https://gamademexico.com/` (headers reales)
- `curl -s https://gamademexico.com/robots.txt` (contenido real)
- `curl -s -o /dev/null -w "%{http_code}" <URL>` (status HTTP real)
- `curl -s https://gamademexico.com/ | grep <pattern>` (HTML real)
- `curl -s https://gamademexico.pages.dev/` (CF Pages directo)
- `git log --format="%h %ai %s"` (historial con timestamps)

---

## HALLAZGO CRÍTICO #1 — Arquitectura de Deploy Rota

### Situación
La migración de **GitHub Pages → Cloudflare Pages** está **incompleta**.

- **`gamademexico.com`** sirve desde **GitHub Pages** (origin confirmado por `x-github-request-id` en todos los headers)
- **Último deploy exitoso en prod:** `Mon, 15 Jun 2026 19:09:16 GMT` (header `last-modified`)
- **`gamademexico.pages.dev`** existe, responde 200, y tiene contenido más reciente — pero el custom domain NO apunta ahí
- **Cloudflare es solo proxy/CDN** sobre el origin de GitHub Pages, no el servidor real

### Evidencia
```
HTTP/2 200
last-modified: Mon, 15 Jun 2026 19:09:17 GMT    ← 16 días sin actualizar
x-github-request-id: C62A:305889:427F8:47BE4    ← origin es GitHub Pages
server: cloudflare                               ← CF solo proxea
cf-ray: a1499fd3abac52e4-DFW
```

### Implicación
**Todos los commits del 1 de julio (18:24–18:38 CST) NO están en producción.** Esto incluye:
- Eliminación de SearchAction falso (`7f47064`)
- Corrección de canonicals del blog (`805ff81`)
- 52 redirects empresas-certificadas (`6c0bfd7`)
- mobile-first overhaul (fases 5–8)
- Refactor empresas-certificadas (`19a6814`)

---

## HALLAZGO CRÍTICO #2 — Cloudflare Bloquea Todos los Bots AI

### Situación
Cloudflare inyecta un bloque **"Managed Content"** al INICIO del `robots.txt` en producción, que **tiene precedencia** sobre el robots.txt del repositorio.

### Evidencia — robots.txt real en producción
```
# BEGIN Cloudflare Managed content

User-agent: *
Content-Signal: search=yes,ai-train=no,use=reference
Allow: /

User-agent: Amazonbot
Disallow: /

User-agent: Applebot-Extended
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: CloudflareBrowserRenderingCrawler
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: GPTBot
Disallow: /

User-agent: meta-externalagent
Disallow: /

# END Cloudflare Managed Content

[... robots.txt del repo con Allow: / para todos estos bots ...]
```

### Por qué importa
Cada bot solo lee **su propio grupo**. Si `GPTBot` ve:
```
User-agent: GPTBot
Disallow: /
```
...en la sección de Cloudflare, **no lee más**. Los `Allow: /` del repo más abajo son ignorados.

Bots AI bloqueados en producción: `GPTBot`, `ClaudeBot`, `Google-Extended`, `Amazonbot`, `Applebot-Extended`, `Bytespider`, `meta-externalagent`.

### Origen del problema
Feature de Cloudflare: **Security → Bots → Block AI Scrapers and Crawlers** (habilitada en el dashboard del dominio). No es configurable desde el repo.

---

## HALLAZGO #3 — llms.txt: 404 en Dominio, 200 en CF Pages

| URL | HTTP | Causa |
|-----|------|-------|
| `https://gamademexico.com/llms.txt` | **404** | GitHub Pages stale (Jun 15) — llms.txt no existía entonces |
| `https://gamademexico.pages.dev/llms.txt` | **200** | CF Pages tiene el archivo correcto |
| `public/llms.txt` (local) | existe | 5,745 bytes, bien formado |

**No es un error de código.** Es consecuencia directa del deploy roto.

---

## HALLAZGO #4 — SearchAction Falso: Vivo en Producción

### Estado en código
Eliminado en commit `7f47064 (2026-07-01 18:36)` en `src/lib/seo.ts`:
```ts
// potentialAction / SearchAction eliminado (FASE 1 · 2026-07-01)
export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    // SIN potentialAction
  };
}
```

### Estado en producción (`gamademexico.com`)
```json
{
  "@type": "WebSite",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://gamademexico.com/equipos?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```
**El endpoint `/equipos?q=` no existe.** Schema falso de funcionalidad inexistente. Riesgo real de señal negativa en Google Search Console.

---

## HALLAZGO #5 — Title del Home: Marca Antepuesta (Código ya Corregido)

| Contexto | Valor |
|----------|-------|
| Producción actual | `Gama de México \| Equipos Contra Incendios Certificados UL/FM` |
| Código actual (`index.astro`) | `Equipos Contra Incendios Certificados UL/FM en México` |
| Estado | Correcto en código, no desplegado |

La corrección ya existe. No requiere cambio de código adicional.

---

## HALLAZGO #6 — Sitemap: Estado Real

| URL | HTTP | Nota |
|-----|------|------|
| `/sitemap-index.xml` | **200** | Correcto. Es el punto de entrada real. |
| `/sitemap.xml` | 404 | Esperado. Astro genera `sitemap-index.xml`, no `sitemap.xml`. |

robots.txt del repo ya apunta a `sitemap-index.xml`. ✓

---

## HALLAZGO #7 — Schema Confirmado en Producción

Schema presente y verificado en `gamademexico.com` (build Jun 15):
- `Organization` ✓
- `LocalBusiness` ✓
- `WebSite` (con SearchAction falso — pendiente corrección tras deploy) ✗
- `FAQPage` ✓

**No se requiere "agregar schema" de Organization, LocalBusiness ni FAQPage** — ya existen.

---

## HALLAZGO #8 — Estado de Calidad del Código

| Check | Resultado |
|-------|-----------|
| `tsc --noEmit --skipLibCheck` | ✅ LIMPIO (0 errores) |
| `node scripts/normalize-blog-content.mjs --check` | ✅ 84 posts, 0 issues |
| `content.config.ts` | ✅ schema válido |
| TypeScript types | ✅ |

El build en CI no debería fallar por razones de código.

---

## TABLA DE REALIDAD — ESTADO COMPLETO

| Frente | Estado en código local | Estado en producción (`gamademexico.com`) | Estado en CF Pages (`pages.dev`) | Riesgo | Prioridad | Acción exacta |
|--------|----------------------|------------------------------------------|-----------------------------------|--------|-----------|---------------|
| **Deploy — dominio custom** | n/a | GitHub Pages (Jun 15) | Funcional pero sin dominio custom | 🔴 CRÍTICO | P0 | Cloudflare Dashboard: configurar `gamademexico.com` en CF Pages |
| **GitHub Pages activo** | n/a | Sirviendo stale | n/a | 🔴 CRÍTICO | P0 | GitHub Settings → Pages → Disable |
| **Cloudflare AI bot blocking** | No aplica | Bloquea GPTBot, ClaudeBot, Google-Extended, etc. | Sin bloqueo (pages.dev) | 🔴 CRÍTICO | P0 | Cloudflare Dashboard → Security → Bots → Disable |
| **robots.txt local** | ✅ Correcto (AI bots permitidos) | ❌ Overrideado por CF Managed Content | ✅ Correcto (sin inyección) | 🔴 CRÍTICO | P0 | Requiere acción CF Dashboard (código ya correcto) |
| **llms.txt** | ✅ Existe en `/public/` | ❌ 404 (stale deploy) | ✅ 200 OK | 🔴 ALTO | P1 | Se resuelve al solucionar el deploy |
| **SearchAction falso** | ✅ Eliminado (commit 7f47064) | ❌ Vivo | ❌ Vivo (build stale) | 🔴 ALTO | P1 | Se resuelve al solucionar el deploy |
| **Title home** | ✅ Sin marca antepuesta | ❌ Marca antepuesta (Jun 15) | ❌ Stale | 🟡 MEDIO | P2 | Se resuelve al solucionar el deploy |
| **Sitemap** | ✅ sitemap-index.xml | ✅ 200 OK | ✅ | ✅ | — | Sin acción |
| **Schema Organization/LocalBusiness** | ✅ | ✅ Presente | ✅ | ✅ | — | Sin acción |
| **TypeScript/Build** | ✅ Sin errores | n/a | n/a | ✅ | — | Sin acción |

---

## ACCIONES REQUERIDAS — POR RESPONSABLE

### Cloudflare Dashboard (solo el usuario puede hacer esto)
1. **[P0]** `Security → Bots → Block AI Scrapers and Crawlers` → **Desactivar**
2. **[P0]** `Workers & Pages → gamademexico → Custom Domains → Add` → agregar `gamademexico.com` y `www.gamademexico.com`

### GitHub Repository Settings (solo el usuario puede hacer esto)
3. **[P0]** `Settings → Pages → Source` → **None (Disable GitHub Pages)**

### Código / Repositorio (ya resuelto en commits anteriores)
- SearchAction: eliminado ✓
- llms.txt: en /public/ ✓
- robots.txt local: correcto ✓
- Title home: corregido ✓
- TypeScript: limpio ✓

---

## ESTADO DE FASE 0

**CERRADO.** Evidencia completa. Sin falsos positivos ni hallazgos sin verificar.  
Bloqueantes P0 confirmados: 3 acciones externas (Cloudflare + GitHub Settings).
