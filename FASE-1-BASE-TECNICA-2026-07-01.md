# FASE 1 — Base Técnica de Producción
**Fecha:** 2026-07-01  
**Ejecutado por:** Director Técnico / Claude  
**Prerequisito:** FASE-0-RECONFIRMACION-2026-07-01.md

---

## Objetivo

Corregir lo que bloquea o distorsiona el sitio real en producción. Esta fase tiene dos frentes:

1. **Código** — fix implementable directamente (ya ejecutado)
2. **Infraestructura** — requiere acciones manuales de Frank en Cloudflare Dashboard

---

## PASO 1 — Diagnóstico

Ver FASE-0-RECONFIRMACION-2026-07-01.md. Resumen ejecutivo:

- gamademexico.com sirve GH Pages (build Jun 15). CF Pages tiene build más reciente pero DNS no apunta ahí.
- Cloudflare AI Scrape Shield reemplaza robots.txt bloqueando todos los crawlers de AI.
- llms.txt da 404 en producción.
- Canonical home = `/index` en lugar de `/` (bug introducido con `build.format:'file'`).
- SearchAction falso en producción (eliminado del código, no desplegado).
- Varios fixes del 1 Jul (canonical blog, breadcrumb, noindex, redirects) están en código pero no en live.

---

## PASO 2 — Plan exacto

### 2A. Acciones de código (ejecutadas por Claude)

| # | Acción | Archivo | Commit |
|---|---|---|---|
| 1 | Fix canonical `/index` → `/` en home | `src/layouts/Base.astro` | pendiente push |

### 2B. Acciones de infraestructura (ejecutadas por Frank)

| # | Acción | Dónde | Urgencia |
|---|---|---|---|
| 1 | Eliminar lock files git huérfanos | Terminal en repo local | P0 — bloquea todo commit |
| 2 | Commit + push del fix de canonical | Terminal en repo local | P0 |
| 3 | Deshabilitar AI Scrape Shield | Cloudflare Dashboard | P0 |
| 4 | Agregar Custom Domain en CF Pages | Cloudflare Dashboard | P0 |
| 5 | Actualizar DNS de gamademexico.com | Cloudflare Dashboard | P0 |

---

## PASO 3 — Implementación

### 3A. Fix canonical /index (CÓDIGO — EJECUTADO)

**Problema:** Con `build.format: 'file'` en astro.config.mjs, `Astro.url.pathname` para `src/pages/index.astro` se resuelve como `/index` en lugar de `/`. La regex original no lo capturaba.

**Archivo:** `src/layouts/Base.astro`, línea 84

**Antes:**
```javascript
const pathname = Astro.url.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
```

**Después:**
```javascript
// build.format:'file' genera /index como pathname del home — convertirlo a /
const pathname = Astro.url.pathname.replace(/\.html$/, '').replace(/\/index$/, '/').replace(/\/$/, '') || '/';
```

**Lógica:** `/index` → `/` → strip trailing slash → `` → `|| '/'` → `/` ✅  
También corrige `/[seccion]/index` → `/[seccion]/` → `/[seccion]` ✅

**Estado:** ✅ Implementado en workspace. **Pendiente: push a main.**

---

### 3B. Instrucciones exactas para Frank

#### Paso B1 — Limpiar lock files (en terminal, desde el repo)

```bash
# Desde el directorio del proyecto
cd ~/Documents/Claude/Projects/GAMADEMEXICO  # o donde esté el repo

# Eliminar locks huérfanos (sesión anterior crashed)
rm .git/index.lock .git/HEAD.lock .git/objects/maintenance.lock

# Verificar que ya no hay locks
ls .git/*.lock .git/objects/*.lock 2>/dev/null || echo "Sin locks — OK"
```

#### Paso B2 — Commit y push del fix

```bash
git add src/layouts/Base.astro
git commit -m "fix: canonical /index → / en home (build.format file · FASE 1)"
git push origin main
```

Esto dispara el deploy.yml → CI → CF Pages. El build tardará ~3-5 minutos.

#### Paso B3 — Deshabilitar AI Scrape Shield en Cloudflare Dashboard

**El problema:** Cloudflare tiene una feature llamada "AI Scrape Shield" (también aparece como "AI Audit Log" en algunos planes) que **reemplaza completamente el robots.txt del sitio** con su propia versión que bloquea todos los crawlers de AI. Esta feature se activa a nivel de zona DNS, independientemente de lo que esté en el repositorio.

**Evidencia:** El robots.txt en producción tiene el bloque `# BEGIN Cloudflare Managed content` que deshabilita GPTBot, ClaudeBot, Google-Extended, Bytespider, Applebot-Extended, meta-externalagent, Amazonbot — exactamente los bots que la estrategia GEO del proyecto quiere permitir.

