'use client'

import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Alert, ProgressBar, Badge } from 'react-bootstrap'
import { QuizType } from '@/types/quiz'

interface AIFeedback {
  feedback: string
  learningStyle: string
  timeAnalysis: {
    currentTime: number
    averageTime: number
    timeCategory: string
    timeEfficiency: number
  }
  improvementSuggestion: string
}

interface AdaptiveQuestion {
  type: QuizType
  difficulty: number
  pattern: string
  estimatedTime: number
  hints: string[]
}

interface LearningPath {
  recommendations: string[]
  nextTopics: string[]
  estimatedTime: number
  difficultyLevel: string
  enhancedRecommendations?: string[]
  learningStyle?: string
}

interface BehaviorAnalysis {
  totalAttempts: number
  correctAnswers: number
  accuracy: number
  averageTime: number
  learningStyle: string
  improvementRate: number
}

const AIFeatures: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<number>(1)
  const [aiFeedback, setAiFeedback] = useState<AIFeedback | null>(null)
  const [adaptiveQuestion, setAdaptiveQuestion] = useState<AdaptiveQuestion | null>(null)
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null)
  const [behaviorAnalysis, setBehaviorAnalysis] = useState<BehaviorAnalysis | null>(null)
  const [smartHints, setSmartHints] = useState<string[]>([])

  const getTypeLabel = (type: QuizType) => {
    const labels = {
      [QuizType.CHORD_NAME]: '코드 이름',
      [QuizType.PROGRESSION]: '화성 진행',
      [QuizType.INTERVAL]: '음정',
      [QuizType.SCALE]: '스케일'
    }
    return labels[type]
  }

  const getDifficultyLabel = (difficulty: number) => {
    return ['초급', '중급', '고급'][difficulty - 1] || '초급'
  }

  const generatePersonalizedFeedback = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai/personalized-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUserId,
          questionType: QuizType.CHORD_NAME,
          userAnswer: 'Cmaj7',
          correctAnswer: 'Cmaj7',
          isCorrect: true,
          timeSpent: 45
        })
      })

      if (response.ok) {
        const data = await response.json()
        setAiFeedback(data)
      } else {
        setError('개인화된 피드백 생성에 실패했습니다.')
      }
    } catch (err) {
      setError('개인화된 피드백 생성에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const generateAdaptiveQuestion = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai/adaptive-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUserId,
          questionType: QuizType.CHORD_NAME,
          count: 1
        })
      })

      if (response.ok) {
        const data = await response.json()
        setAdaptiveQuestion(data.adaptiveQuestion)
      } else {
        setError('적응형 문제 생성에 실패했습니다.')
      }
    } catch (err) {
      setError('적응형 문제 생성에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const generateLearningPath = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/ai/learning-path/${selectedUserId}`)
      
      if (response.ok) {
        const data = await response.json()
        setLearningPath(data.learningPath)
      } else {
        setError('학습 경로 생성에 실패했습니다.')
      }
    } catch (err) {
      setError('학습 경로 생성에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const analyzeBehavior = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/ai/behavior-analysis/${selectedUserId}`)
      
      if (response.ok) {
        const data = await response.json()
        setBehaviorAnalysis(data.behaviorAnalysis)
      } else {
        setError('행동 분석에 실패했습니다.')
      }
    } catch (err) {
      setError('행동 분석에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const generateSmartHints = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai/smart-hints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUserId,
          questionType: QuizType.CHORD_NAME,
          difficulty: 2,
          showDetailedHints: true
        })
      })

      if (response.ok) {
        const data = await response.json()
        setSmartHints(data.hints)
      } else {
        setError('스마트 힌트 생성에 실패했습니다.')
      }
    } catch (err) {
      setError('스마트 힌트 생성에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <h2 className="mb-4">AI 학습 기능</h2>
          
          {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
          
          {/* 사용자 선택 */}
          <Card className="mb-4">
            <Card.Body>
              <Row>
                <Col md={3}>
                  <label className="form-label">사용자 ID</label>
                  <input
                    type="number"
                    className="form-control"
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(parseInt(e.target.value))}
                    min={1}
                  />
                </Col>
                <Col md={9} className="d-flex align-items-end">
                  <div className="d-flex gap-2">
                    <Button onClick={generatePersonalizedFeedback} disabled={loading}>
                      개인화 피드백
                    </Button>
                    <Button onClick={generateAdaptiveQuestion} disabled={loading}>
                      적응형 문제
                    </Button>
                    <Button onClick={generateLearningPath} disabled={loading}>
                      학습 경로
                    </Button>
                    <Button onClick={analyzeBehavior} disabled={loading}>
                      행동 분석
                    </Button>
                    <Button onClick={generateSmartHints} disabled={loading}>
                      스마트 힌트
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* 개인화된 피드백 */}
          {aiFeedback && (
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">개인화된 피드백</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={8}>
                    <div className="mb-3">
                      <strong>피드백:</strong>
                      <p className="mt-2">{aiFeedback.feedback}</p>
                    </div>
                    <div className="mb-3">
                      <strong>개선 제안:</strong>
                      <p className="mt-2">{aiFeedback.improvementSuggestion}</p>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="mb-3">
                      <strong>학습 스타일:</strong>
                      <Badge bg="info" className="ms-2">{aiFeedback.learningStyle}</Badge>
                    </div>
                    <div className="mb-3">
                      <strong>시간 분석:</strong>
                      <p className="mt-2">
                        현재: {aiFeedback.timeAnalysis.currentTime}초<br/>
                        평균: {aiFeedback.timeAnalysis.averageTime.toFixed(1)}초<br/>
                        카테고리: {aiFeedback.timeAnalysis.timeCategory}<br/>
                        효율성: {aiFeedback.timeAnalysis.timeEfficiency.toFixed(1)}%
                      </p>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}

          {/* 적응형 문제 */}
          {adaptiveQuestion && (
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">적응형 문제</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <strong>문제 유형:</strong> {getTypeLabel(adaptiveQuestion.type)}
                    </div>
                    <div className="mb-3">
                      <strong>난이도:</strong> {getDifficultyLabel(adaptiveQuestion.difficulty)}
                    </div>
                    <div className="mb-3">
                      <strong>패턴:</strong> {adaptiveQuestion.pattern}
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <strong>예상 시간:</strong> {adaptiveQuestion.estimatedTime}초
                    </div>
                    <div className="mb-3">
                      <strong>힌트:</strong>
                      <ul className="mt-2">
                        {adaptiveQuestion.hints.map((hint, index) => (
                          <li key={index}>{hint}</li>
                        ))}
                      </ul>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}

          {/* 학습 경로 */}
          {learningPath && (
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">개인화된 학습 경로</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <strong>추천사항:</strong>
                      <ul className="mt-2">
                        {learningPath.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="mb-3">
                      <strong>다음 주제:</strong>
                      <ul className="mt-2">
                        {learningPath.nextTopics.map((topic, index) => (
                          <li key={index}>{topic}</li>
                        ))}
                      </ul>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <strong>예상 시간:</strong> {learningPath.estimatedTime}분
                    </div>
                    <div className="mb-3">
                      <strong>난이도 레벨:</strong> {learningPath.difficultyLevel}
                    </div>
                    {learningPath.learningStyle && (
                      <div className="mb-3">
                        <strong>학습 스타일:</strong> {learningPath.learningStyle}
                      </div>
                    )}
                    {learningPath.enhancedRecommendations && (
                      <div className="mb-3">
                        <strong>향상된 추천:</strong>
                        <ul className="mt-2">
                          {learningPath.enhancedRecommendations.map((rec, index) => (
                            <li key={index}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}

          {/* 행동 분석 */}
          {behaviorAnalysis && (
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">사용자 행동 분석</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <strong>전체 시도:</strong> {behaviorAnalysis.totalAttempts}회
                    </div>
                    <div className="mb-3">
                      <strong>정답:</strong> {behaviorAnalysis.correctAnswers}회
                    </div>
                    <div className="mb-3">
                      <strong>정확도:</strong> {behaviorAnalysis.accuracy.toFixed(1)}%
                      <ProgressBar 
                        now={behaviorAnalysis.accuracy} 
                        variant={behaviorAnalysis.accuracy >= 80 ? 'success' : behaviorAnalysis.accuracy >= 60 ? 'warning' : 'danger'}
                        className="mt-1"
                      />
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <strong>평균 시간:</strong> {behaviorAnalysis.averageTime.toFixed(1)}초
                    </div>
                    <div className="mb-3">
                      <strong>학습 스타일:</strong> {behaviorAnalysis.learningStyle}
                    </div>
                    <div className="mb-3">
                      <strong>개선률:</strong> {behaviorAnalysis.improvementRate.toFixed(1)}%
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}

          {/* 스마트 힌트 */}
          {smartHints.length > 0 && (
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">스마트 힌트</h5>
              </Card.Header>
              <Card.Body>
                <ul>
                  {smartHints.map((hint, index) => (
                    <li key={index} className="mb-2">{hint}</li>
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

export default AIFeatures 