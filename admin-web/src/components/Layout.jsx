import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className={`main-wrapper ${collapsed ? 'collapsed' : ''}`}>
        <Navbar collapsed={collapsed} />
        <main className="main-content animate-in">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
