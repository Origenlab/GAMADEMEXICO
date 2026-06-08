# Blog AQUEON — monitorescontraincendios.com

5 artículos profesionales + índice del blog, replicando el diseño exacto del sitio (tokens, header, navbar con dropdowns, footer, cards, CTA, botón WhatsApp).

## Estructura

```
aqueon-blog/
├── css/blog.css                 ← hoja de estilos autocontenida (réplica del design system + estilos de blog)
└── blog/
    ├── index.html               ← índice con cards (1 destacado + 4)
    ├── monitores-fijos-vs-portatiles-como-elegir/index.html
    ├── nfpa-15-proteccion-tanques-diseno-monitores/index.html
    ├── monitores-automaticos-deteccion-ir-ia/index.html
    ├── mantenimiento-monitores-nfpa-25/index.html
    └── certificaciones-fm-ul-pemex-nom-002/index.html
```

## Despliegue

Subir las carpetas `blog/` y `css/blog.css` a la **raíz** del sitio. URLs finales:

- `https://monitorescontraincendios.com/blog/`
- `https://monitorescontraincendios.com/blog/<slug>/`

Notas:
- Los links internos son absolutos (`/blog/...`, `/#cotizar`). Para previsualizar en local usar un servidor (`python3 -m http.server` desde `aqueon-blog/`); abrir el archivo con doble clic rompe los links absolutos, no el diseño.
- `blog.css` es autocontenido: no depende de `styles.css` del sitio y no genera conflictos al convivir con él.
- Canonical apunta a `monitorescontraincendios.com`. Si prefieren consolidar SEO en `aqueon.com.mx` (como hace el home), buscar/reemplazar el dominio en los 6 HTML.
- Imágenes: las cards y heros usan placeholders con icono (mismo patrón del home). Para usar fotos reales, reemplazar los `<div class="image-placeholder">` por `<img>`.

## SEO incluido por artículo

- Title ≤ 60-65 caracteres y meta description optimizada
- Canonical, Open Graph, Twitter Card
- JSON-LD: Article + BreadcrumbList + FAQPage (4 preguntas por artículo)
- Breadcrumbs visibles, H1 único, jerarquía H2/H3, tablas técnicas, listados, callouts
- Interlinking: sidebar + sección de artículos relacionados (3 por página)
