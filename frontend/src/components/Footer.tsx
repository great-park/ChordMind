import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-pastelPurple via-pastelBlue to-pastelPink text-gray-800 py-14 px-4 sm:px-8 lg:px-12 rounded-t-3xl shadow-inner mt-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-12 md:gap-8">
          <div className="flex-1 mb-8 md:mb-0 flex flex-col items-start">
            <div className="flex items-center mb-2">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/70 shadow mr-2">
                {/* 음악 음표 SVG */}
                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
                </svg>
              </span>
              <span className="text-xl font-extrabold gradient-text tracking-tight select-none">ChordMind</span>
            </div>
            <p className="text-gray-500 text-sm mb-2">AI 기반 음악 연주 분석 및 코칭 서비스</p>
            <div className="flex space-x-2 mt-2">
              {/* 기타, 피아노 등 추가 SVG 아이콘 */}
              <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M8 12h8" /></svg>
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-sm font-semibold mb-4">서비스</h4>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/practice" className="hover:text-indigo-600 transition-colors">연습하기</Link></li>
                <li><Link href="/analysis" className="hover:text-indigo-600 transition-colors">분석하기</Link></li>
                <li><Link href="/games" className="hover:text-indigo-600 transition-colors">게임</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">지원</h4>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/help" className="hover:text-indigo-600 transition-colors">도움말</Link></li>
                <li><Link href="/contact" className="hover:text-indigo-600 transition-colors">문의하기</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">법적 고지</h4>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/privacy" className="hover:text-indigo-600 transition-colors">개인정보처리방침</Link></li>
                <li><Link href="/terms" className="hover:text-indigo-600 transition-colors">이용약관</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-pastelPurple/30 mt-10 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2024 ChordMind. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
} 