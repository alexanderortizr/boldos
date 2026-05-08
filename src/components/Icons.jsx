// Inline SVG icons
const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };

export const IconHome = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M3 12l9-9 9 9" /><path d="M5 10v10h14V10" />
  </svg>
);
export const IconBolt = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);
export const IconList = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
    <circle cx="4" cy="6" r="1" /><circle cx="4" cy="12" r="1" /><circle cx="4" cy="18" r="1" />
  </svg>
);
export const IconSettings = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33h0a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51h0a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v0a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);
export const IconChevron = (p) => (
  <svg width="18" height="18" viewBox="0 0 24 24" {...base} {...p}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
export const IconArrowLeft = (p) => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...base} {...p}>
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);
export const IconBell = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
  </svg>
);
export const IconCheck = (p) => (
  <svg width="14" height="14" viewBox="0 0 24 24" {...base} strokeWidth="3" {...p}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
export const IconClose = (p) => (
  <svg width="18" height="18" viewBox="0 0 24 24" {...base} {...p}>
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
export const IconSearch = (p) => (
  <svg width="16" height="16" viewBox="0 0 24 24" {...base} {...p}>
    <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
export const IconUndo = (p) => (
  <svg width="14" height="14" viewBox="0 0 24 24" {...base} {...p}>
    <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
  </svg>
);
export const IconShare = (p) => (
  <svg width="16" height="16" viewBox="0 0 24 24" {...base} {...p}>
    <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);
export const IconCard = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);
export const IconQr = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    <rect x="5" y="5" width="3" height="3" fill="currentColor" stroke="none" />
    <rect x="16" y="5" width="3" height="3" fill="currentColor" stroke="none" />
    <rect x="5" y="16" width="3" height="3" fill="currentColor" stroke="none" />
    <line x1="14" y1="14" x2="17" y2="14" /><line x1="17" y1="14" x2="17" y2="17" /><line x1="17" y1="17" x2="14" y2="17" /><line x1="14" y1="17" x2="14" y2="21" /><line x1="14" y1="21" x2="21" y2="21" /><line x1="21" y1="21" x2="21" y2="17" /><line x1="21" y1="17" x2="19" y2="17" />
  </svg>
);
export const IconLink = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
  </svg>
);
export const IconTerminal = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <rect x="2" y="3" width="20" height="18" rx="2" />
    <polyline points="8 10 5 13 8 16" />
    <line x1="12" y1="16" x2="19" y2="16" />
  </svg>
);
export const IconTrendUp = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);
export const IconWallet = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M20 12V22H4a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v2" />
    <path d="M22 12v4h-4a2 2 0 010-4h4z" />
  </svg>
);
export const IconReceipt = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="9" y1="13" x2="15" y2="13" /><line x1="9" y1="17" x2="13" y2="17" />
  </svg>
);
export const IconUsers = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);
export const IconPlay = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <circle cx="12" cy="12" r="10" />
    <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
  </svg>
);
export const IconPause = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <circle cx="12" cy="12" r="10" />
    <line x1="10" y1="9" x2="10" y2="15" /><line x1="14" y1="9" x2="14" y2="15" />
  </svg>
);
export const IconBellOff = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M13.73 21a2 2 0 01-3.46 0" />
    <path d="M18.63 13A17.9 17.9 0 0118 8" />
    <path d="M6.26 6.26A5.86 5.86 0 006 8c0 7-3 9-3 9h14" />
    <path d="M18 8a6 6 0 00-9.33-5" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);
export const IconMoon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
);
export const IconDownload = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
    <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);
export const IconTrash = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
  </svg>
);
export const IconBarChart = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
  </svg>
);
export const IconAlertCircle = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
export const IconOpportunity = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);
export const IconMic = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <rect x="9" y="2" width="6" height="12" rx="3" />
    <path d="M5 10a7 7 0 0014 0" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);
export const IconSend = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);
export const IconSparkle = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M12 2l2.4 7.6H22l-6.4 4.6 2.4 7.6L12 17.2l-6 4.6 2.4-7.6L2 9.6h7.6z" />
  </svg>
);
export const IconChat = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);
export const IconTrendDown = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    <polyline points="17 18 23 18 23 12" />
  </svg>
);
export const IconCalendar = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
export const IconZap = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
export const IconStore = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M3 9l1-5h16l1 5" />
    <path d="M3 9a1 1 0 001 1h1a2 2 0 004 0h2a2 2 0 004 0h1a1 1 0 001-1" />
    <path d="M5 10v10h14V10" />
    <line x1="9" y1="15" x2="9" y2="20" />
    <line x1="15" y1="15" x2="15" y2="20" />
  </svg>
);
export const IconArrowDown = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <polyline points="19 12 12 19 5 12" />
  </svg>
);
export const IconArrowUp = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </svg>
);
export const IconBuilding = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18M9 21V9" />
  </svg>
);
export const IconCreditCard = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <rect x="1" y="4" width="22" height="16" rx="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
    <line x1="6" y1="15" x2="10" y2="15" />
  </svg>
);
