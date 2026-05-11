import { useState, useRef } from 'react';
import { useStore } from '../store';

/* ═══════════════════════════════════════════════════
   MOCK DATA  (todo en 2030)
═══════════════════════════════════════════════════ */
const MOCK_TODAY = new Date('2030-04-22T12:00:00');
const SPARK = [3.2, 4.1, 3.8, 4.8, 6.2, 7.1, 4.8];
const MAX_SPARK = Math.max(...SPARK);

const TOP3 = [
  { name: 'Bandeja paisa',    sales: 142, pct: 100 },
  { name: 'Ajiaco bogotano',  sales: 98,  pct: 69  },
  { name: 'Limonada de coco', sales: 87,  pct: 61  },
];

const DEVICES = [
  { id: 'BOL-4821', name: 'Caja',    online: true  },
  { id: 'BOL-4822', name: 'Barra',   online: true  },
  { id: 'BOL-4823', name: 'Terraza', online: false },
];

/* ═══════════════════════════════════════════════════
   INDIVIDUAL GADGETS
═══════════════════════════════════════════════════ */

function GadgetVentas({ onNavigate }) {
  return (
    <div className="gd-ventas" onClick={() => onNavigate('reports', { section: 'ventas' })}>
      <div className="gd-ventas-top">
        <span className="gd-card-label-inv">Ventas hoy</span>
        <span className="gd-growth-badge">+8% vs ayer</span>
      </div>
      <div className="gd-ventas-amount">$4.8M</div>
      <div className="gd-ventas-meta">47 transacciones · ticket promedio $102k</div>
      <div className="gd-spark">
        {SPARK.map((v, i) => (
          <div key={i} className="gd-spark-col">
            <div className={`gd-spark-bar ${i === SPARK.length - 1 ? 'current' : ''}`}
              style={{ height: `${(v / MAX_SPARK) * 100}%` }} />
          </div>
        ))}
      </div>
      <div className="gd-ventas-footer">
        <span>Hora pico 12:00–13:00 · $1.2M</span>
        <span className="gd-arrow">›</span>
      </div>
    </div>
  );
}

function GadgetCuenta({ onNavigate }) {
  return (
    <div className="gd-card gd-cuenta" onClick={() => onNavigate('reports', { section: 'banca' })}>
      <div className="gd-card-header">
        <span className="gd-card-label">Cuenta Bold</span>
        <span className="gd-arrow-dim">›</span>
      </div>
      <div className="gd-card-amount">$12,840,000</div>
      <div className="gd-cuenta-flow">
        <div className="gd-flow-item">
          <span className="gd-flow-dot in" />
          <span className="gd-flow-text">Pagos Bold <strong>+$12.7M</strong></span>
        </div>
        <div className="gd-flow-divider" />
        <div className="gd-flow-item">
          <span className="gd-flow-dot out" />
          <span className="gd-flow-text">Egresos <strong>−$540k</strong></span>
        </div>
      </div>
    </div>
  );
}

function GadgetProximoPago() {
  return (
    <div className="gd-card gd-half">
      <div className="gd-card-label">Próximo pago</div>
      <div className="gd-half-amount">$4.68M</div>
      <div className="gd-half-sub">Mañana · 8:00 AM</div>
      <div className="gd-half-meta">De tus ventas de hoy</div>
    </div>
  );
}

function GadgetCapital({ onNavigate, openModal, pushToast }) {
  const handleActivate = (e) => {
    e.stopPropagation();
    openModal?.({
      title: 'Activar crédito Bold',
      body: 'El dinero llega a tu Cuenta Bold en menos de 2 minutos. El pago es automático con el 8% de tus ventas diarias.',
      details: [
        { label: 'Monto',  value: '$8,500,000' },
        { label: 'Tasa',   value: '3% mensual'  },
        { label: 'Plazo',  value: '~32 días'    },
      ],
      confirmLabel: 'Activar · $8.5M',
      async: true,
      onConfirm: () =>
        pushToast?.({ level: 'success', title: 'Crédito activado', body: '$8.5M en camino a tu Cuenta Bold.' }),
    });
  };
  return (
    <div className="gd-card gd-half gd-capital"
      onClick={() => onNavigate('reports', { section: 'credito' })}>
      <div className="gd-card-label">Crédito Bold</div>
      <div className="gd-half-amount">$8.5M</div>
      <div className="gd-half-sub">Pre-aprobado</div>
      <button className="gd-pill-btn" onClick={handleActivate}>Activar</button>
    </div>
  );
}

