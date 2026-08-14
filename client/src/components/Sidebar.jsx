import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  Code2,
  Bookmark,
  TrendingUp,
  User,
  LogOut,
  ShieldAlert,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'User Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'DSA Roadmap', path: '/roadmap', icon: Map },
    { label: 'Problems', path: '/problems', icon: Code2 },
    { label: 'Bookmarks', path: '/bookmarks', icon: Bookmark },
    { label: 'Progress', path: '/progress', icon: TrendingUp },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="brand-logo">
          <Code2 size={20} strokeWidth={2.5} />
        </div>
        <div className="brand-info">
          <h1>CodeSolver</h1>
          <p>Master DSA</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            style={{ marginLeft: 'auto', display: 'none', color: 'var(--text-secondary)' }}
            className="mobile-close-btn"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        {/* Admin Link if role === 'admin' */}
        {isAdmin && (
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
            <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 0.85rem 0.5rem' }}>
              Administration
            </span>
            <NavLink
              to="/admin"
              onClick={onClose}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              style={{ color: '#fbbf24' }}
            >
              <ShieldAlert size={18} />
              <span>Admin Dashboard</span>
            </NavLink>
          </div>
        )}
      </nav>

      <div className="sidebar-footer">
        {user && (
          <div className="user-snippet">
            <div className="user-avatar" style={{ border: isAdmin ? '1px solid #f59e0b' : undefined, color: isAdmin ? '#f59e0b' : 'var(--primary)' }}>
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="user-meta">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span className="user-name">{user.name}</span>
                {isAdmin && (
                  <span style={{ fontSize: '0.65rem', background: '#f59e0b', color: '#000', padding: '0.1rem 0.35rem', borderRadius: '4px', fontWeight: 700 }}>
                    ADMIN
                  </span>
                )}
              </div>
              <div className="user-email">{user.email}</div>
            </div>
            <button
              onClick={handleLogout}
              className="bookmark-btn"
              title="Logout"
              style={{ padding: '0.4rem' }}
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
