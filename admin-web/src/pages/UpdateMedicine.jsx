import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import medicineService from '../services/medicineService';

export default function UpdateMedicine() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    medicineService.getById(id)
      .then((data) => {
        setForm({
          ...data,
          purchasePrice: data.purchasePrice ?? '',
          sellingPrice: data.sellingPrice ?? '',
          gstPercentage: data.gstPercentage ?? '',
          rackId: data.rackId ?? '',
          minimumStock: data.minimumStock ?? '',
          prescriptionRequired: data.prescriptionRequired ?? false,
          active: data.active ?? true,
          quantity: data.quantity ?? 0,
        });
      })
      .catch(() => {
        toast.error('Not Found', 'Medicine not found.');
        navigate('/medicines');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const validate = () => {
    const errs = {};
    if (!form.medicineName?.trim()) errs.medicineName = 'Medicine name is required';
    if (!form.medicineCode?.trim()) errs.medicineCode = 'Medicine code is required';
    if (form.purchasePrice && isNaN(Number(form.purchasePrice))) errs.purchasePrice = 'Must be a number';
    if (form.sellingPrice && isNaN(Number(form.sellingPrice))) errs.sellingPrice = 'Must be a number';
    if (form.gstPercentage && isNaN(Number(form.gstPercentage))) errs.gstPercentage = 'Must be a number';
    if (form.minimumStock && isNaN(Number(form.minimumStock))) errs.minimumStock = 'Must be a number';
    if (form.quantity && isNaN(Number(form.quantity))) errs.quantity = 'Must be a number';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        purchasePrice: form.purchasePrice !== '' ? Number(form.purchasePrice) : null,
        sellingPrice: form.sellingPrice !== '' ? Number(form.sellingPrice) : null,
        gstPercentage: form.gstPercentage !== '' ? Number(form.gstPercentage) : null,
        rackId: form.rackId !== '' ? form.rackId : null,
        minimumStock: form.minimumStock !== '' ? Number(form.minimumStock) : null,
        quantity: form.quantity !== '' ? Number(form.quantity) : 0,
      };
      await medicineService.update(id, payload);
      toast.success('Updated', `${form.medicineName} has been updated successfully.`);
      navigate('/medicines');
    } catch (err) {
      toast.error('Update Failed', 'Could not update medicine.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) {
    return (
      <div className="loading-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="animate-in">
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <button className="btn btn-ghost" onClick={() => navigate('/medicines')}>
          <ArrowLeft size={16} /> Back to Medicines
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Update Medicine</h3>
          <span className="badge badge-info">ID: {id}</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Medicine Code *</label>
              <input name="medicineCode" className="form-input" value={form.medicineCode || ''} onChange={handleChange} />
              {errors.medicineCode && <span className="form-error">{errors.medicineCode}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Medicine Name *</label>
              <input name="medicineName" className="form-input" value={form.medicineName || ''} onChange={handleChange} />
              {errors.medicineName && <span className="form-error">{errors.medicineName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Generic Name</label>
              <input name="genericName" className="form-input" value={form.genericName || ''} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label">Manufacturer</label>
              <input name="manufacturer" className="form-input" value={form.manufacturer || ''} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label">QR Code</label>
              <input name="qrCode" className="form-input" value={form.qrCode || ''} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label">Barcode</label>
              <input name="barcode" className="form-input" value={form.barcode || ''} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label">Unit</label>
              <select name="unit" className="form-select" value={form.unit || 'Tablet'} onChange={handleChange}>
                <option value="Tablet">Tablet</option>
                <option value="Capsule">Capsule</option>
                <option value="Syrup">Syrup</option>
                <option value="Injection">Injection</option>
                <option value="Cream">Cream</option>
                <option value="Drops">Drops</option>
                <option value="Inhaler">Inhaler</option>
                <option value="Powder">Powder</option>
                <option value="Ointment">Ointment</option>
                <option value="Gel">Gel</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Purchase Price (₹)</label>
              <input name="purchasePrice" className="form-input" value={form.purchasePrice} onChange={handleChange} />
              {errors.purchasePrice && <span className="form-error">{errors.purchasePrice}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Selling Price (₹)</label>
              <input name="sellingPrice" className="form-input" value={form.sellingPrice} onChange={handleChange} />
              {errors.sellingPrice && <span className="form-error">{errors.sellingPrice}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">GST Percentage (%)</label>
              <input name="gstPercentage" className="form-input" value={form.gstPercentage} onChange={handleChange} />
              {errors.gstPercentage && <span className="form-error">{errors.gstPercentage}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Rack ID</label>
              <input name="rackId" className="form-input" value={form.rackId} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label">Minimum Stock</label>
              <input name="minimumStock" className="form-input" value={form.minimumStock} onChange={handleChange} />
              {errors.minimumStock && <span className="form-error">{errors.minimumStock}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Quantity (Stock)</label>
              <input name="quantity" className="form-input" value={form.quantity} onChange={handleChange} />
              {errors.quantity && <span className="form-error">{errors.quantity}</span>}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-lg)', marginTop: 'var(--space-lg)' }}>
            <label className="form-checkbox">
              <input type="checkbox" name="prescriptionRequired" checked={form.prescriptionRequired} onChange={handleChange} />
              <span className="form-label" style={{ margin: 0 }}>Prescription Required</span>
            </label>

            <label className="form-checkbox">
              <input type="checkbox" name="active" checked={form.active} onChange={handleChange} />
              <span className="form-label" style={{ margin: 0 }}>Active</span>
            </label>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-xl)', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/medicines')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
              <Save size={18} />
              {saving ? 'Updating...' : 'Update Medicine'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
