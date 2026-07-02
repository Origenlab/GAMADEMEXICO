# Blog - Auditoría SEO GEO Marketing 2026-07-01

Auditoría integral del blog de GAMADEMEXICO con foco en SEO, GEO, marketing y estandarización Astro + Markdown.

## 1. Objetivo

Evaluar el blog completo del sitio para responder cinco preguntas:
- cómo está estructurado hoy,
- qué problemas SEO tiene por artículo y por categoría,
- qué limita su rendimiento GEO / AI visibility,
- qué fricciones tiene desde marketing y conversión,
- y cómo debe evolucionar en Astro + Markdown usando layouts y bloques reutilizables.

Este documento no sustituye las auditorías generales del sitio. Funciona como auditoría maestra del blog.

---

## 2. Inventario real del blog

### Estado actual verificado en código

- 84 artículos `.md` en `src/content/blog`
- 80 publicados
- 4 en `draft: true`
- 8 categorías activas:
  - monitores → 16
  - valvulas → 16
  - mangueras → 14
  - gabinetes-hidrantes → 12
  - boquillas → 10
  - conexiones-herrajes → 8
  - equipos-bomberos → 5
  - equipos-contra-incendios → 3

### Arquitectura actual del blog

El blog ya tiene una base positiva que debe conservarse:

- una sola plantilla principal: `src/pages/blog/[categoria]/[slug].astro`
- un layout base compartido: `src/layouts/Base.astro`
- componentes ya integrados: `BlogSidebar`, `BlogAuthor`, `BlogRelatedPosts`, `BlogCTA`, `CotizacionForm`
- schema ya existente: `TechArticle`, `BreadcrumbList`
- categorías SEO-friendly via `CATEGORY_SLUGS`
- content collection tipada en `src/content.config.ts`

### Lectura profesional

El problema del blog no es de arquitectura base. El blog ya usa un modelo correcto: Markdown para contenido, Astro para layout y componentes, y frontmatter para gobierno editorial. El problema real es de **gobierno del contenido y consistencia estructural**.

---

## 3. Hallazgos SEO globales

### 3.1. Canonicals manuales residuales

**Hecho verificado:** 16 artículos todavía tienen `canonical:` manual en frontmatter.

**Riesgo:** El proyecto ya arrastró un problema fuerte de canonicals en blog. Mantener canonicals manuales residuales deja abierta la puerta a: divergencia futura entre URL real y canonical, clusterización inconsistente, y errores silenciosos en nuevas publicaciones.

**Criterio recomendado:** En blog, la canonical debe ser automática por defecto. Solo se debe permitir canonical manual si existe una excepción documentalmente justificada.

**Acción:** revisar los 16 artículos con canonical manual, confirmar si el override sigue siendo necesario, y eliminarlo donde ya no aporte valor.

### 3.2. Falta total de tipo editorial

**Hecho verificado:** 84/84 artículos no usan el campo `tipo`, aunque existe en el schema del blog.

**Riesgo:** Esto impide gobernar el blog por intención editorial. Sin esa capa, el proyecto no puede distinguir con claridad: artículo informativo, artículo técnico, guía, comparativa, comercial, normativo.

**Impacto:** Sin `tipo` editorial: el enlazado interno no puede priorizar bien, los CTAs no se pueden segmentar por intención, el GEO no puede reutilizar patrones según tipo de respuesta, y el equipo pierde una capa importante de clasificación estratégica.

**Acción:** Convertir `tipo` en un campo realmente usado, no solo permitido por schema.

### 3.3. Cobertura FAQ irregular

**Hecho verificado:**
- 37/84 artículos presentan señal de FAQ
- 47/84 artículos no muestran bloque FAQ o equivalente claro

**Lectura correcta:** No todos los artículos necesitan FAQ visible. Pero el blog sí necesita una política clara de respuesta directa. Hoy hay una mezcla desigual: algunos artículos tienen formato más reutilizable, otros son solo desarrollo narrativo sin bloque sintético final.

