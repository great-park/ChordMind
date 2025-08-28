// API 기본 URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8082';

// 환경 설정
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// 앱 설정
export const APP_NAME = 'ChordMind';
export const APP_VERSION = '1.0.0';

// API 타임아웃
export const API_TIMEOUT = 10000; // 10초

// 페이지네이션
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// 음악 관련 상수
export const MUSIC_STYLES = ['classical', 'jazz', 'pop', 'baroque', 'romantic'] as const;
export const DIFFICULTY_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;
export const MOOD_TYPES = ['happy', 'sad', 'mysterious', 'neutral'] as const;

// 화성 진행 길이 제한
export const MIN_CHORD_LENGTH = 2;
export const MAX_CHORD_LENGTH = 20;
export const DEFAULT_CHORD_LENGTH = 8;

// AI 서비스 설정
export const AI_SERVICE_ENDPOINTS = {
  STATUS: '/api/ai/status',
  ENHANCED_PATTERNS: '/api/ai/composition/enhanced-patterns',
  AI_VS_ENHANCED: '/api/ai/composition/ai-vs-enhanced',
  CORPUS_STATUS: '/api/ai/corpus/status',
  CORPUS_PATTERNS: '/api/ai/corpus/patterns',
  CORPUS_CURRICULUM: '/api/ai/corpus/curriculum',
  HARMONY_ANALYSIS: '/api/ai/harmony/advanced-analysis',
  MODULATION_GUIDE: '/api/ai/harmony/modulation-guide'
} as const;
