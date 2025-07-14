import React from 'react';

export default function Sidebar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-end border-2 border-light shadow-sm">
      <div className="container-fluid d-flex flex-column h-100">
        {/* 로고 */}
        <div className="navbar-brand mb-4">
          <span className="fw-bold fs-3 text-primary">ChordMind</span>
        </div>
        
        {/* 네비게이션 메뉴 */}
        <div className="navbar-nav flex-column w-100 mb-auto">
          <a className="nav-link active d-flex align-items-center py-3" href="#analyze">
            <i className="bi bi-music-note me-3"></i>
            연주 분석
          </a>
          <a className="nav-link d-flex align-items-center py-3" href="#features">
            <i className="bi bi-gear me-3"></i>
            기능 소개
          </a>
          <a className="nav-link d-flex align-items-center py-3" href="#practice">
            <i className="bi bi-graph-up me-3"></i>
            연습 기록
          </a>
        </div>
        
        {/* 하단 프로필/로그인 */}
        <div className="mt-auto pt-3 border-top">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <button className="btn btn-outline-primary btn-sm">로그인</button>
            <div className="position-relative">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" 
                alt="프로필" 
                className="rounded-circle border border-2 border-light"
                style={{width: '36px', height: '36px', objectFit: 'cover'}}
              />
              <div className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success" style={{fontSize: '8px'}}>
                <i className="bi bi-circle-fill"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 