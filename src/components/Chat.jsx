import { useState, useRef, useEffect } from 'react';
import { useStore } from '../store';
import { formatCOP, formatCOPFull } from '../data/mockData';
import { IconMic, IconSend, IconSparkle, IconCheck, IconAlertCircle, IconTrendUp } from './Icons';

/* ─── Bold OS opens with ONE message — the most urgent thing ─── */
const SEED_MESSAGES = [
  {
    id: 'seed-1',
    from: 'bold',
    type: 'text',
    time: '8:02 AM',
    text: 'Buenos días, Claudia. Ventas de ayer $4.8M, +8%. Hay una cosa que requiere atención: el IVA vence en 8 días y te faltan $50k para cubrir el estimado. ¿Lo provisiono ahora?',
    actions: [
      { label: 'Provisionar $50k', action: 'provision_tax', style: 'primary' },
      { label: 'Después', action: 'remind_later', style: 'ghost' },
    ],
  },
];

/* ─── Follow-up chain: after tax is resolved, surface opportunity ─── */
const FOLLOWUP = {
  provision_tax: {
    delay: 1600,
    msg: {
      from: 'bold',
      type: 'opportunity',
      text: 'Perfecto. También detecté algo interesante para hoy:',
      opp: {
        title: 'Descuento 18% en pollo — solo hoy',
        saving: 166000,
        amount: 816000,
        term: '~12 días',
      },
    },
  },
};

