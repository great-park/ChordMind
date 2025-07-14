'use client'

import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useState, useEffect } from 'react'

export default function Home() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <>
      <Header />
      
      <main className="min-h-screen">
        {/* Hero Section with Animation */}
        <section className="section relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-pastelBlue via-pastelPurple to-pastelPink opacity-60"></div>
          <div className="relative max-w-7xl mx-auto text-center">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 drop-shadow-sm">
                AI와 함께하는
                <span className="gradient-text block mt-2">음악 연주 분석</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
                실시간으로 연주를 분석하고 맞춤형 피드백을 받아보세요.<br className="hidden md:block" />박자, 음정, 코드, 리듬까지 AI가 정확하게 분석해드립니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link href="/practice" className="btn-music btn-music-primary text-lg flex items-center justify-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13" /></svg>
                  연주 분석 시작하기
                </Link>
                <button className="btn-music btn-music-outline text-lg flex items-center justify-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M8 12h8" /></svg>
                  데모 보기
                </button>
              </div>
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="music-card text-center py-8">
                  <div className="text-3xl font-bold text-indigo-600 mb-2">10,000+</div>
                  <div className="text-gray-700">활성 사용자</div>
                </div>
                <div className="music-card text-center py-8">
                  <div className="text-3xl font-bold text-indigo-600 mb-2">50,000+</div>
                  <div className="text-gray-700">분석된 연주</div>
                </div>
                <div className="music-card text-center py-8">
                  <div className="text-3xl font-bold text-indigo-600 mb-2">95%</div>
                  <div className="text-gray-700">정확도</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section with Cards */}
        <section className="section">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4 drop-shadow-sm">
                강력한 기능들
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                AI 기술을 활용한 혁신적인 음악 학습 경험을 제공합니다
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="music-card p-8">
                <div className="w-16 h-16 bg-pastelPurple/60 rounded-2xl flex items-center justify-center mb-6 shadow">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">실시간 연주 분석</h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  마이크나 파일 업로드를 통해 연주를 실시간으로 분석하고 음정, 박자, 코드를 정확하게 인식합니다.
                </p>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    정확한 음정 인식
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    박자 분석
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    코드 인식
                  </li>
                </ul>
              </div>
              <div className="music-card p-8">
                <div className="w-16 h-16 bg-pastelGreen/60 rounded-2xl flex items-center justify-center mb-6 shadow">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">AI 코칭</h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  개인 맞춤형 피드백과 연습 추천을 제공합니다. 취약점을 분석하고 개선 방향을 제시합니다.
                </p>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    맞춤형 피드백
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    연습 추천
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    취약점 분석
                  </li>
                </ul>
              </div>
              <div className="music-card p-8">
                <div className="w-16 h-16 bg-pastelPink/60 rounded-2xl flex items-center justify-center mb-6 shadow">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">진행상황 추적</h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  연습 기록과 성장 그래프를 통해 발전 과정을 시각적으로 확인하고 동기부여를 받을 수 있습니다.
                </p>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    성장 그래프
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    연습 기록
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    동기부여 시스템
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                사용 방법
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                간단한 3단계로 AI 음악 분석을 시작하세요
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  1
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">연주 업로드</h3>
                <p className="text-gray-600">
                  마이크로 실시간 연주하거나 오디오/미디 파일을 업로드하세요
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  2
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">AI 분석</h3>
                <p className="text-gray-600">
                  AI가 음정, 박자, 코드, 리듬을 실시간으로 분석합니다
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  3
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">피드백 받기</h3>
                <p className="text-gray-600">
                  개인 맞춤형 피드백과 개선 방향을 받아보세요
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                사용자 후기
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                실제 사용자들의 생생한 경험담을 들어보세요
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-8 rounded-2xl">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-indigo-600 font-semibold">김</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">김민수</div>
                    <div className="text-sm text-gray-600">피아노 연주자</div>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  "AI가 정확하게 박자와 음정을 분석해줘서 연습 효율이 크게 올랐어요. 
                  개인 맞춤 피드백이 정말 도움이 됩니다!"
                </p>
                <div className="flex text-yellow-400 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-50 p-8 rounded-2xl">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-green-600 font-semibold">이</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">이지은</div>
                    <div className="text-sm text-gray-600">기타 연주자</div>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  "코드 인식이 정말 정확해요! 화성학 공부에도 도움이 되고, 
                  연습할 때마다 실력이 늘어나는 걸 체감할 수 있어요."
                </p>
                <div className="flex text-yellow-400 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-50 p-8 rounded-2xl">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-purple-600 font-semibold">박</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">박준호</div>
                    <div className="text-sm text-gray-600">드럼 연주자</div>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  "리듬 분석이 정말 대단해요! 박자 연습할 때 정확한 피드백을 받을 수 있어서 
                  실력 향상이 눈에 보여요."
                </p>
                <div className="flex text-yellow-400 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-4">
              지금 시작해보세요
            </h2>
            <p className="text-xl mb-8 opacity-90">
              AI와 함께 더 나은 음악 연주를 경험해보세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/practice" className="btn-music btn-music-primary text-lg flex items-center justify-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13" /></svg>
                무료로 시작하기
              </Link>
              <button className="btn-music btn-music-outline text-lg flex items-center justify-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M8 12h8" /></svg>
                더 알아보기
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
} 