// When-in-Rome 코퍼스 데이터 타입 정의

export interface CorpusItem {
  /** 장르 (예: Piano_Sonatas, Quartets) */
  genre: string;
  /** 작곡가 (예: Mozart,_Wolfgang_Amadeus) */
  composer: string;
  /** 작품 (예: K545, Op027_No2) */
  set: string;
  /** 악장 (예: 1, 2, 3) */
  movement: string;
  /** 악보 파일 경로 */
  score_path: string | null;
  /** 수동 분석 파일 경로 */
  analysis_path: string;
  /** 자동 분석 파일 경로 */
  auto_analysis_path: string | null;
  /** 메타데이터 */
  metadata: {
    title: string;
    composer: string;
    time_signature: string;
    form: string;
    key_signature: string;
    total_measures: number;
  };
}

export interface CorpusStatistics {
  /** 총 아이템 수 */
  total_items: number;
  /** 장르별 분포 */
  genre_distribution: { [key: string]: number };
  /** 작곡가별 분포 */
  composer_distribution: { [key: string]: number };
  /** 수동 분석 파일 수 */
  manual_analysis_count: number;
  /** 악보 파일 수 */
  score_count: number;
  /** 분석 커버리지 */
  analysis_coverage: string;
}

export interface HarmonyAnalysis {
  /** 로마 숫자 배열 */
  roman_numerals: string[];
  /** 화성 진행 배열 */
  chord_progressions: string[];
  /** 종지 배열 */
  cadences: string[];
  /** 전조 배열 */
  modulations: string[];
  /** 형식 섹션 배열 */
  form_sections: string[];
}

export interface CorpusSearchResult {
  /** 검색어 */
  query: string;
  /** 검색 결과 */
  results: CorpusItem[];
  /** 총 검색 결과 수 */
  total: number;
}

// AI 모델 관련 타입

export interface AIModelInfo {
  /** 모델 이름 */
  model_name: string;
  /** 모델 타입 */
  model_type: string;
  /** 모델 크기 */
  model_size: string;
  /** 지원 기능 */
  capabilities: string[];
}

export interface TrainingDataInfo {
  /** 총 학습 예시 수 */
  total_examples: number;
  /** 특성 목록 */
  features: string[];
  /** 샘플 데이터 */
  sample_data: any;
}

export interface TrainingStatus {
  /** 학습 상태 */
  status: 'idle' | 'training' | 'completed' | 'failed';
  /** 현재 에포크 */
  current_epoch?: number;
  /** 총 에포크 */
  total_epochs?: number;
  /** 학습 손실 */
  loss?: number;
  /** 진행률 */
  progress?: number;
}

export interface HarmonySuggestion {
  /** 제안된 화성 진행 */
  progression: string[];
  /** 확신도 */
  confidence: number;
  /** 스타일 */
  style: string;
  /** 설명 */
  explanation: string;
}

export interface ProgressionAnalysis {
  /** 분석된 화성 진행 */
  progression: string[];
  /** 화성 기능 */
  functions: string[];
  /** 종지 패턴 */
  cadence_patterns: string[];
  /** 전조 분석 */
  modulation_analysis: string[];
  /** 복잡도 점수 */
  complexity_score: number;
}
