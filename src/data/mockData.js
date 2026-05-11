// Mock data base - Persona: Claudia (restaurante, PRD sec 6.1)

export const merchant = {
  name: 'Claudia Restrepo',
  firstName: 'Claudia',
  business: 'La Cocina de Claudia',
  industry: 'Restaurante',
  monthlyRevenue: 180000000,
  employees: 18,
  avatar: 'C',
};

export const initialAgents = {
  liquidez: {
    id: 'liquidez',
    icon: '💰',
    name: 'Capital Disponible',
    short: 'Liquidez',
    primary: '$8.5M',
    secondary: 'pre-aprobados por Bold',
    status: 'good',
    enabled: true,
    autonomy: 'semi', // manual | semi | full
    threshold: 500000,
    description: 'Predice necesidades de capital con 7-30 días de anticipación y pre-aprueba crédito cuando detecta oportunidades.',
    metrics: {
      preApproved: 8500000,
      rate: '3%',
      accuracy: 87,
      predictions: 12,
    },
    breakdown: [
      { label: 'Cupo total pre-aprobado', value: '$8,500,000' },
      { label: 'Tasa mensual', value: '3%' },
      { label: 'Accuracy últimos 90 días', value: '87%' },
      { label: 'Predicciones generadas', value: '12' },
    ],
  },
  impuestos: {
    id: 'impuestos',
    icon: '📊',
    name: 'Impuestos',
    short: 'IVA',
    primary: '$2.3M',
    secondary: 'provisionados · vence en 8 días',
    status: 'attention',
    enabled: true,
    autonomy: 'full',
    threshold: 100000,
    description: 'Calcula IVA, Retefte e ICA en tiempo real, provisiona automáticamente y genera reportes pre-llenados para la DIAN.',
    metrics: {
      provisioned: 2300000,
      required: 2350000,
      dueInDays: 8,
    },
    breakdown: [
      { label: 'IVA provisionado', value: '$2,300,000' },
      { label: 'IVA requerido (estimado)', value: '$2,350,000' },
      { label: 'Déficit', value: '$50,000', danger: true },
      { label: 'Vence', value: 'En 8 días · 15 mayo' },
      { label: 'ICA acumulado', value: '$420,000' },
    ],
  },
  nomina: {
    id: 'nomina',
    icon: '👥',
    name: 'Nómina',
    short: 'Nómina',
    primary: '$42M',
    secondary: 'provisionados · pago 30 de mayo',
    status: 'good',
    enabled: true,
    autonomy: 'semi',
    threshold: 0,
    description: 'Detecta fechas de pago del histórico, provisiona nómina + parafiscales y ejecuta pagos con tu aprobación.',
    metrics: {
      amount: 42000000,
      parafiscales: 10500000,
      employees: 18,
    },
    breakdown: [
      { label: 'Nómina neta', value: '$42,000,000' },
      { label: 'Parafiscales (salud, pensión, ARL, CCF)', value: '$10,500,000' },
      { label: 'Total a pagar', value: '$52,500,000' },
      { label: 'Empleados', value: '18' },
      { label: 'Fecha de pago', value: '30 mayo · 08:00' },
    ],
  },
};

export const initialOpportunities = [
  {
    id: 'op-001',
    type: 'supplier_discount',
    title: 'Oportunidad detectada',
    urgency: 'Válido solo hoy',
    icon: '💡',
    supplier: 'Agroavícola XYZ',
    summary: 'Tu proveedor de pollo bajó precio 18% (solo hoy).',
    shortSub: 'Ahorra $166k hoy con descuento de proveedor',
    metrics: {
      saving: 184000,
      financingCost: 18000,
      netSaving: 166000,
      amount: 816000,
      repayment: '8% de ventas/día',
      term: '~12 días',
      roi: '9.2X',
    },
    reasons: [
      'Compras pollo cada 3 días, promedio 80kg',
      'Históricamente vendes este volumen en 8 días',
      'Pre-aprobación automática de Bold',
    ],
    confidence: 0.89,
    status: 'pending', // pending | accepted | ignored
  },
];

export const initialLog = [
  {
    id: 'a1',
    agent: 'impuestos',
    title: 'Provisioné $850k para IVA',
    when: 'Ayer, 8:00 AM',
    group: 'Esta semana',
    reversible: true,
    outcome: 'success',
    createdAt: Date.now() - 20 * 60 * 60 * 1000,
  },
  {
    id: 'a2',
    agent: 'liquidez',
    title: 'Pre-aprobé crédito de $8.5M',
    when: 'Hace 3 días',
    group: 'Esta semana',
    reversible: false,
    outcome: 'success',
  },
  {
    id: 'a3',
    agent: 'liquidez',
    title: 'Envié recordatorio de cobro a "Taller El Roble"',
    when: 'Hace 5 días',
    group: 'Esta semana',
    reversible: false,
    outcome: 'success',
  },
  {
    id: 'a4',
    agent: 'nomina',
    title: 'Pagué nómina ($42M) + parafiscales ($10.5M)',
    when: '18 de mayo',
    group: 'Semana pasada',
    reversible: false,
    outcome: 'success',
  },
  {
    id: 'a5',
    agent: 'impuestos',
    title: 'Generé reporte de IVA para DIAN (mar–abr)',
    when: '15 de mayo',
    group: 'Semana pasada',
    reversible: false,
    outcome: 'success',
  },
];

