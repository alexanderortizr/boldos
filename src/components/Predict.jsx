import { useState, useEffect, useRef } from 'react';

/* ═══════════════════════════════════════════════════
   MOCK DATA — predicción 7 días (2030-04-23 al 29)
═══════════════════════════════════════════════════ */
const FORECAST = [
  { label: 'Jue', date: '23 abr', projected: 4.2, confidence: 94, event: null,           isToday: false },
  { label: 'Vie', date: '24 abr', projected: 5.1, confidence: 91, event: null,           isToday: false },
  { label: 'Sáb', date: '25 abr', projected: 7.8, confidence: 88, event: 'Día pico',    isToday: false, isPeak: true },
  { label: 'Dom', date: '26 abr', projected: 6.2, confidence: 85, event: null,           isToday: false },
  { label: 'Lun', date: '27 abr', projected: 3.1, confidence: 82, event: 'Día lento',   isToday: false, isSlow: true },
  { label: 'Mar', date: '28 abr', projected: 4.4, confidence: 79, event: null,           isToday: false },
  { label: 'Mié', date: '29 abr', projected: 4.8, confidence: 76, event: null,           isToday: false },
];

const MAX_FORECAST = Math.max(...FORECAST.map(d => d.projected));
const TOTAL_7D = FORECAST.reduce((s, d) => s + d.projected, 0);

const TIMELINE = [
  { date: 'Hoy · 22 abr',  icon: '💰', label: 'Pago Bold llega mañana',       amount: '+$4.68M',  positive: true,  urgent: false },
  { date: 'Jue 24 abr',    icon: '👥', label: 'Nómina parcial',                amount: '−$21M',    positive: false, urgent: false },
  { date: 'Sáb 26 abr',    icon: '📦', label: 'Pedido Agroavícola XYZ',        amount: '−$816k',   positive: false, urgent: false },
  { date: 'Mié 30 abr',    icon: '👥', label: 'Nómina completa · 18 empleados',amount: '−$52.5M',  positive: false, urgent: true  },
  { date: 'Jue 2 may',     icon: '📈', label: 'CDT vence · intereses incluidos',amount: '+$10.21M', positive: true,  urgent: false },
  { date: 'Jue 15 may',    icon: '⚠️', label: 'IVA vence · DIAN',              amount: '−$2.35M',  positive: false, urgent: true  },
];

const ACTIONS = [
  {
    id: 'reserve_payroll',
    icon: '👥',
    title: 'Reservar nómina',
    desc: 'Aparta $52.5M antes del 30 abr para evitar tensión de caja.',
    cta: 'Reservar ahora',
    level: 'warning',
  },
  {
    id: 'optimize_saturday',
    icon: '🚀',
    title: 'Maximizar el sábado',
    desc: 'El sábado proyecta $7.8M. Si activas promoción de almuerzo, el potencial sube a $9.2M.',
    cta: 'Activar promo',
    level: 'success',
  },
  {
    id: 'monday_buffer',
    icon: '🛡️',
    title: 'Refuerzo para el lunes',
    desc: 'El lunes proyecta solo $3.1M. Considera activar delivery para subir el ticket.',
    cta: 'Ver estrategia',
    level: 'info',
  },
];

/* ═══════════════════════════════════════════════════
   ANIMATED COUNTER
═══════════════════════════════════════════════════ */
function useCounter(target, duration = 1200, delay = 0) {
  const [value, setValue] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    const t = setTimeout(() => {
      started.current = true;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        setValue(target * ease);
        if (p < 1) requestAnimationFrame(tick);
        else setValue(target);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(t);
  }, [target, duration, delay]);
  return value;
}

