const PriceHistoryCard = ({ history = [], insight }) => (
  <section className="rounded-xl border border-dashed border-indigo-200 bg-white p-5 shadow-sm">
    <h4 className="text-base font-semibold text-slate-900">
      Price history (last
      {' '}
      {history.length}
      {' '}
      updates)
    </h4>
    <div className="mt-4 flex min-h-[100px] items-end gap-2">
      {history.slice(0, 8).map((entry) => (
        <div
          key={entry.id}
          title={`$${entry.price} at ${new Date(entry.createdAt).toLocaleString()}`}
          className="flex-1 rounded-md bg-indigo-500"
          style={{ height: `${Math.max(10, entry.price)}px` }}
        />
      ))}
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

export default PriceHistoryCard;
