'use client'

import React, { useState } from 'react';
import { Button, Card, Form, Row, Col } from 'react-bootstrap';
import { compositionAssistantService, CompositionRequest, CompositionSuggestion, HarmonicProgression } from '../services/compositionAssistantService';
import { GRADIENTS, COLORS, CARD_STYLES, BADGE_STYLES, BUTTON_STYLES } from '../constants/styles';

export default function CompositionAssistant() {
  const [compositionRequest, setCompositionRequest] = useState<CompositionRequest>({
    style: 'pop',
    key: 'C',
    timeSignature: '4/4',
    length: 8,
    mood: 'happy',
    complexity: 'BEGINNER',
    targetInstruments: ['piano']
  });

  const [suggestion, setSuggestion] = useState<CompositionSuggestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState<'form' | 'result' | 'progression' | 'melody' | 'modulation'>('form');

  const keys = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'F', 'Bb', 'Eb', 'Ab', 'Db'];
  const timeSignatures = ['4/4', '3/4', '6/8', '2/4', '5/4', '7/8'];
  const instruments = ['piano', 'guitar', 'violin', 'flute', 'voice', 'ensemble'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await compositionAssistantService.generateCompositionStructure(compositionRequest);
      setSuggestion(result);
      setCurrentView('result');
    } catch (error) {
      console.error('작곡 제안 생성 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuggestion(null);
    setCurrentView('form');
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <div style={{color: COLORS.text.primary}}>AI가 작곡 아이디어를 생성하고 있습니다...</div>
      </div>
    );
  }

  if (currentView === 'form') {
    return (
      <div className="composition-assistant">
        <div className="text-center mb-4">
          <h3 style={{color: COLORS.text.primary}}>🎼 AI 작곡 어시스턴트</h3>
          <p style={{color: COLORS.text.secondary}}>
            When-in-Rome 기반의 전문적인 화성학 지식으로 작곡을 도와드립니다
          </p>
        </div>

        <Card style={CARD_STYLES.large}>
          <Card.Body className="p-4">
            <Form onSubmit={handleSubmit}>
              <Row className="g-3">
                {/* 스타일 선택 */}
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={{color: COLORS.text.primary, fontWeight: '600'}}>
                      🎵 음악 스타일
                    </Form.Label>
                    <Form.Select
                      value={compositionRequest.style}
                      onChange={(e) => setCompositionRequest({
                        ...compositionRequest,
                        style: e.target.value as any
                      })}
                      style={{
                        background: 'rgba(139, 92, 246, 0.1)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        color: COLORS.text.primary,
                        borderRadius: '8px'
                      }}
                    >
                      <option value="pop">팝 (Pop)</option>
                      <option value="jazz">재즈 (Jazz)</option>
                      <option value="classical">클래식 (Classical)</option>
                      <option value="folk">민속 (Folk)</option>
                      <option value="electronic">일렉트로닉 (Electronic)</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                {/* 조성 선택 */}
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={{color: COLORS.text.primary, fontWeight: '600'}}>
                      🎼 조성 (Key)
                    </Form.Label>
                    <Form.Select
                      value={compositionRequest.key}
                      onChange={(e) => setCompositionRequest({
                        ...compositionRequest,
                        key: e.target.value
                      })}
                      style={{
                        background: 'rgba(139, 92, 246, 0.1)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        color: COLORS.text.primary,
                        borderRadius: '8px'
                      }}
                    >
                      {keys.map(key => (
                        <option key={key} value={key}>{key}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                {/* 박자 선택 */}
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={{color: COLORS.text.primary, fontWeight: '600'}}>
                      ⏰ 박자 (Time Signature)
                    </Form.Label>
                    <Form.Select
                      value={compositionRequest.timeSignature}
                      onChange={(e) => setCompositionRequest({
                        ...compositionRequest,
                        timeSignature: e.target.value
                      })}
                      style={{
                        background: 'rgba(139, 92, 246, 0.1)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        color: COLORS.text.primary,
                        borderRadius: '8px'
                      }}
                    >
                      {timeSignatures.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                {/* 마디 수 */}
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={{color: COLORS.text.primary, fontWeight: '600'}}>
                      📏 마디 수
                    </Form.Label>
                    <Form.Control
                      type="number"
                      min="4"
                      max="48"
                      value={compositionRequest.length}
                      onChange={(e) => setCompositionRequest({
                        ...compositionRequest,
                        length: parseInt(e.target.value)
                      })}
                      style={{
                        background: 'rgba(139, 92, 246, 0.1)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        color: COLORS.text.primary,
                        borderRadius: '8px'
                      }}
                    />
                  </Form.Group>
                </Col>

                {/* 분위기 선택 */}
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={{color: COLORS.text.primary, fontWeight: '600'}}>
                      😊 분위기
                    </Form.Label>
                    <Form.Select
                      value={compositionRequest.mood}
                      onChange={(e) => setCompositionRequest({
                        ...compositionRequest,
                        mood: e.target.value as any
                      })}
                      style={{
                        background: 'rgba(139, 92, 246, 0.1)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        color: COLORS.text.primary,
                        borderRadius: '8px'
                      }}
                    >
                      <option value="happy">행복한 (Happy)</option>
                      <option value="sad">슬픈 (Sad)</option>
                      <option value="energetic">활기찬 (Energetic)</option>
                      <option value="calm">차분한 (Calm)</option>
                      <option value="mysterious">신비로운 (Mysterious)</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                {/* 난이도 선택 */}
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={{color: COLORS.text.primary, fontWeight: '600'}}>
                      🎯 난이도
                    </Form.Label>
                    <Form.Select
                      value={compositionRequest.complexity}
                      onChange={(e) => setCompositionRequest({
                        ...compositionRequest,
                        complexity: e.target.value as any
                      })}
                      style={{
                        background: 'rgba(139, 92, 246, 0.1)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        color: COLORS.text.primary,
                        borderRadius: '8px'
                      }}
                    >
                      <option value="BEGINNER">초급 (Beginner)</option>
                      <option value="INTERMEDIATE">중급 (Intermediate)</option>
                      <option value="ADVANCED">고급 (Advanced)</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                {/* 악기 선택 */}
                <Col md={12}>
                  <Form.Group>
                    <Form.Label style={{color: COLORS.text.primary, fontWeight: '600'}}>
                      🎹 대상 악기
                    </Form.Label>
                    <div className="d-flex flex-wrap gap-2">
                      {instruments.map(instrument => (
                        <Form.Check
                          key={instrument}
                          type="checkbox"
                          id={`instrument-${instrument}`}
                          label={instrument}
                          checked={compositionRequest.targetInstruments.includes(instrument)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCompositionRequest({
                                ...compositionRequest,
                                targetInstruments: [...compositionRequest.targetInstruments, instrument]
                              });
                            } else {
                              setCompositionRequest({
                                ...compositionRequest,
                                targetInstruments: compositionRequest.targetInstruments.filter(i => i !== instrument)
                              });
                            }
                          }}
                          style={{color: COLORS.text.primary}}
                        />
                      ))}
                    </div>
                  </Form.Group>
                </Col>
              </Row>

              <div className="text-center mt-4">
                <Button
                  type="submit"
                  style={{
                    ...BUTTON_STYLES.primary,
                    padding: '12px 30px',
                    fontSize: '1.1rem',
                    borderRadius: '25px'
                  }}
                >
                  <i className="bi bi-magic me-2"></i>
                  AI 작곡 제안 받기
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    );
  }

  if (currentView === 'result' && suggestion) {
    return (
      <div className="composition-result">
        <div className="text-center mb-4">
          <h3 style={{color: COLORS.text.primary}}>🎼 AI 작곡 제안</h3>
          <p style={{color: COLORS.text.secondary}}>
            {compositionRequest.style} 스타일, {compositionRequest.key} 조성, {compositionRequest.mood} 분위기
          </p>
        </div>

        {/* 네비게이션 탭 */}
        <div className="mb-4">
          <div className="d-flex flex-wrap gap-2 justify-content-center">
            {[
              { key: 'result', label: '전체 구조', icon: '📊' },
              { key: 'progression', label: '화성 진행', icon: '🎵' },
              { key: 'melody', label: '멜로디', icon: '🎶' },
              { key: 'modulation', label: '조성 전환', icon: '🔄' }
            ].map(tab => (
              <Button
                key={tab.key}
                onClick={() => setCurrentView(tab.key as any)}
                className={`px-4 py-2 ${currentView === tab.key ? 'active' : ''}`}
                style={{
                  ...(currentView === tab.key ? BUTTON_STYLES.primary : BUTTON_STYLES.outline),
                  borderRadius: '25px',
                  fontSize: '1rem',
                  fontWeight: '500'
                }}
              >
                <span className="me-2">{tab.icon}</span>
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* 전체 구조 뷰 */}
        <div className="result-content">
          <Row className="g-4">
            {/* 화성 진행 요약 */}
            <Col md={6}>
              <Card style={CARD_STYLES.large}>
                <Card.Body>
                  <h6 className="card-title" style={{color: COLORS.text.primary}}>
                    <i className="bi bi-arrow-repeat me-2" style={{color: COLORS.primary.main}}></i>
                    추천 화성 진행
                  </h6>
                  <div className="progression-display" style={{
                    background: 'rgba(139, 92, 246, 0.1)',
                    borderRadius: '12px',
                    padding: '1rem',
                    marginBottom: '1rem',
                    border: '1px solid rgba(139, 92, 246, 0.2)'
                  }}>
                    <div className="progression-pattern" style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: COLORS.primary.main,
                      textAlign: 'center',
                      marginBottom: '0.5rem'
                    }}>
                      {suggestion.progression.pattern.join(' → ')}
                    </div>
                    <div style={{color: COLORS.text.secondary, textAlign: 'center'}}>
                      {suggestion.progression.description}
                    </div>
                  </div>
                  <div className="progression-info">
                    <div className="d-flex justify-content-between mb-2">
                      <span style={{color: COLORS.text.secondary}}>난이도:</span>
                      <span className="badge" style={{
                        ...BADGE_STYLES[suggestion.progression.difficulty.toLowerCase() as keyof typeof BADGE_STYLES],
                        fontSize: '0.8rem'
                      }}>
                        {suggestion.progression.difficulty}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span style={{color: COLORS.text.secondary}}>빈도:</span>
                      <span style={{color: COLORS.text.primary}}>{suggestion.progression.frequency}%</span>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* 전체 구조 */}
            <Col md={6}>
              <Card style={CARD_STYLES.large}>
                <Card.Body>
                  <h6 className="card-title" style={{color: COLORS.text.primary}}>
                    <i className="bi bi-diagram-3 me-2" style={{color: COLORS.success.main}}></i>
                    전체 구조
                  </h6>
                  <div className="structure-list">
                    {suggestion.overallStructure.map((section, index) => (
                      <div key={index} className="structure-item d-flex align-items-center mb-2" style={{
                        padding: '0.5rem',
                        background: 'rgba(139, 92, 246, 0.05)',
                        borderRadius: '8px'
                      }}>
                        <div className="structure-number me-3" style={{
                          width: '30px',
                          height: '30px',
                          background: GRADIENTS.primary,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '0.9rem'
                        }}>
                          {index + 1}
                        </div>
                        <span style={{color: COLORS.text.primary}}>{section}</span>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* 스타일 노트 */}
            <Col md={6}>
              <Card style={CARD_STYLES.large}>
                <Card.Body>
                  <h6 className="card-title" style={{color: COLORS.text.primary}}>
                    <i className="bi bi-lightbulb me-2" style={{color: COLORS.warning.main}}></i>
                    스타일 노트
                  </h6>
                  <ul className="mb-0" style={{color: COLORS.text.secondary}}>
                    {suggestion.styleNotes.map((note, index) => (
                      <li key={index} className="mb-2">{note}</li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            </Col>

            {/* 연습 팁 */}
            <Col md={6}>
              <Card style={CARD_STYLES.large}>
                <Card.Body>
                  <h6 className="card-title" style={{color: COLORS.text.primary}}>
                    <i className="bi bi-book me-2" style={{color: COLORS.info.main}}></i>
                    연습 팁
                  </h6>
                  <ul className="mb-0" style={{color: COLORS.text.secondary}}>
                    {suggestion.practiceTips.map((tip, index) => (
                      <li key={index} className="mb-2">{tip}</li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <div className="text-center mt-4">
            <Button
              onClick={handleReset}
              style={{
                ...BUTTON_STYLES.outline,
                padding: '10px 20px',
                borderRadius: '20px',
                marginRight: '1rem'
              }}
            >
              <i className="bi bi-arrow-left me-2"></i>
              새로운 제안 받기
            </Button>
            <Button
              onClick={() => setCurrentView('progression')}
              style={{
                ...BUTTON_STYLES.primary,
                padding: '10px 20px',
                borderRadius: '20px'
              }}
            >
              <i className="bi bi-arrow-right me-2"></i>
              자세히 보기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'progression' && suggestion) {
    return (
      <div className="progression-detail">
        <div className="text-center mb-4">
          <h3 style={{color: COLORS.text.primary}}>🎵 화성 진행 상세 분석</h3>
          <p style={{color: COLORS.text.secondary}}>
            {suggestion.progression.pattern.join(' → ')} 진행의 특징과 활용법
          </p>
        </div>

        <Card style={CARD_STYLES.large}>
          <Card.Body>
            <div className="progression-analysis">
              <div className="progression-header text-center mb-4">
                <div className="progression-pattern-large" style={{
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  color: COLORS.primary.main,
                  marginBottom: '1rem'
                }}>
                  {suggestion.progression.pattern.join(' → ')}
                </div>
                <div style={{color: COLORS.text.secondary, fontSize: '1.1rem'}}>
                  {suggestion.progression.description}
                </div>
              </div>

              <Row className="g-4">
                <Col md={6}>
                  <div className="progression-stats">
                    <h6 style={{color: COLORS.text.primary, marginBottom: '1rem'}}>📊 진행 통계</h6>
                    <div className="stat-item d-flex justify-content-between mb-2">
                      <span style={{color: COLORS.text.secondary}}>난이도:</span>
                      <span className="badge" style={{
                        ...BADGE_STYLES[suggestion.progression.difficulty.toLowerCase() as keyof typeof BADGE_STYLES]
                      }}>
                        {suggestion.progression.difficulty}
                      </span>
                    </div>
                    <div className="stat-item d-flex justify-content-between mb-2">
                      <span style={{color: COLORS.text.secondary}}>사용 빈도:</span>
                      <span style={{color: COLORS.text.primary}}>{suggestion.progression.frequency}%</span>
                    </div>
                    <div className="stat-item d-flex justify-content-between mb-2">
                      <span style={{color: COLORS.text.secondary}}>적합한 스타일:</span>
                      <span style={{color: COLORS.text.primary}}>{suggestion.progression.style.join(', ')}</span>
                    </div>
                  </div>
                </Col>

                <Col md={6}>
                  <div className="progression-examples">
                    <h6 style={{color: COLORS.text.primary, marginBottom: '1rem'}}>🎤 사용 예시</h6>
                    <div className="examples-list">
                      {suggestion.progression.examples.map((example, index) => (
                        <div key={index} className="example-item" style={{
                          padding: '0.5rem',
                          background: 'rgba(139, 92, 246, 0.05)',
                          borderRadius: '8px',
                          marginBottom: '0.5rem',
                          color: COLORS.text.primary
                        }}>
                          {example}
                        </div>
                      ))}
                    </div>
                  </div>
                </Col>
              </Row>

              <div className="progression-theory mt-4">
                <h6 style={{color: COLORS.text.primary, marginBottom: '1rem'}}>📚 화성학적 이론</h6>
                <div className="theory-content" style={{
                  background: 'rgba(139, 92, 246, 0.05)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  border: '1px solid rgba(139, 92, 246, 0.1)'
                }}>
                  <p style={{color: COLORS.text.secondary, marginBottom: '1rem'}}>
                    이 진행은 {suggestion.progression.difficulty} 수준의 음악가들이 자주 사용하는 패턴입니다.
                  </p>
                  <p style={{color: COLORS.text.secondary, marginBottom: '1rem'}}>
                    {suggestion.progression.style.join(', ')} 스타일에 특히 적합하며, 
                    {suggestion.progression.frequency}%의 높은 사용 빈도를 보입니다.
                  </p>
                  <p style={{color: COLORS.text.secondary}}>
                    각 화성의 역할과 진행의 논리를 이해하면 더 효과적으로 활용할 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        <div className="text-center mt-4">
          <Button
            onClick={() => setCurrentView('result')}
            style={{
              ...BUTTON_STYLES.outline,
              padding: '10px 20px',
              borderRadius: '20px',
              marginRight: '1rem'
            }}
          >
            <i className="bi bi-arrow-left me-2"></i>
            뒤로 가기
          </Button>
          <Button
            onClick={() => setCurrentView('melody')}
            style={{
              ...BUTTON_STYLES.primary,
              padding: '10px 20px',
              borderRadius: '20px'
            }}
          >
            <i className="bi bi-arrow-right me-2"></i>
            멜로디 보기
          </Button>
        </div>
      </div>
    );
  }

  if (currentView === 'melody' && suggestion) {
    return (
      <div className="melody-detail">
        <div className="text-center mb-4">
          <h3 style={{color: COLORS.text.primary}}>🎶 멜로디 제안</h3>
          <p style={{color: COLORS.text.secondary}}>
            화성 진행에 맞는 멜로디 라인과 리듬 패턴
          </p>
        </div>

        <Card style={CARD_STYLES.large}>
          <Card.Body>
            <div className="melody-analysis">
              <div className="melody-header text-center mb-4">
                <div className="melody-pattern" style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: COLORS.primary.main,
                  marginBottom: '1rem'
                }}>
                  {suggestion.melody.notes.join(' ')}
                </div>
                <div style={{color: COLORS.text.secondary, fontSize: '1.1rem'}}>
                  {suggestion.melody.style}
                </div>
              </div>

              <Row className="g-4">
                <Col md={6}>
                  <div className="melody-characteristics">
                    <h6 style={{color: COLORS.text.primary, marginBottom: '1rem'}}>🎵 멜로디 특징</h6>
                    <div className="characteristic-item d-flex justify-content-between mb-2">
                      <span style={{color: COLORS.text.secondary}}>선율 방향:</span>
                      <span style={{color: COLORS.text.primary}}>
                        {suggestion.melody.contour === 'ascending' ? '상승' :
                         suggestion.melody.contour === 'descending' ? '하강' :
                         suggestion.melody.contour === 'stable' ? '안정' : '파동'}
                      </span>
                    </div>
                    <div className="characteristic-item d-flex justify-content-between mb-2">
                      <span style={{color: COLORS.text.secondary}}>긴장도:</span>
                      <span style={{color: COLORS.text.primary}}>{suggestion.melody.tension}/100</span>
                    </div>
                    <div className="characteristic-item d-flex justify-content-between mb-2">
                      <span style={{color: COLORS.text.secondary}}>스타일:</span>
                      <span style={{color: COLORS.text.primary}}>{suggestion.melody.style}</span>
                    </div>
                  </div>
                </Col>

                <Col md={6}>
                  <div className="rhythm-pattern">
                    <h6 style={{color: COLORS.text.primary, marginBottom: '1rem'}}>⏰ 리듬 패턴</h6>
                    <div className="rhythm-display" style={{
                      background: 'rgba(139, 92, 246, 0.1)',
                      borderRadius: '12px',
                      padding: '1rem',
                      textAlign: 'center',
                      fontSize: '1.5rem',
                      color: COLORS.text.primary
                    }}>
                      {suggestion.melody.rhythm.join(' ')}
                    </div>
                  </div>
                </Col>
              </Row>

              <div className="melody-tips mt-4">
                <h6 style={{color: COLORS.text.primary, marginBottom: '1rem'}}>💡 멜로디 활용 팁</h6>
                <div className="tips-content" style={{
                  background: 'rgba(139, 92, 246, 0.05)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  border: '1px solid rgba(139, 92, 246, 0.1)'
                }}>
                  <ul style={{color: COLORS.text.secondary, margin: 0}}>
                    <li className="mb-2">이 멜로디를 기본으로 하여 변주를 시도해보세요</li>
                    <li className="mb-2">리듬을 바꿔가며 다양한 느낌을 만들어보세요</li>
                    <li className="mb-2">화성 진행과 함께 연주하여 조화를 확인해보세요</li>
                    <li>자신만의 멜로디로 발전시켜보세요</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        <div className="text-center mt-4">
          <Button
            onClick={() => setCurrentView('progression')}
            style={{
              ...BUTTON_STYLES.outline,
              padding: '10px 20px',
              borderRadius: '20px',
              marginRight: '1rem'
            }}
          >
            <i className="bi bi-arrow-left me-2"></i>
            뒤로 가기
          </Button>
          {suggestion.modulation && (
            <Button
              onClick={() => setCurrentView('modulation')}
              style={{
                ...BUTTON_STYLES.primary,
                padding: '10px 20px',
                borderRadius: '20px'
              }}
            >
              <i className="bi bi-arrow-right me-2"></i>
              조성 전환 보기
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (currentView === 'modulation' && suggestion?.modulation) {
    return (
      <div className="modulation-detail">
        <div className="text-center mb-4">
          <h3 style={{color: COLORS.text.primary}}>🔄 조성 전환 가이드</h3>
          <p style={{color: COLORS.text.secondary}}>
            {suggestion.modulation.fromKey}에서 {suggestion.modulation.toKey}로의 전환 기법
          </p>
        </div>

        <Card style={CARD_STYLES.large}>
          <Card.Body>
            <div className="modulation-analysis">
              <div className="modulation-header text-center mb-4">
                <div className="modulation-direction" style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: COLORS.primary.main,
                  marginBottom: '1rem'
                }}>
                  {suggestion.modulation.fromKey} → {suggestion.modulation.toKey}
                </div>
                <div style={{color: COLORS.text.secondary, fontSize: '1.1rem'}}>
                  {suggestion.modulation.technique} 기법
                </div>
              </div>

              <Row className="g-4">
                <Col md={6}>
                  <div className="modulation-details">
                    <h6 style={{color: COLORS.text.primary, marginBottom: '1rem'}}>📋 전환 상세</h6>
                    <div className="detail-item mb-3">
                      <div style={{color: COLORS.text.secondary, fontSize: '0.9rem', marginBottom: '0.5rem'}}>
                        기법
                      </div>
                      <div style={{color: COLORS.text.primary, fontWeight: '600'}}>
                        {suggestion.modulation.technique === 'pivot_chord' ? '피벗 화성' :
                         suggestion.modulation.technique === 'direct' ? '직접 전환' :
                         suggestion.modulation.technique === 'chromatic' ? '반음계적 전환' : '이명동음 전환'}
                      </div>
                    </div>
                    <div className="detail-item mb-3">
                      <div style={{color: COLORS.text.secondary, fontSize: '0.9rem', marginBottom: '0.5rem'}}>
                        난이도
                      </div>
                      <div className="badge" style={{
                        ...BADGE_STYLES[suggestion.modulation.difficulty.toLowerCase() as keyof typeof BADGE_STYLES]
                      }}>
                        {suggestion.modulation.difficulty}
                      </div>
                    </div>
                    <div className="detail-item mb-3">
                      <div style={{color: COLORS.text.secondary, fontSize: '0.9rem', marginBottom: '0.5rem'}}>
                        일반적 용도
                      </div>
                      <div style={{color: COLORS.text.primary}}>
                        {suggestion.modulation.commonUses.join(', ')}
                      </div>
                    </div>
                  </div>
                </Col>

                <Col md={6}>
                  <div className="modulation-example">
                    <h6 style={{color: COLORS.text.primary, marginBottom: '1rem'}}>🎵 전환 예시</h6>
                    <div className="example-content" style={{
                      background: 'rgba(139, 92, 246, 0.1)',
                      borderRadius: '12px',
                      padding: '1rem',
                      border: '1px solid rgba(139, 92, 246, 0.2)'
                    }}>
                      <div style={{color: COLORS.text.primary, fontWeight: '600', marginBottom: '0.5rem'}}>
                        구체적 방법:
                      </div>
                      <div style={{color: COLORS.text.secondary}}>
                        {suggestion.modulation.example}
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>

              <div className="modulation-description mt-4">
                <h6 style={{color: COLORS.text.primary, marginBottom: '1rem'}}>📖 전환 설명</h6>
                <div className="description-content" style={{
                  background: 'rgba(139, 92, 246, 0.05)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  border: '1px solid rgba(139, 92, 246, 0.1)'
                }}>
                  <p style={{color: COLORS.text.secondary, margin: 0}}>
                    {suggestion.modulation.description}
                  </p>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        <div className="text-center mt-4">
          <Button
            onClick={() => setCurrentView('melody')}
            style={{
              ...BUTTON_STYLES.outline,
              padding: '10px 20px',
              borderRadius: '20px',
              marginRight: '1rem'
            }}
          >
            <i className="bi bi-arrow-left me-2"></i>
            뒤로 가기
          </Button>
          <Button
            onClick={() => setCurrentView('result')}
            style={{
              ...BUTTON_STYLES.primary,
              padding: '10px 20px',
              borderRadius: '20px'
            }}
          >
            <i className="bi bi-arrow-right me-2"></i>
            전체 구조로
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
