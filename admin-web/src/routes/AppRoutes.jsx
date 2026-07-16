import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Medicines from '../pages/Medicines';
import AddMedicine from '../pages/AddMedicine';
import UpdateMedicine from '../pages/UpdateMedicine';
import Stock from '../pages/Stock';
import Billing from '../pages/Billing';
import PurchaseHistory from '../pages/PurchaseHistory';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';

// ProtectedRoute component checks if user is logged in
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; // Redirect to dashboard if not authorized
  }

  return children;
};

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes wrapped in Layout */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/medicines" element={<Medicines />} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/billing" element={<ProtectedRoute allowedRoles={['STAFF']}><Billing /></ProtectedRoute>} />
        <Route path="/purchases" element={<ProtectedRoute allowedRoles={['ADMIN']}><PurchaseHistory /></ProtectedRoute>} />
        
        {/* Admin only routes (optional example) */}
        <Route path="/medicines/add" element={<ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}><AddMedicine /></ProtectedRoute>} />
        <Route path="/medicines/edit/:id" element={<UpdateMedicine />} />
        <Route path="/reports" element={<ProtectedRoute allowedRoles={['ADMIN']}><Reports /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute allowedRoles={['ADMIN']}><Settings /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}
