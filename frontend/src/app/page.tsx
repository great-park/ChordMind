'use client'

import { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import StatisticsCard from '../components/StatisticsCard';
import ProgressChart from '../components/ProgressChart';
import ActivityFeed from '../components/ActivityFeed';
import Leaderboard from '../components/Leaderboard';
import { 
  TRENDING_KEYWORDS, 
  RECENT_KEYWORDS, 
  FEATURES, 
  REVIEWS 
} from '../constants/data';
import { STATISTICS_DATA } from '../constants/statistics';
import {
  getAnalyticsUserSummary,
  getAnalyticsUserTrend,
  getTopUsers,
  AnalyticsUserSummaryResponse,
  AnalyticsUserTrendResponse,
  UserRankingResponse
} from '../services/practiceService';

function QuizWidget() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    // 임시 퀴즈 데이터
    const mockQuestions = [
      {
        id: 1,
        question: 'C Major Scale의 첫 번째 음은?',
        choices: ['C', 'D', 'E', 'F'],
        correct: 'C'
      }
    ];
    setQuestions(mockQuestions);
    setLoading(false);
  }, []);

  const handleSelect = (choice: string) => {
    setSelected(choice);
  };

  const handleSubmit = async () => {
    if (!questions[current] || !selected) return;
    setLoading(true);
    try {
      // 임시 결과
      const isCorrect = selected === questions[current].correct;
      setResult({ correct: isCorrect, explanation: isCorrect ? '정답입니다!' : '틀렸습니다.' });
    } catch {
      setError('정답 제출에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>퀴즈 로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (!questions.length) return <div>퀴즈가 없습니다.</div>;

  const q = questions[current];

  return (
    <div className="card shadow mb-4">
      <div className="card-header">
        <h5 className="mb-0">오늘의 퀴즈</h5>
      </div>
      <div className="card-body">
        <div className="mb-3">{q.question}</div>
        <div className="mb-3">
          {q.choices.map((choice: string) => (
            <button
              key={choice}
              onClick={() => handleSelect(choice)}
              className={`btn me-2 mb-2 ${
                selected === choice ? 'btn-primary' : 'btn-outline-primary'
              }`}
              disabled={!!result}
            >
              {choice}
            </button>
          ))}
        </div>
        {!result && (
          <button 
            onClick={handleSubmit} 
            disabled={!selected} 
            className="btn btn-success"
          >
            정답 제출
          </button>
        )}
        {result && (
          <div className={`alert ${result.correct ? 'alert-success' : 'alert-danger'}`}>
            {result.explanation}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [userSummary, setUserSummary] = useState<AnalyticsUserSummaryResponse | null>(null);
  const [userTrend, setUserTrend] = useState<AnalyticsUserTrendResponse | null>(null);
  const [topUsers, setTopUsers] = useState<UserRankingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userId = 1; // TODO: 실제 로그인 사용자 ID로 대체

  useEffect(() => {
    setIsVisible(true);
    setLoading(true);
    setError(null);
    Promise.all([
      getAnalyticsUserSummary(userId),
      getAnalyticsUserTrend(userId, 'month'),
      getTopUsers(8)
    ])
      .then(([summaryRes, trendRes, topRes]) => {
        if (!summaryRes.success || !trendRes.success || !topRes.success) {
          setError('통계 데이터를 불러오지 못했습니다.');
        } else {
          setUserSummary(summaryRes.data!);
          setUserTrend(trendRes.data!);
          setTopUsers(topRes.data!);
        }
      })
      .catch(() => setError('통계 데이터를 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <MainLayout>
      <div className="row">
        {/* 퀴즈 위젯 */}
        <div className="col-lg-4 mb-4">
          <QuizWidget />
        </div>

        {/* 통계 카드 */}
        <div className="col-lg-8 mb-4">
          <div className="row">
            {STATISTICS_DATA.map((stat, index) => (
              <div key={index} className="col-md-6 mb-3">
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
        </div>
      </div>

      {/* 히어로 섹션 */}
      <section 
        className={`hero-section mb-5 fade-in ${isVisible ? 'visible' : ''}`}
        aria-labelledby="hero-title"
      >
        <div className="row align-items-center">
          <div className="col-lg-6">
            <h1 id="hero-title" className="display-4 fw-bold text-dark mb-4">
              AI와 함께하는<br />
              <span className="text-primary">음악 연주 분석</span>
            </h1>
            <p className="lead text-muted mb-4">
              실시간으로 연주를 분석하고, 맞춤형 피드백과 성장 과정을 확인하세요.<br />
              박자, 음정, 코드, 리듬까지 AI가 정확하게 분석해드립니다.
            </p>
            <div className="d-flex gap-3">
              <a href="/practice" className="btn btn-primary btn-lg">
                연습 시작하기
              </a>
              <a href="/dashboard" className="btn btn-outline-primary btn-lg">
                대시보드 보기
              </a>
            </div>
          </div>
          <div className="col-lg-6 text-center">
            <div className="bg-gradient-primary rounded-3 p-5 shadow-lg">
              <i className="bi bi-music-note-beamed display-1 text-white" aria-hidden="true"></i>
              <p className="text-white mt-3">AI Music Analysis</p>
            </div>
          </div>
        </div>
      </section>

      {/* 주요 기능 카드 */}
      <section 
        className={`mb-5 fade-in ${isVisible ? 'visible' : ''}`}
        id="features" 
        aria-labelledby="features-title"
        style={{ animationDelay: '0.1s' }}
      >
        <h2 id="features-title" className="text-center mb-5">주요 기능</h2>
        <div className="row g-4">
          {FEATURES.map((feature, index) => (
            <div key={index} className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm hover-shadow">
                <div className="card-body text-center p-4">
                  <div className="display-6 mb-3" role="img" aria-label={feature.title}>
                    {feature.icon}
                  </div>
                  <h5 className="card-title fw-bold mb-3">{feature.title}</h5>
                  <p className="card-text text-muted">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 진행 상황 및 활동 */}
      <div className="row mb-5">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-header">
              <h5 className="mb-0">학습 진행 상황</h5>
            </div>
            <div className="card-body">
              {userTrend && <ProgressChart data={userTrend} />}
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card shadow">
            <div className="card-header">
              <h5 className="mb-0">최근 활동</h5>
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
          <div className="card shadow">
            <div className="card-header">
              <h5 className="mb-0">리더보드</h5>
            </div>
            <div className="card-body">
              <Leaderboard users={topUsers} />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 