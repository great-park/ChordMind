package com.chordmind.practice.domain

/**
 * 업적 타입 Enum
 */
enum class AchievementType(
    val displayName: String,
    val description: String,
    val category: AchievementCategory,
    val icon: String,
    val rarity: AchievementRarity
) {
    // 연습 시간 관련
    FIRST_SESSION("첫 연습", "첫 연습 세션 완료", AchievementCategory.PRACTICE, "🌱", AchievementRarity.COMMON),
    PRACTICE_STREAK_7("연속 7일", "7일 연속 연습", AchievementCategory.PRACTICE, "🔥", AchievementRarity.COMMON),
    PRACTICE_STREAK_30("연속 30일", "30일 연속 연습", AchievementCategory.PRACTICE, "💪", AchievementRarity.RARE),
    PRACTICE_STREAK_100("연속 100일", "100일 연속 연습", AchievementCategory.PRACTICE, "👑", AchievementRarity.LEGENDARY),
    
    // 시간 누적 관련
    TOTAL_10_HOURS("10시간 달성", "총 10시간 연습 완료", AchievementCategory.TIME, "⏰", AchievementRarity.COMMON),
    TOTAL_50_HOURS("50시간 달성", "총 50시간 연습 완료", AchievementCategory.TIME, "⌚", AchievementRarity.UNCOMMON),
    TOTAL_100_HOURS("100시간 달성", "총 100시간 연습 완료", AchievementCategory.TIME, "🕰️", AchievementRarity.RARE),
    TOTAL_500_HOURS("500시간 달성", "총 500시간 연습 완료", AchievementCategory.TIME, "💎", AchievementRarity.EPIC),
    
    // 정확도 관련
    PERFECT_SESSION("완벽한 세션", "한 세션에서 100% 정확도", AchievementCategory.ACCURACY, "⭐", AchievementRarity.UNCOMMON),
    HIGH_ACCURACY_STREAK("고정확도 연속", "90% 이상 정확도 10회 연속", AchievementCategory.ACCURACY, "🎯", AchievementRarity.RARE),
    ACCURACY_MASTER("정확도 마스터", "전체 평균 95% 이상", AchievementCategory.ACCURACY, "🏆", AchievementRarity.EPIC),
    
    // 속도 관련
    SPEED_DEMON("속도의 악마", "평균 응답 시간 3초 이하", AchievementCategory.SPEED, "⚡", AchievementRarity.RARE),
    LIGHTNING_FAST("번개같은 속도", "한 문제를 1초 이내 해결", AchievementCategory.SPEED, "⚡", AchievementRarity.UNCOMMON),
    
    // 도전 관련
    CHALLENGE_ACCEPTED("도전 수락", "첫 챌린지 모드 완료", AchievementCategory.CHALLENGE, "🚀", AchievementRarity.COMMON),
    CHALLENGE_MASTER("챌린지 마스터", "모든 난이도 챌린지 완료", AchievementCategory.CHALLENGE, "👑", AchievementRarity.LEGENDARY),
    
    // 학습 관련
    THEORY_NOVICE("이론 입문", "모든 기본 이론 학습", AchievementCategory.LEARNING, "📚", AchievementRarity.COMMON),
    THEORY_EXPERT("이론 전문가", "고급 이론까지 마스터", AchievementCategory.LEARNING, "🎓", AchievementRarity.EPIC),
    
    // 소셜 관련
    FIRST_SHARE("첫 공유", "첫 성과 공유", AchievementCategory.SOCIAL, "📱", AchievementRarity.COMMON),
    MENTOR("멘토", "다른 사용자 도움 10회", AchievementCategory.SOCIAL, "🤝", AchievementRarity.RARE);

    companion object {
        fun getByCategory(category: AchievementCategory): List<AchievementType> {
            return values().filter { it.category == category }
        }
        
        fun getByRarity(rarity: AchievementRarity): List<AchievementType> {
            return values().filter { it.rarity == rarity }
        }
    }
}

/**
 * 업적 카테고리 Enum
 */
enum class AchievementCategory(
    val displayName: String,
    val description: String,
    val color: String
) {
    PRACTICE("연습", "연습 관련 업적", "#4CAF50"),
    TIME("시간", "연습 시간 관련 업적", "#2196F3"),
    ACCURACY("정확도", "정답률 관련 업적", "#FF9800"),
    SPEED("속도", "문제 해결 속도 관련 업적", "#9C27B0"),
    CHALLENGE("도전", "챌린지 관련 업적", "#F44336"),
    LEARNING("학습", "학습 진도 관련 업적", "#607D8B"),
    SOCIAL("소셜", "사회적 활동 관련 업적", "#E91E63");
}

/**
 * 업적 희귀도 Enum
 */
enum class AchievementRarity(
    val displayName: String,
    val color: String,
    val points: Int, // 업적 획득 시 점수
    val probability: Double // 획득 확률 (참고용)
) {
    COMMON("일반", "#9E9E9E", 10, 0.8),
    UNCOMMON("언커먼", "#4CAF50", 25, 0.5),
    RARE("레어", "#2196F3", 50, 0.2),
    EPIC("에픽", "#9C27B0", 100, 0.05),
    LEGENDARY("전설", "#FF9800", 250, 0.01);

    companion object {
        fun getTotalPoints(achievements: List<AchievementType>): Int {
            return achievements.sumOf { it.rarity.points }
        }
    }
}

/**
 * 업적 진행 상태 Enum
 */
enum class AchievementProgressStatus(
    val displayName: String,
    val description: String
) {
    LOCKED("잠금", "아직 해제되지 않은 업적"),
    IN_PROGRESS("진행중", "현재 진행 중인 업적"),
    COMPLETED("완료", "완료된 업적"),
    EXPIRED("만료", "시간 제한이 있었던 업적이 만료됨");
}