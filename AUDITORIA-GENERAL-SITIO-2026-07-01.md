# Auditoría General del Sitio Gama de México

Fecha: 2026-07-01

Alcance revisado:
- `src/pages`
- `src/layouts`
- `src/components`
- `src/content`
- `public`
- `astro.config.mjs`
- `package.json`
- `tsconfig.json`
- estilos globales y por página
- helpers de SEO, imágenes, navegación y breadcrumbs

Nota operativa:
- No fue posible ejecutar `astro check` ni `astro build` porque el repositorio no tiene `node_modules` instalado en este entorno. `npm run check` y `npm run build` fallan con `sh: astro: command not found`, aunque sí existe `package-lock.json`.

## 1. Resumen ejecutivo

El sitio tiene una base fuerte en contenido comercial, cobertura SEO por categorías, uso extensivo de Astro Content Collections y una intención clara de captación B2B. La mayor oportunidad está en consolidar arquitectura y eliminar deuda de implementación manual que hoy afecta mantenibilidad, consistencia SEO, rendimiento percibido y velocidad para iterar.

Lo mejor del proyecto:
- Buen volumen de contenido indexable: 84 posts, 225 productos y rutas dinámicas relevantes.
- Refactor exitoso de subcategorías a una ruta dinámica tipada en `src/pages/[seccion]/[subcategoria].astro`.
- Uso de schemas, sitemap, rutas temáticas y enlazado contextual con orientación comercial.

Los principales problemas:
- Inconsistencia de URLs canónicas en blog.
- Scripts globales y reescritura de imágenes en runtime dentro del layout base.
- Duplicación manual de formularios, breadcrumbs y bloques de SEO.
- Mezcla de arquitectura nueva y antigua.
- Activos editoriales y documentación interna desalineados con el estado real del proyecto.

Impacto potencial de optimizar:
- Mejorar indexación y consolidación de autoridad por categoría.
- Reducir deuda de mantenimiento y tiempo de publicación.
- Mejorar LCP/estabilidad visual en páginas críticas.
- Aumentar conversión al unificar formularios y medir mejor los leads.

## 2. Diagnóstico general

Técnicamente, el sitio está más cerca de una plataforma editorial-comercial hecha a medida que de un Astro minimal. Ya tiene bloques maduros: collections, helpers SEO, navegación centralizada y una estrategia de categorías/subcategorías bien pensada. El problema no es falta de trabajo, sino capas acumuladas.

En SEO técnico, el sitio muestra intención profesional, pero hoy conviven varias taxonomías de URL para blog. Eso fragmenta señales canónicas y complica auditoría futura. El componente SEO centralizado existe, pero el layout base volvió a implementar la misma lógica inline, lo que duplica superficie de error.

En marketing y conversión, la propuesta de valor es clara, el posicionamiento B2B es bueno y el copy vende seguridad, documentación y soporte. Aun así, la captación depende demasiado de WhatsApp sin una capa sólida de instrumentación, CRM o consolidación de formularios.

En UX/UI, el sitio cumple y comunica, pero muchas páginas comerciales repiten estructuras manuales. Eso hace más difícil mejorar mobile, accesibilidad, contenido y tests en bloque.

## 3. Puntuación profesional

| Área | Calificación | Justificación |
|---|---:|---|
| Astro | 7/10 | Buen uso de rutas estáticas, content collections y refactor dinámico de subcategorías, pero persiste mucha implementación manual en páginas comerciales. |
| Arquitectura del proyecto | 6/10 | Hay separación de helpers y datos, pero conviven patrones modernos con duplicación estructural. |
| Código | 6/10 | Claro y legible en general, aunque con duplicación notable, scripts globales y componentes paralelos que resuelven lo mismo. |
| Componentes | 6/10 | Existen piezas reutilizables útiles, pero no se aplican de forma consistente en todo el sitio. |
| Markdown/MDX | 7/10 | Buen volumen y frontmatter robusto, pero con inconsistencias canónicas y metadatos editoriales muertos. |
| SEO técnico | 6/10 | Fuerte intención SEO, pero las canonicals inconsistentes y la duplicación de meta lógica limitan la solidez. |
| Contenido | 8/10 | Cobertura temática amplia, copy especializado y enfoque claro en intención B2B. |
| Performance | 6/10 | Buen uso de compresión e imágenes optimizadas, pero el runtime image rewrite y scripts globales penalizan el arranque. |
| Accesibilidad | 7/10 | Hay semántica, labels y foco razonables; faltan consolidación, pruebas y reducción de patrones manuales. |
| UX/UI | 7/10 | Clara, funcional y comercial, aunque repetitiva en varias plantillas. |
| Marketing | 8/10 | El sitio comunica bien autoridad, cobertura nacional y soporte técnico. |
| Conversión | 7/10 | WhatsApp está muy bien explotado, pero falta captación estructurada y medición más seria de funnels. |
| Escalabilidad | 6/10 | El modelo de contenido escala; la capa de páginas manuales no. |
| Mantenibilidad | 5/10 | Hoy es el punto más débil por duplicación, documentación desactualizada y coexistencia de dos arquitecturas. |

