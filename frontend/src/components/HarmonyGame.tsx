'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Button, ProgressBar, Badge, Alert } from 'react-bootstrap';
import { GRADIENTS, COLORS, CARD_STYLES, BADGE_STYLES, BUTTON_STYLES } from '../constants/styles';

interface Chord {
  name: string;
  notes: string[];
  romanNumeral: string;
  function: string;
  color: string;
}

interface GameLevel {
  id: number;
  name: string;
  description: string;
  chords: Chord[];
  targetProgression: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
}

interface GameState {
  currentLevel: number;
  score: number;
  timeLeft: number;
  isPlaying: boolean;
  isCompleted: boolean;
  selectedChords: string[];
  currentProgression: string[];
  streak: number;
  mistakes: number;
}

const HarmonyGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentLevel: 0,
    score: 0,
    timeLeft: 60,
    isPlaying: false,
    isCompleted: false,
    selectedChords: [],
    currentProgression: [],
    streak: 0,
    mistakes: 0
  });

  const [selectedLevel, setSelectedLevel] = useState<number>(0);
  const [showLevelSelect, setShowLevelSelect] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<'correct' | 'incorrect' | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 게임 레벨 데이터
  const gameLevels: GameLevel[] = [
    {
      id: 0,
      name: '기본 3화음',
      description: 'C 메이저 스케일의 기본 3화음을 배워보세요',
      difficulty: 'easy',
      timeLimit: 60,
      chords: [
        { name: 'C', notes: ['C', 'E', 'G'], romanNumeral: 'I', function: '토닉', color: '#667eea' },
        { name: 'F', notes: ['F', 'A', 'C'], romanNumeral: 'IV', function: '서브도미넌트', color: '#f093fb' },
        { name: 'G', notes: ['G', 'B', 'D'], romanNumeral: 'V', function: '도미넌트', color: '#4facfe' },
        { name: 'Am', notes: ['A', 'C', 'E'], romanNumeral: 'vi', function: '서브미디언트', color: '#43e97b' }
      ],
      targetProgression: ['I', 'V', 'vi', 'IV']
    },
    {
      id: 1,
      name: '2-5-1 진행',
      description: '재즈의 기본인 2-5-1 진행을 마스터하세요',
      difficulty: 'medium',
      timeLimit: 45,
      chords: [
        { name: 'Dm', notes: ['D', 'F', 'A'], romanNumeral: 'ii', function: '수퍼토닉', color: '#fa709a' },
        { name: 'G', notes: ['G', 'B', 'D'], romanNumeral: 'V', function: '도미넌트', color: '#4facfe' },
        { name: 'C', notes: ['C', 'E', 'G'], romanNumeral: 'I', function: '토닉', color: '#667eea' },
        { name: 'G7', notes: ['G', 'B', 'D', 'F'], romanNumeral: 'V7', function: '도미넌트7', color: '#ffecd2' }
      ],
      targetProgression: ['ii', 'V7', 'I']
    },
    {
      id: 2,
      name: '고급 화성',
      description: '복잡한 화성 진행을 도전해보세요',
      difficulty: 'hard',
      timeLimit: 30,
      chords: [
        { name: 'Cmaj7', notes: ['C', 'E', 'G', 'B'], romanNumeral: 'Imaj7', function: '토닉메이저7', color: '#667eea' },
        { name: 'Am7', notes: ['A', 'C', 'E', 'G'], romanNumeral: 'vimi7', function: '서브미디언트7', color: '#43e97b' },
        { name: 'Dm7', notes: ['D', 'F', 'A', 'C'], romanNumeral: 'iimi7', function: '수퍼토닉7', color: '#fa709a' },
        { name: 'G7', notes: ['G', 'B', 'D', 'F'], romanNumeral: 'V7', function: '도미넌트7', color: '#ffecd2' },
        { name: 'Fmaj7', notes: ['F', 'A', 'C', 'E'], romanNumeral: 'IVmaj7', function: '서브도미넌트메이저7', color: '#f093fb' }
      ],
      targetProgression: ['Imaj7', 'vimi7', 'iimi7', 'V7']
    }
  ];

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

  const startGame = (levelId: number) => {
    const level = gameLevels[levelId];
    setGameState({
      currentLevel: levelId,
      score: 0,
      timeLeft: level.timeLimit,
      isPlaying: true,
      isCompleted: false,
      selectedChords: [],
      currentProgression: [],
      streak: 0,
      mistakes: 0
    });
    setShowLevelSelect(false);
    setShowResult(false);
    setLastResult(null);
  };

  const endGame = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setGameState(prev => ({ ...prev, isPlaying: false, isCompleted: true }));
  };

  const selectChord = (chordName: string) => {
    if (!gameState.isPlaying) return;

    const level = gameLevels[gameState.currentLevel];
    const chord = level.chords.find(c => c.name === chordName);
    if (!chord) return;

    const newProgression = [...gameState.currentProgression, chord.romanNumeral];
    const targetProgression = level.targetProgression;
    
    // 진행 상황 확인
    const isCorrect = newProgression.every((chord, index) => 
      chord === targetProgression[index]
    );

    if (isCorrect) {
      if (newProgression.length === targetProgression.length) {
        // 레벨 완료
        const levelScore = Math.max(0, gameState.timeLeft * 10 + gameState.streak * 5);
        setGameState(prev => ({
          ...prev,
          score: prev.score + levelScore,
          streak: prev.streak + 1,
          isCompleted: true,
          isPlaying: false
        }));
        setLastResult('correct');
      } else {
        // 올바른 진행
        setGameState(prev => ({
          ...prev,
          currentProgression: newProgression,
          streak: prev.streak + 1
        }));
        setLastResult('correct');
      }
    } else {
      // 잘못된 진행
      setGameState(prev => ({
        ...prev,
        mistakes: prev.mistakes + 1,
        streak: 0,
        currentProgression: []
      }));
      setLastResult('incorrect');
    }

    setShowResult(true);
    setTimeout(() => {
      setShowResult(false);
      setLastResult(null);
    }, 1500);
  };

  const resetGame = () => {
    setGameState({
      currentLevel: 0,
      score: 0,
      timeLeft: 60,
      isPlaying: false,
      isCompleted: false,
      selectedChords: [],
      currentProgression: [],
      streak: 0,
      mistakes: 0
    });
    setShowLevelSelect(true);
    setShowResult(false);
    setLastResult(null);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const nextLevel = () => {
    if (gameState.currentLevel < gameLevels.length - 1) {
      startGame(gameState.currentLevel + 1);
    } else {
      resetGame();
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return COLORS.success.main;
      case 'medium': return COLORS.warning.main;
      case 'hard': return COLORS.danger.main;
      default: return COLORS.text.secondary;
    }
  };

  if (showLevelSelect) {
    return (
      <Card style={CARD_STYLES.large}>
        <Card.Header className="border-0 bg-transparent p-4">
          <div className="text-center">
            <h4 style={{ color: COLORS.text.primary, marginBottom: '1rem' }}>
              🎹 화성학 게임
            </h4>
            <p style={{ color: COLORS.text.secondary }}>
              화성 진행을 배우고 마스터해보세요!
            </p>
          </div>
        </Card.Header>
        
        <Card.Body className="p-4">
          <Row>
            {gameLevels.map((level) => (
              <Col key={level.id} md={4} className="mb-4">
                <Card 
                  className="h-100 border-0 shadow-sm" 
                  style={{
                    background: 'linear-gradient(135deg, #334155 0%, #475569 100%)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => startGame(level.id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <Card.Body className="p-4 text-center">
                    <div style={{
                      fontSize: '3rem',
                      marginBottom: '1rem'
                    }}>
                      {level.id === 0 ? '🎵' : level.id === 1 ? '🎼' : '🎹'}
                    </div>
                    
                    <h5 style={{ color: COLORS.text.primary, marginBottom: '0.5rem' }}>
                      {level.name}
                    </h5>
                    
                    <p style={{ color: COLORS.text.secondary, fontSize: '0.9rem', marginBottom: '1rem' }}>
                      {level.description}
                    </p>
                    
                    <Badge style={{
                      background: getDifficultyColor(level.difficulty),
                      color: 'white',
                      fontSize: '0.8rem'
                    }}>
                      {level.difficulty.toUpperCase()}
                    </Badge>
                    
                    <div className="mt-2">
                      <small style={{ color: COLORS.text.tertiary }}>
                        ⏱️ {level.timeLimit}초
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
    const currentLevel = gameLevels[gameState.currentLevel];
    const isLastLevel = gameState.currentLevel === gameLevels.length - 1;
    
    return (
      <Card style={CARD_STYLES.large}>
        <Card.Header className="border-0 bg-transparent p-4">
          <div className="text-center">
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
              {gameState.mistakes === 0 ? '🏆' : gameState.mistakes <= 2 ? '🎉' : '💪'}
            </div>
            <h4 style={{ color: COLORS.text.primary, marginBottom: '0.5rem' }}>
              레벨 완료!
            </h4>
            <p style={{ color: COLORS.text.secondary }}>
              {currentLevel.name}을 성공적으로 완료했습니다!
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
                  {gameState.streak}
                </div>
                <small style={{ color: COLORS.text.secondary }}>연속 성공</small>
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
            {!isLastLevel && (
              <Button
                onClick={nextLevel}
                style={{
                  ...BUTTON_STYLES.primary,
                  padding: '0.75rem 1.5rem',
                  borderRadius: '20px'
                }}
              >
                ➡️ 다음 레벨
              </Button>
            )}
            <Button
              onClick={resetGame}
              style={{
                ...BUTTON_STYLES.outline,
                padding: '0.75rem 1.5rem',
                borderRadius: '20px'
              }}
            >
              🔄 다시 시작
            </Button>
          </div>
        </Card.Body>
      </Card>
    );
  }

  const currentLevel = gameLevels[gameState.currentLevel];
  const progress = (gameState.currentProgression.length / currentLevel.targetProgression.length) * 100;

  return (
    <Card style={CARD_STYLES.large}>
      <Card.Header className="border-0 bg-transparent p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 style={{ color: COLORS.text.primary, marginBottom: '0.5rem' }}>
              🎹 {currentLevel.name}
            </h5>
            <Badge style={{
              background: getDifficultyColor(currentLevel.difficulty),
              color: 'white',
              fontSize: '0.8rem'
            }}>
              {currentLevel.difficulty.toUpperCase()}
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
        {/* 목표 진행 표시 */}
        <div className="text-center mb-4">
          <h6 style={{ color: COLORS.text.primary, marginBottom: '1rem' }}>
            목표 화성 진행
          </h6>
          <div className="d-flex justify-content-center gap-2 flex-wrap">
            {currentLevel.targetProgression.map((chord, index) => (
              <div
                key={index}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  background: gameState.currentProgression[index] === chord 
                    ? COLORS.success.background 
                    : 'rgba(255, 255, 255, 0.1)',
                  border: `2px solid ${gameState.currentProgression[index] === chord 
                    ? COLORS.success.main 
                    : 'rgba(255, 255, 255, 0.2)'}`,
                  color: gameState.currentProgression[index] === chord 
                    ? COLORS.success.main 
                    : COLORS.text.secondary,
                  fontWeight: 'bold',
                  minWidth: '50px',
                  textAlign: 'center'
                }}
              >
                {chord}
              </div>
            ))}
          </div>
        </div>

        {/* 현재 진행 표시 */}
        {gameState.currentProgression.length > 0 && (
          <div className="text-center mb-4">
            <h6 style={{ color: COLORS.text.primary, marginBottom: '1rem' }}>
              현재 진행
            </h6>
            <div className="d-flex justify-content-center gap-2 flex-wrap">
              {gameState.currentProgression.map((chord, index) => (
                <div
                  key={index}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    background: COLORS.primary.background,
                    border: `2px solid ${COLORS.primary.main}`,
                    color: COLORS.primary.main,
                    fontWeight: 'bold',
                    minWidth: '50px',
                    textAlign: 'center'
                  }}
                >
                  {chord}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 코드 선택 */}
        <div className="mb-4">
          <h6 style={{ color: COLORS.text.primary, marginBottom: '1rem', textAlign: 'center' }}>
            화성 진행을 완성하세요
          </h6>
          <Row>
            {currentLevel.chords.map((chord) => (
              <Col key={chord.name} md={6} lg={3} className="mb-3">
                <Button
                  variant="outline-primary"
                  className="w-100"
                  onClick={() => selectChord(chord.name)}
                  style={{
                    ...BUTTON_STYLES.outline,
                    padding: '1rem',
                    borderRadius: '15px',
                    borderColor: chord.color,
                    color: chord.color,
                    background: 'transparent',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = chord.color;
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = chord.color;
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                    {chord.name}
                  </div>
                  <small style={{ opacity: 0.8 }}>
                    {chord.romanNumeral}
                  </small>
                </Button>
              </Col>
            ))}
          </Row>
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

export default HarmonyGame;
