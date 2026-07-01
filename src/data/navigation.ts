// =============================================================================
// Gama de México — Fuente única de verdad para la navegación
// Úsalo en Header.astro (desktop nav + mobile nav) para evitar duplicación.
// =============================================================================

export interface NavLink {
  href: string;
  label: string;
}

export interface NavSubcategory {
  title: string;
  links: NavLink[];
  viewAll?: NavLink;
}

export interface NavItemDropdown {
  label: string;
  href: string;
  subcategories: NavSubcategory[];
  cta?: {
    title: string;
    description: string;
    primaryLink: NavLink;
    secondaryLabel?: string;
    secondaryHref?: string;
  };
}

export interface NavItemSimple {
  label: string;
  href: string;
}

export type NavItem = NavItemDropdown | NavItemSimple;

function isDropdown(item: NavItem): item is NavItemDropdown {
  return 'subcategories' in item;
}

// ---------------------------------------------------------------------------
// Datos del menú
// ---------------------------------------------------------------------------

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Equipos y Accesorios',
    href: '/equipos',
    subcategories: [
      {
        title: 'Monitores',
        links: [
          { href: '/monitores/tipo-corazon', label: 'Monitor tipo corazón' },
          { href: '/monitores/cuello-cisne', label: 'Monitor tipo cuello de cisne' },
          { href: '/monitores/certificado-fm', label: 'Monitor certificado FM' },
          { href: '/monitores/ul-listed', label: 'Monitor UL Listed' },
        ],
        viewAll: { href: '/monitores-contra-incendios', label: 'Ver todos los monitores' },
      },
      {
        title: 'Boquillas',
        links: [
          { href: '/boquillas/tipo-pistola', label: 'Boquilla tipo pistola' },
          { href: '/boquillas/turbo-jet', label: 'Boquilla turbo jet' },
          { href: '/boquillas/industrial', label: 'Boquilla industrial' },
          { href: '/boquillas/certificada', label: 'Boquilla certificada' },
        ],
        viewAll: { href: '/boquillas-contra-incendios', label: 'Ver todas las boquillas' },
      },
      {
        title: 'Mangueras',
        links: [
          { href: '/mangueras/millhose', label: 'Manguera Millhose' },
          { href: '/mangueras/blindex', label: 'Manguera Blindex' },
          { href: '/mangueras/succion', label: 'Manguera de succión' },
          { href: '/mangueras/forestal', label: 'Manguera forestal' },
        ],
        viewAll: { href: '/mangueras-contra-incendios', label: 'Ver todas las mangueras' },
      },
      {
        title: 'Válvulas',
        links: [
          { href: '/valvulas/compuerta', label: 'Válvula de compuerta OS&Y' },
          { href: '/valvulas/globo', label: 'Válvula de globo' },
          { href: '/valvulas/retencion', label: 'Válvula de retención' },
          { href: '/valvulas/mariposa', label: 'Válvula mariposa' },
        ],
        viewAll: { href: '/valvulas-contra-incendios', label: 'Ver todas las válvulas' },
      },
      {
        title: 'Conexiones y Herrajes',
        links: [
          { href: '/conexiones/adaptadores', label: 'Adaptadores de bronce' },
          { href: '/conexiones/wye', label: 'Conexión Y (Wye)' },
          { href: '/conexiones/siamesa', label: 'Toma siamesa FDC' },
          { href: '/conexiones/coples', label: 'Coples y reducciones' },
          { href: '/conexiones/chiflones', label: 'Chiflones de tres pasos' },
          { href: '/conexiones/accesorios', label: 'Accesorios y herrajes' },
        ],
        viewAll: { href: '/conexiones-herrajes-contra-incendios', label: 'Ver todas las conexiones' },
      },
      {
        title: 'Gabinetes e Hidrantes',
        links: [
          { href: '/gabinetes/tipo-30me', label: 'Gabinete tipo 30ME' },
          { href: '/gabinetes/hidrantes', label: 'Hidrantes' },
          { href: '/gabinetes/empotrado', label: 'Gabinete empotrado' },
          { href: '/gabinetes/estaciones', label: 'Estaciones de manguera' },
        ],
        viewAll: { href: '/gabinetes-hidrantes-contra-incendios', label: 'Ver todos los gabinetes' },
      },
    ],
  },
  {
    label: 'Servicios',
    href: '/servicios',
    subcategories: [
      {
        title: 'Asesoría y Soporte',
        links: [
          { href: '/servicios/garantia', label: 'Garantía y Respaldo Técnico' },
          { href: '/servicios/asesoria', label: 'Asesoría Técnica Especializada' },
          { href: '/servicios/empresas', label: 'Atención a Empresas y Proyectos' },
        ],
      },
      {
        title: 'Suministro y Logística',
        links: [
          { href: '/servicios/mantenimiento', label: 'Suministro para Mantenimiento' },
          { href: '/servicios/envios', label: 'Logística y Envíos Nacionales' },
          { href: '/servicios/cotizaciones', label: 'Cotizaciones Corporativas' },
        ],
        viewAll: { href: '/servicios', label: 'Ver todos los servicios' },
      },
    ],
    cta: {
      title: '¿Necesitas ayuda?',
      description: 'Nuestro equipo de asesores técnicos está listo para ayudarte a seleccionar los equipos correctos para tu proyecto.',
      primaryLink: { href: '/servicios', label: 'Ver todos los servicios' },
      secondaryLabel: 'WhatsApp: 55 6529 8240',
      secondaryHref: 'https://wa.me/5215565298240',
    },
  },
  {
    label: 'Blog',
    href: '/blog',
    subcategories: [
      {
        title: 'Por Producto',
        links: [
          { href: '/blog/monitores-contra-incendios', label: 'Monitores' },
          { href: '/blog/boquillas-contra-incendios', label: 'Boquillas' },
          { href: '/blog/mangueras-contra-incendios', label: 'Mangueras' },
          { href: '/blog/valvulas-contra-incendios', label: 'Válvulas' },
          { href: '/blog/gabinetes-hidrantes-contra-incendios', label: 'Gabinetes e Hidrantes' },
        ],
        viewAll: { href: '/blog', label: 'Ver todos los artículos' },
      },
    ],
    cta: {
      title: 'Recursos Técnicos',
      description: 'Artículos escritos por ingenieros especializados en protección contra incendios con más de 30 años de experiencia.',
      primaryLink: { href: '/blog', label: 'Explorar Blog' },
    },
  },
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Contacto', href: '/contacto' },
];

export { isDropdown };
