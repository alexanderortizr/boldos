## Why

Las PyMEs colombianas gestionan 12+ obligaciones financieras a través de 7-9 herramientas desconectadas, dedicando 15-25 horas/semana a tareas que no generan ingresos; 40% quiebran por mala gestión financiera, no por falta de ventas. Bold tiene una ventaja estructural única (6 años de transacciones en tiempo real de 550k comercios, licencia CF para ejecutar dinero, y relación de confianza como sistema de pagos principal) que hace posible transformar a Bold de una plataforma de productos financieros desconectados en un **sistema operativo financiero autónomo** que predice necesidades y ejecuta acciones en nombre del comerciante, con intervención mínima.

## What Changes

- **Lanzar Phase 0 MVP de Bold OS** como nueva superficie dentro de la Bold App existente (iOS, Android, Web), dirigida a 100 alpha users (PyMEs $50M-$500M COP/mes) durante 2026.
- **Introducir un Unified Financial Graph** (Neo4j) que modela merchants, proveedores, empleados y clientes con sus relaciones e inteligencia temporal.
- **Construir un Event Streaming Pipeline** (Kafka) que ingesta transacciones de Bold Pagos en tiempo real (<100ms latencia, 10k eventos/s peak) y alimenta tanto el graph como el pipeline predictivo.
- **Introducir un Autonomous Agent Orchestrator** que coordina agentes (registry, priority queue, conflict resolution, execution engine) con anti-spam de notificaciones (máx 3 críticas/día), vacation mode y auditoría completa de acciones.
- **Construir un Prediction Pipeline** batch (entrenamiento nocturno) + real-time (inferencia <5s p95) para cash flow, seasonality, y patrones de comportamiento.
- **Lanzar tres agentes autónomos MVP:**
  - **Liquidity Agent**: predice necesidades de capital a 7/15/30 días (80%+ accuracy), pre-aprueba líneas de crédito vía Bold Capital cuando confianza >80%, desembolsa fondos en <24h, detecta oportunidades de ahorro vía financiamiento.
  - **Tax Agent**: calcula IVA/Retefte/ICA en tiempo real por venta, provisiona automáticamente en Bolsillos "Impuestos", envía recordatorios (7/3/1 días antes), genera reportes pre-llenados DIAN, recomienda timing óptimo de facturación cuando el ahorro supera $100k COP.
  - **Payroll Agent**: aprende fechas de pago del historial, provisiona nómina + parafiscales, solicita aprobación 5 días antes (1-tap), ejecuta pagos + parafiscales (salud/pensión/ARL/caja) + certificados, alerta 15 días antes si faltan fondos.
- **Nueva superficie UX en Bold App**: Bold OS Dashboard (health glanceable 🟢🟡🔴), Agent Configuration Panel (on/off por agente, thresholds, nivel de autonomía Manual/Semi/Full), Notifications Center (críticas push+SMS+email, importantes push+email, informativas in-app, quiet hours 10PM-7AM default), Autonomous Actions Log (auditable, reversible <24h).
- **Integraciones internas** con Bold Capital (ejecución de crédito, <1s), Bold Cuenta + Bolsillos (provisiones, <1s), Bold Pagos (consumo de eventos, tiempo real), y Bold Marketplace (detección de oportunidades, <5s).
- **Cumplimiento regulatorio y de seguridad**: TLS 1.3+, cifrado at-rest de datos sensibles, MFA para acciones autónomas >$5M COP, explicabilidad por defecto en cada acción, audit trails completos, y alineación con la SFC (Superintendencia Financiera de Colombia).
- **Out of scope (Phase 0)**: Growth Agent, Risk Agent, integraciones con ERPs externos (Siigo/Alegra), API pública, interfaz conversacional LLM, multi-ubicación, multi-usuario/RBAC y revenue share pricing.

## Capabilities

### New Capabilities