**Acción:** Definir qué artículos necesitan FAQ, respuesta corta, matriz de decisión, checklist, o cierre normativo. No se trata de poner FAQ en todo. Se trata de volver el contenido más reutilizable y más útil para snippets, GEO y escaneo humano.

### 3.4. Dispersión fuerte de longitud

**Hechos verificados:**
- 14 artículos tienen menos de 1200 palabras
- 19 artículos tienen más de 2500 palabras
- 5 titles superan 60 caracteres
- descriptions están relativamente controladas en longitud

**Interpretación:** El problema no es solo longitud. El problema es uniformidad de profundidad. Hoy el blog combina piezas demasiado breves para competir bien en ciertos temas, piezas excesivamente largas y pesadas para escaneo, y piezas equilibradas que deberían ser el nuevo estándar.

**Acción:** Dividir el trabajo de optimización en dos grupos: artículos cortos que necesitan expansión útil, artículos largos que necesitan modularización y mejor jerarquía.

### 3.5. Higiene de categorías mejorable

Hay indicios claros de piezas que semánticamente no viven en el cluster ideal.

**Ejemplos relevantes:**
- "Bombas Contra Incendios y NFPA 20: Selección Real" → en `valvulas`
- "Detectores de Humo y Calor: Cuál Elegir y Por Qué" → en `monitores`
- "Equipos Contra Incendios en la Industria Automotriz" → en `mangueras`
- "Plan de Emergencia Contra Incendios NOM-002" → en `mangueras`
- "Protección Contra Incendios en Data Centers" → en `valvulas`
- "Selección de Proveedores de Equipos Contra Incendios" → en `valvulas`

**Riesgo:** Cuando un artículo vive en un cluster débil o incorrecto: debilita la taxonomía, contamina hubs temáticos, reduce consistencia del enlazado interno, y complica el trabajo de GEO y marketing.

**Acción:** Auditar cluster por cluster y reclasificar donde haga falta.

---

## 4. Hallazgos GEO / AI visibility del blog

### 4.1. El blog ya tiene base estructural para GEO

**Puntos positivos:** usa `TechArticle`, tiene autor visible, tiene breadcrumbs, tiene artículos técnicos con profundidad real, tiene muchas referencias a normas, criterios, escenarios y decisiones.

Esto significa que el blog ya es aprovechable para GEO. No hay que reconstruirlo desde cero.

### 4.2. Lo que le falta al blog para GEO

**a. Respuesta directa reutilizable**

Muchos artículos empiezan bien, pero no todos ofrecen bloques reutilizables por IA o por snippets. Por ejemplo: respuesta corta, criterio de elección, tabla de decisión, checklist, "cuando usar X vs Y", errores comunes, cumplimiento en 5 puntos.

**b. Metadatos editoriales para intención**

Sin `tipo`, sin capa de `objetivoSEO`, sin `ctaVariant`, sin `respuestaCorta`, el sistema no puede renderizar mejor experiencia según intención.

**c. Clusterización temática más limpia**

GEO sufre cuando la taxonomía editorial mezcla entidades temáticas incompatibles dentro de la misma categoría.

**d. Bloques citables estandarizados**

El blog necesita bloques de salida que puedan repetirse sin reescribir todo manualmente: resumen ejecutivo, matrix de decisión, norma aplicable, riesgo de no cumplir, cuándo sí / cuándo no, FAQ técnico.

---

## 5. Hallazgos de marketing y conversión dentro del blog

### 5.1. El blog ya vende, pero no de forma gobernada

**Fortalezas:** todas las piezas viven dentro de una plantilla comercialmente útil, la plantilla ya muestra autoridad, autor, CTA y formulario, y existe relación con productos y artículos relacionados.

### 5.2. Problemas actuales

**a. CTA demasiado uniforme**

No todo artículo debe empujar igual. Hoy el blog necesita diferenciar mejor: intención informativa alta, comparación, cumplimiento, selección técnica, lead comercial.

