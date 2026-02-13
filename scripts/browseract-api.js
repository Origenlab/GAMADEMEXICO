/**
 * BrowserAct API Integration
 * Script para buscar productos de monitores tipo corazón
 *
 * INSTRUCCIONES:
 * 1. Reemplaza TU_API_KEY_AQUI con tu API key de BrowserAct
 * 2. Ejecuta: node scripts/browseract-api.js
 */

const BROWSERACT_API_KEY = 'TU_API_KEY_AQUI'; // <-- Reemplaza con tu API key
const BASE_URL = 'https://api.browseract.com/v2';

// Headers de autenticación
const headers = {
  'Authorization': `Bearer ${BROWSERACT_API_KEY}`,
  'Content-Type': 'application/json'
};

/**
 * 1. Listar workflows disponibles
 */
async function listWorkflows() {
  console.log('📋 Listando workflows disponibles...\n');

  try {
    const response = await fetch(`${BASE_URL}/workflow/list-workflows`, {
      method: 'GET',
      headers
    });

    const data = await response.json();
    console.log('Workflows encontrados:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Error listando workflows:', error.message);
  }
}

/**
 * 2. Ejecutar un workflow específico
 */
async function runWorkflow(workflowId, inputParams = {}) {
  console.log(`🚀 Ejecutando workflow: ${workflowId}\n`);

  try {
    const response = await fetch(`${BASE_URL}/workflow/run`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        workflow_id: workflowId,
        inputs: inputParams,
        timeout: 3600 // 1 hora
      })
    });

    const data = await response.json();
    console.log('Resultado:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Error ejecutando workflow:', error.message);
  }
}

/**
 * 3. Ejecutar un agente con prompt natural
 * (Este es el endpoint más útil - ejecuta tareas descritas en lenguaje natural)
 */
async function runAgent(taskDescription) {
  console.log(`🤖 Ejecutando agente con tarea:\n"${taskDescription}"\n`);

  try {
    // Intentar endpoint de agente
    const response = await fetch(`${BASE_URL}/agent/run`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        task: taskDescription,
        timeout: 3600,
        output_format: 'json'
      })
    });

    const data = await response.json();
    console.log('Resultado del agente:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Error ejecutando agente:', error.message);
  }
}

/**
 * 4. Obtener estado de una tarea
 */
async function getTaskStatus(taskId) {
  console.log(`📊 Obteniendo estado de tarea: ${taskId}\n`);

  try {
    const response = await fetch(`${BASE_URL}/task/${taskId}/status`, {
      method: 'GET',
      headers
    });

    const data = await response.json();
    console.log('Estado:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Error obteniendo estado:', error.message);
  }
}

/**
 * 5. Obtener resultados de una tarea
 */
async function getTaskResults(taskId) {
  console.log(`📥 Obteniendo resultados de tarea: ${taskId}\n`);

  try {
    const response = await fetch(`${BASE_URL}/task/${taskId}/results`, {
      method: 'GET',
      headers
    });

    const data = await response.json();
    console.log('Resultados:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Error obteniendo resultados:', error.message);
  }
}

// ============================================
// TAREA ESPECÍFICA: Buscar Monitores Tipo Corazón
// ============================================

const TASK_MONITORES = `
Busca productos de "monitores tipo corazón" o "Copperhead fire monitors" para protección contra incendios en los siguientes sitios web:

1. https://www.elkhartbrass.com - buscar "Copperhead" o "monitor"
2. https://www.akronbrass.com - buscar "fixed monitor"
3. https://www.grainger.com - buscar "fire monitor"

Para cada producto encontrado, extrae:
- Nombre del producto
- Marca
- Modelo/SKU
- Precio (si está disponible)
- Caudal en GPM
- Presión en PSI
- Material
- Certificaciones (UL, FM)
- URL de la imagen
- URL del producto

Devuelve los resultados en formato JSON con esta estructura:
{
  "productos": [
    {
      "nombre": "",
      "marca": "",
      "modelo": "",
      "precio": "",
      "caudal_gpm": "",
      "presion_psi": "",
      "material": "",
      "certificaciones": [],
      "imagen_url": "",
      "url_producto": ""
    }
  ]
}

Solo incluye monitores fijos de tipo corazón (heart-shaped base), no portátiles.
`;

// ============================================
// EJECUTAR PRUEBAS
// ============================================

async function main() {
  console.log('='.repeat(60));
  console.log('🔥 BrowserAct API - Búsqueda de Monitores Tipo Corazón');
  console.log('='.repeat(60));
  console.log();

  if (BROWSERACT_API_KEY === 'TU_API_KEY_AQUI') {
    console.log('⚠️  ERROR: Debes configurar tu API key de BrowserAct');
    console.log('   Edita este archivo y reemplaza TU_API_KEY_AQUI con tu key real');
    console.log();
    console.log('   Para obtener tu API key:');
    console.log('   1. Ve a https://www.browseract.com/');
    console.log('   2. Inicia sesión');
    console.log('   3. Ve a Dashboard > Integrations and API');
    console.log('   4. Crea una nueva API Key');
    console.log();
    return;
  }

  // Paso 1: Listar workflows existentes
  console.log('\n--- PASO 1: Verificar conexión y listar workflows ---\n');
  const workflows = await listWorkflows();

  // Paso 2: Intentar ejecutar agente con la tarea
  console.log('\n--- PASO 2: Ejecutar agente de búsqueda ---\n');
  const agentResult = await runAgent(TASK_MONITORES);

  // Si el agente devuelve un task_id, esperar y obtener resultados
  if (agentResult && agentResult.task_id) {
    console.log('\n--- PASO 3: Esperando resultados... ---\n');

    // Esperar 30 segundos y verificar estado
    await new Promise(resolve => setTimeout(resolve, 30000));

    const status = await getTaskStatus(agentResult.task_id);

    if (status && status.status === 'completed') {
      const results = await getTaskResults(agentResult.task_id);

      // Guardar resultados
      if (results && results.productos) {
        const fs = require('fs');
        fs.writeFileSync(
          'scripts/monitores-encontrados.json',
          JSON.stringify(results, null, 2)
        );
        console.log('\n✅ Resultados guardados en: scripts/monitores-encontrados.json');
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('Proceso completado');
  console.log('='.repeat(60));
}

// Ejecutar
main().catch(console.error);
