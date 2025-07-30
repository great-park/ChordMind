'use client'

import { useState, useEffect } from 'react';

interface PracticeSession {
  id: number;
  title: string;
  duration: number;
  accuracy: number;
  rhythm: number;
  technique: number;
  expression: number;
  overall: number;
  date: string;
  focusAreas: string[];
}

export default function PracticeHistory() {
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockSessions: PracticeSession[] = [
      {
        id: 1,
        title: 'C Major Scale 연습',
        duration: 25,
        accuracy: 85,
        rhythm: 78,
        technique: 92,
        expression: 88,
        overall: 86,
        date: '2024-01-15T10:30:00Z',
        focusAreas: ['박자 정확도', '음정 정확도']
      },
      {
        id: 2,
        title: 'Jazz Improvisation',
        duration: 45,
        accuracy: 78,
        rhythm: 85,
        technique: 80,
        expression: 92,
        overall: 84,
        date: '2024-01-14T15:20:00Z',
        focusAreas: ['표현력', '리듬 패턴']
      },
      {
        id: 3,
        title: 'Classical Piece 연습',
        duration: 60,
        accuracy: 90,
        rhythm: 88,
        technique: 85,
        expression: 82,
        overall: 86,
        date: '2024-01-13T09:15:00Z',
        focusAreas: ['테크닉', '음량 조절']
      }
    ];

    setTimeout(() => {
      setSessions(mockSessions);
      setLoading(false);
    }, 1000);
  }, []);

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
                        {new Date(session.date).toLocaleDateString('ko-KR')} • 
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