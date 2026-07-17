import { useState, useEffect } from 'react';
import { Package, AlertTriangle, CheckCircle, TrendingDown, Loader2 } from 'lucide-react';
import StatCard from '../components/StatCard';
import StockChart from '../components/StockChart';
import DataTable from '../components/DataTable';
import medicineService from '../services/medicineService';

export default function Stock() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    medicineService.getAllMedicines()
      .then((data) => setMedicines(data.filter(m => m.active !== false)))
      .catch((err) => {
        console.error('Failed to load stock data', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const lowStockItems = medicines.filter((s) => s.quantity < (s.minimumStock || 50));
  const adequateItems = medicines.filter((s) => s.quantity >= (s.minimumStock || 50));

  const columns = [
    {
      key: 'medicineName',
      label: 'Medicine',
      render: (val) => <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{val}</span>,
    },
    {
      key: 'quantity',
      label: 'Current Stock',
      render: (val, row) => (
        <span style={{ color: val < (row.minimumStock || 50) ? 'var(--color-danger)' : 'var(--color-success)', fontWeight: 600 }}>
          {val}
        </span>
      ),
    },
    { 
      key: 'sellingPrice', 
      label: 'Price/Unit',
      render: (val) => `₹${val}`
    },
    {
      key: 'status',
      label: 'Status',
      sortable: false,
      render: (_, row) => {
        const threshold = row.minimumStock || 50;
        if (row.quantity < threshold) return <span className="badge badge-danger">Low Stock</span>;
        if (row.quantity < threshold * 1.5) return <span className="badge badge-warning">Warning</span>;
        return <span className="badge badge-success">Adequate</span>;
      },
    },
  ];

  return (
    <div className="animate-in">
      {/* Stat Cards */}
      <div className="stat-cards">
        <StatCard
          icon={Package}
          label="Total SKUs"
          value={medicines.length}
          accentColor="green"
          iconColor="green"
        />
        <StatCard
          icon={AlertTriangle}
          label="Low Stock Items"
          value={lowStockItems.length}
          trend="Needs reorder"
          trendDir="down"
          accentColor="red"
          iconColor="red"
        />
        <StatCard
          icon={CheckCircle}
          label="Adequate Stock"
          value={adequateItems.length}
          accentColor="blue"
          iconColor="blue"
        />
        <StatCard
          icon={TrendingDown}
          label="Critical (< 20)"
          value={medicines.filter((s) => s.quantity < (s.minimumStock || 50) * 0.4).length}
          trend="Urgent"
          trendDir="down"
          accentColor="amber"
          iconColor="amber"
        />
      </div>

      {/* Chart */}
      <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="card-header">
          <h3 className="card-title">Stock Levels</h3>
          <span className="badge badge-warning">{lowStockItems.length} below minimum</span>
        </div>
        <div className="chart-container">
          <StockChart data={medicines.map(m => ({ name: m.medicineName, stock: m.quantity, minStock: m.minimumStock || 50 }))} />
        </div>
      </div>

      {/* Stock Table */}
      <DataTable
        columns={columns}
        data={medicines}
        searchPlaceholder="Search stock items..."
      />
    </div>
  );
}
