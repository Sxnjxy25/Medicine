import { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import salesService from '../services/salesService';
import { useToast } from '../context/ToastContext';
import { Eye, Receipt } from 'lucide-react';
import Modal from '../components/Modal';

export default function SalesHistory() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSale, setSelectedSale] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const toast = useToast();

  const loadSales = async () => {
    try {
      const data = await salesService.getAll();
      setSales(data);
    } catch (err) {
      toast.error('Load Error', 'Failed to retrieve sales records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, []);

  const handleViewClick = (sale) => {
    setSelectedSale(sale);
    setShowModal(true);
  };

  const columns = [
    {
      key: 'invoiceNumber',
      label: 'Invoice Number',
      render: (val) => <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{val}</span>,
    },
    {
      key: 'customerName',
      label: 'Customer Name',
      render: (val) => <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{val}</span>,
    },
    {
      key: 'saleDate',
      label: 'Date & Time',
      render: (val) => {
        if (!val) return '-';
        const date = new Date(val);
        return date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
      }
    },
    {
      key: 'grandTotal',
      label: 'Grand Total',
      render: (val) => `₹${val?.toFixed(2)}`,
    },
    {
      key: 'paymentMode',
      label: 'Payment',
      render: (val) => <span className="badge badge-success">{val || 'Cash'}</span>,
    },
    {
      key: 'actions',
      label: 'Details',
      render: (_, row) => (
        <button className="btn btn-ghost btn-sm" onClick={() => handleViewClick(row)} title="View Invoice">
          <Eye size={16} color="var(--color-info)" />
        </button>
      )
    }
  ];

  return (
    <div className="animate-in">
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', margin: 0 }}>
          View and audit all historical billing invoices and sales checkouts.
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <span className="spinner"></span>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={sales}
          searchPlaceholder="Search by invoice number, customer..."
        />
      )}

      {showModal && selectedSale && (
        <Modal 
          title={`Invoice: ${selectedSale.invoiceNumber}`} 
          onClose={() => setShowModal(false)}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', paddingBottom: 'var(--space-md)', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>CUSTOMER</span>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>{selectedSale.customerName}</div>
              </div>
              <div>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>INVOICE DATE</span>
                <div style={{ fontWeight: 500, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {new Date(selectedSale.saleDate).toLocaleString()}
                </div>
              </div>
            </div>

            <div>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>ITEMS LIST</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                {selectedSale.items && selectedSale.items.length > 0 ? (
                  selectedSale.items.map((item, index) => (
                    <div 
                      key={index} 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        padding: '10px 12px', 
                        background: 'var(--bg-secondary)', 
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: 'var(--font-size-sm)' }}>{item.medicineName}</div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginTop: '2px' }}>
                          ₹{item.price?.toFixed(2)} × {item.quantity}
                        </div>
                      </div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        ₹{item.subtotal?.toFixed(2)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>No items in this invoice</div>
                )}
              </div>
            </div>

            <div style={{ 
              marginTop: 'var(--space-md)', 
              paddingTop: 'var(--space-md)', 
              borderTop: '1px solid var(--border-color)', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '6px',
              alignSelf: 'flex-end',
              width: '200px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                <span style={{ color: 'var(--text-primary)' }}>₹{selectedSale.subtotal?.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>GST</span>
                <span style={{ color: 'var(--text-primary)' }}>₹{selectedSale.gst?.toFixed(2)}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                fontWeight: 600, 
                fontSize: 'var(--font-size-md)', 
                borderTop: '1px solid var(--border-color)', 
                paddingTop: '6px',
                marginTop: '4px' 
              }}>
                <span style={{ color: 'var(--text-primary)' }}>Grand Total</span>
                <span style={{ color: 'var(--accent-primary)' }}>₹{selectedSale.grandTotal?.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-md)' }}>
              <button className="btn btn-primary" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