**b. WhatsApp aparece de forma desigual**

- 8 artículos mencionan o empujan WhatsApp directamente
- el resto depende del CTA general de plantilla

Esto no es malo por sí mismo, pero muestra una política comercial desigual dentro del blog.

**c. Falta de CTA por intención editorial**

Un artículo normativo no debería cerrar igual que una comparativa de producto.

**Acción:** Definir variantes de CTA por tipo y por cluster:
- guía → checklist / asesoría
- comparativa → recomendación técnica
- normativo → diagnóstico de cumplimiento
- comercial → cotización
- informativo → siguiente lectura o hub

---

## 6. Diagnóstico por categoría

| Categoría | Cantidad | Lectura principal | Prioridad |
|---|---|---|---|
| monitores | 16 | Cluster fuerte, pero con dispersión de longitud y varios artículos sin bloque reutilizable | P1 |
| valvulas | 16 | Cluster grande, pero con piezas semánticamente fuera de categoría | P1 |
| mangueras | 14 | Buen volumen, mezcla de piezas fuertes y piezas cortas/comerciales | P1 |
| gabinetes-hidrantes | 12 | Mucha relación con cumplimiento, legal y facility; necesita mejor estructura de respuesta | P1 |
| boquillas | 10 | Base sólida, pero baja cobertura FAQ y varios artículos podrían estandarizar formato | P2 |
| conexiones-herrajes | 8 | Cluster técnico claro, pero con baja reutilización FAQ y oportunidad de matrices | P2 |
| equipos-bomberos | 5 | Todos largos, todos con canonical manual, editorialmente fuertes pero pesados | P1 |
| equipos-contra-incendios | 3 | Cluster local/comercial pequeño, depende de mejorar GEO local y consistencia comercial | P1 |

---

## 7. Estándar profesional recomendado para Astro + Markdown

### 7.1. Qué debe conservarse

- un solo template principal de artículo
- content collection tipada
- frontmatter fuerte
- renderizado desde Markdown
- schema desde layout/template
- related posts y sidebar como componentes

### 7.2. Qué debe cambiar

No conviene seguir resolviendo la evolución del blog con Markdown completamente libre y sin gobierno adicional.

Se recomienda mantener `.md` como formato principal, pero volver el sistema más estructurado mediante:

**Frontmatter obligatorio nuevo:**
- `tipo`
- `objetivoSEO`
- `ctaVariant`
- `respuestaCorta`
- `normasRelacionadas`
- `industriaObjetivo`
- `etapaEmbudo`
- `faqVisible`

**Componentes Astro reutilizables para blog:**
- `BlogQuickAnswer.astro`
- `BlogDecisionMatrix.astro`
- `BlogNormativeBox.astro`
- `BlogChecklist.astro`
- `BlogRiskCallout.astro`
- `BlogCommercialCTA.astro`
- `BlogFaqBlock.astro`

**Regla clave:** No migrar 84 artículos a plantillas sueltas. La mejora debe seguir siendo Astro para layout y bloques reutilizables, Markdown para contenido, frontmatter para gobierno editorial.

### 7.3. Enfoque recomendado

Mantener Markdown puro donde sea suficiente. Usar componentes Astro reutilizables de forma controlada y sistemática, idealmente mediante bloques condicionales renderizados desde frontmatter o migrando a MDX solo cuando haya un caso real que lo justifique. No conviene convertir todo el corpus a MDX por moda.

---

## 8. Prioridades de mejora del blog

### P1 — Crítico

- Normalizar los 16 canonicals manuales restantes.
- Activar y poblar `tipo` en los 84 artículos.
- Reclasificar artículos semánticamente mal agrupados.
- Auditar y decidir destino de los 4 drafts.
- Priorizar expansión o modularización de artículos extremos: cortos <1200, muy largos >2500.

### P2 — Alto impacto

- Estandarizar bloques FAQ / respuesta directa.
- Definir CTA por tipo editorial.
- Crear bloques Astro reutilizables para respuesta, cumplimiento y decisión.
- Mejorar hubs por categoría con mejor clusterización interna.

