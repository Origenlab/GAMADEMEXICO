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
    fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Usar formato YYYY-MM-DD'),
    fechaActualizacion: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),

    // --- Categoría (enum validado para consistencia) ---
    categoria: z.enum([
      'extintores',
      'sistemas-contraincendios',
      'normatividad',
      'seguridad-industrial',
      'senalizacion',
      'capacitacion',
      'mantenimiento',
      'productos',
    ]).default('productos'),

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

export const collections = { productos, blog, categorias };
