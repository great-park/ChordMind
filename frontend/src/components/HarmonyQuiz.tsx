import React, { useEffect, useState } from 'react';
import {
  quizService,
  QuizQuestion,
  QuizResultRequest,
  QuizResultResponse,
  QuizRankingDto,
  QuizAnswerRequest,
  QuizType
} from '../services/quizService';
import { authService } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

// QuizQuestion 인터페이스는 quizService에서 import

const HarmonyQuiz: React.FC = () => {
  const { user } = useAuth();
  const [quiz, setQuiz] = useState<QuizQuestion | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<QuizResultResponse | null>(null);
  const [showRanking, setShowRanking] = useState(false);
  const [rankings, setRankings] = useState<QuizRankingDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setSelected(null);
    setShowRanking(false);
    
    try {
      const response = await quizService.fetchQuizQuestions('CHORD_NAME', 1);
      
      if (response.success && response.data && response.data.length > 0) {
        setQuiz(response.data[0]);
      } else {
        setError(response.message || '문제를 불러오지 못했습니다.');
      }
    } catch (e) {
      setError('문제를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (choice: string) => {
    if (!quiz) return;
    setSelected(choice);
    
    try {
      // 먼저 답안 제출 및 채점
      const answerRequest: QuizAnswerRequest = {
        questionId: quiz.id,
        selected: choice
      };
      
      const answerResponse = await quizService.submitQuizAnswer(answerRequest);
      
      if (answerResponse.success && answerResponse.data) {
        // 현재 로그인한 사용자 ID 가져오기
        const currentUserId = authService.getCurrentUserId();
        if (!currentUserId) {
          setError('로그인이 필요합니다.');
          return;
        }
        
        // 퀴즈 결과 저장
        const resultRequest: QuizResultRequest = {
          userId: currentUserId,
          questionId: quiz.id,
          selected: choice
        };
        
        const resultResponse = await quizService.saveQuizResult(resultRequest);
        
        if (resultResponse.success && resultResponse.data) {
          setResult(resultResponse.data);
        } else {
          setError(resultResponse.message || '결과 저장에 실패했습니다.');
        }
      } else {
        setError(answerResponse.message || '답안 채점에 실패했습니다.');
      }
    } catch (e) {
      setError('답안 제출 중 오류가 발생했습니다.');
    }
  };

  const handleRanking = async () => {
    setShowRanking(true);
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toISOString();
    const to = now.toISOString();
    
    try {
      const response = await quizService.getQuizRankings(from, to);
      
      if (response.success && response.data) {
        setRankings(response.data);
      } else {
        setError(response.message || '랭킹을 불러오지 못했습니다.');
      }
    } catch (e) {
      setError('랭킹을 불러오는 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 border rounded shadow bg-white">
      <h2 className="text-xl font-bold mb-4">화성학 퀴즈</h2>
      {loading && <div>문제를 불러오는 중...</div>}
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {quiz && !result && (
        <div>
          <div className="mb-3 font-medium">{quiz.questionText}</div>
          {quiz.imageUrl && <img src={quiz.imageUrl} alt="문제 이미지" className="mb-3" />}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {quiz.choices.map((choice) => (
              <button
                key={choice.id}
                className={`btn btn-outline-primary w-full ${selected === choice.choiceText ? 'active' : ''}`}
                onClick={() => handleSelect(choice.choiceText)}
                disabled={!!selected}
              >
                {choice.choiceText}
              </button>
            ))}
          </div>
        </div>
      )}
      {result && (
        <div className="mb-4">
          <div className={`fw-bold mb-2 ${result.correct ? 'text-green-600' : 'text-red-600'}`}>
            {result.correct ? '정답입니다!' : '오답입니다.'}
          </div>
          <div className="mb-2">정답: <span className="fw-bold">{quiz?.correctAnswer}</span></div>
          <div className="mb-2 text-muted">{quiz?.explanation}</div>
          <button className="btn btn-primary me-2" onClick={fetchQuiz}>다음 문제</button>
          <button className="btn btn-outline-secondary" onClick={handleRanking}>랭킹 보기</button>
        </div>
      )}
      {showRanking && (
        <div className="mt-4">
          <h3 className="fw-bold mb-2">최근 7일 랭킹</h3>
          <ol className="list-decimal list-inside">
            {rankings.map((r, idx) => (
              <li key={r.userId} className={r.userId === user?.id ? 'text-primary fw-bold' : ''}>
                {idx + 1}위 - 사용자 {r.userId} : {r.score}점
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default HarmonyQuiz; 