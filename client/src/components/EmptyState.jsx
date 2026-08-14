import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({ icon: Icon = Inbox, title = 'No problems found', description = 'Try changing your search keywords or filter criteria.', action }) => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3.5rem 1.5rem', textAlign: 'center', gap: '0.75rem' }}>
      <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--bg-card-secondary)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
        <Icon size={26} />
      </div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{title}</h3>
      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '380px' }}>{description}</p>
      {action && <div style={{ marginTop: '0.75rem' }}>{action}</div>}
    </div>
  );
};

export default EmptyState;
