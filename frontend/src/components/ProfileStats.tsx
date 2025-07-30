'use client'

import { useState, useEffect } from 'react';

interface UserStats {
  totalPracticeTime: number;
  totalSessions: number;
  averageSessionTime: number;
  completionRate: number;
  improvementRate: number;
  streakDays: number;
  achievements: Achievement[];
  recentActivity: Activity[];
}

interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
  category: string;
}

interface Activity {
  id: number;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  score?: number;
}

export default function ProfileStats() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockStats: UserStats = {
      totalPracticeTime: 1250, // 분 단위
      totalSessions: 45,
      averageSessionTime: 28,
      completionRate: 85,
      improvementRate: 12,
      streakDays: 7,
      achievements: [
        {
          id: 1,
          name: '첫 연습',
          description: '첫 번째 연습 세션을 완료했습니다',
          icon: '🎯',
          earnedAt: '2024-01-01T10:00:00Z',
          category: '시작'
        },
        {
          id: 2,
          name: '일주일 연속',
          description: '7일 연속으로 연습했습니다',
          icon: '🔥',
          earnedAt: '2024-01-07T15:30:00Z',
          category: '지속'
        },
        {
          id: 3,
          name: '정확도 마스터',
          description: '정확도 90% 이상을 달성했습니다',
          icon: '🎯',
          earnedAt: '2024-01-10T12:15:00Z',
          category: '기술'
        }
      ],
      recentActivity: [
        {
          id: 1,
          type: 'practice',
          title: 'C Major Scale 연습',
          description: '25분 연습 완료',
          timestamp: '2024-01-15T10:30:00Z',
          score: 86
        },
        {
          id: 2,
          type: 'achievement',
          title: '업적 획득',
          description: '정확도 마스터 업적을 획득했습니다',
          timestamp: '2024-01-10T12:15:00Z'
        },
        {
          id: 3,
          type: 'goal',
          title: '목표 달성',
          description: '일일 연습 목표를 달성했습니다',
          timestamp: '2024-01-09T20:45:00Z'
        }
      ]
    };

    setTimeout(() => {
      setStats(mockStats);
      setLoading(false);
    }, 1000);
  }, []);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}시간 ${mins}분` : `${mins}분`;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">로딩 중...</span>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="alert alert-warning" role="alert">
        통계 데이터를 불러올 수 없습니다.
      </div>
    );
  }

  return (
    <div>
      <h5 className="mb-4">학습 통계</h5>

      {/* 주요 통계 카드 */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <i className="bi bi-clock display-4"></i>
              <h4 className="mt-2">{formatTime(stats.totalPracticeTime)}</h4>
              <p className="mb-0">총 연습 시간</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <i className="bi bi-play-circle display-4"></i>
              <h4 className="mt-2">{stats.totalSessions}</h4>
              <p className="mb-0">총 연습 세션</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-info text-white">
            <div className="card-body text-center">
              <i className="bi bi-graph-up display-4"></i>
              <h4 className="mt-2">{stats.improvementRate}%</h4>
              <p className="mb-0">개선률</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-warning text-white">
            <div className="card-body text-center">
              <i className="bi bi-fire display-4"></i>
              <h4 className="mt-2">{stats.streakDays}일</h4>
              <p className="mb-0">연속 연습</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* 상세 통계 */}
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">상세 통계</h6>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-6 mb-3">
                  <div className="text-center">
                    <h5 className="text-primary">{stats.averageSessionTime}분</h5>
                    <small className="text-muted">평균 세션 시간</small>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="text-center">
                    <h5 className="text-success">{stats.completionRate}%</h5>
                    <small className="text-muted">완료율</small>
                  </div>
                </div>
              </div>
              
              <div className="progress mb-3">
                <div 
                  className="progress-bar bg-success" 
                  style={{ width: `${stats.completionRate}%` }}
                ></div>
              </div>
              
              <div className="d-flex justify-content-between">
                <small className="text-muted">목표 달성률</small>
                <small className="text-muted">{stats.completionRate}%</small>
              </div>
            </div>
          </div>
        </div>

        {/* 최근 활동 */}
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">최근 활동</h6>
            </div>
            <div className="card-body">
              {stats.recentActivity.slice(0, 3).map(activity => (
                <div key={activity.id} className="d-flex align-items-center mb-3">
                  <div className="me-3">
                    {activity.type === 'practice' && <i className="bi bi-play-circle text-primary"></i>}
                    {activity.type === 'achievement' && <i className="bi bi-trophy text-warning"></i>}
                    {activity.type === 'goal' && <i className="bi bi-target text-success"></i>}
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="mb-1">{activity.title}</h6>
                    <small className="text-muted">{activity.description}</small>
                    <br />
                    <small className="text-muted">
                      {new Date(activity.timestamp).toLocaleDateString('ko-KR')}
                    </small>
                  </div>
                  {activity.score && (
                    <div className="text-end">
                      <span className="badge bg-primary">{activity.score}%</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 업적 */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">업적</h6>
            </div>
            <div className="card-body">
              <div className="row">
                {stats.achievements.map(achievement => (
                  <div key={achievement.id} className="col-md-4 mb-3">
                    <div className="card border-0 bg-light">
                      <div className="card-body text-center">
                        <div className="display-4 mb-2">{achievement.icon}</div>
                        <h6 className="card-title">{achievement.name}</h6>
                        <p className="card-text small text-muted">{achievement.description}</p>
                        <small className="text-muted">
                          {new Date(achievement.earnedAt).toLocaleDateString('ko-KR')}
                        </small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 연습 트렌드 */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">연습 트렌드</h6>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-md-3">
                  <h5 className="text-primary">이번 주</h5>
                  <p className="text-muted">5일 연습</p>
                </div>
                <div className="col-md-3">
                  <h5 className="text-success">이번 달</h5>
                  <p className="text-muted">18일 연습</p>
                </div>
                <div className="col-md-3">
                  <h5 className="text-info">평균 점수</h5>
                  <p className="text-muted">84%</p>
                </div>
                <div className="col-md-3">
                  <h5 className="text-warning">목표 달성</h5>
                  <p className="text-muted">85%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 