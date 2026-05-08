import { useStore } from '../store';
import { IconArrowLeft, IconWallet, IconReceipt, IconUsers, IconBellOff, IconMoon, IconDownload, IconTrash } from './Icons';

const AGENT_ICONS = {
  liquidez: <IconWallet width={20} height={20} />,
  impuestos: <IconReceipt width={20} height={20} />,
  nomina: <IconUsers width={20} height={20} />,
};

const AUTONOMY = [
  { id: 'manual', label: 'Manual', desc: 'Solo me notifica, yo ejecuto' },
  { id: 'semi', label: 'Semi-autónomo', desc: 'Me pide aprobación 1-tap' },
  { id: 'full', label: 'Totalmente autónomo', desc: 'Ejecuta si la confianza es ≥90%' },
];

export default function Settings({ onBack }) {
  const { agents, toggleAgent, setAutonomy, setThreshold, openModal, pushToast } = useStore();

  const exportData = () => {
    openModal({
      title: 'Exportar mis datos',
      body: 'Recibirás un archivo JSON con todos tus datos vía email en ≤72h.',
      confirmLabel: 'Solicitar export',
      async: true,
      onConfirm: () => pushToast({ level: 'success', title: 'Solicitud enviada', body: 'Te notificaremos cuando el archivo esté listo.' }),
    });
  };

  const deleteAccount = () => {
    openModal({
      title: 'Eliminar cuenta',
      body: 'Se borrarán todos tus datos en ≤72h. Esta acción no es reversible.',
      confirmLabel: 'Eliminar cuenta',
      danger: true,
      onConfirm: () => pushToast({ level: 'error', title: 'Solicitud registrada', body: 'Procesaremos la eliminación en las próximas 72h.' }),
    });
  };

  return (
    <>
      <div className="page-header">
        <button className="back-btn" onClick={onBack} aria-label="Volver"><IconArrowLeft /></button>
        <div className="page-title">Ajustes</div>
      </div>

      <div className="settings-section">
        <h3 className="settings-section-title">Agentes</h3>
        {Object.values(agents).map((a) => (
          <div className="settings-card" key={a.id}>
            <div className="settings-card-head">
              <div className="settings-card-title">
                <span className="settings-icon">{AGENT_ICONS[a.id]}</span>
                <div>
                  <div className="settings-name">{a.name}</div>
                  <div className="settings-desc">{a.description}</div>
                </div>
              </div>
              <Toggle checked={a.enabled} onChange={() => toggleAgent(a.id)} />
            </div>

            {a.enabled && (
              <>
                <div className="settings-divider" />
                <div className="settings-label">Nivel de autonomía</div>
                <div className="autonomy-grid">
                  {AUTONOMY.map((opt) => (
                    <button
                      key={opt.id}
                      className={`autonomy-opt ${a.autonomy === opt.id ? 'active' : ''}`}
                      onClick={() => setAutonomy(a.id, opt.id)}
                    >
                      <div className="autonomy-label">{opt.label}</div>
                      <div className="autonomy-desc">{opt.desc}</div>
                    </button>
                  ))}
                </div>

                {(a.id === 'liquidez' || a.id === 'impuestos') && (
                  <>
                    <div className="settings-divider" />
                    <div className="settings-label-row">
                      <span className="settings-label">Notificarme desde</span>
                      <strong>${a.threshold.toLocaleString('es-CO')}</strong>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={2000000}
                      step={50000}
                      value={a.threshold}
                      onChange={(e) => setThreshold(a.id, Number(e.target.value))}
                      className="slider"
                    />
                    <div className="slider-legend">
                      <span>$0</span>
                      <span>$2M</span>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      <div className="settings-section">
        <h3 className="settings-section-title">Preferencias</h3>
        <div className="settings-card compact">
          <div className="settings-card-head">
            <div className="settings-card-title">
              <span className="settings-icon"><IconBellOff width={20} height={20} /></span>
              <div>
                <div className="settings-name">Modo vacaciones</div>
                <div className="settings-desc">Pausa todos los agentes temporalmente</div>
              </div>
            </div>
            <Toggle checked={false} onChange={() => pushToast({ level: 'info', title: 'Modo vacaciones', body: 'Configura fecha de reactivación (mock).' })} />
          </div>
        </div>
        <div className="settings-card compact">
          <div className="settings-card-head">
            <div className="settings-card-title">
              <span className="settings-icon"><IconMoon width={20} height={20} /></span>
              <div>
                <div className="settings-name">Quiet hours</div>
                <div className="settings-desc">22:00 — 07:00 (sin push)</div>
              </div>
            </div>
            <Toggle checked={true} onChange={() => {}} />
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="settings-section-title">Datos y privacidad</h3>
        <button className="settings-row-btn" onClick={exportData}>
          <span className="settings-row-inner"><IconDownload width={15} height={15} /> Exportar mis datos</span>
          <span className="chev-text">›</span>
        </button>
        <button className="settings-row-btn danger" onClick={deleteAccount}>
          <span className="settings-row-inner"><IconTrash width={15} height={15} /> Eliminar cuenta</span>
          <span className="chev-text">›</span>
        </button>
      </div>

      <div className="settings-footer">
        Bold OS v0.1 · Alpha · Phase 0 MVP
      </div>
    </>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      className={`toggle ${checked ? 'on' : 'off'}`}
      onClick={onChange}
      role="switch"
      aria-checked={checked}
    >
      <span className="toggle-thumb" />
    </button>
  );
}
