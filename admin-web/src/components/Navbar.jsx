import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Bell, LogOut, Sun, Moon, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import medicineService from '../services/medicineService';

const pageTitles = {
  '/': 'Dashboard',
  '/medicines': 'Medicines',
  '/medicines/add': 'Add Medicine',
  '/stock': 'Stock Management',
  '/billing': 'Billing',
  '/purchases': 'Purchase History',
  '/reports': 'Reports',
  '/settings': 'Settings',
};

export default function Navbar({ collapsed, onToggleMobile, mobileOpen }) {
  const location = useLocation();
  const { user, logout } = useAuth();

  // Match title — handle dynamic routes like /medicines/edit/:id
  let title = pageTitles[location.pathname] || 'MediStock';
  if (location.pathname.startsWith('/medicines/edit')) title = 'Update Medicine';

  const [lowStock, setLowStock] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(t => t === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    const fetchLowStock = async () => {
      try {
        const data = await medicineService.getLowStockMedicines();
        setLowStock(data);
      } catch (err) {
        console.error('Failed to fetch low stock', err);
      }
    };
    fetchLowStock();
    const interval = setInterval(fetchLowStock, 8000); // Check for low stock every 8 seconds
    return () => clearInterval(interval);
  }, []);

  const handleBellClick = async () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown) {
      try {
        const data = await medicineService.getLowStockMedicines();
        setLowStock(data);
      } catch (err) {
        console.error('Failed to fetch low stock', err);
      }
    }
  };

  return (
    <header className={`navbar ${collapsed ? 'collapsed' : ''}`}>
      <div className="navbar-left">
        <button 
          className="mobile-menu-btn"
          onClick={onToggleMobile}
          title="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <h2 className="navbar-title">{title}</h2>
      </div>

      <div className="navbar-right">
        <button 
          className="navbar-icon-btn no-print" 
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          onClick={toggleTheme}
          style={{ marginRight: '8px' }}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div style={{ position: 'relative' }}>
          <button 
            className="navbar-icon-btn" 
            title="Notifications"
            onClick={handleBellClick}
          >
            <Bell size={20} />
            {lowStock.length > 0 && <span className="navbar-badge"></span>}
          </button>
          
          {showDropdown && (
            <div style={{ 
              position: 'absolute', top: '100%', right: 0, 
              background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', 
              borderRadius: 'var(--radius-md)', padding: 'var(--space-md)', 
              width: '300px', boxShadow: 'var(--shadow-lg)', zIndex: 100 
            }}>
              <h4 style={{ margin: '0 0 var(--space-sm) 0', fontSize: 'var(--font-size-md)', color: 'var(--text-primary)' }}>Low Stock Alerts</h4>
              {lowStock.length === 0 ? (
                <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>No low stock alerts right now.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                  {lowStock.map(med => (
                    <div key={med.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                      <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>{med.medicineName}</span>
                      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-danger)' }}>{med.quantity} left</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'var(--space-md)' }}>
           <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
             <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{user?.username}</span>
             <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{user?.role}</span>
           </div>
           <div className="navbar-avatar" title={`${user?.role} Profile`}>
             {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
           </div>
           <button 
             className="btn btn-ghost btn-sm" 
             style={{ padding: '8px', marginLeft: '8px' }} 
             onClick={logout}
             title="Logout"
           >
             <LogOut size={18} />
           </button>
        </div>
      </div>
    </header>
  );
}
