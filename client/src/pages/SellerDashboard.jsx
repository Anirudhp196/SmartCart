import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DashboardStat from '../components/DashboardStat.jsx';
import PriceHistoryCard from '../components/PriceHistoryCard.jsx';
import { fetchItems } from '../slices/itemsSlice.js';
import { fetchPricingHistory } from '../slices/pricingSlice.js';

const SellerDashboard = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.items);
  const [selectedId, setSelectedId] = useState(null);
  const selectedItem = useMemo(
    () => items.find((itm) => itm.id === selectedId) || items[0],
    [items, selectedId],
  );
  const history = useSelector((state) => (selectedItem ? state.pricing.historyByItem[selectedItem.id] : []));

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  useEffect(() => {
    if (selectedItem) {
      dispatch(fetchPricingHistory(selectedItem.id));
    }
  }, [dispatch, selectedItem]);

  // When items load for the first time, pick the first item
  useEffect(() => {
    if (!selectedId && items[0]) {
      setSelectedId(items[0].id);
    }
  }, [items, selectedId]);

  const metrics = useMemo(() => {
    const inventoryCount = items.reduce((sum, itm) => sum + (itm.inventory?.quantity || 0), 0);
    const grossMerch = items.reduce((sum, itm) => sum + itm.currentPrice, 0);
    const avgDemand = items.length ? items.reduce((sum, itm) => sum + itm.views + itm.cartAdds, 0) / items.length : 0;
    return {
      inventoryCount,
      grossMerchValue: grossMerch,
      avgDemand: avgDemand.toFixed(0),
    };
  }, [items]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-semibold text-slate-900">Seller dashboard</h1>
      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardStat label="Units on hand" value={metrics.inventoryCount} />
        <DashboardStat label="GMV potential" value={`₹${metrics.grossMerchValue.toFixed(2)}`} />
        <DashboardStat label="Avg. demand index" value={metrics.avgDemand} />
      </section>
      <div className="mt-8 flex flex-col gap-2">
        <label className="text-sm font-semibold text-slate-700" htmlFor="item-selector">
          Select product to view price history
        </label>
        <select
          id="item-selector"
          value={selectedItem?.id || ''}
          onChange={(e) => setSelectedId(e.target.value)}
          className="w-full max-w-md rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
        >
          {items.map((itm) => (
            <option key={itm.id} value={itm.id}>
              {itm.title}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-8">
        <PriceHistoryCard history={history || []} title={selectedItem?.title} />
      </div>
    </main>
  );
};

export default SellerDashboard;
