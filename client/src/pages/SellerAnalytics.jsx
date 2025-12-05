import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PriceHistoryCard from '../components/PriceHistoryCard.jsx';
import { fetchItems } from '../slices/itemsSlice.js';
import { fetchPricingHistory } from '../slices/pricingSlice.js';

const SellerAnalytics = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.items);
  const histories = useSelector((state) => state.pricing.historyByItem);

  useEffect(() => {
    dispatch(fetchItems()).then((result) => {
      (result?.payload || []).slice(0, 3).forEach((item) => dispatch(fetchPricingHistory(item.id)));
    });
  }, [dispatch]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-semibold text-slate-900">Pricing analytics</h1>
      <p className="mt-2 text-slate-500">
        Track how SmartCart reacts to demand. Each card below is wired for real history data once available.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.slice(0, 3).map((item) => (
          <PriceHistoryCard key={item.id} history={histories[item.id] || []} />
        ))}
      </div>
    </main>
  );
};

export default SellerAnalytics;
