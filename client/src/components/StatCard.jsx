import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, color = 'var(--primary)', trend }) => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>{title}</span>
        {Icon && (
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-card-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
            <Icon size={18} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
        <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{value}</span>
        {subtitle && (
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{subtitle}</span>
        )}
      </div>

      {trend && (
        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          {trend}
        </div>
      )}
    </div>
  );
};

export default StatCard;
