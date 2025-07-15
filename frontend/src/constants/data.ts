import { Feature, Review, Keyword } from '../types';

// 인기 검색어 데이터
export const TRENDING_KEYWORDS: Keyword[] = [
  { text: '실시간 연주 분석', rank: 1 },
  { text: 'AI 피드백', rank: 2 },
  { text: '음정 인식', rank: 3 },
  { text: '박자 교정', rank: 4 },
  { text: '코드 분석', rank: 5 },
  { text: '리듬 트레이닝', rank: 6 },
  { text: '연습 기록', rank: 7 },
  { text: '성장 그래프', rank: 8 },
  { text: '개인 맞춤 코칭', rank: 9 },
  { text: '음악 연습 챌린지', rank: 10 },
];

export const RECENT_KEYWORDS: Keyword[] = [
  { text: '피아노 연습' },
  { text: '기타 코드' },
  { text: '재즈 리듬' },
  { text: '템포 조절' },
  { text: '화성 분석' },
];

// 주요 기능 데이터
export const FEATURES: Feature[] = [
  { icon: '🎵', title: '실시간 연주 분석', desc: '마이크/파일로 연주를 즉시 분석' },
  { icon: '🤖', title: 'AI 피드백', desc: '개인 맞춤형 연습 코칭 제공' },
  { icon: '📈', title: '성장 그래프', desc: '연습 기록과 성장 시각화' },
  { icon: '🎹', title: '음정/박자 인식', desc: '정확한 음정·박자 분석' },
  { icon: '🎸', title: '코드/리듬 분석', desc: '코드, 리듬까지 AI가 분석' },
  { icon: '🏆', title: '연습 챌린지', desc: '목표 설정과 도전 미션' },
];

// 사용자 후기 데이터
export const REVIEWS: Review[] = [
  { user: '김민수', role: '피아노 연주자', text: 'AI 피드백 덕분에 실력이 쑥쑥 늘어요!', color: 'primary' },
  { user: '이서연', role: '기타 입문자', text: '코드 분석이 정말 정확해서 연습이 재밌어요.', color: 'success' },
  { user: '박지훈', role: '작곡가', text: '연습 기록과 성장 그래프가 동기부여에 최고!', color: 'info' },
];

// 네비게이션 메뉴 데이터
export const NAVIGATION_ITEMS = [
  { id: 'analyze', label: '연주 분석', icon: 'bi-music-note', href: '#analyze' },
  { id: 'features', label: '기능 소개', icon: 'bi-gear', href: '#features' },
  { id: 'practice', label: '연습 기록', icon: 'bi-graph-up', href: '#practice' },
]; 