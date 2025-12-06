import { Link, NavLink } from 'react-router-dom';

const linkClasses = ({ isActive }) => (
  `text-sm font-medium transition-colors ${isActive ? 'text-white' : 'text-slate-200 hover:text-white'}`
);

const Navbar = () => (
  <header className="bg-slate-900 text-white shadow-sm">
    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
      <Link to="/" className="text-lg font-semibold tracking-wide">
        SmartCart
      </Link>
      <nav className="flex items-center gap-4">
        <NavLink to="/" className={linkClasses}>
          Home
        </NavLink>
        <NavLink to="/cart" className={linkClasses}>
          Cart
        </NavLink>
        <NavLink to="/checkout" className={linkClasses}>
          Checkout
        </NavLink>
        <NavLink to="/orders" className={linkClasses}>
          Orders
        </NavLink>
        <NavLink to="/seller/dashboard" className={linkClasses}>
          Seller
        </NavLink>
        <NavLink to="/seller/items" className={linkClasses}>
          Inventory
        </NavLink>
      </nav>
    </div>
  </header>
);

export default Navbar;
