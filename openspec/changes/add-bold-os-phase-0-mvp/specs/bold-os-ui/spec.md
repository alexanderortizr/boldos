## ADDED Requirements

### Requirement: Bold OS Dashboard muestra estado del negocio de forma glanceable

La Bold App SHALL incluir una sección Bold OS Dashboard accesible desde el menú principal que permita al usuario entender el estado de su negocio en ≤5 segundos, mediante un indicador visual de salud (🟢 todo en orden, 🟡 atención requerida, 🔴 crítico) y tarjetas por agente activo (Capital, Impuestos, Nómina).

#### Scenario: Usuario abre el Dashboard
- **WHEN** un alpha user abre la sección Bold OS
- **THEN** ve en la parte superior un indicador de estado global, y abajo tarjetas con los datos clave de cada agente activo (capital disponible, impuestos provisionados, próximo pago de nómina)

#### Scenario: Estado crítico visible
- **WHEN** existe una alerta crítica activa (ej. no alcanza para nómina)
- **THEN** el indicador global es 🔴 y la tarjeta correspondiente se muestra expandida en la parte superior

### Requirement: Dashboard carga rápido incluso en 4G

El Bold OS Dashboard SHALL cargar en ≤2 segundos (p95) en conexiones 4G colombianas promedio.

#### Scenario: Carga en 4G
- **WHEN** un alpha user abre el Dashboard por primera vez en la sesión en una red 4G
- **THEN** el contenido interactivo es visible en ≤2 segundos (p95)

### Requirement: Agent Configuration Panel permite activar/desactivar agentes y ajustar thresholds

El usuario SHALL poder activar/desactivar individualmente cada agente (RF-CFG-001), configurar thresholds personalizados (ej. "sólo notificarme oportunidades >$500k", RF-CFG-002), y elegir nivel de autonomía: Manual / Semi-Autónomo / Totalmente Autónomo (RF-CFG-003).

#### Scenario: Activar un agente
- **WHEN** el usuario entra a la sección de configuración y activa "Agente de Impuestos"
- **THEN** el agente empieza a operar en ≤1 minuto y el usuario ve confirmación

#### Scenario: Ajustar threshold
- **WHEN** el usuario configura el threshold del Liquidity Agent a "notificar sólo ahorros >$500k"
- **THEN** el sistema persiste la preferencia y el Agent respeta el umbral desde la siguiente ejecución

#### Scenario: Cambiar nivel de autonomía
- **WHEN** el usuario elige "Semi-Autónomo" para el Payroll Agent
- **THEN** el Agent requerirá aprobación explícita para cada ejecución aunque la confianza sea alta

### Requirement: Notifications Center respeta preferencias de canal

El sistema SHALL respetar las preferencias de canal del usuario (push, email, SMS, WhatsApp) para cada tipo de notificación (RF-CFG-004), y aplicar las reglas por nivel: críticas por push+SMS+email, importantes por push+email, informativas sólo in-app.

#### Scenario: Usuario desactiva SMS
- **WHEN** un usuario desactiva SMS en sus preferencias
- **THEN** las notificaciones críticas le llegan sólo por push y email; no se envía SMS

#### Scenario: Quiet hours
- **WHEN** una notificación no crítica se dispara durante las quiet hours del usuario
- **THEN** se difiere hasta el inicio de la ventana permitida

### Requirement: Notifications Center previene fatiga

El Notifications Center SHALL detectar y mitigar la fatiga de notificaciones: si el usuario ignora 3 notificaciones consecutivas del mismo tipo, la frecuencia de ese tipo se reduce automáticamente y se ofrece ajuste de preferencias.

#### Scenario: Auto-reducción por ignorar
- **WHEN** un usuario ignora 3 notificaciones consecutivas del tipo "benchmarking"
- **THEN** el sistema reduce la frecuencia de ese tipo y muestra un prompt in-app: "¿Quieres seguir recibiendo insights de benchmarking?"

### Requirement: Autonomous Actions Log expone el historial completo

La Bold App SHALL incluir un Autonomous Actions Log accesible desde el Dashboard que muestre cronológicamente todas las acciones tomadas por los agentes (ejecutadas, aprobadas, rechazadas, revertidas) con explicabilidad, filtros por agente y por tipo, y links a artefactos (PDFs, desprendibles).

#### Scenario: Ver acciones de la última semana
- **WHEN** el usuario abre el Log
- **THEN** ve listados los eventos de los últimos 7 días con fecha, agente, tipo, monto, estado y botón "Ver detalles"

#### Scenario: Filtrar por agente
- **WHEN** el usuario filtra por "Agente de Nómina"
- **THEN** ve sólo las acciones de ese agente, más antiguas al final

### Requirement: Usuario puede revertir acciones dentro de 24h desde la UI

El usuario SHALL poder revertir cualquier acción autónoma reversible dentro de 24 horas desde la UI con un tap, sin penalidad (RF-CFG-005).

#### Scenario: Revert desde el Log
- **WHEN** el usuario toca "Revertir" en una acción ejecutada hace 12h que es reversible
- **THEN** el sistema la revierte, muestra confirmación y el Log refleja `outcome=reverted`

#### Scenario: Acción no reversible
- **WHEN** la acción es una transferencia a tercero ya confirmada
- **THEN** el UI muestra el botón "Revertir" deshabilitado con tooltip "Esta acción no es reversible"

### Requirement: UI muestra explicaciones humanas con progressive disclosure

Toda notificación o entrada del Log SHALL mostrar una explicación en lenguaje simple, con la posibilidad de expandir a detalles técnicos (contributing factors con magnitudes) mediante progressive disclosure.

#### Scenario: Expandir explicación
- **WHEN** el usuario toca "¿Por qué me recomiendan esto?" en una notificación
- **THEN** la UI expande un panel con 2-5 factores, cada uno con magnitud y descripción simple

### Requirement: UI soporta onboarding white-glove de alpha users

La primera vez que un alpha user abre Bold OS, la UI SHALL guiarlo por un onboarding de 3-5 pasos que explique qué es Bold OS, cuáles agentes quiere activar y con qué nivel de autonomía empezar.

#### Scenario: Primer uso
- **WHEN** un alpha user abre Bold OS por primera vez
- **THEN** ve un flow de onboarding con slides/prompts que termina con ≥1 agente activo y preferencias de notificaciones configuradas

### Requirement: UI cumple export y deletion del usuario

La UI SHALL exponer acciones para solicitar export de datos y eliminación de cuenta, consistente con RT-PRIV-001 y RT-PRIV-002.

#### Scenario: Solicitar export
- **WHEN** el usuario entra a Ajustes > Datos y solicita export
- **THEN** el sistema confirma la solicitud y notifica al usuario cuando esté listo (link firmado vía email en ≤72h)

#### Scenario: Solicitar eliminación
- **WHEN** el usuario confirma eliminación de cuenta
- **THEN** el sistema ejecuta borrado según contrato del capability `financial-graph` y confirma una vez completado (≤72h)
