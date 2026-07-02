# Dashboard Operativo — GAMADEMEXICO
**Última actualización:** 2026-07-02  
**Ejecutado por:** Claude — Lead Technical Executor  

---

## 🔴 ALERTA ACTIVA — Producción caída

`gamademexico.com` devuelve **HTTP 403** con error "DNS points to prohibited IP" (CF Error 1000).  
El sitio es inaccesible para usuarios reales y buscadores.  
**Requiere acción inmediata de Frank.**

---

## Estado de Producción

| URL | HTTP | Origen | Build | Acción |
|---|---|---|---|---|
| gamademexico.com | ❌ 403 | CF (loop DNS) | — | Frank: fix DNS CF Dashboard |
| gamademexico.pages.dev | ✅ 200 | CF Pages | Jun 24 (stale) | Frank: push código actual |

---

## Estado por Fase

| Fase | Estado | Código | Deploy | Verificado prod |
|---|---|---|---|---|
| FASE 0 — Diagnóstico | ✅ CERRADO | — | — | ✅ |
| FASE 1 — Estabilización técnica | ⛔ BLOQUEADO (infra) | ✅ Listo | ❌ Pendiente | ❌ Pendiente |
| FASE 2 — SEO Titles/Descriptions | ⏳ PREPARADO | ✅ Listo | ❌ Pendiente | ❌ Pendiente |
| FASE 3 — Captación/Conversión | ⏳ MAPEADO | Parcial | ❌ Pendiente | ❌ Pendiente |
| FASE 4 — Arquitectura/Consolidación | ⏳ Pendiente | — | — | — |
| FASE 5 — GEO/AI Visibility | ⛔ BLOQUEADO (infra) | ✅ llms.txt/robots | ❌ Pendiente | ❌ Pendiente |

---

## Backlog P0 — Acciones que desbloquean todo lo demás

### B1 — Fix DNS Error 1000 (Frank · CF Dashboard)
```
Cloudflare Dashboard → gamademexico.com → DNS → Records
→ Eliminar A records que apunten a 172.67.222.49 o 104.21.54.10
→ Workers & Pages → gamademexico → Custom Domains
  → Quitar dominio → Re-agregar → Dejar que CF genere CNAME correcto
```

### B2 — Limpiar git index.lock (Frank · Terminal)
```bash
cd ~/Documents/Claude/Projects/GAMADEMEXICO
rm .git/index.lock
```

### B3 — Commit + push (Frank · Terminal, después de B2)
```bash
git add src/pages/empresas-certificadas/ \
        src/content/productos/ \
        FASE-0-RECONFIRMACION-2026-07-01.md \
        FASE-1-BASE-TECNICA-2026-07-01.md \
        FASE-2-METADATOS-PREP.md \
        FASE-4-CONVERSIONES-PREP.md \
        docs/

git commit -m "fix: noindex empresas-certificadas (4 páginas) + descriptions productos + docs sesión 2026-07-02"
git push origin main
```
Esto dispara deploy.yml → CF Pages build (~3-5 min)

### B4 — Verificar AI Scrape Shield (Frank · CF Dashboard)
```
Cloudflare Dashboard → gamademexico.com → Security → Bots
→ Verificar que "Block AI Scrapers and Crawlers" esté OFF
```
(Puede haberse reactivado al hacer cambios en el dashboard)

---

## Verificación completa post-B1→B4

