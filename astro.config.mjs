// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

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
                  changefreq: 'weekly',
                  priority: 0.7,
                  lastmod: new Date(),
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
});
