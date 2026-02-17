const SRCSET_WIDTHS = [480, 768, 1024, 1280];
const DEFAULT_SIZES = '(max-width: 1024px) 100vw, 860px';

function sanitizeCdnBase(base) {
  if (!base) return '';
  return base.replace(/\/+$/, '');
}

function withImageCdn(path, cdnBase) {
  if (!cdnBase || !path.startsWith('/')) {
    return path;
  }
  return `${cdnBase}${path}`;
}

function buildOptimizedUrl(path, width, cdnBase) {
  const [basePath, queryString = ''] = path.split('?');
  const params = new URLSearchParams(queryString);
  params.set('w', String(width));
  params.set('quality', '82');
  params.set('strip', 'all');
  return `${withImageCdn(basePath, cdnBase)}?${params.toString()}`;
}

function optimizeMarkdownImage(node, cdnBase) {
  const properties = node.properties ?? {};
  const rawSrc = typeof properties.src === 'string' ? properties.src : '';
  const [baseSrc] = rawSrc.split('?');

  if (!baseSrc.startsWith('/img/')) {
    return;
  }

  properties.src = buildOptimizedUrl(baseSrc, 1280, cdnBase);
  properties.srcset = SRCSET_WIDTHS.map((width) => `${buildOptimizedUrl(baseSrc, width, cdnBase)} ${width}w`).join(', ');
  properties.sizes = DEFAULT_SIZES;
  properties.loading = properties.loading || 'lazy';
  properties.decoding = 'async';

  if (typeof properties.alt !== 'string' || !properties.alt.trim()) {
    properties.alt = 'Imagen técnica de protección contra incendios';
  }

  node.properties = properties;
}

function walk(node, cdnBase) {
  if (!node || typeof node !== 'object') return;

  if (node.type === 'element' && node.tagName === 'img') {
    optimizeMarkdownImage(node, cdnBase);
  }

  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      walk(child, cdnBase);
    }
  }
}

export default function rehypeEwwwImages(options = {}) {
  const configuredCdnBase = sanitizeCdnBase(
    (typeof options.cdnBase === 'string' ? options.cdnBase : process.env.PUBLIC_EWWW_CDN_BASE ?? '').trim()
  );

  return (tree) => {
    walk(tree, configuredCdnBase);
  };
}
