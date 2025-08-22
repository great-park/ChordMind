import { GRADIENTS, COLORS } from '../constants/styles';

// 음악 이론 학습 관련 타입 정의
export interface TheoryLesson {
  id: string;
  title: string;
  category: 'harmony' | 'progression' | 'modulation' | 'mixture' | 'advanced';
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  duration: number; // 분 단위
  description: string;
  content: TheoryContent[];
  exercises: TheoryExercise[];
  prerequisites: string[];
  tags: string[];
}

export interface TheoryContent {
  type: 'text' | 'image' | 'audio' | 'interactive';
  title: string;
  content: string;
  examples?: string[];
  notes?: string[];
}

export interface TheoryExercise {
  id: string;
  type: 'multiple_choice' | 'fill_blank' | 'matching' | 'progression_analysis';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  points: number;
}

export interface ProgressionPattern {
  id: string;
  name: string;
  pattern: string[];
  romanNumerals: string[];
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  category: string[];
  description: string;
  examples: string[];
  analysis: string;
  practiceTips: string[];
}

export interface ModalMixture {
  id: string;
  name: string;
  description: string;
  technique: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  examples: string[];
  usage: string[];
  practiceExercises: string[];
}

export interface LearningProgress {
  userId: string;
  completedLessons: string[];
  currentLesson?: string;
  quizScores: { [lessonId: string]: number };
  practiceTime: number;
  masteryLevel: 'NOVICE' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  lastStudied: Date;
}

