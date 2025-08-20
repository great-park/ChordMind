import React from 'react';

interface StatisticsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: string;
  color?: string;
  description?: string;
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  color = 'primary',
  description
}) => {
  const getChangeIcon = () => {
    switch (changeType) {
      case 'positive':
        return 'bi-arrow-up';
      case 'negative':
        return 'bi-arrow-down';
      default:
        return 'bi-dash';
    }
  };

  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-success';
      case 'negative':
        return 'text-danger';
      default:
        return 'text-muted';
    }
  };

  return (
    <div className="card border-0 shadow-lg h-100" style={{
      background: 'linear-gradient(135deg, #334155 0%, #475569 100%)',
      borderRadius: '16px',
      border: '1px solid rgba(139, 92, 246, 0.15)',
      boxShadow: '0 8px 20px -5px rgba(0, 0, 0, 0.2), 0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}>
      <div className="card-body p-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-inline-flex align-items-center justify-content-center rounded-circle" 
               style={{
                 width: '48px', 
                 height: '48px',
                 background: `rgba(${color === 'primary' ? '139, 92, 246' : color === 'success' ? '34, 197, 94' : color === 'warning' ? '245, 158, 11' : '59, 130, 246'}, 0.15)`
               }}>
            <i className={`bi ${icon} fs-4`} style={{
              color: color === 'primary' ? '#a78bfa' : color === 'success' ? '#4ade80' : color === 'warning' ? '#fbbf24' : '#60a5fa'
            }} aria-hidden="true"></i>
          </div>
          {change && (
            <div className="d-flex align-items-center" style={{
              color: changeType === 'positive' ? '#10b981' : changeType === 'negative' ? '#ef4444' : '#6b7280'
            }}>
              <i className={`bi ${getChangeIcon()} me-1`} aria-hidden="true"></i>
              <small className="fw-medium">{change}</small>
            </div>
          )}
        </div>
        <h3 className="fw-bold mb-2" style={{color: 'white'}}>{value}</h3>
        <h6 className="mb-2" style={{color: '#cbd5e1'}}>{title}</h6>
        {description && (
          <p className="small mb-0" style={{color: '#94a3b8'}}>{description}</p>
        )}
      </div>
    </div>
  );
};

export default StatisticsCard; 