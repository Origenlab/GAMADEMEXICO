import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const productos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/productos' }),
  schema: z.object({
    // Límites SEO (auditoría 2026): Google trunca titles >~70 y descriptions >~165
    title: z.string()
      .min(15, 'Título muy corto para SEO')
      .max(70, 'Título muy largo: se trunca en resultados de búsqueda'),
    description: z.string()
      .min(80, 'Descripción muy corta para meta description')
      .max(165, 'Descripción muy larga: Google la trunca'),
    // H1 separado del title — permite títulos H1 más largos que el meta title
    // Si se omite, se usa el title (backward compatible)
    h1: z.string().optional(),
    categoria: z.enum([
      'monitores',
      'boquillas',
      'mangueras',
      'valvulas',
      'conexiones-herrajes',
      'gabinetes-hidrantes',
    ]),
    subcategoria: z.string().optional(),
    // Obligatoria: los 225 productos la definen; evita OG/cards rotos (auditoría 2026)
    imagen: z.string().startsWith('/img/', 'La ruta debe iniciar con /img/'),
    galeria: z.array(z.string()).optional(),
    certificaciones: z.array(z.string()).optional(),
    flujo: z.string().optional(),
    material: z.string().optional(),
    marca: z.string().default('Elkhart Brass'),
    modelo: z.string().optional(),
    sku: z.string().optional(),
    precioReferencia: z.string().optional(),
    aplicaciones: z.array(z.string()).default([]),
    productosRelacionados: z.array(z.string()).default([]),
    articulosRelacionados: z.array(z.string()).default([]),
    destacado: z.boolean().default(false),
    // Control editorial: false = noindex (para productos incompletos o sin stock)
    indexable: z.boolean().default(true),
    orden: z.number().default(0),
  }),
});

// =============================================================================
// Blog Collection - Schema optimizado para SEO y automatización n8n
// =============================================================================
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    // --- SEO Core (validaciones para títulos y descripciones óptimas) ---
    title: z.string()
      .min(20, 'Título muy corto para SEO')
      .max(70, 'Título muy largo para SEO'),
    description: z.string()
      .min(80, 'Descripción muy corta para SEO')
      .max(165, 'Descripción muy larga para SEO'),

    // --- Fechas (formato ISO para n8n) ---
    fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Usar formato YYYY-MM-DD').optional(),
    fechaActualizacion: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),

    // --- Categoría (enum validado - DEBE coincidir con productos del sitio) ---
    categoria: z.enum([
      'monitores',
      'boquillas',
      'mangueras',
      'valvulas',
      'conexiones-herrajes',
      'gabinetes-hidrantes',
      'equipos-contra-incendios',
      'equipos-bomberos',
    ]).default('monitores'),

    // --- Tags ---
    tags: z.array(z.string()).default([]),

    // --- Autor (acepta string o objeto para flexibilidad) ---
    autor: z.union([
      z.string(),
      z.object({
        nombre: z.string(),
        cargo: z.string().optional(),
        imagen: z.string().optional(),
      }),
    ]).default('Equipo Técnico Gama de México'),

    // --- Imágenes (obligatorias: los 84 posts las definen; auditoría 2026) ---
    imagen: z.string().startsWith('/img/', 'La ruta debe iniciar con /img/'),
    imagenAlt: z.string().min(10, 'Alt descriptivo de mínimo 10 caracteres'),
    imagenOg: z.string().optional(), // 1200x630 para redes sociales

    // --- H1 separado del title (backward compatible — usa title si se omite) ---
    h1: z.string().optional(),

    // --- Características del artículo ---
    destacado: z.boolean().default(false),
    draft: z.boolean().default(false),

    // --- Tipo editorial (define intención de búsqueda del artículo) ---
    tipo: z.enum([
      'informativo',
      'tecnico',
      'normativo',
      'comercial',
      'guia',
      'comparativa',
    ]).optional(),

    // --- Contenido relacionado ---
    productosRelacionados: z.array(z.string()).default([]), // slugs de productos
    articulosRelacionados: z.array(z.string()).default([]), // slugs de artículos

    // --- SEO Avanzado ---
    canonical: z.string().url().optional(),
    noindex: z.boolean().default(false),

    // --- Metadatos calculados (opcionales, se pueden calcular en runtime) ---
    tiempoLectura: z.number().optional(), // minutos
  }),
});

