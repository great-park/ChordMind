import { GRADIENTS, COLORS } from '../constants/styles';

// 작곡 관련 타입 정의
export interface CompositionRequest {
  style: 'classical' | 'jazz' | 'pop' | 'folk' | 'electronic';
  key: string;
  timeSignature: string;
  length: number; // 마디 수
  mood: 'happy' | 'sad' | 'energetic' | 'calm' | 'mysterious';
  complexity: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  targetInstruments: string[];
}

export interface HarmonicProgression {
  pattern: string[];
  romanNumerals: string[];
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  style: string[];
  description: string;
  examples: string[];
  frequency: number;
}

export interface MelodySuggestion {
  notes: string[];
  rhythm: string[];
  contour: 'ascending' | 'descending' | 'stable' | 'wave';
  tension: number; // 0-100
  style: string;
}

export interface ModulationGuide {
  fromKey: string;
  toKey: string;
  technique: 'pivot_chord' | 'direct' | 'chromatic' | 'enharmonic';
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  description: string;
  example: string;
  commonUses: string[];
}

export interface CompositionSuggestion {
  progression: HarmonicProgression;
  melody: MelodySuggestion;
  modulation?: ModulationGuide;
  overallStructure: string[];
  styleNotes: string[];
  practiceTips: string[];
}

class CompositionAssistantService {
  private readonly baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  // When-in-Rome에서 추출한 일반적인 화성 진행 패턴들
  private readonly commonProgressions: HarmonicProgression[] = [
    {
      pattern: ['I', 'V', 'vi', 'IV'],
      romanNumerals: ['I', 'V', 'vi', 'IV'],
      difficulty: 'BEGINNER',
      style: ['pop', 'folk', 'electronic'],
      description: '팝 스타일의 기본 4화음 진행',
      examples: ['Let It Be', 'With or Without You', 'Don\'t Stop Believin\''],
      frequency: 95
    },
    {
      pattern: ['ii', 'V', 'I'],
      romanNumerals: ['ii', 'V', 'I'],
      difficulty: 'BEGINNER',
      style: ['jazz', 'classical', 'pop'],
      description: '재즈의 기본 2-5-1 진행',
      examples: ['Autumn Leaves', 'Take Five', 'All The Things You Are'],
      frequency: 90
    },
    {
      pattern: ['I', 'vi', 'IV', 'V'],
      romanNumerals: ['I', 'vi', 'IV', 'V'],
      difficulty: 'BEGINNER',
      style: ['pop', 'rock', 'folk'],
      description: '로맨틱한 느낌의 진행',
      examples: ['Perfect', 'Someone Like You', 'Hallelujah'],
      frequency: 88
    },
    {
      pattern: ['I', 'V', 'vi', 'iii', 'IV', 'I', 'V'],
      romanNumerals: ['I', 'V', 'vi', 'iii', 'IV', 'I', 'V'],
      difficulty: 'INTERMEDIATE',
      style: ['classical', 'film', 'epic'],
      description: '클래식 스타일의 확장된 진행',
      examples: ['Beethoven Sonatas', 'Film Soundtracks', 'Epic Music'],
      frequency: 75
    },
    {
      pattern: ['ii7', 'V7', 'Imaj7'],
      romanNumerals: ['ii7', 'V7', 'Imaj7'],
      difficulty: 'INTERMEDIATE',
      style: ['jazz', 'smooth', 'lounge'],
      description: '재즈 7화음 진행',
      examples: ['Blue Bossa', 'Take Five', 'So What'],
      frequency: 70
    },
    {
      pattern: ['I', 'bVI', 'bVII', 'I'],
      romanNumerals: ['I', 'bVI', 'bVII', 'I'],
      difficulty: 'ADVANCED',
      style: ['rock', 'metal', 'epic'],
      description: '모달 믹스처를 활용한 강력한 진행',
      examples: ['Sweet Child O\' Mine', 'Nothing Else Matters', 'Epic Rock'],
      frequency: 60
    },
    {
      pattern: ['I', 'V', 'vi', 'V', 'I', 'V', 'vi', 'V'],
      romanNumerals: ['I', 'V', 'vi', 'V', 'I', 'V', 'vi', 'V'],
      difficulty: 'INTERMEDIATE',
      style: ['pop', 'folk', 'country'],
      description: '8마디 팝 진행',
      examples: ['Wonderwall', 'Hey There Delilah', 'Country Hits'],
      frequency: 65
    }
  ];

