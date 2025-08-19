'use client'

import { useState, useEffect } from 'react';
import Sidebar from '../components/home/Sidebar';
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

  if (loading) return (
    <div className="card shadow mb-4">
      <div className="card-body text-center">
        <div className="spinner-border text-primary mb-2" role="status">
          <span className="visually-hidden">로딩 중...</span>
        </div>
        <p className="text-white-50 mb-0">퀴즈 로딩 중...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="card shadow mb-4">
      <div className="card-body">
        <div className="alert alert-danger border-0">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      </div>
    </div>
  );
  
  if (!questions.length) return (
    <div className="card shadow mb-4">
      <div className="card-body text-center">
        <i className="bi bi-question-circle display-4 text-muted mb-3"></i>
        <p className="text-white-50 mb-0">퀴즈가 없습니다.</p>
      </div>
    </div>
  );

  const q = questions[current];

  return (
    <div className="card shadow mb-4">
      <div className="card-header">
        <h5 className="mb-0 text-white">🧠 오늘의 퀴즈</h5>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <h6 className="text-white fw-bold">{q.question}</h6>
        </div>
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
            <i className="bi bi-check-circle me-1"></i>
            정답 제출
          </button>
        )}
        {result && (
          <div className={`alert ${result.correct ? 'alert-success' : 'alert-danger'} border-0`}>
            <div className="d-flex align-items-center">
              <i className={`bi ${result.correct ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} me-2`}></i>
              <strong>{result.explanation}</strong>
            </div>
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
    <div className="d-flex" style={{minHeight: '100vh'}}>
      {/* 사이드바 */}
      <Sidebar />
      
      {/* 메인 콘텐츠 */}
      <div className="flex-grow-1 p-4" style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        minHeight: '100vh'
      }}>
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
          style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            borderRadius: '24px',
            padding: '3rem',
            color: 'white'
          }}
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
                <span className="badge px-3 py-2 rounded-pill" style={{
                  background: 'rgba(139, 92, 246, 0.2)',
                  color: '#a855f7',
                  border: '1px solid rgba(139, 92, 246, 0.3)'
                }}>
                  🎵 AI 기반 음악 학습 플랫폼
                </span>
              </div>
              <h1 id="hero-title" className="display-4 fw-bold mb-4" style={{color: 'white'}}>
                음악의 새로운 차원<br />
                <span style={{color: '#a855f7'}}>ChordMind</span>와 함께
              </h1>
              <p className="lead mb-4" style={{color: '#e2e8f0'}}>
                최첨단 AI 기술로 당신의 연주를 실시간 분석하고,<br />
                개인화된 피드백으로 <strong style={{color: '#fbbf24'}}>더 빠른 성장</strong>을 경험하세요.<br />
                <span style={{color: '#60a5fa'}}>박자·음정·화성·표현력</span>까지 완벽하게!
              </p>
              <div className="d-flex flex-wrap gap-3 mb-4">
                <a href="/register" className="btn btn-lg px-4" style={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                  border: 'none',
                  color: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)'
                }}>
                  <i className="bi bi-person-plus me-2"></i>
                  무료로 시작하기
                </a>
                <a href="/login" className="btn btn-outline-light btn-lg px-4" style={{
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  color: 'white',
                  background: 'rgba(255, 255, 255, 0.1)'
                }}>
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  로그인
                </a>
              </div>
              <div className="d-flex align-items-center gap-4" style={{color: '#cbd5e1'}}>
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
                <div className="rounded-4 p-5 shadow-lg position-relative" style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
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
                      <div className="rounded-3 p-2" style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                      }}>
                        <i className="bi bi-cpu mb-1"></i>
                        <div className="small">실시간 AI</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="rounded-3 p-2" style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                      }}>
                        <i className="bi bi-graph-up-arrow mb-1"></i>
                        <div className="small">성장 추적</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="rounded-3 p-2" style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                      }}>
                        <i className="bi bi-palette mb-1"></i>
                        <div className="small">맞춤 피드백</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="rounded-3 p-2" style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                      }}>
                        <i className="bi bi-award mb-1"></i>
                        <div className="small">목표 달성</div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* 플로팅 카드들 */}
                <div className="position-absolute" style={{top: '10%', left: '-10%', animation: 'float 3s ease-in-out infinite'}}>
                  <div className="card border-0 shadow-sm" style={{
                    width: '80px', 
                    height: '60px',
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '12px'
                  }}>
                    <div className="card-body d-flex align-items-center justify-content-center p-2">
                      <i className="bi bi-heart-fill text-danger"></i>
                    </div>
                  </div>
                </div>
                <div className="position-absolute" style={{top: '20%', right: '-5%', animation: 'float 3s ease-in-out infinite 1s'}}>
                  <div className="card border-0 shadow-sm" style={{
                    width: '80px', 
                    height: '60px',
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '12px'
                  }}>
                    <div className="card-body d-flex align-items-center justify-content-center p-2">
                      <i className="bi bi-trophy-fill text-warning"></i>
                    </div>
                  </div>
                </div>
                <div className="position-absolute" style={{bottom: '15%', left: '5%', animation: 'float 3s ease-in-out infinite 2s'}}>
                  <div className="card border-0 shadow-sm" style={{
                    width: '80px', 
                    height: '60px',
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '12px'
                  }}>
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
            <span className="badge px-3 py-2 rounded-pill mb-3" style={{
              background: 'rgba(139, 92, 246, 0.1)',
              color: '#8b5cf6',
              border: '1px solid rgba(139, 92, 246, 0.2)'
            }}>
              ✨ 혁신적인 기능들
            </span>
            <h2 id="features-title" className="display-5 fw-bold mb-3" style={{color: '#1e293b'}}>
              AI가 만드는 <span style={{color: '#8b5cf6'}}>음악 학습의 미래</span>
            </h2>
            <p className="lead mb-0" style={{color: '#64748b'}}>
              첨단 기술과 음악 교육의 완벽한 만남으로 당신의 연주 실력을 한 단계 끌어올리세요
            </p>
          </div>
          <div className="row g-4">
            {FEATURES.map((feature, index) => (
              <div key={index} className="col-lg-4 col-md-6">
                <div className="card h-100 border-0 hover-shadow position-relative overflow-hidden" style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  borderRadius: '16px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  border: '1px solid rgba(139, 92, 246, 0.1)'
                }}>
                  <div className="position-absolute top-0 end-0 p-3">
                    <div className="badge rounded-circle p-2" style={{
                      background: 'rgba(139, 92, 246, 0.1)',
                      color: '#8b5cf6',
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}>
                      {index + 1}
                    </div>
                  </div>
                  <div className="card-body text-center p-4">
                    <div className="mb-4">
                      <div className="rounded-circle d-inline-flex align-items-center justify-content-center" 
                           style={{
                             width: '80px', 
                             height: '80px',
                             background: 'rgba(139, 92, 246, 0.1)',
                             border: '2px solid rgba(139, 92, 246, 0.2)'
                           }}>
                        <div className="display-6" style={{color: '#8b5cf6'}} role="img" aria-label={feature.title}>
                          {feature.icon}
                        </div>
                      </div>
                    </div>
                    <h5 className="card-title fw-bold mb-3" style={{
                      color: '#1e293b',
                      fontSize: '1.25rem',
                      lineHeight: '1.4'
                    }}>{feature.title}</h5>
                    <p className="card-text mb-4" style={{
                      color: '#475569',
                      fontSize: '0.95rem',
                      lineHeight: '1.6'
                    }}>{feature.description}</p>
                    <div className="d-flex justify-content-center">
                      <button className="btn btn-outline-primary btn-sm px-3 py-2" style={{
                        borderColor: '#8b5cf6',
                        color: '#8b5cf6',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        transition: 'all 0.3s ease'
                      }}>
                        <i className="bi bi-arrow-right me-1"></i>
                        자세히 보기
                      </button>
                    </div>
                  </div>
                  {/* 카드 배경 그라디언트 효과 */}
                  <div className="position-absolute bottom-0 start-0 w-100" 
                       style={{
                         height: '3px',
                         background: 'linear-gradient(90deg, #8b5cf6 0%, #a855f7 100%)'
                       }}></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 대시보드 섹션 */}
        <section className={`mb-5 fade-in ${isVisible ? 'visible' : ''}`} style={{ animationDelay: '0.2s' }}>
          <div className="text-center mb-5">
            <span className="badge px-3 py-2 rounded-pill mb-3" style={{
              background: 'rgba(34, 197, 94, 0.1)',
              color: '#16a34a',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              📊 실시간 대시보드
            </span>
            <h2 className="display-6 fw-bold mb-3" style={{
              color: '#1e293b',
              fontSize: '2.5rem',
              lineHeight: '1.2'
            }}>
              당신의 <span style={{color: '#8b5cf6'}}>성장을 한눈에</span>
            </h2>
            <p className="lead mb-0" style={{
              color: '#475569',
              fontSize: '1.125rem',
              lineHeight: '1.6'
            }}>
              AI가 분석한 연습 데이터를 통해 개인화된 인사이트를 확인하세요
            </p>
          </div>
          
          <div className="row mb-5">
            <div className="col-lg-8">
              <div className="card shadow-lg border-0 hover-shadow" style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                borderRadius: '20px',
                border: '1px solid rgba(139, 92, 246, 0.1)'
              }}>
                <div className="card-header border-0 bg-transparent d-flex align-items-center justify-content-between p-4">
                  <div>
                    <h5 className="mb-1" style={{
                      color: '#1e293b',
                      fontSize: '1.25rem',
                      fontWeight: '600'
                    }}>📈 학습 진행 상황</h5>
                    <small style={{
                      color: '#64748b',
                      fontSize: '0.875rem'
                    }}>이번 주 목표 달성도</small>
                  </div>
                  <div className="badge px-3 py-2" style={{
                    background: 'rgba(139, 92, 246, 0.1)',
                    color: '#8b5cf6',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    <i className="bi bi-graph-up me-1"></i>
                    Live
                  </div>
                </div>
                <div className="card-body p-4">
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
              <div className="card shadow-lg border-0 hover-shadow h-100" style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                borderRadius: '20px',
                border: '1px solid rgba(139, 92, 246, 0.1)'
              }}>
                <div className="card-header border-0 bg-transparent d-flex align-items-center justify-content-between p-4">
                  <div>
                    <h5 className="mb-1" style={{
                      color: '#1e293b',
                      fontSize: '1.25rem',
                      fontWeight: '600'
                    }}>🎯 최근 활동</h5>
                    <small style={{
                      color: '#64748b',
                      fontSize: '0.875rem'
                    }}>오늘의 연습 기록</small>
                  </div>
                  <div className="badge px-2 py-1" style={{
                    background: 'rgba(34, 197, 94, 0.1)',
                    color: '#16a34a',
                    fontSize: '0.75rem'
                  }}>
                    <i className="bi bi-circle-fill" style={{fontSize: '6px'}}></i>
                  </div>
                </div>
                <div className="card-body p-4">
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
              <div className="card shadow-lg border-0 hover-shadow" style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                borderRadius: '20px',
                border: '1px solid rgba(139, 92, 246, 0.1)'
              }}>
                <div className="card-header border-0 bg-transparent d-flex align-items-center justify-content-between p-4">
                  <div>
                    <h5 className="mb-1" style={{
                      color: '#1e293b',
                      fontSize: '1.25rem',
                      fontWeight: '600'
                    }}>🏆 커뮤니티 리더보드</h5>
                    <small style={{
                      color: '#64748b',
                      fontSize: '0.875rem'
                    }}>이번 주 최고의 연주자들</small>
                  </div>
                  <div className="d-flex gap-2">
                    <span className="badge px-3 py-2" style={{
                      background: 'rgba(245, 158, 11, 0.1)',
                      color: '#d97706',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      <i className="bi bi-fire me-1"></i>
                      HOT
                    </span>
                    <button className="btn btn-outline-primary btn-sm px-3 py-2" style={{
                      borderColor: '#8b5cf6',
                      color: '#8b5cf6',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}>
                      <i className="bi bi-arrow-clockwise me-1"></i>
                      새로고침
                    </button>
                  </div>
                </div>
                <div className="card-body p-4">
                  <div className="row mb-4">
                    <div className="col-md-4 text-center mb-3">
                      <div className="badge px-3 py-2 rounded-pill" style={{
                        background: 'rgba(245, 158, 11, 0.1)',
                        color: '#d97706',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        border: '1px solid rgba(245, 158, 11, 0.2)'
                      }}>
                        <i className="bi bi-trophy-fill me-1"></i>
                        주간 챔피언
                      </div>
                    </div>
                    <div className="col-md-4 text-center mb-3">
                      <div className="badge px-3 py-2 rounded-pill" style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        color: '#2563eb',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        border: '1px solid rgba(59, 130, 246, 0.2)'
                      }}>
                        <i className="bi bi-people-fill me-1"></i>
                        10,000+ 사용자
                      </div>
                    </div>
                    <div className="col-md-4 text-center mb-3">
                      <div className="badge px-3 py-2 rounded-pill" style={{
                        background: 'rgba(34, 197, 94, 0.1)',
                        color: '#16a34a',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        border: '1px solid rgba(34, 197, 94, 0.2)'
                      }}>
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
      </div>
    </div>
  );
} 