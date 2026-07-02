# FASE 0 — Control de Realidad
**Fecha de ejecución:** 2026-07-02  
**Ejecutado por:** Claude — Lead Technical Executor  
**Método:** Lectura directa de código (git log, grep, diff) + curl a producción y pages.dev  
**Estado:** ✅ CERRADO — evidencia completa

---

## HALLAZGO NUEVO CRÍTICO — gamademexico.com devuelve HTTP 403

### Situación
Desde la última sesión de trabajo (2026-07-01), el dominio `gamademexico.com` **ya no sirve desde GitHub Pages** — el `x-github-request-id` desapareció de los headers. Pero ahora devuelve:

```
HTTP/2 403
Error: DNS points to prohibited IP (Cloudflare Error 1000)
```

### Evidencia
```
curl -sI https://gamademexico.com/
HTTP/2 403
server: cloudflare
cf-cache-status: DYNAMIC
cf-ray: a149da400f466fa8-DFW
# SIN x-github-request-id — GitHub Pages ya no sirve

curl -s https://gamademexico.com/ | head -5
<title>DNS points to prohibited IP | gamademexico.com | Cloudflare</title>
```

DNS actual:
```
dig gamademexico.com A +short → 172.67.222.49 / 104.21.54.10
dig gamademexico.com CNAME +short → gamademexico.com. (loop)
```

### Diagnóstico
Las IPs `172.67.222.49` y `104.21.54.10` son IPs de Cloudflare (orange-cloud proxy). El error 1000 ocurre cuando CF intenta rutear una request pero el registro DNS apunta de regreso a la infraestructura de CF — creando un loop.

**Causa probable:** Frank agregó `gamademexico.com` como Custom Domain en CF Pages. CF intentó actualizar el DNS automáticamente, pero el registro resultante (A/CNAME) apunta a CF IPs en lugar de al deployment de CF Pages, generando el loop.

### Estado de las tres capas
| Capa | URL | HTTP | Contenido |
|---|---|---|---|
| **Producción (custom domain)** | gamademexico.com | ❌ 403 | Error DNS loop |
| **CF Pages (preview)** | gamademexico.pages.dev | ✅ 200 | Build ~Jun 24 (stale) |
| **Código local (main)** | — | ✅ | Commit 3ef2b88 — 2026-07-01 19:14 |

### Impacto
- El sitio está caído para usuarios reales (403)
- Los buscadores que visiten el dominio recibirán 403 — potencial señal negativa
- pages.dev funciona pero con build del Jun 24 (sin ningún fix del 1 de julio)

### Acción requerida — Solo Frank (CF Dashboard)

**Fix DNS Error 1000:**
```
Cloudflare Dashboard → gamademexico.com → DNS → Records

1. Buscar el registro A o CNAME para @ (apex domain)
2. Si hay un A record apuntando a 172.67.222.49 o 104.21.54.10:
   → Eliminar esos A records

3. Verificar en: Workers & Pages → gamademexico → Custom Domains
   → Si el dominio está listado pero en estado "error" o "pending":
     → Quitar el custom domain → Re-agregar → Dejar que CF Pages cree el CNAME correcto

4. El registro correcto que CF Pages debe crear es un CNAME:
   @ → gamademexico.pages.dev (con proxy ON / orange cloud)
```

**Verificación post-fix:**
```bash
curl -sI https://gamademexico.com/ | grep -E "HTTP|server|cf-cache"
# Esperado: HTTP/2 200, server: cloudflare, cf-cache-status: MISS o HIT
```

---

## Tabla de Estado Real por Frente — 2026-07-02

