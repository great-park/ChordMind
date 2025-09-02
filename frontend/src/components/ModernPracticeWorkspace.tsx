'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Container, Row, Col, Card, Button, ProgressBar, Badge, Modal } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { GRADIENTS, COLORS, CARD_STYLES, BADGE_STYLES, BUTTON_STYLES } from '../constants/styles'
import VirtualPiano from './VirtualPiano'
import Metronome from './Metronome'

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
  const [showPiano, setShowPiano] = useState(false)
  const [showMetronome, setShowMetronome] = useState(false)
  const [currentBeat, setCurrentBeat] = useState(1)
  
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
    <div style={{ 
      minHeight: '100vh', 
      background: GRADIENTS.dark,
      padding: '2rem 0'
    }}>
      {/* 헤더 */}
      <div className="p-4 mb-4" style={{
        background: 'rgba(139, 92, 246, 0.1)',
        borderRadius: '20px',
        border: '1px solid rgba(139, 92, 246, 0.2)',
        margin: '0 2rem'
      }}>
        <Row className="align-items-center">
          <Col md={6}>
            <h2 className="mb-1" style={{color: COLORS.text.primary}}>🎵 연습 워크스페이스</h2>
            <p className="mb-0" style={{color: COLORS.text.secondary}}>AI와 함께하는 스마트 음악 연습</p>
          </Col>
          <Col md={6} className="text-end">
            {user && (
              <div>
                <span className="me-3" style={{color: COLORS.text.primary}}>안녕하세요, {user.name}님!</span>
                <span className="badge me-2" style={{
                  ...BADGE_STYLES.info,
                  fontSize: '0.75rem'
                }}>연습 레벨: 중급</span>
                <span className="badge" style={{
                  ...BADGE_STYLES.warning,
                  fontSize: '0.75rem'
                }}>연속 연습: 5일</span>
              </div>
            )}
          </Col>
        </Row>
      </div>

      <Container className="py-4">
        {/* 연습 모드 선택 */}
        <Row className="mb-4">
          <Col>
            <h4 style={{color: COLORS.text.primary}} className="mb-3">🎯 연습 모드를 선택하세요</h4>
            <Row>
              {practiceModes.map((mode) => (
                <Col key={mode.id} md={4} lg={2} className="mb-3">
                  <Card 
                    className={`mode-card ${currentMode === mode.id ? 'active' : ''}`}
                    onClick={() => setCurrentMode(mode.id)}
                    style={{ 
                      background: mode.color,
                      borderRadius: '20px',
                      border: currentMode === mode.id ? '3px solid white' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      height: '200px'
                    }}
                  >
                    <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center text-white p-4">
                      <div style={{fontSize: '3rem', marginBottom: '1rem'}}>{mode.icon}</div>
                      <h6 className="mb-2 fw-bold">{mode.name}</h6>
                      <small style={{opacity: 0.9}}>{mode.description}</small>
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
            <div style={{
              ...CARD_STYLES.large,
              padding: '2rem',
              marginBottom: '2rem'
            }}>
              {/* 현재 모드 정보 */}
              <div className="text-center mb-4">
                <h3 style={{ 
                  color: COLORS.text.primary,
                  marginBottom: '0.5rem'
                }}>
                  {currentModeData?.icon} {currentModeData?.name}
                </h3>
                <p style={{color: COLORS.text.secondary}}>{currentModeData?.description}</p>
              </div>

              {/* 세션 상태 */}
              {currentSession?.isActive ? (
                <div style={{
                  background: GRADIENTS.success,
                  color: 'white',
                  borderRadius: '15px',
                  padding: '1.5rem',
                  marginBottom: '1.5rem',
                  textAlign: 'center'
                }}>
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
                  <h5 style={{color: COLORS.text.secondary}}>연습을 시작할 준비가 되셨나요?</h5>
                  <p style={{color: COLORS.text.tertiary}}>아래 버튼을 눌러 새로운 연습 세션을 시작하세요.</p>
                </div>
              )}

              {/* 도구 버튼들 */}
              <div className="text-center mb-4">
                <Button
                  style={{
                    ...BUTTON_STYLES.outline,
                    margin: '0 0.5rem',
                    borderRadius: '25px',
                    padding: '10px 20px'
                  }}
                  onClick={() => setShowPiano(!showPiano)}
                >
                  {showPiano ? '🎹 피아노 숨기기' : '🎹 피아노 보기'}
                </Button>
                <Button
                  style={{
                    ...BUTTON_STYLES.outline,
                    margin: '0 0.5rem',
                    borderRadius: '25px',
                    padding: '10px 20px'
                  }}
                  onClick={() => setShowMetronome(!showMetronome)}
                >
                  {showMetronome ? '🎵 메트로놈 숨기기' : '🎵 메트로놈 보기'}
                </Button>
              </div>

              {/* 가상 피아노 */}
              {showPiano && (
                <div className="mb-4">
                  <VirtualPiano
                    onNotePlay={(note, frequency) => {
                      console.log('음표 재생:', note, frequency);
                    }}
                    onNoteStop={(note) => {
                      console.log('음표 정지:', note);
                    }}
                  />
                </div>
              )}

              {/* 메트로놈 */}
              {showMetronome && (
                <div className="mb-4">
                  <Metronome
                    onBeat={(beat) => {
                      setCurrentBeat(beat);
                      console.log('박자:', beat);
                    }}
                    onStart={() => {
                      setIsMetronomeOn(true);
                      console.log('메트로놈 시작');
                    }}
                    onStop={() => {
                      setIsMetronomeOn(false);
                      console.log('메트로놈 정지');
                    }}
                  />
                </div>
              )}

              {/* 컨트롤 버튼들 */}
              <div className="text-center mb-4">
                {currentSession?.isActive ? (
                  <Button
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      border: 'none',
                      fontSize: '1.5rem',
                      transition: 'all 0.3s ease',
                      margin: '0 10px',
                      background: GRADIENTS.warning,
                      color: 'white'
                    }}
                    onClick={handleSessionEnd}
                    title="연습 종료"
                  >
                    ⏹️
                  </Button>
                ) : (
                  <Button
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      border: 'none',
                      fontSize: '1.5rem',
                      transition: 'all 0.3s ease',
                      margin: '0 10px',
                      background: GRADIENTS.success,
                      color: 'white'
                    }}
                    onClick={startSession}
                    title="연습 시작"
                  >
                    ▶️
                  </Button>
                )}

                <Button
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    border: 'none',
                    fontSize: '1.5rem',
                    transition: 'all 0.3s ease',
                    margin: '0 10px',
                    background: isRecording ? GRADIENTS.warning : GRADIENTS.primary,
                    color: 'white'
                  }}
                  onClick={startRecording}
                  title="녹음"
                >
                  🎙️
                </Button>
              </div>

              {/* 실시간 피드백 영역 */}
              <div className="text-center">
                <Card style={{ 
                  background: 'rgba(139, 92, 246, 0.1)', 
                  border: 'none',
                  borderRadius: '15px'
                }}>
                  <Card.Body>
                    <h6 className="mb-3" style={{color: COLORS.text.primary}}>🤖 AI 실시간 분석</h6>
                    {currentSession?.isActive ? (
                      <div>
                        <Row>
                          <Col md={4}>
                            <div className="h4" style={{color: COLORS.success.main}}>92%</div>
                            <small style={{color: COLORS.text.secondary}}>박자 정확도</small>
                          </Col>
                          <Col md={4}>
                            <div className="h4" style={{color: COLORS.warning.main}}>87%</div>
                            <small style={{color: COLORS.text.secondary}}>음정 정확도</small>
                          </Col>
                          <Col md={4}>
                            <div className="h4" style={{color: COLORS.info.main}}>95%</div>
                            <small style={{color: COLORS.text.secondary}}>전체 평가</small>
                          </Col>
                        </Row>
                      </div>
                    ) : (
                      <p style={{color: COLORS.text.tertiary}}>연습을 시작하면 실시간 분석이 표시됩니다</p>
                    )}
                  </Card.Body>
                </Card>
              </div>
            </div>
          </Col>

          {/* 사이드 패널 */}
          <Col lg={4}>
            {/* 오늘의 연습 통계 */}
            <div style={{
              background: 'rgba(139, 92, 246, 0.1)',
              borderRadius: '15px',
              padding: '1rem',
              color: COLORS.text.primary,
              marginBottom: '1rem',
              border: '1px solid rgba(139, 92, 246, 0.2)'
            }}>
              <h6 style={{color: COLORS.text.primary}}>📊 오늘의 연습</h6>
              <div className="d-flex justify-content-between">
                <span style={{color: COLORS.text.secondary}}>연습 시간</span>
                <strong style={{color: COLORS.text.primary}}>45분</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span style={{color: COLORS.text.secondary}}>완료한 세션</span>
                <strong style={{color: COLORS.text.primary}}>3개</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span style={{color: COLORS.text.secondary}}>평균 정확도</span>
                <strong style={{color: COLORS.text.primary}}>91%</strong>
              </div>
            </div>

            {/* 추천 연습 */}
            <Card className="mb-3" style={CARD_STYLES.dark}>
              <Card.Header className="border-0 bg-transparent p-3">
                <h6 className="mb-0" style={{color: COLORS.text.primary}}>💡 AI 추천 연습</h6>
              </Card.Header>
              <Card.Body className="p-3">
                <div className="mb-2">
                  <span className="badge me-2" style={{
                    ...BADGE_STYLES.primary,
                    fontSize: '0.75rem'
                  }}>리듬</span>
                  <span className="small" style={{color: COLORS.text.secondary}}>복합박자 연습</span>
                </div>
                <div className="mb-2">
                  <span className="badge me-2" style={{
                    ...BADGE_STYLES.success,
                    fontSize: '0.75rem'
                  }}>음정</span>
                  <span className="small" style={{color: COLORS.text.secondary}}>3화음 인식</span>
                </div>
                <div className="mb-2">
                  <span className="badge me-2" style={{
                    ...BADGE_STYLES.warning,
                    fontSize: '0.75rem'
                  }}>테크닉</span>
                  <span className="small" style={{color: COLORS.text.secondary}}>레가토 연주법</span>
                </div>
              </Card.Body>
            </Card>

            {/* 연습 목표 */}
            <Card style={CARD_STYLES.dark}>
              <Card.Header className="border-0 bg-transparent p-3">
                <h6 className="mb-0" style={{color: COLORS.text.primary}}>🎯 이번 주 목표</h6>
              </Card.Header>
              <Card.Body className="p-3">
                <div className="mb-3">
                  <div className="d-flex justify-content-between small">
                    <span style={{color: COLORS.text.secondary}}>일일 연습 시간</span>
                    <span style={{color: COLORS.text.primary}}>45/60분</span>
                  </div>
                  <ProgressBar 
                    now={75} 
                    style={{ 
                      height: '6px',
                      background: COLORS.primary.background
                    }}
                    className="mt-1"
                  />
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between small">
                    <span style={{color: COLORS.text.secondary}}>정확도 목표</span>
                    <span style={{color: COLORS.text.primary}}>91/90%</span>
                  </div>
                  <ProgressBar 
                    now={100} 
                    style={{ 
                      height: '6px',
                      background: COLORS.success.background
                    }}
                    className="mt-1"
                  />
                </div>
                <div>
                  <div className="d-flex justify-content-between small">
                    <span style={{color: COLORS.text.secondary}}>새로운 곡 학습</span>
                    <span style={{color: COLORS.text.primary}}>2/3곡</span>
                  </div>
                  <ProgressBar 
                    now={67} 
                    style={{ 
                      height: '6px',
                      background: COLORS.warning.background
                    }}
                    className="mt-1"
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* 플로팅 도움말 버튼 */}
      <div style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        zIndex: 1000
      }}>
        <Button
          style={{
            ...BUTTON_STYLES.primary,
            width: '60px',
            height: '60px',
            borderRadius: '50%'
          }}
          title="도움말"
        >
          ❓
        </Button>
      </div>
    </div>
  )
}

export default ModernPracticeWorkspace