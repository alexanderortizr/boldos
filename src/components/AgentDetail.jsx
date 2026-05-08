import { useStore } from '../store';
import { IconArrowLeft, IconWallet, IconReceipt, IconUsers, IconPlay, IconShare, IconList } from './Icons';

const AGENT_ICONS = {
  liquidez: <IconWallet width={32} height={32} />,
  impuestos: <IconReceipt width={32} height={32} />,
  nomina: <IconUsers width={32} height={32} />,
};

export default function AgentDetail({ agentId, onBack, onNavigate }) {
  const { agents, toggleAgent, openModal, pushToast } = useStore();
  const agent = agents[agentId];

  if (!agent) return null;

  const pauseConfirm = () => {
    if (!agent.enabled) {
      toggleAgent(agentId);
      return;
    }
    openModal({
      title: `¿Pausar ${agent.name}?`,
      body: 'No ejecutará acciones ni enviará notificaciones hasta que lo reactives.',
      confirmLabel: 'Pausar',
      onConfirm: () => toggleAgent(agentId),
    });
  };

  const runNow = () => {
    openModal({
      title: 'Ejecutar análisis ahora',
      body: 'El agente revisará tu data en tiempo real y te notificará si detecta algo.',
      confirmLabel: 'Ejecutar',
      async: true,
      onConfirm: () => pushToast({ level: 'success', title: 'Análisis completado', body: 'No hay nuevas recomendaciones por ahora.' }),
    });
  };

  const share = () => {
    pushToast({ level: 'info', title: 'Reporte preparado', body: 'Te enviamos un PDF por email (mock).' });
  };

  return (
    <>
      <div className="page-header">
        <button className="back-btn" onClick={onBack} aria-label="Volver">
          <IconArrowLeft />
        </button>
        <div className="page-title">{agent.name}</div>
      </div>

      <section className="agent-hero">
        <div className="agent-hero-icon">{AGENT_ICONS[agent.id]}</div>
        <div className="agent-hero-primary">{agent.primary}</div>
        <div className="agent-hero-sub">{agent.secondary}</div>
        <span className={`agent-badge ${agent.enabled ? agent.status : 'attention'}`} style={{ marginTop: 12 }}>
          {agent.enabled ? (agent.status === 'good' ? 'Operando' : agent.status === 'attention' ? 'Atención' : 'Crítico') : 'Pausado'}
        </span>
      </section>

      <div className="info-card">
        <h3>¿Qué hace este agente?</h3>
        <p>{agent.description}</p>
      </div>

      <div className="numbers-grid">
        {agent.breakdown.map((row, i) => (
          <div className="number-row" key={i}>
            <span className="lbl">{row.label}</span>
            <span className={`val ${row.danger ? 'danger' : ''}`}>{row.value}</span>
          </div>
        ))}
      </div>

      <div className="action-row">
        <button className="action-chip" onClick={runNow}><IconPlay width={13} height={13} /> Ejecutar</button>
        <button className="action-chip" onClick={share}><IconShare width={13} height={13} /> Compartir</button>
        <button className="action-chip" onClick={() => onNavigate('log')}><IconList width={13} height={13} /> Historial</button>
      </div>

      <div className="cta-bar">
        <button className="primary-btn" onClick={() => onNavigate('config')}>
          Configurar agente
        </button>
        <div className="secondary-row">
          <button className={`ghost-btn ${agent.enabled ? '' : 'accent'}`} onClick={pauseConfirm}>
            {agent.enabled ? 'Pausar agente' : 'Activar agente'}
          </button>
        </div>
      </div>
    </>
  );
}
