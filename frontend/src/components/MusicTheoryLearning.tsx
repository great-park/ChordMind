'use client'

import React, { useState, useEffect } from 'react';
import { Button, Card, Row, Col, ProgressBar, Badge, Accordion } from 'react-bootstrap';
import { musicTheoryService, TheoryLesson, ProgressionPattern, ModalMixture, LearningProgress } from '../services/musicTheoryService';
import { GRADIENTS, COLORS, CARD_STYLES, BADGE_STYLES, BUTTON_STYLES } from '../constants/styles';
import { useAuth } from '../contexts/AuthContext';

export default function MusicTheoryLearning() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<'dashboard' | 'lesson' | 'patterns' | 'mixtures' | 'progress'>('dashboard');
  const [lessons, setLessons] = useState<TheoryLesson[]>([]);
  const [patterns, setPatterns] = useState<ProgressionPattern[]>([]);
  const [mixtures, setMixtures] = useState<ModalMixture[]>([]);
  const [progress, setProgress] = useState<LearningProgress | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<TheoryLesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string | string[] }>({});
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [lessonsData, patternsData, mixturesData] = await Promise.all([
        musicTheoryService.getTheoryCurriculum(),
        musicTheoryService.getProgressionPatterns(),
        musicTheoryService.getModalMixtures()
      ]);

      setLessons(lessonsData);
      setPatterns(patternsData);
      setMixtures(mixturesData);

      if (user?.id) {
        const userProgress = await musicTheoryService.getLearningProgress(user.id.toString());
        setProgress(userProgress);
      }
    } catch (error) {
      console.error('데이터 로딩 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER': return 'success';
      case 'INTERMEDIATE': return 'warning';
      case 'ADVANCED': return 'danger';
      default: return 'secondary';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'harmony': return '🎵';
      case 'progression': return '🔄';
      case 'modulation': return '🔄';
      case 'mixture': return '🎨';
      case 'advanced': return '⭐';
      default: return '📚';
    }
  };

  const handleLessonSelect = (lesson: TheoryLesson) => {
    setSelectedLesson(lesson);
    setCurrentView('lesson');
    setCurrentExerciseIndex(0);
    setUserAnswers({});
    setShowResults(false);
  };

  const handleAnswerSubmit = (exerciseId: string, answer: string | string[]) => {
    setUserAnswers(prev => ({
      ...prev,
      [exerciseId]: answer
    }));
  };

  const handleExerciseSubmit = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    if (!selectedLesson) return 0;
    
    let correctAnswers = 0;
    let totalPoints = 0;
    
    selectedLesson.exercises.forEach(exercise => {
      const userAnswer = userAnswers[exercise.id];
      const correctAnswer = exercise.correctAnswer;
      
      if (userAnswer && correctAnswer) {
        if (Array.isArray(correctAnswer)) {
          if (Array.isArray(userAnswer) && userAnswer.length === correctAnswer.length) {
            const isCorrect = userAnswer.every((ans, index) => ans === correctAnswer[index]);
            if (isCorrect) {
              correctAnswers++;
              totalPoints += exercise.points;
            }
          }
        } else {
          if (userAnswer === correctAnswer) {
            correctAnswers++;
            totalPoints += exercise.points;
          }
        }
      }
    });
    
    return { correctAnswers, totalPoints, totalExercises: selectedLesson.exercises.length };
  };

  const getMasteryLevelColor = (level: string) => {
    switch (level) {
      case 'NOVICE': return 'secondary';
      case 'BEGINNER': return 'success';
      case 'INTERMEDIATE': return 'warning';
      case 'ADVANCED': return 'danger';
      case 'EXPERT': return 'primary';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <div style={{color: COLORS.text.primary}}>음악 이론 학습 시스템을 로딩하고 있습니다...</div>
      </div>
    );
  }

  if (currentView === 'dashboard') {
    return (
      <div className="music-theory-dashboard">
        <div className="text-center mb-5">
          <h2 style={{color: COLORS.text.primary}}>🎼 음악 이론 학습 시스템</h2>
          <p className="lead" style={{color: COLORS.text.secondary}}>
            When-in-Rome 기반의 체계적인 화성학 학습으로 음악적 이해를 높여보세요
          </p>
        </div>

        {/* 네비게이션 탭 */}
        <div className="mb-4">
          <div className="d-flex flex-wrap gap-2 justify-content-center">
            {[
              { key: 'dashboard', label: '대시보드', icon: '📊' },
              { key: 'lesson', label: '이론 레슨', icon: '📚' },
              { key: 'patterns', label: '진행 패턴', icon: '🔄' },
              { key: 'mixtures', label: '모달 믹스처', icon: '🎨' },
              { key: 'progress', label: '학습 진도', icon: '📈' }
            ].map(tab => (
              <Button
                key={tab.key}
                onClick={() => setCurrentView(tab.key as any)}
                className={`px-4 py-2 ${currentView === tab.key ? 'active' : ''}`}
                style={{
                  ...(currentView === tab.key ? BUTTON_STYLES.primary : BUTTON_STYLES.outline),
                  borderRadius: '25px',
                  fontSize: '1rem',
                  fontWeight: '500'
                }}
              >
                <span className="me-2">{tab.icon}</span>
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* 학습 진도 요약 */}
        {progress && (
          <Row className="g-4 mb-5">
            <Col md={6}>
              <Card style={CARD_STYLES.large}>
                <Card.Body>
                  <h6 className="card-title" style={{color: COLORS.text.primary}}>
                    <i className="bi bi-graph-up me-2" style={{color: COLORS.success.main}}></i>
                    현재 마스터리 레벨
                  </h6>
                  <div className="text-center">
                    <Badge 
                      bg={getMasteryLevelColor(progress.masteryLevel)}
                      className="fs-5 px-3 py-2 mb-3"
                    >
                      {progress.masteryLevel}
                    </Badge>
                    <div style={{color: COLORS.text.secondary}}>
                      완료한 레슨: {progress.completedLessons.length}개
                    </div>
                    <div style={{color: COLORS.text.secondary}}>
                      총 학습 시간: {Math.floor(progress.practiceTime / 60)}시간 {progress.practiceTime % 60}분
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card style={CARD_STYLES.large}>
                <Card.Body>
                  <h6 className="card-title" style={{color: COLORS.text.primary}}>
                    <i className="bi bi-book me-2" style={{color: COLORS.info.main}}></i>
                    다음 추천 레슨
                  </h6>
                  <div className="text-center">
                    {progress.currentLesson && (
                      <div>
                        <div style={{color: COLORS.text.primary, fontWeight: '600', marginBottom: '0.5rem'}}>
                          {lessons.find(l => l.id === progress.currentLesson)?.title}
                        </div>
                        <Button
                          onClick={() => handleLessonSelect(lessons.find(l => l.id === progress.currentLesson)!)}
                          style={{
                            ...BUTTON_STYLES.primary,
                            borderRadius: '20px'
                          }}
                        >
                          시작하기
                        </Button>
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* 커리큘럼 개요 */}
        <div className="mb-5">
          <h4 style={{color: COLORS.text.primary, marginBottom: '1.5rem'}}>📚 학습 커리큘럼</h4>
          <Row className="g-4">
            {lessons.map(lesson => (
              <Col md={6} lg={4} key={lesson.id}>
                <Card 
                  style={CARD_STYLES.large}
                  className="h-100 lesson-card"
                >
                  <Card.Body>
                    <div className="d-flex align-items-center mb-3">
                      <span className="fs-3 me-3">{getCategoryIcon(lesson.category)}</span>
                      <div>
                        <h6 className="mb-1" style={{color: COLORS.text.primary}}>{lesson.title}</h6>
                        <Badge bg={getDifficultyColor(lesson.difficulty)}>
                          {lesson.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <p style={{color: COLORS.text.secondary, fontSize: '0.9rem'}}>
                      {lesson.description}
                    </p>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <small style={{color: COLORS.text.tertiary}}>
                        ⏱️ {lesson.duration}분
                      </small>
                      <small style={{color: COLORS.text.tertiary}}>
                        📝 {lesson.exercises.length}개 연습문제
                      </small>
                    </div>
                    <div className="d-flex flex-wrap gap-1 mb-3">
                      {lesson.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} bg="secondary" style={{fontSize: '0.7rem'}}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      onClick={() => handleLessonSelect(lesson)}
                      style={{
                        ...BUTTON_STYLES.primary,
                        width: '100%',
                        borderRadius: '20px'
                      }}
                    >
                      <i className="bi bi-play-circle me-2"></i>
                      레슨 시작
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* 빠른 시작 가이드 */}
        <div className="text-center">
          <Card style={{
            background: 'rgba(139, 92, 246, 0.05)',
            border: '1px solid rgba(139, 92, 246, 0.1)',
            borderRadius: '20px'
          }}>
            <Card.Body className="p-4">
              <h5 style={{color: COLORS.text.primary, marginBottom: '1rem'}}>
                🚀 빠른 시작 가이드
              </h5>
              <p style={{color: COLORS.text.secondary, marginBottom: '1.5rem'}}>
                처음이신가요? 화성학 기초부터 차근차근 시작해보세요.
              </p>
              <Button
                onClick={() => handleLessonSelect(lessons[0])}
                style={{
                  ...BUTTON_STYLES.primary,
                  padding: '12px 30px',
                  borderRadius: '25px',
                  fontSize: '1.1rem'
                }}
              >
                <i className="bi bi-rocket me-2"></i>
                첫 번째 레슨 시작하기
              </Button>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }

  if (currentView === 'lesson' && selectedLesson) {
    const currentExercise = selectedLesson.exercises[currentExerciseIndex];
    const score = calculateScore();

    return (
      <div className="lesson-view">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Button
            onClick={() => setCurrentView('dashboard')}
            style={{
              ...BUTTON_STYLES.outline,
              borderRadius: '20px'
            }}
          >
            <i className="bi bi-arrow-left me-2"></i>
            대시보드로 돌아가기
          </Button>
          <div className="text-center">
            <h3 style={{color: COLORS.text.primary}}>{selectedLesson.title}</h3>
            <div className="d-flex align-items-center justify-content-center gap-3">
              <Badge bg={getDifficultyColor(selectedLesson.difficulty)}>
                {selectedLesson.difficulty}
              </Badge>
              <span style={{color: COLORS.text.secondary}}>
                ⏱️ {selectedLesson.duration}분
              </span>
            </div>
          </div>
          <div style={{width: '100px'}}></div>
        </div>

        {/* 진행률 표시 */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span style={{color: COLORS.text.secondary}}>진행률</span>
            <span style={{color: COLORS.text.primary}}>
              {currentExerciseIndex + 1} / {selectedLesson.content.length + selectedLesson.exercises.length}
            </span>
          </div>
          <ProgressBar 
            now={((currentExerciseIndex + 1) / (selectedLesson.content.length + selectedLesson.exercises.length)) * 100}
            style={{height: '8px'}}
          />
        </div>

        {/* 레슨 콘텐츠 */}
        {currentExerciseIndex < selectedLesson.content.length ? (
          <Card style={CARD_STYLES.large}>
            <Card.Body>
              <h5 style={{color: COLORS.text.primary, marginBottom: '1.5rem'}}>
                {selectedLesson.content[currentExerciseIndex].title}
              </h5>
              <div style={{color: COLORS.text.secondary, marginBottom: '2rem', lineHeight: '1.6'}}>
                {selectedLesson.content[currentExerciseIndex].content}
              </div>

              {selectedLesson.content[currentExerciseIndex].examples && (
                <div className="mb-3">
                  <h6 style={{color: COLORS.text.primary, marginBottom: '1rem'}}>📝 예시</h6>
                  <ul style={{color: COLORS.text.secondary}}>
                    {selectedLesson.content[currentExerciseIndex].examples!.map((example, index) => (
                      <li key={index} className="mb-2">{example}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedLesson.content[currentExerciseIndex].notes && (
                <div className="mb-3">
                  <h6 style={{color: COLORS.text.primary, marginBottom: '1rem'}}>💡 핵심 포인트</h6>
                  <ul style={{color: COLORS.text.secondary}}>
                    {selectedLesson.content[currentExerciseIndex].notes!.map((note, index) => (
                      <li key={index} className="mb-2">{note}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="text-center mt-4">
                <Button
                  onClick={() => setCurrentExerciseIndex(prev => prev + 1)}
                  style={{
                    ...BUTTON_STYLES.primary,
                    padding: '10px 25px',
                    borderRadius: '20px'
                  }}
                >
                  <i className="bi bi-arrow-right me-2"></i>
                  다음
                </Button>
              </div>
            </Card.Body>
          </Card>
        ) : (
          /* 연습문제 */
          <Card style={CARD_STYLES.large}>
            <Card.Body>
              <h5 style={{color: COLORS.text.primary, marginBottom: '1.5rem'}}>
                📝 연습문제 {currentExerciseIndex - selectedLesson.content.length + 1}
              </h5>
              <div style={{color: COLORS.text.secondary, marginBottom: '2rem'}}>
                {currentExercise.question}
              </div>

              {currentExercise.type === 'multiple_choice' && currentExercise.options && (
                <div className="mb-4">
                  {currentExercise.options.map((option, index) => (
                    <div key={index} className="mb-2">
                      <input
                        type="radio"
                        name={`exercise-${currentExercise.id}`}
                        id={`option-${index}`}
                        value={option}
                        onChange={(e) => handleAnswerSubmit(currentExercise.id, e.target.value)}
                        checked={userAnswers[currentExercise.id] === option}
                      />
                      <label 
                        htmlFor={`option-${index}`} 
                        className="ms-2"
                        style={{color: COLORS.text.primary, cursor: 'pointer'}}
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              )}

              {currentExercise.type === 'fill_blank' && (
                <div className="mb-4">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="답을 입력하세요"
                    value={userAnswers[currentExercise.id] || ''}
                    onChange={(e) => handleAnswerSubmit(currentExercise.id, e.target.value)}
                    style={{
                      background: 'rgba(139, 92, 246, 0.1)',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      color: COLORS.text.primary,
                      borderRadius: '8px'
                    }}
                  />
                </div>
              )}

              <div className="d-flex justify-content-between">
                {currentExerciseIndex > selectedLesson.content.length && (
                  <Button
                    onClick={() => setCurrentExerciseIndex(prev => prev - 1)}
                    style={{
                      ...BUTTON_STYLES.outline,
                      borderRadius: '20px'
                    }}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    이전
                  </Button>
                )}

                {currentExerciseIndex < selectedLesson.content.length + selectedLesson.exercises.length - 1 ? (
                  <Button
                    onClick={() => setCurrentExerciseIndex(prev => prev + 1)}
                    style={{
                      ...BUTTON_STYLES.primary,
                      borderRadius: '20px'
                    }}
                  >
                    <i className="bi bi-arrow-right me-2"></i>
                    다음 문제
                  </Button>
                ) : (
                  <Button
                    onClick={handleExerciseSubmit}
                    style={{
                      ...BUTTON_STYLES.primary,
                      borderRadius: '20px'
                    }}
                  >
                    <i className="bi bi-check-circle me-2"></i>
                    제출하기
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        )}

        {/* 결과 표시 */}
        {showResults && (
          <Card style={CARD_STYLES.large} className="mt-4">
            <Card.Body>
              <h5 style={{color: COLORS.text.primary, marginBottom: '1.5rem'}}>
                🎯 퀴즈 결과
              </h5>
              <div className="text-center mb-4">
                <div className="mb-3">
                  <span style={{color: COLORS.text.primary, fontSize: '2rem', fontWeight: 'bold'}}>
                    {score.correctAnswers}/{score.totalExercises}
                  </span>
                </div>
                <div style={{color: COLORS.text.secondary}}>
                  총점: {score.totalPoints}점
                </div>
                <div className="mt-3">
                  <ProgressBar 
                    now={(score.correctAnswers / score.totalExercises) * 100}
                    style={{height: '10px'}}
                    variant={score.correctAnswers / score.totalExercises >= 0.8 ? 'success' : 
                           score.correctAnswers / score.totalExercises >= 0.6 ? 'warning' : 'danger'}
                  />
                </div>
              </div>

              <div className="text-center">
                <Button
                  onClick={() => setCurrentView('dashboard')}
                  style={{
                    ...BUTTON_STYLES.primary,
                    padding: '10px 25px',
                    borderRadius: '20px',
                    marginRight: '1rem'
                  }}
                >
                  <i className="bi bi-home me-2"></i>
                  대시보드로
                </Button>
                <Button
                  onClick={() => {
                    setCurrentExerciseIndex(0);
                    setUserAnswers({});
                    setShowResults(false);
                  }}
                  style={{
                    ...BUTTON_STYLES.outline,
                    padding: '10px 25px',
                    borderRadius: '20px'
                  }}
                >
                  <i className="bi bi-arrow-repeat me-2"></i>
                  다시 풀기
                </Button>
              </div>
            </Card.Body>
          </Card>
        )}
      </div>
    );
  }

  if (currentView === 'patterns') {
    return (
      <div className="patterns-view">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Button
            onClick={() => setCurrentView('dashboard')}
            style={{
              ...BUTTON_STYLES.outline,
              borderRadius: '20px'
            }}
          >
            <i className="bi bi-arrow-left me-2"></i>
            대시보드로 돌아가기
          </Button>
          <h3 style={{color: COLORS.text.primary}}>🔄 화성 진행 패턴</h3>
          <div style={{width: '100px'}}></div>
        </div>

        <Row className="g-4">
          {patterns.map(pattern => (
            <Col md={6} key={pattern.id}>
              <Card style={CARD_STYLES.large}>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 style={{color: COLORS.text.primary}}>{pattern.name}</h5>
                    <Badge bg={getDifficultyColor(pattern.difficulty)}>
                      {pattern.difficulty}
                    </Badge>
                  </div>
                  
                  <div className="mb-3">
                    <div style={{color: COLORS.text.secondary, fontSize: '0.9rem', marginBottom: '0.5rem'}}>
                      패턴:
                    </div>
                    <div style={{
                      background: 'rgba(139, 92, 246, 0.1)',
                      borderRadius: '8px',
                      padding: '1rem',
                      textAlign: 'center',
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      color: COLORS.primary.main
                    }}>
                      {pattern.pattern.join(' → ')}
                    </div>
                  </div>

                  <p style={{color: COLORS.text.secondary, marginBottom: '1rem'}}>
                    {pattern.description}
                  </p>

                  <div className="mb-3">
                    <h6 style={{color: COLORS.text.primary, fontSize: '0.9rem', marginBottom: '0.5rem'}}>
                      📝 분석:
                    </h6>
                    <p style={{color: COLORS.text.secondary, fontSize: '0.9rem'}}>
                      {pattern.analysis}
                    </p>
                  </div>

                  <div className="mb-3">
                    <h6 style={{color: COLORS.text.primary, fontSize: '0.9rem', marginBottom: '0.5rem'}}>
                      🎤 예시 곡:
                    </h6>
                    <div className="d-flex flex-wrap gap-1">
                      {pattern.examples.map((example, index) => (
                        <Badge key={index} bg="secondary" style={{fontSize: '0.7rem'}}>
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <h6 style={{color: COLORS.text.primary, fontSize: '0.9rem', marginBottom: '0.5rem'}}>
                      💡 연습 팁:
                    </h6>
                    <ul style={{color: COLORS.text.secondary, fontSize: '0.9rem', margin: 0}}>
                      {pattern.practiceTips.map((tip, index) => (
                        <li key={index} className="mb-1">{tip}</li>
                      ))}
                    </ul>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  if (currentView === 'mixtures') {
    return (
      <div className="mixtures-view">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Button
            onClick={() => setCurrentView('dashboard')}
            style={{
              ...BUTTON_STYLES.outline,
              borderRadius: '20px'
            }}
          >
            <i className="bi bi-arrow-left me-2"></i>
            대시보드로 돌아가기
          </Button>
          <h3 style={{color: COLORS.text.primary}}>🎨 모달 믹스처</h3>
          <div style={{width: '100px'}}></div>
        </div>

        <Row className="g-4">
          {mixtures.map(mixture => (
            <Col md={6} key={mixture.id}>
              <Card style={CARD_STYLES.large}>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 style={{color: COLORS.text.primary}}>{mixture.name}</h5>
                    <Badge bg={getDifficultyColor(mixture.difficulty)}>
                      {mixture.difficulty}
                    </Badge>
                  </div>

                  <p style={{color: COLORS.text.secondary, marginBottom: '1rem'}}>
                    {mixture.description}
                  </p>

                  <div className="mb-3">
                    <h6 style={{color: COLORS.text.primary, fontSize: '0.9rem', marginBottom: '0.5rem'}}>
                      🎯 기법:
                    </h6>
                    <p style={{color: COLORS.text.secondary, fontSize: '0.9rem'}}>
                      {mixture.technique}
                    </p>
                  </div>

                  <div className="mb-3">
                    <h6 style={{color: COLORS.text.primary, fontSize: '0.9rem', marginBottom: '0.5rem'}}>
                      🎵 예시:
                    </h6>
                    <div className="d-flex flex-wrap gap-1">
                      {mixture.examples.map((example, index) => (
                        <Badge key={index} bg="info" style={{fontSize: '0.7rem'}}>
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <h6 style={{color: COLORS.text.primary, fontSize: '0.9rem', marginBottom: '0.5rem'}}>
                      🎭 활용:
                    </h6>
                    <div className="d-flex flex-wrap gap-1">
                      {mixture.usage.map((use, index) => (
                        <Badge key={index} bg="warning" style={{fontSize: '0.7rem'}}>
                          {use}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <h6 style={{color: COLORS.text.primary, fontSize: '0.9rem', marginBottom: '0.5rem'}}>
                      🏋️ 연습 방법:
                    </h6>
                    <ul style={{color: COLORS.text.secondary, fontSize: '0.9rem', margin: 0}}>
                      {mixture.practiceExercises.map((exercise, index) => (
                        <li key={index} className="mb-1">{exercise}</li>
                      ))}
                    </ul>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  if (currentView === 'progress') {
    return (
      <div className="progress-view">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Button
            onClick={() => setCurrentView('dashboard')}
            style={{
              ...BUTTON_STYLES.outline,
              borderRadius: '20px'
            }}
          >
            <i className="bi bi-arrow-left me-2"></i>
            대시보드로 돌아가기
          </Button>
          <h3 style={{color: COLORS.text.primary}}>📈 학습 진도</h3>
          <div style={{width: '100px'}}></div>
        </div>

        {progress ? (
          <Row className="g-4">
            <Col md={6}>
              <Card style={CARD_STYLES.large}>
                <Card.Body>
                  <h6 className="card-title" style={{color: COLORS.text.primary}}>
                    <i className="bi bi-person-check me-2" style={{color: COLORS.primary.main}}></i>
                    현재 상태
                  </h6>
                  <div className="text-center">
                    <div className="mb-3">
                      <Badge 
                        bg={getMasteryLevelColor(progress.masteryLevel)}
                        className="fs-4 px-4 py-2"
                      >
                        {progress.masteryLevel}
                      </Badge>
                    </div>
                    <div style={{color: COLORS.text.secondary}}>
                      마지막 학습: {progress.lastStudied.toLocaleDateString()}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card style={CARD_STYLES.large}>
                <Card.Body>
                  <h6 className="card-title" style={{color: COLORS.text.primary}}>
                    <i className="bi bi-clock me-2" style={{color: COLORS.success.main}}></i>
                    학습 시간
                  </h6>
                  <div className="text-center">
                    <div style={{color: COLORS.text.primary, fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem'}}>
                      {Math.floor(progress.practiceTime / 60)}h {progress.practiceTime % 60}m
                    </div>
                    <div style={{color: COLORS.text.secondary}}>
                      총 누적 학습 시간
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={12}>
              <Card style={CARD_STYLES.large}>
                <Card.Body>
                  <h6 className="card-title" style={{color: COLORS.text.primary}}>
                    <i className="bi bi-trophy me-2" style={{color: COLORS.warning.main}}></i>
                    퀴즈 성적
                  </h6>
                  <div className="row g-3">
                    {Object.entries(progress.quizScores).map(([lessonId, score]) => {
                      const lesson = lessons.find(l => l.id === lessonId);
                      return (
                        <Col md={6} key={lessonId}>
                          <div className="d-flex justify-content-between align-items-center p-3" style={{
                            background: 'rgba(139, 92, 246, 0.05)',
                            borderRadius: '8px',
                            border: '1px solid rgba(139, 92, 246, 0.1)'
                          }}>
                            <div>
                              <div style={{color: COLORS.text.primary, fontWeight: '600'}}>
                                {lesson?.title || lessonId}
                              </div>
                              <div style={{color: COLORS.text.secondary, fontSize: '0.9rem'}}>
                                점수: {score}점
                              </div>
                            </div>
                            <div>
                              <ProgressBar 
                                now={score}
                                style={{width: '60px', height: '8px'}}
                                variant={score >= 80 ? 'success' : score >= 60 ? 'warning' : 'danger'}
                              />
                            </div>
                          </div>
                        </Col>
                      );
                    })}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ) : (
          <div className="text-center py-5">
            <div style={{color: COLORS.text.secondary, fontSize: '1.2rem'}}>
              학습 진도를 확인하려면 로그인이 필요합니다.
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
