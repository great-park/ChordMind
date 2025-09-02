import { apiClient, ApiResponse } from './apiClient';

// ===== 공통 타입 정의 =====
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// ===== 사용자 서비스 타입 =====
export interface UserProfile {
  id: number;
  name: string;
  email: string;
  nickname: string;
  role: string;
  joinDate: string;
  lastActive: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  nickname?: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

// ===== 연습 서비스 타입 =====
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

export interface PracticeStats {
  totalSessions: number;
  totalTime: number;
  averageScore: number;
  completionRate: number;
  streakDays: number;
}

// ===== AI 서비스 타입 =====
export interface AIAnalysis {
  id: number;
  userId: number;
  sessionId?: number;
  analysisType: string;
  result: any;
  confidence: number;
  createdAt: string;
}

export interface LearningRecommendation {
  id: number;
  userId: number;
  type: string;
  title: string;
  description: string;
  priority: number;
  category: string;
  createdAt: string;
}

// ===== 화성학 서비스 타입 =====
export interface HarmonyAnalysis {
  id: number;
  userId: number;
  chordProgression: string;
  analysis: {
    key: string;
    mode: string;
    chordTypes: string[];
    harmonicFunction: string;
    tension: number;
  };
  createdAt: string;
}

// ===== 피드백 서비스 타입 =====
export interface Feedback {
  id: number;
  userId: number;
  sessionId?: number;
  type: string;
  content: string;
  rating: number;
  category: string;
  createdAt: string;
}

// ===== 게임 서비스 타입 =====
export interface GameSession {
  id: number;
  userId: number;
  gameType: string;
  score: number;
  level: number;
  duration: number;
  completed: boolean;
  createdAt: string;
}

// ===== 백엔드 서비스 클래스 =====
class BackendService {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  }

  // ===== 사용자 서비스 =====
  async login(request: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<AuthResponse>('/api/users/signin', request);
  }

  async register(request: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<AuthResponse>('/api/users/signup', request);
  }

  async getUserProfile(userId: number): Promise<ApiResponse<UserProfile>> {
    return apiClient.get<UserProfile>(`/api/users/${userId}`);
  }

  async updateUserProfile(userId: number, updates: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    return apiClient.put<UserProfile>(`/api/users/${userId}`, updates);
  }

  async deleteUser(userId: number): Promise<ApiResponse<string>> {
    return apiClient.delete<string>(`/api/users/${userId}`);
  }

  // ===== 연습 서비스 =====
  async createPracticeSession(request: CreatePracticeSessionRequest): Promise<ApiResponse<PracticeSession>> {
    return apiClient.post<PracticeSession>('/api/practice/sessions', request);
  }

  async getPracticeSession(sessionId: number): Promise<ApiResponse<PracticeSession>> {
    return apiClient.get<PracticeSession>(`/api/practice/sessions/${sessionId}`);
  }

  async getUserPracticeSessions(userId: number, page: number = 0, size: number = 20): Promise<ApiResponse<{ sessions: PracticeSession[]; totalElements: number }>> {
    const params = { page, size };
    const queryString = apiClient.buildQueryParams(params);
    return apiClient.get<{ sessions: PracticeSession[]; totalElements: number }>(
      `/api/practice/sessions/user/${userId}?${queryString}`
    );
  }

  async updatePracticeSession(sessionId: number, updates: Partial<CreatePracticeSessionRequest>): Promise<ApiResponse<PracticeSession>> {
    return apiClient.put<PracticeSession>(`/api/practice/sessions/${sessionId}`, updates);
  }

  async deletePracticeSession(sessionId: number): Promise<ApiResponse<string>> {
    return apiClient.delete<string>(`/api/practice/sessions/${sessionId}`);
  }

  async getPracticeStats(userId: number): Promise<ApiResponse<PracticeStats>> {
    return apiClient.get<PracticeStats>(`/api/practice/stats/user/${userId}`);
  }

  // ===== AI 서비스 =====
  async getAIAnalysis(userId: number, sessionId?: number): Promise<ApiResponse<AIAnalysis[]>> {
    const params = sessionId ? { sessionId } : {};
    const queryString = apiClient.buildQueryParams(params);
    return apiClient.get<AIAnalysis[]>(`/api/analysis/user/${userId}?${queryString}`);
  }

  async getLearningRecommendations(userId: number): Promise<ApiResponse<LearningRecommendation[]>> {
    return apiClient.get<LearningRecommendation[]>(`/api/analysis/recommendations/user/${userId}`);
  }

