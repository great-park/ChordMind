const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  // JWT 토큰 설정
  setAuthToken(token: string) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // 사용자 ID 설정
  setUserId(userId: string) {
    this.defaultHeaders['X-User-ID'] = userId;
  }

  // 기본 요청 메서드
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const config: RequestInit = {
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
        ...options,
      };

      console.log(`API Request: ${options.method || 'GET'} ${url}`);
      
      const response = await fetch(url, config);
      const responseText = await response.text();
      
      console.log(`API Response: ${response.status} ${responseText}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${responseText}`);
      }

      if (!responseText) {
        return {
          success: true,
          message: 'Success',
        };
      }

      const data = JSON.parse(responseText);
      return data;
    } catch (error) {
      console.error('API 요청 실패:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : '알 수 없는 오류가 발생했습니다.';
      
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  // GET 요청
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST 요청
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT 요청
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE 요청
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // 파일 업로드
  async uploadFile<T>(endpoint: string, file: File, fieldName: string = 'file'): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append(fieldName, file);

    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        // Content-Type은 FormData가 자동으로 설정
      },
    });
  }

  // 쿼리 파라미터 생성
  buildQueryParams(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });
    return searchParams.toString();
  }
}

export const apiClient = new ApiClient(); 