import { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import purchaseService from '../services/purchaseService';
import { useToast } from '../context/ToastContext';
import { Edit2, Trash2, Plus, X } from 'lucide-react';
import Modal from '../components/Modal';

export default function PurchaseHistory() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState(null);
  const [confirmDeleteTarget, setConfirmDeleteTarget] = useState(null);
  const [form, setForm] = useState({ invoiceNumber: '', supplier: '', date: '', items: '', total: '', status: 'Delivered' });
  const toast = useToast();

  const loadPurchases = async () => {
    try {
      const data = await purchaseService.getAll();
      setPurchases(data);
    } catch (err) {
      toast.error('Load Error', 'Failed to retrieve purchase orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPurchases();
  }, []);

  const handleEditClick = (purchase) => {
    setEditingPurchase(purchase);
    setForm({
      invoiceNumber: purchase.invoiceNumber || '',
      supplier: purchase.supplier || '',
      date: purchase.date || '',
      items: purchase.items || '',
      total: purchase.total || '',
      status: purchase.status || 'Delivered'
    });
    setShowModal(true);
  };

  const handleCreateClick = () => {
    setEditingPurchase(null);
    setForm({
      invoiceNumber: `PO-${Date.now().toString().slice(-6)}`,
      supplier: '',
      date: new Date().toISOString().split('T')[0],
      items: '',
      total: '',
      status: 'Delivered'
    });
    setShowModal(true);
  };

  const handleDeleteClick = async (purchase) => {
    try {
      await purchaseService.delete(purchase.id);
      toast.success('Deleted', 'Purchase record deleted successfully.');
      loadPurchases();
    } catch (err) {
      toast.error('Delete Error', 'Failed to delete purchase record.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...form,
      total: parseFloat(form.total) || 0
    };
    try {
      if (editingPurchase) {
        await purchaseService.update(editingPurchase.id, data);
        toast.success('Updated', 'Purchase record updated successfully.');
      } else {
        await purchaseService.create(data);
        toast.success('Created', 'New purchase record created successfully.');
      }
      setShowModal(false);
      loadPurchases();
    } catch (err) {
      toast.error('Save Error', 'Failed to save purchase record.');
    }
  };

  const columns = [
    {
      key: 'invoiceNumber',
      label: 'PO / Invoice Number',
      render: (val) => <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{val}</span>,
    },
    {
      key: 'supplier',
      label: 'Supplier',
      render: (val) => <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{val}</span>,
    },
    { key: 'date', label: 'Date' },
    { key: 'items', label: 'Items / Details' },
    {
      key: 'total',
      label: 'Total Amount',
      render: (val) => `₹${val?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => {
        const cls = val === 'Delivered' ? 'badge-success' : val === 'In Transit' ? 'badge-warning' : val === 'Cancelled' ? 'badge-danger' : 'badge-neutral';
        return <span className={`badge ${cls}`}>{val}</span>;
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => handleEditClick(row)} title="Edit Purchase">
            <Edit2 size={14} color="var(--accent-secondary)" />
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => setConfirmDeleteTarget(row)} title="Delete Purchase">
            <Trash2 size={14} color="var(--color-danger)" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="animate-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', margin: 0 }}>
          Manage purchase orders, suppliers, and incoming medicine stock.
        </p>
        <button className="btn btn-primary" onClick={handleCreateClick}>
          <Plus size={16} /> Add Purchase
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <span className="spinner"></span>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={purchases}
          searchPlaceholder="Search by PO number, supplier..."
        />
      )}

      {showModal && (
        <Modal 
          open={showModal}
          title={editingPurchase ? 'Edit Purchase Order' : 'Create Purchase Order'} 
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">PO / Invoice Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={form.invoiceNumber}
                  onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Supplier Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter supplier name"
                  value={form.supplier}
                  onChange={(e) => setForm({ ...form, supplier: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Purchase Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Total Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  placeholder="0.00"
                  value={form.total}
                  onChange={(e) => setForm({ ...form, total: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Purchase Status</label>
                <select
                  className="form-input"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="Delivered">Delivered</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Items Description</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Paracetamol x50, Aspirin x10"
                  value={form.items}
                  onChange={(e) => setForm({ ...form, items: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: 'var(--space-md)' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save
              </button>
            </div>
          </form>
        </Modal>
      )}
      {confirmDeleteTarget && (
        <Modal
          open={confirmDeleteTarget !== null}
          onClose={() => setConfirmDeleteTarget(null)}
          title="Delete Purchase Record"
          footer={
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button 
                className="btn btn-secondary" 
                onClick={() => setConfirmDeleteTarget(null)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger" 
                onClick={async () => {
                  await handleDeleteClick(confirmDeleteTarget);
                  setConfirmDeleteTarget(null);
                }}
              >
                Delete
              </button>
            </div>
          }
        >
          <p style={{ margin: 0, fontSize: 'var(--font-size-md)', color: 'var(--text-secondary)' }}>
            Are you sure you want to delete purchase order <strong>'{confirmDeleteTarget.invoiceNumber}'</strong>?
            This will permanently remove this record from your purchase history.
          </p>
        </Modal>
      )}
    </div>
  );
}
