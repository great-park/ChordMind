'use client'

import { useState, useEffect } from 'react';

interface FeedbackStats {
  totalFeedbacks: number;
  pendingFeedbacks: number;
  resolvedFeedbacks: number;
  averageRating: number;
  feedbacksByType: Record<string, number>;
  feedbacksByPriority: Record<string, number>;
  feedbacksByStatus: Record<string, number>;
}

export default function FeedbackStats() {
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 임시 데이터 로드
    const mockStats: FeedbackStats = {
      totalFeedbacks: 25,
      pendingFeedbacks: 8,
      resolvedFeedbacks: 15,
      averageRating: 4.2,
      feedbacksByType: {
        'BUG_REPORT': 5,
        'FEATURE_REQUEST': 8,
        'IMPROVEMENT': 6,
        'COMPLAINT': 2,
        'PRAISE': 3,
        'QUESTION': 1
      },
      feedbacksByPriority: {
        'LOW': 3,
        'MEDIUM': 12,
        'HIGH': 8,
        'URGENT': 2
      },
      feedbacksByStatus: {
        'PENDING': 8,
        'IN_PROGRESS': 5,
        'RESOLVED': 10,
        'REJECTED': 1,
        'CLOSED': 1
      }
    };

    setTimeout(() => {
      setStats(mockStats);
      setLoading(false);
    }, 1000);
  }, []);

  const getTypeLabel = (type: string) => {
    const typeLabels = {
      'BUG_REPORT': '버그 신고',
      'FEATURE_REQUEST': '기능 요청',
      'IMPROVEMENT': '개선 제안',
      'COMPLAINT': '불만 사항',
      'PRAISE': '칭찬',
      'QUESTION': '질문',
      'SUGGESTION': '제안'
    };
    
    return typeLabels[type as keyof typeof typeLabels] || type;
  };

  const getPriorityLabel = (priority: string) => {
    const priorityLabels = {
      'LOW': '낮음',
      'MEDIUM': '보통',
      'HIGH': '높음',
      'URGENT': '긴급'
    };
    
    return priorityLabels[priority as keyof typeof priorityLabels] || priority;
  };

  const getStatusLabel = (status: string) => {
    const statusLabels = {
      'PENDING': '대기 중',
      'IN_PROGRESS': '처리 중',
      'RESOLVED': '해결됨',
      'REJECTED': '거부됨',
      'CLOSED': '종료됨'
    };
    
    return statusLabels[status as keyof typeof statusLabels] || status;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">로딩 중...</span>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="alert alert-warning" role="alert">
        통계 데이터를 불러올 수 없습니다.
      </div>
    );
  }

  return (
    <div>
      {/* 주요 통계 카드 */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <i className="bi bi-chat-dots display-4"></i>
              <h4 className="mt-2">{stats.totalFeedbacks}</h4>
              <p className="mb-0">전체 피드백</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-warning text-white">
            <div className="card-body text-center">
              <i className="bi bi-clock display-4"></i>
              <h4 className="mt-2">{stats.pendingFeedbacks}</h4>
              <p className="mb-0">대기 중</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <i className="bi bi-check-circle display-4"></i>
              <h4 className="mt-2">{stats.resolvedFeedbacks}</h4>
              <p className="mb-0">해결됨</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-info text-white">
            <div className="card-body text-center">
              <i className="bi bi-star display-4"></i>
              <h4 className="mt-2">{stats.averageRating.toFixed(1)}</h4>
              <p className="mb-0">평균 만족도</p>
            </div>
          </div>
        </div>
      </div>

      {/* 상세 통계 */}
      <div className="row">
        {/* 타입별 분포 */}
        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">타입별 분포</h6>
            </div>
            <div className="card-body">
              {Object.entries(stats.feedbacksByType).map(([type, count]) => (
                <div key={type} className="d-flex justify-content-between align-items-center mb-2">
                  <span>{getTypeLabel(type)}</span>
                  <span className="badge bg-primary">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 우선순위별 분포 */}
        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">우선순위별 분포</h6>
            </div>
            <div className="card-body">
              {Object.entries(stats.feedbacksByPriority).map(([priority, count]) => (
                <div key={priority} className="d-flex justify-content-between align-items-center mb-2">
                  <span>{getPriorityLabel(priority)}</span>
                  <span className="badge bg-secondary">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 상태별 분포 */}
        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">상태별 분포</h6>
            </div>
            <div className="card-body">
              {Object.entries(stats.feedbacksByStatus).map(([status, count]) => (
                <div key={status} className="d-flex justify-content-between align-items-center mb-2">
                  <span>{getStatusLabel(status)}</span>
                  <span className="badge bg-info">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 만족도 차트 */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">만족도 분석</h6>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <h3 className="text-warning mb-0">{stats.averageRating.toFixed(1)}</h3>
                  <small className="text-muted">평균 만족도</small>
                </div>
                <div className="flex-grow-1">
                  <div className="progress" style={{ height: '20px' }}>
                    <div 
                      className="progress-bar bg-warning" 
                      style={{ width: `${(stats.averageRating / 5) * 100}%` }}
                    ></div>
                  </div>
                  <small className="text-muted">1점 ~ 5점</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 해결율 */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">해결율</h6>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <h3 className="text-success mb-0">
                    {((stats.resolvedFeedbacks / stats.totalFeedbacks) * 100).toFixed(1)}%
                  </h3>
                  <small className="text-muted">해결율</small>
                </div>
                <div className="flex-grow-1">
                  <div className="progress" style={{ height: '20px' }}>
                    <div 
                      className="progress-bar bg-success" 
                      style={{ width: `${(stats.resolvedFeedbacks / stats.totalFeedbacks) * 100}%` }}
                    ></div>
                  </div>
                  <small className="text-muted">
                    {stats.resolvedFeedbacks} / {stats.totalFeedbacks} 피드백 해결됨
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 