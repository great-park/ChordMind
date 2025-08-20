import React, { useMemo } from 'react';

interface StatisticsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: string;
  color?: string;
  description?: string;
}

const StatisticsCard: React.FC<StatisticsCardProps> = React.memo(({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  color = 'primary',
  description
}) => {
  const changeIcon = useMemo(() => {
    switch (changeType) {
      case 'positive':
        return 'bi-arrow-up';
      case 'negative':
        return 'bi-arrow-down';
      default:
        return 'bi-dash';
    }
  }, [changeType]);

  const changeColor = useMemo(() => {
    switch (changeType) {
      case 'positive':
        return '#10b981';
      case 'negative':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  }, [changeType]);

  const iconBackground = useMemo(() => {
    switch (color) {
      case 'primary':
        return 'rgba(139, 92, 246, 0.15)';
      case 'success':
        return 'rgba(34, 197, 94, 0.15)';
      case 'warning':
        return 'rgba(245, 158, 11, 0.15)';
      default:
        return 'rgba(59, 130, 246, 0.15)';
    }
  }, [color]);

  const iconColor = useMemo(() => {
    switch (color) {
      case 'primary':
        return '#a78bfa';
      case 'success':
        return '#4ade80';
      case 'warning':
        return '#fbbf24';
      default:
        return '#60a5fa';
    }
  }, [color]);

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
                 background: iconBackground
               }}>
            <i className={`bi ${icon} fs-4`} style={{ color: iconColor }} aria-hidden="true"></i>
          </div>
          {change && (
            <div className="d-flex align-items-center" style={{ color: changeColor }}>
              <i className={`bi ${changeIcon} me-1`} aria-hidden="true"></i>
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
});

StatisticsCard.displayName = 'StatisticsCard';

export default StatisticsCard; 