function GadgetDatafonos({ onNavigate }) {
  const onlineCount = DEVICES.filter(d => d.online).length;
  return (
    <div className="gd-card gd-half" onClick={() => onNavigate('chat')}>
      <div className="gd-card-label">Datáfonos</div>
      <div className="gd-datat-fraction">
        <span className="gd-datat-n">{onlineCount}</span>
        <span className="gd-datat-sep">/{DEVICES.length}</span>
      </div>
      <div className="gd-half-sub">en línea</div>
      <div className="gd-datat-dots">
        {DEVICES.map(d => (
          <span key={d.id} className={`gd-datat-dot ${d.online ? 'on' : 'off'}`} title={d.name} />
        ))}
      </div>
      {onlineCount < DEVICES.length && (
        <div className="gd-half-alert">BOL-4823 sin señal</div>
      )}
    </div>
  );
}

function GadgetSeguros({ onNavigate }) {
  return (
    <div className="gd-card gd-half" onClick={() => onNavigate('reports', { section: 'seguros' })}>
      <div className="gd-card-label">Seguros negocio</div>
      <div className="gd-half-amount" style={{ fontSize: 20 }}>3 activas</div>
      <div className="gd-half-sub">$395,000/mes</div>
      <div className="gd-half-alert">2 riesgos sin cubrir</div>
    </div>
  );
}

function GadgetIVA() {
  return (
    <div className="gd-card gd-half">
      <div className="gd-card-label">IVA provisionado</div>
      <div className="gd-half-amount">$2.3M</div>
      <div className="gd-half-sub">Vence 15 mayo 2030</div>
      <div className="gd-iva-track">
        <div className="gd-iva-fill" style={{ width: '76%' }} />
      </div>
      <div className="gd-half-meta">76% listo</div>
    </div>
  );
}

function GadgetNomina({ openModal, pushToast }) {
  return (
    <div className="gd-card gd-half">
      <div className="gd-card-label">Nómina</div>
      <div className="gd-half-amount">$52.5M</div>
      <div className="gd-half-sub">18 colaboradores</div>
      <button className="gd-pill-btn" onClick={(e) => {
        e.stopPropagation();
        openModal?.({
          title: 'Aprobar nómina',
          body: 'Pago programado para el 30 de mayo 2030 a las 8:00 AM.',
          details: [
            { label: 'Salarios',     value: '$42,000,000' },
            { label: 'Parafiscales', value: '$10,500,000' },
          ],
          confirmLabel: 'Aprobar · $52.5M',
          async: true,
          onConfirm: () =>
            pushToast?.({ level: 'success', title: 'Nómina aprobada', body: 'Pago 30 mayo 2030 · 8:00 AM.' }),
        });
      }}>Aprobar</button>
    </div>
  );
}

