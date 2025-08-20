import React, { useState, useEffect } from 'react';

interface Question {
  id: number;
  question: string;
  choices: string[];
  correct: string;
}

interface QuizResult {
  correct: boolean;
  explanation: string;
}

interface QuizWidgetProps {
  className?: string;
}

const QuizWidget: React.FC<QuizWidgetProps> = ({ className = '' }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    // 임시 퀴즈 데이터
    const mockQuestions: Question[] = [
      {
        id: 1,
        question: 'C Major Scale의 첫 번째 음은?',
        choices: ['C', 'D', 'E', 'F'],
        correct: 'C'
      }
    ];
    setQuestions(mockQuestions);
    setLoading(false);
  }, []);

  const handleSelect = (choice: string) => {
    setSelected(choice);
  };

  const handleSubmit = async () => {
    if (!questions[current] || !selected) return;
    setLoading(true);
    try {
      // 임시 결과
      const isCorrect = selected === questions[current].correct;
      setResult({ 
        correct: isCorrect, 
        explanation: isCorrect ? '정답입니다!' : '틀렸습니다.' 
      });
    } catch {
      setError('정답 제출에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className={`card shadow mb-4 ${className}`} style={{
      background: 'linear-gradient(135deg, #334155 0%, #475569 100%)',
      borderRadius: '16px',
      border: '1px solid rgba(139, 92, 246, 0.15)',
      boxShadow: '0 8px 20px -5px rgba(0, 0, 0, 0.2), 0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}>
      <div className="card-body text-center">
        <div className="spinner-border text-primary mb-2" role="status">
          <span className="visually-hidden">로딩 중...</span>
        </div>
        <p className="mb-0" style={{color: '#cbd5e1'}}>퀴즈 로딩 중...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className={`card shadow mb-4 ${className}`} style={{
      background: 'linear-gradient(135deg, #334155 0%, #475569 100%)',
      borderRadius: '16px',
      border: '1px solid rgba(139, 92, 246, 0.15)',
      boxShadow: '0 8px 20px -5px rgba(0, 0, 0, 0.2), 0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}>
      <div className="card-body">
        <div className="alert alert-danger border-0">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      </div>
    </div>
  );
  
  if (!questions.length) return (
    <div className={`card shadow mb-4 ${className}`} style={{
      background: 'linear-gradient(135deg, #334155 0%, #475569 100%)',
      borderRadius: '16px',
      border: '1px solid rgba(139, 92, 246, 0.15)',
      boxShadow: '0 8px 20px -5px rgba(0, 0, 0, 0.2), 0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}>
      <div className="card-body text-center">
        <i className="bi bi-question-circle display-4 text-muted mb-3"></i>
        <p className="mb-0" style={{color: '#cbd5e1'}}>퀴즈가 없습니다.</p>
      </div>
    </div>
  );

  const q = questions[current];

  return (
    <div className={`card shadow mb-4 ${className}`} style={{
      background: 'linear-gradient(135deg, #334155 0%, #475569 100%)',
      borderRadius: '16px',
      border: '1px solid rgba(139, 92, 246, 0.15)',
      boxShadow: '0 8px 20px -5px rgba(0, 0, 0, 0.2), 0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}>
      <div className="card-header border-0 bg-transparent p-4">
        <h5 className="mb-0 fw-bold" style={{color: 'white'}}>🧠 오늘의 퀴즈</h5>
      </div>
      <div className="card-body p-4">
        <div className="mb-3">
          <h6 className="fw-bold" style={{color: 'white'}}>{q.question}</h6>
        </div>
        <div className="mb-3">
          {q.choices.map((choice: string) => (
            <button
              key={choice}
              onClick={() => handleSelect(choice)}
              className="btn me-2 mb-2 px-3 py-2"
              style={{
                background: selected === choice ? '#8b5cf6' : 'transparent',
                color: selected === choice ? 'white' : '#a78bfa',
                border: `2px solid #8b5cf6`,
                borderRadius: '8px',
                fontWeight: '500'
              }}
              disabled={!!result}
            >
              {choice}
            </button>
          ))}
        </div>
        {!result && (
          <button 
            onClick={handleSubmit} 
            disabled={!selected} 
            className="btn px-3 py-2"
            style={{
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '500'
            }}
          >
            <i className="bi bi-check-circle me-1"></i>
            정답 제출
          </button>
        )}
        {result && (
          <div className={`alert ${result.correct ? 'alert-success' : 'alert-danger'} border-0`}>
            <div className="d-flex align-items-center">
              <i className={`bi ${result.correct ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} me-2`}></i>
              <strong>{result.explanation}</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizWidget;