- `financial-graph`: Modelado y consulta del grafo financiero unificado (nodos Merchant/Supplier/Employee/Customer y edges BUYS_FROM/EMPLOYS/SELLS_TO), con soporte para 1M+ nodos, 100M+ edges y queries de 3+ hops en <500ms.
- `event-streaming`: Ingesta en tiempo real de transacciones de Bold Pagos a Kafka, con schemas estándar, retención de 2 años y throughput de 10k eventos/s en picos.
- `prediction-pipeline`: Infraestructura de ML para entrenamiento batch y serving real-time (cash flow prediction, patterns detection), con feature store, model monitoring y drift detection.
- `agent-orchestrator`: Framework para registrar, priorizar, resolver conflictos, ejecutar y auditar acciones de agentes autónomos; control global (vacation mode, notification throttling) y logging inmutable.
- `liquidity-agent`: Agente que predice necesidades de capital, pre-aprueba crédito vía Bold Capital, desembolsa en <24h, e identifica oportunidades de ahorro vía financiamiento; con explicabilidad y aprendizaje de rechazos.
- `tax-agent`: Agente que calcula obligaciones tributarias por venta, provisiona automáticamente, recuerda vencimientos, genera reportes DIAN pre-llenados y recomienda timing óptimo de facturación.
- `payroll-agent`: Agente que detecta fechas de pago, provisiona nómina + parafiscales, solicita aprobación 1-tap, ejecuta pagos y certificados, y alerta ante riesgo de insuficiencia.
- `bold-os-ui`: Superficie de producto en Bold App que expone Bold OS Dashboard, Agent Configuration Panel, Notifications Center y Autonomous Actions Log (incluye revert <24h).

### Modified Capabilities

<!-- Ninguna. Bold OS Phase 0 es greenfield y no modifica requisitos existentes documentados en openspec/specs/. Las integraciones con Bold Capital, Bold Cuenta+Bolsillos, Bold Pagos y Bold Marketplace se tratan como sistemas externos consumidos por las nuevas capacidades. -->

## Impact

- **Código / servicios nuevos**: nuevos microservicios para graph, event streaming, prediction pipeline, orchestrator y tres agentes; nuevas pantallas y flujos en Bold App (React Native) y nuevo Bold OS Dashboard en web (Next.js); nueva GraphQL API entre UI y orchestrator.
- **Infraestructura nueva**: cluster Neo4j, cluster Kafka + Kafka Connect, Temporal.io para workflows, Feature Store (Feast/Tecton), TensorFlow Serving / SageMaker para serving, Redis para cache de predicciones, EKS namespaces dedicados, observabilidad (Datadog, Sentry, Evidently AI).
- **Integraciones internas afectadas**: Bold Capital (necesita API para pre-aprobación y desembolso automático), Bold Cuenta + Bolsillos (API para movimientos programados), Bold Pagos (publicación de eventos a Kafka con schema acordado), Bold Marketplace (webhooks/polling de cambios de precio y órdenes de compra).
- **Dependencias externas** (para agentes, aunque el API directo queda fuera de Phase 0): DIAN (reportes pre-llenados, no presentación), Colpensiones/UGPP (pago de parafiscales), proveedor de nómina (si Bold no opera nómina interna).
- **Regulatorio / compliance**: consulta temprana con SFC sobre automatización de decisiones financieras; documentación de trazabilidad, explicabilidad y control humano final sobre acciones críticas; flujos de data export y deletion; anonimización de datos de benchmarking.
- **Equipo**: contratación Q2 2026 de core team (PM, 2 Backend, 1 ML, 1 Frontend); Customer Success white-glove para los 100 alpha users.
- **Datos**: ingesta histórica (6 años, 550k comercios) al graph y al feature store; calidad y consistencia de tagging de transacciones se vuelven bloqueantes para accuracy de modelos.
- **Riesgo de producto**: confianza del usuario en acciones autónomas (mitigación: empezar con acciones de bajo riesgo, explicabilidad, revert <24h, progressive trust). Detalles en `design.md`.
