"use client";

import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, ProgressBar, Badge, Alert, Modal, Form } from 'react-bootstrap';
import { aiService } from '../services/aiService';
import { CARD_STYLES, BUTTON_STYLES } from '../constants/styles';

interface Lesson {
  id: string;
  title: string;
  description: string;
  topics: string[];
  difficulty: number;
  estimated_time: number;
  exercises: string[];
}

interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'chord_identification' | 'progression_analysis';
  options?: string[];
  correct_answer: string;
  explanation: string;
  difficulty: number;
}

interface UserProgress {
  level: string;
  completed_lessons: string[];
  quiz_scores: { [lessonId: string]: number };
  total_time: number;
  streak_days: number;
}

const AIMusicTheoryGame: React.FC = () => {
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    level: 'beginner',
    completed_lessons: [],
    quiz_scores: {},
    total_time: 0,
    streak_days: 0
  });
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [quizResult, setQuizResult] = useState<'correct' | 'incorrect' | null>(null);
  const [lessonTime, setLessonTime] = useState(0);
  const [isLessonActive, setIsLessonActive] = useState(false);

  useEffect(() => {
    loadUserProgress();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLessonActive && currentLesson) {
      interval = setInterval(() => {
        setLessonTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLessonActive, currentLesson]);

  const loadUserProgress = () => {
    const saved = localStorage.getItem('chordmind_progress');
    if (saved) {
      setUserProgress(JSON.parse(saved));
    }
  };

  const saveUserProgress = (progress: UserProgress) => {
    localStorage.setItem('chordmind_progress', JSON.stringify(progress));
    setUserProgress(progress);
  };

  const startLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setIsLessonActive(true);
    setLessonTime(0);
  };

  const completeLesson = () => {
    if (!currentLesson) return;

    const updatedProgress = {
      ...userProgress,
      completed_lessons: [...userProgress.completed_lessons, currentLesson.id],
      total_time: userProgress.total_time + lessonTime
    };

    saveUserProgress(updatedProgress);
    setIsLessonActive(false);
    setCurrentLesson(null);
    setLessonTime(0);
  };

  const startQuiz = (lessonId: string) => {
    const quiz = generateQuizQuestion(lessonId);
    setCurrentQuiz(quiz);
    setShowQuizModal(true);
    setSelectedAnswer('');
    setQuizResult(null);
  };

  const generateQuizQuestion = (lessonId: string): QuizQuestion => {
    const questions = [
      {
        id: '1',
        question: '다음 중 메이저 스케일의 3번째 음은?',
        type: 'multiple_choice' as const,
        options: ['루트', '메이저 3rd', '퍼펙트 5th', '옥타브'],
        correct_answer: '메이저 3rd',
        explanation: '메이저 스케일에서 3번째 음은 루트로부터 메이저 3rd 간격입니다.',
        difficulty: 1
      },
      {
        id: '2',
        question: 'C 메이저에서 I-IV-V 진행은?',
        type: 'multiple_choice' as const,
        options: ['C-F-G', 'C-G-F', 'F-C-G', 'G-C-F'],
        correct_answer: 'C-F-G',
        explanation: 'C 메이저에서 I은 C, IV는 F, V는 G입니다.',
        difficulty: 2
      },
      {
        id: '3',
        question: '다음 화성 진행을 분석하세요: Am-F-C-G',
        type: 'progression_analysis' as const,
        correct_answer: 'vi-IV-I-V',
        explanation: 'A 마이너는 vi, F는 IV, C는 I, G는 V입니다.',
        difficulty: 3
      }
    ];

    return questions[Math.floor(Math.random() * questions.length)];
  };

  const submitQuizAnswer = () => {
    if (!currentQuiz || !selectedAnswer) return;

    const isCorrect = selectedAnswer === currentQuiz.correct_answer;
    setQuizResult(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      const updatedProgress = {
        ...userProgress,
        quiz_scores: {
          ...userProgress.quiz_scores,
          [currentQuiz.id]: (userProgress.quiz_scores[currentQuiz.id] || 0) + 1
        }
      };
      saveUserProgress(updatedProgress);
    }

    setTimeout(() => {
      setShowQuizModal(false);
      setCurrentQuiz(null);
    }, 2000);
  };

  const getLevelProgress = () => {
    const totalLessons = 10; // 예시
    const completed = userProgress.completed_lessons.length;
    return (completed / totalLessons) * 100;
  };

  const getNextLesson = () => {
    const lessons: Lesson[] = [
      {
        id: 'lesson_1',
        title: '기본 화성 이론',
        description: '3화음과 7화음의 기본 개념을 배웁니다.',
        topics: ['3화음', '7화음', '화성 기능'],
        difficulty: 1,
        estimated_time: 15,
        exercises: ['화음 구성하기', '화성 기능 식별하기']
      },
      {
        id: 'lesson_2',
        title: '화성 진행 패턴',
        description: '일반적인 화성 진행 패턴을 학습합니다.',
        topics: ['I-IV-V 진행', 'ii-V-I 진행', '카덴스'],
        difficulty: 2,
        estimated_time: 20,
        exercises: ['진행 패턴 연습', '카덴스 분석']
      },
      {
        id: 'lesson_3',
        title: '조성 전환',
        description: '조성을 바꾸는 다양한 방법을 배웁니다.',
        topics: ['공통음 전조', '관계조 전조', '크로마틱 전조'],
        difficulty: 3,
        estimated_time: 25,
        exercises: ['전조 연습', '전조 분석']
      }
    ];

    return lessons;
  };

  const lessons = getNextLesson();

  return (
    <div className="ai-music-theory-game">
      <h2 className="mb-4">🎯 AI 음악 이론 학습 게임</h2>
      
      {/* 사용자 진행 상황 */}
      <Card style={CARD_STYLES.primary} className="mb-4">
        <Card.Body>
          <h5>📊 학습 진행 상황</h5>
          <Row>
            <Col md={3}>
              <div className="text-center">
                <h3>🎓</h3>
                <h6>현재 레벨</h6>
                <Badge bg="success" className="fs-6">{userProgress.level}</Badge>
              </div>
            </Col>
            
            <Col md={3}>
              <div className="text-center">
                <h3>📚</h3>
                <h6>완료한 레슨</h6>
                <Badge bg="info" className="fs-6">{userProgress.completed_lessons.length}개</Badge>
              </div>
            </Col>
            
            <Col md={3}>
              <div className="text-center">
                <h3>⏱️</h3>
                <h6>총 학습 시간</h6>
                <Badge bg="warning" className="fs-6">{Math.floor(userProgress.total_time / 60)}분</Badge>
              </div>
            </Col>
            
            <Col md={3}>
              <div className="text-center">
                <h3>🔥</h3>
                <h6>연속 학습</h6>
                <Badge bg="danger" className="fs-6">{userProgress.streak_days}일</Badge>
              </div>
            </Col>
          </Row>
          
          <div className="mt-3">
            <h6>레벨 진행률</h6>
            <ProgressBar 
              now={getLevelProgress()} 
              variant="success" 
              className="mb-2"
            />
            <small className="text-muted">
              {userProgress.completed_lessons.length}/10 레슨 완료
            </small>
          </div>
        </Card.Body>
      </Card>

      {/* 현재 진행 중인 레슨 */}
      {currentLesson && (
        <Card style={CARD_STYLES.secondary} className="mb-4">
          <Card.Body>
            <h5>🎵 현재 학습 중: {currentLesson.title}</h5>
            <p>{currentLesson.description}</p>
            
            <div className="mb-3">
              <strong>학습 주제:</strong>
              <div className="d-flex gap-2 flex-wrap mt-2">
                {currentLesson.topics.map((topic, index) => (
                  <Badge key={index} bg="primary">{topic}</Badge>
                ))}
              </div>
            </div>
            
            <div className="mb-3">
              <strong>예상 시간:</strong> {currentLesson.estimated_time}분
              <br/>
              <strong>현재 시간:</strong> {Math.floor(lessonTime / 60)}:{(lessonTime % 60).toString().padStart(2, '0')}
            </div>
            
            <div className="mb-3">
              <strong>연습 문제:</strong>
              <ul>
                {currentLesson.exercises.map((exercise, index) => (
                  <li key={index}>{exercise}</li>
                ))}
              </ul>
            </div>
            
            <div className="d-flex gap-2">
              <Button 
                variant="success" 
                onClick={completeLesson}
                style={BUTTON_STYLES.success}
              >
                ✅ 레슨 완료
              </Button>
              <Button 
                variant="info" 
                onClick={() => startQuiz(currentLesson.id)}
                style={BUTTON_STYLES.info}
              >
                🧠 퀴즈 풀기
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* 사용 가능한 레슨들 */}
      <Card style={CARD_STYLES.default} className="mb-4">
        <Card.Body>
          <h5>📚 학습할 수 있는 레슨</h5>
          <Row>
            {lessons.map(lesson => (
              <Col md={6} lg={4} key={lesson.id} className="mb-3">
                <Card style={CARD_STYLES.accent}>
                  <Card.Body>
                    <h6>{lesson.title}</h6>
                    <p className="text-muted small">{lesson.description}</p>
                    
                    <div className="mb-2">
                      <Badge bg="primary" className="me-1">난이도 {lesson.difficulty}</Badge>
                      <Badge bg="info" className="me-1">{lesson.estimated_time}분</Badge>
                      {userProgress.completed_lessons.includes(lesson.id) && (
                        <Badge bg="success">완료</Badge>
                      )}
                    </div>
                    
                    <div className="mb-2">
                      <strong>주제:</strong>
                      <div className="d-flex gap-1 flex-wrap mt-1">
                        {lesson.topics.slice(0, 2).map((topic, index) => (
                          <Badge key={index} bg="secondary" className="small">{topic}</Badge>
                        ))}
                        {lesson.topics.length > 2 && (
                          <Badge bg="secondary" className="small">+{lesson.topics.length - 2}</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="d-flex gap-1">
                      {!userProgress.completed_lessons.includes(lesson.id) ? (
                        <Button 
                          size="sm" 
                          variant="primary"
                          onClick={() => startLesson(lesson)}
                          style={BUTTON_STYLES.primary}
                        >
                          🎯 시작하기
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="success"
                          onClick={() => startQuiz(lesson.id)}
                          style={BUTTON_STYLES.success}
                        >
                          🧠 퀴즈
                        </Button>
                      )}
                      
                      {userProgress.quiz_scores[lesson.id] && (
                        <Badge bg="warning">
                          점수: {userProgress.quiz_scores[lesson.id]}
                        </Badge>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>

      {/* 퀴즈 모달 */}
      <Modal show={showQuizModal} onHide={() => setShowQuizModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>🧠 음악 이론 퀴즈</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentQuiz && (
            <div>
              <h5 className="mb-3">{currentQuiz.question}</h5>
              
              {currentQuiz.type === 'multiple_choice' && currentQuiz.options && (
                <div>
                  {currentQuiz.options.map((option, index) => (
                    <Form.Check
                      key={index}
                      type="radio"
                      id={`option-${index}`}
                      name="quiz-answer"
                      label={option}
                      value={option}
                      checked={selectedAnswer === option}
                      onChange={(e) => setSelectedAnswer(e.target.value)}
                      className="mb-2"
                    />
                  ))}
                </div>
              )}
              
              {currentQuiz.type === 'progression_analysis' && (
                <Form.Control
                  type="text"
                  placeholder="답을 입력하세요 (예: vi-IV-I-V)"
                  value={selectedAnswer}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                />
              )}
              
              {quizResult && (
                <Alert 
                  variant={quizResult === 'correct' ? 'success' : 'danger'}
                  className="mt-3"
                >
                  {quizResult === 'correct' ? '✅ 정답입니다!' : '❌ 틀렸습니다.'}
                  <br/>
                  <strong>설명:</strong> {currentQuiz.explanation}
                </Alert>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowQuizModal(false)}>
            닫기
          </Button>
          {!quizResult && (
            <Button 
              variant="primary" 
              onClick={submitQuizAnswer}
              disabled={!selectedAnswer}
            >
              답안 제출
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AIMusicTheoryGame;
