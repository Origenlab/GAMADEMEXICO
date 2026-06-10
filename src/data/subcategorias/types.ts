// =============================================================================
// Tipos de la capa de datos de subcategorías de producto
// Fuente de verdad para src/pages/[seccion]/[subcategoria].astro
// Los .generated.json fueron extraídos 1:1 de las 33 páginas estáticas
// originales mediante scripts/extract-subcategorias.mjs (refactor 2026).
// =============================================================================

/** Segmento de URL de primer nivel (no siempre coincide con la categoría de la colección). */
export type Seccion =
  | 'boquillas'
  | 'monitores'
  | 'mangueras'
  | 'valvulas'
  | 'conexiones'
  | 'gabinetes';

/** Categoría tal como existe en la colección `productos`. */
export type CategoriaProducto =
  | 'boquillas'
  | 'monitores'
  | 'mangueras'
  | 'valvulas'
  | 'conexiones-herrajes'
  | 'gabinetes-hidrantes';

export interface HeroMetric {
  valor: string;
  texto: string;
}

export interface SubcatNavItem {
  slug: string;
  nombre: string;
  descripcion: string;
}

export interface FAQItem {
  pregunta: string;
  respuesta: string;
}

export interface TechInfoItem {
  label: string;
  value: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface SubcategoryDef {
  seccion: Seccion;
  /** Segmento final de la URL: /{seccion}/{slug} */
  slug: string;
  categoria: CategoriaProducto;
  /** Reglas de selección de productos del catálogo. */
  filter: {
    /** Coincidencia por `data.subcategoria` (OR entre valores). */
    subcategorias: string[];
    /** Si está presente, el `id` del producto debe contener alguno de estos fragmentos. */
    idIncludes?: string[];
  };
  meta: {
    title: string;
    description: string;
  };
  hero: {
    title: string;
    intro: string;
    badge: string;
    metrics: HeroMetric[];
    primaryText: string;
    primaryLink: string;
    secondaryText: string;
    secondaryLink: string;
    /** HTML de los párrafos del hero (contenido propio, estático y de confianza). */
    contentHtml: string;
  };
  /** Datos para buildProductCategorySchema (JSON-LD Product). */
  schema: {
    name: string;
    description: string;
    image: string;
    url: string;
    category: string;
    brand?: string;
  };
  breadcrumb: BreadcrumbItem[];
  catalog: {
    title: string;
    desc: string;
  };
  /** Estado vacío del catálogo. Solo presente en las páginas que lo tenían originalmente. */
  empty?: {
    title: string;
    text: string;
    buttonText: string;
  };
  techInfo: {
    title: string;
    items: TechInfoItem[];
  };
  /** Bloque CTA al final del catálogo. Solo presente en las páginas que lo tenían originalmente. */
  ctaFinal?: {
    title: string;
    desc: string;
    buttonText: string;
  };
  sidebar: {
    navTitulo: string;
    baseUrl: string;
    backLinkHref: string;
    backLinkTexto: string;
    certificaciones: Array<{ siglas: string; nombre: string }>;
    marcas?: string[];
    aplicaciones?: string[];
    productosRelacionados: Array<{ href: string; nombre: string }>;
    subcategorias: SubcatNavItem[];
  };
  related: {
    titulo: string;
    subtitulo: string;
    maxProductos?: number;
    verTodosLink: string;
    verTodosTexto: string;
  };
  cotizacion: {
    titulo: string;
    tipoEquipo: string;
    pagina: string;
  };
  faqs: FAQItem[];
}
