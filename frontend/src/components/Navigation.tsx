'use client'

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  const navigationItems = [
    { name: '홈', href: '/', icon: 'bi-house' },
    { name: '대시보드', href: '/dashboard', icon: 'bi-speedometer2' },
    { name: '연습', href: '/practice', icon: 'bi-music-note' },
    { name: '피드백', href: '/feedback', icon: 'bi-chat-dots' },
    { name: '프로필', href: '/profile', icon: 'bi-person' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        {/* 브랜드 로고 */}
        <Link className="navbar-brand d-flex align-items-center" href="/">
          <i className="bi bi-music-note-beamed me-2"></i>
          <span className="fw-bold">ChordMind</span>
        </Link>

        {/* 모바일 토글 버튼 */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-controls="navbarNav"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* 네비게이션 메뉴 */}
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav me-auto">
            {navigationItems.map((item) => (
              <li key={item.href} className="nav-item">
                <Link
                  className={`nav-link ${isActive(item.href) ? 'active' : ''}`}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                >
                  <i className={`bi ${item.icon} me-1`}></i>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* 사용자 메뉴 */}
          <ul className="navbar-nav">
            {isAuthenticated ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle d-flex align-items-center"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-2" 
                       style={{ width: '32px', height: '32px' }}>
                    <i className="bi bi-person text-primary"></i>
                  </div>
                  <span>{user?.nickname || user?.name || '사용자'}</span>
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" href="/profile">
                      <i className="bi bi-person me-2"></i>
                      프로필
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="/settings">
                      <i className="bi bi-gear me-2"></i>
                      설정
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <a className="dropdown-item" href="#" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>
                      로그아웃
                    </a>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" href="/login">
                  <i className="bi bi-box-arrow-in-right me-1"></i>
                  로그인
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
} 