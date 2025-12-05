import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import SellerDashboard from './pages/SellerDashboard.jsx';
import SellerItems from './pages/SellerItems.jsx';
import SellerAnalytics from './pages/SellerAnalytics.jsx';

const App = () => (
  <div className="min-h-screen bg-slate-100 text-slate-900">
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/seller/dashboard" element={<SellerDashboard />} />
      <Route path="/seller/items" element={<SellerItems />} />
      <Route path="/seller/analytics" element={<SellerAnalytics />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </div>
);

export default App;
