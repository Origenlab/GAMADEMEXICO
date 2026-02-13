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

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    fecha: z.string(),
    autor: z.string().default('Gama de Mexico'),
    imagen: z.string().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
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
