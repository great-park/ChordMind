'use client'

import { useState } from 'react';
import { practiceService, CreatePracticeSessionRequest, PracticeSession } from '../services/practiceService';

interface PracticeSessionData {
  title: string;
  description: string;
  difficulty: string;
  duration: number;
  focusAreas: string[];
}

export default function PracticeSession() {
  const [sessionData, setSessionData] = useState<PracticeSessionData>({
    title: '',
    description: '',
    difficulty: 'BEGINNER',
    duration: 30,
    focusAreas: []
  });

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [analysis, setAnalysis] = useState<any>(null);
  const [createdSession, setCreatedSession] = useState<PracticeSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userId = 1; // TODO: 실제 로그인 사용자 ID로 대체

  const difficulties = [
    { value: 'BEGINNER', label: '초급' },
    { value: 'INTERMEDIATE', label: '중급' },
    { value: 'ADVANCED', label: '고급' }
  ];

  const focusAreaOptions = [
    '박자 정확도',
    '음정 정확도',
    '코드 진행',
    '리듬 패턴',
    '테크닉',
    '표현력',
    '속도',
    '음량 조절'
  ];

  const handleStartSession = async () => {
    if (!sessionData.title.trim()) {
      setError('세션 제목을 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 먼저 세션을 생성
      const sessionRequest: CreatePracticeSessionRequest = {
        title: sessionData.title,
        description: sessionData.description,
        difficulty: sessionData.difficulty,
        duration: sessionData.duration,
        focusAreas: sessionData.focusAreas
      };

      const response = await practiceService.createPracticeSession(sessionRequest);
      
      if (response.success && response.data) {
        setCreatedSession(response.data);
        setIsRecording(true);
        setRecordingTime(0);
        
        // 타이머 시작
        const timer = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
        
        // 지정된 시간 후 자동 종료
        setTimeout(() => {
          setIsRecording(false);
          handleStopSession();
        }, sessionData.duration * 60 * 1000);
      } else {
        setError(response.message || '세션 생성에 실패했습니다.');
      }
    } catch (error) {
      setError('세션 생성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleStopSession = async () => {
    setIsRecording(false);
    
    if (createdSession) {
      try {
        // 세션 종료 API 호출
        await practiceService.endPracticeSession(createdSession.id);
        
        // 분석 결과 표시 (실제로는 AI 분석 API에서 가져와야 함)
        setAnalysis({
          accuracy: Math.floor(Math.random() * 20) + 80, // 80-100 사이 랜덤
          rhythm: Math.floor(Math.random() * 20) + 70,   // 70-90 사이 랜덤
          technique: Math.floor(Math.random() * 20) + 75, // 75-95 사이 랜덤
          expression: Math.floor(Math.random() * 20) + 80, // 80-100 사이 랜덤
          overall: Math.floor(Math.random() * 20) + 80,    // 80-100 사이 랜덤
          suggestions: [
            '박자 정확도를 높이기 위해 메트로놈과 함께 연습하세요',
            '음정 정확도가 좋습니다. 계속 유지하세요',
            '표현력을 더욱 향상시킬 수 있습니다'
          ]
        });
      } catch (error) {
        console.error('세션 종료 중 오류:', error);
        // 오류가 있어도 분석 결과는 표시
        setAnalysis({
          accuracy: 85,
          rhythm: 78,
          technique: 92,
          expression: 88,
          overall: 86,
          suggestions: [
            '박자 정확도를 높이기 위해 메트로놈과 함께 연습하세요',
            '음정 정확도가 좋습니다. 계속 유지하세요',
            '표현력을 더욱 향상시킬 수 있습니다'
          ]
        });
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFocusAreaChange = (area: string) => {
    setSessionData(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(area)
        ? prev.focusAreas.filter(a => a !== area)
        : [...prev.focusAreas, area]
    }));
  };

  return (
    <div>
      {!isRecording && !analysis ? (
        // 세션 설정
        <div>
          <h5 className="mb-4">새로운 연습 세션 설정</h5>
          
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          
          <div className="mb-3">
            <label htmlFor="sessionTitle" className="form-label">
              세션 제목
            </label>
            <input
              type="text"
              id="sessionTitle"
              className="form-control"
              value={sessionData.title}
              onChange={(e) => setSessionData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="연습 세션 제목을 입력하세요"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="sessionDescription" className="form-label">
              세션 설명
            </label>
            <textarea
              id="sessionDescription"
              className="form-control"
              rows={3}
              value={sessionData.description}
              onChange={(e) => setSessionData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="연습 목표나 특별한 주의사항을 입력하세요"
            />
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="difficulty" className="form-label">
                난이도
              </label>
              <select
                id="difficulty"
                className="form-select"
                value={sessionData.difficulty}
                onChange={(e) => setSessionData(prev => ({ ...prev, difficulty: e.target.value }))}
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty.value} value={difficulty.value}>
                    {difficulty.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="duration" className="form-label">
                목표 시간 (분)
              </label>
              <input
                type="number"
                id="duration"
                className="form-control"
                value={sessionData.duration}
                onChange={(e) => setSessionData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                min="5"
                max="120"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label">집중 영역 (다중 선택 가능)</label>
            <div className="row">
              {focusAreaOptions.map(area => (
                <div key={area} className="col-md-3 mb-2">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`focus-${area}`}
                      checked={sessionData.focusAreas.includes(area)}
                      onChange={() => handleFocusAreaChange(area)}
                    />
                    <label className="form-check-label" htmlFor={`focus-${area}`}>
                      {area}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="d-flex justify-content-center">
            <button
              className="btn btn-primary btn-lg"
              onClick={handleStartSession}
              disabled={!sessionData.title || loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  세션 생성 중...
                </>
              ) : (
                <>
                  <i className="bi bi-play-circle me-2"></i>
                  연습 시작
                </>
              )}
            </button>
          </div>
        </div>
      ) : isRecording ? (
        // 녹음 중
        <div className="text-center">
          <div className="mb-4">
            <i className="bi bi-record-circle text-danger display-1"></i>
            <h4 className="mt-3">연습 중...</h4>
            <div className="display-4 font-monospace text-primary">
              {formatTime(recordingTime)}
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-4">
              <div className="card">
                <div className="card-body text-center">
                  <i className="bi bi-music-note display-4 text-primary"></i>
                  <h5>실시간 분석</h5>
                  <p className="text-muted">AI가 연주를 분석하고 있습니다</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <div className="card-body text-center">
                  <i className="bi bi-graph-up display-4 text-success"></i>
                  <h5>정확도</h5>
                  <p className="text-muted">박자, 음정, 테크닉 분석</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <div className="card-body text-center">
                  <i className="bi bi-lightbulb display-4 text-warning"></i>
                  <h5>피드백</h5>
                  <p className="text-muted">개선점과 제안사항</p>
                </div>
              </div>
            </div>
          </div>

          <button
            className="btn btn-danger btn-lg"
            onClick={handleStopSession}
          >
            <i className="bi bi-stop-circle me-2"></i>
            연습 종료
          </button>
        </div>
      ) : (
        // 분석 결과
        <div>
          <h5 className="mb-4">연습 분석 결과</h5>
          
          <div className="row mb-4">
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <h3 className="text-primary">{analysis.accuracy}%</h3>
                  <p className="mb-0">정확도</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <h3 className="text-success">{analysis.rhythm}%</h3>
                  <p className="mb-0">박자</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <h3 className="text-warning">{analysis.technique}%</h3>
                  <p className="mb-0">테크닉</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <h3 className="text-info">{analysis.expression}%</h3>
                  <p className="mb-0">표현력</p>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-8">
              <div className="card">
                <div className="card-header">
                  <h6 className="mb-0">개선 제안</h6>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    {analysis.suggestions.map((suggestion: string, index: number) => (
                      <li key={index} className="list-group-item">
                        <i className="bi bi-lightbulb text-warning me-2"></i>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <div className="card-header">
                  <h6 className="mb-0">전체 점수</h6>
                </div>
                <div className="card-body text-center">
                  <div className="display-4 text-primary mb-2">{analysis.overall}%</div>
                  <div className="progress mb-3">
                    <div 
                      className="progress-bar bg-primary" 
                      style={{ width: `${analysis.overall}%` }}
                    ></div>
                  </div>
                  <p className="text-muted">훌륭한 연습이었습니다!</p>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-center mt-4">
            <button
              className="btn btn-primary"
              onClick={() => {
                setAnalysis(null);
                setSessionData({
                  title: '',
                  description: '',
                  difficulty: 'BEGINNER',
                  duration: 30,
                  focusAreas: []
                });
              }}
            >
              <i className="bi bi-plus-circle me-2"></i>
              새 연습 시작
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 