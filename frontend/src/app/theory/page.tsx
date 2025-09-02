'use client'

import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Nav, Tab } from 'react-bootstrap';
import TheoryLearningDashboard from '../../components/TheoryLearningDashboard';
import MusicTheoryQuiz from '../../components/MusicTheoryQuiz';
import HarmonyGame from '../../components/HarmonyGame';
import RhythmGame from '../../components/RhythmGame';
import { GRADIENTS, COLORS, CARD_STYLES, BADGE_STYLES, BUTTON_STYLES } from '../../constants/styles';

export default function TheoryPage() {
  const [activeTab, setActiveTab] = useState<'learning' | 'quiz' | 'harmony' | 'rhythm'>('learning');

  return (
    <div style={{ background: GRADIENTS.dark, minHeight: '100vh', padding: '2rem 0' }}>
      <Container>
        {/* 헤더 섹션 */}
        <div className="text-center mb-5">
          <div className="mb-3">
            <span className="badge px-3 py-2" style={{
              ...BADGE_STYLES.success,
              fontSize: '1rem'
            }}>
              📚 체계적 학습
            </span>
          </div>
          <h1 className="mb-3" style={{color: COLORS.text.primary, fontSize: '2.5rem', fontWeight: '700'}}>
            음악 이론 학습 시스템
          </h1>
          <p className="lead mb-0" style={{color: COLORS.text.secondary, fontSize: '1.2rem'}}>
            AI 기반의 체계적인 화성학 학습으로 음악적 이해를 높여보세요
          </p>
        </div>

        {/* 탭 네비게이션 */}
        <div className="d-flex justify-content-center mb-5">
          <div className="d-flex gap-2 flex-wrap">
            <Button
              variant={activeTab === 'learning' ? 'primary' : 'outline-primary'}
              onClick={() => setActiveTab('learning')}
              style={{
                ...(activeTab === 'learning' ? BUTTON_STYLES.primary : BUTTON_STYLES.outline),
                padding: '0.75rem 1.5rem',
                borderRadius: '25px'
              }}
            >
              📚 학습하기
            </Button>
            <Button
              variant={activeTab === 'quiz' ? 'primary' : 'outline-primary'}
              onClick={() => setActiveTab('quiz')}
              style={{
                ...(activeTab === 'quiz' ? BUTTON_STYLES.primary : BUTTON_STYLES.outline),
                padding: '0.75rem 1.5rem',
                borderRadius: '25px'
              }}
            >
              🎯 퀴즈하기
            </Button>
            <Button
              variant={activeTab === 'harmony' ? 'primary' : 'outline-primary'}
              onClick={() => setActiveTab('harmony')}
              style={{
                ...(activeTab === 'harmony' ? BUTTON_STYLES.primary : BUTTON_STYLES.outline),
                padding: '0.75rem 1.5rem',
                borderRadius: '25px'
              }}
            >
              🎹 화성게임
            </Button>
            <Button
              variant={activeTab === 'rhythm' ? 'primary' : 'outline-primary'}
              onClick={() => setActiveTab('rhythm')}
              style={{
                ...(activeTab === 'rhythm' ? BUTTON_STYLES.primary : BUTTON_STYLES.outline),
                padding: '0.75rem 1.5rem',
                borderRadius: '25px'
              }}
            >
              🥁 리듬게임
            </Button>
          </div>
        </div>

        {/* 탭 콘텐츠 */}
        {activeTab === 'learning' && (
          <>
            {/* 학습 시스템 소개 */}
            <div className="row g-4 mb-5">
              <div className="col-md-4">
                <div className="card h-100" style={CARD_STYLES.large}>
                  <div className="card-body text-center p-4">
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
                      <i className="bi bi-book fs-3 text-white"></i>
                    </div>
                    <h5 style={{color: COLORS.text.primary}}>체계적 커리큘럼</h5>
                    <p style={{color: COLORS.text.secondary}}>
                      초급부터 고급까지 단계별로 구성된 체계적인 학습 경로
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card h-100" style={CARD_STYLES.large}>
                  <div className="card-body text-center p-4">
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
                      <i className="bi bi-arrow-repeat fs-3 text-white"></i>
                    </div>
                    <h5 style={{color: COLORS.text.primary}}>진행 패턴 연습</h5>
                    <p style={{color: COLORS.text.secondary}}>
                      실제 곡 예시와 함께하는 화성 진행 패턴 학습
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card h-100" style={CARD_STYLES.large}>
                  <div className="card-body text-center p-4">
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
                      <i className="bi bi-palette fs-3 text-white"></i>
                    </div>
                    <h5 style={{color: COLORS.text.primary}}>모달 믹스처 가이드</h5>
                    <p style={{color: COLORS.text.secondary}}>
                      고급 화성 기법을 단계별로 학습하는 전문 가이드
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 음악 이론 학습 대시보드 */}
            <TheoryLearningDashboard />
          </>
        )}

        {activeTab === 'quiz' && (
          <MusicTheoryQuiz />
        )}

        {activeTab === 'harmony' && (
          <HarmonyGame />
        )}

        {activeTab === 'rhythm' && (
          <RhythmGame />
        )}

        {/* 추가 정보 섹션 */}
        <div className="mt-5">
          <div className="card" style={{
            background: 'rgba(34, 197, 94, 0.05)',
            border: '1px solid rgba(34, 197, 94, 0.1)',
            borderRadius: '20px'
          }}>
            <div className="card-body p-4">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h4 style={{color: COLORS.text.primary}}>
                    <i className="bi bi-lightbulb me-2" style={{color: COLORS.warning.light}}></i>
                    음악 이론 학습 팁
                  </h4>
                  <ul style={{color: COLORS.text.secondary, margin: 0}}>
                    <li className="mb-2">기본 개념부터 차근차근 학습하여 탄탄한 기초를 다지세요</li>
                    <li className="mb-2">실제 곡 예시와 함께 학습하여 이론을 실전에 적용해보세요</li>
                    <li className="mb-2">정기적으로 연습 문제를 풀어 학습 내용을 점검하세요</li>
                    <li>개인 맞춤 추천을 활용하여 효율적으로 학습하세요</li>
                  </ul>
                </div>
                <div className="col-md-4 text-center">
                  <div className="d-inline-flex align-items-center justify-content-center rounded-circle" style={{
                    width: '80px',
                    height: '80px',
                    background: GRADIENTS.success,
                    color: 'white'
                  }}>
                    <span className="fs-2">💡</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
