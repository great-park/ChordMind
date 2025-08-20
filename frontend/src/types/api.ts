// API 응답 관련 타입 정의
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  timestamp: string;
}

export type ApiResult<T> = ApiResponse<T> | ApiError;

// API 타입 가드
export function isApiSuccess<T>(result: ApiResult<T>): result is ApiResponse<T> {
  return result.success === true;
}

export function isApiError<T>(result: ApiResult<T>): result is ApiError {
  return result.success === false;
}

// 페이지네이션 타입
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
