'use client'

import { useState, useEffect } from 'react';
import { practiceService, PracticeGoal, CreatePracticeGoalRequest } from '../services/practiceService';

// API 응답과 호환되도록 PracticeGoal 타입 사용

export default function PracticeGoals() {
  const [goals, setGoals] = useState<PracticeGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userId = 1; // TODO: 실제 로그인 사용자 ID로 대체

  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetDate: '',
    category: ''
  });

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await practiceService.getUserPracticeGoals(userId);
        
        if (response.success && response.data) {
          setGoals(response.data.goals);
        } else {
          setError(response.message || '목표를 불러오지 못했습니다.');
        }
      } catch (error) {
        setError('목표를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [userId]);

  const [submitting, setSubmitting] = useState(false);

  const handleAddGoal = async () => {
    if (!newGoal.title || !newGoal.targetDate) {
      setError('제목과 목표 날짜를 입력해주세요.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const goalRequest: CreatePracticeGoalRequest = {
        title: newGoal.title,
        description: newGoal.description,
        targetDate: newGoal.targetDate,
        category: newGoal.category
      };

      const response = await practiceService.createPracticeGoal(goalRequest);
      
      if (response.success && response.data) {
        setGoals([...goals, response.data]);
        setNewGoal({ title: '', description: '', targetDate: '', category: '' });
        setShowAddForm(false);
      } else {
        setError(response.message || '목표 생성에 실패했습니다.');
      }
    } catch (error) {
      setError('목표 생성 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'active': { class: 'badge bg-primary', text: '진행 중' },
      'completed': { class: 'badge bg-success', text: '완료' },
      'overdue': { class: 'badge bg-danger', text: '기한 초과' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    return <span className={config.class}>{config.text}</span>;
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

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0">연습 목표</h5>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
          disabled={submitting}
        >
          <i className="bi bi-plus-circle me-2"></i>
          목표 추가
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {showAddForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h6 className="mb-0">새 목표 추가</h6>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">목표 제목</label>
                <input
                  type="text"
                  className="form-control"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">카테고리</label>
                <select
                  className="form-select"
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                >
                  <option value="">카테고리 선택</option>
                  <option value="스케일">스케일</option>
                  <option value="재즈">재즈</option>
                  <option value="클래식">클래식</option>
                  <option value="팝">팝</option>
                  <option value="기타">기타</option>
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">목표 날짜</label>
                <input
                  type="date"
                  className="form-control"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                />
              </div>
              <div className="col-12 mb-3">
                <label className="form-label">목표 설명</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                />
              </div>
            </div>
            <div className="d-flex justify-content-end gap-2">
              <button
                className="btn btn-secondary"
                onClick={() => setShowAddForm(false)}
              >
                취소
              </button>
              <button
                className="btn btn-primary"
                onClick={handleAddGoal}
                disabled={!newGoal.title || !newGoal.category || !newGoal.targetDate || submitting}
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    추가 중...
                  </>
                ) : (
                  '목표 추가'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="row">
        {goals.map(goal => (
          <div key={goal.id} className="col-12 mb-3">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h6 className="card-title mb-1">{goal.title}</h6>
                    <p className="text-muted mb-2">{goal.description}</p>
                    <div className="d-flex align-items-center gap-3">
                      <span className="badge bg-light text-dark">{goal.category}</span>
                      {getStatusBadge(goal.status)}
                      <small className="text-muted">
                        목표일: {new Date(goal.targetDate).toLocaleDateString('ko-KR')}
                      </small>
                    </div>
                  </div>
                  <div className="text-end">
                    <h4 className="text-primary mb-0">{goal.progress}%</h4>
                    <small className="text-muted">진행률</small>
                  </div>
                </div>

                <div className="progress mb-3" style={{ height: '10px' }}>
                  <div
                    className={`progress-bar ${
                      goal.progress === 100 ? 'bg-success' : 'bg-primary'
                    }`}
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    {goal.progress === 100 ? '목표 달성!' : `${goal.progress}% 완료`}
                  </small>
                  <div>
                    <button className="btn btn-sm btn-outline-primary me-2">
                      <i className="bi bi-pencil me-1"></i>
                      편집
                    </button>
                    <button className="btn btn-sm btn-outline-danger">
                      <i className="bi bi-trash me-1"></i>
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 