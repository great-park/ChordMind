'use client'

import { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';

// 인기 검색어 데이터 (예시)
const trendingKeywords = [
  '실시간 연주 분석',
  'AI 피드백',
  '음정 인식',
  '박자 교정',
  '코드 분석',
  '리듬 트레이닝',
  '연습 기록',
  '성장 그래프',
  '개인 맞춤 코칭',
  '음악 연습 챌린지',
]
const recentKeywords = [
  '피아노 연습',
  '기타 코드',
  '재즈 리듬',
  '템포 조절',
  '화성 분석',
]
const features = [
  { icon: '🎵', title: '실시간 연주 분석', desc: '마이크/파일로 연주를 즉시 분석' },
  { icon: '🤖', title: 'AI 피드백', desc: '개인 맞춤형 연습 코칭 제공' },
  { icon: '📈', title: '성장 그래프', desc: '연습 기록과 성장 시각화' },
  { icon: '🎹', title: '음정/박자 인식', desc: '정확한 음정·박자 분석' },
  { icon: '🎸', title: '코드/리듬 분석', desc: '코드, 리듬까지 AI가 분석' },
  { icon: '🏆', title: '연습 챌린지', desc: '목표 설정과 도전 미션' },
]
const reviews = [
  { user: '김민수', role: '피아노 연주자', text: 'AI 피드백 덕분에 실력이 쑥쑥 늘어요!', color: 'primary' },
  { user: '이서연', role: '기타 입문자', text: '코드 분석이 정말 정확해서 연습이 재밌어요.', color: 'success' },
  { user: '박지훈', role: '작곡가', text: '연습 기록과 성장 그래프가 동기부여에 최고!', color: 'info' },
]

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => { setIsVisible(true); }, []);

  return (
    <MainLayout>
      {/* 히어로 섹션 */}
      <section className="hero-section mb-5">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <h1 className="display-4 fw-bold text-dark mb-4">
              AI와 함께하는<br />
              <span className="text-primary">음악 연주 분석</span>
            </h1>
            <p className="lead text-muted mb-4">
              실시간으로 연주를 분석하고, 맞춤형 피드백과 성장 과정을 확인하세요.<br />
              박자, 음정, 코드, 리듬까지 AI가 정확하게 분석해드립니다.
            </p>
            <div className="d-flex gap-3">
              <button className="btn btn-primary btn-lg">연주 분석 시작하기</button>
              <button className="btn btn-outline-primary btn-lg">기능 살펴보기</button>
            </div>
          </div>
          <div className="col-lg-6 text-center">
            <div className="bg-gradient-primary rounded-3 p-5 shadow-lg">
              <i className="bi bi-music-note-beamed display-1 text-white"></i>
              <p className="text-white mt-3">AI Music Analysis</p>
            </div>
          </div>
        </div>
      </section>

      {/* 주요 기능 카드 */}
      <section className="mb-5" id="features">
        <h2 className="text-center mb-5">주요 기능</h2>
        <div className="row g-4">
          {features.map((feature, index) => (
            <div key={index} className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm hover-shadow">
                <div className="card-body text-center p-4">
                  <div className="display-6 mb-3">{feature.icon}</div>
                  <h5 className="card-title fw-bold mb-3">{feature.title}</h5>
                  <p className="card-text text-muted">{feature.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 실시간 검색어 */}
      <section className="mb-5">
        <div className="row g-4">
          <div className="col-lg-6">
            <h3 className="mb-4">실시간 인기 검색어</h3>
            <div className="row g-3">
              {trendingKeywords.slice(0, 6).map((keyword, index) => (
                <div key={index} className="col-6">
                  <div className="card border-0 bg-light">
                    <div className="card-body text-center p-3">
                      <small className="text-muted">#{index + 1}</small>
                      <p className="mb-0 fw-semibold">{keyword}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-lg-6">
            <h3 className="mb-4">최근 검색어</h3>
            <div className="list-group">
              {recentKeywords.map((keyword, index) => (
                <div key={index} className="list-group-item d-flex align-items-center">
                  <span className="badge bg-primary rounded-pill me-3">{index + 1}</span>
                  <span className="fw-medium">{keyword}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 사용자 후기 + 성장 그래프 */}
      <section className="mb-5">
        <div className="row g-4">
          <div className="col-lg-8">
            <h3 className="mb-4">실제 사용자 후기</h3>
            <div className="row g-3">
              {reviews.map((review, index) => (
                <div key={index} className="col-md-6">
                  <div className={`card border-${review.color} border-2`}>
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-3">
                        <div className={`rounded-circle bg-${review.color} bg-opacity-10 d-flex align-items-center justify-content-center me-3`} style={{width: '48px', height: '48px'}}>
                          <span className={`fw-bold text-${review.color}`}>{review.user[0]}</span>
                        </div>
                        <div>
                          <h6 className="mb-0 fw-bold">{review.user}</h6>
                          <small className="text-muted">{review.role}</small>
                        </div>
                      </div>
                      <p className="card-text">"{review.text}"</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-lg-4">
            <h3 className="mb-4">나의 성장 그래프</h3>
            <div className="card border-0 shadow">
              <div className="card-body p-4">
                <div className="text-center mb-3">
                  <i className="bi bi-graph-up-arrow text-success display-4"></i>
                </div>
                <div className="progress mb-3" style={{height: '8px'}}>
                  <div className="progress-bar bg-success" style={{width: '85%'}}></div>
                </div>
                <p className="text-center mb-0">
                  <span className="fw-bold text-success">85%</span> 성장률
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 하단 고정 CTA */}
      <div className="position-fixed bottom-0 start-0 w-100 bg-primary text-white p-3 shadow-lg" style={{zIndex: 1000}}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h5 className="mb-0">AI와 함께 음악 연주 실력을 키워보세요!</h5>
            </div>
            <div className="col-md-4 text-md-end">
              <button className="btn btn-light btn-lg">지금 연주 분석 시작하기</button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 