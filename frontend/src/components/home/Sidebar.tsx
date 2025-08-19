import React from 'react';

const Sidebar = () => {
  return (
    <div className="sidebar bg-dark-blue text-white p-4 h-100" style={{
      background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
      minWidth: '320px',
      borderRight: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      {/* 브랜드 로고 섹션 */}
      <div className="brand-section mb-6">
        <div className="d-flex align-items-center mb-3">
          <div className="brand-icon me-3" style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <i className="bi bi-music-note text-white fs-5"></i>
          </div>
          <h4 className="mb-0 fw-bold">ChordMind</h4>
        </div>
        <p className="text-light mb-2" style={{fontSize: '0.9rem', opacity: 0.8}}>
          AI 기반 음악 연주 분석 및 코칭 서비스
        </p>
        <p className="text-light mb-0" style={{fontSize: '0.9rem', opacity: 0.8}}>
          당신의 음악 여정을 함께합니다
        </p>
        
        {/* 소셜 미디어 아이콘 */}
        <div className="social-icons d-flex gap-3 mt-3">
          <div className="social-icon" style={{
            width: '36px',
            height: '36px',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}>
            <i className="bi bi-youtube text-white"></i>
          </div>
          <div className="social-icon" style={{
            width: '36px',
            height: '36px',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}>
            <i className="bi bi-instagram text-white"></i>
          </div>
          <div className="social-icon" style={{
            width: '36px',
            height: '36px',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}>
            <i className="bi bi-twitter text-white"></i>
          </div>
          <div className="social-icon" style={{
            width: '36px',
            height: '36px',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}>
            <i className="bi bi-github text-white"></i>
          </div>
        </div>
      </div>

      {/* 서비스 섹션 */}
      <div className="service-section mb-5">
        <div className="section-header d-flex align-items-center mb-3">
          <i className="bi bi-list-ul me-2 text-purple"></i>
          <h6 className="mb-0 fw-bold">서비스</h6>
          <div className="purple-underline ms-2" style={{
            width: '20px',
            height: '2px',
            background: '#8b5cf6',
            borderRadius: '1px'
          }}></div>
        </div>
        <ul className="list-unstyled">
          <li className="mb-2">
            <a href="/practice" className="text-light text-decoration-none" style={{opacity: 0.8, fontSize: '0.9rem'}}>
              연습하기
            </a>
          </li>
          <li className="mb-2">
            <a href="/dashboard" className="text-light text-decoration-none" style={{opacity: 0.8, fontSize: '0.9rem'}}>
              대시보드
            </a>
          </li>
          <li className="mb-2">
            <a href="/feedback" className="text-light text-decoration-none" style={{opacity: 0.8, fontSize: '0.9rem'}}>
              피드백
            </a>
          </li>
          <li className="mb-2">
            <a href="/profile" className="text-light text-decoration-none" style={{opacity: 0.8, fontSize: '0.9rem'}}>
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
        .social-icon:hover {
          border-color: rgba(255, 255, 255, 0.6) !important;
          transform: scale(1.1);
        }
        
        .text-purple {
          color: #8b5cf6 !important;
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
      `}</style>
    </div>
  );
};

export default Sidebar;