## 4. Problemas críticos

### 4.1 Canonicals inconsistentes en el blog

Problema:
- Las rutas generadas usan slugs SEO largos por categoría, pero varios posts declaran canonicals con categorías cortas o con una taxonomía distinta.

Archivo o sección afectada:
- `src/lib/blogHelpers.ts:27-35`
- `src/content/blog/manual-tecnico-monitores-contra-incendios-empresas.md:18`
- `src/content/blog/lineamientos-monitor-contra-incendios-mexico.md:17`
- `src/content/blog/requisitos-legales-equipos-contra-incendios-mexico-empresas.md:29`

Evidencia:
- `CATEGORY_SLUGS.monitores = monitores-contra-incendios`.
- Un post usa `/blog/monitores-contra-incendios/...`.
- Otro usa `/blog/monitores/...`.
- Otro usa `/blog/gabinetes-hidrantes-contra-incendios/...` mientras la taxonomía interna es `gabinetes-hidrantes`.

Impacto:
- Dilución de señales canónicas.
- Riesgo de URLs huérfanas o redireccionadas.
- Mayor complejidad para GSC, enlazado interno y reporting SEO.

Severidad:
- Alta.

Dificultad de solución:
- Media.

Recomendación:
- Eliminar la canonical manual como regla general y derivarla automáticamente desde la taxonomía interna.
- Permitir override manual solo para excepciones justificadas.

Ejemplo de solución:

```ts
const categorySlug = CATEGORY_SLUGS[post.data.categoria] || post.data.categoria;
const canonical = `${SITE_URL}/blog/${categorySlug}/${post.id}`;
```

### 4.2 Scripts globales en el layout base para todo el sitio

Problema:
- El layout base carga analítica, reescritura de imágenes y script de terceros para todas las páginas.

Archivo o sección afectada:
- `src/layouts/Base.astro:173-210`

Evidencia:
- `Rybbit` en todas las vistas.
- Reescritura de `<img>` en `DOMContentLoaded`.
- `TruConversion` inyectado globalmente desde el layout base.

Impacto:
- Penalización de LCP/INP en páginas donde no aporta valor.
- Mayor complejidad para depurar carga, CSP y privacidad.
- Posibles efectos secundarios visuales al reescribir imágenes después del parse inicial.

Severidad:
- Alta.

Dificultad de solución:
- Media.

Recomendación:
- Mover scripts de terceros a un componente de analítica/marketing condicional.
- Cargar pruebas o tracking solo en landing/comercial si realmente se necesitan allí.
- Evitar mutar `img.src` en runtime cuando ya existe helper de imágenes.

Ejemplo de solución:

```astro
{enableAnalytics && <AnalyticsScripts />}
{enableConversionTracking && <ConversionScripts />}
```

### 4.3 Breadcrumb duplicado en páginas de producto y subcategoría

Problema:
- `Base.astro` ya renderiza `Breadcrumb`, pero algunas páginas vuelven a renderizarlo manualmente.

Archivo o sección afectada:
- `src/layouts/Base.astro:215-217`
- `src/pages/productos/[...slug].astro:170-195`
- `src/pages/[seccion]/[subcategoria].astro:72-93`

Evidencia:
- El layout muestra breadcrumb por defecto.
- Producto y subcategoría insertan `<Breadcrumb />` otra vez.

Impacto:
- Duplicación visual.
- Posible ruido semántico para accesibilidad.
- Comportamiento inconsistente entre plantillas.

Severidad:
- Media.

Dificultad de solución:
- Baja.

Recomendación:
- Mantener una sola estrategia: breadcrumb desde layout o desde página, no ambas.
- Para páginas especiales, usar `showBreadcrumb={false}` en layout si necesitan control manual.

Ejemplo de solución:

```astro
<Layout showBreadcrumb={false} ...>
  <Breadcrumb />
</Layout>
```

### 4.4 Dos sistemas de formularios coexistiendo

Problema:
- El proyecto ya tiene un formulario unificado (`CotizacionForm`), pero siguen existiendo formularios legacy con IDs duros y un handler global separado.

