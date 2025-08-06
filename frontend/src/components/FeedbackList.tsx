'use client'

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { feedbackService } from '../services/feedbackService';

interface Feedback {
  id: number;
  title: string;
  content: string;
  feedbackType: string;
  category: string;
  status: string;
  priority: string;
  rating: number | null;
  createdAt: string;
  updatedAt: string;
}

export default function FeedbackList() {
  const { user, isAuthenticated } = useAuth();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchFeedbacks = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await feedbackService.getUserFeedbacks(user.id);
        
        if (response.success && response.data) {
          setFeedbacks(response.data.feedbacks);
        } else {
          setError(response.message || '피드백 목록을 불러오지 못했습니다.');
        }
      } catch (error) {
        setError('피드백 목록을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [user]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'PENDING': { class: 'badge bg-warning', text: '대기 중' },
      'IN_PROGRESS': { class: 'badge bg-info', text: '처리 중' },
      'RESOLVED': { class: 'badge bg-success', text: '해결됨' },
      'REJECTED': { class: 'badge bg-danger', text: '거부됨' },
      'CLOSED': { class: 'badge bg-secondary', text: '종료됨' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    return <span className={config.class}>{config.text}</span>;
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      'LOW': { class: 'badge bg-secondary', text: '낮음' },
      'MEDIUM': { class: 'badge bg-primary', text: '보통' },
      'HIGH': { class: 'badge bg-warning', text: '높음' },
      'URGENT': { class: 'badge bg-danger', text: '긴급' }
    };
    
    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.MEDIUM;
    return <span className={config.class}>{config.text}</span>;
  };

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

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesFilter = filter === 'all' || feedback.status === filter;
    const matchesSearch = feedback.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">로딩 중...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="alert alert-warning" role="alert">
        로그인이 필요합니다.
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div>
      {/* 필터 및 검색 */}
      <div className="row mb-3">
        <div className="col-md-6">
          <select
            className="form-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">전체 상태</option>
            <option value="PENDING">대기 중</option>
            <option value="IN_PROGRESS">처리 중</option>
            <option value="RESOLVED">해결됨</option>
            <option value="REJECTED">거부됨</option>
            <option value="CLOSED">종료됨</option>
          </select>
        </div>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="피드백 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* 피드백 목록 */}
      {filteredFeedbacks.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-inbox display-1 text-muted"></i>
          <p className="text-muted mt-3">피드백이 없습니다.</p>
        </div>
      ) : (
        <div className="row">
          {filteredFeedbacks.map(feedback => (
            <div key={feedback.id} className="col-12 mb-3">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="card-title mb-0">{feedback.title}</h6>
                    <div className="d-flex gap-2">
                      {getStatusBadge(feedback.status)}
                      {getPriorityBadge(feedback.priority)}
                    </div>
                  </div>
                  
                  <p className="card-text text-muted mb-2">
                    {feedback.content.length > 100 
                      ? `${feedback.content.substring(0, 100)}...` 
                      : feedback.content}
                  </p>
                  
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <small className="text-muted">
                        <i className="bi bi-tag me-1"></i>
                        {getTypeLabel(feedback.feedbackType)} • {feedback.category}
                      </small>
                    </div>
                    <div className="col-md-6 text-end">
                      {feedback.rating && (
                        <div className="d-inline-block me-3">
                          <small className="text-muted">만족도:</small>
                          <span className="ms-1">
                            {[...Array(5)].map((_, i) => (
                              <i 
                                key={i}
                                className={`bi bi-star${i < feedback.rating! ? '-fill' : ''} text-warning`}
                              ></i>
                            ))}
                          </span>
                        </div>
                      )}
                      <small className="text-muted">
                        {new Date(feedback.createdAt).toLocaleDateString('ko-KR')}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      {filteredFeedbacks.length > 0 && (
        <nav aria-label="피드백 페이지네이션">
          <ul className="pagination justify-content-center">
            <li className="page-item disabled">
              <span className="page-link">이전</span>
            </li>
            <li className="page-item active">
              <span className="page-link">1</span>
            </li>
            <li className="page-item disabled">
              <span className="page-link">다음</span>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
} 