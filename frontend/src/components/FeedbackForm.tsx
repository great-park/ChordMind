'use client'

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { feedbackService } from '../services/feedbackService';

interface FeedbackFormData {
  feedbackType: string;
  category: string;
  title: string;
  content: string;
  rating: number | null;
  priority: string;
  tags: string[];
}

export default function FeedbackForm() {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState<FeedbackFormData>({
    feedbackType: '',
    category: '',
    title: '',
    content: '',
    rating: null,
    priority: 'MEDIUM',
    tags: []
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const feedbackTypes = [
    { value: 'BUG_REPORT', label: '버그 신고' },
    { value: 'FEATURE_REQUEST', label: '기능 요청' },
    { value: 'IMPROVEMENT', label: '개선 제안' },
    { value: 'COMPLAINT', label: '불만 사항' },
    { value: 'PRAISE', label: '칭찬' },
    { value: 'QUESTION', label: '질문' },
    { value: 'SUGGESTION', label: '제안' }
  ];

  const categories = [
    '일반', '연습 기능', 'AI 분석', '사용자 인터페이스', '성능', '기타'
  ];

  const priorities = [
    { value: 'LOW', label: '낮음' },
    { value: 'MEDIUM', label: '보통' },
    { value: 'HIGH', label: '높음' },
    { value: 'URGENT', label: '긴급' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user?.id) {
      setError('로그인이 필요합니다.');
      return;
    }

    if (!formData.feedbackType || !formData.title || !formData.content) {
      setError('필수 항목을 모두 입력해주세요.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const createRequest = {
        feedbackType: formData.feedbackType,
        category: formData.category,
        title: formData.title,
        content: formData.content,
        rating: formData.rating,
        priority: formData.priority,
        tags: formData.tags
      };

      const response = await feedbackService.createFeedback(createRequest);
      
      if (response.success) {
        setSuccess(true);
        setFormData({
          feedbackType: '',
          category: '',
          title: '',
          content: '',
          rating: null,
          priority: 'MEDIUM',
          tags: []
        });
        
        // 3초 후 성공 메시지 숨기기
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(response.message || '피드백 제출에 실패했습니다.');
      }
    } catch (error) {
      setError('피드백 제출 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FeedbackFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTagChange = (tags: string) => {
    const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({ ...prev, tags: tagArray }));
  };

  if (success) {
    return (
      <div className="alert alert-success" role="alert">
        <i className="bi bi-check-circle me-2"></i>
        피드백이 성공적으로 제출되었습니다. 감사합니다!
        <button 
          className="btn btn-sm btn-outline-success ms-3"
          onClick={() => setSuccess(false)}
        >
          새 피드백 작성
        </button>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="alert alert-warning" role="alert">
        피드백을 작성하려면 로그인이 필요합니다.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {success && (
        <div className="alert alert-success" role="alert">
          피드백이 성공적으로 제출되었습니다!
        </div>
      )}
      
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="feedbackType" className="form-label">
            피드백 타입 <span className="text-danger">*</span>
          </label>
          <select
            id="feedbackType"
            className="form-select"
            value={formData.feedbackType}
            onChange={(e) => handleInputChange('feedbackType', e.target.value)}
            required
          >
            <option value="">타입을 선택하세요</option>
            {feedbackTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6 mb-3">
          <label htmlFor="category" className="form-label">
            카테고리 <span className="text-danger">*</span>
          </label>
          <select
            id="category"
            className="form-select"
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            required
          >
            <option value="">카테고리를 선택하세요</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="title" className="form-label">
          제목 <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          id="title"
          className="form-control"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="피드백 제목을 입력하세요"
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="content" className="form-label">
          내용 <span className="text-danger">*</span>
        </label>
        <textarea
          id="content"
          className="form-control"
          rows={5}
          value={formData.content}
          onChange={(e) => handleInputChange('content', e.target.value)}
          placeholder="피드백 내용을 자세히 작성해주세요"
          required
        />
      </div>

      <div className="row">
        <div className="col-md-4 mb-3">
          <label htmlFor="rating" className="form-label">
            만족도 (선택사항)
          </label>
          <select
            id="rating"
            className="form-select"
            value={formData.rating || ''}
            onChange={(e) => handleInputChange('rating', e.target.value ? parseInt(e.target.value) : null)}
          >
            <option value="">평점 선택</option>
            <option value="1">1점 - 매우 불만족</option>
            <option value="2">2점 - 불만족</option>
            <option value="3">3점 - 보통</option>
            <option value="4">4점 - 만족</option>
            <option value="5">5점 - 매우 만족</option>
          </select>
        </div>

        <div className="col-md-4 mb-3">
          <label htmlFor="priority" className="form-label">
            우선순위
          </label>
          <select
            id="priority"
            className="form-select"
            value={formData.priority}
            onChange={(e) => handleInputChange('priority', e.target.value)}
          >
            {priorities.map(priority => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4 mb-3">
          <label htmlFor="tags" className="form-label">
            태그 (선택사항)
          </label>
          <input
            type="text"
            id="tags"
            className="form-control"
            value={formData.tags.join(', ')}
            onChange={(e) => handleTagChange(e.target.value)}
            placeholder="태그를 쉼표로 구분하여 입력"
          />
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setFormData({
            feedbackType: '',
            category: '',
            title: '',
            content: '',
            rating: null,
            priority: 'MEDIUM',
            tags: []
          })}
        >
          초기화
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              제출 중...
            </>
          ) : (
            <>
              <i className="bi bi-send me-2"></i>
              피드백 제출
            </>
          )}
        </button>
      </div>
    </form>
  );
} 