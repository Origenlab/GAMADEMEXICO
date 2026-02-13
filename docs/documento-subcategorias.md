# Guía de Diseño: Páginas de Subcategoría

> Documento de referencia para crear y mantener páginas de subcategoría de productos en Gama de México.

---

## Tabla de Contenidos

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura de Archivos](#arquitectura-de-archivos)
3. [Estructura del Componente](#estructura-del-componente)
4. [Secciones del Layout](#secciones-del-layout)
5. [Widgets del Sidebar](#widgets-del-sidebar)
6. [Sistema de Filtrado](#sistema-de-filtrado)
7. [Patrones de Contenido](#patrones-de-contenido)
8. [Estilos CSS](#estilos-css)
9. [Integración WhatsApp](#integración-whatsapp)
10. [Checklist de Implementación](#checklist-de-implementación)
11. [Variables por Categoría](#variables-por-categoría)

---

## Resumen Ejecutivo

Las páginas de subcategoría son landing pages especializadas que:
- Filtran productos de una categoría principal por tipo/característica
- Ofrecen navegación lateral entre subcategorías relacionadas
- Integran múltiples puntos de conversión (CTAs)
- Proporcionan información técnica específica del tipo de producto

**Archivo de referencia:** `/src/pages/boquillas/tipo-pistola.astro`

---

## Arquitectura de Archivos

### Estructura de Carpetas

```
src/pages/
├── [categoria]-contra-incendios.astro    # Página principal de categoría
└── [categoria]/                           # Carpeta de subcategorías
    ├── [subcategoria-1].astro
    ├── [subcategoria-2].astro
    └── [subcategoria-n].astro
```

### Categorías Implementadas

| Categoría | Ruta Base | Subcategorías |
|-----------|-----------|---------------|
| Monitores | `/monitores/` | tipo-corazon, cuello-cisne, certificado-fm, ul-listed |
| Boquillas | `/boquillas/` | tipo-pistola, turbo-jet, industrial, certificada |
| Mangueras | `/mangueras/` | *pendiente* |
| Válvulas | `/valvulas/` | *pendiente* |
| Conexiones | `/conexiones/` | *pendiente* |
| Gabinetes | `/gabinetes/` | *pendiente* |

### Nomenclatura de Archivos

```
/[categoria]/[tipo-producto].astro

Ejemplos:
- /boquillas/tipo-pistola.astro
- /monitores/cuello-cisne.astro
- /mangueras/doble-chaqueta.astro
```

---

## Estructura del Componente

### Frontmatter (Script)

```astro
---
import Layout from '../../layouts/Base.astro';
import { getCollection } from 'astro:content';

// 1. OBTENER PRODUCTOS DE LA CATEGORÍA
const todosProductos = (await getCollection('productos', ({ data }) =>
  data.categoria === '[CATEGORIA]'
)).sort((a, b) => a.data.orden - b.data.orden);

// 2. FILTRAR POR SUBCATEGORÍA
const productosSubcategoria = todosProductos.filter(p =>
  p.id.includes('[KEYWORD]') ||
  p.data.title.toLowerCase().includes('[KEYWORD]') ||
  p.data.title.toLowerCase().includes('[KEYWORD_ALT]')
);

// 3. OBTENER OTROS PRODUCTOS PARA RELACIONADOS
const otrosProductos = todosProductos.filter(p => !productosSubcategoria.includes(p));

// 4. DEFINIR SUBCATEGORÍAS PARA NAVEGACIÓN
const subcategorias = [
  {
    slug: '[slug-actual]',
    nombre: '[Nombre Subcategoría]',
    descripcion: '[Descripción corta]',
    activo: true  // Solo true para la página actual
  },
  {
    slug: '[otro-slug]',
    nombre: '[Otra Subcategoría]',
    descripcion: '[Descripción]',
    activo: false
  },
  // ... más subcategorías
];
---
```

### Variables a Personalizar

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `[CATEGORIA]` | Nombre de categoría en colección | `'boquillas'` |
| `[KEYWORD]` | Palabra clave para filtrar | `'pistola'` |
| `[KEYWORD_ALT]` | Keyword alternativo (inglés) | `'pistol'` |

---

## Secciones del Layout

### 1. Breadcrumb

```astro
<nav class="breadcrumb" aria-label="Navegación de migas de pan">
  <div class="container">
    <ol class="breadcrumb__list">
      <li class="breadcrumb__item">
        <a href="/" class="breadcrumb__link">Inicio</a>
      </li>
      <li class="breadcrumb__item">
        <a href="/[categoria]-contra-incendios" class="breadcrumb__link">
          [Categoría] Contra Incendios
        </a>
      </li>
      <li class="breadcrumb__item breadcrumb__item--active" aria-current="page">
        [Nombre Subcategoría]
      </li>
    </ol>
  </div>
</nav>
```

### 2. Hero Section

```astro
<section class="hero" aria-labelledby="hero-title">
  <div class="container">
    <div class="hero__content-left">
      <!-- Badge de categoría padre -->
      <p class="hero__badge-subcat">[Categoría] Contra Incendios</p>

      <!-- Título H1 con keyword principal -->
      <h1 id="hero-title" class="hero__title">
        [Nombre Subcategoría] con [Característica Principal]
      </h1>

      <!-- Introducción SEO-optimizada -->
      <p class="hero__intro">
        <strong>Venta de [producto]</strong> con [característica].
        Equipos con <strong>[especificación técnica]</strong>,
        [más características] y construcción en <strong>[material]</strong>.
        Disponibles [modelos/series] de [marca].
      </p>

      <!-- CTAs principales -->
      <div class="hero__ctas">
        <a href="#cotizar" class="btn btn--primary">Cotizar [Producto]</a>
        <a href="https://wa.me/5215565298240" class="btn btn--outline"
           target="_blank" rel="noopener">Escribir por WhatsApp</a>
      </div>

      <!-- Proof items (4 elementos) -->
      <div class="hero__proof">
        <div class="hero__proof-item">
          <span class="hero__proof-value">[VALOR]</span> [unidad]
        </div>
        <div class="hero__proof-item">
          <span class="hero__proof-value">[VALOR]</span> [descripción]
        </div>
        <div class="hero__proof-item">
          <span class="hero__proof-value">[VALOR]</span> [descripción]
        </div>
        <div class="hero__proof-item">
          <span class="hero__proof-value">[Marca]</span> Distribuidor autorizado
        </div>
      </div>
    </div>

    <div class="hero__content-right">
      <!-- Párrafos informativos adicionales -->
      <p>[Descripción detallada del producto y sus beneficios]</p>
      <p>[Información sobre distribuidor, inventario, entrega]</p>
    </div>
  </div>
</section>
```

### 3. Main Content + Sidebar Layout

```astro
<section class="subcat-content">
  <div class="container">
    <div class="subcat-layout">

      <!-- MAIN CONTENT (LEFT - 1fr) -->
      <main class="subcat-main">
        <!-- Catalog Header -->
        <!-- Products Grid -->
        <!-- Empty State -->
        <!-- Tech Info -->
        <!-- CTA Final -->
      </main>

      <!-- SIDEBAR (RIGHT - 320px) -->
      <aside class="subcat-sidebar">
        <!-- Navigation Widget -->
        <!-- Quick Contact Widget -->
        <!-- Features Widget -->
        <!-- Brands Widget -->
        <!-- Applications Widget -->
        <!-- Related Links Widget -->
      </aside>

    </div>
  </div>
</section>
```

### 4. Catalog Header

```astro
<div class="catalog-header">
  <div class="catalog-header__text">
    <h2 class="catalog-header__title">Catálogo de [Subcategoría]</h2>
    <p class="catalog-header__desc">Selecciona el producto que mejor se adapte a tu operación</p>
  </div>
  <div class="catalog-header__count">
    <span class="catalog-header__number">{productosSubcategoria.length}</span>
    <span class="catalog-header__label">
      producto{productosSubcategoria.length !== 1 ? 's' : ''}
    </span>
  </div>
</div>
```

### 5. Products Grid

```astro
<div class="categories__grid">
  {productosSubcategoria.map((producto) => (
    <article class="category-card">
      <div class="category-card__image"
           style={producto.data.imagen ?
             `background-image: url(${producto.data.imagen}); background-size: cover; background-position: center;` : ''}
           role="img"
           aria-label={producto.data.title}>
      </div>
      <div class="category-card__body">
        <span class="category-card__brand">{producto.data.marca}</span>
        <h3 class="category-card__title">{producto.data.title}</h3>
        <p class="category-card__sub">{producto.data.description}</p>
        <ul class="category-card__products">
          {producto.data.flujo &&
            <li class="category-card__product">
              <strong>Caudal:</strong> {producto.data.flujo}
            </li>}
          {producto.data.material &&
            <li class="category-card__product">
              <strong>Material:</strong> {producto.data.material}
            </li>}
          {producto.data.certificaciones?.length > 0 &&
            <li class="category-card__product">
              <strong>Certificaciones:</strong> {producto.data.certificaciones.join(', ')}
            </li>}
        </ul>
        <div class="category-card__ctas">
          <a href={`/productos/${producto.id}`} class="btn btn--primary btn--sm">
            Ver especificaciones
          </a>
          <a href="#cotizar" class="btn btn--outline btn--sm">Cotizar</a>
        </div>
      </div>
    </article>
  ))}
</div>
```

### 6. Empty State

```astro
{productosSubcategoria.length === 0 && (
  <div class="catalog-empty">
    <div class="catalog-empty__icon">🔍</div>
    <h3 class="catalog-empty__title">Próximamente más opciones</h3>
    <p class="catalog-empty__text">
      Estamos agregando más productos de [subcategoría] de diferentes marcas.
      Mientras tanto, solicita una cotización personalizada.
    </p>
    <a href="#cotizar" class="btn btn--primary">Solicitar Cotización</a>
  </div>
)}
```

### 7. Technical Info Grid

```astro
<div class="tech-info">
  <h3 class="tech-info__title">Especificaciones Técnicas Generales</h3>
  <div class="tech-info__grid">
    <div class="tech-info__item">
      <span class="tech-info__label">Caudal típico</span>
      <span class="tech-info__value">[RANGO] GPM</span>
    </div>
    <div class="tech-info__item">
      <span class="tech-info__label">Presión de trabajo</span>
      <span class="tech-info__value">[RANGO] PSI</span>
    </div>
    <!-- 4-6 items típicamente -->
  </div>
</div>
```

### 8. CTA Final

```astro
<div class="subcat-cta-final">
  <div class="subcat-cta-final__content">
    <h3 class="subcat-cta-final__title">¿No encuentras el modelo que necesitas?</h3>
    <p class="subcat-cta-final__desc">
      Tenemos acceso al catálogo completo de [Marca].
      Contáctanos para opciones adicionales y configuraciones especiales.
    </p>
  </div>
  <a href="#cotizar" class="btn btn--primary">Solicitar Cotización</a>
</div>
```

### 9. Related Products Section

```astro
<section class="related-section">
  <div class="container">
    <div class="section-header">
      <h2 class="section-title">Otros Tipos de [Categoría]</h2>
      <p class="section-subtitle">Explora más opciones según tu aplicación específica</p>
    </div>
    <div class="categories__grid">
      {otrosProductos.slice(0, 3).map((producto) => (
        <!-- Misma estructura de category-card -->
      ))}
    </div>
  </div>
</section>
```

### 10. Lead Capture Form

```astro
<section class="lead-capture" id="cotizar" aria-labelledby="lead-title">
  <div class="container">
    <h2 id="lead-title" class="lead-capture__title">Cotiza [Subcategoría]</h2>
    <div class="lead-capture__bullets">
      <span class="lead-capture__bullet">Precio y disponibilidad en menos de 24 horas</span>
      <span class="lead-capture__bullet">Asesoría para selección de modelo y [especificación]</span>
      <span class="lead-capture__bullet">Envíos a toda la República Mexicana</span>
    </div>
    <form class="lead-capture__form" id="cotizar-form">
      <input type="text" class="lead-capture__input" id="lead-nombre"
             name="nombre" placeholder="Nombre completo" required
             aria-label="Nombre completo" autocomplete="name">
      <input type="text" class="lead-capture__input" id="lead-contacto"
             name="contacto" placeholder="Teléfono o Email" required
             aria-label="Teléfono o correo electrónico" autocomplete="tel">
      <input type="number" class="lead-capture__input" id="lead-cantidad"
             name="cantidad" placeholder="Cantidad requerida" min="1"
             aria-label="Cantidad requerida">
      <button type="submit" class="btn btn--primary lead-capture__submit">
        Enviar por WhatsApp
      </button>
    </form>
    <p class="lead-capture__trust">
      Sin compromiso · Atención personalizada · Te respondemos al instante
    </p>
    <p class="lead-capture__alt">
      También puedes escribirnos directo:
      <a href="https://wa.me/5215565298240" target="_blank" rel="noopener">
        WhatsApp: 55 6529 8240
      </a>
    </p>
  </div>
</section>
```

---

## Widgets del Sidebar

### Widget 1: Navegación de Subcategorías

```astro
<div class="sidebar-widget">
  <div class="sidebar-widget__header">
    <h3 class="sidebar-widget__title">Tipos de [Categoría]</h3>
  </div>
  <nav class="sidebar-nav" aria-label="Navegación de subcategorías">
    <ul class="sidebar-nav__list">
      {subcategorias.map((subcat) => (
        <li class="sidebar-nav__item">
          <a
            href={`/[categoria]/${subcat.slug}`}
            class={`sidebar-nav__link ${subcat.activo ? 'sidebar-nav__link--active' : ''}`}
            aria-current={subcat.activo ? 'page' : undefined}
          >
            <span class="sidebar-nav__indicator"></span>
            <span class="sidebar-nav__text">{subcat.nombre}</span>
          </a>
        </li>
      ))}
    </ul>
  </nav>
  <a href="/[categoria]-contra-incendios" class="sidebar-widget__back">
    ← Ver todos los/las [categoría]
  </a>
</div>
```

### Widget 2: Cotización Rápida (Highlight)

```astro
<div class="sidebar-widget sidebar-widget--highlight">
  <div class="sidebar-widget__header">
    <h3 class="sidebar-widget__title">Cotización Rápida</h3>
  </div>
  <p class="sidebar-widget__text">
    Respuesta en menos de 24 horas con precio y disponibilidad.
  </p>
  <div class="sidebar-widget__actions">
    <a href="#cotizar" class="btn btn--primary btn--sm btn--full">
      Solicitar Cotización
    </a>
    <a href="https://wa.me/5215565298240" class="btn btn--outline btn--sm btn--full"
       target="_blank" rel="noopener">
      WhatsApp Directo
    </a>
  </div>
  <p class="sidebar-widget__phone">
    Tel: <a href="tel:+525565298240">55 6529 8240</a>
  </p>
</div>
```

### Widget 3: Características Clave

```astro
<div class="sidebar-widget">
  <div class="sidebar-widget__header">
    <h3 class="sidebar-widget__title">Características Clave</h3>
  </div>
  <ul class="sidebar-features">
    <li class="sidebar-features__item">
      <span class="sidebar-features__icon">✓</span>
      <span class="sidebar-features__text">[Característica 1]</span>
    </li>
    <li class="sidebar-features__item">
      <span class="sidebar-features__icon">✓</span>
      <span class="sidebar-features__text">[Característica 2]</span>
    </li>
    <!-- 4-6 características típicamente -->
  </ul>
</div>
```

### Widget 4: Marcas Disponibles

```astro
<div class="sidebar-widget">
  <div class="sidebar-widget__header">
    <h3 class="sidebar-widget__title">Marcas Disponibles</h3>
  </div>
  <ul class="sidebar-brands">
    <li class="sidebar-brands__item">Elkhart Brass</li>
    <li class="sidebar-brands__item">Akron Brass</li>
    <li class="sidebar-brands__item">Task Force Tips</li>
  </ul>
  <p class="sidebar-widget__note">Pregunta por otras marcas</p>
</div>
```

### Widget 5: Aplicaciones

```astro
<div class="sidebar-widget">
  <div class="sidebar-widget__header">
    <h3 class="sidebar-widget__title">Aplicaciones</h3>
  </div>
  <ul class="sidebar-apps">
    <li class="sidebar-apps__item">Bomberos</li>
    <li class="sidebar-apps__item">Brigadas industriales</li>
    <li class="sidebar-apps__item">Protección civil</li>
    <li class="sidebar-apps__item">Plantas químicas</li>
    <li class="sidebar-apps__item">Refinerías</li>
    <li class="sidebar-apps__item">Aeropuertos</li>
  </ul>
</div>
```

### Widget 6: Productos Relacionados

```astro
<div class="sidebar-widget">
  <div class="sidebar-widget__header">
    <h3 class="sidebar-widget__title">Productos Relacionados</h3>
  </div>
  <ul class="sidebar-links">
    <li><a href="/monitores-contra-incendios" class="sidebar-links__link">
      Monitores Contra Incendios
    </a></li>
    <li><a href="/mangueras-contra-incendios" class="sidebar-links__link">
      Mangueras Contra Incendios
    </a></li>
    <!-- Excluir la categoría actual -->
  </ul>
</div>
```

---

## Sistema de Filtrado

### Estrategia de Filtrado

Los productos se filtran usando tres criterios combinados con OR:

```javascript
const productosSubcategoria = todosProductos.filter(p =>
  // 1. Por ID del archivo (slug)
  p.id.includes('[keyword]') ||

  // 2. Por título en español
  p.data.title.toLowerCase().includes('[keyword]') ||

  // 3. Por título en inglés (opcional)
  p.data.title.toLowerCase().includes('[keyword_en]')
);
```

### Keywords por Subcategoría

#### Monitores
| Subcategoría | Keywords |
|--------------|----------|
| tipo-corazon | `corazon`, `corazón`, `heart` |
| cuello-cisne | `cisne`, `gooseneck`, `cuello` |
| certificado-fm | `fm`, `factory mutual` |
| ul-listed | `ul`, `listed` |

#### Boquillas
| Subcategoría | Keywords |
|--------------|----------|
| tipo-pistola | `pistola`, `pistol`, `grip` |
| turbo-jet | `turbo`, `jet`, `penetración` |
| industrial | `industrial`, `high-flow` |
| certificada | `ul`, `fm`, `certificad` |

---

## Patrones de Contenido

### SEO Title Pattern

```
[Subcategoría] | [Característica Principal] | Gama de México
```

**Ejemplo:**
```
Boquillas Tipo Pistola | Control Ergonómico Seleccionable | Gama de México
```

### SEO Description Pattern

```
Venta de [producto] con [característica]. Serie [modelo], caudales [rango] GPM,
[material]. [Marca] distribuidor autorizado. México.
```

**Ejemplo:**
```
Venta de boquillas tipo pistola con empuñadura ergonómica y flujo seleccionable.
Serie Phantom XD, caudales 15-250 GPM, aluminio forjado.
Elkhart Brass distribuidor autorizado. México.
```

### Hero Intro Pattern

```
<strong>Venta de [producto]</strong> con [característica principal].
Equipos con <strong>[especificación técnica]</strong>, [lista de características]
y construcción en <strong>[material]</strong>.
Disponibles en series <strong>[modelos]</strong> de [marca].
```

### Proof Items Pattern

Siempre 4 items:
1. **Rango principal** - Caudal, presión, o capacidad
2. **Característica destacada** - Número de patrones, posiciones, etc.
3. **Diferenciador técnico** - Serie, certificación, tecnología
4. **Credibilidad** - "Distribuidor autorizado" de la marca principal

---

## Estilos CSS

### Layout Grid

```css
.subcat-layout {
  display: grid;
  grid-template-columns: 1fr 320px;  /* Main + Sidebar */
  gap: 2.5rem;
  align-items: start;
}

@media (max-width: 1024px) {
  .subcat-layout {
    grid-template-columns: 1fr;
  }

  .subcat-sidebar {
    order: -1;  /* Sidebar arriba en móvil */
  }
}
```

### Sidebar Sticky

```css
.subcat-sidebar {
  position: sticky;
  top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

@media (max-width: 1024px) {
  .subcat-sidebar {
    position: static;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
}
```

### Widget Highlight

```css
.sidebar-widget--highlight {
  background: linear-gradient(135deg, var(--color-secondary) 0%, #1a365d 100%);
  color: white;
  border: none;
}
```

### Estilos Completos

Los estilos están incluidos en cada archivo `.astro` dentro del tag `<style>`.
Referencia completa en: `/src/pages/boquillas/tipo-pistola.astro` líneas 349-862.

---

## Integración WhatsApp

### Script del Formulario

```javascript
document.addEventListener('DOMContentLoaded', () => {
  const cotizarForm = document.getElementById('cotizar-form');
  if (cotizarForm) {
    cotizarForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nombre = (document.getElementById('lead-nombre') as HTMLInputElement)?.value || '';
      const contacto = (document.getElementById('lead-contacto') as HTMLInputElement)?.value || '';
      const cantidad = (document.getElementById('lead-cantidad') as HTMLInputElement)?.value || '1';

      // PERSONALIZAR este mensaje por subcategoría
      const mensaje = `Hola, me interesa cotizar [NOMBRE SUBCATEGORÍA]:%0A%0A` +
        `Nombre: ${encodeURIComponent(nombre)}%0A` +
        `Contacto: ${encodeURIComponent(contacto)}%0A` +
        `Cantidad: ${encodeURIComponent(cantidad)} unidades`;

      window.open(`https://wa.me/5215565298240?text=${mensaje}`, '_blank');
    });
  }
});
```

### Número de WhatsApp

```
+52 1 55 6529 8240
Formato URL: 5215565298240
```

---

## Checklist de Implementación

### Pre-desarrollo

- [ ] Identificar keywords de filtrado para la subcategoría
- [ ] Verificar que existen productos que coincidan con el filtro
- [ ] Definir 4 proof items relevantes
- [ ] Listar características clave (4-6)
- [ ] Definir especificaciones técnicas generales (4-6)
- [ ] Identificar aplicaciones principales (6-8)

### Desarrollo

- [ ] Crear archivo en `/src/pages/[categoria]/[subcategoria].astro`
- [ ] Configurar frontmatter con filtros correctos
- [ ] Personalizar contenido del Hero
- [ ] Actualizar proof items
- [ ] Configurar array de subcategorías (marcar activo correcto)
- [ ] Personalizar widgets del sidebar
- [ ] Actualizar especificaciones técnicas
- [ ] Personalizar mensaje de WhatsApp en script
- [ ] Configurar SEO (title, description)

### Post-desarrollo

- [ ] Verificar filtrado de productos funciona
- [ ] Probar responsive en móvil
- [ ] Verificar navegación entre subcategorías
- [ ] Probar formulario de WhatsApp
- [ ] Verificar breadcrumb correcto
- [ ] Actualizar interlinking en:
  - [ ] Header.astro (mega-menu)
  - [ ] Footer.astro
  - [ ] Página principal de categoría
  - [ ] index.astro
  - [ ] equipos.astro

---

## Variables por Categoría

### Boquillas

```javascript
// Subcategorías
const subcategorias = [
  { slug: 'tipo-pistola', nombre: 'Boquilla Tipo Pistola', descripcion: 'Control ergonómico seleccionable' },
  { slug: 'turbo-jet', nombre: 'Boquilla Turbo Jet', descripcion: 'Máximo alcance y penetración' },
  { slug: 'industrial', nombre: 'Boquilla Industrial', descripcion: 'Alto caudal para industria' },
  { slug: 'certificada', nombre: 'Boquilla Certificada', descripcion: 'Certificación UL/FM' },
];

// Categoría en colección
data.categoria === 'boquillas'

// Ruta base
/boquillas/

// Página padre
/boquillas-contra-incendios
```

### Monitores

```javascript
const subcategorias = [
  { slug: 'tipo-corazon', nombre: 'Monitor Tipo Corazón', descripcion: 'Alcance medio, versátil' },
  { slug: 'cuello-cisne', nombre: 'Monitor Cuello de Cisne', descripcion: 'Alcance extendido' },
  { slug: 'certificado-fm', nombre: 'Monitor Certificado FM', descripcion: 'Factory Mutual approved' },
  { slug: 'ul-listed', nombre: 'Monitor UL Listed', descripcion: 'Underwriters Laboratories' },
];

data.categoria === 'monitores'
/monitores/
/monitores-contra-incendios
```

### Mangueras (Propuesta)

```javascript
const subcategorias = [
  { slug: 'doble-chaqueta', nombre: 'Manguera Doble Chaqueta', descripcion: 'Máxima durabilidad' },
  { slug: 'chaqueta-sencilla', nombre: 'Manguera Chaqueta Sencilla', descripcion: 'Uso ligero' },
  { slug: 'succion', nombre: 'Manguera de Succión', descripcion: 'Abastecimiento de agua' },
  { slug: 'alta-presion', nombre: 'Manguera Alta Presión', descripcion: 'Para carretes' },
];

data.categoria === 'mangueras'
/mangueras/
/mangueras-contra-incendios
```

### Válvulas (Propuesta)

```javascript
const subcategorias = [
  { slug: 'angulares', nombre: 'Válvula Angular', descripcion: 'Conexión en ángulo' },
  { slug: 'rectas', nombre: 'Válvula Recta', descripcion: 'Flujo directo' },
  { slug: 'siamesas', nombre: 'Conexión Siamesa', descripcion: 'División de flujo' },
  { slug: 'reductoras', nombre: 'Válvula Reductora', descripcion: 'Control de presión' },
];

data.categoria === 'valvulas'
/valvulas/
/valvulas-contra-incendios
```

---

## Notas de Mantenimiento

### Agregar Nueva Subcategoría

1. Crear archivo `.astro` en la carpeta de categoría
2. Actualizar array `subcategorias` en TODAS las páginas de esa categoría
3. Agregar enlaces en Header, Footer, páginas relacionadas

### Cambiar Diseño Global

1. Modificar el archivo de referencia primero
2. Propagar cambios a todas las subcategorías
3. Considerar extraer a componente compartido si hay muchas páginas

### Agregar Nueva Categoría

1. Crear carpeta en `/src/pages/`
2. Definir subcategorías
3. Crear cada archivo de subcategoría
4. Actualizar navegación global

---

## Recursos

- **Archivo de referencia:** `/src/pages/boquillas/tipo-pistola.astro`
- **Estilos globales:** `/src/styles/global.css`
- **Layout base:** `/src/layouts/Base.astro`
- **Colección de productos:** `/src/content/productos/`

---

*Última actualización: Febrero 2025*
*Versión: 1.0*