**Dónde está en el Dashboard:**

```
Cloudflare Dashboard
  → gamademexico.com (zona)
  → Security
  → Bots
  → Buscar "AI Scrape Shield" o "Bot Fight Mode"
  → Deshabilitar / Off

Si no está en Security → Bots, buscar en:
  → Security → Settings → AI Scrape Shield
  → O en: Scrape Shield (sección propia en el sidebar)
```

**Verificación post-deshabilitación:**
```bash
curl -s https://gamademexico.com/robots.txt | head -5
# Debe mostrar: "# Robots.txt — GAMA de México" (nuestro archivo)
# NO debe mostrar: "# BEGIN Cloudflare Managed content"
```

#### Paso B4 — Agregar Custom Domain en CF Pages

```
Cloudflare Dashboard
  → Pages
  → gamademexico (proyecto)
  → Custom Domains
  → Add a custom domain
  → Ingresar: gamademexico.com
  → Cloudflare detectará automáticamente la zona y actualizará DNS
```

**Nota:** CF Pages puede actualizarlo automáticamente si el dominio está en la misma cuenta. Si no, dar clic en "Activate domain" y seguir las instrucciones.

#### Paso B5 — Verificar DNS apunta a CF Pages

Tras agregar el Custom Domain en CF Pages, Cloudflare debe actualizar el CNAME automáticamente. Verificar:

```bash
# Debe apuntar a gamademexico.pages.dev o similar CF domain
dig gamademexico.com CNAME +short

# Ya NO debe mostrar x-github-request-id en los headers
curl -sI https://gamademexico.com/ | grep -E "x-github|cf-cache|server"
# Esperado: server: cloudflare, cf-cache-status presente, SIN x-github-request-id
```

---

## PASO 4 — Validación

Ejecutar estos checks después de que DNS propague (~5-15 min tras el cambio):

```bash
# 1. llms.txt — debe ser 200 con nuestro contenido
curl -s https://gamademexico.com/llms.txt | head -3
# Esperado: "# Gama de México — LLM Brand Disambiguation"

# 2. robots.txt — debe ser nuestro archivo, SIN "Cloudflare Managed content"
curl -s https://gamademexico.com/robots.txt | head -5
# Esperado: "# Robots.txt — GAMA de México"

# 3. Canonical home — debe ser /
curl -s https://gamademexico.com/ | grep 'rel="canonical"' | grep -o 'href="[^"]*"'
# Esperado: href="https://gamademexico.com/"

# 4. SearchAction — debe estar ausente
curl -s https://gamademexico.com/ | grep "SearchAction" | wc -l
# Esperado: 0

# 5. Headers — origen CF Pages, no GH Pages
curl -sI https://gamademexico.com/ | grep -E "x-github|cf-ray|server"
# Esperado: server: cloudflare, CF-Ray presente, SIN x-github-request-id

# 6. sitemap
curl -sI https://gamademexico.com/sitemap-index.xml | head -2
# Esperado: HTTP/2 200

# 7. Blog canonical (muestra)
curl -s https://gamademexico.com/blog/monitores-contra-incendios-guia/ | grep 'rel="canonical"' | grep -o 'href="[^"]*"'
# Esperado: URL sin parámetros ni sufijos incorrectos

# 8. Producto sin breadcrumb duplicado
curl -s https://gamademexico.com/productos/monitor-elkhart-brass-3251t/ | grep -c '"BreadcrumbList"'
# Esperado: 1
```

---

## PASO 5 — Documentación Obsidian

- Este documento: `FASE-1-BASE-TECNICA-2026-07-01.md` ✅
- Tabla de realidad: `FASE-0-RECONFIRMACION-2026-07-01.md` ✅
- Preparación siguientes fases: `FASE-2-METADATOS-PREP.md`, `FASE-4-CONVERSIONES-PREP.md`

---

## PASO 6 — Estado de Cierre

| Ítem | Estado |
|---|---|
| Fix canonical /index — implementado en código | ✅ Implementado |
| Fix canonical /index — push a main | ⏳ Pendiente (Frank) |
| Fix canonical /index — verificado en producción | ⏳ Pendiente DNS fix |
| Despliegue DNS → CF Pages | ⏳ Pendiente (Frank) |
| AI Scrape Shield deshabilitado | ⏳ Pendiente (Frank) |
| Validación completa post-DNS | ⏳ Pendiente |

**Estado de fase:** CERRADO PARCIAL — bloqueado por acciones de infraestructura que requieren acceso al CF Dashboard.

**Desbloqueador:** Frank ejecuta pasos B1→B5 y se valida con los checks del Paso 4.
