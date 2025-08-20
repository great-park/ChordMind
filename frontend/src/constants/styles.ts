// 공통 카드 스타일
export const CARD_STYLES = {
  dark: {
    background: 'linear-gradient(135deg, #334155 0%, #475569 100%)',
    borderRadius: '16px',
    border: '1px solid rgba(139, 92, 246, 0.15)',
    boxShadow: '0 8px 20px -5px rgba(0, 0, 0, 0.2), 0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  },
  large: {
    background: 'linear-gradient(135deg, #334155 0%, #475569 100%)',
    borderRadius: '20px',
    border: '1px solid rgba(139, 92, 246, 0.15)',
    boxShadow: '0 8px 20px -5px rgba(0, 0, 0, 0.2), 0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  }
} as const;

// 색상 팔레트
export const COLORS = {
  primary: {
    main: '#8b5cf6',
    light: '#a78bfa',
    dark: '#7c3aed',
    background: 'rgba(139, 92, 246, 0.15)',
    border: 'rgba(139, 92, 246, 0.15)'
  },
  success: {
    main: '#10b981',
    light: '#4ade80',
    dark: '#059669',
    background: 'rgba(34, 197, 94, 0.15)',
    border: 'rgba(34, 197, 94, 0.15)'
  },
  warning: {
    main: '#f59e0b',
    light: '#fbbf24',
    dark: '#d97706',
    background: 'rgba(245, 158, 11, 0.15)',
    border: 'rgba(245, 158, 11, 0.15)'
  },
  info: {
    main: '#3b82f6',
    light: '#60a5fa',
    dark: '#2563eb',
    background: 'rgba(59, 130, 246, 0.15)',
    border: 'rgba(59, 130, 246, 0.15)'
  },
  text: {
    primary: 'white',
    secondary: '#cbd5e1',
    tertiary: '#94a3b8',
    muted: '#64748b'
  }
} as const;

// 그라디언트 배경
export const GRADIENTS = {
  dark: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
  card: 'linear-gradient(135deg, #334155 0%, #475569 100%)',
  primary: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
  success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  info: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
} as const;

// 버튼 스타일
export const BUTTON_STYLES = {
  primary: {
    background: '#8b5cf6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '500'
  },
  outline: {
    background: 'transparent',
    color: '#a78bfa',
    border: '2px solid #8b5cf6',
    borderRadius: '8px',
    fontWeight: '500'
  },
  success: {
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '500'
  }
} as const;

// 배지 스타일
export const BADGE_STYLES = {
  primary: {
    background: 'rgba(139, 92, 246, 0.2)',
    color: '#a78bfa',
    border: '1px solid rgba(139, 92, 246, 0.3)'
  },
  success: {
    background: 'rgba(34, 197, 94, 0.2)',
    color: '#4ade80',
    border: '1px solid rgba(34, 197, 94, 0.3)'
  },
  warning: {
    background: 'rgba(245, 158, 11, 0.2)',
    color: '#fbbf24',
    border: '1px solid rgba(245, 158, 11, 0.3)'
  }
} as const;
