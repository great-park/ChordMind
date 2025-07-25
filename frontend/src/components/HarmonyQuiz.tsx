import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  saveQuizResult,
  getQuizRankings,
  QuizResultRequest,
  QuizResultResponse,
  QuizRankingDto
} from '../services/quizService';

interface QuizQuestion {
  id: number;
  type: string;
  question: string;
  imageUrl?: string | null;
  choices: { id: number; text: string }[];
  answer: string;
  explanation?: string;
  difficulty: number;
}

const USER_ID = 1; // TODO: 실제 로그인 사용자로 대체

const HarmonyQuiz: React.FC = () => {
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
      const res = await axios.get<QuizQuestion[]>('/api/harmony-quiz/random?type=CHORD_NAME&count=1');
      setQuiz(res.data[0]);
    } catch (e) {
      setError('문제를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (choice: string) => {
    if (!quiz) return;
    setSelected(choice);
    try {
      const req: QuizResultRequest = {
        userId: USER_ID,
        questionId: quiz.id,
        selected: choice
      };
      const res = await saveQuizResult(req);
      setResult(res);
    } catch (e) {
      setError('결과 저장에 실패했습니다.');
    }
  };

  const handleRanking = async () => {
    setShowRanking(true);
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toISOString();
    const to = now.toISOString();
    try {
      const res = await getQuizRankings(from, to);
      setRankings(res);
    } catch (e) {
      setError('랭킹을 불러오지 못했습니다.');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 border rounded shadow bg-white">
      <h2 className="text-xl font-bold mb-4">화성학 퀴즈</h2>
      {loading && <div>문제를 불러오는 중...</div>}
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {quiz && !result && (
        <div>
          <div className="mb-3 font-medium">{quiz.question}</div>
          {quiz.imageUrl && <img src={quiz.imageUrl} alt="문제 이미지" className="mb-3" />}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {quiz.choices.map((c) => (
              <button
                key={c.id}
                className={`btn btn-outline-primary w-full ${selected === c.text ? 'active' : ''}`}
                onClick={() => handleSelect(c.text)}
                disabled={!!selected}
              >
                {c.text}
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
          <div className="mb-2">정답: <span className="fw-bold">{quiz?.answer}</span></div>
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
              <li key={r.userId} className={r.userId === USER_ID ? 'text-primary fw-bold' : ''}>
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