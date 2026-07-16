// Mock data for pages that don't yet have backend endpoints

export const dashboardStats = {
  totalMedicines: 248,
  lowStockAlerts: 12,
  todaySales: 34,
  monthlyRevenue: 156420,
};

export const salesTrendData = [
  { month: 'Jan', sales: 42000, orders: 120 },
  { month: 'Feb', sales: 38500, orders: 98 },
  { month: 'Mar', sales: 51000, orders: 145 },
  { month: 'Apr', sales: 47500, orders: 132 },
  { month: 'May', sales: 62000, orders: 178 },
  { month: 'Jun', sales: 58000, orders: 165 },
  { month: 'Jul', sales: 71000, orders: 201 },
];

export const stockOverviewData = [
  { name: 'Paracetamol', stock: 450, minStock: 100 },
  { name: 'Amoxicillin', stock: 32, minStock: 50 },
  { name: 'Ibuprofen', stock: 280, minStock: 80 },
  { name: 'Metformin', stock: 15, minStock: 40 },
  { name: 'Omeprazole', stock: 190, minStock: 60 },
  { name: 'Cetirizine', stock: 410, minStock: 100 },
  { name: 'Aspirin', stock: 8, minStock: 30 },
  { name: 'Azithromycin', stock: 95, minStock: 50 },
];

export const recentActivity = [
  { id: 1, text: 'New stock of Paracetamol added — 500 units', time: '5 min ago', color: 'green' },
  { id: 2, text: 'Low stock alert: Aspirin below minimum', time: '12 min ago', color: 'red' },
  { id: 3, text: 'Invoice #1024 generated — ₹2,450', time: '25 min ago', color: 'blue' },
  { id: 4, text: 'Metformin 500mg updated by admin', time: '1 hour ago', color: 'amber' },
  { id: 5, text: 'New supplier "PharmaCorp" registered', time: '2 hours ago', color: 'green' },
  { id: 6, text: 'Monthly report generated for June', time: '3 hours ago', color: 'blue' },
];

export const billingHistory = [
  { id: 'INV-1024', customer: 'Rahul Sharma', date: '2026-07-12', items: 3, total: 2450, status: 'Paid' },
  { id: 'INV-1023', customer: 'Priya Patel', date: '2026-07-12', items: 5, total: 4890, status: 'Paid' },
  { id: 'INV-1022', customer: 'Amit Singh', date: '2026-07-11', items: 2, total: 1280, status: 'Pending' },
  { id: 'INV-1021', customer: 'Sneha Verma', date: '2026-07-11', items: 7, total: 6320, status: 'Paid' },
  { id: 'INV-1020', customer: 'Vikram Joshi', date: '2026-07-10', items: 1, total: 890, status: 'Paid' },
  { id: 'INV-1019', customer: 'Neha Gupta', date: '2026-07-10', items: 4, total: 3150, status: 'Refunded' },
];

export const purchaseHistoryData = [
  { id: 'PO-501', supplier: 'PharmaCorp India', date: '2026-07-10', items: 12, total: 45600, status: 'Delivered' },
  { id: 'PO-500', supplier: 'MedLife Supplies', date: '2026-07-08', items: 8, total: 32400, status: 'Delivered' },
  { id: 'PO-499', supplier: 'HealthPharma Ltd', date: '2026-07-05', items: 15, total: 67800, status: 'In Transit' },
  { id: 'PO-498', supplier: 'CureWell Dist.', date: '2026-07-03', items: 5, total: 18900, status: 'Delivered' },
  { id: 'PO-497', supplier: 'PharmaCorp India', date: '2026-07-01', items: 20, total: 89200, status: 'Delivered' },
  { id: 'PO-496', supplier: 'MedLife Supplies', date: '2026-06-28', items: 6, total: 24300, status: 'Cancelled' },
];

export const reportsData = {
  monthlySales: [
    { month: 'Jan', revenue: 142000, cost: 98000, profit: 44000 },
    { month: 'Feb', revenue: 128000, cost: 89000, profit: 39000 },
    { month: 'Mar', revenue: 168000, cost: 112000, profit: 56000 },
    { month: 'Apr', revenue: 155000, cost: 105000, profit: 50000 },
    { month: 'May', revenue: 182000, cost: 118000, profit: 64000 },
    { month: 'Jun', revenue: 175000, cost: 114000, profit: 61000 },
  ],
  topSellingMedicines: [
    { name: 'Paracetamol 500mg', company: 'Cipla Ltd', units: 1240, revenue: 24800 },
    { name: 'Amoxicillin 250mg', company: 'GSK India', units: 890, revenue: 53400 },
    { name: 'Cetirizine 10mg', company: 'Dr. Reddys', units: 780, revenue: 7800 },
    { name: 'Omeprazole 20mg', company: 'Sun Pharma', units: 650, revenue: 19500 },
    { name: 'Metformin 500mg', company: 'Abbott Labs', units: 580, revenue: 11600 },
  ],
  expiryAlerts: [
    { name: 'Aspirin 75mg', company: 'Bayer India', batch: 'B-2024-001', expiry: '2026-08-15', qty: 120 },
    { name: 'Ibuprofen 400mg', company: 'Abbott Labs', batch: 'B-2024-018', expiry: '2026-08-28', qty: 85 },
    { name: 'Azithromycin 500mg', company: 'Pfizer Ltd', batch: 'B-2024-032', expiry: '2026-09-10', qty: 45 },
  ],
};

export const mockCartItems = [
  { id: 1, name: 'Paracetamol 500mg', price: 20, qty: 3, gst: 5 },
  { id: 2, name: 'Amoxicillin 250mg', price: 60, qty: 2, gst: 12 },
  { id: 3, name: 'Cetirizine 10mg', price: 10, qty: 5, gst: 5 },
];
