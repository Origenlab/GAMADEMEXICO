# Plantilla Maestra de Artículo - Blog Gama de México

Usa esta plantilla para crear nuevos artículos y mantener consistencia en:
- Schema de Astro Content Collections
- Integración de cards del blog
- URLs por categoría
- SEO on-page

## 1) Crear archivo nuevo

Crear el artículo en:

`src/content/blog/nombre-del-articulo-en-kebab-case.md`

Ejemplo:

`src/content/blog/guia-seleccion-gabinetes-hidrantes.md`

## 2) Frontmatter base (copiar y editar)

```yaml
---
title: "Título SEO del artículo entre 20 y 70 caracteres"
description: "Descripción meta entre 80 y 165 caracteres con keyword principal y valor técnico."
fecha: "2026-02-16"
fechaActualizacion: "2026-02-16"
categoria: "mangueras"
autor:
  nombre: "Ing. Nombre Apellido"
  cargo: "Especialista en Protección Contra Incendios"
imagen: "/img/mangueras-contra-incendios/imagen-principal.avif"
imagenAlt: "Descripción clara y técnica de la imagen principal"
imagenOg: "/img/mangueras-contra-incendios/imagen-og-1200x630.avif"
tags: ["keyword principal", "keyword secundaria", "NFPA", "NOM", "equipos contra incendios"]
destacado: false
draft: false
tiempoLectura: 14
productosRelacionados: ["slug-producto-1", "slug-producto-2", "slug-producto-3"]
articulosRelacionados: ["slug-articulo-1", "slug-articulo-2"]
canonical: "https://gamademexico.com/blog/mangueras-contra-incendios/nombre-del-articulo-en-kebab-case"
noindex: false
---
```

## 3) Categorías válidas (usar valor exacto)

- `monitores`
- `boquillas`
- `mangueras`
- `valvulas`
- `conexiones-herrajes`
- `gabinetes-hidrantes`

## 4) Estructura recomendada del contenido (copiar y completar)

```markdown
Párrafo de introducción amplio con contexto técnico, problema real y objetivo del artículo.

Segundo párrafo de introducción con enfoque en normatividad, aplicación y criterio de selección.

---

## Fundamentos Técnicos de [TEMA PRINCIPAL]

### Qué es [TEMA] y por qué es crítico

Desarrollo técnico con lenguaje profesional y enfoque práctico.

### Errores comunes al seleccionar [TEMA]

Lista de errores frecuentes y su impacto operativo/normativo.

---

## Tipos de [TEMA]: Comparativa Técnica

### Tipo 1: [NOMBRE]

Descripción técnica, aplicación ideal y limitaciones.

| Especificación | Valor |
|----------------|-------|
| Material | |
| Presión de trabajo | |
| Rango de caudal | |
| Norma aplicable | |

### Tipo 2: [NOMBRE]

Descripción técnica, aplicación ideal y limitaciones.

| Especificación | Valor |
|----------------|-------|
| Material | |
| Presión de trabajo | |
| Rango de caudal | |
| Norma aplicable | |

---

## Criterios de Selección para [APLICACIÓN]

### 1. Clasificación de riesgo

Explicar bajo/medio/alto/especial y su impacto en la selección.

### 2. Compatibilidad hidráulica y conexiones

Incluir roscas, diámetros, pérdidas de carga y compatibilidad.

### 3. Condiciones de instalación y ambiente

Temperatura, corrosión, químicos, vibración, mantenimiento.

| Escenario | Requisito técnico | Recomendación |
|-----------|-------------------|---------------|
| Comercial | | |
| Industrial | | |
| Alto riesgo | | |

---

## Normatividad Aplicable

### NFPA relacionada

Resumen de requisitos clave aplicables al tema.

### NOM relacionada

Resumen de cumplimiento en México.

### Recomendaciones de auditoría

Checklist breve de verificación documental y técnica.

---

## Distribución Nacional: Cobertura en Toda la República

### Envíos a todo México

Texto de cobertura logística por zonas (Norte, Centro, Sur/Golfo, Sureste) y tiempos de entrega.

### Atención a proyectos especiales

- Evaluación técnica por nivel de riesgo
- Especificación de equipos por norma
- Plan de suministro por fases
- Soporte para documentación de cumplimiento

---

## Preguntas Frecuentes Sobre [TEMA]

### ¿Pregunta frecuente 1?

Respuesta técnica clara de 2-4 oraciones.

### ¿Pregunta frecuente 2?

Respuesta técnica clara de 2-4 oraciones.

### ¿Pregunta frecuente 3?

Respuesta técnica clara de 2-4 oraciones.

### ¿Pregunta frecuente 4?

Respuesta técnica clara de 2-4 oraciones.

---

## Conclusión

Cierre técnico + recomendación + llamada a acción de asesoría.

---

## Productos Destacados

### [Categoría principal]
- [Producto 1](/ruta-interna) - Beneficio técnico
- [Producto 2](/ruta-interna) - Beneficio técnico
- [Producto 3](/ruta-interna) - Beneficio técnico

### Equipos complementarios
- [Categoría complementaria 1](/ruta-interna)
- [Categoría complementaria 2](/ruta-interna)
- [Categoría complementaria 3](/ruta-interna)
```

## 5) Reglas rápidas para que sí se vea bien en cards

- `title` y `description` son lo que muestra la card en listado.
- `imagen` se usa como fondo de card y portada del artículo.
- `categoria` define la URL pública: `/blog/[categoria-url]/[slug-archivo]`.
- `draft: false` para publicar; `draft: true` para ocultarlo.
- `destacado: true` para que pueda entrar a la sección destacada del index.
- Si no defines `tiempoLectura`, el sistema lo calcula automáticamente.

## 6) Checklist antes de publicar

- Frontmatter válido (title/description/fecha/categoria).
- Imagen existe físicamente en `public/img/...`.
- Enlaces internos correctos y útiles.
- Jerarquía de encabezados correcta (`##`, `###`, `####`).
- Mínimo 4 FAQs.
- Build sin errores:

```bash
npm run build
```
