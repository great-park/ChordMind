'use client'

import React, { useState, useEffect, useMemo } from 'react';

interface ProfileStats {
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

const ProfileStats: React.FC = () => {
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockStats: ProfileStats = {
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

  // 계산 비용이 큰 로직을 useMemo로 최적화
  const formattedStats = useMemo(() => {
    if (!stats) return null;

    const formatTime = (minutes: number) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return hours > 0 ? `${hours}시간 ${mins}분` : `${mins}분`;
    };

    return {
      totalTimeFormatted: formatTime(stats.totalPracticeTime),
      averageTimeFormatted: formatTime(stats.averageSessionTime),
      achievementsByCategory: stats.achievements.reduce((acc, achievement) => {
        if (!acc[achievement.category]) {
          acc[achievement.category] = [];
        }
        acc[achievement.category].push(achievement);
        return acc;
      }, {} as Record<string, Achievement[]>)
    };
  }, [stats]);

  const getActivityIcon = useMemo(() => (type: string) => {
    switch (type) {
      case 'practice':
        return <i className="bi bi-play-circle text-primary"></i>;
      case 'achievement':
        return <i className="bi bi-trophy text-warning"></i>;
      case 'goal':
        return <i className="bi bi-target text-success"></i>;
      default:
        return <i className="bi bi-info-circle text-info"></i>;
    }
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">로딩 중...</span>
        </div>
        <p className="mt-3">프로필 통계를 불러오는 중...</p>
      </div>
    );
  }

  if (!stats || !formattedStats) {
    return (
      <div className="text-center py-5">
        <p>프로필 통계를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="profile-stats">
      {/* 주요 통계 카드들 */}
      <div className="row mb-4">
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <div className="stats-icon mb-3">
                <i className="bi bi-clock-history text-primary fs-1"></i>
              </div>
              <h4 className="card-title text-primary">{formattedStats.totalTimeFormatted}</h4>
              <p className="card-text">총 연습 시간</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <div className="stats-icon mb-3">
                <i className="bi bi-music-note-list text-success fs-1"></i>
              </div>
              <h4 className="card-title text-success">{stats.totalSessions}</h4>
              <p className="card-text">총 연습 세션</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <div className="stats-icon mb-3">
                <i className="bi bi-graph-up text-info fs-1"></i>
              </div>
              <h4 className="card-title text-info">{stats.completionRate}%</h4>
              <p className="card-text">완료율</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <div className="stats-icon mb-3">
                <i className="bi bi-fire text-danger fs-1"></i>
              </div>
              <h4 className="card-title text-danger">{stats.streakDays}일</h4>
              <p className="card-text">연속 연습</p>
            </div>
          </div>
        </div>
      </div>

      {/* 업적 및 활동 섹션 */}
      <div className="row">
        {/* 업적 섹션 */}
        <div className="col-lg-6 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-trophy text-warning me-2"></i>
                획득한 업적
              </h5>
            </div>
            <div className="card-body">
              <div className="achievements-list">
                {stats.achievements.map((achievement) => (
                  <div key={achievement.id} className="achievement-item d-flex align-items-center mb-3">
                    <div className="achievement-icon me-3">
                      <span className="fs-2">{achievement.icon}</span>
                    </div>
                    <div className="achievement-info flex-grow-1">
                      <h6 className="mb-1">{achievement.name}</h6>
                      <p className="mb-1 small text-muted">{achievement.description}</p>
                      <small className="text-muted">
                        {new Date(achievement.earnedAt).toLocaleDateString('ko-KR')}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 최근 활동 섹션 */}
        <div className="col-lg-6 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-activity text-info me-2"></i>
                최근 활동
              </h5>
            </div>
            <div className="card-body">
              <div className="activity-list">
                {stats.recentActivity.map((activity) => (
                  <div key={activity.id} className="activity-item d-flex align-items-start mb-3">
                    <div className="activity-icon me-3 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="activity-info flex-grow-1">
                      <h6 className="mb-1">{activity.title}</h6>
                      <p className="mb-1 small text-muted">{activity.description}</p>
                      <small className="text-muted">
                        {new Date(activity.timestamp).toLocaleDateString('ko-KR')}
                      </small>
                      {activity.score && (
                        <span className="badge bg-primary ms-2">{activity.score}점</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileStats; 