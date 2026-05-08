## Context

Bold es una plataforma de pagos colombiana con licencia de Compañía de Financiamiento (CF), 6 años de operación, 550k comercios activos y un stream continuo de transacciones. Hoy Bold opera como un conjunto de productos desconectados (Pagos, Capital, Cuenta, Bolsillos, Marketplace) que el comerciante debe orquestar manualmente.

Bold OS Phase 0 introduce una capa transversal de **inteligencia y ejecución autónoma** que consume la data existente, construye un modelo unificado del negocio de cada comerciante y ejecuta acciones financieras en su nombre. El alcance es un MVP invitation-only de 100 alpha users durante 2026.

**Constraints:**
- Solo AWS (Bold ya está 100% allí). EKS, MSK/Kafka, S3, RDS.
- La Bold App existente es React Native; Bold OS vive dentro de esa app, no como app aparte.
- No se pueden tocar los productos financieros core (Capital, Cuenta, Pagos) más allá de exponer APIs/eventos; Bold OS los consume.
- Regulatorio: cualquier acción que mueva dinero debe mantener control humano final y ser auditable.

**Stakeholders:** Product (Alex Ortiz), Engineering (backend, ML, frontend, infra), Data Science, Legal/Compliance (SFC), Customer Success, Bold Capital/Cuenta/Pagos como product dependencies, y los 100 alpha users.

## Goals / Non-Goals

**Goals:**
- Entregar 3 agentes autónomos (Liquidez, Impuestos, Nómina) con calidad de predicción ≥80% y tiempo de ejecución de acciones dentro de SLA (desembolso <24h, provisión en segundos).
- Construir una base arquitectónica (graph + streaming + orchestrator + prediction pipeline) reutilizable por los 6+ agentes del Phase 1.
- Alcanzar 70% activation rate (usuarios con ≥2 agentes activos) y AAEPU de 2-3 al cierre de 2026.
- Dejar el sistema observado, explicable y auditable desde el día 1.

**Non-Goals:**
- NO resolver el problema general de ERP/contabilidad completa (no reemplaza a Siigo/Alegra).
- NO exponer Bold OS como API pública a terceros.
- NO soportar multi-ubicación, multi-usuario o RBAC.
- NO implementar LLM conversacional ni "Bold Assistant".
- NO desarrollar Growth Agent ni Risk Agent (Phase 1).
- NO integrar ERPs externos ni APIs de DIAN/Colpensiones (presentación automática) en Phase 0; sólo reportes pre-llenados y fallback manual.
- NO ofrecer revenue share pricing (flat subscription durante alpha, gratis).

## Decisions

### 1. Neo4j como base del Unified Financial Graph (vs Postgres con JSONB o Amazon Neptune)

**Decisión:** Usar Neo4j (managed Aura o EKS operator) para el Unified Financial Graph.

**Rationale:** Los queries dominantes en los agentes son de 2-4 hops (merchant → supplier → competitor merchants; merchant → customers → LTV). En Postgres con joins recursivos el p95 de 3+ hops supera fácilmente 2-3s; Neo4j los ejecuta en <500ms gracias a index-free adjacency.

**Alternativas consideradas:**
- **Postgres con recursive CTE**: operacionalmente más simple (Bold ya opera Postgres) pero performance inaceptable para queries del Agente de Liquidez.
- **Amazon Neptune**: fully managed pero más caro, ecosistema menor y lock-in. Se reevalúa si Neo4j no escala a 1M+ nodos en Q4 2026.
- **JanusGraph**: open-source, escalable, pero ops overhead alto para un equipo pequeño.

### 2. Kafka (MSK) para event streaming con event sourcing

**Decisión:** Apache Kafka vía AWS MSK como backbone de eventos; todos los transaction events publicados allí, el graph y el prediction pipeline son consumidores.

**Rationale:** Compatibilidad con stack existente Bold, garantías de orden per-partition, replay para reentrenamiento de modelos. Temporal.io por encima para workflows de ejecución (pago de nómina, desembolso).

**Alternativas:** Kinesis (menos features, más lock-in), Pulsar (stack nuevo, equipo no lo conoce). Descartadas.

### 3. Agent Orchestrator en Go; agentes en Python (FastAPI)

**Decisión:** Orchestrator en Go (performance, concurrencia, binarios pequeños) y cada agente como servicio Python independiente (FastAPI + scikit-learn/XGBoost). Comunicación vía gRPC interno.

**Rationale:** El orchestrator es un sistema de alta concurrencia y baja latencia (priority queue, conflict resolution, rate-limiting). Go brilla aquí. Los agentes tienen lógica ML/estadística; Python es el estándar y permite iterar más rápido con DS.

**Alternativas:** Node.js para el orchestrator (el equipo lo domina más, pero concurrencia con event loop es peor). Revaluar al final de Phase 0 con datos reales.

### 4. Confidence thresholds explícitos y progresivos

**Decisión:** Cada agente define 3 thresholds:
- **Auto-execute** (≥90% confianza en Phase 0; baja a 85% tras maduración): ejecuta sin pedir aprobación (sólo provisiones y notificaciones; jamás movimientos irreversibles >$5M sin MFA).
- **Notify + 1-tap** (80-89%): requiere aprobación explícita del usuario.
- **Silent / learn** (<80%): no interrumpe, guarda para reentrenamiento.

**Rationale:** Confianza del usuario es el riesgo #1. Empezar conservador y abrir gradualmente según accuracy real.

### 5. Explainability obligatoria por diseño

