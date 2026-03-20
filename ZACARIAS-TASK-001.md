# 🔧 TAREA ZACARÍAS #001 — Optimización de Imágenes + Galerías Elkhart
*Asignada por: Draco 🐉 | Fecha: 2026-03-20*

---

## 🎯 OBJETIVO
Optimizar TODAS las imágenes del sitio GAMADEMEXICO y completar las galerías de los 8 productos Elkhart que solo tienen 1 imagen. **Documentar TODO el proceso para aprender y poder replicar.**

---

## 📋 TAREAS EN ORDEN (paso a paso, sin prisas)

### FASE 1: Auditoría de imágenes
1. Contar TODAS las imágenes en `public/img/` por carpeta
2. Identificar imágenes que necesitan optimización:
   - Más anchas de 1200px (hay ~63)
   - Más pesadas de 150KB
   - Que NO sean AVIF (si hay alguna JPG/PNG suelta)
3. Documentar hallazgos en `ZACARIAS-LOG-001.md`

### FASE 2: Optimización de imágenes
**Reglas de optimización:**
- **Ancho máximo:** 1200px (mantener aspect ratio)
- **Formato:** AVIF siempre
- **Calidad:** 75 (balance entre peso y calidad)
- **Herramienta:** `npx sharp-cli` (ya instalado)
- **NUNCA** usar `sips` para escribir AVIF (solo lectura de dimensiones)

**Comando para resize + AVIF:**
```bash
npx sharp-cli -i "input.avif" -o "output.avif" --width 1200 --format avif --quality 75
```

**Proceso por cada imagen >1200px:**
1. Leer dimensiones con sips: `sips -g pixelWidth -g pixelHeight archivo.avif`
2. Si ancho > 1200px: resize con sharp-cli
3. Verificar resultado: dimensiones correctas y peso < original
4. Registrar: archivo, dimensión original, dimensión nueva, peso original, peso nuevo

**⚠️ IMPORTANTE:** Hacer backup antes de sobrescribir. Crear carpeta temporal:
```bash
mkdir -p /tmp/gama-backup-originals
```

### FASE 3: Completar galerías de productos Elkhart
Los 8 productos Elkhart solo tienen 1 imagen cada uno. Hay imágenes de subcategoría que sirven como galería.

**Mapeo de productos → imágenes disponibles:**

| Producto | Imagen actual | Carpeta de imágenes | Patrón de búsqueda |
|---|---|---|---|
| elkhart-vulcan.md | elkhart-vulcan-mon-01.avif | monitores-contra-incendios/ | *vulcan* |
| elkhart-stinger-2-0.md | elkhart-stinger-2-0-mon-01.avif | monitores-contra-incendios/ | *stinger* |
| elkhart-scorpion-manual.md | elkhart-scorpion-manual-mon-01.avif | monitores-contra-incendios/ | *scorpion* |
| elkhart-ram-xd.md | elkhart-ram-xd-mon-01.avif | monitores-contra-incendios/ | *ram-xd* o *ram_xd* |
| elkhart-copperhead.md | elkhart-copperhead-mon-01.avif | monitores-contra-incendios/ | *copperhead* |
| elkhart-chief-xd.md | elkhart-chief-xd-boq-01.avif | boquillas-contra-incendios/ | *chief* |
| elkhart-phantom-xd.md | elkhart-phantom-xd-boq-01.avif | boquillas-contra-incendios/ | *phantom* |
| elkhart-select-o-matic-xd.md | elkhart-select-o-matic-xd-boq-01.avif | boquillas-contra-incendios/ | *select-o* |

**Para cada producto:**
1. Buscar imágenes relacionadas en la carpeta de la categoría
2. Si no hay imágenes específicas del modelo, usar imágenes genéricas de la subcategoría que visualmente representen el tipo de producto
3. Seleccionar 4-5 imágenes para galería (variedad: frontal, lateral, detalle, aplicación, contexto)
4. Agregar bloque `galeria:` al frontmatter del archivo .md
5. Verificar que las rutas de imagen existan

**Formato del bloque galeria:**
```yaml
galeria:
  - "/img/monitores-contra-incendios/imagen-1.avif"
  - "/img/monitores-contra-incendios/imagen-2.avif"
  - "/img/monitores-contra-incendios/imagen-3.avif"
  - "/img/monitores-contra-incendios/imagen-4.avif"
  - "/img/monitores-contra-incendios/imagen-5.avif"
```

### FASE 4: Verificación
1. Ejecutar `npm run build` para verificar que no haya errores
2. Verificar que todas las rutas de imagen en los .md existan en public/
3. Contar páginas generadas vs antes
4. Documentar resultado

### FASE 5: Documentación y Aprendizaje
Crear `ZACARIAS-LOG-001.md` en la raíz del proyecto con:
- Fecha y hora de inicio/fin
- Qué hizo en cada fase
- Errores encontrados y cómo los resolvió
- Métricas: imágenes optimizadas, KB ahorrados, galerías completadas
- **Lecciones aprendidas** — qué haría diferente la próxima vez
- **Checklist reutilizable** para la próxima tanda

---

## 🔴 REGLAS IRROMPIBLES
1. **NO crear productos nuevos** — solo trabajar con los 212 existentes
2. **NO modificar código Astro** — solo archivos .md y imágenes
3. **NO borrar imágenes originales** sin backup
4. **Paso a paso** — terminar una fase antes de empezar la siguiente
5. **Documentar TODO** — cada acción, cada error, cada decisión
6. **Verificar después de cada cambio** — no asumir que funcionó

---

## 📂 RUTAS IMPORTANTES
- **Proyecto:** `/Users/frankoropeza/Desktop/CLIENTES/GAMADEMEXICO/`
- **Imágenes:** `public/img/`
- **Productos:** `src/content/productos/`
- **Config:** `src/content.config.ts` (NO modificar)
- **Build:** `npm run build`

---

## ✅ DEFINICIÓN DE "TERMINADO"
- [ ] 0 imágenes mayores a 1200px de ancho
- [ ] 0 imágenes no-AVIF en public/img/ (excepción: og-*.jpg, icon.png)
- [ ] 8 productos Elkhart con galería de 4-5 imágenes cada uno
- [ ] Build limpio (0 errores)
- [ ] ZACARIAS-LOG-001.md completo con métricas y lecciones
- [ ] Git commit con mensaje descriptivo
