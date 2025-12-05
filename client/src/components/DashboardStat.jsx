const DashboardStat = ({ label, value, trend }) => {
  const trendClasses = trend >= 0 ? 'text-emerald-500' : 'text-rose-500';
  return (
    <div className="rounded-2xl bg-white p-5 shadow-card">
      <p className="text-sm text-slate-500">{label}</p>
      <h3 className="text-2xl font-semibold text-slate-900">{value}</h3>
      {typeof trend === 'number' && (
        <span className={`text-sm font-medium ${trendClasses}`}>
          {trend >= 0 ? '+' : ''}
          {trend}
          % vs last week
        </span>
      )}
    </div>
  );
};

export default DashboardStat;
