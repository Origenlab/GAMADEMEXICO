// =============================================================================
// Gama de Mexico — Configuracion centralizada del sitio
// Fuente unica de verdad para datos de negocio, contacto y SEO
// =============================================================================

// -- Identidad del sitio --
export const SITE_NAME = 'Gama de México';
export const SITE_URL = 'https://gamademexico.com';
export const SITE_DESCRIPTION = 'Distribuidor autorizado Elkhart Brass en México. Venta de equipos contra incendios con certificaciones UL y FM.';
export const SITE_TAGLINE = 'Equipos contra incendios';

// -- Contacto --
export const PHONE_PRIMARY = '+525515437164';
export const PHONE_DISPLAY = '55 1543 7164';
export const WHATSAPP_NUMBER = '5215565298240';
export const WHATSAPP_DISPLAY = '55 6529 8240';
export const EMAIL_SALES = 'ventas@gamademexico.com';

// -- Horarios de atencion (fuente unica) --
export const BUSINESS_HOURS = {
  days: 'Lun-Dom',
  daysLong: 'Lunes a Domingo',
  start: 6,
  end: 16,
  display: '6:00 - 16:00',
  fullDisplay: 'Lunes a Domingo, 6:00 - 16:00',
  timezone: 'America/Mexico_City',
};

// -- Sucursales --
export const LOCATIONS = [
  {
    name: 'CDMX — Santa Fe',
    street: 'Prol. Paseo de la Reforma 1015, Piso 1',
    neighborhood: 'Santa Fe, Contadero, Álvaro Obregón',
    locality: 'Ciudad de México',
    region: 'CDMX',
    postalCode: '01376',
    country: 'MX',
  },
  {
    name: 'Querétaro',
    street: 'Avenida Constituyentes 120',
    neighborhood: '',
    locality: 'Santiago de Querétaro',
    region: 'Querétaro',
    postalCode: '76030',
    country: 'MX',
  },
] as const;

// -- Geo (SEO local) --
export const GEO = {
  region: 'MX-CMX',
  placename: 'Ciudad de México',
  latitude: '19.3667',
  longitude: '-99.2667',
};

// -- Brand --
export const BRAND_COLOR = '#C41E3A';
export const OG_IMAGE_DEFAULT = '/img/og-image.jpg';
export const LOGO_PATH = '/img/gama-de-mexico.avif';

// -- Marcas distribuidas --
export const DISTRIBUTED_BRANDS = [
  'Elkhart Brass',
  'Akron Brass',
  'Potter Roemer',
  'Task Force Tips',
] as const;

// -- Mapa de categorias → URLs (usado en navegacion y breadcrumbs) --
export const CATEGORY_MAP: Record<string, { url: string; nombre: string }> = {
  monitores:              { url: '/monitores-contra-incendios',            nombre: 'Monitores Contra Incendios' },
  boquillas:              { url: '/boquillas-contra-incendios',            nombre: 'Boquillas Contra Incendios' },
  mangueras:              { url: '/mangueras-contra-incendios',            nombre: 'Mangueras Contra Incendios' },
  valvulas:               { url: '/valvulas-contra-incendios',             nombre: 'Válvulas Contra Incendios' },
  'conexiones-herrajes':  { url: '/conexiones-herrajes-contra-incendios',  nombre: 'Conexiones y Herrajes' },
  'gabinetes-hidrantes':  { url: '/gabinetes-hidrantes-contra-incendios',  nombre: 'Gabinetes e Hidrantes' },
};

// -- URLs de WhatsApp preformateadas --
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
export const PHONE_URL = `tel:${PHONE_PRIMARY}`;
export const EMAIL_URL = `mailto:${EMAIL_SALES}`;
