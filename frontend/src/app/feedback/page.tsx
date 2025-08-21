'use client'

import { useState, useEffect } from 'react';
import FeedbackForm from '../../components/FeedbackForm';
import FeedbackList from '../../components/FeedbackList';
import FeedbackStats from '../../components/FeedbackStats';
import { GRADIENTS, COLORS, CARD_STYLES, BADGE_STYLES, BUTTON_STYLES } from '../../constants/styles';
import { Button, Card } from 'react-bootstrap';

export default function Feedback() {
  const [activeTab, setActiveTab] = useState<'create' | 'list' | 'stats'>('create');

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: GRADIENTS.dark,
      padding: '2rem 0'
    }}>
      <div className="container-fluid">
        {/* 헤더 섹션 */}
        <div className="text-center mb-5">
          <span className="badge px-3 py-2 rounded-pill mb-3" style={{
            ...BADGE_STYLES.primary,
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            🎵 AI 연주 피드백
          </span>
          <h1 className="display-5 fw-bold mb-3" style={{color: COLORS.text.primary}}>
            AI가 분석하는 <span style={{color: COLORS.primary.light}}>당신의 연주</span><br />
            <span style={{color: COLORS.primary.light}}>정확한 피드백</span>으로 성장하세요
          </h1>
          <p className="lead mb-0" style={{color: COLORS.text.secondary}}>
            실시간 연주 분석과 AI 코칭으로 연주 실력을 한 단계 끌어올리세요
          </p>
        </div>

        {/* 탭 네비게이션 */}
        <div className="d-flex justify-content-center mb-5">
          <div className="d-flex gap-2 flex-wrap justify-content-center">
            <Button 
              variant={activeTab === 'create' ? 'primary' : 'outline-primary'}
              onClick={() => setActiveTab('create')}
              style={{
                ...(activeTab === 'create' ? BUTTON_STYLES.primary : BUTTON_STYLES.outline),
                padding: '12px 24px',
                borderRadius: '25px',
                fontSize: '1rem'
              }}
            >
              <i className="bi bi-mic me-2"></i>
              연주 녹음
            </Button>
            <Button 
              variant={activeTab === 'list' ? 'primary' : 'outline-primary'}
              onClick={() => setActiveTab('list')}
              style={{
                ...(activeTab === 'list' ? BUTTON_STYLES.primary : BUTTON_STYLES.outline),
                padding: '12px 24px',
                borderRadius: '25px',
                fontSize: '1rem'
              }}
            >
              <i className="bi bi-list-ul me-2"></i>
              피드백 기록
            </Button>
            <Button 
              variant={activeTab === 'stats' ? 'primary' : 'outline-primary'}
              onClick={() => setActiveTab('stats')}
              style={{
                ...(activeTab === 'stats' ? BUTTON_STYLES.primary : BUTTON_STYLES.outline),
                padding: '12px 24px',
                borderRadius: '25px',
                fontSize: '1rem'
              }}
            >
              <i className="bi bi-graph-up me-2"></i>
              성장 분석
            </Button>
          </div>
        </div>

        {/* 탭 콘텐츠 */}
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            {activeTab === 'create' && (
              <div className="tab-pane fade show active">
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
                        <i className="bi bi-mic fs-3" style={{color: COLORS.primary.main}}></i>
                      </div>
                      <div>
                        <h5 className="mb-1" style={{color: COLORS.text.primary}}>연주 녹음 및 분석</h5>
                        <small style={{color: COLORS.text.tertiary}}>AI가 당신의 연주를 분석하고 개선점을 제안합니다</small>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <FeedbackForm />
                  </Card.Body>
                </Card>
              </div>
            )}

            {activeTab === 'list' && (
              <div className="tab-pane fade show active">
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
                        <i className="bi bi-list-ul fs-3" style={{color: COLORS.info.main}}></i>
                      </div>
                      <div>
                        <h5 className="mb-1" style={{color: COLORS.text.primary}}>피드백 기록 및 히스토리</h5>
                        <small style={{color: COLORS.text.tertiary}}>이전 연주 분석 결과와 개선 사항을 확인하세요</small>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <FeedbackList />
                  </Card.Body>
                </Card>
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="tab-pane fade show active">
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
                        <i className="bi bi-graph-up fs-3" style={{color: COLORS.success.main}}></i>
                      </div>
                      <div>
                        <h5 className="mb-1" style={{color: COLORS.text.primary}}>연주 성장 분석</h5>
                        <small style={{color: COLORS.text.tertiary}}>AI 분석을 통한 연주 실력 향상 추이를 확인하세요</small>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <FeedbackStats />
                  </Card.Body>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* AI 피드백 기능 소개 */}
        <div className="row justify-content-center mt-5">
          <div className="col-12 col-lg-10">
            <div className="text-center mb-4">
              <h3 style={{color: COLORS.text.primary}}>🤖 AI가 분석하는 연주 요소</h3>
              <p style={{color: COLORS.text.secondary}}>ChordMind AI가 정확하게 분석하고 피드백을 제공합니다</p>
            </div>
            <div className="row g-4">
              <div className="col-md-4">
                <Card className="border-0 text-center h-100" style={{
                  background: 'rgba(139, 92, 246, 0.1)',
                  borderRadius: '16px',
                  border: '1px solid rgba(139, 92, 246, 0.2)'
                }}>
                  <Card.Body className="p-4">
                    <div className="mb-3" style={{
                      width: '60px',
                      height: '60px',
                      background: GRADIENTS.primary,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto'
                    }}>
                      <i className="bi bi-music-note fs-2 text-white"></i>
                    </div>
                    <h6 style={{color: COLORS.text.primary}}>음정 정확도</h6>
                    <p className="small mb-0" style={{color: COLORS.text.secondary}}>
                      연주한 음의 정확도를 실시간으로 분석하고 개선점을 제시합니다
                    </p>
                  </Card.Body>
                </Card>
              </div>
              <div className="col-md-4">
                <Card className="border-0 text-center h-100" style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  borderRadius: '16px',
                  border: '1px solid rgba(34, 197, 94, 0.2)'
                }}>
                  <Card.Body className="p-4">
                    <div className="mb-3" style={{
                      width: '60px',
                      height: '60px',
                      background: GRADIENTS.success,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto'
                    }}>
                      <i className="bi bi-clock fs-2 text-white"></i>
                    </div>
                    <h6 style={{color: COLORS.text.primary}}>리듬과 박자</h6>
                    <p className="small mb-0" style={{color: COLORS.text.secondary}}>
                      정확한 박자와 리듬감을 측정하고 타이밍 개선을 도와줍니다
                    </p>
                  </Card.Body>
                </Card>
              </div>
              <div className="col-md-4">
                <Card className="border-0 text-center h-100" style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  borderRadius: '16px',
                  border: '1px solid rgba(245, 158, 11, 0.2)'
                }}>
                  <Card.Body className="p-4">
                    <div className="mb-3" style={{
                      width: '60px',
                      height: '60px',
                      background: GRADIENTS.warning,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto'
                    }}>
                      <i className="bi bi-chord fs-2 text-white"></i>
                    </div>
                    <h6 style={{color: COLORS.text.primary}}>화성학 분석</h6>
                    <p className="small mb-0" style={{color: COLORS.text.secondary}}>
                      코드 진행과 화성 구조를 분석하여 음악적 이해를 돕습니다
                    </p>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* 연주 팁 섹션 */}
        <div className="row justify-content-center mt-5">
          <div className="col-12 col-lg-10">
            <Card className="border-0" style={{
              background: 'rgba(139, 92, 246, 0.05)',
              borderRadius: '20px',
              border: '1px solid rgba(139, 92, 246, 0.1)'
            }}>
              <Card.Body className="p-4">
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <h5 style={{color: COLORS.text.primary}}>
                      <i className="bi bi-lightbulb me-2" style={{color: COLORS.warning.light}}></i>
                      AI 연주 피드백 활용 팁
                    </h5>
                    <ul className="mb-0" style={{color: COLORS.text.secondary}}>
                      <li>정기적으로 연주를 녹음하여 AI 분석을 받아보세요</li>
                      <li>AI가 제안한 개선점을 바탕으로 연습 계획을 세우세요</li>
                      <li>피드백 히스토리를 통해 연주 실력 향상 추이를 확인하세요</li>
                      <li>특정 곡이나 연주 기법에 대한 맞춤형 피드백을 요청하세요</li>
                    </ul>
                  </div>
                  <div className="col-md-4 text-center">
                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle" style={{
                      width: '80px',
                      height: '80px',
                      background: GRADIENTS.primary,
                      color: 'white'
                    }}>
                      <span className="fs-2">💡</span>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 