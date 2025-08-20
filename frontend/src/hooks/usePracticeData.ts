import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { practiceService } from '../services/practiceService';
import type { 
  AnalyticsUserSummaryResponse,
  AnalyticsUserTrendResponse,
  UserRankingResponse
} from '../services/practiceService';

// Query Keys
export const practiceKeys = {
  all: ['practice'] as const,
  summary: (userId: number) => [...practiceKeys.all, 'summary', userId] as const,
  trend: (userId: number, period: string) => [...practiceKeys.all, 'trend', userId, period] as const,
  rankings: () => [...practiceKeys.all, 'rankings'] as const,
} as const;

// 커스텀 훅들
export function useUserSummary(userId: number) {
  return useQuery({
    queryKey: practiceKeys.summary(userId),
    queryFn: () => practiceService.getAnalyticsUserSummary(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5분
  });
}

export function useUserTrend(userId: number, period: string = 'month') {
  return useQuery({
    queryKey: practiceKeys.trend(userId, period),
    queryFn: () => practiceService.getAnalyticsUserTrend(userId, period),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5분
  });
}

export function useTopUsers(limit: number = 8) {
  return useQuery({
    queryKey: practiceKeys.rankings(),
    queryFn: () => practiceService.getTopUsers(limit),
    staleTime: 10 * 60 * 1000, // 10분
  });
}

// 뮤테이션 훅
export function useUpdatePracticeGoal() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, goal }: { userId: number; goal: string }) => {
      // 실제 API 호출 구현 필요
      return Promise.resolve({ success: true, data: { userId, goal } });
    },
    onSuccess: (data, variables) => {
      // 성공 시 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: practiceKeys.summary(variables.userId) });
    },
  });
}

export function useSubmitPracticeSession() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (sessionData: any) => {
      // 실제 API 호출 구현 필요
      return Promise.resolve({ success: true, data: sessionData });
    },
    onSuccess: (data, variables) => {
      // 성공 시 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: practiceKeys.all });
    },
  });
}