/* ─── Action replies — 3 real turns per product ─── */
const BOT_REPLIES = {
  // ── Seed flow ──
  provision_tax: {
    type: 'action_done',
    text: 'Listo. Provisioné $50,000 desde tu cuenta operativa. IVA cubierto — $2,350,000 disponibles para el 15 de mayo 2030. Te aviso 48h antes del vencimiento.',
    badge: { label: '$50k provisionados', level: 'success' },
  },
  remind_later: {
    type: 'text',
    text: 'Entendido. Te recuerdo en 2 horas con el detalle del IVA.',
  },
  accept_opp: {
    type: 'action_done',
    text: 'Bold Capital desembolsó $816,000 a Agroavícola XYZ. El pago se descuenta con el 8% de tus ventas diarias — en ~12 días queda saldado. Ahorraste $166k netos.',
    badge: { label: '$166k ahorrados', level: 'success' },
  },
  ignore_opp: {
    type: 'text',
    text: 'Entendido. Aprendo de tu preferencia para no molestarte con oportunidades similares.',
  },
  approve_payroll: {
    type: 'action_done',
    text: 'Nómina programada para el 30 de mayo 2030 a las 8:00 AM. $42M para 18 colaboradores y $10.5M a la PILA.',
    badge: { label: '$52.5M programados', level: 'success' },
  },

  // ── Crédito — Turn 2 ──
  simulate_credit: {
    type: 'text',
    text: 'Si activas $8.5M hoy: pagarías ~$265k/día (8% de tus ventas promedio). Saldado en ~32 días. Costo total de intereses: $255,000. Relación retorno/costo: 33x si usas el capital en inventario. ¿Lo activo?',
    actions: [
      { label: 'Activar crédito', action: 'activate_credit', style: 'primary' },
      { label: 'No por ahora', action: 'decline_credit', style: 'ghost' },
    ],
  },
  // ── Crédito — Turn 3 ──
  activate_credit: {
    type: 'action_done',
    text: '$8.5M desembolsados a tu Cuenta Bold. Llegarán en menos de 2 minutos. El pago automático empieza mañana con el 8% de tus ventas diarias — no necesitas hacer nada.',
    badge: { label: 'Crédito activado · $8.5M', level: 'success' },
  },
  decline_credit: {
    type: 'text',
    text: 'Entendido. El crédito sigue pre-aprobado por 30 días. Cuando lo necesites, dime "activa el crédito" y lo proceso al instante.',
  },

  // ── Seguros — Turn 2 ──
  view_policies: {
    type: 'text',
    text: 'Tienes 3 coberturas activas por $395k/mes:\n· RC Extracontractual $120k · Todo Riesgo Negocio $180k · Accidentes Laborales $95k\n\nSin cubrir: Sustracción de Dinero ($65k) e Incendio y Aliados ($85k). Son los dos riesgos más comunes en restaurantes.',
    actions: [
      { label: 'Activar Sustracción', action: 'add_device_coverage', style: 'primary' },
      { label: 'Ver detalle', action: 'cancel_policy', style: 'ghost' },
    ],
  },
  // ── Seguros — Turn 3 ──
  add_device_coverage: {
    type: 'action_done',
    text: 'Seguro de Sustracción de Dinero activado desde hoy. Prima $65k/mes — se cobra automáticamente a tu Cuenta Bold. Cubre efectivo en caja y en tránsito hasta $5M por evento.',
    badge: { label: 'Sustracción activa · $65k/mes', level: 'success' },
  },
  cancel_policy: {
    type: 'text',
    text: '¿Cuál quieres revisar o cancelar? Recuerda que la RC es obligatoria para establecimientos con atención al público en Colombia.',
  },

  // ── Catálogo — Turn 2 ──
  view_inactive: {
    type: 'text',
    text: 'Sin venta en 30 días: Cazuela de mariscos ($29k c/u), Lulada ($8.5k), Agua con gas ($2.5k). Simplificar el menú generalmente sube el ticket promedio. ¿Los desactivo?',
    actions: [
      { label: 'Desactivar los 3', action: 'deactivate_products', style: 'primary' },
      { label: 'Dejar activos', action: 'keep_products', style: 'ghost' },
    ],
  },
  edit_prices: {
    type: 'text',
    text: '¿Qué quieres ajustar? Dime "sube todos 5%" para ajuste masivo, o dime el producto y el nuevo precio.',
  },
  // ── Catálogo — Turn 3 ──
  deactivate_products: {
    type: 'action_done',
    text: '3 productos desactivados. Catálogo: 44 productos activos — menú más limpio. Te aviso en 15 días si el ticket promedio subió.',
    badge: { label: '3 productos desactivados', level: 'success' },
  },
  keep_products: {
    type: 'text',
    text: 'Los dejo activos. Te aviso si siguen sin venta los próximos 15 días para decidir de nuevo.',
  },

  // ── Reportes — Turn 2 ──
  report_this_month: {
    type: 'text',
    text: 'Reporte de ventas — abril 2030 listo. Incluye: desglose por canal, hora pico (12:00–13:00), top 5 productos, y comparativo vs marzo (+12%). ¿Lo envío a tu email o descargo el PDF?',
    actions: [
      { label: 'Enviar al email', action: 'email_report', style: 'primary' },
      { label: 'Descargar PDF', action: 'download_report', style: 'ghost' },
    ],
  },
  report_last_month: {
    type: 'text',
    text: 'Reporte de marzo 2030 listo. $182M en ventas · +8% vs febrero · 1,847 transacciones. ¿Lo envío?',
    actions: [
      { label: 'Enviar al email', action: 'email_report', style: 'primary' },
    ],
  },
  // ── Reportes — Turn 3 ──
  email_report: {
    type: 'action_done',
    text: 'Enviado a claudia@lacocinadeclaudia.com. Incluí análisis de tendencias y proyección para mayo. Llega en menos de 1 minuto.',
    badge: { label: 'Reporte enviado al email', level: 'success' },
  },
  download_report: {
    type: 'action_done',
    text: 'PDF generado y descargado. También te lo envié al email como respaldo.',
    badge: { label: 'PDF descargado', level: 'success' },
  },

  // ── Datáfonos — Turn 2 ──
  open_support: {
    type: 'text',
    text: 'Caso #SC-4891 abierto. Un técnico Bold te contactará hoy antes de las 2 PM. ¿Reencamino las ventas de terraza al datáfono de caja mientras tanto?',
    actions: [
      { label: 'Reencaminar ventas', action: 'reroute_sales', style: 'primary' },
      { label: 'No, gracias', action: 'decline_reroute', style: 'ghost' },
    ],
  },
  ignore_device: {
    type: 'text',
    text: 'Entendido. Te aviso si BOL-4823 sigue sin señal en 2 horas.',
  },
  // ── Datáfonos — Turn 3 ──
  reroute_sales: {
    type: 'action_done',
    text: 'Listo. El QR de terraza ahora apunta al datáfono de caja. Cuando BOL-4823 vuelva en línea, revierte solo — sin que tengas que hacer nada.',
    badge: { label: 'Ventas reencaminadas · automático', level: 'success' },
  },
  decline_reroute: {
    type: 'text',
    text: 'Entendido. El soporte sigue activo — el técnico llegará antes de las 2 PM.',
  },

  // ── Domicilios — Turn 2 ──
  view_delivery_detail: {
    type: 'text',
    text: 'Rappi: $21.9M — comisión ~30% → les pagas $6.5M. Plataforma propia: $10.8M sin comisión. Si migras solo el 20% de pedidos Rappi a cobro directo, ahorras ~$1.3M/mes.',
    actions: [
      { label: 'Activar cobro directo', action: 'activate_direct_payment', style: 'primary' },
      { label: 'Más adelante', action: 'delay_direct', style: 'ghost' },
    ],
  },
  // ── Domicilios — Turn 3 ──
  activate_direct_payment: {
    type: 'action_done',
    text: 'Link creado → bold.co/cocina-claudia/pedidos. Compártelo en Instagram y WhatsApp. El ahorro empieza desde el primer pedido — sin comisión, pago inmediato.',
    badge: { label: 'Link de cobro directo activo', level: 'success' },
  },
  delay_direct: {
    type: 'text',
    text: 'Listo. El link estará listo cuando lo necesites — dime "cobro directo" y lo activo en segundos.',
  },

  open_cashflow: null, // handled inline (navigation)
  default: {
    type: 'text',
    text: 'Entendido. Lo gestiono y te confirmo en unos minutos.',
  },
};

