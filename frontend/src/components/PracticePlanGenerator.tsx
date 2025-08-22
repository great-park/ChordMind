'use client'

import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Row, Col, ProgressBar, Badge, Alert } from 'react-bootstrap';
import { musicTheoryService, TheoryLesson, LearningProgress } from '../services/musicTheoryService';
import { GRADIENTS, COLORS, CARD_STYLES, BADGE_STYLES, BUTTON_STYLES } from '../constants/styles';

interface PracticePlan {
  id: string;
  userId: string;
  weeklyGoals: string[];
  dailyPractice: DailyPractice[];
  focusAreas: string[];
  estimatedTime: number; // 분 단위
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  startDate: Date;
  endDate: Date;
}

interface DailyPractice {
  day: string;
  focus: string;
  exercises: string[];
  duration: number; // 분 단위
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
}

export default function PracticePlanGenerator() {
  const [currentView, setCurrentView] = useState<'assessment' | 'plan' | 'progress'>('assessment');
  const [userProfile, setUserProfile] = useState({
    skillLevel: 'BEGINNER' as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
    availableTime: 30,
    focusAreas: [] as string[],
    goals: [] as string[],
    preferredStyle: 'classical' as 'classical' | 'jazz' | 'pop' | 'folk' | 'electronic'
  });
  const [practicePlan, setPracticePlan] = useState<PracticePlan | null>(null);
  const [learningProgress, setLearningProgress] = useState<LearningProgress | null>(null);
  const [loading, setLoading] = useState(false);

  const skillLevels = [
    { value: 'BEGINNER', label: '초급', description: '기본 화성학 개념 학습' },
    { value: 'INTERMEDIATE', label: '중급', description: '진행 패턴과 7화음 활용' },
    { value: 'ADVANCED', label: '고급', description: '모달 믹스처와 고급 기법' }
  ];

  const focusAreas = [
    { value: 'harmony', label: '화성학', description: '3화음, 7화음, 확장 화성' },
    { value: 'progression', label: '화성 진행', description: '기본 패턴과 고급 진행' },
    { value: 'modulation', label: '조성 전환', description: '다양한 전환 기법' },
    { value: 'mixture', label: '모달 믹스처', description: '장조와 단조의 혼합' },
    { value: 'improvisation', label: '즉흥 연주', description: '자유로운 화성 활용' }
  ];

  const goals = [
    { value: 'basic-understanding', label: '기본 이해', description: '화성학의 기본 개념 파악' },
    { value: 'pattern-mastery', label: '패턴 숙달', description: '자주 사용되는 진행 패턴 연습' },
    { value: 'creative-application', label: '창의적 활용', description: '이론을 작곡에 적용' },
    { value: 'performance-improvement', label: '연주 실력 향상', description: '실제 연주에서의 활용' },
    { value: 'advanced-techniques', label: '고급 기법', description: '복잡한 화성 기법 학습' }
  ];

  const styles = [
    { value: 'classical', label: '클래식', description: '전통적인 화성학' },
    { value: 'jazz', label: '재즈', description: '7화음과 즉흥적 요소' },
    { value: 'pop', label: '팝', description: '현대적인 진행 패턴' },
    { value: 'folk', label: '민속', description: '전통적인 민속 음악' },
    { value: 'electronic', label: '일렉트로닉', description: '현대적인 디지털 음악' }
  ];

  useEffect(() => {
    loadUserProgress();
  }, []);

  const loadUserProgress = async () => {
    try {
      const progress = await musicTheoryService.getLearningProgress('user123');
      setLearningProgress(progress);
    } catch (error) {
      console.error('사용자 진도 로딩 오류:', error);
    }
  };

  const handleProfileChange = (field: string, value: any) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFocusAreaToggle = (area: string) => {
    setUserProfile(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(area)
        ? prev.focusAreas.filter(a => a !== area)
        : [...prev.focusAreas, area]
    }));
  };

  const handleGoalToggle = (goal: string) => {
    setUserProfile(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const generatePracticePlan = async () => {
    try {
      setLoading(true);
      
      // AI 기반 개인 맞춤 연습 계획 생성
      const plan: PracticePlan = {
        id: 'plan-' + Date.now(),
        userId: 'user123',
        weeklyGoals: generateWeeklyGoals(),
        dailyPractice: generateDailyPractice(),
        focusAreas: userProfile.focusAreas,
        estimatedTime: userProfile.availableTime * 7,
        difficulty: userProfile.skillLevel,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1주일 후
      };

      setPracticePlan(plan);
      setCurrentView('plan');
    } catch (error) {
      console.error('연습 계획 생성 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateWeeklyGoals = (): string[] => {
    const goals: string[] = [];
    
    if (userProfile.skillLevel === 'BEGINNER') {
      goals.push('기본 3화음의 구성과 음향 이해하기');
      goals.push('I-V-I 진행 패턴 연습하기');
      goals.push('간단한 멜로디에 화성 붙이기');
    } else if (userProfile.skillLevel === 'INTERMEDIATE') {
      goals.push('7화음의 구성과 활용법 학습하기');
      goals.push('ii-V-I 진행 패턴 연습하기');
      goals.push('기본적인 조성 전환 시도하기');
    } else {
      goals.push('모달 믹스처 기법 연습하기');
      goals.push('복잡한 화성 진행 패턴 학습하기');
      goals.push('고급 조성 전환 기법 활용하기');
    }

    return goals;
  };

  const generateDailyPractice = (): DailyPractice[] => {
    const days = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];
    const practices: DailyPractice[] = [];

    days.forEach((day, index) => {
      let focus = '';
      let exercises: string[] = [];
      let duration = userProfile.availableTime;

      if (index === 0 || index === 3) { // 월, 목
        focus = '화성학 이론 학습';
        exercises = ['이론 개념 정리', '예시 분석', '퀴즈 풀기'];
      } else if (index === 1 || index === 4) { // 화, 금
        focus = '진행 패턴 연습';
        exercises = ['기본 패턴 반복', '템포 변화 연습', '다양한 리듬으로 연습'];
      } else if (index === 2 || index === 5) { // 수, 토
        focus = '실전 적용 연습';
        exercises = ['곡에 화성 붙이기', '멜로디 생성', '창작 연습'];
      } else { // 일요일
        focus = '복습 및 정리';
        exercises = ['주간 내용 복습', '약점 보완', '다음 주 계획 수립'];
        duration = Math.floor(duration * 0.7); // 일요일은 조금 짧게
      }

      practices.push({
        day,
        focus,
        exercises,
        duration,
        difficulty: userProfile.skillLevel
      });
    });

    return practices;
  };

  if (currentView === 'assessment') {
    return (
      <div className="practice-plan-generator">
        <div className="text-center mb-4">
          <h3 style={{color: COLORS.text.primary}}>🎯 개인 맞춤 연습 계획</h3>
          <p style={{color: COLORS.text.secondary}}>
            AI가 분석하는 당신만의 연습 계획으로 효율적인 실력 향상을 경험하세요
          </p>
        </div>

        {/* 현재 학습 진도 표시 */}
        {learningProgress && (
          <Card style={CARD_STYLES.large} className="mb-4">
            <Card.Body>
              <h5 style={{color: COLORS.text.primary}} className="mb-3">
                <i className="bi bi-graph-up me-2" style={{color: COLORS.success.main}}></i>
                현재 학습 진도
              </h5>
              <Row className="g-3">
                <Col md={3}>
                  <div className="text-center">
                    <div className="fs-4 fw-bold" style={{color: COLORS.primary.main}}>
                      {learningProgress.masteryLevel}
                    </div>
                    <div style={{color: COLORS.text.secondary}}>현재 레벨</div>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <div className="fs-4 fw-bold" style={{color: COLORS.success.main}}>
                      {learningProgress.completedLessons.length}
                    </div>
                    <div style={{color: COLORS.text.secondary}}>완료 레슨</div>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <div className="fs-4 fw-bold" style={{color: COLORS.warning.main}}>
                      {Math.floor(learningProgress.practiceTime / 60)}
                    </div>
                    <div style={{color: COLORS.text.secondary}}>총 연습 시간(분)</div>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <div className="fs-4 fw-bold" style={{color: COLORS.info.main}}>
                      {Math.round(Object.values(learningProgress.quizScores).reduce((a, b) => a + b, 0) / Object.keys(learningProgress.quizScores).length || 0)}%
                    </div>
                    <div style={{color: COLORS.text.secondary}}>평균 점수</div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        )}

        {/* 개인 프로필 설정 */}
        <Card style={CARD_STYLES.large}>
          <Card.Body>
            <h5 style={{color: COLORS.text.primary}} className="mb-4">
              <i className="bi bi-person-gear me-2" style={{color: COLORS.primary.main}}></i>
              개인 프로필 설정
            </h5>

            <Form>
              <Row className="g-4">
                {/* 스킬 레벨 */}
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={{color: COLORS.text.primary, fontWeight: '600'}}>
                      🎯 현재 스킬 레벨
                    </Form.Label>
                    <div className="d-flex flex-column gap-2">
                      {skillLevels.map((level) => (
                        <Form.Check
                          key={level.value}
                          type="radio"
                          id={`level-${level.value}`}
                          name="skillLevel"
                          label={
                            <div>
                              <div style={{color: COLORS.text.primary, fontWeight: '500'}}>
                                {level.label}
                              </div>
                              <div style={{color: COLORS.text.secondary, fontSize: '0.9rem'}}>
                                {level.description}
                              </div>
                            </div>
                          }
                          checked={userProfile.skillLevel === level.value}
                          onChange={() => handleProfileChange('skillLevel', level.value)}
                          style={{color: COLORS.text.primary}}
                        />
                      ))}
                    </div>
                  </Form.Group>
                </Col>

                {/* 사용 가능한 시간 */}
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={{color: COLORS.text.primary, fontWeight: '600'}}>
                      ⏰ 일일 연습 가능 시간
                    </Form.Label>
                    <Form.Select
                      value={userProfile.availableTime}
                      onChange={(e) => handleProfileChange('availableTime', parseInt(e.target.value))}
                      style={{
                        background: 'rgba(139, 92, 246, 0.1)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        color: COLORS.text.primary,
                        borderRadius: '8px'
                      }}
                    >
                      <option value={15}>15분</option>
                      <option value={30}>30분</option>
                      <option value={45}>45분</option>
                      <option value={60}>1시간</option>
                      <option value={90}>1시간 30분</option>
                      <option value={120}>2시간</option>
                    </Form.Select>
                    <Form.Text style={{color: COLORS.text.secondary}}>
                      매일 꾸준히 연습할 수 있는 시간을 선택하세요
                    </Form.Text>
                  </Form.Group>
                </Col>

                {/* 선호하는 스타일 */}
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={{color: COLORS.text.primary, fontWeight: '600'}}>
                      🎵 선호하는 음악 스타일
                    </Form.Label>
                    <Form.Select
                      value={userProfile.preferredStyle}
                      onChange={(e) => handleProfileChange('preferredStyle', e.target.value)}
                      style={{
                        background: 'rgba(139, 92, 246, 0.1)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        color: COLORS.text.primary,
                        borderRadius: '8px'
                      }}
                    >
                      {styles.map((style) => (
                        <option key={style.value} value={style.value}>
                          {style.label} - {style.description}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                {/* 집중 영역 */}
                <Col md={12}>
                  <Form.Group>
                    <Form.Label style={{color: COLORS.text.primary, fontWeight: '600'}}>
                      🎯 집중하고 싶은 영역 (복수 선택 가능)
                    </Form.Label>
                    <div className="row g-3">
                      {focusAreas.map((area) => (
                        <Col md={4} key={area.value}>
                          <Form.Check
                            type="checkbox"
                            id={`area-${area.value}`}
                            label={
                              <div>
                                <div style={{color: COLORS.text.primary, fontWeight: '500'}}>
                                  {area.label}
                                </div>
                                <div style={{color: COLORS.text.secondary, fontSize: '0.9rem'}}>
                                  {area.description}
                                </div>
                              </div>
                            }
                            checked={userProfile.focusAreas.includes(area.value)}
                            onChange={() => handleFocusAreaToggle(area.value)}
                            style={{color: COLORS.text.primary}}
                          />
                        </Col>
                      ))}
                    </div>
                  </Form.Group>
                </Col>

                {/* 학습 목표 */}
                <Col md={12}>
                  <Form.Group>
                    <Form.Label style={{color: COLORS.text.primary, fontWeight: '600'}}>
                      🎯 학습 목표 (복수 선택 가능)
                    </Form.Label>
                    <div className="row g-3">
                      {goals.map((goal) => (
                        <Col md={4} key={goal.value}>
                          <Form.Check
                            type="checkbox"
                            id={`goal-${goal.value}`}
                            label={
                              <div>
                                <div style={{color: COLORS.text.primary, fontWeight: '500'}}>
                                  {goal.label}
                                </div>
                                <div style={{color: COLORS.text.secondary, fontSize: '0.9rem'}}>
                                  {goal.description}
                                </div>
                              </div>
                            }
                            checked={userProfile.goals.includes(goal.value)}
                            onChange={() => handleGoalToggle(goal.value)}
                            style={{color: COLORS.text.primary}}
                          />
                        </Col>
                      ))}
                    </div>
                  </Form.Group>
                </Col>
              </Row>

              <div className="text-center mt-4">
                <Button
                  onClick={generatePracticePlan}
                  disabled={loading || userProfile.focusAreas.length === 0 || userProfile.goals.length === 0}
                  style={{
                    ...BUTTON_STYLES.primary,
                    padding: '12px 30px',
                    fontSize: '1.1rem',
                    borderRadius: '25px'
                  }}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      AI 분석 중...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-magic me-2"></i>
                      맞춤 연습 계획 생성하기
                    </>
                  )}
                </Button>
              </div>

              {(userProfile.focusAreas.length === 0 || userProfile.goals.length === 0) && (
                <Alert variant="warning" className="mt-3">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  집중 영역과 학습 목표를 각각 하나 이상 선택해주세요.
                </Alert>
              )}
            </Form>
          </Card.Body>
        </Card>
      </div>
    );
  }

  if (currentView === 'plan' && practicePlan) {
    return (
      <div className="practice-plan-result">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 style={{color: COLORS.text.primary}}>📅 맞춤 연습 계획</h3>
            <p style={{color: COLORS.text.secondary}} className="mb-0">
              {practicePlan.startDate.toLocaleDateString()} ~ {practicePlan.endDate.toLocaleDateString()}
            </p>
          </div>
          <Button 
            style={BUTTON_STYLES.outline}
            onClick={() => setCurrentView('assessment')}
          >
            <i className="bi bi-arrow-left me-2"></i>
            프로필 수정하기
          </Button>
        </div>

        {/* 주간 목표 */}
        <Card style={CARD_STYLES.large} className="mb-4">
          <Card.Body>
            <h5 style={{color: COLORS.text.primary}} className="mb-3">
              <i className="bi bi-target me-2" style={{color: COLORS.primary.main}}></i>
              주간 학습 목표
            </h5>
            <Row className="g-3">
              {practicePlan.weeklyGoals.map((goal, index) => (
                <Col md={6} key={index}>
                  <div className="d-flex align-items-center p-3" style={{
                    background: 'rgba(139, 92, 246, 0.05)',
                    borderRadius: '12px',
                    border: '1px solid rgba(139, 92, 246, 0.1)'
                  }}>
                    <div className="me-3" style={{
                      width: '40px',
                      height: '40px',
                      background: GRADIENTS.primary,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold'
                    }}>
                      {index + 1}
                    </div>
                    <span style={{color: COLORS.text.primary}}>{goal}</span>
                  </div>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>

        {/* 일일 연습 계획 */}
        <Card style={CARD_STYLES.large} className="mb-4">
          <Card.Body>
            <h5 style={{color: COLORS.text.primary}} className="mb-3">
              <i className="bi bi-calendar-week me-2" style={{color: COLORS.success.main}}></i>
              일일 연습 계획
            </h5>
            <Row className="g-3">
              {practicePlan.dailyPractice.map((practice, index) => (
                <Col md={6} lg={4} key={index}>
                  <Card style={{
                    background: 'rgba(139, 92, 246, 0.05)',
                    border: '1px solid rgba(139, 92, 246, 0.1)',
                    borderRadius: '12px'
                  }}>
                    <Card.Body className="p-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 style={{color: COLORS.text.primary}} className="mb-0">
                          {practice.day}
                        </h6>
                        <Badge 
                          bg={getDifficultyColor(practice.difficulty)}
                          style={{fontSize: '0.7rem'}}
                        >
                          {practice.difficulty}
                        </Badge>
                      </div>
                      
                      <div className="mb-2">
                        <div style={{color: COLORS.text.secondary, fontSize: '0.9rem', marginBottom: '0.5rem'}}>
                          집중 영역
                        </div>
                        <div style={{color: COLORS.text.primary, fontWeight: '500'}}>
                          {practice.focus}
                        </div>
                      </div>

                      <div className="mb-2">
                        <div style={{color: COLORS.text.secondary, fontSize: '0.9rem', marginBottom: '0.5rem'}}>
                          연습 내용
                        </div>
                        <ul style={{color: COLORS.text.primary, fontSize: '0.9rem', margin: 0, paddingLeft: '1.2rem'}}>
                          {practice.exercises.map((exercise, idx) => (
                            <li key={idx}>{exercise}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="d-flex justify-content-between align-items-center">
                        <span style={{color: COLORS.text.secondary}} className="small">
                          ⏱️ {practice.duration}분
                        </span>
                        <Button 
                          size="sm"
                          style={BUTTON_STYLES.primary}
                        >
                          연습 시작
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>

        {/* 계획 요약 */}
        <Card style={CARD_STYLES.large}>
          <Card.Body>
            <h5 style={{color: COLORS.text.primary}} className="mb-3">
              <i className="bi bi-clipboard-data me-2" style={{color: COLORS.info.main}}></i>
              연습 계획 요약
            </h5>
            <Row className="g-4">
              <Col md={3}>
                <div className="text-center">
                  <div className="fs-4 fw-bold" style={{color: COLORS.primary.main}}>
                    {practicePlan.weeklyGoals.length}
                  </div>
                  <div style={{color: COLORS.text.secondary}}>주간 목표</div>
                </div>
              </Col>
              <Col md={3}>
                <div className="text-center">
                  <div className="fs-4 fw-bold" style={{color: COLORS.success.main}}>
                    {practicePlan.dailyPractice.length}
                  </div>
                  <div style={{color: COLORS.text.secondary}}>일일 계획</div>
                </div>
              </Col>
              <Col md={3}>
                <div className="text-center">
                  <div className="fs-4 fw-bold" style={{color: COLORS.warning.main}}>
                    {practicePlan.estimatedTime}
                  </div>
                  <div style={{color: COLORS.text.secondary}}>총 예상 시간(분)</div>
                </div>
              </Col>
              <Col md={3}>
                <div className="text-center">
                  <div className="fs-4 fw-bold" style={{color: COLORS.info.main}}>
                    {practicePlan.focusAreas.length}
                  </div>
                  <div style={{color: COLORS.text.secondary}}>집중 영역</div>
                </div>
              </Col>
            </Row>

            <div className="text-center mt-4">
              <Button
                onClick={() => setCurrentView('progress')}
                style={{
                  ...BUTTON_STYLES.success,
                  padding: '10px 20px',
                  borderRadius: '20px',
                  marginRight: '1rem'
                }}
              >
                <i className="bi bi-play me-2"></i>
                연습 시작하기
              </Button>
              <Button
                onClick={() => setCurrentView('assessment')}
                style={{
                  ...BUTTON_STYLES.outline,
                  padding: '10px 20px',
                  borderRadius: '20px'
                }}
              >
                <i className="bi bi-pencil me-2"></i>
                계획 수정하기
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  }

  if (currentView === 'progress') {
    return (
      <div className="practice-progress">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 style={{color: COLORS.text.primary}}>📊 연습 진행 상황</h3>
            <p style={{color: COLORS.text.secondary}} className="mb-0">
              연습 계획 실행과 진도 추적
            </p>
          </div>
          <Button 
            style={BUTTON_STYLES.outline}
            onClick={() => setCurrentView('plan')}
          >
            <i className="bi bi-arrow-left me-2"></i>
            계획으로 돌아가기
          </Button>
        </div>

        <Alert variant="info" className="mb-4">
          <i className="bi bi-info-circle me-2"></i>
          연습 진행 상황 추적 기능은 현재 개발 중입니다. 곧 업데이트될 예정입니다.
        </Alert>

        <div className="text-center">
          <Button
            onClick={() => setCurrentView('assessment')}
            style={{
              ...BUTTON_STYLES.primary,
              padding: '10px 20px',
              borderRadius: '20px'
            }}
          >
            <i className="bi bi-arrow-left me-2"></i>
            새로운 계획 만들기
          </Button>
        </div>
      </div>
    );
  }

  return null;
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case 'BEGINNER': return 'success';
    case 'INTERMEDIATE': return 'warning';
    case 'ADVANCED': return 'danger';
    default: return 'secondary';
  }
}
