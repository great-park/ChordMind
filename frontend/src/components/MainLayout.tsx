import React from 'react';
import Sidebar from './Sidebar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-fluid p-0">
      <div className="row g-0">
        {/* 사이드바 */}
        <div className="col-lg-3 col-md-4">
          <Sidebar />
        </div>
        {/* 메인 콘텐츠 */}
        <div className="col-lg-9 col-md-8">
          <main className="p-4">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
} 