/* ─── Free-text keyword matching — ALL Bold products ─── */
const KEYWORD_REPLIES = [
  // Pagos — cobros del día
  {
    pattern: /cobros? hoy|cómo van mis cobros|pagos hoy|ventas hoy/i,
    reply: {
      type: 'text',
      text: 'Hoy llevas $243k en 10 transacciones — datáfono 60%, QR 30%, link 10%. Tu hora pico fue 12:00–13:00 con $90k. ¿Quieres ver el detalle completo?',
      actions: [
        { label: 'Ver detalle', action: 'open_reports', style: 'primary' },
      ],
    },
  },
  // Banca — cuenta Bold
  {
    pattern: /cuenta bold|cómo está mi cuenta|saldo|banking|banca/i,
    reply: {
      type: 'text',
      text: 'Cuenta Bold: saldo $12.84M. Hoy entró $4.68M de tus ventas de ayer. Bold OS provisionó $180k para IVA automáticamente. ¿Quieres ver los movimientos?',
      actions: [
        { label: 'Ver movimientos', action: 'open_reports', style: 'primary' },
      ],
    },
  },
  // Flujo de caja
  {
    pattern: /flujo|cash|proyecci|runway/i,
    reply: {
      type: 'text',
      text: 'Runway actual: 32 días. Próximos 30 días proyecto $180M de ingresos y $148M de egresos — buffer de $32M.',
      actions: [{ label: 'Ver flujo de caja', action: 'open_cashflow', style: 'primary' }],
    },
  },
  // Ventas
  {
    pattern: /venta|ingreso|recaudo|cuánto vendí/i,
    reply: {
      type: 'text',
      text: 'Ayer $4.8M en 47 transacciones — +8% vs la semana pasada. Ticket promedio $102,500. Tu mejor hora fue 12:00–13:00 con $1.2M.',
    },
  },
  // Crédito — Turn 1
  {
    pattern: /cr[eé]dito|capital|pr[eé]stamo/i,
    reply: {
      type: 'text',
      text: '$8.5M pre-aprobados con Bold Capital al 3% mensual. Pago automático con el 8% de tus ventas — quedaría saldado en ~32 días. ¿Activo ahora o simulo el plan de pagos primero?',
      actions: [
        { label: 'Simular plan de pagos', action: 'simulate_credit', style: 'ghost' },
        { label: 'Activar crédito', action: 'activate_credit', style: 'primary' },
      ],
    },
  },
  // Nómina
  {
    pattern: /n[oó]mina|empleado|parafiscal/i,
    reply: {
      type: 'text',
      text: 'Nómina de 18 empleados lista: $42M + $10.5M parafiscales = $52.5M. Pago programado 30 mayo 2030 08:00. ¿Apruebo?',
      actions: [{ label: 'Aprobar nómina', action: 'approve_payroll', style: 'primary' }],
    },
  },
  // IVA
  {
    pattern: /iva|impuesto|dian|retenci/i,
    reply: {
      type: 'text',
      text: 'IVA estimado $2,350,000 · Provisionado $2,300,000 · Déficit $50,000 · Vence 15 mayo. ¿Lo provisiono ahora?',
      actions: [{ label: 'Provisionar $50k', action: 'provision_tax', style: 'primary' }],
    },
  },
  // Score de salud
  {
    pattern: /salud|score|estado|cómo estoy/i,
    reply: {
      type: 'text',
      text: 'Score de salud financiera: 74/100 — zona verde. Subió 3 puntos este mes. Principal mejora pendiente: cubrir el gap de IVA.',
      actions: [{ label: 'Ver proyección', action: 'open_cashflow', style: 'ghost' }],
    },
  },
  // Historial
  {
    pattern: /historial|qué hiciste|últimas acciones/i,
    reply: {
      type: 'text',
      text: 'Esta semana: provisioné $850k para IVA · pre-aprobé crédito de $8.5M · envié recordatorio de cobro a Taller El Roble. ¿Quieres revertir algo?',
    },
  },
  // Seguros — Turn 1
  {
    pattern: /seguro|cobertura|siniestro|robo|daño/i,
    reply: {
      type: 'text',
      text: '3 coberturas activas: RC Extracontractual, Todo Riesgo Negocio y Accidentes Laborales. Prima total $395k/mes. $0 en siniestros en 2030. Faltan Sustracción de Dinero e Incendio.',
      actions: [
        { label: 'Ver pólizas', action: 'view_policies', style: 'ghost' },
        { label: 'Asegurar BOL-4823', action: 'add_device_coverage', style: 'primary' },
      ],
    },
  },
  // Catálogo — Turn 1
  {
    pattern: /cat[aá]logo|producto|men[uú]|inventario/i,
    reply: {
      type: 'text',
      text: '47 productos activos. Top 3 este mes: Bandeja paisa $38k · Ajiaco $29k · Limonada de coco $12k. Hay 3 productos sin venta en 30 días.',
      actions: [
        { label: 'Ver inactivos', action: 'view_inactive', style: 'ghost' },
        { label: 'Editar precios', action: 'edit_prices', style: 'primary' },
      ],
    },
  },
  // Reportes — Turn 1
  {
    pattern: /reporte|informe|descarga|excel|pdf/i,
    reply: {
      type: 'text',
      text: '¿Qué período? Puedo generar ventas, IVA para DIAN, nómina y parafiscales, o cierre de caja.',
      actions: [
        { label: 'Este mes', action: 'report_this_month', style: 'primary' },
        { label: 'Mes pasado', action: 'report_last_month', style: 'ghost' },
      ],
    },
  },
  // Datáfonos — Turn 1
  {
    pattern: /dat[aá]fono|terminal|dispositivo|bater[ií]a/i,
    reply: {
      type: 'text',
      text: '2 de 3 datáfonos en línea. BOL-4823 (Terraza) sin señal desde las 7:30 AM · batería al 100% — probablemente desconectado del tomacorriente, no es falla de red.',
      actions: [
        { label: 'Abrir soporte', action: 'open_support', style: 'primary' },
        { label: 'Ignorar por ahora', action: 'ignore_device', style: 'ghost' },
      ],
    },
  },
  // Link / QR
  {
    pattern: /link|qr|cobro|pago r[aá]pido/i,
    reply: {
      type: 'text',
      text: '¿Quieres un link de cobro con monto fijo o libre? También puedo compartir tu QR por WhatsApp o email.',
      actions: [
        { label: 'Crear link', action: 'default', style: 'primary' },
        { label: 'Compartir QR', action: 'default', style: 'ghost' },
      ],
    },
  },
  // Domicilios — Turn 1
  {
    pattern: /domicilio|delivery|rappi|ifood/i,
    reply: {
      type: 'text',
      text: 'Este mes $32.8M en domicilios — 18% de tus ventas totales. Rappi 67%, plataforma propia 33%. Creciste +12% vs el mes pasado.',
      actions: [
        { label: 'Ver desglose', action: 'view_delivery_detail', style: 'ghost' },
        { label: 'Cobro directo', action: 'activate_direct_payment', style: 'primary' },
      ],
    },
  },
];

