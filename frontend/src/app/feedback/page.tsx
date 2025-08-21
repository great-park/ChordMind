'use client'

import React, { useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { GRADIENTS, COLORS, CARD_STYLES, BADGE_STYLES, BUTTON_STYLES } from '../../constants/styles';
import FeedbackForm from '../../components/FeedbackForm';
import FeedbackList from '../../components/FeedbackList';
import FeedbackStats from '../../components/FeedbackStats';
import HarmonyAnalysisDashboard from '../../components/HarmonyAnalysisDashboard';

export default function FeedbackPage() {
  const [activeTab, setActiveTab] = useState('record');

  const tabs = [
    { id: 'record', label: '연주 녹음', icon: '🎤', component: <FeedbackForm /> },
    { id: 'analysis', label: '화성 분석', icon: '🎼', component: <HarmonyAnalysisDashboard /> },
    { id: 'history', label: '피드백 기록', icon: '📚', component: <FeedbackList /> },
    { id: 'stats', label: '성장 분석', icon: '📊', component: <FeedbackStats /> }
  ];

  return (
    <div style={{ background: GRADIENTS.dark, minHeight: '100vh', padding: '2rem 0' }}>
      <div className="container">
        {/* 헤더 섹션 */}
        <div className="text-center mb-5">
          <div className="mb-3">
            <span className="badge px-3 py-2" style={{
              ...BADGE_STYLES.primary,
              fontSize: '1rem'
            }}>
              🎵 AI 연주 피드백
            </span>
          </div>
          <h1 className="mb-3" style={{color: COLORS.text.primary, fontSize: '2.5rem', fontWeight: '700'}}>
            AI가 분석하는 당신의 연주, 정확한 피드백으로 성장하세요
          </h1>
          <p className="lead mb-0" style={{color: COLORS.text.secondary, fontSize: '1.2rem'}}>
            실시간 연주 분석과 AI 코칭으로 연주 실력을 한 단계 끌어올리세요
          </p>
        </div>

        {/* 탭 네비게이션 */}
        <div className="mb-4">
          <div className="d-flex flex-wrap gap-2 justify-content-center">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 ${activeTab === tab.id ? 'active' : ''}`}
                style={{
                  ...(activeTab === tab.id ? BUTTON_STYLES.primary : BUTTON_STYLES.outline),
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

        {/* 탭 컨텐츠 */}
        <div className="tab-content">
          {tabs.map((tab) => (
            <div key={tab.id} style={{ display: activeTab === tab.id ? 'block' : 'none' }}>
              {tab.component}
            </div>
          ))}
        </div>

        {/* AI 피드백 기능 소개 */}
        <div className="mt-5">
          <h3 className="text-center mb-4" style={{color: COLORS.text.primary}}>
            🚀 AI가 제공하는 고급 분석 기능
          </h3>
          <div className="row g-4">
            <div className="col-md-4">
              <Card style={CARD_STYLES.large}>
                <Card.Body className="text-center">
                  <div className="mb-3" style={{
                    width: '60px',
                    height: '60px',
                    background: GRADIENTS.primary,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto'
                  }}>
                    <i className="bi bi-music-note fs-3 text-white"></i>
                  </div>
                  <h5 style={{color: COLORS.text.primary}}>화성 진행 분석</h5>
                  <p style={{color: COLORS.text.secondary}}>
                    로마 숫자 기반의 정확한 화성 분석으로 연주의 구조를 파악하세요
                  </p>
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-4">
              <Card style={CARD_STYLES.large}>
                <Card.Body className="text-center">
                  <div className="mb-3" style={{
                    width: '60px',
                    height: '60px',
                    background: GRADIENTS.success,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto'
                  }}>
                    <i className="bi bi-graph-up fs-3 text-white"></i>
                  </div>
                  <h5 style={{color: COLORS.text.primary}}>복잡도 평가</h5>
                  <p style={{color: COLORS.text.secondary}}>
                    AI가 연주의 난이도와 복잡도를 자동으로 분석하고 평가합니다
                  </p>
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-4">
              <Card style={CARD_STYLES.large}>
                <Card.Body className="text-center">
                  <div className="mb-3" style={{
                    width: '60px',
                    height: '60px',
                    background: GRADIENTS.warning,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto'
                  }}>
                    <i className="bi bi-lightbulb fs-3 text-white"></i>
                  </div>
                  <h5 style={{color: COLORS.text.primary}}>개선 제안</h5>
                  <p style={{color: COLORS.text.secondary}}>
                    When-in-Rome 기반의 전문적인 화성학적 피드백을 제공합니다
                  </p>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>

        {/* 연주 팁 섹션 */}
        <div className="mt-5">
          <Card style={{
            background: 'rgba(139, 92, 246, 0.05)',
            border: '1px solid rgba(139, 92, 246, 0.1)',
            borderRadius: '20px'
          }}>
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-3">
                <div className="me-3" style={{
                  width: '50px',
                  height: '50px',
                  background: GRADIENTS.primary,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <i className="bi bi-info-circle fs-4 text-white"></i>
                </div>
                <h4 style={{color: COLORS.text.primary, margin: 0}}>💡 AI 화성 분석 활용 팁</h4>
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <ul style={{color: COLORS.text.secondary}}>
                    <li>정확한 음정으로 연주하여 AI 분석의 정확도를 높이세요</li>
                    <li>메트로놈과 함께 연습하여 박자 정확도를 향상시키세요</li>
                    <li>화성 이론을 학습하여 분석 결과를 더 잘 이해하세요</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <ul style={{color: COLORS.text.secondary}}>
                    <li>정기적으로 분석을 받아 연주 실력의 발전을 추적하세요</li>
                    <li>AI 제안을 참고하여 연습 계획을 세우세요</li>
                    <li>다양한 곡을 연주하여 화성적 다양성을 경험하세요</li>
                  </ul>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
} 