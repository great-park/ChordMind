import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navigation />
      <main className="flex-grow-1 py-4">
        <div className="container-fluid">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
} 