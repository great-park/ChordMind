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
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body p-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className={`bg-${color} bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center`} 
               style={{width: '48px', height: '48px'}}>
            <i className={`bi ${icon} text-${color} fs-4`} aria-hidden="true"></i>
          </div>
          {change && (
            <div className={`d-flex align-items-center ${getChangeColor()}`}>
              <i className={`bi ${getChangeIcon()} me-1`} aria-hidden="true"></i>
              <small className="fw-medium">{change}</small>
            </div>
          )}
        </div>
        <h3 className="fw-bold mb-2 text-white">{value}</h3>
        <h6 className="text-white-50 mb-2">{title}</h6>
        {description && (
          <p className="text-white-50 small mb-0">{description}</p>
        )}
      </div>
    </div>
  );
};

export default StatisticsCard; 