export const initialNotifications = [
  {
    id: 'n1',
    level: 'important',
    agent: 'liquidez',
    title: 'Oportunidad detectada',
    body: 'Tu proveedor de pollo bajó precio 18%. Ahorra $166k neto.',
    when: 'hace 15 min',
    read: false,
    action: { type: 'open_opportunity', id: 'op-001' },
  },
  {
    id: 'n2',
    level: 'important',
    agent: 'impuestos',
    title: 'IVA vence en 8 días',
    body: 'Tienes $2.3M provisionados. Te faltan $50k para cubrir.',
    when: 'hace 2 h',
    read: false,
    action: { type: 'open_agent', id: 'impuestos' },
  },
  {
    id: 'n3',
    level: 'info',
    agent: 'nomina',
    title: 'Nómina lista para aprobar',
    body: '$42M provisionados para 18 empleados. Se ejecuta el 30 de mayo.',
    when: 'ayer',
    read: true,
    action: { type: 'open_agent', id: 'nomina' },
  },
];

// Bold Banking mock data
export const bankingData = {
  // Cuenta Bold
  balance: 12_840_000,
  accountSuffix: '4821',

  // Pending settlement (today's collections, not yet landed)
  pendingSettlement: 4_820_000,
  nextSettlement: {
    amount: 4_675_400,   // 97% — after Bold fee
    fee: 144_600,
    date: 'Mañana, 8:00 AM',
  },

  // Crédito Bold
  capital: {
    available: 8_500_000,
    rate: '3% mensual',
    noFixedFee: true,
    active: null,        // no active loan right now
  },

  // Account movements (settlements in + transfers out + payroll out)
  movements: [
    { id: 'mv1', type: 'settlement', label: 'Desembolso Bold', amount:  4_560_000, date: 'Ayer',       direction: 'in'  },
    { id: 'mv2', type: 'transfer',   label: 'A Bancolombia ···· 9312',  amount: -2_000_000, date: 'Ayer', direction: 'out' },
    { id: 'mv3', type: 'settlement', label: 'Desembolso Bold', amount:  3_890_000, date: 'Lun 21 abr', direction: 'in'  },
    { id: 'mv4', type: 'payroll',    label: 'Nómina + parafiscales',    amount: -52_500_000, date: '18 abr', direction: 'out' },
    { id: 'mv5', type: 'settlement', label: 'Desembolso Bold', amount:  5_120_000, date: '17 abr',     direction: 'in'  },
    { id: 'mv6', type: 'transfer',   label: 'A Davivienda ···· 4401',   amount: -1_500_000, date: '15 abr', direction: 'out' },
  ],
};

// Bold Payments mock data
export const paymentsData = {
  todayRevenue: 4_820_000,
  todayTransactions: 47,
  weekRevenue: 28_540_000,
  monthRevenue: 182_340_000,
  monthGrowth: 12.4,
  avgTicket: 102_500,
  // Breakdown by method
  methods: [
    { id: 'card', label: 'Datáfono', icon: '💳', amount: 2_690_000, count: 26, pct: 55.8 },
    { id: 'qr', label: 'QR Bold', icon: '📱', amount: 1_340_000, count: 14, pct: 27.8 },
    { id: 'link', label: 'Link de cobro', icon: '🔗', amount: 790_000, count: 7, pct: 16.4 },
  ],
  // Device statuses
  devices: [
    { id: 'd1', serial: 'BOL-4821', name: 'Caja principal', battery: 82, status: 'online', signalOk: true },
    { id: 'd2', serial: 'BOL-4822', name: 'Barra de bebidas', battery: 31, status: 'online', signalOk: true },
    { id: 'd3', serial: 'BOL-4823', name: 'Terraza', battery: 100, status: 'offline', signalOk: false },
  ],
  // Recent transactions
  transactions: [
    { id: 't1', method: 'card', amount: 247_000, label: 'Visa •••• 4821', when: 'hace 3 min', status: 'ok' },
    { id: 't2', method: 'qr', amount: 98_000, label: 'QR escaneado', when: 'hace 11 min', status: 'ok' },
    { id: 't3', method: 'link', amount: 450_000, label: 'Link #L-0041', when: 'hace 24 min', status: 'ok' },
    { id: 't4', method: 'card', amount: 183_000, label: 'Mastercard •••• 9132', when: 'hace 38 min', status: 'ok' },
    { id: 't5', method: 'qr', amount: 64_000, label: 'QR escaneado', when: 'hace 52 min', status: 'ok' },
    { id: 't6', method: 'card', amount: 312_000, label: 'Visa •••• 7703', when: 'hace 1 h', status: 'ok' },
    { id: 't7', method: 'link', amount: 120_000, label: 'Link #L-0040', when: 'hace 1.5 h', status: 'declined' },
    { id: 't8', method: 'card', amount: 89_000, label: 'Amex •••• 3344', when: 'hace 2 h', status: 'ok' },
    { id: 't9', method: 'qr', amount: 215_000, label: 'QR escaneado', when: 'hace 2.5 h', status: 'ok' },
    { id: 't10', method: 'card', amount: 540_000, label: 'Visa •••• 1192', when: 'hace 3 h', status: 'ok' },
  ],
};

export const formatCOP = (value) => {
  if (value == null) return '—';
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}k`;
  return `$${value.toLocaleString('es-CO')}`;
};

export const formatCOPFull = (value) => {
  if (value == null) return '—';
  return `$${value.toLocaleString('es-CO')}`;
};
