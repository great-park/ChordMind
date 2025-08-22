'use client'

import React, { useState, useEffect } from 'react';
import { Card, Button, ProgressBar, Badge, Row, Col, ListGroup } from 'react-bootstrap';
import { musicTheoryService, TheoryLesson, LearningProgress, ProgressionPattern, ModalMixture } from '../services/musicTheoryService';
import { GRADIENTS, COLORS, CARD_STYLES, BADGE_STYLES, BUTTON_STYLES } from '../constants/styles';

export default function TheoryLearningDashboard() {
  const [currentView, setCurrentView] = useState<'overview' | 'lessons' | 'progressions' | 'mixtures' | 'practice'>('overview');
  const [lessons, setLessons] = useState<TheoryLesson[]>([]);
  const [progressions, setProgressions] = useState<ProgressionPattern[]>([]);
  const [mixtures, setMixtures] = useState<ModalMixture[]>([]);
  const [learningProgress, setLearningProgress] = useState<LearningProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<TheoryLesson | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [lessonsData, progressionsData, mixturesData, progressData] = await Promise.all([
        musicTheoryService.getTheoryCurriculum(),
        musicTheoryService.getProgressionPatterns(),
        musicTheoryService.getModalMixtures(),
        musicTheoryService.getLearningProgress('user123') // 실제로는 인증된 사용자 ID 사용
      ]);

      setLessons(lessonsData);
      setProgressions(progressionsData);
      setMixtures(mixturesData);
      setLearningProgress(progressData);
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

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <div style={{color: COLORS.text.primary}}>음악 이론 학습 시스템을 불러오는 중...</div>
      </div>
    );
  }

  if (currentView === 'overview') {
    return (
      <div className="theory-dashboard">
        <div className="text-center mb-4">
          <h3 style={{color: COLORS.text.primary}}>📚 음악 이론 학습 시스템</h3>
          <p style={{color: COLORS.text.secondary}}>
            When-in-Rome 기반의 체계적인 화성학 학습으로 음악적 이해를 높여보세요
          </p>
        </div>

        {/* 학습 진도 요약 */}
        {learningProgress && (
          <Card style={CARD_STYLES.large} className="mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 style={{color: COLORS.text.primary}}>🎯 학습 진도</h5>
                <Badge style={{
                  ...BADGE_STYLES[learningProgress.masteryLevel.toLowerCase() as keyof typeof BADGE_STYLES],
                  fontSize: '1rem'
                }}>
                  {learningProgress.masteryLevel}
                </Badge>
              </div>
              
              <Row className="g-3">
                <Col md={3}>
                  <div className="text-center">
                    <div className="fs-4 fw-bold" style={{color: COLORS.primary.main}}>
                      {learningProgress.completedLessons.length}
                    </div>
                    <div style={{color: COLORS.text.secondary}}>완료된 레슨</div>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <div className="fs-4 fw-bold" style={{color: COLORS.success.main}}>
                      {Math.round(learningProgress.quizScores[Object.keys(learningProgress.quizScores)[0]] || 0)}%
                    </div>
                    <div style={{color: COLORS.text.secondary}}>평균 점수</div>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <div className="fs-4 fw-bold" style={{color: COLORS.warning.main}}>
                      {Math.floor(learningProgress.practiceTime / 60)}
                    </div>
                    <div style={{color: COLORS.text.secondary}}>연습 시간(분)</div>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <div className="fs-4 fw-bold" style={{color: COLORS.info.main}}>
                      {lessons.length - learningProgress.completedLessons.length}
                    </div>
                    <div style={{color: COLORS.text.secondary}}>남은 레슨</div>
                  </div>
                </Col>
              </Row>

              <div className="mt-3">
                <div className="d-flex justify-content-between mb-2">
                  <span style={{color: COLORS.text.secondary}}>전체 진행률</span>
                  <span style={{color: COLORS.text.primary}}>
                    {Math.round((learningProgress.completedLessons.length / lessons.length) * 100)}%
                  </span>
                </div>
                <ProgressBar 
                  now={(learningProgress.completedLessons.length / lessons.length) * 100}
                  style={{height: '10px', borderRadius: '5px'}}
                />
              </div>
            </Card.Body>
          </Card>
        )}

        {/* 네비게이션 카드 */}
        <Row className="g-4 mb-4">
          <Col md={4}>
            <Card 
              style={CARD_STYLES.large} 
              className="h-100 cursor-pointer"
              onClick={() => setCurrentView('lessons')}
            >
              <Card.Body className="text-center p-4">
                <div className="mb-3" style={{
                  width: '80px',
                  height: '80px',
                  background: GRADIENTS.primary,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto'
                }}>
                  <span className="fs-1">📚</span>
                </div>
                <h5 style={{color: COLORS.text.primary}}>체계적 커리큘럼</h5>
                <p style={{color: COLORS.text.secondary}}>
                  초급부터 고급까지 단계별로 구성된 체계적인 학습 경로
                </p>
                <Button 
                  style={BUTTON_STYLES.primary}
                  size="sm"
                >
                  학습 시작하기
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card 
              style={CARD_STYLES.large} 
              className="h-100 cursor-pointer"
              onClick={() => setCurrentView('progressions')}
            >
              <Card.Body className="text-center p-4">
                <div className="mb-3" style={{
                  width: '80px',
                  height: '80px',
                  background: GRADIENTS.success,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto'
                }}>
                  <span className="fs-1">🔄</span>
                </div>
                <h5 style={{color: COLORS.text.primary}}>진행 패턴 연습</h5>
                <p style={{color: COLORS.text.secondary}}>
                  실제 곡 예시와 함께하는 화성 진행 패턴 학습
                </p>
                <Button 
                  style={BUTTON_STYLES.success}
                  size="sm"
                >
                  패턴 학습하기
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card 
              style={CARD_STYLES.large} 
              className="h-100 cursor-pointer"
              onClick={() => setCurrentView('mixtures')}
            >
              <Card.Body className="text-center p-4">
                <div className="mb-3" style={{
                  width: '80px',
                  height: '80px',
                  background: GRADIENTS.warning,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto'
                }}>
                  <span className="fs-1">🎨</span>
                </div>
                <h5 style={{color: COLORS.text.primary}}>모달 믹스처 가이드</h5>
                <p style={{color: COLORS.text.secondary}}>
                  고급 화성 기법을 단계별로 학습하는 전문 가이드
                </p>
                <Button 
                  style={BUTTON_STYLES.warning}
                  size="sm"
                >
                  가이드 보기
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* 추천 레슨 */}
        <Card style={CARD_STYLES.large}>
          <Card.Body>
            <h5 style={{color: COLORS.text.primary}} className="mb-3">
              <i className="bi bi-lightbulb me-2" style={{color: COLORS.warning.main}}></i>
              추천 레슨
            </h5>
            <Row className="g-3">
              {lessons.slice(0, 3).map((lesson) => (
                <Col md={4} key={lesson.id}>
                  <Card style={{
                    background: 'rgba(139, 92, 246, 0.05)',
                    border: '1px solid rgba(139, 92, 246, 0.1)',
                    borderRadius: '12px'
                  }}>
                    <Card.Body className="p-3">
                      <div className="d-flex align-items-center mb-2">
                        <span className="me-2">{getCategoryIcon(lesson.category)}</span>
                        <Badge 
                          bg={getDifficultyColor(lesson.difficulty)}
                          style={{fontSize: '0.7rem'}}
                        >
                          {lesson.difficulty}
                        </Badge>
                      </div>
                      <h6 style={{color: COLORS.text.primary}} className="mb-2">
                        {lesson.title}
                      </h6>
                      <p style={{color: COLORS.text.secondary}} className="small mb-2">
                        {lesson.description}
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <span style={{color: COLORS.text.secondary}} className="small">
                          ⏱️ {lesson.duration}분
                        </span>
                        <Button 
                          size="sm"
                          style={BUTTON_STYLES.outline}
                          onClick={() => {
                            setSelectedLesson(lesson);
                            setCurrentView('lessons');
                          }}
                        >
                          시작하기
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      </div>
    );
  }

  if (currentView === 'lessons') {
    return (
      <div className="lessons-view">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 style={{color: COLORS.text.primary}}>📚 체계적 커리큘럼</h3>
            <p style={{color: COLORS.text.secondary}} className="mb-0">
              단계별로 구성된 화성학 학습 경로
            </p>
          </div>
          <Button 
            style={BUTTON_STYLES.outline}
            onClick={() => setCurrentView('overview')}
          >
            <i className="bi bi-arrow-left me-2"></i>
            대시보드로
          </Button>
        </div>

        {/* 난이도별 탭 */}
        <div className="mb-4">
          <div className="d-flex flex-wrap gap-2">
            {['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map((difficulty) => (
              <Button
                key={difficulty}
                style={{
                  ...(selectedLesson?.difficulty === difficulty ? BUTTON_STYLES.primary : BUTTON_STYLES.outline),
                  borderRadius: '20px'
                }}
                onClick={() => setSelectedLesson(lessons.find(l => l.difficulty === difficulty) || null)}
              >
                {difficulty}
              </Button>
            ))}
          </div>
        </div>

        {/* 레슨 목록 */}
        <Row className="g-4">
          {lessons.map((lesson) => (
            <Col md={6} lg={4} key={lesson.id}>
              <Card 
                style={{
                  ...CARD_STYLES.large,
                  cursor: 'pointer',
                  border: selectedLesson?.id === lesson.id ? '2px solid' + COLORS.primary.main : undefined
                }}
                onClick={() => setSelectedLesson(lesson)}
                className="h-100"
              >
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center mb-3">
                    <span className="me-2 fs-3">{getCategoryIcon(lesson.category)}</span>
                    <Badge 
                      bg={getDifficultyColor(lesson.difficulty)}
                      style={{fontSize: '0.8rem'}}
                    >
                      {lesson.difficulty}
                    </Badge>
                  </div>
                  
                  <h5 style={{color: COLORS.text.primary}} className="mb-3">
                    {lesson.title}
                  </h5>
                  
                  <p style={{color: COLORS.text.secondary}} className="mb-3">
                    {lesson.description}
                  </p>

                  <div className="mb-3">
                    <div className="d-flex flex-wrap gap-1 mb-2">
                      {lesson.tags.slice(0, 3).map((tag, index) => (
                        <Badge 
                          key={index}
                          style={{
                            background: 'rgba(139, 92, 246, 0.1)',
                            color: COLORS.primary.main,
                            fontSize: '0.7rem'
                          }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <span style={{color: COLORS.text.secondary}} className="small">
                      ⏱️ {lesson.duration}분
                    </span>
                    <Button 
                      size="sm"
                      style={BUTTON_STYLES.primary}
                      onClick={(e) => {
                        e.stopPropagation();
                        // 레슨 상세 보기 또는 학습 시작
                      }}
                    >
                      학습하기
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  if (currentView === 'progressions') {
    return (
      <div className="progressions-view">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 style={{color: COLORS.text.primary}}>🔄 진행 패턴 연습</h3>
            <p style={{color: COLORS.text.secondary}} className="mb-0">
              실제 곡 예시와 함께하는 화성 진행 패턴 학습
            </p>
          </div>
          <Button 
            style={BUTTON_STYLES.outline}
            onClick={() => setCurrentView('overview')}
          >
            <i className="bi bi-arrow-left me-2"></i>
            대시보드로
          </Button>
        </div>

        <Row className="g-4">
          {progressions.map((progression) => (
            <Col md={6} key={progression.id}>
              <Card style={CARD_STYLES.large}>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 style={{color: COLORS.text.primary}}>{progression.name}</h5>
                    <Badge 
                      bg={getDifficultyColor(progression.difficulty)}
                      style={{fontSize: '0.8rem'}}
                    >
                      {progression.difficulty}
                    </Badge>
                  </div>

                  <div className="progression-pattern mb-3" style={{
                    background: 'rgba(139, 92, 246, 0.1)',
                    borderRadius: '12px',
                    padding: '1rem',
                    textAlign: 'center',
                    border: '1px solid rgba(139, 92, 246, 0.2)'
                  }}>
                    <div style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: COLORS.primary.main,
                      marginBottom: '0.5rem'
                    }}>
                      {progression.pattern.join(' → ')}
                    </div>
                    <div style={{color: COLORS.text.secondary}}>
                      {progression.romanNumerals.join(' → ')}
                    </div>
                  </div>

                  <p style={{color: COLORS.text.secondary}} className="mb-3">
                    {progression.description}
                  </p>

                  <div className="mb-3">
                    <h6 style={{color: COLORS.text.primary}} className="mb-2">🎤 사용 예시</h6>
                    <div className="d-flex flex-wrap gap-1">
                      {progression.examples.map((example, index) => (
                        <Badge 
                          key={index}
                          style={{
                            background: 'rgba(34, 197, 94, 0.1)',
                            color: COLORS.success.main,
                            fontSize: '0.7rem'
                          }}
                        >
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <h6 style={{color: COLORS.text.primary}} className="mb-2">💡 연습 팁</h6>
                    <ul style={{color: COLORS.text.secondary}} className="small mb-0">
                      {progression.practiceTips.slice(0, 2).map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </div>

                  <Button 
                    style={BUTTON_STYLES.primary}
                    size="sm"
                    className="w-100"
                  >
                    패턴 연습하기
                  </Button>
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
          <div>
            <h3 style={{color: COLORS.text.primary}}>🎨 모달 믹스처 가이드</h3>
            <p style={{color: COLORS.text.secondary}} className="mb-0">
              고급 화성 기법을 단계별로 학습하는 전문 가이드
            </p>
          </div>
          <Button 
            style={BUTTON_STYLES.outline}
            onClick={() => setCurrentView('overview')}
          >
            <i className="bi bi-arrow-left me-2"></i>
            대시보드로
          </Button>
        </div>

        <Row className="g-4">
          {mixtures.map((mixture) => (
            <Col md={6} key={mixture.id}>
              <Card style={CARD_STYLES.large}>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 style={{color: COLORS.text.primary}}>{mixture.name}</h5>
                    <Badge 
                      bg={getDifficultyColor(mixture.difficulty)}
                      style={{fontSize: '0.8rem'}}
                    >
                      {mixture.difficulty}
                    </Badge>
                  </div>

                  <p style={{color: COLORS.text.secondary}} className="mb-3">
                    {mixture.description}
                  </p>

                  <div className="mb-3">
                    <h6 style={{color: COLORS.text.primary}} className="mb-2">🎯 기법</h6>
                    <div style={{
                      background: 'rgba(139, 92, 246, 0.1)',
                      borderRadius: '8px',
                      padding: '0.75rem',
                      border: '1px solid rgba(139, 92, 246, 0.2)'
                    }}>
                      <span style={{color: COLORS.text.primary}}>{mixture.technique}</span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <h6 style={{color: COLORS.text.primary}} className="mb-2">🎵 예시</h6>
                    <div className="d-flex flex-wrap gap-1">
                      {mixture.examples.map((example, index) => (
                        <Badge 
                          key={index}
                          style={{
                            background: 'rgba(34, 197, 94, 0.1)',
                            color: COLORS.success.main,
                            fontSize: '0.7rem'
                          }}
                        >
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <h6 style={{color: COLORS.text.primary}} className="mb-2">📚 일반적 용도</h6>
                    <div className="d-flex flex-wrap gap-1">
                      {mixture.usage.map((use, index) => (
                        <Badge 
                          key={index}
                          style={{
                            background: 'rgba(59, 130, 246, 0.1)',
                            color: COLORS.info.main,
                            fontSize: '0.7rem'
                          }}
                        >
                          {use}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button 
                    style={BUTTON_STYLES.warning}
                    size="sm"
                    className="w-100"
                  >
                    가이드 보기
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  return null;
}
