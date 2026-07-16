import { useEffect, useState } from 'react';
import { Pill, AlertTriangle, ShoppingCart, IndianRupee } from 'lucide-react';
import StatCard from '../components/StatCard';
import SalesChart from '../components/SalesChart';
import { dashboardStats, salesTrendData, recentActivity } from '../services/mockData';
import medicineService from '../services/medicineService';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(dashboardStats);
  const [medicines, setMedicines] = useState([]);
  const [loadingMeds, setLoadingMeds] = useState(true);

  useEffect(() => {
    // Try to get real medicine count from backend
    medicineService.getAllMedicines()
      .then((data) => {
        setMedicines(data);
        setStats((s) => ({
          ...s,
          totalMedicines: data.length,
          lowStockAlerts: data.filter((m) => m.quantity < (m.minimumStock || 50)).length,
        }));
      })
      .catch((err) => {
        console.error('Failed to load medicines for dashboard', err);
      })
      .finally(() => setLoadingMeds(false));
  }, []);

  return (
    <div className="animate-in">
      {/* Stat Cards */}
      <div className="stat-cards">
        <StatCard
          icon={Pill}
          label="Total Medicines"
          value={stats.totalMedicines}
          trend="+12 this month"
          trendDir="up"
          accentColor="green"
          iconColor="green"
        />
        <StatCard
          icon={AlertTriangle}
          label="Low Stock Alerts"
          value={stats.lowStockAlerts}
          trend="3 critical"
          trendDir="down"
          accentColor="red"
          iconColor="red"
        />
        <StatCard
          icon={ShoppingCart}
          label="Today's Sales"
          value={stats.todaySales}
          trend="+8% vs yesterday"
          trendDir="up"
          accentColor="blue"
          iconColor="blue"
        />
        {user?.role !== 'STAFF' && (
          <StatCard
            icon={IndianRupee}
            label="Monthly Revenue"
            value={`₹${stats.monthlyRevenue.toLocaleString()}`}
            trend="+15% vs last month"
            trendDir="up"
            accentColor="amber"
            iconColor="amber"
          />
        )}
      </div>

      {/* Charts Row */}
      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Sales Trend</h3>
            <span className="badge badge-info">Last 7 months</span>
          </div>
          <div className="chart-container">
            <SalesChart data={salesTrendData} />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Activity</h3>
          </div>
          <div className="activity-list">
            {recentActivity.map((item) => (
              <div key={item.id} className="activity-item">
                <div className={`activity-dot ${item.color}`}></div>
                <div>
                  <div className="activity-text">{item.text}</div>
                  <div className="activity-time">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
