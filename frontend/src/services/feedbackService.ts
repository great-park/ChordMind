import { apiClient, ApiResponse } from './apiClient';

export interface CreateFeedbackRequest {
  sessionId?: number;
  feedbackType: string;
  category: string;
  title: string;
  content: string;
  rating?: number;
  priority: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface FeedbackResponse {
  id: number;
  userId: number;
  sessionId?: number;
  feedbackType: string;
  category: string;
  title: string;
  content: string;
  rating?: number;
  priority: string;
  status: string;
  tags?: string[];
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolvedBy?: number;
  resolutionNotes?: string;
}

export interface FeedbackListResponse {
  feedbacks: FeedbackResponse[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface FeedbackStatsResponse {
  totalFeedbacks: number;
  pendingFeedbacks: number;
  resolvedFeedbacks: number;
  averageRating: number;
  feedbacksByType: Record<string, number>;
  feedbacksByPriority: Record<string, number>;
  feedbacksByStatus: Record<string, number>;
  recentFeedbacks: FeedbackResponse[];
}

class FeedbackService {
  // 피드백 생성
  async createFeedback(request: CreateFeedbackRequest): Promise<ApiResponse<FeedbackResponse>> {
    return apiClient.post<FeedbackResponse>('/api/feedback', request);
  }

  // 피드백 조회
  async getFeedback(feedbackId: number): Promise<ApiResponse<FeedbackResponse>> {
    return apiClient.get<FeedbackResponse>(`/api/feedback/${feedbackId}`);
  }

  // 사용자별 피드백 목록 조회
  async getUserFeedbacks(
    userId: number,
    page: number = 0,
    size: number = 20
  ): Promise<ApiResponse<FeedbackListResponse>> {
    const params = { page, size };
    const queryString = apiClient.buildQueryParams(params);
    return apiClient.get<FeedbackListResponse>(`/api/feedback/user/${userId}?${queryString}`);
  }

  // 피드백 검색
  async searchFeedbacks(params: {
    feedbackType?: string;
    category?: string;
    priority?: string;
    status?: string;
    rating?: number;
    keyword?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    size?: number;
  }): Promise<ApiResponse<FeedbackListResponse>> {
    const queryString = apiClient.buildQueryParams(params);
    return apiClient.get<FeedbackListResponse>(`/api/feedback/search?${queryString}`);
  }

  // 피드백 통계 조회
  async getFeedbackStats(): Promise<ApiResponse<FeedbackStatsResponse>> {
    return apiClient.get<FeedbackStatsResponse>('/api/feedback/stats');
  }

  // 피드백 수정
  async updateFeedback(
    feedbackId: number,
    request: Partial<CreateFeedbackRequest>
  ): Promise<ApiResponse<FeedbackResponse>> {
    return apiClient.put<FeedbackResponse>(`/api/feedback/${feedbackId}`, request);
  }

  // 피드백 해결
  async resolveFeedback(
    feedbackId: number,
    request: { status: string; resolutionNotes?: string }
  ): Promise<ApiResponse<FeedbackResponse>> {
    return apiClient.post<FeedbackResponse>(`/api/feedback/${feedbackId}/resolve`, request);
  }

  // 피드백 삭제
  async deleteFeedback(feedbackId: number): Promise<ApiResponse<string>> {
    return apiClient.delete<string>(`/api/feedback/${feedbackId}`);
  }

  // 최근 피드백 조회
  async getRecentFeedbacks(limit: number = 10): Promise<ApiResponse<FeedbackResponse[]>> {
    return apiClient.get<FeedbackResponse[]>(`/api/feedback/recent?limit=${limit}`);
  }

  // 상태별 피드백 개수 조회
  async getFeedbackCountByStatus(status: string): Promise<ApiResponse<number>> {
    return apiClient.get<number>(`/api/feedback/count/status/${status}`);
  }

  // 타입별 피드백 목록 조회
  async getFeedbacksByType(
    feedbackType: string,
    page: number = 0,
    size: number = 20
  ): Promise<ApiResponse<FeedbackListResponse>> {
    const params = { page, size };
    const queryString = apiClient.buildQueryParams(params);
    return apiClient.get<FeedbackListResponse>(`/api/feedback/type/${feedbackType}?${queryString}`);
  }

  // 우선순위별 피드백 목록 조회
  async getFeedbacksByPriority(
    priority: string,
    page: number = 0,
    size: number = 20
  ): Promise<ApiResponse<FeedbackListResponse>> {
    const params = { page, size };
    const queryString = apiClient.buildQueryParams(params);
    return apiClient.get<FeedbackListResponse>(`/api/feedback/priority/${priority}?${queryString}`);
  }

  // 카테고리별 피드백 목록 조회
  async getFeedbacksByCategory(
    category: string,
    page: number = 0,
    size: number = 20
  ): Promise<ApiResponse<FeedbackListResponse>> {
    const params = { page, size };
    const queryString = apiClient.buildQueryParams(params);
    return apiClient.get<FeedbackListResponse>(`/api/feedback/category/${category}?${queryString}`);
  }
}

export const feedbackService = new FeedbackService(); 