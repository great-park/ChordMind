import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">ChordMind</h3>
            <p className="text-gray-400">
              AI 기반 음악 연주 분석 및 코칭 서비스
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">서비스</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/practice" className="hover:text-white transition-colors">연습하기</Link></li>
              <li><Link href="/analysis" className="hover:text-white transition-colors">분석하기</Link></li>
              <li><Link href="/games" className="hover:text-white transition-colors">게임</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">지원</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/help" className="hover:text-white transition-colors">도움말</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">문의하기</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">법적 고지</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/privacy" className="hover:text-white transition-colors">개인정보처리방침</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">이용약관</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 ChordMind. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
} 