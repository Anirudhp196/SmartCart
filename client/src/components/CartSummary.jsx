const CartSummary = ({ cart, onRemove }) => (
  <section className="rounded-2xl bg-white p-6 shadow-card">
    <h3 className="text-xl font-semibold">
      Cart ({cart?.cartItems?.length || 0})
    </h3>
    <ul className="mt-4 flex list-none flex-col gap-3 p-0">
      {(cart?.cartItems || []).map((item) => (
        <li key={item.id} className="flex items-center justify-between">
          <div>
            <strong className="block text-base font-semibold text-slate-900">{item.item.title}</strong>
            <p className="text-sm text-slate-500">
              {item.quantity}
              {' '}
              × ₹
              {item.item.currentPrice.toFixed(2)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onRemove(item.item.id)}
            className="text-sm font-medium text-red-500 transition hover:text-red-600"
          >
            Remove
          </button>
        </li>
      ))}
    </ul>
    <div className="mt-6 text-right">
      <p className="text-sm text-slate-500">Subtotal</p>
      <strong className="text-2xl font-semibold text-slate-900">
        ₹
        {(cart?.total || 0).toFixed(2)}
      </strong>
    </div>
  </section>
);

export default CartSummary;
