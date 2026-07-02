# FASE 2 — Criterios SEO: Titles y Descriptions
**Fecha:** 2026-07-02  
**Estado:** ✅ PREPARADO — listo para ejecutar cuando FASE 1 esté desplegada  
**Prerequisito:** Producción sirviendo build actual (post-DNS-fix + push)

---

## Reglas No Negociables (ya implementadas en código — confirmar en HTML real post-deploy)

### Titles
1. **No anteponer marca** — nunca `Gama de México | [keyword]`
2. **Keyword primaria al inicio** — intención de búsqueda > marca > certificación
3. **Longitud:** 50–70 caracteres (Google trunca a ~70)
4. **No "Catálogo de"**, no "Etiqueta:", no "Elkhart Brass" como ruido
5. **Formato aceptado:** `[Keyword] | [Diferenciador]` — el `|` como separador cuando aplica
6. **Marca al final** solo si aporta valor real y no lleva sobre el límite

### Descriptions
1. **Longitud:** 140–160 caracteres
2. **No repetir el title**
3. **No genéricas** — cada una debe ser específica a la página
4. **Incluir:** beneficio primario + diferenciador + CTA implícito
5. **No "Stock"** como única señal de disponibilidad — integrar al beneficio
6. **No texto truncado** — revisar que terminen en oración completa

---

## Criterios por Tipo de Página

### Tipo 1 — Home (`/`)
**Estado actual en código:** ✅ Correcto  
**Title actual:** `Equipos Contra Incendios Certificados UL/FM en México` (53 chars)  
**Patrón:** Categoría principal + certificación + geografía. Sin marca.  
**Description:** Diferenciadores reales (distribuidor autorizado Elkhart Brass, stock CDMX/QRO, cotización 24h)  
**Acción:** Verificar en HTML post-deploy — sin cambios de código necesarios

---

### Tipo 2 — Categorías L1 (6 páginas)
**Páginas:** `/monitores-contra-incendios`, `/boquillas-contra-incendios`, `/mangueras-contra-incendios`, `/valvulas-contra-incendios`, `/conexiones-herrajes-contra-incendios`, `/gabinetes-hidrantes-contra-incendios`

**Patrón de title:**
```
[Producto plural] Certificados [Norma] en México          → 50-65 chars
[Producto plural] [Norma] | [Diferenciador] México        → 50-65 chars
```

**Ejemplos correctos:**
- `Monitores Contra Incendios Certificados UL/FM en México` ✅ (55 chars)
- `Boquillas Contra Incendios UL Listed | Turbo Jet y Pistola México` ✅ (65 chars)
- `Conexiones y Herrajes Contra Incendios NH, NPT y Storz | UL/FM México` ✅ (69 chars)

**Patrón de description:**
```
[Tipo/variedad de productos] disponibles. [Certificación]. [Diferenciador operativo]. [CTA].
140-160 chars
```

**Acción:** Verificar títulos en HTML real post-deploy — ya corregidos en código (commit 3e61501)

---

### Tipo 3 — Hub de Equipos (`/equipos`)
**Title actual en código:** `Equipos Contra Incendios UL/FM | Stock Inmediato en México` ✅ (58 chars)  
**Patrón:** keyword hub + certificación + diferenciador operativo  
**Acción:** Verificar post-deploy

---

### Tipo 4 — Subcategorías dinámicas (`/[seccion]/[subcategoria]`)
**Patrón de title (generado dinámicamente desde frontmatter + CATEGORY_META):**
```
[Subcategoría descriptiva] | [Categoría padre] México
```
**Acción:** Auditar muestra de 5 subcategorías post-deploy para confirmar que el template genera sin marca

---

### Tipo 5 — Productos individuales (`/productos/[slug]`)
**Estado:** El template ya aplica `seoTitle = title.split(' | ')[0].trim()` — strip de sufijo de marca  
**Patrón del frontmatter:**
```yaml
title: "[Modelo] [Descripción técnica] [Certificación] [Specs clave]"
```
**Límite:** ≤70 chars validado por schema Zod en `content.config.ts`  
**Acción:** Verificar muestra de 10 productos en HTML post-deploy

---

### Tipo 6 — Blog posts (`/blog/[categoria]/[slug]`)
**Patrón:**
```
[Beneficio/aprendizaje específico] + [Contexto técnico]
NO: "[Tema]: Guía Completa"
SÍ: "Cómo elegir un monitor contra incendios para refinería"
```
**Validación Zod:** title ≤70 chars en content.config.ts  
**Acción:** Auditar 10 posts con más tráfico potencial post-deploy — verificar que los frontmatters cumplen el patrón

---

### Tipo 7 — Blog categorías (`/blog/[categoria]`)
**Title pattern (en `CATEGORY_META` object dentro de `blog/[categoria]/index.astro`):**  
```
[Categoría] — Artículos sobre Equipos Contra Incendios     → ~50 chars
```
**Acción:** Verificar los 6-8 títulos de categoría de blog post-deploy

---

### Tipo 8 — Blog tags (`/blog/tag/[tag]`)
**Title actual en código (commit 3e61501):**
```
${tag} — Artículos sobre Equipos Contra Incendios
```
**Antes:** `Etiqueta: ${tag} — Equipos Contra Incendios` (prefijo interno inútil)  
**Acción:** Verificar en 3 tags post-deploy

---

### Tipo 9 — Páginas de servicio (`/servicios/[servicio]`)
**Patrón:**
```
[Servicio específico] de Equipos Contra Incendios | [Diferenciador]
```
**Acción:** Auditar `/servicios`, `/servicios/mantenimiento`, `/servicios/asesoria`, `/servicios/garantia` post-deploy

---

### Tipo 10 — Páginas legales y utilitarias
**`/aviso-de-privacidad`**, **`/terminos-y-condiciones`**:  
Marca en description es correcta aquí (identidad del emisor es relevante en contexto legal). Sin cambios necesarios.

**`/precios`**:  
Title en código: `Precios de Equipos Contra Incendios UL/FM en México` ✅ (51 chars)  
Acción: Verificar post-deploy

---

## Checklist de Auditoría Post-Deploy

```bash
# Script de verificación rápida de titles
for url in "/" "/equipos" "/monitores-contra-incendios" "/boquillas-contra-incendios" \
           "/mangueras-contra-incendios" "/valvulas-contra-incendios" \
           "/conexiones-herrajes-contra-incendios" "/gabinetes-hidrantes-contra-incendios" \
           "/servicios" "/contacto" "/precios"; do
  title=$(curl -s "https://gamademexico.com${url}" | grep -o '<title>[^<]*</title>')
  echo "${url}: ${title}"
done
```

**Señales de alerta:**
- Title que empieza con "Gama de México" → revisar frontmatter o CATEGORY_META
- Title con "Catálogo de" o "Etiqueta:" → revisar template
- Title > 70 chars → revisar y recortar
- Title vacío o genérico → revisar que el template recibe los datos correctos

---

## FASE 2 — Estado

**PREPARADO.** No iniciar auditoría de HTML real hasta que producción sirva el build actual.  
Criterios definidos. Templates ya corregidos en código. Falta validar contra HTML real de producción.

*Próximo paso: Frank completa B1→B3 → deploy → auditoría HTML con el script anterior*
