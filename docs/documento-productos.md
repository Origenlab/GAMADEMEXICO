# Documento de Referencia: Páginas de Producto
## Gama de México - Guía de Estructura, Diseño y Contenido

**Versión:** 1.0
**Última actualización:** Febrero 2026
**Template de referencia:** `/productos/monitor-tipo-corazon`

---

## Índice

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Arquitectura de Archivos](#2-arquitectura-de-archivos)
3. [Estructura del Archivo Markdown](#3-estructura-del-archivo-markdown)
4. [Anatomía de la Página de Producto](#4-anatomía-de-la-página-de-producto)
5. [Guía de Redacción SEO](#5-guía-de-redacción-seo)
6. [Especificaciones de Imágenes](#6-especificaciones-de-imágenes)
7. [Categorías Disponibles](#7-categorías-disponibles)
8. [Checklist de Creación](#8-checklist-de-creación)
9. [Ejemplos por Categoría](#9-ejemplos-por-categoría)
10. [Errores Comunes a Evitar](#10-errores-comunes-a-evitar)

---

## 1. Resumen Ejecutivo

Las páginas de producto son generadas dinámicamente desde archivos Markdown ubicados en `src/content/productos/`. El template `[...slug].astro` renderiza automáticamente cada producto con:

- **Hero Section**: Imagen + info básica + CTAs
- **Detalles del Producto**: Contenido Markdown + Sidebar técnico
- **Productos Relacionados**: 3 productos de la misma categoría
- **Formulario de Cotización**: Homologado con páginas de categoría

**URL resultante:** `https://gamademexico.com/productos/[nombre-archivo]`

---

## 2. Arquitectura de Archivos

```
src/
├── content/
│   └── productos/
│       ├── monitor-tipo-corazon.md      ← Archivo del producto
│       ├── manguera-millhose.md
│       ├── valvula-compuerta-osy.md
│       └── [nombre-producto].md
│
├── pages/
│   └── productos/
│       └── [...slug].astro              ← Template (NO MODIFICAR)
│
└── public/
    └── img/
        └── productos/
            ├── monitor-corazon.jpg      ← Imagen del producto
            └── [nombre-imagen].jpg
```

### Convención de Nombres de Archivo

| Tipo | Formato | Ejemplo |
|------|---------|---------|
| Archivo MD | `nombre-producto.md` | `monitor-tipo-corazon.md` |
| Imagen | `nombre-producto.jpg` | `monitor-corazon.jpg` |
| URL final | `/productos/nombre-producto` | `/productos/monitor-tipo-corazon` |

**Reglas:**
- Solo letras minúsculas, números y guiones
- Sin acentos, ñ, espacios ni caracteres especiales
- Máximo 50 caracteres
- Descriptivo pero conciso

---

## 3. Estructura del Archivo Markdown

### 3.1 Frontmatter (Metadatos YAML)

```yaml
---
title: "Monitor Tipo Corazón"
description: "Monitor contra incendios tipo corazón Elkhart Brass para protección perimetral fija. Serie Copperhead 8593, caudal hasta 1,250 GPM, rotación 360°, construcción en bronce forjado."
categoria: "monitores"
imagen: "/img/productos/monitor-corazon.jpg"
certificaciones: ["UL Listed", "NOM-002-STPS-2010"]
flujo: "Hasta 1,250 GPM"
material: "Bronce forjado"
marca: "Elkhart Brass"
destacado: true
orden: 1
---
```

### 3.2 Campos del Frontmatter

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `title` | String | ✅ Sí | Nombre comercial del producto (50-70 caracteres) |
| `description` | String | ✅ Sí | Meta description SEO (150-160 caracteres) |
| `categoria` | String | ✅ Sí | ID de categoría (ver sección 7) |
| `imagen` | String | ⚠️ Recomendado | Ruta a imagen principal |
| `certificaciones` | Array | ⚠️ Recomendado | Lista de certificaciones |
| `flujo` | String | Opcional | Caudal o presión de trabajo |
| `material` | String | Opcional | Material principal de construcción |
| `marca` | String | ✅ Sí | Marca del fabricante |
| `destacado` | Boolean | Opcional | Si es producto destacado |
| `orden` | Number | ✅ Sí | Orden en listados (1 = primero) |

### 3.3 Cuerpo del Contenido (Markdown)

```markdown
El monitor tipo corazón es el estándar de la industria para protección perimetral fija en instalaciones de alto riesgo. Su nombre proviene de la forma característica de la base, que permite rotación horizontal de 360° y ajuste vertical para dirigir el chorro con precisión.

## Características principales

- Caudal: hasta 1,250 GPM
- Presión de trabajo: 200 a 300 PSI
- Rotación: 360° horizontal y ajuste vertical de -45° a +90°
- Construcción: bronce forjado (no fundido)
- Entradas: 2.5" y 3" NPT/NH con opciones de conexión bridada
- Marca: Elkhart Brass (Serie Copperhead 8593)

## Materiales disponibles

- Bronce forjado
- Bronce marino
- Acero inoxidable
- Aluminio Elk-O-Lite

## Aplicaciones

- Refinerías
- Terminales de almacenamiento
- Plantas químicas
- Muelles
- Naves industriales de gran superficie

## Certificaciones

Este monitor cuenta con certificación **UL Listed** y es compatible con la normativa **NOM-002-STPS-2010**, garantizando su desempeño bajo las normas más exigentes.
```

---

## 4. Anatomía de la Página de Producto

### 4.1 Secciones de la Página

```
┌─────────────────────────────────────────────────────────────┐
│ BREADCRUMB                                                   │
│ Inicio > Equipos > Monitores > Monitor Tipo Corazón         │
├─────────────────────────────────────────────────────────────┤
│ PRODUCT HERO                                                 │
│ ┌─────────────────┬─────────────────────────────────────┐   │
│ │                 │ MONITORES CONTRA INCENDIOS          │   │
│ │    [IMAGEN]     │ Monitor Tipo Corazón                │   │
│ │                 │ Meta description...                 │   │
│ │  [Destacado]    │ ┌─────────────────────────────┐    │   │
│ │                 │ │ Material │ Bronce forjado   │    │   │
│ │                 │ │ Flujo    │ 1,250 GPM       │    │   │
│ │                 │ │ Marca    │ Elkhart Brass   │    │   │
│ │                 │ │ Certs    │ [UL] [NOM]      │    │   │
│ │                 │ └─────────────────────────────┘    │   │
│ │                 │ [Cotizar] [WhatsApp]               │   │
│ └─────────────────┴─────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│ PRODUCT DETAILS (max-width: 1400px)                         │
│ ┌─────────────────────────────────┬─────────────────────┐   │
│ │ CONTENIDO PRINCIPAL             │ SIDEBAR (380px)     │   │
│ │                                 │                     │   │
│ │ Párrafo introductorio...        │ ┌─────────────────┐ │   │
│ │                                 │ │ FICHA TÉCNICA   │ │   │
│ │ ## Características principales  │ │ Caudal: X GPM   │ │   │
│ │ - Item 1                        │ │ Material: X     │ │   │
│ │ - Item 2                        │ │ Marca: X        │ │   │
│ │ - Item 3                        │ └─────────────────┘ │   │
│ │                                 │                     │   │
│ │ ## Materiales disponibles       │ ┌─────────────────┐ │   │
│ │ - Material 1                    │ │ CERTIFICACIONES │ │   │
│ │ - Material 2                    │ │ ✓ UL Listed     │ │   │
│ │                                 │ │ ✓ NOM-002       │ │   │
│ │ ## Aplicaciones                 │ └─────────────────┘ │   │
│ │ - Aplicación 1                  │                     │   │
│ │ - Aplicación 2                  │ ┌─────────────────┐ │   │
│ │                                 │ │ INCLUYE         │ │   │
│ │ ## Certificaciones              │ │ • Garantía      │ │   │
│ │ Texto sobre certificaciones...  │ │ • Asesoría      │ │   │
│ │                                 │ │ • Refacciones   │ │   │
│ │                                 │ │ • Envío         │ │   │
│ │                                 │ └─────────────────┘ │   │
│ │                                 │                     │   │
│ │                                 │ ┌─────────────────┐ │   │
│ │                                 │ │ CTA SIDEBAR     │ │   │
│ │                                 │ │ [Cotización]    │ │   │
│ │                                 │ │ [WhatsApp]      │ │   │
│ │                                 │ └─────────────────┘ │   │
│ └─────────────────────────────────┴─────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│ PRODUCTOS RELACIONADOS                                       │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐                        │
│ │ Prod 1  │ │ Prod 2  │ │ Prod 3  │                        │
│ └─────────┘ └─────────┘ └─────────┘                        │
│           [Ver todos los monitores]                          │
├─────────────────────────────────────────────────────────────┤
│ LEAD CAPTURE (Formulario de Cotización)                      │
│ Cotiza Monitor Tipo Corazón ahora                           │
│ ✓ Precio en 24h  ✓ Asesoría gratis  ✓ Envíos nacionales    │
│ [Nombre] [Teléfono/Email] [Cantidad] [Enviar por WhatsApp]  │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Comportamiento Responsive

| Viewport | Hero Grid | Details Grid | Sidebar |
|----------|-----------|--------------|---------|
| Desktop (>1024px) | 2 columnas | 1fr + 380px | Sticky |
| Tablet (768-1024px) | 2 columnas | 1fr + 320px | Sticky |
| Mobile (<768px) | 1 columna | 1 columna | Estático |

---

## 5. Guía de Redacción SEO

### 5.1 Título del Producto (`title`)

**Fórmula:** `[Tipo de Producto] + [Especificación Diferenciadora]`

✅ **Correcto:**
- "Monitor Tipo Corazón"
- "Manguera Millhose Doble Forro"
- "Válvula de Compuerta OS&Y"
- "Boquilla Tipo Pistola"

❌ **Incorrecto:**
- "Monitor" (muy genérico)
- "El mejor monitor contra incendios del mercado" (marketing, no técnico)
- "MONITOR TIPO CORAZÓN ELKHART BRASS" (mayúsculas, redundante)

### 5.2 Descripción SEO (`description`)

**Longitud:** 150-160 caracteres
**Fórmula:** `[Producto] + [Marca] + [Uso principal] + [Especificación clave] + [Diferenciador]`

✅ **Ejemplo óptimo (158 caracteres):**
```
Monitor contra incendios tipo corazón Elkhart Brass para protección perimetral fija. Serie Copperhead 8593, caudal hasta 1,250 GPM, rotación 360°.
```

**Elementos a incluir:**
1. Nombre del producto
2. Marca (Elkhart Brass, Kuriyama, etc.)
3. Aplicación principal
4. Especificación técnica clave
5. Característica diferenciadora

### 5.3 Párrafo Introductorio

**Longitud:** 2-3 oraciones (40-60 palabras)
**Propósito:** Contexto + valor + diferenciación

✅ **Ejemplo:**
```markdown
El monitor tipo corazón es el estándar de la industria para protección perimetral fija en instalaciones de alto riesgo. Su nombre proviene de la forma característica de la base, que permite rotación horizontal de 360° y ajuste vertical para dirigir el chorro con precisión.
```

### 5.4 Secciones del Cuerpo

| Sección | Obligatoria | Contenido |
|---------|-------------|-----------|
| `## Características principales` | ✅ Sí | Lista de 5-8 specs técnicas |
| `## Materiales disponibles` | ⚠️ Si aplica | Opciones de material |
| `## Aplicaciones` | ✅ Sí | 4-6 industrias/usos |
| `## Certificaciones` | ⚠️ Si hay | Párrafo explicativo |
| `## Especificaciones adicionales` | Opcional | Detalles técnicos extra |

### 5.5 Keywords a Incluir

Cada producto debe incluir naturalmente:

| Tipo | Ejemplos |
|------|----------|
| **Producto + "contra incendios"** | monitor contra incendios, manguera contra incendios |
| **Marca** | Elkhart Brass, Kuriyama, Key Hose |
| **Certificaciones** | UL Listed, FM, NOM-002-STPS-2010, NFPA |
| **Especificaciones** | GPM, PSI, pulgadas, metros |
| **Comerciales** | venta, precio, cotización, proveedor, México |

---

## 6. Especificaciones de Imágenes

### 6.1 Imagen Principal del Producto

| Propiedad | Valor |
|-----------|-------|
| **Ubicación** | `/public/img/productos/` |
| **Formato** | JPG (fotos) o PNG (renders) |
| **Dimensiones** | 800x600px mínimo |
| **Aspect ratio** | 4:3 recomendado |
| **Tamaño máximo** | 200KB optimizado |
| **Fondo** | Blanco o gris neutro (#f8f9fa) |

### 6.2 Nomenclatura

```
/img/productos/[nombre-descriptivo].jpg
```

**Ejemplos:**
- `/img/productos/monitor-corazon.jpg`
- `/img/productos/manguera-millhose.jpg`
- `/img/productos/valvula-compuerta-osy.jpg`

### 6.3 Si No Hay Imagen

El template muestra automáticamente un placeholder con:
- Icono de imagen
- Texto "Imagen no disponible"

**Acción recomendada:** Siempre subir imagen, aunque sea genérica de categoría.

---

## 7. Categorías Disponibles

### 7.1 IDs de Categoría (para `categoria:` en frontmatter)

| ID | Nombre en UI | URL de Categoría |
|----|--------------|------------------|
| `monitores` | Monitores Contra Incendios | /monitores-contra-incendios |
| `boquillas` | Boquillas Contra Incendios | /boquillas-contra-incendios |
| `mangueras` | Mangueras Contra Incendios | /mangueras-contra-incendios |
| `valvulas` | Válvulas Contra Incendios | /valvulas-contra-incendios |
| `conexiones-herrajes` | Conexiones y Herrajes | /conexiones-herrajes-contra-incendios |
| `gabinetes-hidrantes` | Gabinetes e Hidrantes | /gabinetes-hidrantes-contra-incendios |

### 7.2 Agregar Nueva Categoría

1. Agregar al mapa en `src/pages/productos/[...slug].astro`:

```javascript
const categoriaMapa: Record<string, { url: string; nombre: string }> = {
  // ... categorías existentes
  'nueva-categoria': {
    url: '/nueva-categoria-contra-incendios',
    nombre: 'Nueva Categoría'
  },
};
```

2. Crear página de categoría correspondiente

---

## 8. Checklist de Creación

### 8.1 Antes de Crear el Producto

- [ ] Verificar que no existe un producto similar
- [ ] Tener imagen del producto lista (800x600px, <200KB)
- [ ] Recopilar especificaciones técnicas del fabricante
- [ ] Identificar certificaciones aplicables
- [ ] Definir categoría correcta

### 8.2 Crear Archivo Markdown

- [ ] Crear archivo en `src/content/productos/nombre-producto.md`
- [ ] Completar todos los campos del frontmatter
- [ ] Escribir párrafo introductorio (40-60 palabras)
- [ ] Agregar sección "## Características principales" (5-8 items)
- [ ] Agregar sección "## Aplicaciones" (4-6 items)
- [ ] Agregar secciones opcionales si aplica

### 8.3 Subir Imagen

- [ ] Guardar imagen en `/public/img/productos/`
- [ ] Verificar nombre coincide con ruta en frontmatter
- [ ] Comprobar que carga correctamente

### 8.4 Verificar en Navegador

- [ ] Abrir `http://localhost:4321/productos/nombre-producto`
- [ ] Verificar que carga sin errores
- [ ] Revisar breadcrumb correcto
- [ ] Confirmar imagen visible
- [ ] Probar formulario de cotización
- [ ] Verificar productos relacionados
- [ ] Probar responsive (mobile)

### 8.5 Validación Final

- [ ] Descripción tiene 150-160 caracteres
- [ ] Sin errores de ortografía
- [ ] Keywords naturalmente incluidas
- [ ] Certificaciones correctas
- [ ] Orden numérico asignado

---

## 9. Ejemplos por Categoría

### 9.1 Monitor (Ejemplo Completo)

```yaml
---
title: "Monitor Tipo Corazón"
description: "Monitor contra incendios tipo corazón Elkhart Brass para protección perimetral fija. Serie Copperhead 8593, caudal hasta 1,250 GPM, rotación 360°, construcción en bronce forjado."
categoria: "monitores"
imagen: "/img/productos/monitor-corazon.jpg"
certificaciones: ["UL Listed", "NOM-002-STPS-2010"]
flujo: "Hasta 1,250 GPM"
material: "Bronce forjado"
marca: "Elkhart Brass"
destacado: true
orden: 1
---

El monitor tipo corazón es el estándar de la industria para protección perimetral fija en instalaciones de alto riesgo. Su nombre proviene de la forma característica de la base, que permite rotación horizontal de 360° y ajuste vertical para dirigir el chorro con precisión.

## Características principales

- Caudal: hasta 1,250 GPM
- Presión de trabajo: 200 a 300 PSI
- Rotación: 360° horizontal y ajuste vertical de -45° a +90°
- Construcción: bronce forjado (no fundido)
- Entradas: 2.5" y 3" NPT/NH con opciones de conexión bridada
- Marca: Elkhart Brass (Serie Copperhead 8593)

## Materiales disponibles

- Bronce forjado
- Bronce marino
- Acero inoxidable
- Aluminio Elk-O-Lite

## Aplicaciones

- Refinerías
- Terminales de almacenamiento
- Plantas químicas
- Muelles
- Naves industriales de gran superficie

## Certificaciones

Este monitor cuenta con certificación **UL Listed** y es compatible con la normativa **NOM-002-STPS-2010**, garantizando su desempeño bajo las normas más exigentes.
```

### 9.2 Manguera (Ejemplo)

```yaml
---
title: "Manguera Millhose Doble Forro"
description: "Manguera contra incendios de doble forro poliéster con revestimiento EPDM. Presión de trabajo 300 PSI, diámetros 1.5\" y 2.5\", certificada NFPA 1961."
categoria: "mangueras"
imagen: "/img/productos/manguera-millhose.jpg"
certificaciones: ["NFPA 1961", "NOM-002-STPS-2010"]
flujo: "300 PSI trabajo"
material: "Poliéster doble forro / EPDM"
marca: "Elkhart Brass"
destacado: true
orden: 1
---
```

### 9.3 Válvula (Ejemplo)

```yaml
---
title: "Válvula de Compuerta OS&Y"
description: "Válvula de compuerta OS&Y para aislamiento en líneas principales de sistemas contra incendios. Indicación visual de posición. Presión 175-350 PSI. Certificada UL/FM."
categoria: "valvulas"
imagen: "/img/productos/valvula-compuerta-osy.jpg"
certificaciones: ["UL 262", "FM 1120/1130", "NOM-002-STPS-2010"]
flujo: "175-350 PSI trabajo"
material: "Hierro dúctil GJS500 / Bronce"
marca: "Elkhart Brass"
destacado: true
orden: 1
---
```

---

## 10. Errores Comunes a Evitar

### 10.1 Errores de Frontmatter

| Error | Problema | Solución |
|-------|----------|----------|
| `categoria: Monitores` | Mayúscula, no coincide | Usar `monitores` (minúscula) |
| `certificaciones: UL Listed` | No es array | Usar `["UL Listed"]` |
| `imagen: img/productos/...` | Falta slash inicial | Usar `/img/productos/...` |
| `orden: uno` | Texto en vez de número | Usar `orden: 1` |

### 10.2 Errores de Contenido

| Error | Problema | Solución |
|-------|----------|----------|
| Solo 1 párrafo | Contenido insuficiente | Mínimo 4 secciones H2 |
| Sin listas | Difícil de escanear | Usar listas con guiones |
| Copiar description en intro | Contenido duplicado | Escribir contenido único |
| H1 en contenido | Ya existe en template | Empezar con párrafo, luego H2 |

### 10.3 Errores de SEO

| Error | Problema | Solución |
|-------|----------|----------|
| Description > 160 chars | Se corta en Google | Editar a 150-160 caracteres |
| Sin keywords | No rankea | Incluir producto + contra incendios |
| Sin marca | Pierde búsquedas branded | Incluir Elkhart Brass, etc. |
| Sin certificaciones | Pierde confianza | Listar UL, FM, NOM, NFPA |

### 10.4 Errores de Imagen

| Error | Problema | Solución |
|-------|----------|----------|
| Imagen > 500KB | Página lenta | Optimizar a <200KB |
| Formato incorrecto | No carga | Usar JPG o PNG |
| Nombre con espacios | URL rota | Usar guiones: `monitor-corazon.jpg` |
| Dimensiones pequeñas | Se ve pixelada | Mínimo 800x600px |

---

## Anexo: Template Rápido para Copiar

```yaml
---
title: ""
description: ""
categoria: ""
imagen: "/img/productos/.jpg"
certificaciones: ["", ""]
flujo: ""
material: ""
marca: "Elkhart Brass"
destacado: false
orden: 1
---

[Párrafo introductorio de 40-60 palabras describiendo el producto, su uso principal y característica diferenciadora.]

## Características principales

-
-
-
-
-

## Materiales disponibles

-
-
-

## Aplicaciones

-
-
-
-

## Certificaciones

Este producto cuenta con certificación **[CERT]** y es compatible con la normativa **NOM-002-STPS-2010**, garantizando su desempeño bajo las normas más exigentes.
```

---

**Documento creado por:** Claude Code
**Para:** Equipo de desarrollo Gama de México
**Referencia técnica:** `src/pages/productos/[...slug].astro`
