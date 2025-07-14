import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Header />
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              AI와 함께하는
              <span className="gradient-text block">음악 연주 분석</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              실시간으로 연주를 분석하고 맞춤형 피드백을 받아보세요. 
              박자, 음정, 코드, 리듬까지 AI가 정확하게 분석해드립니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/practice" className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors inline-block text-center">
                연주 분석 시작하기
              </Link>
              <button className="border border-indigo-600 text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-50 transition-colors">
                데모 보기
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              주요 기능
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-lg card-hover">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">실시간 연주 분석</h3>
                <p className="text-gray-600">
                  마이크나 파일 업로드를 통해 연주를 실시간으로 분석하고 
                  음정, 박자, 코드를 정확하게 인식합니다.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg card-hover">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">AI 코칭</h3>
                <p className="text-gray-600">
                  개인 맞춤형 피드백과 연습 추천을 제공합니다. 
                  취약점을 분석하고 개선 방향을 제시합니다.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg card-hover">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">진행상황 추적</h3>
                <p className="text-gray-600">
                  연습 기록과 성장 그래프를 통해 발전 과정을 시각적으로 확인하고 
                  동기부여를 받을 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              지금 시작해보세요
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              AI와 함께 더 나은 음악 연주를 경험해보세요
            </p>
            <Link href="/practice" className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors inline-block">
              무료로 시작하기
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
} 