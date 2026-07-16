import { useState, useEffect, useRef } from 'react';
import { Plus, Minus, Trash2, Receipt, Printer } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import medicineService from '../services/medicineService';

export default function Billing() {
  const [cart, setCart] = useState([]);
  const [searchMed, setSearchMed] = useState('');
  const [allMedicines, setAllMedicines] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const toast = useToast();
  const searchRef = useRef(null);

  useEffect(() => {
    const loadMedicines = async () => {
      try {
        const meds = await medicineService.getAllMedicines();
        setAllMedicines(meds);
      } catch (error) {
        console.error('Failed to load medicines for billing', error);
      }
    };
    loadMedicines();

    // Close suggestions when clicking outside
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredMedicines = allMedicines.filter(m => 
    m.medicineName && m.medicineName.toLowerCase().includes(searchMed.toLowerCase())
  );

  const addMedicineToCart = (medicine) => {
    setCart((prev) => {
      const existing = prev.find(item => item.id === medicine.id);
      if (existing) {
        return prev.map(item => item.id === medicine.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { 
        id: medicine.id, 
        name: medicine.medicineName, 
        price: medicine.sellingPrice, 
        qty: 1, 
        gst: medicine.gstPercentage || 12,
        rackId: medicine.rackId || null 
      }];
    });
    setSearchMed('');
    setShowSuggestions(false);
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.qty + delta);
          return { ...item, qty: newQty };
        }
        return item;
      })
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const gstTotal = cart.reduce((sum, item) => sum + (item.price * item.qty * item.gst) / 100, 0);
  const grandTotal = subtotal + gstTotal;

  const handleGenerateBill = async () => {
    if (!customerName.trim()) {
      toast.warning('Missing Info', 'Please enter customer name.');
      return;
    }
    if (cart.length === 0) {
      toast.warning('Empty Cart', 'Add at least one medicine to the bill.');
      return;
    }
    try {
      for (const item of cart) {
        const dbMed = allMedicines.find(m => m.id === item.id);
        if (dbMed) {
          const updatedQty = Math.max(0, (dbMed.quantity || 0) - item.qty);
          await medicineService.update(dbMed.id, {
            ...dbMed,
            quantity: updatedQty
          });
        }
      }
      toast.success('Bill Generated', `Invoice for ${customerName} — ₹${grandTotal.toFixed(2)}`);
      const meds = await medicineService.getAllMedicines();
      setAllMedicines(meds);
      setCart([]);
      setCustomerName('');
    } catch (err) {
      toast.error('Billing Error', 'Failed to update stock quantities.');
    }
  };

  return (
    <div className="animate-in">
      <div className="billing-layout">
        {/* Left: Medicine Search & Cart */}
        <div>
          <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
            <div className="card-header">
              <h3 className="card-title">Add Medicines</h3>
            </div>
            <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="form-group">
                <label className="form-label">Customer Name</label>
                <input
                  className="form-input"
                  placeholder="Enter customer name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
              <div className="form-group" ref={searchRef} style={{ position: 'relative' }}>
                <label className="form-label">Search Medicine</label>
                <input
                  className="form-input"
                  placeholder="Type to search..."
                  value={searchMed}
                  onChange={(e) => {
                    setSearchMed(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                />
                
                {showSuggestions && searchMed && (
                  <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0,
                    background: 'var(--bg-elevated)', border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)', maxHeight: '200px', overflowY: 'auto',
                    zIndex: 10, boxShadow: 'var(--shadow-md)', marginTop: '4px'
                  }}>
                    {filteredMedicines.length > 0 ? (
                      filteredMedicines.map(med => (
                        <div 
                          key={med.id} 
                          style={{ padding: '10px 12px', cursor: 'pointer', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                          onMouseDown={() => addMedicineToCart(med)}
                        >
                          <span style={{ fontWeight: 500 }}>{med.medicineName}</span>
                          <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', display: 'flex', gap: '8px' }}>
                            {med.rackId && <span style={{ color: 'var(--color-info)', fontWeight: 500 }}>Rack: {med.rackId}</span>}
                            <span>₹{med.sellingPrice} (Stock: {med.quantity})</span>
                          </span>
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>No matches found</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cart Items */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Cart ({cart.length} items)</h3>
            </div>

            {cart.length === 0 ? (
              <div className="empty-state">
                <Receipt size={48} className="empty-state-icon" />
                <h3>No items in cart</h3>
                <p>Search and add medicines to create a bill</p>
              </div>
            ) : (
              <div className="cart-items">
                {cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: 'var(--font-size-sm)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {item.name}
                        {item.rackId && <span className="no-print" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-info)', background: 'rgba(59,130,246,0.1)', padding: '1px 6px', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>Rack: {item.rackId}</span>}
                      </div>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                        ₹{item.price} × {item.qty} &nbsp;·&nbsp; GST {item.gst}%
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => updateQty(item.id, -1)}>
                        <Minus size={14} />
                      </button>
                      <span style={{ fontWeight: 600, minWidth: '24px', textAlign: 'center' }}>{item.qty}</span>
                      <button className="btn btn-ghost btn-sm" onClick={() => updateQty(item.id, 1)}>
                        <Plus size={14} />
                      </button>

                      <span style={{ fontWeight: 600, color: 'var(--text-primary)', minWidth: '60px', textAlign: 'right' }}>
                        ₹{(item.price * item.qty).toFixed(2)}
                      </span>

                      <button className="btn btn-danger btn-sm" onClick={() => removeItem(item.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Bill Summary */}
        <div className="card" style={{ alignSelf: 'flex-start', position: 'sticky', top: 'calc(var(--navbar-height) + var(--space-lg))' }}>
          <div className="card-header">
            <h3 className="card-title">Bill Summary</h3>
          </div>

          <div className="cart-summary" style={{ borderTop: 'none', paddingTop: 0 }}>
            <div className="cart-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="cart-row">
              <span>GST</span>
              <span>₹{gstTotal.toFixed(2)}</span>
            </div>
            <div className="cart-row">
              <span>Discount</span>
              <span>₹0.00</span>
            </div>
            <div className="cart-row total">
              <span>Total</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', marginTop: 'var(--space-lg)' }}>
            <button className="btn btn-primary btn-lg" onClick={handleGenerateBill} style={{ width: '100%' }}>
              <Receipt size={18} /> Generate Bill
            </button>
            <button className="btn btn-secondary" style={{ width: '100%' }}>
              <Printer size={16} /> Print Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
