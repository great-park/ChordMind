import { apiClient, ApiResponse } from './apiClient';
import { backendService } from './backendService';

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
    try {
      return await backendService.createPracticeSession(request);
    } catch (error) {
      console.warn('백엔드 서비스 연결 실패, 로컬 모드로 전환:', error);
      // 오프라인 모드에서는 더미 데이터 반환
      const dummySession: PracticeSession = {
        id: Date.now(),
        userId: 1,
        title: request.title,
        description: request.description,
        duration: request.duration,
        difficulty: request.difficulty,
        focusAreas: request.focusAreas,
        accuracy: 0,
        rhythm: 0,
        technique: 0,
        expression: 0,
        overall: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return { success: true, message: '로컬 모드에서 생성됨', data: dummySession };
    }
  }

  // 연습 세션 조회
  async getPracticeSession(sessionId: number): Promise<ApiResponse<PracticeSession>> {
    return apiClient.get<PracticeSession>(`/api/practice-sessions/${sessionId}`);
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
      `/api/practice-sessions/user/${userId}?${queryString}`
    );
  }

  // 연습 세션 업데이트
  async updatePracticeSession(
    sessionId: number,
    request: Partial<CreatePracticeSessionRequest>
  ): Promise<ApiResponse<PracticeSession>> {
    return apiClient.put<PracticeSession>(`/api/practice-sessions/${sessionId}`, request);
  }

  // 연습 세션 삭제
  async deletePracticeSession(sessionId: number): Promise<ApiResponse<string>> {
    return apiClient.delete<string>(`/api/practice-sessions/${sessionId}`);
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
    try {
      // 백엔드 서비스에서 리더보드 데이터 가져오기 시도
      const response = await apiClient.get<UserRankingResponse[]>(`/api/practice/analytics/global/leaderboard?limit=${limit}`);
      if (response.success && response.data) {
        return response;
      }
    } catch (error) {
      console.warn('백엔드 서비스 연결 실패, 더미 데이터 사용:', error);
    }
    
    // 백엔드 연결 실패 시 더미 데이터 반환
    const dummyUsers: UserRankingResponse[] = [
      { userId: 1, username: '🎹 피아노 마에스트로', rank: 1, score: 2850, category: '🔥 이번 주 챔피언' },
      { userId: 2, username: '🎸 기타 히어로', rank: 2, score: 2720, category: '⭐ 톱 연주자' },
      { userId: 3, username: '🎻 바이올린 아티스트', rank: 3, score: 2650, category: '⭐ 톱 연주자' },
      { userId: 4, username: '🥁 드럼 비트', rank: 4, score: 2580, category: '🎵 열정적인 연주자' },
      { userId: 5, username: '🎺 트럼펫 마스터', rank: 5, score: 2490, category: '🎵 열정적인 연주자' },
      { userId: 6, username: '🎷 색소폰 플레이어', rank: 6, score: 2410, category: '🎵 열정적인 연주자' },
      { userId: 7, username: '🎼 작곡가 드림', rank: 7, score: 2350, category: '🎵 열정적인 연주자' },
      { userId: 8, username: '🎤 보컬리스트', rank: 8, score: 2280, category: '🎵 열정적인 연주자' },
      { userId: 9, username: '🎹 클래식 피아니스트', rank: 9, score: 2210, category: '🎵 열정적인 연주자' },
      { userId: 10, username: '🎸 베이스 마스터', rank: 10, score: 2140, category: '🎵 열정적인 연주자' },
    ];
    
    return { success: true, message: '더미 데이터', data: dummyUsers.slice(0, limit) };
  }

  // 사용자별 연습 세션 목록 조회 (최근 활동용)
  async getRecentUserSessions(userId: number, limit: number = 5): Promise<ApiResponse<PracticeSession[]>> {
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
      `/api/practice-sessions/search?${queryString}`
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
    return apiClient.put<PracticeSession>(`/api/practice-sessions/${sessionId}/analysis`, analysis);
  }
}

export const practiceService = new PracticeService(); 