import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar 
        collapsed={collapsed} 
        onToggle={() => setCollapsed(!collapsed)} 
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      {mobileOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 95
          }}
        />
      )}
      <div className={`main-wrapper ${collapsed ? 'collapsed' : ''}`}>
        <Navbar 
          collapsed={collapsed} 
          onToggleMobile={() => setMobileOpen(!mobileOpen)}
          mobileOpen={mobileOpen}
        />
        <main className="main-content animate-in">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
