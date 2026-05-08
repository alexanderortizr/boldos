import { IconStore, IconSettings, IconChat } from './Icons';

export default function BottomNav({ current, onNavigate }) {
  const chatActive = current === 'chat' || current === 'home';

  return (
    <nav className="bottom-nav" aria-label="Navegación principal">
      <button
        className={`nav-btn ${current === 'negocio' ? 'active' : ''}`}
        onClick={() => onNavigate('negocio')}
        aria-current={current === 'negocio' ? 'page' : undefined}
      >
        <IconStore />
        <span>Negocio</span>
      </button>

      <button
        className={`nav-fab ${chatActive ? 'active' : ''}`}
        onClick={() => onNavigate('chat')}
        aria-label="Asistente Bold OS"
        aria-current={chatActive ? 'page' : undefined}
      >
        <div className="nav-fab-inner">
          <IconChat width={22} height={22} />
        </div>
        <span className="nav-fab-label">Asistente</span>
      </button>

      <button
        className={`nav-btn ${current === 'config' ? 'active' : ''}`}
        onClick={() => onNavigate('config')}
        aria-current={current === 'config' ? 'page' : undefined}
      >
        <IconSettings />
        <span>Ajustes</span>
      </button>
    </nav>
  );
}
