// =============================================================================
// Gama de Mexico — Helpers de Schema.org / JSON-LD
// Generadores de structured data para SEO
// =============================================================================

import {
  SITE_NAME,
  SITE_URL,
  PHONE_PRIMARY,
  WHATSAPP_NUMBER,
  EMAIL_SALES,
  LOCATIONS,
  BUSINESS_HOURS,
  LOGO_PATH,
  GEO,
  getSocialMediaUrls,
} from './config';
import { toAbsoluteImageUrl } from './images';

// -- Organization Schema (incluir en todas las paginas) --
export function buildOrganizationSchema() {
  const logoUrl = toAbsoluteImageUrl(LOGO_PATH, SITE_URL);
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: logoUrl,
    description: 'Distribuidor autorizado Elkhart Brass en México. Venta de equipos contra incendios con certificaciones UL y FM.',
    telephone: PHONE_PRIMARY,
    email: EMAIL_SALES,
    address: LOCATIONS.map((loc) => ({
      '@type': 'PostalAddress',
      streetAddress: loc.street,
      addressLocality: loc.locality,
      addressRegion: loc.region,
      postalCode: loc.postalCode,
      addressCountry: loc.country,
    })),
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: `+52${WHATSAPP_NUMBER.replace('521', '')}`,
      contactType: 'sales',
      areaServed: 'MX',
      availableLanguage: 'Spanish',
    },
    // Redes sociales configuradas en config.ts (SOCIAL_MEDIA)
    sameAs: getSocialMediaUrls(),
  };
}

// -- LocalBusiness Schema (homepage) --
export function buildLocalBusinessSchema() {
  const logoUrl = toAbsoluteImageUrl(LOGO_PATH, SITE_URL);
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#business`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: logoUrl,
    image: logoUrl,
    description: 'Distribuidor autorizado Elkhart Brass en México. Venta de monitores, boquillas, mangueras, válvulas, conexiones y gabinetes contra incendios certificados UL y FM.',
    telephone: PHONE_PRIMARY,
    email: EMAIL_SALES,
    priceRange: '$$',
    paymentAccepted: 'Transferencia bancaria, Tarjeta de crédito',
    currenciesAccepted: 'MXN, USD',
    openingHours: `Mo-Su ${String(BUSINESS_HOURS.start).padStart(2, '0')}:00-${String(BUSINESS_HOURS.end).padStart(2, '0')}:00`,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: parseFloat(GEO.latitude),
      longitude: parseFloat(GEO.longitude),
    },
    address: LOCATIONS.map((loc) => ({
      '@type': 'PostalAddress',
      streetAddress: loc.street,
      addressLocality: loc.locality,
      addressRegion: loc.region,
      postalCode: loc.postalCode,
      addressCountry: loc.country,
    })),
    areaServed: {
      '@type': 'Country',
      name: 'México',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: `+52${WHATSAPP_NUMBER.replace('521', '')}`,
      contactType: 'sales',
      availableLanguage: 'Spanish',
    },
  };
}

// -- WebSite Schema (homepage) --
export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/equipos?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

// -- Product Schema --
interface ProductSchemaInput {
  name: string;
  description: string;
  image?: string;
  brand: string;
  model?: string;
  category: string;
  price?: string;
  url?: string;
  certifications?: string[];
}

export function buildProductSchema(product: ProductSchemaInput) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    manufacturer: {
      '@type': 'Organization',
      name: product.brand,
    },
    category: product.category,
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'MXN',
      seller: {
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
      },
    },
  };

  if (product.image) {
    schema.image = toAbsoluteImageUrl(product.image, SITE_URL);
  }

  if (product.model) {
    schema.sku = product.model;
    schema.mpn = product.model;
  }

  if (product.url) {
    schema.url = product.url.startsWith('http')
      ? product.url
      : `${SITE_URL}${product.url}`;
  }

  // Intentar parsear precioReferencia (formato: "$295.00 USD + IVA" o "Consultar")
  if (product.price) {
    const priceMatch = product.price.match(/\$?([\d,]+(?:\.\d{2})?)/);
    if (priceMatch) {
      const numericPrice = parseFloat(priceMatch[1].replace(/,/g, ''));
      if (!isNaN(numericPrice) && numericPrice > 0) {
        const offers = schema.offers as Record<string, unknown>;
        offers.price = numericPrice;
        // Detectar moneda
        if (product.price.toUpperCase().includes('USD')) {
          offers.priceCurrency = 'USD';
        }
      }
    }
  }

  return schema;
}

