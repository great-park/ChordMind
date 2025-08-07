'use client'

import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Badge, Alert, Button, ProgressBar } from 'react-bootstrap'
import { useAuth } from '@/contexts/AuthContext'

interface ServiceHealth {
  service: string
  status: 'UP' | 'DOWN' | 'DEGRADED'
  timestamp: string
  responseTime: number
  version?: string
  details?: any
}

interface SystemHealth {
  timestamp: string
  services: Record<string, ServiceHealth>
  overall: 'UP' | 'DOWN' | 'DEGRADED'
  criticalServices: string[]
}

const SystemMonitoringPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth()
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(30) // 30초

  const loadSystemHealth = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // API Gateway를 통해 헬스체크 조회
      const response = await fetch('/health/services')
      
      if (response.ok) {
        const data = await response.json()
        setSystemHealth(data)
      } else {
        setError('시스템 상태 정보를 가져오는데 실패했습니다.')
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSystemHealth()
  }, [])

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(loadSystemHealth, refreshInterval * 1000)
      return () => clearInterval(interval)
    }
  }, [autoRefresh, refreshInterval])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'UP': return 'success'
      case 'DOWN': return 'danger'
      case 'DEGRADED': return 'warning'
      default: return 'secondary'
    }
  }

  const getOverallHealthPercentage = () => {
    if (!systemHealth) return 0
    
    const services = Object.values(systemHealth.services)
    const upServices = services.filter(s => s.status === 'UP').length
    return Math.round((upServices / services.length) * 100)
  }

  // 관리자 권한 체크
  if (!isAuthenticated) {
    return (
      <Container className="py-4">
        <Alert variant="warning">
          <Alert.Heading>로그인이 필요합니다</Alert.Heading>
          <p>시스템 모니터링에 접근하려면 먼저 로그인해주세요.</p>
        </Alert>
      </Container>
    )
  }

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2>🖥️ 시스템 모니터링</h2>
              <p className="text-muted">
                현재 관리자: <strong>{user?.name || 'Unknown'}</strong>
              </p>
            </div>
            <div className="d-flex gap-2">
              <Button 
                variant="outline-primary" 
                onClick={loadSystemHealth}
                disabled={loading}
              >
                {loading ? '새로고침 중...' : '🔄 새로고침'}
              </Button>
              <Button 
                variant={autoRefresh ? 'success' : 'outline-secondary'}
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                {autoRefresh ? '⏸️ 자동새로고침 중' : '▶️ 자동새로고침'}
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}

          {systemHealth && (
            <>
              {/* 전체 시스템 상태 */}
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">🎯 전체 시스템 상태</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={4}>
                      <div className="text-center">
                        <h3>
                          <Badge bg={getStatusColor(systemHealth.overall)}>
                            {systemHealth.overall}
                          </Badge>
                        </h3>
                        <p className="text-muted">전체 상태</p>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="text-center">
                        <h3>{getOverallHealthPercentage()}%</h3>
                        <ProgressBar 
                          variant={getOverallHealthPercentage() >= 80 ? 'success' : 'warning'}
                          now={getOverallHealthPercentage()} 
                        />
                        <p className="text-muted mt-2">서비스 가용률</p>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="text-center">
                        <h3>{Object.keys(systemHealth.services).length}</h3>
                        <p className="text-muted">등록된 서비스</p>
                      </div>
                    </Col>
                  </Row>
                  <div className="mt-3">
                    <small className="text-muted">
                      마지막 업데이트: {new Date(systemHealth.timestamp).toLocaleString()}
                    </small>
                  </div>
                </Card.Body>
              </Card>

              {/* 개별 서비스 상태 */}
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">🔧 서비스별 상태</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    {Object.entries(systemHealth.services).map(([serviceName, health]) => (
                      <Col md={6} lg={4} key={serviceName} className="mb-3">
                        <Card className={`h-100 border-${getStatusColor(health.status)}`}>
                          <Card.Body>
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <h6 className="mb-0">{serviceName}</h6>
                              <Badge bg={getStatusColor(health.status)}>
                                {health.status}
                              </Badge>
                            </div>
                            
                            <div className="small text-muted">
                              <div>응답시간: {health.responseTime}ms</div>
                              {health.version && <div>버전: {health.version}</div>}
                              <div>체크시간: {new Date(health.timestamp).toLocaleTimeString()}</div>
                            </div>
                            
                            {systemHealth.criticalServices.includes(serviceName) && (
                              <Badge bg="danger" className="mt-2">
                                핵심 서비스
                              </Badge>
                            )}
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>

              {/* 설정 */}
              <Card>
                <Card.Header>
                  <h5 className="mb-0">⚙️ 모니터링 설정</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <div className="mb-3">
                        <label className="form-label">자동 새로고침 간격</label>
                        <select 
                          className="form-select"
                          value={refreshInterval}
                          onChange={(e) => setRefreshInterval(Number(e.target.value))}
                        >
                          <option value={10}>10초</option>
                          <option value={30}>30초</option>
                          <option value={60}>1분</option>
                          <option value={300}>5분</option>
                        </select>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-3">
                        <label className="form-label">알림 설정</label>
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" id="alertsEnabled" />
                          <label className="form-check-label" htmlFor="alertsEnabled">
                            서비스 장애 시 알림 받기
                          </label>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </>
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default SystemMonitoringPage