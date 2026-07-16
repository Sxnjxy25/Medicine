export default function StatCard({ icon: Icon, label, value, trend, trendDir, accentColor, iconColor }) {
  return (
    <div className={`stat-card accent-${accentColor}`}>
      <div className={`stat-icon ${iconColor}`}>
        <Icon size={24} />
      </div>
      <div className="stat-info">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
        {trend && (
          <span className={`stat-trend ${trendDir}`}>
            {trendDir === 'up' ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>
    </div>
  );
}
