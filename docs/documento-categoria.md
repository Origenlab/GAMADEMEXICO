# Guia de Desarrollo: Paginas de Categoria
## Gama de Mexico - Sistema de Diseno v2.0

> **Documento de referencia obligatorio** para homologar todas las paginas de categoria del sitio.
> Ultima actualizacion: Febrero 2025

---

## Indice

1. [Estructura General](#1-estructura-general)
2. [Secciones Obligatorias](#2-secciones-obligatorias)
3. [Clases CSS del Sistema](#3-clases-css-del-sistema)
4. [Plantilla Base](#4-plantilla-base)
5. [Checklist de Validacion](#5-checklist-de-validacion)
6. [Optimizacion SEO con NeuronWriter](#6-optimizacion-seo-con-neuronwriter)

---

## 1. Estructura General

Cada pagina de categoria debe seguir esta estructura exacta de secciones:

```
1. HERO              - Presentacion principal con CTAs
2. PRODUCTOS         - Grid de productos dinamicos desde content collection
3. SERVICE-DETAILS   - Detalle expandido de cada producto (2 columnas: texto + imagen)
4. TRUST             - Beneficios + Testimoniales
5. LEAD-CAPTURE      - Formulario de cotizacion (WhatsApp)
6. SEO-CONTENT       - Contenido largo para posicionamiento
7. FAQ               - Preguntas frecuentes con acordeon
8. SCRIPT            - Handler del formulario WhatsApp
```

### Archivo Base

```astro
---
import Layout from '../layouts/Base.astro';
import { getCollection } from 'astro:content';

const productos = (await getCollection('productos', ({ data }) => data.categoria === '[CATEGORIA]')).sort((a, b) => a.data.orden - b.data.orden);
---

<Layout
  title="[Titulo SEO] | Gama de Mexico"
  description="[Meta description 150-160 caracteres]"
  activePage="equipos"
>
  <!-- Secciones aqui -->
</Layout>
```

---

## 2. Secciones Obligatorias

### 2.1 HERO

```astro
<!-- HERO -->
<section class="hero" aria-labelledby="hero-title">
  <div class="container">
    <div class="hero__content-left">
      <h1 id="hero-title" class="hero__title">[Titulo H1 con keyword principal]</h1>
      <p class="hero__intro">[Parrafo introductorio con <strong>keywords</strong> resaltadas. 2-3 oraciones.]</p>
      <div class="hero__ctas">
        <a href="#cotizar" class="btn btn--primary">Cotizar [Categoria]</a>
        <a href="https://wa.me/5215565298240" class="btn btn--outline" target="_blank" rel="noopener">Escribir por WhatsApp</a>
      </div>
      <div class="hero__proof">
        <div class="hero__proof-item"><span class="hero__proof-value">[N]</span> [Metrica 1]</div>
        <div class="hero__proof-item"><span class="hero__proof-value">[CERT]</span> [Certificacion]</div>
        <div class="hero__proof-item"><span class="hero__proof-value">[SPEC]</span> [Especificacion clave]</div>
        <div class="hero__proof-item"><span class="hero__proof-value">Stock</span> Disponibilidad inmediata</div>
      </div>
    </div>
    <div class="hero__content-right">
      <p>[Parrafo contextual 1 - Que son estos productos y por que son importantes]</p>
      <p>[Parrafo contextual 2 - Que ofrece Gama de Mexico en esta categoria]</p>
    </div>
  </div>
</section>
```

**Reglas:**
- `hero__title`: Debe contener la keyword principal
- `hero__intro`: Maximo 3 oraciones con keywords en `<strong>`
- `hero__proof`: Exactamente 4 items con metricas relevantes
- `hero__content-right`: 2 parrafos de contexto

---

### 2.2 PRODUCTOS (Dinamicos)

```astro
<!-- PRODUCTOS DINAMICOS -->
<section class="categories" id="[categoria-slug]">
  <div class="container">
    <div class="section-header">
      <h2 class="section-title">Tipos de [Categoria]</h2>
      <p class="section-subtitle">Selecciona un tipo para conocer especificaciones tecnicas y solicitar cotizacion</p>
    </div>
    <div class="categories__grid">
      {productos.map((producto) => (
        <article class="category-card">
          <div class="category-card__image" role="img" aria-label={producto.data.title}></div>
          <div class="category-card__body">
            <h3 class="category-card__title">{producto.data.title}</h3>
            <p class="category-card__sub">{producto.data.description}</p>
            <ul class="category-card__products">
              {producto.data.material && <li class="category-card__product">{producto.data.material}</li>}
              {producto.data.flujo && <li class="category-card__product">{producto.data.flujo}</li>}
              {producto.data.certificaciones && producto.data.certificaciones.length > 0 && <li class="category-card__product">Certificaciones: {producto.data.certificaciones.join(', ')}</li>}
              <li class="category-card__product">Marca: {producto.data.marca}</li>
            </ul>
            <div class="category-card__ctas">
              <a href={`/productos/${producto.id}`} class="btn btn--primary btn--sm">Ver especificaciones</a>
              <a href="#cotizar" class="btn btn--outline btn--sm">Cotizar</a>
            </div>
          </div>
        </article>
      ))}
    </div>
  </div>
</section>
```

**Reglas:**
- Los productos vienen del content collection filtrados por `categoria`
- Cada card muestra: imagen placeholder, titulo, descripcion, specs, 2 CTAs
- El grid es responsivo (1 col mobile, 2 col tablet, 3 col desktop)
- El `id` de la seccion debe ser el slug de la categoria (ej: `id="monitores"`, `id="boquillas"`)

---

### 2.3 SERVICE-DETAILS (Especificaciones Expandidas)

```astro
<!-- PRODUCT DETAILS -->
<section class="service-details" aria-labelledby="service-details-title">
  <div class="container">
    <div class="section-header">
      <h2 id="service-details-title" class="section-title">Detalle de Cada Tipo de [Categoria]</h2>
    </div>

    <div class="service-detail" id="detalle-[slug]">
      <div class="service-detail__content">
        <h3 class="service-detail__title">[Nombre Producto] — [Subtitulo descriptivo]</h3>
        <p class="service-detail__text">[Descripcion detallada con <strong>keywords</strong> resaltadas. 3-4 oraciones explicando caracteristicas y beneficios principales.]</p>
        <ul class="service-detail__list">
          <li class="service-detail__list-item">[Especificacion 1]</li>
          <li class="service-detail__list-item">[Especificacion 2]</li>
          <li class="service-detail__list-item">[Especificacion 3]</li>
          <li class="service-detail__list-item">[Especificacion 4]</li>
          <li class="service-detail__list-item">[Especificacion 5]</li>
          <li class="service-detail__list-item">[Especificacion 6]</li>
        </ul>
        <a href="#cotizar" class="btn btn--primary">Cotizar [nombre producto]</a>
      </div>
      <div class="service-detail__image" role="img" aria-label="[Descripcion de imagen]"></div>
    </div>

    <!-- Repetir para cada producto de la categoria -->

  </div>
</section>
```

**Reglas:**
- Un `service-detail` por cada producto de la categoria
- Layout: 2 columnas (contenido izquierda, imagen derecha)
- `service-detail__text`: Usar `<strong>` para keywords importantes
- `service-detail__list`: Exactamente 6 especificaciones tecnicas
- `service-detail__image`: Placeholder gris hasta tener imagen real
- Cada detail tiene su propio CTA de cotizar

---

### 2.4 TRUST (Beneficios + Testimoniales)

```astro
<!-- TRUST -->
<section class="trust" aria-labelledby="trust-title">
  <div class="container">
    <div class="section-header">
      <h2 id="trust-title" class="section-title">Por Que Comprar [Categoria] en Gama de Mexico</h2>
      <p class="section-subtitle">Calidad certificada, inventario disponible y asesoria tecnica especializada</p>
    </div>
    <div class="trust__grid">
      <div class="trust__item">
        <h3 class="trust__item-title">[Beneficio 1]</h3>
        <p class="trust__item-desc">[Descripcion del beneficio en 2 oraciones]</p>
      </div>
      <!-- Repetir para 6 beneficios total -->
    </div>

    <div class="trust__testimonials-header">
      <h3 class="trust__testimonials-title">Lo que dicen nuestros clientes</h3>
      <p class="trust__testimonials-subtitle">Empresas de todo Mexico confian en nuestros [categoria]</p>
    </div>
    <div class="trust__testimonials">
      <blockquote class="testimonial">
        <div class="testimonial__stars" aria-label="5 estrellas">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
        <p class="testimonial__text">"[Testimonio detallado de 3-4 oraciones mencionando producto especifico, situacion y resultado]"</p>
        <div class="testimonial__author">
          <div class="testimonial__avatar"></div>
          <div class="testimonial__info">
            <span class="testimonial__name">[Titulo. Nombre Completo]</span>
            <span class="testimonial__role">[Cargo/Puesto]</span>
            <span class="testimonial__company">[Empresa/Organizacion, Ciudad]</span>
          </div>
        </div>
      </blockquote>
      <!-- Repetir para 9 testimoniales total -->
    </div>
  </div>
</section>
```

**Reglas:**
- `trust__grid`: Exactamente 6 beneficios
- `trust__testimonials`: Exactamente 9 testimoniales
- Cada testimonial debe mencionar un producto especifico de la categoria
- Usar variedad de industrias: construccion, petroquimica, gobierno, bomberos, etc.
- Testimoniales con nombres realistas y cargos profesionales

---

### 2.5 LEAD-CAPTURE (Formulario WhatsApp)

```astro
<!-- LEAD CAPTURE -->
<section class="lead-capture" id="cotizar" aria-labelledby="lead-title">
  <div class="container">
    <h2 id="lead-title" class="lead-capture__title">Cotiza tus [categoria] ahora</h2>
    <div class="lead-capture__bullets">
      <span class="lead-capture__bullet">Precios y disponibilidad en menos de 24 horas</span>
      <span class="lead-capture__bullet">Asesoria tecnica para seleccion del modelo correcto</span>
      <span class="lead-capture__bullet">Envios a toda la Republica Mexicana</span>
    </div>
    <form class="lead-capture__form" id="cotizar-form" aria-label="Formulario de cotizacion por WhatsApp">
      <input type="text" class="lead-capture__input" id="lead-nombre" name="nombre" placeholder="Nombre completo" required aria-label="Nombre completo" autocomplete="name">
      <input type="text" class="lead-capture__input" id="lead-contacto" name="contacto" placeholder="Telefono o Email" required aria-label="Telefono o correo electronico" autocomplete="tel">
      <select class="lead-capture__select" id="lead-equipo" name="tipo_equipo" required aria-label="Tipo de [categoria] que necesitas">
        <option value="" disabled selected>Tipo de [categoria]</option>
        <option value="[Producto 1]">[Producto 1 con descripcion corta]</option>
        <option value="[Producto 2]">[Producto 2 con descripcion corta]</option>
        <option value="[Producto 3]">[Producto 3 con descripcion corta]</option>
        <option value="[Producto 4]">[Producto 4 con descripcion corta]</option>
        <option value="Varios / proyecto completo">Varios tipos / proyecto completo</option>
        <option value="Asesoria para seleccion">Necesito asesoria para seleccionar</option>
        <option value="Otro">Otro (especificar)</option>
      </select>
      <button type="submit" class="btn btn--primary lead-capture__submit">Enviar por WhatsApp</button>
    </form>
    <p class="lead-capture__trust">Sin compromiso · Atencion personalizada · Te respondemos al instante</p>
    <p class="lead-capture__alt">Tambien puedes escribirnos directo: <a href="https://wa.me/5215565298240" target="_blank" rel="noopener">WhatsApp: 55 6529 8240</a> | Email: <a href="mailto:ventas@gamademexico.com">ventas@gamademexico.com</a></p>
  </div>
</section>
```

**Reglas:**
- Formulario inline (3 campos + boton en una linea en desktop)
- Select con todos los productos de la categoria + opciones genericas
- IDs obligatorios: `cotizar-form`, `lead-nombre`, `lead-contacto`, `lead-equipo`
- Fondo oscuro (color-secondary)

---

### 2.6 SEO-CONTENT

```astro
<!-- SEO CONTENT -->
<section class="seo-content" aria-labelledby="seo-title">
  <div class="container">
    <div class="seo-content__body">
      <h2 id="seo-title" class="seo-content__title">[Keyword Principal]: Guia Completa para [Objetivo]</h2>
      <p class="seo-content__text">[Parrafo 1: Contexto general, importancia del producto, keywords principales en <strong>]</p>
      <p class="seo-content__text">[Parrafo 2: Normativas aplicables, certificaciones, estandares como NFPA, UL, FM]</p>
      <p class="seo-content__text">[Parrafo 3: Catalogo de Gama de Mexico, tipos de productos, llamada a accion]</p>
    </div>
  </div>
</section>
```

**Reglas:**
- 3 parrafos largos (150-200 palabras cada uno)
- Densidad de keywords: 2-3% natural
- Mencionar certificaciones y normativas
- Incluir call to action hacia contacto

---

### 2.7 FAQ

```astro
<!-- FAQ -->
<section class="faq" id="faq" aria-labelledby="faq-title">
  <div class="container">
    <div class="section-header">
      <h2 id="faq-title" class="section-title">Preguntas Frecuentes sobre [Categoria]</h2>
      <p class="section-subtitle">Resolvemos las dudas mas comunes sobre tipos, especificaciones y seleccion</p>
    </div>
    <div class="faq__list">
      <div class="faq__item">
        <button class="faq__question" aria-expanded="false" aria-controls="faq-[cat]-1" id="faq-[cat]-q1">[Pregunta 1]<span class="faq__icon" aria-hidden="true">+</span></button>
        <div class="faq__answer" id="faq-[cat]-1" role="region" aria-labelledby="faq-[cat]-q1">
          <p>[Respuesta detallada con <strong>keywords</strong> resaltadas]</p>
        </div>
      </div>
      <!-- Repetir para 7 preguntas total -->
    </div>
  </div>
</section>
```

**Reglas:**
- Exactamente 7 preguntas frecuentes
- IDs unicos por categoria: `faq-[abreviacion]-1`, `faq-[abreviacion]-2`, etc.
- Respuestas detalladas (100-150 palabras cada una)
- Usar `<strong>` para keywords en respuestas
- Acordeon con accesibilidad (aria-expanded, aria-controls)

---

### 2.8 SCRIPT (Handler WhatsApp)

```astro
<script>
  // FAQ Accordion
  document.addEventListener('DOMContentLoaded', () => {
    const faqQuestions = document.querySelectorAll('.faq__question');

    faqQuestions.forEach(button => {
      button.addEventListener('click', () => {
        const expanded = button.getAttribute('aria-expanded') === 'true';

        // Close all other items
        faqQuestions.forEach(otherButton => {
          if (otherButton !== button) {
            otherButton.setAttribute('aria-expanded', 'false');
            const otherAnswer = document.getElementById(otherButton.getAttribute('aria-controls'));
            if (otherAnswer) otherAnswer.style.display = 'none';
          }
        });

        // Toggle current item
        button.setAttribute('aria-expanded', (!expanded).toString());
        const answer = document.getElementById(button.getAttribute('aria-controls'));
        if (answer) {
          answer.style.display = expanded ? 'none' : 'block';
        }
      });
    });

    // WhatsApp Form Handler
    const cotizarForm = document.getElementById('cotizar-form');
    if (cotizarForm) {
      cotizarForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nombre = (document.getElementById('lead-nombre') as HTMLInputElement)?.value || '';
        const contacto = (document.getElementById('lead-contacto') as HTMLInputElement)?.value || '';
        const tipoEquipo = (document.getElementById('lead-equipo') as HTMLSelectElement)?.value || '';

        const mensaje = `Hola, me interesa cotizar [CATEGORIA]:%0A%0ANombre: ${encodeURIComponent(nombre)}%0AContacto: ${encodeURIComponent(contacto)}%0ATipo: ${encodeURIComponent(tipoEquipo)}`;

        window.open(`https://wa.me/5215565298240?text=${mensaje}`, '_blank');
      });
    }
  });
</script>
```

**Reglas:**
- Script al final del archivo, despues del `</Layout>`
- Incluye handler de FAQ accordion
- Incluye handler de formulario WhatsApp
- Cambiar `[CATEGORIA]` en el mensaje de WhatsApp

---

## 3. Clases CSS del Sistema

### Contenedores
| Clase | Uso |
|-------|-----|
| `.container` | Contenedor principal con max-width |
| `.section-header` | Header de seccion con titulo y subtitulo |
| `.section-title` | Titulo H2 de seccion |
| `.section-subtitle` | Subtitulo de seccion |

### Hero
| Clase | Uso |
|-------|-----|
| `.hero` | Seccion hero principal |
| `.hero__content-left` | Columna izquierda (titulo, CTAs, proof) |
| `.hero__content-right` | Columna derecha (texto contextual) |
| `.hero__title` | Titulo H1 |
| `.hero__intro` | Parrafo introductorio |
| `.hero__ctas` | Contenedor de botones |
| `.hero__proof` | Barra de metricas |
| `.hero__proof-item` | Item individual de metrica |
| `.hero__proof-value` | Valor destacado de metrica |

### Productos (Category Cards)
| Clase | Uso |
|-------|-----|
| `.categories` | Seccion de productos (fondo gris) |
| `.categories__grid` | Grid de category cards |
| `.category-card` | Card de producto |
| `.category-card__image` | Imagen placeholder |
| `.category-card__body` | Contenido del card |
| `.category-card__title` | Titulo del producto |
| `.category-card__sub` | Descripcion corta |
| `.category-card__products` | Lista de especificaciones |
| `.category-card__product` | Item de especificacion |
| `.category-card__ctas` | Botones de accion |

### Service Details
| Clase | Uso |
|-------|-----|
| `.service-details` | Seccion de detalles |
| `.service-detail` | Bloque individual (2 columnas) |
| `.service-detail__content` | Columna de contenido |
| `.service-detail__title` | Titulo del detalle |
| `.service-detail__text` | Texto descriptivo |
| `.service-detail__list` | Lista de especificaciones |
| `.service-detail__list-item` | Item de especificacion |
| `.service-detail__image` | Imagen placeholder |

### Trust
| Clase | Uso |
|-------|-----|
| `.trust` | Seccion de confianza |
| `.trust__grid` | Grid de beneficios |
| `.trust__item` | Beneficio individual |
| `.trust__item-title` | Titulo del beneficio |
| `.trust__item-desc` | Descripcion del beneficio |
| `.trust__testimonials-header` | Header de testimoniales |
| `.trust__testimonials-title` | Titulo de testimoniales |
| `.trust__testimonials-subtitle` | Subtitulo de testimoniales |
| `.trust__testimonials` | Grid de testimoniales |

### Testimoniales
| Clase | Uso |
|-------|-----|
| `.testimonial` | Card de testimonial |
| `.testimonial__stars` | Estrellas (5) |
| `.testimonial__text` | Texto del testimonio |
| `.testimonial__author` | Contenedor de autor |
| `.testimonial__avatar` | Avatar placeholder |
| `.testimonial__info` | Info del autor |
| `.testimonial__name` | Nombre del autor |
| `.testimonial__role` | Cargo/puesto |
| `.testimonial__company` | Empresa y ubicacion |

### Lead Capture
| Clase | Uso |
|-------|-----|
| `.lead-capture` | Seccion de formulario |
| `.lead-capture__title` | Titulo del formulario |
| `.lead-capture__bullets` | Lista de beneficios |
| `.lead-capture__bullet` | Beneficio individual |
| `.lead-capture__form` | Formulario |
| `.lead-capture__input` | Campo de texto |
| `.lead-capture__select` | Campo select |
| `.lead-capture__submit` | Boton enviar |
| `.lead-capture__trust` | Texto de confianza |
| `.lead-capture__alt` | Contacto alternativo |

### SEO Content
| Clase | Uso |
|-------|-----|
| `.seo-content` | Seccion de contenido SEO |
| `.seo-content__body` | Contenedor del texto |
| `.seo-content__title` | Titulo de la seccion |
| `.seo-content__text` | Parrafos de contenido |

### FAQ
| Clase | Uso |
|-------|-----|
| `.faq` | Seccion de FAQ |
| `.faq__list` | Lista de preguntas |
| `.faq__item` | Pregunta individual |
| `.faq__question` | Boton de pregunta |
| `.faq__icon` | Icono +/- |
| `.faq__answer` | Respuesta (oculta por defecto) |

### Botones
| Clase | Uso |
|-------|-----|
| `.btn` | Boton base |
| `.btn--primary` | Boton principal (rojo) |
| `.btn--outline` | Boton con borde |
| `.btn--sm` | Boton pequeno |

---

## 4. Plantilla Base

Ver archivo de referencia: `src/pages/mangueras-contra-incendios.astro`

Este archivo contiene la implementacion completa y correcta de todas las secciones.

---

## 5. Checklist de Validacion

Antes de considerar una pagina de categoria completa, verificar:

### Estructura
- [ ] Todas las 8 secciones presentes en orden correcto
- [ ] Layout base importado correctamente
- [ ] Content collection filtrada por categoria
- [ ] Meta title y description configurados

### Hero
- [ ] H1 con keyword principal
- [ ] 2 CTAs (Cotizar + WhatsApp)
- [ ] 4 items de proof
- [ ] 2 parrafos en content-right

### Productos
- [ ] Seccion usa clase `.categories` (no `.products`)
- [ ] Header usa `.section-header`, `.section-title`, `.section-subtitle`
- [ ] Grid usa `.categories__grid`
- [ ] Cards usan `.category-card` con estructura completa
- [ ] Links a paginas individuales de producto

### Service Details
- [ ] Un detalle por cada producto de la categoria
- [ ] Layout 2 columnas (contenido + imagen)
- [ ] 6 especificaciones por producto
- [ ] CTA de cotizar en cada detalle

### Trust
- [ ] 6 beneficios en grid
- [ ] 9 testimoniales con estructura completa
- [ ] Estrellas con HTML entities (&#9733;)
- [ ] Avatar placeholder en cada testimonial

### Lead Capture
- [ ] Formulario inline con 3 campos
- [ ] IDs correctos: cotizar-form, lead-nombre, lead-contacto, lead-equipo
- [ ] Select con productos de la categoria
- [ ] Texto de confianza y contacto alternativo

### SEO Content
- [ ] 3 parrafos largos con keywords
- [ ] Menciones a certificaciones y normativas
- [ ] Strong tags en keywords importantes

### FAQ
- [ ] 7 preguntas frecuentes
- [ ] IDs unicos por categoria
- [ ] Accesibilidad completa (aria attributes)
- [ ] Respuestas detalladas con strong tags

### Script
- [ ] Handler de FAQ accordion
- [ ] Handler de formulario WhatsApp
- [ ] Mensaje de WhatsApp con categoria correcta

### Sin estilos inline
- [ ] No hay bloque `<style>` en el archivo
- [ ] Todas las clases vienen del CSS global

---

## Categorias del Sitio

| Categoria | Archivo | Slug content |
|-----------|---------|--------------|
| Monitores | monitores-contra-incendios.astro | monitores |
| Boquillas | boquillas-contra-incendios.astro | boquillas |
| Mangueras | mangueras-contra-incendios.astro | mangueras |
| Valvulas | valvulas-contra-incendios.astro | valvulas |
| Conexiones | conexiones-herrajes-contra-incendios.astro | conexiones |
| Gabinetes | gabinetes-hidrantes-contra-incendios.astro | gabinetes |

---

## Notas Importantes

1. **No usar estilos inline**: Todo el CSS esta en `src/styles/global.css`
2. **Accesibilidad**: Usar aria-labels, roles y landmarks
3. **SEO**: Keywords en H1, H2, strong tags, meta tags
4. **Consistencia**: Todas las paginas deben verse identicas en estructura
5. **Imagenes**: Usar placeholders hasta tener assets reales
6. **WhatsApp**: Numero fijo: 5215565298240

---

## 6. Optimizacion SEO con NeuronWriter

### 6.1 Configuracion

El proyecto cuenta con integracion a NeuronWriter API para optimizacion SEO basada en datos.

**Credenciales:**
```
API Key: n-454030e38cf527b3a257b7780b9a4c1c
Project ID: 56bfecc8c4642d6b
Proyecto: gamademexico.com
```

**Script de analisis:** `scripts/neuronwriter-seo.py`

### 6.2 Flujo de Trabajo SEO

Para cada pagina de categoria, seguir este proceso:

#### Paso 1: Crear Query en NeuronWriter

1. Ir a https://app.neuronwriter.com/project/view/56bfecc8c4642d6b
2. Crear nueva query con la keyword principal de la categoria
3. Esperar ~60 segundos a que se procese el analisis
4. Copiar el Query ID de la URL (ej: `87f2e3c5d13e379f`)

**Queries por categoria:**
| Categoria | Keyword Principal | Query ID |
|-----------|-------------------|----------|
| Monitores | monitores contra incendios elkhart brass en mexico | 87f2e3c5d13e379f |
| Boquillas | boquillas contra incendios | [pendiente] |
| Mangueras | mangueras contra incendios | [pendiente] |
| Valvulas | valvulas contra incendios | [pendiente] |
| Conexiones | conexiones contra incendios | [pendiente] |
| Gabinetes | gabinetes contra incendios | [pendiente] |

#### Paso 2: Obtener Recomendaciones

```bash
# Ver recomendaciones SEO de NeuronWriter
python3 scripts/neuronwriter-seo.py -q QUERY_ID -r
```

Esto muestra:
- Keywords para Title tag
- Keywords para H1
- Keywords basicas con frecuencia recomendada
- Keywords extendidas para incluir
- Preguntas a responder (Topic Matrix)
- Competidor a superar

#### Paso 3: Analizar Contenido Actual

```bash
# Analizar pagina contra recomendaciones
python3 scripts/neuronwriter-seo.py -q QUERY_ID -f src/pages/[archivo].astro
```

Esto genera un reporte con:
- Conteo de palabras vs objetivo
- Score de keywords basicas
- Keywords faltantes
- Score SEO estimado (objetivo: superar al competidor)

#### Paso 4: Optimizar Contenido

Aplicar las keywords faltantes en estas ubicaciones:

| Ubicacion | Keywords a incluir |
|-----------|-------------------|
| `<title>` | keyword principal, marca, mexico |
| `description` | venta, precio, keyword principal, certificaciones |
| `hero__title` (H1) | keyword principal exacta |
| `hero__intro` | keywords en `<strong>`, variaciones |
| `hero__content-right` | keywords extendidas, contexto |
| `service-detail__text` | keywords tecnicas, especificaciones |
| `seo-content__text` | keywords long-tail, preguntas del topic matrix |
| FAQ respuestas | keywords en `<strong>`, variaciones |

### 6.3 Keywords Obligatorias por Categoria

Estas keywords comerciales deben aparecer en TODAS las paginas de categoria:

| Keyword | Frecuencia | Ubicacion sugerida |
|---------|------------|-------------------|
| venta | 5-15x | hero, trust, seo-content |
| precio | 5-15x | hero, service-details, lead-capture |
| cotizacion | 5-10x | lead-capture, trust, CTAs |
| proveedor | 3-5x | hero, seo-content |
| profesional | 3-5x | trust, testimoniales |
| experiencia | 2-4x | trust, seo-content |
| certificacion / certificado | 5-10x | hero, service-details, FAQ |
| disponibilidad | 2-4x | trust, lead-capture |
| mexico | 5-10x | title, hero, seo-content |

### 6.4 Keywords Tecnicas por Categoria

#### Monitores
- monitor contra incendio, tipo corazon, cuello de cisne
- 1250 GPM, 2000 GPM, rotacion horizontal, 360°
- laton forjado, bronce, construccion robusta
- Copperhead, 8593, FM, UL Listed
- supresion de incendios, combatir incendios
- control preciso, alta capacidad, chorro de agua

#### Boquillas
- boquilla contra incendios, tipo pistola, turbo jet
- flujo seleccionable, presion constante
- construccion XD, aluminio forjado
- Phantom, Select-O-Matic, Chief XD
- GPM, patron de chorro, niebla

#### Mangueras
- manguera contra incendios, doble forro, sintetico
- NFPA 1961, 300 PSI, resistencia termica
- Millhose, Blindex, succion, forestal
- diametro, rollos, conexiones

#### Valvulas
- valvula contra incendios, compuerta, mariposa
- OSY, globo, retencion
- bridada, roscada, ranurada
- UL, FM, presion de trabajo

#### Conexiones
- conexiones contra incendios, herrajes
- storz, siamesa, wye
- adaptadores, coples, reducciones
- bronce, aluminio, compatible

#### Gabinetes
- gabinete contra incendios, hidrante
- 30ME, empotrado, sobreponer
- estacion de manguera, vidrio
- NOM, proteccion civil

### 6.5 Estructura SEO-CONTENT Optimizada

La seccion SEO-CONTENT debe seguir esta estructura para maximo impacto:

```astro
<!-- SEO CONTENT -->
<section class="seo-content" aria-labelledby="seo-title">
  <div class="container">
    <div class="seo-content__body">
      <h2 id="seo-title" class="seo-content__title">
        Venta de [Categoria] [Marca]: Guia Completa de Especificaciones Tecnicas y Precio en Mexico
      </h2>

      <!-- Parrafo 1: Introduccion + Keywords comerciales -->
      <p class="seo-content__text">
        Los <strong>[categoria]</strong> son equipos profesionales de [funcion principal]
        disenados para [aplicacion]. Como <strong>proveedor autorizado [Marca]</strong>,
        ofrecemos venta de [productos] con precio competitivo y cotizacion inmediata...
        [incluir: supresion de incendios, combatir incendios, situaciones de emergencia]
      </p>

      <!-- Parrafo 2: Tipos y aplicaciones + Keywords tecnicas -->
      <h3>Tipos de [Categoria] y Aplicaciones Industriales</h3>
      <p class="seo-content__text">
        La seleccion entre <strong>[tipo 1] y [tipo 2]</strong> depende de la aplicacion
        especifica... [incluir especificaciones como GPM, PSI, materiales, modelos]
        El precio varia segun capacidad y certificaciones...
      </p>

      <!-- Parrafo 3: Certificaciones -->
      <h3>Certificaciones FM y UL para Equipos de Proteccion Contra Incendios</h3>
      <p class="seo-content__text">
        Las <strong>certificaciones FM y UL</strong> garantizan que los [categoria]
        cumplen estandares rigurosos... [incluir: resistencia a la corrosion,
        construccion robusta, alta calidad, especificaciones tecnicas]
      </p>

      <!-- Parrafo 4: Materiales y calidad -->
      <h3>Construccion en [Material]: Alta Calidad y Durabilidad</h3>
      <p class="seo-content__text">
        Los [categoria] [Marca] se distinguen por su <strong>construccion robusta</strong>...
        [incluir: resistencia a la corrosion, flujo eficiente, alta capacidad, confiable]
      </p>

      <!-- Parrafo 5: Por que comprarnos -->
      <h3>Por Que Comprar [Categoria] con Gama de Mexico?</h3>
      <p class="seo-content__text">
        Nuestra <strong>experiencia de mas de 15 anos</strong> como proveedor de equipos
        de proteccion contra incendios nos permite ofrecer: venta con garantia, precio
        competitivo, cotizacion inmediata, stock permanente, asesoria profesional...
      </p>
    </div>
  </div>
</section>
```

### 6.6 Metricas Objetivo

| Metrica | Objetivo | Como medir |
|---------|----------|------------|
| Palabras totales | 2,000+ | Script SEO |
| Score SEO | 70+ | Script SEO vs NeuronWriter |
| Keywords basicas | 80%+ presentes | Script SEO |
| Keywords extendidas | 50%+ presentes | Script SEO |
| Superar competidor | Content Score mayor | NeuronWriter |

### 6.7 Comandos Utiles

```bash
# Listar todas las queries del proyecto
python3 scripts/neuronwriter-seo.py --list-queries

# Ver recomendaciones de una query
python3 scripts/neuronwriter-seo.py -q QUERY_ID -r

# Analizar pagina contra query
python3 scripts/neuronwriter-seo.py -q QUERY_ID -f src/pages/archivo.astro

# Listar proyectos disponibles
python3 scripts/neuronwriter-seo.py --list-projects
```

### 6.8 Checklist SEO por Pagina

- [ ] Query creada en NeuronWriter
- [ ] Recomendaciones obtenidas y documentadas
- [ ] Title tag optimizado con keywords
- [ ] Meta description con venta, precio, certificaciones
- [ ] H1 con keyword principal exacta
- [ ] Hero intro con keywords en `<strong>`
- [ ] Service details con keywords tecnicas
- [ ] SEO-CONTENT con 5 parrafos y H3s
- [ ] FAQ respuestas con keywords
- [ ] Score SEO >= 70
- [ ] Palabras >= 2,000
- [ ] Supera content score del competidor

---

*Documento creado para homologar el desarrollo de paginas de categoria en Gama de Mexico.*
