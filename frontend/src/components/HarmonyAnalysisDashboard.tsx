'use client'

import React, { useState, useEffect } from 'react';
import { harmonyAnalysisService, HarmonicAnalysis, AnalysisFeedback } from '../services/harmonyAnalysisService';
import { GRADIENTS, COLORS, CARD_STYLES, BADGE_STYLES, BUTTON_STYLES } from '../constants/styles';

interface HarmonyAnalysisDashboardProps {
  audioData?: ArrayBuffer;
  initialAnalysis?: HarmonicAnalysis;
}

export default function HarmonyAnalysisDashboard({ audioData, initialAnalysis }: HarmonyAnalysisDashboardProps) {
  const [analysis, setAnalysis] = useState<HarmonicAnalysis | null>(initialAnalysis || null);
  const [feedback, setFeedback] = useState<AnalysisFeedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState<'overview' | 'progression' | 'complexity' | 'feedback'>('overview');

  useEffect(() => {
    if (audioData && !initialAnalysis) {
      analyzeAudio();
    }
  }, [audioData]);

  const analyzeAudio = async () => {
    if (!audioData) return;
    
    setLoading(true);
    try {
      const result = await harmonyAnalysisService.analyzeHarmony(audioData, {
        title: '연주 분석',
        composer: '사용자'
      });
      
      setAnalysis(result);
      
      // 피드백 생성
      const feedbackResult = await harmonyAnalysisService.generateAnalysisFeedback(result);
      setFeedback(feedbackResult);
    } catch (error) {
      console.error('화성 분석 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <div style={{color: COLORS.text.primary}}>AI가 화성을 분석하고 있습니다...</div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="text-center py-5">
        <div className="mb-4" style={{
          width: '80px',
          height: '80px',
          background: GRADIENTS.primary,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto'
        }}>
          <i className="bi bi-music-note fs-2 text-white"></i>
        </div>
        <h5 style={{color: COLORS.text.primary}}>화성 분석을 시작하세요</h5>
        <p style={{color: COLORS.text.secondary}}>연주를 녹음하면 AI가 화성을 분석합니다</p>
      </div>
    );
  }

  return (
    <div className="harmony-analysis-dashboard">
      {/* 헤더 */}
      <div className="dashboard-header mb-4" style={{
        background: GRADIENTS.primary,
        borderRadius: '20px',
        padding: '2rem',
        color: 'white',
        textAlign: 'center'
      }}>
        <h3 className="mb-2">🎼 AI 화성 분석 결과</h3>
        <p className="mb-3 opacity-75">
          {analysis.pieceTitle} - {analysis.composer}
        </p>
        <div className="d-flex justify-content-center gap-3">
          <span className="badge" style={{
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            padding: '0.5rem 1rem'
          }}>
            조성: {analysis.key}
          </span>
          <span className="badge" style={{
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            padding: '0.5rem 1rem'
          }}>
            박자: {analysis.timeSignature}
          </span>
          <span className="badge" style={{
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            padding: '0.5rem 1rem'
          }}>
            복잡도: {analysis.overallHarmonicComplexity}/100
          </span>
        </div>
      </div>

      {/* 네비게이션 탭 */}
      <div className="navigation-tabs mb-4">
        <div className="d-flex gap-2">
          {[
            { key: 'overview', label: '개요', icon: '📊' },
            { key: 'progression', label: '화성 진행', icon: '🎵' },
            { key: 'complexity', label: '복잡도', icon: '🧮' },
            { key: 'feedback', label: 'AI 피드백', icon: '🤖' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setCurrentView(tab.key as any)}
              className={`btn ${currentView === tab.key ? 'active' : ''}`}
              style={{
                ...(currentView === tab.key ? BUTTON_STYLES.primary : BUTTON_STYLES.outline),
                borderRadius: '25px',
                padding: '0.75rem 1.5rem'
              }}
            >
              <span className="me-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 컨텐츠 영역 */}
      <div className="dashboard-content">
        {currentView === 'overview' && <OverviewView analysis={analysis} />}
        {currentView === 'progression' && <ProgressionView analysis={analysis} />}
        {currentView === 'complexity' && <ComplexityView analysis={analysis} />}
        {currentView === 'feedback' && <FeedbackView feedback={feedback} />}
      </div>
    </div>
  );
}

// 개요 뷰 컴포넌트
function OverviewView({ analysis }: { analysis: HarmonicAnalysis }) {
  return (
    <div className="overview-view">
      <div className="row g-4">
        {/* 기본 정보 */}
        <div className="col-md-6">
          <div className="card" style={CARD_STYLES.large}>
            <div className="card-body">
              <h6 className="card-title" style={{color: COLORS.text.primary}}>
                <i className="bi bi-info-circle me-2" style={{color: COLORS.primary.main}}></i>
                기본 정보
              </h6>
              <div className="info-list">
                <div className="info-item d-flex justify-content-between mb-2">
                  <span style={{color: COLORS.text.secondary}}>총 마디 수:</span>
                  <span style={{color: COLORS.text.primary}}>{analysis.measures.length}</span>
                </div>
                <div className="info-item d-flex justify-content-between mb-2">
                  <span style={{color: COLORS.text.secondary}}>분석일:</span>
                  <span style={{color: COLORS.text.primary}}>
                    {new Date(analysis.analysisDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="info-item d-flex justify-content-between mb-2">
                  <span style={{color: COLORS.text.secondary}}>분석가:</span>
                  <span style={{color: COLORS.text.primary}}>{analysis.analyst}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 화성 통계 */}
        <div className="col-md-6">
          <div className="card" style={CARD_STYLES.large}>
            <div className="card-body">
              <h6 className="card-title" style={{color: COLORS.text.primary}}>
                <i className="bi bi-bar-chart me-2" style={{color: COLORS.success.main}}></i>
                화성 통계
              </h6>
              <div className="stats-grid">
                <div className="stat-item text-center">
                  <div className="stat-value" style={{color: COLORS.primary.main, fontSize: '2rem', fontWeight: 'bold'}}>
                    {analysis.commonProgressions.length}
                  </div>
                  <div className="stat-label" style={{color: COLORS.text.secondary}}>진행 패턴</div>
                </div>
                <div className="stat-item text-center">
                  <div className="stat-value" style={{color: COLORS.success.main, fontSize: '2rem', fontWeight: 'bold'}}>
                    {analysis.measures.filter(m => m.isModulation).length}
                  </div>
                  <div className="stat-label" style={{color: COLORS.text.secondary}}>조성 전환</div>
                </div>
                <div className="stat-item text-center">
                  <div className="stat-value" style={{color: COLORS.warning.main, fontSize: '2rem', fontWeight: 'bold'}}>
                    {analysis.measures.filter(m => m.isMixture).length}
                  </div>
                  <div className="stat-label" style={{color: COLORS.text.secondary}}>모달 믹스처</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 주요 화성 진행 */}
        <div className="col-12">
          <div className="card" style={CARD_STYLES.large}>
            <div className="card-body">
              <h6 className="card-title" style={{color: COLORS.text.primary}}>
                <i className="bi bi-arrow-repeat me-2" style={{color: COLORS.info.main}}></i>
                주요 화성 진행 패턴
              </h6>
              <div className="progression-preview">
                {analysis.commonProgressions.slice(0, 3).map((pattern, index) => (
                  <div key={index} className="progression-item" style={{
                    background: 'rgba(139, 92, 246, 0.1)',
                    borderRadius: '10px',
                    padding: '1rem',
                    marginBottom: '1rem',
                    border: '1px solid rgba(139, 92, 246, 0.2)'
                  }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="progression-pattern" style={{color: COLORS.text.primary, fontSize: '1.1rem'}}>
                        {pattern.pattern.join(' → ')}
                      </div>
                      <span className="badge" style={{
                        ...BADGE_STYLES[pattern.difficulty.toLowerCase() as keyof typeof BADGE_STYLES],
                        fontSize: '0.8rem'
                      }}>
                        {pattern.difficulty}
                      </span>
                    </div>
                    <div style={{color: COLORS.text.secondary, fontSize: '0.9rem'}}>
                      {pattern.description} (빈도: {pattern.frequency}회)
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 화성 진행 뷰 컴포넌트
function ProgressionView({ analysis }: { analysis: HarmonicAnalysis }) {
  return (
    <div className="progression-view">
      <div className="card" style={CARD_STYLES.large}>
        <div className="card-body">
          <h6 className="card-title" style={{color: COLORS.text.primary}}>
            <i className="bi bi-graph-up me-2" style={{color: COLORS.primary.main}}></i>
            화성 진행 타임라인
          </h6>
          
          <div className="progression-timeline">
            {analysis.measures.map((measure, index) => (
              <div key={index} className="timeline-item" style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1rem',
                padding: '0.5rem',
                background: index % 2 === 0 ? 'rgba(139, 92, 246, 0.05)' : 'transparent',
                borderRadius: '8px'
              }}>
                <div className="measure-number" style={{
                  width: '60px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: COLORS.text.primary
                }}>
                  m{measure.measureNumber}
                </div>
                <div className="beat-indicator" style={{
                  width: '40px',
                  textAlign: 'center',
                  color: COLORS.text.secondary,
                  fontSize: '0.9rem'
                }}>
                  b{measure.beat}
                </div>
                <div className="roman-numeral" style={{
                  flex: 1,
                  textAlign: 'center',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  color: COLORS.primary.main
                }}>
                  {measure.romanNumeral}
                </div>
                <div className="key-info" style={{
                  width: '80px',
                  textAlign: 'center',
                  color: COLORS.text.secondary,
                  fontSize: '0.9rem'
                }}>
                  {measure.key}
                </div>
                <div className="chord-features">
                  {measure.isModulation && (
                    <span className="badge me-1" style={{
                      background: COLORS.warning.background,
                      color: COLORS.warning.main,
                      fontSize: '0.7rem'
                    }}>
                      조성전환
                    </span>
                  )}
                  {measure.isMixture && (
                    <span className="badge me-1" style={{
                      background: COLORS.info.background,
                      color: COLORS.info.main,
                      fontSize: '0.7rem'
                    }}>
                      믹스처
                    </span>
                  )}
                  {measure.isSecondaryDominant && (
                    <span className="badge me-1" style={{
                      background: COLORS.danger.background,
                      color: COLORS.danger.main,
                      fontSize: '0.7rem'
                    }}>
                      2차지배
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 복잡도 뷰 컴포넌트
function ComplexityView({ analysis }: { analysis: HarmonicAnalysis }) {
  const complexityData = analysis.measures.map((measure, index) => ({
    x: index,
    y: measure.romanNumeral.includes('7') ? 3 : 
       measure.romanNumeral.includes('6') || measure.romanNumeral.includes('4') ? 2 : 1,
    measure: measure.measureNumber,
    label: measure.romanNumeral
  }));

  return (
    <div className="complexity-view">
      <div className="row g-4">
        {/* 복잡도 점수 */}
        <div className="col-md-6">
          <div className="card" style={CARD_STYLES.large}>
            <div className="card-body text-center">
              <h6 className="card-title" style={{color: COLORS.text.primary}}>
                <i className="bi bi-speedometer2 me-2" style={{color: COLORS.warning.main}}></i>
                전체 복잡도
              </h6>
              <div className="complexity-score" style={{
                fontSize: '4rem',
                fontWeight: 'bold',
                color: COLORS.primary.main,
                margin: '1rem 0'
              }}>
                {analysis.overallHarmonicComplexity}
              </div>
              <div style={{color: COLORS.text.secondary}}>
                {analysis.overallHarmonicComplexity < 30 ? '초급 수준' :
                 analysis.overallHarmonicComplexity < 70 ? '중급 수준' : '고급 수준'}
              </div>
            </div>
          </div>
        </div>

        {/* 복잡도 요인 */}
        <div className="col-md-6">
          <div className="card" style={CARD_STYLES.large}>
            <div className="card-body">
              <h6 className="card-title" style={{color: COLORS.text.primary}}>
                <i className="bi bi-list-check me-2" style={{color: COLORS.info.main}}></i>
                복잡도 요인
              </h6>
              <div className="complexity-factors">
                {analysis.measures.filter(m => m.isModulation).length > 0 && (
                  <div className="factor-item d-flex align-items-center mb-2">
                    <i className="bi bi-arrow-repeat me-2" style={{color: COLORS.warning.main}}></i>
                    <span style={{color: COLORS.text.primary}}>조성 전환</span>
                    <span className="ms-auto" style={{color: COLORS.text.secondary}}>
                      {analysis.measures.filter(m => m.isModulation).length}회
                    </span>
                  </div>
                )}
                {analysis.measures.filter(m => m.isMixture).length > 0 && (
                  <div className="factor-item d-flex align-items-center mb-2">
                    <i className="bi bi-palette me-2" style={{color: COLORS.info.main}}></i>
                    <span style={{color: COLORS.text.primary}}>모달 믹스처</span>
                    <span className="ms-auto" style={{color: COLORS.text.secondary}}>
                      {analysis.measures.filter(m => m.isMixture).length}회
                    </span>
                  </div>
                )}
                {analysis.measures.filter(m => m.isSecondaryDominant).length > 0 && (
                  <div className="factor-item d-flex align-items-center mb-2">
                    <i className="bi bi-diagram-3 me-2" style={{color: COLORS.danger.main}}></i>
                    <span style={{color: COLORS.text.primary}}>2차 지배화음</span>
                    <span className="ms-auto" style={{color: COLORS.text.secondary}}>
                      {analysis.measures.filter(m => m.isSecondaryDominant).length}회
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 복잡도 타임라인 */}
        <div className="col-12">
          <div className="card" style={CARD_STYLES.large}>
            <div className="card-body">
              <h6 className="card-title" style={{color: COLORS.text.primary}}>
                <i className="bi bi-graph-up me-2" style={{color: COLORS.success.main}}></i>
                마디별 복잡도 변화
              </h6>
              <div className="complexity-timeline" style={{height: '200px', overflowX: 'auto'}}>
                <div className="d-flex align-items-end" style={{height: '100%', minWidth: 'max-content'}}>
                  {complexityData.map((item, index) => (
                    <div key={index} className="complexity-bar" style={{
                      width: '40px',
                      height: `${item.y * 40}px`,
                      background: GRADIENTS.primary,
                      margin: '0 2px',
                      borderRadius: '4px 4px 0 0',
                      position: 'relative',
                      minHeight: '20px'
                    }}>
                      <div className="bar-label" style={{
                        position: 'absolute',
                        bottom: '-25px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '0.8rem',
                        color: COLORS.text.secondary,
                        whiteSpace: 'nowrap'
                      }}>
                        m{item.measure}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 피드백 뷰 컴포넌트
function FeedbackView({ feedback }: { feedback: AnalysisFeedback[] }) {
  const getFeedbackIcon = (type: string) => {
    const iconMap: { [key: string]: string } = {
      'PITCH_MISMATCH': '🎵',
      'METRICAL_WEAK': '⏰',
      'BASS_MISMATCH': '🎸',
      'RARE_PROGRESSION': '🔍',
      'MODULATION_OPPORTUNITY': '🔄'
    };
    return iconMap[type] || '💡';
  };

  const getSeverityColor = (severity: string) => {
    const colorMap: { [key: string]: string } = {
      'LOW': COLORS.info.main,
      'MEDIUM': COLORS.warning.main,
      'HIGH': COLORS.danger.main
    };
    return colorMap[severity] || COLORS.text.tertiary;
  };

  if (feedback.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="mb-4" style={{
          width: '80px',
          height: '80px',
          background: GRADIENTS.success,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto'
        }}>
          <i className="bi bi-check-circle fs-2 text-white"></i>
        </div>
        <h5 style={{color: COLORS.text.primary}}>훌륭합니다!</h5>
        <p style={{color: COLORS.text.secondary}}>AI가 발견한 개선점이 없습니다</p>
      </div>
    );
  }

  return (
    <div className="feedback-view">
      <div className="card" style={CARD_STYLES.large}>
        <div className="card-body">
          <h6 className="card-title" style={{color: COLORS.text.primary}}>
            <i className="bi bi-lightbulb me-2" style={{color: COLORS.warning.main}}></i>
            AI 개선 제안 ({feedback.length}개)
          </h6>
          
          <div className="feedback-list">
            {feedback.map((item, index) => (
              <div key={index} className="feedback-item" style={{
                background: 'rgba(139, 92, 246, 0.05)',
                borderRadius: '12px',
                padding: '1.5rem',
                marginBottom: '1rem',
                border: `1px solid ${getSeverityColor(item.severity)}20`
              }}>
                <div className="feedback-header d-flex align-items-center mb-3">
                  <div className="feedback-icon me-3" style={{fontSize: '1.5rem'}}>
                    {getFeedbackIcon(item.feedbackType)}
                  </div>
                  <div className="feedback-info flex-grow-1">
                    <div className="feedback-location" style={{
                      color: COLORS.text.secondary,
                      fontSize: '0.9rem',
                      marginBottom: '0.25rem'
                    }}>
                      마디 {item.measureNumber}, 박자 {item.beat}
                    </div>
                    <div className="feedback-message" style={{
                      color: COLORS.text.primary,
                      fontWeight: '600'
                    }}>
                      {item.message}
                    </div>
                  </div>
                  <span className="badge" style={{
                    background: `${getSeverityColor(item.severity)}20`,
                    color: getSeverityColor(item.severity),
                    padding: '0.5rem 1rem'
                  }}>
                    {item.severity === 'LOW' ? '낮음' : 
                     item.severity === 'MEDIUM' ? '보통' : '높음'}
                  </span>
                </div>
                
                <div className="feedback-suggestions">
                  <div style={{color: COLORS.text.secondary, fontSize: '0.9rem', marginBottom: '0.5rem'}}>
                    💡 개선 제안:
                  </div>
                  <ul className="mb-0" style={{color: COLORS.text.primary}}>
                    {item.suggestions.map((suggestion, idx) => (
                      <li key={idx} className="mb-1">{suggestion}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="feedback-confidence mt-3" style={{
                  textAlign: 'right',
                  fontSize: '0.8rem',
                  color: COLORS.text.tertiary
                }}>
                  신뢰도: {Math.round(item.confidence * 100)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
