## ADDED Requirements

### Requirement: Graph modela entidades financieras del comerciante

El Unified Financial Graph SHALL modelar los siguientes nodos: `Merchant`, `Supplier`, `Employee` y `Customer` (tokenizado), con las propiedades mínimas definidas en la sección 11.1 del PRD (industry, location, avg_monthly_revenue, seasonality_pattern, category, salary, avg_ticket_size, etc.).

#### Scenario: Crear un nodo Merchant al onboardear un alpha user
- **WHEN** un comerciante es aceptado al programa alpha y tiene ≥90 días de historial transaccional en Bold
- **THEN** el sistema crea un nodo `Merchant` con `business_name`, `industry`, `location`, `created_at`, `avg_monthly_revenue` (rolling 90 días), `employee_count` y `seasonality_pattern` inicial

#### Scenario: Nodos Supplier se crean al detectar compras recurrentes
- **WHEN** un merchant paga al mismo beneficiario ≥3 veces en 30 días vía Bold Cuenta o Bold Marketplace
- **THEN** el sistema crea (o actualiza) un nodo `Supplier` con `name`, `category` y `avg_delivery_time_days`

### Requirement: Graph modela relaciones con propiedades temporales y agregadas

El graph SHALL soportar los edges `BUYS_FROM` (Merchant→Supplier), `EMPLOYS` (Merchant→Employee), `SELLS_TO` (Merchant→Customer), cada uno con las propiedades agregadas definidas en la sección 11.1 (frequency_days, avg_order_size, total_spent_90d, payment_terms, monthly_cost, first_purchase, last_purchase, total_spent, visit_count).

#### Scenario: Edge BUYS_FROM se fortalece con cada compra repetida
- **WHEN** un merchant compra a un supplier existente
- **THEN** el edge `BUYS_FROM` se actualiza incrementando `total_spent_90d` y recalculando `frequency_days` y `avg_order_size` en ≤60 segundos

#### Scenario: Edge SELLS_TO se crea para nuevos clientes tokenizados
- **WHEN** un cliente con `hashed_card_token` nuevo realiza una transacción con el merchant
- **THEN** el sistema crea un nodo `Customer` (o reusa el existente por token) y un edge `SELLS_TO` con `first_purchase`, `last_purchase`, `total_spent=amount`, `visit_count=1`

### Requirement: Queries multi-hop cumplen SLA de latencia

El graph SHALL responder queries de 3 o más hops en ≤500ms (p95) y queries simples (1 hop) en ≤100ms (p95), bajo la carga operacional de Phase 0 (100 alpha users) y escalar a 1M+ nodos y 100M+ edges.

#### Scenario: Query de benchmarking multi-hop dentro de SLA
- **WHEN** el Agente de Liquidez consulta "dame el avg margin de merchants en industry=restaurante, region=Bogotá, avg_monthly_revenue entre $100M-$200M" (query 2-3 hops)
- **THEN** el graph responde en ≤500ms (p95) con los nodos agregados

#### Scenario: Performance bajo carga histórica
- **WHEN** el graph contiene 1M+ nodos y 100M+ edges (dataset sintético de stress test)
- **THEN** queries de 3 hops mantienen p95 ≤500ms

### Requirement: Graph mantiene consistencia eventual con el event stream

El graph SHALL consumir eventos del stream (`transaction.completed`, `payroll.executed`, `supplier_payment.executed`) y actualizar nodos/edges con lag ≤60 segundos (p95).

#### Scenario: Actualización eventual tras transacción
- **WHEN** llega un evento `transaction.completed` al topic de Kafka
- **THEN** el edge `SELLS_TO` correspondiente se actualiza (o se crea) en ≤60 segundos (p95) y los agregados (total_spent, visit_count, last_purchase) reflejan la transacción

### Requirement: Graph respeta aislamiento de tenant y privacidad

El graph SHALL aplicar aislamiento por `merchant_id` en todas las queries (multi-tenant safe) y almacenar propiedades sensibles (montos, salarios, tokens de cliente) con cifrado at-rest.

#### Scenario: Un merchant no puede consultar data de otro
- **WHEN** un servicio consulta el graph autenticado como `merchant_A`
- **THEN** sólo retorna nodos y edges relacionados con `merchant_A`; cualquier query que intente cruzar a `merchant_B` retorna error de autorización

#### Scenario: Encriptación at-rest
- **WHEN** se inspecciona el storage del graph fuera del proceso
- **THEN** las propiedades marcadas como sensibles (ej. `salary`, `amount`, `hashed_card_token`) no son legibles sin las claves KMS

### Requirement: Graph soporta export y deletion por usuario

El graph SHALL permitir exportar todos los datos relacionados con un `merchant_id` (ver RT-PRIV-001) y eliminar todos esos datos (right to be forgotten, RT-PRIV-002) en ≤72 horas desde la solicitud.

#### Scenario: Export de datos
- **WHEN** un merchant solicita export de sus datos
- **THEN** el sistema genera un archivo JSON con todos los nodos y edges asociados a ese merchant y lo entrega vía link firmado en ≤72 horas

#### Scenario: Eliminación completa
- **WHEN** un merchant solicita eliminación de cuenta
- **THEN** el sistema elimina todos sus nodos (Merchant, Employees, Customers tokenizados exclusivos suyos) y edges asociados en ≤72 horas; agregados derivados (benchmarking) se mantienen anonimizados
