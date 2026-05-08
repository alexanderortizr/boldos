import { useMemo, useState } from 'react';
import { useStore } from '../store';
import { IconArrowLeft, IconCheck, IconSearch, IconUndo, IconAlertCircle } from './Icons';

const FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'liquidez', label: 'Liquidez' },
  { id: 'impuestos', label: 'Impuestos' },
  { id: 'nomina', label: 'Nómina' },
];

export default function ActionsLog({ onBack }) {
  const { log, revertAction, openModal } = useStore();
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return log.filter((a) => {
      if (filter !== 'all' && a.agent !== filter) return false;
      if (query && !a.title.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [log, filter, query]);

  const grouped = useMemo(() => {
    return filtered.reduce((acc, it) => {
      (acc[it.group] = acc[it.group] || []).push(it);
      return acc;
    }, {});
  }, [filtered]);

  const askRevert = (action) => {
    openModal({
      title: '¿Revertir acción?',
      body: 'El cambio se deshará sin penalidad. Tienes 24h desde la ejecución.',
      details: [{ label: 'Acción', value: action.title }],
      confirmLabel: 'Revertir',
      danger: true,
      async: true,
      onConfirm: () => revertAction(action.id),
    });
  };

  return (
    <>
      <div className="page-header">
        <button className="back-btn" onClick={onBack} aria-label="Volver"><IconArrowLeft /></button>
        <div className="page-title">Historial</div>
      </div>

      <div className="search-wrap">
        <IconSearch className="search-icon" />
        <input
          className="search-input"
          placeholder="Buscar en el historial..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="chip-row">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            className={`chip ${filter === f.id ? 'active' : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="log">
        {Object.keys(grouped).length === 0 && (
          <div className="empty-state">
            <IconSearch width={32} height={32} style={{ opacity: 0.3, marginBottom: 10 }} />
            <div>Sin resultados</div>
            <p>Prueba con otros filtros o búsqueda</p>
          </div>
        )}
        {Object.entries(grouped).map(([group, items]) => (
          <div className="log-group" key={group}>
            <h3>{group}</h3>
            {items.map((it) => (
              <div className={`log-item ${it.outcome === 'reverted' ? 'reverted' : ''}`} key={it.id}>
                <div className={`log-check ${it.outcome === 'reverted' ? 'reverted' : ''}`}>
                  {it.outcome === 'reverted' ? <IconUndo /> : <IconCheck />}
                </div>
                <div className="log-body">
                  <div className="log-title">{it.title}</div>
                  <div className="log-when">{it.when} · Agente de {labelFor(it.agent)}</div>
                  {it.reversible && it.outcome !== 'reverted' && (
                    <button className="log-revert" onClick={() => askRevert(it)}>
                      <IconUndo /> Revertir (quedan 12h)
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

function labelFor(agent) {
  return { liquidez: 'Liquidez', impuestos: 'Impuestos', nomina: 'Nómina' }[agent] || agent;
}
