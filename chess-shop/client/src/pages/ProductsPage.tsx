import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useCart } from '../store/useCart';

type Product = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  sizeInches: number;
  isMagnetic: boolean;
  isRound: boolean;
  isFolding: boolean;
  images: { id: string; url: string }[];
  category: { id: string; name: string };
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ q: '', category: '', magnetic: '', round: '', folding: '', minSize: '', maxSize: '' });
  const add = useCart((s) => s.addItem);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams(Object.entries(filters).filter(([, v]) => v !== '' && v != null) as any);
    setLoading(true);
    api.get<Product[]>(`/products?${params.toString()}`, { signal: controller.signal })
      .then((r) => setProducts(r.data))
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [filters]);

  return (
    <div style={{ padding: 24 }}>
      <h2>Chess Sets</h2>
      <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', marginBottom: 16 }}>
        <input placeholder="Search" value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} />
        <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
          <option value="">All Categories</option>
          <option value="Classic">Classic</option>
          <option value="Magnetic">Magnetic</option>
        </select>
        <select value={filters.magnetic} onChange={(e) => setFilters({ ...filters, magnetic: e.target.value })}>
          <option value="">Magnetic?</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
        <select value={filters.round} onChange={(e) => setFilters({ ...filters, round: e.target.value })}>
          <option value="">Round?</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
        <select value={filters.folding} onChange={(e) => setFilters({ ...filters, folding: e.target.value })}>
          <option value="">Folding?</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
        <input placeholder="Min size" value={filters.minSize} onChange={(e) => setFilters({ ...filters, minSize: e.target.value })} />
        <input placeholder="Max size" value={filters.maxSize} onChange={(e) => setFilters({ ...filters, maxSize: e.target.value })} />
      </div>

      {loading ? <p>Loading...</p> : (
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
          {products.map((p) => (
            <div key={p.id} style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
              <img src={p.images[0]?.url || 'https://via.placeholder.com/300x200?text=Chess+Set'} alt={p.name} style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 6 }} />
              <h3 style={{ margin: '8px 0' }}>{p.name}</h3>
              <p style={{ color: '#666', minHeight: 40 }}>{p.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>${(p.priceCents / 100).toFixed(2)}</strong>
                <button onClick={() => add({ id: p.id, name: p.name, priceCents: p.priceCents, imageUrl: p.images[0]?.url })}>Add to cart</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}