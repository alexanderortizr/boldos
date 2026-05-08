import { useStore } from '../store';
import { formatCOP, formatCOPFull } from '../data/mockData';
import { IconArrowLeft, IconCheck } from './Icons';

export default function OpportunityDetail({ onBack }) {
  const { activeOpportunity, acceptOpportunity, ignoreOpportunity, openModal, pushToast } = useStore();

  if (!activeOpportunity) {
    return (
      <>
        <div className="page-header">
          <button className="back-btn" onClick={onBack} aria-label="Volver"><IconArrowLeft /></button>
          <div className="page-title">Oportunidades</div>
        </div>
        <div className="placeholder-page">
          <div className="empty-icon-wrap"><IconCheck width={28} height={28} /></div>
          <h3>Sin oportunidades activas</h3>
          <p>Te avisaremos cuando Bold OS detecte una nueva oportunidad para tu negocio.</p>
        </div>
      </>
    );
  }

  const opp = activeOpportunity;
  const m = opp.metrics;

  const accept = () => {
    openModal({
      title: 'Confirmar compra',
      body: 'Bold Capital desembolsará el monto al proveedor y empezará el pago automático con tus ventas diarias.',
      details: [
        { label: 'Proveedor', value: opp.supplier },
        { label: 'Monto', value: formatCOPFull(m.amount) },
        { label: 'Pago', value: m.repayment },
        { label: 'Plazo estimado', value: m.term },
      ],
      confirmLabel: `Comprar · ${formatCOP(m.amount)}`,
      async: true,
      onConfirm: () => {
        acceptOpportunity(opp);
        onBack();
      },
    });
  };

  const ignore = () => {
    openModal({
      title: '¿Descartar oportunidad?',
      body: 'Aprenderé de tu preferencia para reducir notificaciones similares.',
      confirmLabel: 'Descartar',
      danger: true,
      onConfirm: () => {
        ignoreOpportunity(opp);
        onBack();
      },
    });
  };

  const seeMore = () => {
    pushToast({ level: 'info', title: 'Análisis detallado', body: 'Datos del proveedor y proyección de demanda (mock).' });
  };

  return (
    <>
      <div className="page-header">
        <button className="back-btn" onClick={onBack} aria-label="Volver"><IconArrowLeft /></button>
        <div className="page-title">Oportunidad</div>
      </div>

      <section className="opp-hero">
        <span className="opp-urgency">{opp.urgency}</span>
        <h1 className="opp-h1">{opp.title}</h1>
        <p className="opp-summary">{opp.summary}</p>
      </section>

      <div className="numbers-grid" aria-label="Desglose financiero">
        <div className="number-row">
          <span className="lbl">Ahorras (descuento)</span>
          <span className="val">{formatCOP(m.saving)}</span>
        </div>
        <div className="number-row">
          <span className="lbl">Costo del crédito</span>
          <span className="val" style={{ color: 'var(--text-dim)' }}>−{formatCOP(m.financingCost)}</span>
        </div>
        <div className="number-row highlight">
          <span className="lbl">Ahorro neto</span>
          <span className="val">{formatCOP(m.netSaving)}</span>
        </div>
      </div>

      <div className="numbers-grid">
        <div className="number-row">
          <span className="lbl">Monto del crédito</span>
          <span className="val">{formatCOP(m.amount)}</span>
        </div>
        <div className="number-row">
          <span className="lbl">Forma de pago</span>
          <span className="val">{m.repayment}</span>
        </div>
        <div className="number-row">
          <span className="lbl">Plazo estimado</span>
          <span className="val">{m.term}</span>
        </div>
        <div className="number-row">
          <span className="lbl">ROI</span>
          <span className="val" style={{ color: 'var(--accent)' }}>{m.roi}</span>
        </div>
      </div>

      <div className="reasons">
        <h3>¿Por qué te recomendamos esto?</h3>
        <ul>{opp.reasons.map((r, i) => <li key={i}>{r}</li>)}</ul>
        <div className="confidence-row">
          <span>Confianza del modelo</span>
          <div className="confidence-bar">
            <div className="confidence-fill" style={{ width: `${opp.confidence * 100}%` }} />
          </div>
          <strong>{Math.round(opp.confidence * 100)}%</strong>
        </div>
      </div>

      <div className="cta-bar">
        <button className="primary-btn" onClick={accept}>
          Comprar ahora · {formatCOP(m.amount)}
        </button>
        <div className="secondary-row">
          <button className="ghost-btn" onClick={seeMore}>Ver detalles</button>
          <button className="ghost-btn" onClick={ignore}>Ignorar</button>
        </div>
      </div>
    </>
  );
}
