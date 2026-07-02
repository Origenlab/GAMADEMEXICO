# Blog — Guía de Mejora Paso a Paso · 2026-07-01

Guía operativa basada en inspección directa del código. Cubre los 8 problemas reales encontrados, ordenados por impacto. Cada paso incluye archivos exactos, comandos y código listo para usar.

---

## Resumen ejecutivo de hallazgos reales

| # | Problema | Artículos afectados | Impacto |
|---|---|---|---|
| 1 | FAQ en frontmatter **nunca se renderiza** — es data fantasma | 74/84 | Crítico |
| 2 | 16 canonicals manuales redundantes (misma URL que auto) | 16/84 | Alto |
| 3 | Campo `tipo` en schema pero 0/84 artículos lo usan | 84/84 | Alto |
| 4 | 4 drafts sin decisión editorial | 4 | Medio |
| 5 | 10 artículos con menos de 750 palabras | 10/84 | Alto |
| 6 | 5 artículos con más de 2300 palabras sin modularizar | 5/84 | Medio |
| 7 | ~6 artículos en categoría semánticamente incorrecta | 6/84 | Medio |
| 8 | Cero componentes Astro reutilizables de contenido | — | Medio |

---

## Paso 1 — Activar el FAQ que ya existe (impacto inmediato en 74 artículos)

### El problema

74 de 84 artículos tienen un bloque `schema: FAQPage` en frontmatter con preguntas y respuestas reales. Pero este campo **no está en el Zod schema de `content.config.ts`** y el template `[slug].astro` **nunca lee `post.data.schema`**. La data existe, nadie la usa.

```yaml
# Ejemplo real en mantenimiento-preventivo-valvulas-contra-incendios-nfpa-25.md
schema:
  - type: "FAQPage"
    questions:
      - q: "¿Cada cuánto se deben inspeccionar las válvulas?"
        a: "NFPA 25: inspección visual semanal..."
```

### 1a — Agregar el campo al schema de Astro

En `src/content.config.ts`, dentro de la colección `blog`, agregar:

```typescript
// Después de noindex: z.boolean().default(false),
schema: z.array(
  z.object({
    type: z.string(),
    headline: z.string().optional(),
    author: z.string().optional(),
    dateModified: z.string().optional(),
    questions: z.array(
      z.object({
        q: z.string(),
        a: z.string(),
      })
    ).optional(),
  })
).optional(),
```

### 1b — Crear el componente BlogFaqBlock.astro

Crear archivo `src/components/blog/BlogFaqBlock.astro`:

```astro
---
interface FaqItem {
  q: string;
  a: string;
}

interface Props {
  items: FaqItem[];
}

const { items } = Astro.props;
---

{items && items.length > 0 && (
  <section class="blog-faq" aria-labelledby="faq-title">
    <h2 id="faq-title">Preguntas Frecuentes</h2>
    <dl class="blog-faq__list">
      {items.map((item) => (
        <div class="blog-faq__item">
          <dt class="blog-faq__question">{item.q}</dt>
          <dd class="blog-faq__answer">{item.a}</dd>
        </div>
      ))}
    </dl>
  </section>
)}

<style>
  .blog-faq {
    margin: var(--spacing-2xl) 0;
    padding: var(--spacing-xl);
    background: var(--color-accent);
    border: 1px solid var(--color-border);
    border-left: 4px solid var(--color-primary);
    border-radius: var(--border-radius);
  }

  .blog-faq h2 {
    margin-top: 0;
    margin-bottom: var(--spacing-lg);
    font-size: 1.375rem;
    color: var(--color-secondary);
  }

  .blog-faq__list {
    display: grid;
    gap: var(--spacing-lg);
  }

  .blog-faq__item {
    border-bottom: 1px solid var(--color-border);
    padding-bottom: var(--spacing-md);
  }

  .blog-faq__item:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .blog-faq__question {
    font-weight: 700;
    font-size: 1rem;
    color: var(--color-secondary);
    margin-bottom: var(--spacing-sm);
    line-height: 1.4;
  }

  .blog-faq__answer {
    margin: 0;
    color: var(--color-text);
    line-height: 1.75;
    font-size: 0.9375rem;
  }
</style>
```

