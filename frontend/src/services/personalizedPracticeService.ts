import { GRADIENTS, COLORS } from '../constants/styles';

// 개인 맞춤 연습 계획 관련 타입 정의
export interface PracticeDiagnosis {
  userId: string;
  skillLevel: 'NOVICE' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  strengths: SkillStrength[];
  weaknesses: SkillWeakness[];
  recommendations: PracticeRecommendation[];
  assessmentDate: Date;
  nextAssessmentDate: Date;
}

export interface SkillStrength {
  skill: string;
  level: number; // 1-10
  description: string;
  examples: string[];
}

export interface SkillWeakness {
  skill: string;
  level: number; // 1-10
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  description: string;
  improvementPlan: string[];
}

export interface PracticeRecommendation {
  id: string;
  type: 'daily' | 'weekly' | 'monthly';
  title: string;
  description: string;
  duration: number; // 분 단위
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  focusAreas: string[];
  exercises: PracticeExercise[];
  expectedOutcome: string;
}

export interface PracticeExercise {
  id: string;
  name: string;
  type: 'scales' | 'chords' | 'progressions' | 'songs' | 'theory' | 'ear_training';
  description: string;
  duration: number; // 분 단위
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  materials: string[];
  instructions: string[];
  tips: string[];
}

export interface PracticePlan {
  id: string;
  userId: string;
  title: string;
  description: string;
  duration: number; // 주 단위
  weeklySchedule: WeeklySchedule[];
  goals: PracticeGoal[];
  progress: PracticeProgress;
  createdAt: Date;
  updatedAt: Date;
}

export interface WeeklySchedule {
  weekNumber: number;
  days: DailyPractice[];
}

export interface DailyPractice {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  exercises: PracticeExercise[];
  totalDuration: number;
  focusArea: string;
}

export interface PracticeGoal {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  progress: number; // 0-100
  milestones: PracticeMilestone[];
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
}

export interface PracticeMilestone {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  completed: boolean;
  completedDate?: Date;
}

export interface PracticeProgress {
  totalPracticeTime: number; // 분 단위
  weeklyProgress: WeeklyProgress[];
  skillImprovements: SkillImprovement[];
  completedExercises: string[];
  streakDays: number;
  lastPracticeDate: Date;
}

export interface WeeklyProgress {
  weekNumber: number;
  totalTime: number;
  completedExercises: number;
  goalsAchieved: number;
  averageScore: number;
}

export interface SkillImprovement {
  skill: string;
  initialLevel: number;
  currentLevel: number;
  improvement: number;
  lastAssessed: Date;
}

export interface PracticeSession {
  id: string;
  userId: string;
  date: Date;
  duration: number;
  exercises: CompletedExercise[];
  notes: string;
  mood: 'GREAT' | 'GOOD' | 'OKAY' | 'DIFFICULT' | 'FRUSTRATED';
  overallRating: number; // 1-10
}

export interface CompletedExercise {
  exerciseId: string;
  duration: number;
  score: number; // 1-10
  notes: string;
  difficulties: string[];
}

class PersonalizedPracticeService {
  private readonly baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  // 1. AI 진단 수행
  async performPracticeDiagnosis(userId: string): Promise<PracticeDiagnosis> {
    try {
      // 실제로는 AI 모델을 사용하여 진단 수행
      const mockDiagnosis: PracticeDiagnosis = {
        userId,
        skillLevel: 'INTERMEDIATE',
        strengths: [
          {
            skill: '기본 화성 진행',
            level: 7,
            description: 'I-V-vi-IV와 같은 기본적인 화성 진행을 잘 이해하고 있습니다.',
            examples: ['I-V-I 진행', 'ii-V-I 진행', '기본 3화음 구성']
          },
          {
            skill: '리듬 감각',
            level: 8,
            description: '안정적인 리듬을 유지하며 연주할 수 있습니다.',
            examples: ['4/4 박자 유지', '기본 리듬 패턴', '템포 일정성']
          }
        ],
        weaknesses: [
          {
            skill: '고급 화성',
            level: 4,
            priority: 'HIGH',
            description: '7화음과 확장 화성에 대한 이해가 부족합니다.',
            improvementPlan: [
              '7화음 구성 연습',
              '확장 화성 이론 학습',
              '재즈 진행 패턴 연습'
            ]
          },
          {
            skill: '조성 전환',
            level: 3,
            priority: 'MEDIUM',
            description: '조성 전환 기법에 대한 이해가 부족합니다.',
            improvementPlan: [
              '피벗 화성 연습',
              '상대조 전환 연습',
              '평행조 전환 연습'
            ]
          }
        ],
        recommendations: [
          {
            id: 'rec1',
            type: 'daily',
            title: '7화음 마스터리',
            description: '매일 7화음 구성과 연주를 연습하여 고급 화성 이해를 높이세요.',
            duration: 30,
            difficulty: 'INTERMEDIATE',
            focusAreas: ['7화음 구성', '7화음 연주', '7화음 진행'],
            exercises: [],
            expectedOutcome: '7화음을 자유롭게 구성하고 연주할 수 있게 됩니다.'
          }
        ],
        assessmentDate: new Date(),
        nextAssessmentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30일 후
      };

      return mockDiagnosis;
    } catch (error) {
      console.error('연습 진단 오류:', error);
      throw error;
    }
  }