Archivo o sección afectada:
- `src/scripts/main.ts:178-200`
- `src/components/LeadCapture.astro:13-30`
- `src/components/CotizacionForm.astro:46-80`
- Múltiples páginas comerciales con `id="cotizar-form"` manual.

Evidencia:
- Se detectaron 9 formularios con IDs/manualidades repetidas.
- El handler legacy busca `lead-nombre`, `lead-contacto`, `lead-equipo` y `lead-servicio`.
- El formulario nuevo ya usa IDs deterministas por página.

Impacto:
- Mayor costo de mantenimiento.
- Riesgo de divergencia funcional entre páginas.
- Difícil instrumentación de leads y A/B tests.

Severidad:
- Alta.

Dificultad de solución:
- Media.

Recomendación:
- Migrar todas las páginas comerciales a `CotizacionForm`.
- Retirar `LeadCapture` y el submit handler legacy cuando la migración termine.

Ejemplo de solución:

```astro
<CotizacionForm
  titulo="Solicita tu cotización"
  tipoEquipo="Monitores"
  pagina="categoria-monitores"
/>
```

### 4.5 Lógica SEO duplicada y componente SEO sin uso

Problema:
- Existe `src/components/seo/SEO.astro`, pero el layout base duplicó la lógica completa en línea.

Archivo o sección afectada:
- `src/components/seo/SEO.astro:1-104`
- `src/layouts/Base.astro:97-147`

Evidencia:
- El componente SEO está completo.
- No se encontraron usos del componente en `src`.

Impacto:
- Riesgo de divergencia futura.
- Más trabajo para mantener canonicals, OG, Twitter y JSON-LD.

Severidad:
- Media.

Dificultad de solución:
- Baja.

Recomendación:
- Reusar el componente SEO dentro del layout base o eliminarlo si ya no será estándar.

Ejemplo de solución:

```astro
<SEO
  title={title}
  description={metaDescription}
  canonical={canonicalUrl}
  ogImage={ogImage}
  noindex={noindex}
  structuredData={structuredData}
/>
```

### 4.6 Metadatos editoriales presentes pero no validados ni consumidos

Problema:
- Algunos posts incluyen `schema:` en frontmatter, pero el schema de la colección blog no define ese campo.

Archivo o sección afectada:
- `src/content.config.ts:49-120`
- `src/content/blog/lineamientos-monitor-contra-incendios-mexico.md:19-25`
- `src/content/blog/requisitos-legales-equipos-contra-incendios-mexico-empresas.md:1-17`

Evidencia:
- La colección blog no declara `schema`.
- Los posts sí lo incluyen.

Impacto:
- Falsa sensación de control editorial.
- Metadatos muertos.
- Mayor confusión al automatizar contenido.

Severidad:
- Media.

Dificultad de solución:
- Baja.

Recomendación:
- O se agrega `schema` formal al schema Zod y al render, o se elimina del frontmatter.

Ejemplo de solución:

```ts
schema: z.array(z.object({
  type: z.string(),
})).optional()
```

### 4.7 Directorio con contenido publicado que conserva marcador `TODO`

Problema:
- Hay contenido de directorio con texto placeholder visible.

Archivo o sección afectada:
- `src/content/empresas-certificadas/mazda-motor-manufacturing-salamanca.md:89-94`

Evidencia:
- El ASCII contenido incluye `BASE DE TODO`.

Impacto:
- Deterioro de credibilidad editorial.
- Riesgo reputacional si esa página está indexada.

Severidad:
- Media.

Dificultad de solución:
- Baja.

Recomendación:
- Auditar todo `src/content/empresas-certificadas` para detectar placeholders, tablas rotas y texto de trabajo interno.

Ejemplo de solución:
- Limpiar la sección y establecer checklist editorial previo a publicación.

### 4.8 Documentación raíz desactualizada

Problema:
- El `README.md` sigue siendo el del starter kit mínimo y no documenta el proyecto real.

Archivo o sección afectada:
- `README.md:1-43`

Evidencia:
- Habla de un `src/pages/index.astro` mínimo y del starter original.

Impacto:
- Onboarding lento.
- Mayor dependencia de conocimiento tácito.
- Más fricción para CI, QA, marketing y contenido.

Severidad:
- Media.

Dificultad de solución:
- Baja.

Recomendación:
- Reemplazarlo por documentación real del stack, scripts, flujo editorial, variables de entorno y deploy.

Ejemplo de solución:
- Documentar arquitectura de collections, convenciones de slug y uso de CDN.

## 5. Quick wins

