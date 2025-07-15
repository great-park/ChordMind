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