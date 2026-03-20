---
title: "Válvula de Alarma en Rociadores: Prueba NFPA 25"
description: "Válvula de alarma en rociadores: cómo funciona, por qué suena sin incendio, prueba trimestral NFPA 25 y errores que desactivan la alarma sin que nadie lo sepa."
fechaActualizacion: "2026-03-19"
schema:
  - type: "Article"
    headline: "Válvula de Alarma en Rociadores: Funcionamiento y Prueba NFPA 25"
    author: "Gama de México"
    dateModified: "2026-03-19"
  - type: "FAQPage"
    questions:
      - q: "¿Cómo funciona una válvula de alarma en rociadores?"
        a: "Detecta el flujo de agua cuando un rociador se activa. El agua pasa por la válvula check interna, llena la cámara de alarma y activa el gong hidráulico (campana mecánica) y/o el presostato eléctrico que envía señal al panel de alarma. La cámara retardadora previene falsas alarmas por fluctuaciones de presión."
      - q: "¿Por qué suena la alarma de rociadores sin que haya incendio?"
        a: "Falsas alarmas por: fluctuaciones de presión en la red que mueven la clapper (válvula check interna), cámara retardadora obstruida que no absorbe picos transitorios, presostato mal calibrado, o fuga en la red de rociadores que genera flujo suficiente para activar la alarma."
      - q: "¿Cada cuánto se prueba la válvula de alarma?"
        a: "NFPA 25 exige prueba trimestral del gong hidráulico mediante la válvula de prueba (inspector's test). Inspección visual semanal. Prueba completa con flujo anual. La prueba trimestral verifica que la alarma suena cuando hay flujo — si no suena, un rociador puede activarse en incendio real sin que nadie lo sepa."
categoria: "valvulas"
autor:
  nombre: "Ing. Roberto Hernández"
  cargo: "Director Técnico en Sistemas Contra Incendios"
imagen: "/img/blog/valvulas-contra-incendios-nfpa-sala-control-industrial.avif"
imagenAlt: "Válvula de alarma para rociadores contra incendios NFPA 25"
tags: ["válvula de alarma", "rociadores", "NFPA 25", "gong hidráulico", "tubería húmeda", "tubería seca", "sprinkler systems"]
destacado: false
draft: false
tiempoLectura: 13
canonical: "https://gamademexico.com/blog/valvulas/valvula-alarma-rociadores-funcionamiento-prueba-nfpa-25"
noindex: false
---

La válvula de alarma es el corazón del sistema de rociadores automáticos. Es el componente que detecta el flujo de agua cuando un rociador se activa y genera simultáneamente dos acciones críticas: permite que el agua fluya hacia el rociador abierto para controlar el incendio, y activa las alarmas para notificar a los ocupantes del edificio y al cuerpo de bomberos.

Esta guía técnica explica el funcionamiento de las válvulas de alarma en sistemas de tubería húmeda y seca, los componentes asociados (cámara retardadora, gong hidráulico, interruptor de flujo), y los procedimientos de prueba conforme a **NFPA 25** para instalaciones industriales en México.

## Principio de Funcionamiento

### El concepto básico

En su forma más elemental, una válvula de alarma es una **válvula check especializada** que se abre cuando la presión del lado de suministro (aguas arriba) supera la presión del lado del sistema (aguas abajo). Esto ocurre cuando un rociador se abre por calor, reduciendo la presión del lado del sistema y permitiendo que el agua fluya.

La diferencia con una válvula check ordinaria es que la válvula de alarma tiene una **conexión de alarma** que deriva parte del flujo hacia un dispositivo de notificación (gong hidráulico o presostato eléctrico).

### Secuencia de activación

1. **El incendio calienta un rociador** hasta la temperatura de activación (normalmente 68°C o 74°C para rociadores estándar).
2. **El elemento fusible del rociador se rompe** y el agua comienza a fluir por el orificio del rociador.
3. **La presión en la tubería del sistema cae** por debajo de la presión de suministro.
4. **La clapeta de la válvula de alarma se abre** por el diferencial de presión.
5. **El agua fluye** simultáneamente hacia:
   - El rociador abierto (función principal de extinción).
   - La cámara retardadora y luego al gong hidráulico (alarma mecánica).
   - El presostato eléctrico (alarma eléctrica al panel).
6. **El gong hidráulico suena** — una campana mecánica activada por la presión del agua.
7. **El presostato envía señal** al panel de alarma contra incendios.
8. **El panel activa las alarmas** del edificio (sirenas, estrobos) y notifica a la estación central de monitoreo.