| Frente | Estado en código (local) | Estado en CF Pages (pages.dev) | Estado en producción (gamademexico.com) | Riesgo | Prioridad | Acción |
|---|---|---|---|---|---|---|
| **DNS / Producción** | n/a | ✅ 200 | ❌ 403 Error 1000 | 🔴 CRÍTICO | **P0** | Frank: fix DNS en CF Dashboard |
| **git index.lock** | ❌ bloquea commits del sandbox | — | — | 🔴 OPERATIVO | **P0** | Frank: `rm .git/index.lock` en terminal local |
| **CF Pages build** | Código al Jul 1 | ❌ Build ~Jun 24 (stale) | ❌ 403 | 🔴 ALTO | **P0** | Se resuelve al hacer push + fix DNS |
| **robots.txt AI bots** | ✅ Correcto | ✅ Correcto | ❌ 403 (no aplica) | 🔴 CRÍTICO (cuando prod vuelva) | P1 | Verificar post-DNS-fix si CF Scrape Shield sigue activo |
| **llms.txt** | ✅ 5,745 bytes | ✅ 200 OK | ❌ 403 | 🔴 ALTO | P1 | Se resuelve con fix DNS + deploy |
| **SearchAction falso** | ✅ Eliminado (commit 7f47064) | ❌ Presente (build stale) | ❌ 403 | 🟠 ALTO | P1 | Se resuelve con push + deploy |
| **Canonical /index bug** | ✅ Corregido (commit en código) | ❌ Presente (build stale) | ❌ 403 | 🟠 ALTO | P1 | Se resuelve con push + deploy |
| **empresas-certificadas — noindex** | ✅ AGREGADO AHORA (4 archivos, sin commitear) | ❌ Sin noindex (build stale) | ❌ 403 | 🔴 LEGAL/SEO | P1 | Frank: commit + push tras fix index.lock |
| **hidrantes — noindex** | ✅ (commit 5798463) | ❌ build stale | ❌ 403 | 🟡 MEDIO | P2 | Se resuelve con deploy |
| **prefetch viewport** | ✅ (commit f8d1395) | ❌ build stale | ❌ 403 | 🟡 MEDIO | P2 | Se resuelve con deploy |
| **Titles SEO sin marca** | ✅ (commit 3e61501) | ❌ build stale | ❌ 403 | 🟡 MEDIO | P2 | Se resuelve con deploy |
| **Descriptions producto (30 archivos)** | ⚠️ Modificados, sin commitear | ❌ build stale | ❌ 403 | 🟡 BAJO | P3 | Frank: commit tras fix index.lock |
| **CNAME en raíz del repo** | ✅ existe (`gamademexico.com`) | — | — | 🟡 BAJO | P3 | No eliminar hasta confirmar que GH Pages está desactivado |
| **Schema Organization/LocalBusiness** | ✅ | ✅ build Jun 24 | ❌ 403 | ✅ | — | Sin acción |
| **Draft posts filtrados** | ✅ `!data.draft` en getStaticPaths | ✅ | ❌ 403 | ✅ | — | Sin acción |

---

## Estado de la base de código — Inventario Exacto

### Commits en main (no desplegados en producción)
```
3ef2b88  2026-07-01 19:14  seo(FASE 3): schema audit — eliminar offers falso en categorías y precios
3e61501  2026-07-01 19:06  seo(FASE 2): titles keyword-first, sin marca, todos ≤70 chars
c8f54ab  2026-07-01 18:53  fix: deploy.yml — npm run check + CDN env var + docs FASE 0 y 1
f8d1395  2026-07-01 18:49  perf: prefetchAll false + defaultStrategy viewport
34ed228  2026-07-01 18:38  fix: eliminar breadcrumb duplicado en producto y subcategoria
5798463  2026-07-01 18:37  fix: noindex en rutas hidrantes demo
7f47064  2026-07-01 18:36  fix: eliminar SearchAction falso de WebSite JSON-LD
805ff81  2026-07-01 18:35  fix: canonicals blog — 68 posts corregidos + getBlogCanonical() helper
6c0bfd7  2026-07-01 18:28  fix: 52 redirects 301 empresas-certificadas marca→anónimo
19a6814  2026-07-01 18:24  feat: refactor empresas-certificadas + auditoría general
```

### Cambios en disco NO commiteados (requieren `rm .git/index.lock` + commit)
1. **38 archivos productos** — `src/content/productos/*.md`  
   Cambio: recorte de texto truncado al final de `description:` (". Stock", "Stock en CDMX y", "Envíos a 32", etc.)  
   Tipo: mejora SEO válida, bajo riesgo

