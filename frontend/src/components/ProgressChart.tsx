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
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body p-4">
        <h6 className="fw-bold mb-3">{title}</h6>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h3 className="fw-bold mb-1">{progress.toLocaleString()}</h3>
            <small className="text-muted">목표: {target.toLocaleString()} {unit}</small>
          </div>
          <div className="text-end">
            <h4 className={`fw-bold text-${color} mb-1`}>{percentage.toFixed(1)}%</h4>
            <small className="text-muted">달성률</small>
          </div>
        </div>
        <div className="progress mb-3" style={{height: '8px'}} role="progressbar" 
             aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}>
          <div className={`progress-bar bg-${color}`} style={{width: `${percentage}%`}}></div>
        </div>
        {description && (
          <p className="text-muted small mb-0">{description}</p>
        )}
      </div>
    </div>
  );
};

export default ProgressChart; 