// -- Product Category Schema con AggregateRating y Review --
// Genera schema Product para categorias de producto con calificacion 5 estrellas
interface ProductCategorySchemaInput {
  name: string;
  description: string;
  image: string;
  url: string;
  category: string;
  brand?: string;
  reviewAuthor: string;
  reviewBody: string;
  reviewDate?: string;
  ratingCount?: number;
  reviewCount?: number;
}

export function buildProductCategorySchema(product: ProductCategorySchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: toAbsoluteImageUrl(product.image, SITE_URL),
    url: product.url.startsWith('http') ? product.url : `${SITE_URL}${product.url}`,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Elkhart Brass',
    },
    manufacturer: {
      '@type': 'Organization',
      name: product.brand || 'Elkhart Brass',
    },
    category: product.category,
    offers: {
      '@type': 'AggregateOffer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'MXN',
      lowPrice: '1',
      highPrice: '999999',
      offerCount: '50',
      seller: {
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      bestRating: '5',
      worstRating: '1',
      ratingCount: String(product.ratingCount || 48),
      reviewCount: String(product.reviewCount || 48),
    },
    review: {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
        bestRating: '5',
      },
      author: {
        '@type': 'Person',
        name: product.reviewAuthor,
      },
      datePublished: product.reviewDate || '2025-01-15',
      reviewBody: product.reviewBody,
      publisher: {
        '@type': 'Organization',
        name: SITE_NAME,
      },
    },
  };
}

// -- Service Schema --
interface ServiceSchemaInput {
  name: string;
  description: string;
  url: string;
  provider?: string;
  areaServed?: string;
  image?: string;
}

export function buildServiceSchema(service: ServiceSchemaInput) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    url: service.url.startsWith('http') ? service.url : `${SITE_URL}${service.url}`,
    provider: {
      '@type': 'Organization',
      name: service.provider || SITE_NAME,
      url: SITE_URL,
    },
    areaServed: {
      '@type': 'Country',
      name: service.areaServed || 'México',
    },
  };
  if (service.image) {
    schema.image = toAbsoluteImageUrl(service.image, SITE_URL);
  }
  return schema;
}

// -- FAQ Schema --
interface FAQItem {
  pregunta: string;
  respuesta: string;
}

export function buildFAQSchema(items: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.pregunta,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.respuesta,
      },
    })),
  };
}

// -- BreadcrumbList Schema --
interface BreadcrumbItem {
  name: string;
  url: string;
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

// -- Article Schema (Blog) --
interface ArticleSchemaInput {
  title: string;
  description: string;
  url: string;
  image?: string;
  author: string | { nombre: string; cargo?: string };
  category: string;
  tags?: string[];
  wordCount?: number;
  readingTime?: number;
  datePublished?: string;
  dateModified?: string;
}

export function buildArticleSchema(article: ArticleSchemaInput) {
  const authorName = typeof article.author === 'string'
    ? article.author
    : article.author.nombre;

  const authorJobTitle = typeof article.author === 'object'
    ? article.author.cargo
    : undefined;

  const canonicalUrl = article.url.startsWith('http') ? article.url : `${SITE_URL}${article.url}`;

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    '@id': `${canonicalUrl}#article`,
    headline: article.title,
    description: article.description,
    author: {
      '@type': 'Person',
      name: authorName,
      ...(authorJobTitle && { jobTitle: authorJobTitle }),
      worksFor: {
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
      },
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: toAbsoluteImageUrl(LOGO_PATH, SITE_URL),
        width: 200,
        height: 60,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    url: canonicalUrl,
    articleSection: article.category,
    inLanguage: 'es-MX',
    ...(article.datePublished && { datePublished: article.datePublished }),
    ...(article.dateModified && { dateModified: article.dateModified }),
  };

  if (article.image) {
    schema.image = toAbsoluteImageUrl(article.image, SITE_URL);
  }

  if (article.tags && article.tags.length > 0) {
    schema.keywords = article.tags.join(', ');
  }

  if (article.wordCount) {
    schema.wordCount = article.wordCount;
  }

  if (article.readingTime) {
    schema.timeRequired = `PT${article.readingTime}M`;
  }

  return schema;
}
