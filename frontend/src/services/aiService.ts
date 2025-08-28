import { API_BASE_URL } from '../config/constants';

export interface AIHarmonyPattern {
  style: string;
  difficulty: string;
  pattern_name: string;
  chords: string[];
  description: string;
  examples: string[];
  mood: string;
  source: string;
  enhancements?: {
    mood_adjustments: boolean;
    style_specific: boolean;
    difficulty_scaled: boolean;
  };
}

export interface AIServiceStatus {
  composition_service: {
    ai_available: boolean;
    corpus_available: boolean;
    service_mode: string;
  };
  harmony_ai: {
    ai_available: boolean;
    model_loaded: boolean;
    service_status: string;
    model_type: string;
  };
  corpus_integration: {
    available: boolean;
    status: string;
  };
}

export interface AIComparisonResult {
  ai_mode: AIHarmonyPattern | null;
  enhanced_mode: AIHarmonyPattern;
  comparison: {
    ai_available: boolean;
    enhancements_applied: Record<string, boolean>;
    pattern_complexity: number;
    style_specific: boolean;
  };
}

export interface CorpusPatterns {
  [style: string]: Array<{
    id: string;
    name: string;
    chords: string[];
    difficulty: string;
    description: string;
    examples: string[];
    source: string;
    analysis?: Record<string, any>;
  }>;
}

export interface CorpusCurriculum {
  id: string;
  title: string;
  description: string;
  topics: string[];
  estimated_time: number;
  difficulty: number;
  prerequisites: string[];
  examples: string[];
  exercises: string[];
  source: string;
  corpus_data?: Record<string, any>;
}

export interface HarmonyAnalysis {
  chord_progression: string[];
  style: string;
  ai_analysis?: Record<string, any>;
  source: string;
  analysis_summary: {
    complexity: string;
    harmonic_functions: string[];
    cadence_types: string[];
    modulation_points: string[];
  };
}

export interface ModulationGuide {
  from_key: string;
  to_key: string;
  difficulty: string;
  source: string;
  modulation_methods: Array<{
    type: string;
    name: string;
    description: string;
    example: string;
    difficulty: string;
    steps: string[];
  }>;
  estimated_difficulty: string;
  practical_examples: Array<{
    method: string;
    description: string;
    progression: string;
    steps: string[];
  }>;
  practice_tips: string[];
}

class AIService {
  private baseURL: string;

  constructor() {
    this.baseURL = `${API_BASE_URL}/api/ai`;
  }

  // AI 서비스 상태 확인
  async getServiceStatus(): Promise<AIServiceStatus> {
    try {
      const response = await fetch(`${this.baseURL}/status`);
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('AI 서비스 상태 확인 실패:', error);
      throw error;
    }
  }

  // 고도화된 화성 패턴 생성
  async generateEnhancedHarmonyPattern(
    style: string = 'classical',
    difficulty: string = 'intermediate',
    length: number = 8,
    mood: string = 'neutral'
  ): Promise<AIHarmonyPattern> {
    try {
      const params = new URLSearchParams({
        style,
        difficulty,
        length: length.toString(),
        mood
      });
      
      const response = await fetch(`${this.baseURL}/composition/enhanced-patterns?${params}`);
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('고도화된 화성 패턴 생성 실패:', error);
      throw error;
    }
  }

  // AI vs 고도화 모드 비교
  async compareAIvsEnhanced(
    style: string = 'classical',
    difficulty: string = 'intermediate',
    length: number = 6,
    mood: string = 'neutral'
  ): Promise<AIComparisonResult> {
    try {
      const params = new URLSearchParams({
        style,
        difficulty,
        length: length.toString(),
        mood
      });
      
      const response = await fetch(`${this.baseURL}/composition/ai-vs-enhanced?${params}`);
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('AI vs 고도화 모드 비교 실패:', error);
      throw error;
    }
  }

  // 코퍼스 상태 확인
  async getCorpusStatus(): Promise<{ available: boolean; base_path: string; status: string }> {
    try {
      const response = await fetch(`${this.baseURL}/corpus/status`);
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('코퍼스 상태 확인 실패:', error);
      throw error;
    }
  }

  // 코퍼스에서 화성 패턴 가져오기
  async getCorpusPatterns(style: string): Promise<CorpusPatterns> {
    try {
      const response = await fetch(`${this.baseURL}/corpus/patterns/${style}`);
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('코퍼스 패턴 가져오기 실패:', error);
      throw error;
    }
  }

