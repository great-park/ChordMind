package com.chordmind.practice.dto

import com.chordmind.practice.domain.SessionStatus
import java.time.LocalDateTime

// 연습 세션 생성 요청
data class CreatePracticeSessionRequest(
    val userId: Long,
    val goal: String? = null
)

// 연습 세션 응답
data class PracticeSessionResponse(
    val id: Long,
    val userId: Long,
    val startedAt: LocalDateTime,
    val endedAt: LocalDateTime?,
    val status: SessionStatus,
    val goal: String?
)

data class PracticeSessionSummary(
    val id: Long,
    val songTitle: String,
    val artist: String,
    val difficulty: String,
    val accuracy: Double,
    val score: Int,
    val completed: Boolean,
    val createdAt: LocalDateTime
)

// 연습 세션 정보 수정 요청
data class UpdatePracticeSessionRequest(
    val goal: String? = null,
    val status: SessionStatus? = null,
    val endedAt: LocalDateTime? = null
)

// 사용자별 연습 요약/통계 응답
data class UserPracticeSummaryResponse(
    val userId: Long,
    val totalSessions: Int,
    val completedSessions: Int,
    val averageScore: Double?,
    val averageProgressScore: Double?,
    val lastSessionAt: LocalDateTime?
)

// 연습 세션 검색/필터 요청 DTO
data class PracticeSessionSearchRequest(
    val userId: Long? = null,
    val goal: String? = null,
    val status: SessionStatus? = null,
    val startedAtFrom: LocalDateTime? = null,
    val startedAtTo: LocalDateTime? = null
)

// 진행상황 검색/필터 요청 DTO
data class PracticeProgressSearchRequest(
    val sessionId: Long? = null,
    val note: String? = null,
    val scoreMin: Int? = null,
    val scoreMax: Int? = null,
    val timestampFrom: LocalDateTime? = null,
    val timestampTo: LocalDateTime? = null
)

// API 표준 응답 포맷
data class CommonResponse<T>(
    val success: Boolean,
    val data: T? = null,
    val error: String? = null
)

// API 표준 페이징 응답 포맷
data class PageResponse<T>(
    val content: List<T>,
    val page: Int,
    val size: Int,
    val totalElements: Long,
    val totalPages: Int
)

// 사용자 연습 성취도 랭킹 응답
data class UserRankingResponse(
    val userId: Long,
    val username: String? = null,
    val totalSessions: Int,
    val completedSessions: Int,
    val averageScore: Double?,
    val totalPracticeTime: Long, // 분 단위
    val rank: Int,
    val score: Double // 랭킹 점수 (가중 평균)
)

// 통합 통계/분석 응답 DTO

data class AnalyticsUserSummaryResponse(
    val userId: Long,
    val totalSessions: Int,
    val completedSessions: Int,
    val totalPracticeTime: Long,
    val averageSessionTime: Double,
    val completionRate: Double,
    val improvementRate: Double,
    val lastSessionAt: LocalDateTime?,
    val streakDays: Int,
    val achievements: List<String>
)

data class AnalyticsSessionSummaryResponse(
    val sessionId: Long,
    val userId: Long,
    val duration: Long, // 분 단위
    val progressCount: Int,
    val averageScore: Double,
    val improvementRate: Double,
    val difficultyLevel: String,
    val focusAreas: List<String>
)

data class AnalyticsUserTrendResponse(
    val userId: Long,
    val period: String,
    val dataPoints: List<TrendDataPoint>,
    val overallTrend: String, // "improving", "declining", "stable"
    val trendStrength: Double
)

data class TrendDataPoint(
    val date: LocalDateTime,
    val value: Double,
    val label: String
)

data class AnalyticsSessionSummary(
    val id: Long,
    val songTitle: String,
    val artist: String,
    val difficulty: String,
    val accuracy: Double,
    val score: Int,
    val completed: Boolean,
    val createdAt: LocalDateTime
)

// 새로운 분석 및 통계 DTO들 추가

data class ProgressTrendResponse(
    val userId: Long,
    val period: Int, // 일 단위
    val trendData: List<ProgressDataPoint>,
    val overallTrend: String,
    val improvementRate: Double,
    val consistencyScore: Double
)

data class ProgressDataPoint(
    val date: LocalDateTime,
    val practiceTime: Long, // 분 단위
    val sessions: Int,
    val averageScore: Double,
    val completionRate: Double
)

