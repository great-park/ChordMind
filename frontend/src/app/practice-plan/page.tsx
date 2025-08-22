'use client'

import React from 'react';
import PracticePlanGenerator from '../../components/PracticePlanGenerator';
import { GRADIENTS, COLORS, CARD_STYLES, BADGE_STYLES, BUTTON_STYLES } from '../../constants/styles';

export default function PracticePlanPage() {
  return (
    <div style={{ background: GRADIENTS.dark, minHeight: '100vh', padding: '2rem 0' }}>
      <div className="container">
        {/* 헤더 섹션 */}
        <div className="text-center mb-5">
          <div className="mb-3">
            <span className="badge px-3 py-2" style={{
              ...BADGE_STYLES.warning,
              fontSize: '1rem'
            }}>
              🎯 개인 맞춤
            </span>
          </div>
          <h1 className="mb-3" style={{color: COLORS.text.primary, fontSize: '2.5rem', fontWeight: '700'}}>
            개인 맞춤 연습 계획
          </h1>
          <p className="lead mb-0" style={{color: COLORS.text.secondary, fontSize: '1.2rem'}}>
            AI가 분석하는 당신만의 연습 계획으로 효율적인 실력 향상을 경험하세요
          </p>
        </div>

        {/* 시스템 소개 */}
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
                  <i className="bi bi-graph-up fs-3 text-white"></i>
                </div>
                <h5 style={{color: COLORS.text.primary}}>AI 진단</h5>
                <p style={{color: COLORS.text.secondary}}>
                  현재 음악 실력과 개선 영역을 정확하게 분석합니다
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
                  <i className="bi bi-calendar-check fs-3 text-white"></i>
                </div>
                <h5 style={{color: COLORS.text.primary}}>맞춤형 커리큘럼</h5>
                <p style={{color: COLORS.text.secondary}}>
                  개인 수준과 목표에 맞는 체계적인 연습 계획을 생성합니다
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
                  <i className="bi bi-bar-chart fs-3 text-white"></i>
                </div>
                <h5 style={{color: COLORS.text.primary}}>진도 추적</h5>
                <p style={{color: COLORS.text.secondary}}>
                  연습 진행 상황과 목표 달성도를 실시간으로 확인합니다
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 개인 맞춤 연습 계획 생성기 */}
        <PracticePlanGenerator />

        {/* 추가 정보 섹션 */}
        <div className="mt-5">
          <div className="card" style={{
            background: 'rgba(251, 191, 36, 0.05)',
            border: '1px solid rgba(251, 191, 36, 0.1)',
            borderRadius: '20px'
          }}>
            <div className="card-body p-4">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h4 style={{color: COLORS.text.primary}}>
                    <i className="bi bi-lightbulb me-2" style={{color: COLORS.warning.light}}></i>
                    연습 계획 활용 팁
                  </h4>
                  <ul style={{color: COLORS.text.secondary, margin: 0}}>
                    <li className="mb-2">현실적인 목표를 설정하여 꾸준한 동기부여를 유지하세요</li>
                    <li className="mb-2">일일 연습 시간을 일정하게 유지하여 습관을 만드세요</li>
                    <li className="mb-2">주간 목표를 달성할 때마다 작은 보상을 주세요</li>
                    <li>정기적으로 계획을 점검하고 필요시 조정하세요</li>
                  </ul>
                </div>
                <div className="col-md-4 text-center">
                  <div className="d-inline-flex align-items-center justify-content-center rounded-circle" style={{
                    width: '80px',
                    height: '80px',
                    background: GRADIENTS.warning,
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