### P3 — Consolidación editorial

- Afinar tono comercial por tipo de artículo.
- Revisar artículos relacionados por calidad semántica, no solo categoría/tags.
- Mejorar consistencia de profundidad entre clusters.

---

## 9. Matriz artículo por artículo

| Artículo | Categoría | Hallazgo principal | Acción prioritaria |
|---|---|---|---|
| Adaptadores y Acoplamientos para Mangueras Contra Incendios | conexiones-herrajes | Sin FAQ | Agregar bloque FAQ o respuesta directa |
| Almacenamiento y Mantenimiento de Mangueras Contra Incendios | mangueras | Sin FAQ | Agregar bloque FAQ o respuesta directa |
| Auditoría de Monitores Contra Incendios en Empresas | monitores | Sin FAQ | Agregar bloque FAQ o respuesta directa |
| Bombas Contra Incendios y NFPA 20: Selección Real | valvulas | Sin FAQ | Agregar bloque FAQ o respuesta directa |
| Boquillas Contra Incendios para Brigadas y Sistemas Fijos | boquillas | Sin FAQ | Agregar bloque FAQ o respuesta directa |
| Boquillas Turbo Jet vs Tipo Pistola: Cuándo Usar Cada Una | boquillas | Draft / Sin FAQ | Definir publicar o mantener fuera del índice |
| Cálculo Hidráulico en Sistemas Contra Incendios | valvulas | Contenido largo / Sin FAQ | Podar repeticiones y mejorar jerarquía |
| Especificación de Equipos Certificados en Proyectos Reales | gabinetes-hidrantes | Sin FAQ | Agregar bloque FAQ o respuesta directa |
| Certificaciones UL y FM en Equipos Contra Incendios | monitores | Sin FAQ | Agregar bloque FAQ o respuesta directa |
| Colectores y Distribuidores para Sistemas Contra Incendios | conexiones-herrajes | Sin FAQ | Agregar bloque FAQ o respuesta directa |
| Cómo Elegir la Manguera Contra Incendios Correcta | mangueras | Sin FAQ | Agregar bloque FAQ o respuesta directa |
| Conexiones y Herrajes en Sistemas Contra Incendios | conexiones-herrajes | Sin FAQ | Agregar bloque FAQ o respuesta directa |
| Cumplimiento Legal de Boquillas Contra Incendios en México | boquillas | Sin FAQ | Agregar bloque FAQ o respuesta directa |
| Cómo Cumplir la NOM-002-STPS en Tu Empresa | gabinetes-hidrantes | Sin FAQ | Agregar bloque FAQ o respuesta directa |
| Detectores de Humo y Calor: Cuál Elegir y Por Qué | monitores | Sin FAQ | Agregar bloque FAQ o respuesta directa |
| Boquilla Tipo Pistola vs Turbo Jet: Cuándo Usar Cada Una | boquillas | Sin FAQ | Agregar bloque FAQ o respuesta directa |
| Diseño de Red de Hidrantes Privados NFPA 24 en México | gabinetes-hidrantes | Sin FAQ | Agregar bloque FAQ o respuesta directa |
| Selección de Proveedores de Equipos Contra Incendios | valvulas | Sin FAQ | Agregar bloque FAQ o respuesta directa |
| Equipo de Protección Personal para Bomberos en México: Guía 2025 | equipos-bomberos | Canonical manual / Contenido muy largo | Normalizar canonical y validar cluster |
| Equipos Contra Incendios en Guadalajara: Suministro UL/FM | equipos-contra-incendios | Canonical manual | Normalizar canonical y validar cluster |
| Equipos Contra Incendios en la Industria Automotriz | mangueras | Sin FAQ | Agregar bloque FAQ o respuesta directa |
| Equipos Contra Incendios en Monterrey UL/FM | equipos-contra-incendios | Canonical manual | Normalizar canonical y validar cluster |
| Equipos Contra Incendios en Querétaro y Bajío | equipos-contra-incendios | Canonical manual / Contenido corto | Normalizar canonical y validar cluster |
| Espuma AFFF Contra Incendios: Aplicaciones Industriales | boquillas | Sin FAQ | Agregar bloque FAQ o respuesta directa |
| Estandarización de Boquillas Contra Incendios en Industria | boquillas | Sin FAQ | Agregar bloque FAQ o respuesta directa |
| Extinción Automática en Cocinas Industriales: UL 300 | boquillas | Sin FAQ | Agregar bloque FAQ o respuesta directa |
| Gabinetes de Manguera Contra Incendios: Tipos y Normas | gabinetes-hidrantes | Sin FAQ | Agregar bloque FAQ o respuesta directa |
| Boquillas Contra Incendios: Tipos y Selección | boquillas | Sin FAQ | Agregar bloque FAQ o respuesta directa |
| Monitores Contra Incendios: Cómo Elegir el Correcto | monitores | Contenido largo / Sin FAQ | Podar repeticiones y mejorar jerarquía |
| Conexiones Storz para Sistemas Contra Incendios | conexiones-herrajes | Sin FAQ | Agregar bloque FAQ o respuesta directa |
| Herrajes para Mangueras y Gabinetes Contra Incendios | conexiones-herrajes | Sin FAQ | Agregar bloque FAQ o respuesta directa |
| Hidrantes Contra Incendios en México: Tipos e Instalación | gabinetes-hidrantes | Contenido largo / Sin FAQ | Podar repeticiones y mejorar jerarquía |
| Boquillas Contra Incendios en Proyectos Industriales | boquillas | Canonical manual | Normalizar canonical y validar cluster |
| Inspección de Protección Civil: Qué Revisan en Equipos | gabinetes-hidrantes | Contenido largo / Sin FAQ | Podar repeticiones y mejorar jerarquía |
| Equipos Contra Incendios en Seguridad Industrial | monitores | Contenido muy largo / CTA WhatsApp | Modular secciones y resumir para mejor escaneo |
| LGA Contra Incendios: Expertos en Querétaro | gabinetes-hidrantes | Sin FAQ / CTA WhatsApp | Agregar bloque FAQ o respuesta directa |
| Licitaciones Gobierno: Equipos Contra Incendios | monitores | Contenido corto | Expandir profundidad con respuesta directa + FAQ |
| Mangueras Contra Incendios en Empresas: Normas | mangueras | Canonical manual / Contenido largo | Normalizar canonical y validar cluster |
| Lineamientos para Monitores Contra Incendios en México | monitores | Sin FAQ | Agregar bloque FAQ o respuesta directa |
| Llaves y Herramientas para Válvulas e Hidrantes | conexiones-herrajes | Sin FAQ | Agregar bloque FAQ o respuesta directa |
| Mangueras de Ataque Contra Incendios: Tipos y Usos | mangueras | Sin FAQ | Agregar bloque FAQ o respuesta directa |
| Manguera Forestal Wildland: NFPA 1977 en México | mangueras | Sin FAQ | Agregar bloque FAQ o respuesta directa |
| Manguera Millhose vs Blindex: Diferencias y Aplicaciones | mangueras | Base estable | Optimización fina de GEO y CTA |
| Mangueras Forestales: Guía Técnica para Brigadas y Minería | mangueras | Contenido largo | Podar repeticiones y mejorar jerarquía |
| Mangueras Millhose: Especificaciones Técnicas y NFPA 14 | mangueras | CTA WhatsApp | Optimización fina de GEO y CTA |
| Mantenimiento de Gabinetes y Mangueras: Checklist Completo | gabinetes-hidrantes | Contenido corto | Expandir profundidad con respuesta directa + FAQ |
| Mantenimiento de Monitores Contra Incendios: Guía Completa | monitores | Contenido corto | Expandir profundidad con respuesta directa + FAQ |
| Mantenimiento de Válvulas Contra Incendios NFPA 25 | valvulas | Contenido corto | Expandir profundidad con respuesta directa + FAQ |
| Manual Maestro de Auditoría para Boquillas Contra Incendios | boquillas | Draft / Canonical manual / Sin FAQ | Definir publicar o mantener fuera del índice |
| Manual Técnico de Monitores Contra Incendios | monitores | Canonical manual | Normalizar canonical y validar cluster |
| Cómo Elegir un Monitor Contra Incendios | monitores | Draft | Definir publicar o mantener fuera del índice |
| Monitor Corazón vs Cuello de Cisne: Cuál Elegir | monitores | Sin FAQ | Agregar bloque FAQ o respuesta directa |
| Monitores Contra Incendio: Tipos y Aplicaciones Industriales | monitores | Canonical manual / Contenido largo / Sin FAQ / CTA WhatsApp | Normalizar canonical y validar cluster |
| Normas NFPA para Válvulas Contra Incendios | valvulas | Contenido corto | Expandir profundidad con respuesta directa + FAQ |
| Plan de Emergencia Contra Incendios NOM-002 | mangueras | Contenido corto | Expandir profundidad con respuesta directa + FAQ |
| Presión de Trabajo en Mangueras: Clasificación NFPA 1961 | mangueras | Sin FAQ | Agregar bloque FAQ o respuesta directa |
| Programa Interno de Protección Civil y Equipos | gabinetes-hidrantes | Canonical manual / Contenido largo | Normalizar canonical y validar cluster |
| Protección Contra Incendios en Data Centers | valvulas | Contenido corto | Expandir profundidad con respuesta directa + FAQ |
| Incendios en Estacionamientos Subterráneos: Protección | gabinetes-hidrantes | Contenido corto | Expandir profundidad con respuesta directa + FAQ |
| Protección Contra Incendios en Hospitales México | gabinetes-hidrantes | Contenido corto | Expandir profundidad con respuesta directa + FAQ |
| Protección Contra Incendios en Talleres Industriales | monitores | Contenido muy largo / CTA WhatsApp | Modular secciones y resumir para mejor escaneo |
| Protección Contra Incendios en Naves y Bodegas | mangueras | Contenido corto / Sin FAQ | Expandir profundidad con respuesta directa + FAQ |
| Prueba Hidrostática de Mangueras: Protocolo NFPA 1962 | mangueras | Sin FAQ | Agregar bloque FAQ o respuesta directa |
| Standpipe NFPA 14: Red Contra Incendios en Altura | mangueras | Contenido corto | Expandir profundidad con respuesta directa + FAQ |
| Reducción Siamesa y Toma Bomberos: Instalación y NFPA 14 | conexiones-herrajes | Sin FAQ | Agregar bloque FAQ o respuesta directa |
| Reposición de Equipos Contra Incendios: Cuándo Reemplazar | valvulas | Sin FAQ | Agregar bloque FAQ o respuesta directa |
| Requisitos Legales de Equipos Contra Incendios en México | gabinetes-hidrantes | Canonical manual / Contenido largo / CTA WhatsApp | Normalizar canonical y validar cluster |
| Seguro Industrial: Requisitos de Equipos Contra Incendios | valvulas | Contenido corto | Expandir profundidad con respuesta directa + FAQ |
| Sistemas Contra Incendios para Hoteles y Centros Comerciales | monitores | CTA WhatsApp | Optimización fina de GEO y CTA |
| Rociadores Automáticos NFPA 13: Guía para México | valvulas | Base estable | Optimización fina de GEO y CTA |
| Tipos de Trajes de Combate contra Incendios: Comparativa Técnica | equipos-bomberos | Canonical manual / Contenido muy largo | Normalizar canonical y validar cluster |
| Toma Siamesa FDC: Instalación y Mantenimiento | conexiones-herrajes | Contenido corto | Expandir profundidad con respuesta directa + FAQ |
| Traje Estructural para Bombero: Guía de Selección y Venta en México | equipos-bomberos | Canonical manual / Contenido muy largo | Normalizar canonical y validar cluster |
| Trajes de Aproximación para Bomberos: Industria Petrolera y Gas | equipos-bomberos | Canonical manual / Contenido muy largo | Normalizar canonical y validar cluster |
| Válvula de Alarma en Rociadores: Prueba NFPA 25 | valvulas | Contenido largo / Sin FAQ | Podar repeticiones y mejorar jerarquía |
| Válvulas Check en Sprinklers: NFPA 13 | valvulas | Sin FAQ | Agregar bloque FAQ o respuesta directa |
| Válvulas Compuerta, Globo y Angular: Cuándo Usar Cada Una | valvulas | Base estable | Optimización fina de GEO y CTA |
| Válvulas OS&Y para Sprinklers: NFPA 13 y Selección México | valvulas | CTA WhatsApp | Optimización fina de GEO y CTA |
| Válvulas de Control Contra Incendios: Supervisión | valvulas | Sin FAQ | Agregar bloque FAQ o respuesta directa |
| Válvulas Diluvio en Petroquímica: NFPA 11 y 16 | valvulas | Contenido largo / Sin FAQ | Podar repeticiones y mejorar jerarquía |
| Válvulas de Diluvio para Transformadores: Guía NFPA | valvulas | Contenido largo | Podar repeticiones y mejorar jerarquía |
| Monitores Contra Incendios en México | monitores | Draft / Canonical manual | Definir publicar o mantener fuera del índice |
| Venta de Trajes para Bomberos en México: Elige Proveedor Certificado | equipos-bomberos | Canonical manual / Contenido muy largo | Normalizar canonical y validar cluster |
| Verificación de Protección Civil Sin Observaciones | monitores | Sin FAQ | Agregar bloque FAQ o respuesta directa |

