'use client'

import { useState, useEffect } from 'react';
import MainLayout from '../../components/MainLayout';
import StatisticsCard from '../../components/StatisticsCard';
import ProgressChart from '../../components/ProgressChart';
import ActivityFeed from '../../components/ActivityFeed';
import Leaderboard from '../../components/Leaderboard';
import {
  practiceService,
  AnalyticsUserSummaryResponse,
  AnalyticsUserTrendResponse,
  UserRankingResponse,
  PracticeSession
} from '../../services/practiceService';

export default function Dashboard() {
  const [userSummary, setUserSummary] = useState<AnalyticsUserSummaryResponse | null>(null);
  const [userTrend, setUserTrend] = useState<AnalyticsUserTrendResponse | null>(null);
  const [topUsers, setTopUsers] = useState<UserRankingResponse[]>([]);
  const [recentSessions, setRecentSessions] = useState<PracticeSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userId = 1; // TODO: 실제 로그인 사용자 ID로 대체

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      practiceService.getAnalyticsUserSummary(userId),
      practiceService.getAnalyticsUserTrend(userId, 'month'),
      practiceService.getTopUsers(8),
      practiceService.getUserPracticeSessions(userId, 0, 5)
    ])
      .then(([summaryRes, trendRes, topRes, sessionsRes]) => {
        if (!summaryRes.success || !trendRes.success || !topRes.success || !sessionsRes.success) {
          setError('대시보드 데이터를 불러오지 못했습니다.');
        } else {
          setUserSummary(summaryRes.data!);
          setUserTrend(trendRes.data!);
          setTopUsers(topRes.data!);
          setRecentSessions(sessionsRes.data!.sessions || []);
        }
      })
      .catch(() => setError('대시보드 데이터를 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">로딩 중...</span>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container-fluid">
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="h3 mb-0">대시보드</h1>
            <p className="text-muted">당신의 음악 학습 진행 상황을 한눈에 확인하세요</p>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="row mb-4">
          {userSummary && (
            <>
              <div className="col-xl-3 col-md-6 mb-4">
                <StatisticsCard
                  title="총 연습 시간"
                  value={`${Math.floor(userSummary.totalPracticeTime / 60)}시간 ${userSummary.totalPracticeTime % 60}분`}
                  change={`+${Math.floor(userSummary.totalPracticeTime * 0.1 / 60)}시간`}
                  icon="bi-clock"
                  color="primary"
                />
              </div>
              <div className="col-xl-3 col-md-6 mb-4">
                <StatisticsCard
                  title="완료된 세션"
                  value={`${userSummary.completedSessions}개`}
                  change={`전체 ${userSummary.totalSessions}개 중`}
                  icon="bi-calendar-check"
                  color="success"
                />
              </div>
              <div className="col-xl-3 col-md-6 mb-4">
                <StatisticsCard
                  title="평균 점수"
                  value={`${userSummary.averageScore.toFixed(1)}%`}
                  change={userSummary.averageScore > 80 ? "+좋음" : "향상 필요"}
                  icon="bi-target"
                  color="info"
                />
              </div>
              <div className="col-xl-3 col-md-6 mb-4">
                <StatisticsCard
                  title="최근 목표"
                  value={`${userSummary.recentGoals.length}개`}
                  change={userSummary.recentGoals.length > 0 ? userSummary.recentGoals[0] : "목표 없음"}
                  icon="bi-fire"
                  color="warning"
                />
              </div>
            </>
          )}
        </div>

        <div className="row">
          {/* 진행 상황 차트 */}
          <div className="col-xl-8 col-lg-7">
            <div className="card shadow mb-4">
              <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <h6 className="m-0 font-weight-bold text-primary">학습 진행 상황</h6>
              </div>
              <div className="card-body">
                {userSummary && (
                  <ProgressChart
                    title="학습 진행률"
                    progress={userSummary.completedSessions}
                    target={userSummary.totalSessions}
                    unit="세션"
                    color="primary"
                    description="완료된 연습 세션 수"
                  />
                )}
              </div>
            </div>
          </div>

          {/* 활동 피드 */}
          <div className="col-xl-4 col-lg-5">
            <div className="card shadow mb-4">
              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">최근 활동</h6>
              </div>
              <div className="card-body">
                <ActivityFeed 
                  activities={recentSessions.map((session, index) => ({
                    id: session.id.toString(),
                    type: 'practice',
                    title: '연습 세션 완료',
                    description: `${session.title} - ${session.duration}분 연습`,
                    time: new Date(session.updatedAt).toLocaleDateString('ko-KR', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }),
                    icon: 'bi-music-note',
                    color: session.overall >= 80 ? 'success' : session.overall >= 60 ? 'primary' : 'warning'
                  }))}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 리더보드 */}
        <div className="row">
          <div className="col-12">
            <div className="card shadow mb-4">
              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">리더보드</h6>
              </div>
              <div className="card-body">
                <Leaderboard 
                  items={topUsers.map(user => ({
                    id: user.userId.toString(),
                    rank: user.rank,
                    name: user.username,
                    score: user.score,
                    category: user.category
                  }))}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 