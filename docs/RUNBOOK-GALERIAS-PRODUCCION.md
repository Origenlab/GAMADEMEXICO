# Runbook de Galerias en Produccion

## Objetivo
Aplicar el fix global de galerias y confirmar funcionamiento real en todos los productos.

## 1) Desplegar cambios
Archivos clave:
- `src/pages/productos/[...slug].astro`
- `scripts/e2e-gallery-playwright.mjs`
- `package.json`
- `package-lock.json`

## 2) Purga de cache (Cloudflare)
Despues del deploy, purgar cache para evitar HTML/script antiguo:
1. Purga completa (recomendado tras este cambio).
2. Si no puedes purga completa, purga al menos:
   - `/productos/*`
   - `/_astro/*`

## 3) Validar local (opcional)
```bash
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
npm run e2e:gallery:local
```

Esperado: `passed=204 failed=0`

## 4) Validar produccion (obligatorio)
```bash
npm run e2e:gallery:prod
```

Esperado: `passed=204 failed=0`

Reportes generados:
- `docs/E2E-GALERIAS-PLAYWRIGHT.md`
- `docs/E2E-GALERIAS-PLAYWRIGHT.json`

## 5) Criterio de cierre
Se considera cerrado cuando:
- E2E local: 204/204 OK
- E2E produccion: 204/204 OK
- No hay productos con `click_did_not_update_main_image`
