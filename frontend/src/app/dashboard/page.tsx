'use client'

import { useState, useEffect } from 'react';
import MainLayout from '../../components/MainLayout';
import StatisticsCard from '../../components/StatisticsCard';
import ProgressChart from '../../components/ProgressChart';
import ActivityFeed from '../../components/ActivityFeed';
import Leaderboard from '../../components/Leaderboard';
import { STATISTICS_DATA } from '../../constants/statistics';
import {
  getAnalyticsUserSummary,
  getAnalyticsUserTrend,
  getTopUsers,
  AnalyticsUserSummaryResponse,
  AnalyticsUserTrendResponse,
  UserRankingResponse
} from '../../services/practiceService';

export default function Dashboard() {
  const [userSummary, setUserSummary] = useState<AnalyticsUserSummaryResponse | null>(null);
  const [userTrend, setUserTrend] = useState<AnalyticsUserTrendResponse | null>(null);
  const [topUsers, setTopUsers] = useState<UserRankingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userId = 1; // TODO: 실제 로그인 사용자 ID로 대체

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      getAnalyticsUserSummary(userId),
      getAnalyticsUserTrend(userId, 'month'),
      getTopUsers(8)
    ])
      .then(([summaryRes, trendRes, topRes]) => {
        if (!summaryRes.success || !trendRes.success || !topRes.success) {
          setError('대시보드 데이터를 불러오지 못했습니다.');
        } else {
          setUserSummary(summaryRes.data!);
          setUserTrend(trendRes.data!);
          setTopUsers(topRes.data!);
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
          {STATISTICS_DATA.map((stat, index) => (
            <div key={index} className="col-xl-3 col-md-6 mb-4">
              <StatisticsCard
                title={stat.title}
                value={stat.value}
                change={stat.change}
                icon={stat.icon}
                color={stat.color}
              />
            </div>
          ))}
        </div>

        <div className="row">
          {/* 진행 상황 차트 */}
          <div className="col-xl-8 col-lg-7">
            <div className="card shadow mb-4">
              <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <h6 className="m-0 font-weight-bold text-primary">학습 진행 상황</h6>
              </div>
              <div className="card-body">
                {userTrend && <ProgressChart data={userTrend} />}
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
                <ActivityFeed />
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
                <Leaderboard users={topUsers} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 