function GadgetProductos({ onNavigate }) {
  return (
    <div className="gd-card gd-productos" onClick={() => onNavigate('reports', { section: 'catalogo' })}>
      <div className="gd-card-header">
        <span className="gd-card-label">Productos top · este mes</span>
        <span className="gd-arrow-dim">›</span>
      </div>
      <div className="gd-prod-list">
        {TOP3.map((p, i) => (
          <div key={p.name} className="gd-prod-row">
            <div className="gd-prod-rank">{i + 1}</div>
            <div className="gd-prod-body">
              <div className="gd-prod-name">{p.name}</div>
              <div className="gd-prod-track">
                <div className="gd-prod-fill" style={{ width: `${p.pct}%` }} />
              </div>
            </div>
            <div className="gd-prod-sales">{p.sales} uds</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   REGISTRY
═══════════════════════════════════════════════════ */
const REGISTRY = {
  'ventas-hoy':    { label: 'Ventas hoy',      size: 'hero', Component: GadgetVentas      },
  'cuenta-bold':   { label: 'Cuenta Bold',      size: 'full', Component: GadgetCuenta      },
  'proximo-pago':  { label: 'Próximo pago',     size: 'half', Component: GadgetProximoPago  },
  'capital':       { label: 'Crédito Bold',      size: 'half', Component: GadgetCapital     },
  'datafonos':     { label: 'Datáfonos',        size: 'half', Component: GadgetDatafonos   },
  'seguros':       { label: 'Seguros',          size: 'half', Component: GadgetSeguros     },
  'iva':           { label: 'IVA',              size: 'half', Component: GadgetIVA         },
  'nomina':        { label: 'Nómina',           size: 'half', Component: GadgetNomina      },
  'productos-top': { label: 'Productos top',    size: 'full', Component: GadgetProductos   },
};

const DEFAULT_ACTIVE = [
  'ventas-hoy', 'cuenta-bold', 'proximo-pago', 'capital', 'datafonos', 'seguros', 'productos-top',
];

/* ═══════════════════════════════════════════════════
   DRAG HANDLE ICON
═══════════════════════════════════════════════════ */
function DragHandle() {
  return (
    <div className="gd-drag-handle" aria-hidden>
      {[0,1,2].map(r => (
        <div key={r} className="gd-drag-row">
          <span /><span />
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════ */
export default function Gadgets({ onNavigate }) {
  const { openModal, pushToast } = useStore();
  const [active, setActive]         = useState(DEFAULT_ACTIVE);
  const [editMode, setEditMode]     = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);

  // Drag state
  const [dragIdx, setDragIdx] = useState(null);
  const [dropIdx, setDropIdx] = useState(null);

  /* ── Mouse drag handlers (desktop) ── */
  const onDragStart = (e, idx) => {
    setDragIdx(idx);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(idx));
  };

  const onDragOver = (e, idx) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (idx !== dragIdx) setDropIdx(idx);
  };

  const onDrop = (e, idx) => {
    e.preventDefault();
    if (dragIdx !== null && dragIdx !== idx) {
      const next = [...active];
      const [moved] = next.splice(dragIdx, 1);
      next.splice(idx, 0, moved);
      setActive(next);
    }
    setDragIdx(null);
    setDropIdx(null);
  };

  const onDragEnd = () => {
    setDragIdx(null);
    setDropIdx(null);
  };

  /* ── Touch drag handlers (mobile) ── */
  const touch = useRef({ dragging: false, fromIdx: null });

  const onTouchStart = (e, idx) => {
    touch.current = { dragging: true, fromIdx: idx };
    setDragIdx(idx);
  };

  const onTouchMove = (e) => {
    if (!touch.current.dragging) return;
    const { clientX, clientY } = e.touches[0];
    // Find which card is under the finger
    const el = document.elementFromPoint(clientX, clientY);
    const item = el?.closest('[data-gd-idx]');
    if (item) {
      const targetIdx = parseInt(item.dataset.gdIdx, 10);
      if (!isNaN(targetIdx) && targetIdx !== touch.current.fromIdx) {
        setDropIdx(targetIdx);
      }
    }
  };

  const onTouchEnd = () => {
    if (!touch.current.dragging) return;
    setDragIdx(prev => {
      setDropIdx(prevDrop => {
        if (prev !== null && prevDrop !== null && prev !== prevDrop) {
          setActive(a => {
            const next = [...a];
            const [moved] = next.splice(prev, 1);
            next.splice(prevDrop, 0, moved);
            return next;
          });
        }
        return null;
      });
      return null;
    });
    touch.current = { dragging: false, fromIdx: null };
  };

  /* ── Add / Remove ── */
  const remove = (id) => setActive(a => a.filter(x => x !== id));
  const add    = (id) => { setActive(a => [...a, id]); setShowLibrary(false); };
  const library = Object.keys(REGISTRY).filter(id => !active.includes(id));

  const today = MOCK_TODAY.toLocaleDateString('es-CO', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="gd-shell">

      {/* ── Header ── */}
      <div className="gd-header">
        <div className="gd-header-info">
          <div className="gd-business-name">La Cocina de Claudia</div>
          <div className="gd-header-sub">Bold OS · {today}</div>
        </div>
        <button
          className={`gd-edit-toggle ${editMode ? 'done' : ''}`}
          onClick={() => { setEditMode(e => !e); setShowLibrary(false); setDragIdx(null); setDropIdx(null); }}
        >
          {editMode ? 'Listo' : 'Personalizar'}
        </button>
      </div>

      {/* ── Edit mode hint banner ── */}
      {editMode && (
        <div className="gd-edit-hint">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"/>
          </svg>
          Arrastra para mover · toca <strong>×</strong> para quitar
        </div>
      )}

      {/* ── Gadget Grid ── */}
      <div className="gd-scroll">
        <div className="gd-grid">
          {active.map((id, i) => {
            const def = REGISTRY[id];
            if (!def) return null;
            const { size, Component } = def;
            const isDragging  = dragIdx === i;
            const isDropTarget = dropIdx === i && dragIdx !== null && dragIdx !== i;

            return (
              <div
                key={id}
                data-gd-idx={i}
                className={[
                  'gd-item',
                  `gd-size-${size}`,
                  editMode   ? 'gd-edit-mode' : '',
                  isDragging ? 'gd-dragging'   : '',
                  isDropTarget ? 'gd-drop-target' : '',
                ].join(' ')}
                draggable={editMode}
                onDragStart={editMode ? (e) => onDragStart(e, i) : undefined}
                onDragOver={editMode  ? (e) => onDragOver(e, i)  : undefined}
                onDrop={editMode      ? (e) => onDrop(e, i)      : undefined}
                onDragEnd={editMode   ? onDragEnd                  : undefined}
                onTouchStart={editMode ? (e) => onTouchStart(e, i) : undefined}
                onTouchMove={editMode  ? onTouchMove               : undefined}
                onTouchEnd={editMode   ? onTouchEnd                : undefined}
              >
                {/* Drag handle — top-right in edit mode */}
                {editMode && <DragHandle />}

                <Component
                  onNavigate={editMode ? () => {} : onNavigate}
                  openModal={openModal}
                  pushToast={pushToast}
                />

                {/* Remove button — top-left in edit mode */}
                {editMode && (
                  <button
                    className="gd-remove-btn"
                    onClick={e => { e.stopPropagation(); remove(id); }}
                    aria-label={`Quitar ${def.label}`}
                  >
                    <svg viewBox="0 0 14 14" width="9" height="9" fill="none"
                      stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
                      <path d="M2 2l10 10M12 2L2 12" />
                    </svg>
                  </button>
                )}
              </div>
            );
          })}

          {/* ── Add gadget card ── */}
          {editMode && (
            <div className="gd-item gd-size-half gd-add-card" onClick={() => setShowLibrary(true)}>
              <div className="gd-add-icon">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="12" y1="4" x2="12" y2="20" />
                  <line x1="4"  y1="12" x2="20" y2="12" />
                </svg>
              </div>
              <div className="gd-add-label">Agregar<br/>gadget</div>
            </div>
          )}
        </div>
        <div style={{ height: 28 }} />
      </div>

      {/* ── Library bottom sheet ── */}
      {showLibrary && (
        <div className="gd-overlay" onClick={() => setShowLibrary(false)}>
          <div className="gd-sheet" onClick={e => e.stopPropagation()}>
            <div className="gd-sheet-handle" />
            <div className="gd-sheet-title">Agregar gadget</div>
            {library.length === 0 ? (
              <div className="gd-sheet-empty">
                Todos los gadgets están activos. Quita uno para ver más opciones.
              </div>
            ) : (
              <div className="gd-sheet-list">
                {library.map(id => (
                  <button key={id} className="gd-sheet-row" onClick={() => add(id)}>
                    <div className="gd-sheet-row-dot" />
                    <div className="gd-sheet-row-body">
                      <div className="gd-sheet-row-label">{REGISTRY[id].label}</div>
                      <div className="gd-sheet-row-size">
                        {REGISTRY[id].size === 'half' ? 'Compacto · media fila' : 'Amplio · fila completa'}
                      </div>
                    </div>
                    <div className="gd-sheet-row-add">
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="none"
                        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="12" y1="4" x2="12" y2="20" />
                        <line x1="4"  y1="12" x2="20" y2="12" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            )}
            <div style={{ height: 16 }} />
          </div>
        </div>
      )}
    </div>
  );
}
