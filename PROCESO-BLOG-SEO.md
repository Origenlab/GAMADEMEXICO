# Proceso de Optimización SEO para Blogs — Estándar Profesional

**Documento de proceso para futuras optimizaciones de blog.**  
**Basado en las lecciones del proyecto Gama de México (marzo 2026).**

---

## Principios

1. **Calidad sobre velocidad.** Menos artículos bien hechos > muchos artículos mediocres.
2. **Verificar antes de reportar.** Si no lo revisé, no está terminado.
3. **El experto de campo escribe diferente al consultor.** El tono correcto es de alguien que ha ESTADO ahí, no de alguien que leyó sobre el tema.
4. **Cada cambio se valida.** Título, schema, link, contenido — todo se verifica después de insertar.

---

## Fases del Proceso

### Fase 1: Auditoría Inicial (antes de tocar nada)

**Objetivo:** Entender qué hay, qué falta, qué está mal.

1. **Inventario completo** — Listar todos los artículos con: título, categoría, longitud, draft/activo
2. **Detección de canibalización** — Identificar artículos que compiten por las mismas keywords
3. **Análisis de contenido** — Clasificar por calidad: bueno / reescribir / eliminar
4. **Auditoría técnica** — Schema existente, titles, descriptions, canonical, noindex
5. **Mapa de interlinking actual** — Qué artículos linkan a qué

**Entregable:** Documento de auditoría con plan de acción priorizado.

### Fase 2: Resolución de Canibalización

**Objetivo:** Eliminar competencia interna entre artículos.

1. **Identificar pares/grupos** que compiten por el mismo intent de búsqueda
2. **Decidir:** fusionar, diferenciar keywords, o eliminar (draft: true)
3. **Si se elimina:** verificar que NINGÚN artículo activo tenga link al eliminado
4. **Si se fusiona:** mover el mejor contenido del eliminado al superviviente
5. **Documentar** cada decisión con razón

**Regla:** Nunca eliminar sin verificar links entrantes.

### Fase 3: Reescritura de Contenido

**Objetivo:** Contenido que demuestre expertise real, no genérico.

**Antes de escribir:**
- Leer el artículo completo
- Identificar qué tiene de bueno (conservar)
- Identificar tono consultor/genérico (eliminar)
- Verificar datos técnicos (normas, presiones, caudales, temperaturas)

**Criterios de calidad:**
- ✅ Escenas de campo reales ("cuando el inspector llega y pide...")
- ✅ Consecuencias prácticas ("si esto falla, pasa X")
- ✅ Números específicos (presiones en PSI, caudales en GPM, temperaturas en °C)
- ✅ Normas citadas con contexto ("NFPA 25 dice X, pero en la práctica Y")
- ❌ Jerga de consultor ("gobernanza", "marcos conceptuales", "matrices")
- ❌ Explicaciones circulares
- ❌ Datos que no puedo verificar

**Proceso por artículo:**
1. Leer completo
2. Identificar 3-5 datos de campo únicos que aportar
3. Reescribir manteniendo estructura SEO
4. Verificar que el tono sea de experto, no de enciclopedia

### Fase 4: SEO Schema (JSON-LD)

**Objetivo:** Schema que capture snippets en Google.

**Por artículo:**
1. Article schema con headline, author, dateModified
2. FAQPage schema con 2-5 preguntas

**Criterios para FAQs:**
- La pregunta debe ser algo que alguien buscaría en Google
- La respuesta debe empezar con el dato directo (no con contexto)
- Incluir al menos un número, norma o consecuencia específica
- Cada FAQ debe poder funcionar como snippet independiente
- NO copiar contenido del artículo textualmente — reformular

**Validación:**
- [ ] Título ≤ 60 caracteres
- [ ] Description ≤ 155 caracteres
- [ ] Schema YAML válido (sin errores de sintaxis)
- [ ] FAQs relevantes al contenido real del artículo
- [ ] Sin acrónimos en minúsculas (NFPA, UL, FM, NST)

### Fase 5: Interlinking

**Objetivo:** Red de links interna que distribuya autoridad y retenga al usuario.

**Reglas:**
- Máximo 3 links blog-to-blog por artículo
- Solo links temáticamente relevantes (no random por llenar cuota)
- Anchor text descriptivo ("la clasificación por presión NFPA 1961", no "click aquí")
- Priorizar links intra-silo (misma categoría) + 1 cross-silo relevante
- Verificar que el destino NO esté en draft

**Formato:**
```markdown
---

### Lecturas relacionadas

- [Anchor text descriptivo](/blog/categoria/slug)
- [Otro anchor text](/blog/categoria/slug)
```

**Ubicación:** Antes de la última sección (conclusión) del artículo.

**Validación post-inserción:**
- [ ] Todos los links apuntan a artículos activos (no draft)
- [ ] Capitalización correcta en anchor texts (NFPA, México, UL, FM)
- [ ] No hay links duplicados
- [ ] No hay artículos sin links (cobertura 100%)

### Fase 6: Validación Final

**Antes de reportar como terminado:**

1. **Build test** — `npm run build` sin errores
2. **Título audit** — Ninguno >60 chars, ninguno truncado
3. **Schema audit** — FAQPage en todos los activos
4. **Link audit** — No hay links rotos ni a drafts
5. **Conteo final** — Números reales, no estimados

---

## Checklist Pre-Entrega

```
[ ] Build limpio (npm run build)
[ ] 0 títulos >60 chars
[ ] 0 títulos truncados
[ ] 100% artículos activos con schema
[ ] 100% artículos activos con interlinking
[ ] 0 links a artículos en draft
[ ] 0 anchor texts con capitalización incorrecta
[ ] Documento de auditoría entregado
[ ] Errores documentados con causa raíz
```

---

## Errores Comunes a Evitar

| Error | Prevención |
|-------|------------|
| Título truncado con "..." | Verificar longitud al crear, max 60 chars |
| Link a artículo en draft | Verificar drafts DESPUÉS de marcarlos |
| Anchor text con "nfpa" en minúscula | Regex de capitalización post-inserción |
| Tono consultor en FAQs | Leer la FAQ en voz alta — ¿suena a persona real? |
| Reportar antes de verificar | Correr validación final SIEMPRE |
| Velocidad sobre calidad | Frank prefiere 5 artículos perfectos que 20 mediocres |

---

## Tiempos Estimados por Fase

| Fase | Por artículo | 72 artículos |
|------|-------------|-------------|
| Auditoría | — | 30 min total |
| Canibalización | 5 min | 1-2 hrs |
| Reescritura | 15-20 min | 18-24 hrs |
| Schema + FAQs | 5-8 min | 6-10 hrs |
| Interlinking | 3-5 min | 4-6 hrs |
| Validación | — | 30 min total |

**Total estimado para 72 artículos: 30-43 horas de trabajo.**

---

*Este documento se actualiza con cada proyecto. Cada error nuevo se agrega a la sección de prevención.*
