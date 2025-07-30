'use client'

import { useState, useEffect } from 'react';
import MainLayout from '../../components/MainLayout';
import ProfileInfo from '../../components/ProfileInfo';
import ProfileSettings from '../../components/ProfileSettings';
import ProfileStats from '../../components/ProfileStats';

export default function Profile() {
  const [activeTab, setActiveTab] = useState<'info' | 'settings' | 'stats'>('info');

  return (
    <MainLayout>
      <div className="container-fluid">
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="h3 mb-0">프로필</h1>
            <p className="text-muted">내 정보와 설정을 관리하세요</p>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="row mb-4">
          <div className="col-12">
            <ul className="nav nav-tabs" id="profileTabs" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'info' ? 'active' : ''}`}
                  onClick={() => setActiveTab('info')}
                  type="button"
                  role="tab"
                >
                  <i className="bi bi-person me-2"></i>
                  프로필 정보
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
                  onClick={() => setActiveTab('settings')}
                  type="button"
                  role="tab"
                >
                  <i className="bi bi-gear me-2"></i>
                  설정
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'stats' ? 'active' : ''}`}
                  onClick={() => setActiveTab('stats')}
                  type="button"
                  role="tab"
                >
                  <i className="bi bi-graph-up me-2"></i>
                  통계
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* 탭 콘텐츠 */}
        <div className="row">
          <div className="col-12">
            <div className="tab-content" id="profileTabContent">
              {activeTab === 'info' && (
                <div className="tab-pane fade show active">
                  <div className="card shadow">
                    <div className="card-header">
                      <h5 className="mb-0">프로필 정보</h5>
                    </div>
                    <div className="card-body">
                      <ProfileInfo />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="tab-pane fade show active">
                  <div className="card shadow">
                    <div className="card-header">
                      <h5 className="mb-0">설정</h5>
                    </div>
                    <div className="card-body">
                      <ProfileSettings />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'stats' && (
                <div className="tab-pane fade show active">
                  <div className="card shadow">
                    <div className="card-header">
                      <h5 className="mb-0">통계</h5>
                    </div>
                    <div className="card-body">
                      <ProfileStats />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 