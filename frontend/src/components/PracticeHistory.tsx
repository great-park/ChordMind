'use client'

import { useState, useEffect } from 'react';
import { practiceService, PracticeSession } from '../services/practiceService';

export default function PracticeHistory() {
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userId = 1; // TODO: 실제 로그인 사용자 ID로 대체

  useEffect(() => {
    const fetchPracticeHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await practiceService.getUserPracticeSessions(userId, 20);
        
        if (response.success && response.data) {
          setSessions(response.data.sessions || []);
        } else {
          setError(response.message || '연습 기록을 불러오지 못했습니다.');
        }
      } catch (error) {
        setError('연습 기록을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPracticeHistory();
  }, [userId]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">로딩 중...</span>
        </div>
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
      <h5 className="mb-4">연습 기록</h5>
      
      {sessions.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-clock-history display-1 text-muted"></i>
          <p className="text-muted mt-3">연습 기록이 없습니다.</p>
        </div>
      ) : (
        <div className="row">
          {sessions.map(session => (
            <div key={session.id} className="col-12 mb-3">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h6 className="card-title mb-1">{session.title}</h6>
                      <small className="text-muted">
                        {new Date(session.updatedAt).toLocaleDateString('ko-KR')} • 
                        {session.duration}분 연습
                      </small>
                    </div>
                    <div className="text-end">
                      <h4 className="text-primary mb-0">{session.overall}%</h4>
                      <small className="text-muted">전체 점수</small>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-3">
                      <div className="text-center">
                        <div className="h5 text-success mb-1">{session.accuracy}%</div>
                        <small className="text-muted">정확도</small>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="text-center">
                        <div className="h5 text-info mb-1">{session.rhythm}%</div>
                        <small className="text-muted">박자</small>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="text-center">
                        <div className="h5 text-warning mb-1">{session.technique}%</div>
                        <small className="text-muted">테크닉</small>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="text-center">
                        <div className="h5 text-danger mb-1">{session.expression}%</div>
                        <small className="text-muted">표현력</small>
                      </div>
                    </div>
                  </div>

                  <div className="mb-2">
                    <small className="text-muted">집중 영역:</small>
                    <div className="mt-1">
                      {session.focusAreas.map((area, index) => (
                        <span key={index} className="badge bg-light text-dark me-1">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="d-flex justify-content-end">
                    <button className="btn btn-sm btn-outline-primary">
                      <i className="bi bi-eye me-1"></i>
                      상세 보기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 