// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';
import rehypeEwwwImages from './src/lib/markdown/rehype-ewww-images.mjs';

/**
 * El tipo `changefreq` del sitemap es el enum EnumChangefreq; en .mjs con
 * @ts-check se castea cada literal mediante JSDoc para satisfacerlo.
 * @typedef {import('sitemap').EnumChangefreq} EnumChangefreq
 */

const env = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');
const ewwwCdnBase = env.PUBLIC_EWWW_CDN_BASE || process.env.PUBLIC_EWWW_CDN_BASE || '';
const isProduction = (process.env.NODE_ENV ?? 'development') === 'production';
const markdownCdnBase = isProduction ? ewwwCdnBase : '';

// https://astro.build/config
// Configuración optimizada para SEO con dominio personalizado
export default defineConfig({
    // URL base del sitio para dominio personalizado
                              site: 'https://gamademexico.com',

    // Sin base path para dominio personalizado (raíz del dominio)
    base: '/',

    // Generación de sitio estático
    output: 'static',

    // Sin trailing slash para URLs limpias
    trailingSlash: 'never',

    // ==========================================================================
    // Redirects 301 — reclasificación de artículos del blog (2026-07-01)
    // Cuando un artículo cambia de categoría, su URL cambia.
    // Estos redirects preservan el juice SEO y evitan 404 en URLs indexadas.
    // ==========================================================================
    redirects: {
      // bombas-contra-incendios: valvulas → gabinetes-hidrantes
      '/blog/valvulas-contra-incendios/bombas-contra-incendios-seleccion-instalacion-nfpa-20':
        '/blog/gabinetes-hidrantes-contra-incendios/bombas-contra-incendios-seleccion-instalacion-nfpa-20',

      // detector-humo-calor: monitores → gabinetes-hidrantes
      '/blog/monitores-contra-incendios/detector-humo-calor-sistemas-deteccion-incendios-nfpa-72':
        '/blog/gabinetes-hidrantes-contra-incendios/detector-humo-calor-sistemas-deteccion-incendios-nfpa-72',

      // equipos automotriz: mangueras → equipos-contra-incendios
      '/blog/mangueras-contra-incendios/equipos-contra-incendios-industria-automotriz-mexico':
        '/blog/equipos-contra-incendios/equipos-contra-incendios-industria-automotriz-mexico',

      // plan-emergencia: mangueras → gabinetes-hidrantes
      '/blog/mangueras-contra-incendios/plan-emergencia-contra-incendios-empresa-nom-002-guia':
        '/blog/gabinetes-hidrantes-contra-incendios/plan-emergencia-contra-incendios-empresa-nom-002-guia',

      // data-centers: valvulas → equipos-contra-incendios
      '/blog/valvulas-contra-incendios/proteccion-contra-incendios-data-centers-centros-datos-mexico':
        '/blog/equipos-contra-incendios/proteccion-contra-incendios-data-centers-centros-datos-mexico',

      // mantenimiento-extintores: monitores → equipos-contra-incendios
      '/blog/monitores-contra-incendios/empresas-mantenimiento-extintores-proveedores-equipos-certificados':
        '/blog/equipos-contra-incendios/empresas-mantenimiento-extintores-proveedores-equipos-certificados',
    },

    // Prefetch de navegación: precarga enlaces visibles en viewport (FASE 2 · 2026-07-01).
    // prefetchAll: true fue desactivado — con 722 páginas prefetcheaba todo el sitio
    // al cargar, incrementando el consumo de datos en mobile innecesariamente.
    // defaultStrategy: 'viewport' prefetchea solo los links que entran al viewport.
    prefetch: {
          prefetchAll: false,
          defaultStrategy: 'viewport',
    },

    // Configuración de build optimizada
    build: {
          format: 'file',
          inlineStylesheets: 'auto',
    },

    // Integraciones SEO
    integrations: [
          sitemap({
                  filter: (page) => !page.includes('/404'),
                  serialize(item) {
                        const url = item.url.replace('https://gamademexico.com', '');
                        // Homepage — máxima prioridad
                        if (url === '' || url === '/') {
                              item.priority = 1.0;
                              item.changefreq = /** @type {EnumChangefreq} */ ('daily');
                        }
                        // Páginas de categoría principal — alta prioridad
                        else if (/^\/(monitores|boquillas|mangueras|valvulas|conexiones-herrajes|gabinetes-hidrantes)-contra-incendios$/.test(url)
                              || url === '/equipos'
                              || url === '/contacto') {
                              item.priority = 0.9;
                              item.changefreq = /** @type {EnumChangefreq} */ ('weekly');
                        }
                        // Subcategorías y servicios
                        else if (url.startsWith('/gabinetes/') || url.startsWith('/servicios/')) {
                              item.priority = 0.8;
                              item.changefreq = /** @type {EnumChangefreq} */ ('weekly');
                        }
                        // Productos individuales y empresas certificadas
                        else if (url.startsWith('/productos/') || url.startsWith('/empresas-certificadas')) {
                              item.priority = 0.7;
                              item.changefreq = /** @type {EnumChangefreq} */ ('monthly');
                        }
                        // Blog
                        else if (url.startsWith('/blog')) {
                              item.priority = 0.6;
                              item.changefreq = /** @type {EnumChangefreq} */ ('monthly');
                        }
                        // Páginas legales y otras
                        else {
                              item.priority = 0.4;
                              item.changefreq = /** @type {EnumChangefreq} */ ('yearly');
                        }
                        return item;
                  },
          }),
        ],

    // Optimizaciones de rendimiento
    vite: {
          build: {
                  cssMinify: true,
          },
    },

    // Configuración de compresión
    compressHTML: true,

    // Optimización automática de imágenes embebidas en Markdown (blog y contenido)
    markdown: {
          rehypePlugins: [[rehypeEwwwImages, { cdnBase: markdownCdnBase }]],
    },
});
