# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## CDN de imagenes (EWWW)

Para servir imagenes por el CDN de EWWW, define esta variable de entorno:

```bash
PUBLIC_EWWW_CDN_BASE=https://TU-CDN-EWWW
```

Ejemplo comun de EWWW Easy IO:

```bash
PUBLIC_EWWW_CDN_BASE=https://i0.wp.com/gamademexico.com
```

Con esa variable activa, las rutas locales de imagen (`/img/...`) se reescriben automaticamente al CDN en HTML y en JSON-LD.

## Auditoria de imagenes

Ejecuta este comando para revisar formatos, pesos, dimensiones, rutas faltantes y archivos no usados:

```bash
npm run audit:images
```

Si quieres usarlo en CI y fallar solo cuando haya referencias rotas, puedes ejecutar:

```bash
node scripts/audit-images.mjs --fail-on-missing
```
