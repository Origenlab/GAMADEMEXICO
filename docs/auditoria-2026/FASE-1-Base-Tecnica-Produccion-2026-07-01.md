# FASE 1 — Base Técnica de Producción
**Fecha:** 2026-07-01  
**Estado:** ⏳ CERRADO PARCIAL — código listo, 3 acciones pendientes en dashboards externos

---

## Resumen de bloqueos confirmados

La base técnica de producción tiene **dos bloqueos estructurales** que no se resuelven con código:

1. **El dominio `gamademexico.com` sirve desde GitHub Pages (Jun 15)** — no desde Cloudflare Pages donde están los builds recientes.
2. **Cloudflare inyecta bloqueos de AI bots en robots.txt** vía su feature "Block AI Scrapers" — esto overridea el robots.txt del repositorio.

Todo el trabajo de código hecho hoy (SearchAction, llms.txt, robots.txt, titles) está correcto y desplegado en `pages.dev`. No llega a producción por las razones anteriores.

---

## BLOQUEO 1 — Deploy: GitHub Pages todavía sirve el dominio

### Qué detecté
- `gamademexico.com` → origin = GitHub Pages (header `x-github-request-id` confirmado)
- `last-modified: Mon, 15 Jun 2026` → 16 días de drift
- `deploy.yml` actual despliega a CF Pages correctamente, pero el dominio no apunta ahí
- `gamademexico.pages.dev` funciona y tiene contenido más reciente

### Por qué importa
Todos los cambios en el repo desde junio 15 son invisibles en producción. Incluyendo: eliminación de SearchAction, llms.txt, robots.txt, canonicals, mobile overhaul, títulos.

### Acción 1 (Cloudflare Dashboard — solo el usuario puede hacer esto)
**Configurar custom domain en el proyecto CF Pages:**

1. Ir a: `dash.cloudflare.com` → cuenta → **Workers & Pages**
2. Clic en el proyecto **gamademexico**
3. Pestaña **Custom Domains**
4. Clic **Set up a custom domain**
5. Agregar: `gamademexico.com`
6. Cloudflare automáticamente actualiza el DNS (ya que el dominio usa Cloudflare DNS)
7. Repetir para `www.gamademexico.com` si aplica

Cloudflare Pages con custom domain en el mismo account actualiza el DNS automáticamente. No requiere configuración manual de registros DNS.

### Acción 2 (GitHub Settings — solo el usuario puede hacer esto)
**Deshabilitar GitHub Pages para evitar que siga sirviendo como origin:**

1. Ir a: `github.com/Origenlab/GAMADEMEXICO/settings/pages`
2. Sección **Source**
3. Cambiar a **None**
4. Guardar

Esto desconecta GitHub Pages. El dominio quedará 100% bajo CF Pages.

---

## BLOQUEO 2 — Cloudflare bloquea AI bots en robots.txt

### Qué detecté
Cloudflare inyecta este bloque al INICIO del robots.txt (antes del contenido del repo):

```
# BEGIN Cloudflare Managed content
User-agent: GPTBot
Disallow: /
User-agent: ClaudeBot
Disallow: /
User-agent: Google-Extended
Disallow: /
User-agent: Amazonbot
Disallow: /
User-agent: Applebot-Extended
Disallow: /
User-agent: Bytespider
Disallow: /
User-agent: meta-externalagent
Disallow: /
# END Cloudflare Managed Content
```

### Por qué importa
Los bots de AI (GPT, Claude, Gemini, Perplexity) solo leen **su propio grupo** en robots.txt. Cuando ven `Disallow: /` en la sección de Cloudflare (que viene primero), se detienen. El `Allow: /` del repositorio más abajo es ignorado. **Estos bots no indexan el sitio.**

### Acción 3 (Cloudflare Dashboard — solo el usuario puede hacer esto)
**Deshabilitar "Block AI Scrapers and Crawlers":**

1. Ir a: `dash.cloudflare.com` → cuenta → dominio `gamademexico.com`
2. Sidebar izquierdo → **Security** → **Bots**
3. Buscar la sección **"AI Scrapers and Crawlers"** o **"Content Scraping"**
4. Desactivar la opción que dice **"Block AI Scrapers"** o similar
5. Guardar

Alternativa si no aparece en Bots:
- Ir a **Scrape Shield** → desactivar opciones de bloqueo de AI

