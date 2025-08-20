'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Container, Row, Col, Card, Button, ProgressBar, Badge, Modal } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'

interface PracticeMode {
  id: string
  name: string
  icon: string
  color: string
  description: string
  features: string[]
}

interface MetronomeSettings {
  bpm: number
  timeSignature: string
  sound: string
  volume: number
}

interface PracticeSession {
  id: string
  mode: string
  startTime: Date
  duration: number
  isActive: boolean
}

const ModernPracticeWorkspace: React.FC = () => {
  const { user } = useAuth()
  const [currentMode, setCurrentMode] = useState<string>('rhythm')
  const [isRecording, setIsRecording] = useState(false)
  const [isMetronomeOn, setIsMetronomeOn] = useState(false)
  const [currentSession, setCurrentSession] = useState<PracticeSession | null>(null)
  const [sessionTime, setSessionTime] = useState(0)
  const [showModeSelector, setShowModeSelector] = useState(false)
  
  // 메트로놈 설정
  const [metronome, setMetronome] = useState<MetronomeSettings>({
    bpm: 120,
    timeSignature: '4/4',
    sound: 'click',
    volume: 70
  })

  // 연습 모드 정의
  const practiceModes: PracticeMode[] = [
    {
      id: 'rhythm',
      name: '리듬 연습',
      icon: '🎵',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      description: '정확한 박자와 리듬감을 기르세요',
      features: ['메트로놈 연동', '리듬 패턴 분석', '박자 정확도 측정']
    },
    {
      id: 'pitch',
      name: '음정 연습',
      icon: '🎼',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      description: '정확한 음정과 화성 감각을 기르세요',
      features: ['음정 정확도 분석', '화성 진행 가이드', '인터벌 훈련']
    },
    {
      id: 'chord',
      name: '코드 연습',
      icon: '🎹',
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      description: '다양한 코드 진행을 마스터하세요',
      features: ['코드 전환 연습', '보이싱 분석', '진행 패턴 학습']
    },
    {
      id: 'technique',
      name: '테크닉 연습',
      icon: '⚡',
      color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      description: '연주 기술과 표현력을 향상시키세요',
      features: ['속도 조절 연습', '다이나믹 분석', '아티큘레이션']
    },
    {
      id: 'improvisation',
      name: '즉흥 연주',
      icon: '🎨',
      color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      description: '창의적인 연주 능력을 개발하세요',
      features: ['스케일 가이드', '코드 톤 분석', '멜로디 제안']
    },
    {
      id: 'sight_reading',
      name: '시창청음',
      icon: '👁️',
      color: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      description: '악보 읽기와 듣기 능력을 기르세요',
      features: ['악보 인식', '청음 훈련', '시창 연습']
    }
  ]

  const currentModeData = practiceModes.find(mode => mode.id === currentMode)

  // 세션 타이머
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (currentSession?.isActive) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [currentSession?.isActive])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startSession = () => {
    const newSession: PracticeSession = {
      id: Date.now().toString(),
      mode: currentMode,
      startTime: new Date(),
      duration: 0,
      isActive: true
    }
    setCurrentSession(newSession)
    setSessionTime(0)
  }

  const handleSessionEnd = () => {
    if (currentSession) {
      // 세션 데이터 저장
      const endTime = new Date();
      const duration = endTime.getTime() - currentSession.startTime.getTime();
      
      const completedSession = {
        ...currentSession,
        endTime,
        duration
      };
      
      // TODO: API 호출로 세션 데이터 저장
      console.log('세션 완료:', completedSession);
      
      setCurrentSession(null);
    }
  };

  const toggleMetronome = () => {
    setIsMetronomeOn(!isMetronomeOn);
    // TODO: 메트로놈 사운드 구현
    if (!isMetronomeOn) {
      console.log('메트로놈 시작');
    } else {
      console.log('메트로놈 중지');
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    // TODO: 녹음 기능 구현
    console.log('녹음 시작');
  };

  return (
    <Container fluid className="modern-practice-workspace p-0">
      <style jsx>{`
        .modern-practice-workspace {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
        }
        
        .workspace-header {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0;
          color: white;
        }
        
        .mode-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 20px;
          transition: all 0.3s ease;
          cursor: pointer;
          height: 200px;
        }
        
        .mode-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        
        .mode-card.active {
          border: 2px solid #fff;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
        }
        
        .control-panel {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 25px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 2rem;
          margin-top: 2rem;
        }
        
        .session-status {
          background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
          color: white;
          border-radius: 15px;
          padding: 1.5rem;
          text-align: center;
        }
        
        .control-button {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: none;
          font-size: 1.5rem;
          transition: all 0.3s ease;
          margin: 0 10px;
        }
        
        .control-button:hover {
          transform: scale(1.1);
        }
        
        .control-button.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        
        .control-button.danger {
          background: linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%);
          color: white;
        }
        
        .control-button.success {
          background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
          color: white;
        }
        
        .metronome-controls {
          background: rgba(102, 126, 234, 0.1);
          border-radius: 15px;
          padding: 1.5rem;
          margin-bottom: 1rem;
        }
        
        .bpm-display {
          font-size: 3rem;
          font-weight: bold;
          color: #667eea;
        }
        
        .mode-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        
        .practice-stats {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border-radius: 15px;
          padding: 1rem;
          color: white;
          margin-bottom: 1rem;
        }
        
        .floating-widget {
          position: fixed;
          bottom: 30px;
          right: 30px;
          z-index: 1000;
        }
        
        .pulse {
          animation: pulse 1s infinite;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        .recording {
          animation: recording-blink 1s infinite;
        }
        
        @keyframes recording-blink {
          0%, 50% { background-color: #ff4757; }
          51%, 100% { background-color: #ff6b7a; }
        }
      `}</style>

      {/* 헤더 */}
      <div className="workspace-header p-4">
        <Row className="align-items-center">
          <Col md={6}>
            <h2 className="mb-1">🎵 연습 워크스페이스</h2>
            <p className="mb-0 opacity-75">AI와 함께하는 스마트 음악 연습</p>
          </Col>
          <Col md={6} className="text-end">
            {user && (
              <div>
                <span className="me-3">안녕하세요, {user.name}님!</span>
                <Badge bg="light" text="dark" className="me-2">연습 레벨: 중급</Badge>
                <Badge bg="warning">연속 연습: 5일</Badge>
              </div>
            )}
          </Col>
        </Row>
      </div>

      <Container className="py-4">
        {/* 연습 모드 선택 */}
        <Row className="mb-4">
          <Col>
            <h4 className="text-white mb-3">🎯 연습 모드를 선택하세요</h4>
            <Row>
              {practiceModes.map((mode) => (
                <Col key={mode.id} md={4} lg={2} className="mb-3">
                  <Card 
                    className={`mode-card ${currentMode === mode.id ? 'active' : ''}`}
                    onClick={() => setCurrentMode(mode.id)}
                    style={{ background: mode.color }}
                  >
                    <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center text-white">
                      <div className="mode-icon">{mode.icon}</div>
                      <h6 className="mb-2">{mode.name}</h6>
                      <small className="opacity-75">{mode.description}</small>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>

        {/* 메인 연습 영역 */}
        <Row>
          <Col lg={8}>
            <div className="control-panel">
              {/* 현재 모드 정보 */}
              <div className="text-center mb-4">
                <h3 style={{ color: currentModeData?.color || '#667eea' }}>
                  {currentModeData?.icon} {currentModeData?.name}
                </h3>
                <p className="text-muted">{currentModeData?.description}</p>
              </div>

              {/* 세션 상태 */}
              {currentSession?.isActive ? (
                <div className="session-status mb-4">
                  <h4>🎼 연습 중...</h4>
                  <div className="h2 mb-2">{formatTime(sessionTime)}</div>
                  <ProgressBar 
                    variant="light" 
                    now={(sessionTime % 300) / 300 * 100} 
                    className="mb-2"
                    style={{ height: '8px' }}
                  />
                  <small>5분 집중 세션 진행 중</small>
                </div>
              ) : (
                <div className="text-center mb-4">
                  <h5 className="text-muted">연습을 시작할 준비가 되셨나요?</h5>
                  <p className="text-muted">아래 버튼을 눌러 새로운 연습 세션을 시작하세요.</p>
                </div>
              )}

              {/* 메트로놈 컨트롤 */}
              <div className="metronome-controls">
                <Row className="align-items-center">
                  <Col md={4} className="text-center">
                    <div className="bpm-display">{metronome.bpm}</div>
                    <small className="text-muted">BPM</small>
                  </Col>
                  <Col md={4}>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => setMetronome({...metronome, bpm: Math.max(60, metronome.bpm - 5)})}
                    >
                      -5
                    </Button>
                    <Button
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => setMetronome({...metronome, bpm: Math.min(200, metronome.bpm + 5)})}
                    >
                      +5
                    </Button>
                  </Col>
                  <Col md={4} className="text-center">
                    <div>{metronome.timeSignature}</div>
                    <small className="text-muted">박자</small>
                  </Col>
                </Row>
              </div>

              {/* 컨트롤 버튼들 */}
              <div className="text-center mb-4">
                <Button
                  className={`control-button ${isMetronomeOn ? 'success' : 'primary'} ${isMetronomeOn ? 'pulse' : ''}`}
                  onClick={toggleMetronome}
                  title="메트로놈"
                >
                  🎵
                </Button>

                {currentSession?.isActive ? (
                  <Button
                    className="control-button danger"
                    onClick={handleSessionEnd}
                    title="연습 종료"
                  >
                    ⏹️
                  </Button>
                ) : (
                  <Button
                    className="control-button success"
                    onClick={startSession}
                    title="연습 시작"
                  >
                    ▶️
                  </Button>
                )}

                <Button
                  className={`control-button ${isRecording ? 'danger recording' : 'primary'}`}
                  onClick={startRecording}
                  title="녹음"
                >
                  🎙️
                </Button>
              </div>

              {/* 실시간 피드백 영역 */}
              <div className="text-center">
                <Card style={{ background: 'rgba(102, 126, 234, 0.1)', border: 'none' }}>
                  <Card.Body>
                    <h6 className="mb-3">🤖 AI 실시간 분석</h6>
                    {currentSession?.isActive ? (
                      <div>
                        <Row>
                          <Col md={4}>
                            <div className="h4 text-success">92%</div>
                            <small>박자 정확도</small>
                          </Col>
                          <Col md={4}>
                            <div className="h4 text-warning">87%</div>
                            <small>음정 정확도</small>
                          </Col>
                          <Col md={4}>
                            <div className="h4 text-info">95%</div>
                            <small>전체 평가</small>
                          </Col>
                        </Row>
                      </div>
                    ) : (
                      <p className="text-muted">연습을 시작하면 실시간 분석이 표시됩니다</p>
                    )}
                  </Card.Body>
                </Card>
              </div>
            </div>
          </Col>

          {/* 사이드 패널 */}
          <Col lg={4}>
            {/* 오늘의 연습 통계 */}
            <div className="practice-stats mb-3">
              <h6>📊 오늘의 연습</h6>
              <div className="d-flex justify-content-between">
                <span>연습 시간</span>
                <strong>45분</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span>완료한 세션</span>
                <strong>3개</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span>평균 정확도</span>
                <strong>91%</strong>
              </div>
            </div>

            {/* 추천 연습 */}
            <Card className="mb-3" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
              <Card.Header>
                <h6 className="mb-0">💡 AI 추천 연습</h6>
              </Card.Header>
              <Card.Body>
                <div className="mb-2">
                  <Badge bg="primary" className="me-2">리듬</Badge>
                  <span className="small">복합박자 연습</span>
                </div>
                <div className="mb-2">
                  <Badge bg="success" className="me-2">음정</Badge>
                  <span className="small">3화음 인식</span>
                </div>
                <div className="mb-2">
                  <Badge bg="warning" className="me-2">테크닉</Badge>
                  <span className="small">레가토 연주법</span>
                </div>
              </Card.Body>
            </Card>

            {/* 연습 목표 */}
            <Card style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
              <Card.Header>
                <h6 className="mb-0">🎯 이번 주 목표</h6>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <div className="d-flex justify-content-between small">
                    <span>일일 연습 시간</span>
                    <span>45/60분</span>
                  </div>
                  <ProgressBar now={75} variant="success" style={{ height: '6px' }} />
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between small">
                    <span>정확도 목표</span>
                    <span>91/90%</span>
                  </div>
                  <ProgressBar now={100} variant="info" style={{ height: '6px' }} />
                </div>
                <div>
                  <div className="d-flex justify-content-between small">
                    <span>새로운 곡 학습</span>
                    <span>2/3곡</span>
                  </div>
                  <ProgressBar now={67} variant="warning" style={{ height: '6px' }} />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* 플로팅 도움말 버튼 */}
      <div className="floating-widget">
        <Button
          variant="primary"
          className="rounded-circle"
          style={{ width: '60px', height: '60px' }}
          title="도움말"
        >
          ❓
        </Button>
      </div>
    </Container>
  )
}

export default ModernPracticeWorkspace