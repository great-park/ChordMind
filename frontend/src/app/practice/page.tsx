'use client'

import { useState } from 'react';
import { Container, Row, Col, Card, Button, Nav, Tab } from 'react-bootstrap';
import ModernPracticeWorkspace from '../../components/ModernPracticeWorkspace';
import PracticeHistory from '../../components/PracticeHistory';
import PracticeGoals from '../../components/PracticeGoals';
import PracticeGuides from '../../components/PracticeGuides';
import RealtimeAnalyzer from '../../components/RealtimeAnalyzer';
import { useAuth } from '../../contexts/AuthContext';

export default function Practice() {
  const [activeTab, setActiveTab] = useState<'workspace' | 'history' | 'goals' | 'social' | 'guides' | 'analyzer'>('workspace');
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="text-center">
              <Card.Body>
                <h3 className="mb-3">🎵 연습 기능을 이용하려면</h3>
                <p className="text-muted mb-4">
                  로그인이 필요합니다. 개인 맞춤형 연습과 AI 분석을 경험해보세요!
                </p>
                <Button variant="primary" href="/login">
                  로그인하기
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* 모던 워크스페이스 */}
      {activeTab === 'workspace' && <ModernPracticeWorkspace />}
      
      {/* 기존 기능들은 탭으로 제공 */}
      {activeTab !== 'workspace' && (
        <Container fluid className="py-4">
          <Row>
            <Col>
              <Nav variant="pills" className="mb-4 justify-content-center">
                <Nav.Item>
                  <Button 
                    variant="outline-primary"
                    onClick={() => setActiveTab('workspace')}
                    className="me-2"
                  >
                    🎵 연습 워크스페이스
                  </Button>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    active={activeTab === 'history'} 
                    onClick={() => setActiveTab('history')}
                    className="me-2"
                  >
                    📊 연습 기록
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    active={activeTab === 'goals'} 
                    onClick={() => setActiveTab('goals')}
                    className="me-2"
                  >
                    🎯 연습 목표
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    active={activeTab === 'guides'} 
                    onClick={() => setActiveTab('guides')}
                    className="me-2"
                  >
                    📚 연습 가이드
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    active={activeTab === 'analyzer'} 
                    onClick={() => setActiveTab('analyzer')}
                    className="me-2"
                  >
                    🎤 실시간 분석
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    active={activeTab === 'social'} 
                    onClick={() => setActiveTab('social')}
                  >
                    👥 소셜 연습
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              {activeTab === 'history' && (
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">📊 연습 기록 및 분석</h5>
                  </Card.Header>
                  <Card.Body>
                    <PracticeHistory />
                  </Card.Body>
                </Card>
              )}

              {activeTab === 'goals' && (
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">🎯 연습 목표 설정</h5>
                  </Card.Header>
                  <Card.Body>
                    <PracticeGoals />
                  </Card.Body>
                </Card>
              )}

              {activeTab === 'guides' && <PracticeGuides />}

              {activeTab === 'analyzer' && <RealtimeAnalyzer />}

              {activeTab === 'social' && (
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">👥 소셜 연습 - 함께 성장하세요!</h5>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <Card className="mb-3" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                          <Card.Body className="text-center">
                            <h4>🏆 이번 주 리더보드</h4>
                            <div className="mt-3">
                              <div className="d-flex justify-content-between">
                                <span>1. 김음악</span>
                                <span>2,450점</span>
                              </div>
                              <div className="d-flex justify-content-between">
                                <span>2. 박리듬</span>
                                <span>2,380점</span>
                              </div>
                              <div className="d-flex justify-content-between">
                                <span className="text-warning">3. {user?.name || '나'}</span>
                                <span className="text-warning">2,290점</span>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={6}>
                        <Card className="mb-3" style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', color: 'white' }}>
                          <Card.Body className="text-center">
                            <h4>👫 연습 친구들</h4>
                            <div className="mt-3">
                              <div className="mb-2">
                                <span>🟢 김음악님이 피아노 연습 중</span>
                              </div>
                              <div className="mb-2">
                                <span>🟡 박리듬님이 기타 연습 중</span>
                              </div>
                              <Button variant="light" size="sm" className="mt-2">
                                연습 방 만들기
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                    
                    <Row className="mt-4">
                      <Col>
                        <Card>
                          <Card.Header>
                            <h6>🎵 커뮤니티 챌린지</h6>
                          </Card.Header>
                          <Card.Body>
                            <div className="mb-3">
                              <h6>이번 주 챌린지: 매일 30분 연습하기</h6>
                              <div className="progress mb-2">
                                <div className="progress-bar bg-success" style={{ width: '85%' }}></div>
                              </div>
                              <small className="text-muted">123명 참여 중 · 6일차/7일</small>
                            </div>
                            <Button variant="outline-primary" size="sm">
                              챌린지 참여하기
                            </Button>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              )}
            </Col>
          </Row>
        </Container>
      )}

      {/* 플로팅 네비게이션 - 다른 탭에서 워크스페이스로 빠르게 돌아가기 */}
      {activeTab !== 'workspace' && (
        <Button
          variant="primary"
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            fontSize: '1.5rem',
            zIndex: 1000
          }}
          onClick={() => setActiveTab('workspace')}
          title="연습 워크스페이스로 돌아가기"
        >
          🎵
        </Button>
      )}
    </div>
  );
} 