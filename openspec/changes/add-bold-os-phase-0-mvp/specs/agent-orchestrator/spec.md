## ADDED Requirements

### Requirement: Orchestrator mantiene un registry de agentes

El Orchestrator SHALL mantener un registry de agentes activos con metadata: `agent_id`, `version`, `capabilities`, `priority_class`, `enabled`, `health_status`, y permitir habilitar/deshabilitar agentes dinámicamente sin reinicio.

#### Scenario: Registrar un agente nuevo
- **WHEN** se despliega una nueva versión del Tax Agent y se registra vía API interna
- **THEN** el Orchestrator lo agrega al registry y empieza a rutearle eventos relevantes sin reinicio

#### Scenario: Desactivar agente en runtime
- **WHEN** un operador marca el Liquidity Agent como `enabled=false`
- **THEN** el Orchestrator deja de generar action proposals para ese agente en ≤1 minuto

### Requirement: Orchestrator prioriza acciones críticas sobre informativas

El Orchestrator SHALL asignar prioridades a las acciones propuestas por los agentes y ejecutar/notificar primero las de mayor prioridad; acciones críticas (alertas de liquidez, riesgo en nómina) SHALL preempt a acciones informativas (benchmarking, insights).

#### Scenario: Preemption de acción informativa por crítica
- **WHEN** el Orchestrator tiene en cola un insight de benchmarking y entra una alerta de "no hay dinero para nómina"
- **THEN** la alerta crítica se despacha primero; el insight espera o se descarta si ya pasó su ventana

### Requirement: Orchestrator limita la frecuencia de notificaciones

El Orchestrator SHALL enviar como máximo 3 notificaciones críticas por día por usuario y respetar quiet hours (default 22:00-07:00 COT, configurable por usuario).

#### Scenario: Cap diario de notificaciones críticas
- **WHEN** ya se enviaron 3 notificaciones críticas al usuario en el día
- **THEN** el Orchestrator bufferiza las siguientes críticas hasta el día siguiente, excepto aquellas marcadas como `time_sensitive=true` con ventana expirando en <24h

#### Scenario: Quiet hours
- **WHEN** una notificación no-crítica se intenta enviar durante quiet hours
- **THEN** se difiere hasta el inicio de la ventana permitida; las críticas sí pasan pero se agrupan si hay varias

### Requirement: Orchestrator resuelve conflictos entre agentes

Cuando dos o más agentes proponen acciones que se contradicen (ej. Liquidez sugiere usar efectivo; Impuestos sugiere reservarlo), el Orchestrator SHALL resolver el conflicto basado en reglas de prioridad y confianza, y notificar al usuario con las opciones y trade-offs.

#### Scenario: Conflicto Liquidez vs Impuestos
- **WHEN** Liquidity Agent propone financiar una compra con $X y Tax Agent reporta que necesita provisionar $Y superpuesto sobre el mismo Bolsillo
- **THEN** el Orchestrator presenta al usuario una notificación combinada con ambas recomendaciones y no ejecuta autónomamente ninguna hasta obtener input

### Requirement: Orchestrator ejecuta acciones con validación previa

El Orchestrator SHALL validar cada action proposal antes de ejecutar (confidence threshold, balance suficiente, permisos vigentes, MFA si aplica) y rechazar las que no cumplan, registrando el motivo.

#### Scenario: Bloqueo por threshold de confianza
- **WHEN** un agente propone una acción con `confidence=0.75`
- **THEN** el Orchestrator no auto-ejecuta; la convierte en notificación 1-tap (si ≥0.8) o la descarta (<0.8)

#### Scenario: MFA obligatorio para movimientos >$5M COP
- **WHEN** un agente intenta ejecutar autónomamente un movimiento de dinero >$5M COP
- **THEN** el Orchestrator fuerza MFA del usuario antes de ejecutar, sin excepción

### Requirement: Orchestrator soporta modo vacaciones

El Orchestrator SHALL permitir al usuario pausar todos los agentes temporalmente (modo "vacaciones") con una fecha de reactivación; durante la pausa no se ejecutan acciones autónomas ni se envían notificaciones no críticas, pero se mantiene la ejecución de acciones críticas ya comprometidas (ej. nómina ya aprobada).

#### Scenario: Activar modo vacaciones
- **WHEN** el usuario activa modo vacaciones del 1 al 10 de julio
- **THEN** durante ese periodo el Orchestrator no genera action proposals nuevas, excepto acciones críticas previamente aprobadas o riesgos inminentes que requieran atención del usuario

### Requirement: Orchestrator registra toda acción autónoma en un log auditable

El Orchestrator SHALL registrar todas las acciones (propuestas, ejecutadas, rechazadas, revertidas) en un log inmutable con `timestamp`, `agent_id`, `merchant_id`, `action_type`, `confidence`, `explanation`, `outcome`, y `user_response`. El log SHALL ser consultable por el usuario (vía UI) y por operadores/compliance.

#### Scenario: Registro completo de acción
- **WHEN** el Payroll Agent ejecuta el pago de nómina
- **THEN** el log contiene una entrada con todos los campos normativos; ninguna edición posterior es posible (append-only)

### Requirement: Orchestrator soporta revert de acciones autónomas

El Orchestrator SHALL permitir revertir cualquier acción autónoma reversible dentro de 24h desde la ejecución, sin penalidad para el usuario. Las acciones con movimientos irreversibles a terceros (transferencia externa ya confirmada) SHALL estar marcadas como no-reversibles y requerir aprobación explícita previa.

#### Scenario: Revert dentro de 24h
- **WHEN** el usuario toca "Revertir" en una provisión automática hecha hace 10h
- **THEN** el Orchestrator deshace la provisión y el Log refleja `outcome=reverted`

#### Scenario: Revert fuera de ventana
- **WHEN** el usuario intenta revertir una acción de hace 30h
- **THEN** el sistema muestra error "fuera de ventana de 24h" y el log permanece inalterado

### Requirement: Orchestrator expone health y métricas

El Orchestrator SHALL exponer endpoints de health check y métricas (acciones propuestas/ejecutadas/rechazadas por agente, latencia p50/p95, rate de notificaciones, conflictos resueltos) compatibles con Datadog.

#### Scenario: Métricas observables
- **WHEN** un SRE consulta el dashboard de Datadog
- **THEN** ve el throughput de acciones por agente, latencia por tipo de acción y rate de conflictos/resoluciones
