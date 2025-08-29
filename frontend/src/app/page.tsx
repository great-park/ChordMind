'use client'

import { useState, useEffect } from 'react';
import Sidebar from '../components/home/Sidebar';
import ProgressChart from '../components/ProgressChart';
import ActivityFeed from '../components/ActivityFeed';
import Leaderboard from '../components/Leaderboard';
import { 
  TRENDING_KEYWORDS, 
  RECENT_KEYWORDS, 
  FEATURES, 
  REVIEWS 
} from '../constants/data';
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


        {/* 개선된 히어로 섹션 */}
        <section
          className={`hero-section mb-5 fade-in ${isVisible ? 'visible' : ''}`}
          aria-labelledby="hero-title"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '24px',
            padding: '4rem 3rem',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* 배경 파티클 효과 */}
          <div className="position-absolute top-0 start-0 w-100 h-100" style={{
            background: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)',
            pointerEvents: 'none'
          }}></div>
          
          <div className="text-center position-relative">
            {/* 동적 배지 */}
            <div className="mb-4">
              <span className="badge px-4 py-3 rounded-pill mb-3" style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(10px)',
                animation: 'pulse 2s infinite'
              }}>
                🎵 AI 기반 음악 연주 분석
              </span>
            </div>
            
            {/* 메인 제목 */}
            <h1 className="display-3 fw-bold mb-4" style={{
              color: 'white',
              fontSize: '4rem',
              lineHeight: '1.1',
              textShadow: '0 4px 20px rgba(0,0,0,0.3)',
              animation: 'fadeInUp 1s ease-out'
            }}>
              당신의 <span style={{color: '#fbbf24', textShadow: '0 2px 10px rgba(251, 191, 36, 0.5)'}}>음악 여정</span>을<br />
              <span style={{color: '#fbbf24', textShadow: '0 2px 10px rgba(251, 191, 36, 0.5)'}}>AI와 함께</span>하세요
            </h1>
            
            {/* 설명 */}
            <p className="lead mb-5" style={{
              color: '#f1f5f9',
              fontSize: '1.4rem',
              lineHeight: '1.6',
              maxWidth: '800px',
              margin: '0 auto',
              animation: 'fadeInUp 1s ease-out 0.2s both'
            }}>
              실시간 연주 분석, 개인화된 피드백, 그리고 AI 코칭으로<br />
              음악 실력을 한 단계 끌어올리세요
            </p>
            
            {/* 액션 버튼들 */}
            <div className="d-flex gap-4 justify-content-center flex-wrap" style={{
              animation: 'fadeInUp 1s ease-out 0.4s both'
            }}>
              <a href="/practice" className="btn px-5 py-3 fw-bold text-decoration-none" style={{
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                color: '#1f2937',
                border: 'none',
                borderRadius: '50px',
                fontSize: '1.2rem',
                boxShadow: '0 8px 30px rgba(251, 191, 36, 0.4)',
                transition: 'all 0.3s ease',
                transform: 'translateY(0)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(251, 191, 36, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(251, 191, 36, 0.4)';
              }}>
                <i className="bi bi-play-circle me-2"></i>
                시작하기
              </a>
              
              <button className="btn px-5 py-3 fw-bold" style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '50px',
                fontSize: '1.2rem',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                transform: 'translateY(0)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}>
                <i className="bi bi-person-circle me-2"></i>
                로그인
              </button>
              
              {!user && (
                <button 
                  className="btn px-5 py-3 fw-bold" 
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50px',
                    fontWeight: '600',
                    fontSize: '1.2rem',
                    boxShadow: '0 8px 30px rgba(16, 185, 129, 0.4)',
                    transition: 'all 0.3s ease',
                    transform: 'translateY(0)'
                  }}
                  onClick={loginAsTestUser}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(16, 185, 129, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(16, 185, 129, 0.4)';
                  }}
                >
                  <i className="bi bi-person-check me-2"></i>
                  테스트 계정으로 로그인
                </button>
              )}
            </div>
            
            {/* 추가 정보 */}
            <div className="mt-5" style={{
              animation: 'fadeInUp 1s ease-out 0.6s both'
            }}>
              <div className="d-flex justify-content-center gap-5 text-white-50">
                <div className="text-center">
                  <div className="fs-3 fw-bold text-white">10,000+</div>
                  <small>활성 사용자</small>
                </div>
                <div className="text-center">
                  <div className="fs-3 fw-bold text-white">50,000+</div>
                  <small>완료된 연습</small>
                </div>
                <div className="text-center">
                  <div className="fs-3 fw-bold text-white">95%</div>
                  <small>만족도</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 개선된 주요 기능 카드 */}
        <section 
          className={`mb-5 fade-in ${isVisible ? 'visible' : ''}`}
          id="features" 
          aria-labelledby="features-title"
          style={{ animationDelay: '0.1s' }}
        >
          <div className="text-center mb-5">
            <span className="badge px-4 py-3 rounded-pill mb-3" style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
              color: 'white',
              fontSize: '1rem',
              fontWeight: '600',
              boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
            }}>
              ✨ 혁신적인 기능들
            </span>
            <h2 id="features-title" className="display-4 fw-bold mb-3" style={{color: COLORS.text.primary}}>
              AI가 만드는 <span style={{color: '#8b5cf6'}}>음악 학습의 미래</span>
            </h2>
            <p className="lead mb-0" style={{color: COLORS.text.secondary, fontSize: '1.2rem'}}>
              첨단 기술과 음악 교육의 완벽한 만남으로 당신의 연주 실력을 한 단계 끌어올리세요
            </p>
          </div>
          <div className="row g-4">
            {FEATURES.map((feature, index) => (
              <div key={index} className="col-lg-4 col-md-6" style={{
                animation: `fadeInUp 0.8s ease-out ${0.2 + index * 0.1}s both`
              }}>
                <div className="card h-100 border-0 position-relative overflow-hidden feature-card" style={{
                  ...CARD_STYLES.dark,
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: 'translateY(0)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
                }}>
                  {/* 카드 번호 */}
                  <div className="position-absolute top-0 end-0 p-3">
                    <div className="badge rounded-circle p-3" style={{
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: '600',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {index + 1}
                    </div>
                  </div>
                  
                  {/* 카드 내용 */}
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-4">
                      <div className="feature-icon me-3" style={{
                        width: '70px',
                        height: '70px',
                        background: `linear-gradient(135deg, ${feature.color === 'primary' ? '#8b5cf6, #a78bfa' : feature.color === 'success' ? '#10b981, #34d399' : feature.color === 'warning' ? '#f59e0b, #fbbf24' : '#3b82f6, #60a5fa'})`,
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                        transition: 'all 0.3s ease'
                      }}>
                        <i className={`bi ${feature.icon} fs-1`} style={{color: 'white'}}></i>
                      </div>
                      <h5 className="mb-0 fw-bold" style={{
                        color: COLORS.text.primary,
                        fontSize: '1.3rem'
                      }}>{feature.title}</h5>
                    </div>
                    
                    <p className="mb-4" style={{
                      color: COLORS.text.secondary,
                      lineHeight: '1.7',
                      fontSize: '1rem'
                    }}>{feature.description}</p>
                    
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="badge px-3 py-2 rounded-pill" style={{
                        background: `rgba(${feature.color === 'primary' ? '139, 92, 246' : feature.color === 'success' ? '16, 185, 129' : feature.color === 'warning' ? '245, 158, 11' : '59, 130, 246'}, 0.15)`,
                        color: feature.color === 'primary' ? '#8b5cf6' : feature.color === 'success' ? '#10b981' : feature.color === 'warning' ? '#f59e0b' : '#3b82f6',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        border: `1px solid rgba(${feature.color === 'primary' ? '139, 92, 246' : feature.color === 'success' ? '16, 185, 129' : feature.color === 'warning' ? '245, 158, 11' : '59, 130, 246'}, 0.3)`
                      }}>
                        {feature.tag}
                      </span>
                      
                      <a href={feature.link} className="text-decoration-none d-flex align-items-center" style={{
                        color: '#8b5cf6',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        transform: 'translateX(0)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateX(5px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}>
                        자세히 보기 <i className="bi bi-arrow-right ms-2" style={{transition: 'all 0.3s ease'}}></i>
                      </a>
                    </div>
                  </div>
                  
                  {/* 카드 배경 그라디언트 효과 */}
                  <div className="position-absolute bottom-0 start-0 w-100" 
                       style={{
                         height: '4px',
                         background: `linear-gradient(90deg, ${feature.color === 'primary' ? '#8b5cf6' : feature.color === 'success' ? '#10b981' : feature.color === 'warning' ? '#f59e0b' : '#3b82f6'} 0%, ${feature.color === 'primary' ? '#a78bfa' : feature.color === 'success' ? '#34d399' : feature.color === 'warning' ? '#fbbf24' : '#60a5fa'} 100%)`,
                         transition: 'all 0.3s ease'
                       }}></div>
                </div>
              </div>
            ))}
          </div>
        </section>



        {/* 🏆 커뮤니티 리더보드 & 📊 실시간 대시보드 - 나란히 배치 */}
        <section className={`mb-5 fade-in ${isVisible ? 'visible' : ''}`} style={{ animationDelay: '0.4s' }}>
          <div className="text-center mb-5">
            <div className="d-inline-flex align-items-center gap-3 mb-3">
              <div className="d-flex align-items-center gap-2">
                <div className="pulse-dot" style={{
                  width: '8px',
                  height: '8px',
                  background: '#f59e0b',
                  borderRadius: '50%',
                  animation: 'pulse 2s infinite'
                }}></div>
                <span className="badge px-4 py-2 rounded-pill" style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  border: 'none',
                  boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)'
                }}>
                  🏆 커뮤니티 리더보드
                </span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <div className="pulse-dot" style={{
                  width: '8px',
                  height: '8px',
                  background: '#10b981',
                  borderRadius: '50%',
                  animation: 'pulse 2s infinite'
                }}></div>
                <span className="badge px-4 py-2 rounded-pill" style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  border: 'none',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                }}>
                  📊 실시간 대시보드
                </span>
              </div>
            </div>
            <h2 className="display-6 fw-bold mb-3" style={{
              color: COLORS.text.primary,
              fontSize: '2.5rem',
              lineHeight: '1.2',
              background: 'linear-gradient(135deg, #f59e0b 0%, #10b981 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              <span style={{color: '#fbbf24'}}>커뮤니티</span>와 <span style={{color: '#34d399'}}>성장</span>을 한눈에
            </h2>
            <p className="lead mb-0" style={{
              color: COLORS.text.secondary,
              fontSize: '1.125rem',
              lineHeight: '1.6',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              최고의 연주자들과 함께하고, 당신의 음악 여정을 추적해보세요
            </p>
          </div>
          
          <div className="row g-4">
            {/* 🏆 커뮤니티 리더보드 - 왼쪽 */}
            <div className="col-lg-6">
              <div className="card border-0 shadow-lg hover-shadow h-100" style={{
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                borderRadius: '24px',
                border: '1px solid rgba(245, 158, 11, 0.15)',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                transform: 'translateY(0)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
              }}>
                <div className="card-header border-0 bg-transparent d-flex align-items-center justify-content-between p-4" style={{
                  background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)'
                }}>
                  <div className="d-flex align-items-center gap-3">
                    <div className="section-icon" style={{
                      width: '40px',
                      height: '40px',
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)'
                    }}>
                      <i className="bi bi-trophy text-white fs-5"></i>
                    </div>
                    <div>
                      <h5 className="mb-1 text-white" style={{
                        fontSize: '1.25rem',
                        fontWeight: '600'
                      }}>🏆 커뮤니티 리더보드</h5>
                      <small style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.875rem'
                      }}>이번 주 최고의 연주자들</small>
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <span className="badge px-3 py-2" style={{
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      border: 'none',
                      animation: 'pulse 2s infinite'
                    }}>
                      <i className="bi bi-fire me-1"></i>
                      HOT
                    </span>
                    <button className="btn btn-outline-warning btn-sm px-3 py-2" style={{
                      borderColor: '#f59e0b',
                      color: '#f59e0b',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      background: 'transparent',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f59e0b';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#f59e0b';
                    }}>
                      <i className="bi bi-arrow-clockwise me-1"></i>
                      새로고침
                    </button>
                  </div>
                </div>
                
                <div className="card-body p-4">
                  {/* 통계 배지들 */}
                  <div className="row mb-4">
                    <div className="col-md-4 text-center mb-3">
                      <div className="badge px-3 py-2 rounded-pill" style={{
                        background: 'rgba(245, 158, 11, 0.1)',
                        color: '#fbbf24',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        border: '1px solid rgba(245, 158, 11, 0.2)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(245, 158, 11, 0.2)';
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}>
                        <i className="bi bi-trophy-fill me-1"></i>
                        주간 챔피언
                      </div>
                    </div>
                    <div className="col-md-4 text-center mb-3">
                      <div className="badge px-3 py-2 rounded-pill" style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        color: '#60a5fa',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}>
                        <i className="bi bi-people-fill me-1"></i>
                        10,000+ 사용자
                      </div>
                    </div>
                    <div className="col-md-4 text-center mb-3">
                      <div className="badge px-3 py-2 rounded-pill" style={{
                        background: 'rgba(34, 197, 94, 0.1)',
                        color: '#4ade80',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        border: '1px solid rgba(34, 197, 94, 0.2)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(34, 197, 94, 0.2)';
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(34, 197, 94, 0.1)';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}>
                        <i className="bi bi-graph-up me-1"></i>
                        실시간 업데이트
                      </div>
                    </div>
                  </div>
                  
                  {/* 리더보드 */}
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
                      { id: '5', rank: 5, name: '🎺 트럼펫 마스터', score: 2490, category: '🎵 열정적인 연주자', change: 0 },
                      { id: '6', rank: 6, name: '🎷 색소폰 플레이어', score: 2410, category: '🎵 열정적인 연주자', change: 4 },
                      { id: '7', rank: 7, name: '🎼 작곡가 드림', score: 2350, category: '🎵 열정적인 연주자', change: -2 },
                      { id: '8', rank: 8, name: '🎤 보컬리스트', score: 2280, category: '🎵 열정적인 연주자', change: 1 },
                      { id: '9', rank: 9, name: '🎹 클래식 피아니스트', score: 2210, category: '🎵 열정적인 연주자', change: 0 },
                      { id: '10', rank: 10, name: '🎸 베이스 마스터', score: 2140, category: '🎵 열정적인 연주자', change: 2 }
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* 📊 실시간 대시보드 - 오른쪽 */}
            <div className="col-lg-6">
              <div className="card border-0 shadow-lg hover-shadow h-100" style={{
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                borderRadius: '24px',
                border: '1px solid rgba(16, 185, 129, 0.15)',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                transform: 'translateY(0)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
              }}>
                <div className="card-header border-0 bg-transparent d-flex align-items-center justify-content-between p-4" style={{
                  background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.1) 0%, rgba(34, 197, 94, 0.1) 100%)'
                }}>
                  <div className="d-flex align-items-center gap-3">
                    <div className="section-icon" style={{
                      width: '40px',
                      height: '40px',
                      background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                    }}>
                      <i className="bi bi-graph-up text-white fs-5"></i>
                    </div>
                    <div>
                      <h5 className="mb-1 text-white" style={{
                        fontSize: '1.25rem',
                        fontWeight: '600'
                      }}>📊 실시간 대시보드</h5>
                      <small style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.875rem'
                      }}>당신의 성장을 한눈에</small>
                    </div>
                  </div>
                  <div className="badge px-3 py-2" style={{
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    border: 'none',
                    animation: 'pulse 2s infinite'
                  }}>
                    <i className="bi bi-circle-fill me-1" style={{fontSize: '6px'}}></i>
                    Live
                  </div>
                </div>
                
                <div className="card-body p-4">
                  {/* 📈 학습 진행 상황 */}
                  <div className="mb-4">
                    <h6 className="fw-bold mb-3 text-white">📈 학습 진행 상황</h6>
                    <ProgressChart 
                      title="이번 주 연습 시간"
                      progress={userSummary?.totalPracticeTime || 0}
                      target={1000}
                      unit="분"
                      color="primary"
                      description="꾸준한 연습으로 목표에 가까워지고 있어요! 💪"
                    />
                  </div>
                  
                  {/* 🎯 최근 활동 */}
                  <div>
                    <h6 className="fw-bold mb-3 text-white">🎯 최근 활동</h6>
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
                  AI 기반의 전문적인 화성학 지식으로 작곡을 도와드립니다
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
                  AI 기반의 체계적인 화성학 학습으로 음악적 이해를 높여보세요
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
      
      {/* CSS 애니메이션 스타일 */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .hero-section {
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hero-section.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        .hero-section:not(.visible) {
          opacity: 0;
          transform: translateY(30px);
        }
        
        .feature-card:hover .feature-icon {
          transform: scale(1.1) rotate(5deg);
        }
      `}</style>
    </div>
  );
} 