import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const productos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/productos' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    categoria: z.enum([
      'monitores',
      'boquillas',
      'mangueras',
      'valvulas',
      'conexiones-herrajes',
      'gabinetes-hidrantes',
    ]),
    subcategoria: z.string().optional(),
    imagen: z.string().optional(),
    galeria: z.array(z.string()).optional(),
    certificaciones: z.array(z.string()).optional(),
    flujo: z.string().optional(),
    material: z.string().optional(),
    marca: z.string().default('Elkhart Brass'),
    modelo: z.string().optional(),
    precioReferencia: z.string().optional(),
    destacado: z.boolean().default(false),
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

    // --- Imágenes ---
    imagen: z.string().optional(),
    imagenAlt: z.string().optional(),
    imagenOg: z.string().optional(), // 1200x630 para redes sociales

    // --- Características del artículo ---
    destacado: z.boolean().default(false),
    draft: z.boolean().default(false),

    // --- Contenido relacionado ---
    productosRelacionados: z.array(z.string()).optional(), // slugs de productos
    articulosRelacionados: z.array(z.string()).optional(), // slugs de artículos

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
// Empresas Certificadas - Directorio SEO de empresas con sistemas contra incendios
// =============================================================================
const empresasCertificadas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/empresas-certificadas' }),
  schema: z.object({
    // --- Información básica ---
    nombre: z.string(),
    slug: z.string(),
    descripcion: z.string().optional(),

    // --- Categoría del negocio ---
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

    // --- Ubicación ---
    direccion: z.string(),
    colonia: z.string(),
    ciudad: z.string(),
    estado: z.string(),
    codigoPostal: z.string(),
    latitud: z.number(),
    longitud: z.number(),

    // --- Contacto ---
    telefono: z.string().optional(),
    email: z.string().email().optional(),
    website: z.string().url().optional(),

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

    // --- Certificación ---
    fechaCertificacion: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    fechaVencimiento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    certificacionVigente: z.boolean().default(true),
    certificadoPor: z.string().default('Gama de México'),

    // --- Media ---
    imagen: z.string().optional(),
    galeria: z.array(z.string()).optional(),

    // --- SEO ---
    destacado: z.boolean().default(false),
    verificado: z.boolean().default(false),

    // --- Metadata ---
    fechaRegistro: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
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
