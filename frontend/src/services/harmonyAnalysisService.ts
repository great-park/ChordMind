import { GRADIENTS, COLORS } from '../constants/styles';

// 화성 분석을 위한 타입 정의
export interface HarmonicAnalysis {
  id: string;
  pieceTitle: string;
  composer: string;
  key: string;
  timeSignature: string;
  measures: MeasureAnalysis[];
  overallHarmonicComplexity: number;
  commonProgressions: ProgressionPattern[];
  analysisDate: Date;
  analyst: string;
}

export interface MeasureAnalysis {
  measureNumber: number;
  beat: number;
  romanNumeral: string;
  key: string;
  bassNote: string;
  chordPitches: string[];
  beatStrength: number;
  duration: number;
  isModulation: boolean;
  modulationKey?: string;
  isMixture: boolean;
  isSecondaryDominant: boolean;
  secondaryKey?: string;
}

export interface ProgressionPattern {
  pattern: string[];
  frequency: number;
  examples: string[];
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  description: string;
}

export interface AnalysisFeedback {
  measureNumber: number;
  beat: number;
  feedbackType: 'PITCH_MISMATCH' | 'METRICAL_WEAK' | 'BASS_MISMATCH' | 'RARE_PROGRESSION' | 'MODULATION_OPPORTUNITY';
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  message: string;
  suggestions: string[];
  confidence: number;
}

export interface HarmonicProfile {
  keyUsage: { [key: string]: number };
  chordTypeUsage: { [chordType: string]: number };
  progressionPatterns: ProgressionPattern[];
  modulationFrequency: number;
  mixtureUsage: number;
  secondaryDominantUsage: number;
  complexityScore: number;
}

