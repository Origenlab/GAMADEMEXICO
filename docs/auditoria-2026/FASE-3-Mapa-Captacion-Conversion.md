# FASE 3 — Mapa Real de Captación y Conversión
**Fecha:** 2026-07-02  
**Estado:** ✅ PREPARADO — basado en lectura directa del código fuente  
**Prerequisito:** FASE 1 desplegada — no ejecutar cambios sobre build antiguo

---

## Inventario Real de Formularios (verificado en código)

### Mapa por página

| Página | Formulario | Componente | IDs hardcodeados | Salida |
|---|---|---|---|---|
| `/` (Home) | ✅ Inline legacy | ❌ No usa CotizacionForm | `cotizar-form`, `lead-nombre`, `lead-contacto`, `lead-equipo` | WhatsApp con mensaje genérico |
| `/contacto` | ✅ Inline legacy | ❌ No usa CotizacionForm | `contact-form` | WhatsApp vía `data-whatsapp` |
| `/cotizar` | ✅ Inline legacy | ❌ No usa CotizacionForm | `cotizacion-form` | WhatsApp con mensaje genérico |
| `/equipos` | ❌ Sin formulario | — | — | CTAs a subcategorías |
| `/blog/[categoria]/[slug]` | ✅ CotizacionForm | ✅ | — | WhatsApp con mensaje |
| `/[seccion]/[subcategoria]` | ✅ CotizacionForm | ✅ | — | WhatsApp con mensaje |
| `/hidrantes/*` | ✅ CotizacionForm | ✅ | — | WhatsApp con mensaje |
| `/empresas-certificadas/*` | ✅ CotizacionForm | ✅ | — | WhatsApp con mensaje |
| `/nosotros` | ✅ LeadCapture | ✅ | — | Sin confirmar |
| `/servicios/mantenimiento` | ✅ LeadCapture | ✅ | — | Sin confirmar |
| `/servicios/asesoria` | ✅ LeadCapture | ✅ | — | Sin confirmar |
| `/servicios/instalacion` | ✅ LeadCapture | ✅ | — | Sin confirmar |
| `/servicios/empresas` | ✅ LeadCapture | ✅ | — | Sin confirmar |

---

## Coexistencia de Capas: Diagnóstico Real

### Formularios legacy (inline en páginas .astro)
Son formularios definidos directamente dentro del HTML de la página, no como componente importado. Se identificaron en 3 páginas de alto tráfico:

**Home (`/`)** — `id="cotizar-form"`:
```html
<form id="cotizar-form" class="quote-form" aria-label="Formulario de cotización por WhatsApp">
  <input id="lead-nombre" name="nombre" ...>
  <input id="lead-contacto" name="contacto" ...>
  <select id="lead-equipo" name="tipo_equipo" ...>
  <button type="submit">...</button>
</form>
```
Salida: script inline que construye URL de WhatsApp. No usa CotizacionForm.

**Contacto (`/contacto`)** — `id="contact-form"`:
```html
<form class="contact-form" id="contact-form" data-whatsapp={WHATSAPP_NUMBER}>
```
Atributo `data-whatsapp` sugiere un script externo que escucha el submit.

**Cotizar (`/cotizar`)** — `id="cotizacion-form"`:
```html
<form class="contact-form" id="cotizacion-form" novalidate>
```

