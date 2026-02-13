# Prompt para Crear Workflow en BrowserAct
## Scraping de Monitores Tipo Corazón para Protección Perimetral

---

## INSTRUCCIONES DE USO

1. Abre BrowserAct en tu navegador (https://www.browseract.com/)
2. Inicia sesión en tu cuenta
3. Ve a la sección de crear nuevo Workflow o usa el AI Agent
4. Copia y pega el prompt de abajo

---

## PROMPT PARA BROWSERACT

```
Necesito crear un workflow profesional de web scraping para extraer información de productos industriales de protección contra incendios.

## OBJETIVO
Buscar y extraer datos de "Monitores Tipo Corazón" (también conocidos como "Heart-shaped fire monitors" o "Copperhead monitors") que son equipos de protección perimetral contra incendios utilizados en refinerías, plantas químicas y terminales de almacenamiento.

## SITIOS WEB A SCRAPEAR (en orden de prioridad)

### Sitios principales de fabricantes:
1. https://www.elkhartbrass.com/ - Buscar "Copperhead monitor" o "heart monitor"
2. https://www.akronbrass.com/ - Buscar "fixed monitor" o "industrial monitor"
3. https://www.tft.com/ - Task Force Tips, buscar "ground monitor"
4. https://www.pfrproducts.com/ - POK fire monitors

### Distribuidores industriales:
5. https://www.grainger.com/ - Buscar "fire monitor industrial"
6. https://www.globalindustrial.com/ - Buscar "fire monitor"

## DATOS A EXTRAER POR CADA PRODUCTO

Para cada producto encontrado, extraer:

1. **nombre_producto** (string): Nombre completo del producto
2. **marca** (string): Fabricante (Elkhart Brass, Akron Brass, TFT, POK, etc.)
3. **modelo** (string): Número de modelo o SKU
4. **descripcion** (string): Descripción del producto (máximo 300 caracteres)
5. **precio** (string): Precio si está disponible, o "Solicitar cotización"
6. **caudal_gpm** (string): Capacidad de flujo en GPM (gallons per minute)
7. **presion_psi** (string): Presión de trabajo en PSI
8. **material** (string): Material de construcción (bronce, acero inoxidable, etc.)
9. **conexion_entrada** (string): Tamaño de conexión de entrada (2.5", 3", etc.)
10. **rotacion** (string): Grados de rotación horizontal/vertical
11. **certificaciones** (array): Lista de certificaciones (UL, FM, NFPA, etc.)
12. **imagen_url** (string): URL de la imagen principal del producto
13. **url_producto** (string): URL de la página del producto
14. **disponibilidad** (string): Estado de disponibilidad

## FILTROS Y CRITERIOS

- Solo productos que sean monitores FIJOS de base tipo corazón o heart-shaped
- Excluir monitores portátiles o de mano
- Excluir boquillas sueltas
- Preferir productos con certificación UL o FM
- Caudal mínimo: 250 GPM
- Incluir tanto productos para agua como para espuma

## FORMATO DE SALIDA

Generar un archivo JSON con la siguiente estructura:

{
  "fecha_extraccion": "YYYY-MM-DD",
  "total_productos": numero,
  "productos": [
    {
      "nombre_producto": "",
      "marca": "",
      "modelo": "",
      "descripcion": "",
      "precio": "",
      "especificaciones": {
        "caudal_gpm": "",
        "presion_psi": "",
        "material": "",
        "conexion_entrada": "",
        "rotacion": ""
      },
      "certificaciones": [],
      "imagen_url": "",
      "url_producto": "",
      "disponibilidad": "",
      "fuente": ""
    }
  ]
}

## CONFIGURACIÓN DEL WORKFLOW

- Tiempo de espera entre requests: 3-5 segundos (para evitar bloqueos)
- Manejar paginación automáticamente
- Capturar screenshots de errores para debugging
- Reintentar máximo 3 veces si hay fallo de carga
- Ignorar popups de cookies y newsletters

## NOTAS ADICIONALES

- Los monitores tipo corazón también se conocen como:
  - "Copperhead monitors" (marca Elkhart Brass)
  - "Heart-shaped base monitors"
  - "Fixed ground monitors"
  - "Industrial fire monitors"
  - "Perimeter protection monitors"

- Términos de búsqueda alternativos:
  - "monitor contra incendio fijo"
  - "fire monitor 360 rotation"
  - "industrial fire monitor bronze"
  - "refinery fire monitor"

Por favor, crea el workflow paso a paso y asegúrate de que maneje correctamente:
1. Navegación a cada sitio
2. Búsqueda del término
3. Extracción de datos de cada producto
4. Manejo de paginación
5. Exportación a JSON
```

---

## DESPUÉS DE CREAR EL WORKFLOW

Una vez creado el workflow en BrowserAct:

1. **Ejecuta el workflow** para probarlo
2. **Obtén el Workflow ID** desde la URL o el dashboard
3. **Crea una API Key** en Integrations > API
4. **Comparte conmigo**:
   - El Workflow ID
   - Tu API Key (o confirma que la tienes)
   - El formato de respuesta que obtuviste

Con esa información, integraremos los resultados en la página de Monitores Tipo Corazón de tu sitio.

---

## EJEMPLO DE INTEGRACIÓN EN EL SITIO

Una vez tengamos los datos, crearemos:

1. **Sección de "Productos del Mercado"** - Mostrando productos de diferentes proveedores
2. **Comparador de especificaciones** - Tabla comparativa
3. **Actualización automática** - Via API para mantener datos frescos
4. **CTA inteligentes** - Botones de cotización con datos del producto

---

## ALTERNATIVA: PROMPT SIMPLIFICADO

Si el prompt anterior es muy largo, usa este más corto:

```
Crea un workflow para buscar "fire monitor heart shaped" o "Copperhead monitor" en estos sitios:
- elkhartbrass.com
- akronbrass.com
- tft.com
- grainger.com

Extrae: nombre, marca, modelo, precio, GPM, PSI, material, certificaciones, imagen URL, link del producto.

Exporta como JSON.
```
