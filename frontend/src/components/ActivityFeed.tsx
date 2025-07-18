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
    <div className="card border-0 shadow-sm h-100">
      <div className="card-header bg-transparent border-0 pb-0">
        <h6 className="fw-bold mb-0">{title}</h6>
      </div>
      <div className="card-body p-0">
        <div className="list-group list-group-flush">
          {activities.slice(0, maxItems).map((activity) => (
            <div key={activity.id} className="list-group-item border-0 px-4 py-3">
              <div className="d-flex align-items-start">
                <div className={`bg-${activity.color} bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3`} 
                     style={{width: '40px', height: '40px', minWidth: '40px'}}>
                  <i className={`bi ${activity.icon} text-${activity.color} fs-6`} aria-hidden="true"></i>
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center mb-1">
                    <h6 className="fw-medium mb-0 me-2">{activity.title}</h6>
                    <span className={`badge bg-${activity.color} bg-opacity-10 text-${activity.color} rounded-pill`}>
                      {getTypeLabel(activity.type)}
                    </span>
                  </div>
                  <p className="text-muted small mb-1">{activity.description}</p>
                  <small className="text-muted">{activity.time}</small>
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