## Tipos de Válvulas de Alarma

### Válvula de Alarma de Tubería Húmeda (Wet Pipe Alarm Valve)

Es el tipo más común y simple. El sistema de tuberías está permanentemente lleno de agua bajo presión.

**Componentes principales:**

| Componente | Función |
|---|---|
| Cuerpo de la válvula | Aloja la clapeta y las conexiones |
| Clapeta (clapper) | Check interno que se abre con el flujo |
| Asiento de la clapeta | Superficie de sellado (latón o bronce) |
| Puerto de alarma | Conexión que deriva flujo hacia el gong |
| Cámara retardadora | Retrasa la alarma para evitar falsas alarmas |
| Gong hidráulico | Campana mecánica exterior activada por agua |
| Presostato de alarma | Interruptor eléctrico activado por presión |
| Drenaje principal | Para vaciar el sistema durante mantenimiento |
| Manómetros | Presión de suministro y presión del sistema |
| Válvula de prueba de alarma | Para probar el gong sin abrir un rociador |

**Ventajas del sistema húmedo:**
- El más simple y confiable.
- Respuesta inmediata — el agua ya está en las tuberías.
- Mantenimiento menor que los sistemas secos.
- Costo de instalación más bajo.

**Limitación:**
- No puede usarse donde las tuberías están expuestas a temperaturas bajo 4°C (riesgo de congelamiento).

### Válvula de Tubería Seca (Dry Pipe Valve)

En el sistema de tubería seca, las tuberías del sistema están llenas de aire comprimido o nitrógeno, no de agua. Cuando un rociador se abre, el aire escapa, la presión del sistema cae, y la válvula de tubería seca permite que el agua entre al sistema.

**Principio de operación:**

La válvula de tubería seca aprovecha un **diferencial de presión** para mantener el agua fuera del sistema. Una presión de aire relativamente baja (típicamente 20-40 psi) en el lado del sistema puede mantener cerrada la válvula contra una presión de agua significativamente mayor (80-175 psi) gracias a la **relación de áreas** de la clapeta (el lado del aire tiene mayor área que el lado del agua).

**Relación diferencial típica:** 6:1 a 15:1 (ejemplo: con relación 6:1, 20 psi de aire mantiene cerrada la válvula contra 120 psi de agua).

**Componentes adicionales respecto al sistema húmedo:**

| Componente | Función |
|---|---|
| Compresor de aire | Mantiene la presión de aire en el sistema |
| Acelerador (Quick Opening Device) | Acelera la liberación de aire para respuesta más rápida |
| Válvula de alivio de aire | Limita la presión máxima de aire |
| Presostato de baja presión de aire | Detecta pérdida anormal de aire (fuga) |

**Aplicaciones en México:**
- Estacionamientos abiertos en zonas de helada (Toluca, Pachuca, Durango).
- Bodegas de congelación en la industria alimentaria.
- Cámaras frigoríficas industriales.
- Techos y pasillos exteriores en zonas de altiplano.

### Válvula de Preacción (Preaction Valve)

La válvula de preacción combina elementos del sistema seco con un sistema de detección independiente:

- El sistema está lleno de aire (como el seco), pero la válvula no se abre solo por pérdida de presión de aire.
- Se requiere una **doble condición**: (1) activación del sistema de detección (detectores de humo o calor) Y (2) apertura de un rociador.
- Esto reduce significativamente las falsas descargas.

**Aplicaciones típicas en México:**
- Centros de datos y salas de servidores.
- Museos y galerías de arte.
- Archivos documentales (INAH, bibliotecas).
- Áreas con equipo electrónico de alto valor.

### Tabla Comparativa de Sistemas

| Característica | Húmeda | Seca | Preacción Simple | Preacción Doble |
|---|---|---|---|---|
| Medio en tubería | Agua | Aire/N₂ | Aire/N₂ | Aire/N₂ |
| Tiempo de respuesta | Inmediato | 30-60 seg | Depende de detección | Depende de detección |
| Riesgo de falsa descarga | Bajo | Bajo | Muy bajo | Mínimo |
| Costo de instalación | Base | 30-50% mayor | 50-80% mayor | 80-120% mayor |
| Mantenimiento | Bajo | Medio-Alto | Alto | Alto |
| Aplicación principal | General | Zonas frías | Áreas sensibles al agua | Centros de datos |

## La Cámara Retardadora

### Función

La **cámara retardadora** (retard chamber) es un recipiente cilíndrico que se instala entre el puerto de alarma de la válvula y el gong hidráulico. Su función es **retrasar la activación de la alarma** durante las fluctuaciones normales de presión del suministro de agua.

