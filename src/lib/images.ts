// =============================================================================
// EWWW ExactDN Image Optimization Helper
// Documentación: https://docs.ewww.io/article/44-introduction-to-exactdn
// API basada en Photon: https://developer.wordpress.com/docs/photon/api/
// =============================================================================

const RAW_CDN_BASE = (import.meta.env.PUBLIC_EWWW_CDN_BASE ?? '').trim();

// -----------------------------------------------------------------------------
// Tipos e interfaces
// -----------------------------------------------------------------------------

export interface ImageOptimizationOptions {
  /** Ancho en pixels */
  width?: number;
  /** Alto en pixels */
  height?: number;
  /** Calidad de compresión (20-100, default: 82) */
  quality?: number;
  /** Modo de ajuste: 'fit' mantiene aspecto, 'resize' recorta exacto */
  fit?: 'contain' | 'cover' | 'resize';
  /** Eliminar metadatos EXIF ('all' | 'none') */
  strip?: 'all' | 'none';
  /** Factor de zoom para pantallas retina (1, 1.5, 2) */
  zoom?: number;
}

export interface ResponsiveImageOptions extends ImageOptimizationOptions {
  /** Anchos para generar srcset */
  widths?: number[];
  /** Tamaños para atributo sizes */
  sizes?: string;
}

// Anchos estándar para srcset responsivo
const DEFAULT_SRCSET_WIDTHS = [320, 480, 640, 768, 1024, 1280, 1536];

// -----------------------------------------------------------------------------
// Funciones internas
// -----------------------------------------------------------------------------

function sanitizeCdnBase(base: string): string {
  if (!base) return '';
  return base.replace(/\/+$/, '');
}

function isAbsoluteUrl(value: string): boolean {
  return /^(?:[a-z][a-z\d+\-.]*:)?\/\//i.test(value);
}

function buildQueryParams(options: ImageOptimizationOptions): string {
  const params: string[] = [];

  // Dimensiones con fit/resize
  if (options.width && options.height) {
    if (options.fit === 'resize' || options.fit === 'cover') {
      params.push(`resize=${options.width},${options.height}`);
    } else {
      params.push(`fit=${options.width},${options.height}`);
    }
  } else if (options.width) {
    params.push(`w=${options.width}`);
  } else if (options.height) {
    params.push(`h=${options.height}`);
  }

  // Calidad (default optimizado para web: 82)
  if (options.quality) {
    params.push(`quality=${Math.min(100, Math.max(20, options.quality))}`);
  }

  // Zoom para retina
  if (options.zoom && options.zoom > 1) {
    params.push(`zoom=${options.zoom}`);
  }

  // Strip metadatos (siempre quitar para mejor rendimiento)
  if (options.strip) {
    params.push(`strip=${options.strip}`);
  }

  return params.length > 0 ? `?${params.join('&')}` : '';
}

// -----------------------------------------------------------------------------
// Funciones públicas
// -----------------------------------------------------------------------------

/**
 * Obtiene URL de imagen con CDN ExactDN (sin optimización adicional)
 * Compatibilidad con código existente
 */
export function withImageCdn(path?: string): string | undefined {
  if (!path) return path;

  if (isAbsoluteUrl(path) || path.startsWith('data:')) {
    return path;
  }

  const cdnBase = sanitizeCdnBase(RAW_CDN_BASE);
  if (!cdnBase || !path.startsWith('/')) {
    return path;
  }

  return `${cdnBase}${path}`;
}

/**
 * Obtiene URL de imagen optimizada con ExactDN
 * Incluye parámetros de compresión, redimensionamiento y formato
 */
export function getOptimizedImageUrl(
  path: string,
  options: ImageOptimizationOptions = {}
): string {
  const baseUrl = withImageCdn(path) ?? path;
  const queryParams = buildQueryParams(options);

  // Si ya tiene query params, usar &
  if (baseUrl.includes('?')) {
    return `${baseUrl}&${queryParams.slice(1)}`;
  }

  return `${baseUrl}${queryParams}`;
}

/**
 * Genera srcset para imágenes responsivas
 * Optimizado para diferentes tamaños de pantalla
 */
export function generateSrcset(
  path: string,
  options: ResponsiveImageOptions = {}
): { srcset: string; sizes: string; src: string } {
  const widths = options.widths || DEFAULT_SRCSET_WIDTHS;
  const quality = options.quality || 82;

  const srcsetEntries = widths.map((w) => {
    const url = getOptimizedImageUrl(path, {
      width: w,
      quality,
      strip: 'all'
    });
    return `${url} ${w}w`;
  });

  // Imagen por defecto (mediana)
  const defaultWidth = widths[Math.floor(widths.length / 2)];
  const src = getOptimizedImageUrl(path, {
    width: defaultWidth,
    quality,
    strip: 'all'
  });

  // Sizes por defecto responsivo
  const sizes = options.sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';

  return {
    srcset: srcsetEntries.join(', '),
    sizes,
    src
  };
}

/**
 * Genera URL optimizada para imágenes de fondo CSS
 * Con calidad optimizada para fondos
 */
export function getBackgroundImageUrl(
  path: string,
  options: ImageOptimizationOptions = {}
): string {
  return getOptimizedImageUrl(path, {
    quality: options.quality || 75,
    strip: 'all',
    ...options
  });
}

/**
 * Genera URL optimizada para thumbnails/cards
 * Compresión agresiva para cargas rápidas
 */
export function getThumbnailUrl(
  path: string,
  width: number = 400,
  height?: number
): string {
  return getOptimizedImageUrl(path, {
    width,
    height,
    quality: 75,
    fit: height ? 'cover' : 'contain',
    strip: 'all'
  });
}

/**
 * Genera URL optimizada para imágenes hero/banner
 * Alta calidad para impacto visual
 */
export function getHeroImageUrl(
  path: string,
  width: number = 1920
): string {
  return getOptimizedImageUrl(path, {
    width,
    quality: 85,
    strip: 'all'
  });
}

/**
 * Genera URL optimizada para Open Graph/redes sociales
 * Dimensiones exactas 1200x630
 */
export function getOgImageUrl(path: string): string {
  return getOptimizedImageUrl(path, {
    width: 1200,
    height: 630,
    fit: 'cover',
    quality: 85,
    strip: 'all'
  });
}

/**
 * Convierte path a URL absoluta con CDN
 */
export function toAbsoluteImageUrl(path: string, siteUrl: string): string {
  const cdnOrPath = withImageCdn(path) ?? path;
  if (isAbsoluteUrl(cdnOrPath)) {
    return cdnOrPath;
  }

  const normalizedSite = siteUrl.replace(/\/+$/, '');
  const normalizedPath = cdnOrPath.startsWith('/') ? cdnOrPath : `/${cdnOrPath}`;
  return `${normalizedSite}${normalizedPath}`;
}

/**
 * Verifica si el CDN está configurado
 */
export function isCdnEnabled(): boolean {
  return sanitizeCdnBase(RAW_CDN_BASE).length > 0;
}
