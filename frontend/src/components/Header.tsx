'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white/60 backdrop-blur-xl shadow-lg rounded-b-3xl border-b border-pastelPurple/40 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-pastelPurple/60 shadow-md mr-2">
              {/* 음악 음표 SVG */}
              <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
              </svg>
            </span>
            <Link href="/" className="text-3xl font-extrabold gradient-text tracking-tight drop-shadow-sm select-none">
              ChordMind
            </Link>
          </div>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-10 text-lg font-semibold">
            <Link href="/practice" className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 px-2 py-1 rounded-lg hover:bg-pastelPurple/30">연습하기</Link>
            <Link href="/analysis" className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 px-2 py-1 rounded-lg hover:bg-pastelPurple/30">분석하기</Link>
            <Link href="/games" className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 px-2 py-1 rounded-lg hover:bg-pastelPurple/30">게임</Link>
            <Link href="/progress" className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 px-2 py-1 rounded-lg hover:bg-pastelPurple/30">진행상황</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <button className="btn-music btn-music-primary text-base px-6 py-2">로그인</button>
            {/* Mobile menu button */}
            <button
              className="md:hidden rounded-lg p-2 hover:bg-pastelPurple/40 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-7 h-7 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-pastelPurple/30 bg-white/80 rounded-b-2xl shadow-lg animate-fade-in">
            <nav className="flex flex-col space-y-4 text-lg font-semibold">
              <Link href="/practice" className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 px-2 py-1 rounded-lg hover:bg-pastelPurple/30">연습하기</Link>
              <Link href="/analysis" className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 px-2 py-1 rounded-lg hover:bg-pastelPurple/30">분석하기</Link>
              <Link href="/games" className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 px-2 py-1 rounded-lg hover:bg-pastelPurple/30">게임</Link>
              <Link href="/progress" className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 px-2 py-1 rounded-lg hover:bg-pastelPurple/30">진행상황</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
} 