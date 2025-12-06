import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ItemGrid from '../components/ItemGrid.jsx';
import { fetchItems, setSelectedItem } from '../slices/itemsSlice.js';
import { addItemToCart } from '../slices/cartSlice.js';
import Toast from '../components/Toast.jsx';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    items, status, page, pageSize, total, totalPages,
  } = useSelector((state) => state.items);
  const [currentPage, setCurrentPage] = useState(page || 1);
  const [toast, setToast] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
  });

  const pageLabel = useMemo(
    () => `${((currentPage - 1) * pageSize) + 1}-${Math.min(currentPage * pageSize, total)} of ${total || 0}`,
    [currentPage, pageSize, total],
  );

  useEffect(() => {
    dispatch(fetchItems({
      page: currentPage,
      pageSize,
      ...Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== '' && v !== null && v !== undefined),
      ),
    }));
    const intervalId = setInterval(() => dispatch(fetchItems({
      page: currentPage,
      pageSize,
      ...Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== '' && v !== null && v !== undefined),
      ),
    })), 30000);
    return () => clearInterval(intervalId);
  }, [dispatch, currentPage, pageSize, filters]);

  const handleAddToCart = (item) => {
    dispatch(addItemToCart({ itemId: item.id, quantity: 1 }))
      .unwrap()
      .then(() => setToast({ type: 'success', message: 'Added to cart' }))
      .catch(() => setToast({ type: 'error', message: 'Could not add to cart' }));
  };

  const handleSelect = (item) => {
    dispatch(setSelectedItem(item));
    navigate(`/products/${item.id}`);
  };

  const canPrev = currentPage > 1;
  const canNext = totalPages ? currentPage < totalPages : true;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <section className="mb-6 flex flex-col gap-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Live marketplace</h1>
            <p className="mt-1 text-slate-500">
              Prices update automatically as the SmartCart engine reacts to demand.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="font-medium">Showing</span>
            <span className="rounded-md bg-white px-2 py-1 shadow-sm">{pageLabel}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-600">Search</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => { setCurrentPage(1); setFilters((f) => ({ ...f, search: e.target.value })); }}
                placeholder="Name or description"
                className="rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-600">Price min (₹)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={filters.minPrice}
                onChange={(e) => { setCurrentPage(1); setFilters((f) => ({ ...f, minPrice: e.target.value })); }}
                placeholder="0"
                className="rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-600">Price max (₹)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={filters.maxPrice}
                onChange={(e) => { setCurrentPage(1); setFilters((f) => ({ ...f, maxPrice: e.target.value })); }}
                placeholder="1000"
                className="rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
              />
            </div>
          </div>
          <div className="mt-3 flex gap-2 text-sm">
            <button
              type="button"
              onClick={() => setFilters({
                search: '',
                minPrice: '',
                maxPrice: '',
              })}
              className="rounded-md border border-slate-200 px-3 py-2 font-medium text-slate-700 hover:bg-slate-50"
            >
              Clear filters
            </button>
          </div>
        </div>
      </section>

      <div className="mb-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => canPrev && setCurrentPage((p) => p - 1)}
          disabled={!canPrev}
          className="rounded-md border border-slate-200 px-3 py-1 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          ← Prev
        </button>
        <button
          type="button"
          onClick={() => canNext && setCurrentPage((p) => p + 1)}
          disabled={!canNext}
          className="rounded-md border border-slate-200 px-3 py-1 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next →
        </button>
        <span className="text-sm text-slate-500">
          Page {currentPage}{totalPages ? ` of ${totalPages}` : ''}
        </span>
      </div>

      {status === 'loading' && (
        <p className="mb-4 text-sm font-medium text-indigo-600">Refreshing catalog...</p>
      )}

      <ItemGrid items={items} onAddToCart={handleAddToCart} onSelect={handleSelect} />
      {toast && (
        <div className="fixed bottom-4 right-4 z-50">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        </div>
      )}
    </main>
  );
};

export default Home;
