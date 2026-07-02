# FASE 4 — Conversiones, Formularios, CTAs y WhatsApp (Preparación)
**Fecha prep:** 2026-07-01  
**Estado:** PENDIENTE — iniciar después de FASE 1 verificada  
**Prerequisito:** Producción sirviendo build actual; no auditar formularios sobre un build antiguo

---

## Contexto ya confirmado

- `CotizacionForm.astro` existe como componente reutilizable
- Siguen existiendo formularios legacy inline en varias páginas
- IDs hardcodeados repetidos: `cotizar-form`, `lead-nombre`, `lead-contacto`
- Captación depende demasiado de WhatsApp como salida temprana (pre-calificación insuficiente)
- TruConversion: baja profundidad de navegación, mobile más débil en páginas interiores
- Medición de funnels/form analytics no configurada

---

## Inventario inicial a levantar en FASE 4

### Paso 1: Mapeo completo de formularios

Identificar en cada página:
- ¿Usa `CotizacionForm`? ¿Versión legacy inline?
- ¿Tiene ID hardcodeado?
- ¿A dónde redirige: WhatsApp directo, email, formulario propio?

**Páginas prioritarias a mapear:**

| URL | Formulario actual | CotizacionForm? | ID hardcodeado |
|---|---|---|---|
| `/` | ❌ Por verificar | ❌ | ❌ |
| `/contacto` | ❌ Por verificar | ❌ | ❌ |
| `/cotizar` | ❌ Por verificar | ❌ | ❌ |
| `/equipos` | ❌ Por verificar | ❌ | ❌ |
| `/servicios` | ❌ Por verificar | ❌ | ❌ |
| Categorías L1 (6 páginas) | ❌ Por verificar | ❌ | ❌ |
| Productos (225 páginas) | ❌ Por verificar | ❌ | ❌ |

### Paso 2: CTA por tipo de página

Definir el CTA principal **antes** de tocar ningún formulario:

| Tipo de página | CTA primario propuesto | CTA secundario |
|---|---|---|
| Home | "Cotizar por WhatsApp" → formulario pre-calificado | "Ver Catálogo" |
| Categoría L1 | "Solicitar cotización de [categoría]" | "Ver todos los [equipos]" |
| Producto | "Cotizar este modelo" (con modelo pre-cargado) | "WhatsApp directo" |
| Blog | "¿Necesitas este equipo? Cotiza aquí" | — |
| Servicios | "Solicitar evaluación técnica" | "WhatsApp" |
| Contacto | Formulario completo con pre-calificación | WhatsApp como fallback |

### Paso 3: Lógica de WhatsApp

**Estado actual (problema):** El botón de WhatsApp abre chat sin contexto. El usuario llega a WhatsApp y el asesor no sabe qué buscaba. Se pierde calificación.

**Objetivo:** WhatsApp sigue siendo el canal principal pero con mensaje pre-cargado que incluye:
- Tipo de equipo de interés
- Página de origen (producto/categoría)
- Cantidad aproximada (si aplica)

**Implementación posible:**
```javascript
// En lugar de: https://wa.me/5215565298240
// Usar: https://wa.me/5215565298240?text=Hola, me interesa cotizar: [PRODUCTO] ([URL])
```

Esto mejora conversión sin eliminar la salida rápida por WhatsApp.

### Paso 4: Instrumentación mínima viable

**Prioridad 1 — Rybbit (ya instalado):**
- Verificar que los eventos de submit de formulario se están registrando
- Agregar evento personalizado en clicks a WhatsApp: `rybbit.track('whatsapp_click', { page, tipo })`
- Agregar evento en submit: `rybbit.track('form_submit', { pagina, origen })`

**Prioridad 2 — TruConversion:**
- Configurar funnel: Landing → Scroll 50% → CTA click → WhatsApp/Form → Submit
- Form analytics en `CotizacionForm` y formularios legacy

### Paso 5: Mobile en páginas de captación

Revisar específicamente desde perspectiva de conversión (no solo visual):
- `/equipos` — ¿el CTA es accesible sin scroll excesivo?
- `/servicios` — ¿el formulario es usable en iOS/Android?
- `/contacto` — ¿el form no tiene el bug de zoom en iOS (font-size < 16px)?

---

## Restricciones de ejecución

- NO eliminar WhatsApp como canal — es el canal de conversión real del negocio
- NO cambiar IDs hardcodeados sin verificar que no hay CSS/JS que dependa de ellos
- NO tocar formularios en producción sin probar en staging/preview primero
- NO medir con datos de muestra < 100 sesiones por página (sobreinterpretar)

---

## Dependencias

- FASE 1 cerrada: para que los cambios de formularios vayan en el build correcto
- FASE 5 (accesibilidad) puede correr en paralelo con partes de FASE 4

---

## Estado: PREPARADO — esperando cierre de FASE 1