### 1c — Wiring en [slug].astro

En `src/pages/blog/[categoria]/[slug].astro`:

**Paso 1**: Importar el componente (al inicio del bloque de imports):
```astro
import BlogFaqBlock from '../../../components/blog/BlogFaqBlock.astro';
import { buildFAQSchema } from '../../../lib/seo';
```

**Paso 2**: Extraer las FAQ questions del schema del artículo (en el bloque de lógica JS):
```typescript
const faqBlock = post.data.schema?.find((s) => s.type === 'FAQPage');
const faqItems = faqBlock?.questions || [];
const faqSchema = faqItems.length > 0 ? buildFAQSchema(faqItems.map(item => ({ question: item.q, answer: item.a }))) : null;
```

**Paso 3**: Agregar el FAQ schema al array de structured data:
```astro
structuredData={[articleSchema, breadcrumbSchema, ...(faqSchema ? [faqSchema] : [])]}
```

**Paso 4**: Renderizar el componente después del contenido markdown:
```astro
<!-- Contenido markdown -->
<div class="blog-article__content">
  <Content />
</div>

<!-- FAQ Block (si el artículo lo tiene) -->
{faqItems.length > 0 && (
  <BlogFaqBlock items={faqItems} />
)}

<!-- ... resto del template ... -->
```

### Resultado esperado

- 74 artículos muestran un bloque FAQ visible al lector
- 74 artículos inyectan FAQPage schema → elegibilidad para rich results en Google
- Sin tocar ningún .md

---

## Paso 2 — Eliminar canonicals manuales redundantes

### El problema

16 artículos tienen `canonical:` manual en frontmatter. Todos apuntan a la misma URL que el sistema generaría automáticamente. Son ruido y riesgo futuro.

### Artículos afectados

```
equipo-proteccion-personal-bomberos-mexico.md
equipos-contra-incendios-guadalajara-jalisco.md
equipos-contra-incendios-monterrey-nuevo-leon.md
equipos-contra-incendios-queretaro.md
ingenieria-boquillas-contra-incendios-proyectos-industriales.md
lineamientos-mangueras-contra-incendios-empresas-mexico.md
manual-maestro-auditoria-boquillas-contra-incendios.md
manual-tecnico-monitores-contra-incendios-empresas.md
monitores-contra-incendio-tipos-aplicaciones-industriales.md
programa-interno-equipos-contra-incendios-empresas-mexico.md
requisitos-legales-equipos-contra-incendios-mexico-empresas.md
tipos-trajes-combate-incendios-comparativa-tecnica.md
traje-estructural-bombero-guia-completa-mexico.md
trajes-aproximacion-bomberos-industria-petroleo-gas.md
venta-monitores-contra-incendios-mexico.md
venta-trajes-bomberos-mexico-como-elegir-proveedor-certificado.md
```

### Script para eliminar canonicals (verificar primero)

