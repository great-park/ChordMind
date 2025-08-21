// UI 컴포넌트 공통 타입 정의
export type ColorVariant = 'primary' | 'success' | 'warning' | 'info' | 'danger';
export type SizeVariant = 'sm' | 'md' | 'lg' | 'xl';

export interface ComponentVariant {
  color: ColorVariant;
  size: SizeVariant;
}

// 공통 스타일 타입
export interface CommonStyles {
  background: string;
  color: string;
  border?: string;
  borderRadius?: string;
  boxShadow?: string;
}
