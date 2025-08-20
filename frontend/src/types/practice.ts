// 연습 관련 타입 정의
export const PRACTICE_TYPES = ['scale', 'chord', 'song', 'theory'] as const;
export type PracticeType = (typeof PRACTICE_TYPES)[number];

export const DIFFICULTY_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;
export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number];

export interface PracticeSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  type: PracticeType;
  difficulty: DifficultyLevel;
  score?: number;
  notes?: string;
  goal?: string;
}

export interface PracticeGoal {
  id: string;
  title: string;
  description?: string;
  targetScore: number;
  deadline: Date;
  completed: boolean;
  subGoals?: PracticeGoal[];
}

export interface PracticeStats {
  totalSessions: number;
  totalTime: number;
  averageScore: number;
  bestScore: number;
  typeBreakdown: Record<PracticeType, number>;
  difficultyBreakdown: Record<DifficultyLevel, number>;
}
