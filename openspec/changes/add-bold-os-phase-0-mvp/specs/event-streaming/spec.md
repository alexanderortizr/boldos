## ADDED Requirements

### Requirement: Transaction events se publican en tiempo real

El sistema SHALL publicar cada transacción completada en Bold Pagos (datáfono, QR, link) como evento `transaction.completed` en Kafka con latencia ≤100ms desde el cierre de la transacción hasta disponible para consumidores.

#### Scenario: Evento disponible en <100ms
- **WHEN** una transacción se completa en un datáfono Bold
- **THEN** el evento `transaction.completed` está disponible en el topic Kafka en ≤100ms (p95)

#### Scenario: Schema conforme
- **WHEN** se publica un `transaction.completed`
- **THEN** el evento incluye `event_id` (uuid), `event_type`, `timestamp` (ISO8601 UTC), `merchant_id`, `amount`, `currency`, `payment_method`, opcionalmente `customer_token` y `metadata` (device_id, location)

### Requirement: El sistema soporta eventos de acciones de agentes

El sistema SHALL publicar un evento `agent.action.executed` para cada acción tomada por un agente (autónoma o aprobada por usuario), incluyendo `agent_id`, `merchant_id`, `action_type`, `action_details`, `confidence` y `user_response`.

#### Scenario: Acción autónoma registrada
- **WHEN** el Liquidity Agent pre-aprueba un crédito autónomamente
- **THEN** se publica un `agent.action.executed` con `user_response=null`, `confidence>=0.8` y `action_type="credit.pre_approved"`

#### Scenario: Acción con respuesta del usuario
- **WHEN** el Payroll Agent solicita aprobación y el usuario la acepta
- **THEN** se publica un `agent.action.executed` con `user_response="accepted"`

### Requirement: Event streaming soporta throughput de picos

El stream SHALL soportar sostenidamente 10,000 eventos/segundo durante picos (Black Friday, cierres de mes) sin pérdida de eventos y manteniendo latencia ≤100ms p95.

#### Scenario: Pico de Black Friday simulado
- **WHEN** se simula carga de 10k eventos/s durante 2 horas
- **THEN** el sistema no pierde eventos y mantiene p95 end-to-end ≤100ms

#### Scenario: Backpressure en saturación
- **WHEN** los consumers no pueden procesar al ritmo de ingesta (lag >5 min)
- **THEN** el sistema aplica graceful degradation: samplea eventos no-críticos y preserva los críticos (transacciones y acciones de agente)

### Requirement: Retención de eventos para replay y reentrenamiento

El Event Store SHALL retener todos los eventos transaccionales por al menos 2 años en storage de largo plazo (S3 + Kafka con retention extendida o archivado), permitiendo replay para reentrenamiento de modelos o auditoría.

#### Scenario: Replay para reentrenamiento
- **WHEN** el equipo de ML ejecuta un reentrenamiento sobre los últimos 18 meses
- **THEN** puede consumir los eventos históricos desde el Event Store sin pérdida

#### Scenario: Auditoría
- **WHEN** se solicita auditoría de una acción específica de hace 14 meses
- **THEN** el sistema recupera el evento original y eventos relacionados desde el Event Store

### Requirement: Ordering garantizado por merchant

El stream SHALL garantizar ordenamiento estricto de eventos por `merchant_id` (los eventos de un mismo merchant se procesan en orden de ocurrencia), aceptando ordenamiento sólo eventual entre merchants distintos.

#### Scenario: Orden per-merchant
- **WHEN** un merchant emite dos transacciones consecutivas T1 (10:00:00) y T2 (10:00:01)
- **THEN** cualquier consumidor procesa T1 antes que T2

### Requirement: Schema evolution controlado

Todos los eventos SHALL estar gobernados por un Schema Registry (Confluent-compatible) con compatibilidad `BACKWARD` por default; breaking changes requieren nuevo topic versionado.

#### Scenario: Cambio compatible
- **WHEN** se agrega un campo opcional nuevo al schema de `transaction.completed`
- **THEN** el Schema Registry acepta la nueva versión y los consumidores existentes siguen funcionando

#### Scenario: Cambio incompatible
- **WHEN** se intenta cambiar el tipo de `amount` de int a string
- **THEN** el Schema Registry rechaza el cambio; se requiere `transaction.completed.v2` en un nuevo topic
