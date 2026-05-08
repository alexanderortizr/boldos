import { useEffect } from 'react';
import { useStore } from '../store';
import { IconClose } from './Icons';

export default function NotificationsPanel({ open, onClose, onNavigate }) {
  const { notifications, markNotificationRead, markAllRead, unreadCount } = useStore();

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const handleClick = (n) => {
    markNotificationRead(n.id);
    onClose();
    if (n.action?.type === 'open_opportunity') onNavigate('opportunity');
    else if (n.action?.type === 'open_agent') onNavigate('agent', { agentId: n.action.id });
  };

  return (
    <>
      <div
        className={`drawer-backdrop ${open ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside
        className={`drawer ${open ? 'open' : ''}`}
        role="dialog"
        aria-label="Notificaciones"
        aria-hidden={!open}
      >
        <div className="drawer-header">
          <div>
            <div className="drawer-title">Notificaciones</div>
            <div className="drawer-sub">{unreadCount} sin leer</div>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Cerrar">
            <IconClose />
          </button>
        </div>

        {unreadCount > 0 && (
          <button className="drawer-action" onClick={markAllRead}>
            Marcar todas como leídas
          </button>
        )}

        <div className="drawer-list">
          {notifications.length === 0 && (
            <div className="empty-state">
              <div className="emoji">📭</div>
              <div>No tienes notificaciones</div>
            </div>
          )}
          {notifications.map((n) => (
            <button
              key={n.id}
              className={`notif ${n.read ? '' : 'unread'} notif-${n.level}`}
              onClick={() => handleClick(n)}
            >
              {!n.read && <span className="dot" />}
              <div className="notif-body">
                <div className="notif-title">{n.title}</div>
                <div className="notif-text">{n.body}</div>
                <div className="notif-meta">{n.when} · {labelFor(n.agent)}</div>
              </div>
            </button>
          ))}
        </div>
      </aside>
    </>
  );
}

function labelFor(agent) {
  return { liquidez: 'Liquidez', impuestos: 'Impuestos', nomina: 'Nómina' }[agent] || agent;
}
