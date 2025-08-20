import React from 'react';

interface ActivityItem {
  id: string;
  type: 'practice' | 'achievement' | 'feedback' | 'goal';
  title: string;
  description: string;
  time: string;
  icon: string;
  color: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  title?: string;
  maxItems?: number;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  title = '최근 활동',
  maxItems = 5
}) => {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'practice':
        return '연습';
      case 'achievement':
        return '성취';
      case 'feedback':
        return '피드백';
      case 'goal':
        return '목표';
      default:
        return '활동';
    }
  };

  return (
    <div className="card border-0 shadow-lg h-100" style={{
      background: 'linear-gradient(135deg, #334155 0%, #475569 100%)',
      borderRadius: '16px',
      border: '1px solid rgba(139, 92, 246, 0.15)',
      boxShadow: '0 8px 20px -5px rgba(0, 0, 0, 0.2), 0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}>
      <div className="card-header bg-transparent border-0 pb-0 px-4 pt-4">
        <h6 className="fw-bold mb-0" style={{color: 'white'}}>{title}</h6>
      </div>
      <div className="card-body p-0">
        <div className="list-group list-group-flush">
          {(activities || []).slice(0, maxItems).map((activity) => (
            <div key={activity.id} className="list-group-item border-0 px-4 py-3" style={{
              background: 'transparent',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div className="d-flex align-items-start">
                <div className="d-inline-flex align-items-center justify-content-center me-3 rounded-circle" 
                     style={{
                       width: '40px', 
                       height: '40px', 
                       minWidth: '40px',
                       background: `rgba(${activity.color === 'primary' ? '139, 92, 246' : activity.color === 'success' ? '34, 197, 94' : activity.color === 'warning' ? '245, 158, 11' : '59, 130, 246'}, 0.15)`
                     }}>
                  <i className={`bi ${activity.icon} fs-6`} style={{
                    color: activity.color === 'primary' ? '#a78bfa' : activity.color === 'success' ? '#4ade80' : activity.color === 'warning' ? '#fbbf24' : '#60a5fa'
                  }} aria-hidden="true"></i>
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center mb-1">
                    <h6 className="fw-medium mb-0 me-2" style={{color: 'white'}}>{activity.title}</h6>
                    <span className="badge rounded-pill" style={{
                      background: `rgba(${activity.color === 'primary' ? '139, 92, 246' : activity.color === 'success' ? '34, 197, 94' : activity.color === 'warning' ? '245, 158, 11' : '59, 130, 246'}, 0.2)`,
                      color: activity.color === 'primary' ? '#a78bfa' : activity.color === 'success' ? '#4ade80' : activity.color === 'warning' ? '#fbbf24' : '#60a5fa'
                    }}>
                      {getTypeLabel(activity.type)}
                    </span>
                  </div>
                  <p className="small mb-1" style={{color: '#cbd5e1'}}>{activity.description}</p>
                  <small style={{color: '#94a3b8'}}>{activity.time}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed; 