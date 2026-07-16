import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import medicineService from '../services/medicineService';

const initialForm = {
  medicineCode: '',
  qrCode: '',
  barcode: '',
  medicineName: '',
  genericName: '',
  manufacturer: '',
  unit: 'Tablet',
  purchasePrice: '',
  sellingPrice: '',
  gstPercentage: '',
  rackId: '',
  minimumStock: '',
  prescriptionRequired: false,
  active: true,
  quantity: '0',
};

export default function AddMedicine() {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const toast = useToast();

  const validate = () => {
    const errs = {};
    if (!form.medicineName.trim()) errs.medicineName = 'Medicine name is required';
    if (!form.medicineCode.trim()) errs.medicineCode = 'Medicine code is required';
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
        purchasePrice: form.purchasePrice ? Number(form.purchasePrice) : null,
        sellingPrice: form.sellingPrice ? Number(form.sellingPrice) : null,
        gstPercentage: form.gstPercentage ? Number(form.gstPercentage) : null,
        rackId: form.rackId ? form.rackId : null,
        minimumStock: form.minimumStock ? Number(form.minimumStock) : null,
        quantity: form.quantity ? Number(form.quantity) : 0,
      };
      await medicineService.create(payload);
      toast.success('Medicine Added', `${form.medicineName} has been added successfully.`);
      navigate('/medicines');
    } catch (err) {
      toast.error('Save Failed', 'Could not save medicine. Check the backend.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-in">
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <button className="btn btn-ghost" onClick={() => navigate('/medicines')}>
          <ArrowLeft size={16} /> Back to Medicines
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Add New Medicine</h3>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Medicine Code *</label>
              <input
                name="medicineCode"
                className="form-input"
                placeholder="e.g. MED-001"
                value={form.medicineCode}
                onChange={handleChange}
              />
              {errors.medicineCode && <span className="form-error">{errors.medicineCode}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Medicine Name *</label>
              <input
                name="medicineName"
                className="form-input"
                placeholder="e.g. Paracetamol 500mg"
                value={form.medicineName}
                onChange={handleChange}
              />
              {errors.medicineName && <span className="form-error">{errors.medicineName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Generic Name</label>
              <input
                name="genericName"
                className="form-input"
                placeholder="e.g. Acetaminophen"
                value={form.genericName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Manufacturer</label>
              <input
                name="manufacturer"
                className="form-input"
                placeholder="e.g. Cipla Ltd."
                value={form.manufacturer}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">QR Code</label>
              <input
                name="qrCode"
                className="form-input"
                placeholder="QR code value"
                value={form.qrCode}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Barcode</label>
              <input
                name="barcode"
                className="form-input"
                placeholder="Barcode value"
                value={form.barcode}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Unit</label>
              <select name="unit" className="form-select" value={form.unit} onChange={handleChange}>
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
              <input
                name="purchasePrice"
                className="form-input"
                placeholder="0.00"
                value={form.purchasePrice}
                onChange={handleChange}
              />
              {errors.purchasePrice && <span className="form-error">{errors.purchasePrice}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Selling Price (₹)</label>
              <input
                name="sellingPrice"
                className="form-input"
                placeholder="0.00"
                value={form.sellingPrice}
                onChange={handleChange}
              />
              {errors.sellingPrice && <span className="form-error">{errors.sellingPrice}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">GST Percentage (%)</label>
              <input
                name="gstPercentage"
                className="form-input"
                placeholder="e.g. 12"
                value={form.gstPercentage}
                onChange={handleChange}
              />
              {errors.gstPercentage && <span className="form-error">{errors.gstPercentage}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Rack ID</label>
              <input
                name="rackId"
                className="form-input"
                placeholder="e.g. A1"
                value={form.rackId}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Minimum Stock</label>
              <input
                name="minimumStock"
                className="form-input"
                placeholder="e.g. 50"
                value={form.minimumStock}
                onChange={handleChange}
              />
              {errors.minimumStock && <span className="form-error">{errors.minimumStock}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Initial Quantity (Stock)</label>
              <input
                name="quantity"
                className="form-input"
                placeholder="e.g. 100"
                value={form.quantity}
                onChange={handleChange}
              />
              {errors.quantity && <span className="form-error">{errors.quantity}</span>}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-lg)', marginTop: 'var(--space-lg)' }}>
            <label className="form-checkbox">
              <input
                type="checkbox"
                name="prescriptionRequired"
                checked={form.prescriptionRequired}
                onChange={handleChange}
              />
              <span className="form-label" style={{ margin: 0 }}>Prescription Required</span>
            </label>

            <label className="form-checkbox">
              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
              />
              <span className="form-label" style={{ margin: 0 }}>Active</span>
            </label>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-xl)', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/medicines')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Medicine'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