const categorias = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/categorias' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    metaTitle: z.string(),
    metaDescription: z.string(),
    slug: z.string(),
    imagen: z.string().optional(),
    orden: z.number().default(0),
  }),
});

// =============================================================================
// Empresas Certificadas — Casos de estudio anónimos (reestructurado FASE 1 · 2026-07-01)
// Sin datos de identidad: sin razón social real, sin dirección, sin contacto.
// Framing: "empresas que hemos apoyado" por sector + estado.
// =============================================================================
const empresasCertificadas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/empresas-certificadas' }),
  schema: z.object({
    // --- Identificación anónima ---
    nombre: z.string(),           // e.g. "Planta Automotriz Premium OEM — San Luis Potosí"
    slug: z.string(),
    descripcion: z.string().optional(),

    // --- Sector y giro ---
    sector: z.string().optional(), // e.g. "Industria Automotriz"
    giro: z.enum([
      'hotel',
      'restaurante',
      'oficina',
      'almacen',
      'hospital',
      'escuela',
      'industria',
      'comercio',
      'residencial',
      'otro'
    ]),

    // --- Ubicación (solo ciudad y estado — sin dirección específica) ---
    ciudad: z.string(),
    estado: z.string(),

    // --- Sistema contra incendios ---
    tipoSistema: z.array(z.enum([
      'rociadores-automaticos',
      'red-hidrantes',
      'extintores',
      'deteccion-alarma',
      'fm200',
      'co2',
      'espuma',
      'gabinetes',
      'senalizacion'
    ])),

    // --- Tipo y año de proyecto ---
    tipoProyecto: z.enum([
      'instalacion',
      'auditoria',
      'mantenimiento',
      'proyecto-integral',
      'consultoria',
    ]).default('instalacion'),
    // z.coerce.string: acepta tanto "2024" (string) como 2024 (number) en YAML
    anioProyecto: z.coerce.string().optional(),

    // --- Media ---
    imagen: z.string().optional(),
    galeria: z.array(z.string()).optional(),

    // --- SEO ---
    destacado: z.boolean().default(false),
    noindex: z.boolean().default(false),
  }),
});

// =============================================================================
// Hidrantes - Directorio de hidrantes públicos y privados
// =============================================================================
const hidrantes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/hidrantes' }),
  schema: z.object({
    // --- Identificación ---
    id: z.string(),
    tipo: z.enum(['publico', 'privado']),

    // --- Ubicación ---
    ubicacionDescripcion: z.string(),
    colonia: z.string(),
    ciudad: z.string(),
    estado: z.string(),
    codigoPostal: z.string(),
    latitud: z.number(),
    longitud: z.number(),

    // --- Especificaciones técnicas ---
    presionPsi: z.number().optional(),
    diametroConexion: z.string().optional(), // Flexible para diferentes formatos
    colorCodigo: z.enum(['rojo', 'amarillo', 'verde', 'azul']).optional(),

    // --- Estado operativo ---
    estadoOperativo: z.enum(['operativo', 'mantenimiento', 'fuera-servicio']),
    ultimaInspeccion: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    proximaInspeccion: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),

    // --- Media ---
    imagen: z.string().optional(),

    // --- Metadata ---
    notas: z.string().optional(),
    reportadoPor: z.string().optional(),
    fechaRegistro: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  }),
});

export const collections = { productos, blog, categorias, empresasCertificadas, hidrantes };
