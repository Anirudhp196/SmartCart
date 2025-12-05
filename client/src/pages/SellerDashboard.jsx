import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DashboardStat from '../components/DashboardStat.jsx';
import PriceHistoryCard from '../components/PriceHistoryCard.jsx';
import { fetchItems } from '../slices/itemsSlice.js';
import { fetchPricingHistory } from '../slices/pricingSlice.js';

const SellerDashboard = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.items);
  const defaultItem = items[0];
  const history = useSelector((state) => (defaultItem ? state.pricing.historyByItem[defaultItem.id] : []));

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  useEffect(() => {
    if (defaultItem) {
      dispatch(fetchPricingHistory(defaultItem.id));
    }
  }, [dispatch, defaultItem]);

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
        <DashboardStat label="Units on hand" value={metrics.inventoryCount} trend={4} />
        <DashboardStat label="GMV potential" value={`$${metrics.grossMerchValue.toFixed(2)}`} trend={9} />
        <DashboardStat label="Avg. demand index" value={metrics.avgDemand} trend={-2} />
      </section>
      <div className="mt-8">
        <PriceHistoryCard history={history || []} />
      </div>
    </main>
  );
};

export default SellerDashboard;
