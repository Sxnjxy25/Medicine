import DataTable from '../components/DataTable';
import { purchaseHistoryData } from '../services/mockData';

export default function PurchaseHistory() {
  const columns = [
    {
      key: 'id',
      label: 'PO Number',
      render: (val) => <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{val}</span>,
    },
    {
      key: 'supplier',
      label: 'Supplier',
      render: (val) => <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{val}</span>,
    },
    { key: 'date', label: 'Date' },
    { key: 'items', label: 'Items' },
    {
      key: 'total',
      label: 'Total',
      render: (val) => `₹${val.toLocaleString()}`,
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => {
        const cls = val === 'Delivered' ? 'badge-success' : val === 'In Transit' ? 'badge-warning' : val === 'Cancelled' ? 'badge-danger' : 'badge-neutral';
        return <span className={`badge ${cls}`}>{val}</span>;
      },
    },
  ];

  return (
    <div className="animate-in">
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
          Track all purchase orders and supplier deliveries.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={purchaseHistoryData}
        searchPlaceholder="Search by PO number, supplier..."
      />
    </div>
  );
}