  // 1. 화성 진행 제안
  async suggestHarmonicProgressions(request: CompositionRequest): Promise<HarmonicProgression[]> {
    try {
      // 스타일과 난이도에 맞는 진행 패턴 필터링
      let filteredProgressions = this.commonProgressions.filter(p => 
        p.style.includes(request.style) && 
        p.difficulty === request.complexity
      );

      // 요청된 마디 수에 맞는 진행 패턴 선택
      filteredProgressions = filteredProgressions.filter(p => 
        p.pattern.length <= request.length
      );

      // 분위기에 따른 추가 필터링
      if (request.mood === 'happy') {
        filteredProgressions = filteredProgressions.filter(p => 
          p.pattern.includes('I') && p.pattern.includes('V')
        );
      } else if (request.mood === 'sad') {
        filteredProgressions = filteredProgressions.filter(p => 
          p.pattern.includes('vi') || p.pattern.includes('ii')
        );
      }

      // 빈도순으로 정렬하고 상위 5개 반환
      return filteredProgressions
        .sort((a, b) => b.frequency - a.frequency)
        .slice(0, 5);
    } catch (error) {
      console.error('화성 진행 제안 오류:', error);
      return this.commonProgressions.slice(0, 3); // 기본값 반환
    }
  }

  // 2. 멜로디 생성 제안
  async generateMelodySuggestions(
    progression: HarmonicProgression,
    key: string,
    style: string
  ): Promise<MelodySuggestion[]> {
    const suggestions: MelodySuggestion[] = [];

    // 스타일별 멜로디 패턴
    if (style === 'pop') {
      suggestions.push({
        notes: ['C', 'E', 'G', 'A', 'G', 'E', 'C'],
        rhythm: ['♩', '♩', '♩', '♩', '♩', '♩', '♩'],
        contour: 'wave',
        tension: 40,
        style: '팝 스타일 멜로디'
      });
    } else if (style === 'jazz') {
      suggestions.push({
        notes: ['C', 'D', 'E', 'F#', 'G', 'A', 'B', 'C'],
        rhythm: ['♩', '♪', '♪', '♩', '♪', '♪', '♪', '♩'],
        contour: 'ascending',
        tension: 70,
        style: '재즈 스타일 멜로디'
      });
    } else if (style === 'classical') {
      suggestions.push({
        notes: ['C', 'E', 'G', 'C', 'G', 'E', 'C'],
        rhythm: ['♩', '♩', '♩', '♩', '♩', '♩', '♩'],
        contour: 'stable',
        tension: 30,
        style: '클래식 스타일 멜로디'
      });
    }

    // 화성 진행에 맞는 추가 멜로디 제안
    if (progression.pattern.includes('V')) {
      suggestions.push({
        notes: ['G', 'B', 'D', 'C'],
        rhythm: ['♩', '♪', '♪', '♩'],
        contour: 'descending',
        tension: 60,
        style: '도미넌트 해결 멜로디'
      });
    }

    return suggestions;
  }

  // 3. 조성 전환 가이드
  async suggestModulations(
    currentKey: string,
    targetKey: string,
    style: string
  ): Promise<ModulationGuide[]> {
    const guides: ModulationGuide[] = [];

    // 상대조 전환 (가장 쉬운 방법)
    if (this.isRelativeKey(currentKey, targetKey)) {
      guides.push({
        fromKey: currentKey,
        toKey: targetKey,
        technique: 'pivot_chord',
        difficulty: 'BEGINNER',
        description: '상대조를 활용한 자연스러운 전환',
        example: `${currentKey}의 vi화음을 ${targetKey}의 i화음으로 활용`,
        commonUses: ['팝', '클래식', '민속음악']
      });
    }

    // 평행조 전환
    if (this.isParallelKey(currentKey, targetKey)) {
      guides.push({
        fromKey: currentKey,
        toKey: targetKey,
        technique: 'direct',
        difficulty: 'INTERMEDIATE',
        description: '평행조로의 직접적 전환',
        example: `${currentKey}에서 ${targetKey}로 직접 전환`,
        commonUses: ['클래식', '영화음악', '드라마틱한 효과']
      });
    }

    // 2도 위/아래 조성 전환
    if (this.isSecondDegreeModulation(currentKey, targetKey)) {
      guides.push({
        fromKey: currentKey,
        toKey: targetKey,
        technique: 'pivot_chord',
        difficulty: 'INTERMEDIATE',
        description: '2도 관계 조성으로의 전환',
        example: `${currentKey}의 V7화음을 ${targetKey}의 V7화음으로 활용`,
        commonUses: ['재즈', '클래식', '현대음악']
      });
    }

    // 5도 관계 조성 전환
    if (this.isFifthDegreeModulation(currentKey, targetKey)) {
      guides.push({
        fromKey: currentKey,
        toKey: targetKey,
        technique: 'pivot_chord',
        difficulty: 'ADVANCED',
        description: '5도 관계 조성으로의 전환',
        example: `${currentKey}의 ii-V-I 진행을 ${targetKey}의 V7-I 진행으로 활용`,
        commonUses: ['재즈', '클래식', '복잡한 화성 진행']
      });
    }

    return guides;
  }

