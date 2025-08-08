import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import ProductsPage from './pages/ProductsPage';
import AboutPage from './pages/AboutPage';
import AdminDashboard from './pages/AdminDashboard';
import CartPage from './pages/CartPage';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav style={{ display: 'flex', gap: 12, padding: 12, borderBottom: '1px solid #eee' }}>
        <Link to="/">Chess Sets</Link>
        <Link to="/about">About</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/admin">Admin</Link>
      </nav>
      <main>{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<ProductsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
