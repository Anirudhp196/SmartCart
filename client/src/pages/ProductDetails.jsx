import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import PriceHistoryCard from '../components/PriceHistoryCard.jsx';
import { fetchPricingHistory, fetchPricingInsight } from '../slices/pricingSlice.js';
import { addItemToCart } from '../slices/cartSlice.js';
import { fetchItems } from '../slices/itemsSlice.js';
import Toast from '../components/Toast.jsx';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.items);
  const history = useSelector((state) => state.pricing.historyByItem[id] || []);
  const insight = useSelector((state) => state.pricing.insightsByItem[id]);
  const [toast, setToast] = useState(null);

  const item = useMemo(() => items.find((entry) => entry.id === id), [items, id]);

  useEffect(() => {
    if (!item) {
      dispatch(fetchItems());
    }
  }, [dispatch, item]);

  useEffect(() => {
    if (id) {
      dispatch(fetchPricingHistory(id));
      dispatch(fetchPricingInsight(id));
    }
  }, [dispatch, id]);

  if (!item) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10">
        <p className="text-slate-500">Loading product details...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <section className="flex flex-col gap-6 rounded-2xl bg-white p-8 shadow-card">
        <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-3 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            ← Back
          </button>
          <p className="text-sm font-medium uppercase tracking-wide text-slate-400">
            #
            {item.id.slice(-6)}
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">{item.title}</h1>
          <p className="mt-2 text-slate-500">{item.description}</p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <strong className="text-4xl font-semibold text-slate-900">
            $
            {item.currentPrice.toFixed(2)}
          </strong>
          <button
            type="button"
            onClick={() => {
              dispatch(addItemToCart({ itemId: item.id, quantity: 1 }))
                .unwrap()
                .then(() => setToast({ type: 'success', message: 'Added to cart' }))
                .catch(() => setToast({ type: 'error', message: 'Could not add to cart' }));
            }}
            className="rounded-full bg-indigo-500 px-6 py-3 text-base font-semibold text-white transition hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add to cart
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Inventory</p>
            <strong className="text-3xl font-semibold text-slate-900">
              {item.inventory?.quantity ?? 0}
            </strong>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Demand index</p>
            <strong className="text-3xl font-semibold text-slate-900">
              {(item.views + item.cartAdds).toLocaleString()}
            </strong>
          </div>
        </div>
      </section>
      <div className="mt-6">
        <PriceHistoryCard history={history} insight={insight} />
      </div>
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

export default ProductDetails;