```bash
cd src/content/blog

# Ver qué canonicals existen antes de borrar
grep -h "^canonical:" \
  equipo-proteccion-personal-bomberos-mexico.md \
  equipos-contra-incendios-guadalajara-jalisco.md \
  equipos-contra-incendios-monterrey-nuevo-leon.md \
  equipos-contra-incendios-queretaro.md \
  ingenieria-boquillas-contra-incendios-proyectos-industriales.md \
  lineamientos-mangueras-contra-incendios-empresas-mexico.md \
  manual-tecnico-monitores-contra-incendios-empresas.md \
  monitores-contra-incendio-tipos-aplicaciones-industriales.md \
  programa-interno-equipos-contra-incendios-empresas-mexico.md \
  requisitos-legales-equipos-contra-incendios-mexico-empresas.md \
  tipos-trajes-combate-incendios-comparativa-tecnica.md \
  traje-estructural-bombero-guia-completa-mexico.md \
  trajes-aproximacion-bomberos-industria-petroleo-gas.md \
  venta-trajes-bomberos-mexico-como-elegir-proveedor-certificado.md

# Eliminar la línea canonical de cada archivo
for f in \
  equipo-proteccion-personal-bomberos-mexico.md \
  equipos-contra-incendios-guadalajara-jalisco.md \
  equipos-contra-incendios-monterrey-nuevo-leon.md \
  equipos-contra-incendios-queretaro.md \
  ingenieria-boquillas-contra-incendios-proyectos-industriales.md \
  lineamientos-mangueras-contra-incendios-empresas-mexico.md \
  manual-tecnico-monitores-contra-incendios-empresas.md \
  monitores-contra-incendio-tipos-aplicaciones-industriales.md \
  programa-interno-equipos-contra-incendios-empresas-mexico.md \
  requisitos-legales-equipos-contra-incendios-mexico-empresas.md \
  tipos-trajes-combate-incendios-comparativa-tecnica.md \
  traje-estructural-bombero-guia-completa-mexico.md \
  trajes-aproximacion-bomberos-industria-petroleo-gas.md \
  venta-trajes-bomberos-mexico-como-elegir-proveedor-certificado.md; do
  sed -i '/^canonical:/d' "$f"
  echo "✓ $f"
done
```

> **Nota**: `manual-maestro-auditoria-boquillas-contra-incendios.md` y `venta-monitores-contra-incendios-mexico.md` son drafts — se resuelven en Paso 4.

---

## Paso 3 — Poblar el campo `tipo` en los 84 artículos

### El problema

`tipo` ya existe en el schema como enum válido. Ningún artículo lo usa. Sin él, el sistema no puede segmentar CTAs, priorizar enlazado interno ni gobernar GEO por intención.

### Valores disponibles en el schema

```typescript
tipo: z.enum(['informativo', 'tecnico', 'normativo', 'comercial', 'guia', 'comparativa'])
```

### Mapa de asignación por artículo

Agregar `tipo: "valor"` al frontmatter de cada archivo indicado.

**`tecnico`** — artículos de especificación, cálculo, instalación:
- `calculo-hidraulico-sistemas-contra-incendios-guia-ingenieros.md`
- `diseno-red-hidrantes-privados-nfpa-24-mexico.md`
- `adaptadores-acoplamientos-mangueras-contra-incendios-tipos.md`
- `colectores-distribuidores-agua-incendios-industriales-nfpa.md`
- `conexiones-herrajes-sistemas-contra-incendios-tipos-nfpa.md`
- `conexiones-storz-sistemas-contra-incendios-mexico.md`
- `herrajes-mangueras-gabinetes-contra-incendios.md`
- `presion-trabajo-mangueras-clasificacion-nfpa-1961.md`
- `prueba-hidrostatica-mangueras-contra-incendios-nfpa-1962.md`
- `red-contra-incendios-edificios-altura-nfpa-14-standpipe.md`
- `reduccion-siamesa-toma-bomberos-instalacion-nfpa-14.md`
- `toma-siamesa-fdc-instalacion-mantenimiento-nfpa-mexico.md`
- `valvulas-compuerta-osy-sprinklers-nfpa-13-mexico.md`
- `valvulas-check-sprinklers-nfpa-13-mexico.md`
- `valvula-alarma-rociadores-funcionamiento-prueba-nfpa-25.md`
- `valvulas-control-supervisadas-sistemas-contra-incendios.md`
- `valvulas-diluvio-espuma-industria-petroquimica-nfpa-16.md`
- `valvulas-diluvio-transformadores-electricidad-nfpa-guia.md`
- `hidrantes-contra-incendios-mexico-tipos-instalacion-normas.md`
- `mangueras-ataque-contra-incendios-tipos-uso.md`
- `manguera-forestal-wildland-nfpa-1977-mexico.md`
- `mangueras-millhose-contra-incendios-guia-tecnica-nfpa.md`
- `monitores-contra-incendio-tipos-aplicaciones-industriales.md`
- `manual-tecnico-monitores-contra-incendios-empresas.md`
- `espuma-afff-contra-incendios-aplicaciones-industriales.md`
- `extincion-automatica-cocinas-industriales-ul-300.md`
- `tipos-trajes-combate-incendios-comparativa-tecnica.md`
- `traje-estructural-bombero-guia-completa-mexico.md`
- `trajes-aproximacion-bomberos-industria-petroleo-gas.md`
- `equipo-proteccion-personal-bomberos-mexico.md`
- `rociadores-automaticos-nfpa-13-guia-mexico.md`
- `boquillas-contra-incendios-brigadas-sistemas-fijos.md`
- `estandarizacion-boquillas-contra-incendios-industria.md`
- `gabinetes-manguera-contra-incendios-tipos-normas.md`

