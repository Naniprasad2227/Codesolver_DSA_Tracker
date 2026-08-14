import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Mail, Calendar, LogOut, ShieldCheck, ShieldAlert } from 'lucide-react';

const Profile = () => {
  const { user, logout, isAdmin } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.info('Logged out successfully');
    navigate('/login');
  };

  const joinDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Recent Member';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '800px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--primary)', marginBottom: '0.35rem' }}>
          <User size={20} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Account Management
          </span>
        </div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
          User Profile
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '0.2rem' }}>
          Manage your personal account credentials and session.
        </p>
      </div>

      {/* Profile Card */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: isAdmin
                ? 'linear-gradient(135deg, #f59e0b, #ef4444)'
                : 'linear-gradient(135deg, var(--primary), #818cf8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.75rem',
              fontWeight: 700,
              color: 'white',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff' }}>
                {user?.name || 'Developer'}
              </h2>
              <span className={`badge ${isAdmin ? 'badge-hard' : 'badge-easy'}`}>
                {user?.role ? user.role.toUpperCase() : 'USER'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '0.2rem' }}>
              <Mail size={14} />
              <span>{user?.email}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem', background: 'var(--bg-card-secondary)', borderRadius: 'var(--radius-md)' }}>
            <Calendar size={18} color="var(--primary)" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Member Since</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>{joinDate}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem', background: 'var(--bg-card-secondary)', borderRadius: 'var(--radius-md)' }}>
            <ShieldCheck size={18} color="var(--easy)" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Account Privileges</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>
                {isAdmin ? 'Full Platform Administrator' : 'Standard Problem Solver'}
              </div>
            </div>
          </div>
        </div>

        <div style={{ paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <button
            onClick={handleLogout}
            className="btn btn-danger"
            style={{ padding: '0.65rem 1.25rem' }}
          >
            <LogOut size={16} />
            <span>Sign Out of CodeSolver</span>
          </button>

          {isAdmin && (
            <Link to="/admin" className="btn btn-primary" style={{ background: '#f59e0b', color: '#000', fontWeight: 700 }}>
              <ShieldAlert size={16} />
              <span>Open Admin Dashboard</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
