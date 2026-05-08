## ADDED Requirements

### Requirement: Agent calcula obligaciones tributarias en tiempo real por venta

El Tax Agent SHALL calcular IVA, Retención en la Fuente y ICA en tiempo real con cada transacción `transaction.completed` del merchant, aplicando las reglas tributarias colombianas vigentes por régimen, producto y ubicación del merchant. (RF-TAX-001)

#### Scenario: Cálculo por venta
- **WHEN** se recibe un evento `transaction.completed` por $100,000 para un merchant responsable de IVA
- **THEN** el Tax Agent calcula IVA, ICA y Retefte implícitos en ≤1 segundo y los guarda como obligaciones acumuladas del periodo

#### Scenario: Sin obligación si no aplica
- **WHEN** el merchant es régimen simple sin responsabilidad de IVA
- **THEN** el Agent no calcula IVA para sus ventas pero sí ICA si aplica

### Requirement: Agent provisiona automáticamente en Bolsillo "Impuestos"

El Tax Agent SHALL mover automáticamente el monto calculado de IVA/ICA/Retefte al Bolsillo "Impuestos" del merchant, como provisión contable. (RF-TAX-002)

#### Scenario: Provisión inmediata
- **WHEN** el Agent calcula $X de obligación tributaria implícita en una venta
- **THEN** mueve $X del saldo disponible al Bolsillo "Impuestos" en ≤5 segundos y genera un registro asociado al `event_id` de la venta

#### Scenario: Saldo insuficiente
- **WHEN** el saldo disponible es menor al monto a provisionar
- **THEN** provisiona lo que puede, registra un `delta_pending` y notifica al usuario con recomendación (ej. "te faltan $X para cubrir el IVA")

### Requirement: Usuario consulta siempre cuánto tiene provisionado

El sistema SHALL mostrar en el Dashboard la vista consolidada de provisiones tributarias por impuesto (IVA, ICA, Retefte), monto acumulado y fecha de vencimiento más próxima. (RF-TAX-003)

#### Scenario: Vista en Dashboard
- **WHEN** el usuario abre el Bold OS Dashboard
- **THEN** ve una tarjeta "Impuestos" con IVA acumulado, ICA acumulado y cuenta regresiva al próximo vencimiento

### Requirement: Recordatorios 7/3/1 días antes del vencimiento

El Tax Agent SHALL enviar recordatorios de vencimiento a 7, 3 y 1 día antes de la fecha límite de pago de cada impuesto, adjuntando el estado de la provisión. (RF-TAX-004)

#### Scenario: Recordatorio a 7 días
- **WHEN** faltan 7 días para el vencimiento de IVA
- **THEN** el usuario recibe una notificación importante con monto provisionado, monto requerido y estado ("cubierto" o "faltante")

#### Scenario: Alerta crítica a 1 día
- **WHEN** faltan 24h y la provisión es insuficiente
- **THEN** el Agent envía notificación crítica con opciones accionables (ej. "cobra estas facturas", "activa crédito")

### Requirement: Generación de reportes pre-llenados para DIAN

El Tax Agent SHALL generar reportes pre-llenados compatibles con formularios de la DIAN (ej. Formulario 300 para IVA) en PDF y formato importable cuando la DIAN lo exponga. (RF-TAX-005)

#### Scenario: Reporte IVA periódico
- **WHEN** el usuario solicita reporte IVA para el periodo marzo-abril
- **THEN** el sistema genera un PDF con los campos del Formulario 300 pre-llenados basados en las transacciones del periodo

### Requirement: Recomendación de timing óptimo de facturación

El Tax Agent SHALL analizar oportunidades de ahorro fiscal por timing de facturación y recomendarlas al usuario cuando el ahorro estimado sea ≥$100,000 COP. (RF-TAX-006)

#### Scenario: Ahorro significativo detectado
- **WHEN** el Agent detecta que diferir una factura al próximo mes reduce la carga de ICA en >$100k
- **THEN** envía una notificación importante con la recomendación y opción "auto-ejecutar en la fecha óptima"

#### Scenario: Ahorro por debajo del umbral
- **WHEN** el ahorro estimado es <$100k
- **THEN** el Agent no envía notificación para evitar fatiga

### Requirement: Integración con DIAN sólo cuando API esté disponible

El Tax Agent SHALL integrarse con la API oficial de la DIAN para presentación automática de declaraciones cuando esté disponible; hasta entonces SHALL limitarse a reportes pre-llenados descargables. (RF-TAX-007)

#### Scenario: API DIAN disponible
- **WHEN** la DIAN publica una API estable y legal permite presentación automática
- **THEN** el Tax Agent agrega la opción "presentar automáticamente" en el flujo, respetando aprobación del usuario

#### Scenario: API DIAN no disponible (Phase 0)
- **WHEN** no existe API DIAN oficial
- **THEN** el Agent sólo ofrece descarga del reporte pre-llenado; nunca intenta presentaciones automáticas por scraping
