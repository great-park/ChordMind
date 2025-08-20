// 퀴즈 통계 관련 타입 정의
export interface QuizUserStats {
  totalAttempts: number;
  correctAnswers: number;
  accuracy: number;
  typeStats: Record<string, {
    attempts: number;
    correct: number;
    accuracy: number;
  }>;
}

export interface UserProgress {
  date: string;
  attempts: number;
  correct: number;
  accuracy: number;
}

export interface DifficultyStats {
  difficultyStats: Record<string, {
    attempts: number;
    correct: number;
    accuracy: number;
  }>;
}

export interface WeakestArea {
  type: string;
  attempts: number;
  correct: number;
  accuracy: number;
}

export interface GlobalStats {
  totalQuestions: number;
  totalResults: number;
  totalCorrect: number;
  globalAccuracy: number;
  typeDistribution: Record<string, number>;
}

// 분석 대시보드 관련 타입
export interface AnalyticsFilters {
  userId?: number;
  dateRange?: {
    start: string;
    end: string;
  };
  type?: string;
  difficulty?: string;
}

export interface AnalyticsResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}
