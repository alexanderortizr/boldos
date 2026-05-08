import { useStore } from '../store';
import { useEffect, useState } from 'react';

export default function Modal() {
  const { modal, closeModal } = useStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
    if (!modal) return;
    const onKey = (e) => {
      if (e.key === 'Escape' && !loading) closeModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modal, closeModal, loading]);

  if (!modal) return null;

  const handleConfirm = async () => {
    if (modal.async) {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 900));
    }
    modal.onConfirm?.();
    closeModal();
  };

  return (
    <div className="modal-backdrop" onClick={() => !loading && closeModal()}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <h3 className="modal-title">{modal.title}</h3>
        {modal.body && <p className="modal-body">{modal.body}</p>}
        {modal.details && (
          <div className="modal-details">
            {modal.details.map((d, i) => (
              <div className="modal-detail-row" key={i}>
                <span>{d.label}</span>
                <strong>{d.value}</strong>
              </div>
            ))}
          </div>
        )}
        <div className="modal-actions">
          <button className="ghost-btn" onClick={closeModal} disabled={loading}>
            {modal.cancelLabel || 'Cancelar'}
          </button>
          <button
            className={`primary-btn ${modal.danger ? 'danger' : ''}`}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : (modal.confirmLabel || 'Confirmar')}
          </button>
        </div>
      </div>
    </div>
  );
}
