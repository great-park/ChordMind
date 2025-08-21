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
            💬 피드백 시스템
          </span>
          <h1 className="display-5 fw-bold mb-3" style={{color: COLORS.text.primary}}>
            당신의 <span style={{color: COLORS.primary.light}}>소중한 의견</span>이<br />
            <span style={{color: COLORS.primary.light}}>서비스를 만듭니다</span>
          </h1>
          <p className="lead mb-0" style={{color: COLORS.text.secondary}}>
            ChordMind를 더 나은 서비스로 만들어가는 여정에 함께해주세요
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
              <i className="bi bi-plus-circle me-2"></i>
              피드백 작성
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
              내 피드백
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
              피드백 통계
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
                        <i className="bi bi-plus-circle fs-3" style={{color: COLORS.primary.main}}></i>
                      </div>
                      <div>
                        <h5 className="mb-1" style={{color: COLORS.text.primary}}>새로운 피드백 작성</h5>
                        <small style={{color: COLORS.text.tertiary}}>ChordMind를 더 나은 서비스로 만들어주세요</small>
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
                        <h5 className="mb-1" style={{color: COLORS.text.primary}}>내 피드백 목록</h5>
                        <small style={{color: COLORS.text.tertiary}}>제출한 피드백과 상태를 확인하세요</small>
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
                        <h5 className="mb-1" style={{color: COLORS.text.primary}}>피드백 통계</h5>
                        <small style={{color: COLORS.text.tertiary}}>전체 피드백 현황과 인사이트를 확인하세요</small>
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

        {/* 추가 정보 섹션 */}
        <div className="row justify-content-center mt-5">
          <div className="col-12 col-lg-10">
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
                      <i className="bi bi-lightbulb fs-2 text-white"></i>
                    </div>
                    <h6 style={{color: COLORS.text.primary}}>아이디어 제안</h6>
                    <p className="small mb-0" style={{color: COLORS.text.secondary}}>
                      새로운 기능이나 개선 아이디어를 제안해주세요
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
                      <i className="bi bi-bug fs-2 text-white"></i>
                    </div>
                    <h6 style={{color: COLORS.text.primary}}>버그 리포트</h6>
                    <p className="small mb-0" style={{color: COLORS.text.secondary}}>
                      발견한 문제점을 상세히 보고해주세요
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
                      <i className="bi bi-star fs-2 text-white"></i>
                    </div>
                    <h6 style={{color: COLORS.text.primary}}>사용자 경험</h6>
                    <p className="small mb-0" style={{color: COLORS.text.secondary}}>
                      서비스 사용 경험과 개선점을 공유해주세요
                    </p>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 