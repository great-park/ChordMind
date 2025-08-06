'use client'

import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert, Nav, Tab, Badge } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'

interface AIFeedbackRequest {
  user_id: number
  question_type: string
  user_answer: string
  correct_answer: string
  is_correct: boolean
  time_spent?: number
  difficulty?: number
}

interface AIAdaptiveRequest {
  user_id: number
  question_type: string
  count: number
}

interface AIHintsRequest {
  user_id: number
  question_type: string
  difficulty: number
  show_detailed: boolean
}

const AIFeatures: React.FC = () => {
  const { user, isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState('feedback')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedUserId, setSelectedUserId] = useState(user?.id || 1)

  // 피드백 폼 상태
  const [feedbackForm, setFeedbackForm] = useState<AIFeedbackRequest>({
    user_id: selectedUserId,
    question_type: 'CHORD_NAME',
    user_answer: '',
    correct_answer: '',
    is_correct: false,
    time_spent: 30,
    difficulty: 1
  })

  // 적응형 문제 폼 상태
  const [adaptiveForm, setAdaptiveForm] = useState<AIAdaptiveRequest>({
    user_id: selectedUserId,
    question_type: 'CHORD_NAME',
    count: 3
  })

  // 힌트 폼 상태
  const [hintsForm, setHintsForm] = useState<AIHintsRequest>({
    user_id: selectedUserId,
    question_type: 'CHORD_NAME',
    difficulty: 2,
    show_detailed: false
  })

  // 학습 경로 상태
  const [learningPathUserId, setLearningPathUserId] = useState(selectedUserId)
  const [behaviorUserId, setBehaviorUserId] = useState(selectedUserId)

  // 사용자가 로그인했을 때 폼 업데이트
  useEffect(() => {
    if (user?.id) {
      const userId = user.id
      setSelectedUserId(userId)
      setFeedbackForm(prev => ({ ...prev, user_id: userId }))
      setAdaptiveForm(prev => ({ ...prev, user_id: userId }))
      setHintsForm(prev => ({ ...prev, user_id: userId }))
      setLearningPathUserId(userId)
      setBehaviorUserId(userId)
    }
  }, [user])

  // 사용자 ID 변경 시 폼 업데이트 (관리자용)
  const handleUserIdChange = (newUserId: number) => {
    setSelectedUserId(newUserId)
    setFeedbackForm(prev => ({ ...prev, user_id: newUserId }))
    setAdaptiveForm(prev => ({ ...prev, user_id: newUserId }))
    setHintsForm(prev => ({ ...prev, user_id: newUserId }))
    setLearningPathUserId(newUserId)
    setBehaviorUserId(newUserId)
  }

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/personalized-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackForm)
      })

      if (response.ok) {
        const data = await response.json()
        setResult(data)
      } else {
        const errorData = await response.json()
        setError(errorData.error || '피드백 생성에 실패했습니다.')
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleAdaptiveSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/adaptive-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adaptiveForm)
      })

      if (response.ok) {
        const data = await response.json()
        setResult(data)
      } else {
        const errorData = await response.json()
        setError(errorData.error || '적응형 문제 생성에 실패했습니다.')
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleHintsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/smart-hints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hintsForm)
      })

      if (response.ok) {
        const data = await response.json()
        setResult(data)
      } else {
        const errorData = await response.json()
        setError(errorData.error || '스마트 힌트 생성에 실패했습니다.')
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleLearningPath = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/ai/learning-path/${learningPathUserId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })

      if (response.ok) {
        const data = await response.json()
        setResult(data)
      } else {
        const errorData = await response.json()
        setError(errorData.error || '학습 경로 생성에 실패했습니다.')
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleBehaviorAnalysis = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/ai/behavior-analysis/${behaviorUserId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })

      if (response.ok) {
        const data = await response.json()
        setResult(data)
      } else {
        const errorData = await response.json()
        setError(errorData.error || '행동 분석에 실패했습니다.')
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const renderResult = () => {
    if (!result) return null

    return (
      <Card className="mt-3">
        <Card.Header>
          <h5>결과</h5>
        </Card.Header>
        <Card.Body>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </Card.Body>
      </Card>
    )
  }

  if (!isAuthenticated) {
    return (
      <Container className="py-4">
        <Row>
          <Col>
            <Alert variant="warning">
              <Alert.Heading>로그인이 필요합니다</Alert.Heading>
              <p>AI 기능을 사용하려면 먼저 로그인해주세요.</p>
            </Alert>
          </Col>
        </Row>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <h2 className="mb-4">AI 기능</h2>
          <p className="text-muted mb-4">
            현재 사용자: <Badge bg="primary">{user?.name || 'Unknown'}</Badge>
          </p>
          
          {/* 관리자용 사용자 선택 (개발 시에만 표시) */}
          {process.env.NODE_ENV === 'development' && (
            <Card className="mb-4">
              <Card.Header>
              <h5>사용자 선택</h5>
            </Card.Header>
            <Card.Body>
              <Form.Group>
                <Form.Label>사용자 ID</Form.Label>
                <Form.Select 
                  value={selectedUserId} 
                  onChange={(e) => handleUserIdChange(Number(e.target.value))}
                >
                  <option value={1}>사용자 1</option>
                  <option value={2}>사용자 2</option>
                  <option value={3}>사용자 3</option>
                  <option value={4}>사용자 4</option>
                  <option value={5}>사용자 5</option>
                </Form.Select>
              </Form.Group>
            </Card.Body>
          </Card>
          )}

          <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'feedback')}>
            <Row>
              <Col md={3}>
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link eventKey="feedback">개인화된 피드백</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="adaptive">적응형 문제</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="hints">스마트 힌트</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="learning">학습 경로</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="behavior">행동 분석</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              
              <Col md={9}>
                <Tab.Content>
                  {/* 개인화된 피드백 */}
                  <Tab.Pane eventKey="feedback">
                    <Card>
                      <Card.Header>
                        <h5>개인화된 피드백 생성</h5>
                      </Card.Header>
                      <Card.Body>
                        <Form onSubmit={handleFeedbackSubmit}>
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>문제 타입</Form.Label>
                                <Form.Select
                                  value={feedbackForm.question_type}
                                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, question_type: e.target.value }))}
                                >
                                  <option value="CHORD_NAME">화음 이름</option>
                                  <option value="PROGRESSION">화음 진행</option>
                                  <option value="INTERVAL">음정</option>
                                  <option value="SCALE">음계</option>
                                </Form.Select>
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>난이도</Form.Label>
                                <Form.Select
                                  value={feedbackForm.difficulty}
                                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, difficulty: Number(e.target.value) }))}
                                >
                                  <option value={1}>초급</option>
                                  <option value={2}>중급</option>
                                  <option value={3}>고급</option>
                                </Form.Select>
                              </Form.Group>
                            </Col>
                          </Row>
                          
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>사용자 답안</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={feedbackForm.user_answer}
                                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, user_answer: e.target.value }))}
                                  placeholder="사용자가 입력한 답안"
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>정답</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={feedbackForm.correct_answer}
                                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, correct_answer: e.target.value }))}
                                  placeholder="정답"
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>소요 시간 (초)</Form.Label>
                                <Form.Control
                                  type="number"
                                  value={feedbackForm.time_spent}
                                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, time_spent: Number(e.target.value) }))}
                                  placeholder="30"
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>정답 여부</Form.Label>
                                <Form.Check
                                  type="switch"
                                  checked={feedbackForm.is_correct}
                                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, is_correct: e.target.checked }))}
                                  label="정답"
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          
                          <Button type="submit" disabled={loading}>
                            {loading ? '생성 중...' : '피드백 생성'}
                          </Button>
                        </Form>
                      </Card.Body>
                    </Card>
                  </Tab.Pane>

                  {/* 적응형 문제 */}
                  <Tab.Pane eventKey="adaptive">
                    <Card>
                      <Card.Header>
                        <h5>적응형 문제 생성</h5>
                      </Card.Header>
                      <Card.Body>
                        <Form onSubmit={handleAdaptiveSubmit}>
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>문제 타입</Form.Label>
                                <Form.Select
                                  value={adaptiveForm.question_type}
                                  onChange={(e) => setAdaptiveForm(prev => ({ ...prev, question_type: e.target.value }))}
                                >
                                  <option value="CHORD_NAME">화음 이름</option>
                                  <option value="PROGRESSION">화음 진행</option>
                                  <option value="INTERVAL">음정</option>
                                  <option value="SCALE">음계</option>
                                </Form.Select>
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>문제 개수</Form.Label>
                                <Form.Control
                                  type="number"
                                  min="1"
                                  max="10"
                                  value={adaptiveForm.count}
                                  onChange={(e) => setAdaptiveForm(prev => ({ ...prev, count: Number(e.target.value) }))}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          
                          <Button type="submit" disabled={loading}>
                            {loading ? '생성 중...' : '적응형 문제 생성'}
                          </Button>
                        </Form>
                      </Card.Body>
                    </Card>
                  </Tab.Pane>

                  {/* 스마트 힌트 */}
                  <Tab.Pane eventKey="hints">
                    <Card>
                      <Card.Header>
                        <h5>스마트 힌트 생성</h5>
                      </Card.Header>
                      <Card.Body>
                        <Form onSubmit={handleHintsSubmit}>
                          <Row>
                            <Col md={4}>
                              <Form.Group className="mb-3">
                                <Form.Label>문제 타입</Form.Label>
                                <Form.Select
                                  value={hintsForm.question_type}
                                  onChange={(e) => setHintsForm(prev => ({ ...prev, question_type: e.target.value }))}
                                >
                                  <option value="CHORD_NAME">화음 이름</option>
                                  <option value="PROGRESSION">화음 진행</option>
                                  <option value="INTERVAL">음정</option>
                                  <option value="SCALE">음계</option>
                                </Form.Select>
                              </Form.Group>
                            </Col>
                            <Col md={4}>
                              <Form.Group className="mb-3">
                                <Form.Label>난이도</Form.Label>
                                <Form.Select
                                  value={hintsForm.difficulty}
                                  onChange={(e) => setHintsForm(prev => ({ ...prev, difficulty: Number(e.target.value) }))}
                                >
                                  <option value={1}>초급</option>
                                  <option value={2}>중급</option>
                                  <option value={3}>고급</option>
                                </Form.Select>
                              </Form.Group>
                            </Col>
                            <Col md={4}>
                              <Form.Group className="mb-3">
                                <Form.Label>상세 힌트</Form.Label>
                                <Form.Check
                                  type="switch"
                                  checked={hintsForm.show_detailed}
                                  onChange={(e) => setHintsForm(prev => ({ ...prev, show_detailed: e.target.checked }))}
                                  label="상세 힌트 표시"
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          
                          <Button type="submit" disabled={loading}>
                            {loading ? '생성 중...' : '스마트 힌트 생성'}
                          </Button>
                        </Form>
                      </Card.Body>
                    </Card>
                  </Tab.Pane>

                  {/* 학습 경로 */}
                  <Tab.Pane eventKey="learning">
                    <Card>
                      <Card.Header>
                        <h5>학습 경로 생성</h5>
                      </Card.Header>
                      <Card.Body>
                        <Form.Group className="mb-3">
                          <Form.Label>사용자 ID</Form.Label>
                          <Form.Control
                            type="number"
                            value={learningPathUserId}
                            onChange={(e) => setLearningPathUserId(Number(e.target.value))}
                            min="1"
                          />
                        </Form.Group>
                        
                        <Button onClick={handleLearningPath} disabled={loading}>
                          {loading ? '생성 중...' : '학습 경로 생성'}
                        </Button>
                      </Card.Body>
                    </Card>
                  </Tab.Pane>

                  {/* 행동 분석 */}
                  <Tab.Pane eventKey="behavior">
                    <Card>
                      <Card.Header>
                        <h5>행동 분석</h5>
                      </Card.Header>
                      <Card.Body>
                        <Form.Group className="mb-3">
                          <Form.Label>사용자 ID</Form.Label>
                          <Form.Control
                            type="number"
                            value={behaviorUserId}
                            onChange={(e) => setBehaviorUserId(Number(e.target.value))}
                            min="1"
                          />
                        </Form.Group>
                        
                        <Button onClick={handleBehaviorAnalysis} disabled={loading}>
                          {loading ? '분석 중...' : '행동 분석 실행'}
                        </Button>
                      </Card.Body>
                    </Card>
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>

          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}

          {renderResult()}
        </Col>
      </Row>
    </Container>
  )
}

export default AIFeatures 