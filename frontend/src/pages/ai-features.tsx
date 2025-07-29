'use client'

import React from 'react'
import AIFeatures from '@/components/AIFeatures'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const AIFeaturesPage: React.FC = () => {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <Header />
      <main className="flex-grow-1">
        <AIFeatures />
      </main>
      <Footer />
    </div>
  )
}

export default AIFeaturesPage 