- Normalizar todas las canonicals del blog con una sola regla derivada de `CATEGORY_SLUGS`.
- Eliminar breadcrumb duplicado en productos y subcategorías.
- Migrar home/categorías/servicios al componente `CotizacionForm`.
- Reemplazar el `README.md` por documentación real del proyecto.
- Limpiar placeholders y `TODO` en contenido público.
- Convertir scripts de terceros en carga condicional por plantilla.
- Centralizar metas en `SEO.astro` o borrar el duplicado.
- Auditar las 84 canonicals del blog y redirigir cualquier variante corta antigua.

## 6. Auditoría de Astro

Estado general:
- Astro está bien aprovechado en rutas, colecciones y build estático.
- La mejor decisión arquitectónica reciente es la unificación de subcategorías en `src/pages/[seccion]/[subcategoria].astro`.

Evaluación:
- Islands architecture: correcta por omisión; casi no hay hidratación innecesaria.
- Hidratación: bien contenida, pero el JS global sigue siendo demasiado amplio.
- Layouts: `Base.astro` está sobrecargado; mezcla head, scripts, hero, trust y CTAs.
- Componentes: mezcla de reutilización correcta con piezas legacy que ya no deberían seguir.
- Rutas: muy buena estructura comercial.
- Content Collections: sólidas y útiles.
- Imágenes: bien orientadas con helpers, pero sin aprovechar `astro:assets`.
- Integraciones: sitemap bien planteado.
- Build: no validable en este entorno por falta de dependencias instaladas.
- SEO por página: fuerte en intención, irregular en consistencia.
- Reutilización: buena en zonas nuevas, débil en páginas antiguas.
- Separación de responsabilidades: mejorable en layout, formularios y SEO.

Mejoras específicas:

1. Dividir `Base.astro`:
- `BaseHead.astro`
- `BaseShell.astro`
- `AnalyticsScripts.astro`
- `ConversionScripts.astro`

2. Hacer los CTAs por slot o por variante:

```astro
<Layout ctaVariant="none">
  <slot />
</Layout>
```

3. Sustituir reescritura de imágenes en runtime por URLs finales en render:

```astro
<img src={getOptimizedImageUrl(imagen, { width: 1280, quality: 82 })} ... />
```

4. Consolidar formularios en una sola API de componente.

## 7. Auditoría Markdown/MDX

Fortalezas:
- Frontmatter relativamente rico.
- Descripciones y títulos con intención SEO.
- Buen interlinking entre artículos y productos.

Debilidades:
- No se usa `h1` en ningún producto ni post aunque el schema lo permite.
- 84 posts tienen `canonical`, pero no todos siguen la misma convención.
- Hay metadatos no consumidos como `schema`.
- Faltan controles editoriales de calidad final para directorios y piezas largas.

Estructura ideal de frontmatter recomendada:

```yaml
title: ""
h1: ""
description: ""
fecha: "2026-07-01"
fechaActualizacion: "2026-07-01"
categoria: "monitores"
tags: []
autor:
  nombre: ""
  cargo: ""
imagen: "/img/..."
imagenAlt: ""
imagenOg: "/img/..."
destacado: false
draft: false
canonical: ""
noindex: false
tipo: "tecnico"
productosRelacionados: []
articulosRelacionados: []
schema:
  article: true
```

Recomendaciones:
- Hacer `h1` obligatorio en blog si quieren separar SERP title de titular editorial.
- Derivar `canonical` automáticamente.
- Convertir `schema` en un contrato real o eliminarlo.
- Añadir checklist editorial antes de publicar.

## 8. Auditoría SEO

Fortalezas:
- Titles y descriptions generalmente orientados a intención de búsqueda.
- Sitemap configurado y priorizado.
- Robots razonablemente trabajados.
- JSON-LD presente en páginas clave.
- Buen trabajo de hubs por categoría y por blog.

Riesgos prioritarios:
- Canonicals inconsistentes.
- Twitter meta apunta a `@gamademexico`, pero `SOCIAL_MEDIA` está vacío en `src/lib/config.ts:93-102`.
- `sameAs` puede quedar vacío mientras se declaran identidades sociales en meta tags.
- El layout base concentra toda la lógica SEO en vez de delegarla a componente reusable.

Recomendaciones priorizadas:

1. Canonical única por taxonomía.
2. Revisar si las cuentas sociales existen y son correctas antes de seguir publicándolas.
3. Revisar indexabilidad de directorios y filtros en función de calidad real.
4. Añadir validación automatizada para canonicals y slugs.
5. Crear prueba editorial que falle si una URL canónica no coincide con la ruta esperada.

## 9. Auditoría de performance

Fortalezas:
- HTML comprimido.
- CSS minificado.
- Uso de AVIF y de helpers para imágenes.
- La mayoría de imágenes tienen `loading` y `decoding`.

