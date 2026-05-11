import { createContext, useContext, useState, useCallback } from 'react';
import {
  initialAgents,
  initialOpportunities,
  initialLog,
  initialNotifications,
  formatCOP,
} from './data/mockData';

const StoreCtx = createContext(null);

let idCounter = 1000;
const nextId = () => `x${++idCounter}`;

export function StoreProvider({ children }) {
  const [agents, setAgents] = useState(initialAgents);
  const [opportunities, setOpportunities] = useState(initialOpportunities);
  const [log, setLog] = useState(initialLog);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [toasts, setToasts] = useState([]);
  const [modal, setModal] = useState(null);

  // Toasts
  const pushToast = useCallback((toast) => {
    const id = nextId();
    setToasts((t) => [...t, { id, ...toast }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, toast.duration || 3600);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  // Modal
  const openModal = useCallback((cfg) => setModal(cfg), []);
  const closeModal = useCallback(() => setModal(null), []);

  // Actions
  const acceptOpportunity = useCallback((opp) => {
    setOpportunities((list) => list.map((o) => o.id === opp.id ? { ...o, status: 'accepted' } : o));
    setLog((l) => [
      {
        id: nextId(),
        agent: 'liquidez',
        title: `Ejecuté compra de ${formatCOP(opp.metrics.amount)} a ${opp.supplier}`,
        when: 'hace unos segundos',
        group: 'Esta semana',
        reversible: true,
        outcome: 'success',
        createdAt: Date.now(),
      },
      ...l,
    ]);
    pushToast({ level: 'success', title: 'Compra ejecutada', body: `Bold desembolsó ${formatCOP(opp.metrics.amount)} a ${opp.supplier}` });
  }, [pushToast]);

  const ignoreOpportunity = useCallback((opp) => {
    setOpportunities((list) => list.map((o) => o.id === opp.id ? { ...o, status: 'ignored' } : o));
    pushToast({ level: 'info', title: 'Oportunidad descartada', body: 'Aprenderé de tu preferencia.' });
  }, [pushToast]);

  const revertAction = useCallback((actionId) => {
    setLog((l) => l.map((a) => a.id === actionId ? { ...a, outcome: 'reverted', reversible: false, title: a.title + ' (revertida)' } : a));
    pushToast({ level: 'success', title: 'Acción revertida', body: 'El cambio se deshizo sin penalidad.' });
  }, [pushToast]);

  const toggleAgent = useCallback((id) => {
    setAgents((a) => ({ ...a, [id]: { ...a[id], enabled: !a[id].enabled } }));
    setAgents((a) => {
      pushToast({
        level: a[id].enabled ? 'success' : 'info',
        title: a[id].enabled ? `${a[id].name} activado` : `${a[id].name} pausado`,
        body: a[id].enabled ? 'Empezará a operar en <1 minuto.' : 'No ejecutará acciones hasta que lo reactives.',
      });
      return a;
    });
  }, [pushToast]);

  const setAutonomy = useCallback((id, level) => {
    setAgents((a) => ({ ...a, [id]: { ...a[id], autonomy: level } }));
    pushToast({ level: 'success', title: 'Nivel de autonomía actualizado', body: `Modo: ${labelFor(level)}` });
  }, [pushToast]);

  const setThreshold = useCallback((id, value) => {
    setAgents((a) => ({ ...a, [id]: { ...a[id], threshold: value } }));
  }, []);

  const markNotificationRead = useCallback((id) => {
    setNotifications((n) => n.map((x) => x.id === id ? { ...x, read: true } : x));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((n) => n.map((x) => ({ ...x, read: true })));
    pushToast({ level: 'info', title: 'Notificaciones leídas', body: 'Marcadas todas como leídas.' });
  }, [pushToast]);

  const value = {
    merchant: { firstName: 'Claudia', business: 'La Cocina de Claudia' },
    agents,
    opportunities,
    activeOpportunity: opportunities.find((o) => o.status === 'pending') || null,
    log,
    notifications,
    unreadCount: notifications.filter((n) => !n.read).length,
    toasts,
    modal,
    pushToast,
    dismissToast,
    openModal,
    closeModal,
    acceptOpportunity,
    ignoreOpportunity,
    revertAction,
    toggleAgent,
    setAutonomy,
    setThreshold,
    markNotificationRead,
    markAllRead,
  };

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

function labelFor(level) {
  return { manual: 'Manual', semi: 'Semi-autónomo', full: 'Totalmente autónomo' }[level] || level;
}

export const useStore = () => {
  const s = useContext(StoreCtx);
  if (!s) throw new Error('useStore must be inside StoreProvider');
  return s;
};
