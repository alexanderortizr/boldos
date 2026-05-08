import { useState } from 'react';
import { useStore } from '../store';

const CATEGORIES = ['Todos', 'Platos fuertes', 'Sopas', 'Entradas', 'Bebidas'];

const PRODUCTS_INIT = [
  { id: 'p1', name: 'Bandeja paisa',       price: 28000,  category: 'Platos fuertes', sales: 142, active: true  },
  { id: 'p2', name: 'Ajiaco bogotano',     price: 24000,  category: 'Sopas',          sales: 98,  active: true  },
  { id: 'p3', name: 'Limonada de coco',    price: 8000,   category: 'Bebidas',        sales: 87,  active: true  },
  { id: 'p4', name: 'Empanadas x3',        price: 12000,  category: 'Entradas',       sales: 74,  active: true  },
  { id: 'p5', name: 'Arroz con pollo',     price: 22000,  category: 'Platos fuertes', sales: 68,  active: true  },
  { id: 'p6', name: 'Sancocho de gallina', price: 26000,  category: 'Sopas',          sales: 41,  active: true  },
  { id: 'p7', name: 'Patacones con hogao', price: 9000,   category: 'Entradas',       sales: 38,  active: true  },
  { id: 'p8', name: 'Jugo natural',        price: 6000,   category: 'Bebidas',        sales: 29,  active: true  },
  { id: 'p9', name: 'Cazuela de mariscos', price: 35000,  category: 'Platos fuertes', sales: 0,   active: true  },
  { id: 'p10', name: 'Lulada',             price: 7000,   category: 'Bebidas',        sales: 0,   active: true  },
  { id: 'p11', name: 'Agua con gas',       price: 3500,   category: 'Bebidas',        sales: 0,   active: false },
];

const formatPrice = (v) => `$${v.toLocaleString('es-CO')}`;

function ProductInitials({ name }) {
  const words = name.trim().split(' ');
  const initials = words.length >= 2
    ? words[0][0] + words[1][0]
    : words[0].slice(0, 2);
  return <span>{initials.toUpperCase()}</span>;
}

export default function Catalog({ onBack }) {
  const { pushToast, openModal } = useStore();
  const [products, setProducts] = useState(PRODUCTS_INIT);
  const [category, setCategory] = useState('Todos');
  const [search, setSearch] = useState('');

  const toggle = (id) =>
    setProducts((ps) =>
      ps.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );

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
        { label: 'Categoría', value: p.category },
        { label: 'Precio',    value: formatPrice(p.price) },
        { label: 'Ventas mes', value: `${p.sales} unidades` },
      ],
      confirmLabel: 'Guardar cambios',
      async: true,
      onConfirm: () =>
        pushToast({ level: 'success', title: 'Producto actualizado', body: p.name }),
    });

  const filtered = products.filter((p) => {
    const matchCat = category === 'Todos' || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const inactive = products.filter((p) => p.active && p.sales === 0).length;

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
        <button className="cat-add-btn" onClick={addProduct}>+ Agregar</button>
      </div>

      {/* ── Stats strip ── */}
      <div className="cat-stats">
        <span className="cat-stat-main">{products.filter(p => p.active).length} productos activos</span>
        {inactive > 0 && (
          <span className="cat-stat-warn">· {inactive} sin ventas</span>
        )}
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

      {/* ── Category filter ── */}
      <div className="cat-filters">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`cat-filter-chip ${category === c ? 'active' : ''}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {/* ── Product list ── */}
      <div className="cat-list" style={{ paddingBottom: 120 }}>
        {filtered.length === 0 && (
          <div className="cat-empty">Sin resultados para "{search}"</div>
        )}
        {filtered.map((p) => (
          <div key={p.id} className={`cat-item ${!p.active ? 'inactive' : ''}`}>
            <div className="cat-item-avatar">
              <ProductInitials name={p.name} />
            </div>
            <button className="cat-item-body" onClick={() => editProduct(p)}>
              <div className="cat-item-name">{p.name}</div>
              <div className="cat-item-meta">
                <span className="cat-item-category">{p.category}</span>
                {p.sales > 0
                  ? <span className="cat-item-sales">{p.sales} ventas este mes</span>
                  : <span className="cat-item-no-sales">Sin ventas en 30 días</span>}
              </div>
            </button>
            <div className="cat-item-right">
              <div className="cat-item-price">{formatPrice(p.price)}</div>
              <button
                className={`cat-toggle ${p.active ? 'on' : 'off'}`}
                onClick={() => toggle(p.id)}
                aria-label={p.active ? 'Desactivar' : 'Activar'}
              >
                <span className="cat-toggle-thumb" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
