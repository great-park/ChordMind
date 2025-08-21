'use client'

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, UserProfile } from '../services/authService';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string, nickname?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateUser: (updatedUser: Partial<UserProfile>) => void;
  clearError: () => void;
  loginAsTestUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  useEffect(() => {
    // 앱 시작 시 인증 상태 초기화
    authService.initialize();
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await authService.login({ email, password });
      if (response.success && response.data) {
        setUser(response.data.user);
        return { success: true };
      }
      
      const errorMessage = response.message || '로그인에 실패했습니다.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } catch (error) {
      const errorMessage = '로그인 중 오류가 발생했습니다.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, nickname?: string): Promise<{ success: boolean; message?: string }> => {
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await authService.register({ name, email, password, nickname });
      if (response.success && response.data) {
        setUser(response.data.user);
        return { success: true };
      }
      
      const errorMessage = response.message || '회원가입에 실패했습니다.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } catch (error) {
      const errorMessage = '회원가입 중 오류가 발생했습니다.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setError(null);
  };

  const refreshUser = async (): Promise<void> => {
    try {
      setError(null);
      const currentUser = authService.getCurrentUser();
      
      if (currentUser && currentUser.id) {
        // 서버에서 최신 사용자 정보 가져오기
        // const response = await authService.getUserById(currentUser.id);
        // if (response.success && response.data) {
        //   authService.setUser(response.data);
        //   setUser(response.data);
        // } else {
          setUser(currentUser); // 로컬 정보 사용
        // }
      } else {
        setUser(null);
      }
    } catch (error) {
      // 에러 발생 시 로컬 정보 사용
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
    }
  };

  const updateUser = (updatedUser: Partial<UserProfile>) => {
    if (user) {
      const newUser = { ...user, ...updatedUser };
      setUser(newUser);
      // authService.setUser(newUser);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const loginAsTestUser = () => {
    const testUser: UserProfile = {
      id: 1,
      name: '테스트 사용자',
      email: 'test@chordmind.com',
      nickname: '테스트뮤지션',
      profileImage: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setUser(testUser);
    setError(null);
    // 로컬 스토리지에 테스트 사용자 정보 저장
    localStorage.setItem('chordmind_user', JSON.stringify(testUser));
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshUser,
    updateUser,
    clearError,
    loginAsTestUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 