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
            <div className="rounded-circle bg-light d-flex align-items-center justify-content-center" style={{width: '36px', height: '36px'}}>
              <span className="fw-bold text-primary">유</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 