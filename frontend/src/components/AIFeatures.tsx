'use client'

import React, { useState } from 'react'
import { Container, Row, Col, Card, Button, Form, Alert, Spinner } from 'react-bootstrap'

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
  const [activeTab, setActiveTab] = useState('feedback')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  // 피드백 폼 상태
  const [feedbackForm, setFeedbackForm] = useState<AIFeedbackRequest>({
    user_id: 1,
    question_type: 'CHORD_NAME',
    user_answer: '',
    correct_answer: '',
    is_correct: false,
    time_spent: 30,
    difficulty: 1
  })

  // 적응형 문제 폼 상태
  const [adaptiveForm, setAdaptiveForm] = useState<AIAdaptiveRequest>({
    user_id: 1,
    question_type: 'CHORD_NAME',
    count: 3
  })

  // 힌트 폼 상태
  const [hintsForm, setHintsForm] = useState<AIHintsRequest>({
    user_id: 1,
    question_type: 'CHORD_NAME',
    difficulty: 2,
    show_detailed: false
  })

  // 학습 경로 상태
  const [learningPathUserId, setLearningPathUserId] = useState(1)
  const [behaviorUserId, setBehaviorUserId] = useState(1)

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
      const response = await fetch(`/api/ai/learning-path/${learningPathUserId}`)

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
      const response = await fetch(`/api/ai/behavior-analysis/${behaviorUserId}`)

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

  return (
    <Container className="py-4">
      <h1 className="text-center mb-4">AI 기능</h1>
      
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-center">
            <Button
              variant={activeTab === 'feedback' ? 'primary' : 'outline-primary'}
              className="mx-2"
              onClick={() => setActiveTab('feedback')}
            >
              개인화된 피드백
            </Button>
            <Button
              variant={activeTab === 'adaptive' ? 'primary' : 'outline-primary'}
              className="mx-2"
              onClick={() => setActiveTab('adaptive')}
            >
              적응형 문제
            </Button>
            <Button
              variant={activeTab === 'hints' ? 'primary' : 'outline-primary'}
              className="mx-2"
              onClick={() => setActiveTab('hints')}
            >
              스마트 힌트
            </Button>
            <Button
              variant={activeTab === 'learning' ? 'primary' : 'outline-primary'}
              className="mx-2"
              onClick={() => setActiveTab('learning')}
            >
              학습 경로
            </Button>
            <Button
              variant={activeTab === 'behavior' ? 'primary' : 'outline-primary'}
              className="mx-2"
              onClick={() => setActiveTab('behavior')}
            >
              행동 분석
            </Button>
          </div>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      <Row>
        <Col md={6}>
          <Card>
            <Card.Header>
              {activeTab === 'feedback' && '개인화된 피드백 생성'}
              {activeTab === 'adaptive' && '적응형 문제 생성'}
              {activeTab === 'hints' && '스마트 힌트 생성'}
              {activeTab === 'learning' && '학습 경로 생성'}
              {activeTab === 'behavior' && '행동 분석'}
            </Card.Header>
            <Card.Body>
              {activeTab === 'feedback' && (
                <Form onSubmit={handleFeedbackSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>사용자 ID</Form.Label>
                    <Form.Control
                      type="number"
                      value={feedbackForm.user_id}
                      onChange={(e) => setFeedbackForm({...feedbackForm, user_id: parseInt(e.target.value)})}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>문제 유형</Form.Label>
                    <Form.Select
                      value={feedbackForm.question_type}
                      onChange={(e) => setFeedbackForm({...feedbackForm, question_type: e.target.value})}
                    >
                      <option value="CHORD_NAME">화음 이름</option>
                      <option value="PROGRESSION">화음 진행</option>
                      <option value="INTERVAL">음정</option>
                      <option value="SCALE">음계</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>사용자 답변</Form.Label>
                    <Form.Control
                      type="text"
                      value={feedbackForm.user_answer}
                      onChange={(e) => setFeedbackForm({...feedbackForm, user_answer: e.target.value})}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>정답</Form.Label>
                    <Form.Control
                      type="text"
                      value={feedbackForm.correct_answer}
                      onChange={(e) => setFeedbackForm({...feedbackForm, correct_answer: e.target.value})}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      label="정답 여부"
                      checked={feedbackForm.is_correct}
                      onChange={(e) => setFeedbackForm({...feedbackForm, is_correct: e.target.checked})}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>소요 시간 (초)</Form.Label>
                    <Form.Control
                      type="number"
                      value={feedbackForm.time_spent}
                      onChange={(e) => setFeedbackForm({...feedbackForm, time_spent: parseInt(e.target.value)})}
                    />
                  </Form.Group>
                  <Button type="submit" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : '피드백 생성'}
                  </Button>
                </Form>
              )}

              {activeTab === 'adaptive' && (
                <Form onSubmit={handleAdaptiveSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>사용자 ID</Form.Label>
                    <Form.Control
                      type="number"
                      value={adaptiveForm.user_id}
                      onChange={(e) => setAdaptiveForm({...adaptiveForm, user_id: parseInt(e.target.value)})}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>문제 유형</Form.Label>
                    <Form.Select
                      value={adaptiveForm.question_type}
                      onChange={(e) => setAdaptiveForm({...adaptiveForm, question_type: e.target.value})}
                    >
                      <option value="CHORD_NAME">화음 이름</option>
                      <option value="PROGRESSION">화음 진행</option>
                      <option value="INTERVAL">음정</option>
                      <option value="SCALE">음계</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>문제 개수</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      max="10"
                      value={adaptiveForm.count}
                      onChange={(e) => setAdaptiveForm({...adaptiveForm, count: parseInt(e.target.value)})}
                    />
                  </Form.Group>
                  <Button type="submit" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : '적응형 문제 생성'}
                  </Button>
                </Form>
              )}

              {activeTab === 'hints' && (
                <Form onSubmit={handleHintsSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>사용자 ID</Form.Label>
                    <Form.Control
                      type="number"
                      value={hintsForm.user_id}
                      onChange={(e) => setHintsForm({...hintsForm, user_id: parseInt(e.target.value)})}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>문제 유형</Form.Label>
                    <Form.Select
                      value={hintsForm.question_type}
                      onChange={(e) => setHintsForm({...hintsForm, question_type: e.target.value})}
                    >
                      <option value="CHORD_NAME">화음 이름</option>
                      <option value="PROGRESSION">화음 진행</option>
                      <option value="INTERVAL">음정</option>
                      <option value="SCALE">음계</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>난이도</Form.Label>
                    <Form.Select
                      value={hintsForm.difficulty}
                      onChange={(e) => setHintsForm({...hintsForm, difficulty: parseInt(e.target.value)})}
                    >
                      <option value={1}>초급</option>
                      <option value={2}>중급</option>
                      <option value={3}>고급</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      label="상세 힌트 표시"
                      checked={hintsForm.show_detailed}
                      onChange={(e) => setHintsForm({...hintsForm, show_detailed: e.target.checked})}
                    />
                  </Form.Group>
                  <Button type="submit" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : '스마트 힌트 생성'}
                  </Button>
                </Form>
              )}

              {activeTab === 'learning' && (
                <div>
                  <Form.Group className="mb-3">
                    <Form.Label>사용자 ID</Form.Label>
                    <Form.Control
                      type="number"
                      value={learningPathUserId}
                      onChange={(e) => setLearningPathUserId(parseInt(e.target.value))}
                    />
                  </Form.Group>
                  <Button onClick={handleLearningPath} disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : '학습 경로 생성'}
                  </Button>
                </div>
              )}

              {activeTab === 'behavior' && (
                <div>
                  <Form.Group className="mb-3">
                    <Form.Label>사용자 ID</Form.Label>
                    <Form.Control
                      type="number"
                      value={behaviorUserId}
                      onChange={(e) => setBehaviorUserId(parseInt(e.target.value))}
                    />
                  </Form.Group>
                  <Button onClick={handleBehaviorAnalysis} disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : '행동 분석'}
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header>결과</Card.Header>
            <Card.Body>
              {result ? (
                <pre className="bg-light p-3 rounded" style={{maxHeight: '400px', overflow: 'auto'}}>
                  {JSON.stringify(result, null, 2)}
                </pre>
              ) : (
                <p className="text-muted">결과가 여기에 표시됩니다.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default AIFeatures 