  // 4. 전체 작곡 구조 제안
  async generateCompositionStructure(request: CompositionRequest): Promise<CompositionSuggestion> {
    try {
      // 화성 진행 제안
      const progressions = await this.suggestHarmonicProgressions(request);
      const selectedProgression = progressions[0]; // 가장 적합한 진행 선택

      // 멜로디 제안
      const melodies = await this.generateMelodySuggestions(
        selectedProgression,
        request.key,
        request.style
      );
      const selectedMelody = melodies[0];

      // 조성 전환 제안 (중급 이상인 경우)
      let modulation: ModulationGuide | undefined;
      if (request.complexity !== 'BEGINNER' && request.length > 8) {
        const modulationKey = this.suggestModulationKey(request.key, request.mood);
        const modulations = await this.suggestModulations(request.key, modulationKey, request.style);
        if (modulations.length > 0) {
          modulation = modulations[0];
        }
      }

      // 전체 구조 생성
      const structure = this.createOverallStructure(request, selectedProgression, modulation);

      return {
        progression: selectedProgression,
        melody: selectedMelody,
        modulation,
        overallStructure: structure,
        styleNotes: this.generateStyleNotes(request.style, selectedProgression),
        practiceTips: this.generatePracticeTips(request.complexity, selectedProgression)
      };
    } catch (error) {
      console.error('작곡 구조 생성 오류:', error);
      throw error;
    }
  }

  // 5. 실시간 작곡 도움말
  async getRealTimeCompositionHelp(
    currentChord: string,
    nextChord: string,
    style: string
  ): Promise<{
    suggestion: string;
    alternatives: string[];
    theory: string;
    examples: string[];
  }> {
    // 현재 화성에서 다음 화성으로의 진행 제안
    const suggestions = this.getChordProgressionSuggestions(currentChord, nextChord, style);
    
    return {
      suggestion: suggestions.primary,
      alternatives: suggestions.alternatives,
      theory: suggestions.theory,
      examples: suggestions.examples
    };
  }

  // 6. 작곡 스타일 분석
  async analyzeCompositionStyle(progression: string[]): Promise<{
    style: string;
    confidence: number;
    characteristics: string[];
    similarArtists: string[];
    era: string;
  }> {
    // 진행 패턴을 분석하여 스타일 분류
    const analysis = this.classifyProgressionStyle(progression);
    
    return {
      style: analysis.style,
      confidence: analysis.confidence,
      characteristics: analysis.characteristics,
      similarArtists: analysis.similarArtists,
      era: analysis.era
    };
  }

  // Private helper methods
  private isRelativeKey(key1: string, key2: string): boolean {
    // 상대조 관계 확인 (예: C major와 A minor)
    const relativeKeys: { [key: string]: string } = {
      'C': 'Am', 'G': 'Em', 'D': 'Bm', 'A': 'F#m',
      'E': 'C#m', 'B': 'G#m', 'F#': 'D#m', 'C#': 'A#m',
      'F': 'Dm', 'Bb': 'Gm', 'Eb': 'Cm', 'Ab': 'Fm'
    };
    
    return relativeKeys[key1] === key2 || relativeKeys[key2] === key1;
  }

