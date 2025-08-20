import React from 'react';

interface ProgressChartProps {
  title: string;
  progress: number;
  target: number;
  unit: string;
  color?: string;
  description?: string;
}

const ProgressChart: React.FC<ProgressChartProps> = ({
  title,
  progress,
  target,
  unit,
  color = 'primary',
  description
}) => {
  const percentage = Math.min((progress / target) * 100, 100);

  return (
    <div className="card border-0 shadow-lg h-100" style={{
      background: 'linear-gradient(135deg, #334155 0%, #475569 100%)',
      borderRadius: '16px',
      border: '1px solid rgba(139, 92, 246, 0.15)',
      boxShadow: '0 8px 20px -5px rgba(0, 0, 0, 0.2), 0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}>
      <div className="card-body p-4">
        <h6 className="fw-bold mb-3" style={{color: 'white'}}>{title}</h6>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h3 className="fw-bold mb-1" style={{color: 'white'}}>{progress.toLocaleString()}</h3>
            <small style={{color: '#cbd5e1'}}>목표: {target.toLocaleString()} {unit}</small>
          </div>
          <div className="text-end">
            <h4 className="fw-bold mb-1" style={{
              color: color === 'primary' ? '#a78bfa' : color === 'success' ? '#4ade80' : color === 'warning' ? '#fbbf24' : '#60a5fa'
            }}>{percentage.toFixed(1)}%</h4>
            <small style={{color: '#cbd5e1'}}>달성률</small>
          </div>
        </div>
        <div className="progress mb-3" style={{height: '8px', borderRadius: '4px'}} role="progressbar" 
             aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}>
          <div className="progress-bar" style={{
            width: `${percentage}%`,
            background: color === 'primary' ? 'linear-gradient(90deg, #8b5cf6 0%, #a855f7 100%)' : 
                       color === 'success' ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)' :
                       color === 'warning' ? 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)' :
                       'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
            borderRadius: '4px'
          }}></div>
        </div>
        {description && (
          <p className="small mb-0" style={{color: '#cbd5e1'}}>{description}</p>
        )}
      </div>
    </div>
  );
};

export default ProgressChart; 