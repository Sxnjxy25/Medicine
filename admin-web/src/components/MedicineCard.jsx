import { Pill, Edit, Trash2 } from 'lucide-react';

export default function MedicineCard({ medicine, onEdit, onDelete }) {
  return (
    <div className="card" style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'flex-start' }}>
      <div className="stat-icon green">
        <Pill size={22} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
          <div>
            <h4 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, marginBottom: '2px' }}>
              {medicine.medicineName}
            </h4>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
              {medicine.medicineCode} {medicine.genericName && `· ${medicine.genericName}`}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => onEdit?.(medicine)} title="Edit">
              <Edit size={14} />
            </button>
            <button className="btn btn-danger btn-sm" onClick={() => onDelete?.(medicine)} title="Delete">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-sm)', flexWrap: 'wrap' }}>
          {medicine.manufacturer && (
            <span className="badge badge-neutral">{medicine.manufacturer}</span>
          )}
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
            ₹{medicine.sellingPrice}
          </span>
          {medicine.prescriptionRequired && (
            <span className="badge badge-warning">Rx Required</span>
          )}
          <span className={`badge ${medicine.active ? 'badge-success' : 'badge-danger'}`}>
            {medicine.active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
    </div>
  );
}
