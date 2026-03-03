// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';
import rehypeEwwwImages from './src/lib/markdown/rehype-ewww-images.mjs';

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

    // Configuración de build optimizada
    build: {
          format: 'file',
          inlineStylesheets: 'auto',
    },

    // Integraciones SEO
    integrations: [
          sitemap({
                  filter: (page) => !page.includes('/404'),
                  lastmod: new Date(),
                  serialize(item) {
                        const url = item.url.replace('https://gamademexico.com', '');
                        // Homepage — máxima prioridad
                        if (url === '' || url === '/') {
                              item.priority = 1.0;
                              item.changefreq = 'daily';
                        }
                        // Páginas de categoría principal — alta prioridad
                        else if (/^\/(monitores|boquillas|mangueras|valvulas|conexiones-herrajes|gabinetes-hidrantes)-contra-incendios$/.test(url)
                              || url === '/equipos'
                              || url === '/contacto') {
                              item.priority = 0.9;
                              item.changefreq = 'weekly';
                        }
                        // Subcategorías y servicios
                        else if (url.startsWith('/gabinetes/') || url.startsWith('/servicios/')) {
                              item.priority = 0.8;
                              item.changefreq = 'weekly';
                        }
                        // Productos individuales y empresas certificadas
                        else if (url.startsWith('/productos/') || url.startsWith('/empresas-certificadas')) {
                              item.priority = 0.7;
                              item.changefreq = 'monthly';
                        }
                        // Blog
                        else if (url.startsWith('/blog')) {
                              item.priority = 0.6;
                              item.changefreq = 'monthly';
                        }
                        // Páginas legales y otras
                        else {
                              item.priority = 0.4;
                              item.changefreq = 'yearly';
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
