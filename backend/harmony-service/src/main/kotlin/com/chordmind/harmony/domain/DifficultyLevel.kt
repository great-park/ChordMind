package com.chordmind.harmony.domain

/**
 * 난이도 레벨 Enum
 * 퀴즈 문제, 코드, 화성 진행 등의 난이도 분류
 */
enum class DifficultyLevel(
    val level: Int,
    val displayName: String,
    val description: String,
    val color: String,
    val requiredScore: Int = 0
) {
    BEGINNER(1, "초급", "음악 이론을 처음 배우는 단계", "#4CAF50", 0),
    ELEMENTARY(2, "초중급", "기본 개념을 이해한 단계", "#8BC34A", 60),
    INTERMEDIATE(3, "중급", "어느 정도 숙련된 단계", "#FF9800", 70),
    ADVANCED(4, "고급", "전문적인 지식이 필요한 단계", "#FF5722", 80),
    EXPERT(5, "전문가", "마스터 레벨의 고난도 단계", "#9C27B0", 90);

    companion object {
        /**
         * 숫자 레벨로부터 DifficultyLevel을 찾는 메서드
         */
        fun fromLevel(level: Int): DifficultyLevel {
            return values().find { it.level == level } ?: BEGINNER
        }

        /**
         * 문자열 값으로부터 DifficultyLevel을 찾는 메서드
         */
        fun fromString(value: String): DifficultyLevel? {
            return values().find { 
                it.name.equals(value, ignoreCase = true) || 
                it.displayName == value 
            }
        }

        /**
         * 특정 점수에 맞는 난이도 반환
         */
        fun getByScore(score: Int): DifficultyLevel {
            return values()
                .filter { score >= it.requiredScore }
                .maxByOrNull { it.level } ?: BEGINNER
        }

        /**
         * 특정 레벨 이하의 난이도만 반환
         */
        fun getUpToLevel(maxLevel: Int): List<DifficultyLevel> {
            return values().filter { it.level <= maxLevel }
        }

        /**
         * 초보자용 난이도 (레벨 1-2)
         */
        fun getBeginnerLevels(): List<DifficultyLevel> {
            return listOf(BEGINNER, ELEMENTARY)
        }

        /**
         * 중급자용 난이도 (레벨 2-4)
         */
        fun getIntermediateLevels(): List<DifficultyLevel> {
            return listOf(ELEMENTARY, INTERMEDIATE, ADVANCED)
        }
    }
}