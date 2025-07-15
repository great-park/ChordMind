import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ChordMind - AI와 함께하는 음악 연주 분석',
  description: '실시간으로 연주를 분석하고, 맞춤형 피드백과 성장 과정을 확인하세요. 박자, 음정, 코드, 리듬까지 AI가 정확하게 분석해드립니다.',
  keywords: '음악, 연주, 분석, AI, 피드백, 연습, 피아노, 기타, 코드, 리듬',
  authors: [{ name: 'ChordMind Team' }],
  robots: 'index, follow',
  openGraph: {
    title: 'ChordMind - AI와 함께하는 음악 연주 분석',
    description: '실시간으로 연주를 분석하고, 맞춤형 피드백과 성장 과정을 확인하세요.',
    type: 'website',
    locale: 'ko_KR',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
} 