import { useState } from 'react';
import { useStore } from '../store';

const CATEGORIES = ['Platos fuertes', 'Sopas', 'Entradas', 'Bebidas'];
const TABS = ['Todos', 'Favoritos', ...CATEGORIES];

const PRODUCTS_INIT = [
  { id: 'p1',  name: 'Bandeja paisa',       price: 28000,  category: 'Platos fuertes', sales: 142, active: true,  fav: true,  emoji: '🍽️', bg: '#1a1a2e' },
  { id: 'p2',  name: 'Ajiaco bogotano',     price: 24000,  category: 'Sopas',          sales: 98,  active: true,  fav: false, emoji: '🥘', bg: '#1e3220' },
  { id: 'p3',  name: 'Limonada de coco',    price: 8000,   category: 'Bebidas',        sales: 87,  active: true,  fav: true,  emoji: '🥥', bg: '#1a3040' },
  { id: 'p4',  name: 'Empanadas x3',        price: 12000,  category: 'Entradas',       sales: 74,  active: true,  fav: false, emoji: '🫔', bg: '#2e1e0a' },
  { id: 'p5',  name: 'Arroz con pollo',     price: 22000,  category: 'Platos fuertes', sales: 68,  active: true,  fav: false, emoji: '🍗', bg: '#1e1030' },
  { id: 'p6',  name: 'Sancocho de gallina', price: 26000,  category: 'Sopas',          sales: 41,  active: true,  fav: false, emoji: '🍲', bg: '#0e2030' },
  { id: 'p7',  name: 'Patacones con hogao', price: 9000,   category: 'Entradas',       sales: 38,  active: true,  fav: false, emoji: '🍌', bg: '#1e2a10' },
  { id: 'p8',  name: 'Jugo natural',        price: 6000,   category: 'Bebidas',        sales: 29,  active: true,  fav: false, emoji: '🍊', bg: '#2e1010' },
  { id: 'p9',  name: 'Cazuela de mariscos', price: 35000,  category: 'Platos fuertes', sales: 0,   active: true,  fav: false, emoji: '🦐', bg: '#0e2828' },
  { id: 'p10', name: 'Lulada',              price: 7000,   category: 'Bebidas',        sales: 0,   active: true,  fav: false, emoji: '🍹', bg: '#2a1020' },
  { id: 'p11', name: 'Agua con gas',        price: 3500,   category: 'Bebidas',        sales: 0,   active: false, fav: false, emoji: '💧', bg: '#101828' },
];

const fmt = (v) => `$${v.toLocaleString('es-CO')}`;

export default function Catalog({ onBack }) {
  const { pushToast, openModal } = useStore();
  const [products, setProducts] = useState(PRODUCTS_INIT);
  const [tab, setTab]           = useState('Todos');
  const [search, setSearch]     = useState('');

  const toggleFav = (id, e) => {
    e.stopPropagation();
    setProducts((ps) => ps.map((p) => p.id === id ? { ...p, fav: !p.fav } : p));
  };

  const addProduct = () =>
    openModal({
      title: 'Nuevo producto',
      body: 'Agrega nombre, precio y categoría para publicar el producto en tu catálogo.',
      confirmLabel: 'Crear producto',
      async: true,
      onConfirm: () =>
        pushToast({ level: 'success', title: 'Producto creado', body: 'Ya aparece en tu catálogo.' }),
    });

  const editProduct = (p) =>
    openModal({
      title: p.name,
      body: 'Edita el precio o la categoría de este producto.',
      details: [
        { label: 'Categoría',  value: p.category },
        { label: 'Precio',     value: fmt(p.price) },
        { label: 'Ventas mes', value: `${p.sales} unidades` },
      ],
      confirmLabel: 'Guardar cambios',
      async: true,
      onConfirm: () =>
        pushToast({ level: 'success', title: 'Producto actualizado', body: p.name }),
    });

  const filtered = products.filter((p) => {
    if (tab === 'Favoritos') return p.fav && p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat    = tab === 'Todos' || p.category === tab;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      {/* ── Header ── */}
      <div className="cat-header">
        <button className="cat-back" onClick={onBack} aria-label="Volver">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="cat-header-title">Catálogo</div>
        <div style={{ width: 34 }} />
      </div>

      {/* ── Search ── */}
      <div className="cat-search-wrap">
        <svg className="cat-search-icon" viewBox="0 0 24 24" width="15" height="15"
          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          className="cat-search"
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ── Tabs ── */}
      <div className="cat-tabs">
        {TABS.map((t) => (
          <button
            key={t}
            className={`cat-tab${tab === t ? ' active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
        <button className="cat-tab-add" onClick={addProduct}>+</button>
      </div>

      {/* ── Product cards ── */}
      <div className="cat-list" style={{ paddingBottom: 120 }}>
        {filtered.length === 0 && (
          <div className="cat-empty">Sin resultados</div>
        )}
        {filtered.map((p) => (
          <div
            key={p.id}
            className={`cat-card${!p.active ? ' inactive' : ''}`}
            onClick={() => editProduct(p)}
          >
            {/* Square image with emoji */}
            <div className="cat-card-img" style={{ background: p.bg }}>
              <span className="cat-card-emoji">{p.emoji}</span>
              <button
                className={`cat-card-heart${p.fav ? ' active' : ''}`}
                onClick={(e) => toggleFav(p.id, e)}
                aria-label="Favorito"
              >
                {p.fav ? '❤️' : '🤍'}
              </button>
            </div>

            {/* Info */}
            <div className="cat-card-info">
              <div className="cat-card-name">{p.name}</div>
              <div className="cat-card-price">{fmt(p.price)}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