class MusicTheoryService {
  private readonly baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  // When-in-Rome에서 추출한 체계적인 음악 이론 커리큘럼
  private readonly theoryCurriculum: TheoryLesson[] = [
    {
      id: 'harmony-basics',
      title: '화성학 기초',
      category: 'harmony',
      difficulty: 'BEGINNER',
      duration: 30,
      description: '화성의 기본 개념과 3화음, 7화음의 구성',
      content: [
        {
          type: 'text',
          title: '화성이란?',
          content: '화성은 여러 음이 동시에 울릴 때 만들어지는 음향의 조합입니다. 기본적으로 3화음(triad)과 7화음(seventh chord)으로 구성됩니다.',
          examples: ['C major triad: C-E-G', 'Cm7: C-Eb-G-Bb'],
          notes: ['3화음은 3개의 음으로 구성', '7화음은 4개의 음으로 구성']
        },
        {
          type: 'text',
          title: '화성의 종류',
          content: '화성은 크게 major, minor, diminished, augmented로 분류됩니다. 각각 고유한 음향적 특성을 가지고 있습니다.',
          examples: ['Major: 밝고 명확한 느낌', 'Minor: 부드럽고 우울한 느낌'],
          notes: ['Major 3rd는 4반음', 'Minor 3rd는 3반음']
        }
      ],
      exercises: [
        {
          id: 'ex1',
          type: 'multiple_choice',
          question: 'C major 3화음의 구성음은?',
          options: ['C-D-E', 'C-E-G', 'C-F-G', 'C-E-A'],
          correctAnswer: 'C-E-G',
          explanation: 'C major 3화음은 C(루트), E(3음), G(5음)으로 구성됩니다.',
          difficulty: 'BEGINNER',
          points: 10
        }
      ],
      prerequisites: [],
      tags: ['화성', '3화음', '기초']
    },
    {
      id: 'progression-fundamentals',
      title: '화성 진행의 기초',
      category: 'progression',
      difficulty: 'BEGINNER',
      duration: 45,
      description: '기본적인 화성 진행 패턴과 그 원리',
      content: [
        {
          type: 'text',
          title: '화성 진행이란?',
          content: '화성 진행은 시간의 흐름에 따라 화성이 변화하는 것을 의미합니다. 음악의 긴장과 이완을 만들어냅니다.',
          examples: ['I-V-I: 토닉-도미넌트-토닉', 'ii-V-I: 서브도미넌트-도미넌트-토닉'],
          notes: ['I은 안정감', 'V은 긴장감', 'ii는 중간적 성격']
        },
        {
          type: 'text',
          title: '기본 진행 패턴',
          content: '가장 기본적인 화성 진행은 I-V-I입니다. 이는 토닉에서 시작하여 도미넌트로 긴장을 만들고 다시 토닉으로 돌아와 해결하는 구조입니다.',
          examples: ['Twinkle Twinkle Little Star', 'Happy Birthday'],
          notes: ['I-V-I는 가장 안정적인 진행', 'V-I는 완벽한 해결']
        }
      ],
      exercises: [
        {
          id: 'ex2',
          type: 'fill_blank',
          question: 'C major에서 I-V-I 진행은 __-__-__ 입니다.',
          correctAnswer: 'C-G-C',
          explanation: 'C major에서 I은 C, V는 G입니다.',
          difficulty: 'BEGINNER',
          points: 15
        }
      ],
      prerequisites: ['harmony-basics'],
      tags: ['화성진행', 'I-V-I', '기본패턴']
    },
    {
      id: 'jazz-progressions',
      title: '재즈 화성 진행',
      category: 'progression',
      difficulty: 'INTERMEDIATE',
      duration: 60,
      description: '재즈의 핵심인 2-5-1 진행과 7화음 활용',
      content: [
        {
          type: 'text',
          title: '2-5-1 진행',
          content: '2-5-1 진행은 재즈의 가장 기본적인 화성 진행입니다. ii7-V7-Imaj7의 구조로, 각 화성에 7화음을 추가하여 풍부한 음향을 만듭니다.',
          examples: ['Autumn Leaves', 'Take Five', 'All The Things Are'],
          notes: ['ii7은 서브도미넌트 7화음', 'V7은 도미넌트 7화음', 'Imaj7은 토닉 메이저 7화음']
        },
        {
          type: 'text',
          title: '7화음의 활용',
          content: '7화음은 3화음에 7음을 추가한 것으로, 더욱 풍부하고 복잡한 음향을 제공합니다. 재즈에서는 거의 모든 화성에 7화음을 사용합니다.',
          examples: ['Cmaj7: C-E-G-B', 'Dm7: D-F-A-C', 'G7: G-B-D-F'],
          notes: ['Major 7th는 11반음', 'Minor 7th는 10반음', 'Dominant 7th는 10반음']
        }
      ],
      exercises: [
        {
          id: 'ex3',
          type: 'matching',
          question: '다음 7화음들을 올바른 이름과 연결하세요',
          options: ['Cmaj7', 'Dm7', 'G7'],
          correctAnswer: ['Cmaj7', 'Dm7', 'G7'],
          explanation: '각 7화음의 구성과 이름을 정확히 파악해야 합니다.',
          difficulty: 'INTERMEDIATE',
          points: 20
        }
      ],
      prerequisites: ['harmony-basics', 'progression-fundamentals'],
      tags: ['재즈', '2-5-1', '7화음']
    },
    {
      id: 'modal-mixture',
      title: '모달 믹스처',
      category: 'mixture',
      difficulty: 'ADVANCED',
      duration: 75,
      description: '장조와 단조의 혼합을 통한 색채적 화성',
      content: [
        {
          type: 'text',
          title: '모달 믹스처란?',
          content: '모달 믹스처는 장조에 단조의 요소를, 단조에 장조의 요소를 혼합하여 더욱 풍부하고 색채적인 화성을 만드는 기법입니다.',
          examples: ['Sweet Child O\' Mine', 'Nothing Else Matters', 'Epic Rock'],
          notes: ['bVI, bVII 화성 사용', '자연단음계 활용', '드라마틱한 효과']
        },
        {
          type: 'text',
          title: '일반적인 모달 믹스처',
          content: '가장 일반적인 모달 믹스처는 bVI-bVII-I 진행입니다. 이는 자연단음계의 6도와 7도를 장조에 도입하여 강력하고 에픽한 느낌을 만듭니다.',
          examples: ['I-bVI-bVII-I', 'vi-bVI-bVII-vi'],
          notes: ['bVI은 평행단조의 6도', 'bVII은 평행단조의 7도', '강력한 종지 효과']
        }
      ],
      exercises: [
        {
          id: 'ex4',
          type: 'progression_analysis',
          question: 'C major에서 I-bVI-bVII-I 진행을 분석하세요',
          correctAnswer: 'C-Ab-Bb-C',
          explanation: 'C major에서 bVI은 Ab, bVII은 Bb입니다.',
          difficulty: 'ADVANCED',
          points: 25
        }
      ],
      prerequisites: ['harmony-basics', 'progression-fundamentals', 'jazz-progressions'],
      tags: ['모달믹스처', 'bVI-bVII', '고급화성']
    }
  ];

