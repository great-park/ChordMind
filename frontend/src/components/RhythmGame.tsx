'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Button, ProgressBar, Badge, Alert } from 'react-bootstrap';
import { GRADIENTS, COLORS, CARD_STYLES, BADGE_STYLES, BUTTON_STYLES } from '../constants/styles';

interface RhythmPattern {
  id: number;
  name: string;
  pattern: number[]; // 1 = 강박, 0 = 약박
  bpm: number;
  timeSignature: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
}

interface GameState {
  currentPattern: number;
  score: number;
  timeLeft: number;
  isPlaying: boolean;
  isCompleted: boolean;
  currentBeat: number;
  userTaps: number[];
  isRecording: boolean;
  streak: number;
  mistakes: number;
  accuracy: number;
}

const RhythmGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentPattern: 0,
    score: 0,
    timeLeft: 30,
    isPlaying: false,
    isCompleted: false,
    currentBeat: 0,
    userTaps: [],
    isRecording: false,
    streak: 0,
    mistakes: 0,
    accuracy: 0
  });

  const [selectedPattern, setSelectedPattern] = useState<number>(0);
  const [showPatternSelect, setShowPatternSelect] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<'correct' | 'incorrect' | null>(null);
  const [isMetronomeOn, setIsMetronomeOn] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const metronomeRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // 리듬 패턴 데이터
  const rhythmPatterns: RhythmPattern[] = [
    {
      id: 0,
      name: '기본 4박자',
      pattern: [1, 0, 1, 0],
      bpm: 120,
      timeSignature: '4/4',
      difficulty: 'easy',
      description: '강박과 약박의 기본적인 구분을 배워보세요'
    },
    {
      id: 1,
      name: '복합 리듬',
      pattern: [1, 0, 0, 1, 0, 0],
      bpm: 100,
      timeSignature: '6/8',
      difficulty: 'medium',
      description: '6/8박자의 복합 리듬을 연습해보세요'
    },
    {
      id: 2,
      name: '싱코페이션',
      pattern: [1, 0, 0, 1, 0, 1, 0, 0],
      bpm: 90,
      timeSignature: '4/4',
      difficulty: 'hard',
      description: '예상과 다른 위치의 강박을 연습해보세요'
    },
    {
      id: 3,
      name: '3박자 왈츠',
      pattern: [1, 0, 0],
      bpm: 140,
      timeSignature: '3/4',
      difficulty: 'easy',
      description: '왈츠의 기본적인 3박자 리듬입니다'
    },
    {
      id: 4,
      name: '복잡한 16분음표',
      pattern: [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
      bpm: 80,
      timeSignature: '4/4',
      difficulty: 'hard',
      description: '16분음표로 구성된 복잡한 리듬 패턴입니다'
    }
  ];

  // AudioContext 초기화
  useEffect(() => {
    const initAudioContext = async () => {
      try {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = context;
      } catch (error) {
        console.error('AudioContext 초기화 실패:', error);
      }
    };

    initAudioContext();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (metronomeRef.current) clearInterval(metronomeRef.current);
    };
  }, []);

  // 메트로놈 사운드 재생
  const playMetronomeClick = (isStrongBeat: boolean) => {
    if (!audioContextRef.current) return;

    try {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      oscillator.frequency.setValueAtTime(
        isStrongBeat ? 1000 : 800, 
        audioContextRef.current.currentTime
      );
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContextRef.current.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.1);

      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + 0.1);
    } catch (error) {
      console.error('메트로놈 사운드 재생 실패:', error);
    }
  };

  // 메트로놈 시작/정지
  const toggleMetronome = () => {
    if (isMetronomeOn) {
      if (metronomeRef.current) {
        clearInterval(metronomeRef.current);
        metronomeRef.current = null;
      }
      setIsMetronomeOn(false);
    } else {
      const currentPattern = rhythmPatterns[gameState.currentPattern];
      const interval = 60000 / currentPattern.bpm;
      
      metronomeRef.current = setInterval(() => {
        const beatIndex = gameState.currentBeat % currentPattern.pattern.length;
        const isStrongBeat = currentPattern.pattern[beatIndex] === 1;
        playMetronomeClick(isStrongBeat);
        
        setGameState(prev => ({
          ...prev,
          currentBeat: (prev.currentBeat + 1) % currentPattern.pattern.length
        }));
      }, interval);
      
      setIsMetronomeOn(true);
    }
  };

  // 타이머 관리
  useEffect(() => {
    if (gameState.isPlaying && gameState.timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setGameState(prev => {
          if (prev.timeLeft <= 1) {
            endGame();
            return { ...prev, timeLeft: 0 };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState.isPlaying, gameState.timeLeft]);

  const startGame = (patternId: number) => {
    const pattern = rhythmPatterns[patternId];
    setGameState({
      currentPattern: patternId,
      score: 0,
      timeLeft: 30,
      isPlaying: true,
      isCompleted: false,
      currentBeat: 0,
      userTaps: [],
      isRecording: false,
      streak: 0,
      mistakes: 0,
      accuracy: 0
    });
    setShowPatternSelect(false);
    setShowResult(false);
    setLastResult(null);
    setIsMetronomeOn(false);
  };

  const endGame = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (metronomeRef.current) {
      clearInterval(metronomeRef.current);
      setIsMetronomeOn(false);
    }
    
    // 정확도 계산
    const pattern = rhythmPatterns[gameState.currentPattern];
    const correctTaps = gameState.userTaps.filter((tap, index) => 
      tap === pattern.pattern[index % pattern.pattern.length]
    ).length;
    const accuracy = gameState.userTaps.length > 0 
      ? Math.round((correctTaps / gameState.userTaps.length) * 100)
      : 0;
    
    setGameState(prev => ({ 
      ...prev, 
      isPlaying: false, 
      isCompleted: true,
      accuracy 
    }));
  };

  const handleTap = () => {
    if (!gameState.isPlaying) return;

    const pattern = rhythmPatterns[gameState.currentPattern];
    const currentBeatIndex = gameState.currentBeat % pattern.pattern.length;
    const expectedBeat = pattern.pattern[currentBeatIndex];
    const userTap = 1; // 사용자가 탭한 것은 강박으로 간주

    const newUserTaps = [...gameState.userTaps, userTap];
    const isCorrect = userTap === expectedBeat;

    if (isCorrect) {
      setGameState(prev => ({
        ...prev,
        userTaps: newUserTaps,
        streak: prev.streak + 1,
        score: prev.score + 10 + (prev.streak * 2)
      }));
      setLastResult('correct');
    } else {
      setGameState(prev => ({
        ...prev,
        userTaps: newUserTaps,
        mistakes: prev.mistakes + 1,
        streak: 0
      }));
      setLastResult('incorrect');
    }

    setShowResult(true);
    setTimeout(() => {
      setShowResult(false);
      setLastResult(null);
    }, 1000);
  };

  const resetGame = () => {
    setGameState({
      currentPattern: 0,
      score: 0,
      timeLeft: 30,
      isPlaying: false,
      isCompleted: false,
      currentBeat: 0,
      userTaps: [],
      isRecording: false,
      streak: 0,
      mistakes: 0,
      accuracy: 0
    });
    setShowPatternSelect(true);
    setShowResult(false);
    setLastResult(null);
    setIsMetronomeOn(false);
    
    if (timerRef.current) clearInterval(timerRef.current);
    if (metronomeRef.current) clearInterval(metronomeRef.current);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return COLORS.success.main;
      case 'medium': return COLORS.warning.main;
      case 'hard': return COLORS.danger.main;
      default: return COLORS.text.secondary;
    }
  };

  if (showPatternSelect) {
    return (
      <Card style={CARD_STYLES.large}>
        <Card.Header className="border-0 bg-transparent p-4">
          <div className="text-center">
            <h4 style={{ color: COLORS.text.primary, marginBottom: '1rem' }}>
              🥁 리듬 연습 게임
            </h4>
            <p style={{ color: COLORS.text.secondary }}>
              리듬 패턴을 듣고 정확하게 따라해보세요!
            </p>
          </div>
        </Card.Header>
        
        <Card.Body className="p-4">
          <Row>
            {rhythmPatterns.map((pattern) => (
              <Col key={pattern.id} md={6} lg={4} className="mb-4">
                <Card 
                  className="h-100 border-0 shadow-sm" 
                  style={{
                    background: 'linear-gradient(135deg, #334155 0%, #475569 100%)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => startGame(pattern.id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <Card.Body className="p-4">
                    <div className="text-center mb-3">
                      <div style={{
                        fontSize: '2.5rem',
                        marginBottom: '0.5rem'
                      }}>
                        {pattern.id === 0 ? '🎵' : 
                         pattern.id === 1 ? '🎼' : 
                         pattern.id === 2 ? '🎹' :
                         pattern.id === 3 ? '💃' : '🥁'}
                      </div>
                      
                      <h6 style={{ color: COLORS.text.primary, marginBottom: '0.5rem' }}>
                        {pattern.name}
                      </h6>
                      
                      <Badge style={{
                        background: getDifficultyColor(pattern.difficulty),
                        color: 'white',
                        fontSize: '0.7rem',
                        marginBottom: '0.5rem'
                      }}>
                        {pattern.difficulty.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="text-center mb-3">
                      <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '0.25rem',
                        flexWrap: 'wrap'
                      }}>
                        {pattern.pattern.map((beat, index) => (
                          <div
                            key={index}
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              background: beat === 1 
                                ? COLORS.primary.main 
                                : 'rgba(255, 255, 255, 0.3)',
                              border: `2px solid ${beat === 1 
                                ? COLORS.primary.main 
                                : 'rgba(255, 255, 255, 0.5)'}`
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <p style={{ 
                      color: COLORS.text.secondary, 
                      fontSize: '0.8rem', 
                      marginBottom: '0.5rem',
                      textAlign: 'center'
                    }}>
                      {pattern.description}
                    </p>
                    
                    <div className="text-center">
                      <small style={{ color: COLORS.text.tertiary }}>
                        {pattern.timeSignature} • {pattern.bpm} BPM
                      </small>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
    );
  }

  if (gameState.isCompleted) {
    const currentPattern = rhythmPatterns[gameState.currentPattern];
    
    return (
      <Card style={CARD_STYLES.large}>
        <Card.Header className="border-0 bg-transparent p-4">
          <div className="text-center">
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
              {gameState.accuracy >= 80 ? '🏆' : gameState.accuracy >= 60 ? '🎉' : '💪'}
            </div>
            <h4 style={{ color: COLORS.text.primary, marginBottom: '0.5rem' }}>
              게임 완료!
            </h4>
            <p style={{ color: COLORS.text.secondary }}>
              {currentPattern.name}을 완료했습니다!
            </p>
          </div>
        </Card.Header>
        
        <Card.Body className="p-4">
          {/* 결과 통계 */}
          <Row className="mb-4">
            <Col md={4}>
              <div className="text-center">
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  background: GRADIENTS.primary,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  {gameState.score}
                </div>
                <small style={{ color: COLORS.text.secondary }}>점수</small>
              </div>
            </Col>
            <Col md={4}>
              <div className="text-center">
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  color: COLORS.success.main
                }}>
                  {gameState.accuracy}%
                </div>
                <small style={{ color: COLORS.text.secondary }}>정확도</small>
              </div>
            </Col>
            <Col md={4}>
              <div className="text-center">
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  color: COLORS.danger.main
                }}>
                  {gameState.mistakes}
                </div>
                <small style={{ color: COLORS.text.secondary }}>실수</small>
              </div>
            </Col>
          </Row>

          {/* 액션 버튼들 */}
          <div className="d-flex gap-3 justify-content-center">
            <Button
              onClick={resetGame}
              style={{
                ...BUTTON_STYLES.primary,
                padding: '0.75rem 1.5rem',
                borderRadius: '20px'
              }}
            >
              🔄 다시 시작
            </Button>
            <Button
              onClick={resetGame}
              style={{
                ...BUTTON_STYLES.outline,
                padding: '0.75rem 1.5rem',
                borderRadius: '20px'
              }}
            >
              🏠 홈으로
            </Button>
          </div>
        </Card.Body>
      </Card>
    );
  }

  const currentPattern = rhythmPatterns[gameState.currentPattern];
  const progress = (gameState.userTaps.length / 20) * 100; // 최대 20번의 탭

  return (
    <Card style={CARD_STYLES.large}>
      <Card.Header className="border-0 bg-transparent p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 style={{ color: COLORS.text.primary, marginBottom: '0.5rem' }}>
              🥁 {currentPattern.name}
            </h5>
            <Badge style={{
              background: getDifficultyColor(currentPattern.difficulty),
              color: 'white',
              fontSize: '0.8rem'
            }}>
              {currentPattern.difficulty.toUpperCase()}
            </Badge>
          </div>
          <div className="text-end">
            <div style={{ color: COLORS.text.primary, fontSize: '1.2rem', fontWeight: 'bold' }}>
              {gameState.timeLeft}초
            </div>
            <small style={{ color: COLORS.text.secondary }}>남은 시간</small>
          </div>
        </div>
        
        <ProgressBar
          now={progress}
          style={{ height: '8px', borderRadius: '4px' }}
          className="mb-3"
        />
        
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <small style={{ color: COLORS.text.secondary }}>
              점수: <strong style={{ color: COLORS.primary.main }}>{gameState.score}</strong>
            </small>
          </div>
          <div>
            <small style={{ color: COLORS.text.secondary }}>
              연속: <strong style={{ color: COLORS.success.main }}>{gameState.streak}</strong>
            </small>
          </div>
        </div>
      </Card.Header>
      
      <Card.Body className="p-4">
        {/* 리듬 패턴 표시 */}
        <div className="text-center mb-4">
          <h6 style={{ color: COLORS.text.primary, marginBottom: '1rem' }}>
            리듬 패턴
          </h6>
          <div className="d-flex justify-content-center gap-2 flex-wrap mb-3">
            {currentPattern.pattern.map((beat, index) => (
              <div
                key={index}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: beat === 1 
                    ? COLORS.primary.main 
                    : 'rgba(255, 255, 255, 0.2)',
                  border: `3px solid ${beat === 1 
                    ? COLORS.primary.main 
                    : 'rgba(255, 255, 255, 0.4)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                  animation: index === gameState.currentBeat % currentPattern.pattern.length 
                    ? 'pulse 0.5s ease-in-out' 
                    : 'none'
                }}
              >
                {beat === 1 ? '●' : '○'}
              </div>
            ))}
          </div>
          <small style={{ color: COLORS.text.secondary }}>
            {currentPattern.timeSignature} • {currentPattern.bpm} BPM
          </small>
        </div>

        {/* 메트로놈 컨트롤 */}
        <div className="text-center mb-4">
          <Button
            onClick={toggleMetronome}
            style={{
              ...BUTTON_STYLES.outline,
              padding: '0.75rem 1.5rem',
              borderRadius: '20px',
              borderColor: isMetronomeOn ? COLORS.success.main : COLORS.primary.main,
              color: isMetronomeOn ? COLORS.success.main : COLORS.primary.main
            }}
          >
            {isMetronomeOn ? '⏸️ 메트로놈 정지' : '▶️ 메트로놈 시작'}
          </Button>
        </div>

        {/* 탭 버튼 */}
        <div className="text-center mb-4">
          <Button
            onClick={handleTap}
            disabled={!gameState.isPlaying}
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              border: 'none',
              fontSize: '2rem',
              background: GRADIENTS.primary,
              color: 'white',
              transition: 'all 0.1s ease',
              boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)'
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'scale(0.95)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            🥁
          </Button>
          <div className="mt-2">
            <small style={{ color: COLORS.text.secondary }}>
              리듬에 맞춰 탭하세요!
            </small>
          </div>
        </div>

        {/* 결과 표시 */}
        {showResult && (
          <Alert
            variant={lastResult === 'correct' ? 'success' : 'danger'}
            className="border-0"
            style={{
              background: lastResult === 'correct' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              borderRadius: '15px'
            }}
          >
            <div className="text-center">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                {lastResult === 'correct' ? '✅' : '❌'}
              </div>
              <h6 style={{ color: lastResult === 'correct' ? COLORS.success.main : COLORS.danger.main }}>
                {lastResult === 'correct' ? '정확합니다!' : '다시 시도해보세요!'}
              </h6>
            </div>
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
};

export default RhythmGame;
