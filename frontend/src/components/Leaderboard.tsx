import React from 'react';

interface LeaderboardItem {
  id: string;
  rank: number;
  name: string;
  avatar?: string;
  score: number;
  change?: number;
  category: string;
}

interface LeaderboardProps {
  items: LeaderboardItem[];
  title?: string;
  maxItems?: number;
}

const Leaderboard: React.FC<LeaderboardProps> = ({
  items,
  title = '랭킹',
  maxItems = 10
}) => {
  const getRankBadge = (rank: number) => {
    if (rank === 1) return { background: '#fbbf24', color: '#92400e' };
    if (rank === 2) return { background: '#6b7280', color: 'white' };
    if (rank === 3) return { background: '#ef4444', color: 'white' };
    return { background: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa' };
  };

  const getChangeIcon = (change?: number) => {
    if (!change) return null;
    if (change > 0) return <i className="bi bi-arrow-up" style={{color: '#10b981'}} aria-hidden="true"></i>;
    if (change < 0) return <i className="bi bi-arrow-down" style={{color: '#ef4444'}} aria-hidden="true"></i>;
    return <i className="bi bi-dash" style={{color: '#6b7280'}} aria-hidden="true"></i>;
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
          {(items || []).slice(0, maxItems).map((item) => (
            <div key={item.id} className="list-group-item border-0 px-4 py-3" style={{
              background: 'transparent',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <span className="badge rounded-pill" style={{
                    width: '32px', 
                    height: '32px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    background: getRankBadge(item.rank).background,
                    color: getRankBadge(item.rank).color
                  }}>
                    {item.rank}
                  </span>
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center">
                    {item.avatar ? (
                      <img src={item.avatar} alt={item.name} className="rounded-circle me-2" style={{width: '32px', height: '32px'}} />
                    ) : (
                      <div className="rounded-circle d-flex align-items-center justify-content-center me-2" style={{
                        width: '32px', 
                        height: '32px',
                        background: 'rgba(139, 92, 246, 0.15)'
                      }}>
                        <span className="fw-bold" style={{color: '#a78bfa'}}>{item.name[0]}</span>
                      </div>
                    )}
                    <div className="flex-grow-1">
                      <h6 className="fw-medium mb-0" style={{color: 'white'}}>{item.name}</h6>
                      <small style={{color: '#cbd5e1'}}>{item.category}</small>
                    </div>
                    <div className="text-end">
                      <div className="d-flex align-items-center">
                        <span className="fw-bold me-2" style={{color: 'white'}}>{item.score.toLocaleString()}</span>
                        {getChangeIcon(item.change)}
                      </div>
                      {item.change && (
                        <small style={{
                          color: item.change > 0 ? '#10b981' : item.change < 0 ? '#ef4444' : '#6b7280'
                        }}>
                          {item.change > 0 ? '+' : ''}{item.change}
                        </small>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard; 