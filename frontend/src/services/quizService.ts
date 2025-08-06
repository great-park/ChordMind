import { apiClient, ApiResponse } from './apiClient';

export type QuizType = 'CHORD_NAME' | 'PROGRESSION' | 'INTERVAL' | 'SCALE';

export interface QuizQuestion {
  id: number;
  type: QuizType;
  questionText: string;
  imageUrl?: string | null;
  choices: QuizChoice[];
  correctAnswer: string;
  explanation?: string | null;
  difficulty: number;
}

export interface QuizChoice {
  id: number;
  choiceText: string;
  isCorrect: boolean;
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

export interface QuizResultRequest {
  userId: number;
  questionId: number;
  selected: string;
}

export interface QuizResultResponse {
  id: number;
  userId: number;
  questionId: number;
  selected: string;
  correct: boolean;
  answeredAt: string;
}

export interface QuizRankingDto {
  userId: number;
  score: number;
}

class QuizService {
  // 랜덤 퀴즈 문제 조회
  async fetchQuizQuestions(type: QuizType = 'CHORD_NAME', count = 5): Promise<ApiResponse<QuizQuestion[]>> {
    const params = apiClient.buildQueryParams({ type, count });
    return apiClient.get<QuizQuestion[]>(`/api/harmony-quiz/random?${params}`);
  }

  // 퀴즈 답안 제출 및 채점
  async submitQuizAnswer(data: QuizAnswerRequest): Promise<ApiResponse<QuizAnswerResult>> {
    return apiClient.post<QuizAnswerResult>('/api/harmony-quiz/answer', data);
  }

  // 퀴즈 결과 저장
  async saveQuizResult(request: QuizResultRequest): Promise<ApiResponse<QuizResultResponse>> {
    return apiClient.post<QuizResultResponse>('/api/harmony-quiz/result', request);
  }

  // 퀴즈 랭킹 조회
  async getQuizRankings(from: string, to: string): Promise<ApiResponse<QuizRankingDto[]>> {
    const params = apiClient.buildQueryParams({ from, to });
    return apiClient.get<QuizRankingDto[]>(`/api/harmony-quiz/rankings?${params}`);
  }
}

export const quizService = new QuizService(); 