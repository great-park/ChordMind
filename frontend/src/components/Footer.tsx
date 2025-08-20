import React from 'react'
import Link from 'next/link'
import { GRADIENTS, COLORS } from '../constants/styles'

const Footer: React.FC = React.memo(() => {
  return (
    <footer 
      className="footer-dark mt-5"
      style={{
        background: GRADIENTS.dark,
        borderTop: `1px solid ${COLORS.primary.border}`
      }}
    >
      <div className="container-fluid">
        {/* 메인 Footer 콘텐츠 */}
        <div className="row py-5">
          {/* 브랜드 섹션 */}
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="footer-brand">
              <div className="d-flex align-items-center mb-3">
                <div 
                  className="footer-logo-circle me-3"
                  style={{
                    width: '48px',
                    height: '48px',
                    background: GRADIENTS.primary,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <i className="bi bi-music-note-beamed" style={{ color: COLORS.text.primary }}></i>
                </div>
                <h3 className="footer-brand-text mb-0" style={{ color: COLORS.text.primary }}>ChordMind</h3>
              </div>
              <p className="footer-description mb-4" style={{ color: COLORS.text.secondary }}>
                🎵 AI 기반 음악 연주 분석 및 코칭 서비스<br />
                당신의 음악 여정을 함께합니다
              </p>
              <div className="footer-social">
                <a href="#" className="footer-social-link me-3" style={{ color: COLORS.text.secondary }}>
                  <i className="bi bi-youtube"></i>
                </a>
                <a href="#" className="footer-social-link me-3" style={{ color: COLORS.text.secondary }}>
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="#" className="footer-social-link me-3" style={{ color: COLORS.text.secondary }}>
                  <i className="bi bi-twitter"></i>
                </a>
                <a href="#" className="footer-social-link" style={{ color: COLORS.text.secondary }}>
                  <i className="bi bi-github"></i>
                </a>
              </div>
            </div>
          </div>

          {/* 서비스 섹션 */}
          <div className="col-lg-2 col-md-6 col-6 mb-4">
            <h5 className="footer-title" style={{ color: COLORS.text.primary }}>🎹 서비스</h5>
            <ul className="footer-links">
              <li><Link href="/practice" className="footer-link" style={{ color: COLORS.text.secondary }}>연습하기</Link></li>
              <li><Link href="/dashboard" className="footer-link" style={{ color: COLORS.text.secondary }}>대시보드</Link></li>
              <li><Link href="/feedback" className="footer-link" style={{ color: COLORS.text.secondary }}>피드백</Link></li>
              <li><Link href="/profile" className="footer-link" style={{ color: COLORS.text.secondary }}>프로필</Link></li>
            </ul>
          </div>

          {/* 지원 섹션 */}
          <div className="col-lg-2 col-md-6 col-6 mb-4">
            <h5 className="footer-title" style={{ color: COLORS.text.primary }}>🎧 지원</h5>
            <ul className="footer-links">
              <li><Link href="/help" className="footer-link" style={{ color: COLORS.text.secondary }}>도움말</Link></li>
              <li><Link href="/contact" className="footer-link" style={{ color: COLORS.text.secondary }}>문의하기</Link></li>
              <li><Link href="/faq" className="footer-link" style={{ color: COLORS.text.secondary }}>자주 묻는 질문</Link></li>
              <li><Link href="/tutorial" className="footer-link" style={{ color: COLORS.text.secondary }}>튜토리얼</Link></li>
            </ul>
          </div>

          {/* 법적 고지 섹션 */}
          <div className="col-lg-2 col-md-6 col-6 mb-4">
            <h5 className="footer-title" style={{ color: COLORS.text.primary }}>📋 법적 고지</h5>
            <ul className="footer-links">
              <li><Link href="/privacy" className="footer-link" style={{ color: COLORS.text.secondary }}>개인정보처리방침</Link></li>
              <li><Link href="/terms" className="footer-link" style={{ color: COLORS.text.secondary }}>이용약관</Link></li>
              <li><Link href="/license" className="footer-link" style={{ color: COLORS.text.secondary }}>라이선스</Link></li>
            </ul>
          </div>

          {/* 뉴스레터 섹션 */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="footer-title" style={{ color: COLORS.text.primary }}>📬 소식받기</h5>
            <p className="footer-newsletter-text" style={{ color: COLORS.text.secondary }}>
              새로운 기능과 팁을 가장 먼저 받아보세요!
            </p>
            <div className="footer-newsletter">
              <div className="input-group">
                <input 
                  type="email" 
                  className="form-control footer-newsletter-input" 
                  placeholder="이메일 주소"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: `1px solid ${COLORS.primary.border}`,
                    color: COLORS.text.primary
                  }}
                />
                <button 
                  className="btn" 
                  type="button"
                  style={{
                    background: COLORS.primary.main,
                    border: `1px solid ${COLORS.primary.main}`,
                    color: COLORS.text.primary
                  }}
                >
                  <i className="bi bi-send"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 Copyright */}
        <div className="footer-bottom" style={{ borderTop: `1px solid ${COLORS.primary.border}` }}>
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="footer-copyright mb-0" style={{ color: COLORS.text.secondary }}>
                &copy; 2024 <strong style={{ color: COLORS.text.primary }}>ChordMind</strong>. All rights reserved.
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="footer-badges">
                <span className="badge me-2" style={{ 
                  background: COLORS.success.background,
                  color: COLORS.success.main,
                  border: `1px solid ${COLORS.success.border}`
                }}>
                  <i className="bi bi-shield-check me-1"></i>
                  Secure
                </span>
                <span className="badge me-2" style={{ 
                  background: COLORS.info.background,
                  color: COLORS.info.main,
                  border: `1px solid ${COLORS.info.border}`
                }}>
                  <i className="bi bi-cpu me-1"></i>
                  AI Powered
                </span>
                <span className="badge" style={{ 
                  background: COLORS.warning.background,
                  color: COLORS.warning.main,
                  border: `1px solid ${COLORS.warning.border}`
                }}>
                  <i className="bi bi-heart-fill me-1"></i>
                  Made in Korea
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
})

Footer.displayName = 'Footer'

export default Footer 