**`normativo`** — artículos centrados en cumplimiento legal, NOM, NFPA como ley:
- `normativa-nfpa-valvulas-contra-incendios.md`
- `cumplimiento-legal-boquillas-contra-incendios-mexico-2026.md`
- `cumplir-nom-002-stps-proteccion-incendios-guia-empresas.md`
- `plan-emergencia-contra-incendios-empresa-nom-002-guia.md`
- `requisitos-legales-equipos-contra-incendios-mexico-empresas.md`
- `lineamientos-monitor-contra-incendios-mexico.md`
- `lineamientos-mangueras-contra-incendios-empresas-mexico.md`
- `programa-interno-equipos-contra-incendios-empresas-mexico.md`
- `inspeccion-proteccion-civil-equipos-contra-incendios-empresas-mexico.md`
- `verificacion-proteccion-civil-sin-observaciones-mexico.md`

**`guia`** — artículos de cómo hacer, proceso, pasos:
- `como-elegir-manguera-contra-incendios.md`
- `guia-seleccion-monitores-contra-incendios.md`
- `mantenimiento-preventivo-valvulas-contra-incendios-nfpa-25.md`
- `mantenimiento-gabinetes-mangueras-contra-incendios-checklist.md`
- `mantenimiento-monitores-contra-incendios.md`
- `almacenamiento-mantenimiento-mangueras-incendios-vida-util.md`
- `auditoria-monitores-contra-incendios-empresas-mexico.md`
- `venta-trajes-bomberos-mexico-como-elegir-proveedor-certificado.md`
- `ingenieria-boquillas-contra-incendios-proyectos-industriales.md`
- `empresas-mantenimiento-extintores-proveedores-equipos-certificados.md`

**`comparativa`** — artículos de X vs Y, cuál elegir:
- `diferencia-boquilla-pistola-turbojet-incendios.md`
- `monitor-tipo-corazon-vs-cuello-cisne-comparativa.md`
- `manguera-millhose-vs-blindex-diferencias-aplicaciones.md`
- `detector-humo-calor-sistemas-deteccion-incendios-nfpa-72.md`
- `valvulas-compuerta-globo-angular-cuando-usar.md`

**`informativo`** — artículos de contexto, tendencias, sectores, industria:
- `proteccion-contra-incendios-data-centers-centros-datos-mexico.md`
- `proteccion-contra-incendios-estacionamientos-subterraneos-nfpa.md`
- `proteccion-contra-incendios-hospitales-clinicas-mexico-nfpa.md`
- `proteccion-contra-incendios-naves-industriales-bodegas-mexico.md`
- `seguro-industrial-equipos-contra-incendios-requisitos-aseguradoras.md`
- `mangueras-forestales-guia-tecnica-brigadas-mineria.md`
- `caso-exito-proyecto-red-sistemas-contra-incendios-certificados.md`
- `equipos-contra-incendios-industria-automotriz.md`
- `sistemas-contra-incendios-hoteles-centros-comerciales-nfpa.md`
- `certificaciones-ul-fm-equipos-contra-incendios-importancia.md`
- `reposicion-equipos-contra-incendios-cuando-reemplazar.md`
- `bombas-contra-incendios-seleccion-instalacion-nfpa-20.md`

