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
} from './config';

// -- Organization Schema (incluir en todas las paginas) --
export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}${LOGO_PATH}`,
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
    // TODO: Agregar URLs de redes sociales cuando estén disponibles
    // Ejemplo: sameAs: ['https://facebook.com/gamademexico', 'https://instagram.com/gamademexico']
    sameAs: [],
  };
}

// -- LocalBusiness Schema (homepage) --
export function buildLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#business`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}${LOGO_PATH}`,
    image: `${SITE_URL}${LOGO_PATH}`,
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
    schema.image = product.image.startsWith('http')
      ? product.image
      : `${SITE_URL}${product.image}`;
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
