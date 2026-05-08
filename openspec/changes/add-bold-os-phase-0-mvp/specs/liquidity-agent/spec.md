## ADDED Requirements

### Requirement: Agent predice necesidades de capital con anticipación

El Liquidity Agent SHALL predecir necesidades de capital del merchant con al menos 7 días de anticipación, con accuracy ≥80% sobre un holdout histórico auditable. (RF-LIQ-001)

#### Scenario: Predicción anticipada de déficit
- **WHEN** el Liquidity Agent corre su ciclo diario y proyecta un balance negativo en los próximos 7-30 días para un merchant
- **THEN** genera una action proposal con `predicted_date`, `predicted_deficit`, `confidence_score` y `contributing_factors`

#### Scenario: Target de accuracy
- **WHEN** se evalúa el modelo sobre el holdout de los últimos 6 meses
- **THEN** la accuracy (% de predicciones positivas de déficit que realmente ocurrieron) es ≥80%

### Requirement: Agent pre-aprueba crédito autónomamente bajo alta confianza

El Liquidity Agent SHALL pre-aprobar líneas de crédito de Bold Capital autónomamente cuando la confianza de predicción es ≥80%. (RF-LIQ-002)

#### Scenario: Pre-aprobación autónoma
- **WHEN** la predicción de necesidad tiene `confidence_score ≥ 0.8` y existen fondos disponibles en Bold Capital
- **THEN** el Agent solicita pre-aprobación a Bold Capital, la notifica al usuario y marca la acción como `pre_approved` en el Log

#### Scenario: Sin pre-aprobación bajo confianza insuficiente
- **WHEN** `confidence_score < 0.8`
- **THEN** el Agent no pre-aprueba ni notifica; registra el caso para reentrenamiento

### Requirement: Aceptación 1-tap sin documentación adicional

El usuario SHALL poder aceptar una pre-aprobación de crédito con un solo tap, sin upload de documentación ni firma manual, cuando la pre-aprobación está vigente. (RF-LIQ-003)

#### Scenario: 1-tap accept
- **WHEN** el usuario toca "Aceptar" en la notificación de pre-aprobación
- **THEN** el sistema confirma el crédito, inicia el desembolso y no solicita documentación adicional en la sesión

### Requirement: Desembolso dentro de 24 horas

El sistema SHALL desembolsar los fondos aprobados en la cuenta Bold del merchant en ≤24 horas desde la aceptación. (RF-LIQ-004)

#### Scenario: Desembolso rápido
- **WHEN** el usuario acepta una pre-aprobación a las 10:00 del martes
- **THEN** los fondos están disponibles en Bold Cuenta antes de las 10:00 del miércoles (≤24h)

### Requirement: Explicabilidad de la predicción

Toda notificación/acción del Liquidity Agent SHALL incluir una explicación humana con al menos 2 factores que justifican la predicción (RF-LIQ-005), usando lenguaje simple (no jerga técnica).

#### Scenario: Explicación visible en la notificación
- **WHEN** llega una notificación de pre-aprobación
- **THEN** el usuario ve factores como "Históricamente, la segunda semana del mes tus gastos aumentan 35%" y "Tienes 5 facturas vencidas por cobrar por $18M"

### Requirement: Agent aprende de rechazos

El Liquidity Agent SHALL registrar los rechazos del usuario (notificación ignorada o explícitamente marcada "No me interesa") y ajustar su modelo/thresholds para reducir frecuencia de ese tipo de notificaciones a ese usuario. (RF-LIQ-006)

#### Scenario: Adaptación tras 3 rechazos
- **WHEN** un usuario rechaza 3 notificaciones consecutivas del mismo tipo
- **THEN** el Agent reduce la frecuencia de ese tipo al mínimo y registra la preferencia

### Requirement: Detección de oportunidades de ahorro vía financiamiento

El Liquidity Agent SHALL identificar oportunidades en las que financiar una compra (ej. descuento de proveedor) genera ahorro neto positivo y proponerlas al usuario con detalle de costos, ahorro y plazo. (RF-LIQ-007)

#### Scenario: Descuento de proveedor detectado
- **WHEN** un supplier del merchant baja precios en Bold Marketplace con descuento temporal y el Agent calcula `saving_amount > financing_cost`
- **THEN** el Agent propone una acción con `saving_amount`, `financing_cost`, `net_saving`, plazo estimado y condiciones

#### Scenario: Oportunidad no rentable
- **WHEN** `financing_cost ≥ saving_amount`
- **THEN** el Agent no propone la oportunidad