**`comercial`** — artículos con intención de lead directo / local SEO:
- `equipos-contra-incendios-guadalajara-jalisco.md`
- `equipos-contra-incendios-monterrey-nuevo-leon.md`
- `equipos-contra-incendios-queretaro.md`
- `lga-contra-incendios-equipos-certificados-queretaro.md`
- `licitaciones-gobierno-equipos-contra-incendios-mexico.md`
- `boquillas-contra-incendios-tipos-seleccion-guia.md`

### Cómo aplicar (opción script)

```bash
# Ejemplo: agregar tipo: "tecnico" a un archivo
# SIEMPRE dentro del bloque frontmatter, después de 'categoria:'
sed -i '/^categoria:/a tipo: "tecnico"' archivo.md
```

O editar manualmente en tu editor buscando `categoria:` en cada archivo y agregando `tipo: "valor"` en la línea siguiente.

---

## Paso 4 — Resolver los 4 drafts

Los 4 artículos en `draft: true` bloquean URLs, confunden el índice y ocupan espacio en el inventario.

| Archivo | Problema | Decisión recomendada |
|---|---|---|
| `boquillas-turbo-jet-vs-tipo-pistola-cuando-usar.md` | Duplica a `diferencia-boquilla-pistola-turbojet-incendios.md` | Eliminar o fusionar al artículo existente |
| `manual-maestro-auditoria-boquillas-contra-incendios.md` | 958 palabras, canonical manual, contenido incompleto | Completar y publicar, o eliminar |
| `monitor-contra-incendios-como-elegir-flujo-presion.md` | 765 palabras, duplica a `guia-seleccion-monitores-contra-incendios.md` | Eliminar o fusionar |
| `venta-monitores-contra-incendios-mexico.md` | 2267 palabras, canonical manual — artículo comercial fuerte | Normalizar canonical y publicar |

### Acciones concretas

```bash
cd src/content/blog

# Publicar venta-monitores (quitar draft y canonical):
sed -i 's/^draft: true/draft: false/' venta-monitores-contra-incendios-mexico.md
sed -i '/^canonical:/d' venta-monitores-contra-incendios-mexico.md

# Los otros 3: evaluar antes de eliminar
# Si se elimina: también remover referencias en articulosRelacionados de otros .md
```

---

## Paso 5 — Expandir los artículos más cortos

Artículos con menos de 750 palabras no tienen profundidad suficiente para competir en búsqueda o ser citados por IA.

| Artículo | Palabras actuales | Objetivo |
|---|---|---|
| `normativa-nfpa-valvulas-contra-incendios.md` | 547 | 1,200–1,500 |
| `proteccion-contra-incendios-naves-industriales-bodegas-mexico.md` | 584 | 1,200–1,500 |
| `licitaciones-gobierno-equipos-contra-incendios-mexico.md` | 702 | 1,200–1,400 |
| `seguro-industrial-equipos-contra-incendios-requisitos-aseguradoras.md` | 703 | 1,200–1,400 |
| `mantenimiento-preventivo-valvulas-contra-incendios-nfpa-25.md` | 704 | 1,200–1,500 |
| `plan-emergencia-contra-incendios-empresa-nom-002-guia.md` | 706 | 1,200–1,400 |
| `mantenimiento-gabinetes-mangueras-contra-incendios-checklist.md` | 707 | 1,200–1,500 |
| `proteccion-contra-incendios-data-centers-centros-datos-mexico.md` | 707 | 1,200–1,400 |
| `proteccion-contra-incendios-estacionamientos-subterraneos-nfpa.md` | 709 | 1,200–1,400 |
| `red-contra-incendios-edificios-altura-nfpa-14-standpipe.md` | 709 | 1,200–1,500 |

### Qué agregar en cada artículo corto

