import { useState, useRef, useEffect } from 'react';
import { IconSparkle, IconSend } from './Icons';

/* ─── Product sections ─── */
const SECTIONS = [
  { id: 'ventas',  label: 'Ventas'      },
  { id: 'banca',   label: 'Banca'       },
  { id: 'credito', label: 'Crédito'     },
  { id: 'seguros', label: 'Seguros'     },
];

const PERIODS = [
  { id: 'week',  label: 'Sem' },
  { id: 'month', label: 'Mes' },
  { id: 'year',  label: 'Año' },
];

/* ══════════════════════════════════════
   VENTAS DATA
══════════════════════════════════════ */
const BARS = {
  week:  [
    { label: 'Lun', value: 3200000 }, { label: 'Mar', value: 4100000 },
    { label: 'Mié', value: 3800000 }, { label: 'Jue', value: 4800000 },
    { label: 'Vie', value: 6200000 }, { label: 'Sáb', value: 7100000 },
    { label: 'Dom', value: 5300000 },
  ],
  month: [
    { label: 'S1', value: 32000000 }, { label: 'S2', value: 38000000 },
    { label: 'S3', value: 41000000 }, { label: 'S4', value: 45000000 },
  ],
  year:  [
    { label: 'Ene', value: 98000000  }, { label: 'Feb', value: 112000000 },
    { label: 'Mar', value: 128000000 }, { label: 'Abr', value: 156000000 },
    { label: 'May', value: 0 }, { label: 'Jun', value: 0 },
    { label: 'Jul', value: 0 }, { label: 'Ago', value: 0 },
    { label: 'Sep', value: 0 }, { label: 'Oct', value: 0 },
    { label: 'Nov', value: 0 }, { label: 'Dic', value: 0 },
  ],
};
const SUMMARY = {
  week:  { total: 34500000,  txns: 318,  avg: 108490, growth: '+12%' },
  month: { total: 156000000, txns: 1421, avg: 109781, growth: '+8%'  },
  year:  { total: 494000000, txns: 4512, avg: 109487, growth: '+23%' },
};
const CHANNELS = [
  { label: 'Datáfono', pct: 58, color: 'var(--bold-blue)' },
  { label: 'QR',       pct: 27, color: 'var(--coral)'     },
  { label: 'Link',     pct: 15, color: '#6c759f'           },
];
const TOP_PRODUCTS = [
  { name: 'Bandeja paisa',    sales: 142, revenue: 3976000 },
  { name: 'Ajiaco bogotano',  sales: 98,  revenue: 2352000 },
  { name: 'Limonada de coco', sales: 87,  revenue: 696000  },
  { name: 'Empanadas x3',     sales: 74,  revenue: 888000  },
  { name: 'Arroz con pollo',  sales: 68,  revenue: 1496000 },
];
const TODAY_SALES = [
  { id: 't1',  time: '8:15 AM',  method: 'card', device: 'BOL-4821', desc: 'Bandeja paisa',       amount: 28000 },
  { id: 't2',  time: '9:02 AM',  method: 'qr',   device: null,       desc: 'Ajiaco bogotano',     amount: 24000 },
  { id: 't3',  time: '10:23 AM', method: 'card', device: 'BOL-4822', desc: 'Limonada de coco',    amount: 8000  },
  { id: 't4',  time: '11:45 AM', method: 'link', device: null,       desc: '2× Bandeja paisa',   amount: 56000 },
  { id: 't5',  time: '12:03 PM', method: 'card', device: 'BOL-4821', desc: 'Empanadas x3',        amount: 12000 },
  { id: 't6',  time: '12:31 PM', method: 'qr',   device: null,       desc: 'Arroz con pollo',     amount: 22000 },
  { id: 't7',  time: '1:05 PM',  method: 'card', device: 'BOL-4821', desc: 'Sancocho de gallina', amount: 26000 },
  { id: 't8',  time: '1:48 PM',  method: 'qr',   device: null,       desc: 'Limonada de coco',    amount: 8000  },
  { id: 't9',  time: '2:22 PM',  method: 'card', device: 'BOL-4822', desc: 'Cazuela de mariscos', amount: 35000 },
  { id: 't10', time: '3:10 PM',  method: 'link', device: null,       desc: 'Ajiaco bogotano',     amount: 24000 },
];
const METHOD_LABEL = { card: 'Datáfono', qr: 'QR', link: 'Link' };
const METHOD_COLOR = {
  card: { bg: 'rgba(18,30,108,0.08)',  color: 'var(--bold-blue)' },
  qr:   { bg: 'rgba(238,66,78,0.08)', color: 'var(--coral)'     },
  link: { bg: 'rgba(108,117,159,0.1)', color: '#6c759f'          },
};