  // 진행 패턴 데이터베이스
  private readonly progressionPatterns: ProgressionPattern[] = [
    {
      id: 'pop-basic',
      name: '팝 기본 진행',
      pattern: ['I', 'V', 'vi', 'IV'],
      romanNumerals: ['I', 'V', 'vi', 'IV'],
      difficulty: 'BEGINNER',
      category: ['pop', 'rock', 'folk'],
      description: '팝 음악의 가장 기본적인 4화음 진행으로, 기억하기 쉽고 감정적입니다.',
      examples: ['Let It Be', 'With or Without You', 'Don\'t Stop Believin\''],
      analysis: 'I에서 시작하여 V로 긴장을 만들고, vi로 부드럽게 전환한 후 IV로 중간적 긴장을 만들어 마무리합니다.',
      practiceTips: [
        '각 화성을 개별적으로 연주해보세요',
        '메트로놈과 함께 천천히 연습하세요',
        '다양한 리듬으로 연주해보세요'
      ]
    },
    {
      id: 'jazz-ii-v-i',
      name: '재즈 2-5-1',
      pattern: ['ii', 'V', 'I'],
      romanNumerals: ['ii7', 'V7', 'Imaj7'],
      difficulty: 'INTERMEDIATE',
      category: ['jazz', 'bebop', 'standards'],
      description: '재즈의 핵심 진행으로, 각 화음에 7화음을 추가하여 풍부한 음향을 만듭니다.',
      examples: ['Autumn Leaves', 'Take Five', 'All The Things Are'],
      analysis: 'ii7에서 시작하여 V7로 긴장을 만들고, Imaj7로 완벽하게 해결합니다.',
      practiceTips: [
        '7화음의 구성음을 정확히 파악하세요',
        '스윙 리듬으로 연주해보세요',
        '즉흥 연주를 시도해보세요'
      ]
    },
    {
      id: 'classical-extended',
      name: '클래식 확장 진행',
      pattern: ['I', 'V', 'vi', 'iii', 'IV', 'I', 'V'],
      romanNumerals: ['I', 'V', 'vi', 'iii', 'IV', 'I', 'V'],
      difficulty: 'INTERMEDIATE',
      category: ['classical', 'film', 'epic'],
      description: '클래식 음악에서 자주 사용되는 확장된 진행으로, 복잡하고 논리적인 구조를 가집니다.',
      examples: ['Beethoven Sonatas', 'Film Soundtracks', 'Epic Music'],
      analysis: 'I-V-vi-iii-IV-I-V의 구조로, 각 화성의 역할과 진행의 논리를 이해하는 것이 중요합니다.',
      practiceTips: [
        '전체 진행을 작은 단위로 나누어 연습하세요',
        '각 화성의 기능을 분석해보세요',
        '다양한 다이나믹으로 연주해보세요'
      ]
    },
    {
      id: 'rock-modal',
      name: '락 모달 믹스처',
      pattern: ['I', 'bVI', 'bVII', 'I'],
      romanNumerals: ['I', 'bVI', 'bVII', 'I'],
      difficulty: 'ADVANCED',
      category: ['rock', 'metal', 'epic'],
      description: '모달 믹스처를 활용한 강력하고 에픽한 진행으로, 드라마틱한 효과를 만듭니다.',
      examples: ['Sweet Child O\' Mine', 'Nothing Else Matters', 'Epic Rock'],
      analysis: 'I에서 시작하여 bVI-bVII로 강력한 중간부를 만들고, 다시 I로 돌아와 완벽하게 마무리합니다.',
      practiceTips: [
        'bVI, bVII 화성의 구성음을 정확히 파악하세요',
        '강한 비트와 함께 연주해보세요',
        '다양한 템포로 연습해보세요'
      ]
    }
  ];

