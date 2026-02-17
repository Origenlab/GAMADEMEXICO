#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const astroDir = path.join(process.cwd(), '.astro');

try {
  fs.rmSync(astroDir, { recursive: true, force: true });
  console.log('[clean-astro-cache] Removed .astro cache');
} catch (error) {
  console.warn('[clean-astro-cache] Could not remove .astro cache:', error?.message || error);
}