/* ══════════════════════════════════════
   BANCA DATA
══════════════════════════════════════ */
const ACCOUNT_MOVEMENTS = [
  { id: 'a1', type: 'in',  label: 'Pago Bold · ventas de ayer',    sub: 'Hoy 8:02 AM',  amount: 4675400 },
  { id: 'a2', type: 'out', label: 'Provisión IVA automática',       sub: 'Ayer 11:00 PM', amount: 180000  },
  { id: 'a3', type: 'in',  label: 'Pago Bold · ventas del lunes',   sub: 'Ayer 8:05 AM',  amount: 3821000 },
  { id: 'a4', type: 'out', label: 'Provisión IVA automática',       sub: 'Lun 11:00 PM',  amount: 180000  },
  { id: 'a5', type: 'in',  label: 'Pago Bold · ventas del domingo', sub: 'Lun 8:03 AM',   amount: 4210000 },
  { id: 'a6', type: 'out', label: 'Provisión IVA automática',       sub: 'Dom 11:00 PM',  amount: 180000  },
];
const ACCOUNT = { balance: 12840000, ingresos: 12706400, egresos: 540000 };

/* ══════════════════════════════════════
   CRÉDITO DATA
══════════════════════════════════════ */
const CREDIT = {
  available: 8500000,
  rate: '3% mensual',
  term: '~32 días',
  repayment: '8% de ventas diarias',
  active: null, // no active credit right now
  history: [
    { id: 'c1', date: 'Feb 2030', amount: 3200000, status: 'Saldado', days: 28 },
    { id: 'c2', date: 'Dic 2029', amount: 5000000, status: 'Saldado', days: 35 },
  ],
};

/* ══════════════════════════════════════
   SEGUROS DATA  — coberturas del negocio
══════════════════════════════════════ */
const POLICIES = [
  {
    id: 's1',
    name: 'Responsabilidad Civil',
    desc: 'Accidentes a clientes y terceros dentro del local',
    coverage: 'Hasta $500M por evento',
    premium: 120000,
    active: true,
    renewal: '1 ago 2030',
    claims: 0,
  },
  {
    id: 's2',
    name: 'Todo Riesgo Negocio',
    desc: 'Equipos de cocina, mobiliario e instalaciones',
    coverage: 'Hasta $80M en bienes',
    premium: 180000,
    active: true,
    renewal: '1 ago 2030',
    claims: 0,
  },
  {
    id: 's3',
    name: 'Accidentes Laborales',
    desc: '18 empleados · ARL complementaria Bold',
    coverage: '$25M por trabajador',
    premium: 95000,
    active: true,
    renewal: '1 ago 2030',
    claims: 0,
  },
  {
    id: 's4',
    name: 'Sustracción de Dinero',
    desc: 'Efectivo en caja y en tránsito',
    coverage: 'Hasta $5M por evento',
    premium: 65000,
    active: false,
    renewal: null,
    claims: 0,
  },
  {
    id: 's5',
    name: 'Incendio y Aliados',
    desc: 'Incendio, explosión, inundación y daños estructurales',
    coverage: 'Hasta $120M en pérdidas',
    premium: 85000,
    active: false,
    renewal: null,
    claims: 0,
  },
];

