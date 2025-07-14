// 홈페이지 관련 타입 정의

export interface Feature {
  icon: string;
  title: string;
  desc: string;
}

export interface Review {
  user: string;
  role: string;
  text: string;
  color: 'primary' | 'success' | 'info' | 'warning' | 'danger';
}

export interface Keyword {
  text: string;
  rank?: number;
}

export interface User {
  id: string;
  name: string;
  profileImage: string;
  role?: string;
}

export interface GrowthData {
  percentage: number;
  label: string;
  trend: 'up' | 'down' | 'stable';
}

// 부트스트랩 색상 타입
export type BootstrapColor = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'; 