class HarmonyAnalysisService {
  private readonly baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  // 1. 기본 화성 분석 생성
  async analyzeHarmony(audioData: ArrayBuffer, metadata: {
    title: string;
    composer: string;
    key?: string;
    timeSignature?: string;
  }): Promise<HarmonicAnalysis> {
    try {
      const formData = new FormData();
      formData.append('audio', new Blob([audioData], { type: 'audio/wav' }));
      formData.append('metadata', JSON.stringify(metadata));

      const response = await fetch(`${this.baseUrl}/api/harmony/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('화성 분석 요청 실패');
      }

      const analysis = await response.json();
      return this.enhanceAnalysisWithAI(analysis);
    } catch (error) {
      console.error('화성 분석 오류:', error);
      throw error;
    }
  }

  // 2. When-in-Rome 스타일의 자동 피드백 생성
  async generateAnalysisFeedback(analysis: HarmonicAnalysis): Promise<AnalysisFeedback[]> {
    const feedback: AnalysisFeedback[] = [];

    // 각 마디별 분석 및 피드백 생성
    for (const measure of analysis.measures) {
      // 피치 매칭 검증
      const pitchFeedback = this.validatePitchMatching(measure);
      if (pitchFeedback) feedback.push(pitchFeedback);

      // 메트릭 위치 검증
      const metricalFeedback = this.validateMetricalPosition(measure);
      if (metricalFeedback) feedback.push(metricalFeedback);

      // 베이스 노트 검증
      const bassFeedback = this.validateBassNote(measure);
      if (bassFeedback) feedback.push(bassFeedback);

      // 희귀한 진행 패턴 검출
      const rareProgressionFeedback = this.detectRareProgressions(measure, analysis.measures);
      if (rareProgressionFeedback) feedback.push(rareProgressionFeedback);

      // 조성 전환 기회 탐지
      const modulationFeedback = this.detectModulationOpportunities(measure, analysis.measures);
      if (modulationFeedback) feedback.push(modulationFeedback);
    }

    return feedback.sort((a, b) => b.confidence - a.confidence);
  }

  // 3. 화성 진행 패턴 인식 (When-in-Rome의 progression analysis 참고)
  async identifyProgressionPatterns(analysis: HarmonicAnalysis): Promise<ProgressionPattern[]> {
    const patterns: { [key: string]: { count: number; examples: string[] } } = {};

    // 2-3-4개 화성으로 구성된 진행 패턴 탐지
    for (let i = 0; i < analysis.measures.length - 1; i++) {
      for (let length = 2; length <= 4 && i + length <= analysis.measures.length; length++) {
        const progression = analysis.measures.slice(i, i + length);
        const pattern = progression.map(m => m.romanNumeral).join('-');
        
        if (!patterns[pattern]) {
          patterns[pattern] = { count: 0, examples: [] };
        }
        
        patterns[pattern].count++;
        patterns[pattern].examples.push(`m${progression[0].measureNumber}-${progression[progression.length - 1].measureNumber}`);
      }
    }

    // 패턴을 빈도순으로 정렬하고 난이도 분류
    return Object.entries(patterns)
      .filter(([_, data]) => data.count >= 2) // 최소 2번 이상 나타나는 패턴만
      .map(([pattern, data]) => ({
        pattern: pattern.split('-'),
        frequency: data.count,
        examples: data.examples.slice(0, 3), // 최대 3개 예시
        difficulty: this.classifyProgressionDifficulty(pattern),
        description: this.describeProgressionPattern(pattern)
      }))
      .sort((a, b) => b.frequency - a.frequency);
  }

  // 4. 모달 믹스처 검출 (When-in-Rome의 mixture.py 참고)
  async detectModalMixture(analysis: HarmonicAnalysis): Promise<{
    mixtureChords: MeasureAnalysis[];
    mixtureTypes: string[];
    overallMixtureScore: number;
  }> {
    const mixtureChords: MeasureAnalysis[] = [];
    const mixtureTypes: Set<string> = new Set();

    for (const measure of analysis.measures) {
      if (this.isModalMixture(measure, analysis.key)) {
        mixtureChords.push(measure);
        
        // 믹스처 타입 분류
        if (measure.romanNumeral.includes('b6') || measure.romanNumeral.includes('b3')) {
          mixtureTypes.add('minor_borrowing');
        }
        if (measure.romanNumeral.includes('#3') || measure.romanNumeral.includes('#6')) {
          mixtureTypes.add('major_borrowing');
        }
        if (measure.romanNumeral.includes('b2') || measure.romanNumeral.includes('b5')) {
          mixtureTypes.add('chromatic_alteration');
        }
      }
    }

    const overallMixtureScore = (mixtureChords.length / analysis.measures.length) * 100;

    return {
      mixtureChords,
      mixtureTypes: Array.from(mixtureTypes),
      overallMixtureScore: Math.round(overallMixtureScore)
    };
  }

  // 5. 화성 복잡도 분석 및 난이도 평가
  async analyzeHarmonicComplexity(analysis: HarmonicAnalysis): Promise<{
    complexityScore: number;
    difficultyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    complexityFactors: string[];
    learningRecommendations: string[];
  }> {
    let complexityScore = 0;
    const complexityFactors: string[] = [];

    // 기본 복잡도 점수
    complexityScore += analysis.measures.length * 0.5; // 마디 수
    complexityScore += analysis.commonProgressions.length * 2; // 진행 패턴 다양성

    // 조성 전환 복잡도
    const modulations = analysis.measures.filter(m => m.isModulation);
    complexityScore += modulations.length * 5;
    if (modulations.length > 0) complexityFactors.push('조성 전환');

    // 모달 믹스처 복잡도
    const mixtureResult = await this.detectModalMixture(analysis);
    complexityScore += mixtureResult.overallMixtureScore * 0.3;
    if (mixtureResult.overallMixtureScore > 20) complexityFactors.push('모달 믹스처');

    // 2차 지배화음 복잡도
    const secondaryDominants = analysis.measures.filter(m => m.isSecondaryDominant);
    complexityScore += secondaryDominants.length * 3;
    if (secondaryDominants.length > 0) complexityFactors.push('2차 지배화음');

    // 난이도 분류
    let difficultyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    if (complexityScore < 30) {
      difficultyLevel = 'BEGINNER';
    } else if (complexityScore < 70) {
      difficultyLevel = 'INTERMEDIATE';
    } else {
      difficultyLevel = 'ADVANCED';
    }

    // 학습 추천사항 생성
    const learningRecommendations = this.generateLearningRecommendations(complexityFactors, difficultyLevel);

    return {
      complexityScore: Math.round(complexityScore),
      difficultyLevel,
      complexityFactors,
      learningRecommendations
    };
  }

  // 6. 개인화된 연습 추천 시스템
  async generatePersonalizedRecommendations(
    userProfile: any,
    analysis: HarmonicAnalysis,
    feedback: AnalysisFeedback[]
  ): Promise<{
    practiceExercises: string[];
    focusAreas: string[];
    nextPieceSuggestions: string[];
    theoreticalTopics: string[];
  }> {
    const focusAreas: string[] = [];
    const practiceExercises: string[] = [];
    const theoreticalTopics: string[] = [];

    // 피드백 기반 연습 영역 식별
    const feedbackTypes = feedback.map(f => f.feedbackType);
    
    if (feedbackTypes.includes('PITCH_MISMATCH')) {
      focusAreas.push('음정 정확도');
      practiceExercises.push('스케일 연습', '아르페지오 연습');
      theoreticalTopics.push('화성학적 음정 관계');
    }

    if (feedbackTypes.includes('METRICAL_WEAK')) {
      focusAreas.push('박자와 리듬');
      practiceExercises.push('메트로놈 연습', '강박과 약박 연습');
      theoreticalTopics.push('박자와 악센트');
    }

    if (feedbackTypes.includes('BASS_MISMATCH')) {
      focusAreas.push('베이스 라인');
      practiceExercises.push('베이스 노트 연습', '화성 진행 연습');
      theoreticalTopics.push('베이스의 화성적 역할');
    }

    // 다음 곡 추천
    const nextPieceSuggestions = this.suggestNextPieces(analysis, userProfile);

    return {
      practiceExercises,
      focusAreas,
      nextPieceSuggestions,
      theoreticalTopics
    };
  }

  // 7. 실시간 화성 분석 (연주 중)
  async analyzeRealTimeHarmony(audioChunk: ArrayBuffer): Promise<{
    currentChord: string;
    key: string;
    confidence: number;
    suggestions: string[];
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/harmony/realtime`, {
        method: 'POST',
        body: JSON.stringify({ audioChunk: Array.from(new Uint8Array(audioChunk)) }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('실시간 분석 요청 실패');
      }

      return await response.json();
    } catch (error) {
      console.error('실시간 분석 오류:', error);
      throw error;
    }
  }

  // 8. 화성 분석 히스토리 및 진행 추적
  async getAnalysisHistory(userId: string): Promise<{
    recentAnalyses: HarmonicAnalysis[];
    progressTrends: any[];
    improvementAreas: string[];
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/harmony/history/${userId}`);
      
      if (!response.ok) {
        throw new Error('분석 히스토리 요청 실패');
      }

      return await response.json();
    } catch (error) {
      console.error('히스토리 조회 오류:', error);
      throw error;
    }
  }

  // 9. 화성 분석 결과 시각화 데이터 생성
  async generateVisualizationData(analysis: HarmonicAnalysis): Promise<{
    chordProgressionChart: any[];
    keyModulationMap: any[];
    complexityTimeline: any[];
    patternFrequencyChart: any[];
  }> {
    // 화성 진행 차트 데이터
    const chordProgressionChart = analysis.measures.map((measure, index) => ({
      x: index,
      y: measure.romanNumeral,
      measure: measure.measureNumber,
      beat: measure.beat,
      key: measure.key,
      color: this.getChordColor(measure.romanNumeral)
    }));

    // 조성 전환 맵 데이터
    const keyModulationMap = analysis.measures
      .filter(m => m.isModulation)
      .map(m => ({
        measure: m.measureNumber,
        fromKey: analysis.key,
        toKey: m.modulationKey!,
        strength: m.beatStrength
      }));

    // 복잡도 타임라인
    const complexityTimeline = analysis.measures.map((measure, index) => ({
      x: index,
      y: this.calculateMeasureComplexity(measure),
      measure: measure.measureNumber,
      label: measure.romanNumeral
    }));

    // 패턴 빈도 차트
    const patternFrequencyChart = analysis.commonProgressions.map(pattern => ({
      pattern: pattern.pattern.join(' → '),
      frequency: pattern.frequency,
      difficulty: pattern.difficulty,
      color: this.getDifficultyColor(pattern.difficulty)
    }));

    return {
      chordProgressionChart,
      keyModulationMap,
      complexityTimeline,
      patternFrequencyChart
    };
  }

  // 10. AI 기반 화성 분석 개선 제안
  async generateAIImprovementSuggestions(
    analysis: HarmonicAnalysis,
    userLevel: string
  ): Promise<{
    harmonicSuggestions: string[];
    theoreticalInsights: string[];
    practiceStrategies: string[];
    nextSteps: string[];
  }> {
    const suggestions: string[] = [];
    const insights: string[] = [];
    const strategies: string[] = [];
    const nextSteps: string[] = [];

    // 화성적 제안
    if (analysis.commonProgressions.length < 3) {
      suggestions.push('더 다양한 화성 진행 패턴을 시도해보세요');
    }

    if (analysis.measures.filter(m => m.isModulation).length === 0) {
      suggestions.push('조성 전환을 통해 음악적 긴장감을 높여보세요');
    }

    // 이론적 통찰
    const keyUsage = this.analyzeKeyUsage(analysis);
    if (keyUsage.relativeMinor && keyUsage.relativeMinor.usage > 0.3) {
      insights.push('상대단조를 적극적으로 활용하고 있습니다');
    }

    // 연습 전략
    if (userLevel === 'BEGINNER') {
      strategies.push('기본 3화음 진행부터 연습하세요');
      strategies.push('메트로놈과 함께 천천히 연습하세요');
    } else if (userLevel === 'INTERMEDIATE') {
      strategies.push('7화음과 2차 지배화음을 연습해보세요');
      strategies.push('모달 믹스처를 활용한 색채감을 탐구해보세요');
    } else {
      strategies.push('복잡한 조성 전환과 화성 진행을 시도해보세요');
      strategies.push('현대적 화성어법을 실험해보세요');
    }

    // 다음 단계
    nextSteps.push('분석된 패턴을 다른 곡에 적용해보세요');
    nextSteps.push('유사한 화성 진행을 가진 곡들을 찾아 연습해보세요');

    return {
      harmonicSuggestions: suggestions,
      theoreticalInsights: insights,
      practiceStrategies: strategies,
      nextSteps: nextSteps
    };
  }

  // Private helper methods
  private validatePitchMatching(measure: MeasureAnalysis): AnalysisFeedback | null {
    // 피치 매칭 검증 로직
    const pitchMatchScore = this.calculatePitchMatchScore(measure);
    
    if (pitchMatchScore < 0.7) {
      return {
        measureNumber: measure.measureNumber,
        beat: measure.beat,
        feedbackType: 'PITCH_MISMATCH',
        severity: pitchMatchScore < 0.5 ? 'HIGH' : 'MEDIUM',
        message: '화성과 실제 연주 음정이 일치하지 않습니다',
        suggestions: ['정확한 음정으로 연주하세요', '화성 이론을 복습하세요'],
        confidence: 0.8
      };
    }
    
    return null;
  }

  private validateMetricalPosition(measure: MeasureAnalysis): AnalysisFeedback | null {
    // 메트릭 위치 검증 로직
    if (measure.beatStrength < 0.3 && measure.romanNumeral !== measure.romanNumeral) {
      return {
        measureNumber: measure.measureNumber,
        beat: measure.beat,
        feedbackType: 'METRICAL_WEAK',
        severity: 'MEDIUM',
        message: '약박에서 화성 변화가 발생했습니다',
        suggestions: ['강박에서 화성을 변화시키세요', '박자 구조를 고려하세요'],
        confidence: 0.7
      };
    }
    
    return null;
  }

  private validateBassNote(measure: MeasureAnalysis): AnalysisFeedback | null {
    // 베이스 노트 검증 로직
    const expectedBass = this.getExpectedBassNote(measure.romanNumeral, measure.key);
    
    if (measure.bassNote !== expectedBass) {
      return {
        measureNumber: measure.measureNumber,
        beat: measure.beat,
        feedbackType: 'BASS_MISMATCH',
        severity: 'MEDIUM',
        message: '베이스 노트가 화성과 일치하지 않습니다',
        suggestions: ['정확한 베이스 노트를 연주하세요', '화성의 기본 위치를 확인하세요'],
        confidence: 0.9
      };
    }
    
    return null;
  }

  private detectRareProgressions(measure: MeasureAnalysis, allMeasures: MeasureAnalysis[]): AnalysisFeedback | null {
    // 희귀한 진행 패턴 검출 로직
    const isRare = this.isRareProgression(measure, allMeasures);
    
    if (isRare) {
      return {
        measureNumber: measure.measureNumber,
        beat: measure.beat,
        feedbackType: 'RARE_PROGRESSION',
        severity: 'LOW',
        message: '드문 화성 진행이 감지되었습니다',
        suggestions: ['이 진행의 효과를 음미해보세요', '유사한 패턴을 찾아보세요'],
        confidence: 0.6
      };
    }
    
    return null;
  }

  private detectModulationOpportunities(measure: MeasureAnalysis, allMeasures: MeasureAnalysis[]): AnalysisFeedback | null {
    // 조성 전환 기회 탐지 로직
    const hasModulationPotential = this.hasModulationPotential(measure, allMeasures);
    
    if (hasModulationPotential) {
      return {
        measureNumber: measure.measureNumber,
        beat: measure.beat,
        feedbackType: 'MODULATION_OPPORTUNITY',
        severity: 'LOW',
        message: '조성 전환의 좋은 기회입니다',
        suggestions: ['이 지점에서 조성을 변화시켜보세요', '전환 효과를 실험해보세요'],
        confidence: 0.5
      };
    }
    
    return null;
  }

  private isModalMixture(measure: MeasureAnalysis, homeKey: string): boolean {
    // 모달 믹스처 검출 로직 (When-in-Rome의 mixture.py 참고)
    const keyMode = this.getKeyMode(homeKey);
    const chordMode = this.getChordMode(measure.romanNumeral);
    
    return keyMode !== chordMode;
  }

  private classifyProgressionDifficulty(pattern: string): 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' {
    // 진행 패턴 난이도 분류
    if (pattern.includes('7') || pattern.includes('dim') || pattern.includes('aug')) {
      return 'ADVANCED';
    } else if (pattern.includes('6') || pattern.includes('4')) {
      return 'INTERMEDIATE';
    } else {
      return 'BEGINNER';
    }
  }

  private describeProgressionPattern(pattern: string): string {
    // 진행 패턴 설명 생성
    const descriptions: { [key: string]: string } = {
      'I-V-I': '기본 토닉-도미넌트 진행',
      'I-IV-V-I': '표준 카덴스 진행',
      'ii-V-I': '재즈 스타일 2-5-1 진행',
      'I-vi-IV-V': '팝 스타일 진행'
    };
    
    return descriptions[pattern] || '화성적 진행 패턴';
  }

  private calculatePitchMatchScore(measure: MeasureAnalysis): number {
    // 피치 매칭 점수 계산 (When-in-Rome의 pitch matching 참고)
    // 실제 구현에서는 더 정교한 알고리즘 필요
    return 0.8; // 임시 값
  }

  private getExpectedBassNote(romanNumeral: string, key: string): string {
    // 로마 숫자와 조성에 따른 예상 베이스 노트 계산
    // 실제 구현에서는 music21의 roman 모듈 활용
    return 'C'; // 임시 값
  }

  private isRareProgression(measure: MeasureAnalysis, allMeasures: MeasureAnalysis[]): boolean {
    // 희귀한 진행 패턴 판별
    const frequency = allMeasures.filter(m => m.romanNumeral === measure.romanNumeral).length;
    return frequency < 3; // 3번 미만 나타나면 희귀
  }

  private hasModulationPotential(measure: MeasureAnalysis, allMeasures: MeasureAnalysis[]): boolean {
    // 조성 전환 잠재력 판별
    return measure.romanNumeral.includes('V7') && measure.beatStrength > 0.7;
  }

  private getKeyMode(key: string): 'major' | 'minor' {
    // 조성의 모드 판별
    return key.toLowerCase() === key ? 'minor' : 'major';
  }

  private getChordMode(romanNumeral: string): 'major' | 'minor' {
    // 화성의 모드 판별
    return romanNumeral.toLowerCase() === romanNumeral ? 'minor' : 'major';
  }

  private calculateMeasureComplexity(measure: MeasureAnalysis): number {
    // 마디별 복잡도 계산
    let complexity = 1;
    if (measure.romanNumeral.includes('7')) complexity += 1;
    if (measure.romanNumeral.includes('dim') || measure.romanNumeral.includes('aug')) complexity += 1;
    if (measure.isModulation) complexity += 2;
    if (measure.isMixture) complexity += 1;
    return complexity;
  }

  private getChordColor(romanNumeral: string): string {
    // 화성별 색상 매핑
    const colorMap: { [key: string]: string } = {
      'I': COLORS.primary.main,
      'V': COLORS.success.main,
      'IV': COLORS.warning.main,
      'vi': COLORS.info.main,
      'ii': COLORS.danger.main
    };
    
    const baseChord = romanNumeral.replace(/[0-9]/g, '');
    return colorMap[baseChord] || COLORS.text.tertiary;
  }

  private getDifficultyColor(difficulty: string): string {
    // 난이도별 색상 매핑
    const colorMap: { [key: string]: string } = {
      'BEGINNER': COLORS.success.main,
      'INTERMEDIATE': COLORS.warning.main,
      'ADVANCED': COLORS.danger.main
    };
    
    return colorMap[difficulty] || COLORS.text.tertiary;
  }

  private analyzeKeyUsage(analysis: HarmonicAnalysis): any {
    // 조성 사용 패턴 분석
    const keyUsage: { [key: string]: number } = {};
    
    analysis.measures.forEach(measure => {
      if (measure.key) {
        keyUsage[measure.key] = (keyUsage[measure.key] || 0) + 1;
      }
    });
    
    return { keyUsage };
  }

  private generateLearningRecommendations(complexityFactors: string[], difficultyLevel: string): string[] {
    // 학습 추천사항 생성
    const recommendations: string[] = [];
    
    if (complexityFactors.includes('조성 전환')) {
      recommendations.push('조성 전환 이론과 실습을 강화하세요');
    }
    
    if (complexityFactors.includes('모달 믹스처')) {
      recommendations.push('모달 믹스처의 효과와 활용법을 학습하세요');
    }
    
    if (complexityFactors.includes('2차 지배화음')) {
      recommendations.push('2차 지배화음의 원리와 연습을 진행하세요');
    }
    
    return recommendations;
  }

  private suggestNextPieces(analysis: HarmonicAnalysis, userProfile: any): string[] {
    // 다음 곡 추천
    const suggestions: string[] = [];
    
    if (analysis.commonProgressions.length < 3) {
      suggestions.push('더 다양한 화성 진행을 가진 곡을 연습해보세요');
    }
    
    if (analysis.measures.filter(m => m.isModulation).length === 0) {
      suggestions.push('조성 전환이 있는 곡을 시도해보세요');
    }
    
    return suggestions;
  }

  private enhanceAnalysisWithAI(analysis: HarmonicAnalysis): HarmonicAnalysis {
    // AI를 통한 분석 결과 향상
    // 실제 구현에서는 더 정교한 AI 모델 활용
    return {
      ...analysis,
      overallHarmonicComplexity: this.calculateOverallComplexity(analysis),
      commonProgressions: this.extractCommonProgressions(analysis.measures)
    };
  }

  private calculateOverallComplexity(analysis: HarmonicAnalysis): number {
    // 전체 화성 복잡도 계산
    let complexity = 0;
    
    analysis.measures.forEach(measure => {
      complexity += this.calculateMeasureComplexity(measure);
    });
    
    return Math.round(complexity / analysis.measures.length * 10);
  }

  private extractCommonProgressions(measures: MeasureAnalysis[]): ProgressionPattern[] {
    // 일반적인 진행 패턴 추출
    const patterns: { [key: string]: number } = {};
    
    for (let i = 0; i < measures.length - 1; i++) {
      const pattern = `${measures[i].romanNumeral}-${measures[i + 1].romanNumeral}`;
      patterns[pattern] = (patterns[pattern] || 0) + 1;
    }
    
    return Object.entries(patterns)
      .filter(([_, count]) => count >= 2)
      .map(([pattern, count]) => ({
        pattern: pattern.split('-'),
        frequency: count,
        examples: [`m${measures[0].measureNumber}-${measures[measures.length - 1].measureNumber}`],
        difficulty: this.classifyProgressionDifficulty(pattern),
        description: this.describeProgressionPattern(pattern)
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 5); // 상위 5개만
  }
}

export const harmonyAnalysisService = new HarmonyAnalysisService();
