// =============================================================================
// Gama de Mexico — Blog Helpers
// Utilidades para el sistema de blog corporativo
// =============================================================================

import type { CollectionEntry } from 'astro:content';

type BlogPost = CollectionEntry<'blog'>;

// -----------------------------------------------------------------------------
// Etiquetas de categorías en español (coinciden con productos del sitio)
// -----------------------------------------------------------------------------
export const CATEGORY_LABELS: Record<string, string> = {
  'monitores': 'Monitores',
  'boquillas': 'Boquillas',
  'mangueras': 'Mangueras',
  'valvulas': 'Válvulas',
  'conexiones-herrajes': 'Conexiones y Herrajes',
  'gabinetes-hidrantes': 'Gabinetes e Hidrantes',
};

// -----------------------------------------------------------------------------
// Calcular tiempo de lectura
// -----------------------------------------------------------------------------
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// -----------------------------------------------------------------------------
// Formatear fecha en español
// -----------------------------------------------------------------------------
export function formatDateSpanish(dateString: string): string {
  const date = new Date(dateString + 'T12:00:00');
  return date.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// -----------------------------------------------------------------------------
// Formatear fecha corta (15 ene 2025)
// -----------------------------------------------------------------------------
export function formatDateShort(dateString: string): string {
  const date = new Date(dateString + 'T12:00:00');
  return date.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// -----------------------------------------------------------------------------
// Obtener nombre del autor (acepta string u objeto)
// -----------------------------------------------------------------------------
export function getAuthorName(autor: string | { nombre: string; cargo?: string }): string {
  if (typeof autor === 'string') {
    return autor;
  }
  return autor.nombre;
}

// -----------------------------------------------------------------------------
// Obtener cargo del autor
// -----------------------------------------------------------------------------
export function getAuthorRole(autor: string | { nombre: string; cargo?: string }): string | undefined {
  if (typeof autor === 'string') {
    return undefined;
  }
  return autor.cargo;
}

// -----------------------------------------------------------------------------
// Obtener artículos relacionados por categoría y tags
// -----------------------------------------------------------------------------
export function getRelatedPosts(
  currentPost: BlogPost,
  allPosts: BlogPost[],
  limit: number = 3
): BlogPost[] {
  const currentCategory = currentPost.data.categoria;
  const currentTags = currentPost.data.tags || [];
  const currentId = currentPost.id;

  // Calcular score de relevancia
  const scoredPosts = allPosts
    .filter((post) => post.id !== currentId && !post.data.draft)
    .map((post) => {
      let score = 0;

      // +3 puntos por misma categoría
      if (post.data.categoria === currentCategory) {
        score += 3;
      }

      // +1 punto por cada tag compartido
      const postTags = post.data.tags || [];
      const sharedTags = postTags.filter((tag) => currentTags.includes(tag));
      score += sharedTags.length;

      return { post, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => {
      // Primero por score, luego por fecha
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return new Date(b.post.data.fecha).getTime() - new Date(a.post.data.fecha).getTime();
    });

  return scoredPosts.slice(0, limit).map((item) => item.post);
}

// -----------------------------------------------------------------------------
// Agrupar posts por categoría
// -----------------------------------------------------------------------------
export function getPostsByCategory(posts: BlogPost[]): Map<string, BlogPost[]> {
  const categoryMap = new Map<string, BlogPost[]>();

  posts.forEach((post) => {
    if (post.data.draft) return;

    const category = post.data.categoria || 'productos';
    const existing = categoryMap.get(category) || [];
    existing.push(post);
    categoryMap.set(category, existing);
  });

  // Ordenar posts dentro de cada categoría por fecha
  categoryMap.forEach((posts, category) => {
    posts.sort((a, b) => new Date(b.data.fecha).getTime() - new Date(a.data.fecha).getTime());
    categoryMap.set(category, posts);
  });

  return categoryMap;
}

// -----------------------------------------------------------------------------
// Obtener todos los tags con conteo
// -----------------------------------------------------------------------------
export function getAllTags(posts: BlogPost[]): Map<string, number> {
  const tagMap = new Map<string, number>();

  posts.forEach((post) => {
    if (post.data.draft) return;

    const tags = post.data.tags || [];
    tags.forEach((tag) => {
      const count = tagMap.get(tag) || 0;
      tagMap.set(tag, count + 1);
    });
  });

  // Ordenar por conteo descendente
  return new Map([...tagMap.entries()].sort((a, b) => b[1] - a[1]));
}

// -----------------------------------------------------------------------------
// Obtener categorías con conteo
// -----------------------------------------------------------------------------
export function getCategoriesWithCount(
  posts: BlogPost[]
): Array<{ slug: string; name: string; count: number }> {
  const categoryMap = getPostsByCategory(posts);

  return [...categoryMap.entries()]
    .map(([slug, posts]) => ({
      slug,
      name: CATEGORY_LABELS[slug] || slug,
      count: posts.length,
    }))
    .sort((a, b) => b.count - a.count);
}

// -----------------------------------------------------------------------------
// Generar slug a partir de título
// -----------------------------------------------------------------------------
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .replace(/[^a-z0-9\s-]/g, '') // Solo alfanuméricos y espacios
    .trim()
    .replace(/\s+/g, '-') // Espacios a guiones
    .replace(/-+/g, '-') // Múltiples guiones a uno
    .replace(/^-|-$/g, ''); // Sin guiones al inicio/final
}

// -----------------------------------------------------------------------------
// Interfaz para items de tabla de contenidos
// -----------------------------------------------------------------------------
export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

// -----------------------------------------------------------------------------
// Extraer tabla de contenidos de headings de Astro
// -----------------------------------------------------------------------------
export function extractTableOfContents(
  headings: Array<{ depth: number; slug: string; text: string }>
): TOCItem[] {
  return headings
    .filter((h) => h.depth === 2 || h.depth === 3)
    .map((h) => ({
      id: h.slug,
      text: h.text,
      level: h.depth,
    }));
}

// -----------------------------------------------------------------------------
// Validar frontmatter para integración n8n
// -----------------------------------------------------------------------------
export interface BlogFrontmatter {
  title: string;
  description: string;
  fecha: string;
  categoria: string;
  tags?: string[];
  autor?: string | { nombre: string; cargo?: string };
  imagen?: string;
  destacado?: boolean;
  content?: string;
}

export function validateBlogFrontmatter(data: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const fm = data as Partial<BlogFrontmatter>;

  // Campos requeridos
  if (!fm.title || fm.title.length < 20 || fm.title.length > 70) {
    errors.push('title: debe tener entre 20 y 70 caracteres');
  }
  if (!fm.description || fm.description.length < 80 || fm.description.length > 165) {
    errors.push('description: debe tener entre 80 y 165 caracteres');
  }
  if (!fm.fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fm.fecha)) {
    errors.push('fecha: debe usar formato YYYY-MM-DD');
  }

  const validCategories = [
    'monitores',
    'boquillas',
    'mangueras',
    'valvulas',
    'conexiones-herrajes',
    'gabinetes-hidrantes',
  ];
  if (!fm.categoria || !validCategories.includes(fm.categoria)) {
    errors.push(`categoria: debe ser uno de: ${validCategories.join(', ')}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// -----------------------------------------------------------------------------
// Generar frontmatter markdown para n8n
// -----------------------------------------------------------------------------
export function generateMarkdownFrontmatter(data: BlogFrontmatter): string {
  const lines = ['---'];

  lines.push(`title: "${data.title.replace(/"/g, '\\"')}"`);
  lines.push(`description: "${data.description.replace(/"/g, '\\"')}"`);
  lines.push(`fecha: "${data.fecha}"`);
  lines.push(`categoria: "${data.categoria}"`);

  if (data.tags && data.tags.length > 0) {
    lines.push(`tags: [${data.tags.map((t) => `"${t}"`).join(', ')}]`);
  } else {
    lines.push('tags: []');
  }

  if (typeof data.autor === 'object') {
    lines.push('autor:');
    lines.push(`  nombre: "${data.autor.nombre}"`);
    if (data.autor.cargo) {
      lines.push(`  cargo: "${data.autor.cargo}"`);
    }
  } else if (data.autor) {
    lines.push(`autor: "${data.autor}"`);
  } else {
    lines.push('autor: "Equipo Técnico Gama de México"');
  }

  if (data.imagen) {
    lines.push(`imagen: "${data.imagen}"`);
  }

  lines.push(`destacado: ${data.destacado || false}`);
  lines.push('draft: false');

  lines.push('---');
  lines.push('');
  lines.push(data.content || '');

  return lines.join('\n');
}
