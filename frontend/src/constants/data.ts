import { Feature, Review, Keyword } from '../types';

// 인기 검색어 데이터
export const TRENDING_KEYWORDS = [
  { text: 'C Major Scale', rank: 1 },
  { text: 'Jazz Improvisation', rank: 2 },
  { text: 'Classical Piano', rank: 3 },
  { text: 'Guitar Chords', rank: 4 },
  { text: 'Rhythm Training', rank: 5 },
  { text: 'Music Theory', rank: 6 },
];

export const RECENT_KEYWORDS = [
  { text: 'Piano Practice' },
  { text: 'Guitar Lessons' },
  { text: 'Music Analysis' },
  { text: 'Performance Tips' },
  { text: 'Practice Routine' },
];

// 주요 기능 데이터
export const FEATURES = [
  {
    title: 'AI 실시간 분석',
    description: '연주를 실시간으로 분석하여 정확한 피드백을 제공합니다.',
    icon: '🤖',
  },
  {
    title: '맞춤형 연습 계획',
    description: '개인 수준에 맞는 최적화된 연습 계획을 제시합니다.',
    icon: '📋',
  },
  {
    title: '진행 상황 추적',
    description: '학습 진행 상황을 시각적으로 확인할 수 있습니다.',
    icon: '📊',
  },
  {
    title: '커뮤니티',
    description: '다른 학습자들과 경험을 공유하고 소통할 수 있습니다.',
    icon: '👥',
  },
  {
    title: '업적 시스템',
    description: '목표 달성 시 업적을 획득하여 동기부여를 제공합니다.',
    icon: '🏆',
  },
  {
    title: '다양한 연습 모드',
    description: '스케일, 코드, 리듬 등 다양한 연습 모드를 제공합니다.',
    icon: '🎵',
  },
];

// 사용자 후기 데이터
export const REVIEWS = [
  {
    user: '김음악',
    role: '피아노 초보자',
    text: 'AI 분석 덕분에 연주 실력이 크게 향상되었습니다. 정확한 피드백이 정말 도움이 됩니다.',
    color: 'primary',
  },
  {
    user: '이재즈',
    role: '재즈 기타리스트',
    text: '즉흥연주 연습에 최적화된 도구입니다. 실시간 분석이 정말 놀랍습니다.',
    color: 'success',
  },
  {
    user: '박클래식',
    role: '클래식 피아니스트',
    text: '클래식 연주에 필요한 정확한 테크닉 분석을 제공해줍니다.',
    color: 'warning',
  },
  {
    user: '최팝',
    role: '팝 가수',
    text: '코드 진행과 리듬 연습에 완벽한 도구입니다. 추천합니다!',
    color: 'info',
  },
];

// 네비게이션 메뉴 데이터
export const NAVIGATION_ITEMS = [
  { id: 'analyze', label: '연주 분석', icon: 'bi-music-note', href: '#analyze' },
  { id: 'features', label: '기능 소개', icon: 'bi-gear', href: '#features' },
  { id: 'practice', label: '연습 기록', icon: 'bi-graph-up', href: '#practice' },
]; 