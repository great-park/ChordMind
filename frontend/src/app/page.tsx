'use client'

import { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';

// 인기 검색어 데이터 (예시)
const trendingKeywords = [
  '실시간 연주 분석',
  'AI 피드백',
  '음정 인식',
  '박자 교정',
  '코드 분석',
  '리듬 트레이닝',
  '연습 기록',
  '성장 그래프',
  '개인 맞춤 코칭',
  '음악 연습 챌린지',
]
const recentKeywords = [
  '피아노 연습',
  '기타 코드',
  '재즈 리듬',
  '템포 조절',
  '화성 분석',
]
const features = [
  { icon: '🎵', title: '실시간 연주 분석', desc: '마이크/파일로 연주를 즉시 분석' },
  { icon: '🤖', title: 'AI 피드백', desc: '개인 맞춤형 연습 코칭 제공' },
  { icon: '📈', title: '성장 그래프', desc: '연습 기록과 성장 시각화' },
  { icon: '🎹', title: '음정/박자 인식', desc: '정확한 음정·박자 분석' },
  { icon: '🎸', title: '코드/리듬 분석', desc: '코드, 리듬까지 AI가 분석' },
  { icon: '🏆', title: '연습 챌린지', desc: '목표 설정과 도전 미션' },
]
const reviews = [
  { user: '김민수', role: '피아노 연주자', text: 'AI 피드백 덕분에 실력이 쑥쑥 늘어요!', color: 'indigo' },
  { user: '이서연', role: '기타 입문자', text: '코드 분석이 정말 정확해서 연습이 재밌어요.', color: 'pink' },
  { user: '박지훈', role: '작곡가', text: '연습 기록과 성장 그래프가 동기부여에 최고!', color: 'green' },
]

export default function Home() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <MainLayout>
      {/* 기존 main 내부의 섹션들만 이곳에 배치 (히어로, 기능, 검색어, 후기, 그래프, CTA 등) */}
      {/* 히어로: 좌(텍스트/버튼) 우(일러스트) */}
      <section className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10 mb-16 px-4">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
            AI와 함께하는<br />음악 연주 분석
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            실시간으로 연주를 분석하고, 맞춤형 피드백과 성장 과정을 확인하세요.<br />
            박자, 음정, 코드, 리듬까지 AI가 정확하게 분석해드립니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button className="rounded-full px-8 py-3 bg-indigo-600 text-white font-bold text-lg shadow hover:bg-indigo-700 transition">연주 분석 시작하기</button>
            <button className="rounded-full px-8 py-3 bg-gray-100 text-indigo-600 font-bold text-lg shadow hover:bg-gray-200 transition">기능 살펴보기</button>
          </div>
        </div>
        <div className="flex-1 flex justify-center md:justify-end">
          {/* 음악/AI 일러스트 대체 SVG */}
          <div className="w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-indigo-100 to-pink-100 rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden">
            <svg className="w-40 h-40 md:w-60 md:h-60 text-indigo-400 opacity-80" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 64 64">
              <ellipse cx="32" cy="32" rx="28" ry="20" stroke="currentColor" strokeWidth="3" fill="white" />
              <path d="M20 44c0-8 24-8 24 0" stroke="currentColor" strokeWidth="2" />
              <ellipse cx="32" cy="28" rx="10" ry="14" stroke="currentColor" strokeWidth="2" />
              <circle cx="32" cy="28" r="3" fill="currentColor" />
              <path d="M32 31v7" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span className="absolute bottom-4 right-6 text-xs text-indigo-300">AI Music</span>
          </div>
        </div>
      </section>

      {/* 주요 기능 카드 그리드 (2줄 3칸) */}
      <section className="w-full max-w-5xl mx-auto mb-16 px-4" id="features">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">주요 기능</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={f.title} className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center hover:shadow-xl transition-all">
              <div className="text-4xl mb-4">{f.icon}</div>
              <div className="font-semibold text-lg mb-2">{f.title}</div>
              <div className="text-gray-600 text-sm text-center">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 실시간 검색어: 가로+세로 리스트 */}
      <section className="w-full max-w-5xl mx-auto mb-16 px-4 flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900 mb-4">실시간 인기 검색어</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
            {trendingKeywords.map((kw, idx) => (
              <div key={kw} className="min-w-[160px] bg-white border border-gray-100 rounded-xl shadow-sm p-5 flex flex-col items-center snap-center hover:shadow-md transition">
                <span className="text-xs text-gray-400 mb-2">{idx + 1}</span>
                <span className="font-semibold text-gray-800 text-base text-center">{kw}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900 mb-4">최근 검색어</h2>
          <ul className="bg-white rounded-xl shadow p-6 space-y-3">
            {recentKeywords.map((kw, idx) => (
              <li key={kw} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-500 flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                <span className="text-gray-700 font-medium">{kw}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 사용자 후기 + 성장 그래프 */}
      <section className="w-full max-w-5xl mx-auto mb-16 px-4 flex flex-col md:flex-row gap-8 items-center">
        {/* 후기 슬라이드 */}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900 mb-4">실제 사용자 후기</h2>
          <div className="flex gap-6 overflow-x-auto pb-2 snap-x">
            {reviews.map((r, i) => (
              <div key={r.user} className={`min-w-[260px] bg-white rounded-2xl shadow-lg p-8 flex-shrink-0 snap-center border-t-4 border-${r.color}-200`}>
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 bg-${r.color}-100 rounded-full flex items-center justify-center mr-4`}>
                    <span className={`text-${r.color}-600 font-semibold`}>{r.user[0]}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{r.user}</div>
                    <div className="text-sm text-gray-600">{r.role}</div>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed mb-2">"{r.text}"</p>
              </div>
            ))}
          </div>
        </div>
        {/* 성장 그래프 (예시 SVG) */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">나의 성장 그래프</h2>
          <div className="w-full max-w-xs h-48 bg-white rounded-xl shadow flex items-end p-6">
            {/* 간단한 성장 그래프 SVG */}
            <svg viewBox="0 0 200 100" className="w-full h-full">
              <polyline fill="none" stroke="#6366f1" strokeWidth="4" points="0,90 40,80 80,60 120,40 160,30 200,10" />
              <circle cx="200" cy="10" r="6" fill="#6366f1" />
            </svg>
          </div>
        </div>
      </section>

      {/* 하단 고정 CTA */}
      <div className="fixed bottom-0 left-0 w-full bg-indigo-600 text-white py-4 px-6 flex flex-col sm:flex-row items-center justify-between z-40 shadow-lg">
        <div className="font-bold text-lg mb-2 sm:mb-0">AI와 함께 음악 연주 실력을 키워보세요!</div>
        <button className="rounded-full px-8 py-3 bg-white text-indigo-600 font-bold text-lg shadow hover:bg-indigo-100 transition">지금 연주 분석 시작하기</button>
      </div>
    </MainLayout>
  )
} 