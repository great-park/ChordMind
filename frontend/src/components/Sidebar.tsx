import React from 'react';
import { NAVIGATION_ITEMS } from '../constants/data';

export default function Sidebar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-end border-2 border-light shadow-sm" role="navigation" aria-label="주 메뉴">
      <div className="container-fluid d-flex flex-column h-100">
        {/* 로고 */}
        <div className="navbar-brand mb-4">
          <span className="fw-bold fs-3 text-primary" role="banner">ChordMind</span>
        </div>
        
        {/* 네비게이션 메뉴 */}
        <div className="navbar-nav flex-column w-100 mb-auto" role="menubar">
          {NAVIGATION_ITEMS.map((item, index) => (
            <a 
              key={item.id}
              className={`nav-link d-flex align-items-center py-3 ${index === 0 ? 'active' : ''}`}
              href={item.href}
              role="menuitem"
              aria-current={index === 0 ? 'page' : undefined}
            >
              <i className={`bi ${item.icon} me-3`} aria-hidden="true"></i>
              {item.label}
            </a>
          ))}
        </div>
        
        {/* 핵심 기능 */}
        <div className="service-section mb-4">
          <div className="section-header d-flex align-items-center mb-3">
            <i className="bi bi-star me-2 text-warning"></i>
            <h6 className="mb-0 fw-bold">핵심 기능</h6>
            <div className="purple-underline ms-2" style={{
              width: '20px',
              height: '2px',
              background: '#fbbf24',
              borderRadius: '1px'
            }}></div>
          </div>
          <ul className="list-unstyled">
            <li className="mb-2">
              <a href="/practice" className="text-light text-decoration-none d-flex align-items-center" style={{opacity: 0.8, fontSize: '0.9rem'}}>
                <i className="bi bi-play-circle me-2"></i>
                연습하기
              </a>
            </li>
            <li className="mb-2">
              <a href="/composition" className="text-light text-decoration-none d-flex align-items-center" style={{opacity: 0.8, fontSize: '0.9rem'}}>
                <i className="bi bi-music-note-beamed me-2"></i>
                AI 작곡
              </a>
            </li>
            <li className="mb-2">
              <a href="/theory" className="text-light text-decoration-none d-flex align-items-center" style={{opacity: 0.8, fontSize: '0.9rem'}}>
                <i className="bi bi-book me-2"></i>
                음악 이론
              </a>
            </li>
            <li className="mb-2">
              <a href="/practice-plan" className="text-light text-decoration-none d-flex align-items-center" style={{opacity: 0.8, fontSize: '0.9rem'}}>
                <i className="bi bi-calendar-check me-2"></i>
                맞춤 연습
              </a>
            </li>
          </ul>
        </div>

        {/* AI 서비스 */}
        <div className="service-section mb-4">
          <div className="section-header d-flex align-items-center mb-3">
            <i className="bi bi-robot me-2 text-primary"></i>
            <h6 className="mb-0 fw-bold">AI 서비스</h6>
            <div className="purple-underline ms-2" style={{
              width: '20px',
              height: '2px',
              background: '#8b5cf6',
              borderRadius: '1px'
            }}></div>
          </div>
          <ul className="list-unstyled">
            <li className="mb-2">
              <a href="/ai-analysis" className="text-light text-decoration-none d-flex align-items-center" style={{opacity: 0.8, fontSize: '0.9rem'}}>
                <i className="bi bi-cpu me-2"></i>
                실시간 분석
              </a>
            </li>
            <li className="mb-2">
              <a href="/ai-dashboard" className="text-light text-decoration-none d-flex align-items-center" style={{opacity: 0.8, fontSize: '0.9rem'}}>
                <i className="bi bi-robot me-2"></i>
                AI 서비스
              </a>
            </li>
            <li className="mb-2">
              <a href="/ai-learning" className="text-light text-decoration-none d-flex align-items-center" style={{opacity: 0.8, fontSize: '0.9rem'}}>
                <i className="bi bi-mortarboard me-2"></i>
                AI 음악 학습
              </a>
            </li>
          </ul>
        </div>

        {/* 학습 도구 */}
        <div className="service-section mb-4">
          <div className="section-header d-flex align-items-center mb-3">
            <i className="bi bi-tools me-2 text-success"></i>
            <h6 className="mb-0 fw-bold">학습 도구</h6>
            <div className="purple-underline ms-2" style={{
              width: '20px',
              height: '2px',
              background: '#10b981',
              borderRadius: '1px'
            }}></div>
          </div>
          <ul className="list-unstyled">

            <li className="mb-2">
              <a href="/practice-modes" className="text-light text-decoration-none d-flex align-items-center" style={{opacity: 0.8, fontSize: '0.9rem'}}>
                <i className="bi bi-music-note-beamed me-2"></i>
                다양한 연습 모드
              </a>
            </li>
            <li className="mb-2">
              <a href="/progress" className="text-light text-decoration-none d-flex align-items-center" style={{opacity: 0.8, fontSize: '0.9rem'}}>
                <i className="bi bi-graph-up me-2"></i>
                진행 상황 추적
              </a>
            </li>
          </ul>
        </div>

        {/* 커뮤니티 & 관리 */}
        <div className="service-section mb-4">
          <div className="section-header d-flex align-items-center mb-3">
            <i className="bi bi-people me-2 text-info"></i>
            <h6 className="mb-0 fw-bold">커뮤니티 & 관리</h6>
            <div className="purple-underline ms-2" style={{
              width: '20px',
              height: '2px',
              background: '#3b82f6',
              borderRadius: '1px'
            }}></div>
          </div>
          <ul className="list-unstyled">
            <li className="mb-2">
              <a href="/community" className="text-light text-decoration-none d-flex align-items-center" style={{opacity: 0.8, fontSize: '0.9rem'}}>
                <i className="bi bi-people me-2"></i>
                커뮤니티
              </a>
            </li>
            <li className="mb-2">
              <a href="/achievements" className="text-light text-decoration-none d-flex align-items-center" style={{opacity: 0.8, fontSize: '0.9rem'}}>
                <i className="bi bi-trophy me-2"></i>
                업적 시스템
              </a>
            </li>
            <li className="mb-2">
              <a href="/feedback" className="text-light text-decoration-none d-flex align-items-center" style={{opacity: 0.8, fontSize: '0.9rem'}}>
                <i className="bi bi-chat-dots me-2"></i>
                피드백
              </a>
            </li>
            <li className="mb-2">
              <a href="/dashboard" className="text-light text-decoration-none d-flex align-items-center" style={{opacity: 0.8, fontSize: '0.9rem'}}>
                <i className="bi bi-graph-up me-2"></i>
                대시보드
              </a>
            </li>
            <li className="mb-2">
              <a href="/profile" className="text-light text-decoration-none d-flex align-items-center" style={{opacity: 0.8, fontSize: '0.9rem'}}>
                <i className="bi bi-person-circle me-2"></i>
                프로필
              </a>
            </li>
          </ul>
        </div>
        
        {/* 하단 프로필/로그인 */}
        <div className="mt-auto pt-3 border-top">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <button 
              className="btn btn-outline-primary btn-sm"
              aria-label="로그인"
            >
              로그인
            </button>
            <div className="position-relative">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" 
                alt="사용자 프로필 사진" 
                className="rounded-circle border border-2 border-light"
                style={{width: '36px', height: '36px', objectFit: 'cover'}}
              />
              <div 
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success" 
                style={{fontSize: '8px'}}
                aria-label="온라인 상태"
              >
                <i className="bi bi-circle-fill" aria-hidden="true"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 