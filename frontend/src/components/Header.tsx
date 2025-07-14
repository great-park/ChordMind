'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold gradient-text">
              ChordMind
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/practice" className="text-gray-700 hover:text-indigo-600 transition-colors">
              연습하기
            </Link>
            <Link href="/analysis" className="text-gray-700 hover:text-indigo-600 transition-colors">
              분석하기
            </Link>
            <Link href="/games" className="text-gray-700 hover:text-indigo-600 transition-colors">
              게임
            </Link>
            <Link href="/progress" className="text-gray-700 hover:text-indigo-600 transition-colors">
              진행상황
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              로그인
            </button>
            
            {/* Mobile menu button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link href="/practice" className="text-gray-700 hover:text-indigo-600 transition-colors">
                연습하기
              </Link>
              <Link href="/analysis" className="text-gray-700 hover:text-indigo-600 transition-colors">
                분석하기
              </Link>
              <Link href="/games" className="text-gray-700 hover:text-indigo-600 transition-colors">
                게임
              </Link>
              <Link href="/progress" className="text-gray-700 hover:text-indigo-600 transition-colors">
                진행상황
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
} 