Problemas:
- Reescritura de imágenes en `DOMContentLoaded`.
- Terceros globales en todas las páginas.
- 46 bloques usan fondos/`role="img"` en lugar de imágenes reales optimizables.
- El sitio depende de `public/img` masivo: 1615 archivos.
- No hay uso de `astro:assets` ni `Image`/`Picture`.

Impacto en Core Web Vitals:
- LCP: puede degradarse por swap tardío de `img.src`.
- CLS: puede aparecer si la imagen final difiere del recurso inicial o si hay scripts que alteran el layout.
- INP: el JS global y terceros elevan coste de interacción inicial.
- TTFB: probablemente correcto al ser estático, pero no validado aquí.

Mejoras técnicas concretas:
- Evitar mutación de `src` y `srcset` tras el parse.
- Mover scripts de terceros a páginas con intención de captación.
- Evaluar `astro:assets` para imágenes críticas.
- Reducir fondos CSS decorativos donde realmente deberían existir `img`.

## 10. Auditoría UX/UI y conversión

Fortalezas:
- Mensaje comercial claro.
- Foco B2B bien trabajado.
- WhatsApp muy visible.
- Prueba social y servicios bien conectados al catálogo.

Problemas:
- Exceso de formularios distintos para una misma acción.
- Captación centrada casi exclusivamente en abrir WhatsApp.
- Poca evidencia de medición real de embudo.
- En algunas páginas hay demasiada densidad de copy antes del CTA principal.

Cambios específicos recomendados:
- Unificar CTA principal por tipo de página.
- Añadir variante de formulario con 1 campo en mobile y 3 campos en desktop.
- Medir eventos de scroll, click y submit por tipo de página.
- Añadir una microoferta descargable o consulta técnica para leads fríos.
- Reducir fricción del formulario de contacto mostrando tiempos de respuesta reales y tipo de documentación entregable.

## 11. Auditoría de accesibilidad

Fortalezas:
- Hay `skip-link`, labels y uso correcto de `button` en acordeones.
- Se usa `aria-*` en navegación y FAQ.

Problemas:
- Breadcrumb duplicado en algunas vistas.
- Muchas imágenes de contenido visual se representan como `div role="img"`.
- Exceso de soluciones manuales aumenta riesgo de inconsistencias entre páginas.

Clasificación:
- Alta: duplicación de estructura navegable en algunas plantillas.
- Media: bloques visuales importantes como fondos CSS que pierden valor semántico.
- Media: formularios heredados/manuales sin contrato único.
- Baja: necesidad de auditoría de contraste y foco en ejecución real.

## 12. Refactor recomendado

Estructura sugerida:

```text
src/
  components/
    forms/
      CotizacionForm.astro
      ContactForm.astro
    layout/
      BaseHead.astro
      Header.astro
      Footer.astro
      Breadcrumb.astro
    marketing/
      TrustBar.astro
      ConversionScripts.astro
    seo/
      SEO.astro
      JsonLd.astro
  layouts/
    Base.astro
    PostLayout.astro
    ProductLayout.astro
  content/
    blog/
    productos/
    empresas-certificadas/
  lib/
    seo.ts
    canonical.ts
    images.ts
    forms.ts
```

Componentes/utilidades recomendadas:
- Componente SEO global consumido por todos los layouts.
- Layout base más delgado.
- Layout específico para blog post.
- Layout específico para producto.
- CTA reutilizable con variantes.
- Breadcrumb único.
- Helper `getCanonicalForBlogPost`.
- Validación editorial de frontmatter.

Ejemplo de helper canónico:

```ts
import { SITE_URL } from './config';
import { CATEGORY_SLUGS } from './blogHelpers';

export function getBlogCanonical(category: string, slug: string) {
  const categorySlug = CATEGORY_SLUGS[category] || category;
  return `${SITE_URL}/blog/${categorySlug}/${slug}`;
}
```

Ejemplo de layout de post:

```astro
---
import Base from './Base.astro';
import SEO from '../components/seo/SEO.astro';
---

<Base showBreadcrumb={true}>
  <Fragment slot="head">
    <SEO {...Astro.props.seo} />
  </Fragment>
  <article>
    <slot />
  </article>
</Base>
```

## Prioridad recomendada de ejecución

1. Normalizar canonicals y redirects de blog.
2. Retirar breadcrumb duplicado.
3. Migrar formularios legacy a `CotizacionForm`.
4. Extraer scripts globales del layout base.
5. Limpiar contenido publicado con placeholders.
6. Reescribir README y documentar arquitectura real.
7. Formalizar validaciones editoriales y pruebas automáticas.

