import axios from 'axios';

const API_BASE = '/api/practice-sessions';

export interface PracticeSessionResponse {
  id: number;
  userId: number;
  startedAt: string;
  endedAt?: string;
  status: string;
  goal?: string;
}

export interface PracticeSessionSearchRequest {
  userId?: number;
  goal?: string;
  status?: string;
  startedAtFrom?: string;
  startedAtTo?: string;
}

export interface PracticeSessionSummary {
  id: number;
  songTitle: string;
  artist: string;
  difficulty: string;
  accuracy: number;
  score: number;
  completed: boolean;
  createdAt: string;
}

export interface CommonResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface UserRankingResponse {
  userId: number;
  username?: string;
  totalSessions: number;
  completedSessions: number;
  averageScore: number;
  totalPracticeTime: number;
  rank: number;
  score: number;
}

// 세션 목록 조회
export async function getSessionsByUser(userId: number) {
  const res = await axios.get<CommonResponse<PracticeSessionResponse[]>>(`${API_BASE}/user/${userId}`);
  return res.data;
}

// 세션 생성
export async function createSession(userId: number, goal?: string) {
  const res = await axios.post<CommonResponse<PracticeSessionResponse>>(API_BASE, { userId, goal });
  return res.data;
}

// 세션 검색/필터 (페이징 지원)
export async function searchSessions(params: PracticeSessionSearchRequest & { page?: number; size?: number }) {
  const res = await axios.get<CommonResponse<PageResponse<PracticeSessionResponse>>>(`${API_BASE}/search`, { params });
  return res.data;
}

// 세션별 통계
export async function getSessionSummary(sessionId: number) {
  const res = await axios.get<CommonResponse<PracticeSessionSummary>>(`${API_BASE}/${sessionId}/summary`);
  return res.data;
}

// 사용자 랭킹 조회
export async function getUserRanking(userId: number) {
  const res = await axios.get<CommonResponse<UserRankingResponse>>(`${API_BASE}/ranking/user/${userId}`);
  return res.data;
}

// 상위 사용자 랭킹 조회
export async function getTopUsers(limit: number = 10) {
  const res = await axios.get<CommonResponse<UserRankingResponse[]>>(`${API_BASE}/ranking/top`, { params: { limit } });
  return res.data;
} 