### CotizacionForm (componente moderno)
`src/components/CotizacionForm.astro` — confirma la salida a WhatsApp:
```javascript
window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(mensaje)}`, '_blank');
```
Incluye campos: nombre, contacto, tipo de equipo, mensaje. Construye mensaje pre-cargado. Es la implementación correcta.

### LeadCapture (componente secundario)
Usado en páginas de servicios y nosotros. Output no verificado directamente — requiere inspección de `src/components/LeadCapture.astro`.

---

## WhatsApp: Estado Real

### Variantes de links encontradas en código
| Página/Contexto | URL de WhatsApp | Texto pre-cargado |
|---|---|---|
| General | `wa.me/5215565298240` | Ninguno (chat vacío) |
| Servicios (instalación) | `wa.me/5215565298240?text=Hola Gama de México, necesito un instalador certificado...` | ✅ Con contexto |
| Equipos / Proyecto | `wa.me/5215565298240?text=Hola Gama de México, tengo un proyecto de equipamiento...` | ✅ Con contexto |
| Documentación | `wa.me/5215565298240?text=Hola, necesito documentación para una licitación` | ✅ Con contexto |
| Válvulas | `wa.me/5215565298240?text=Hola, necesito identificar una válvula para reposición` | ✅ Con contexto |
| Asesoría técnica | `wa.me/5215565298240?text=Hola, solicito asesoría técnica` | ✅ Con contexto |

**Conclusión:** El texto pre-cargado YA existe en varias partes del sitio. No es un problema de falta de implementación — es un problema de **inconsistencia**: algunas páginas lo usan, otras no.

---

## Hallazgos del Funnel

### Problema 1 — Formularios legacy en páginas de mayor tráfico
Las 3 páginas más críticas para conversión (Home, Contacto, Cotizar) usan formularios inline distintos, no el componente estándar `CotizacionForm`. Esto genera:
- Inconsistencia de experiencia
- Mantenimiento duplicado
- IDs hardcodeados que bloquean cambios de CSS/JS sin auditar dependencias

### Problema 2 — IDs hardcodeados en Home
`cotizar-form`, `lead-nombre`, `lead-contacto`, `lead-equipo` — probablemente hay CSS y/o JS que depende de estos IDs. No se pueden cambiar sin auditar dependencias primero.

### Problema 3 — Salida a WhatsApp sin contexto de producto
El link de WhatsApp en el header y CTA general no lleva texto pre-cargado. El asesor recibe "Hola" sin saber qué producto buscó el usuario. Las páginas de servicios sí lo hacen bien. Hay una inconsistencia entre páginas.

### Problema 4 — `/equipos` sin formulario
La página hub del catálogo no tiene CTA de conversión directa. Solo links a subcategorías. Un usuario que llega buscando "equipos contra incendios" y no sabe exactamente qué necesita no tiene dónde dejar sus datos.

### Problema 5 — Tracking no verificado
No se puede confirmar si los submits de formularios están siendo registrados por Rybbit o TruConversion sin ver la producción real. Los eventos `rybbit.track('form_submit')` y `rybbit.track('whatsapp_click')` mencionados en FASE-4-CONVERSIONES-PREP.md no se ven en el código fuente.

---

## Plan de Ejecución (cuando FASE 1 esté desplegada)

### Paso 1 — Verificar que no romper (antes de tocar nada)
```bash
# Auditar dependencias de IDs hardcodeados
grep -rn "cotizar-form\|lead-nombre\|lead-contacto\|lead-equipo\|contact-form\|cotizacion-form" \
  src/styles/ src/scripts/ src/layouts/ src/components/
```
Si hay referencias de CSS/JS a estos IDs → documentar antes de cambiar

### Paso 2 — Migración conservadora de Home
Opción A (menos riesgo): Reemplazar el form inline en Home por `<CotizacionForm />` con prop `context="home"` o similar.  
Opción B (más riesgo): Rediseñar sección completa.

**Recomendación:** Opción A — migrar el form de Home a CotizacionForm sin tocar el layout. Un cambio quirúrgico.

### Paso 3 — WhatsApp con contexto en Home y Contacto
Cambiar los links de WhatsApp sin texto a:
```
https://wa.me/5215565298240?text=Hola,%20me%20interesa%20cotizar%20equipos%20contra%20incendios.%20¿Pueden%20ayudarme?
```
Cambio de bajo riesgo, alto impacto en calidad del lead.

### Paso 4 — CTA en `/equipos`
Añadir `<CotizacionForm />` al final de la página equipos.astro — un solo import + componente. Bajo riesgo.

### Paso 5 — Verificar LeadCapture
Leer `src/components/LeadCapture.astro` y confirmar salida. Si también va a WhatsApp con mensaje pre-cargado, documentarlo.

### Paso 6 — Tracking mínimo viable
```javascript
// Agregar en CotizacionForm.astro después del open() de WhatsApp:
if (window.rybbit) {
  window.rybbit.track('whatsapp_cotizacion', {
    pagina: window.location.pathname,
    tipo_equipo: tipoEquipo
  });
}
```

---

## Restricciones Confirmadas

- **NO eliminar WhatsApp** como canal primario — es el canal de conversión real
- **NO cambiar IDs hardcodeados** sin auditar dependencias CSS/JS primero
- **NO hacer cambios en producción** sin pasar por preview de CF Pages
- **NO medir con datos < 100 sesiones** por página — esperar volumen real

---

## Estado

**PREPARADO.** Mapa real levantado desde código. Listo para ejecutar cuando FASE 1 esté en producción.

Próxima acción técnica ejecutable: Paso 1 (auditar dependencias de IDs) — se puede hacer sin deploy.

*Generado: 2026-07-02 | Autor: Claude*
