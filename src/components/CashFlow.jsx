import { useState } from 'react';
import { useStore } from '../store';
import { formatCOP } from '../data/mockData';
import { IconArrowLeft, IconTrendUp, IconTrendDown, IconCalendar, IconAlertCircle, IconCheck } from './Icons';

const PERIODS = [
  { id: 30, label: '30 días' },
  { id: 60, label: '60 días' },
  { id: 90, label: '90 días' },
];

/* Mock projection data per period */
const PROJECTIONS = {
  30: {
    runway: 32,
    inflow: 180_000_000,
    outflow: 148_000_000,
    net: 32_000_000,
    trend: 'up',
    score: 74,
    scoreDelta: +3,
    bars: [
      { label: 'Sem 1', inflow: 45, outflow: 36, label2: '22–28 abr 2030' },
      { label: 'Sem 2', inflow: 48, outflow: 40, label2: '29 abr–5 may 2030' },
      { label: 'Sem 3', inflow: 44, outflow: 38, label2: '6–12 may' },
      { label: 'Sem 4', inflow: 43, outflow: 34, label2: '13–19 may' },
    ],
    events: [
      { label: 'IVA · DIAN', amount: -2350000, date: '15 may 2030', level: 'warning' },
      { label: 'Nómina + parafiscales', amount: -52500000, date: '30 may 2030', level: 'info' },
      { label: 'Pago proveedor (pollo)', amount: -816000, date: 'Diario ~12 días', level: 'info' },
    ],
  },
  60: {
    runway: 58,
    inflow: 362_000_000,
    outflow: 304_000_000,
    net: 58_000_000,
    trend: 'up',
    score: 77,
    scoreDelta: +6,
    bars: [
      { label: 'Mes 1', inflow: 50, outflow: 41, label2: 'abr–may' },
      { label: 'Mes 2', inflow: 55, outflow: 43, label2: 'may–jun' },
    ],
    events: [
      { label: 'IVA Q1 · DIAN', amount: -2350000, date: '15 may 2030', level: 'warning' },
      { label: 'Nómina (×2)', amount: -105000000, date: '30 may / 30 jun 2030', level: 'info' },
      { label: 'Renovación contrato local', amount: -8000000, date: '01 jun 2030', level: 'info' },
    ],
  },
  90: {
    runway: 85,
    inflow: 542_000_000,
    outflow: 457_000_000,
    net: 85_000_000,
    trend: 'up',
    score: 81,
    scoreDelta: +10,
    bars: [
      { label: 'Abr–May', inflow: 48, outflow: 40, label2: 'abr–may' },
      { label: 'May–Jun', inflow: 52, outflow: 42, label2: 'may–jun' },
      { label: 'Jun–Jul', inflow: 55, outflow: 43, label2: 'jun–jul' },
    ],
    events: [
      { label: 'IVA Q1', amount: -2350000, date: '15 may 2030', level: 'warning' },
      { label: 'Nómina (×3)', amount: -157500000, date: 'may/jun/jul 2030', level: 'info' },
      { label: 'Temporada alta inicio', amount: +22000000, date: 'jul 2030', level: 'success' },
      { label: 'Renovación contrato', amount: -8000000, date: '01 jun 2030', level: 'info' },
    ],
  },
};

