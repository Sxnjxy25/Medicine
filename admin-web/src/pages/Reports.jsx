import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import { Calendar, TrendingUp, ShoppingBag, AlertTriangle, Printer } from 'lucide-react';
import { reportsData } from '../services/mockData';

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
          {entry.name}: ₹{entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

const weeklySalesData = [
  { month: 'Mon', revenue: 15000, cost: 10000, profit: 5000 },
  { month: 'Tue', revenue: 18000, cost: 12000, profit: 6000 },
  { month: 'Wed', revenue: 14000, cost: 9500, profit: 4500 },
  { month: 'Thu', revenue: 22000, cost: 15000, profit: 7000 },
  { month: 'Fri', revenue: 25000, cost: 17000, profit: 8000 },
  { month: 'Sat', revenue: 30000, cost: 20000, profit: 10000 },
  { month: 'Sun', revenue: 12000, cost: 8000, profit: 4000 },
];

const monthlyPurchasesData = [
  { month: 'Jan', expense: 98000, items: 120 },
  { month: 'Feb', expense: 89000, items: 110 },
  { month: 'Mar', expense: 112000, items: 140 },
  { month: 'Apr', expense: 105000, items: 130 },
  { month: 'May', expense: 118000, items: 150 },
  { month: 'Jun', expense: 114000, items: 145 },
];

const weeklyPurchasesData = [
  { month: 'Mon', expense: 12000, items: 15 },
  { month: 'Tue', expense: 8000, items: 10 },
  { month: 'Wed', expense: 15000, items: 20 },
  { month: 'Thu', expense: 22000, items: 30 },
  { month: 'Fri', expense: 5000, items: 8 },
  { month: 'Sat', expense: 0, items: 0 },
  { month: 'Sun', expense: 0, items: 0 },
];

export default function Reports() {
  const [activeTab, setActiveTab] = useState('sales');
  const [timeframe, setTimeframe] = useState('monthly'); // 'monthly' or 'weekly'

  const tabs = [
    { key: 'sales', label: 'Sales Report', icon: TrendingUp },
    { key: 'purchases', label: 'Purchases Report', icon: ShoppingBag },
    { key: 'expiry', label: 'Expiry Alerts', icon: AlertTriangle },
  ];

  const storeSettings = JSON.parse(localStorage.getItem('store_settings')) || {
    name: 'MediStock Pharmacy & Medicals',
    address: 'Suite 101, Medical Plaza, Mumbai',
    phone: '+91 98765 43210',
    email: 'admin@medistock.com',
    gstNumber: '27AAAAA1111A1Z1',
    licenseNumber: 'DL-90210/26',
  };

  const salesData = timeframe === 'monthly' ? reportsData.monthlySales : weeklySalesData;
  const purchasesData = timeframe === 'monthly' ? monthlyPurchasesData : weeklyPurchasesData;

  // Structured calculations for summary
  const totalSalesRevenue = salesData.reduce((sum, r) => sum + r.revenue, 0);
  const totalSalesCost = salesData.reduce((sum, r) => sum + r.cost, 0);
  const totalSalesProfit = salesData.reduce((sum, r) => sum + r.profit, 0);

  const totalPurchasesExpense = purchasesData.reduce((sum, r) => sum + r.expense, 0);
  const totalPurchasesItems = purchasesData.reduce((sum, r) => sum + r.items, 0);

  const handlePrint = () => {
    const originalTitle = document.title;
    // Set a clean document title that acts as the PDF file name
    const reportName = `${timeframe} ${activeTab === 'sales' ? 'Sales' : activeTab === 'purchases' ? 'Purchases' : 'Expiry'} Report`;
    document.title = `${storeSettings.name} - ${reportName.replace(/\b\w/g, c => c.toUpperCase())}`;
    
    window.print();
    
    // Delay restoring the original title to allow Chrome's print subsystem to capture it
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

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
                <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '4px', color: '#000' }}>₹{totalSalesRevenue.toLocaleString()}</div>
              </div>
              <div style={{ flex: 1, border: '1px solid #000', padding: '10px', borderRadius: '4px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#666', fontWeight: 600 }}>Total Cost incurred</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '4px', color: '#000' }}>₹{totalSalesCost.toLocaleString()}</div>
              </div>
              <div style={{ flex: 1, border: '2px solid #000', padding: '10px', borderRadius: '4px', textAlign: 'center', background: '#f8fafc' }}>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#000', fontWeight: 'bold' }}>Net Operational Profit</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '4px', color: '#10b981' }}>₹{totalSalesProfit.toLocaleString()}</div>
              </div>
            </>
          ) : activeTab === 'purchases' ? (
            <>
              <div style={{ flex: 1, border: '1px solid #000', padding: '10px', borderRadius: '4px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#666', fontWeight: 600 }}>Total Procurement Expenses</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '4px', color: '#000' }}>₹{totalPurchasesExpense.toLocaleString()}</div>
              </div>
              <div style={{ flex: 1, border: '1px solid #000', padding: '10px', borderRadius: '4px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#666', fontWeight: 600 }}>Total Quantity Sourced</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '4px', color: '#000' }}>{totalPurchasesItems} units</div>
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
              <span className="badge badge-info"><Calendar size={12} /> {timeframe === 'monthly' ? 'Last 6 months' : 'This Week'}</span>
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
                    <td>₹{row.revenue.toLocaleString()}</td>
                    <td>₹{row.cost.toLocaleString()}</td>
                    <td style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>₹{row.profit.toLocaleString()}</td>
                  </tr>
                ))}
                {/* Accounting Totals Row */}
                <tr style={{ borderTop: '2px double #000', fontWeight: 'bold', background: '#f8fafc' }}>
                  <td style={{ color: '#000' }}>TOTAL SUMMARY</td>
                  <td style={{ color: '#000' }}>₹{totalSalesRevenue.toLocaleString()}</td>
                  <td style={{ color: '#000' }}>₹{totalSalesCost.toLocaleString()}</td>
                  <td style={{ color: '#10b981' }}>₹{totalSalesProfit.toLocaleString()}</td>
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
                  <th>Company</th>
                  <th>Units Sold</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {reportsData.topSellingMedicines.map((med, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{med.name}</td>
                    <td style={{ fontWeight: 500 }}>{med.company}</td>
                    <td>{med.units.toLocaleString()}</td>
                    <td style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>₹{med.revenue.toLocaleString()}</td>
                  </tr>
                ))}
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
              <span className="badge badge-info"><Calendar size={12} /> {timeframe === 'monthly' ? 'Last 6 months' : 'This Week'}</span>
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
                    <td style={{ color: 'var(--color-warning)', fontWeight: 'bold' }}>₹{row.expense.toLocaleString()}</td>
                    <td>{row.items} units</td>
                  </tr>
                ))}
                {/* Accounting Totals Row */}
                <tr style={{ borderTop: '2px double #000', fontWeight: 'bold', background: '#f8fafc' }}>
                  <td style={{ color: '#000' }}>TOTAL SUMMARY</td>
                  <td style={{ color: '#000' }}>₹{totalPurchasesExpense.toLocaleString()}</td>
                  <td style={{ color: '#000' }}>{totalPurchasesItems} units</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'expiry' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Upcoming Expiry Alerts</h3>
            <span className="badge badge-warning">{reportsData.expiryAlerts.length} items</span>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Medicine</th>
                <th>Company</th>
                <th>Batch No</th>
                <th>Expiry Date</th>
                <th>Quantity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reportsData.expiryAlerts.map((item, i) => {
                const daysLeft = Math.ceil((new Date(item.expiry) - new Date()) / (1000 * 60 * 60 * 24));
                return (
                  <tr key={i}>
                    <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{item.name}</td>
                    <td>{item.company}</td>
                    <td>{item.batch}</td>
                    <td>{item.expiry}</td>
                    <td>{item.qty}</td>
                    <td>
                      <span className={`badge ${daysLeft < 45 ? 'badge-danger' : 'badge-warning'}`}>
                        {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
                      </span>
                    </td>
                  </tr>
                );
              })}
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
