import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createNewItem, fetchItems, removeItem } from '../slices/itemsSlice.js';

const SellerItems = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.items);
  const user = useSelector((state) => state.auth.user);
  const [form, setForm] = useState({
    title: '',
    description: '',
    basePrice: '',
    inventoryQuantity: '',
  });

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  // Single-user assumption: show only items created in this session (persisted locally)
  const [createdIds, setCreatedIds] = useState(() => {
    try {
      const raw = localStorage.getItem('smartcart_created_item_ids');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });
  // Show only items you created (tracked locally)
  const myItems = items.filter((item) => createdIds.includes(item.id));

  useEffect(() => {
    localStorage.setItem('smartcart_created_item_ids', JSON.stringify(createdIds));
  }, [createdIds]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const basePrice = parseFloat(form.basePrice);
    const inventoryQuantity = parseInt(form.inventoryQuantity, 10);

    if (Number.isNaN(basePrice) || basePrice <= 0) {
      alert('Please enter a valid base price greater than 0');
      return;
    }

    if (Number.isNaN(inventoryQuantity) || inventoryQuantity < 0) {
      alert('Please enter a valid inventory quantity (0 or more)');
      return;
    }

    dispatch(createNewItem({
      title: form.title,
      description: form.description,
      basePrice,
      inventoryQuantity,
    }))
      .unwrap()
      .then((newItem) => {
        setCreatedIds((prev) => [...prev, newItem.id]);
        return dispatch(fetchItems());
      })
      .finally(() => {
        setForm({
          title: '',
          description: '',
          basePrice: '',
          inventoryQuantity: '',
        });
      });
  };

  const handleDelete = (id) => {
    dispatch(removeItem(id))
      .unwrap()
      .then(() => {
        setCreatedIds((prev) => prev.filter((pid) => pid !== id));
        return dispatch(fetchItems());
      })
      .catch(() => {
        alert('Could not remove item. Please try again.');
      });
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-semibold text-slate-900">Manage listings</h1>
      <form
        onSubmit={handleSubmit}
        className="mt-6 grid gap-4 rounded-2xl bg-white p-6 shadow-card"
      >
        <input
          required
          placeholder="Title (e.g., Apple Watch Series 8, 44mm)"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="rounded-lg border border-slate-200 px-4 py-3 text-base outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
        />
        <textarea
          placeholder="Description (key features, condition, color, storage, etc.)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="min-h-[120px] rounded-lg border border-slate-200 px-4 py-3 text-base outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
        />
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-semibold text-slate-700">Base price (₹)</label>
            <input
              type="number"
              step="0.01"
              min="1"
              value={form.basePrice}
              onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
              placeholder="e.g., 19999"
              inputMode="decimal"
              className="no-spinner w-full rounded-lg border border-slate-200 px-4 py-3 text-base outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
            <p className="mt-1 text-xs text-slate-500">This sets the starting/current price for the listing.</p>
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm font-semibold text-slate-700">Starting inventory (units)</label>
            <input
              type="number"
              min="0"
              value={form.inventoryQuantity}
              onChange={(e) => setForm({ ...form, inventoryQuantity: e.target.value })}
              placeholder="e.g., 25"
              inputMode="numeric"
              className="no-spinner w-full rounded-lg border border-slate-200 px-4 py-3 text-base outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
            <p className="mt-1 text-xs text-slate-500">How many units you’re making available at publish time.</p>
          </div>
        </div>
        <button
          type="submit"
          className="rounded-xl bg-sky-500 px-4 py-3 text-base font-semibold text-white transition hover:bg-sky-400"
        >
          Publish item
        </button>
      </form>

      <section className="mt-8 flex flex-col gap-4">
        {myItems.map((item) => (
          <article
            key={item.id}
            className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm"
          >
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="text-sm text-slate-500">
                ₹
                {item.currentPrice.toFixed(2)}
                {' '}
                •
                {' '}
                {item.inventory?.quantity || 0}
                {' '}
                units
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleDelete(item.id)}
              className="text-sm font-semibold text-rose-500 transition hover:text-rose-600"
            >
              Remove
            </button>
          </article>
        ))}
        {myItems.length === 0 && <p className="text-slate-500">You have no listings yet.</p>}
      </section>
    </main>
  );
};

export default SellerItems;