---

## 10. Acciones Astro + Markdown recomendadas

### Fase A — Gobierno editorial del blog

- Hacer obligatorio `tipo` en blog.
- Desactivar canonicals manuales por defecto.
- Crear política por categoría y por cluster.
- Definir qué artículos son: pillar, support, local/comercial, comparativa, normativo.

### Fase B — Reutilización real

Crear bloques reutilizables Astro para no seguir repitiendo estructura manual en Markdown:
- `BlogQuickAnswer.astro`
- `BlogDecisionMatrix.astro`
- `BlogNormativeBox.astro`
- `BlogChecklist.astro`
- `BlogCommercialCTA.astro`
- `BlogFaqBlock.astro`

### Fase C — Estándar por artículo

Todo artículo nuevo o reescrito debe validar:
- categoría correcta
- tipo editorial
- title competitivo
- description clara
- respuesta corta visible
- CTA según intención
- FAQ o bloque equivalente cuando aplique
- productos/artículos relacionados consistentes

---

## 11. Conclusión final

El blog de GAMADEMEXICO ya tiene una base superior a la media: buen volumen, una plantilla correcta, schema útil, contenido técnico real, y una arquitectura Astro que sí escala.

Lo que le falta no es rehacerlo. Lo que le falta es **gobierno editorial y estructural**.

La mejor mejora posible para este frente no es abrir 84 plantillas nuevas. Es: conservar el modelo Astro + Markdown, endurecer frontmatter, limpiar taxonomía y canonicals, introducir bloques reutilizables, y mover el blog hacia un sistema mucho más predecible para SEO, GEO y marketing.

Este documento debe usarse como base para la siguiente fase de mejora del blog.

---

## 12. Referencias internas

- `[[04 - Contenido y UX - Hub]]`
- `[[../02 - SEO/02 - SEO - Hub]]`
- `[[../03 - Codigo y Arquitectura/03 - Codigo y Arquitectura - Hub]]`
- `[[../01 - Auditoria General/Reporte Maestro Unificado del Sitio 2026-07-01]]`
- `[[../06 - Roadmap/00 - Plan de Ejecucion Maestro 2026-07-01]]`