data class SkillAnalysisResponse(
    val userId: Long,
    val skills: List<SkillData>,
    val strengths: List<String>,
    val weaknesses: List<String>,
    val recommendations: List<String>,
    val overallLevel: String
)

data class SkillData(
    val skillName: String,
    val currentLevel: Double,
    val targetLevel: Double,
    val progress: Double,
    val practiceTime: Long,
    val sessions: Int
)

data class PracticePatternsResponse(
    val userId: Long,
    val timePatterns: TimePatterns,
    val sessionPatterns: SessionPatterns,
    val improvementPatterns: ImprovementPatterns,
    val recommendations: List<String>
)

data class TimePatterns(
    val preferredTimeSlots: List<String>,
    val averageSessionDuration: Double,
    val longestStreak: Int,
    val consistencyScore: Double
)

data class SessionPatterns(
    val typicalSessionLength: Double,
    val breakFrequency: Double,
    val focusAreas: List<String>,
    val difficultyProgression: String
)

data class ImprovementPatterns(
    val learningCurve: String,
    val plateauPeriods: List<LocalDateTime>,
    val breakthroughPoints: List<LocalDateTime>,
    val overallProgress: Double
)

data class GoalResponse(
    val id: Long,
    val userId: Long,
    val title: String,
    val description: String,
    val targetDate: LocalDateTime,
    val targetValue: Double,
    val currentValue: Double,
    val progress: Double,
    val status: String, // "active", "completed", "overdue"
    val createdAt: LocalDateTime
)

data class CreateGoalRequest(
    val title: String,
    val description: String,
    val targetDate: LocalDateTime,
    val targetValue: Double,
    val goalType: String // "practice_time", "sessions", "score", "skill"
)

data class AchievementResponse(
    val id: String,
    val userId: Long,
    val name: String,
    val description: String,
    val icon: String,
    val category: String,
    val earnedAt: LocalDateTime,
    val rarity: String // "common", "rare", "epic", "legendary"
)

data class UserComparisonResponse(
    val userId: Long,
    val compareWithUserId: Long?,
    val userStats: UserStats,
    val compareStats: UserStats?,
    val differences: ComparisonDifferences,
    val percentile: Double
)

data class UserStats(
    val totalPracticeTime: Long,
    val totalSessions: Int,
    val averageScore: Double,
    val completionRate: Double,
    val improvementRate: Double,
    val streakDays: Int
)

data class ComparisonDifferences(
    val practiceTimeDiff: Long,
    val sessionsDiff: Int,
    val scoreDiff: Double,
    val completionRateDiff: Double,
    val improvementRateDiff: Double
)

data class LeaderboardEntryResponse(
    val rank: Int,
    val userId: Long,
    val username: String,
    val score: Double,
    val totalPracticeTime: Long,
    val sessions: Int,
    val achievements: Int
)

data class GlobalTrendsResponse(
    val totalUsers: Int,
    val activeUsers: Int,
    val totalPracticeTime: Long,
    val averageSessionTime: Double,
    val popularGoals: List<String>,
    val trendingSkills: List<String>,
    val period: String
)

// 알림/피드백/추천 DTO

data class GoalAchievementNotification(
    val userId: Long,
    val sessionId: Long,
    val message: String,
    val achievedAt: java.time.LocalDateTime
)

data class PracticeRecommendationResponse(
    val userId: Long,
    val recommendedGoals: List<String>,
    val message: String
)

data class PracticeFeedbackResponse(
    val userId: Long,
    val sessionId: Long,
    val progressId: Long,
    val feedback: String
)

// Admin DTOs
data class AdminPracticeSummaryResponse(
    val totalUsers: Int,
    val activeUsers: Int,
    val totalSessions: Int,
    val averageSessionTime: Double,
    val popularGoals: List<String>,
    val trendingSkills: List<String>
)

data class AdminUserSummary(
    val userId: Long,
    val username: String,
    val totalSessions: Int,
    val totalPracticeTime: Long,
    val averageScore: Double,
    val lastActiveAt: LocalDateTime
)

data class AdminSessionSummary(
    val sessionId: Long,
    val userId: Long,
    val username: String,
    val startedAt: LocalDateTime,
    val endedAt: LocalDateTime?,
    val duration: Long,
    val score: Double,
    val status: String
)

data class AdminProgressSummary(
    val totalProgress: Int,
    val averageScore: Double,
    val improvementRate: Double,
    val topPerformers: List<AdminUserSummary>,
    val recentActivity: List<AdminSessionSummary>
) 