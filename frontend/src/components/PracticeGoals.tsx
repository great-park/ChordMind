'use client'

import { useState } from 'react';

interface Goal {
  id: number;
  title: string;
  description: string;
  targetDate: string;
  progress: number;
  category: string;
  status: 'active' | 'completed' | 'overdue';
}

export default function PracticeGoals() {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 1,
      title: 'C Major Scale 마스터',
      description: 'C Major Scale을 정확하고 빠르게 연주할 수 있도록 연습',
      targetDate: '2024-02-01',
      progress: 75,
      category: '스케일',
      status: 'active'
    },
    {
      id: 2,
      title: 'Jazz Improvisation 기초',
      description: '기본적인 재즈 즉흥연주를 할 수 있도록 연습',
      targetDate: '2024-03-01',
      progress: 30,
      category: '재즈',
      status: 'active'
    },
    {
      id: 3,
      title: 'Classical Piece 완성',
      description: 'Mozart Sonata K.545 1악장을 완벽하게 연주',
      targetDate: '2024-01-20',
      progress: 100,
      category: '클래식',
      status: 'completed'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetDate: '',
    category: ''
  });

  const handleAddGoal = () => {
    const goal: Goal = {
      id: Date.now(),
      title: newGoal.title,
      description: newGoal.description,
      targetDate: newGoal.targetDate,
      progress: 0,
      category: newGoal.category,
      status: 'active'
    };
    setGoals([...goals, goal]);
    setNewGoal({ title: '', description: '', targetDate: '', category: '' });
    setShowAddForm(false);
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

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0">연습 목표</h5>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          <i className="bi bi-plus-circle me-2"></i>
          목표 추가
        </button>
      </div>

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
                disabled={!newGoal.title || !newGoal.category || !newGoal.targetDate}
              >
                목표 추가
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