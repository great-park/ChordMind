'use client'

import { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
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

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 페이지 로드 후 바로 콘텐츠 표시
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleReviewClick = () => {
    // 후기 페이지로 이동 (임시로 alert)
    alert('후기 페이지로 이동합니다!');
  };

  const handleGrowthClick = () => {
    // 성장 그래프 페이지로 이동 (임시로 alert)
    alert('성장 그래프 페이지로 이동합니다!');
  };

  return (
    <MainLayout>
      {/* 히어로 섹션 */}
      <section 
        className={`hero-section mb-5 fade-in ${isVisible ? 'visible' : ''}`}
        aria-labelledby="hero-title"
      >
        <div className="row align-items-center">
          <div className="col-lg-6">
            <h1 id="hero-title" className="display-4 fw-bold text-dark mb-4">
              AI와 함께하는<br />
              <span className="text-primary">음악 연주 분석</span>
            </h1>
            <p className="lead text-muted mb-4">
              실시간으로 연주를 분석하고, 맞춤형 피드백과 성장 과정을 확인하세요.<br />
              박자, 음정, 코드, 리듬까지 AI가 정확하게 분석해드립니다.
            </p>
            <div className="d-flex gap-3">
              <button 
                className="btn btn-primary btn-lg"
                aria-label="연주 분석 시작하기"
              >
                연주 분석 시작하기
              </button>
              <button 
                className="btn btn-outline-primary btn-lg"
                aria-label="기능 살펴보기"
              >
                기능 살펴보기
              </button>
            </div>
          </div>
          <div className="col-lg-6 text-center">
            <div className="bg-gradient-primary rounded-3 p-5 shadow-lg">
              <i className="bi bi-music-note-beamed display-1 text-white" aria-hidden="true"></i>
              <p className="text-white mt-3">AI Music Analysis</p>
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
        <h2 id="features-title" className="text-center mb-5">주요 기능</h2>
        <div className="row g-4">
          {FEATURES.map((feature, index) => (
            <div key={index} className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm hover-shadow">
                <div className="card-body text-center p-4">
                  <div className="display-6 mb-3" role="img" aria-label={feature.title}>
                    {feature.icon}
                  </div>
                  <h5 className="card-title fw-bold mb-3">{feature.title}</h5>
                  <p className="card-text text-muted">{feature.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 실시간 검색어 */}
      <section 
        className={`mb-5 fade-in ${isVisible ? 'visible' : ''}`}
        style={{ animationDelay: '0.2s' }}
      >
        <div className="row g-4">
          <div className="col-lg-6">
            <h3 className="mb-4">실시간 인기 검색어</h3>
            <div className="row g-3">
              {TRENDING_KEYWORDS.slice(0, 6).map((keyword, index) => (
                <div key={index} className="col-6">
                  <div className="card border-0 bg-light">
                    <div className="card-body text-center p-3">
                      <small className="text-muted">#{keyword.rank || index + 1}</small>
                      <p className="mb-0 fw-semibold">{keyword.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-lg-6">
            <h3 className="mb-4">최근 검색어</h3>
            <div className="list-group">
              {RECENT_KEYWORDS.map((keyword, index) => (
                <div key={index} className="list-group-item d-flex align-items-center">
                  <span className="badge bg-primary rounded-pill me-3">{index + 1}</span>
                  <span className="fw-medium">{keyword.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 통계 대시보드 */}
      <section 
        className={`mb-5 fade-in ${isVisible ? 'visible' : ''}`}
        style={{ animationDelay: '0.3s' }}
        id="dashboard"
        aria-labelledby="dashboard-title"
      >
        <h2 id="dashboard-title" className="text-center mb-5">나의 연습 통계</h2>
        
        {/* 개요 통계 카드 */}
        <div className="row g-4 mb-5">
          {STATISTICS_DATA.overview.map((stat, index) => (
            <div key={index} className="col-lg-3 col-md-6">
              <StatisticsCard {...stat} />
            </div>
          ))}
        </div>

        {/* 진행률 차트 */}
        <div className="row g-4 mb-5">
          {STATISTICS_DATA.progress.map((progress, index) => (
            <div key={index} className="col-lg-4 col-md-6">
              <ProgressChart {...progress} />
            </div>
          ))}
        </div>

        {/* 활동 피드와 리더보드 */}
        <div className="row g-4">
          <div className="col-lg-8">
            <ActivityFeed 
              activities={STATISTICS_DATA.activities}
              title="최근 활동"
              maxItems={5}
            />
          </div>
          <div className="col-lg-4">
            <Leaderboard 
              items={STATISTICS_DATA.leaderboard}
              title="주간 랭킹"
              maxItems={8}
            />
          </div>
        </div>
      </section>

      {/* 사용자 후기 + 성장 그래프 */}
      <section 
        className={`mb-5 fade-in ${isVisible ? 'visible' : ''}`}
        style={{ animationDelay: '0.4s' }}
      >
        <div className="row g-4">
          <div className="col-lg-8">
            <h3 className="mb-4">실제 사용자 후기</h3>
            <div className="row g-3">
              {REVIEWS.map((review, index) => (
                <div key={index} className="col-md-6">
                  <div className={`card border-${review.color} border-2 hover-shadow clickable`} onClick={handleReviewClick}>
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
                      <div className="text-end">
                        <small className="text-muted">더보기 <i className="bi bi-arrow-right"></i></small>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-lg-4">
            <h3 className="mb-4">나의 성장 그래프</h3>
            <div className="card border-0 shadow hover-shadow clickable" onClick={handleGrowthClick}>
              <div className="card-body p-4">
                <div className="text-center mb-3">
                  <i className="bi bi-graph-up-arrow text-success display-4" aria-hidden="true"></i>
                </div>
                <div className="progress mb-3" style={{height: '8px'}} role="progressbar" aria-valuenow={85} aria-valuemin={0} aria-valuemax={100}>
                  <div className="progress-bar bg-success" style={{width: '85%'}}></div>
                </div>
                <p className="text-center mb-0">
                  <span className="fw-bold text-success">85%</span> 성장률
                </p>
                <div className="text-center mt-2">
                  <small className="text-muted">자세히 보기 <i className="bi bi-arrow-right"></i></small>
                </div>
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
              <button 
                className="btn btn-light btn-lg"
                aria-label="지금 연주 분석 시작하기"
              >
                지금 연주 분석 시작하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 