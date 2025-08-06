import { apiClient, ApiResponse } from './apiClient';

export interface PracticeSession {
  id: number;
  userId: number;
  title: string;
  description: string;
  duration: number;
  difficulty: string;
  focusAreas: string[];
  accuracy: number;
  rhythm: number;
  technique: number;
  expression: number;
  overall: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePracticeSessionRequest {
  title: string;
  description: string;
  difficulty: string;
  duration: number;
  focusAreas: string[];
}

export interface AnalyticsUserSummaryResponse {
  totalSessions: number;
  completedSessions: number;
  averageScore: number;
  totalPracticeTime: number;
  firstSessionAt: string;
  lastSessionAt: string;
  recentGoals: string[];
}

export interface AnalyticsUserTrendResponse {
  points: Array<{
    date: string;
    sessionCount: number;
    averageScore: number;
    totalTime: number;
  }>;
}

export interface UserRankingResponse {
  userId: number;
  username: string;
  rank: number;
  score: number;
  category: string;
}

export interface PracticeGoal {
  id: number;
  userId: number;
  title: string;
  description: string;
  targetDate: string;
  progress: number;
  category: string;
  status: 'active' | 'completed' | 'overdue';
  createdAt: string;
  updatedAt: string;
}

export interface CreatePracticeGoalRequest {
  title: string;
  description: string;
  targetDate: string;
  category: string;
}

class PracticeService {
  // 연습 세션 생성
  async createPracticeSession(request: CreatePracticeSessionRequest): Promise<ApiResponse<PracticeSession>> {
    return apiClient.post<PracticeSession>('/api/practice/sessions', request);
  }

  // 연습 세션 조회
  async getPracticeSession(sessionId: number): Promise<ApiResponse<PracticeSession>> {
    return apiClient.get<PracticeSession>(`/api/practice/sessions/${sessionId}`);
  }

  // 사용자별 연습 세션 목록 조회
  async getUserPracticeSessions(
    userId: number,
    page: number = 0,
    size: number = 20
  ): Promise<ApiResponse<{ sessions: PracticeSession[]; totalElements: number }>> {
    const params = { page, size };
    const queryString = apiClient.buildQueryParams(params);
    return apiClient.get<{ sessions: PracticeSession[]; totalElements: number }>(
      `/api/practice/sessions/user/${userId}?${queryString}`
    );
  }

  // 연습 세션 업데이트
  async updatePracticeSession(
    sessionId: number,
    request: Partial<CreatePracticeSessionRequest>
  ): Promise<ApiResponse<PracticeSession>> {
    return apiClient.put<PracticeSession>(`/api/practice/sessions/${sessionId}`, request);
  }

  // 연습 세션 삭제
  async deletePracticeSession(sessionId: number): Promise<ApiResponse<string>> {
    return apiClient.delete<string>(`/api/practice/sessions/${sessionId}`);
  }

  // 사용자 분석 요약 조회
  async getAnalyticsUserSummary(userId: number): Promise<ApiResponse<AnalyticsUserSummaryResponse>> {
    return apiClient.get<AnalyticsUserSummaryResponse>(`/api/practice/analytics/user/${userId}/summary`);
  }

  // 사용자 분석 트렌드 조회
  async getAnalyticsUserTrend(
    userId: number,
    period: string = 'month'
  ): Promise<ApiResponse<AnalyticsUserTrendResponse>> {
    const params = { period };
    const queryString = apiClient.buildQueryParams(params);
    return apiClient.get<AnalyticsUserTrendResponse>(`/api/practice/analytics/user/${userId}/trend?${queryString}`);
  }

  // 상위 사용자 조회
  async getTopUsers(limit: number = 10): Promise<ApiResponse<UserRankingResponse[]>> {
    const params = { limit };
    const queryString = apiClient.buildQueryParams(params);
    return apiClient.get<UserRankingResponse[]>(`/api/practice/analytics/global/leaderboard?${queryString}`);
  }

  // 사용자별 연습 세션 목록 조회 (최근 활동용)
  async getUserPracticeSessions(userId: number, limit: number = 5): Promise<ApiResponse<PracticeSession[]>> {
    const params = { limit };
    const queryString = apiClient.buildQueryParams(params);
    return apiClient.get<PracticeSession[]>(`/api/practice-sessions/user/${userId}?${queryString}`);
  }

  // 연습 목표 생성
  async createPracticeGoal(request: CreatePracticeGoalRequest): Promise<ApiResponse<PracticeGoal>> {
    return apiClient.post<PracticeGoal>('/api/practice/goals', request);
  }

  // 연습 목표 조회
  async getPracticeGoal(goalId: number): Promise<ApiResponse<PracticeGoal>> {
    return apiClient.get<PracticeGoal>(`/api/practice/goals/${goalId}`);
  }

  // 사용자별 연습 목표 목록 조회
  async getUserPracticeGoals(
    userId: number,
    page: number = 0,
    size: number = 20
  ): Promise<ApiResponse<{ goals: PracticeGoal[]; totalElements: number }>> {
    const params = { page, size };
    const queryString = apiClient.buildQueryParams(params);
    return apiClient.get<{ goals: PracticeGoal[]; totalElements: number }>(
      `/api/practice/goals/user/${userId}?${queryString}`
    );
  }

  // 연습 목표 업데이트
  async updatePracticeGoal(
    goalId: number,
    request: Partial<CreatePracticeGoalRequest>
  ): Promise<ApiResponse<PracticeGoal>> {
    return apiClient.put<PracticeGoal>(`/api/practice/goals/${goalId}`, request);
  }

  // 연습 목표 삭제
  async deletePracticeGoal(goalId: number): Promise<ApiResponse<string>> {
    return apiClient.delete<string>(`/api/practice/goals/${goalId}`);
  }

  // 진행률 업데이트
  async updateGoalProgress(
    goalId: number,
    progress: number
  ): Promise<ApiResponse<PracticeGoal>> {
    return apiClient.put<PracticeGoal>(`/api/practice/goals/${goalId}/progress`, { progress });
  }

  // 연습 통계 조회
  async getPracticeStats(userId: number): Promise<ApiResponse<{
    totalSessions: number;
    totalTime: number;
    averageScore: number;
    completionRate: number;
    streakDays: number;
  }>> {
    return apiClient.get<{
      totalSessions: number;
      totalTime: number;
      averageScore: number;
      completionRate: number;
      streakDays: number;
    }>(`/api/practice/stats/user/${userId}`);
  }

  // 연습 기록 검색
  async searchPracticeSessions(params: {
    userId?: number;
    difficulty?: string;
    category?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    size?: number;
  }): Promise<ApiResponse<{ sessions: PracticeSession[]; totalElements: number }>> {
    const queryString = apiClient.buildQueryParams(params);
    return apiClient.get<{ sessions: PracticeSession[]; totalElements: number }>(
      `/api/practice/sessions/search?${queryString}`
    );
  }

  // 연습 세션 분석 결과 업데이트
  async updateSessionAnalysis(
    sessionId: number,
    analysis: {
      accuracy: number;
      rhythm: number;
      technique: number;
      expression: number;
      overall: number;
    }
  ): Promise<ApiResponse<PracticeSession>> {
    return apiClient.put<PracticeSession>(`/api/practice/sessions/${sessionId}/analysis`, analysis);
  }
}

export const practiceService = new PracticeService(); 