  // 2. 맞춤형 커리큘럼 생성
  async generatePersonalizedCurriculum(
    userId: string,
    diagnosis: PracticeDiagnosis
  ): Promise<PracticePlan> {
    try {
      const exercises = this.generateExercisesForLevel(diagnosis.skillLevel);
      const weeklySchedule = this.createWeeklySchedule(exercises, diagnosis);
      const goals = this.createPracticeGoals(diagnosis);

      const practicePlan: PracticePlan = {
        id: `plan-${userId}-${Date.now()}`,
        userId,
        title: `${diagnosis.skillLevel} 레벨 맞춤 연습 계획`,
        description: `당신의 현재 수준과 목표에 맞춘 개인화된 연습 계획입니다.`,
        duration: 8, // 8주
        weeklySchedule,
        goals,
        progress: {
          totalPracticeTime: 0,
          weeklyProgress: [],
          skillImprovements: [],
          completedExercises: [],
          streakDays: 0,
          lastPracticeDate: new Date()
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      return practicePlan;
    } catch (error) {
      console.error('맞춤형 커리큘럼 생성 오류:', error);
      throw error;
    }
  }

  // 3. 연습 계획 조회
  async getPracticePlan(userId: string): Promise<PracticePlan | null> {
    try {
      // 실제로는 데이터베이스에서 조회
      const diagnosis = await this.performPracticeDiagnosis(userId);
      const plan = await this.generatePersonalizedCurriculum(userId, diagnosis);
      return plan;
    } catch (error) {
      console.error('연습 계획 조회 오류:', error);
      return null;
    }
  }

  // 4. 연습 세션 기록
  async recordPracticeSession(session: PracticeSession): Promise<boolean> {
    try {
      // 실제로는 데이터베이스에 저장
      console.log('연습 세션 기록:', session);
      return true;
    } catch (error) {
      console.error('연습 세션 기록 오류:', error);
      return false;
    }
  }

  // 5. 진도 추적 및 업데이트
  async updatePracticeProgress(
    userId: string,
    session: PracticeSession
  ): Promise<PracticeProgress | null> {
    try {
      // 실제로는 데이터베이스에서 기존 진도 조회 후 업데이트
      const currentProgress: PracticeProgress = {
        totalPracticeTime: session.duration,
        weeklyProgress: [
          {
            weekNumber: this.getCurrentWeek(),
            totalTime: session.duration,
            completedExercises: session.exercises.length,
            goalsAchieved: 0,
            averageScore: session.exercises.reduce((sum, ex) => sum + ex.score, 0) / session.exercises.length
          }
        ],
        skillImprovements: [],
        completedExercises: session.exercises.map(ex => ex.exerciseId),
        streakDays: 1,
        lastPracticeDate: session.date
      };

      return currentProgress;
    } catch (error) {
      console.error('진도 업데이트 오류:', error);
      return null;
    }
  }

  // 6. 목표 달성도 확인
  async checkGoalProgress(userId: string): Promise<PracticeGoal[]> {
    try {
      const plan = await this.getPracticePlan(userId);
      if (!plan) return [];

      // 목표 진행 상황 업데이트
      const updatedGoals = plan.goals.map(goal => {
        const progress = this.calculateGoalProgress(goal, plan.progress);
        return { ...goal, progress };
      });

      return updatedGoals;
    } catch (error) {
      console.error('목표 진행 상황 확인 오류:', error);
      return [];
    }
  }

  // 7. 연습 추천사항 생성
  async generatePracticeRecommendations(
    userId: string,
    currentMood: string,
    availableTime: number
  ): Promise<PracticeRecommendation[]> {
    try {
      const diagnosis = await this.performPracticeDiagnosis(userId);
      const recommendations: PracticeRecommendation[] = [];

      // 시간과 기분에 맞는 연습 추천
      if (availableTime >= 60) {
        recommendations.push({
          id: 'rec-long',
          type: 'daily',
          title: '종합 연습 세션',
          description: '충분한 시간을 활용한 종합적인 연습 세션입니다.',
          duration: 60,
          difficulty: diagnosis.skillLevel as any,
          focusAreas: ['기술 향상', '이론 학습', '곡 연습'],
          exercises: [],
          expectedOutcome: '전반적인 실력 향상과 자신감 증대'
        });
      } else if (availableTime >= 30) {
        recommendations.push({
          id: 'rec-medium',
          type: 'daily',
          title: '집중 연습 세션',
          description: '짧지만 집중적인 연습으로 핵심 기술을 향상시킵니다.',
          duration: 30,
          difficulty: diagnosis.skillLevel as any,
          focusAreas: ['핵심 기술', '약점 보완'],
          exercises: [],
          expectedOutcome: '특정 기술의 빠른 향상'
        });
      } else {
        recommendations.push({
          id: 'rec-short',
          type: 'daily',
          title: '미니 연습 세션',
          description: '짧은 시간을 활용한 효과적인 연습입니다.',
          duration: 15,
          difficulty: diagnosis.skillLevel as any,
          focusAreas: ['기본 유지', '간단한 연습'],
          exercises: [],
          expectedOutcome: '기본기 유지와 가벼운 향상'
        });
      }

      return recommendations;
    } catch (error) {
      console.error('연습 추천사항 생성 오류:', error);
      return [];
    }
  }

  // 8. 학습 패턴 분석
  async analyzeLearningPatterns(userId: string): Promise<{
    bestPracticeTime: string;
    mostEffectiveDuration: number;
    preferredExerciseTypes: string[];
    improvementRate: number;
    suggestions: string[];
  }> {
    try {
      // 실제로는 사용자의 연습 데이터를 분석
      const analysis = {
        bestPracticeTime: '오후 2-4시',
        mostEffectiveDuration: 45,
        preferredExerciseTypes: ['scales', 'chords', 'songs'],
        improvementRate: 0.15, // 15% 향상
        suggestions: [
          '오후 시간대에 더 긴 연습 세션을 가져보세요',
          '스케일과 화성 연습을 더 자주 해보세요',
          '주 4-5회 연습을 목표로 하세요'
        ]
      };

      return analysis;
    } catch (error) {
      console.error('학습 패턴 분석 오류:', error);
      throw error;
    }
  }

  // Private helper methods
  private generateExercisesForLevel(level: string): PracticeExercise[] {
    const exercises: PracticeExercise[] = [];

    if (level === 'BEGINNER') {
      exercises.push(
        {
          id: 'ex-basic-1',
          name: '기본 3화음 연습',
          type: 'chords',
          description: 'C, G, F major 3화음을 연주하는 연습',
          duration: 15,
          difficulty: 'BEGINNER',
          materials: ['피아노 또는 기타'],
          instructions: [
            'C major 3화음을 천천히 연주하세요',
            '각 음을 명확하게 들리게 하세요',
            '메트로놈과 함께 연습하세요'
          ],
          tips: ['손가락 위치를 정확히 하세요', '소리를 들으며 연습하세요']
        }
      );
    } else if (level === 'INTERMEDIATE') {
      exercises.push(
        {
          id: 'ex-inter-1',
          name: '7화음 진행 연습',
          type: 'progressions',
          description: 'ii7-V7-Imaj7 진행을 연습합니다',
          duration: 20,
          difficulty: 'INTERMEDIATE',
          materials: ['피아노 또는 기타', '메트로놈'],
          instructions: [
            'Dm7-G7-Cmaj7 진행을 연습하세요',
            '각 화성을 2박씩 연주하세요',
            '부드러운 전환을 연습하세요'
          ],
          tips: ['7화음의 구성음을 정확히 파악하세요', '손가락 움직임을 최소화하세요']
        }
      );
    }

    return exercises;
  }

  private createWeeklySchedule(
    exercises: PracticeExercise[],
    diagnosis: PracticeDiagnosis
  ): WeeklySchedule[] {
    const weeklySchedule: WeeklySchedule[] = [];

    for (let week = 1; week <= 8; week++) {
      const days: DailyPractice[] = [
        {
          day: 'monday',
          exercises: exercises.slice(0, 2),
          totalDuration: exercises.slice(0, 2).reduce((sum, ex) => sum + ex.duration, 0),
          focusArea: '기본기 향상'
        },
        {
          day: 'tuesday',
          exercises: exercises.slice(2, 4),
          totalDuration: exercises.slice(2, 4).reduce((sum, ex) => sum + ex.duration, 0),
          focusArea: '기술 연마'
        },
        {
          day: 'wednesday',
          exercises: exercises.slice(4, 6),
          totalDuration: exercises.slice(4, 6).reduce((sum, ex) => sum + ex.duration, 0),
          focusArea: '이론 학습'
        },
        {
          day: 'thursday',
          exercises: exercises.slice(6, 8),
          totalDuration: exercises.slice(6, 8).reduce((sum, ex) => sum + ex.duration, 0),
          focusArea: '곡 연습'
        },
        {
          day: 'friday',
          exercises: exercises.slice(8, 10),
          totalDuration: exercises.slice(8, 10).reduce((sum, ex) => sum + ex.duration, 0),
          focusArea: '종합 연습'
        },
        {
          day: 'saturday',
          exercises: exercises.slice(10, 12),
          totalDuration: exercises.slice(10, 12).reduce((sum, ex) => sum + ex.duration, 0),
          focusArea: '창의적 연습'
        },
        {
          day: 'sunday',
          exercises: exercises.slice(12, 14),
          totalDuration: exercises.slice(12, 14).reduce((sum, ex) => sum + ex.duration, 0),
          focusArea: '복습 및 정리'
        }
      ];

      weeklySchedule.push({
        weekNumber: week,
        days
      });
    }

    return weeklySchedule;
  }

  private createPracticeGoals(diagnosis: PracticeDiagnosis): PracticeGoal[] {
    const goals: PracticeGoal[] = [];

    // 약점 보완 목표
    diagnosis.weaknesses.forEach((weakness, index) => {
      goals.push({
        id: `goal-${index + 1}`,
        title: `${weakness.skill} 향상`,
        description: `${weakness.skill}을 ${weakness.level + 2} 레벨까지 향상시키는 것이 목표입니다.`,
        targetDate: new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000), // 1-3주 후
        progress: 0,
        milestones: [
          {
            id: `milestone-${index + 1}-1`,
            title: '기본 이해',
            description: '해당 기술의 기본 개념을 이해합니다.',
            targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            completed: false
          },
          {
            id: `milestone-${index + 1}-2`,
            title: '기본 연습',
            description: '기본적인 연습을 수행할 수 있습니다.',
            targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            completed: false
          },
          {
            id: `milestone-${index + 1}-3`,
            title: '적용 연습',
            description: '실제 음악에 적용할 수 있습니다.',
            targetDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
            completed: false
          }
        ],
        status: 'NOT_STARTED'
      });
    });

    return goals;
  }

  private calculateGoalProgress(goal: PracticeGoal, progress: PracticeProgress): number {
    if (goal.milestones.length === 0) return 0;
    
    const completedMilestones = goal.milestones.filter(m => m.completed).length;
    return Math.round((completedMilestones / goal.milestones.length) * 100);
  }

  private getCurrentWeek(): number {
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    const days = Math.floor((Date.now() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil(days / 7);
  }
}

export const personalizedPracticeService = new PersonalizedPracticeService();