  private isParallelKey(key1: string, key2: string): boolean {
    // 평행조 관계 확인 (예: C major와 C minor)
    const base1 = key1.replace(/[#b]/, '');
    const base2 = key2.replace(/[#b]/, '');
    return base1 === base2 && key1 !== key2;
  }

  private isSecondDegreeModulation(key1: string, key2: string): boolean {
    // 2도 관계 조성 확인
    const keys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const index1 = keys.indexOf(key1.replace(/[#b]/, ''));
    const index2 = keys.indexOf(key2.replace(/[#b]/, ''));
    
    if (index1 === -1 || index2 === -1) return false;
    
    const diff = Math.abs(index2 - index1);
    return diff === 1 || diff === 6; // 2도 위/아래
  }

  private isFifthDegreeModulation(key1: string, key2: string): boolean {
    // 5도 관계 조성 확인
    const keys = ['C', 'G', 'D', 'A', 'E', 'B', 'F#'];
    const index1 = keys.indexOf(key1.replace(/[#b]/, ''));
    const index2 = keys.indexOf(key2.replace(/[#b]/, ''));
    
    if (index1 === -1 || index2 === -1) return false;
    
    const diff = Math.abs(index2 - index1);
    return diff === 1 || diff === 6; // 5도 위/아래
  }

  private suggestModulationKey(currentKey: string, mood: string): string {
    // 분위기에 따른 조성 전환 제안
    if (mood === 'happy') {
      return this.getRelativeMajor(currentKey);
    } else if (mood === 'sad') {
      return this.getRelativeMinor(currentKey);
    } else if (mood === 'energetic') {
      return this.getFifthAbove(currentKey);
    } else {
      return this.getRelativeMinor(currentKey);
    }
  }

  private getRelativeMajor(key: string): string {
    const relativeMajors: { [key: string]: string } = {
      'Am': 'C', 'Em': 'G', 'Bm': 'D', 'F#m': 'A',
      'C#m': 'E', 'G#m': 'B', 'D#m': 'F#', 'A#m': 'C#'
    };
    return relativeMajors[key] || 'C';
  }

  private getRelativeMinor(key: string): string {
    const relativeMinors: { [key: string]: string } = {
      'C': 'Am', 'G': 'Em', 'D': 'Bm', 'A': 'F#m',
      'E': 'C#m', 'B': 'G#m', 'F#': 'D#m', 'C#': 'A#m'
    };
    return relativeMinors[key] || 'Am';
  }

  private getFifthAbove(key: string): string {
    const fifths: { [key: string]: string } = {
      'C': 'G', 'G': 'D', 'D': 'A', 'A': 'E',
      'E': 'B', 'B': 'F#', 'F#': 'C#', 'C#': 'G#'
    };
    return fifths[key] || 'G';
  }

  private createOverallStructure(
    request: CompositionRequest,
    progression: HarmonicProgression,
    modulation?: ModulationGuide
  ): string[] {
    const structure: string[] = [];
    
    if (request.length <= 8) {
      // 단순한 구조
      structure.push('Intro (1-2마디)');
      structure.push('Verse (3-6마디)');
      structure.push('Outro (7-8마디)');
    } else if (request.length <= 16) {
      // 확장된 구조
      structure.push('Intro (1-2마디)');
      structure.push('Verse (3-6마디)');
      if (modulation) {
        structure.push('Bridge/Modulation (7-10마디)');
        structure.push('Verse 2 (11-14마디)');
      } else {
        structure.push('Chorus (7-10마디)');
        structure.push('Verse 2 (11-14마디)');
      }
      structure.push('Outro (15-16마디)');
    } else {
      // 복잡한 구조
      structure.push('Intro (1-4마디)');
      structure.push('Verse 1 (5-12마디)');
      structure.push('Chorus (13-20마디)');
      if (modulation) {
        structure.push('Bridge/Modulation (21-28마디)');
        structure.push('Verse 2 (29-36마디)');
      } else {
        structure.push('Bridge (21-28마디)');
        structure.push('Verse 2 (29-36마디)');
      }
      structure.push('Final Chorus (37-44마디)');
      structure.push('Outro (45-48마디)');
    }
    
    return structure;
  }

  private generateStyleNotes(style: string, progression: HarmonicProgression): string[] {
    const notes: string[] = [];
    
    if (style === 'pop') {
      notes.push('강한 비트와 명확한 화성 진행을 활용하세요');
      notes.push('후크 멜로디를 1-2마디에 배치하세요');
      notes.push('간단하고 기억하기 쉬운 리듬을 사용하세요');
    } else if (style === 'jazz') {
      notes.push('7화음과 9화음을 적극 활용하세요');
      notes.push('스윙 리듬과 즉흥적 요소를 포함하세요');
      notes.push('복잡한 화성 진행과 모달 믹스처를 시도하세요');
    } else if (style === 'classical') {
      notes.push('균형잡힌 구조와 논리적 화성 진행을 추구하세요');
      notes.push('다양한 다이나믹과 아티큘레이션을 활용하세요');
      notes.push('주제와 변주를 통한 발전을 고려하세요');
    }
    
    return notes;
  }

  private generatePracticeTips(complexity: string, progression: HarmonicProgression): string[] {
    const tips: string[] = [];
    
    if (complexity === 'BEGINNER') {
      tips.push('메트로놈과 함께 천천히 연습하세요');
      tips.push('각 화성을 개별적으로 연주해보세요');
      tips.push('기본 3화음부터 시작하여 점진적으로 확장하세요');
    } else if (complexity === 'INTERMEDIATE') {
      tips.push('다양한 리듬 패턴으로 연습해보세요');
      tips.push('7화음과 확장 화성을 연습하세요');
      tips.push('조성 전환을 연습해보세요');
    } else {
      tips.push('복잡한 화성 진행을 다양한 템포로 연습하세요');
      tips.push('모달 믹스처와 2차 지배화음을 활용하세요');
      tips.push('자유로운 즉흥 연주를 시도해보세요');
    }
    
    return tips;
  }

  private getChordProgressionSuggestions(
    currentChord: string,
    nextChord: string,
    style: string
  ): {
    primary: string;
    alternatives: string[];
    theory: string;
    examples: string[];
  } {
    // 기본적인 화성 진행 제안
    const suggestions: { [key: string]: string[] } = {
      'I': ['V', 'vi', 'IV', 'ii'],
      'V': ['I', 'vi', 'IV'],
      'vi': ['IV', 'V', 'ii'],
      'IV': ['V', 'I', 'vi'],
      'ii': ['V', 'vi', 'I']
    };
    
    const alternatives = suggestions[currentChord] || ['I', 'V'];
    const primary = alternatives[0];
    
    return {
      primary: `${currentChord} → ${primary}`,
      alternatives: alternatives.map(alt => `${currentChord} → ${alt}`),
      theory: `${currentChord}에서 ${primary}로의 진행은 ${this.getProgressionTheory(currentChord, primary)}`,
      examples: this.getProgressionExamples(currentChord, primary, style)
    };
  }

  private getProgressionTheory(from: string, to: string): string {
    const theories: { [key: string]: string } = {
      'I-V': '토닉에서 도미넌트로의 강력한 진행',
      'V-I': '도미넌트에서 토닉으로의 완벽한 해결',
      'I-vi': '토닉에서 상대단조로의 부드러운 전환',
      'vi-IV': '상대단조에서 서브도미넌트로의 자연스러운 진행'
    };
    
    return theories[`${from}-${to}`] || '일반적인 화성 진행';
  }

  private getProgressionExamples(from: string, to: string, style: string): string[] {
    // 스타일별 예시 곡들
    const examples: { [key: string]: string[] } = {
      'I-V': ['Twinkle Twinkle Little Star', 'Happy Birthday', 'Mary Had a Little Lamb'],
      'V-I': ['Jingle Bells', 'Ode to Joy', 'Für Elise'],
      'I-vi': ['Perfect', 'Someone Like You', 'Hallelujah'],
      'vi-IV': ['Wonderwall', 'Hey There Delilah', 'Let It Be']
    };
    
    return examples[`${from}-${to}`] || ['Classic Examples'];
  }

  private classifyProgressionStyle(progression: string[]): {
    style: string;
    confidence: number;
    characteristics: string[];
    similarArtists: string[];
    era: string;
  } {
    // 진행 패턴을 분석하여 스타일 분류
    let style = 'Unknown';
    let confidence = 0;
    let characteristics: string[] = [];
    let similarArtists: string[] = [];
    let era = 'Unknown';
    
    // 팝 스타일 특징
    if (progression.includes('I') && progression.includes('V') && progression.includes('vi')) {
      style = 'Pop';
      confidence = 85;
      characteristics = ['강한 비트', '명확한 화성', '기억하기 쉬운 멜로디'];
      similarArtists = ['The Beatles', 'Queen', 'Coldplay'];
      era = '1960s-Present';
    }
    // 재즈 스타일 특징
    else if (progression.includes('ii7') && progression.includes('V7')) {
      style = 'Jazz';
      confidence = 90;
      characteristics = ['7화음 활용', '복잡한 진행', '즉흥적 요소'];
      similarArtists = ['Miles Davis', 'John Coltrane', 'Herbie Hancock'];
      era = '1940s-Present';
    }
    // 클래식 스타일 특징
    else if (progression.length > 6 && progression.includes('I') && progression.includes('V')) {
      style = 'Classical';
      confidence = 80;
      characteristics = ['균형잡힌 구조', '논리적 진행', '다양한 다이나믹'];
      similarArtists = ['Beethoven', 'Mozart', 'Bach'];
      era = '1700s-1900s';
    }
    
    return { style, confidence, characteristics, similarArtists, era };
  }
}

export const compositionAssistantService = new CompositionAssistantService();
