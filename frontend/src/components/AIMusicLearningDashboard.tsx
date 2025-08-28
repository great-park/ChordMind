"use client";

import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Badge, ProgressBar, Alert, Tabs, Tab } from 'react-bootstrap';
import AICompositionStudio from './AICompositionStudio';
import AIMusicTheoryGame from './AIMusicTheoryGame';
import AIPracticePlanner from './AIPracticePlanner';
import AnimatedCard from './ui/AnimatedCard';
import InteractiveButton from './ui/InteractiveButton';
import GradientBackground from './ui/GradientBackground';
import { CARD_STYLES, BUTTON_STYLES } from '../constants/styles';

interface DashboardStats {
  total_compositions: number;
  completed_lessons: number;
  practice_hours: number;
  current_streak: number;
  ai_generated_patterns: number;
  quiz_scores: number;
}

const AIMusicLearningDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    total_compositions: 0,
    completed_lessons: 0,
    practice_hours: 0,
    current_streak: 0,
    ai_generated_patterns: 0,
    quiz_scores: 0
  });

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = () => {
    // 작곡 프로젝트 통계
    const compositions = JSON.parse(localStorage.getItem('chordmind_projects') || '[]');
    
    // 학습 진행 통계
    const progress = JSON.parse(localStorage.getItem('chordmind_progress') || '{}');
    
    // 연습 계획 통계
    const practiceSessions = JSON.parse(localStorage.getItem('chordmind_practice_sessions') || '[]');
    
    setDashboardStats({
      total_compositions: compositions.length,
      completed_lessons: progress.completed_lessons?.length || 0,
      practice_hours: Math.floor(practiceSessions.reduce((sum: number, session: any) => sum + session.duration, 0) / 60),
      current_streak: progress.streak_days || 0,
      ai_generated_patterns: compositions.filter((p: any) => p.source === 'ai').length,
      quiz_scores: Object.values(progress.quiz_scores || {}).reduce((sum: number, score: any) => sum + score, 0)
    });
  };

  const getOverallProgress = () => {
    const totalPossible = 100; // 예시 총점
    const earned = Math.min(
      dashboardStats.completed_lessons * 10 + 
      dashboardStats.practice_hours * 2 + 
      dashboardStats.quiz_scores * 5,
      totalPossible
    );
    return (earned / totalPossible) * 100;
  };

  const getNextMilestone = () => {
    const current = getOverallProgress();
    if (current < 25) return { target: 25, reward: '🎵 기본 화성학 뱃지', remaining: 25 - current };
    if (current < 50) return { target: 50, reward: '🎼 작곡가 뱃지', remaining: 50 - current };
    if (current < 75) return { target: 75, reward: '🎯 음악 이론 마스터 뱃지', remaining: 75 - current };
    if (current < 100) return { target: 100, reward: '🏆 ChordMind 마스터 뱃지', remaining: 100 - current };
    return { target: 100, reward: '🎉 모든 뱃지 획득!', remaining: 0 };
  };

  const nextMilestone = getNextMilestone();

  return (
    <GradientBackground gradientType="music" showParticles={true}>
      <div className="ai-music-learning-dashboard">
        <div className="text-center mb-5">
          <h1 className="display-3 fw-bold text-white mb-3" style={{
            textShadow: '0 4px 8px rgba(0,0,0,0.3)',
            animation: 'fadeInUp 1s ease-out'
          }}>
            🎵 ChordMind AI 음악 학습
          </h1>
          <p className="lead text-white-50 fs-4" style={{
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            animation: 'fadeInUp 1s ease-out 0.2s both'
          }}>
            AI와 함께하는 개인 맞춤형 음악 학습 경험
          </p>
        </div>

      {/* 전체 진행 상황 */}
      <AnimatedCard 
        style={{
          ...CARD_STYLES.primary,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: 'none'
        }} 
        className="mb-4"
        direction="up"
        delay={300}
      >
        <Card.Body>
          <h5 className="fw-bold text-primary">📊 전체 학습 진행 상황</h5>
          <Row>
            <Col md={8}>
              <div className="mb-3">
                <h6>전체 진행률</h6>
                <ProgressBar 
                  now={getOverallProgress()} 
                  variant="success" 
                  className="mb-2"
                  style={{ height: '25px' }}
                />
                <small className="text-muted">
                  {getOverallProgress().toFixed(1)}% 완료
                </small>
              </div>
              
              {nextMilestone.remaining > 0 && (
                <div className="mb-3">
                  <h6>다음 목표: {nextMilestone.target}%</h6>
                  <ProgressBar 
                    now={getOverallProgress()} 
                    max={nextMilestone.target}
                    variant="info" 
                    className="mb-2"
                  />
                  <small className="text-muted">
                    {nextMilestone.reward}까지 {nextMilestone.remaining.toFixed(1)}% 남음
                  </small>
                </div>
              )}
            </Col>
            
            <Col md={4}>
              <div className="text-center">
                <h3>🎯</h3>
                <h6>다음 목표</h6>
                <Badge bg="warning" className="fs-6">{nextMilestone.reward}</Badge>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* 핵심 통계 */}
      <Row className="mb-4">
        <Col md={2}>
          <AnimatedCard 
            style={{
              ...CARD_STYLES.accent,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(8px)'
            }} 
            className="text-center"
            direction="up"
            delay={400}
          >
            <Card.Body>
              <h3 className="mb-2">🎼</h3>
              <h6 className="text-muted">작곡 프로젝트</h6>
              <Badge bg="primary" className="fs-4 fw-bold">{dashboardStats.total_compositions}</Badge>
            </Card.Body>
          </AnimatedCard>
        </Col>
        
        <Col md={2}>
          <AnimatedCard 
            style={{
              ...CARD_STYLES.accent,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(8px)'
            }} 
            className="text-center"
            direction="up"
            delay={500}
          >
            <Card.Body>
              <h3 className="mb-2">📚</h3>
              <h6 className="text-muted">완료한 레슨</h6>
              <Badge bg="success" className="fs-4 fw-bold">{dashboardStats.completed_lessons}</Badge>
            </Card.Body>
          </AnimatedCard>
        </Col>
        
        <Col md={2}>
          <AnimatedCard 
            style={{
              ...CARD_STYLES.accent,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(8px)'
            }} 
            className="text-center"
            direction="up"
            delay={600}
          >
            <Card.Body>
              <h3 className="mb-2">⏱️</h3>
              <h6 className="text-muted">총 연습 시간</h6>
              <Badge bg="info" className="fs-4 fw-bold">{dashboardStats.practice_hours}시간</Badge>
            </Card.Body>
          </AnimatedCard>
        </Col>
        
        <Col md={2}>
          <AnimatedCard 
            style={{
              ...CARD_STYLES.accent,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(8px)'
            }} 
            className="text-center"
            direction="up"
            delay={700}
          >
            <Card.Body>
              <h3 className="mb-2">🔥</h3>
              <h6 className="text-muted">연속 학습</h6>
              <Badge bg="danger" className="fs-4 fw-bold">{dashboardStats.current_streak}일</Badge>
            </Card.Body>
          </AnimatedCard>
        </Col>
        
        <Col md={2}>
          <AnimatedCard 
            style={{
              ...CARD_STYLES.accent,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(8px)'
            }} 
            className="text-center"
            direction="up"
            delay={800}
          >
            <Card.Body>
              <h3 className="mb-2">🤖</h3>
              <h6 className="text-muted">AI 생성 패턴</h6>
              <Badge bg="warning" className="fs-4 fw-bold">{dashboardStats.ai_generated_patterns}</Badge>
            </Card.Body>
          </AnimatedCard>
        </Col>
        
        <Col md={2}>
          <AnimatedCard 
            style={{
              ...CARD_STYLES.accent,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(8px)'
            }} 
            className="text-center"
            direction="up"
            delay={900}
          >
            <Card.Body>
              <h3 className="mb-2">⭐</h3>
              <h6 className="text-muted">퀴즈 점수</h6>
              <Badge bg="secondary" className="fs-4 fw-bold">{dashboardStats.quiz_scores}</Badge>
            </Card.Body>
          </AnimatedCard>
        </Col>
      </Row>

      {/* AI 서비스 상태 */}
      <Card style={CARD_STYLES.default} className="mb-4">
        <Card.Body>
          <h5>🤖 AI 서비스 상태</h5>
          <Row>
            <Col md={4}>
              <div className="d-flex align-items-center mb-2">
                <div className="me-2">
                  <div className="bg-success rounded-circle" style={{ width: '12px', height: '12px' }}></div>
                </div>
                <span>Harmony AI 모델</span>
                <Badge bg="success" className="ms-auto">정상</Badge>
              </div>
            </Col>
            
            <Col md={4}>
              <div className="d-flex align-items-center mb-2">
                <div className="me-2">
                  <div className="bg-success rounded-circle" style={{ width: '12px', height: '12px' }}></div>
                </div>
                <span>When-in-Rome 코퍼스</span>
                <Badge bg="success" className="ms-auto">연결됨</Badge>
              </div>
            </Col>
            
            <Col md={4}>
              <div className="d-flex align-items-center mb-2">
                <div className="me-2">
                  <div className="bg-success rounded-circle" style={{ width: '12px', height: '12px' }}></div>
                </div>
                <span>AI 작곡 엔진</span>
                <Badge bg="success" className="ms-auto">활성</Badge>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* 주요 기능 탭 */}
      <Card style={CARD_STYLES.default}>
        <Card.Body>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k || 'overview')}
            className="mb-3"
          >
            <Tab eventKey="overview" title="📊 대시보드">
              <div className="text-center py-5">
                <h3>🎵 AI 음악 학습의 모든 것</h3>
                <p className="lead mb-4">
                  아래 탭에서 원하는 기능을 선택하여 사용해보세요!
                </p>
                
                                 <Row>
                   <Col md={4}>
                     <AnimatedCard 
                       style={{
                         ...CARD_STYLES.accent,
                         background: 'rgba(255, 255, 255, 0.95)',
                         backdropFilter: 'blur(10px)'
                       }} 
                       className="mb-3"
                       direction="left"
                       delay={100}
                     >
                       <Card.Body className="text-center">
                         <h3 className="mb-3">🎼</h3>
                         <h6 className="fw-bold mb-2">AI 작곡 스튜디오</h6>
                         <p className="small text-muted mb-3">AI와 함께하는 화성 진행 생성 및 작곡</p>
                         <InteractiveButton 
                           variant="primary" 
                           size="sm"
                           onClick={() => setActiveTab('composition')}
                           glow={true}
                           icon="🚀"
                         >
                           시작하기
                         </InteractiveButton>
                       </Card.Body>
                     </AnimatedCard>
                   </Col>
                   
                   <Col md={4}>
                     <AnimatedCard 
                       style={{
                         ...CARD_STYLES.accent,
                         background: 'rgba(255, 255, 255, 0.95)',
                         backdropFilter: 'blur(10px)'
                       }} 
                       className="mb-3"
                       direction="up"
                       delay={200}
                     >
                       <Card.Body className="text-center">
                         <h3 className="mb-3">🎯</h3>
                         <h6 className="fw-bold mb-2">음악 이론 학습 게임</h6>
                         <p className="small text-muted mb-3">게임처럼 즐기는 체계적인 음악 이론 학습</p>
                         <InteractiveButton 
                           variant="success" 
                           size="sm"
                           onClick={() => setActiveTab('theory')}
                           glow={true}
                           icon="🎮"
                         >
                           시작하기
                         </InteractiveButton>
                       </Card.Body>
                     </AnimatedCard>
                   </Col>
                   
                   <Col md={4}>
                     <AnimatedCard 
                       style={{
                         ...CARD_STYLES.accent,
                         background: 'rgba(255, 255, 255, 0.95)',
                         backdropFilter: 'blur(10px)'
                       }} 
                       className="mb-3"
                       direction="right"
                       delay={300}
                     >
                       <Card.Body className="text-center">
                         <h3 className="mb-3">🎯</h3>
                         <h6 className="fw-bold mb-2">맞춤형 연습 계획</h6>
                         <p className="small text-muted mb-3">AI가 제안하는 개인 맞춤형 연습 계획</p>
                         <InteractiveButton 
                           variant="info" 
                           size="sm"
                           onClick={() => setActiveTab('practice')}
                           glow={true}
                           icon="🎯"
                         >
                           시작하기
                         </InteractiveButton>
                       </Card.Body>
                     </AnimatedCard>
                   </Col>
                 </Row>
                
                <Alert variant="info" className="mt-4">
                  <h6>💡 사용 팁</h6>
                  <ul className="mb-0">
                    <li>AI 작곡 스튜디오에서 다양한 스타일의 화성 진행을 생성해보세요</li>
                    <li>음악 이론 학습 게임으로 체계적으로 이론을 익혀보세요</li>
                    <li>맞춤형 연습 계획으로 효율적인 연습을 해보세요</li>
                  </ul>
                </Alert>
              </div>
            </Tab>
            
            <Tab eventKey="composition" title="🎼 AI 작곡 스튜디오">
              <AICompositionStudio />
            </Tab>
            
            <Tab eventKey="theory" title="🎯 음악 이론 학습">
              <AIMusicTheoryGame />
            </Tab>
            
            <Tab eventKey="practice" title="🎯 맞춤형 연습 계획">
              <AIPracticePlanner />
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>

      {/* 빠른 액션 */}
      <AnimatedCard 
        style={{
          ...CARD_STYLES.default,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: 'none'
        }} 
        className="mt-4"
        direction="up"
        delay={1000}
      >
        <Card.Body>
          <h5 className="fw-bold text-primary">⚡ 빠른 액션</h5>
          <Row>
            <Col md={3}>
              <InteractiveButton 
                variant="outline-primary" 
                className="w-100 mb-2"
                onClick={() => setActiveTab('composition')}
                icon="🎼"
                ripple={true}
              >
                새 작곡 시작
              </InteractiveButton>
            </Col>
            
            <Col md={3}>
              <InteractiveButton 
                variant="outline-success" 
                className="w-100 mb-2"
                onClick={() => setActiveTab('theory')}
                icon="🎯"
                ripple={true}
              >
                레슨 시작
              </InteractiveButton>
            </Col>
            
            <Col md={3}>
              <InteractiveButton 
                variant="outline-info" 
                className="w-100 mb-2"
                onClick={() => setActiveTab('practice')}
                icon="📋"
                ripple={true}
              >
                연습 계획 생성
              </InteractiveButton>
            </Col>
            
            <Col md={3}>
              <InteractiveButton 
                variant="outline-warning" 
                className="w-100 mb-2"
                onClick={() => window.location.reload()}
                icon="🔄"
                ripple={true}
              >
                통계 새로고침
              </InteractiveButton>
            </Col>
          </Row>
        </Card.Body>
      </AnimatedCard>
    </div>
    </GradientBackground>
  );
};

export default AIMusicLearningDashboard;
