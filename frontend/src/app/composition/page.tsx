'use client'

import React from 'react';
import CompositionAssistant from '../../components/CompositionAssistant';
import { GRADIENTS, COLORS, CARD_STYLES, BADGE_STYLES, BUTTON_STYLES } from '../../constants/styles';

export default function CompositionPage() {
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
              🎼 AI 작곡 어시스턴트
            </span>
          </div>
          <h1 className="mb-3" style={{color: COLORS.text.primary, fontSize: '2.5rem', fontWeight: '700'}}>
            AI와 함께하는 창작의 세계
          </h1>
          <p className="lead mb-0" style={{color: COLORS.text.secondary, fontSize: '1.2rem'}}>
            When-in-Rome 기반의 전문적인 화성학 지식으로 당신의 작곡을 도와드립니다
          </p>
        </div>

        {/* 기능 소개 카드 */}
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
                  <i className="bi bi-arrow-repeat fs-3 text-white"></i>
                </div>
                <h5 style={{color: COLORS.text.primary}}>화성 진행 제안</h5>
                <p style={{color: COLORS.text.secondary}}>
                  스타일과 분위기에 맞는 최적의 화성 진행 패턴을 제안합니다
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
                  <i className="bi bi-music-note fs-3 text-white"></i>
                </div>
                <h5 style={{color: COLORS.text.primary}}>멜로디 생성</h5>
                <p style={{color: COLORS.text.secondary}}>
                  화성 진행에 맞는 멜로디와 리듬을 자동으로 생성합니다
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
                  <i className="bi bi-arrow-repeat fs-3 text-white"></i>
                </div>
                <h5 style={{color: COLORS.text.primary}}>조성 전환 가이드</h5>
                <p style={{color: COLORS.text.secondary}}>
                  전문적인 조성 전환 기법과 활용법을 상세히 안내합니다
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* AI 작곡 어시스턴트 컴포넌트 */}
        <CompositionAssistant />

        {/* 추가 정보 섹션 */}
        <div className="mt-5">
          <div className="card" style={{
            background: 'rgba(139, 92, 246, 0.05)',
            border: '1px solid rgba(139, 92, 246, 0.1)',
            borderRadius: '20px'
          }}>
            <div className="card-body p-4">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h4 style={{color: COLORS.text.primary}}>
                    <i className="bi bi-lightbulb me-2" style={{color: COLORS.warning.light}}></i>
                    AI 작곡 활용 팁
                  </h4>
                  <ul style={{color: COLORS.text.secondary, margin: 0}}>
                    <li className="mb-2">스타일과 분위기를 명확히 설정하여 더 정확한 제안을 받으세요</li>
                    <li className="mb-2">제안된 화성 진행을 기본으로 하여 자신만의 변주를 시도해보세요</li>
                    <li className="mb-2">조성 전환을 활용하여 음악적 긴장감과 변화를 만들어보세요</li>
                    <li>정기적으로 AI 제안을 받아 작곡 스킬을 발전시키세요</li>
                  </ul>
                </div>
                <div className="col-md-4 text-center">
                  <div className="d-inline-flex align-items-center justify-content-center rounded-circle" style={{
                    width: '80px',
                    height: '80px',
                    background: GRADIENTS.primary,
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
