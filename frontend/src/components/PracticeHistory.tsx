'use client'

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ProgressBar, Badge, Spinner, Alert } from 'react-bootstrap';
import { practiceService, PracticeSession } from '../services/practiceService';
import { useAuth } from '../contexts/AuthContext';
import { GRADIENTS, COLORS, CARD_STYLES, BADGE_STYLES, BUTTON_STYLES } from '../constants/styles';

const PracticeHistory: React.FC = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('week');
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalTime: 0,
    averageScore: 0,
    bestScore: 0,
    streak: 0
  });

  useEffect(() => {
    if (!user?.id) {
      setError('로그인이 필요합니다.');
      setLoading(false);
      return;
    }

    const loadSessions = async () => {
      try {
        setLoading(true);
        const response = await practiceService.getUserPracticeSessions(user.id, 20);
        if (response.success && response.data) {
          setSessions(response.data.sessions || []);
          
          // 통계 계산
          const sessionsData = response.data.sessions || [];
          const totalSessions = sessionsData.length;
          const totalTime = sessionsData.reduce((sum, session) => sum + session.duration, 0);
          const averageScore = sessionsData.length > 0 
            ? Math.round(sessionsData.reduce((sum, session) => sum + session.overall, 0) / sessionsData.length)
            : 0;
          const bestScore = sessionsData.length > 0 
            ? Math.max(...sessionsData.map(session => session.overall))
            : 0;
          
          setStats({
            totalSessions,
            totalTime,
            averageScore,
            bestScore,
            streak: 5 // 임시 값
          });
        } else {
          setError(response.message || '연습 기록을 불러오지 못했습니다.');
        }
      } catch (err) {
        setError('연습 기록을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, [user?.id, selectedPeriod]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-3" style={{ color: COLORS.text.secondary }}>연습 기록을 불러오는 중...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="border-0" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
        <Alert.Heading>오류 발생</Alert.Heading>
        <p>{error}</p>
      </Alert>
    );
  }

  return (
    <div>
      {/* 통계 카드들 */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <Card.Body className="text-center p-3">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalSessions}</div>
              <small style={{ opacity: 0.9 }}>총 연습 세션</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm" style={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white'
          }}>
            <Card.Body className="text-center p-3">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏱️</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalTime}분</div>
              <small style={{ opacity: 0.9 }}>총 연습 시간</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm" style={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white'
          }}>
            <Card.Body className="text-center p-3">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⭐</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.averageScore}%</div>
              <small style={{ opacity: 0.9 }}>평균 점수</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm" style={{
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: 'white'
          }}>
            <Card.Body className="text-center p-3">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔥</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.streak}일</div>
              <small style={{ opacity: 0.9 }}>연속 연습</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 기간 필터 */}
      <div className="d-flex justify-content-center mb-4">
        <div className="btn-group" role="group">
          {[
            { key: 'week', label: '이번 주' },
            { key: 'month', label: '이번 달' },
            { key: 'all', label: '전체' }
          ].map(period => (
            <Button
              key={period.key}
              variant={selectedPeriod === period.key ? 'primary' : 'outline-primary'}
              onClick={() => setSelectedPeriod(period.key as any)}
              style={{
                borderRadius: period.key === 'week' ? '25px 0 0 25px' : 
                           period.key === 'all' ? '0 25px 25px 0' : '0',
                borderColor: COLORS.primary.main
              }}
            >
              {period.label}
            </Button>
          ))}
        </div>
      </div>
      
      {sessions.length === 0 ? (
        <Card className="border-0 shadow-sm" style={CARD_STYLES.large}>
          <Card.Body className="text-center py-5">
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📈</div>
            <h5 style={{ color: COLORS.text.primary, marginBottom: '1rem' }}>연습 기록이 없습니다</h5>
            <p style={{ color: COLORS.text.secondary }}>
              첫 번째 연습을 시작해보세요!
            </p>
            <Button style={BUTTON_STYLES.primary} href="/practice">
              연습 시작하기
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {sessions.map(session => (
            <Col key={session.id} lg={6} className="mb-4">
              <Card className="border-0 shadow-sm h-100" style={CARD_STYLES.dark}>
                <Card.Header className="border-0 bg-transparent p-3">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className="mb-1" style={{ color: COLORS.text.primary }}>{session.title}</h6>
                      <small style={{ color: COLORS.text.tertiary }}>
                        {new Date(session.updatedAt).toLocaleDateString('ko-KR')} • {session.duration}분 연습
                      </small>
                    </div>
                    <Badge style={{
                      ...BADGE_STYLES.primary,
                      fontSize: '0.8rem'
                    }}>
                      {session.difficulty}
                    </Badge>
                  </div>
                </Card.Header>
                
                <Card.Body className="p-3">
                  {/* 점수 표시 */}
                  <div className="text-center mb-3">
                    <div style={{
                      fontSize: '2.5rem',
                      fontWeight: 'bold',
                      background: GRADIENTS.primary,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      marginBottom: '0.5rem'
                    }}>
                      {session.overall}%
                    </div>
                    <small style={{ color: COLORS.text.secondary }}>전체 점수</small>
                  </div>

                  {/* 세부 점수 */}
                  <Row className="mb-3">
                    <Col xs={6} className="text-center">
                      <div style={{ color: COLORS.success.main, fontSize: '1.2rem', fontWeight: 'bold' }}>
                        {session.accuracy}%
                      </div>
                      <small style={{ color: COLORS.text.tertiary }}>정확도</small>
                    </Col>
                    <Col xs={6} className="text-center">
                      <div style={{ color: COLORS.info.main, fontSize: '1.2rem', fontWeight: 'bold' }}>
                        {session.rhythm}%
                      </div>
                      <small style={{ color: COLORS.text.tertiary }}>박자</small>
                    </Col>
                  </Row>
                  
                  <Row className="mb-3">
                    <Col xs={6} className="text-center">
                      <div style={{ color: COLORS.warning.main, fontSize: '1.2rem', fontWeight: 'bold' }}>
                        {session.technique}%
                      </div>
                      <small style={{ color: COLORS.text.tertiary }}>테크닉</small>
                    </Col>
                    <Col xs={6} className="text-center">
                      <div style={{ color: COLORS.danger.main, fontSize: '1.2rem', fontWeight: 'bold' }}>
                        {session.expression}%
                      </div>
                      <small style={{ color: COLORS.text.tertiary }}>표현력</small>
                    </Col>
                  </Row>

                  {/* 집중 영역 */}
                  <div className="mb-3">
                    <small style={{ color: COLORS.text.secondary }}>집중 영역:</small>
                    <div className="mt-1">
                      {session.focusAreas.map((area, index) => (
                        <Badge key={index} style={{
                          ...BADGE_STYLES.info,
                          fontSize: '0.7rem',
                          marginRight: '0.25rem'
                        }}>
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* 액션 버튼 */}
                  <div className="d-flex justify-content-end">
                    <Button
                      size="sm"
                      style={{
                        ...BUTTON_STYLES.outline,
                        fontSize: '0.8rem',
                        padding: '0.25rem 0.75rem'
                      }}
                    >
                      <i className="bi bi-eye me-1"></i>
                      상세 보기
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default PracticeHistory; 