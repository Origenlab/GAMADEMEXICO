// Configuración de nombres para las migas de pan
// Mapeo de slugs a nombres legibles

export const routeNames: Record<string, string> = {
  // Categorías principales
  'monitores-contra-incendios': 'Monitores Contra Incendios',
  'boquillas-contra-incendios': 'Boquillas Contra Incendios',
  'mangueras-contra-incendios': 'Mangueras Contra Incendios',
  'valvulas-contra-incendios': 'Válvulas Contra Incendios',
  'conexiones-herrajes-contra-incendios': 'Conexiones y Herrajes',
  'gabinetes-hidrantes-contra-incendios': 'Gabinetes e Hidrantes',

  // Subcategorías de monitores
  'monitores': 'Monitores',
  'tipo-corazon': 'Monitor Tipo Corazón',
  'cuello-cisne': 'Monitor Cuello de Cisne',
  'certificado-fm': 'Monitor Certificado FM',
  'ul-listed': 'Monitor UL Listed',

  // Subcategorías de boquillas
  'boquillas': 'Boquillas',
  'tipo-pistola': 'Boquilla Tipo Pistola',
  'turbo-jet': 'Boquilla Turbo Jet',
  'industrial': 'Boquilla Industrial',
  'certificada': 'Boquilla Certificada',

  // Subcategorías de mangueras
  'mangueras': 'Mangueras',
  'blindex': 'Manguera Blindex',
  'forestal': 'Manguera Forestal',
  'millhose': 'Manguera Millhose',
  'succion': 'Manguera de Succión',

  // Subcategorías de válvulas
  'valvulas': 'Válvulas',
  'compuerta': 'Válvula de Compuerta',
  'globo': 'Válvula de Globo',
  'mariposa': 'Válvula Mariposa',
  'retencion': 'Válvula de Retención',

  // Subcategorías de conexiones
  'conexiones': 'Conexiones',
  'coples': 'Coples',
  'adaptadores': 'Adaptadores',
  'siamesa': 'Conexión Siamesa',
  'wye': 'Conexión Wye',
  'chiflones': 'Chiflones',
  'accesorios': 'Accesorios',

  // Subcategorías de gabinetes
  'gabinetes': 'Gabinetes',
  'hidrantes': 'Hidrantes',
  'estaciones': 'Estaciones',

  // Otras secciones
  'servicios': 'Servicios',
  'garantia': 'Garantía y Respaldo',
  'asesoria': 'Asesoría Técnica',
  'empresas': 'Atención a Empresas',
  'mantenimiento': 'Suministro y Mantenimiento',
  'envios': 'Envíos Nacionales',
  'cotizaciones': 'Cotizaciones Corporativas',

  'productos': 'Productos',
  'blog': 'Blog',
  'equipos': 'Equipos',
  'aviso-de-privacidad': 'Aviso de Privacidad',
  'terminos-y-condiciones': 'Términos y Condiciones',

  // Blog - Secciones
  'categoria': 'Categoría',
  'tag': 'Etiqueta',

  // Blog - Categorías
  'extintores': 'Extintores',
  'sistemas-contraincendios': 'Sistemas Contra Incendios',
  'normatividad': 'Normatividad',
  'seguridad-industrial': 'Seguridad Industrial',
  'senalizacion': 'Señalización',
  'capacitacion': 'Capacitación',
};

