// UI 컴포넌트 공통 타입 정의
export type ColorVariant = 'primary' | 'success' | 'warning' | 'info' | 'danger';
export type SizeVariant = 'sm' | 'md' | 'lg' | 'xl';

export interface ComponentVariant {
  color: ColorVariant;
  size: SizeVariant;
}

export interface ButtonProps {
  variant: ColorVariant;
  size: SizeVariant;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export interface CardProps {
  variant: 'default' | 'elevated' | 'outlined';
  padding: 'sm' | 'md' | 'lg';
  border: boolean;
  shadow: boolean;
}

export interface BadgeProps {
  variant: ColorVariant;
  size: SizeVariant;
  rounded: boolean;
}

// 공통 스타일 타입
export interface CommonStyles {
  background: string;
  color: string;
  border?: string;
  borderRadius?: string;
  boxShadow?: string;
}
