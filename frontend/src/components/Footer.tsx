import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="footer-dark mt-5">
      <div className="container-fluid">
        {/* 메인 Footer 콘텐츠 */}
        <div className="row py-5">
          {/* 브랜드 섹션 */}
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="footer-brand">
              <div className="d-flex align-items-center mb-3">
                <div className="footer-logo-circle me-3">
                  <i className="bi bi-music-note-beamed"></i>
                </div>
                <h3 className="footer-brand-text mb-0">ChordMind</h3>
              </div>
              <p className="footer-description mb-4">
                🎵 AI 기반 음악 연주 분석 및 코칭 서비스<br />
                당신의 음악 여정을 함께합니다
              </p>
              <div className="footer-social">
                <a href="#" className="footer-social-link me-3">
                  <i className="bi bi-youtube"></i>
                </a>
                <a href="#" className="footer-social-link me-3">
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="#" className="footer-social-link me-3">
                  <i className="bi bi-twitter"></i>
                </a>
                <a href="#" className="footer-social-link">
                  <i className="bi bi-github"></i>
                </a>
              </div>
            </div>
          </div>

          {/* 서비스 섹션 */}
          <div className="col-lg-2 col-md-6 col-6 mb-4">
            <h5 className="footer-title">🎹 서비스</h5>
            <ul className="footer-links">
              <li><Link href="/practice" className="footer-link">연습하기</Link></li>
              <li><Link href="/dashboard" className="footer-link">대시보드</Link></li>
              <li><Link href="/feedback" className="footer-link">피드백</Link></li>
              <li><Link href="/profile" className="footer-link">프로필</Link></li>
            </ul>
          </div>

          {/* 지원 섹션 */}
          <div className="col-lg-2 col-md-6 col-6 mb-4">
            <h5 className="footer-title">🎧 지원</h5>
            <ul className="footer-links">
              <li><Link href="/help" className="footer-link">도움말</Link></li>
              <li><Link href="/contact" className="footer-link">문의하기</Link></li>
              <li><Link href="/faq" className="footer-link">자주 묻는 질문</Link></li>
              <li><Link href="/tutorial" className="footer-link">튜토리얼</Link></li>
            </ul>
          </div>

          {/* 법적 고지 섹션 */}
          <div className="col-lg-2 col-md-6 col-6 mb-4">
            <h5 className="footer-title">📋 법적 고지</h5>
            <ul className="footer-links">
              <li><Link href="/privacy" className="footer-link">개인정보처리방침</Link></li>
              <li><Link href="/terms" className="footer-link">이용약관</Link></li>
              <li><Link href="/license" className="footer-link">라이선스</Link></li>
            </ul>
          </div>

          {/* 뉴스레터 섹션 */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="footer-title">📬 소식받기</h5>
            <p className="footer-newsletter-text">
              새로운 기능과 팁을 가장 먼저 받아보세요!
            </p>
            <div className="footer-newsletter">
              <div className="input-group">
                <input 
                  type="email" 
                  className="form-control footer-newsletter-input" 
                  placeholder="이메일 주소"
                />
                <button className="btn btn-primary" type="button">
                  <i className="bi bi-send"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 Copyright */}
        <div className="footer-bottom">
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="footer-copyright mb-0">
                &copy; 2024 <strong>ChordMind</strong>. All rights reserved.
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="footer-badges">
                <span className="badge footer-badge me-2">
                  <i className="bi bi-shield-check me-1"></i>
                  Secure
                </span>
                <span className="badge footer-badge me-2">
                  <i className="bi bi-cpu me-1"></i>
                  AI Powered
                </span>
                <span className="badge footer-badge">
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
} 