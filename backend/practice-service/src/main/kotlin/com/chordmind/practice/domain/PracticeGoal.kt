package com.chordmind.practice.domain

/**
 * 연습 목표 타입 Enum
 */
enum class PracticeGoalType(
    val displayName: String,
    val description: String,
    val icon: String,
    val defaultDuration: Int, // 기본 기간 (일)
    val measurable: Boolean = true
) {
    TIME_BASED("시간 기반", "일정 시간 연습하기", "⏰", 7),
    SESSION_COUNT("세션 횟수", "정해진 횟수만큼 연습하기", "🔢", 7),
    ACCURACY_TARGET("정확도 목표", "특정 정확도 달성하기", "🎯", 14),
    STREAK_GOAL("연속 달성", "연속으로 목표 달성하기", "🔥", 30),
    SKILL_MASTERY("기술 숙련", "특정 기술 마스터하기", "🏆", 30),
    SPEED_IMPROVEMENT("속도 향상", "문제 해결 속도 개선", "⚡", 21),
    CHALLENGE_COMPLETION("챌린지 완료", "특정 챌린지 완료하기", "🚀", 7, false),
    CUSTOM("사용자 정의", "사용자가 직접 설정한 목표", "✨", 14, false);

    companion object {
        fun getDefaultGoals(): List<PracticeGoalType> {
            return listOf(TIME_BASED, SESSION_COUNT, ACCURACY_TARGET)
        }
        
        fun getMeasurableGoals(): List<PracticeGoalType> {
            return values().filter { it.measurable }
        }
    }
}

/**
 * 목표 상태 Enum
 */
enum class GoalStatus(
    val displayName: String,
    val description: String,
    val isCompleted: Boolean = false
) {
    ACTIVE("진행중", "현재 진행 중인 목표", false),
    PAUSED("일시정지", "일시적으로 중단된 목표", false),
    COMPLETED("완료", "성공적으로 달성한 목표", true),
    FAILED("실패", "기간 내 달성하지 못한 목표", true),
    CANCELLED("취소", "사용자가 취소한 목표", true);

    companion object {
        fun getActiveStatuses(): List<GoalStatus> {
            return listOf(ACTIVE, PAUSED)
        }
        
        fun getCompletedStatuses(): List<GoalStatus> {
            return values().filter { it.isCompleted }
        }
    }
}

/**
 * 목표 우선순위 Enum
 */
enum class GoalPriority(
    val displayName: String,
    val color: String,
    val weight: Int
) {
    LOW("낮음", "#10B981", 1),
    MEDIUM("보통", "#F59E0B", 2),
    HIGH("높음", "#EF4444", 3),
    CRITICAL("긴급", "#DC2626", 4);

    companion object {
        fun getDefault(): GoalPriority = MEDIUM
    }
}

/**
 * 진행률 계산 방식 Enum
 */
enum class ProgressCalculationMethod(
    val displayName: String,
    val description: String
) {
    LINEAR("선형", "목표값에 대한 현재값의 비율"),
    EXPONENTIAL("지수", "초기에는 느리고 후반에 빠른 진행"),
    MILESTONE("마일스톤", "특정 단계별 달성 여부"),
    WEIGHTED("가중치", "각 항목별 가중치를 적용한 계산");

    companion object {
        fun getDefault(): ProgressCalculationMethod = LINEAR
    }
}