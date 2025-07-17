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

export interface AnalyticsUserSummaryResponse {
  userId: number;
  username?: string;
  totalSessions: number;
  completedSessions: number;
  averageScore?: number;
  totalPracticeTime: number;
  firstSessionAt?: string;
  lastSessionAt?: string;
  recentGoals: string[];
}

export interface AnalyticsSessionSummaryResponse {
  sessionId: number;
  userId: number;
  goal?: string;
  startedAt: string;
  endedAt?: string;
  totalProgress: number;
  averageScore?: number;
  completed: boolean;
}

export interface AnalyticsUserTrendResponse {
  userId: number;
  period: string;
  points: TrendPoint[];
}

export interface TrendPoint {
  date: string;
  sessionCount: number;
  averageScore?: number;
}

export interface AdminPracticeSummaryResponse {
  totalUsers: number;
  totalSessions: number;
  totalProgress: number;
  averageSessionPerUser: number;
  averageScore?: number;
  lastActivityAt?: string;
}

export interface AdminUserSummary {
  userId: number;
  username?: string;
  totalSessions: number;
  completedSessions: number;
  averageScore?: number;
  lastSessionAt?: string;
}

export interface AdminSessionSummary {
  sessionId: number;
  userId: number;
  goal?: string;
  startedAt: string;
  endedAt?: string;
  status: string;
  totalProgress: number;
  averageScore?: number;
}

export interface AdminProgressSummary {
  progressId: number;
  sessionId: number;
  userId: number;
  note: string;
  score?: number;
  timestamp: string;
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

// 사용자별 통계 요약
export async function getAnalyticsUserSummary(userId: number, from?: string, to?: string) {
  const res = await axios.get<CommonResponse<AnalyticsUserSummaryResponse>>(`/api/practice-sessions/analytics/user/${userId}/summary`, { params: { from, to } });
  return res.data;
}

// 세션별 통계 요약
export async function getAnalyticsSessionSummary(sessionId: number) {
  const res = await axios.get<CommonResponse<AnalyticsSessionSummaryResponse>>(`/api/practice-sessions/analytics/session/${sessionId}/summary`);
  return res.data;
}

// 사용자 성장 추이
export async function getAnalyticsUserTrend(userId: number, period: string = 'week') {
  const res = await axios.get<CommonResponse<AnalyticsUserTrendResponse>>(`/api/practice-sessions/analytics/user/${userId}/trend`, { params: { period } });
  return res.data;
}

// 관리자 전체 통계 요약
export async function getAdminPracticeSummary() {
  const res = await axios.get<CommonResponse<AdminPracticeSummaryResponse>>(`/api/practice-sessions/admin/summary`);
  return res.data;
}

// 관리자 전체 사용자 요약
export async function getAdminUserSummaries() {
  const res = await axios.get<CommonResponse<AdminUserSummary[]>>(`/api/practice-sessions/admin/users`);
  return res.data;
}

// 관리자 전체 세션 요약
export async function getAdminSessionSummaries() {
  const res = await axios.get<CommonResponse<AdminSessionSummary[]>>(`/api/practice-sessions/admin/sessions`);
  return res.data;
}

// 관리자 전체 진행상황 요약
export async function getAdminProgressSummaries() {
  const res = await axios.get<CommonResponse<AdminProgressSummary[]>>(`/api/practice-sessions/admin/progress`);
  return res.data;
} 