  // 모달 믹스처 가이드
  private readonly modalMixtures: ModalMixture[] = [
    {
      id: 'natural-minor-borrowing',
      name: '자연단음계 차용',
      description: '장조에 자연단음계의 화성을 도입하여 색채적 변화를 만드는 기법',
      technique: '장조의 6도와 7도를 자연단음계의 6도(b6)와 7도(b7)로 대체',
      difficulty: 'INTERMEDIATE',
      examples: ['I-bVI-bVII-I', 'vi-bVI-bVII-vi'],
      usage: ['락 음악', '영화 음악', '드라마틱한 효과'],
      practiceExercises: [
        'C major에서 bVI(bVI)와 bVII(Bb) 화성 연습',
        'I-bVI-bVII-I 진행을 다양한 템포로 연습',
        'bVI-bVII 진행을 다른 조성에서 연습'
      ]
    },
    {
      id: 'parallel-key-switching',
      name: '평행조 전환',
      description: '장조와 단조 사이를 자유롭게 전환하여 대비 효과를 만드는 기법',
      technique: '같은 루트의 장조와 단조를 전환하여 색채적 변화를 만듦',
      difficulty: 'ADVANCED',
      examples: ['C major → C minor', 'G major → G minor'],
      usage: ['클래식 음악', '영화 음악', '감정적 전환'],
      practiceExercises: [
        'C major와 C minor 사이의 전환 연습',
        '평행조 전환을 포함한 진행 패턴 연습',
        '전환 시 자연스러운 연결 연습'
      ]
    },
    {
      id: 'chromatic-approach',
      name: '반음계적 접근',
      description: '반음계적 음을 사용하여 화성에 색채를 더하는 기법',
      technique: '화성의 구성음에 반음계적 음을 추가하여 풍부한 음향을 만듦',
      difficulty: 'ADVANCED',
      examples: ['7화음에 9음, 11음, 13음 추가', '반음계적 패싱 톤 사용'],
      usage: ['재즈', '현대 음악', '복잡한 화성'],
      practiceExercises: [
        '7화음에 9음, 11음, 13음 추가 연습',
        '반음계적 패싱 톤을 포함한 멜로디 연습',
        '확장 화성을 포함한 진행 패턴 연습'
      ]
    }
  ];

  // 1. 전체 커리큘럼 조회
  async getTheoryCurriculum(): Promise<TheoryLesson[]> {
    try {
      // 실제로는 API 호출
      return this.theoryCurriculum;
    } catch (error) {
      console.error('이론 커리큘럼 조회 오류:', error);
      return this.theoryCurriculum;
    }
  }

  // 2. 특정 레슨 조회
  async getTheoryLesson(lessonId: string): Promise<TheoryLesson | null> {
    try {
      const lesson = this.theoryCurriculum.find(l => l.id === lessonId);
      return lesson || null;
    } catch (error) {
      console.error('레슨 조회 오류:', error);
      return null;
    }
  }

  // 3. 난이도별 레슨 조회
  async getLessonsByDifficulty(difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'): Promise<TheoryLesson[]> {
    try {
      return this.theoryCurriculum.filter(l => l.difficulty === difficulty);
    } catch (error) {
      console.error('난이도별 레슨 조회 오류:', error);
      return [];
    }
  }

