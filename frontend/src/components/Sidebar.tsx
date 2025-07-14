import React from 'react';

export default function Sidebar() {
  return (
    <aside className="w-full md:w-64 bg-white border-r border-gray-100 flex md:flex-col flex-row items-center md:items-start md:justify-between px-4 md:px-8 py-4 md:py-10 fixed md:static top-0 left-0 z-40 md:h-screen h-16 md:h-auto shadow md:shadow-none">
      <div className="flex items-center gap-2 md:mb-10">
        <span className="font-extrabold text-2xl text-indigo-600 tracking-tight">ChordMind</span>
      </div>
      <nav className="flex-1 flex gap-6 md:flex-col md:gap-4 text-gray-700 font-medium text-base md:mb-10">
        <a href="#analyze" className="hover:text-indigo-600 transition">연주 분석</a>
        <a href="#features" className="hover:text-indigo-600 transition">기능 소개</a>
        <a href="#practice" className="hover:text-indigo-600 transition">연습 기록</a>
      </nav>
      <div className="flex items-center gap-3 md:mb-0">
        <button className="rounded-full px-5 py-2 bg-indigo-50 text-indigo-600 font-semibold hover:bg-indigo-100 transition text-sm">로그인</button>
        <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-indigo-500 font-bold text-lg">유</div>
      </div>
    </aside>
  );
} 