'use client'

import { useState, useEffect } from 'react';
import MainLayout from '../../components/MainLayout';
import FeedbackForm from '../../components/FeedbackForm';
import FeedbackList from '../../components/FeedbackList';
import FeedbackStats from '../../components/FeedbackStats';

export default function Feedback() {
  const [activeTab, setActiveTab] = useState<'create' | 'list' | 'stats'>('create');

  return (
    <MainLayout>
      <div className="container-fluid">
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="h3 mb-0">피드백</h1>
            <p className="text-muted">서비스 개선을 위한 의견을 들려주세요</p>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="row mb-4">
          <div className="col-12">
            <ul className="nav nav-tabs" id="feedbackTabs" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'create' ? 'active' : ''}`}
                  onClick={() => setActiveTab('create')}
                  type="button"
                  role="tab"
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  피드백 작성
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'list' ? 'active' : ''}`}
                  onClick={() => setActiveTab('list')}
                  type="button"
                  role="tab"
                >
                  <i className="bi bi-list-ul me-2"></i>
                  내 피드백
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
                  피드백 통계
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* 탭 콘텐츠 */}
        <div className="row">
          <div className="col-12">
            <div className="tab-content" id="feedbackTabContent">
              {activeTab === 'create' && (
                <div className="tab-pane fade show active">
                  <div className="card shadow">
                    <div className="card-header">
                      <h5 className="mb-0">새로운 피드백 작성</h5>
                    </div>
                    <div className="card-body">
                      <FeedbackForm />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'list' && (
                <div className="tab-pane fade show active">
                  <div className="card shadow">
                    <div className="card-header">
                      <h5 className="mb-0">내 피드백 목록</h5>
                    </div>
                    <div className="card-body">
                      <FeedbackList />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'stats' && (
                <div className="tab-pane fade show active">
                  <div className="card shadow">
                    <div className="card-header">
                      <h5 className="mb-0">피드백 통계</h5>
                    </div>
                    <div className="card-body">
                      <FeedbackStats />
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