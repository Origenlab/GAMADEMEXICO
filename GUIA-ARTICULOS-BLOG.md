# Guía Profesional para Crear Artículos del Blog - Gama de México

## Índice

1. [Introducción](#introducción)
2. [Estructura del Archivo](#estructura-del-archivo)
3. [Frontmatter: Metadatos del Artículo](#frontmatter-metadatos-del-artículo)
4. [Contenido del Artículo](#contenido-del-artículo)
5. [Jerarquía de Encabezados (SEO)](#jerarquía-de-encabezados-seo)
6. [Párrafos Profesionales](#párrafos-profesionales)
7. [Tablas de Especificaciones](#tablas-de-especificaciones)
8. [Interlinking con Anchor Text](#interlinking-con-anchor-text)
9. [Sección de Distribución Nacional](#sección-de-distribución-nacional)
10. [Preguntas Frecuentes (FAQ)](#preguntas-frecuentes-faq)
11. [Sección de Productos Relacionados](#sección-de-productos-relacionados)
12. [Validación y Publicación](#validación-y-publicación)
13. [Checklist Final](#checklist-final)

---

## Introducción

Esta guía establece los estándares profesionales para la creación de artículos del blog de Gama de México. Cada artículo debe seguir estos lineamientos para garantizar:

- **Consistencia visual** con el diseño del sitio
- **Optimización SEO** para posicionamiento en buscadores
- **Valor técnico** para profesionales del sector
- **Conversión comercial** mediante interlinking estratégico
- **Cumplimiento del schema** de Astro Content Collections

### Artículo de Referencia

El artículo modelo a seguir es:
```
/blog/mangueras-contra-incendios/como-elegir-manguera-contra-incendios
```

Este artículo representa el estándar de calidad esperado para todas las publicaciones futuras.

---

## Estructura del Archivo

### Ubicación del Archivo

Los artículos se almacenan en:
```
src/content/blog/[nombre-del-articulo].md
```

### Nomenclatura del Archivo

- Usar kebab-case (guiones bajos)
- Descriptivo y con palabras clave
- Sin caracteres especiales ni acentos
- Máximo 60 caracteres

**Ejemplos correctos:**
```
como-elegir-manguera-contra-incendios.md
guia-seleccion-monitores-industriales.md
mantenimiento-valvulas-nfpa-25.md
```

**Ejemplos incorrectos:**
```
articulo1.md
Mangueras_Guia.md
cómo-elegir-manguera.md
```

---

## Frontmatter: Metadatos del Artículo

El frontmatter es la sección YAML al inicio del archivo que define los metadatos. **Todos los campos deben cumplir con el schema definido en `src/content.config.ts`**.

### Template del Frontmatter

```yaml
---
title: "Título del Artículo Optimizado para SEO"
description: "Descripción meta de 80-165 caracteres con palabras clave principales."
fecha: "YYYY-MM-DD"
fechaActualizacion: "YYYY-MM-DD"
categoria: "categoria-valida"
autor:
  nombre: "Nombre del Autor"
  cargo: "Cargo Profesional"
imagen: "/img/categoria/imagen-principal.avif"
imagenAlt: "Descripción accesible de la imagen"
tags: ["palabra clave 1", "palabra clave 2", "palabra clave 3"]
destacado: false
tiempoLectura: 15
draft: false
productosRelacionados: ["slug-producto-1", "slug-producto-2"]
---
```

### Validaciones del Schema

#### Title (Título)
| Regla | Valor |
|-------|-------|
| Mínimo | 20 caracteres |
| Máximo | 70 caracteres |
| Formato | Sin comillas internas, usar comillas externas |

**Ejemplo correcto:**
```yaml
title: "Cómo Elegir la Manguera Contra Incendios Correcta"
```

**Ejemplo incorrecto (muy largo):**
```yaml
title: "Guía Completa y Definitiva: Cómo Elegir la Manguera Contra Incendios Correcta para tu Empresa Industrial"
```

#### Description (Descripción)
| Regla | Valor |
|-------|-------|
| Mínimo | 80 caracteres |
| Máximo | 165 caracteres |
| Contenido | Incluir palabra clave principal |

**Ejemplo correcto:**
```yaml
description: "Guía técnica para seleccionar mangueras contra incendios según normativa NFPA 1961. Comparativa de tipos, especificaciones y certificaciones."
```

#### Categorías Válidas

El campo `categoria` debe ser uno de los siguientes valores exactos:

| Valor | Descripción |
|-------|-------------|
| `monitores` | Artículos sobre monitores contra incendios |
| `boquillas` | Artículos sobre boquillas y pitones |
| `mangueras` | Artículos sobre mangueras contra incendios |
| `valvulas` | Artículos sobre válvulas industriales |
| `conexiones-herrajes` | Artículos sobre conexiones, adaptadores, coples |
| `gabinetes-hidrantes` | Artículos sobre gabinetes e hidrantes |

#### Autor

El autor puede ser string simple u objeto con cargo:

```yaml
# Opción 1: String simple
autor: "Equipo Técnico Gama de México"

# Opción 2: Objeto con cargo (RECOMENDADO)
autor:
  nombre: "Ing. Miguel Ángel Torres"
  cargo: "Especialista en Sistemas Hidráulicos"
```

**Cargos sugeridos:**
- Especialista en Sistemas Hidráulicos
- Director Técnico
- Gerente de Servicio Técnico
- Especialista en Normatividad
- Ingeniero de Aplicaciones
- Consultor en Protección Contra Incendios

#### Tiempo de Lectura

Calcular aproximadamente:
- 200 palabras = 1 minuto
- Artículo estándar (2,500-3,000 palabras) = 12-15 minutos
- Artículo extenso (4,000+ palabras) = 18-20 minutos

---

## Contenido del Artículo

### Estructura General Recomendada

```markdown
[Párrafo introductorio - 2-3 párrafos amplios con contexto y valor]

---

## Sección Principal 1 (Fundamentos/Conceptos)

### Subsección 1.1
[Contenido técnico con párrafos amplios]

### Subsección 1.2
[Contenido con tablas de especificaciones]

---

## Sección Principal 2 (Tipos/Categorías)

### Tipo 1
[Descripción + tabla + enlaces a productos]

### Tipo 2
[Descripción + tabla + enlaces a productos]

---

## Sección Principal 3 (Criterios de Selección/Guía)

### Criterio 1
[Tabla comparativa + recomendaciones]

### Criterio 2
[Información técnica detallada]

---

## Sección de Mantenimiento/Normatividad

### Subsección con procedimientos
#### Detalle específico (h4)
[Contenido detallado]

---

## Distribución Nacional: Cobertura en Toda la República

[Sección obligatoria - ver template más adelante]

---

## Preguntas Frecuentes

[Mínimo 4 preguntas con respuestas detalladas]

---

## Conclusión

[Párrafo de cierre con llamada a acción]

---

## Productos Destacados

[Enlaces organizados por categoría]
```

---

## Jerarquía de Encabezados (SEO)

### Reglas Fundamentales

1. **El título del frontmatter es el H1** - No usar `#` en el contenido
2. **H2 (`##`)** - Secciones principales (5-8 por artículo)
3. **H3 (`###`)** - Subsecciones (2-4 por H2)
4. **H4 (`####`)** - Detalles específicos (cuando sea necesario)
5. **Nunca saltar niveles** - No pasar de H2 a H4 directamente

### Ejemplo de Jerarquía Correcta

```markdown
## Tipos de Mangueras: Análisis Técnico Detallado

### Manguera de Doble Forro Millhose: La Solución Versátil

La manguera Millhose representa la opción más equilibrada...

[Tabla de especificaciones]

### Manguera Blindex: Resistencia Industrial de Alto Rendimiento

Cuando las condiciones de operación incluyen exposición...

## Mantenimiento Preventivo y Normativo

### Programa de Inspección Según NFPA 1962

#### Inspección Visual Mensual

Cada manguera en servicio debe someterse...

#### Prueba Hidrostática Anual

Las pruebas hidrostáticas anuales son obligatorias...
```

### Formato de Encabezados

- **H2**: Usar formato descriptivo con dos puntos cuando aplique
  - `## Tipos de Mangueras: Análisis Técnico Detallado`
  - `## Criterios de Selección: Metodología Profesional`

- **H3**: Descriptivo y específico
  - `### Manguera de Doble Forro Millhose: La Solución Versátil`
  - `### Evaluación del Nivel de Riesgo`

- **H4**: Breve y directo
  - `#### Inspección Visual Mensual`
  - `#### Prueba Hidrostática Anual`

---

## Párrafos Profesionales

### Características de un Párrafo Profesional

1. **Extensión**: 4-8 líneas (80-150 palabras)
2. **Información**: Datos técnicos verificables
3. **Valor**: Aporta conocimiento específico
4. **Flujo**: Conecta con el párrafo anterior y siguiente
5. **Enlaces**: Incluye interlinking natural cuando sea relevante

### Ejemplo de Párrafo Profesional

```markdown
La selección de una [manguera contra incendios](/mangueras-contra-incendios) representa una de las decisiones más críticas en el diseño de cualquier sistema de protección contra fuego. A diferencia de otros componentes que pueden parecer intercambiables, la manguera constituye el eslabón final entre tu infraestructura hidráulica y la capacidad real de combatir un incendio. Una elección incorrecta no solo compromete la seguridad de tus instalaciones y personal, sino que puede resultar en incumplimientos normativos, invalidación de pólizas de seguro y, en el peor escenario, pérdidas humanas y materiales irreparables.
```

### Lo que NO hacer

```markdown
❌ Las mangueras son importantes. Hay que elegir bien. Existen varios tipos.

❌ Párrafos de una sola línea sin desarrollo.

❌ Contenido genérico sin valor técnico específico.
```

---

## Tablas de Especificaciones

### Formato Estándar de Tabla Técnica

```markdown
| Especificación Técnica | Valor |
|------------------------|-------|
| Construcción | Doble forro poliéster alta tenacidad |
| Revestimiento interior | EPDM grado alimenticio |
| Presión de trabajo | 300 PSI (21 bar) |
| Presión de prueba | 450 PSI (31 bar) |
| Presión de ruptura | >900 PSI |
| Diámetros disponibles | 1.5", 2.5", 3" |
| Longitudes estándar | 15m, 30m, 50m |
| Peso aproximado (2.5" x 30m) | 18-22 kg |
| Temperatura de operación | -30°C a +65°C |
| Certificaciones | NFPA 1961, NOM-002-STPS |
```

### Tabla Comparativa

```markdown
| Clasificación de Riesgo | Características | Manguera Recomendada | Diámetro Mínimo |
|------------------------|-----------------|---------------------|-----------------|
| Riesgo Bajo | Oficinas, comercios, escuelas | [Manguera Millhose 1.5"](/mangueras-contra-incendios/manguera-millhose) | 1.5" (38mm) |
| Riesgo Medio | Manufactura general, almacenes | [Manguera Millhose 2.5"](/mangueras-contra-incendios/manguera-millhose-2-5-30m) | 2.5" (64mm) |
| Riesgo Alto | Químicos, plásticos, madera | [Manguera Blindex 2.5"](/mangueras-contra-incendios/manguera-blindex-2-5-30m) | 2.5" (64mm) |
| Riesgo Especial | Petroquímica, refinería | [Manguera Blindex Premium](/mangueras-contra-incendios/manguera-blindex-premium-pemex) | 2.5" o 3" |
```

### Tabla de Programa de Mantenimiento

```markdown
| Frecuencia | Actividad | Responsable |
|------------|-----------|-------------|
| Mensual | Inspección visual completa | Personal de mantenimiento |
| Trimestral | Verificación de acoples y conexiones | Personal de mantenimiento |
| Semestral | Despliegue y re-enrollado | Brigada de emergencia |
| Anual | Prueba hidrostática certificada | Técnico certificado |
| Cada 5 años | Evaluación de reemplazo | Ingeniería de seguridad |
```

---

## Interlinking con Anchor Text

### Principios del Interlinking

1. **Natural**: Los enlaces deben fluir con el texto
2. **Relevante**: Solo enlazar cuando aporta valor
3. **Descriptivo**: El anchor text debe describir el destino
4. **Distribuido**: Mínimo 15-30 enlaces por artículo extenso

### Formato de Enlaces

```markdown
# Enlace a categoría
La [manguera contra incendios](/mangueras-contra-incendios) es fundamental...

# Enlace a producto específico
Para aplicaciones industriales, la [manguera Millhose de 2.5 pulgadas](/mangueras-contra-incendios/manguera-millhose-2-5-30m) ofrece...

# Enlace a subcategoría
Los [adaptadores de bronce](/conexiones-herrajes-contra-incendios/adaptadores-bronce) permiten...

# Enlace a otra categoría
Complementa tu sistema con [válvulas contra incendios](/valvulas-contra-incendios) certificadas...
```

### URLs Disponibles para Interlinking

#### Categorías Principales
```
/monitores-contra-incendios
/boquillas-contra-incendios
/mangueras-contra-incendios
/valvulas-contra-incendios
/conexiones-herrajes-contra-incendios
/gabinetes-hidrantes
```

#### Subcategorías de Mangueras
```
/mangueras-contra-incendios/manguera-millhose
/mangueras-contra-incendios/manguera-blindex
/mangueras-contra-incendios/manguera-forestal
/mangueras-contra-incendios/manguera-succion
```

#### Productos Específicos (ejemplos)
```
/mangueras-contra-incendios/manguera-millhose-2-5-30m
/mangueras-contra-incendios/manguera-blindex-premium-pemex
/mangueras-contra-incendios/manguera-forestal-amarilla-alta-vis
/conexiones-herrajes-contra-incendios/adaptadores-bronce
/conexiones-herrajes-contra-incendios/conexion-wye
/conexiones-herrajes-contra-incendios/toma-siamesa-fdc
```

### Anchor Text Recomendados por Categoría

| Categoría | Anchor Text Sugeridos |
|-----------|----------------------|
| Mangueras | "manguera contra incendios", "manguera certificada NFPA", "manguera industrial" |
| Monitores | "monitor contra incendios", "cañón de agua", "monitor tipo corazón" |
| Boquillas | "boquilla contra incendios", "pitón industrial", "boquilla tipo pistola" |
| Válvulas | "válvula contra incendios", "válvula OS&Y", "válvula de control" |
| Conexiones | "conexiones contra incendios", "adaptadores de bronce", "coples Storz" |
| Gabinetes | "gabinete contra incendios", "hidrante", "estación de manguera" |

---

## Sección de Distribución Nacional

### Template Obligatorio

Esta sección DEBE incluirse en todos los artículos para reforzar la cobertura nacional y mejorar SEO local.

```markdown
---

## Distribución Nacional: Cobertura en Toda la República

### Envíos a Todo México

En Gama de México entendemos que la protección contra incendios no puede esperar. Por ello, hemos desarrollado una red logística que nos permite entregar [equipos contra incendios](/equipos) en cualquier punto de la República Mexicana con tiempos de respuesta competitivos y costos de envío optimizados.

Nuestra capacidad de distribución abarca las principales zonas industriales del país, incluyendo:

**Zona Norte:**
Contamos con entregas regulares a Nuevo León, Coahuila, Chihuahua, Sonora, Baja California, Tamaulipas y Durango. Las plantas manufactureras de Monterrey, los parques industriales de Saltillo, las maquiladoras de Ciudad Juárez y las instalaciones mineras de la región reciben servicio prioritario con inventario disponible para entrega inmediata de productos de alta rotación.

**Zona Centro:**
La Ciudad de México, Estado de México, Querétaro, Guanajuato, Aguascalientes, San Luis Potosí y Jalisco conforman nuestro territorio de mayor concentración de clientes industriales. Desde nuestra ubicación estratégica, podemos atender pedidos con entrega en 24-48 horas para productos en existencia.

**Zona Sur y Golfo:**
Las regiones petroleras de Veracruz, Tabasco, Campeche y la zona industrial de Puebla reciben atención especializada considerando los requisitos específicos de la industria de hidrocarburos. Mantenemos inventario de [PRODUCTO_RELEVANTE_AL_ARTÍCULO] y equipos con certificación FM Approved para proyectos en refinería y plataformas.

**Zona Sureste:**
Yucatán, Quintana Roo, Oaxaca y Chiapas son atendidos mediante nuestra red de distribución con tiempos de entrega de 3-5 días hábiles para la mayoría de productos estándar.

### Atención a Proyectos Especiales

Para proyectos de gran escala, construcción de nuevas instalaciones o programas de actualización de sistemas de protección, ofrecemos servicios de asesoría técnica especializada que incluyen:

- Evaluación de requerimientos según clasificación de riesgo
- Especificación técnica de equipos según normatividad aplicable
- Cotización integrada de sistemas completos
- Coordinación de entregas programadas según cronograma de obra
- Documentación técnica para auditorías y certificaciones
```

### Estados por Zona (Referencia)

| Zona | Estados |
|------|---------|
| **Norte** | Nuevo León, Coahuila, Chihuahua, Sonora, Baja California, Baja California Sur, Tamaulipas, Durango, Sinaloa |
| **Centro** | Ciudad de México, Estado de México, Querétaro, Guanajuato, Aguascalientes, San Luis Potosí, Jalisco, Michoacán, Hidalgo, Tlaxcala, Morelos |
| **Sur/Golfo** | Veracruz, Tabasco, Campeche, Puebla, Guerrero |
| **Sureste** | Yucatán, Quintana Roo, Oaxaca, Chiapas |

---

## Preguntas Frecuentes (FAQ)

### Estructura de FAQ

Incluir mínimo 4 preguntas relevantes al tema del artículo.

```markdown
---

## Preguntas Frecuentes Sobre [TEMA]

### ¿Pregunta 1 relevante al tema?

Respuesta detallada de 2-4 oraciones que incluya información técnica útil. Puede incluir [enlace a producto relevante](/categoria/producto) cuando sea apropiado. La respuesta debe aportar valor real al lector.

### ¿Pregunta 2 sobre especificaciones?

Respuesta con datos específicos. Mencionar normativas (NFPA, NOM) cuando aplique. Incluir recomendaciones prácticas basadas en experiencia técnica.

### ¿Pregunta 3 sobre mantenimiento o vida útil?

Proporcionar rangos específicos y condiciones. Por ejemplo: "La vida útil depende del tipo de producto, condiciones de uso y programa de mantenimiento. Como referencia general: [datos específicos]."

### ¿Pregunta 4 sobre compatibilidad o aplicaciones?

Explicar consideraciones técnicas importantes. Recomendar productos específicos cuando sea relevante: "Para esta aplicación, recomendamos específicamente la [producto específico](/url) diseñada con materiales compatibles."
```

### Preguntas Frecuentes por Categoría

#### Para Mangueras:
- ¿Cuál es la diferencia entre manguera Millhose y Blindex?
- ¿Qué certificaciones debe tener una manguera en México?
- ¿Cada cuánto tiempo debo reemplazar las mangueras?
- ¿Puedo usar la misma manguera para agua y espuma AFFF?

#### Para Monitores:
- ¿Cuál es la diferencia entre monitor tipo corazón y cuello de cisne?
- ¿Qué caudal necesito para mi instalación?
- ¿Es necesaria la certificación FM Approved?
- ¿Cada cuánto se debe dar mantenimiento a un monitor?

#### Para Válvulas:
- ¿Cuál es la diferencia entre válvula OS&Y y mariposa?
- ¿Qué válvulas requiere un sistema de rociadores?
- ¿Con qué frecuencia debo inspeccionar las válvulas?
- ¿Las válvulas necesitan certificación UL o FM?

---

## Sección de Productos Relacionados

### Template de Cierre

```markdown
---

## Productos Destacados

Explora nuestra línea completa de equipos para sistemas de protección contra incendios:

### [Categoría Principal del Artículo]
- [Producto/Subcategoría 1](/url) - Descripción breve
- [Producto/Subcategoría 2](/url) - Descripción breve
- [Producto/Subcategoría 3](/url) - Descripción breve
- [Producto/Subcategoría 4](/url) - Descripción breve

### Conexiones y Accesorios
- [Adaptadores y Conexiones](/conexiones-herrajes-contra-incendios/adaptadores-bronce) - Compatibilidad entre sistemas
- [Conexiones Wye](/conexiones-herrajes-contra-incendios/conexion-wye) - División de líneas
- [Tomas Siamesas FDC](/conexiones-herrajes-contra-incendios/toma-siamesa-fdc) - Conexión de bomberos
- [Coples y Reducciones](/conexiones-herrajes-contra-incendios/coples-reducciones) - Adaptación de diámetros

### Equipos Complementarios
- [Boquillas Contra Incendios](/boquillas-contra-incendios) - Descarga y control de patrón
- [Válvulas Contra Incendios](/valvulas-contra-incendios) - Control de flujo
- [Monitores Contra Incendios](/monitores-contra-incendios) - Descarga de alto caudal
- [Gabinetes e Hidrantes](/gabinetes-hidrantes) - Estaciones de protección
```

---

## Validación y Publicación

### Verificación del Schema

Antes de publicar, ejecutar el build para verificar que el frontmatter cumple con el schema:

```bash
npm run build
```

#### Errores Comunes del Schema

| Error | Causa | Solución |
|-------|-------|----------|
| `title: Título muy largo para SEO` | Más de 70 caracteres | Reducir título |
| `title: Título muy corto para SEO` | Menos de 20 caracteres | Expandir título |
| `description: Descripción muy larga` | Más de 165 caracteres | Reducir descripción |
| `description: Descripción muy corta` | Menos de 80 caracteres | Expandir descripción |
| `categoria: Invalid enum value` | Categoría no válida | Usar categoría del enum |
| `fecha: Usar formato YYYY-MM-DD` | Formato de fecha incorrecto | Corregir formato |

### Verificación de Enlaces

Revisar que todos los enlaces internos apunten a URLs existentes:

```bash
# Buscar enlaces en el archivo
grep -o '\[.*\](/[^)]*' src/content/blog/nombre-articulo.md
```

### Verificación de Imágenes

Las imágenes deben existir en la ruta especificada:

```
/img/categoria/nombre-imagen.avif
```

Formatos aceptados: `.avif`, `.webp`, `.jpg`, `.png`

---

## Checklist Final

### Antes de Publicar

- [ ] **Frontmatter válido**
  - [ ] Título: 20-70 caracteres
  - [ ] Descripción: 80-165 caracteres
  - [ ] Categoría del enum válido
  - [ ] Fecha formato YYYY-MM-DD
  - [ ] Autor con nombre y cargo
  - [ ] Imagen con ruta correcta
  - [ ] Tags relevantes (3-6)
  - [ ] Tiempo de lectura calculado

- [ ] **Estructura de contenido**
  - [ ] Párrafo introductorio (2-3 párrafos amplios)
  - [ ] Mínimo 5 secciones H2
  - [ ] Jerarquía de encabezados correcta (H2 > H3 > H4)
  - [ ] Tablas de especificaciones técnicas
  - [ ] Sección de distribución nacional incluida
  - [ ] Sección de FAQ (mínimo 4 preguntas)
  - [ ] Sección de productos relacionados

- [ ] **Interlinking**
  - [ ] Mínimo 15 enlaces internos
  - [ ] Anchor text descriptivo
  - [ ] Enlaces a productos relevantes
  - [ ] Enlaces a categorías relacionadas
  - [ ] URLs verificadas como existentes

- [ ] **Calidad del contenido**
  - [ ] Párrafos de 4-8 líneas
  - [ ] Información técnica verificable
  - [ ] Referencias a normativas (NFPA, NOM)
  - [ ] Sin errores ortográficos
  - [ ] Tono profesional consistente

- [ ] **SEO**
  - [ ] Palabra clave en título
  - [ ] Palabra clave en descripción
  - [ ] Palabra clave en primer párrafo
  - [ ] Palabras clave en H2 cuando sea natural
  - [ ] Alt text en imagen principal

- [ ] **Build exitoso**
  - [ ] `npm run build` sin errores
  - [ ] Verificar página en localhost
  - [ ] Commit y push a GitHub
  - [ ] Build de producción exitoso

---

## Ejemplo Completo

Ver el artículo modelo completo en:

```
src/content/blog/como-elegir-manguera-contra-incendios.md
```

Este artículo implementa todos los estándares descritos en esta guía:
- Frontmatter completo y validado
- 18 minutos de tiempo de lectura
- +30 enlaces internos con anchor text
- Tablas de especificaciones técnicas
- Sección de distribución nacional completa
- FAQ con 4 preguntas
- Productos destacados organizados

---

## Contacto para Dudas

Para consultas sobre esta guía o el proceso de publicación:
- Revisar ejemplos existentes en `/src/content/blog/`
- Consultar schema en `/src/content.config.ts`
- Verificar URLs disponibles navegando el sitio en producción

---

*Última actualización: Febrero 2025*
*Versión: 1.0*
