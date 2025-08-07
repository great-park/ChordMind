'use client'

import React, { useState } from 'react'
import { Container, Row, Col, Card, Button, Badge, Modal, ProgressBar } from 'react-bootstrap'

interface PracticeGuide {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: number
  category: string
  steps: string[]
  tips: string[]
  videoUrl?: string
}

const PracticeGuides: React.FC = () => {
  const [selectedGuide, setSelectedGuide] = useState<PracticeGuide | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const guides: PracticeGuide[] = [
    {
      id: 'basic-rhythm',
      title: '기본 리듬 마스터하기',
      description: '4/4박자의 기본 리듬 패턴을 정확하게 연주하는 방법을 배워보세요',
      difficulty: 'beginner',
      duration: 15,
      category: '리듬',
      steps: [
        '메트로놈을 60 BPM으로 설정하세요',
        '4분음표로 박자를 맞춰 연주해보세요',
        '8분음표 패턴을 추가해보세요',
        '16분음표로 세분화해보세요',
        '다양한 리듬 패턴을 조합해보세요'
      ],
      tips: [
        '처음엔 천천히 시작하세요',
        '정확성이 속도보다 중요합니다',
        '꾸준한 연습이 핵심입니다'
      ]
    },
    {
      id: 'chord-progression',
      title: '기본 코드 진행 연습',
      description: 'I-V-vi-IV 진행을 마스터하여 대부분의 팝송을 연주할 수 있게 됩니다',
      difficulty: 'beginner',
      duration: 20,
      category: '화성',
      steps: [
        'C장조에서 C-G-Am-F 코드를 익히세요',
        '각 코드를 4박자씩 연주해보세요',
        '코드 전환을 부드럽게 만들어보세요',
        '다른 조에서도 같은 진행을 연습해보세요',
        '스트럼 패턴을 추가해보세요'
      ],
      tips: [
        '코드 모양을 먼저 암기하세요',
        '손가락 위치를 미리 준비하세요',
        '느린 템포에서 시작하세요'
      ]
    },
    {
      id: 'scale-practice',
      title: '스케일 연습법',
      description: '체계적인 스케일 연습으로 기술력과 음감을 동시에 향상시키세요',
      difficulty: 'intermediate',
      duration: 25,
      category: '테크닉',
      steps: [
        '장음계를 2옥타브로 연주해보세요',
        '단음계(자연, 화성, 멜로딕)를 연습하세요',
        '모드 스케일을 익혀보세요',
        '펜타토닉 스케일을 마스터하세요',
        '블루스 스케일을 추가해보세요'
      ],
      tips: [
        '정확한 운지법을 사용하세요',
        '균등한 속도로 연주하세요',
        '다양한 리듬으로 연습하세요'
      ]
    },
    {
      id: 'improvisation-basics',
      title: '즉흥 연주 입문',
      description: '기본적인 즉흥 연주 기법을 배워 자유롭게 표현해보세요',
      difficulty: 'advanced',
      duration: 30,
      category: '즉흥연주',
      steps: [
        '펜타토닉 스케일로 간단한 멜로디를 만들어보세요',
        '코드톤을 활용한 멜로디를 연습하세요',
        '리듬 변화를 주며 연주해보세요',
        '다양한 아티큘레이션을 시도해보세요',
        '감정을 담아 표현해보세요'
      ],
      tips: [
        '완벽하지 않아도 괜찮습니다',
        '감정을 먼저 생각하세요',
        '많이 들어보세요'
      ]
    }
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'success'
      case 'intermediate': return 'warning'
      case 'advanced': return 'danger'
      default: return 'secondary'
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '초급'
      case 'intermediate': return '중급'
      case 'advanced': return '고급'
      default: return '기타'
    }
  }

  const handleStartGuide = (guide: PracticeGuide) => {
    setSelectedGuide(guide)
    setCurrentStep(0)
    setShowModal(true)
  }

  const handleNextStep = () => {
    if (selectedGuide && currentStep < selectedGuide.steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const progress = selectedGuide ? ((currentStep + 1) / selectedGuide.steps.length) * 100 : 0

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="mb-1">📚 연습 가이드</h2>
          <p className="text-muted">단계별 연습 가이드로 체계적으로 실력을 향상시키세요</p>
        </Col>
      </Row>

      <Row>
        {guides.map((guide) => (
          <Col key={guide.id} lg={6} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h5 className="mb-0">{guide.title}</h5>
                  <div>
                    <Badge bg={getDifficultyColor(guide.difficulty)} className="me-2">
                      {getDifficultyText(guide.difficulty)}
                    </Badge>
                    <Badge bg="info">{guide.duration}분</Badge>
                  </div>
                </div>
                
                <Badge bg="secondary" className="mb-2">
                  {guide.category}
                </Badge>
                
                <p className="text-muted mb-3">{guide.description}</p>
                
                <div className="mb-3">
                  <small className="text-muted">주요 단계:</small>
                  <ul className="mt-2 mb-0">
                    {guide.steps.slice(0, 3).map((step, index) => (
                      <li key={index} className="small text-muted">{step}</li>
                    ))}
                    {guide.steps.length > 3 && (
                      <li className="small text-muted">...외 {guide.steps.length - 3}단계</li>
                    )}
                  </ul>
                </div>
                
                <Button 
                  variant="primary" 
                  onClick={() => handleStartGuide(guide)}
                  className="w-100"
                >
                  가이드 시작하기
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 가이드 진행 모달 */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedGuide?.title}
            <Badge bg="info" className="ms-2">{selectedGuide?.category}</Badge>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedGuide && (
            <>
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span>진행 상황</span>
                  <span>{currentStep + 1} / {selectedGuide.steps.length}</span>
                </div>
                <ProgressBar now={progress} variant="success" />
              </div>

              <Card className="mb-4" style={{ backgroundColor: '#f8f9fa' }}>
                <Card.Body>
                  <h6 className="text-primary">
                    단계 {currentStep + 1}: {selectedGuide.steps[currentStep]}
                  </h6>
                  
                  {currentStep === 0 && selectedGuide.tips.length > 0 && (
                    <div className="mt-3">
                      <small className="text-muted">💡 연습 팁:</small>
                      <ul className="mt-2 mb-0">
                        {selectedGuide.tips.map((tip, index) => (
                          <li key={index} className="small text-muted">{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card.Body>
              </Card>

              {/* 연습 도구 */}
              <Row className="mb-4">
                <Col md={6}>
                  <Card className="text-center">
                    <Card.Body>
                      <h5>🎵 메트로놈</h5>
                      <div className="h3 text-primary">120 BPM</div>
                      <Button variant="outline-primary" size="sm">시작</Button>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="text-center">
                    <Card.Body>
                      <h5>🎙️ 녹음</h5>
                      <div className="mb-2">
                        <small className="text-muted">연습을 녹음해보세요</small>
                      </div>
                      <Button variant="outline-danger" size="sm">녹음</Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="outline-secondary" 
            onClick={handlePrevStep}
            disabled={currentStep === 0}
          >
            이전 단계
          </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            나중에 계속
          </Button>
          {selectedGuide && currentStep < selectedGuide.steps.length - 1 ? (
            <Button variant="primary" onClick={handleNextStep}>
              다음 단계
            </Button>
          ) : (
            <Button variant="success" onClick={() => setShowModal(false)}>
              가이드 완료! 🎉
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default PracticeGuides