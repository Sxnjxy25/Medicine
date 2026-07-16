import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { useToast } from '../context/ToastContext';
import medicineService from '../services/medicineService';

export default function Medicines() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const data = await medicineService.getAll();
      setMedicines(data);
    } catch (err) {
      toast.error('Failed to load', 'Could not fetch medicines from server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await medicineService.delete(deleteTarget.id);
      toast.success('Deleted', `${deleteTarget.medicineName} has been removed.`);
      setDeleteTarget(null);
      fetchMedicines();
    } catch (err) {
      toast.error('Delete failed', 'Could not delete medicine.');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { key: 'medicineCode', label: 'Code' },
    {
      key: 'medicineName',
      label: 'Name',
      render: (val) => (
        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{val}</span>
      ),
    },
    { key: 'genericName', label: 'Generic Name' },
    { key: 'manufacturer', label: 'Manufacturer' },
    { key: 'unit', label: 'Unit' },
    {
      key: 'purchasePrice',
      label: 'Purchase ₹',
      render: (val) => val != null ? `₹${Number(val).toFixed(2)}` : '—',
    },
    {
      key: 'sellingPrice',
      label: 'Selling ₹',
      render: (val) => val != null ? `₹${Number(val).toFixed(2)}` : '—',
    },
    {
      key: 'gstPercentage',
      label: 'GST %',
      render: (val) => val != null ? `${Number(val)}%` : '—',
    },
    {
      key: 'active',
      label: 'Status',
      render: (val) => (
        <span className={`badge ${val ? 'badge-success' : 'badge-danger'}`}>
          {val ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'id',
      label: 'Actions',
      sortable: false,
      render: (id, row) => (
        <div style={{ display: 'flex', gap: '4px' }}>
          <Link
            to={`/medicines/edit/${id}`}
            className="btn btn-ghost btn-sm"
            onClick={(e) => e.stopPropagation()}
            title="Edit"
          >
            <Edit size={14} />
          </Link>
          <button
            className="btn btn-danger btn-sm"
            onClick={(e) => { e.stopPropagation(); setDeleteTarget(row); }}
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="loading-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="animate-in">
      <DataTable
        columns={columns}
        data={medicines}
        searchPlaceholder="Search by name, code, manufacturer..."
        actions={
          <Link to="/medicines/add" className="btn btn-primary">
            <Plus size={16} /> Add Medicine
          </Link>
        }
      />

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Medicine"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </>
        }
      >
        Are you sure you want to delete <strong>{deleteTarget?.medicineName}</strong>? This action cannot be undone.
      </Modal>
    </div>
  );
}