/* ═══════════════════════════════════════════════════
   FORECAST BAR CHART
═══════════════════════════════════════════════════ */
function ForecastChart({ visible }) {
  return (
    <div className="pred-chart">
      {FORECAST.map((d, i) => {
        const pct = (d.projected / MAX_FORECAST) * 100;
        return (
          <div key={d.label} className="pred-bar-col">
            <div className="pred-bar-amount">
              ${d.projected.toFixed(1)}M
            </div>
            <div className="pred-bar-track">
              <div
                className={[
                  'pred-bar-fill',
                  d.isPeak  ? 'pred-bar-peak' : '',
                  d.isSlow  ? 'pred-bar-slow' : '',
                ].join(' ')}
                style={{
                  height: visible ? `${pct}%` : '0%',
                  transitionDelay: `${i * 80}ms`,
                }}
              />
            </div>
            {d.event && (
              <div className={`pred-bar-event ${d.isPeak ? 'peak' : 'slow'}`}>
                {d.event}
              </div>
            )}
            <div className="pred-bar-label">{d.label}</div>
            <div className="pred-bar-conf">{d.confidence}%</div>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════ */
export default function Predict({ onBack }) {
  const [visible, setVisible] = useState(false);
  const [doneActions, setDoneActions] = useState([]);
  const totalAnim = useCounter(TOTAL_7D, 1400, 300);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleAction = (id) => {
    if (!doneActions.includes(id)) setDoneActions(p => [...p, id]);
  };

  return (
    <div className="pred-shell">

      {/* ── Header ── */}
      <div className="pred-header">
        <button className="pred-back" onClick={onBack}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
            stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <div className="pred-header-center">
          <div className="pred-header-title">Bold Predict</div>
          <div className="pred-header-sub">Próximos 7 días · modelo actualizado hace 4 min</div>
        </div>
        <div className="pred-pulse-dot" />
      </div>

      {/* ── AI Narrative ── */}
      <div className={`pred-narrative ${visible ? 'pred-visible' : ''}`}>
        <div className="pred-narrative-icon">✦</div>
        <p className="pred-narrative-text">
          Tu semana viene <strong>fuerte</strong>. El sábado puede ser tu mejor día del mes con{' '}
          <strong>$7.8M proyectados</strong> — si activas la promo de almuerzo, el potencial sube a{' '}
          <strong>$9.2M</strong>. La única tensión: la nómina del 30 de abril requiere{' '}
          <strong>$52.5M</strong> disponibles. Te recomiendo reservarlos hoy.
        </p>
      </div>

      {/* ── Total 7D summary ── */}
      <div className={`pred-summary ${visible ? 'pred-visible' : ''}`}>
        <div className="pred-summary-main">
          <div className="pred-summary-label">Proyección 7 días</div>
          <div className="pred-summary-amount">
            ${totalAnim.toFixed(1).replace('.', ',')}M
          </div>
          <div className="pred-summary-vs">vs $28.4M semana anterior · <span className="pred-up">+23%</span></div>
        </div>
        <div className="pred-summary-stats">
          <div className="pred-stat">
            <div className="pred-stat-val">Sáb 25</div>
            <div className="pred-stat-lbl">Mejor día</div>
          </div>
          <div className="pred-stat-divider" />
          <div className="pred-stat">
            <div className="pred-stat-val">88%</div>
            <div className="pred-stat-lbl">Confianza pico</div>
          </div>
          <div className="pred-stat-divider" />
          <div className="pred-stat">
            <div className="pred-stat-val">$4.9M</div>
            <div className="pred-stat-lbl">Promedio/día</div>
          </div>
        </div>
      </div>

      {/* ── Forecast Chart ── */}
      <div className={`pred-section ${visible ? 'pred-visible' : ''}`}>
        <div className="pred-section-header">
          <span className="pred-section-title">Ventas proyectadas</span>
          <span className="pred-section-badge">IA · 85% confianza</span>
        </div>
        <div className="pred-chart-card">
          <ForecastChart visible={visible} />
          <div className="pred-chart-legend">
            <span className="pred-legend-dot peak" />
            <span>Día pico</span>
            <span className="pred-legend-dot slow" />
            <span>Día lento</span>
            <span className="pred-legend-dot normal" />
            <span>Normal</span>
          </div>
        </div>
      </div>

      {/* ── Cash Flow Timeline ── */}
      <div className={`pred-section ${visible ? 'pred-visible' : ''}`}
        style={{ transitionDelay: '120ms' }}>
        <div className="pred-section-header">
          <span className="pred-section-title">Flujo de caja</span>
          <span className="pred-section-badge">Próximos 30 días</span>
        </div>
        <div className="pred-timeline">
          {TIMELINE.map((item, i) => (
            <div key={i} className={`pred-timeline-row ${item.urgent ? 'urgent' : ''}`}>
              <div className="pred-timeline-left">
                <div className={`pred-timeline-dot ${item.positive ? 'in' : 'out'} ${item.urgent ? 'urgent' : ''}`} />
                {i < TIMELINE.length - 1 && <div className="pred-timeline-line" />}
              </div>
              <div className="pred-timeline-body">
                <div className="pred-timeline-date">{item.date}</div>
                <div className="pred-timeline-label">
                  {item.icon} {item.label}
                  {item.urgent && <span className="pred-urgent-badge">urgente</span>}
                </div>
              </div>
              <div className={`pred-timeline-amount ${item.positive ? 'in' : 'out'}`}>
                {item.amount}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bold Recommends ── */}
      <div className={`pred-section ${visible ? 'pred-visible' : ''}`}
        style={{ transitionDelay: '200ms' }}>
        <div className="pred-section-header">
          <span className="pred-section-title">Bold recomienda</span>
        </div>
        <div className="pred-actions">
          {ACTIONS.map(action => {
            const done = doneActions.includes(action.id);
            return (
              <div key={action.id} className={`pred-action-card ${action.level} ${done ? 'done' : ''}`}>
                <div className="pred-action-icon">{action.icon}</div>
                <div className="pred-action-body">
                  <div className="pred-action-title">{action.title}</div>
                  <div className="pred-action-desc">{action.desc}</div>
                </div>
                <button
                  className={`pred-action-btn ${action.level} ${done ? 'done' : ''}`}
                  onClick={() => handleAction(action.id)}
                >
                  {done ? '✓' : action.cta}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 30-Day horizon ── */}
      <div className={`pred-section ${visible ? 'pred-visible' : ''}`}
        style={{ transitionDelay: '280ms' }}>
        <div className="pred-section-header">
          <span className="pred-section-title">Horizonte 30 días</span>
        </div>
        <div className="pred-horizon-card">
          <div className="pred-horizon-row">
            <div className="pred-horizon-item">
              <div className="pred-horizon-val green">$182M</div>
              <div className="pred-horizon-lbl">Ventas proyectadas mayo</div>
            </div>
            <div className="pred-horizon-divider" />
            <div className="pred-horizon-item">
              <div className="pred-horizon-val coral">$80.2M</div>
              <div className="pred-horizon-lbl">Egresos estimados</div>
            </div>
            <div className="pred-horizon-divider" />
            <div className="pred-horizon-item">
              <div className="pred-horizon-val blue">$101.8M</div>
              <div className="pred-horizon-lbl">Flujo neto estimado</div>
            </div>
          </div>
          <div className="pred-horizon-bar">
            <div className="pred-horizon-bar-fill" style={{ width: visible ? '56%' : '0%' }} />
          </div>
          <div className="pred-horizon-bar-labels">
            <span>Egresos 44%</span>
            <span>Neto 56%</span>
          </div>
          <div className="pred-horizon-note">
            ✦ Si activas las 3 recomendaciones, el neto sube a <strong>$108M (+6%)</strong>
          </div>
        </div>
      </div>

      <div style={{ height: 32 }} />
    </div>
  );
}
