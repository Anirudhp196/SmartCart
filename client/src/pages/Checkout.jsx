import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkout as checkoutApi } from '../api/orders.js';
import { fetchCart } from '../slices/cartSlice.js';

const Checkout = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.data);
  const [status, setStatus] = useState('idle');
  const [order, setOrder] = useState(null);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleCheckout = async () => {
    try {
      setStatus('processing');
      const result = await checkoutApi();
      setOrder(result.order);
      setStatus('completed');
      dispatch(fetchCart());
    } catch (error) {
      setStatus('failed');
    }
  };

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <section className="rounded-2xl bg-white p-8 shadow-card">
        <h2 className="text-3xl font-semibold text-slate-900">Checkout</h2>
        <p className="mt-2 text-slate-500">
          You have
          {' '}
          {cart?.cartItems?.length || 0}
          {' '}
          items ready to ship.
        </p>
        <p className="text-2xl font-semibold text-slate-900">
          Total: $
          {(cart?.total || 0).toFixed(2)}
        </p>
        <button
          type="button"
          disabled={status === 'processing' || (cart?.cartItems || []).length === 0}
          onClick={handleCheckout}
          className="mt-4 rounded-xl bg-sky-500 px-5 py-3 text-base font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {status === 'processing' ? 'Processing...' : 'Confirm order'}
        </button>
        {status === 'completed' && order && (
          <p className="mt-4 text-sm font-medium text-emerald-500">
            Order #
            {order.id.slice(-6)}
            {' '}
            paid successfully.
          </p>
        )}
        {status === 'failed' && (
          <p className="mt-4 text-sm font-medium text-rose-500">
            Something went wrong. Please try again.
          </p>
        )}
      </section>
    </main>
  );
};

export default Checkout;