Cada expansión debe incluir al menos dos de:
- Respuesta corta al inicio (qué es / cuándo aplica en 2–3 líneas)
- Tabla comparativa o de criterios
- Checklist de verificación
- Sección de errores comunes
- Norma aplicable + consecuencia de no cumplir
- FAQ de 3 preguntas (dentro del bloque `schema: FAQPage` en frontmatter)

---

## Paso 6 — Modularizar los artículos más largos

Artículos con más de 2,300 palabras sin jerarquía clara son difíciles de escanear para humanos y para IA.

| Artículo | Palabras | Acción |
|---|---|---|
| `trajes-aproximacion-bomberos-industria-petroleo-gas.md` | 2,613 | Dividir en secciones H2 con anchor links |
| `guia-seleccion-monitores-contra-incendios.md` | 2,604 | Agregar tabla de decisión rápida al inicio |
| `hidrantes-contra-incendios-mexico-tipos-instalacion-normas.md` | 2,491 | Modularizar por tipo de hidrante |
| `equipo-proteccion-personal-bomberos-mexico.md` | 2,411 | Agregar resumen ejecutivo + índice visible |
| `valvulas-diluvio-espuma-industria-petroquimica-nfpa-16.md` | 2,395 | Podar repeticiones, consolidar criterios |

### Estructura recomendada para artículos largos

```markdown
## Resumen rápido
[3–4 líneas con la respuesta directa]

## Tabla de decisión
[Comparativa o matriz en formato tabla]

## [Sección 1 — H2 concreto]
...

## [Sección 2 — H2 concreto]
...

## Errores comunes
...

## Norma aplicable
...
```

---

## Paso 7 — Reclasificar artículos mal ubicados

Estos artículos están en una categoría que debilita su cluster semántico.

| Artículo | Categoría actual | Categoría correcta | Acción |
|---|---|---|---|
| `bombas-contra-incendios-seleccion-instalacion-nfpa-20.md` | `valvulas` | `gabinetes-hidrantes` o nueva categoría | Cambiar `categoria:` en frontmatter |
| `detector-humo-calor-sistemas-deteccion-incendios-nfpa-72.md` | `monitores` | `equipos-contra-incendios` | Cambiar `categoria:` |
| `equipos-contra-incendios-industria-automotriz.md` | `mangueras` | `equipos-contra-incendios` | Cambiar `categoria:` |
| `plan-emergencia-contra-incendios-empresa-nom-002-guia.md` | `mangueras` | `gabinetes-hidrantes` | Cambiar `categoria:` |
| `proteccion-contra-incendios-data-centers-centros-datos-mexico.md` | `valvulas` | `equipos-contra-incendios` | Cambiar `categoria:` |
| `empresas-mantenimiento-extintores-proveedores-equipos-certificados.md` | `monitores` | `equipos-contra-incendios` | Cambiar `categoria:` |

### Cómo cambiar categoría sin romper URLs

La URL del artículo depende de `CATEGORY_SLUGS[post.data.categoria]` + el filename. Cambiar `categoria:` cambia la URL del artículo. **Antes de cambiar**, verificar si la URL vieja tiene tráfico o backlinks. Si sí: agregar redirect en `astro.config.mjs`:

```javascript
// En astro.config.mjs, dentro de redirects:
'/blog/valvulas/bombas-contra-incendios-seleccion-instalacion-nfpa-20': '/blog/gabinetes-hidrantes/bombas-contra-incendios-seleccion-instalacion-nfpa-20',
```

---

## Paso 8 — Crear componentes Astro reutilizables

Una vez que el Paso 1 está funcionando (BlogFaqBlock), los siguientes componentes amplían el sistema.

### BlogQuickAnswer.astro

Para respuesta directa al inicio de artículos informativos y guías.

