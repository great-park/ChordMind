'use client'

import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Form, Alert, ProgressBar } from 'react-bootstrap'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement } from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'
import { useAuth } from '../../contexts/AuthContext'
import { apiClient } from '@/services/apiClient'
import { QuizUserStats, UserProgress, DifficultyStats, WeakestArea, GlobalStats } from '../../types/analytics'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement)

const AnalyticsDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<number>(1)
  const [userStats, setUserStats] = useState<QuizUserStats | null>(null)
  const [userProgress, setUserProgress] = useState<UserProgress[]>([])
  const [difficultyStats, setDifficultyStats] = useState<DifficultyStats | null>(null)
  const [weakestAreas, setWeakestAreas] = useState<WeakestArea[]>([])
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null)

  useEffect(() => {
    loadGlobalStats()
    loadUserAnalytics()
  }, [selectedUserId])

  const loadGlobalStats = async () => {
    try {
      setError(null)
      const response = await apiClient.get<GlobalStats>('/api/analytics/global')
      
      if (response.success && response.data) {
        setGlobalStats(response.data)
      } else {
        setError(response.message || '전체 통계를 불러오지 못했습니다.')
      }
    } catch (err) {
      setError('전체 통계를 불러오는 중 오류가 발생했습니다.')
    }
  }

  const loadUserAnalytics = async () => {
    setLoading(true)
    try {
      const [statsRes, progressRes, difficultyRes, weakestRes, recommendationsRes] = await Promise.all([
        fetch(`/api/analytics/user/${selectedUserId}/stats`),
        fetch(`/api/analytics/user/${selectedUserId}/progress`),
        fetch(`/api/analytics/user/${selectedUserId}/difficulty`),
        fetch(`/api/analytics/user/${selectedUserId}/weakest-areas`),
        fetch(`/api/analytics/user/${selectedUserId}/recommendations`)
      ])

      if (statsRes.ok) setUserStats(await statsRes.json())
      if (progressRes.ok) setUserProgress(await progressRes.json())
      if (difficultyRes.ok) setDifficultyStats(await difficultyRes.json())
      if (weakestRes.ok) setWeakestAreas(await weakestRes.json())
      if (recommendationsRes.ok) setRecommendations(await recommendationsRes.json())
    } catch (err) {
      setError('사용자 분석 데이터를 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'CHORD_NAME': '코드 이름',
      'PROGRESSION': '화성 진행',
      'INTERVAL': '음정',
      'SCALE': '스케일'
    }
    return labels[type] || type
  }

  const getDifficultyLabel = (difficulty: string) => {
    return ['초급', '중급', '고급'][parseInt(difficulty) - 1] || '초급'
  }

  const progressChartData = {
    labels: userProgress.map(p => p.date),
    datasets: [
      {
        label: '정확도 (%)',
        data: userProgress.map(p => p.accuracy),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1
      }
    ]
  }

  const typeAccuracyData = {
    labels: userStats ? Object.keys(userStats.typeStats).map(getTypeLabel) : [],
    datasets: [
      {
        label: '정확도 (%)',
        data: userStats ? Object.values(userStats.typeStats).map(s => s.accuracy) : [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
      }
    ]
  }

  // 관리자 권한 체크
  if (!isAuthenticated) {
    return (
      <Container className="py-4">
        <Alert variant="warning">
          <Alert.Heading>로그인이 필요합니다</Alert.Heading>
          <p>관리자 페이지에 접근하려면 먼저 로그인해주세요.</p>
        </Alert>
      </Container>
    )
  }

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <h2 className="mb-4">통계 분석 대시보드</h2>
          <p className="text-muted mb-4">
            현재 관리자: <strong>{user?.name || 'Unknown'}</strong>
          </p>
          
          {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
          
          {/* 사용자 선택 */}
          <Card className="mb-4">
            <Card.Body>
              <Row>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>사용자 ID</Form.Label>
                    <Form.Control
                      type="number"
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(parseInt(e.target.value))}
                      min={1}
                    />
                  </Form.Group>
                </Col>
                <Col md={3} className="d-flex align-items-end">
                  <Button onClick={loadUserAnalytics} disabled={loading}>
                    분석 새로고침
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* 전체 통계 */}
          {globalStats && (
            <Row className="mb-4">
              <Col md={3}>
                <Card className="text-center">
                  <Card.Body>
                    <h4>{globalStats.totalQuestions}</h4>
                    <p className="text-muted">총 문제 수</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center">
                  <Card.Body>
                    <h4>{globalStats.totalResults}</h4>
                    <p className="text-muted">총 응답 수</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center">
                  <Card.Body>
                    <h4>{globalStats.totalCorrect}</h4>
                    <p className="text-muted">총 정답 수</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center">
                  <Card.Body>
                    <h4>{globalStats.globalAccuracy.toFixed(1)}%</h4>
                    <p className="text-muted">전체 정확도</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {/* 사용자 통계 */}
          {userStats && (
            <Row className="mb-4">
              <Col md={6}>
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">사용자 전체 통계</h5>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={4}>
                        <div className="text-center">
                          <h3>{userStats.totalAttempts}</h3>
                          <p className="text-muted">총 시도</p>
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="text-center">
                          <h3>{userStats.correctAnswers}</h3>
                          <p className="text-muted">정답</p>
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="text-center">
                          <h3>{userStats.accuracy.toFixed(1)}%</h3>
                          <p className="text-muted">정확도</p>
                        </div>
                      </Col>
                    </Row>
                    <ProgressBar 
                      now={userStats.accuracy} 
                      variant={userStats.accuracy >= 80 ? 'success' : userStats.accuracy >= 60 ? 'warning' : 'danger'}
                      className="mt-3"
                    />
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">영역별 정확도</h5>
                  </Card.Header>
                  <Card.Body>
                    <Bar data={typeAccuracyData} options={{ responsive: true, scales: { y: { beginAtZero: true, max: 100 } } }} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {/* 진행 상황 차트 */}
          {userProgress.length > 0 && (
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">진행 상황 (최근 30일)</h5>
              </Card.Header>
              <Card.Body>
                <Line data={progressChartData} options={{ responsive: true, scales: { y: { beginAtZero: true, max: 100 } } }} />
              </Card.Body>
            </Card>
          )}

          {/* 난이도별 분석 */}
          {difficultyStats && (
            <Row className="mb-4">
              <Col md={6}>
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">난이도별 성과</h5>
                  </Card.Header>
                  <Card.Body>
                    {Object.entries(difficultyStats.difficultyStats).map(([difficulty, stats]) => (
                      <div key={difficulty} className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <span>{getDifficultyLabel(difficulty)}</span>
                          <span>{stats.accuracy.toFixed(1)}%</span>
                        </div>
                        <ProgressBar 
                          now={stats.accuracy} 
                          variant={stats.accuracy >= 80 ? 'success' : stats.accuracy >= 60 ? 'warning' : 'danger'}
                        />
                        <small className="text-muted">
                          {stats.attempts}회 시도, {stats.correct}회 정답
                        </small>
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">약점 영역</h5>
                  </Card.Header>
                  <Card.Body>
                    {weakestAreas.slice(0, 3).map((area, index) => (
                      <div key={area.type} className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <span>{getTypeLabel(area.type)}</span>
                          <span>{area.accuracy.toFixed(1)}%</span>
                        </div>
                        <ProgressBar 
                          now={area.accuracy} 
                          variant="danger"
                        />
                        <small className="text-muted">
                          {area.attempts}회 시도, {area.correct}회 정답
                        </small>
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {/* 학습 추천 */}
          {recommendations.length > 0 && (
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">맞춤형 학습 추천</h5>
              </Card.Header>
              <Card.Body>
                <ul className="list-unstyled">
                  {recommendations.map((recommendation, index) => (
                    <li key={index} className="mb-2">
                      <i className="bi bi-lightbulb text-warning me-2"></i>
                      {recommendation}
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          )}

          {loading && (
            <div className="text-center py-4">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">로딩 중...</span>
              </div>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default AnalyticsDashboard 