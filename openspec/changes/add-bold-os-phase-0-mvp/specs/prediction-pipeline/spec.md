## ADDED Requirements

### Requirement: Pipeline entrena modelos predictivos en batch nocturno

El Prediction Pipeline SHALL ejecutar entrenamiento batch nocturno de los modelos core (cash flow prediction, seasonality detection, payroll date detection) sobre la data histórica del feature store, con logging de métricas (MAE, RMSE, AUC según corresponda) en un experiment tracker.

#### Scenario: Entrenamiento nocturno exitoso
- **WHEN** llega la ventana de entrenamiento batch (02:00 COT)
- **THEN** el pipeline entrena todos los modelos activos, registra métricas de evaluación en el experiment tracker y actualiza el model registry con la nueva versión candidata

#### Scenario: Detección de regresión de calidad
- **WHEN** un modelo entrenado tiene MAE/accuracy peor que el modelo en producción por más de un 5% relativo
- **THEN** el pipeline NO promueve el modelo automáticamente; queda marcado para revisión manual

### Requirement: Pipeline sirve predicciones en tiempo real con SLA

El Prediction Pipeline SHALL servir predicciones (p.ej. cash flow a 7/15/30 días) en ≤5 segundos (p95) para invocaciones real-time por parte de los agentes.

#### Scenario: Inferencia bajo SLA
- **WHEN** el Liquidity Agent solicita una predicción de cash flow a 15 días para un merchant
- **THEN** el pipeline retorna `predicted_balance`, `confidence_interval`, `confidence_score` y `contributing_factors` en ≤5 segundos (p95)

#### Scenario: Fallback ante unavailability
- **WHEN** el servicio de serving no responde en 5 segundos
- **THEN** el agente usa la última predicción cacheada con timestamp visible; si no hay cache, no ejecuta acción y registra el incidente

### Requirement: Feature store es la fuente única de features

El Pipeline SHALL usar un feature store (Feast) como fuente única para entrenamiento y serving, con features batch (nightly) y online (served via Redis para <50ms p95 de feature lookup).

#### Scenario: Sin train-serve skew
- **WHEN** un agente inferencia con features en tiempo real
- **THEN** usa exactamente las mismas definiciones de features que se usaron en el entrenamiento (misma versión del feature registry)

#### Scenario: Latencia de feature lookup
- **WHEN** un agente consulta features online para un merchant
- **THEN** el feature store responde en ≤50ms (p95)

### Requirement: Predicciones incluyen explainability obligatoria

Toda predicción servida SHALL incluir al menos 2 y máximo 5 `contributing_factors` que expliquen el resultado, cada uno con `factor` (string legible) e `impact` (magnitud y signo en la unidad de la predicción).

#### Scenario: Predicción de cash flow explicable
- **WHEN** se predice un balance de -$1.5M a 7 días
- **THEN** la respuesta incluye factores como `{"factor": "payroll_due", "impact": -4200000}` y `{"factor": "expected_revenue", "impact": +2700000}`

### Requirement: Pipeline monitorea drift y calidad en producción

El Pipeline SHALL monitorear data drift y model drift (Evidently AI u otro), y alertar cuando drift supere thresholds definidos.

#### Scenario: Alerta ante drift significativo
- **WHEN** la distribución de `avg_monthly_revenue` de los datos online difiere significativamente (KS-test p<0.01) de la de training
- **THEN** se dispara una alerta a Data Science y se bloquea la auto-promoción de nuevos modelos hasta revisión

### Requirement: Model registry con versionado y rollback

El Pipeline SHALL mantener un model registry donde cada modelo tiene `model_version`, `training_date`, métricas y estado (`staging`, `production`, `deprecated`), con capacidad de rollback en <10 minutos.

#### Scenario: Rollback inmediato
- **WHEN** un modelo recién promovido a producción muestra degradación (accuracy <80% por 24h)
- **THEN** Data Science puede hacer rollback a la versión anterior en ≤10 minutos vía CLI/UI

### Requirement: Confidence scores gobiernan la autonomía

El Pipeline SHALL retornar `confidence_score` en rango [0, 1] para toda predicción, permitiendo a los agentes aplicar thresholds: auto-execute ≥0.9 (Phase 0), notify+1tap 0.8-0.89, silent <0.8.

#### Scenario: Confidence alta → auto-execute
- **WHEN** una predicción retorna `confidence_score=0.92`
- **THEN** el agente está autorizado a ejecutar la acción sin aprobación (sujeto a otras reglas de seguridad)

#### Scenario: Confidence baja → no-op
- **WHEN** `confidence_score<0.8`
- **THEN** el agente NO notifica al usuario y registra el caso para reentrenamiento