  // 4. 카테고리별 레슨 조회
  async getLessonsByCategory(category: string): Promise<TheoryLesson[]> {
    try {
      return this.theoryCurriculum.filter(l => l.category === category);
    } catch (error) {
      console.error('카테고리별 레슨 조회 오류:', error);
      return [];
    }
  }

  // 5. 진행 패턴 조회
  async getProgressionPatterns(): Promise<ProgressionPattern[]> {
    try {
      return this.progressionPatterns;
    } catch (error) {
      console.error('진행 패턴 조회 오류:', error);
      return this.progressionPatterns;
    }
  }

  // 6. 특정 진행 패턴 조회
  async getProgressionPattern(patternId: string): Promise<ProgressionPattern | null> {
    try {
      const pattern = this.progressionPatterns.find(p => p.id === patternId);
      return pattern || null;
    } catch (error) {
      console.error('진행 패턴 조회 오류:', error);
      return null;
    }
  }

  // 7. 모달 믹스처 가이드 조회
  async getModalMixtures(): Promise<ModalMixture[]> {
    try {
      return this.modalMixtures;
    } catch (error) {
      console.error('모달 믹스처 조회 오류:', error);
      return this.modalMixtures;
    }
  }

  // 8. 특정 모달 믹스처 조회
  async getModalMixture(mixtureId: string): Promise<ModalMixture | null> {
    try {
      const mixture = this.modalMixtures.find(m => m.id === mixtureId);
      return mixture || null;
    } catch (error) {
      console.error('모달 믹스처 조회 오류:', error);
      return null;
    }
  }

  // 9. 학습 진도 조회
  async getLearningProgress(userId: string): Promise<LearningProgress | null> {
    try {
      // 실제로는 API 호출하여 사용자별 학습 진도 조회
      const mockProgress: LearningProgress = {
        userId,
        completedLessons: ['harmony-basics'],
        currentLesson: 'progression-fundamentals',
        quizScores: { 'harmony-basics': 85 },
        practiceTime: 120,
        masteryLevel: 'BEGINNER',
        lastStudied: new Date()
      };
      return mockProgress;
    } catch (error) {
      console.error('학습 진도 조회 오류:', error);
      return null;
    }
  }

  // 10. 퀴즈 점수 업데이트
  async updateQuizScore(userId: string, lessonId: string, score: number): Promise<boolean> {
    try {
      // 실제로는 API 호출하여 점수 업데이트
      console.log(`사용자 ${userId}의 ${lessonId} 레슨 점수: ${score}`);
      return true;
    } catch (error) {
      console.error('퀴즈 점수 업데이트 오류:', error);
      return false;
    }
  }

  // 11. 레슨 완료 표시
  async markLessonCompleted(userId: string, lessonId: string): Promise<boolean> {
    try {
      // 실제로는 API 호출하여 레슨 완료 표시
      console.log(`사용자 ${userId}가 ${lessonId} 레슨을 완료했습니다.`);
      return true;
    } catch (error) {
      console.error('레슨 완료 표시 오류:', error);
      return false;
    }
  }

