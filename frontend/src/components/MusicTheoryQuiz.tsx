'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Button, ProgressBar, Badge, Alert } from 'react-bootstrap';
import { GRADIENTS, COLORS, CARD_STYLES, BADGE_STYLES, BUTTON_STYLES } from '../constants/styles';

interface QuizQuestion {
  id: number;
  type: 'multiple_choice' | 'true_false' | 'note_identification' | 'interval_recognition';
  category: 'theory' | 'harmony' | 'rhythm' | 'notation';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  audioUrl?: string;
  imageUrl?: string;
}

interface QuizResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  category: string;
  difficulty: string;
}

const MusicTheoryQuiz: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 샘플 퀴즈 데이터
  const sampleQuestions: QuizQuestion[] = [
    {
      id: 1,
      type: 'multiple_choice',
      category: 'theory',
      difficulty: 'easy',
      question: '다음 중 메이저 스케일의 구성음은?',
      options: ['온음-온음-반음-온음-온음-온음-반음', '온음-반음-온음-온음-반음-온음-온음', '반음-온음-온음-반음-온음-온음-온음', '온음-온음-반음-온음-온음-반음-온음'],
      correctAnswer: 0,
      explanation: '메이저 스케일은 온음-온음-반음-온음-온음-온음-반음의 간격으로 구성됩니다.'
    },
    {
      id: 2,
      type: 'true_false',
      category: 'harmony',
      difficulty: 'medium',
      question: 'C 메이저 코드는 C-E-G로 구성된다.',
      correctAnswer: true,
      explanation: '맞습니다. C 메이저 코드는 루트(C), 메이저 3도(E), 퍼펙트 5도(G)로 구성됩니다.'
    },
    {
      id: 3,
      type: 'multiple_choice',
      category: 'notation',
      difficulty: 'easy',
      question: '다음 중 4/4박자의 의미는?',
      options: ['4분음표가 4개', '4박자마다 1마디', '4분음표가 1박자, 1마디에 4박자', '4마디마다 1박자'],
      correctAnswer: 2,
      explanation: '4/4박자는 4분음표가 1박자이고, 1마디에 4박자가 있다는 의미입니다.'
    },
    {
      id: 4,
      type: 'multiple_choice',
      category: 'harmony',
      difficulty: 'hard',
      question: '다음 중 도미넌트 7th 코드는?',
      options: ['Cmaj7', 'C7', 'Cm7', 'Cm7♭5'],
      correctAnswer: 1,
      explanation: 'C7은 도미넌트 7th 코드로, 메이저 3도와 마이너 7도로 구성됩니다.'
    },
    {
      id: 5,
      type: 'true_false',
      category: 'rhythm',
      difficulty: 'medium',
      question: '8분음표는 4분음표의 절반 길이이다.',
      correctAnswer: true,
      explanation: '맞습니다. 8분음표는 4분음표의 절반 길이입니다.'
    },
    {
      id: 6,
      type: 'multiple_choice',
      category: 'theory',
      difficulty: 'easy',
      question: '다음 중 마이너 스케일의 특징은?',
      options: ['밝고 명랑한 느낌', '어둡고 슬픈 느낌', '신비로운 느낌', '웅장한 느낌'],
      correctAnswer: 1,
      explanation: '마이너 스케일은 어둡고 슬픈 느낌을 주는 것이 특징입니다.'
    },
    {
      id: 7,
      type: 'multiple_choice',
      category: 'harmony',
      difficulty: 'medium',
      question: '다음 중 2-5-1 진행에서 2는?',
      options: ['도미넌트', '서브도미넌트', '수퍼토닉', '토닉'],
      correctAnswer: 2,
      explanation: '2-5-1 진행에서 2는 수퍼토닉(Supertonic)을 의미합니다.'
    },
    {
      id: 8,
      type: 'true_false',
      category: 'notation',
      difficulty: 'easy',
      question: '샤프(♯)는 음을 반음 올린다.',
      correctAnswer: true,
      explanation: '맞습니다. 샤프(♯)는 음을 반음 올리는 기호입니다.'
    }
  ];

  // 타이머 시작
  useEffect(() => {
    if (quizStarted && !quizCompleted && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [quizStarted, quizCompleted, timeLeft]);

  const handleTimeUp = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    handleAnswerSubmit(null);
  };

  const startQuiz = () => {
    let filteredQuestions = sampleQuestions;
    
    if (selectedCategory !== 'all') {
      filteredQuestions = filteredQuestions.filter(q => q.category === selectedCategory);
    }
    
    if (selectedDifficulty !== 'all') {
      filteredQuestions = filteredQuestions.filter(q => q.difficulty === selectedDifficulty);
    }

    // 랜덤하게 5개 문제 선택
    const shuffled = filteredQuestions.sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 5));
    setCurrentQuestionIndex(0);
    setQuizStarted(true);
    setQuizCompleted(false);
    setScore(0);
    setTimeLeft(30);
    setShowResult(false);
  };

  const handleAnswerSubmit = (answer: string | number | null) => {
    const currentQuestion = questions[currentQuestionIndex];
    const correct = answer === currentQuestion.correctAnswer;
    
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setScore(prev => prev + 1);
    }

    // 2초 후 다음 문제로
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        setIsCorrect(null);
        setTimeLeft(30);
      } else {
        // 퀴즈 완료
        setQuizCompleted(true);
        setQuizResult({
          score: correct ? score + 1 : score,
          totalQuestions: questions.length,
          correctAnswers: correct ? score + 1 : score,
          timeSpent: 30 - timeLeft,
          category: selectedCategory,
          difficulty: selectedDifficulty
        });
      }
    }, 2000);
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(30);
    setShowResult(false);
    setIsCorrect(null);
    setSelectedAnswer(null);
    setQuizResult(null);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return COLORS.success.main;
      case 'medium': return COLORS.warning.main;
      case 'hard': return COLORS.danger.main;
      default: return COLORS.text.secondary;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'theory': return '🎼';
      case 'harmony': return '🎹';
      case 'rhythm': return '🥁';
      case 'notation': return '📝';
      default: return '🎵';
    }
  };

  if (!quizStarted) {
    return (
      <Card style={CARD_STYLES.large}>
        <Card.Header className="border-0 bg-transparent p-4">
          <div className="text-center">
            <h4 style={{ color: COLORS.text.primary, marginBottom: '1rem' }}>
              🎵 음악 이론 퀴즈
            </h4>
            <p style={{ color: COLORS.text.secondary }}>
              음악 이론 지식을 테스트해보세요!
            </p>
          </div>
        </Card.Header>
        
        <Card.Body className="p-4">
          {/* 카테고리 선택 */}
          <div className="mb-4">
            <h6 style={{ color: COLORS.text.primary, marginBottom: '1rem' }}>카테고리 선택</h6>
            <div className="d-flex flex-wrap gap-2">
              {[
                { key: 'all', label: '전체', icon: '🎵' },
                { key: 'theory', label: '음악 이론', icon: '🎼' },
                { key: 'harmony', label: '화성학', icon: '🎹' },
                { key: 'rhythm', label: '리듬', icon: '🥁' },
                { key: 'notation', label: '기보법', icon: '📝' }
              ].map(category => (
                <Button
                  key={category.key}
                  variant={selectedCategory === category.key ? 'primary' : 'outline-primary'}
                  onClick={() => setSelectedCategory(category.key)}
                  style={{
                    borderRadius: '20px',
                    padding: '0.5rem 1rem'
                  }}
                >
                  {category.icon} {category.label}
                </Button>
              ))}
            </div>
          </div>

          {/* 난이도 선택 */}
          <div className="mb-4">
            <h6 style={{ color: COLORS.text.primary, marginBottom: '1rem' }}>난이도 선택</h6>
            <div className="d-flex gap-2">
              {[
                { key: 'all', label: '전체', color: COLORS.text.secondary },
                { key: 'easy', label: '쉬움', color: COLORS.success.main },
                { key: 'medium', label: '보통', color: COLORS.warning.main },
                { key: 'hard', label: '어려움', color: COLORS.danger.main }
              ].map(difficulty => (
                <Button
                  key={difficulty.key}
                  variant={selectedDifficulty === difficulty.key ? 'primary' : 'outline-primary'}
                  onClick={() => setSelectedDifficulty(difficulty.key)}
                  style={{
                    borderRadius: '20px',
                    padding: '0.5rem 1rem',
                    borderColor: difficulty.color,
                    color: selectedDifficulty === difficulty.key ? 'white' : difficulty.color
                  }}
                >
                  {difficulty.label}
                </Button>
              ))}
            </div>
          </div>

          {/* 퀴즈 시작 버튼 */}
          <div className="text-center">
            <Button
              onClick={startQuiz}
              style={{
                ...BUTTON_STYLES.primary,
                padding: '1rem 2rem',
                fontSize: '1.2rem',
                borderRadius: '25px'
              }}
            >
              🚀 퀴즈 시작하기
            </Button>
          </div>
        </Card.Body>
      </Card>
    );
  }

  if (quizCompleted && quizResult) {
    const percentage = Math.round((quizResult.correctAnswers / quizResult.totalQuestions) * 100);
    
    return (
      <Card style={CARD_STYLES.large}>
        <Card.Header className="border-0 bg-transparent p-4">
          <div className="text-center">
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
              {percentage >= 80 ? '🏆' : percentage >= 60 ? '🎉' : '💪'}
            </div>
            <h4 style={{ color: COLORS.text.primary, marginBottom: '0.5rem' }}>
              퀴즈 완료!
            </h4>
            <p style={{ color: COLORS.text.secondary }}>
              {percentage >= 80 ? '훌륭합니다!' : percentage >= 60 ? '잘했습니다!' : '더 연습해보세요!'}
            </p>
          </div>
        </Card.Header>
        
        <Card.Body className="p-4">
          {/* 결과 통계 */}
          <Row className="mb-4">
            <Col md={4}>
              <div className="text-center">
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  background: GRADIENTS.primary,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  {percentage}%
                </div>
                <small style={{ color: COLORS.text.secondary }}>정답률</small>
              </div>
            </Col>
            <Col md={4}>
              <div className="text-center">
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  color: COLORS.success.main
                }}>
                  {quizResult.correctAnswers}/{quizResult.totalQuestions}
                </div>
                <small style={{ color: COLORS.text.secondary }}>정답 수</small>
              </div>
            </Col>
            <Col md={4}>
              <div className="text-center">
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  color: COLORS.info.main
                }}>
                  {quizResult.timeSpent}초
                </div>
                <small style={{ color: COLORS.text.secondary }}>소요 시간</small>
              </div>
            </Col>
          </Row>

          {/* 액션 버튼들 */}
          <div className="d-flex gap-3 justify-content-center">
            <Button
              onClick={resetQuiz}
              style={{
                ...BUTTON_STYLES.primary,
                padding: '0.75rem 1.5rem',
                borderRadius: '20px'
              }}
            >
              🔄 다시 도전
            </Button>
            <Button
              onClick={resetQuiz}
              style={{
                ...BUTTON_STYLES.outline,
                padding: '0.75rem 1.5rem',
                borderRadius: '20px'
              }}
            >
              🏠 홈으로
            </Button>
          </div>
        </Card.Body>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <Card style={CARD_STYLES.large}>
      <Card.Header className="border-0 bg-transparent p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 style={{ color: COLORS.text.primary, marginBottom: '0.5rem' }}>
              {getCategoryIcon(currentQuestion.category)} {currentQuestion.category.toUpperCase()}
            </h5>
            <Badge style={{
              background: getDifficultyColor(currentQuestion.difficulty),
              color: 'white',
              fontSize: '0.8rem'
            }}>
              {currentQuestion.difficulty.toUpperCase()}
            </Badge>
          </div>
          <div className="text-end">
            <div style={{ color: COLORS.text.primary, fontSize: '1.2rem', fontWeight: 'bold' }}>
              {timeLeft}초
            </div>
            <small style={{ color: COLORS.text.secondary }}>남은 시간</small>
          </div>
        </div>
        
        <ProgressBar
          now={progress}
          style={{ height: '8px', borderRadius: '4px' }}
          className="mb-3"
        />
        
        <div className="text-center">
          <small style={{ color: COLORS.text.secondary }}>
            문제 {currentQuestionIndex + 1} / {questions.length}
          </small>
        </div>
      </Card.Header>
      
      <Card.Body className="p-4">
        {/* 문제 */}
        <div className="text-center mb-4">
          <h4 style={{ color: COLORS.text.primary, marginBottom: '1rem' }}>
            {currentQuestion.question}
          </h4>
        </div>

        {/* 답변 옵션 */}
        {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
          <div className="mb-4">
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                variant="outline-primary"
                className="w-100 mb-2"
                onClick={() => setSelectedAnswer(index)}
                disabled={showResult}
                style={{
                  ...BUTTON_STYLES.outline,
                  padding: '1rem',
                  textAlign: 'left',
                  borderRadius: '10px',
                  borderColor: selectedAnswer === index ? COLORS.primary.main : COLORS.primary.border,
                  background: selectedAnswer === index ? COLORS.primary.background : 'transparent'
                }}
              >
                <span style={{ marginRight: '1rem', fontWeight: 'bold' }}>
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
              </Button>
            ))}
          </div>
        )}

        {currentQuestion.type === 'true_false' && (
          <div className="d-flex gap-3 justify-content-center mb-4">
            <Button
              variant="outline-success"
              onClick={() => setSelectedAnswer(true)}
              disabled={showResult}
              style={{
                ...BUTTON_STYLES.outline,
                padding: '1rem 2rem',
                borderRadius: '20px',
                borderColor: selectedAnswer === true ? COLORS.success.main : COLORS.success.border,
                background: selectedAnswer === true ? COLORS.success.background : 'transparent'
              }}
            >
              ✅ 맞음
            </Button>
            <Button
              variant="outline-danger"
              onClick={() => setSelectedAnswer(false)}
              disabled={showResult}
              style={{
                ...BUTTON_STYLES.outline,
                padding: '1rem 2rem',
                borderRadius: '20px',
                borderColor: selectedAnswer === false ? COLORS.danger.main : COLORS.danger.border,
                background: selectedAnswer === false ? COLORS.danger.background : 'transparent'
              }}
            >
              ❌ 틀림
            </Button>
          </div>
        )}

        {/* 답변 제출 버튼 */}
        {!showResult && (
          <div className="text-center">
            <Button
              onClick={() => handleAnswerSubmit(selectedAnswer)}
              disabled={selectedAnswer === null}
              style={{
                ...BUTTON_STYLES.primary,
                padding: '0.75rem 2rem',
                borderRadius: '20px'
              }}
            >
              답변 제출
            </Button>
          </div>
        )}

        {/* 결과 표시 */}
        {showResult && (
          <Alert
            variant={isCorrect ? 'success' : 'danger'}
            className="border-0"
            style={{
              background: isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              borderRadius: '15px'
            }}
          >
            <div className="text-center">
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                {isCorrect ? '✅' : '❌'}
              </div>
              <h5 style={{ color: isCorrect ? COLORS.success.main : COLORS.danger.main }}>
                {isCorrect ? '정답입니다!' : '틀렸습니다!'}
              </h5>
              <p style={{ color: COLORS.text.secondary, marginBottom: 0 }}>
                {currentQuestion.explanation}
              </p>
            </div>
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
};

export default MusicTheoryQuiz;
