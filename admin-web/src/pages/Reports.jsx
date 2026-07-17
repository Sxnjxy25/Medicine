import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calendar, TrendingUp, ShoppingBag, AlertTriangle, Printer } from 'lucide-react';
import salesService from '../services/salesService';
import purchaseService from '../services/purchaseService';
import medicineService from '../services/medicineService';
import { useToast } from '../context/ToastContext';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-md)',
      padding: '12px 16px',
      boxShadow: 'var(--shadow-md)',
    }}>
      <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: 4 }}>{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color, fontSize: '13px' }}>
          {entry.name}: ₹{entry.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      ))}
    </div>
  );
};

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Reports() {
  const [sales, setSales] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('sales');
  const [timeframe, setTimeframe] = useState('monthly'); // 'monthly' or 'weekly'
  const toast = useToast();

  useEffect(() => {
    const loadAllData = async () => {
      try {
        const [salesData, purchasesData, medsData] = await Promise.all([
          salesService.getAll(),
          purchaseService.getAll(),
          medicineService.getAll()
        ]);
        setSales(salesData);
        setPurchases(purchasesData);
        setMedicines(medsData);
      } catch (err) {
        toast.error('Data Load Error', 'Failed to retrieve database analytics.');
      } finally {
        setLoading(false);
      }
    };
    loadAllData();
  }, []);

  const storeSettings = JSON.parse(localStorage.getItem('store_settings')) || {
    name: 'MediStock Pharmacy & Medicals',
    address: 'Suite 101, Medical Plaza, Mumbai',
    phone: '+91 98765 43210',
    email: 'admin@medistock.com',
    gstNumber: '27AAAAA1111A1Z1',
    licenseNumber: 'DL-90210/26',
  };

  const tabs = [
    { key: 'sales', label: 'Sales Report', icon: TrendingUp },
    { key: 'purchases', label: 'Purchases Report', icon: ShoppingBag },
    { key: 'expiry', label: 'Expiry Alerts', icon: AlertTriangle },
  ];

  // --- SALES DATA COMPUTATION ---
  const getSalesData = () => {
    if (timeframe === 'monthly') {
      // Group by month
      const monthlyGroups = MONTH_NAMES.map(m => ({ month: m, revenue: 0, cost: 0, profit: 0 }));
      sales.forEach(sale => {
        const date = new Date(sale.saleDate);
        if (date.getFullYear() === new Date().getFullYear()) {
          const monthIndex = date.getMonth();
          monthlyGroups[monthIndex].revenue += sale.grandTotal || 0;
          monthlyGroups[monthIndex].cost += sale.subtotal * 0.7; // Estimate operational cost as 70%
          monthlyGroups[monthIndex].profit += (sale.grandTotal || 0) - (sale.subtotal * 0.7);
        }
      });
      return monthlyGroups;
    } else {
      // Group by day of current week
      const weeklyGroups = WEEKDAYS.map(d => ({ month: d, revenue: 0, cost: 0, profit: 0 }));
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      sales.forEach(sale => {
        const date = new Date(sale.saleDate);
        if (date >= oneWeekAgo) {
          const dayIndex = date.getDay();
          weeklyGroups[dayIndex].revenue += sale.grandTotal || 0;
          weeklyGroups[dayIndex].cost += sale.subtotal * 0.7;
          weeklyGroups[dayIndex].profit += (sale.grandTotal || 0) - (sale.subtotal * 0.7);
        }
      });
      return weeklyGroups;
    }
  };

  // --- PURCHASES DATA COMPUTATION ---
  const getPurchasesData = () => {
    if (timeframe === 'monthly') {
      const monthlyGroups = MONTH_NAMES.map(m => ({ month: m, expense: 0, items: 0 }));
      purchases.forEach(p => {
        const date = new Date(p.date);
        if (date.getFullYear() === new Date().getFullYear()) {
          const monthIndex = date.getMonth();
          monthlyGroups[monthIndex].expense += p.total || 0;
          // Count items in description (parse comma-separated items list)
          const itemsCount = p.items ? p.items.split(',').length : 0;
          monthlyGroups[monthIndex].items += itemsCount;
        }
      });
      return monthlyGroups;
    } else {
      const weeklyGroups = WEEKDAYS.map(d => ({ month: d, expense: 0, items: 0 }));
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      purchases.forEach(p => {
        const date = new Date(p.date);
        if (date >= oneWeekAgo) {
          const dayIndex = date.getDay();
          weeklyGroups[dayIndex].expense += p.total || 0;
          const itemsCount = p.items ? p.items.split(',').length : 0;
          weeklyGroups[dayIndex].items += itemsCount;
        }
      });
      return weeklyGroups;
    }
  };

  // --- TOP SELLING MEDICINES COMPUTATION ---
  const getTopSellingMedicines = () => {
    const medSalesMap = {};
    sales.forEach(sale => {
      if (sale.items) {
        sale.items.forEach(item => {
          if (!medSalesMap[item.medicineName]) {
            medSalesMap[item.medicineName] = { name: item.medicineName, units: 0, revenue: 0 };
          }
          medSalesMap[item.medicineName].units += item.quantity || 0;
          medSalesMap[item.medicineName].revenue += item.subtotal || 0;
        });
      }
    });

    return Object.values(medSalesMap)
      .sort((a, b) => b.units - a.units)
      .slice(0, 5); // Limit to top 5
  };

  // --- EXPIRY ALERTS COMPUTATION ---
  const getExpiryAlerts = () => {
    // Generate alerts for low stock medicines from database
    return medicines
      .filter(m => m.quantity < (m.minimumStock || 10))
      .map(m => ({
        name: m.medicineName,
        company: m.manufacturer || 'General',
        batch: m.medicineCode || 'N/A',
        expiry: 'Low Stock Alert',
        qty: m.quantity,
      }));
  };

  const salesData = getSalesData();
  const purchasesData = getPurchasesData();
  const topSellingMeds = getTopSellingMedicines();
  const expiryAlerts = getExpiryAlerts();

  // Structured calculations for summary
  const totalSalesRevenue = salesData.reduce((sum, r) => sum + r.revenue, 0);
  const totalSalesCost = salesData.reduce((sum, r) => sum + r.cost, 0);
  const totalSalesProfit = salesData.reduce((sum, r) => sum + r.profit, 0);

  const totalPurchasesExpense = purchasesData.reduce((sum, r) => sum + r.expense, 0);
  const totalPurchasesItems = purchasesData.reduce((sum, r) => sum + r.items, 0);

  const handlePrint = () => {
    const originalTitle = document.title;
    const reportName = `${timeframe} ${activeTab === 'sales' ? 'Sales' : activeTab === 'purchases' ? 'Purchases' : 'Expiry'} Report`;
    document.title = `${storeSettings.name} - ${reportName.replace(/\b\w/g, c => c.toUpperCase())}`;
    
    window.print();
    
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
        <span className="spinner"></span>
      </div>
    );
  }

  return (
    <div className="animate-in">
      {/* Print Only Report Header */}
      <div className="print-only print-header-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{
              width: '45px',
              height: '45px',
              borderRadius: '8px',
              background: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              color: 'white',
              fontWeight: 'bold',
              WebkitPrintColorAdjust: 'exact',
              printColorAdjust: 'exact'
            }}>
              💊
            </div>
            <div className="print-header-brand">
              <h1 style={{ margin: 0, fontSize: '26px', fontWeight: '800' }}>{storeSettings.name}</h1>
              <p className="print-header-tagline" style={{ margin: 0 }}>Premium Health Care & Stock Management System</p>
              <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#555' }}>Lic No: {storeSettings.licenseNumber} | GSTIN: {storeSettings.gstNumber}</p>
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '11px', color: '#555', lineHeight: '1.4' }}>
            <p style={{ margin: 0 }}><strong>Phone:</strong> {storeSettings.phone}</p>
            <p style={{ margin: 0 }}><strong>Email:</strong> {storeSettings.email}</p>
            <p style={{ margin: 0 }}><strong>Address:</strong> {storeSettings.address}</p>
          </div>
        </div>
        <div className="print-header-divider"></div>
        <div className="print-header-details">
          <div>
            <strong>Report Type:</strong> <span style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{timeframe} {activeTab === 'sales' ? 'Sales Activity Report' : activeTab === 'purchases' ? 'Purchases Activity Report' : 'Expiry Alerts Report'}</span>
          </div>
          <div>
            <strong>Date Generated:</strong> {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        <div className="print-header-divider" style={{ marginTop: '15px' }}></div>
      </div>

      {/* Print Only Executive Summary Boxes */}
      <div className="print-only" style={{ marginBottom: '25px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #ddd', paddingBottom: '4px' }}>
          Executive Report Summary
        </h3>
        <div style={{ display: 'flex', gap: '15px' }}>
          {activeTab === 'sales' ? (
            <>
              <div style={{ flex: 1, border: '1px solid #000', padding: '10px', borderRadius: '4px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#666', fontWeight: 600 }}>Total Revenue Generated</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '4px', color: '#000' }}>₹{totalSalesRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
              </div>
              <div style={{ flex: 1, border: '1px solid #000', padding: '10px', borderRadius: '4px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#666', fontWeight: 600 }}>Total Cost incurred</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '4px', color: '#000' }}>₹{totalSalesCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
              </div>
              <div style={{ flex: 1, border: '2px solid #000', padding: '10px', borderRadius: '4px', textAlign: 'center', background: '#f8fafc' }}>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#000', fontWeight: 'bold' }}>Net Operational Profit</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '4px', color: '#10b981' }}>₹{totalSalesProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
              </div>
            </>
          ) : activeTab === 'purchases' ? (
            <>
              <div style={{ flex: 1, border: '1px solid #000', padding: '10px', borderRadius: '4px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#666', fontWeight: 600 }}>Total Procurement Expenses</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '4px', color: '#000' }}>₹{totalPurchasesExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
              </div>
              <div style={{ flex: 1, border: '1px solid #000', padding: '10px', borderRadius: '4px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#666', fontWeight: 600 }}>Total Quantity Sourced</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '4px', color: '#000' }}>{totalPurchasesItems} items</div>
              </div>
            </>
          ) : null}
        </div>
      </div>

      {/* Tab Navigation & Actions */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                className={`btn ${activeTab === tab.key ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveTab(tab.key)}
              >
                <Icon size={16} /> {tab.label}
              </button>
            );
          })}
        </div>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {activeTab !== 'expiry' && (
            <div style={{ display: 'flex', background: 'var(--bg-elevated)', padding: '2px', borderRadius: 'var(--radius-md)' }}>
              <button 
                className={`btn btn-sm ${timeframe === 'weekly' ? 'btn-primary' : 'btn-ghost'}`} 
                onClick={() => setTimeframe('weekly')}
              >
                Weekly
              </button>
              <button 
                className={`btn btn-sm ${timeframe === 'monthly' ? 'btn-primary' : 'btn-ghost'}`} 
                onClick={() => setTimeframe('monthly')}
              >
                Monthly
              </button>
            </div>
          )}

          {activeTab !== 'expiry' && (
            <button 
              className="btn btn-secondary" 
              onClick={handlePrint}
            >
              <Printer size={16} /> Export PDF / Print
            </button>
          )}
        </div>
      </div>

      {activeTab === 'sales' && (
        <>
          {/* Revenue vs Profit Chart */}
          <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
            <div className="card-header">
              <h3 className="card-title">Revenue, Cost & Profit ({timeframe})</h3>
              <span className="badge badge-info"><Calendar size={12} /> {timeframe === 'monthly' ? 'Last Year' : 'Last 7 Days'}</span>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                  <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v.toLocaleString()}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '13px', color: '#94a3b8' }} />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Revenue" />
                  <Bar dataKey="cost" fill="#64748b" radius={[4, 4, 0, 0]} name="Cost" opacity={0.6} />
                  <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} name="Profit" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Activity Data Table */}
          <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
            <div className="card-header no-print">
              <h3 className="card-title">Detailed Sales Activity ({timeframe})</h3>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Total Revenue</th>
                  <th>Operating Cost</th>
                  <th>Net Profit</th>
                </tr>
              </thead>
              <tbody>
                {salesData.map((row, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{row.month}</td>
                    <td>₹{row.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td>₹{row.cost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>₹{row.profit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
                {/* Accounting Totals Row */}
                <tr style={{ borderTop: '2px double var(--border-color)', fontWeight: 'bold' }}>
                  <td>TOTAL SUMMARY</td>
                  <td>₹{totalSalesRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td>₹{totalSalesCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td style={{ color: '#10b981' }}>₹{totalSalesProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Top Selling Medicines */}
          <div className="card no-print">
            <div className="card-header">
              <h3 className="card-title">Top Selling Medicines</h3>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Medicine</th>
                  <th>Units Sold</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topSellingMeds.length > 0 ? (
                  topSellingMeds.map((med, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{med.name}</td>
                      <td>{med.units.toLocaleString()}</td>
                      <td style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>₹{med.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No completed sales records to show.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'purchases' && (
        <>
          {/* Purchase Expenses Chart */}
          <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
            <div className="card-header">
              <h3 className="card-title">Purchase Expense Trends ({timeframe})</h3>
              <span className="badge badge-info"><Calendar size={12} /> {timeframe === 'monthly' ? 'Last Year' : 'Last 7 Days'}</span>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={purchasesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                  <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v.toLocaleString()}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '13px', color: '#94a3b8' }} />
                  <Bar dataKey="expense" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Purchase Expense" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Purchases Data Table */}
          <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
            <div className="card-header no-print">
              <h3 className="card-title">Detailed Purchase Activity ({timeframe})</h3>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Purchase Expense</th>
                  <th>Total Items Ordered</th>
                </tr>
              </thead>
              <tbody>
                {purchasesData.map((row, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{row.month}</td>
                    <td style={{ color: 'var(--color-warning)', fontWeight: 'bold' }}>₹{row.expense.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td>{row.items} items</td>
                  </tr>
                ))}
                {/* Accounting Totals Row */}
                <tr style={{ borderTop: '2px double var(--border-color)', fontWeight: 'bold' }}>
                  <td>TOTAL SUMMARY</td>
                  <td>₹{totalPurchasesExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td>{totalPurchasesItems} items</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'expiry' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Stock Status & Low Alerts</h3>
            <span className="badge badge-warning">{expiryAlerts.length} items</span>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Medicine</th>
                <th>Manufacturer</th>
                <th>Medicine Code</th>
                <th>Quantity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {expiryAlerts.length > 0 ? (
                expiryAlerts.map((item, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{item.name}</td>
                    <td>{item.company}</td>
                    <td>{item.batch}</td>
                    <td>{item.qty}</td>
                    <td>
                      <span className="badge badge-danger">
                        Low Stock Warning
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>All medicine stock levels are healthy!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Print Only Sign-off Footers */}
      <div className="print-only" style={{ marginTop: '60px', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
        <div style={{ textAlign: 'left' }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>Prepared By: ___________________________</p>
          <p style={{ margin: '4px 0 0 0', fontSize: '10px', color: '#666' }}>Store Manager / Head Pharmacist</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>Authorized Signatory: ___________________________</p>
          <p style={{ margin: '4px 0 0 0', fontSize: '10px', color: '#666' }}>Proprietor / Director</p>
        </div>
      </div>
    </div>
  );
}
