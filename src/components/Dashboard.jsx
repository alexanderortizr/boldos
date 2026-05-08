import { useStore } from '../store';
import { formatCOP, merchant } from '../data/mockData';
import {
  IconChevron, IconBell, IconCheck, IconAlertCircle,
  IconChat, IconCard, IconBolt, IconList, IconBarChart,
} from './Icons';

export default function Dashboard({ onNavigate, onOpenNotifications }) {
  const { agents, activeOpportunity, unreadCount } = useStore();
  const agentList = Object.values(agents);
  const health = computeHealth(agentList);

  return (
    <>
      {/* Header */}
      <header className="app-header">
        <div className="brand">
          <div className="brand-logo">B</div>
          <div>
            <div className="brand-name">Bold OS</div>
            <div className="brand-sub">{merchant.business}</div>
          </div>
        </div>
        <button
          className="icon-btn notif-btn"
          aria-label={`Notificaciones (${unreadCount} sin leer)`}
          onClick={onOpenNotifications}
        >
          <IconBell width="18" height="18" />
          {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
        </button>
      </header>

      {/* Greeting */}
      <div className="greeting">
        <div className="hi">Buenos días,</div>
        <div className="name">{merchant.firstName}</div>
      </div>

      {/* Status card — the single truth */}
      <section
        className={`health ${health.level}`}
        role="region"
        aria-label="Estado del negocio"
      >
        <div className="health-row">
          <div className={`health-dot ${health.level}`}>
            {health.level === 'good'
              ? <IconCheck width={18} height={18} strokeWidth={3} />
              : <IconAlertCircle width={20} height={20} />}
          </div>
          <div>
            <div className="health-title">{health.title}</div>
            <div className="health-sub">{health.subtitle}</div>
          </div>
        </div>
        <div className="health-stats">
          <div className="health-stat">
            <div className="v">{formatCOP(merchant.monthlyRevenue)}</div>
            <div className="l">Ventas / mes</div>
          </div>
          <div className="health-stat">
            <div className="v">74</div>
            <div className="l">Score salud</div>
          </div>
          <div className="health-stat">
            <div className="v">32 días</div>
            <div className="l">Runway</div>
          </div>
        </div>
      </section>

      {/* Opportunity — only when it exists, high-value */}
      {activeOpportunity && (
        <button
          className="opportunity-banner"
          onClick={() => onNavigate('opportunity')}
        >
          <div className="opportunity-icon">
            <IconBolt width={18} height={18} />
          </div>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div className="opportunity-title">{activeOpportunity.title}</div>
            <div className="opportunity-sub">
              Ahorra {formatCOP(activeOpportunity.metrics.netSaving)} con descuento de proveedor
            </div>
          </div>
          <IconChevron />
        </button>
      )}

      {/* Quick access — the only navigation on home */}
      <div className="quick-grid">
        <button className="quick-tile primary" onClick={() => onNavigate('chat')}>
          <div className="quick-tile-icon">
            <IconChat width={24} height={24} />
          </div>
          <div className="quick-tile-label">Asistente</div>
          {unreadCount > 0 && (
            <span className="quick-tile-badge">{unreadCount}</span>
          )}
        </button>

        <button className="quick-tile" onClick={() => onNavigate('payments')}>
          <div className="quick-tile-icon">
            <IconCard width={22} height={22} />
          </div>
          <div className="quick-tile-label">Pagos</div>
        </button>

        <button className="quick-tile" onClick={() => onNavigate('cashflow')}>
          <div className="quick-tile-icon">
            <IconBarChart width={22} height={22} />
          </div>
          <div className="quick-tile-label">Flujo de caja</div>
        </button>

        <button className="quick-tile" onClick={() => onNavigate('log')}>
          <div className="quick-tile-icon">
            <IconList width={22} height={22} />
          </div>
          <div className="quick-tile-label">Historial</div>
        </button>
      </div>
    </>
  );
}

function computeHealth(agents) {
  const enabled = agents.filter((a) => a.enabled);
  if (enabled.some((a) => a.status === 'critical'))
    return { level: 'critical', title: 'Requiere atención urgente', subtitle: 'Hay alertas críticas activas' };
  if (enabled.some((a) => a.status === 'attention'))
    return { level: 'attention', title: 'Atención requerida', subtitle: 'IVA vence en 8 días · hay $50k pendientes' };
  if (enabled.length === 0)
    return { level: 'attention', title: 'Agentes pausados', subtitle: 'Activa al menos uno para empezar' };
  return { level: 'good', title: 'Todo en orden', subtitle: 'Tu negocio está saludable hoy' };
}
