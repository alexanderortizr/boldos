import { useStore } from '../store';
import { IconCheck } from './Icons';

export default function Toasts() {
  const { toasts, dismissToast } = useStore();
  return (
    <div className="toasts" aria-live="polite" aria-atomic="true">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast toast-${t.level || 'info'}`}
          role="status"
          onClick={() => dismissToast(t.id)}
        >
          <div className="toast-icon">
            {t.level === 'success' ? <IconCheck /> : t.level === 'error' ? '!' : 'i'}
          </div>
          <div className="toast-body">
            <div className="toast-title">{t.title}</div>
            {t.body && <div className="toast-text">{t.body}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
