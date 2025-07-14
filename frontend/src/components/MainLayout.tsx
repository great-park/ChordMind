import React from 'react';
import Sidebar from './Sidebar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 md:ml-64 pt-24 pb-32 flex flex-col items-center w-full">
        {children}
      </main>
    </div>
  );
} 