### ¿Por qué es necesaria?

Sin la cámara retardadora, cualquier fluctuación de presión en la red pública (golpe de ariete, arranque de bomba, cierre de válvula en otro punto de la red) podría mover brevemente la clapeta de la válvula de alarma, enviando un pulso de agua al gong y generando una **falsa alarma**.

La cámara retardadora absorbe este pulso: el agua entra al cilindro, pero si la fluctuación es breve (típicamente <30 segundos), el agua drena a través de un orificio calibrado en la base del cilindro antes de alcanzar la altura del tubo de salida al gong.

Si la clapeta se mantiene abierta (activación real de un rociador), la cámara se llena completamente y el agua fluye al gong, activando la alarma.

### Mantenimiento de la cámara retardadora

- **Mensual:** Verificar que el drenaje inferior no está obstruido.
- **Trimestral:** Drenar cualquier residuo acumulado.
- **Anual:** Inspección interna del orificio calibrado y limpieza.

## El Gong Hidráulico (Water Motor Gong)

### Descripción y funcionamiento

El **gong hidráulico** es una campana mecánica de bronce o aluminio activada por la presión del agua. Cuando el agua fluye desde la cámara retardadora, impulsa una turbina que hace girar un martillo contra la campana, generando un sonido de alarma audible a gran distancia (típicamente >60 dB a 30 metros).

**Ventajas del gong hidráulico:**
- No requiere electricidad — funciona con la presión del agua del sistema.
- Es la alarma de respaldo si falla el sistema eléctrico.
- Sonido distintivo e inconfundible.
- Operación extremadamente confiable.

**Instalación:**
- Se monta en el exterior del edificio, en una ubicación visible y audible.
- La tubería desde la válvula de alarma debe tener pendiente descendente continua hacia el gong (sin trampas de agua).
- La descarga del gong debe dirigirse a un drenaje o área donde el agua no cause daño.

## Procedimientos de Prueba (NFPA 25)

### Prueba trimestral de la válvula de alarma

La **NFPA 25** (Sección 12.3.3) requiere una prueba trimestral del sistema de alarma:

**Procedimiento:**

1. **Notificar** al centro de monitoreo y a los ocupantes del edificio que se realizará una prueba.
2. **Abrir la válvula de prueba de alarma** (bypass valve) de la válvula de alarma. Esta válvula simula el flujo que ocurriría si un rociador se activara, sin realmente abrir un rociador.
3. **Verificar** que:
   - El gong hidráulico suena dentro de los 60 segundos.
   - El presostato eléctrico se activa y envía señal al panel de alarma.
   - El panel de alarma muestra la alarma de flujo de agua.
   - La señal se transmite a la estación central (si aplica).
4. **Medir el tiempo** entre la apertura de la válvula de prueba y la activación de cada alarma.
5. **Cerrar la válvula de prueba.**
6. **Verificar** que la clapeta de la válvula de alarma se resella correctamente.
7. **Verificar** que los manómetros muestran presiones normales.
8. **Restaurar** todas las alarmas en el panel.
9. **Notificar** al centro de monitoreo y ocupantes que la prueba concluyó.
10. **Registrar** todos los resultados en la bitácora de mantenimiento.

### Inspección anual de la válvula de alarma

**Inspección externa:**
- Estado del cuerpo de la válvula (corrosión, fugas).
- Estado de los manómetros (lecturas correctas, calibración vigente).
- Estado del gong hidráulico (campana intacta, turbina libre).
- Estado de la cámara retardadora (drenaje funcional, sin depósitos).

**Inspección interna (cada 5 años o cuando lo indique la inspección externa):**
- Abrir la válvula y examinar la clapeta y el asiento.
- Verificar que la clapeta se mueve libremente.
- Verificar el estado del asiento de sellado.
- Limpiar depósitos minerales o sedimentos.
- Verificar el resorte (si lo tiene).
- Re-ensamblar y realizar prueba hidrostática.

### Prueba del inspector's test connection

La **conexión de prueba del inspector** es un punto de descarga ubicado en el rociador más remoto del sistema (el punto hidráulicamente más desfavorable). Su propósito es verificar que el flujo de un solo rociador es detectado por la válvula de alarma.

**Procedimiento trimestral:**

1. Notificar al centro de monitoreo.
2. Abrir el inspector's test connection (simula un rociador abierto en el punto más lejano).
3. Cronometrar el tiempo hasta que:
   - El gong suena.
   - El presostato se activa.
   - El panel muestra alarma de flujo.
