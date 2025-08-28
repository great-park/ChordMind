"use client";

import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, ProgressBar, Badge, Alert, Modal, Form, ListGroup } from 'react-bootstrap';
import { aiService } from '../services/aiService';
import { CARD_STYLES, BUTTON_STYLES } from '../constants/styles';

interface PracticeArea {
  id: string;
  name: string;
  description: string;
  difficulty: number;
  estimated_time: number;
  exercises: string[];
  focus_points: string[];
}

interface PracticeSession {
  id: string;
  date: Date;
  duration: number;
  areas: string[];
  exercises_completed: string[];
  notes: string;
  rating: number;
}

interface PracticePlan {
  id: string;
  title: string;
  description: string;
  target_areas: string[];
  daily_sessions: number;
  session_duration: number;
  weekly_goals: string[];
  exercises: Array<{
    area: string;
    name: string;
    description: string;
    difficulty: number;
    time_estimate: number;
    focus_points: string[];
  }>;
  created_at: Date;
  status: 'active' | 'completed' | 'paused';
}

const AIPracticePlanner: React.FC = () => {
  const [currentPlan, setCurrentPlan] = useState<PracticePlan | null>(null);
  const [practiceAreas, setPracticeAreas] = useState<PracticeArea[]>([]);
  const [practiceSessions, setPracticeSessions] = useState<PracticeSession[]>([]);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [planSettings, setPlanSettings] = useState({
    title: '',
    target_areas: [] as string[],
    daily_sessions: 1,
    session_duration: 30,
    focus_level: 'balanced'
  });

  const [sessionData, setSessionData] = useState({
    duration: 30,
    areas: [] as string[],
    exercises_completed: [] as string[],
    notes: '',
    rating: 5
  });

  useEffect(() => {
    loadPracticeData();
  }, []);

  const loadPracticeData = () => {
    // 저장된 연습 계획 로드
    const savedPlans = localStorage.getItem('chordmind_practice_plans');
    if (savedPlans) {
      const plans = JSON.parse(savedPlans);
      if (plans.length > 0) {
        setCurrentPlan(plans.find((p: PracticePlan) => p.status === 'active') || plans[0]);
      }
    }

    // 저장된 연습 세션 로드
    const savedSessions = localStorage.getItem('chordmind_practice_sessions');
    if (savedSessions) {
      setPracticeSessions(JSON.parse(savedSessions));
    }

    // 연습 영역 초기화
    setPracticeAreas([
      {
        id: 'harmony',
        name: '화성학',
        description: '화음 구성과 화성 진행 학습',
        difficulty: 3,
        estimated_time: 45,
        exercises: ['3화음 구성', '7화음 구성', '화성 진행 연습'],
        focus_points: ['화음 구성', '화성 기능', '진행 패턴']
      },
      {
        id: 'melody',
        name: '멜로디',
        description: '멜로디 구성과 선율 학습',
        difficulty: 2,
        estimated_time: 30,
        exercises: ['스케일 연습', '인터벌 연습', '멜로디 구성'],
        focus_points: ['스케일', '인터벌', '선율']
      },
      {
        id: 'rhythm',
        name: '리듬',
        description: '리듬 패턴과 박자 학습',
        difficulty: 2,
        estimated_time: 25,
        exercises: ['박자 연습', '리듬 패턴', '템포 연습'],
        focus_points: ['박자', '리듬', '템포']
      },
      {
        id: 'technique',
        name: '연주 기법',
        description: '악기별 연주 기법 학습',
        difficulty: 4,
        estimated_time: 60,
        exercises: ['핑거링', '아르페지오', '스케일'],
        focus_points: ['핑거링', '아르페지오', '스케일']
      }
    ]);
  };

  const generatePracticePlan = async () => {
    try {
      // AI 서비스를 통한 맞춤형 연습 계획 생성
      const aiAnalysis = await aiService.analyzeHarmonyAdvanced('C-F-G-Am', 'classical');
      
      const newPlan: PracticePlan = {
        id: Date.now().toString(),
        title: planSettings.title || `AI 맞춤 연습 계획 ${new Date().toLocaleDateString()}`,
        description: 'AI가 분석한 개인 맞춤형 연습 계획입니다.',
        target_areas: planSettings.target_areas,
        daily_sessions: planSettings.daily_sessions,
        session_duration: planSettings.session_duration,
        weekly_goals: [
          '화성 진행 패턴 마스터',
          '멜로디 구성 능력 향상',
          '리듬 감각 개선',
          '연주 기법 숙련도 향상'
        ],
        exercises: generateExercises(planSettings.target_areas, planSettings.focus_level),
        created_at: new Date(),
        status: 'active'
      };

      // 계획 저장
      const savedPlans = JSON.parse(localStorage.getItem('chordmind_practice_plans') || '[]');
      savedPlans.push(newPlan);
      localStorage.setItem('chordmind_practice_plans', JSON.stringify(savedPlans));

      setCurrentPlan(newPlan);
      setShowPlanModal(false);
      setPlanSettings({
        title: '',
        target_areas: [],
        daily_sessions: 1,
        session_duration: 30,
        focus_level: 'balanced'
      });
    } catch (error) {
      console.error('연습 계획 생성 실패:', error);
    }
  };

  const generateExercises = (areas: string[], focusLevel: string) => {
    const exercises: any[] = [];
    
    areas.forEach(area => {
      const areaData = practiceAreas.find(a => a.id === area);
      if (areaData) {
        areaData.exercises.forEach((exercise, index) => {
          exercises.push({
            area: area,
            name: exercise,
            description: `${areaData.name} 영역의 ${exercise} 연습`,
            difficulty: areaData.difficulty,
            time_estimate: Math.floor(areaData.estimated_time / areaData.exercises.length),
            focus_points: areaData.focus_points.slice(0, 2)
          });
        });
      }
    });

    return exercises;
  };

  const startPracticeSession = () => {
    setShowSessionModal(true);
  };

  const completePracticeSession = () => {
    if (!currentPlan) return;

    const newSession: PracticeSession = {
      id: Date.now().toString(),
      date: new Date(),
      duration: sessionData.duration,
      areas: sessionData.areas,
      exercises_completed: sessionData.exercises_completed,
      notes: sessionData.notes,
      rating: sessionData.rating
    };

    const updatedSessions = [...practiceSessions, newSession];
    setPracticeSessions(updatedSessions);
    localStorage.setItem('chordmind_practice_sessions', JSON.stringify(updatedSessions));

    setShowSessionModal(false);
    setSessionData({
      duration: 30,
      areas: [],
      exercises_completed: [],
      notes: '',
      rating: 5
    });
  };

  const getWeeklyProgress = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weeklySessions = practiceSessions.filter(session => 
      new Date(session.date) >= weekAgo
    );

    const totalTime = weeklySessions.reduce((sum, session) => sum + session.duration, 0);
    const totalSessions = weeklySessions.length;
    const averageRating = weeklySessions.length > 0 
      ? weeklySessions.reduce((sum, session) => sum + session.rating, 0) / weeklySessions.length 
      : 0;

    return { totalTime, totalSessions, averageRating };
  };

  const weeklyProgress = getWeeklyProgress();

  return (
    <div className="ai-practice-planner">
      <h2 className="mb-4">🎯 AI 맞춤형 연습 계획</h2>
      
      {/* 주간 진행 상황 */}
      <Card style={CARD_STYLES.primary} className="mb-4">
        <Card.Body>
          <h5>📊 주간 연습 현황</h5>
          <Row>
            <Col md={4}>
              <div className="text-center">
                <h3>⏱️</h3>
                <h6>총 연습 시간</h6>
                <Badge bg="primary" className="fs-6">{Math.floor(weeklyProgress.totalTime / 60)}분</Badge>
              </div>
            </Col>
            
            <Col md={4}>
              <div className="text-center">
                <h3>🎯</h3>
                <h6>연습 세션</h6>
                <Badge bg="info" className="fs-6">{weeklyProgress.totalSessions}회</Badge>
              </div>
            </Col>
            
            <Col md={4}>
              <div className="text-center">
                <h3>⭐</h3>
                <h6>평균 만족도</h6>
                <Badge bg="success" className="fs-6">{weeklyProgress.averageRating.toFixed(1)}/5</Badge>
              </div>
            </Col>
          </Row>
          
          <div className="mt-3">
            <h6>주간 목표 달성률</h6>
            <ProgressBar 
              now={(weeklyProgress.totalSessions / 7) * 100} 
              variant="success" 
              className="mb-2"
            />
            <small className="text-muted">
              {weeklyProgress.totalSessions}/7일 연습 완료
            </small>
          </div>
        </Card.Body>
      </Card>

      {/* 현재 연습 계획 */}
      {currentPlan ? (
        <Card style={CARD_STYLES.secondary} className="mb-4">
          <Card.Body>
            <h5>📋 현재 연습 계획: {currentPlan.title}</h5>
            <p>{currentPlan.description}</p>
            
            <Row>
              <Col md={6}>
                <div className="mb-3">
                  <strong>목표 영역:</strong>
                  <div className="d-flex gap-2 flex-wrap mt-2">
                    {currentPlan.target_areas.map(area => (
                      <Badge key={area} bg="primary">{area}</Badge>
                    ))}
                  </div>
                </div>
                
                <div className="mb-3">
                  <strong>일일 세션:</strong> {currentPlan.daily_sessions}회<br/>
                  <strong>세션 시간:</strong> {currentPlan.session_duration}분
                </div>
              </Col>
              
              <Col md={6}>
                <div className="mb-3">
                  <strong>주간 목표:</strong>
                  <ul className="mb-0">
                    {currentPlan.weekly_goals.map((goal, index) => (
                      <li key={index}>{goal}</li>
                    ))}
                  </ul>
                </div>
              </Col>
            </Row>
            
            <div className="d-flex gap-2">
              <Button 
                variant="success" 
                onClick={startPracticeSession}
                style={BUTTON_STYLES.success}
              >
                🎯 연습 시작
              </Button>
              <Button 
                variant="info" 
                onClick={() => setShowPlanModal(true)}
                style={BUTTON_STYLES.info}
              >
                📝 계획 수정
              </Button>
              <Button 
                variant="warning" 
                onClick={() => {
                  const updatedPlan = { ...currentPlan, status: 'paused' };
                  setCurrentPlan(updatedPlan);
                }}
                style={BUTTON_STYLES.warning}
              >
                ⏸️ 일시정지
              </Button>
            </div>
          </Card.Body>
        </Card>
      ) : (
        <Card style={CARD_STYLES.default} className="mb-4">
          <Card.Body className="text-center">
            <h5>📝 연습 계획이 없습니다</h5>
            <p>AI가 맞춤형 연습 계획을 만들어드릴게요!</p>
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => setShowPlanModal(true)}
              style={BUTTON_STYLES.primary}
            >
              🎯 연습 계획 만들기
            </Button>
          </Card.Body>
        </Card>
      )}

      {/* 연습 영역 */}
      <Card style={CARD_STYLES.default} className="mb-4">
        <Card.Body>
          <h5>🎵 연습 영역</h5>
          <Row>
            {practiceAreas.map(area => (
              <Col md={6} lg={3} key={area.id} className="mb-3">
                <Card style={CARD_STYLES.accent}>
                  <Card.Body>
                    <h6>{area.name}</h6>
                    <p className="text-muted small">{area.description}</p>
                    
                    <div className="mb-2">
                      <Badge bg="primary" className="me-1">난이도 {area.difficulty}</Badge>
                      <Badge bg="info" className="me-1">{area.estimated_time}분</Badge>
                    </div>
                    
                    <div className="mb-2">
                      <strong>연습 내용:</strong>
                      <ul className="small mb-2">
                        {area.exercises.slice(0, 2).map((exercise, index) => (
                          <li key={index}>{exercise}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mb-2">
                      <strong>집중 포인트:</strong>
                      <div className="d-flex gap-1 flex-wrap mt-1">
                        {area.focus_points.map((point, index) => (
                          <Badge key={index} bg="secondary" className="small">{point}</Badge>
                        ))}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>

      {/* 최근 연습 세션 */}
      {practiceSessions.length > 0 && (
        <Card style={CARD_STYLES.default} className="mb-4">
          <Card.Body>
            <h5>📚 최근 연습 세션</h5>
            <ListGroup>
              {practiceSessions.slice(-5).reverse().map(session => (
                <ListGroup.Item key={session.id}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{new Date(session.date).toLocaleDateString()}</strong>
                      <br/>
                      <small className="text-muted">
                        {session.duration}분 | {session.areas.join(', ')}
                      </small>
                    </div>
                    <div className="text-end">
                      <Badge bg="success">{session.rating}/5</Badge>
                      <br/>
                      <small className="text-muted">
                        {session.exercises_completed.length}개 완료
                      </small>
                    </div>
                  </div>
                  {session.notes && (
                    <div className="mt-2">
                      <small className="text-muted">📝 {session.notes}</small>
                    </div>
                  )}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      )}

      {/* 연습 계획 생성 모달 */}
      <Modal show={showPlanModal} onHide={() => setShowPlanModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>🎯 AI 맞춤형 연습 계획 생성</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>계획 제목</Form.Label>
              <Form.Control
                type="text"
                value={planSettings.title}
                onChange={(e) => setPlanSettings({
                  ...planSettings,
                  title: e.target.value
                })}
                placeholder="예: 화성학 마스터 계획"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>집중할 영역 (복수 선택 가능)</Form.Label>
              <div className="d-flex gap-2 flex-wrap">
                {practiceAreas.map(area => (
                  <Form.Check
                    key={area.id}
                    type="checkbox"
                    id={`area-${area.id}`}
                    label={area.name}
                    checked={planSettings.target_areas.includes(area.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setPlanSettings({
                          ...planSettings,
                          target_areas: [...planSettings.target_areas, area.id]
                        });
                      } else {
                        setPlanSettings({
                          ...planSettings,
                          target_areas: planSettings.target_areas.filter(id => id !== area.id)
                        });
                      }
                    }}
                  />
                ))}
              </div>
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>일일 연습 세션 수</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    max="3"
                    value={planSettings.daily_sessions}
                    onChange={(e) => setPlanSettings({
                      ...planSettings,
                      daily_sessions: parseInt(e.target.value)
                    })}
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>세션당 연습 시간 (분)</Form.Label>
                  <Form.Control
                    type="number"
                    min="15"
                    max="120"
                    step="15"
                    value={planSettings.session_duration}
                    onChange={(e) => setPlanSettings({
                      ...planSettings,
                      session_duration: parseInt(e.target.value)
                    })}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>집중 수준</Form.Label>
              <Form.Select
                value={planSettings.focus_level}
                onChange={(e) => setPlanSettings({
                  ...planSettings,
                  focus_level: e.target.value
                })}
              >
                <option value="balanced">균형잡힌</option>
                <option value="intensive">집중형</option>
                <option value="relaxed">여유로운</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPlanModal(false)}>
            취소
          </Button>
          <Button 
            variant="primary" 
            onClick={generatePracticePlan}
            disabled={planSettings.target_areas.length === 0}
          >
            🎯 계획 생성
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 연습 세션 모달 */}
      <Modal show={showSessionModal} onHide={() => setShowSessionModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>🎯 연습 세션</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>연습 시간 (분)</Form.Label>
              <Form.Control
                type="number"
                min="15"
                max="120"
                step="15"
                value={sessionData.duration}
                onChange={(e) => setSessionData({
                  ...sessionData,
                  duration: parseInt(e.target.value)
                })}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>연습한 영역</Form.Label>
              <div className="d-flex gap-2 flex-wrap">
                {practiceAreas.map(area => (
                  <Form.Check
                    key={area.id}
                    type="checkbox"
                    id={`session-area-${area.id}`}
                    label={area.name}
                    checked={sessionData.areas.includes(area.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSessionData({
                          ...sessionData,
                          areas: [...sessionData.areas, area.id]
                        });
                      } else {
                        setSessionData({
                          ...sessionData,
                          areas: sessionData.areas.filter(id => id !== area.id)
                        });
                      }
                    }}
                  />
                ))}
              </div>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>완료한 연습</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="오늘 완료한 연습 내용을 입력하세요..."
                value={sessionData.notes}
                onChange={(e) => setSessionData({
                  ...sessionData,
                  notes: e.target.value
                })}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>오늘 연습 만족도</Form.Label>
              <Form.Range
                min="1"
                max="5"
                value={sessionData.rating}
                onChange={(e) => setSessionData({
                  ...sessionData,
                  rating: parseInt(e.target.value)
                })}
              />
              <div className="d-flex justify-content-between">
                <small>😞 1</small>
                <small>😐 3</small>
                <small>😊 5</small>
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSessionModal(false)}>
            취소
          </Button>
          <Button 
            variant="success" 
            onClick={completePracticeSession}
            disabled={sessionData.areas.length === 0}
          >
            ✅ 세션 완료
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AIPracticePlanner;
