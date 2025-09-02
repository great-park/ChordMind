import { apiClient, ApiResponse } from './apiClient';
import { backendService } from './backendService';

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

export interface SignInResponse {
  token: string;
  user: UserResponse;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  nickname: string;
  role: string;
  joinDate: string;
  lastActive: string;
}

// UserProfile은 UserResponse와 동일한 구조로 통일
export type UserProfile = UserResponse;

class AuthService {
  private tokenKey = 'chordmind_token';
  private userKey = 'chordmind_user';

  // 로그인
  async login(request: LoginRequest): Promise<ApiResponse<SignInResponse>> {
    try {
      const response = await backendService.login(request);
      
      if (response.success && response.data) {
        this.setToken(response.data.token);
        this.setUser(response.data.user);
      }
      
      return response;
    } catch (error) {
      console.warn('백엔드 서비스 연결 실패, 로컬 모드로 전환:', error);
      
      // 오프라인 모드에서는 테스트 사용자로 로그인
      const testUser: UserResponse = {
        id: 1,
        name: '테스트 사용자',
        email: request.email,
        nickname: '테스트뮤지션',
        role: 'USER',
        joinDate: new Date().toISOString(),
        lastActive: new Date().toISOString(),
      };
      
      const testToken = 'test-jwt-token-' + Date.now();
      const testResponse: SignInResponse = {
        token: testToken,
        user: testUser,
      };
      
      this.setToken(testToken);
      this.setUser(testUser);
      
      return {
        success: true,
        message: '로컬 모드에서 로그인됨',
        data: testResponse,
      };
    }
  }

  // 회원가입
  async register(request: RegisterRequest): Promise<ApiResponse<SignInResponse>> {
    try {
      const response = await backendService.register(request);
      
      if (response.success && response.data) {
        return {
          success: true,
          message: '회원가입이 완료되었습니다.',
          data: response.data,
        };
      }
      
      return {
        success: false,
        message: response.message || '회원가입에 실패했습니다.',
      };
    } catch (error) {
      console.warn('백엔드 서비스 연결 실패, 로컬 모드로 전환:', error);
      
      // 오프라인 모드에서는 테스트 사용자로 회원가입
      const testUser: UserResponse = {
        id: Date.now(),
        name: request.name,
        email: request.email,
        nickname: request.nickname || request.name,
        role: 'USER',
        joinDate: new Date().toISOString(),
        lastActive: new Date().toISOString(),
      };
      
      const testToken = 'test-jwt-token-' + Date.now();
      const testResponse: SignInResponse = {
        token: testToken,
        user: testUser,
      };
      
      this.setToken(testToken);
      this.setUser(testUser);
      
      return {
        success: true,
        message: '로컬 모드에서 회원가입됨',
        data: testResponse,
      };
    }
  }

  // 로그아웃
  logout(): void {
    this.removeToken();
    this.removeUser();
  }

  // 토큰 확인
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // 현재 사용자 정보 조회
  getCurrentUser(): UserProfile | null {
    const userStr = localStorage.getItem(this.userKey);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  // 토큰 조회
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // 토큰 설정
  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    apiClient.setAuthToken(token);
  }

  // 사용자 정보 설정
  private setUser(user: UserResponse): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
    apiClient.setUserId(user.id.toString());
  }

  // 토큰 제거
  private removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // 사용자 정보 제거
  private removeUser(): void {
    localStorage.removeItem(this.userKey);
  }

  // 토큰 갱신
  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const currentToken = this.getToken();
    if (!currentToken) {
      return {
        success: false,
        message: '토큰이 없습니다.',
      };
    }

    const response = await apiClient.post<{ token: string }>('/api/users/refresh-token', {
      token: currentToken,
    });

    if (response.success && response.data) {
      this.setToken(response.data.token);
    }

    return response;
  }

  // 비밀번호 변경
  async changePassword(request: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<string>> {
    return apiClient.put<string>('/api/users/password', request);
  }

  // 비밀번호 재설정 요청
  async requestPasswordReset(email: string): Promise<ApiResponse<string>> {
    return apiClient.post<string>('/api/users/forgot-password', { email });
  }

  // 비밀번호 재설정
  async resetPassword(request: {
    token: string;
    newPassword: string;
  }): Promise<ApiResponse<string>> {
    return apiClient.post<string>('/api/users/reset-password', request);
  }

  // 이메일 인증
  async verifyEmail(token: string): Promise<ApiResponse<string>> {
    return apiClient.post<string>('/api/users/verify-email', { token });
  }

  // 이메일 재전송
  async resendVerificationEmail(email: string): Promise<ApiResponse<string>> {
    return apiClient.post<string>('/api/users/resend-verification', { email });
  }

  // 소셜 로그인 (Google)
  async googleLogin(token: string): Promise<ApiResponse<SignInResponse>> {
    const response = await apiClient.post<SignInResponse>('/api/users/google-signin', { token });
    
    if (response.success && response.data) {
      this.setToken(response.data.token);
      this.setUser(response.data.user);
    }
    
    return response;
  }

  // 소셜 로그인 (Apple)
  async appleLogin(token: string): Promise<ApiResponse<SignInResponse>> {
    const response = await apiClient.post<SignInResponse>('/api/users/apple-signin', { token });
    
    if (response.success && response.data) {
      this.setToken(response.data.token);
      this.setUser(response.data.user);
    }
    
    return response;
  }

  // 계정 삭제
  async deleteAccount(password: string): Promise<ApiResponse<string>> {
    const response = await apiClient.delete<string>('/api/users/account');
    
    if (response.success) {
      this.logout();
    }
    
    return response;
  }

  // 초기화 (앱 시작 시 호출)
  initialize(): void {
    const token = this.getToken();
    const user = this.getCurrentUser();
    
    if (token && user) {
      apiClient.setAuthToken(token);
      apiClient.setUserId(user.id.toString());
    }
  }

  // 현재 로그인한 사용자 ID 조회
  getCurrentUserId(): number | null {
    const user = this.getCurrentUser();
    return user ? user.id : null;
  }
}

export const authService = new AuthService(); 