2. **4 páginas empresas-certificadas** — `src/pages/empresas-certificadas/`  
   Cambio: `noindex={true}` agregado al componente `<Layout>` en [slug], index, estado/[estado], giro/[giro]  
   Tipo: corrección crítica de riesgo legal/SEO  
   **Ejecutado en esta sesión (2026-07-02)**

3. **4 archivos MD en raíz** — `FASE-0-RECONFIRMACION-2026-07-01.md`, `FASE-1-BASE-TECNICA-2026-07-01.md`, `FASE-2-METADATOS-PREP.md`, `FASE-4-CONVERSIONES-PREP.md`  
   Estado: untracked — documentación de sesión anterior

---

## Checklist exacto de bloqueos activos

### Bloqueos de infraestructura (solo Frank puede resolver)

| # | Acción | Dónde | Urgencia |
|---|---|---|---|
| B1 | Fix DNS Error 1000 — limpiar A records y re-configurar custom domain en CF Pages | CF Dashboard → DNS + Pages | 🔴 P0 — sitio caído |
| B2 | Quitar el `index.lock` para poder commitear | Terminal local: `rm .git/index.lock` | 🔴 P0 — bloquea deploy |
| B3 | Commit + push de los cambios pendientes | Terminal local (ver comandos abajo) | 🔴 P0 |
| B4 | Verificar que AI Scrape Shield sigue desactivado en CF | CF Dashboard → Security → Bots | 🟠 P1 — verificar cuando prod vuelva |

### Comandos exactos para Frank (después de B1)

```bash
# B2 — Limpiar lock
cd ~/Documents/Claude/Projects/GAMADEMEXICO
rm .git/index.lock

# B3 — Commit changes
git add src/pages/empresas-certificadas/ \
        src/content/productos/ \
        FASE-0-RECONFIRMACION-2026-07-01.md \
        FASE-1-BASE-TECNICA-2026-07-01.md \
        FASE-2-METADATOS-PREP.md \
        FASE-4-CONVERSIONES-PREP.md \
        docs/

git commit -m "fix: noindex empresas-certificadas (4 páginas) + descriptions productos recortadas + docs"

git push origin main
# → Esto dispara deploy.yml → CF Pages build → ~3-5 min
```

### Verificación post-deploy (cuando prod vuelva a 200)
```bash
# 1. Origen correcto (sin GH Pages)
curl -sI https://gamademexico.com/ | grep -E "server|x-github|cf-cache"
# Esperado: server: cloudflare, cf-cache-status, SIN x-github-request-id

# 2. llms.txt accesible
curl -s -o /dev/null -w "%{http_code}" https://gamademexico.com/llms.txt
# Esperado: 200

# 3. robots.txt limpio (sin CF Managed Content)
curl -s https://gamademexico.com/robots.txt | head -3
# Esperado: "# Robots.txt — GAMA de México"

# 4. SearchAction eliminado
curl -s https://gamademexico.com/ | grep -c "SearchAction"
# Esperado: 0

# 5. Canonical home correcto
curl -s https://gamademexico.com/ | grep 'rel="canonical"' | grep -o 'href="[^"]*"'
# Esperado: href="https://gamademexico.com/"

# 6. noindex en empresas-certificadas
curl -s https://gamademexico.com/empresas-certificadas | grep 'name="robots"'
# Esperado: content="noindex, follow"

# 7. Title home sin marca antepuesta
curl -s https://gamademexico.com/ | grep -o '<title>[^<]*</title>'
# Esperado: <title>Equipos Contra Incendios Certificados UL/FM en México</title>
```

---

## Estado de Cierre

**FASE 0 — CERRADO** con las siguientes caveats:

- Diagnóstico completo: ✅
- Nuevo hallazgo (403 DNS loop): ✅ documentado
- Noindex empresas-certificadas: ✅ implementado en código, pendiente commit
- Bloqueos externos aislados y documentados: ✅
- Producción: ❌ CAÍDA — requiere acción de Frank (P0)

*Documento generado: 2026-07-02 | Autor: Claude | Próximo paso: Frank ejecuta B1→B3 → verificación post-deploy*