  // 12. 개인 맞춤 추천
  async getPersonalizedRecommendations(userId: string): Promise<TheoryLesson[]> {
    try {
      const progress = await this.getLearningProgress(userId);
      if (!progress) return this.theoryCurriculum.slice(0, 3);

      // 완료하지 않은 레슨 중 난이도에 맞는 것 추천
      const completedIds = new Set(progress.completedLessons);
      const availableLessons = this.theoryCurriculum.filter(l => !completedIds.has(l.id));

      // 현재 마스터리 레벨에 맞는 레슨 우선 추천
      const levelOrder = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
      const currentLevelIndex = levelOrder.indexOf(progress.masteryLevel);
      
      const recommended = availableLessons.sort((a, b) => {
        const aLevel = levelOrder.indexOf(a.difficulty);
        const bLevel = levelOrder.indexOf(b.difficulty);
        
        // 현재 레벨에 가까운 것 우선
        if (Math.abs(aLevel - currentLevelIndex) < Math.abs(bLevel - currentLevelIndex)) return -1;
        if (Math.abs(aLevel - currentLevelIndex) > Math.abs(bLevel - currentLevelIndex)) return 1;
        
        // 같은 레벨이면 선행 조건이 충족된 것 우선
        const aPrereqMet = a.prerequisites.every(p => completedIds.has(p));
        const bPrereqMet = b.prerequisites.every(p => completedIds.has(p));
        
        if (aPrereqMet && !bPrereqMet) return -1;
        if (!aPrereqMet && bPrereqMet) return 1;
        
        return 0;
      });

      return recommended.slice(0, 5);
    } catch (error) {
      console.error('개인 맞춤 추천 오류:', error);
      return this.theoryCurriculum.slice(0, 3);
    }
  }

  // 13. 실시간 학습 도움말
  async getRealTimeHelp(
    currentTopic: string,
    userLevel: string
  ): Promise<{
    explanation: string;
    examples: string[];
    relatedTopics: string[];
    practiceSuggestions: string[];
  }> {
    try {
      // 현재 주제에 대한 실시간 도움말 제공
      const helpData = this.generateHelpData(currentTopic, userLevel);
      return helpData;
    } catch (error) {
      console.error('실시간 도움말 생성 오류:', error);
      return {
        explanation: '도움말을 생성할 수 없습니다.',
        examples: [],
        relatedTopics: [],
        practiceSuggestions: []
      };
    }
  }

  // 14. 학습 진도 분석
  async analyzeLearningProgress(userId: string): Promise<{
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    estimatedCompletionTime: number; // 일 단위
  }> {
    try {
      const progress = await this.getLearningProgress(userId);
      if (!progress) {
        return {
          strengths: [],
          weaknesses: ['기본 화성학 지식'],
          recommendations: ['화성학 기초부터 시작하세요'],
          estimatedCompletionTime: 30
        };
      }

      // 강점과 약점 분석
      const strengths: string[] = [];
      const weaknesses: string[] = [];
      const recommendations: string[] = [];

      // 완료된 레슨 기반 강점 분석
      if (progress.completedLessons.includes('harmony-basics')) {
        strengths.push('기본 화성학 이해');
      }
      if (progress.completedLessons.includes('progression-fundamentals')) {
        strengths.push('기본 화성 진행 패턴');
      }

      // 현재 레벨 기반 약점 분석
      if (progress.masteryLevel === 'BEGINNER') {
        weaknesses.push('고급 화성 기법');
        weaknesses.push('복잡한 진행 패턴');
        recommendations.push('기본 패턴을 충분히 연습한 후 중급으로 진행하세요');
      } else if (progress.masteryLevel === 'INTERMEDIATE') {
        weaknesses.push('모달 믹스처');
        weaknesses.push('조성 전환');
        recommendations.push('모달 믹스처와 조성 전환을 연습해보세요');
      }

      // 예상 완료 시간 계산
      const remainingLessons = this.theoryCurriculum.length - progress.completedLessons.length;
      const estimatedCompletionTime = Math.ceil(remainingLessons * 0.5); // 레슨당 평균 0.5일

      return {
        strengths,
        weaknesses,
        recommendations,
        estimatedCompletionTime
      };
    } catch (error) {
      console.error('학습 진도 분석 오류:', error);
      return {
        strengths: [],
        weaknesses: ['분석할 수 없음'],
        recommendations: ['기본 과정부터 시작하세요'],
        estimatedCompletionTime: 30
      };
    }
  }

