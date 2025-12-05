import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createNewItem, fetchItems, removeItem } from '../slices/itemsSlice.js';

const SellerItems = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.items);
  const user = useSelector((state) => state.auth.user);
  const [form, setForm] = useState({ title: '', description: '', basePrice: 10, inventoryQuantity: 10 });

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  const myItems = items.filter((item) => item.sellerId === user?.id);

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(createNewItem(form));
    setForm({ title: '', description: '', basePrice: 10, inventoryQuantity: 10 });
  };

  const handleDelete = (id) => dispatch(removeItem(id));

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-semibold text-slate-900">Manage listings</h1>
      <form
        onSubmit={handleSubmit}
        className="mt-6 grid gap-4 rounded-2xl bg-white p-6 shadow-card"
      >
        <input
          required
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="rounded-lg border border-slate-200 px-4 py-3 text-base outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="min-h-[120px] rounded-lg border border-slate-200 px-4 py-3 text-base outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
        />
        <div className="flex flex-col gap-4 sm:flex-row">
          <input
            type="number"
            step="0.01"
            min="1"
            value={form.basePrice}
            onChange={(e) => setForm({ ...form, basePrice: Number(e.target.value) })}
            className="flex-1 rounded-lg border border-slate-200 px-4 py-3 text-base outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          />
          <input
            type="number"
            min="0"
            value={form.inventoryQuantity}
            onChange={(e) => setForm({ ...form, inventoryQuantity: Number(e.target.value) })}
            className="flex-1 rounded-lg border border-slate-200 px-4 py-3 text-base outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          />
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
                $
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