  // 코퍼스에서 커리큘럼 가져오기
  async getCorpusCurriculum(level: string): Promise<CorpusCurriculum[]> {
    try {
      const response = await fetch(`${this.baseURL}/corpus/curriculum/${level}`);
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('코퍼스 커리큘럼 가져오기 실패:', error);
      throw error;
    }
  }

  // 고급 화성 분석
  async analyzeHarmonyAdvanced(
    chordProgression: string,
    style: string = 'classical'
  ): Promise<HarmonyAnalysis> {
    try {
      const params = new URLSearchParams({
        chord_progression: chordProgression,
        style
      });
      
      const response = await fetch(`${this.baseURL}/harmony/advanced-analysis?${params}`);
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('고급 화성 분석 실패:', error);
      throw error;
    }
  }

  // 조성 전환 가이드 생성
  async getModulationGuide(
    fromKey: string,
    toKey: string,
    difficulty: string = 'beginner',
    style: string = 'classical'
  ): Promise<ModulationGuide> {
    try {
      const params = new URLSearchParams({
        from_key: fromKey,
        to_key: toKey,
        difficulty,
        style
      });
      
      const response = await fetch(`${this.baseURL}/harmony/modulation-guide?${params}`);
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('조성 전환 가이드 생성 실패:', error);
      throw error;
    }
  }

  // 실시간 AI 서비스 모니터링
  async monitorAIService(): Promise<{
    status: AIServiceStatus;
    health: 'healthy' | 'degraded' | 'unhealthy';
    recommendations: string[];
  }> {
    try {
      const status = await this.getServiceStatus();
      
      // 서비스 상태 평가
      let health: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
      const recommendations: string[] = [];
      
      if (!status.harmony_ai.ai_available) {
        health = 'degraded';
        recommendations.push('Harmony AI 모델을 로드할 수 없습니다. 모델 파일을 확인하세요.');
      }
      
      if (!status.corpus_integration.available) {
        health = 'degraded';
        recommendations.push('When-in-Rome 코퍼스에 접근할 수 없습니다. 코퍼스 경로를 확인하세요.');
      }
      
      if (!status.composition_service.ai_available && !status.composition_service.corpus_available) {
        health = 'unhealthy';
        recommendations.push('AI 서비스가 완전히 사용 불가능합니다. 시스템을 점검하세요.');
      }
      
      return { status, health, recommendations };
    } catch (error) {
      console.error('AI 서비스 모니터링 실패:', error);
      return {
        status: {} as AIServiceStatus,
        health: 'unhealthy',
        recommendations: ['서비스 상태를 확인할 수 없습니다.']
      };
    }
  }

  // AI 서비스 성능 테스트
  async testAIServicePerformance(): Promise<{
    response_times: Record<string, number>;
    success_rates: Record<string, boolean>;
    recommendations: string[];
  }> {
    const startTime = Date.now();
    const response_times: Record<string, number> = {};
    const success_rates: Record<string, boolean> = {};
    const recommendations: string[] = [];
    
    try {
      // 1. 서비스 상태 확인 테스트
      const statusStart = Date.now();
      await this.getServiceStatus();
      response_times.status_check = Date.now() - statusStart;
      success_rates.status_check = true;
      
      // 2. 화성 패턴 생성 테스트
      const patternStart = Date.now();
      await this.generateEnhancedHarmonyPattern('classical', 'intermediate', 6, 'neutral');
      response_times.pattern_generation = Date.now() - patternStart;
      success_rates.pattern_generation = true;
      
      // 3. AI 비교 테스트
      const comparisonStart = Date.now();
      await this.compareAIvsEnhanced('jazz', 'beginner', 4, 'happy');
      response_times.ai_comparison = Date.now() - comparisonStart;
      success_rates.ai_comparison = true;
      
      // 성능 분석 및 권장사항
      Object.entries(response_times).forEach(([service, time]) => {
        if (time > 1000) {
          recommendations.push(`${service} 응답 시간이 느립니다 (${time}ms). 최적화가 필요합니다.`);
        }
      });
      
      if (Object.values(success_rates).every(Boolean)) {
        recommendations.push('모든 AI 서비스가 정상적으로 작동하고 있습니다.');
      }
      
    } catch (error) {
      console.error('AI 서비스 성능 테스트 실패:', error);
      recommendations.push('성능 테스트 중 오류가 발생했습니다.');
    }
    
    return { response_times, success_rates, recommendations };
  }
}

export const aiService = new AIService();
export default aiService;
