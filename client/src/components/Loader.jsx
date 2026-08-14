import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ message = 'Loading problems...' }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem', gap: '0.75rem', color: 'var(--text-secondary)' }}>
      <Loader2 size={32} className="animate-spin" style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
      <span style={{ fontSize: '0.9rem' }}>{message}</span>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loader;