// Mapeo de categorías padre para subcategorías
export const parentRoutes: Record<string, { path: string; name: string }> = {
  // Subcategorías de monitores
  'tipo-corazon': { path: '/monitores-contra-incendios', name: 'Monitores Contra Incendios' },
  'cuello-cisne': { path: '/monitores-contra-incendios', name: 'Monitores Contra Incendios' },
  'certificado-fm': { path: '/monitores-contra-incendios', name: 'Monitores Contra Incendios' },
  'ul-listed': { path: '/monitores-contra-incendios', name: 'Monitores Contra Incendios' },

  // Subcategorías de boquillas
  'tipo-pistola': { path: '/boquillas-contra-incendios', name: 'Boquillas Contra Incendios' },
  'turbo-jet': { path: '/boquillas-contra-incendios', name: 'Boquillas Contra Incendios' },
  'industrial': { path: '/boquillas-contra-incendios', name: 'Boquillas Contra Incendios' },
  'certificada': { path: '/boquillas-contra-incendios', name: 'Boquillas Contra Incendios' },

  // Subcategorías de mangueras
  'blindex': { path: '/mangueras-contra-incendios', name: 'Mangueras Contra Incendios' },
  'forestal': { path: '/mangueras-contra-incendios', name: 'Mangueras Contra Incendios' },
  'millhose': { path: '/mangueras-contra-incendios', name: 'Mangueras Contra Incendios' },
  'succion': { path: '/mangueras-contra-incendios', name: 'Mangueras Contra Incendios' },

  // Subcategorías de válvulas
  'compuerta': { path: '/valvulas-contra-incendios', name: 'Válvulas Contra Incendios' },
  'globo': { path: '/valvulas-contra-incendios', name: 'Válvulas Contra Incendios' },
  'mariposa': { path: '/valvulas-contra-incendios', name: 'Válvulas Contra Incendios' },
  'retencion': { path: '/valvulas-contra-incendios', name: 'Válvulas Contra Incendios' },

  // Subcategorías de conexiones
  'coples': { path: '/conexiones-herrajes-contra-incendios', name: 'Conexiones y Herrajes' },
  'adaptadores': { path: '/conexiones-herrajes-contra-incendios', name: 'Conexiones y Herrajes' },
  'siamesa': { path: '/conexiones-herrajes-contra-incendios', name: 'Conexiones y Herrajes' },
  'wye': { path: '/conexiones-herrajes-contra-incendios', name: 'Conexiones y Herrajes' },
  'chiflones': { path: '/conexiones-herrajes-contra-incendios', name: 'Conexiones y Herrajes' },
  'accesorios': { path: '/conexiones-herrajes-contra-incendios', name: 'Conexiones y Herrajes' },

  // Subcategorías de gabinetes
  'estaciones': { path: '/gabinetes-hidrantes-contra-incendios', name: 'Gabinetes e Hidrantes' },

  // Servicios
  'garantia': { path: '/servicios', name: 'Servicios' },
  'asesoria': { path: '/servicios', name: 'Servicios' },
  'empresas': { path: '/servicios', name: 'Servicios' },
  'mantenimiento': { path: '/servicios', name: 'Servicios' },
  'envios': { path: '/servicios', name: 'Servicios' },
  'cotizaciones': { path: '/servicios', name: 'Servicios' },
};

export interface BreadcrumbItem {
  name: string;
  path: string;
  isActive: boolean;
}

export function generateBreadcrumbs(pathname: string, pageTitle?: string): BreadcrumbItem[] {
  // Limpiar pathname
  const cleanPath = pathname.replace(/\/$/, '').replace(/\.html$/, '');

  // No mostrar breadcrumb en la página de inicio
  if (cleanPath === '' || cleanPath === '/') {
    return [];
  }

  const segments = cleanPath.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Inicio', path: '/', isActive: false }
  ];

  // Detectar si es una subcategoría que necesita padre especial
  if (segments.length >= 2) {
    const lastSegment = segments[segments.length - 1];
    const parentFolder = segments[segments.length - 2];

    // Si el padre es una carpeta de subcategorías (monitores, boquillas, etc.)
    if (['monitores', 'boquillas', 'mangueras', 'valvulas', 'conexiones', 'gabinetes', 'servicios'].includes(parentFolder)) {
      const parent = parentRoutes[lastSegment];
      if (parent) {
        breadcrumbs.push({
          name: parent.name,
          path: parent.path,
          isActive: false
        });
      }
    }
  }

  // Construir el resto del breadcrumb
  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;

    // Saltar carpetas intermedias si ya agregamos el padre
    if (['monitores', 'boquillas', 'mangueras', 'valvulas', 'conexiones', 'gabinetes'].includes(segment) && !isLast) {
      return;
    }

    // Obtener nombre del segmento
    let name = routeNames[segment] || formatSegmentName(segment);

    // Si es el último y tenemos título de página, usarlo
    if (isLast && pageTitle) {
      name = pageTitle;
    }

    // Evitar duplicados
    const exists = breadcrumbs.some(b => b.path === currentPath);
    if (!exists) {
      breadcrumbs.push({
        name,
        path: currentPath,
        isActive: isLast
      });
    }
  });

  return breadcrumbs;
}

function formatSegmentName(segment: string): string {
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