let msgIdCounter = 100;
const nextId = () => `m${++msgIdCounter}`;
const fmtTime = () => {
  const d = new Date('2030-04-22T' + new Date().toTimeString().slice(0,8));
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
};

export default function Chat({ onNavigate }) {
  const { openModal, acceptOpportunity, ignoreOpportunity, activeOpportunity } = useStore();
  const [messages, setMessages] = useState(SEED_MESSAGES);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [typing, setTyping] = useState(false);
  const [doneActions, setDoneActions] = useState(new Set());
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const pushMsg = (msg) =>
    setMessages((m) => [...m, { id: nextId(), time: fmtTime(), ...msg }]);

  const markDone = (action) =>
    setDoneActions((s) => new Set([...s, action]));

  const deliverReply = (action, overrideReply) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const reply = overrideReply || BOT_REPLIES[action] || BOT_REPLIES.default;
      if (reply) pushMsg({ from: 'bold', ...reply });

      // Chain follow-up if defined
      const followup = FOLLOWUP[action];
      if (followup) {
        setTimeout(() => {
          setTyping(true);
          setTimeout(() => {
            setTyping(false);
            pushMsg({ ...followup.msg, time: fmtTime() });
          }, 900);
        }, followup.delay);
      }
    }, 900);
  };

  const handleAction = (action) => {
    if (doneActions.has(action)) return;

    if (action === 'open_cashflow') {
      onNavigate('cashflow');
      return;
    }

    if (action === 'open_reports') {
      onNavigate('reports');
      return;
    }

    if (action === 'accept_opp') {
      if (!activeOpportunity) {
        markDone(action);
        deliverReply(action);
        return;
      }
      openModal({
        title: 'Confirmar compra',
        body: 'Bold Capital desembolsará el monto al proveedor y empezará el pago automático con tus ventas diarias.',
        details: [
          { label: 'Proveedor', value: activeOpportunity.supplier },
          { label: 'Monto', value: formatCOPFull(activeOpportunity.metrics.amount) },
          { label: 'Pago', value: activeOpportunity.metrics.repayment },
        ],
        confirmLabel: `Comprar · ${formatCOP(activeOpportunity.metrics.amount)}`,
        async: true,
        onConfirm: () => {
          acceptOpportunity(activeOpportunity);
          markDone(action);
          deliverReply(action);
        },
      });
      return;
    }

    if (action === 'ignore_opp' && activeOpportunity) {
      ignoreOpportunity(activeOpportunity);
    }

    markDone(action);
    deliverReply(action);
  };

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    pushMsg({ from: 'user', type: 'text', text });

    const match = KEYWORD_REPLIES.find((k) => k.pattern.test(text));
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const reply = match ? match.reply : BOT_REPLIES.default;
      pushMsg({ from: 'bold', ...reply });
    }, 1100);
  };

  const handleMic = () => {
    if (listening) { setListening(false); return; }
    setListening(true);
    setTimeout(() => {
      setListening(false);
      setInput('¿Cómo está mi flujo de caja este mes?');
      inputRef.current?.focus();
    }, 2500);
  };

  return (
    <div className="chat-shell">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-avatar">
          <IconSparkle width={18} height={18} />
        </div>
        <div className="chat-header-info">
          <div className="chat-header-name">Bold OS</div>
          <div className="chat-header-status">
            <span className="chat-status-dot" />
            Activo · responde al instante
          </div>
        </div>
      </div>

      {/* Product shortcuts */}
      <div className="chat-shortcuts">
        {[
          { label: 'Pagos',    text: '¿Cómo van mis cobros hoy?'          },
          { label: 'Banca',    text: '¿Cómo está mi cuenta Bold?'        },
          { label: 'Crédito',  text: '¿Cuánto crédito tengo disponible?' },
          { label: 'Seguros',  text: '¿Cómo están mis seguros?'          },
          { label: 'Catálogo',  navigate: 'catalog'  },
          { label: 'Reportes',  navigate: 'reports'  },
          { label: 'Datáfonos', text: '¿Cómo están mis datáfonos?' },
        ].map((s) => (
          <button
            key={s.label}
            className="chat-shortcut-chip"
            onClick={() => {
              if (s.navigate) { onNavigate(s.navigate, s.section ? { section: s.section } : {}); return; }
              pushMsg({ from: 'user', type: 'text', text: s.text });
              const match = KEYWORD_REPLIES.find((k) => k.pattern.test(s.text));
              setTyping(true);
              setTimeout(() => {
                setTyping(false);
                const reply = match ? match.reply : BOT_REPLIES.default;
                pushMsg({ from: 'bold', ...reply });
              }, 1100);
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            msg={msg}
            onAction={handleAction}
            doneActions={doneActions}
            onNavigate={onNavigate}
          />
        ))}
        {typing && (
          <div className="chat-row bold">
            <div className="chat-avatar"><IconSparkle width={12} height={12} /></div>
            <div className="chat-bubble bold typing">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="chat-input-bar">
        <button
          className={`chat-mic-btn ${listening ? 'listening' : ''}`}
          onClick={handleMic}
          aria-label={listening ? 'Detener' : 'Hablar'}
        >
          <IconMic width={18} height={18} />
          {listening && <span className="mic-pulse" />}
        </button>
        <input
          ref={inputRef}
          className="chat-input"
          placeholder="Pregunta algo o da una instrucción..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          className={`chat-send-btn ${input.trim() ? 'active' : ''}`}
          onClick={sendMessage}
          aria-label="Enviar"
          disabled={!input.trim()}
        >
          <IconSend width={16} height={16} />
        </button>
      </div>
    </div>
  );
}

function ChatMessage({ msg, onAction, doneActions, onNavigate }) {
  const isUser = msg.from === 'user';

  if (isUser) {
    return (
      <div className="chat-row user">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
          <div className="chat-bubble user">{msg.text}</div>
          <div className="chat-time user">{msg.time}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-row bold">
      <div className="chat-avatar"><IconSparkle width={12} height={12} /></div>
      <div className="chat-col">
        {msg.text && <div className="chat-bubble bold">{msg.text}</div>}

        {/* Opportunity card */}
        {msg.type === 'opportunity' && msg.opp && (
          <div className="chat-card opp">
            <div className="chat-opp-title">{msg.opp.title}</div>
            <div className="chat-opp-meta">
              <div className="chat-opp-stat">
                <div className="chat-opp-v">{formatCOP(msg.opp.saving)}</div>
                <div className="chat-opp-l">Ahorro neto</div>
              </div>
              <div className="chat-opp-stat">
                <div className="chat-opp-v">{formatCOP(msg.opp.amount)}</div>
                <div className="chat-opp-l">Crédito</div>
              </div>
              <div className="chat-opp-stat">
                <div className="chat-opp-v">{msg.opp.term}</div>
                <div className="chat-opp-l">Plazo</div>
              </div>
            </div>
            <div className="chat-opp-actions">
              <button
                className={`chat-action-btn primary ${doneActions.has('accept_opp') ? 'done' : ''}`}
                onClick={() => onAction('accept_opp')}
                disabled={doneActions.has('accept_opp') || doneActions.has('ignore_opp')}
              >
                {doneActions.has('accept_opp')
                  ? <><IconCheck width={13} height={13} /> Aceptado</>
                  : 'Comprar ahora'}
              </button>
              <button
                className="chat-action-btn ghost"
                onClick={() => onAction('ignore_opp')}
                disabled={doneActions.has('accept_opp') || doneActions.has('ignore_opp')}
              >
                {doneActions.has('ignore_opp') ? 'Ignorado' : 'Ignorar'}
              </button>
            </div>
          </div>
        )}

        {/* Action done badge */}
        {msg.type === 'action_done' && msg.badge && (
          <div className={`chat-done-badge ${msg.badge.level}`}>
            <IconCheck width={12} height={12} strokeWidth={3} />
            {msg.badge.label}
          </div>
        )}

        {/* Inline action buttons */}
        {msg.actions && (
          <div className="chat-actions">
            {msg.actions.map((a) => (
              <button
                key={a.action}
                className={`chat-action-btn ${a.style} ${doneActions.has(a.action) ? 'done' : ''}`}
                onClick={() => onAction(a.action)}
                disabled={doneActions.has(a.action)}
              >
                {doneActions.has(a.action)
                  ? <><IconCheck width={13} height={13} strokeWidth={3} /> Listo</>
                  : a.label}
              </button>
            ))}
          </div>
        )}

        <div className="chat-time bold">{msg.time}</div>
      </div>
    </div>
  );
}
