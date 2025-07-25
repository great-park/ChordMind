import React from 'react';
import HarmonyQuiz from '../components/HarmonyQuiz';

const HarmonyQuizPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <h1 className="text-2xl font-bold text-center mb-6">화성학 퀴즈 체험</h1>
      <HarmonyQuiz />
    </div>
  );
};

export default HarmonyQuizPage; 