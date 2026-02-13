const RAW_CDN_BASE = (import.meta.env.PUBLIC_EWWW_CDN_BASE ?? '').trim();

function sanitizeCdnBase(base: string): string {
  if (!base) return '';
  return base.replace(/\/+$/, '');
}

function isAbsoluteUrl(value: string): boolean {
  return /^(?:[a-z][a-z\d+\-.]*:)?\/\//i.test(value);
}

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

export function toAbsoluteImageUrl(path: string, siteUrl: string): string {
  const cdnOrPath = withImageCdn(path) ?? path;
  if (isAbsoluteUrl(cdnOrPath)) {
    return cdnOrPath;
  }

  const normalizedSite = siteUrl.replace(/\/+$/, '');
  const normalizedPath = cdnOrPath.startsWith('/') ? cdnOrPath : `/${cdnOrPath}`;
  return `${normalizedSite}${normalizedPath}`;
}
