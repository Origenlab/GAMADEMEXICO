# FASE 2 — Titles, Meta Descriptions y Metadatos (Preparación)
**Fecha prep:** 2026-07-01  
**Estado:** PENDIENTE — iniciar solo después de que FASE 1 esté verificada en producción  
**Prerequisito:** DNS apuntando a CF Pages, AI Scrape Shield deshabilitado, build validado

---

## Por qué no iniciar antes

Los titles y descriptions en producción son del build del 15 Jun. No tiene sentido auditar el HTML final si el sitio no sirve el código actual. Primero cierra FASE 1, valida que la producción sirve el build correcto, y luego audita metadatos contra el HTML real.

---

## Contexto confirmado (no negociable)

- No anteponer "Gama de México" al inicio de los titles
- Priorizar: intención de búsqueda > categoría/producto > certificación > contexto
- No repetir el title en la description
- Descriptions deben ayudar al clic y responder intención del usuario
- Las 58 titles de productos ya fueron reescritas en auditoría previa — revisar si siguen vigentes

---

## Páginas a auditar (en orden de prioridad)

### P1 — Páginas con mayor tráfico o riesgo de truncado

| URL | Tipo | Auditado con HTML final |
|---|---|---|
| `/` | Home | ❌ Pendiente FASE 1 |
| `/equipos` | Hub categorías | ❌ |
| `/monitores-contra-incendios` | Categoría L1 | ❌ |
| `/boquillas-contra-incendios` | Categoría L1 | ❌ |
| `/mangueras-contra-incendios` | Categoría L1 | ❌ |
| `/valvulas-contra-incendios` | Categoría L1 | ❌ |
| `/conexiones-herrajes-contra-incendios` | Categoría L1 | ❌ |
| `/gabinetes-hidrantes-contra-incendios` | Categoría L1 | ❌ |
| `/contacto` | Conversión | ❌ |
| `/servicios` | Servicios | ❌ |

### P2 — Blog (muestra representativa)

Los 10 artículos más importantes por tráfico o posicionamiento potencial.

### P3 — Productos (muestra)

Verificar que los 58 títulos reescritos en auditoría previa siguen correctamente en el build actual.

---

## Criterios de corrección de titles

```
Formato: [Keyword principal] | Gama de México
Longitud: 50-70 caracteres
NO: "Gama de México | Monitores Contra Incendios" (marca al inicio)
SÍ: "Monitores Contra Incendios UL Listed | Gama de México"
SÍ: "Boquillas Tipo Pistola Certificadas | Elkhart Brass México"
```

**Casos especiales:**
- Home: no necesita " | Gama de México" — ya es suficientemente distintivo
- Blog: title debe reflejar el beneficio/aprendizaje, no solo el tema
- Productos: incluir modelo, marca y certificación cuando quepan

---

## Criterios de corrección de descriptions

```
Longitud: 140-160 caracteres
Debe incluir: beneficio primario + call to action implícito o diferenciador
NO: repetir el title
NO: genéricas ("En Gama de México encontrarás los mejores equipos...")
SÍ: "Monitores UL Listed para protección perimetral en industria pesada. Stock en CDMX y QRO. Cotización en 24h."
```

---

## Entregable esperado de FASE 2

Archivo de cambios por URL con:
- URL
- Title actual (en HTML real)
- Title propuesto
- Description actual
- Description propuesta
- Justificación (1 línea)

Implementación en los archivos fuente correspondientes (.astro o .md según aplique).

---

## Estado: PREPARADO — esperando cierre de FASE 1
