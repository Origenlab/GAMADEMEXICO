# Estudio de Auditoría: Monitores Contra Incendios
**Fecha:** 6 de Febrero 2026
**Sitio:** gamademexico-astro

---

## Resumen Ejecutivo

| Métrica | Valor |
|---------|-------|
| Total productos monitores | 35 |
| Total imágenes disponibles | 130 |
| Imágenes utilizadas | 112 (86%) |
| Imágenes sin usar | 18 (14%) |
| Errores críticos | 0 |
| Advertencias | 8 |
| Mejoras sugeridas | 31 |

### Distribución por Subcategoría
| Subcategoría | Productos | Estado |
|--------------|-----------|--------|
| tipo-corazon | 8 | OK |
| cuello-cisne | 8 | OK |
| certificado-fm | 8 | OK |
| ul-listed | 8 | OK |
| elkhart-premium | 3 | OK |

---

## ERRORES A CORREGIR

### 1. Valores de Orden Duplicados

**Problema:** Hay productos con el mismo valor de `orden`, lo que puede causar ordenamiento inconsistente.

| Orden | Productos afectados |
|-------|---------------------|
| 13 | `monitor-certificado-fm.md`, `monitor-cuello-cisne-bronce-marino.md` |
| 14 | `monitor-cuello-cisne-certificado-pemex.md`, `monitor-ul-listed.md` |

**Corrección sugerida:**
```yaml
# monitor-certificado-fm.md
orden: 13

# monitor-cuello-cisne-bronce-marino.md
orden: 40  # Mover a rango de cuello-cisne

# monitor-cuello-cisne-certificado-pemex.md
orden: 41

# monitor-ul-listed.md
orden: 14
```

---

### 2. Productos Sin Campos Completos

**Productos sin `modelo`:**
- `monitor-certificado-fm.md`
- `monitor-ul-listed.md`

**Productos sin `precioReferencia`:**
- `monitor-certificado-fm.md`
- `monitor-ul-listed.md`

**Productos sin `galeria`:**
- `monitor-corazon-966-m002.md`
- `monitor-corazon-elkhart-294-11.md`
- `monitor-elkhart-brass-copperhead-8593.md`

---

### 3. Imágenes de Galería Incorrectas

**Archivo:** `monitor-corazon-joperz-i102.md`

**Problema:** La galería incluye 6 imágenes de "aplicación industrial" que no corresponden a un monitor tipo corazón.

**Imágenes a remover de la galería:**
- `monitor-contra-incendio-aplicacion-industrial-01.avif`
- `monitor-contra-incendio-aplicacion-industrial-02.avif`
- `monitor-contra-incendio-aplicacion-industrial-03.avif`
- `monitor-contra-incendio-aplicacion-industrial-04.avif`
- `monitor-contra-incendio-aplicacion-industrial-05.avif`
- `monitor-contra-incendio-aplicacion-industrial-06.avif`

**Imágenes sugeridas para reemplazo (disponibles sin usar):**
- `monitor-corazon-doble-cremallera-volante-manivela.avif`
- `monitor-corazon-una-cremallera-vistas-multiples.avif`
- `monitor-doble-cremallera-galeria-detalles.avif`

---

### 4. Página Principal - Imágenes Incorrectas

**Archivo:** `src/pages/monitores-contra-incendios.astro`

**Problema en línea 64:** La card de "Monitor Cuello de Cisne" usa imagen de corazón:
```html
<!-- INCORRECTO -->
url('/img/monitores-contra-incendios/monitor-incendio-corazon-angulos-giro-vertical.avif')

<!-- CORRECTO -->
url('/img/monitores-contra-incendios/monitor-cuello-cisne-vista-frontal-bronce.avif')
```

**Problema en línea 81:** La card de "Monitor Certificado FM" usa imagen tipo corazón:
```html
<!-- INCORRECTO -->
url('/img/monitores-contra-incendios/monitor-tipo-corazon-bronce-fundido-detalle.avif')

<!-- CORRECTO -->
url('/img/monitores-contra-incendios/monitor-st611-fm-approved-vista-frontal.avif')
```

**Problema en línea 98:** La card de "Monitor UL Listed" usa imagen tipo corazón:
```html
<!-- INCORRECTO -->
url('/img/monitores-contra-incendios/monitor-corazon-doble-cremallera-volante-manivela.avif')

<!-- CORRECTO -->
url('/img/monitores-contra-incendios/monitor-ul-listed-fixed-flow-vista-frontal.avif')
```

---

## MEJORAS SUGERIDAS

### 1. Meta Descriptions Muy Largas (SEO)

Google trunca descriptions mayores a 160 caracteres. Los siguientes productos tienen descriptions largas:

| Producto | Caracteres | Acción |
|----------|------------|--------|
| monitor-ul-listed-fixed-flow-foam.md | 216 | Acortar |
| monitor-ul-listed-economico.md | 215 | Acortar |
| monitor-ul-listed-retrofit.md | 213 | Acortar |
| monitor-cuello-cisne.md | 212 | Acortar |
| monitor-corazon-terminales-almacenamiento.md | 211 | Acortar |
| monitor-fm-refinerias.md | 210 | Acortar |
| ... y 25 más | 160-210 | Revisar |

**Recomendación:** Mantener descriptions entre 120-160 caracteres.

---

### 2. Imágenes Sin Usar (18 imágenes)

Las siguientes imágenes están disponibles pero no asignadas a ningún producto:

**Tipo Corazón (podrían usarse en galerías):**
- `monitor-corazon-doble-cremallera-volante-manivela.avif`
- `monitor-corazon-miniatura-thumbnail.avif`
- `monitor-corazon-una-cremallera-vistas-multiples.avif`
- `monitor-doble-cremallera-detalle-volante.avif`
- `monitor-doble-cremallera-galeria-detalles.avif`
- `monitor-doble-cremallera-par-angulo-45.avif`
- `monitor-doble-cremallera-render-01.avif` a `render-06.avif`
- `monitor-incendio-corazon-vista-lateral-volante.avif`

**Elkhart Premium:**
- `monitor-elkhart-brass-scorpion-detalle-controles.avif`
- `monitor-elkhart-brass-scorpion-detalle-cuerpo.avif`
- `monitor-sidewinder-exm2-render-compacto-01.avif`
- `monitor-sidewinder-exm2-render-compacto-02.avif`
- `monitor-sidewinder-exm2-servicio-pesado.avif`

---

### 3. Estandarización de Campos

**Valores de flujo inconsistentes:**
- "250 - 1,000 GPM" (13 productos)
- "500 - 1,250 GPM" (8 productos)
- "Según modelo" (2 productos) ← Evitar valores vagos
- "Alto caudal variable" (1 producto) ← Evitar valores vagos

**Materiales con variaciones:**
- "Bronce fundido" (12)
- "Bronce forjado" (8)
- "Bronce fundido nacional" (1) ← Consolidar
- "Bronce fundido de alta densidad" (1) ← Consolidar
- "Bronce fundido certificado" (1) ← Consolidar

**Recomendación:** Usar valores consistentes:
- `Bronce fundido`
- `Bronce forjado`
- `Acero inoxidable 316L`
- `Aluminio anodizado`

---

### 4. Falta Subcategoría Elkhart Premium en Navegación

Los 3 productos Elkhart Premium (`scorpion`, `vulcan`, `sidewinder`) no tienen página de subcategoría dedicada.

**Opciones:**
1. Crear `/monitores/elkhart-premium.astro`
2. Reasignar a subcategorías existentes según tipo de monitor

---

### 5. Interlinking Interno

**Productos que referencian páginas inexistentes:**
- Links a `/productos/valvulas-seccionamiento` (no existe)
- Links a `/productos/epp-brigadas` (no existe)
- Links a `/productos/espuma-afff-marino` (no existe)

---

## IMÁGENES - CLASIFICACIÓN VISUAL

### Tipo Corazón (forma Y con ruedas/volantes)
Total: 35 imágenes disponibles

### Cuello de Cisne (forma S curvada)
Total: 18 imágenes disponibles

### ST611/FM (cuerpo rojo, boquilla dorada)
Total: 17 imágenes disponibles

### UL Listed (ruedas negras o boquilla amarilla)
Total: 21 imágenes disponibles

### Elkhart Premium (Scorpion, Vulcan, Sidewinder)
Total: 24 imágenes disponibles

### Aplicaciones Industriales (uso general)
Total: 6 imágenes disponibles

---

## ACCIONES INMEDIATAS RECOMENDADAS

### Prioridad Alta
1. [ ] Corregir imágenes en página principal `monitores-contra-incendios.astro`
2. [ ] Corregir galería de `monitor-corazon-joperz-i102.md`
3. [ ] Reasignar valores de orden duplicados

### Prioridad Media
4. [ ] Agregar campos faltantes (`modelo`, `precioReferencia`, `galeria`)
5. [ ] Acortar meta descriptions largas
6. [ ] Asignar imágenes sin usar a productos relevantes

### Prioridad Baja
7. [ ] Estandarizar valores de campos (flujo, material)
8. [ ] Crear página para Elkhart Premium o reasignar productos
9. [ ] Corregir links internos rotos

---

## NOTAS TÉCNICAS

### Schema Content Collection
El schema en `src/content/config.ts` debería incluir `subcategoria` como campo requerido (ya está implementado).

### Filtrado por Subcategoría
Las 4 páginas de subcategoría ya usan filtrado correcto:
```javascript
const productos = todosMonitores.filter(p => p.data.subcategoria === 'nombre-subcategoria');
```

### Rutas de Productos
Todos los productos se acceden desde `/productos/[nombre-producto]`

---

*Reporte generado automáticamente por auditoría del sistema*
