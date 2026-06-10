// =============================================================================
// Agregador de subcategorías de producto
// Las 33 definiciones reemplazan a las antiguas páginas estáticas duplicadas
// en src/pages/{boquillas,monitores,mangueras,valvulas,conexiones,gabinetes}/.
// =============================================================================
import type { SubcategoryDef } from './types';
import boquillas from './boquillas.generated.json';
import monitores from './monitores.generated.json';
import mangueras from './mangueras.generated.json';
import valvulas from './valvulas.generated.json';
import conexiones from './conexiones.generated.json';
import gabinetes from './gabinetes.generated.json';

export type { SubcategoryDef, Seccion } from './types';

export const SUBCATEGORIAS: SubcategoryDef[] = [
  ...boquillas,
  ...monitores,
  ...mangueras,
  ...valvulas,
  ...conexiones,
  ...gabinetes,
] as SubcategoryDef[];

// --- Validación de integridad en build (falla rápido ante datos corruptos) ---
const seen = new Set<string>();
for (const def of SUBCATEGORIAS) {
  const key = `${def.seccion}/${def.slug}`;
  if (seen.has(key)) throw new Error(`[subcategorias] Ruta duplicada: ${key}`);
  seen.add(key);
  if (!def.meta?.title || !def.meta?.description) {
    throw new Error(`[subcategorias] ${key}: meta.title/description obligatorios`);
  }
  if (!def.filter?.subcategorias?.length) {
    throw new Error(`[subcategorias] ${key}: filter.subcategorias vacío`);
  }
  if (!def.faqs?.length) {
    throw new Error(`[subcategorias] ${key}: faqs vacías`);
  }
}

export function getSubcategoria(seccion: string, slug: string): SubcategoryDef | undefined {
  return SUBCATEGORIAS.find((s) => s.seccion === seccion && s.slug === slug);
}
