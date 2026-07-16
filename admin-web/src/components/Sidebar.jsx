import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Pill,
  Package,
  Receipt,
  ShoppingCart,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { section: 'Main' },
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/medicines', label: 'Medicines', icon: Pill },
  { path: '/stock', label: 'Stock', icon: Package },
  { section: 'Transactions' },
  { path: '/billing', label: 'Billing', icon: Receipt },
  { path: '/purchases', label: 'Purchase History', icon: ShoppingCart },
  { section: 'Analytics' },
  { path: '/reports', label: 'Reports', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();
  const { user } = useAuth();

  // Filter navigation items based on user role
  const filteredNavItems = navItems.filter((item) => {
    if (user?.role === 'ADMIN') {
      // Hide Billing for admin accounts
      if (item.path === '/billing') {
        return false;
      }
    }
    if (user?.role === 'STAFF') {
      // Hide Purchases, Reports, Settings, and Analytics section labels for staff accounts
      if (item.path === '/purchases' || item.path === '/reports' || item.path === '/settings') {
        return false;
      }
      if (item.section === 'Analytics') {
        return false;
      }
    }
    return true;
  });

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">💊</div>
        <div className="sidebar-brand">
          <h1>MediStock</h1>
          <span>{user?.role === 'STAFF' ? 'Staff Panel' : 'Admin Panel'}</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {filteredNavItems.map((item, index) => {
          if (item.section) {
            return (
              <div key={index} className="sidebar-section-label">
                {item.section}
              </div>
            );
          }
          const Icon = item.icon;
          const isActive =
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} className="nav-link-icon" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-toggle">
        <button onClick={onToggle}>
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
