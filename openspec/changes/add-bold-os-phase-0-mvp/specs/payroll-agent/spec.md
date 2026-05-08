## ADDED Requirements

### Requirement: Agent detecta fecha de pago automáticamente desde el histórico

El Payroll Agent SHALL detectar la(s) fecha(s) típica(s) de pago de nómina del merchant analizando patrones en transferencias salientes repetitivas a las mismas contrapartes por montos consistentes. (RF-PAY-001)

#### Scenario: Detección sobre historial de 90+ días
- **WHEN** el merchant tiene ≥3 meses de historial con transferencias mensuales al mismo grupo de cuentas (empleados)
- **THEN** el Agent identifica la fecha típica (ej. "30 de cada mes") y la presenta al usuario para confirmación

#### Scenario: Historial insuficiente
- **WHEN** el merchant no tiene historial suficiente (<3 meses)
- **THEN** el Agent no infiere fecha automáticamente y ofrece al usuario configurarla manualmente

### Requirement: Provisión automática de nómina + parafiscales

El Payroll Agent SHALL provisionar automáticamente el monto de nómina proyectado + parafiscales (salud, pensión, ARL, caja de compensación) en el Bolsillo "Nómina" con anticipación suficiente. (RF-PAY-002)

#### Scenario: Provisión diaria prorrateada
- **WHEN** se aproxima la fecha de nómina (20-0 días antes)
- **THEN** el Agent provisiona una fracción diaria de manera que al día de pago el Bolsillo tenga el 100% del monto requerido

### Requirement: Notificación solicitando aprobación 5 días antes

El sistema SHALL enviar notificación importante al usuario 5 días antes de la fecha programada de pago solicitando aprobación. (RF-PAY-003)

#### Scenario: Aprobación previa
- **WHEN** faltan 5 días para el pago de nómina
- **THEN** el usuario recibe una notificación con desglose por empleado, total, parafiscales y botón "Aprobar"

### Requirement: Aprobación 1-tap del pago de nómina

El usuario SHALL poder aprobar el pago completo de la nómina con un solo tap desde la notificación. (RF-PAY-004)

#### Scenario: 1-tap approve
- **WHEN** el usuario toca "Aprobar nómina"
- **THEN** el sistema marca la nómina como aprobada y la agenda para ejecución automática en la fecha/hora configurada

### Requirement: Ejecución automática de pagos a empleados

El sistema SHALL ejecutar los pagos a cada empleado automáticamente en la fecha y hora configuradas (default 08:00 COT del día de pago) una vez aprobados. (RF-PAY-005)

#### Scenario: Ejecución puntual
- **WHEN** llega la fecha/hora de pago y la nómina fue aprobada
- **THEN** el sistema ejecuta las transferencias a todos los empleados en ≤10 minutos y confirma cada una

#### Scenario: Retry ante falla transitoria
- **WHEN** una transferencia falla por error transitorio
- **THEN** el sistema reintenta con backoff exponencial hasta 3 veces; si falla definitivamente, marca el pago como `failed` y notifica al usuario

### Requirement: Cálculo y pago automático de parafiscales

El Payroll Agent SHALL calcular y pagar parafiscales (salud, pensión, ARL, caja de compensación) automáticamente según normativa colombiana, con aprobación previa incluida en la nómina. (RF-PAY-006)

#### Scenario: Parafiscales incluidos
- **WHEN** se ejecuta la nómina
- **THEN** el sistema además genera el PILA (o equivalente) y paga parafiscales antes de la fecha límite del mes

### Requirement: Generación de certificados/desprendibles por empleado

El sistema SHALL generar un certificado de pago (desprendible) por empleado con desglose de ingresos, deducciones y aportes, disponible en PDF descargable por el merchant. (RF-PAY-007)

#### Scenario: Desprendibles listos post-pago
- **WHEN** se completa el pago de nómina
- **THEN** el sistema genera un PDF por cada empleado y los agrega al Autonomous Actions Log con link de descarga

### Requirement: Alerta anticipada de insuficiencia de fondos

El Payroll Agent SHALL alertar al usuario con al menos 15 días de anticipación si la proyección indica que no habrá suficiente dinero para pagar nómina, con recomendaciones accionables. (RF-PAY-008)

#### Scenario: Déficit proyectado
- **WHEN** a T-15 días la proyección de flujo de caja indica déficit > $0 para la fecha de nómina
- **THEN** el Agent envía notificación crítica con opciones (activar crédito, cobrar cartera priorizada, mix)

#### Scenario: Re-evaluación continua
- **WHEN** el usuario ejecuta acciones correctivas (ej. cobrar cartera) y la proyección mejora
- **THEN** el Agent re-evalúa diariamente y actualiza/retira la alerta cuando la proyección deja de ser deficitaria
