export interface PageCtaContent {
  titulo: string;
  subtitulo: string;
  textoBoton: string;
  enlace: string;
}

const DEFAULT_SUBTITLE =
  'Respuesta en menos de 24 horas con selección técnica, disponibilidad y entrega en toda la República Mexicana.';

function normalizePath(pathname: string): string {
  const clean = pathname.replace(/\.html$/, '').replace(/\/$/, '');
  return clean || '/';
}

function getSectionDefaults(pathname: string): Omit<PageCtaContent, 'titulo'> {
  if (pathname === '/' || pathname === '/equipos') {
    return {
      subtitulo:
        'Monitores, boquillas, mangueras, válvulas, conexiones y gabinetes con soporte técnico para tu proyecto.',
      textoBoton: 'Ver Catálogo',
      enlace: '/equipos',
    };
  }

  if (pathname.startsWith('/blog')) {
    return {
      subtitulo:
        'Lleva la recomendación del artículo a una solución real con equipos certificados y asesoría técnica.',
      textoBoton: 'Ver Equipos',
      enlace: '/equipos',
    };
  }

  if (pathname === '/aviso-de-privacidad' || pathname === '/terminos-y-condiciones' || pathname === '/404') {
    return {
      subtitulo:
        'Si necesitas información comercial o soporte técnico, nuestro equipo puede ayudarte de inmediato.',
      textoBoton: 'Ir al Inicio',
      enlace: '/',
    };
  }

  if (pathname.startsWith('/servicios')) {
    return {
      subtitulo:
        'Coordinamos diagnóstico, especificación y propuesta comercial para cumplir normativa y objetivos operativos.',
      textoBoton: 'Solicitar Asesoría',
      enlace: '#cotizar',
    };
  }

  if (pathname.startsWith('/productos')) {
    return {
      subtitulo:
        'Recibe propuesta con especificaciones, compatibilidad y tiempos de entrega para integrar este equipo en tu sistema.',
      textoBoton: 'Cotizar Producto',
      enlace: '#cotizar',
    };
  }

  if (pathname.startsWith('/monitores')) {
    return {
      subtitulo:
        'Definimos caudal, alcance y certificación para protección perimetral en plantas, terminales y zonas de proceso.',
      textoBoton: 'Solicitar Cotización',
      enlace: '#cotizar',
    };
  }

  if (pathname.startsWith('/boquillas')) {
    return {
      subtitulo:
        'Te ayudamos a seleccionar patrón, presión y caudal para asegurar desempeño operativo en condiciones reales.',
      textoBoton: 'Solicitar Cotización',
      enlace: '#cotizar',
    };
  }

  if (pathname.startsWith('/mangueras')) {
    return {
      subtitulo:
        'Seleccionamos diámetro, presión y tipo de manguera para compatibilidad total con tu red contra incendio.',
      textoBoton: 'Solicitar Cotización',
      enlace: '#cotizar',
    };
  }

  if (pathname.startsWith('/valvulas')) {
    return {
      subtitulo:
        'Configura correctamente seccionamiento, control y retención de flujo para operación segura y cumplimiento técnico.',
      textoBoton: 'Solicitar Cotización',
      enlace: '#cotizar',
    };
  }

  if (pathname.startsWith('/conexiones')) {
    return {
      subtitulo:
        'Asegura compatibilidad de roscas, diámetros y conexiones para mantener continuidad y seguridad en la red.',
      textoBoton: 'Solicitar Cotización',
      enlace: '#cotizar',
    };
  }

  if (pathname.startsWith('/gabinetes')) {
    return {
      subtitulo:
        'Integra gabinetes, hidrantes y estaciones con configuraciones listas para operación en sitio y cumplimiento normativo.',
      textoBoton: 'Solicitar Cotización',
      enlace: '#cotizar',
    };
  }

  return {
    subtitulo: DEFAULT_SUBTITLE,
    textoBoton: 'Solicitar Cotización',
    enlace: '#cotizar',
  };
}

export function getPageCtaContent(pathname: string, pageTitle: string): PageCtaContent {
  const normalizedPath = normalizePath(pathname);
  const defaults = getSectionDefaults(normalizedPath);

  const cleanTitle = pageTitle.trim();
  const titulo =
    normalizedPath === '/'
      ? 'Explora nuestro catálogo completo de equipos contra incendios'
      : `¿Listo para avanzar con ${cleanTitle}?`;

  return {
    titulo,
    subtitulo: defaults.subtitulo,
    textoBoton: defaults.textoBoton,
    enlace: defaults.enlace,
  };
}
