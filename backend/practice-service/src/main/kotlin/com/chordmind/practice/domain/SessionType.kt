package com.chordmind.practice.domain

/**
 * 연습 세션 타입 Enum
 */
enum class SessionType(
    val displayName: String,
    val description: String,
    val icon: String,
    val defaultDurationMinutes: Int
) {
    QUICK_PRACTICE("빠른 연습", "짧은 시간 집중 연습", "⚡", 15),
    STANDARD_PRACTICE("표준 연습", "일반적인 연습 세션", "📚", 30),
    INTENSIVE_PRACTICE("집중 연습", "장시간 심화 연습", "🔥", 60),
    REVIEW_SESSION("복습 세션", "이전 내용 복습", "🔄", 20),
    CHALLENGE_MODE("챌린지 모드", "도전적인 문제 해결", "🏆", 45),
    ASSESSMENT("평가 모드", "실력 측정 및 평가", "📊", 30),
    FREE_PRACTICE("자유 연습", "제한 없는 자유 연습", "🎨", 0);

    companion object {
        fun getDefault(): SessionType = STANDARD_PRACTICE
        
        fun getTimedSessions(): List<SessionType> {
            return values().filter { it.defaultDurationMinutes > 0 }
        }
    }
}

/**
 * 세션 난이도 Enum
 */
enum class SessionDifficulty(
    val displayName: String,
    val description: String,
    val color: String,
    val multiplier: Double // 점수 배율
) {
    BEGINNER("초급", "기초 수준 문제", "#4CAF50", 1.0),
    ELEMENTARY("초중급", "기본 개념 적용", "#8BC34A", 1.2),
    INTERMEDIATE("중급", "복합적 사고 필요", "#FF9800", 1.5),
    ADVANCED("고급", "전문적 지식 필요", "#FF5722", 2.0),
    EXPERT("전문가", "마스터 수준", "#9C27B0", 2.5),
    MIXED("혼합", "다양한 난이도 섞음", "#607D8B", 1.3);

    companion object {
        fun getDefault(): SessionDifficulty = INTERMEDIATE
        
        fun getProgressiveDifficulties(): List<SessionDifficulty> {
            return listOf(BEGINNER, ELEMENTARY, INTERMEDIATE, ADVANCED, EXPERT)
        }
    }
}

/**
 * 세션 상태 확장 (기존 SessionStatus 대체)
 */
enum class PracticeSessionStatus(
    val displayName: String,
    val description: String,
    val isActive: Boolean = false,
    val isCompleted: Boolean = false
) {
    NOT_STARTED("시작 전", "아직 시작하지 않은 세션", false, false),
    IN_PROGRESS("진행중", "현재 진행 중인 세션", true, false),
    PAUSED("일시정지", "일시적으로 중단된 세션", false, false),
    COMPLETED("완료", "정상적으로 완료된 세션", false, true),
    ABANDONED("중단", "중간에 포기한 세션", false, true),
    INTERRUPTED("중단됨", "외부 요인으로 중단된 세션", false, true),
    EXPIRED("만료", "시간 초과로 종료된 세션", false, true);

    companion object {
        fun getActiveStatuses(): List<PracticeSessionStatus> {
            return values().filter { it.isActive }
        }
        
        fun getCompletedStatuses(): List<PracticeSessionStatus> {
            return values().filter { it.isCompleted }
        }
        
        fun getResumableStatuses(): List<PracticeSessionStatus> {
            return listOf(PAUSED, INTERRUPTED)
        }
    }
}

/**
 * 성과 평가 등급 Enum
 */
enum class PerformanceGrade(
    val displayName: String,
    val description: String,
    val color: String,
    val minScore: Int, // 최소 점수 (0-100)
    val emoji: String
) {
    F("F", "추가 연습이 필요합니다", "#F44336", 0, "😞"),
    D("D", "기본기를 다져보세요", "#FF5722", 40, "😐"),
    C("C", "평균적인 수준입니다", "#FF9800", 60, "🙂"),
    B("B", "좋은 성과입니다", "#4CAF50", 80, "😊"),
    A("A", "훌륭한 성과입니다", "#2196F3", 90, "😄"),
    S("S", "완벽한 수행입니다", "#9C27B0", 95, "🤩");

    companion object {
        fun fromScore(score: Int): PerformanceGrade {
            return values()
                .filter { score >= it.minScore }
                .maxByOrNull { it.minScore } ?: F
        }
        
        fun getPassingGrades(): List<PerformanceGrade> {
            return listOf(C, B, A, S)
        }
    }
}