```bash
# 1. Producción respondiendo
curl -s -o /dev/null -w "%{http_code}" https://gamademexico.com/
# Esperado: 200

# 2. Origen CF Pages (no GitHub)
curl -sI https://gamademexico.com/ | grep "x-github"
# Esperado: vacío (sin x-github-request-id)

# 3. llms.txt accesible
curl -s -o /dev/null -w "%{http_code}" https://gamademexico.com/llms.txt
# Esperado: 200

# 4. robots.txt limpio
curl -s https://gamademexico.com/robots.txt | head -3
# Esperado: "# Robots.txt — GAMA de México" (sin "BEGIN Cloudflare Managed content")

# 5. SearchAction eliminado
curl -s https://gamademexico.com/ | grep -c "SearchAction"
# Esperado: 0

# 6. Canonical home correcto
curl -s https://gamademexico.com/ | grep 'rel="canonical"' | grep -o 'href="[^"]*"'
# Esperado: href="https://gamademexico.com/"

# 7. Title home sin marca antepuesta
curl -s https://gamademexico.com/ | grep -o '<title>[^<]*</title>'
# Esperado: <title>Equipos Contra Incendios Certificados UL/FM en México</title>

# 8. noindex en empresas-certificadas
curl -s https://gamademexico.com/empresas-certificadas | grep 'name="robots"'
# Esperado: content="noindex, follow"

# 9. noindex en hidrantes
curl -s https://gamademexico.com/hidrantes | grep 'name="robots"'
# Esperado: content="noindex, follow"
```

---

## Lo que está implementado en código y listo para deploy

### Implementado y commiteado (en main, no desplegado)
| Ítem | Commit | Estado |
|---|---|---|
| SearchAction eliminado | 7f47064 | ✅ En código |
| Canonical /index → / fix | Base.astro | ✅ En código |
| noindex hidrantes (3 páginas) | 5798463 | ✅ En código |
| Breadcrumb duplicado eliminado | 34ed228 | ✅ En código |
| Canonicals blog 68 posts | 805ff81 | ✅ En código |
| 52 redirects 301 empresas → anónimo | 6c0bfd7 | ✅ En código |
| Prefetch → viewport | f8d1395 | ✅ En código |
| Titles SEO sin marca (8 páginas) | 3e61501 | ✅ En código |
| Schema cleanup (offers falso) | 3ef2b88 | ✅ En código |

### Implementado en disco, pendiente commit (bloqueado por index.lock)
| Ítem | Archivos | Estado |
|---|---|---|
| **noindex empresas-certificadas** | 4 páginas .astro | ⚠️ Listo, sin commitear |
| Descriptions productos recortadas | 38 archivos .md | ⚠️ Listo, sin commitear |
| Docs sesión 2026-07-01 y 2026-07-02 | 7 archivos .md | ⚠️ Listo, sin commitear |

---

## Documentos de referencia activos

| Documento | Ruta | Estado |
|---|---|---|
| Diagnóstico consolidado | `docs/auditoria-2026/FASE-0-Diagnostico-Consolidado.md` | ✅ Vigente |
| Reconfirmación 2026-07-01 | `docs/auditoria-2026/FASE-0-Reconfirmacion-Realidad-2026-07-01.md` | ✅ Vigente |
| **Estado real 2026-07-02** | `docs/auditoria-2026/FASE-0-Estado-Real-2026-07-02.md` | ✅ **Este documento** |
| FASE 1 — Base técnica | `docs/auditoria-2026/FASE-1-Base-Tecnica-Produccion-2026-07-01.md` | ✅ Vigente |
| FASE 2 — Metadatos SEO | `docs/auditoria-2026/FASE-2-Metadatos-SEO-2026-07-01.md` | ✅ Vigente |
| **FASE 2 — Criterios SEO** | `docs/auditoria-2026/FASE-2-Criterios-SEO-Titles-Descriptions.md` | ✅ **Nuevo** |
| **FASE 3 — Mapa captación** | `docs/auditoria-2026/FASE-3-Mapa-Captacion-Conversion.md` | ✅ **Nuevo** |

---

## Nota sobre el Vault de Obsidian

Los documentos del vault mencionados en el plan maestro (rutas como `00 - HOME/00 - Dashboard`) no son accesibles desde el entorno de trabajo (solo tiene acceso a la carpeta del proyecto `GAMADEMEXICO`). Todo el tracking operativo se mantiene en `docs/auditoria-2026/`. Si Frank tiene el vault de Obsidian apuntando a la carpeta del proyecto, los documentos en `docs/` serán visibles desde Obsidian.
