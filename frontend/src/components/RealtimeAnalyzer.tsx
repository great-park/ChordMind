'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Container, Row, Col, Card, ProgressBar, Badge, Alert } from 'react-bootstrap'

interface AnalysisData {
  timestamp: number
  tempo: number
  pitch: number
  rhythm: number
  overall: number
  recommendations: string[]
}

interface PitchData {
  note: string
  frequency: number
  accuracy: number
}

const RealtimeAnalyzer: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisData | null>(null)
  const [pitchHistory, setPitchHistory] = useState<PitchData[]>([])
  const [audioLevel, setAudioLevel] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  // 모의 실시간 분석 데이터 생성
  useEffect(() => {
    if (isAnalyzing) {
      const interval = setInterval(() => {
        const newAnalysis: AnalysisData = {
          timestamp: Date.now(),
          tempo: Math.random() * 20 + 80, // 80-100%
          pitch: Math.random() * 15 + 85, // 85-100%
          rhythm: Math.random() * 10 + 90, // 90-100%
          overall: Math.random() * 15 + 85, // 85-100%
          recommendations: generateRecommendations()
        }
        setCurrentAnalysis(newAnalysis)
        
        // 음정 히스토리 업데이트
        const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
        const randomNote = notes[Math.floor(Math.random() * notes.length)]
        const newPitch: PitchData = {
          note: randomNote + '4',
          frequency: 440 * Math.pow(2, Math.random() * 2 - 1), // A4 기준 ±1옥타브
          accuracy: Math.random() * 20 + 80
        }
        
        setPitchHistory(prev => [...prev.slice(-9), newPitch]) // 최근 10개만 유지
        setAudioLevel(Math.random() * 100)
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [isAnalyzing])

  // 웨이브폼 시각화
  useEffect(() => {
    if (isAnalyzing && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        // 웨이브폼 그리기
        ctx.strokeStyle = '#667eea'
        ctx.lineWidth = 2
        ctx.beginPath()
        
        for (let i = 0; i < canvas.width; i++) {
          const y = canvas.height / 2 + Math.sin(i * 0.05 + Date.now() * 0.01) * audioLevel * 0.3
          if (i === 0) ctx.moveTo(i, y)
          else ctx.lineTo(i, y)
        }
        
        ctx.stroke()
        
        // 주파수 스펙트럼 그리기 (하단)
        ctx.fillStyle = '#667eea'
        for (let i = 0; i < 50; i++) {
          const height = Math.random() * audioLevel
          const x = i * (canvas.width / 50)
          const y = canvas.height - height
          ctx.fillRect(x, y, canvas.width / 50 - 2, height)
        }
        
        animationRef.current = requestAnimationFrame(draw)
      }
      
      draw()
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isAnalyzing, audioLevel])

  const generateRecommendations = (): string[] => {
    const recommendations = [
      '템포를 조금 더 일정하게 유지해보세요',
      '박자에 더 집중해서 연주해보세요',
      '음정이 불안정합니다. 천천히 연주해보세요',
      '리듬이 매우 좋습니다! 이 상태를 유지하세요',
      '음량을 조금 더 일정하게 조절해보세요',
      '연주가 안정적입니다. 속도를 올려보세요'
    ]
    
    return recommendations.slice(0, Math.floor(Math.random() * 3) + 1)
  }

  const getScoreColor = (score: number) => {
    if (score >= 95) return 'success'
    if (score >= 85) return 'info'
    if (score >= 75) return 'warning'
    return 'danger'
  }

  const getScoreText = (score: number) => {
    if (score >= 95) return '훌륭함'
    if (score >= 85) return '좋음'
    if (score >= 75) return '보통'
    return '개선 필요'
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">🎤 실시간 연주 분석</h2>
              <p className="text-muted">AI가 실시간으로 연주를 분석하고 피드백을 제공합니다</p>
            </div>
            <div>
              <button
                className={`btn ${isAnalyzing ? 'btn-danger' : 'btn-success'} btn-lg`}
                onClick={() => setIsAnalyzing(!isAnalyzing)}
              >
                {isAnalyzing ? '⏹️ 분석 중지' : '🎵 분석 시작'}
              </button>
            </div>
          </div>
        </Col>
      </Row>

      {isAnalyzing && (
        <>
          {/* 오디오 시각화 */}
          <Row className="mb-4">
            <Col>
              <Card>
                <Card.Header>
                  <h6 className="mb-0">🌊 오디오 시각화</h6>
                </Card.Header>
                <Card.Body>
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={200}
                    style={{ width: '100%', height: '200px', border: '1px solid #dee2e6' }}
                  />
                  <div className="mt-2 d-flex justify-content-between">
                    <small className="text-muted">시간</small>
                    <small className="text-muted">
                      입력 레벨: <Badge bg={audioLevel > 70 ? 'success' : audioLevel > 30 ? 'warning' : 'danger'}>
                        {audioLevel.toFixed(0)}%
                      </Badge>
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* 실시간 분석 결과 */}
          {currentAnalysis && (
            <Row className="mb-4">
              <Col lg={8}>
                <Card>
                  <Card.Header>
                    <h6 className="mb-0">📊 실시간 분석 결과</h6>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={3}>
                        <div className="text-center mb-3">
                          <h4 className={`text-${getScoreColor(currentAnalysis.overall)}`}>
                            {currentAnalysis.overall.toFixed(1)}%
                          </h4>
                          <small className="text-muted">종합 점수</small>
                          <div>
                            <Badge bg={getScoreColor(currentAnalysis.overall)}>
                              {getScoreText(currentAnalysis.overall)}
                            </Badge>
                          </div>
                        </div>
                      </Col>
                      <Col md={9}>
                        <div className="mb-3">
                          <div className="d-flex justify-content-between mb-1">
                            <small>템포 정확도</small>
                            <small>{currentAnalysis.tempo.toFixed(1)}%</small>
                          </div>
                          <ProgressBar 
                            now={currentAnalysis.tempo} 
                            variant={getScoreColor(currentAnalysis.tempo)}
                            style={{ height: '8px' }}
                          />
                        </div>
                        
                        <div className="mb-3">
                          <div className="d-flex justify-content-between mb-1">
                            <small>음정 정확도</small>
                            <small>{currentAnalysis.pitch.toFixed(1)}%</small>
                          </div>
                          <ProgressBar 
                            now={currentAnalysis.pitch} 
                            variant={getScoreColor(currentAnalysis.pitch)}
                            style={{ height: '8px' }}
                          />
                        </div>
                        
                        <div className="mb-3">
                          <div className="d-flex justify-content-between mb-1">
                            <small>리듬 정확도</small>
                            <small>{currentAnalysis.rhythm.toFixed(1)}%</small>
                          </div>
                          <ProgressBar 
                            now={currentAnalysis.rhythm} 
                            variant={getScoreColor(currentAnalysis.rhythm)}
                            style={{ height: '8px' }}
                          />
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col lg={4}>
                <Card>
                  <Card.Header>
                    <h6 className="mb-0">🎵 현재 음정</h6>
                  </Card.Header>
                  <Card.Body>
                    {pitchHistory.length > 0 && (
                      <div className="text-center">
                        <div className="h2 text-primary mb-2">
                          {pitchHistory[pitchHistory.length - 1].note}
                        </div>
                        <div className="mb-2">
                          <small className="text-muted">
                            {pitchHistory[pitchHistory.length - 1].frequency.toFixed(1)} Hz
                          </small>
                        </div>
                        <ProgressBar 
                          now={pitchHistory[pitchHistory.length - 1].accuracy} 
                          variant={getScoreColor(pitchHistory[pitchHistory.length - 1].accuracy)}
                          style={{ height: '6px' }}
                        />
                        <small className="text-muted">
                          정확도: {pitchHistory[pitchHistory.length - 1].accuracy.toFixed(1)}%
                        </small>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {/* AI 추천사항 */}
          {currentAnalysis?.recommendations && currentAnalysis.recommendations.length > 0 && (
            <Row className="mb-4">
              <Col>
                <Card>
                  <Card.Header>
                    <h6 className="mb-0">🤖 AI 실시간 피드백</h6>
                  </Card.Header>
                  <Card.Body>
                    {currentAnalysis.recommendations.map((recommendation, index) => (
                      <Alert key={index} variant="info" className="mb-2">
                        {recommendation}
                      </Alert>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {/* 음정 히스토리 */}
          <Row>
            <Col>
              <Card>
                <Card.Header>
                  <h6 className="mb-0">🎼 음정 기록</h6>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex justify-content-start align-items-end" style={{ height: '100px' }}>
                    {pitchHistory.map((pitch, index) => (
                      <div key={index} className="text-center me-2" style={{ minWidth: '60px' }}>
                        <div 
                          className={`bg-${getScoreColor(pitch.accuracy)} rounded`}
                          style={{ 
                            height: `${pitch.accuracy}px`,
                            marginBottom: '5px',
                            opacity: 0.7 + (index / pitchHistory.length) * 0.3
                          }}
                        />
                        <small className="text-muted">{pitch.note}</small>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}

      {!isAnalyzing && (
        <Row>
          <Col className="text-center">
            <Card style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <Card.Body className="py-5">
                <h3 className="mb-3">🎵 실시간 연주 분석을 시작해보세요!</h3>
                <p className="mb-4">
                  마이크를 통해 실시간으로 연주를 분석하고<br/>
                  AI가 즉시 피드백을 제공합니다.
                </p>
                <ul className="list-unstyled mb-4">
                  <li className="mb-2">🎯 템포 및 리듬 정확도 분석</li>
                  <li className="mb-2">🎼 음정 및 화성 분석</li>
                  <li className="mb-2">🤖 실시간 AI 피드백</li>
                  <li className="mb-2">📊 상세한 연주 통계</li>
                </ul>
                <button
                  className="btn btn-light btn-lg"
                  onClick={() => setIsAnalyzing(true)}
                >
                  지금 시작하기 🚀
                </button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  )
}

export default RealtimeAnalyzer