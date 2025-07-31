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
import { practiceService } from '../services/practiceService';
import type { 
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
      practiceService.getAnalyticsUserSummary(userId),
      practiceService.getAnalyticsUserTrend(userId, 'month'),
      practiceService.getTopUsers(8)
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
        <div className="particles">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="particle" 
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${4 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="mb-3">
              <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">
                🎵 AI 기반 음악 학습 플랫폼
              </span>
            </div>
            <h1 id="hero-title" className="display-4 fw-bold mb-4">
              음악의 새로운 차원<br />
              <span className="text-primary">ChordMind</span>와 함께
            </h1>
            <p className="lead mb-4">
              최첨단 AI 기술로 당신의 연주를 실시간 분석하고,<br />
              개인화된 피드백으로 <strong>더 빠른 성장</strong>을 경험하세요.<br />
              <span className="text-primary">박자·음정·화성·표현력</span>까지 완벽하게!
            </p>
            <div className="d-flex flex-wrap gap-3 mb-4">
              <a href="/practice" className="btn btn-primary btn-lg px-4">
                <i className="bi bi-play-circle me-2"></i>
                지금 시작하기
              </a>
              <a href="/dashboard" className="btn btn-outline-primary btn-lg px-4">
                <i className="bi bi-graph-up me-2"></i>
                성과 확인하기
              </a>
            </div>
            <div className="d-flex align-items-center gap-4 text-muted">
              <div className="d-flex align-items-center">
                <i className="bi bi-star-fill text-warning me-1"></i>
                <span>4.9/5 평점</span>
              </div>
              <div className="d-flex align-items-center">
                <i className="bi bi-people-fill text-success me-1"></i>
                <span>10,000+ 사용자</span>
              </div>
              <div className="d-flex align-items-center">
                <i className="bi bi-lightning-fill text-info me-1"></i>
                <span>실시간 분석</span>
              </div>
            </div>
          </div>
          <div className="col-lg-6 text-center">
            <div className="position-relative">
              <div className="bg-gradient-primary rounded-4 p-5 shadow-lg position-relative">
                <div className="d-flex justify-content-center mb-4">
                  <div className="position-relative">
                    <i className="bi bi-vinyl display-1 text-white" aria-hidden="true" style={{animation: 'spin 10s linear infinite'}}></i>
                    <div className="position-absolute top-50 start-50 translate-middle">
                      <i className="bi bi-music-note-beamed fs-1 text-white"></i>
                    </div>
                  </div>
                </div>
                <h4 className="text-white mb-3">AI Music Intelligence</h4>
                <div className="row g-2 text-white">
                  <div className="col-6">
                    <div className="bg-white bg-opacity-10 rounded-3 p-2">
                      <i className="bi bi-cpu mb-1"></i>
                      <div className="small">실시간 AI</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="bg-white bg-opacity-10 rounded-3 p-2">
                      <i className="bi bi-graph-up-arrow mb-1"></i>
                      <div className="small">성장 추적</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="bg-white bg-opacity-10 rounded-3 p-2">
                      <i className="bi bi-palette mb-1"></i>
                      <div className="small">맞춤 피드백</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="bg-white bg-opacity-10 rounded-3 p-2">
                      <i className="bi bi-award mb-1"></i>
                      <div className="small">목표 달성</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* 플로팅 카드들 */}
              <div className="position-absolute" style={{top: '10%', left: '-10%', animation: 'float 3s ease-in-out infinite'}}>
                <div className="card border-0 shadow-sm" style={{width: '80px', height: '60px'}}>
                  <div className="card-body d-flex align-items-center justify-content-center p-2">
                    <i className="bi bi-heart-fill text-danger"></i>
                  </div>
                </div>
              </div>
              <div className="position-absolute" style={{top: '20%', right: '-5%', animation: 'float 3s ease-in-out infinite 1s'}}>
                <div className="card border-0 shadow-sm" style={{width: '80px', height: '60px'}}>
                  <div className="card-body d-flex align-items-center justify-content-center p-2">
                    <i className="bi bi-trophy-fill text-warning"></i>
                  </div>
                </div>
              </div>
              <div className="position-absolute" style={{bottom: '15%', left: '5%', animation: 'float 3s ease-in-out infinite 2s'}}>
                <div className="card border-0 shadow-sm" style={{width: '80px', height: '60px'}}>
                  <div className="card-body d-flex align-items-center justify-content-center p-2">
                    <i className="bi bi-lightning-fill text-primary"></i>
                  </div>
                </div>
              </div>
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
        <div className="text-center mb-5">
          <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill mb-3">
            ✨ 혁신적인 기능들
          </span>
          <h2 id="features-title" className="display-5 fw-bold mb-3">
            AI가 만드는 <span className="text-primary">음악 학습의 미래</span>
          </h2>
          <p className="lead text-muted">
            첨단 기술과 음악 교육의 완벽한 만남으로 당신의 연주 실력을 한 단계 끌어올리세요
          </p>
        </div>
        <div className="row g-4">
          {FEATURES.map((feature, index) => (
            <div key={index} className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 hover-shadow position-relative overflow-hidden">
                <div className="position-absolute top-0 end-0 p-3">
                  <div className="badge bg-primary bg-opacity-10 text-primary rounded-circle p-2">
                    {index + 1}
                  </div>
                </div>
                <div className="card-body text-center p-4">
                  <div className="mb-4">
                    <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" 
                         style={{width: '80px', height: '80px'}}>
                      <div className="display-6 text-primary" role="img" aria-label={feature.title}>
                        {feature.icon}
                      </div>
                    </div>
                  </div>
                  <h5 className="card-title fw-bold mb-3 text-white">{feature.title}</h5>
                  <p className="card-text text-muted mb-4">{feature.description}</p>
                  <div className="d-flex justify-content-center">
                    <button className="btn btn-outline-primary btn-sm">
                      <i className="bi bi-arrow-right me-1"></i>
                      자세히 보기
                    </button>
                  </div>
                </div>
                {/* 카드 배경 그라디언트 효과 */}
                <div className="position-absolute bottom-0 start-0 w-100" 
                     style={{
                       height: '2px',
                       background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)'
                     }}></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 대시보드 섹션 */}
      <section className={`mb-5 fade-in ${isVisible ? 'visible' : ''}`} style={{ animationDelay: '0.2s' }}>
        <div className="text-center mb-5">
          <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill mb-3">
            📊 실시간 대시보드
          </span>
          <h2 className="display-6 fw-bold mb-3">
            당신의 <span className="text-primary">성장을 한눈에</span>
          </h2>
          <p className="lead text-muted">
            AI가 분석한 연습 데이터를 통해 개인화된 인사이트를 확인하세요
          </p>
        </div>
        
        <div className="row mb-5">
          <div className="col-lg-8">
            <div className="card shadow-lg border-0 hover-shadow">
              <div className="card-header border-0 bg-transparent d-flex align-items-center justify-content-between">
                <div>
                  <h5 className="mb-1 text-white">📈 학습 진행 상황</h5>
                  <small className="text-muted">이번 주 목표 달성도</small>
                </div>
                <div className="badge bg-primary bg-opacity-10 text-primary px-3 py-2">
                  <i className="bi bi-graph-up me-1"></i>
                  Live
                </div>
              </div>
              <div className="card-body">
                <ProgressChart 
                  title="이번 주 연습 시간"
                  progress={userSummary?.totalPracticeTime || 245}
                  target={1000}
                  unit="분"
                  color="primary"
                  description="꾸준한 연습으로 목표에 가까워지고 있어요! 💪"
                />
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card shadow-lg border-0 hover-shadow h-100">
              <div className="card-header border-0 bg-transparent d-flex align-items-center justify-content-between">
                <div>
                  <h5 className="mb-1 text-white">🎯 최근 활동</h5>
                  <small className="text-muted">오늘의 연습 기록</small>
                </div>
                <div className="badge bg-success bg-opacity-10 text-success px-2 py-1">
                  <i className="bi bi-circle-fill" style={{fontSize: '6px'}}></i>
                </div>
              </div>
              <div className="card-body">
                <ActivityFeed 
                  activities={[
                    {
                      id: '1',
                      type: 'practice',
                      title: 'C Major Scale 연습',
                      description: '정확도 85% 달성 🎯',
                      time: '2시간 전',
                      icon: 'bi-music-note',
                      color: 'primary'
                    },
                    {
                      id: '2',
                      type: 'achievement',
                      title: '첫 번째 곡 완주',
                      description: '새로운 업적 획득 🏆',
                      time: '1일 전',
                      icon: 'bi-trophy',
                      color: 'warning'
                    },
                    {
                      id: '3',
                      type: 'goal',
                      title: '주간 목표 50% 달성',
                      description: '계속 화이팅! 💪',
                      time: '3시간 전',
                      icon: 'bi-flag',
                      color: 'success'
                    }
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 커뮤니티 리더보드 */}
      <section className={`mb-5 fade-in ${isVisible ? 'visible' : ''}`} style={{ animationDelay: '0.3s' }}>
        <div className="row">
          <div className="col-12">
            <div className="card shadow-lg border-0 hover-shadow">
              <div className="card-header border-0 bg-transparent d-flex align-items-center justify-content-between">
                <div>
                  <h5 className="mb-1 text-white">🏆 커뮤니티 리더보드</h5>
                  <small className="text-muted">이번 주 최고의 연주자들</small>
                </div>
                <div className="d-flex gap-2">
                  <span className="badge bg-warning bg-opacity-10 text-warning px-3 py-2">
                    <i className="bi bi-fire me-1"></i>
                    HOT
                  </span>
                  <button className="btn btn-outline-primary btn-sm">
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    새로고침
                  </button>
                </div>
              </div>
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-md-4 text-center">
                    <div className="badge bg-warning bg-opacity-10 text-warning px-3 py-2 rounded-pill">
                      <i className="bi bi-trophy-fill me-1"></i>
                      주간 챔피언
                    </div>
                  </div>
                  <div className="col-md-4 text-center">
                    <div className="badge bg-info bg-opacity-10 text-info px-3 py-2 rounded-pill">
                      <i className="bi bi-people-fill me-1"></i>
                      10,000+ 사용자
                    </div>
                  </div>
                  <div className="col-md-4 text-center">
                    <div className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill">
                      <i className="bi bi-graph-up me-1"></i>
                      실시간 업데이트
                    </div>
                  </div>
                </div>
                <Leaderboard 
                  items={topUsers?.map((user, index) => ({
                    id: user.userId.toString(),
                    rank: index + 1,
                    name: user.username || `뮤지션 ${user.userId}`,
                    score: user.score,
                    category: index === 0 ? '🔥 이번 주 챔피언' : index < 3 ? '⭐ 톱 연주자' : '🎵 열정적인 연주자',
                    change: Math.floor(Math.random() * 10) - 5
                  })) || [
                    { id: '1', rank: 1, name: '🎹 피아노 마에스트로', score: 2850, category: '🔥 이번 주 챔피언', change: 3 },
                    { id: '2', rank: 2, name: '🎸 기타 히어로', score: 2720, category: '⭐ 톱 연주자', change: 1 },
                    { id: '3', rank: 3, name: '🎻 바이올린 아티스트', score: 2650, category: '⭐ 톱 연주자', change: -1 },
                    { id: '4', rank: 4, name: '🥁 드럼 비트', score: 2580, category: '🎵 열정적인 연주자', change: 2 },
                    { id: '5', rank: 5, name: '🎺 트럼펫 마스터', score: 2490, category: '🎵 열정적인 연주자', change: 0 }
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
} 