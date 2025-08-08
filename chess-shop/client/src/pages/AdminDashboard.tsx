import { useEffect, useMemo, useState } from 'react';
import { api, setAuthToken } from '../lib/api';

type Category = { id: string; name: string };

type Product = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  stock: number;
  isMagnetic: boolean;
  isRound: boolean;
  isFolding: boolean;
  sizeInches: number;
  categoryId: string;
  images: { id: string; url: string }[];
};

export default function AdminDashboard() {
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('admin@kambohandicrafts.test');
  const [password, setPassword] = useState('admin123');
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [newCat, setNewCat] = useState('');
  const [form, setForm] = useState<Partial<Product>>({ name: '', description: '', priceCents: 0, stock: 0, sizeInches: 12, categoryId: '' });
  const authorized = useMemo(() => token.length > 10, [token]);

  useEffect(() => {
    setAuthToken(token || undefined);
    if (!authorized) return;
    api.get<Category[]>('/admin/categories').then((r) => setCategories(r.data));
    api.get<Product[]>('/admin/products').then((r) => setProducts(r.data));
  }, [token, authorized]);

  const saveProduct = async () => {
    if (!authorized) return;
    if (form.id) {
      const r = await api.put(`/admin/products/${form.id}`, { ...form, images: form.images?.map((i) => i.url) || [] });
      setProducts((prev) => prev.map((p) => (p.id === form.id ? r.data : p)));
    } else {
      const r = await api.post('/admin/products', { ...form, images: [] });
      setProducts((prev) => [r.data, ...prev]);
    }
    setForm({ name: '', description: '', priceCents: 0, stock: 0, sizeInches: 12, categoryId: '' });
  };

  const deleteProduct = async (id: string) => {
    await api.delete(`/admin/products/${id}`);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const createCategory = async () => {
    if (!newCat) return;
    const r = await api.post('/admin/categories', { name: newCat });
    setCategories((c) => [...c, r.data]);
    setNewCat('');
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Admin Dashboard</h2>
      <p>Login with seeded admin to get a token.</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={async () => {
          const r = await api.post('/auth/login', { email, password });
          setToken(r.data.token);
        }}>Login</button>
      </div>
      <p>Or paste an existing token below.</p>
      <input style={{ width: '100%' }} placeholder="Bearer token" value={token} onChange={(e) => setToken(e.target.value)} />

      {authorized && (
        <>
          <section style={{ marginTop: 16 }}>
            <h3>Categories</h3>
            <div style={{ display: 'flex', gap: 8 }}>
              <input placeholder="New category" value={newCat} onChange={(e) => setNewCat(e.target.value)} />
              <button onClick={createCategory}>Add</button>
            </div>
            <ul>
              {categories.map((c) => (
                <li key={c.id}>{c.name}</li>
              ))}
            </ul>
          </section>

          <section style={{ marginTop: 16 }}>
            <h3>{form.id ? 'Edit' : 'New'} Product</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8 }}>
              <input placeholder="Name" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input placeholder="Description" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <input placeholder="Price cents" type="number" value={form.priceCents || 0} onChange={(e) => setForm({ ...form, priceCents: Number(e.target.value) })} />
              <input placeholder="Stock" type="number" value={form.stock || 0} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
              <input placeholder="Size inches" type="number" value={form.sizeInches || 12} onChange={(e) => setForm({ ...form, sizeInches: Number(e.target.value) })} />
              <select value={form.categoryId || ''} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <label><input type="checkbox" checked={!!form.isMagnetic} onChange={(e) => setForm({ ...form, isMagnetic: e.target.checked })} /> Magnetic</label>
              <label><input type="checkbox" checked={!!form.isRound} onChange={(e) => setForm({ ...form, isRound: e.target.checked })} /> Round</label>
              <label><input type="checkbox" checked={!!form.isFolding} onChange={(e) => setForm({ ...form, isFolding: e.target.checked })} /> Folding</label>
              <button onClick={saveProduct}>{form.id ? 'Update' : 'Create'} Product</button>
            </div>
          </section>

          <section style={{ marginTop: 16 }}>
            <h3>Products</h3>
            <div style={{ display: 'grid', gap: 12 }}>
              {products.map((p) => (
                <div key={p.id} style={{ border: '1px solid #ddd', padding: 8, borderRadius: 6, display: 'grid', gap: 8, gridTemplateColumns: '1fr auto' }}>
                  <div>
                    <strong>{p.name}</strong> — ${(p.priceCents / 100).toFixed(2)} — Stock: {p.stock}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => setForm(p)}>Edit</button>
                    <button onClick={() => deleteProduct(p.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}