/* ══════════════════════════════════════
   ANALYTICS CHAT
══════════════════════════════════════ */
const CHAT_REPLIES = {
  ventas: [
    { pattern: /mejor día|top día/i,          text: 'Tu mejor día esta semana fue el sábado con $7.1M — 67 transacciones. Ticket promedio $106k.' },
    { pattern: /hora|pico/i,                   text: 'Hora pico: 12:00–13:00 con el 28% de las ventas. Segundo pico: 19:00–20:00 con el 18%.' },
    { pattern: /producto|top|más vend/i,       text: 'Bandeja paisa lidera: 142 unidades · $3.97M. El margen estimado es el más alto de tu carta.' },
    { pattern: /canal|datáfono|qr|link/i,      text: 'Datáfono 58%, QR 27%, Link 15%. QR creció +4 puntos vs el mes pasado.' },
    { pattern: /crecer|crecimiento/i,          text: 'Creciste +12% esta semana. Si mantienes el ritmo, cerrarás el mes en ~$180M.' },
  ],
  banca: [
    { pattern: /saldo|cuánto tengo/i,          text: 'Saldo Cuenta Bold: $12.84M disponibles ahora mismo.' },
    { pattern: /movimiento|entró|salió/i,      text: 'Esta semana entraron $12.7M en pagos Bold y salieron $540k en provisiones de IVA. Neto: +$12.16M.' },
    { pattern: /iva|provisión/i,               text: 'Bold OS provisiona $180k diarios para IVA. Acumulado: $2.3M para el vencimiento del 15 de mayo 2030.' },
    { pattern: /cuándo llega|próximo pago/i,   text: 'El próximo pago Bold llega mañana a las 8:00 AM — aproximadamente $4.68M de las ventas de hoy.' },
  ],
  credito: [
    { pattern: /cuánto|disponible/i,           text: 'Tienes $8.5M pre-aprobados al 3% mensual. Desembolso en menos de 2 minutos si lo activas.' },
    { pattern: /pago|cuota|cuánto pago/i,      text: 'Si activas $8.5M, pagarías ~$265k/día (8% de ventas). Saldado en ~32 días. Intereses totales: $255k.' },
    { pattern: /historial|anterior/i,          text: 'Tienes 2 créditos saldados: Feb 2030 ($3.2M en 28 días) y Dic 2029 ($5M en 35 días). Score excelente.' },
  ],
  seguros: [
    { pattern: /cuánto cuesta|prima|precio/i,  text: 'Tienes 3 pólizas activas por $395k/mes. RC $120k · Todo Riesgo $180k · Accidentes Lab. $95k. Sin cobertura: Sustracción y Incendio.' },
    { pattern: /responsabilidad|clientes|accidente/i, text: 'Tu RC cubre accidentes a clientes y terceros dentro del local hasta $500M por evento. Ideal para un restaurante — una caída puede generar demandas importantes.' },
    { pattern: /siniestro|daño|robo|incendio/i, text: '$0 en siniestros en los últimos 6 meses. Sin embargo, Sustracción de Dinero y Incendio no están activas — son los dos riesgos más frecuentes en restaurantes.' },
    { pattern: /renovación|vence/i,            text: 'Las 3 pólizas activas renuevan el 1 de agosto 2030 automáticamente. No tienes que hacer nada.' },
    { pattern: /emplead|laboral|arl/i,         text: 'Tus 18 empleados están cubiertos con la ARL complementaria Bold. $25M por trabajador en caso de accidente laboral.' },
  ],
};

const fmt = (v) => {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000)     return `$${(v / 1_000).toFixed(0)}k`;
  return `$${v}`;
};

let rid = 0;
const nextId = () => `r${++rid}`;
const SEED = {
  ventas:  '¿Qué quieres analizar? Puedo responder sobre ventas, canales, productos o tendencias.',
  banca:   '¿Qué quieres saber de tu Cuenta Bold? Pregúntame sobre saldo, movimientos o provisiones.',
  credito: 'Puedo explicarte tu crédito disponible, simular pagos o mostrarte tu historial.',
  seguros: 'Tienes 3 coberturas activas y 2 brechas de riesgo. Pregúntame sobre cualquier póliza, prima, siniestro o cobertura recomendada para tu negocio.',
};

/* ══════════════════════════════════════
   SECTION COMPONENTS
══════════════════════════════════════ */

