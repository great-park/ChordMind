'use client'

import { useState, useEffect } from 'react';
import Sidebar from '../components/home/Sidebar';
import StatisticsCard from '../components/StatisticsCard';
import ProgressChart from '../components/ProgressChart';
import ActivityFeed from '../components/ActivityFeed';
import Leaderboard from '../components/Leaderboard';
import QuizWidget from '../components/QuizWidget';
import { 
  TRENDING_KEYWORDS, 
  RECENT_KEYWORDS, 
  FEATURES, 
  REVIEWS 
} from '../constants/data';
import { STATISTICS_DATA } from '../constants/statistics';
import { GRADIENTS, COLORS, CARD_STYLES, BADGE_STYLES, BUTTON_STYLES } from '../constants/styles';
import { practiceService } from '../services/practiceService';
import type { 
  AnalyticsUserSummaryResponse,
  AnalyticsUserTrendResponse,
  UserRankingResponse
} from '../services/practiceService';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { user, loginAsTestUser } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [userSummary, setUserSummary] = useState<AnalyticsUserSummaryResponse | null>(null);
  const [userTrend, setUserTrend] = useState<AnalyticsUserTrendResponse | null>(null);
  const [topUsers, setTopUsers] = useState<UserRankingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        setIsVisible(true); // 카드들이 보이도록 설정

        // 사용자가 로그인한 경우에만 개인 데이터 로드
        if (user?.id) {
          const [summaryRes, trendRes] = await Promise.all([
            practiceService.getAnalyticsUserSummary(user.id),
            practiceService.getAnalyticsUserTrend(user.id, 'month')
          ]);

          if (summaryRes.success && summaryRes.data) setUserSummary(summaryRes.data);
          if (trendRes.success && trendRes.data) setUserTrend(trendRes.data);
        }

        // 공통 데이터는 항상 로드
        const topUsersRes = await practiceService.getTopUsers(8);
        if (topUsersRes.success) {
          setTopUsers(topUsersRes.data || []);
        }
      } catch (err) {
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.id]);

  return (
    <div className="d-flex" style={{minHeight: '100vh'}}>
      {/* 사이드바 */}
      <Sidebar />
      
      {/* 메인 콘텐츠 */}
      <div className="flex-grow-1 p-4" style={{
        background: GRADIENTS.dark,
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
            background: GRADIENTS.card,
            borderRadius: '24px',
            padding: '3rem',
            color: 'white'
          }}
        >
          <div className="text-center">
            <span className="badge px-3 py-2 rounded-pill mb-3" style={{
              ...BADGE_STYLES.primary,
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              🎵 AI 기반 음악 연주 분석
            </span>
            <h1 className="display-4 fw-bold mb-4" style={{
              color: 'white',
              fontSize: '3.5rem',
              lineHeight: '1.2'
            }}>
              당신의 <span style={{color: '#a78bfa'}}>음악 여정</span>을<br />
              <span style={{color: '#a78bfa'}}>AI와 함께</span>하세요
            </h1>
            <p className="lead mb-5" style={{
              color: '#e2e8f0',
              fontSize: '1.25rem',
              lineHeight: '1.6'
            }}>
              실시간 연주 분석, 개인화된 피드백, 그리고 AI 코칭으로<br />
              음악 실력을 한 단계 끌어올리세요
            </p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <a href="/practice" className="btn px-4 py-3 fw-bold text-decoration-none" style={{
                ...BUTTON_STYLES.primary,
                fontSize: '1.1rem',
                boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)'
              }}>
                <i className="bi bi-play-circle me-2"></i>
                시작하기
              </a>
              <button className="btn px-4 py-3 fw-bold" style={{
                ...BUTTON_STYLES.outline,
                fontSize: '1.1rem'
              }}>
                <i className="bi bi-person-circle me-2"></i>
                로그인
              </button>
              {!user && (
                <button 
                  className="btn px-4 py-3 fw-bold" 
                  style={{
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '500',
                    fontSize: '1.1rem'
                  }}
                  onClick={loginAsTestUser}
                >
                  <i className="bi bi-person-check me-2"></i>
                  테스트 계정으로 로그인
                </button>
              )}
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
              ...BADGE_STYLES.primary,
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              ✨ 혁신적인 기능들
            </span>
            <h2 id="features-title" className="display-5 fw-bold mb-3" style={{color: COLORS.text.primary}}>
              AI가 만드는 <span style={{color: COLORS.primary.light}}>음악 학습의 미래</span>
            </h2>
            <p className="lead mb-0" style={{color: COLORS.text.secondary}}>
              첨단 기술과 음악 교육의 완벽한 만남으로 당신의 연주 실력을 한 단계 끌어올리세요
            </p>
          </div>
          <div className="row g-4">
            {FEATURES.map((feature, index) => (
              <div key={index} className="col-lg-4 col-md-6">
                <div className="card h-100 border-0 hover-shadow position-relative overflow-hidden" style={CARD_STYLES.dark}>
                  <div className="position-absolute top-0 end-0 p-3">
                    <div className="badge rounded-circle p-2" style={{
                      background: COLORS.primary.background,
                      color: COLORS.primary.main,
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}>
                      {index + 1}
                    </div>
                  </div>
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="feature-icon me-3" style={{
                        width: '60px',
                        height: '60px',
                        background: `rgba(${feature.color === 'primary' ? '139, 92, 246' : feature.color === 'success' ? '34, 197, 94' : feature.color === 'warning' ? '245, 158, 11' : '59, 130, 246'}, 0.15)`,
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <i className={`bi ${feature.icon} fs-2`} style={{
                          color: feature.color === 'primary' ? COLORS.primary.light : feature.color === 'success' ? COLORS.success.light : feature.color === 'warning' ? COLORS.warning.light : COLORS.info.light
                        }}></i>
                      </div>
                      <h5 className="mb-0 fw-bold" style={{color: COLORS.text.primary}}>{feature.title}</h5>
                    </div>
                    <p className="mb-3" style={{color: COLORS.text.secondary, lineHeight: '1.6'}}>{feature.description}</p>
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="badge px-2 py-1 rounded-pill" style={{
                        background: `rgba(${feature.color === 'primary' ? '139, 92, 246' : feature.color === 'success' ? '34, 197, 94' : feature.color === 'warning' ? '245, 158, 11' : '59, 130, 246'}, 0.2)`,
                        color: feature.color === 'primary' ? COLORS.primary.light : feature.color === 'success' ? COLORS.success.light : feature.color === 'warning' ? COLORS.warning.light : COLORS.info.light,
                        fontSize: '0.75rem'
                      }}>
                        {feature.tag}
                      </span>
                      <a href={feature.link} className="text-decoration-none" style={{color: COLORS.primary.light}}>
                        자세히 보기 <i className="bi bi-arrow-right ms-1"></i>
                      </a>
                    </div>
                  </div>
                  {/* 카드 배경 그라디언트 효과 */}
                  <div className="position-absolute bottom-0 start-0 w-100" 
                       style={{
                         height: '3px',
                         background: GRADIENTS.primary
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
              ...BADGE_STYLES.success,
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              📊 실시간 대시보드
            </span>
            <h2 className="display-6 fw-bold mb-3" style={{
              color: COLORS.text.primary,
              fontSize: '2.5rem',
              lineHeight: '1.2'
            }}>
              당신의 <span style={{color: COLORS.primary.light}}>성장을 한눈에</span>
            </h2>
            <p className="lead mb-0" style={{
              color: COLORS.text.secondary,
              fontSize: '1.125rem',
              lineHeight: '1.6'
            }}>
              AI가 분석한 연습 데이터를 통해 개인화된 인사이트를 확인하세요
            </p>
          </div>
          
          <div className="row mb-5">
            <div className="col-lg-8">
              <div className="card shadow-lg border-0 hover-shadow" style={CARD_STYLES.large}>
                <div className="card-header border-0 bg-transparent d-flex align-items-center justify-content-between p-4">
                  <div>
                    <h5 className="mb-1" style={{
                      color: COLORS.text.primary,
                      fontSize: '1.25rem',
                      fontWeight: '600'
                    }}>📈 학습 진행 상황</h5>
                    <small style={{
                      color: COLORS.text.tertiary,
                      fontSize: '0.875rem'
                    }}>이번 주 목표 달성도</small>
                  </div>
                  <div className="badge px-3 py-2" style={{
                    background: COLORS.primary.background,
                    color: COLORS.primary.main,
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
                    progress={userSummary?.totalPracticeTime || 0}
                    target={1000}
                    unit="분"
                    color="primary"
                    description="꾸준한 연습으로 목표에 가까워지고 있어요! 💪"
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card shadow-lg border-0 hover-shadow h-100" style={CARD_STYLES.large}>
                <div className="card-header border-0 bg-transparent d-flex align-items-center justify-content-between p-4">
                  <div>
                    <h5 className="mb-1" style={{
                      color: COLORS.text.primary,
                      fontSize: '1.25rem',
                      fontWeight: '600'
                    }}>🎯 최근 활동</h5>
                    <small style={{
                      color: COLORS.text.tertiary,
                      fontSize: '0.875rem'
                    }}>오늘의 연습 기록</small>
                  </div>
                  <div className="badge px-2 py-1" style={{
                    background: COLORS.success.background,
                    color: COLORS.success.main,
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
                background: 'linear-gradient(135deg, #334155 0%, #475569 100%)',
                borderRadius: '20px',
                border: '1px solid rgba(139, 92, 246, 0.15)',
                boxShadow: '0 8px 20px -5px rgba(0, 0, 0, 0.2), 0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}>
                <div className="card-header border-0 bg-transparent d-flex align-items-center justify-content-between p-4">
                  <div>
                    <h5 className="mb-1" style={{
                      color: 'white',
                      fontSize: '1.25rem',
                      fontWeight: '600'
                    }}>🏆 커뮤니티 리더보드</h5>
                    <small style={{
                      color: COLORS.text.tertiary,
                      fontSize: '0.875rem'
                    }}>이번 주 최고의 연주자들</small>
                  </div>
                  <div className="d-flex gap-2">
                    <span className="badge px-3 py-2" style={{
                      ...BADGE_STYLES.warning,
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      <i className="bi bi-fire me-1"></i>
                      HOT
                    </span>
                    <button className="btn btn-outline-primary btn-sm px-3 py-2" style={{
                      borderColor: COLORS.primary.main,
                      color: COLORS.primary.main,
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

        {/* 성장 인사이트 섹션 */}
        <section className="mb-5">
          <div className="card border-0 shadow-lg" style={CARD_STYLES.large}>
            <div className="card-header border-0 bg-transparent p-4">
              <h5 className="mb-0 fw-bold" style={{color: COLORS.text.primary}}>
                <i className="bi bi-lightbulb me-2" style={{color: COLORS.warning.light}}></i>
                성장 인사이트
              </h5>
            </div>
            <div className="card-body p-4">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h6 className="fw-bold mb-3" style={{color: COLORS.text.primary}}>이번 주 연습 목표 달성률</h6>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span style={{color: COLORS.text.secondary}}>목표: 5시간</span>
                      <span style={{color: COLORS.text.secondary}}>4.2시간 (84%)</span>
                    </div>
                    <div className="progress" style={{height: '8px', borderRadius: '4px'}}>
                      <div className="progress-bar" style={{
                        width: '84%',
                        background: GRADIENTS.primary,
                        borderRadius: '4px'
                      }}></div>
                    </div>
                  </div>
                  <p className="mb-0" style={{color: COLORS.text.secondary, fontSize: '0.9rem'}}>
                    <i className="bi bi-arrow-up-circle me-1" style={{color: COLORS.success.main}}></i>
                    지난 주 대비 <strong style={{color: COLORS.success.main}}>12% 향상</strong>되었습니다!
                  </p>
                </div>
                <div className="col-md-4 text-center">
                  <div className="d-inline-flex align-items-center justify-content-center rounded-circle" style={{
                    width: '80px',
                    height: '80px',
                    background: GRADIENTS.primary,
                    color: 'white'
                  }}>
                    <span className="fs-2 fw-bold">84%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

          {/* AI 작곡 어시스턴트 섹션 */}
          <div className="row g-4 mb-5">
            <div className="col-12">
              <div className="text-center mb-4">
                <span className="badge px-3 py-2 mb-3" style={{
                  ...BADGE_STYLES.primary,
                  fontSize: '1rem'
                }}>
                  🎼 새로운 기능
                </span>
                <h2 className="mb-3" style={{color: COLORS.text.primary}}>
                  AI 작곡 어시스턴트
                </h2>
                <p className="lead mb-0" style={{color: COLORS.text.secondary}}>
                  When-in-Rome 기반의 전문적인 화성학 지식으로 작곡을 도와드립니다
                </p>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100" style={CARD_STYLES.large}>
                <div className="card-body text-center p-4">
                  <div className="mb-3" style={{
                    width: '80px',
                    height: '80px',
                    background: GRADIENTS.primary,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto'
                  }}>
                    <i className="bi bi-arrow-repeat fs-1 text-white"></i>
                  </div>
                  <h5 className="mb-3" style={{color: COLORS.text.primary}}>화성 진행 제안</h5>
                  <p style={{color: COLORS.text.secondary}}>
                    팝, 재즈, 클래식 등 스타일별로 최적화된 화성 진행 패턴을 제안합니다
                  </p>
                  <div className="mt-3">
                    <span className="badge me-2" style={BADGE_STYLES.success}>I-V-vi-IV</span>
                    <span className="badge me-2" style={BADGE_STYLES.info}>ii-V-I</span>
                    <span className="badge" style={BADGE_STYLES.warning}>I-vi-IV-V</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100" style={CARD_STYLES.large}>
                <div className="card-body text-center p-4">
                  <div className="mb-3" style={{
                    width: '80px',
                    height: '80px',
                    background: GRADIENTS.success,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto'
                  }}>
                    <i className="bi bi-music-note fs-1 text-white"></i>
                  </div>
                  <h5 className="mb-3" style={{color: COLORS.text.primary}}>멜로디 생성</h5>
                  <p style={{color: COLORS.text.secondary}}>
                    화성 진행에 맞는 멜로디 라인과 리듬 패턴을 자동으로 생성합니다
                  </p>
                  <div className="mt-3">
                    <span className="badge me-2" style={BADGE_STYLES.primary}>상승 선율</span>
                    <span className="badge me-2" style={BADGE_STYLES.info}>파동 선율</span>
                    <span className="badge" style={BADGE_STYLES.warning}>안정 선율</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100" style={CARD_STYLES.large}>
                <div className="card-body text-center p-4">
                  <div className="mb-3" style={{
                    width: '80px',
                    height: '80px',
                    background: GRADIENTS.warning,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto'
                  }}>
                    <i className="bi bi-arrow-repeat fs-1 text-white"></i>
                  </div>
                  <h5 className="mb-3" style={{color: COLORS.text.primary}}>조성 전환 가이드</h5>
                  <p style={{color: COLORS.text.secondary}}>
                    피벗 화성, 직접 전환 등 전문적인 조성 전환 기법을 안내합니다
                  </p>
                  <div className="mt-3">
                    <span className="badge me-2" style={BADGE_STYLES.primary}>피벗 화성</span>
                    <span className="badge me-2" style={BADGE_STYLES.info}>직접 전환</span>
                    <span className="badge" style={BADGE_STYLES.warning}>반음계적</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mb-5">
            <a href="/composition" className="btn px-4 py-3 fw-bold text-decoration-none" style={{
              ...BUTTON_STYLES.primary,
              fontSize: '1.2rem',
              borderRadius: '25px'
            }}>
              <i className="bi bi-magic me-2"></i>
              AI 작곡 어시스턴트 시작하기
            </a>
          </div>

          {/* 음악 이론 학습 시스템 섹션 */}
          <div className="row g-4 mb-5">
            <div className="col-12">
              <div className="text-center mb-4">
                <span className="badge px-3 py-2 mb-3" style={{
                  ...BADGE_STYLES.success,
                  fontSize: '1rem'
                }}>
                  📚 체계적 학습
                </span>
                <h2 className="mb-3" style={{color: COLORS.text.primary}}>
                  음악 이론 학습 시스템
                </h2>
                <p className="lead mb-0" style={{color: COLORS.text.secondary}}>
                  When-in-Rome 기반의 체계적인 화성학 학습으로 음악적 이해를 높여보세요
                </p>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100" style={CARD_STYLES.large}>
                <div className="card-body text-center p-4">
                  <div className="mb-3" style={{
                    width: '80px',
                    height: '80px',
                    background: GRADIENTS.primary,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto'
                  }}>
                    <span className="fs-2">📚</span>
                  </div>
                  <h5 className="mb-3" style={{color: COLORS.text.primary}}>체계적 커리큘럼</h5>
                  <p style={{color: COLORS.text.secondary}}>
                    초급부터 고급까지 단계별로 구성된 체계적인 학습 경로
                  </p>
                  <div className="mt-3">
                    <span className="badge me-2" style={BADGE_STYLES.success}>화성학 기초</span>
                    <span className="badge me-2" style={BADGE_STYLES.info}>진행 패턴</span>
                    <span className="badge" style={BADGE_STYLES.warning}>모달 믹스처</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100" style={CARD_STYLES.large}>
                <div className="card-body text-center p-4">
                  <div className="mb-3" style={{
                    width: '80px',
                    height: '80px',
                    background: GRADIENTS.success,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto'
                  }}>
                    <span className="fs-2">🔄</span>
                  </div>
                  <h5 className="mb-3" style={{color: COLORS.text.primary}}>진행 패턴 연습</h5>
                  <p style={{color: COLORS.text.secondary}}>
                    실제 곡 예시와 함께하는 화성 진행 패턴 학습
                  </p>
                  <div className="mt-3">
                    <span className="badge me-2" style={BADGE_STYLES.primary}>팝 진행</span>
                    <span className="badge me-2" style={BADGE_STYLES.info}>재즈 진행</span>
                    <span className="badge" style={BADGE_STYLES.warning}>클래식 진행</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100" style={CARD_STYLES.large}>
                <div className="card-body text-center p-4">
                  <div className="mb-3" style={{
                    width: '80px',
                    height: '80px',
                    background: GRADIENTS.warning,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto'
                  }}>
                    <span className="fs-2">🎨</span>
                  </div>
                  <h5 className="mb-3" style={{color: COLORS.text.primary}}>모달 믹스처 가이드</h5>
                  <p style={{color: COLORS.text.secondary}}>
                    고급 화성 기법을 단계별로 학습하는 전문 가이드
                  </p>
                  <div className="mt-3">
                    <span className="badge me-2" style={BADGE_STYLES.primary}>자연단음계</span>
                    <span className="badge me-2" style={BADGE_STYLES.info}>평행조</span>
                    <span className="badge" style={BADGE_STYLES.warning}>반음계적</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mb-5">
            <a href="/theory" className="btn px-4 py-3 fw-bold text-decoration-none" style={{
              ...BUTTON_STYLES.success,
              fontSize: '1.2rem',
              borderRadius: '25px'
            }}>
              <i className="bi bi-book me-2"></i>
              음악 이론 학습 시작하기
            </a>
          </div>

          {/* 개인 맞춤 연습 계획 섹션 */}
          <div className="row g-4 mb-5">
            <div className="col-12">
              <div className="text-center mb-4">
                <span className="badge px-3 py-2 mb-3" style={{
                  ...BADGE_STYLES.warning,
                  fontSize: '1rem'
                }}>
                  🎯 개인 맞춤
                </span>
                <h2 className="mb-3" style={{color: COLORS.text.primary}}>
                  개인 맞춤 연습 계획
                </h2>
                <p className="lead mb-0" style={{color: COLORS.text.secondary}}>
                  AI가 분석하는 당신만의 연습 계획으로 효율적인 실력 향상을 경험하세요
                </p>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100" style={CARD_STYLES.large}>
                <div className="card-body text-center p-4">
                  <div className="mb-3" style={{
                    width: '80px',
                    height: '80px',
                    background: GRADIENTS.primary,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto'
                  }}>
                    <span className="fs-2">🎯</span>
                  </div>
                  <h5 className="mb-3" style={{color: COLORS.text.primary}}>AI 진단</h5>
                  <p style={{color: COLORS.text.secondary}}>
                    현재 음악 실력과 개선 영역을 정확하게 분석합니다
                  </p>
                  <div className="mt-3">
                    <span className="badge me-2" style={BADGE_STYLES.success}>강점 분석</span>
                    <span className="badge me-2" style={BADGE_STYLES.danger}>약점 파악</span>
                    <span className="badge" style={BADGE_STYLES.info}>개선 방향</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100" style={CARD_STYLES.large}>
                <div className="card-body text-center p-4">
                  <div className="mb-3" style={{
                    width: '80px',
                    height: '80px',
                    background: GRADIENTS.success,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto'
                  }}>
                    <span className="fs-2">📅</span>
                  </div>
                  <h5 className="mb-3" style={{color: COLORS.text.primary}}>맞춤형 커리큘럼</h5>
                  <p style={{color: COLORS.text.secondary}}>
                    개인 수준과 목표에 맞는 체계적인 연습 계획을 생성합니다
                  </p>
                  <div className="mt-3">
                    <span className="badge me-2" style={BADGE_STYLES.primary}>주간 계획</span>
                    <span className="badge me-2" style={BADGE_STYLES.info}>일일 연습</span>
                    <span className="badge" style={BADGE_STYLES.warning}>목표 설정</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100" style={CARD_STYLES.large}>
                <div className="card-body text-center p-4">
                  <div className="mb-3" style={{
                    width: '80px',
                    height: '80px',
                    background: GRADIENTS.warning,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto'
                  }}>
                    <span className="fs-2">📈</span>
                  </div>
                  <h5 className="mb-3" style={{color: COLORS.text.primary}}>진도 추적</h5>
                  <p style={{color: COLORS.text.secondary}}>
                    연습 진행 상황과 목표 달성도를 실시간으로 확인합니다
                  </p>
                  <div className="mt-3">
                    <span className="badge me-2" style={BADGE_STYLES.primary}>진행률</span>
                    <span className="badge me-2" style={BADGE_STYLES.info}>성취도</span>
                    <span className="badge" style={BADGE_STYLES.warning}>통계</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mb-5">
            <a href="/practice-plan" className="btn px-4 py-3 fw-bold text-decoration-none" style={{
              ...BUTTON_STYLES.warning,
              fontSize: '1.2rem',
              borderRadius: '25px'
            }}>
              <i className="bi bi-calendar-check me-2"></i>
              맞춤 연습 계획 시작하기
            </a>
          </div>
      </div>
    </div>
  );
} 