import axios from 'axios';

export type QuizType = 'CHORD_NAME' | 'PROGRESSION' | 'INTERVAL' | 'SCALE';

export interface QuizQuestion {
  id: number;
  type: QuizType;
  question: string;
  imageUrl?: string | null;
  choices: string[];
  answer: string;
  explanation?: string | null;
  difficulty: number;
}

export interface QuizAnswerRequest {
  questionId: number;
  selected: string;
}

export interface QuizAnswerResult {
  questionId: number;
  correct: boolean;
  explanation?: string | null;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function fetchQuizQuestions(type: QuizType = 'CHORD_NAME', count = 5): Promise<QuizQuestion[]> {
  const res = await axios.get(`${API_BASE}/api/harmony-quiz/random`, {
    params: { type, count },
  });
  return res.data;
}

export async function submitQuizAnswer(data: QuizAnswerRequest): Promise<QuizAnswerResult> {
  const res = await axios.post(`${API_BASE}/api/harmony-quiz/answer`, data);
  return res.data;
} 