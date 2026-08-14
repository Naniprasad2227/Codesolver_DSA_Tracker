import React from 'react';

const ProgressBar = ({ value = 0, max = 100, height = 8, color, showText = false, glow = false }) => {
  const percentage = max > 0 ? Math.min(100, Math.max(0, Math.round((value / max) * 100))) : 0;

  return (
    <div className="progress-bar-container">
      {showText && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <span>{value} / {max} Solved</span>
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{percentage}%</span>
        </div>
      )}
      <div className="progress-bar-track" style={{ height: `${height}px` }}>
        <div
          className={`progress-bar-fill ${glow ? 'glow' : ''}`}
          style={{
            width: `${percentage}%`,
            background: color ? color : undefined
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
