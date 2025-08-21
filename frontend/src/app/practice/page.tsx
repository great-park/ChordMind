'use client'

import { useState } from 'react';
import { Container, Row, Col, Card, Button, Nav, Tab } from 'react-bootstrap';
import ModernPracticeWorkspace from '../../components/ModernPracticeWorkspace';
import PracticeHistory from '../../components/PracticeHistory';
import PracticeGoals from '../../components/PracticeGoals';
import PracticeGuides from '../../components/PracticeGuides';
import RealtimeAnalyzer from '../../components/RealtimeAnalyzer';
import { useAuth } from '../../contexts/AuthContext';
import { GRADIENTS, COLORS, CARD_STYLES, BADGE_STYLES, BUTTON_STYLES } from '../../constants/styles';

export default function Practice() {
  const [activeTab, setActiveTab] = useState<'workspace' | 'history' | 'goals' | 'social' | 'guides' | 'analyzer'>('workspace');
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: GRADIENTS.dark,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Container>
          <Row className="justify-content-center">
            <Col md={6}>
              <Card className="text-center border-0 shadow-lg" style={CARD_STYLES.large}>
                <Card.Body className="p-5">
                  <div className="mb-4">
                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style={{
                      width: '80px',
                      height: '80px',
                      background: GRADIENTS.primary,
                      color: 'white'
                    }}>
                      <span className="fs-1">🎵</span>
                    </div>
                    <h3 className="mb-3" style={{color: COLORS.text.primary}}>연습 기능을 이용하려면</h3>
                    <p style={{color: COLORS.text.secondary, fontSize: '1.1rem'}}>
                      로그인이 필요합니다. 개인 맞춤형 연습과 AI 분석을 경험해보세요!
                    </p>
                  </div>
                  <div className="d-flex gap-3 justify-content-center">
                    <Button 
                      style={{
                        ...BUTTON_STYLES.primary,
                        padding: '12px 24px',
                        fontSize: '1.1rem'
                      }}
                      href="/login"
                    >
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      로그인하기
                    </Button>
                    <Button 
                      style={{
                        ...BUTTON_STYLES.outline,
                        padding: '12px 24px',
                        fontSize: '1.1rem'
                      }}
                      href="/"
                    >
                      <i className="bi bi-house me-2"></i>
                      홈으로
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: GRADIENTS.dark,
      padding: '2rem 0'
    }}>
      {/* 모던 워크스페이스 */}
      {activeTab === 'workspace' && <ModernPracticeWorkspace />}
      
      {/* 기존 기능들은 탭으로 제공 */}
      {activeTab !== 'workspace' && (
        <Container fluid className="py-4">
          {/* 헤더 섹션 */}
          <div className="text-center mb-5">
            <span className="badge px-3 py-2 rounded-pill mb-3" style={{
              ...BADGE_STYLES.primary,
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              🎵 연습 도구
            </span>
            <h1 className="display-5 fw-bold mb-3" style={{color: COLORS.text.primary}}>
              당신의 <span style={{color: COLORS.primary.light}}>음악 여정</span>을 위한<br />
              <span style={{color: COLORS.primary.light}}>완벽한 도구들</span>
            </h1>
            <p className="lead mb-0" style={{color: COLORS.text.secondary}}>
              AI 분석, 목표 설정, 가이드까지 모든 것을 한 곳에서
            </p>
          </div>

          <Row>
            <Col>
              {/* 네비게이션 탭 */}
              <div className="d-flex justify-content-center mb-5">
                <div className="d-flex gap-2 flex-wrap justify-content-center">
                  <Button 
                    variant="outline-primary"
                    onClick={() => setActiveTab('workspace')}
                    style={{
                      ...BUTTON_STYLES.outline,
                      padding: '10px 20px',
                      borderRadius: '25px'
                    }}
                  >
                    🎵 연습 워크스페이스
                  </Button>
                  <Button 
                    variant={activeTab === 'history' ? 'primary' : 'outline-primary'}
                    onClick={() => setActiveTab('history')}
                    style={{
                      ...(activeTab === 'history' ? BUTTON_STYLES.primary : BUTTON_STYLES.outline),
                      padding: '10px 20px',
                      borderRadius: '25px'
                    }}
                  >
                    📊 연습 기록
                  </Button>
                  <Button 
                    variant={activeTab === 'goals' ? 'primary' : 'outline-primary'}
                    onClick={() => setActiveTab('goals')}
                    style={{
                      ...(activeTab === 'goals' ? BUTTON_STYLES.primary : BUTTON_STYLES.outline),
                      padding: '10px 20px',
                      borderRadius: '25px'
                    }}
                  >
                    🎯 연습 목표
                  </Button>
                  <Button 
                    variant={activeTab === 'guides' ? 'primary' : 'outline-primary'}
                    onClick={() => setActiveTab('guides')}
                    style={{
                      ...(activeTab === 'guides' ? BUTTON_STYLES.primary : BUTTON_STYLES.outline),
                      padding: '10px 20px',
                      borderRadius: '25px'
                    }}
                  >
                    📚 연습 가이드
                  </Button>
                  <Button 
                    variant={activeTab === 'analyzer' ? 'primary' : 'outline-primary'}
                    onClick={() => setActiveTab('analyzer')}
                    style={{
                      ...(activeTab === 'analyzer' ? BUTTON_STYLES.primary : BUTTON_STYLES.outline),
                      padding: '10px 20px',
                      borderRadius: '25px'
                    }}
                  >
                    🎤 실시간 분석
                  </Button>
                  <Button 
                    variant={activeTab === 'social' ? 'primary' : 'outline-primary'}
                    onClick={() => setActiveTab('social')}
                    style={{
                      ...(activeTab === 'social' ? BUTTON_STYLES.primary : BUTTON_STYLES.outline),
                      padding: '10px 20px',
                      borderRadius: '25px'
                    }}
                  >
                    👥 소셜 연습
                  </Button>
                </div>
              </div>

              {/* 탭 콘텐츠 */}
              {activeTab === 'history' && (
                <Card className="border-0 shadow-lg" style={CARD_STYLES.large}>
                  <Card.Header className="border-0 bg-transparent p-4">
                    <div className="d-flex align-items-center">
                      <div className="me-3" style={{
                        width: '50px',
                        height: '50px',
                        background: COLORS.primary.background,
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <i className="bi bi-graph-up fs-3" style={{color: COLORS.primary.main}}></i>
                      </div>
                      <div>
                        <h5 className="mb-1" style={{color: COLORS.text.primary}}>📊 연습 기록 및 분석</h5>
                        <small style={{color: COLORS.text.tertiary}}>AI가 분석한 당신의 연습 패턴</small>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <PracticeHistory />
                  </Card.Body>
                </Card>
              )}

              {activeTab === 'goals' && (
                <Card className="border-0 shadow-lg" style={CARD_STYLES.large}>
                  <Card.Header className="border-0 bg-transparent p-4">
                    <div className="d-flex align-items-center">
                      <div className="me-3" style={{
                        width: '50px',
                        height: '50px',
                        background: COLORS.success.background,
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <i className="bi bi-flag fs-3" style={{color: COLORS.success.main}}></i>
                      </div>
                      <div>
                        <h5 className="mb-1" style={{color: COLORS.text.primary}}>🎯 연습 목표 설정</h5>
                        <small style={{color: COLORS.text.tertiary}}>체계적인 목표로 성장하세요</small>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <PracticeGoals />
                  </Card.Body>
                </Card>
              )}

              {activeTab === 'guides' && (
                <Card className="border-0 shadow-lg" style={CARD_STYLES.large}>
                  <Card.Header className="border-0 bg-transparent p-4">
                    <div className="d-flex align-items-center">
                      <div className="me-3" style={{
                        width: '50px',
                        height: '50px',
                        background: COLORS.info.background,
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <i className="bi bi-book fs-3" style={{color: COLORS.info.main}}></i>
                      </div>
                      <div>
                        <h5 className="mb-1" style={{color: COLORS.text.primary}}>📚 연습 가이드</h5>
                        <small style={{color: COLORS.text.tertiary}}>전문가가 제안하는 연습 방법</small>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <PracticeGuides />
                  </Card.Body>
                </Card>
              )}

              {activeTab === 'analyzer' && (
                <Card className="border-0 shadow-lg" style={CARD_STYLES.large}>
                  <Card.Header className="border-0 bg-transparent p-4">
                    <div className="d-flex align-items-center">
                      <div className="me-3" style={{
                        width: '50px',
                        height: '50px',
                        background: COLORS.warning.background,
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <i className="bi bi-mic fs-3" style={{color: COLORS.warning.main}}></i>
                      </div>
                      <div>
                        <h5 className="mb-1" style={{color: COLORS.text.primary}}>🎤 실시간 분석</h5>
                        <small style={{color: COLORS.text.tertiary}}>AI가 실시간으로 연주를 분석합니다</small>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <RealtimeAnalyzer />
                  </Card.Body>
                </Card>
              )}

              {activeTab === 'social' && (
                <Card className="border-0 shadow-lg" style={CARD_STYLES.large}>
                  <Card.Header className="border-0 bg-transparent p-4">
                    <div className="d-flex align-items-center">
                      <div className="me-3" style={{
                        width: '50px',
                        height: '50px',
                        background: COLORS.primary.background,
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <i className="bi bi-people fs-3" style={{color: COLORS.primary.main}}></i>
                      </div>
                      <div>
                        <h5 className="mb-1" style={{color: COLORS.text.primary}}>👥 소셜 연습 - 함께 성장하세요!</h5>
                        <small style={{color: COLORS.text.tertiary}}>다른 뮤지션들과 함께 연습하고 경쟁하세요</small>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <Row>
                      <Col md={6}>
                        <Card className="mb-3 border-0" style={{ 
                          background: GRADIENTS.auth, 
                          color: 'white',
                          borderRadius: '16px'
                        }}>
                          <Card.Body className="text-center p-4">
                            <h4 className="mb-3">🏆 이번 주 리더보드</h4>
                            <div className="mt-4">
                              <div className="d-flex justify-content-between align-items-center mb-2 p-2" style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '8px'
                              }}>
                                <span className="fw-bold">🥇 1. 김음악</span>
                                <span className="badge" style={{
                                  background: 'rgba(255, 255, 255, 0.2)',
                                  color: 'white'
                                }}>2,450점</span>
                              </div>
                              <div className="d-flex justify-content-between align-items-center mb-2 p-2" style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '8px'
                              }}>
                                <span className="fw-bold">🥈 2. 박리듬</span>
                                <span className="badge" style={{
                                  background: 'rgba(255, 255, 255, 0.2)',
                                  color: 'white'
                                }}>2,380점</span>
                              </div>
                              <div className="d-flex justify-content-between align-items-center mb-2 p-2" style={{
                                background: 'rgba(255, 215, 0, 0.2)',
                                borderRadius: '8px',
                                border: '1px solid rgba(255, 215, 0, 0.3)'
                              }}>
                                <span className="fw-bold text-warning">🥉 3. {user?.name || '나'}</span>
                                <span className="badge" style={{
                                  background: 'rgba(255, 215, 0, 0.3)',
                                  color: '#FFD700'
                                }}>2,290점</span>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={6}>
                        <Card className="mb-3 border-0" style={{ 
                          background: GRADIENTS.success, 
                          color: 'white',
                          borderRadius: '16px'
                        }}>
                          <Card.Body className="text-center p-4">
                            <h4 className="mb-3">👫 연습 친구들</h4>
                            <div className="mt-4">
                              <div className="mb-3 p-2" style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '8px'
                              }}>
                                <span>🟢 김음악님이 피아노 연습 중</span>
                              </div>
                              <div className="mb-3 p-2" style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '8px'
                              }}>
                                <span>🟡 박리듬님이 기타 연습 중</span>
                              </div>
                              <Button 
                                variant="light" 
                                size="sm" 
                                className="mt-2"
                                style={{
                                  borderRadius: '20px',
                                  padding: '8px 20px'
                                }}
                              >
                                연습 방 만들기
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                    
                    <Row className="mt-4">
                      <Col>
                        <Card className="border-0" style={CARD_STYLES.dark}>
                          <Card.Header className="border-0 bg-transparent p-4">
                            <h6 className="mb-0" style={{color: COLORS.text.primary}}>
                              <i className="bi bi-trophy me-2" style={{color: COLORS.warning.light}}></i>
                              커뮤니티 챌린지
                            </h6>
                          </Card.Header>
                          <Card.Body className="p-4">
                            <div className="mb-4">
                              <h6 style={{color: COLORS.text.primary}}>이번 주 챌린지: 매일 30분 연습하기</h6>
                              <div className="progress mb-3" style={{height: '10px', borderRadius: '5px'}}>
                                <div className="progress-bar" style={{ 
                                  width: '85%',
                                  background: GRADIENTS.primary,
                                  borderRadius: '5px'
                                }}></div>
                              </div>
                              <small style={{color: COLORS.text.tertiary}}>123명 참여 중 · 6일차/7일</small>
                            </div>
                            <Button 
                              style={{
                                ...BUTTON_STYLES.outline,
                                borderRadius: '20px',
                                padding: '8px 20px'
                              }}
                            >
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
          style={{
            ...BUTTON_STYLES.primary,
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            fontSize: '1.5rem',
            zIndex: 1000,
            boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)'
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