**Decisión:** Toda recomendación o acción autónoma incluye un objeto `explanation` con 2-5 `contributing_factors` (con magnitud y dirección del impacto). El UI renderiza esto en cada notificación y en el Log.

**Rationale:** Regulatorio (SFC) + producto (trust). Sin explicabilidad, no hay progressive trust ni audit.

### 6. Revert window de 24h como contrato de producto

**Decisión:** Cualquier acción autónoma es reversible durante 24h sin penalidad, excepto transferencias a terceros (una vez ejecutadas son irreversibles por naturaleza; por eso requieren aprobación explícita siempre).

**Rationale:** Reduce la barrera psicológica de activar agentes. Implementación: las acciones reversibles (provisión, pre-aprobación, recordatorio) guardan un `revert_token` válido 24h.

### 7. Notificaciones con rate limiting y fatigue prevention

**Decisión:** Máximo 3 críticas/día por usuario; si ignora 3 consecutivas del mismo tipo, el orchestrator baja su prioridad automáticamente. Quiet hours 10PM-7AM default, configurables.

**Rationale:** Notification fatigue mata la adopción. Mejor perder un caso por día que quemar la confianza del usuario.

### 8. Feature store (Feast) como fuente única de features para ML

**Decisión:** Adoptar Feast (open source) como feature store. Features en batch (nightly) para entrenamiento y servidas en real-time via Redis para inferencia.

**Rationale:** Sin feature store, cada agente reinventaría features y habría train-serve skew. Tecton descartado por costo en Phase 0; se reevalúa en Phase 1.

### 9. GraphQL API entre UI y backend, REST/gRPC interno

**Decisión:** La Bold App consume una GraphQL API nueva (Apollo Federation) que federa queries contra orchestrator, graph service y agentes. Comunicación interna es gRPC.

**Rationale:** GraphQL minimiza overfetching en mobile (importante para 4G) y permite evolución sin versioning. Interna gRPC por performance y typing.

## Risks / Trade-offs

- **[Usuarios no confían en acciones autónomas]** → Empezar con acciones de bajo riesgo (provisiones, notificaciones, pre-aprobaciones), nunca ejecución silenciosa de pagos a terceros. Explicabilidad obligatoria. Revert 24h. Progressive trust: aumentar nivel de autonomía gradualmente con feature flags per-user.
- **[Accuracy de modelos <80% invalida el MVP]** → Plan B: empezar los agentes con rule engines deterministas que escalan a ML cuando hay datos suficientes (90 días). Human-in-the-loop obligatorio <90% confianza. Retraining nocturno con feedback del usuario.
- **[Neo4j no escala a 1M+ nodos / 100M+ edges]** → Benchmark formal Q3 2026 con dataset sintético escalado. Plan B: modelo híbrido (graph en Neo4j sólo para queries multi-hop; agregados en Postgres). Sharding por región si necesario.
- **[Kafka se satura en picos Black Friday]** → Auto-scaling de brokers + consumers, backpressure en producers, graceful degradation (eventos no-críticos se samplean si lag >5 min).
- **[SFC exige revisión previa a automatización financiera]** → Iniciar consulta en Q2 2026 antes de desarrollo. Documentar control humano final, audit trails, explicabilidad. Lobby paralelo con educación sobre beneficios para PyMEs.
- **[DIAN API no estará lista durante Phase 0]** → Scope Phase 0 sólo cubre reportes pre-llenados descargables; la presentación automática queda para Phase 1 cuando la API exista.
- **[Notification spam erosiona adopción]** → Rate limit duro (3 críticas/día), auto-adjustment basado en response rate, survey mensual de satisfacción.
- **[Equipo pequeño para alcance Phase 0]** → Dependencia fuerte de Bold Capital y Bold Cuenta para APIs; si esas dependencies slip, Phase 0 slipa también. Contratos de API acordados al inicio de Q2 2026.

## Migration Plan

Bold OS Phase 0 es greenfield; no hay migración de estado. Pero sí de data:

1. **Backfill del graph** (Q3 2026): ingestar eventos históricos (6 años, 550k merchants, sólo los 100 alpha users para Phase 0) desde S3/Parquet al Unified Financial Graph. Job batch con Spark/EMR.
2. **Feature store hydration**: computar features históricas de los 100 alpha users y poblar feature store para permitir training inicial.
3. **Deploy progresivo por feature flag** (Q4 2026): activar Bold OS Dashboard detrás de un flag por merchant_id; alpha users obtienen acceso uno por uno durante onboarding white-glove.

**Rollback**: Bold OS es aditivo. Un kill switch global desactiva todos los agentes; la Bold App sigue funcionando sin la sección Bold OS. Acciones en vuelo se pueden revertir vía el revert token (24h) o manualmente por operations.

## Open Questions

1. ¿Threshold de auto-execute arranca en 90% o 85%? Decisión al final de alpha con datos reales de accuracy.
2. ¿Nómina interna Bold o integración con proveedor tercero (ej. Nominapp)? A resolver con Product + Legal en Q2 2026; impacta scope del Payroll Agent.
3. ¿Neo4j Aura (managed) vs self-hosted en EKS? Depende del benchmark de costos Q3 2026.
4. ¿Multi-tenant isolation en el graph: un graph compartido con merchant_id como label, o un graph por merchant? Trade-off entre costo operativo y seguridad/aislamiento; decidir antes de backfill.
5. ¿Orchestrator en Go vs Node.js? Revaluar al final de Phase 0 con datos de performance reales.
