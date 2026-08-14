import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { Menu, Code2 } from 'lucide-react';

const Layout = () => {
  const { isAuthenticated, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="brand-logo" style={{ width: '48px', height: '48px', margin: '0 auto 1rem' }}>
            <Code2 size={28} />
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Loading CodeSolver...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-container">
      {/* Mobile Backdrop */}
      <div
        className={`mobile-overlay ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Sidebar */}
      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main Content Area */}
      <div className="main-content">
        {/* Mobile Top Navbar */}
        <header className="mobile-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => setMobileMenuOpen(true)}
              style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center' }}
              aria-label="Open navigation menu"
            >
              <Menu size={22} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className="brand-logo" style={{ width: '28px', height: '28px' }}>
                <Code2 size={16} />
              </div>
              <span style={{ fontWeight: 700, fontSize: '1rem' }}>CodeSolver</span>
            </div>
          </div>
        </header>

        <main className="page-wrapper">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
