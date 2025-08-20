// 사용자 관련 타입 정의
export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface UserProfile extends User {
  firstName?: string;
  lastName?: string;
  bio?: string;
  preferences: UserPreferences;
  stats: UserStats;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: 'ko' | 'en';
  notifications: boolean;
  autoSave: boolean;
  practiceReminders: boolean;
}

export interface UserStats {
  totalPracticeTime: number;
  totalSessions: number;
  averageScore: number;
  achievements: Achievement[];
  currentStreak: number;
  longestStreak: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  category: 'practice' | 'skill' | 'social' | 'special';
}
