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
      {/* 브랜드 로고 섹션 */}
      <div className="brand-section mb-6" style={{position: 'relative', zIndex: 2}}>
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

      {/* 핵심 기능 */}
      <div className="service-section mb-4" style={{position: 'relative', zIndex: 2}}>
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
            <i className="bi bi-star text-white"></i>
          </div>
          <h6 className="mb-0 fw-bold" style={{color: '#fbbf24'}}>핵심 기능</h6>
          <div className="section-line ms-auto" style={{
            width: '40px',
            height: '2px',
            background: 'linear-gradient(90deg, #fbbf24 0%, transparent 100%)',
            borderRadius: '1px'
          }}></div>
        </div>
        <ul className="list-unstyled">
          <li className="mb-3">
            <a href="/practice" className="nav-link-item d-flex align-items-center p-2 rounded" style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '0.9rem',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              background: 'rgba(251, 191, 36, 0.05)',
              border: '1px solid rgba(251, 191, 36, 0.1)'
            }}>
              <div className="nav-icon me-3" style={{
                width: '24px',
                height: '24px',
                background: 'rgba(251, 191, 36, 0.2)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="bi bi-play-circle" style={{color: '#fbbf24', fontSize: '0.8rem'}}></i>
              </div>
              연습하기
            </a>
          </li>
          <li className="mb-3">
            <a href="/composition" className="nav-link-item d-flex align-items-center p-2 rounded" style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '0.9rem',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              background: 'rgba(251, 191, 36, 0.05)',
              border: '1px solid rgba(251, 191, 36, 0.1)'
            }}>
              <div className="nav-icon me-3" style={{
                width: '24px',
                height: '24px',
                background: 'rgba(251, 191, 36, 0.2)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="bi bi-music-note-beamed" style={{color: '#fbbf24', fontSize: '0.8rem'}}></i>
              </div>
              AI 작곡
            </a>
          </li>
          <li className="mb-3">
            <a href="/theory" className="nav-link-item d-flex align-items-center p-2 rounded" style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '0.9rem',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              background: 'rgba(251, 191, 36, 0.05)',
              border: '1px solid rgba(251, 191, 36, 0.1)'
            }}>
              <div className="nav-icon me-3" style={{
                width: '24px',
                height: '24px',
                background: 'rgba(251, 191, 36, 0.2)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="bi bi-book" style={{color: '#fbbf24', fontSize: '0.8rem'}}></i>
              </div>
              음악 이론
            </a>
          </li>
          <li className="mb-3">
            <a href="/practice-plan" className="nav-link-item d-flex align-items-center p-2 rounded" style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '0.9rem',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              background: 'rgba(251, 191, 36, 0.05)',
              border: '1px solid rgba(251, 191, 36, 0.1)'
            }}>
              <div className="nav-icon me-3" style={{
                width: '24px',
                height: '24px',
                background: 'rgba(251, 191, 36, 0.2)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="bi bi-calendar-check" style={{color: '#fbbf24', fontSize: '0.8rem'}}></i>
              </div>
              맞춤 연습
            </a>
          </li>
        </ul>
      </div>

      {/* AI 서비스 */}
      <div className="service-section mb-4" style={{position: 'relative', zIndex: 2}}>
        <div className="section-header d-flex align-items-center mb-4">
          <div className="section-icon me-3" style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
          }}>
            <i className="bi bi-robot text-white"></i>
          </div>
          <h6 className="mb-0 fw-bold" style={{color: '#8b5cf6'}}>AI 서비스</h6>
          <div className="section-line ms-auto" style={{
            width: '40px',
            height: '2px',
            background: 'linear-gradient(90deg, #8b5cf6 0%, transparent 100%)',
            borderRadius: '1px'
          }}></div>
        </div>
        <ul className="list-unstyled">
          <li className="mb-3">
            <a href="/ai-analysis" className="nav-link-item d-flex align-items-center p-2 rounded" style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '0.9rem',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              background: 'rgba(139, 92, 246, 0.05)',
              border: '1px solid rgba(139, 92, 246, 0.1)'
            }}>
              <div className="nav-icon me-3" style={{
                width: '24px',
                height: '24px',
                background: 'rgba(139, 92, 246, 0.2)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="bi bi-cpu" style={{color: '#8b5cf6', fontSize: '0.8rem'}}></i>
              </div>
              실시간 분석
            </a>
          </li>
          <li className="mb-3">
            <a href="/ai-dashboard" className="nav-link-item d-flex align-items-center p-2 rounded" style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '0.9rem',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              background: 'rgba(139, 92, 246, 0.05)',
              border: '1px solid rgba(139, 92, 246, 0.1)'
            }}>
              <div className="nav-icon me-3" style={{
                width: '24px',
                height: '24px',
                background: 'rgba(139, 92, 246, 0.2)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="bi bi-robot" style={{color: '#8b5cf6', fontSize: '0.8rem'}}></i>
              </div>
              AI 서비스
            </a>
          </li>
          <li className="mb-3">
            <a href="/ai-learning" className="nav-link-item d-flex align-items-center p-2 rounded" style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '0.9rem',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              background: 'rgba(139, 92, 246, 0.05)',
              border: '1px solid rgba(139, 92, 246, 0.1)'
            }}>
              <div className="nav-icon me-3" style={{
                width: '24px',
                height: '24px',
                background: 'rgba(139, 92, 246, 0.2)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="bi bi-mortarboard" style={{color: '#8b5cf6', fontSize: '0.8rem'}}></i>
              </div>
              AI 음악 학습
            </a>
          </li>
        </ul>
      </div>

      {/* 학습 도구 */}
      <div className="service-section mb-4" style={{position: 'relative', zIndex: 2}}>
        <div className="section-header d-flex align-items-center mb-4">
          <div className="section-icon me-3" style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
          }}>
            <i className="bi bi-tools text-white"></i>
          </div>
          <h6 className="mb-0 fw-bold" style={{color: '#10b981'}}>학습 도구</h6>
          <div className="section-line ms-auto" style={{
            width: '40px',
            height: '2px',
            background: 'linear-gradient(90deg, #10b981 0%, transparent 100%)',
            borderRadius: '1px'
          }}></div>
        </div>
        <ul className="list-unstyled">
          <li className="mb-3">
            <a href="/corpus" className="nav-link-item d-flex align-items-center p-2 rounded" style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '0.9rem',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              background: 'rgba(16, 185, 129, 0.05)',
              border: '1px solid rgba(16, 185, 129, 0.1)'
            }}>
              <div className="nav-icon me-3" style={{
                width: '24px',
                height: '24px',
                background: 'rgba(16, 185, 129, 0.2)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="bi bi-music-note-list" style={{color: '#10b981', fontSize: '0.8rem'}}></i>
              </div>
              When-in-Rome 코퍼스
            </a>
          </li>
          <li className="mb-3">
            <a href="/practice-modes" className="nav-link-item d-flex align-items-center p-2 rounded" style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '0.9rem',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              background: 'rgba(16, 185, 129, 0.05)',
              border: '1px solid rgba(16, 185, 129, 0.1)'
            }}>
              <div className="nav-icon me-3" style={{
                width: '24px',
                height: '24px',
                background: 'rgba(16, 185, 129, 0.2)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="bi bi-music-note-beamed" style={{color: '#10b981', fontSize: '0.8rem'}}></i>
              </div>
              다양한 연습 모드
            </a>
          </li>
          <li className="mb-3">
            <a href="/progress" className="nav-link-item d-flex align-items-center p-2 rounded" style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '0.9rem',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              background: 'rgba(16, 185, 129, 0.05)',
              border: '1px solid rgba(16, 185, 129, 0.1)'
            }}>
              <div className="nav-icon me-3" style={{
                width: '24px',
                height: '24px',
                background: 'rgba(16, 185, 129, 0.2)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="bi bi-graph-up" style={{color: '#10b981', fontSize: '0.8rem'}}></i>
              </div>
              진행 상황 추적
            </a>
          </li>
        </ul>
      </div>

      {/* 커뮤니티 & 관리 */}
      <div className="service-section mb-4" style={{position: 'relative', zIndex: 2}}>
        <div className="section-header d-flex align-items-center mb-4">
          <div className="section-icon me-3" style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
          }}>
            <i className="bi bi-people text-white"></i>
          </div>
          <h6 className="mb-0 fw-bold" style={{color: '#3b82f6'}}>커뮤니티 & 관리</h6>
          <div className="section-line ms-auto" style={{
            width: '40px',
            height: '2px',
            background: 'linear-gradient(90deg, #3b82f6 0%, transparent 100%)',
            borderRadius: '1px'
          }}></div>
        </div>
        <ul className="list-unstyled">
          <li className="mb-3">
            <a href="/community" className="nav-link-item d-flex align-items-center p-2 rounded" style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '0.9rem',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              background: 'rgba(59, 130, 246, 0.05)',
              border: '1px solid rgba(59, 130, 246, 0.1)'
            }}>
              <div className="nav-icon me-3" style={{
                width: '24px',
                height: '24px',
                background: 'rgba(59, 130, 246, 0.2)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="bi bi-people" style={{color: '#3b82f6', fontSize: '0.8rem'}}></i>
              </div>
              커뮤니티
            </a>
          </li>
          <li className="mb-3">
            <a href="/achievements" className="nav-link-item d-flex align-items-center p-2 rounded" style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '0.9rem',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              background: 'rgba(59, 130, 246, 0.05)',
              border: '1px solid rgba(59, 130, 246, 0.1)'
            }}>
              <div className="nav-icon me-3" style={{
                width: '24px',
                height: '24px',
                background: 'rgba(59, 130, 246, 0.2)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="bi bi-trophy" style={{color: '#3b82f6', fontSize: '0.8rem'}}></i>
              </div>
              업적 시스템
            </a>
          </li>
          <li className="mb-3">
            <a href="/feedback" className="nav-link-item d-flex align-items-center p-2 rounded" style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '0.9rem',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              background: 'rgba(59, 130, 246, 0.05)',
              border: '1px solid rgba(59, 130, 246, 0.1)'
            }}>
              <div className="nav-icon me-3" style={{
                width: '24px',
                height: '24px',
                background: 'rgba(59, 130, 246, 0.2)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="bi bi-chat-dots" style={{color: '#3b82f6', fontSize: '0.8rem'}}></i>
              </div>
              피드백
            </a>
          </li>
          <li className="mb-3">
            <a href="/dashboard" className="nav-link-item d-flex align-items-center p-2 rounded" style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '0.9rem',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              background: 'rgba(59, 130, 246, 0.05)',
              border: '1px solid rgba(59, 130, 246, 0.1)'
            }}>
              <div className="nav-icon me-3" style={{
                width: '24px',
                height: '24px',
                background: 'rgba(59, 130, 246, 0.2)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="bi bi-graph-up" style={{color: '#3b82f6', fontSize: '0.8rem'}}></i>
              </div>
              대시보드
            </a>
          </li>
          <li className="mb-3">
            <a href="/profile" className="nav-link-item d-flex align-items-center p-2 rounded" style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '0.9rem',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              background: 'rgba(59, 130, 246, 0.05)',
              border: '1px solid rgba(59, 130, 246, 0.1)'
            }}>
              <div className="nav-icon me-3" style={{
                width: '24px',
                height: '24px',
                background: 'rgba(59, 130, 246, 0.2)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="bi bi-person-circle" style={{color: '#3b82f6', fontSize: '0.8rem'}}></i>
              </div>
              프로필
            </a>
          </li>
        </ul>
      </div>

      {/* 지원 섹션 */}
      <div className="support-section mb-5">
        <div className="section-header d-flex align-items-center mb-3">
          <i className="bi bi-headphones me-2 text-purple"></i>
          <h6 className="mb-0 fw-bold">지원</h6>
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

      {/* 법적 고지 섹션 */}
      <div className="legal-section mb-5">
        <div className="section-header d-flex align-items-center mb-3">
          <i className="bi bi-file-text me-2 text-purple"></i>
          <h6 className="mb-0 fw-bold">법적 고지</h6>
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

      {/* 소식받기 섹션 */}
      <div className="newsletter-section">
        <div className="section-header d-flex align-items-center mb-3">
          <i className="bi bi-bell me-2 text-purple"></i>
          <h6 className="mb-0 fw-bold">소식받기</h6>
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
        @keyframes slideRight {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        

        
        .brand-icon:hover {
          transform: scale(1.05) rotate(5deg);
        }
        
        .nav-link-item:hover {
          transform: translateX(8px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }
        
        /* 핵심 기능 호버 효과 */
        .service-section:nth-child(1) .nav-link-item:hover {
          background: rgba(251, 191, 36, 0.15) !important;
          border-color: rgba(251, 191, 36, 0.3) !important;
          box-shadow: 0 4px 15px rgba(251, 191, 36, 0.2);
        }
        
        /* AI 서비스 호버 효과 */
        .service-section:nth-child(2) .nav-link-item:hover {
          background: rgba(139, 92, 246, 0.15) !important;
          border-color: rgba(139, 92, 246, 0.3) !important;
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.2);
        }
        
        /* 학습 도구 호버 효과 */
        .service-section:nth-child(3) .nav-link-item:hover {
          background: rgba(16, 185, 129, 0.15) !important;
          border-color: rgba(16, 185, 129, 0.3) !important;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.2);
        }
        
        /* 커뮤니티 & 관리 호버 효과 */
        .service-section:nth-child(4) .nav-link-item:hover {
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
