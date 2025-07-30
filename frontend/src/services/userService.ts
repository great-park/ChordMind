import { apiClient, ApiResponse } from './apiClient';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  nickname: string;
  bio: string;
  location: string;
  website: string;
  socialLinks: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
  joinDate: string;
  lastActive: string;
  profileImage?: string;
}

export interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    practice: boolean;
    achievements: boolean;
    weekly: boolean;
  };
  privacy: {
    profileVisible: boolean;
    practiceHistory: boolean;
    achievements: boolean;
    leaderboard: boolean;
  };
  learning: {
    difficulty: string;
    focusAreas: string[];
    dailyGoal: number;
    autoAnalysis: boolean;
  };
  theme: {
    mode: string;
    color: string;
  };
}

export interface UserStats {
  totalPracticeTime: number;
  totalSessions: number;
  averageSessionTime: number;
  completionRate: number;
  improvementRate: number;
  streakDays: number;
  achievements: Achievement[];
  recentActivity: Activity[];
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
  category: string;
}

export interface Activity {
  id: number;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  score?: number;
}

class UserService {
  // 사용자 프로필 조회
  async getUserProfile(userId: number): Promise<ApiResponse<UserProfile>> {
    return apiClient.get<UserProfile>(`/api/users/${userId}/profile`);
  }

  // 사용자 프로필 수정
  async updateUserProfile(
    userId: number,
    profile: Partial<UserProfile>
  ): Promise<ApiResponse<UserProfile>> {
    return apiClient.put<UserProfile>(`/api/users/${userId}/profile`, profile);
  }

  // 사용자 설정 조회
  async getUserSettings(userId: number): Promise<ApiResponse<UserSettings>> {
    return apiClient.get<UserSettings>(`/api/users/${userId}/settings`);
  }

  // 사용자 설정 수정
  async updateUserSettings(
    userId: number,
    settings: Partial<UserSettings>
  ): Promise<ApiResponse<UserSettings>> {
    return apiClient.put<UserSettings>(`/api/users/${userId}/settings`, settings);
  }

  // 사용자 통계 조회
  async getUserStats(userId: number): Promise<ApiResponse<UserStats>> {
    return apiClient.get<UserStats>(`/api/users/${userId}/stats`);
  }

  // 사용자 검색
  async searchUsers(params: {
    name?: string;
    email?: string;
    role?: string;
    page?: number;
    size?: number;
  }): Promise<ApiResponse<{ users: UserProfile[]; totalElements: number }>> {
    const queryString = apiClient.buildQueryParams(params);
    return apiClient.get<{ users: UserProfile[]; totalElements: number }>(`/api/users/search?${queryString}`);
  }

  // 사용자 비활성화
  async deactivateUser(userId: number): Promise<ApiResponse<string>> {
    return apiClient.post<string>(`/api/users/${userId}/deactivate`);
  }

  // 사용자 활성화
  async activateUser(userId: number): Promise<ApiResponse<string>> {
    return apiClient.post<string>(`/api/users/${userId}/activate`);
  }

  // 사용자 활동 조회
  async getUserActivity(
    userId: number,
    page: number = 0,
    size: number = 20
  ): Promise<ApiResponse<{ activities: Activity[]; totalElements: number }>> {
    const params = { page, size };
    const queryString = apiClient.buildQueryParams(params);
    return apiClient.get<{ activities: Activity[]; totalElements: number }>(
      `/api/users/${userId}/activity?${queryString}`
    );
  }

  // 프로필 이미지 업로드
  async uploadProfileImage(
    userId: number,
    file: File
  ): Promise<ApiResponse<{ imageUrl: string }>> {
    return apiClient.uploadFile<{ imageUrl: string }>(`/api/users/${userId}/profile/image`, file, 'image');
  }

  // 비밀번호 변경
  async changePassword(
    userId: number,
    request: { currentPassword: string; newPassword: string }
  ): Promise<ApiResponse<string>> {
    return apiClient.put<string>(`/api/users/${userId}/password`, request);
  }

  // 계정 삭제
  async deleteAccount(userId: number): Promise<ApiResponse<string>> {
    return apiClient.delete<string>(`/api/users/${userId}`);
  }

  // 이메일 인증
  async verifyEmail(token: string): Promise<ApiResponse<string>> {
    return apiClient.post<string>('/api/users/verify-email', { token });
  }

  // 이메일 재전송
  async resendVerificationEmail(email: string): Promise<ApiResponse<string>> {
    return apiClient.post<string>('/api/users/resend-verification', { email });
  }

  // 소셜 링크 업데이트
  async updateSocialLinks(
    userId: number,
    socialLinks: {
      twitter?: string;
      instagram?: string;
      youtube?: string;
    }
  ): Promise<ApiResponse<UserProfile>> {
    return apiClient.put<UserProfile>(`/api/users/${userId}/social-links`, socialLinks);
  }

  // 알림 설정 업데이트
  async updateNotificationSettings(
    userId: number,
    notifications: {
      email: boolean;
      push: boolean;
      practice: boolean;
      achievements: boolean;
      weekly: boolean;
    }
  ): Promise<ApiResponse<UserSettings>> {
    return apiClient.put<UserSettings>(`/api/users/${userId}/notifications`, notifications);
  }

  // 개인정보 설정 업데이트
  async updatePrivacySettings(
    userId: number,
    privacy: {
      profileVisible: boolean;
      practiceHistory: boolean;
      achievements: boolean;
      leaderboard: boolean;
    }
  ): Promise<ApiResponse<UserSettings>> {
    return apiClient.put<UserSettings>(`/api/users/${userId}/privacy`, privacy);
  }
}

export const userService = new UserService(); 