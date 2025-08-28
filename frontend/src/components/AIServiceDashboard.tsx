"use client";

import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Badge, ProgressBar, Alert, Spinner } from 'react-bootstrap';
import { 
  AIServiceStatus, 
  AIHarmonyPattern, 
  AIComparisonResult,
  aiService 
} from '../services/aiService';
import { GRADIENTS, COLORS, CARD_STYLES, BADGE_STYLES } from '../constants/styles';

interface AIServiceDashboardProps {
  className?: string;
}

const AIServiceDashboard: React.FC<AIServiceDashboardProps> = ({ className }) => {
  const [status, setStatus] = useState<AIServiceStatus | null>(null);
  const [health, setHealth] = useState<'healthy' | 'degraded' | 'unhealthy'>('healthy');
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPattern, setCurrentPattern] = useState<AIHarmonyPattern | null>(null);
  const [comparisonResult, setComparisonResult] = useState<AIComparisonResult | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<{
    response_times: Record<string, number>;
    success_rates: Record<string, boolean>;
    recommendations: string[];
  } | null>(null);

  useEffect(() => {
    loadAIServiceStatus();
  }, []);

  const loadAIServiceStatus = async () => {
    try {
      setLoading(true);
      const monitoring = await aiService.monitorAIService();
      setStatus(monitoring.status);
      setHealth(monitoring.health);
      setRecommendations(monitoring.recommendations);
    } catch (error) {
      console.error('AI 서비스 상태 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateHarmonyPattern = async () => {
    try {
      const pattern = await aiService.generateEnhancedHarmonyPattern(
        'classical',
        'intermediate',
        8,
        'happy'
      );
      setCurrentPattern(pattern);
    } catch (error) {
      console.error('화성 패턴 생성 실패:', error);
    }
  };

  const compareAIModes = async () => {
    try {
      const comparison = await aiService.compareAIvsEnhanced(
        'jazz',
        'advanced',
        6,
        'mysterious'
      );
      setComparisonResult(comparison);
    } catch (error) {
      console.error('AI 모드 비교 실패:', error);
    }
  };

  const testPerformance = async () => {
    try {
      const metrics = await aiService.testAIServicePerformance();
      setPerformanceMetrics(metrics);
    } catch (error) {
      console.error('성능 테스트 실패:', error);
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'success';
      case 'degraded': return 'warning';
      case 'unhealthy': return 'danger';
      default: return 'secondary';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy': return '✅';
      case 'degraded': return '⚠️';
      case 'unhealthy': return '❌';
      default: return '❓';
    }
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">AI 서비스 상태를 확인하는 중...</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <h2 className="mb-4">🤖 AI 서비스 대시보드</h2>
      
      {/* 서비스 상태 요약 */}
      <Row className="mb-4">
        <Col md={4}>
          <Card style={CARD_STYLES.primary}>
            <Card.Body className="text-center">
              <h3>{getHealthIcon(health)}</h3>
              <h5>전체 상태</h5>
              <Badge bg={getHealthColor(health)} className="fs-6">
                {health === 'healthy' ? '정상' : health === 'degraded' ? '부분 장애' : '장애'}
              </Badge>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card style={CARD_STYLES.secondary}>
            <Card.Body className="text-center">
              <h3>🎵</h3>
              <h5>Harmony AI</h5>
              <Badge bg={status?.harmony_ai.ai_available ? 'success' : 'danger'}>
                {status?.harmony_ai.ai_available ? '사용 가능' : '사용 불가'}
              </Badge>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card style={CARD_STYLES.accent}>
            <Card.Body className="text-center">
              <h3>📚</h3>
              <h5>코퍼스 통합</h5>
              <Badge bg={status?.corpus_integration.available ? 'success' : 'warning'}>
                {status?.corpus_integration.available ? '연결됨' : '연결 안됨'}
              </Badge>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 권장사항 */}
      {recommendations.length > 0 && (
        <Alert variant={health === 'healthy' ? 'info' : 'warning'} className="mb-4">
          <h6>💡 권장사항</h6>
          <ul className="mb-0">
            {recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </Alert>
      )}

      {/* AI 서비스 제어 */}
      <Row className="mb-4">
        <Col>
          <Card style={CARD_STYLES.default}>
            <Card.Body>
              <h5>🎛️ AI 서비스 제어</h5>
              <div className="d-flex gap-2 flex-wrap">
                <Button 
                  variant="primary" 
                  onClick={generateHarmonyPattern}
                  disabled={!status?.composition_service.ai_available}
                >
                  🎵 화성 패턴 생성
                </Button>
                <Button 
                  variant="info" 
                  onClick={compareAIModes}
                  disabled={!status?.harmony_ai.ai_available}
                >
                  🤖 AI vs 고도화 비교
                </Button>
                <Button 
                  variant="success" 
                  onClick={testPerformance}
                >
                  ⚡ 성능 테스트
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={loadAIServiceStatus}
                >
                  🔄 상태 새로고침
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 현재 생성된 화성 패턴 */}
      {currentPattern && (
        <Row className="mb-4">
          <Col>
            <Card style={CARD_STYLES.primary}>
              <Card.Body>
                <h5>🎵 생성된 화성 패턴</h5>
                <div className="mb-3">
                  <strong>패턴:</strong> {currentPattern.pattern_name}<br/>
                  <strong>스타일:</strong> {currentPattern.style}<br/>
                  <strong>난이도:</strong> {currentPattern.difficulty}<br/>
                  <strong>무드:</strong> {currentPattern.mood}<br/>
                  <strong>소스:</strong> {currentPattern.source}
                </div>
                
                <div className="mb-3">
                  <strong>화성 진행:</strong>
                  <div className="d-flex gap-2 flex-wrap mt-2">
                    {currentPattern.chords.map((chord, index) => (
                      <Badge 
                        key={index} 
                        bg="primary" 
                        className="fs-6 px-3 py-2"
                      >
                        {chord}
                      </Badge>
                    ))}
                  </div>
                </div>

                {currentPattern.enhancements && (
                  <div>
                    <strong>적용된 향상기능:</strong>
                    <div className="d-flex gap-2 flex-wrap mt-2">
                      {Object.entries(currentPattern.enhancements).map(([key, value]) => (
                        <Badge 
                          key={key} 
                          bg={value ? 'success' : 'secondary'}
                          className="fs-6"
                        >
                          {key.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* AI vs 고도화 모드 비교 결과 */}
      {comparisonResult && (
        <Row className="mb-4">
          <Col>
            <Card style={CARD_STYLES.accent}>
              <Card.Body>
                <h5>🤖 AI vs 고도화 모드 비교</h5>
                
                <Row>
                  <Col md={6}>
                    <h6>🤖 AI 모드</h6>
                    {comparisonResult.ai_mode ? (
                      <div>
                        <strong>화성:</strong> {comparisonResult.ai_mode.chords.join(' - ')}<br/>
                        <strong>소스:</strong> {comparisonResult.ai_mode.source}
                      </div>
                    ) : (
                      <div className="text-muted">AI 모드를 사용할 수 없습니다.</div>
                    )}
                  </Col>
                  
                  <Col md={6}>
                    <h6>🚀 고도화 모드</h6>
                    <div>
                      <strong>화성:</strong> {comparisonResult.enhanced_mode.chords.join(' - ')}<br/>
                      <strong>소스:</strong> {comparisonResult.enhanced_mode.source}<br/>
                      <strong>복잡도:</strong> {comparisonResult.comparison.pattern_complexity}
                    </div>
                  </Col>
                </Row>

                <div className="mt-3">
                  <strong>비교 결과:</strong>
                  <div className="d-flex gap-2 flex-wrap mt-2">
                    <Badge bg={comparisonResult.comparison.ai_available ? 'success' : 'danger'}>
                      AI 사용 가능: {comparisonResult.comparison.ai_available ? '예' : '아니오'}
                    </Badge>
                    <Badge bg={comparisonResult.comparison.style_specific ? 'success' : 'secondary'}>
                      스타일 특화: {comparisonResult.comparison.style_specific ? '예' : '아니오'}
                    </Badge>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* 성능 메트릭 */}
      {performanceMetrics && (
        <Row className="mb-4">
          <Col>
            <Card style={CARD_STYLES.secondary}>
              <Card.Body>
                <h5>⚡ 성능 메트릭</h5>
                
                <Row>
                  <Col md={6}>
                    <h6>응답 시간</h6>
                    {Object.entries(performanceMetrics.response_times).map(([service, time]) => (
                      <div key={service} className="mb-2">
                        <div className="d-flex justify-content-between">
                          <span>{service}</span>
                          <span>{time}ms</span>
                        </div>
                        <ProgressBar 
                          now={Math.min(time / 10, 100)} 
                          variant={time > 1000 ? 'danger' : time > 500 ? 'warning' : 'success'}
                          className="mt-1"
                        />
                      </div>
                    ))}
                  </Col>
                  
                  <Col md={6}>
                    <h6>성공률</h6>
                    {Object.entries(performanceMetrics.success_rates).map(([service, success]) => (
                      <div key={service} className="mb-2">
                        <Badge bg={success ? 'success' : 'danger'}>
                          {service}: {success ? '성공' : '실패'}
                        </Badge>
                      </div>
                    ))}
                  </Col>
                </Row>

                {performanceMetrics.recommendations.length > 0 && (
                  <div className="mt-3">
                    <strong>성능 권장사항:</strong>
                    <ul className="mb-0">
                      {performanceMetrics.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* 상세 서비스 상태 */}
      <Row>
        <Col>
          <Card style={CARD_STYLES.default}>
            <Card.Body>
              <h5>🔍 상세 서비스 상태</h5>
              
              <Row>
                <Col md={4}>
                  <h6>🎵 Composition Service</h6>
                  <div className="mb-2">
                    <Badge bg={status?.composition_service.ai_available ? 'success' : 'danger'}>
                      AI: {status?.composition_service.ai_available ? '사용 가능' : '사용 불가'}
                    </Badge>
                  </div>
                  <div className="mb-2">
                    <Badge bg={status?.composition_service.corpus_available ? 'success' : 'warning'}>
                      코퍼스: {status?.composition_service.corpus_available ? '사용 가능' : '사용 불가'}
                    </Badge>
                  </div>
                  <div>
                    <strong>모드:</strong> {status?.composition_service.service_mode}
                  </div>
                </Col>
                
                <Col md={4}>
                  <h6>🤖 Harmony AI</h6>
                  <div className="mb-2">
                    <Badge bg={status?.harmony_ai.ai_available ? 'success' : 'danger'}>
                      AI: {status?.harmony_ai.ai_available ? '사용 가능' : '사용 불가'}
                    </Badge>
                  </div>
                  <div className="mb-2">
                    <Badge bg={status?.harmony_ai.model_loaded ? 'success' : 'warning'}>
                      모델: {status?.harmony_ai.model_loaded ? '로드됨' : '로드 안됨'}
                    </Badge>
                  </div>
                  <div>
                    <strong>타입:</strong> {status?.harmony_ai.model_type}
                  </div>
                </Col>
                
                <Col md={4}>
                  <h6>📚 코퍼스 통합</h6>
                  <div className="mb-2">
                    <Badge bg={status?.corpus_integration.available ? 'success' : 'warning'}>
                      상태: {status?.corpus_integration.status}
                    </Badge>
                  </div>
                  <div>
                    <strong>사용 가능:</strong> {status?.corpus_integration.available ? '예' : '아니오'}
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AIServiceDashboard;