function SectionVentas() {
  const [period, setPeriod] = useState('week');
  const bars = BARS[period];
  const summary = SUMMARY[period];
  const maxBar = Math.max(...bars.map(b => b.value));
  const todayTotal = TODAY_SALES.reduce((s, t) => s + t.amount, 0);

  return (
    <>
      {/* Period selector */}
      <div className="rep-period-inline">
        {PERIODS.map(p => (
          <button key={p.id} className={`rep-period-tab ${period === p.id ? 'active' : ''}`}
            onClick={() => setPeriod(p.id)}>{p.label}</button>
        ))}
      </div>

      {/* Summary */}
      <div className="rep-summary">
        <div className="rep-sum-card primary">
          <div className="rep-sum-label">Ventas totales</div>
          <div className="rep-sum-value">{fmt(summary.total)}</div>
          <div className="rep-sum-growth">{summary.growth} vs período anterior</div>
        </div>
        <div className="rep-sum-pair">
          <div className="rep-sum-card">
            <div className="rep-sum-label">Transacciones</div>
            <div className="rep-sum-value sm">{summary.txns.toLocaleString('es-CO')}</div>
          </div>
          <div className="rep-sum-card">
            <div className="rep-sum-label">Ticket promedio</div>
            <div className="rep-sum-value sm">{fmt(summary.avg)}</div>
          </div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="rep-section">
        <div className="rep-section-title">Ventas por {period === 'week' ? 'día' : period === 'month' ? 'semana' : 'mes'}</div>
        <div className="rep-card">
          <div className="rep-bars">
            {bars.map(b => (
              <div key={b.label} className="rep-bar-col">
                <div className="rep-bar-track">
                  <div className="rep-bar-fill" style={{ height: maxBar > 0 ? `${(b.value / maxBar) * 100}%` : '0%' }} />
                </div>
                <div className="rep-bar-label">{b.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Today's transactions */}
      <div className="rep-section">
        <div className="rep-section-title-row">
          <span className="rep-section-title" style={{ margin: 0 }}>Ventas del día</span>
          <span className="rep-section-badge">{TODAY_SALES.length} txns · {fmt(todayTotal)}</span>
        </div>
        <div className="rep-card" style={{ padding: 0 }}>
          {TODAY_SALES.map((tx, i) => (
            <div key={tx.id} className="rep-tx-row"
              style={i < TODAY_SALES.length - 1 ? { borderBottom: '1px solid var(--border)' } : {}}>
              <div className="rep-tx-badge"
                style={{ background: METHOD_COLOR[tx.method].bg, color: METHOD_COLOR[tx.method].color }}>
                {METHOD_LABEL[tx.method]}
              </div>
              <div className="rep-tx-body">
                <div className="rep-tx-desc">{tx.desc}</div>
                <div className="rep-tx-sub">{tx.time}{tx.device && <span className="rep-tx-device"> · {tx.device}</span>}</div>
              </div>
              <div className="rep-tx-amount">${tx.amount.toLocaleString('es-CO')}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Channel breakdown */}
      <div className="rep-section">
        <div className="rep-section-title">Por canal</div>
        <div className="rep-card">
          {CHANNELS.map(c => (
            <div key={c.label} className="rep-channel-row">
              <div className="rep-channel-label">{c.label}</div>
              <div className="rep-channel-bar-bg">
                <div className="rep-channel-bar-fill" style={{ width: `${c.pct}%`, background: c.color }} />
              </div>
              <div className="rep-channel-pct">{c.pct}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top products */}
      <div className="rep-section">
        <div className="rep-section-title">Productos top</div>
        <div className="rep-card">
          {TOP_PRODUCTS.map((p, i) => (
            <div key={p.name} className="rep-product-row"
              style={i < TOP_PRODUCTS.length - 1 ? { borderBottom: '1px solid var(--border)' } : {}}>
              <div className="rep-product-rank">{i + 1}</div>
              <div className="rep-product-body">
                <div className="rep-product-name">{p.name}</div>
                <div className="rep-product-sales">{p.sales} unidades</div>
              </div>
              <div className="rep-product-revenue">{fmt(p.revenue)}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function SectionBanca() {
  return (
    <>
      {/* Balance hero */}
      <div className="rep-section">
        <div className="rep-account-hero">
          <div className="rep-account-balance-label">Saldo disponible</div>
          <div className="rep-account-balance">${ACCOUNT.balance.toLocaleString('es-CO')}</div>
          <div className="rep-account-flow">
            <div className="rep-account-flow-item">
              <span className="rep-flow-dot in" />
              <span className="rep-flow-label">Pagos recibidos</span>
              <span className="rep-flow-val">+{fmt(ACCOUNT.ingresos)}</span>
            </div>
            <div className="rep-account-flow-item">
              <span className="rep-flow-dot out" />
              <span className="rep-flow-label">Egresos</span>
              <span className="rep-flow-val">−{fmt(ACCOUNT.egresos)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Movements */}
      <div className="rep-section">
        <div className="rep-section-title">Movimientos</div>
        <div className="rep-card" style={{ padding: 0 }}>
          {ACCOUNT_MOVEMENTS.map((mv, i) => (
            <div key={mv.id} className="rep-mv-row"
              style={i < ACCOUNT_MOVEMENTS.length - 1 ? { borderBottom: '1px solid var(--border)' } : {}}>
              <div className={`rep-mv-icon ${mv.type}`}>
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  {mv.type === 'in'
                    ? <path d="M12 19V5M5 12l7-7 7 7" />
                    : <path d="M12 5v14M5 12l7 7 7-7" />}
                </svg>
              </div>
              <div className="rep-mv-body">
                <div className="rep-mv-label">{mv.label}</div>
                <div className="rep-mv-sub">{mv.sub}</div>
              </div>
              <div className={`rep-mv-amount ${mv.type}`}>
                {mv.type === 'in' ? '+' : '−'}{fmt(mv.amount)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function SectionCredito({ onActivate }) {
  return (
    <>
      {/* Available credit hero */}
      <div className="rep-section">
        <div className="rep-account-hero">
          <div className="rep-account-balance-label">Crédito pre-aprobado</div>
          <div className="rep-account-balance">{fmt(CREDIT.available)}</div>
          <div className="rep-account-flow">
            <div className="rep-account-flow-item">
              <span className="rep-flow-dot in" />
              <span className="rep-flow-label">Tasa</span>
              <span className="rep-flow-val">{CREDIT.rate}</span>
            </div>
            <div className="rep-account-flow-item">
              <span className="rep-flow-dot out" />
              <span className="rep-flow-label">Plazo</span>
              <span className="rep-flow-val">{CREDIT.term}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Conditions */}
      <div className="rep-section">
        <div className="rep-section-title">Condiciones</div>
        <div className="rep-card" style={{ padding: 0 }}>
          {[
            { label: 'Monto disponible',  value: fmt(CREDIT.available) },
            { label: 'Tasa mensual',      value: CREDIT.rate           },
            { label: 'Forma de pago',     value: CREDIT.repayment      },
            { label: 'Plazo estimado',    value: CREDIT.term           },
            { label: 'Desembolso',        value: 'Inmediato · < 2 min' },
          ].map((r, i, arr) => (
            <div key={r.label} className="rep-cond-row"
              style={i < arr.length - 1 ? { borderBottom: '1px solid var(--border)' } : {}}>
              <span className="rep-cond-label">{r.label}</span>
              <span className="rep-cond-value">{r.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="rep-section">
        <button className="rep-cta-btn" onClick={onActivate}>Activar crédito · {fmt(CREDIT.available)}</button>
      </div>

      {/* History */}
      <div className="rep-section">
        <div className="rep-section-title">Historial</div>
        <div className="rep-card" style={{ padding: 0 }}>
          {CREDIT.history.map((h, i) => (
            <div key={h.id} className="rep-mv-row"
              style={i < CREDIT.history.length - 1 ? { borderBottom: '1px solid var(--border)' } : {}}>
              <div className="rep-mv-icon in">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div className="rep-mv-body">
                <div className="rep-mv-label">{fmt(h.amount)} · {h.date}</div>
                <div className="rep-mv-sub">Saldado en {h.days} días</div>
              </div>
              <div className="rep-credit-badge">{h.status}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function SectionSeguros({ onAddCoverage }) {
  const active   = POLICIES.filter(p => p.active);
  const inactive = POLICIES.filter(p => !p.active);
  const totalPremium = active.reduce((s, p) => s + p.premium, 0);

  const ShieldIcon = () => (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );

  return (
    <>
      {/* Hero */}
      <div className="rep-section">
        <div className="rep-account-hero">
          <div className="rep-account-balance-label">Prima mensual · coberturas activas</div>
          <div className="rep-account-balance">{fmt(totalPremium)}/mes</div>
          <div className="rep-account-flow">
            <div className="rep-account-flow-item">
              <span className="rep-flow-dot in" />
              <span className="rep-flow-label">Pólizas activas</span>
              <span className="rep-flow-val">{active.length} de {POLICIES.length}</span>
            </div>
            <div className="rep-account-flow-item">
              <span className="rep-flow-dot out" />
              <span className="rep-flow-label">Siniestros 2030</span>
              <span className="rep-flow-val">$0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Coberturas activas */}
      <div className="rep-section">
        <div className="rep-section-title">Coberturas activas</div>
        <div className="rep-card" style={{ padding: 0 }}>
          {active.map((p, i) => (
            <div key={p.id} className="rep-mv-row"
              style={i < active.length - 1 ? { borderBottom: '1px solid var(--border)' } : {}}>
              <div className="rep-mv-icon in"><ShieldIcon /></div>
              <div className="rep-mv-body">
                <div className="rep-mv-label">{p.name}</div>
                <div className="rep-mv-sub">{p.desc}</div>
                <div className="rep-mv-sub" style={{ marginTop: 2, color: 'var(--text-dim)', fontWeight: 600 }}>
                  {p.coverage} · Renueva {p.renewal}
                </div>
              </div>
              <div className="rep-credit-badge">{fmt(p.premium)}/mes</div>
            </div>
          ))}
        </div>
      </div>

      {/* Brechas de cobertura */}
      {inactive.length > 0 && (
        <div className="rep-section">
          <div className="rep-section-title">Brechas de cobertura</div>
          <div className="rep-alert-card">
            <div className="rep-alert-text" style={{ marginBottom: 0 }}>
              Tu negocio tiene <strong>{inactive.length} riesgos sin cubrir</strong>. Bold los recomienda para restaurantes de tu tamaño.
            </div>
          </div>
          <div className="rep-card" style={{ padding: 0, marginTop: 10 }}>
            {inactive.map((p, i) => (
              <div key={p.id} className="rep-mv-row"
                style={i < inactive.length - 1 ? { borderBottom: '1px solid var(--border)' } : {}}>
                <div className="rep-mv-icon out"><ShieldIcon /></div>
                <div className="rep-mv-body">
                  <div className="rep-mv-label">{p.name}</div>
                  <div className="rep-mv-sub">{p.desc}</div>
                  <div className="rep-mv-sub" style={{ marginTop: 2, fontWeight: 600, color: 'var(--text-dim)' }}>
                    {p.coverage}
                  </div>
                </div>
                <button className="rep-mini-btn" onClick={onAddCoverage}>
                  {fmt(p.premium)}/mes
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

/* ══════════════════════════════════════
   ANALYTICS CHAT
══════════════════════════════════════ */
function AnalyticsChat({ section }) {
  const [messages, setMessages] = useState([
    { id: 'r0', from: 'bold', text: SEED[section] },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setMessages([{ id: 'r0', from: 'bold', text: SEED[section] }]);
  }, [section]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    setMessages(m => [...m, { id: nextId(), from: 'user', text }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const replies = CHAT_REPLIES[section] || [];
      const match = replies.find(r => r.pattern.test(text));
      const reply = match?.text || 'Dame un momento para analizar ese dato. ¿Puedes ser más específico?';
      setMessages(m => [...m, { id: nextId(), from: 'bold', text: reply }]);
    }, 1000);
  };

  const QUICK = {
    ventas:  ['¿Cuál fue mi mejor día?', '¿Hora pico?', '¿Producto top?'],
    banca:   ['¿Cuál es mi saldo?', '¿Cuándo llega el próximo pago?', '¿Cuánto provisioné de IVA?'],
    credito: ['¿Cuánto tengo disponible?', '¿Cuánto pagaría por día?', 'Ver historial'],
    seguros: ['¿Cuánto pago de primas?', '¿Qué riesgos me faltan?', '¿Qué cubre la RC?'],
  };

  return (
    <div className="rep-section rep-chat-section">
      <div className="rep-section-title">Pregunta a Bold OS</div>
      <div className="rep-chat-card">
        <div className="rep-chat-messages">
          {messages.map(m => (
            <div key={m.id} className={`rep-msg ${m.from}`}>
              {m.from === 'bold' && <div className="rep-msg-avatar"><IconSparkle width={11} height={11} /></div>}
              <div className={`rep-msg-bubble ${m.from}`}>{m.text}</div>
            </div>
          ))}
          {typing && (
            <div className="rep-msg bold">
              <div className="rep-msg-avatar"><IconSparkle width={11} height={11} /></div>
              <div className="rep-msg-bubble bold typing">
                <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        <div className="rep-quick-qs">
          {(QUICK[section] || []).map(q => (
            <button key={q} className="rep-quick-chip"
              onClick={() => { setInput(q); inputRef.current?.focus(); }}>{q}</button>
          ))}
        </div>
        <div className="rep-chat-input-row">
          <input ref={inputRef} className="rep-chat-input"
            placeholder="Pregunta sobre este reporte..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()} />
          <button className={`rep-chat-send ${input.trim() ? 'active' : ''}`}
            onClick={send} disabled={!input.trim()}>
            <IconSend width={15} height={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════ */
export default function Reports({ onBack, defaultSection = 'ventas', pushToast, openModal }) {
  const [section, setSection] = useState(defaultSection);
  const scrollRef = useRef(null);

  // Scroll to top whenever section changes (tab click or initial navigation)
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [section]);

  const handleActivateCredit = () => {
    openModal?.({
      title: 'Activar crédito Bold Capital',
      body: 'El dinero llega a tu Cuenta Bold en menos de 2 minutos. El pago es automático con el 8% de tus ventas diarias.',
      details: [
        { label: 'Monto',   value: '$8,500,000' },
        { label: 'Tasa',    value: '3% mensual'  },
        { label: 'Plazo',   value: '~32 días'    },
      ],
      confirmLabel: 'Activar · $8.5M',
      async: true,
      onConfirm: () => pushToast?.({ level: 'success', title: 'Crédito activado', body: '$8.5M en camino a tu Cuenta Bold.' }),
    });
  };

  const handleAddCoverage = () => {
    openModal?.({
      title: 'Asegurar BOL-4823',
      body: 'Cobertura contra robo y daño físico. La prima se cobra automáticamente cada mes.',
      details: [{ label: 'Prima', value: '$50,000/mes' }],
      confirmLabel: 'Asegurar dispositivo',
      async: true,
      onConfirm: () => pushToast?.({ level: 'success', title: 'BOL-4823 asegurado', body: 'Cobertura activa desde hoy.' }),
    });
  };

  return (
    <div className="rep-shell">
      {/* Header */}
      <div className="rep-header">
        <button className="cat-back" onClick={onBack} aria-label="Volver">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="cat-header-title">Reportes</div>
      </div>

      {/* Product tabs */}
      <div className="rep-product-tabs">
        {SECTIONS.map(s => (
          <button key={s.id}
            className={`rep-product-tab ${section === s.id ? 'active' : ''}`}
            onClick={() => setSection(s.id)}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Section content */}
      <div className="rep-scroll" ref={scrollRef}>
        {section === 'ventas'  && <SectionVentas />}
        {section === 'banca'   && <SectionBanca />}
        {section === 'credito' && <SectionCredito onActivate={handleActivateCredit} />}
        {section === 'seguros' && <SectionSeguros onAddCoverage={handleAddCoverage} />}

        <AnalyticsChat section={section} />
        <div style={{ height: 120 }} />
      </div>
    </div>
  );
}