```astro
---
interface Props {
  pregunta: string;
  respuesta: string;
}
const { pregunta, respuesta } = Astro.props;
---

<div class="blog-quick-answer">
  <p class="blog-quick-answer__label">Respuesta rápida</p>
  <p class="blog-quick-answer__question">{pregunta}</p>
  <p class="blog-quick-answer__answer">{respuesta}</p>
</div>

<style>
  .blog-quick-answer {
    padding: var(--spacing-lg);
    background: linear-gradient(135deg, var(--color-accent), white);
    border: 2px solid var(--color-primary);
    border-radius: var(--border-radius);
    margin-bottom: var(--spacing-xl);
  }
  .blog-quick-answer__label {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--color-primary);
    letter-spacing: 1px;
    margin: 0 0 0.5rem;
  }
  .blog-quick-answer__question {
    font-weight: 700;
    color: var(--color-secondary);
    margin: 0 0 0.75rem;
    font-size: 1.125rem;
  }
  .blog-quick-answer__answer {
    margin: 0;
    color: var(--color-text);
    line-height: 1.7;
  }
</style>
```

### BlogNormativeBox.astro

Para artículos normativos — caja de "norma aplicable".

```astro
---
interface Props {
  norma: string;      // e.g. "NFPA 25 · NOM-002-STPS-2010"
  obliga: string;     // qué obliga hacer
  consecuencia: string; // qué pasa si no cumples
}
const { norma, obliga, consecuencia } = Astro.props;
---

<aside class="blog-normative">
  <p class="blog-normative__label">Marco normativo</p>
  <p class="blog-normative__norm"><strong>{norma}</strong></p>
  <p><strong>Obliga a:</strong> {obliga}</p>
  <p><strong>Riesgo de incumplimiento:</strong> {consecuencia}</p>
</aside>

<style>
  .blog-normative {
    padding: var(--spacing-lg);
    background: #fff8e6;
    border: 1px solid #f0c040;
    border-left: 4px solid #d4a000;
    border-radius: var(--border-radius);
    margin: var(--spacing-xl) 0;
  }
  .blog-normative__label {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    color: #8a6400;
    letter-spacing: 1px;
    margin: 0 0 0.25rem;
  }
  .blog-normative__norm {
    font-size: 1.0625rem;
    color: var(--color-secondary);
    margin: 0 0 0.75rem;
  }
</style>
```

### Cómo usar componentes en MDX (futuro)

Si eventualmente se migra un artículo a `.mdx`:

```mdx
import BlogQuickAnswer from '../../../components/blog/BlogQuickAnswer.astro';
import BlogNormativeBox from '../../../components/blog/BlogNormativeBox.astro';

<BlogQuickAnswer
  pregunta="¿Cada cuánto se inspecciona una válvula contra incendios?"
  respuesta="NFPA 25 establece inspección visual semanal y operación anual completa."
/>
```

Por ahora, estos componentes también pueden usarse condicionalmente desde el template `[slug].astro` leyendo campos del frontmatter.

---

## Orden de ejecución recomendado

| Prioridad | Paso | Esfuerzo | Impacto |
|---|---|---|---|
| 1 | Paso 1: Activar FAQ rendering | ~2h (código) | 74 artículos, rich results |
| 2 | Paso 2: Eliminar 16 canonicals | ~15 min (script) | Limpieza inmediata |
| 3 | Paso 4: Resolver 4 drafts | ~1h (editorial) | Claridad del índice |
| 4 | Paso 3: Poblar `tipo` en 84 artículos | ~2h (edición masiva) | Gobierno editorial |
| 5 | Paso 7: Reclasificar 6 artículos | ~1h (con redirects) | Taxonomía limpia |
| 6 | Paso 5: Expandir 10 artículos cortos | ~8–12h (contenido) | Profundidad SEO |
| 7 | Paso 6: Modularizar 5 artículos largos | ~4–6h (edición) | Escaneo GEO |
| 8 | Paso 8: Componentes Astro adicionales | ~3h (código) | Escalabilidad |

**Tiempo total estimado**: 3–4 semanas trabajando en sprints de 2–3 horas.

---

## Referencias internas

- `[[BLOG-Auditoria-SEO-GEO-Marketing-2026-07-01]]`
- `[[../FASE-2-Metadatos-SEO-2026-07-01]]`
- `[[../FASE-3-Schema-Audit-2026-07-01]]`
