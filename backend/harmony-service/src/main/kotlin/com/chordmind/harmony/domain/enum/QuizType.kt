package com.chordmind.harmony.domain.enum

/**
 * 퀴즈 유형 Enum
 * Rich Enum 패턴을 적용하여 비즈니스 로직 포함
 */
enum class QuizType(
    val displayName: String,
    val description: String,
    val category: QuizCategory,
    val estimatedTimeMinutes: Int,
    val isInteractive: Boolean = false
) {
    CHORD_NAME(
        "코드 이름", 
        "주어진 코드의 이름을 맞히는 문제",
        QuizCategory.HARMONY,
        2,
        true
    ),
    PROGRESSION(
        "화성 진행", 
        "화성 진행 패턴을 식별하는 문제",
        QuizCategory.HARMONY,
        3,
        true
    ),
    INTERVAL(
        "음정", 
        "두 음 사이의 간격을 맞히는 문제",
        QuizCategory.THEORY,
        2,
        true
    ),
    SCALE(
        "스케일", 
        "음계의 종류와 특성을 맞히는 문제",
        QuizCategory.THEORY,
        3,
        false
    );
    
    val icon: String
        get() = when (this) {
            CHORD_NAME -> "🎵"
            PROGRESSION -> "🎼"
            INTERVAL -> "🎶"
            SCALE -> "🎹"
        }
    
    val difficultyRange: IntRange
        get() = when (this) {
            CHORD_NAME -> 1..4
            PROGRESSION -> 2..5
            INTERVAL -> 1..3
            SCALE -> 1..4
        }
    
    val recommendedCount: Int
        get() = when (this) {
            CHORD_NAME -> 10
            PROGRESSION -> 8
            INTERVAL -> 12
            SCALE -> 8
        }
    
    fun isAvailableForDifficulty(difficulty: Int): Boolean {
        return difficulty in difficultyRange
    }
    
    fun getRelatedTypes(): List<QuizType> {
        return when (category) {
            QuizCategory.HARMONY -> listOf(CHORD_NAME, PROGRESSION)
            QuizCategory.THEORY -> listOf(INTERVAL, SCALE)
        }.minus(this)
    }
    
    companion object {
        fun getByCategory(category: QuizCategory): List<QuizType> {
            return values().filter { it.category == category }
        }
        
        fun getInteractiveTypes(): List<QuizType> {
            return values().filter { it.isInteractive }
        }
        
        fun getForBeginners(): List<QuizType> {
            return values().filter { 1 in it.difficultyRange }
        }
        
        fun fromString(value: String): QuizType? {
            return values().find { 
                it.name.equals(value, ignoreCase = true) || 
                it.displayName.equals(value, ignoreCase = true) 
            }
        }
    }
}

enum class QuizCategory(
    val displayName: String,
    val description: String
) {
    HARMONY("화성학", "코드와 화성 진행에 관한 문제"),
    THEORY("음악 이론", "음정, 스케일 등 기초 이론 문제")
}