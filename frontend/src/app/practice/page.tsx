'use client'

import { useState, useEffect } from 'react';
import MainLayout from '../../components/MainLayout';
import PracticeSession from '../../components/PracticeSession';
import PracticeHistory from '../../components/PracticeHistory';
import PracticeGoals from '../../components/PracticeGoals';

export default function Practice() {
  const [activeTab, setActiveTab] = useState<'session' | 'history' | 'goals'>('session');

  return (
    <MainLayout>
      <div className="container-fluid">
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="h3 mb-0">연습</h1>
            <p className="text-muted">AI와 함께하는 맞춤형 음악 연습</p>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="row mb-4">
          <div className="col-12">
            <ul className="nav nav-tabs" id="practiceTabs" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'session' ? 'active' : ''}`}
                  onClick={() => setActiveTab('session')}
                  type="button"
                  role="tab"
                >
                  <i className="bi bi-play-circle me-2"></i>
                  연습 세션
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'history' ? 'active' : ''}`}
                  onClick={() => setActiveTab('history')}
                  type="button"
                  role="tab"
                >
                  <i className="bi bi-clock-history me-2"></i>
                  연습 기록
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'goals' ? 'active' : ''}`}
                  onClick={() => setActiveTab('goals')}
                  type="button"
                  role="tab"
                >
                  <i className="bi bi-target me-2"></i>
                  연습 목표
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* 탭 콘텐츠 */}
        <div className="row">
          <div className="col-12">
            <div className="tab-content" id="practiceTabContent">
              {activeTab === 'session' && (
                <div className="tab-pane fade show active">
                  <div className="card shadow">
                    <div className="card-header">
                      <h5 className="mb-0">새로운 연습 세션</h5>
                    </div>
                    <div className="card-body">
                      <PracticeSession />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'history' && (
                <div className="tab-pane fade show active">
                  <div className="card shadow">
                    <div className="card-header">
                      <h5 className="mb-0">연습 기록</h5>
                    </div>
                    <div className="card-body">
                      <PracticeHistory />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'goals' && (
                <div className="tab-pane fade show active">
                  <div className="card shadow">
                    <div className="card-header">
                      <h5 className="mb-0">연습 목표</h5>
                    </div>
                    <div className="card-body">
                      <PracticeGoals />
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