Una vez desactivado, el robots.txt en producción solo mostrará el contenido del repositorio (que ya tiene `Allow: /` para todos los bots AI relevantes).

---

## Acciones de código ejecutadas en esta FASE

### 1. SearchAction falso — ELIMINADO (commit previo `7f47064`)
- **Archivo:** `src/lib/seo.ts` — `buildWebSiteSchema()`
- **Estado en código:** Sin `potentialAction`. ✅
- **Estado en producción:** Pendiente deploy. ⏳
- **Verificación local:** `grep -A10 "buildWebSiteSchema" src/lib/seo.ts` → sin SearchAction ✅

### 2. llms.txt — EXISTE (en repositorio)
- **Archivo:** `public/llms.txt` (5,745 bytes)
- **Estado en código:** ✅ Completo y bien formado
- **Estado en producción:** 404 (por deploy roto) ⏳
- **Estado en pages.dev:** 200 ✅
- **Verificación:** `curl -s https://gamademexico.pages.dev/llms.txt` → OK

### 3. robots.txt local — CORRECTO
- **Archivo:** `public/robots.txt`
- **Bots AI:** GPTBot, ChatGPT-User, OAI-SearchBot, Google-Extended, Gemini-Crawling, anthropic-ai, ClaudeBot, PerplexityBot, Bytespider, Applebot-Extended, meta-externalagent, Amazonbot → todos con `Allow: /`
- **CCBot:** `Disallow: /` (correcto — Common Crawl solo alimenta training data)
- **Sitemap:** apunta a `sitemap-index.xml` ✅
- **Estado en código:** ✅
- **Estado en producción:** Overrideado por Cloudflare Managed Content ❌ (requiere Acción 3)

### 4. deploy.yml — MEJORADO (2026-07-01)
Cambios aplicados en `.github/workflows/deploy.yml`:
- `npx astro check` → `npm run check` (consistente con `ci.yml`, usa el binario local)
- Agregado `PUBLIC_EWWW_CDN_BASE` desde secret en el step de build (para reescritura de imágenes CDN en build de producción)

**Verificar:** Agregar secret `PUBLIC_EWWW_CDN_BASE = https://egsev2ykn2x.exactdn.com` en:
`github.com/Origenlab/GAMADEMEXICO/settings/secrets/actions`

---

## Secuencia de validación post-acciones externas

Una vez ejecutadas las 3 acciones de dashboard:

### Verificación 1 — robots.txt limpio en producción
```bash
curl -s https://gamademexico.com/robots.txt | grep -A2 "GPTBot\|Cloudflare Managed"
```
**Esperado:** Sin "Cloudflare Managed Content". `GPTBot` debe tener `Allow: /`.

### Verificación 2 — llms.txt accesible
```bash
curl -s -o /dev/null -w "%{http_code}" https://gamademexico.com/llms.txt
```
**Esperado:** `200`

### Verificación 3 — SearchAction eliminado de producción
```bash
curl -s https://gamademexico.com/ | grep "SearchAction"
```
**Esperado:** Sin output (vacío).

### Verificación 4 — Title del home sin marca antepuesta
```bash
curl -s https://gamademexico.com/ | grep -o '<title>[^<]*</title>'
```
**Esperado:** `<title>Equipos Contra Incendios Certificados UL/FM en México</title>`

### Verificación 5 — last-modified actualizado (deploy reciente)
```bash
curl -s -I https://gamademexico.com/ | grep "last-modified"
```
**Esperado:** Fecha de hoy o posterior a Jun 15.

---

## Estado de cierre de FASE 1

| Frente | Código | Deploy CF Pages | Dominio Prod | Acción requerida |
|--------|--------|-----------------|--------------|-----------------|
| SearchAction eliminado | ✅ | ✅ (build pendiente) | ❌ stale | 3 acciones dashboard |
| llms.txt accesible | ✅ | ✅ | ❌ stale | 3 acciones dashboard |
| robots.txt AI bots | ✅ | ✅ | ❌ CF override | Acción 3 (CF Security) |
| deploy.yml mejorado | ✅ | ⏳ se activa al push | — | Push + secret |
| Dominio → CF Pages | — | — | ❌ GitHub Pages | Acción 1 (CF Domain) |
| GitHub Pages desactivado | — | — | ❌ activo | Acción 2 (GH Settings) |

**Fase 1 se considera CERRADA cuando las 3 acciones de dashboard estén ejecutadas y las 5 verificaciones pasen.**
