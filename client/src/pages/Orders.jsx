import React, { useEffect } from 'react';
import { fetchOrders } from '../api/orders.js';

const Orders = () => {
  const [orders, setOrders] = React.useState([]);
  const [status, setStatus] = React.useState('idle');

  useEffect(() => {
    setStatus('loading');
    fetchOrders()
      .then((data) => {
        setOrders(data);
        setStatus('succeeded');
      })
      .catch(() => setStatus('failed'));
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-semibold text-slate-900 mb-4">Order history</h1>
      {status === 'loading' && <p className="text-slate-500">Loading orders...</p>}
      {status === 'failed' && <p className="text-rose-500">Could not load orders.</p>}
      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <article key={order.id} className="rounded-xl bg-white p-5 shadow-card">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span className="font-semibold text-slate-900">#{order.id.slice(-6)}</span>
              <span>{new Date(order.createdAt).toLocaleString()}</span>
            </div>
            <div className="mt-2 text-lg font-semibold text-slate-900">
              ₹
              {order.total?.toFixed(2)}
            </div>
            <p className="text-sm text-slate-500">Status: {order.status}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
              {(order.items || []).map((item, idx) => {
                const label = item.title || item.itemId || 'item';
                return (
                  <li key={`${order.id}-${idx}`}>
                    {item.quantity}
                    {' × '}
                    {label}
                    {' @ ₹'}
                    {Number(item.price || 0).toFixed(2)}
                  </li>
                );
              })}
            </ul>
          </article>
        ))}
        {orders.length === 0 && status === 'succeeded' && (
          <p className="text-slate-500">No orders yet.</p>
        )}
      </div>
    </main>
  );
};

export default Orders;