4. **Tiempos máximos aceptables:**
   - Sistema húmedo: 60 segundos.
   - Sistema seco: 60 segundos después de la aparición de agua.
5. Cerrar la conexión de prueba.
6. Verificar que el sistema se restablece a condiciones normales.

### Tabla de frecuencias de prueba (NFPA 25)

| Componente | Inspección Visual | Prueba Funcional | Inspección Interna |
|---|---|---|---|
| Válvula de alarma (húmeda) | Mensual | Trimestral | Cada 5 años |
| Válvula de tubería seca | Mensual | Trimestral + anual completa | Cada 5 años |
| Gong hidráulico | Trimestral | Trimestral | Anual |
| Cámara retardadora | Trimestral | Trimestral (drenaje) | Anual |
| Presostato de alarma | Trimestral | Trimestral | Cada 5 años |
| Inspector's test connection | Trimestral | Trimestral | N/A |
| Manómetros | Mensual | Anual (calibración) | N/A |

## Problemas Comunes y Soluciones

### Falsas alarmas

Las falsas alarmas son el problema más frecuente y generan desensibilización de los ocupantes y costos operativos:

| Causa | Solución |
|---|---|
| Fluctuación de presión de red pública | Verificar cámara retardadora; ajustar orificio de drenaje |
| Golpe de ariete por arranque de bomba | Instalar supresor de golpe de ariete |
| Fuga en la clapeta de la válvula | Limpiar o reemplazar asiento de la clapeta |
| Cámara retardadora con drenaje tapado | Limpiar orificio de drenaje |
| Presostato demasiado sensible | Calibrar o reemplazar presostato |

### Falla de activación (no suena el gong)

| Causa | Solución |
|---|---|
| Tubería al gong obstruida | Drenar y limpiar la tubería |
| Turbina del gong atascada | Limpiar y lubricar la turbina |
| Campana del gong dañada | Reemplazar campana |
| Cámara retardadora mal calibrada | Verificar orificio; limpiar |
| Válvula de prueba cerrada | Verificar posición de la válvula |

## Consideraciones para Instalaciones en México

### Calidad del agua de suministro

En muchas zonas de México, el agua de la red municipal contiene sedimentos, altos niveles de minerite y, en ocasiones, materia orgánica. Esto afecta:

- **Asiento de la clapeta:** Depósitos que impiden el sellado correcto.
- **Orificio de la cámara retardadora:** Obstrucción que impide el drenaje.
- **Turbina del gong:** Sedimentos que atoran el mecanismo.

**Solución:** Instalar filtro tipo Y en la línea de suministro antes de la válvula de alarma. Limpiar el filtro trimestralmente.

### Presión de suministro variable

En varias ciudades de México, la presión de la red municipal varía significativamente durante el día (60 psi en la madrugada, 35 psi en horas pico). Esto puede:

- Causar falsas alarmas por fluctuaciones de presión.
- Reducir la presión disponible para los rociadores en el momento del incendio.

**Solución:** Instalar bomba de incendio con tanque de succión o cisterna de reserva para independizar la presión del sistema de la red municipal.


---

### Lecturas relacionadas

- [Los sistemas de rociadores automáticos](/blog/valvulas-contra-incendios/sistemas-rociadores-automaticos-nfpa-13-mexico)
- [El programa de mantenimiento NFPA 25](/blog/valvulas-contra-incendios/mantenimiento-preventivo-valvulas-contra-incendios-nfpa-25)
- [Las válvulas check en sistemas sprinkler](/blog/valvulas-contra-incendios/valvulas-check-retencion-sistemas-sprinkler-nfpa-13)

## Conclusión

La válvula de alarma es el componente que conecta la función hidráulica (extinción) con la función de notificación (alarma) del sistema de rociadores. Su correcto funcionamiento requiere un programa de pruebas trimestrales conforme a NFPA 25, con verificación del gong hidráulico, el presostato eléctrico y la conexión de prueba del inspector.

Para instalaciones industriales en México, donde las condiciones de calidad de agua y presión de suministro pueden ser variables, el mantenimiento preventivo de la válvula de alarma y sus componentes asociados es particularmente crítico para evitar tanto las falsas alarmas como las fallas de activación en emergencias reales.

Gama de México suministra válvulas de alarma certificadas UL/FM para sistemas de tubería húmeda y seca, con soporte técnico en instalación, puesta en servicio y programas de mantenimiento para proyectos industriales en todo el territorio mexicano.
