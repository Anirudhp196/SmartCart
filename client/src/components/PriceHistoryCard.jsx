const PriceHistoryCard = ({ history = [], insight, title }) => {
  const maxBarHeight = 180; // px cap to prevent overflow
  const sliced = history.slice(0, 8);
  const maxPrice = sliced.reduce((m, entry) => Math.max(m, entry.price || 0), 0) || 1;

  return (
    <section className="rounded-xl border border-dashed border-indigo-200 bg-white p-5 shadow-sm">
      <h4 className="text-base font-semibold text-slate-900">
        {title ? `${title} — ` : ''}
        Price history (last
        {' '}
        {history.length}
        {' '}
        updates)
      </h4>
      <div className="mt-4 flex min-h-[140px] items-end gap-2">
        {sliced.map((entry) => {
          const normalizedHeight = Math.max(
            12,
            Math.min(maxBarHeight, (Number(entry.price || 0) / maxPrice) * maxBarHeight),
          );
          return (
            <div key={entry.id} className="flex flex-1 flex-col items-center gap-1">
              <div
                title={`₹${entry.price} at ${new Date(entry.createdAt).toLocaleString()}`}
                className="w-full rounded-md bg-indigo-500"
                style={{ height: `${normalizedHeight}px` }}
              />
              <span className="text-xs font-semibold text-slate-700">
                ₹
                {Number(entry.price || 0).toFixed(2)}
              </span>
            </div>
          );
        })}
        {history.length === 0 && <p className="text-sm text-slate-400">No price movement yet.</p>}
      </div>
      {insight && (
        <div className="mt-4 rounded-lg bg-indigo-50 p-3">
          <strong className="text-sm font-semibold text-indigo-900">{insight.headline}</strong>
          <p className="mt-1 text-sm text-indigo-800">{insight.recommendation}</p>
        </div>
      )}
    </section>
  );
};

export default PriceHistoryCard;