  async createAIAnalysis(request: {
    userId: number;
    sessionId?: number;
    analysisType: string;
    data: any;
  }): Promise<ApiResponse<AIAnalysis>> {
    return apiClient.post<AIAnalysis>('/api/analysis', request);
  }

  // ===== 화성학 서비스 =====
  async analyzeHarmony(request: {
    userId: number;
    chordProgression: string;
  }): Promise<ApiResponse<HarmonyAnalysis>> {
    return apiClient.post<HarmonyAnalysis>('/api/harmony/analyze', request);
  }

  async getHarmonyHistory(userId: number): Promise<ApiResponse<HarmonyAnalysis[]>> {
    return apiClient.get<HarmonyAnalysis[]>(`/api/harmony/history/user/${userId}`);
  }

  // ===== 피드백 서비스 =====
  async getFeedback(userId: number, sessionId?: number): Promise<ApiResponse<Feedback[]>> {
    const params = sessionId ? { sessionId } : {};
    const queryString = apiClient.buildQueryParams(params);
    return apiClient.get<Feedback[]>(`/api/feedback/user/${userId}?${queryString}`);
  }

  async createFeedback(request: {
    userId: number;
    sessionId?: number;
    type: string;
    content: string;
    rating: number;
    category: string;
  }): Promise<ApiResponse<Feedback>> {
    return apiClient.post<Feedback>('/api/feedback', request);
  }

  // ===== 게임 서비스 =====
  async createGameSession(request: {
    userId: number;
    gameType: string;
    level: number;
  }): Promise<ApiResponse<GameSession>> {
    return apiClient.post<GameSession>('/api/games/sessions', request);
  }

  async updateGameSession(sessionId: number, updates: {
    score?: number;
    completed?: boolean;
    duration?: number;
  }): Promise<ApiResponse<GameSession>> {
    return apiClient.put<GameSession>(`/api/games/sessions/${sessionId}`, updates);
  }

  async getUserGameStats(userId: number): Promise<ApiResponse<{
    totalGames: number;
    averageScore: number;
    bestScore: number;
    completedGames: number;
    favoriteGameType: string;
  }>> {
    return apiClient.get<{
      totalGames: number;
      averageScore: number;
      bestScore: number;
      completedGames: number;
      favoriteGameType: string;
    }>(`/api/games/stats/user/${userId}`);
  }

  // ===== 공통 유틸리티 =====
  async healthCheck(): Promise<ApiResponse<{ status: string; services: any }>> {
    return apiClient.get<{ status: string; services: any }>('/health');
  }

  // ===== 오프라인 모드 지원 =====
  private isOfflineMode(): boolean {
    return process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_API_URL;
  }

  // ===== 더미 데이터 생성 =====
  private generateDummyData<T>(type: string, count: number = 5): T[] {
    const dummyData: any = {
      practiceSessions: Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        userId: 1,
        title: `연습 세션 ${i + 1}`,
        description: `연습 세션 ${i + 1}에 대한 설명`,
        duration: Math.floor(Math.random() * 60) + 30,
        difficulty: ['초급', '중급', '고급'][Math.floor(Math.random() * 3)],
        focusAreas: ['정확도', '리듬', '테크닉', '표현력'].slice(0, Math.floor(Math.random() * 4) + 1),
        accuracy: Math.floor(Math.random() * 40) + 60,
        rhythm: Math.floor(Math.random() * 40) + 60,
        technique: Math.floor(Math.random() * 40) + 60,
        expression: Math.floor(Math.random() * 40) + 60,
        overall: Math.floor(Math.random() * 40) + 60,
        createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      })),
      aiAnalysis: Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        userId: 1,
        sessionId: i + 1,
        analysisType: ['accuracy', 'rhythm', 'technique', 'expression'][Math.floor(Math.random() * 4)],
        result: { score: Math.floor(Math.random() * 40) + 60, details: '분석 결과' },
        confidence: Math.floor(Math.random() * 30) + 70,
        createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      })),
      feedback: Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        userId: 1,
        sessionId: i + 1,
        type: ['positive', 'constructive', 'technical'][Math.floor(Math.random() * 3)],
        content: `피드백 내용 ${i + 1}`,
        rating: Math.floor(Math.random() * 5) + 1,
        category: ['accuracy', 'rhythm', 'technique', 'expression'][Math.floor(Math.random() * 4)],
        createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      })),
    };

    return dummyData[type] || [];
  }
}

export const backendService = new BackendService();
