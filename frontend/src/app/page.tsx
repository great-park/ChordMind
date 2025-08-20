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
              <button className="btn px-4 py-3 fw-bold" style={{
                ...BUTTON_STYLES.primary,
                fontSize: '1.1rem',
                boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)'
              }}>
                <i className="bi bi-play-circle me-2"></i>
                시작하기
              </button>
              <button className="btn px-4 py-3 fw-bold" style={{
                ...BUTTON_STYLES.outline,
                fontSize: '1.1rem'
              }}>
                <i className="bi bi-person-circle me-2"></i>
                로그인
              </button>
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
      </div>
    </div>
  );
} 