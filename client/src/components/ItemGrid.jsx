const ItemGrid = ({ items, onAddToCart, onSelect }) => (
  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
    {items.map((item) => (
      <article key={item.id} className="flex flex-col gap-3 rounded-xl bg-white p-5 shadow-card">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
          <p className="mt-1 min-h-[3rem] text-sm text-slate-500">{item.description}</p>
        </div>
        <div className="flex items-center justify-between">
          <strong className="text-xl text-slate-900">
            ₹
            {item.currentPrice?.toFixed(2)}
          </strong>
          <span className="text-sm text-slate-500">
            {item.inventory?.quantity ?? 0}
            {' '}
            left
          </span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onSelect?.(item)}
            className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Details
          </button>
          <button
            type="button"
            onClick={() => onAddToCart(item)}
            className="flex-1 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            Quick Add
          </button>
        </div>
      </article>
    ))}
  </div>
);

export default ItemGrid;
