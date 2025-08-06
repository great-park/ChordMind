'use client'

import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Form, Table, Modal, Alert } from 'react-bootstrap'
import { QuizType } from '@/types/quiz'
import { useAuth } from '@/contexts/AuthContext'
import { apiClient } from '@/services/apiClient'

interface QuizQuestion {
  id: number
  type: QuizType
  question: string
  answer: string
  explanation: string
  difficulty: number
  choices: Array<{ id: number; text: string }>
}

interface QuizQuestionRequest {
  type: QuizType
  question: string
  answer: string
  explanation: string
  difficulty: number
  choices: string[]
}

const QuizManagementPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth()
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null)
  const [formData, setFormData] = useState<QuizQuestionRequest>({
    type: QuizType.CHORD_NAME,
    question: '',
    answer: '',
    explanation: '',
    difficulty: 1,
    choices: ['', '', '', '']
  })

  useEffect(() => {
    loadQuestions()
  }, [])

  const loadQuestions = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiClient.get<{content: QuizQuestion[]}>('/api/admin/quiz?size=50')
      
      if (response.success && response.data) {
        setQuestions(response.data.content || [])
      } else {
        setError(response.message || '퀴즈 문제를 불러오지 못했습니다.')
      }
    } catch (err) {
      setError('퀴즈 문제를 불러오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      let response
      
      if (editingQuestion) {
        response = await apiClient.put<QuizQuestion>(`/api/admin/quiz/${editingQuestion.id}`, formData)
      } else {
        response = await apiClient.post<QuizQuestion>('/api/admin/quiz', formData)
      }

      if (response.success) {
        setShowModal(false)
        setEditingQuestion(null)
        resetForm()
        loadQuestions()
      } else {
        setError(response.message || '퀴즈 문제 저장에 실패했습니다.')
      }
    } catch (err) {
      setError('퀴즈 문제 저장 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (question: QuizQuestion) => {
    setEditingQuestion(question)
    setFormData({
      type: question.type,
      question: question.question,
      answer: question.answer,
      explanation: question.explanation,
      difficulty: question.difficulty,
      choices: question.choices.map(c => c.text)
    })
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    
    try {
      const response = await fetch(`/api/admin/quiz/${id}`, { method: 'DELETE' })
      if (response.ok) {
        loadQuestions()
      } else {
        setError('퀴즈 문제 삭제에 실패했습니다.')
      }
    } catch (err) {
      setError('퀴즈 문제 삭제에 실패했습니다.')
    }
  }

  const handleGenerateQuestions = async (type: QuizType, count: number) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/quiz/generate?type=${type}&count=${count}`, {
        method: 'POST'
      })
      if (response.ok) {
        loadQuestions()
      } else {
        setError('문제 자동 생성에 실패했습니다.')
      }
    } catch (err) {
      setError('문제 자동 생성에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      type: QuizType.CHORD_NAME,
      question: '',
      answer: '',
      explanation: '',
      difficulty: 1,
      choices: ['', '', '', '']
    })
  }

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

  // TODO: 실제 관리자 권한 체크 로직 추가
  // if (!user?.isAdmin) {
  //   return (
  //     <Container className="py-4">
  //       <Alert variant="danger">
  //         <Alert.Heading>접근 권한이 없습니다</Alert.Heading>
  //         <p>관리자만 이 페이지에 접근할 수 있습니다.</p>
  //       </Alert>
  //     </Container>
  //   )
  // }

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <h2 className="mb-4">퀴즈 문제 관리</h2>
          <p className="text-muted mb-4">
            현재 관리자: <strong>{user?.name || 'Unknown'}</strong>
          </p>
          
          {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
          
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">문제 자동 생성</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>퀴즈 타입</Form.Label>
                    <Form.Select 
                      onChange={(e) => {
                        const type = e.target.value as QuizType
                        handleGenerateQuestions(type, 5)
                      }}
                    >
                      <option value="">타입 선택</option>
                      <option value={QuizType.CHORD_NAME}>코드 이름</option>
                      <option value={QuizType.PROGRESSION}>화성 진행</option>
                      <option value={QuizType.INTERVAL}>음정</option>
                      <option value={QuizType.SCALE}>스케일</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Button 
                    variant="success" 
                    onClick={() => handleGenerateQuestions(QuizType.CHORD_NAME, 5)}
                    disabled={loading}
                  >
                    코드 문제 5개 생성
                  </Button>
                </Col>
                <Col md={3}>
                  <Button 
                    variant="info" 
                    onClick={() => handleGenerateQuestions(QuizType.PROGRESSION, 5)}
                    disabled={loading}
                  >
                    진행 문제 5개 생성
                  </Button>
                </Col>
                <Col md={3}>
                  <Button 
                    variant="warning" 
                    onClick={() => handleGenerateQuestions(QuizType.INTERVAL, 5)}
                    disabled={loading}
                  >
                    음정 문제 5개 생성
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">퀴즈 문제 목록</h5>
              <Button variant="primary" onClick={() => setShowModal(true)}>
                새 문제 추가
              </Button>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center">로딩 중...</div>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>타입</th>
                      <th>문제</th>
                      <th>정답</th>
                      <th>난이도</th>
                      <th>선택지 수</th>
                      <th>작업</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions.map((question) => (
                      <tr key={question.id}>
                        <td>{question.id}</td>
                        <td>{getTypeLabel(question.type)}</td>
                        <td>{question.question}</td>
                        <td>{question.answer}</td>
                        <td>{getDifficultyLabel(question.difficulty)}</td>
                        <td>{question.choices.length}</td>
                        <td>
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            className="me-2"
                            onClick={() => handleEdit(question)}
                          >
                            수정
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => handleDelete(question.id)}
                          >
                            삭제
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 문제 추가/수정 모달 */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingQuestion ? '퀴즈 문제 수정' : '새 퀴즈 문제 추가'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>퀴즈 타입</Form.Label>
                  <Form.Select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as QuizType})}
                    required
                  >
                    <option value={QuizType.CHORD_NAME}>코드 이름</option>
                    <option value={QuizType.PROGRESSION}>화성 진행</option>
                    <option value={QuizType.INTERVAL}>음정</option>
                    <option value={QuizType.SCALE}>스케일</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>난이도</Form.Label>
                  <Form.Select 
                    value={formData.difficulty}
                    onChange={(e) => setFormData({...formData, difficulty: parseInt(e.target.value)})}
                    required
                  >
                    <option value={1}>초급</option>
                    <option value={2}>중급</option>
                    <option value={3}>고급</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>문제</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3}
                value={formData.question}
                onChange={(e) => setFormData({...formData, question: e.target.value})}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>정답</Form.Label>
                  <Form.Control 
                    type="text"
                    value={formData.answer}
                    onChange={(e) => setFormData({...formData, answer: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>해설</Form.Label>
                  <Form.Control 
                    type="text"
                    value={formData.explanation}
                    onChange={(e) => setFormData({...formData, explanation: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>선택지</Form.Label>
              {formData.choices.map((choice, index) => (
                <Form.Control
                  key={index}
                  type="text"
                  placeholder={`선택지 ${index + 1}`}
                  value={choice}
                  onChange={(e) => {
                    const newChoices = [...formData.choices]
                    newChoices[index] = e.target.value
                    setFormData({...formData, choices: newChoices})
                  }}
                  className="mb-2"
                  required
                />
              ))}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              취소
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? '저장 중...' : (editingQuestion ? '수정' : '추가')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  )
}

export default QuizManagementPage 