export default function CashFlow({ onBack }) {
  const [period, setPeriod] = useState(30);
  const proj = PROJECTIONS[period];

  const maxBar = Math.max(...proj.bars.flatMap((b) => [b.inflow, b.outflow]));

  return (
    <>
      <div className="page-header">
        <button className="back-btn" onClick={onBack} aria-label="Volver">
          <IconArrowLeft />
        </button>
        <div className="page-title">Flujo de caja</div>
      </div>

      {/* Period selector */}
      <div className="chip-row" style={{ padding: '0 16px', marginBottom: 0 }}>
        {PERIODS.map((p) => (
          <button
            key={p.id}
            className={`chip ${period === p.id ? 'active' : ''}`}
            onClick={() => setPeriod(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Health score hero */}
      <div className="cf-hero">
        <div className="cf-score-wrap">
          <div className="cf-score-ring" style={{ '--score': proj.score }}>
            <svg viewBox="0 0 80 80" className="cf-ring-svg">
              <circle className="cf-ring-track" cx="40" cy="40" r="34" />
              <circle
                className="cf-ring-fill"
                cx="40" cy="40" r="34"
                strokeDasharray={`${2 * Math.PI * 34}`}
                strokeDashoffset={`${2 * Math.PI * 34 * (1 - proj.score / 100)}`}
              />
            </svg>
            <div className="cf-score-center">
              <div className="cf-score-num">{proj.score}</div>
              <div className="cf-score-label">score</div>
            </div>
          </div>
          <div className="cf-score-meta">
            <div className="cf-score-title">Salud financiera</div>
            <div className={`cf-score-delta ${proj.scoreDelta >= 0 ? 'positive' : 'negative'}`}>
              {proj.scoreDelta >= 0 ? <IconTrendUp width={12} height={12} /> : <IconTrendDown width={12} height={12} />}
              {proj.scoreDelta >= 0 ? '+' : ''}{proj.scoreDelta} pts · {period} días
            </div>
            <div className="cf-runway">
              <IconCalendar width={12} height={12} />
              Runway: <strong>{proj.runway} días</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Net summary */}
      <div className="cf-summary">
        <div className="cf-summary-item">
          <div className="cf-summary-v positive">{formatCOP(proj.inflow)}</div>
          <div className="cf-summary-l">Ingresos</div>
          <div className="cf-bar-dot inflow" />
        </div>
        <div className="cf-summary-sep" />
        <div className="cf-summary-item">
          <div className="cf-summary-v negative">−{formatCOP(proj.outflow)}</div>
          <div className="cf-summary-l">Egresos</div>
          <div className="cf-bar-dot outflow" />
        </div>
        <div className="cf-summary-sep" />
        <div className="cf-summary-item">
          <div className="cf-summary-v net">{formatCOP(proj.net)}</div>
          <div className="cf-summary-l">Neto</div>
          <div className="cf-bar-dot net" />
        </div>
      </div>

      {/* Bar chart */}
      <div className="cf-section">
        <div className="cf-section-title">Proyección por período</div>
        <div className="cf-chart">
          {proj.bars.map((bar, i) => (
            <div className="cf-bar-group" key={i}>
              <div className="cf-bars">
                <div className="cf-bar-pair">
                  <div
                    className="cf-bar inflow"
                    style={{ height: `${(bar.inflow / maxBar) * 100}%` }}
                    title={`Ingresos ${bar.inflow}M`}
                  />
                  <div
                    className="cf-bar outflow"
                    style={{ height: `${(bar.outflow / maxBar) * 100}%` }}
                    title={`Egresos ${bar.outflow}M`}
                  />
                </div>
              </div>
              <div className="cf-bar-label">{bar.label}</div>
            </div>
          ))}
        </div>
        <div className="cf-chart-legend">
          <div className="cf-legend-item"><span className="cf-legend-dot inflow" />Ingresos</div>
          <div className="cf-legend-item"><span className="cf-legend-dot outflow" />Egresos</div>
        </div>
      </div>

      {/* Upcoming events */}
      <div className="cf-section" style={{ paddingBottom: 120 }}>
        <div className="cf-section-title">Eventos próximos</div>
        <div className="cf-card">
          {proj.events.map((ev, i) => (
            <div
              key={i}
              className="cf-event-row"
              style={i < proj.events.length - 1 ? { borderBottom: '1px solid var(--border)' } : {}}
            >
              <div className={`cf-event-icon ${ev.level}`}>
                {ev.level === 'warning' ? <IconAlertCircle width={14} height={14} /> :
                 ev.level === 'success' ? <IconTrendUp width={14} height={14} /> :
                 <IconCalendar width={14} height={14} />}
              </div>
              <div className="cf-event-body">
                <div className="cf-event-label">{ev.label}</div>
                <div className="cf-event-date">{ev.date}</div>
              </div>
              <div className={`cf-event-amount ${ev.amount >= 0 ? 'positive' : 'negative'}`}>
                {ev.amount >= 0 ? '+' : ''}{formatCOP(Math.abs(ev.amount))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
