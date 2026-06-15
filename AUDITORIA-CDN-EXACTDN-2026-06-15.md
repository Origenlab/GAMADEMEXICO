# Auditoría de optimización de imágenes — EWWW ExactDN

**Sitio:** gamademexico.com
**CDN:** `https://egsev2ykn2x.exactdn.com` (EWWW.io Easy IO / ExactDN)
**Panel:** https://ewww.io/manage-sites/
**Fecha:** 15 jun 2026

---

## Veredicto

El sitio **está correctamente configurado y sirviendo imágenes optimizadas vía ExactDN en producción.** Se detectó **un (1) gap real** —12 fondos CSS en `/servicios`— que ya fue **corregido** en este pase. Todo lo demás verificado pasa por el CDN con formato AVIF, redimensionado por dispositivo y metadatos eliminados.

---

## Qué se verificó

### 1. Configuración base — OK
- `PUBLIC_EWWW_CDN_BASE=https://egsev2ykn2x.exactdn.com` definido en entorno.
- Helper `src/lib/images.ts`: genera URLs con parámetros Photon/ExactDN (`w`, `quality`, `strip=all`, `fit/resize`, `zoom`). Quality por defecto 82; thumbnails 75; hero 85; OG 1200×630.
- Plugin Markdown `rehype-ewww-images.mjs`: optimiza imágenes del blog en build (srcset 480/768/1024/1280, lazy, decoding async).
- Script runtime en `Base.astro`: reescribe `<img src^="/img/">` a ExactDN en cliente.
- `preconnect` + `dns-prefetch` al CDN.
- CSP (`public/_headers`) permite `https://*.exactdn.com` en `img-src` y `connect-src`. OK.

### 2. Producción en vivo (gamademexico.com) — OK
Verificado por fetch directo del HTML servido (sin JS):
- `<img>` de producto/servicio → `https://egsev2ykn2x.exactdn.com/img/...avif?w=640&quality=78&strip=all` ✅
- Logo header → `...exactdn.com/img/gama-de-mexico.avif?w=400&quality=82&strip=all` ✅
- `og:image` y `twitter:image` → `...exactdn.com/img/og-...jpg` ✅

El build de producción **hornea** la URL del CDN en el markup (no depende solo del script runtime). Formato AVIF + resize + `strip=all` confirmados.

### 3. Inventario físico
1,618 imágenes en `public/img/` (1,600 AVIF, 6 JPG, 2 PNG, 10 SVG). El AVIF ya es formato moderno; ExactDN añade caché en edge global, resize por dispositivo y negociación de formato.

---

## Gap detectado y CORREGIDO

**`src/pages/servicios.astro` — 12 fondos CSS bypaseaban el CDN.**

Causa: usaban rutas crudas `style="background-image: url('/img/...avif')"` sin pasar por ningún helper. El script runtime de `Base.astro` **solo reescribe etiquetas `<img>`, no fondos CSS** → esas 12 imágenes hero/card se servían desde el origen, sin caché edge ni resize, a resolución completa.

**Fix aplicado** (mismo patrón que las otras 5 páginas de categoría que ya lo hacían bien):
- Añadido `import { getBackgroundImageUrl }` + helper local `detailImage()` (width 1280, quality 80, strip all).
- Las 12 referencias ahora son `style={`background-image: url('${detailImage('/img/...avif')}'); ...`}`.

Validación: build de producción confirma que `/servicios` queda idéntico en comportamiento a `boquillas-contra-incendios` (página de referencia que ya enrutaba por el helper). 0 fondos crudos restantes, 12 enrutados.

---

## Observaciones (no bloqueantes)

1. **`<img>` con `src="/img/"` literal** (logos de clientes SVG en home, e imágenes de detalle en `/servicios/*`): dependen del script runtime para obtener el CDN. Funciona con JS activo, pero provoca **doble descarga** (el navegador baja la imagen local y luego JS cambia el `src` al CDN). Recomendación a futuro: rutear también estas por helper en build para hornear el CDN y evitar la doble petición. Los SVG son irrelevantes (ExactDN no transforma SVG; ya son vectoriales y mínimos).

2. **Logos de clientes (SVG)** permanecen en origen local en producción. Correcto: ExactDN no optimiza SVG y son archivos diminutos.

---

## Acción pendiente para que el fix llegue a producción

El cambio está en `src/pages/servicios.astro` (working tree). Para desplegarlo:

```bash
git add src/pages/servicios.astro
git commit -m "fix(img): enrutar 12 fondos CSS de /servicios por ExactDN"
git push
```

El CI rebuild horneará las URLs del CDN automáticamente.

---

## Verificación recomendada en el panel EWWW

En https://ewww.io/manage-sites/ confirmar para el sitio `egsev2ykn2x`:
- **Easy IO activo** (status verde).
- **Bandwidth/Images** registrando tráfico reciente.
- Que el dominio autorizado incluya `gamademexico.com`.
