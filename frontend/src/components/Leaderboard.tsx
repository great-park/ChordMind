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
    if (rank === 1) return 'bg-warning text-dark';
    if (rank === 2) return 'bg-secondary text-white';
    if (rank === 3) return 'bg-danger text-white';
    return 'bg-light text-dark';
  };

  const getChangeIcon = (change?: number) => {
    if (!change) return null;
    if (change > 0) return <i className="bi bi-arrow-up text-success" aria-hidden="true"></i>;
    if (change < 0) return <i className="bi bi-arrow-down text-danger" aria-hidden="true"></i>;
    return <i className="bi bi-dash text-muted" aria-hidden="true"></i>;
  };

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-header bg-transparent border-0 pb-0">
        <h6 className="fw-bold mb-0">{title}</h6>
      </div>
      <div className="card-body p-0">
        <div className="list-group list-group-flush">
          {items.slice(0, maxItems).map((item) => (
            <div key={item.id} className="list-group-item border-0 px-4 py-3">
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <span className={`badge ${getRankBadge(item.rank)} rounded-pill`} style={{width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    {item.rank}
                  </span>
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center">
                    {item.avatar ? (
                      <img src={item.avatar} alt={item.name} className="rounded-circle me-2" style={{width: '32px', height: '32px'}} />
                    ) : (
                      <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-2" style={{width: '32px', height: '32px'}}>
                        <span className="text-primary fw-bold">{item.name[0]}</span>
                      </div>
                    )}
                    <div className="flex-grow-1">
                      <h6 className="fw-medium mb-0">{item.name}</h6>
                      <small className="text-muted">{item.category}</small>
                    </div>
                    <div className="text-end">
                      <div className="d-flex align-items-center">
                        <span className="fw-bold me-2">{item.score.toLocaleString()}</span>
                        {getChangeIcon(item.change)}
                      </div>
                      {item.change && (
                        <small className={`${item.change > 0 ? 'text-success' : item.change < 0 ? 'text-danger' : 'text-muted'}`}>
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