  // 15. 연습 문제 생성
  async generatePracticeExercises(
    lessonId: string,
    difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  ): Promise<TheoryExercise[]> {
    try {
      const lesson = await this.getTheoryLesson(lessonId);
      if (!lesson) return [];

      // 레슨의 기본 연습 문제
      let exercises = [...lesson.exercises];

      // 난이도에 맞는 추가 연습 문제 생성
      if (difficulty === 'INTERMEDIATE') {
        exercises.push(...this.generateIntermediateExercises(lesson));
      } else if (difficulty === 'ADVANCED') {
        exercises.push(...this.generateAdvancedExercises(lesson));
      }

      return exercises;
    } catch (error) {
      console.error('연습 문제 생성 오류:', error);
      return [];
    }
  }

  // Private helper methods
  private generateHelpData(
    topic: string,
    userLevel: string
  ): {
    explanation: string;
    examples: string[];
    relatedTopics: string[];
    practiceSuggestions: string[];
  } {
    // 주제별 도움말 데이터 생성
    const helpData: { [key: string]: any } = {
      '화성': {
        explanation: '화성은 여러 음이 동시에 울릴 때 만들어지는 음향의 조합입니다.',
        examples: ['3화음: C-E-G', '7화음: C-E-G-B'],
        relatedTopics: ['화성 진행', '화성 분석'],
        practiceSuggestions: ['기본 3화음부터 연습', '7화음 구성음 파악']
      },
      '화성 진행': {
        explanation: '화성 진행은 시간의 흐름에 따라 화성이 변화하는 것을 의미합니다.',
        examples: ['I-V-I', 'ii-V-I', 'I-vi-IV-V'],
        relatedTopics: ['화성', '진행 패턴'],
        practiceSuggestions: ['기본 패턴 반복 연습', '메트로놈과 함께 연습']
      },
      '모달 믹스처': {
        explanation: '모달 믹스처는 장조와 단조의 요소를 혼합하여 색채적 화성을 만드는 기법입니다.',
        examples: ['I-bVI-bVII-I', 'vi-bVI-bVII-vi'],
        relatedTopics: ['화성', '조성 전환'],
        practiceSuggestions: ['bVI, bVII 화성 연습', '자연단음계 활용']
      }
    };

    return helpData[topic] || {
      explanation: '해당 주제에 대한 도움말을 찾을 수 없습니다.',
      examples: [],
      relatedTopics: [],
      practiceSuggestions: []
    };
  }

  private generateIntermediateExercises(lesson: TheoryLesson): TheoryExercise[] {
    // 중급 수준의 추가 연습 문제 생성
    const exercises: TheoryExercise[] = [];

    if (lesson.id === 'harmony-basics') {
      exercises.push({
        id: 'ex-intermediate-1',
        type: 'multiple_choice',
        question: 'Cm7의 구성음은?',
        options: ['C-Eb-G-Bb', 'C-E-G-B', 'C-Eb-G-B', 'C-E-G-Bb'],
        correctAnswer: 'C-Eb-G-Bb',
        explanation: 'Cm7은 C minor 7화음으로, C(루트), Eb(minor 3rd), G(5th), Bb(minor 7th)로 구성됩니다.',
        difficulty: 'INTERMEDIATE',
        points: 15
      });
    }

    return exercises;
  }

  private generateAdvancedExercises(lesson: TheoryLesson): TheoryExercise[] {
    // 고급 수준의 추가 연습 문제 생성
    const exercises: TheoryExercise[] = [];

    if (lesson.id === 'modal-mixture') {
      exercises.push({
        id: 'ex-advanced-1',
        type: 'progression_analysis',
        question: 'C major에서 I-bVI-bVII-I 진행을 분석하고, 이 진행의 화성학적 의미를 설명하세요.',
        correctAnswer: 'C-Ab-Bb-C',
        explanation: '이 진행은 모달 믹스처의 전형적인 예시로, 자연단음계의 6도와 7도를 장조에 도입하여 드라마틱한 효과를 만듭니다.',
        difficulty: 'ADVANCED',
        points: 30
      });
    }

    return exercises;
  }
}

export const musicTheoryService = new MusicTheoryService();
