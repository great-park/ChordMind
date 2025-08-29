import React from 'react';

const Sidebar = () => {
  return (
    <div className="sidebar bg-dark-blue text-white p-4 h-100" style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      minWidth: '320px',
      borderRight: '1px solid rgba(139, 92, 246, 0.3)',
      boxShadow: '4px 0 20px rgba(0, 0, 0, 0.3)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* 배경 파티클 효과 */}
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{
        background: 'radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
        pointerEvents: 'none',
        zIndex: 1
      }}></div>
      
      {/* 애니메이션 배경 라인 */}
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{
        background: 'linear-gradient(90deg, transparent 0%, rgba(139, 92, 246, 0.05) 50%, transparent 100%)',
        animation: 'slideRight 8s linear infinite',
        pointerEvents: 'none',
        zIndex: 1
      }}></div>

      {/* 🎵 ChordMind 브랜드 섹션 - 최상단 */}
      <div className="brand-section mb-5" style={{position: 'relative', zIndex: 2}}>
        <div className="d-flex align-items-center mb-4">
          <div className="brand-icon me-3" style={{
            width: '50px',
            height: '50px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4)',
            transition: 'all 0.3s ease',
            animation: 'pulse 2s infinite'
          }}>
            <i className="bi bi-music-note text-white fs-4"></i>
          </div>
          <div>
            <h4 className="mb-0 fw-bold" style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '1.5rem'
            }}>ChordMind</h4>
            <div className="brand-subtitle" style={{
              width: '60px',
              height: '2px',
              background: 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)',
              marginTop: '4px',
              borderRadius: '1px'
            }}></div>
          </div>
        </div>
        <div className="brand-description p-3 rounded" style={{
          background: 'rgba(139, 92, 246, 0.1)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          backdropFilter: 'blur(10px)'
        }}>
          <p className="text-light mb-2" style={{fontSize: '0.9rem', opacity: 0.9, margin: 0}}>
            AI 기반 음악 연주 분석 및 코칭 서비스
          </p>
          <p className="text-light mb-0" style={{fontSize: '0.9rem', opacity: 0.9, margin: 0}}>
            당신의 음악 여정을 함께합니다
          </p>
        </div>
      </div>

      {/* 🚀 성장 인사이트 섹션 */}
      <div className="service-section mb-5" style={{position: 'relative', zIndex: 2}}>
        <div className="section-header d-flex align-items-center mb-4">
          <div className="section-icon me-3" style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(251, 191, 36, 0.3)'
          }}>
            <i className="bi bi-lightbulb text-white"></i>
          </div>
          <h6 className="mb-0 fw-bold" style={{color: '#fbbf24'}}>🚀 성장 인사이트</h6>
          <div className="section-line ms-auto" style={{
            width: '40px',
            height: '2px',
            background: 'linear-gradient(90deg, #fbbf24 0%, transparent 100%)',
            borderRadius: '1px'
          }}></div>
        </div>

        <div className="card border-0 mb-3" style={{
          background: 'rgba(251, 191, 36, 0.1)',
          border: '1px solid rgba(251, 191, 36, 0.2)',
          borderRadius: '12px'
        }}>
          <div className="card-body p-3">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex align-items-center">
                <i className="bi bi-graph-up me-2" style={{color: '#fbbf24', fontSize: '1rem'}}></i>
                <small className="fw-bold" style={{color: '#fbbf24'}}>이번 주 목표 달성률</small>
              </div>
              <span className="badge px-2 py-1" style={{
                background: 'rgba(139, 92, 246, 0.2)',
                color: '#8b5cf6',
                fontSize: '0.7rem',
                fontWeight: '600'
              }}>84%</span>
            </div>
            
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <small style={{color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.7rem'}}>목표: 5시간</small>
                <small style={{color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.7rem'}}>4.2시간</small>
              </div>
              <div className="progress" style={{height: '6px', borderRadius: '3px', background: 'rgba(255, 255, 255, 0.1)'}}>
                <div className="progress-bar" style={{
                  width: '84%',
                  background: 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)',
                  borderRadius: '3px'
                }}></div>
              </div>
            </div>
            
            <div className="d-flex align-items-center justify-content-between">
              <small style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.75rem'
              }}>
                <i className="bi bi-arrow-up-circle me-1" style={{color: '#10b981'}}></i>
                +12% 향상
              </small>
              <div className="d-flex align-items-center">
                <i className="bi bi-fire me-1" style={{color: '#ef4444', fontSize: '0.7rem'}}></i>
                <small style={{color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.65rem'}}>Live</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 퀴즈 & 통계 섹션 */}
      <div className="service-section mb-5" style={{position: 'relative', zIndex: 2}}>
        <div className="section-header d-flex align-items-center mb-4">
          <div className="section-icon me-3" style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(236, 72, 153, 0.3)'
          }}>
            <i className="bi bi-brain text-white"></i>
          </div>
          <h6 className="mb-0 fw-bold" style={{color: '#ec4899'}}>🧠 퀴즈 & 통계</h6>
          <div className="section-line ms-auto" style={{
            width: '40px',
            height: '2px',
            background: 'linear-gradient(90deg, #ec4899 0%, transparent 100%)',
            borderRadius: '1px'
          }}></div>
        </div>

        {/* 퀴즈 위젯 */}
        <div className="card border-0 mb-3" style={{
          background: 'rgba(236, 72, 153, 0.1)',
          border: '1px solid rgba(236, 72, 153, 0.2)',
          borderRadius: '12px'
        }}>
          <div className="card-body p-3">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <div className="d-flex align-items-center">
                <i className="bi bi-question-circle me-2" style={{color: '#ec4899', fontSize: '1rem'}}></i>
                <small className="fw-bold" style={{color: '#ec4899'}}>오늘의 퀴즈</small>
              </div>
              <span className="badge px-2 py-1" style={{
                background: 'rgba(139, 92, 246, 0.2)',
                color: '#8b5cf6',
                fontSize: '0.7rem',
                fontWeight: '600'
              }}>#1</span>
            </div>
            <p className="mb-2" style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '0.8rem',
              lineHeight: '1.4',
              margin: 0
            }}>C Major 스케일의 첫 번째 음은?</p>
            <div className="d-grid gap-1">
              {['A. C', 'B. D', 'C. E', 'D. F'].map((option, index) => (
                <button key={index} className="btn btn-sm text-start" style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.5rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }}>
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 통계 카드들 */}
        <div className="row g-2">
          {[
            { icon: 'bi-clock', value: '20h 30m', label: '총 연습', change: '+2h 15m', color: '#8b5cf6' },
            { icon: 'bi-calendar-check', value: '5일', label: '이번 주', change: '+1일', color: '#10b981' },
            { icon: 'bi-circle', value: '85%', label: '평균 점수', change: '+3%', color: '#3b82f6' },
            { icon: 'bi-fire', value: '7일', label: '연속 연습', change: '+2일', color: '#f59e0b' }
          ].map((stat, index) => (
            <div key={index} className="col-6">
              <div className="card border-0" style={{
                background: `rgba(${stat.color === '#8b5cf6' ? '139, 92, 246' : stat.color === '#10b981' ? '16, 185, 129' : stat.color === '#3b82f6' ? '59, 130, 246' : '245, 158, 11'}, 0.1)`,
                border: `1px solid rgba(${stat.color === '#8b5cf6' ? '139, 92, 246' : stat.color === '#10b981' ? '16, 185, 129' : stat.color === '#3b82f6' ? '59, 130, 246' : '245, 158, 11'}, 0.2)`,
                borderRadius: '8px'
              }}>
                <div className="card-body p-2 text-center">
                  <div className="d-flex align-items-center justify-content-center mb-1">
                    <i className={`bi ${stat.icon}`} style={{
                      color: stat.color,
                      fontSize: '0.8rem',
                      marginRight: '0.25rem'
                    }}></i>
                    <small style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.6rem'
                    }}>{stat.change}</small>
                  </div>
                  <div className="fw-bold" style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '0.9rem',
                    lineHeight: '1'
                  }}>{stat.value}</div>
                  <small style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '0.65rem'
                  }}>{stat.label}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ⭐ 핵심 기능 */}
      <div className="service-section mb-5" style={{position: 'relative', zIndex: 2}}>
        <div className="section-header d-flex align-items-center mb-4">
          <div className="section-icon me-3" style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
          }}>
            <i className="bi bi-star text-white"></i>
          </div>
          <h6 className="mb-0 fw-bold" style={{color: '#8b5cf6'}}>⭐ 핵심 기능</h6>
          <div className="section-line ms-auto" style={{
            width: '40px',
            height: '2px',
            background: 'linear-gradient(90deg, #8b5cf6 0%, transparent 100%)',
            borderRadius: '1px'
          }}></div>
        </div>

        <ul className="nav flex-column gap-2">
          <li className="nav-item">
            <a href="/practice" className="nav-link-item d-flex align-items-center p-3 rounded" style={{
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              color: 'rgba(255, 255, 255, 0.9)',
              textDecoration: 'none',
              transition: 'all 0.3s ease'
            }}>
              <i className="bi bi-play-circle me-3" style={{color: '#8b5cf6', fontSize: '1.2rem'}}></i>
              <span className="fw-medium">연습하기</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="/composition" className="nav-link-item d-flex align-items-center p-3 rounded" style={{
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              color: 'rgba(255, 255, 255, 0.9)',
              textDecoration: 'none',
              transition: 'all 0.3s ease'
            }}>
              <i className="bi bi-music-note me-3" style={{color: '#8b5cf6', fontSize: '1.2rem'}}></i>
              <span className="fw-medium">AI 작곡</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="/theory" className="nav-link-item d-flex align-items-center p-3 rounded" style={{
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              color: 'rgba(255, 255, 255, 0.9)',
              textDecoration: 'none',
              transition: 'all 0.3s ease'
            }}>
              <i className="bi bi-book me-3" style={{color: '#8b5cf6', fontSize: '1.2rem'}}></i>
              <span className="fw-medium">음악 이론</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="/practice-plan" className="nav-link-item d-flex align-items-center p-3 rounded" style={{
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              color: 'rgba(255, 255, 255, 0.9)',
              textDecoration: 'none',
              transition: 'all 0.3s ease'
            }}>
              <i className="bi bi-calendar-check me-3" style={{color: '#8b5cf6', fontSize: '1.2rem'}}></i>
              <span className="fw-medium">맞춤 연습</span>
            </a>
          </li>
        </ul>
      </div>

      {/* 🤖 AI 서비스 */}
      <div className="service-section mb-5" style={{position: 'relative', zIndex: 2}}>
        <div className="section-header d-flex align-items-center mb-4">
          <div className="section-icon me-3" style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
          }}>
            <i className="bi bi-robot text-white"></i>
          </div>
          <h6 className="mb-0 fw-bold" style={{color: '#10b981'}}>🤖 AI 서비스</h6>
          <div className="section-line ms-auto" style={{
            width: '40px',
            height: '2px',
            background: 'linear-gradient(90deg, #10b981 0%, transparent 100%)',
            borderRadius: '1px'
          }}></div>
        </div>

        <ul className="nav flex-column gap-2">
          <li className="nav-item">
            <a href="/ai-analysis" className="nav-link-item d-flex align-items-center p-3 rounded" style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              color: 'rgba(255, 255, 255, 0.9)',
              textDecoration: 'none',
              transition: 'all 0.3s ease'
            }}>
              <i className="bi bi-cpu me-3" style={{color: '#10b981', fontSize: '1.2rem'}}></i>
              <span className="fw-medium">실시간 분석</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="/ai-services" className="nav-link-item d-flex align-items-center p-3 rounded" style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              color: 'rgba(255, 255, 255, 0.9)',
              textDecoration: 'none',
              transition: 'all 0.3s ease'
            }}>
              <i className="bi bi-gear me-3" style={{color: '#10b981', fontSize: '1.2rem'}}></i>
              <span className="fw-medium">AI 서비스</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="/ai-learning" className="nav-link-item d-flex align-items-center p-3 rounded" style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              color: 'rgba(255, 255, 255, 0.9)',
              textDecoration: 'none',
              transition: 'all 0.3s ease'
            }}>
              <i className="bi bi-mortarboard me-3" style={{color: '#10b981', fontSize: '1.2rem'}}></i>
              <span className="fw-medium">AI 음악 학습</span>
            </a>
          </li>
        </ul>
      </div>

      {/* 🔧 학습 도구 */}
      <div className="service-section mb-5" style={{position: 'relative', zIndex: 2}}>
        <div className="section-header d-flex align-items-center mb-4">
          <div className="section-icon me-3" style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)'
          }}>
            <i className="bi bi-tools text-white"></i>
          </div>
          <h6 className="mb-0 fw-bold" style={{color: '#f59e0b'}}>🔧 학습 도구</h6>
          <div className="section-line ms-auto" style={{
            width: '40px',
            height: '2px',
            background: 'linear-gradient(90deg, #f59e0b 0%, transparent 100%)',
            borderRadius: '1px'
          }}></div>
        </div>

        <ul className="nav flex-column gap-2">

          <li className="nav-item">
            <a href="/practice-modes" className="nav-link-item d-flex align-items-center p-3 rounded" style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              color: 'rgba(255, 255, 255, 0.9)',
              textDecoration: 'none',
              transition: 'all 0.3s ease'
            }}>
              <i className="bi bi-play-btn me-3" style={{color: '#f59e0b', fontSize: '1.2rem'}}></i>
              <span className="fw-medium">연습 모드</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="/progress" className="nav-link-item d-flex align-items-center p-3 rounded" style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              color: 'rgba(255, 255, 255, 0.9)',
              textDecoration: 'none',
              transition: 'all 0.3s ease'
            }}>
              <i className="bi bi-bar-chart me-3" style={{color: '#f59e0b', fontSize: '1.2rem'}}></i>
              <span className="fw-medium">진행도</span>
            </a>
          </li>
        </ul>
      </div>

      {/* 👥 커뮤니티 & 관리 */}
      <div className="service-section mb-5" style={{position: 'relative', zIndex: 2}}>
        <div className="section-header d-flex align-items-center mb-4">
          <div className="section-icon me-3" style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
          }}>
            <i className="bi bi-people text-white"></i>
          </div>
          <h6 className="mb-0 fw-bold" style={{color: '#3b82f6'}}>👥 커뮤니티 & 관리</h6>
          <div className="section-line ms-auto" style={{
            width: '40px',
            height: '2px',
            background: 'linear-gradient(90deg, #3b82f6 0%, transparent 100%)',
            borderRadius: '1px'
          }}></div>
        </div>

        <ul className="nav flex-column gap-2">
          <li className="nav-item">
            <a href="/community" className="nav-link-item d-flex align-items-center p-3 rounded" style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              color: 'rgba(255, 255, 255, 0.9)',
              textDecoration: 'none',
              transition: 'all 0.3s ease'
            }}>
              <i className="bi bi-people me-3" style={{color: '#3b82f6', fontSize: '1.2rem'}}></i>
              <span className="fw-medium">커뮤니티</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="/achievements" className="nav-link-item d-flex align-items-center p-3 rounded" style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              color: 'rgba(255, 255, 255, 0.9)',
              textDecoration: 'none',
              transition: 'all 0.3s ease'
            }}>
              <i className="bi bi-trophy me-3" style={{color: '#3b82f6', fontSize: '1.2rem'}}></i>
              <span className="fw-medium">업적 시스템</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="/feedback" className="nav-link-item d-flex align-items-center p-3 rounded" style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              color: 'rgba(255, 255, 255, 0.9)',
              textDecoration: 'none',
              transition: 'all 0.3s ease'
            }}>
              <i className="bi bi-chat-dots me-3" style={{color: '#3b82f6', fontSize: '1.2rem'}}></i>
              <span className="fw-medium">피드백</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="/dashboard" className="nav-link-item d-flex align-items-center p-3 rounded" style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              color: 'rgba(255, 255, 255, 0.9)',
              textDecoration: 'none',
              transition: 'all 0.3s ease'
            }}>
              <i className="bi bi-graph-up me-3" style={{color: '#3b82f6', fontSize: '1.2rem'}}></i>
              <span className="fw-medium">대시보드</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="/profile" className="nav-link-item d-flex align-items-center p-3 rounded" style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              color: 'rgba(255, 255, 255, 0.9)',
              textDecoration: 'none',
              transition: 'all 0.3s ease'
            }}>
              <i className="bi bi-person-circle me-3" style={{color: '#3b82f6', fontSize: '1.2rem'}}></i>
              <span className="fw-medium">프로필</span>
            </a>
          </li>
        </ul>
      </div>

      {/* ❓ 지원 섹션 */}
      <div className="support-section mb-5">
        <div className="section-header d-flex align-items-center mb-3">
          <i className="bi bi-headphones me-2 text-purple"></i>
          <h6 className="mb-0 fw-bold">❓ 지원</h6>
          <div className="purple-underline ms-2" style={{
            width: '20px',
            height: '2px',
            background: '#8b5cf6',
            borderRadius: '1px'
          }}></div>
        </div>
        <ul className="list-unstyled">
          <li className="mb-2">
            <a href="/help" className="text-light text-decoration-none" style={{opacity: 0.8, fontSize: '0.9rem'}}>
              도움말
            </a>
          </li>
          <li className="mb-2">
            <a href="/contact" className="text-light text-decoration-none" style={{opacity: 0.8, fontSize: '0.9rem'}}>
              문의하기
            </a>
          </li>
          <li className="mb-2">
            <a href="/faq" className="text-light text-decoration-none" style={{opacity: 0.8, fontSize: '0.9rem'}}>
              자주 묻는 질문
            </a>
          </li>
          <li className="mb-2">
            <a href="/tutorial" className="text-light text-decoration-none" style={{opacity: 0.8, fontSize: '0.9rem'}}>
              튜토리얼
            </a>
          </li>
        </ul>
      </div>

      {/* 📄 법적 고지 섹션 */}
      <div className="legal-section mb-5">
        <div className="section-header d-flex align-items-center mb-3">
          <i className="bi bi-file-text me-2 text-purple"></i>
          <h6 className="mb-0 fw-bold">📄 법적 고지</h6>
          <div className="purple-underline ms-2" style={{
            width: '20px',
            height: '2px',
            background: '#8b5cf6',
            borderRadius: '1px'
          }}></div>
        </div>
        <ul className="list-unstyled">
          <li className="mb-2">
            <a href="/privacy" className="text-light text-decoration-none" style={{opacity: 0.8, fontSize: '0.9rem'}}>
              개인정보처리방침
            </a>
          </li>
          <li className="mb-2">
            <a href="/terms" className="text-light text-decoration-none" style={{opacity: 0.8, fontSize: '0.9rem'}}>
              이용약관
            </a>
          </li>
          <li className="mb-2">
            <a href="/license" className="text-light text-decoration-none" style={{opacity: 0.8, fontSize: '0.9rem'}}>
              라이선스
            </a>
          </li>
        </ul>
      </div>

      {/* 🔔 소식받기 섹션 */}
      <div className="newsletter-section">
        <div className="section-header d-flex align-items-center mb-3">
          <i className="bi bi-bell me-2 text-purple"></i>
          <h6 className="mb-0 fw-bold">🔔 소식받기</h6>
          <div className="purple-underline ms-2" style={{
            width: '20px',
            height: '2px',
            background: '#8b5cf6',
            borderRadius: '1px'
          }}></div>
        </div>
        <p className="text-light mb-3" style={{fontSize: '0.9rem', opacity: 0.8}}>
          새로운 기능과 팁을 가장 먼저 받아보세요!
        </p>
        <div className="input-group">
          <input 
            type="email" 
            className="form-control" 
            placeholder="이메일 주소"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              borderRadius: '8px 0 0 8px'
            }}
          />
          <button 
            className="btn btn-purple" 
            type="button"
            style={{
              background: '#8b5cf6',
              border: '1px solid #8b5cf6',
              color: 'white',
              borderRadius: '0 8px 8px 0'
            }}
          >
            <i className="bi bi-send text-white"></i>
          </button>
        </div>
      </div>

      <style jsx>{`
        .sidebar {
          animation: slideRight 0.5s ease-out;
        }

        @keyframes slideRight {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .brand-icon {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .nav-link-item {
          transition: all 0.3s ease;
        }

        .nav-link-item:hover {
          transform: translateX(8px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        /* 핵심 기능 호버 효과 */
        .service-section:nth-child(4) .nav-link-item:hover {
          background: rgba(139, 92, 246, 0.15) !important;
          border-color: rgba(139, 92, 246, 0.3) !important;
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.2);
        }

        /* AI 서비스 호버 효과 */
        .service-section:nth-child(5) .nav-link-item:hover {
          background: rgba(16, 185, 129, 0.15) !important;
          border-color: rgba(16, 185, 129, 0.3) !important;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.2);
        }

        /* 학습 도구 호버 효과 */
        .service-section:nth-child(6) .nav-link-item:hover {
          background: rgba(245, 158, 11, 0.15) !important;
          border-color: rgba(245, 158, 11, 0.3) !important;
          box-shadow: 0 4px 15px rgba(245, 158, 11, 0.2);
        }

        /* 커뮤니티 & 관리 호버 효과 */
        .service-section:nth-child(7) .nav-link-item:hover {
          background: rgba(59, 130, 246, 0.15) !important;
          border-color: rgba(59, 130, 246, 0.3) !important;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.2);
        }
        
        .nav-link-item {
          position: relative;
          overflow: hidden;
        }

        .nav-link-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.1), transparent);
          transition: left 0.5s ease;
        }

        .nav-link-item:hover::before {
          left: 100%;
        }

        .section-header:hover .section-icon {
          transform: scale(1.1) rotate(5deg);
        }

        .section-icon {
          transition: all 0.3s ease;
        }

        .text-purple {
          color: #8b5cf6 !important;
        }

        .text-warning {
          color: #fbbf24 !important;
        }

        .text-primary {
          color: #8b5cf6 !important;
        }

        .text-success {
          color: #10b981 !important;
        }

        .text-info {
          color: #3b82f6 !important;
        }

        .btn-purple:hover {
          background: #7c3aed !important;
          border-color: #7c3aed !important;
        }

        .form-control::placeholder {
          color: rgba(255, 255, 255, 0.6) !important;
        }

        .form-control:focus {
          background: rgba(255, 255, 255, 0.15) !important;
          border-color: rgba(255, 255, 255, 0.4) !important;
          box-shadow: 0 0 0 0.2rem rgba(139, 92, 246, 0.25) !important;
          color: white !important;
        }

        .service-section {
          animation: fadeInUp 0.6s ease-out;
        }

        .service-section:nth-child(1) { animation-delay: 0.1s; }
        .service-section:nth-child(2) { animation-delay: 0.2s; }
        .service-section:nth-child(3) { animation-delay: 0.3s; }
        .service-section:nth-child(4) { animation-delay: 0.4s; }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
