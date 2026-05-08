import { bankingData, paymentsData, formatCOP, formatCOPFull } from '../data/mockData';
import { useStore } from '../store';
import {
  IconAlertCircle, IconArrowDown, IconArrowUp,
} from './Icons';

/* ─── Upcoming events — max 3, curated ─── */
const UPCOMING = [
  { id: 'u1', label: 'IVA → DIAN',            date: '15 mayo 2030',  amount: -2_350_000,  auto: true,  level: 'warning' },
  { id: 'u2', label: 'Nómina + parafiscales',  date: '30 mayo 2030',  amount: -52_500_000, auto: false, level: 'caution' },
  { id: 'u3', label: 'Desembolso Bold',         date: 'Mañana',   amount:  4_675_400,  auto: true,  level: 'success' },
];

export default function Payments() {
  const { pushToast, openModal } = useStore();

  const approvePayroll = () => openModal({
    title: 'Aprobar nómina',
    body: 'Bold OS ejecutará el pago el 30 de mayo a las 8:00 AM.',
    details: [
      { label: 'Nómina neta',  value: '$42,000,000' },
      { label: 'Parafiscales', value: '$10,500,000' },
      { label: 'Total',        value: '$52,500,000' },
      { label: 'Empleados',   value: '18' },
    ],
    confirmLabel: 'Aprobar pago',
    async: true,
    onConfirm: () =>
      pushToast({ level: 'success', title: 'Nómina aprobada', body: 'Bold OS ejecutará el pago el 30 de mayo.' }),
  });

  const onlineCount  = paymentsData.devices.filter(d => d.status === 'online').length;
  const offlineDevs  = paymentsData.devices.filter(d => d.status !== 'online');

  return (
    <>
      {/* ── Header ── */}
      <div className="neg-header">
        <div className="neg-header-name">La Cocina de Claudia</div>
        <div className="neg-os-badge">
          <span className="neg-live-dot" />
          Bold OS activo
        </div>
      </div>

      {/* ── Hero: ONE dominant number ── */}
      <div className="neg-hero">
        <div className="neg-hero-eyebrow">Saldo disponible</div>
        <div className="neg-hero-amount">{formatCOPFull(bankingData.balance)}</div>
        <div className="neg-hero-meta">
          <span className="neg-chip-in">
            <IconArrowDown width={11} height={11} />
            +{formatCOP(bankingData.pendingSettlement)} mañana
          </span>
          <span className="neg-meta-sep" />
          <span className="neg-meta-muted">
            {formatCOP(paymentsData.todayRevenue)} cobrados hoy
          </span>
        </div>
      </div>

      {/* ── Approval — only renders when action is needed ── */}
      <div className="neg-approval">
        <div className="neg-approval-icon">
          <IconAlertCircle width={18} height={18} />
        </div>
        <div className="neg-approval-body">
          <div className="neg-approval-label">Nómina $52.5M · 30 mayo 2030</div>
          <div className="neg-approval-sub">Bold OS la tiene lista. Solo necesita tu OK.</div>
        </div>
        <button className="neg-approval-btn" onClick={approvePayroll}>
          Aprobar
        </button>
      </div>

      {/* ── Upcoming — 3 events, clean ── */}
      <div className="neg-section">
        <div className="neg-section-title">Próximos</div>
        <div className="neg-card">
          {UPCOMING.map((ev, i) => (
            <div
              key={ev.id}
              className="neg-row"
              style={i < UPCOMING.length - 1 ? { borderBottom: '1px solid var(--border)' } : {}}
            >
              <div className={`neg-row-icon ${ev.level}`}>
                {ev.amount >= 0
                  ? <IconArrowDown width={13} height={13} />
                  : <IconArrowUp   width={13} height={13} />}
              </div>
              <div className="neg-row-body">
                <div className="neg-row-label">{ev.label}</div>
                <div className="neg-row-sub">
                  {ev.date}
                  {ev.auto
                    ? <span className="neg-badge auto">Automático</span>
                    : <span className="neg-badge caution">Pendiente aprobación</span>}
                </div>
              </div>
              <div className={`neg-row-amount ${ev.amount >= 0 ? 'in' : 'out'}`}>
                {ev.amount >= 0 ? '+' : ''}{formatCOP(Math.abs(ev.amount))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Datáfonos — status line only, not a table ── */}
      <div className="neg-section" style={{ paddingBottom: 120 }}>
        <div className="neg-section-title">Datáfonos</div>
        <div className="neg-card neg-devices">
          {onlineCount > 0 && (
            <div className="neg-device-line">
              <span className="neg-dot online" />
              <span>{onlineCount} {onlineCount === 1 ? 'datáfono en línea' : 'datáfonos en línea'}</span>
            </div>
          )}
          {offlineDevs.map(d => (
            <div key={d.id} className="neg-device-line warn">
              <span className="neg-dot offline" />
              <span>{d.name} sin señal · Bat. {d.battery}%</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
