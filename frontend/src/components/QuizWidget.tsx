import React, { useState, useEffect } from 'react';
import { COLORS, CARD_STYLES, BADGE_STYLES } from '../constants/styles';

interface QuizWidgetProps {
  className?: string;
}

const QuizWidget: React.FC<QuizWidgetProps> = ({ className = '' }) => {
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    // 퀴즈 데이터 로딩 시뮬레이션
    setTimeout(() => {
      setQuiz({
        id: 1,
        question: 'C Major 스케일의 첫 번째 음은 무엇일까요?',
        options: ['C', 'D', 'E', 'F'],
        correctAnswer: 0,
        explanation: 'C Major 스케일은 C부터 시작하여 C, D, E, F, G, A, B, C 순서로 진행됩니다.'
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    setIsCorrect(answerIndex === quiz.correctAnswer);
  };

  const handleNextQuiz = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setLoading(true);
    // 다음 퀴즈 로딩 시뮬레이션
    setTimeout(() => {
      setQuiz({
        id: 2,
        question: 'G Major 스케일의 5번째 음은 무엇일까요?',
        options: ['G', 'A', 'B', 'C'],
        correctAnswer: 2,
        explanation: 'G Major 스케일은 G, A, B, C, D, E, F#, G 순서로 진행되므로 5번째 음은 D입니다.'
      });
      setLoading(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className={`card shadow mb-4 ${className}`} style={CARD_STYLES.dark}>
        <div className="card-body text-center p-4">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">로딩 중...</span>
          </div>
          <p className="mb-0" style={{color: COLORS.text.secondary}}>퀴즈 로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className={`card shadow mb-4 ${className}`} style={CARD_STYLES.dark}>
        <div className="card-body text-center p-4">
          <i className="bi bi-question-circle display-4 text-muted mb-3"></i>
          <p className="mb-0" style={{color: COLORS.text.secondary}}>퀴즈가 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`card shadow mb-4 ${className}`} style={CARD_STYLES.dark}>
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0 fw-bold" style={{color: COLORS.text.primary}}>🧠 오늘의 퀴즈</h5>
          <span className="badge rounded-pill" style={BADGE_STYLES.primary}>#1</span>
        </div>
        
        <h6 className="fw-bold" style={{color: COLORS.text.primary}}>{quiz.question}</h6>
        
        <div className="mt-4">
          {quiz.options.map((option: string, index: number) => (
            <button
              key={index}
              className={`btn w-100 mb-2 text-start ${
                selectedAnswer === index
                  ? isCorrect
                    ? 'btn-success'
                    : 'btn-danger'
                  : 'btn-outline-light'
              }`}
              onClick={() => handleAnswerSelect(index)}
              disabled={showResult}
              style={{
                border: selectedAnswer === index ? 'none' : `1px solid ${COLORS.primary.border}`,
                borderRadius: '8px',
                padding: '12px 16px'
              }}
            >
              <span className="me-2">{String.fromCharCode(65 + index)}.</span>
              {option}
            </button>
          ))}
        </div>

        {showResult && (
          <div className="mt-4">
            <div className={`alert ${isCorrect ? 'alert-success' : 'alert-danger'}`} role="alert">
              <i className={`bi ${isCorrect ? 'bi-check-circle' : 'bi-x-circle'} me-2`}></i>
              <strong>{isCorrect ? '정답입니다!' : '틀렸습니다.'}</strong>
              <p className="mb-0 mt-2">{quiz.explanation}</p>
            </div>
            
            <button
              className="btn btn-primary w-100"
              onClick={handleNextQuiz}
              style={{
                background: COLORS.primary.main,
                border: 'none',
                borderRadius: '8px',
                padding: '12px 16px'
              }}
            >
              다음 퀴즈
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizWidget;
