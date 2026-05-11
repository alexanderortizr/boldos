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
    text: 'Bold desembolsó $816,000 a Agroavícola XYZ. El pago se descuenta con el 8% de tus ventas diarias — en ~12 días queda saldado. Ahorraste $166k netos.',
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

  // ── Inversiones — Turn 2 ──
  open_cdt: {
    type: 'text',
    text: '¿A qué plazo quieres abrirlo? Tienes $10M disponibles. La tasa sube con el plazo:',
    actions: [
      { label: '30 días · 7.5% EA',  action: 'cdt_30',  style: 'ghost'   },
      { label: '60 días · 8.0% EA',  action: 'cdt_60',  style: 'ghost'   },
      { label: '90 días · 8.5% EA',  action: 'cdt_90',  style: 'primary' },
      { label: '180 días · 9.2% EA', action: 'cdt_180', style: 'ghost'   },
    ],
  },
  // ── Inversiones — Turn 3 (plazo elegido) ──
  cdt_30: {
    type: 'action_done',
    text: 'CDT abierto a 30 días al 7.5% EA. Retorno estimado: $62,500. Lo renovamos automáticamente al vencimiento.',
    badge: { label: 'CDT activo · 30 días · 7.5% EA', level: 'success' },
  },
  cdt_60: {
    type: 'action_done',
    text: 'CDT abierto a 60 días al 8.0% EA. Retorno estimado: $133,000. Lo renovamos automáticamente al vencimiento.',
    badge: { label: 'CDT activo · 60 días · 8.0% EA', level: 'success' },
  },
  cdt_90: {
    type: 'action_done',
    text: 'CDT abierto a 90 días al 8.5% EA. Retorno estimado: $212,500. Lo renovamos automáticamente al vencimiento.',
    badge: { label: 'CDT activo · 90 días · 8.5% EA', level: 'success' },
  },
  cdt_180: {
    type: 'action_done',
    text: 'CDT abierto a 180 días al 9.2% EA. Retorno estimado: $460,000 — tu mejor opción de rendimiento. Lo renovamos automáticamente al vencimiento.',
    badge: { label: 'CDT activo · 180 días · 9.2% EA', level: 'success' },
  },
  view_bolsillos: {
    type: 'text',
    text: 'Tienes 3 bolsillos activos: Fondo emergencias ($2M), Vacaciones 2030 ($1.2M) y Equipo nuevo ($1M). Todos generando 4.2% EA automáticamente. ¿Abro uno nuevo?',
    actions: [
      { label: 'Nuevo bolsillo', action: 'new_bolsillo', style: 'primary' },
    ],
  },
  new_bolsillo: {
    type: 'action_done',
    text: 'Bolsillo creado y activo. Empieza a generar 4.2% EA desde el primer peso que deposites.',
    badge: { label: 'Bolsillo creado · 4.2% EA', level: 'success' },
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
  // Predicción / futuro
  {
    pattern: /predic|próxim|semana que|qué va a pasar|cuánto voy a vend|proyecc|forecast|futuro/i,
    reply: {
      type: 'text',
      text: 'Esta semana proyecta $35.6M — tu mejor semana del mes. El sábado solo puede llegar a $7.8M. Tengo el análisis completo de los próximos 7 y 30 días listo.',
      actions: [
        { label: 'Ver Bold Predict', action: 'open_predict', style: 'primary' },
      ],
    },
  },
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
      text: '$8.5M pre-aprobados con Crédito Bold al 3% mensual. Pago automático con el 8% de tus ventas — quedaría saldado en ~32 días. ¿Activo ahora o simulo el plan de pagos primero?',
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

    if (action === 'open_predict') {
      onNavigate('predict');
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
        body: 'Bold desembolsará el monto al proveedor y empezará el pago automático con tus ventas diarias.',
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
      {/* ── OS Command Bar ── */}
      <div className="chat-header">
        <div className="chat-header-top">
          <div className="chat-header-biz">La Cocina de Claudia</div>
          <div className="chat-header-live">
            <span className="chat-live-dot" />
            <span className="chat-live-label">Bold OS activo</span>
          </div>
        </div>
        <div className="chat-header-kpis">
          <div className="chat-kpi">
            <span className="chat-kpi-val">$4.8M</span>
            <span className="chat-kpi-lbl">hoy</span>
          </div>
          <div className="chat-kpi-sep" />
          <div className="chat-kpi">
            <span className="chat-kpi-val green">+8%</span>
            <span className="chat-kpi-lbl">vs ayer</span>
          </div>
          <div className="chat-kpi-sep" />
          <div className="chat-kpi">
            <span className="chat-kpi-val">47</span>
            <span className="chat-kpi-lbl">transacciones</span>
          </div>
          <div className="chat-kpi-sep" />
          <div className="chat-kpi">
            <span className="chat-kpi-val orange">1</span>
            <span className="chat-kpi-lbl">alerta</span>
          </div>
        </div>
      </div>

      {/* Product shortcuts */}
      <div className="chat-shortcuts">
        {[
          { label: 'Pagos',    paymentsCard: true                          },
          { label: 'Banca',    bancaCard: true                             },
          { label: 'Crédito',  creditoCard: true                          },
          { label: 'Seguros',      segurosCard:     true },
          { label: 'Inversiones', inversionesCard: true },
          { label: 'Catálogo',  navigate: 'catalog'  },
          { label: 'Reportes',  navigate: 'reports'  },
          { label: '🔮 Predicción', navigate: 'predict' },
          { label: 'Datáfonos', text: '¿Cómo están mis datáfonos?' },
        ].map((s) => (
          <button
            key={s.label}
            className="chat-shortcut-chip"
            onClick={() => {
              if (s.navigate) { onNavigate(s.navigate, s.section ? { section: s.section } : {}); return; }

              // Inversiones — wow card
              if (s.inversionesCard) {
                pushMsg({ from: 'user', type: 'text', text: '¿Cómo están mis inversiones?' });
                setTyping(true);
                setTimeout(() => {
                  setTyping(false);
                  pushMsg({ from: 'bold', type: 'inversiones_card' });
                }, 900);
                return;
              }

              // Seguros — wow card
              if (s.segurosCard) {
                pushMsg({ from: 'user', type: 'text', text: '¿Cómo están mis seguros?' });
                setTyping(true);
                setTimeout(() => {
                  setTyping(false);
                  pushMsg({ from: 'bold', type: 'seguros_card' });
                }, 900);
                return;
              }

              // Crédito — wow card
              if (s.creditoCard) {
                pushMsg({ from: 'user', type: 'text', text: '¿Cuánto crédito tengo disponible?' });
                setTyping(true);
                setTimeout(() => {
                  setTyping(false);
                  pushMsg({ from: 'bold', type: 'credito_card' });
                }, 900);
                return;
              }

              // Banca — wow card
              if (s.bancaCard) {
                pushMsg({ from: 'user', type: 'text', text: '¿Cómo está mi cuenta Bold?' });
                setTyping(true);
                setTimeout(() => {
                  setTyping(false);
                  pushMsg({ from: 'bold', type: 'banca_card' });
                }, 900);
                return;
              }

              // Pagos — wow card
              if (s.paymentsCard) {
                pushMsg({ from: 'user', type: 'text', text: '¿Cómo van mis cobros hoy?' });
                setTyping(true);
                setTimeout(() => {
                  setTyping(false);
                  pushMsg({ from: 'bold', type: 'payments_card' });
                }, 900);
                return;
              }

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
          <div className="os-msg os-msg-typing">
            <div className="os-msg-header">
              <span className="os-msg-source"><IconSparkle width={9} height={9} />Bold OS</span>
              <span className="os-processing">Procesando</span>
            </div>
            <div className="os-typing-dots">
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

/* ═══════════════════════════════════════════════════
   PAYMENTS WOW CARD
═══════════════════════════════════════════════════ */
const SPARK_DATA  = [3.2, 4.1, 3.8, 4.8, 6.2, 7.1, 4.8];
const MAX_SPARK   = Math.max(...SPARK_DATA);
const PAY_TARGET  = 4_800_000;

function PaymentsCard({ onAction }) {
  const [count,       setCount]       = useState(0);
  const [showInsight, setShowInsight] = useState(false);

  // Animated counter — ease-out cubic over 1.1 s
  useEffect(() => {
    const duration = 1100;
    const start    = performance.now();
    let raf;
    const tick = (now) => {
      const t      = Math.min((now - start) / duration, 1);
      const eased  = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(PAY_TARGET * eased));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setShowInsight(true), 180);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const fmtLive = (v) => {
    if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000)     return `$${Math.round(v / 1_000)}k`;
    return `$${v}`;
  };

  return (
    <div className="chat-pay-card">
      {/* Label */}
      <div className="chat-pay-label">Ventas hoy</div>

      {/* Animated counter */}
      <div className="chat-pay-amount">{fmtLive(count)}</div>
      <div className="chat-pay-growth">+8% vs ayer · 47 transacciones</div>

      {/* Sparkline */}
      <div className="chat-pay-spark">
        {SPARK_DATA.map((v, i) => (
          <div key={i} className="chat-pay-spark-col">
            <div
              className={`chat-pay-spark-bar${i === SPARK_DATA.length - 1 ? ' current' : ''}`}
              style={{ height: `${(v / MAX_SPARK) * 100}%`, animationDelay: `${i * 0.06}s` }}
            />
          </div>
        ))}
      </div>

      {/* Channels */}
      <div className="chat-pay-channels">
        <span className="chat-pay-ch"><span className="chat-pay-dot white" />Datáfono 58%</span>
        <span className="chat-pay-ch"><span className="chat-pay-dot coral" />QR 30%</span>
        <span className="chat-pay-ch"><span className="chat-pay-dot dim"   />Link 12%</span>
      </div>

      {/* Insight — appears after counter lands */}
      <div className={`chat-pay-insight${showInsight ? ' visible' : ''}`}>
        Si el ritmo se mantiene, cierras en <strong>$7.2M</strong> — tu mejor jueves del mes.
      </div>

      {/* CTA */}
      <button className="chat-pay-cta" onClick={() => onAction('open_reports')}>
        Ver detalle completo →
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   BANCA WOW CARD
═══════════════════════════════════════════════════ */
const BANCA_BALANCE  = 12_840_000;
const BANCA_INGRESOS = 12_706_400;
const BANCA_EGRESOS  =    540_000;
const BANCA_MAX_FLOW = BANCA_INGRESOS; // reference for bar widths

function BancaCard({ onNavigate }) {
  const [count,      setCount]      = useState(0);
  const [showFlow,   setShowFlow]   = useState(false);
  const [showInsight,setShowInsight] = useState(false);

  // Counter: $0 → $12.84M in 1.1s
  useEffect(() => {
    const duration = 1100;
    const start    = performance.now();
    let raf;
    const tick = (now) => {
      const t     = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(BANCA_BALANCE * eased));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setShowFlow(true),    120);
        setTimeout(() => setShowInsight(true), 800);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const fmtLive = (v) => {
    if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
    if (v >= 1_000)     return `$${Math.round(v / 1_000)}k`;
    return `$${v}`;
  };
  const fmt = (v) => {
    if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
    return `$${(v / 1_000).toFixed(0)}k`;
  };

  return (
    <div className="chat-banca-card">
      {/* Label */}
      <div className="chat-pay-label">Cuenta Bold · saldo disponible</div>

      {/* Animated balance */}
      <div className="chat-pay-amount">{fmtLive(count)}</div>
      <div className="chat-pay-growth">Actualizado hace 2 min</div>

      {/* Flow bars */}
      <div className={`chat-banca-flow${showFlow ? ' visible' : ''}`}>
        {/* Ingresos */}
        <div className="chat-banca-flow-row">
          <div className="chat-banca-flow-meta">
            <span className="chat-banca-arrow in">↑</span>
            <span className="chat-banca-flow-label">Pagos Bold recibidos</span>
            <span className="chat-banca-flow-val in">{fmt(BANCA_INGRESOS)}</span>
          </div>
          <div className="chat-banca-bar-bg">
            <div
              className="chat-banca-bar-fill in"
              style={{ width: `${(BANCA_INGRESOS / BANCA_MAX_FLOW) * 100}%` }}
            />
          </div>
        </div>

        {/* Egresos */}
        <div className="chat-banca-flow-row">
          <div className="chat-banca-flow-meta">
            <span className="chat-banca-arrow out">↓</span>
            <span className="chat-banca-flow-label">Egresos</span>
            <span className="chat-banca-flow-val out">−{fmt(BANCA_EGRESOS)}</span>
          </div>
          <div className="chat-banca-bar-bg">
            <div
              className="chat-banca-bar-fill out"
              style={{ width: `${(BANCA_EGRESOS / BANCA_MAX_FLOW) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Insight */}
      <div className={`chat-pay-insight${showInsight ? ' visible' : ''}`}>
        Tu próximo pago Bold llega <strong>mañana a las 8:00 AM</strong> — $4.68M estimado. Bold OS ya provisionó $180k para IVA.
      </div>

      {/* CTA */}
      <button className="chat-pay-cta" onClick={() => onNavigate('reports', { section: 'banca' })}>
        Ver movimientos →
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CRÉDITO WOW CARD
═══════════════════════════════════════════════════ */
const CREDITO_AMOUNT   = 8_500_000;
const CREDITO_DAILY    =   265_000;
const CREDITO_DAYS     = 32;
const CREDITO_INTEREST =   255_000;
const CREDITO_RETURN   = 8_400_000;

function CreditoCard({ onAction, onNavigate }) {
  const [count,       setCount]       = useState(0);
  const [barWidth,    setBarWidth]    = useState(0);
  const [showCost,    setShowCost]    = useState(false);
  const [showInsight, setShowInsight] = useState(false);

  // Counter + capacity bar: $0 → $8.5M in 1.1s
  useEffect(() => {
    const duration = 1100;
    const start    = performance.now();
    let raf;
    const tick = (now) => {
      const t     = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(CREDITO_AMOUNT * eased));
      setBarWidth(Math.round(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setShowCost(true),    150);
        setTimeout(() => setShowInsight(true), 900);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const fmtLive = (v) => {
    if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000)     return `$${Math.round(v / 1_000)}k`;
    return `$${v}`;
  };
  const fmt = (v) => {
    if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
    return `$${(v / 1_000).toFixed(0)}k`;
  };

  return (
    <div className="chat-credito-card">
      {/* Animated counter */}
      <div className="chat-pay-amount">{fmtLive(count)}</div>
      <div className="chat-pay-growth">disponibles ahora · desembolso en &lt;2 min</div>

      {/* Capacity bar */}
      <div className="chat-credito-capacity">
        <div className="chat-credito-cap-track">
          <div className="chat-credito-cap-fill" style={{ width: `${barWidth}%` }} />
        </div>
        <span className="chat-credito-cap-label">capacidad disponible</span>
      </div>

      {/* Cost breakdown — staggered */}
      <div className={`chat-credito-cost${showCost ? ' visible' : ''}`}>
        <div className="chat-credito-cost-row">
          <span className="chat-credito-cost-icon">💸</span>
          <span className="chat-credito-cost-label">Pago diario automático</span>
          <span className="chat-credito-cost-val">{fmt(CREDITO_DAILY)}</span>
        </div>
        <div className="chat-credito-cost-row" style={{ animationDelay: '0.1s' }}>
          <span className="chat-credito-cost-icon">📅</span>
          <span className="chat-credito-cost-label">Plazo estimado</span>
          <span className="chat-credito-cost-val">{CREDITO_DAYS} días</span>
        </div>
        <div className="chat-credito-cost-row" style={{ animationDelay: '0.2s' }}>
          <span className="chat-credito-cost-icon">💰</span>
          <span className="chat-credito-cost-label">Costo total intereses</span>
          <span className="chat-credito-cost-val">{fmt(CREDITO_INTEREST)}</span>
        </div>

        {/* Timeline dots */}
        <div className="chat-credito-timeline">
          {Array.from({ length: CREDITO_DAYS }).map((_, i) => (
            <span key={i} className="chat-credito-dot"
              style={{ animationDelay: `${0.25 + i * 0.02}s` }} />
          ))}
          <span className="chat-credito-timeline-label">32 días · saldado</span>
        </div>
      </div>

      {/* Insight */}
      <div className={`chat-pay-insight${showInsight ? ' visible' : ''}`}>
        El costo son <strong>{fmt(CREDITO_INTEREST)}</strong>. Si usas este capital en inventario, el retorno estimado es <strong>33x</strong> — {fmt(CREDITO_RETURN)} en utilidad adicional.
      </div>

      {/* CTAs */}
      <div className="chat-credito-actions">
        <button className="chat-credito-cta-primary"
          onClick={() => onAction('activate_credit')}>
          Activar {fmt(CREDITO_AMOUNT)}
        </button>
        <button className="chat-credito-cta-ghost"
          onClick={() => onAction('simulate_credit')}>
          Simular pagos
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SEGUROS WOW CARD
═══════════════════════════════════════════════════ */
const SHIELD_R = 32;
const SHIELD_C = 2 * Math.PI * SHIELD_R; // 201.06

const COBERTURAS = [
  { label: 'RC Extracontractual',   prima: '$120k', active: true  },
  { label: 'Todo Riesgo Negocio',   prima: '$180k', active: true  },
  { label: 'Accidentes Laborales',  prima: '$95k',  active: true  },
  { label: 'Sustracción de Dinero', prima: '$65k',  active: false },
  { label: 'Incendio y Aliados',    prima: '$85k',  active: false },
];

function SegurosCard({ onAction, onNavigate }) {
  const [score,      setScore]      = useState(0);
  const [dashOffset, setDashOffset] = useState(SHIELD_C);
  const [showRows,   setShowRows]   = useState(false);
  const [showPrima,  setShowPrima]  = useState(false);

  useEffect(() => {
    const TARGET   = 60; // 3/5 = 60%
    const duration = 1200;
    const start    = performance.now();
    let raf;
    const tick = (now) => {
      const t     = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const s     = Math.round(TARGET * eased);
      setScore(s);
      setDashOffset(SHIELD_C * (1 - s / 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setShowRows(true),  120);
        setTimeout(() => setShowPrima(true), 900);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="chat-seguros-card">
      {/* Header: shield + title */}
      <div className="chat-seg-header">
        <div className="chat-seg-shield-wrap">
          <svg width={82} height={82} viewBox="0 0 82 82" style={{ display: 'block' }}>
            <circle cx={41} cy={41} r={SHIELD_R}
              fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={5} />
            <circle cx={41} cy={41} r={SHIELD_R}
              fill="none" stroke="#ee424e" strokeWidth={5}
              strokeLinecap="round"
              strokeDasharray={SHIELD_C}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 41 41)"
            />
          </svg>
          <div className="chat-seg-score-overlay">
            <span className="chat-seg-pct">{score}%</span>
            <span className="chat-seg-sub-lbl">protegido</span>
          </div>
        </div>
        <div className="chat-seg-title-col">
          <div className="chat-seg-title">Cobertura actual</div>
          <div className="chat-seg-meta">3 de 5 riesgos cubiertos</div>
          <div className="chat-seg-alert-pill">⚠ 2 brechas críticas</div>
        </div>
      </div>

      {/* Coverage rows */}
      <div className={`chat-seg-rows${showRows ? ' visible' : ''}`}>
        {COBERTURAS.map((c, i) => (
          <div key={c.label}
            className={`chat-seg-row${c.active ? '' : ' gap'}`}
            style={{ animationDelay: `${i * 0.08}s` }}>
            <span className="chat-seg-icon">{c.active ? '✓' : '!'}</span>
            <span className="chat-seg-name">{c.label}</span>
            <span className="chat-seg-prima">{c.prima}/mes</span>
          </div>
        ))}
      </div>

      {/* Prima total */}
      <div className={`chat-seg-prima-row${showPrima ? ' visible' : ''}`}>
        Prima total <strong>$395k/mes</strong> · $0 siniestros en 2030
      </div>

      {/* CTAs */}
      <div className="chat-seg-actions">
        <button className="chat-credito-cta-primary"
          onClick={() => onAction('add_device_coverage')}>
          Cubrir brechas
        </button>
        <button className="chat-credito-cta-ghost"
          onClick={() => onNavigate('reports', { section: 'seguros' })}>
          Ver pólizas
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   INVERSIONES WOW CARD
═══════════════════════════════════════════════════ */
const INV_BOLSILLOS = 4_200_000;
const INV_CDT       = 10_000_000;
const INV_TOTAL     = INV_BOLSILLOS + INV_CDT;

function InversionesCard({ onAction }) {
  const [count,       setCount]       = useState(0);
  const [showItems,   setShowItems]   = useState(false);
  const [showInsight, setShowInsight] = useState(false);

  useEffect(() => {
    const duration = 1100;
    const start    = performance.now();
    let raf;
    const tick = (now) => {
      const t     = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(INV_TOTAL * eased));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setShowItems(true),   150);
        setTimeout(() => setShowInsight(true), 900);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const fmtLive = (v) => {
    if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000)     return `$${Math.round(v / 1_000)}k`;
    return `$${v}`;
  };
  const fmt = (v) => {
    if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
    return `$${(v / 1_000).toFixed(0)}k`;
  };

  return (
    <div className="chat-inv-card">
      {/* Label */}
      <div className="chat-pay-label">Inversiones activas</div>

      {/* Animated total */}
      <div className="chat-pay-amount">{fmtLive(count)}</div>
      <div className="chat-pay-growth">en 2 productos · rendimiento automático</div>

      {/* Product rows */}
      <div className={`chat-inv-products${showItems ? ' visible' : ''}`}>
        {/* Bolsillos */}
        <div className="chat-inv-product">
          <span className="chat-inv-product-icon">🪣</span>
          <div className="chat-inv-product-info">
            <div className="chat-inv-product-name">Bolsillos Bold</div>
            <div className="chat-inv-product-meta">3 activos · {fmt(INV_BOLSILLOS)}</div>
          </div>
          <div className="chat-inv-rate">4.2%<span className="chat-inv-rate-ea"> EA</span></div>
        </div>

        <div className="chat-inv-divider" />

        {/* CDT */}
        <div className="chat-inv-product" style={{ animationDelay: '0.1s' }}>
          <span className="chat-inv-product-icon">📈</span>
          <div className="chat-inv-product-info">
            <div className="chat-inv-product-name">CDT Bold</div>
            <div className="chat-inv-product-meta">Vence en 45 días · {fmt(INV_CDT)}</div>
          </div>
          <div className="chat-inv-rate">8.5%<span className="chat-inv-rate-ea"> EA</span></div>
        </div>
      </div>

      {/* Insight */}
      <div className={`chat-pay-insight${showInsight ? ' visible' : ''}`}>
        Rendimiento estimado este mes: <strong>+$89k</strong>. Tu dinero está trabajando sin que hagas nada.
      </div>

      {/* CTAs */}
      <div className="chat-credito-actions">
        <button className="chat-credito-cta-primary"
          onClick={() => onAction('open_cdt')}>
          Abrir CDT
        </button>
        <button className="chat-credito-cta-ghost"
          onClick={() => onAction('view_bolsillos')}>
          Ver bolsillos
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────── */

/* ── Message type → badge label ── */
const TYPE_LABEL = {
  text:          null,
  action_done:   { label: 'Ejecutado',   color: 'green'  },
  opportunity:   { label: 'Oportunidad', color: 'blue'   },
  payments_card: { label: 'Pagos',       color: 'blue'   },
  banca_card:    { label: 'Cuenta Bold', color: 'blue'   },
  credito_card:  { label: 'Crédito',     color: 'blue'   },
  seguros_card:  { label: 'Seguros',     color: 'blue'   },
  inversiones_card: { label: 'Inversiones', color: 'blue' },
};

function ChatMessage({ msg, onAction, doneActions, onNavigate }) {
  const isUser = msg.from === 'user';

  if (isUser) {
    return (
      <div className="chat-row user">
        <div className="chat-cmd-wrap">
          <div className="chat-cmd">{msg.text}</div>
          {msg.time && <div className="chat-time user">{msg.time}</div>}
        </div>
      </div>
    );
  }

  const badge = TYPE_LABEL[msg.type];

  return (
    <div className="os-msg">
      <div className="os-msg-header">
        <span className="os-msg-source">
          <IconSparkle width={9} height={9} />
          Bold OS
        </span>
        {badge && (
          <span className={`os-msg-badge ${badge.color}`}>{badge.label}</span>
        )}
        {msg.time && <span className="os-msg-time">{msg.time}</span>}
      </div>
      <div className="os-msg-body">
        {msg.text && <div className="os-msg-text">{msg.text}</div>}

        {/* Payments wow card */}
        {msg.type === 'payments_card' && (
          <PaymentsCard onAction={onAction} />
        )}

        {/* Banca wow card */}
        {msg.type === 'banca_card' && (
          <BancaCard onNavigate={onNavigate} />
        )}

        {/* Crédito wow card */}
        {msg.type === 'credito_card' && (
          <CreditoCard onAction={onAction} onNavigate={onNavigate} />
        )}

        {/* Seguros wow card */}
        {msg.type === 'seguros_card' && (
          <SegurosCard onAction={onAction} onNavigate={onNavigate} />
        )}

        {/* Inversiones wow card */}
        {msg.type === 'inversiones_card' && (
          <InversionesCard onAction={onAction} />
        )}

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

      </div>
    </div>
  );
}
