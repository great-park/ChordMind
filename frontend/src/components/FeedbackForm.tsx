'use client'

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { GRADIENTS, COLORS, CARD_STYLES, BADGE_STYLES, BUTTON_STYLES } from '../constants/styles';

interface PerformanceData {
  instrument: string;
  piece: string;
  difficulty: string;
  practiceTime: number;
  recordingUrl?: string;
  notes: string;
}

export default function FeedbackForm() {
  const { user, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState<'select' | 'record' | 'analyze' | 'result'>('select');
  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    instrument: '',
    piece: '',
    difficulty: 'BEGINNER',
    practiceTime: 0,
    notes: ''
  });
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const instruments = [
    { value: 'piano', label: '🎹 피아노', icon: '🎹' },
    { value: 'guitar', label: '🎸 기타', icon: '🎸' },
    { value: 'violin', label: '🎻 바이올린', icon: '🎻' },
    { value: 'flute', label: '🎺 플루트', icon: '🎺' },
    { value: 'drums', label: '🥁 드럼', icon: '🥁' },
    { value: 'voice', label: '🎤 보컬', icon: '🎤' }
  ];

  const difficulties = [
    { value: 'BEGINNER', label: '초급', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)' },
    { value: 'INTERMEDIATE', label: '중급', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)' },
    { value: 'ADVANCED', label: '고급', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)' }
  ];

  const practicePieces = [
    { value: 'scales', label: '음계 연습', icon: '🎵' },
    { value: 'chords', label: '코드 진행', icon: '🎼' },
    { value: 'arpeggios', label: '아르페지오', icon: '🎶' },
    { value: 'etudes', label: '에튀드', icon: '📚' },
    { value: 'songs', label: '곡 연주', icon: '🎤' },
    { value: 'improvisation', label: '즉흥 연주', icon: '🎨' }
  ];

  // 녹음 타이머
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    // TODO: 실제 녹음 기능 구현
    console.log('녹음 시작');
  };

  const stopRecording = () => {
    setIsRecording(false);
    // TODO: 실제 녹음 중지 기능 구현
    console.log('녹음 중지');
  };

  const analyzePerformance = async () => {
    setLoading(true);
    // TODO: AI 분석 API 호출
    setTimeout(() => {
      setAnalysisResult({
        accuracy: Math.floor(Math.random() * 30) + 70,
        rhythm: Math.floor(Math.random() * 30) + 70,
        pitch: Math.floor(Math.random() * 30) + 70,
        technique: Math.floor(Math.random() * 30) + 70,
        overall: Math.floor(Math.random() * 30) + 70,
        suggestions: [
          '박자 정확도를 높이기 위해 메트로놈과 함께 연습해보세요',
          '음정을 더 정확하게 연주하려면 스케일 연습을 강화하세요',
          '테크닉 향상을 위해 아르페지오 연습을 추가해보세요'
        ]
      });
      setLoading(false);
      setCurrentStep('result');
    }, 3000);
  };

  const resetForm = () => {
    setCurrentStep('select');
    setPerformanceData({
      instrument: '',
      piece: '',
      difficulty: 'BEGINNER',
      practiceTime: 0,
      notes: ''
    });
    setRecordingTime(0);
    setAnalysisResult(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-5">
        <div className="mb-4" style={{
          width: '80px',
          height: '80px',
          background: GRADIENTS.primary,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto'
        }}>
          <i className="bi bi-lock fs-2 text-white"></i>
        </div>
        <h5 style={{color: COLORS.text.primary}}>로그인이 필요합니다</h5>
        <p style={{color: COLORS.text.secondary}}>AI 연주 피드백을 받으려면 로그인해주세요</p>
      </div>
    );
  }

  return (
    <div className="performance-feedback-form">
      {/* 진행 단계 표시 */}
      <div className="mb-4">
        <div className="d-flex justify-content-center align-items-center">
          {['select', 'record', 'analyze', 'result'].map((step, index) => (
            <div key={step} className="d-flex align-items-center">
              <div className={`step-indicator ${currentStep === step ? 'active' : ''} ${index < ['select', 'record', 'analyze', 'result'].indexOf(currentStep) ? 'completed' : ''}`} style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 10px',
                background: currentStep === step ? GRADIENTS.primary : 
                           index < ['select', 'record', 'analyze', 'result'].indexOf(currentStep) ? GRADIENTS.success : 'rgba(139, 92, 246, 0.1)',
                color: currentStep === step || index < ['select', 'record', 'analyze', 'result'].indexOf(currentStep) ? 'white' : COLORS.text.tertiary,
                border: currentStep === step ? 'none' : '2px solid rgba(139, 92, 246, 0.3)',
                fontWeight: 'bold'
              }}>
                {index < ['select', 'record', 'analyze', 'result'].indexOf(currentStep) ? '✓' : index + 1}
              </div>
              {index < 3 && (
                <div className="step-line" style={{
                  width: '60px',
                  height: '2px',
                  background: index < ['select', 'record', 'analyze', 'result'].indexOf(currentStep) ? GRADIENTS.success : 'rgba(139, 92, 246, 0.2)',
                  margin: '0 5px'
                }}></div>
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-2">
          <small style={{color: COLORS.text.tertiary}}>
            {currentStep === 'select' && '연주 정보 선택'}
            {currentStep === 'record' && '연주 녹음'}
            {currentStep === 'analyze' && 'AI 분석 중'}
            {currentStep === 'result' && '분석 결과'}
          </small>
        </div>
      </div>

      {/* 1단계: 연주 정보 선택 */}
      {currentStep === 'select' && (
        <div className="step-content">
          <div className="text-center mb-4">
            <h4 style={{color: COLORS.text.primary}}>🎵 연주 정보를 선택해주세요</h4>
            <p style={{color: COLORS.text.secondary}}>AI가 더 정확한 분석을 제공할 수 있도록 도와드릴게요</p>
          </div>

          <div className="row g-4">
            {/* 악기 선택 */}
            <div className="col-md-6">
              <label className="form-label" style={{color: COLORS.text.primary, fontWeight: '600'}}>
                🎼 연주 악기
              </label>
              <div className="instrument-grid">
                {instruments.map((instrument) => (
                  <div
                    key={instrument.value}
                    className={`instrument-card ${performanceData.instrument === instrument.value ? 'selected' : ''}`}
                    onClick={() => setPerformanceData({...performanceData, instrument: instrument.value})}
                    style={{
                      padding: '1rem',
                      borderRadius: '12px',
                      border: performanceData.instrument === instrument.value ? '2px solid #8b5cf6' : '1px solid rgba(139, 92, 246, 0.2)',
                      background: performanceData.instrument === instrument.value ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      textAlign: 'center'
                    }}
                  >
                    <div className="fs-1 mb-2">{instrument.icon}</div>
                    <div style={{color: COLORS.text.primary, fontSize: '0.9rem'}}>{instrument.label.split(' ')[1]}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 연습 곡 선택 */}
            <div className="col-md-6">
              <label className="form-label" style={{color: COLORS.text.primary, fontWeight: '600'}}>
                📚 연습 곡/기법
              </label>
              <div className="piece-grid">
                {practicePieces.map((piece) => (
                  <div
                    key={piece.value}
                    className={`piece-card ${performanceData.piece === piece.value ? 'selected' : ''}`}
                    onClick={() => setPerformanceData({...performanceData, piece: piece.value})}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '10px',
                      border: performanceData.piece === piece.value ? '2px solid #8b5cf6' : '1px solid rgba(139, 92, 246, 0.2)',
                      background: performanceData.piece === piece.value ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      textAlign: 'center'
                    }}
                  >
                    <div className="fs-4 mb-1">{piece.icon}</div>
                    <div style={{color: COLORS.text.primary, fontSize: '0.8rem'}}>{piece.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 난이도 선택 */}
            <div className="col-md-6">
              <label className="form-label" style={{color: COLORS.text.primary, fontWeight: '600'}}>
                🎯 연주 난이도
              </label>
              <div className="difficulty-selector">
                {difficulties.map((difficulty) => (
                  <div
                    key={difficulty.value}
                    className={`difficulty-option ${performanceData.difficulty === difficulty.value ? 'selected' : ''}`}
                    onClick={() => setPerformanceData({...performanceData, difficulty: difficulty.value})}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      border: performanceData.difficulty === difficulty.value ? '2px solid' + difficulty.color : '1px solid rgba(139, 92, 246, 0.2)',
                      background: performanceData.difficulty === difficulty.value ? difficulty.bgColor : 'rgba(139, 92, 246, 0.05)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      textAlign: 'center',
                      color: performanceData.difficulty === difficulty.value ? difficulty.color : COLORS.text.secondary
                    }}
                  >
                    {difficulty.label}
                  </div>
                ))}
              </div>
            </div>

            {/* 연습 시간 */}
            <div className="col-md-6">
              <label className="form-label" style={{color: COLORS.text.primary, fontWeight: '600'}}>
                ⏱️ 연습 시간 (분)
              </label>
              <input
                type="number"
                className="form-control"
                value={performanceData.practiceTime}
                onChange={(e) => setPerformanceData({...performanceData, practiceTime: parseInt(e.target.value) || 0})}
                min="0"
                style={{
                  background: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  color: COLORS.text.primary,
                  borderRadius: '8px'
                }}
              />
            </div>

            {/* 메모 */}
            <div className="col-12">
              <label className="form-label" style={{color: COLORS.text.primary, fontWeight: '600'}}>
                📝 연주 메모 (선택사항)
              </label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="연주할 때 특별히 신경 쓰는 부분이나 궁금한 점이 있다면 적어주세요"
                value={performanceData.notes}
                onChange={(e) => setPerformanceData({...performanceData, notes: e.target.value})}
                style={{
                  background: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  color: COLORS.text.primary,
                  borderRadius: '8px'
                }}
              />
            </div>
          </div>

          <div className="text-center mt-4">
            <Button
              onClick={() => setCurrentStep('record')}
              disabled={!performanceData.instrument || !performanceData.piece}
              style={{
                ...BUTTON_STYLES.primary,
                padding: '12px 30px',
                fontSize: '1.1rem',
                borderRadius: '25px'
              }}
            >
              <i className="bi bi-arrow-right me-2"></i>
              다음 단계
            </Button>
          </div>
        </div>
      )}

      {/* 2단계: 연주 녹음 */}
      {currentStep === 'record' && (
        <div className="step-content text-center">
          <div className="mb-4">
            <h4 style={{color: COLORS.text.primary}}>🎤 연주를 녹음해주세요</h4>
            <p style={{color: COLORS.text.secondary}}>AI가 분석할 수 있도록 연주를 녹음해주세요</p>
          </div>

          <div className="recording-interface mb-4" style={{
            background: 'rgba(139, 92, 246, 0.1)',
            borderRadius: '20px',
            padding: '2rem',
            border: '1px solid rgba(139, 92, 246, 0.2)'
          }}>
            <div className="mb-4">
              <div className="fs-1 mb-3">
                {isRecording ? '🔴' : '⚪'}
              </div>
              <div className="h2 mb-2" style={{color: COLORS.text.primary}}>
                {formatTime(recordingTime)}
              </div>
              <div style={{color: COLORS.text.secondary}}>
                {isRecording ? '녹음 중...' : '녹음을 시작하려면 버튼을 클릭하세요'}
              </div>
            </div>

            <div className="d-flex gap-3 justify-content-center">
              {!isRecording ? (
                <Button
                  onClick={startRecording}
                  style={{
                    ...BUTTON_STYLES.primary,
                    padding: '15px 30px',
                    fontSize: '1.2rem',
                    borderRadius: '25px'
                  }}
                >
                  <i className="bi bi-mic me-2"></i>
                  녹음 시작
                </Button>
              ) : (
                <Button
                  onClick={stopRecording}
                  style={{
                    ...BUTTON_STYLES.danger,
                    padding: '15px 30px',
                    fontSize: '1.2rem',
                    borderRadius: '25px'
                  }}
                >
                  <i className="bi bi-stop-circle me-2"></i>
                  녹음 중지
                </Button>
              )}
            </div>
          </div>

          <div className="d-flex gap-3 justify-content-center">
            <Button
              onClick={() => setCurrentStep('select')}
              style={{
                ...BUTTON_STYLES.outline,
                padding: '10px 20px',
                borderRadius: '20px'
              }}
            >
              <i className="bi bi-arrow-left me-2"></i>
              이전 단계
            </Button>
            <Button
              onClick={analyzePerformance}
              disabled={recordingTime === 0}
              style={{
                ...BUTTON_STYLES.primary,
                padding: '10px 20px',
                borderRadius: '20px'
              }}
            >
              <i className="bi bi-robot me-2"></i>
              AI 분석 시작
            </Button>
          </div>
        </div>
      )}

      {/* 3단계: AI 분석 중 */}
      {currentStep === 'analyze' && (
        <div className="step-content text-center">
          <div className="mb-4">
            <h4 style={{color: COLORS.text.primary}}>🤖 AI가 연주를 분석하고 있습니다</h4>
            <p style={{color: COLORS.text.secondary}}>잠시만 기다려주세요...</p>
          </div>

          <div className="analysis-loading" style={{
            background: 'rgba(139, 92, 246, 0.1)',
            borderRadius: '20px',
            padding: '3rem',
            border: '1px solid rgba(139, 92, 246, 0.2)'
          }}>
            <div className="mb-4">
              <div className="fs-1 mb-3">🎵</div>
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div style={{color: COLORS.text.primary}}>연주 분석 중...</div>
            </div>

            <div className="analysis-progress">
              <div className="progress-item mb-2">
                <span style={{color: COLORS.text.secondary}}>음정 정확도 분석</span>
                <div className="progress" style={{height: '6px', borderRadius: '3px'}}>
                  <div className="progress-bar" style={{
                    width: '75%',
                    background: GRADIENTS.primary,
                    borderRadius: '3px'
                  }}></div>
                </div>
              </div>
              <div className="progress-item mb-2">
                <span style={{color: COLORS.text.secondary}}>리듬과 박자 분석</span>
                <div className="progress" style={{height: '6px', borderRadius: '3px'}}>
                  <div className="progress-bar" style={{
                    width: '60%',
                    background: GRADIENTS.primary,
                    borderRadius: '3px'
                  }}></div>
                </div>
              </div>
              <div className="progress-item mb-2">
                <span style={{color: COLORS.text.secondary}}>테크닉 분석</span>
                <div className="progress" style={{height: '6px', borderRadius: '3px'}}>
                  <div className="progress-bar" style={{
                    width: '85%',
                    background: GRADIENTS.primary,
                    borderRadius: '3px'
                  }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4단계: 분석 결과 */}
      {currentStep === 'result' && analysisResult && (
        <div className="step-content">
          <div className="text-center mb-4">
            <h4 style={{color: COLORS.text.primary}}>🎯 AI 분석 결과</h4>
            <p style={{color: COLORS.text.secondary}}>당신의 연주를 분석한 결과입니다</p>
          </div>

          {/* 종합 점수 */}
          <div className="overall-score mb-4" style={{
            background: GRADIENTS.primary,
            borderRadius: '20px',
            padding: '2rem',
            color: 'white',
            textAlign: 'center'
          }}>
            <div className="h1 mb-2">{analysisResult.overall}점</div>
            <div className="fs-5 mb-2">종합 평가</div>
            <div className="score-description">
              {analysisResult.overall >= 90 ? '🎉 훌륭합니다! 거의 완벽한 연주입니다!' :
               analysisResult.overall >= 80 ? '👍 잘했어요! 꾸준한 연습으로 더 좋아질 거예요!' :
               analysisResult.overall >= 70 ? '💪 좋아요! 조금만 더 연습하면 더 좋아질 거예요!' :
               '🌟 열심히 연습하고 있어요! 포기하지 말고 계속해보세요!'}
            </div>
          </div>

          {/* 세부 점수 */}
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <div className="score-card" style={{
                background: 'rgba(139, 92, 246, 0.1)',
                borderRadius: '15px',
                padding: '1.5rem',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                textAlign: 'center'
              }}>
                <div className="h3 mb-2" style={{color: COLORS.primary.main}}>{analysisResult.accuracy}%</div>
                <div style={{color: COLORS.text.primary}}>음정 정확도</div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="score-card" style={{
                background: 'rgba(34, 197, 94, 0.1)',
                borderRadius: '15px',
                padding: '1.5rem',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                textAlign: 'center'
              }}>
                <div className="h3 mb-2" style={{color: COLORS.success.main}}>{analysisResult.rhythm}%</div>
                <div style={{color: COLORS.text.primary}}>리듬과 박자</div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="score-card" style={{
                background: 'rgba(245, 158, 11, 0.1)',
                borderRadius: '15px',
                padding: '1.5rem',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                textAlign: 'center'
              }}>
                <div className="h3 mb-2" style={{color: COLORS.warning.main}}>{analysisResult.pitch}%</div>
                <div style={{color: COLORS.text.primary}}>음정과 음색</div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="score-card" style={{
                background: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '15px',
                padding: '1.5rem',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                textAlign: 'center'
              }}>
                <div className="h3 mb-2" style={{color: COLORS.info.main}}>{analysisResult.technique}%</div>
                <div style={{color: COLORS.text.primary}}>연주 테크닉</div>
              </div>
            </div>
          </div>

          {/* 개선 제안 */}
          <div className="suggestions mb-4" style={{
            background: 'rgba(139, 92, 246, 0.05)',
            borderRadius: '15px',
            padding: '1.5rem',
            border: '1px solid rgba(139, 92, 246, 0.1)'
          }}>
            <h6 style={{color: COLORS.text.primary, marginBottom: '1rem'}}>
              <i className="bi bi-lightbulb me-2" style={{color: COLORS.warning.light}}></i>
              AI 개선 제안
            </h6>
            <ul className="mb-0" style={{color: COLORS.text.secondary}}>
              {analysisResult.suggestions.map((suggestion: string, index: number) => (
                <li key={index} className="mb-2">{suggestion}</li>
              ))}
            </ul>
          </div>

          <div className="text-center">
            <Button
              onClick={resetForm}
              style={{
                ...BUTTON_STYLES.primary,
                padding: '12px 30px',
                fontSize: '1.1rem',
                borderRadius: '25px'
              }}
            >
              <i className="bi bi-arrow-repeat me-2"></i>
              새로운 분석 시작
            </Button>
          </div>
        </div>
      )}

      <style jsx>{`
        .instrument-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        
        .piece-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }
        
        .difficulty-selector {
          display: flex;
          gap: 0.5rem;
        }
        
        .instrument-card:hover,
        .piece-card:hover,
        .difficulty-option:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
        }
        
        .step-content {
          animation: fadeIn 0.5s ease-in;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
} 