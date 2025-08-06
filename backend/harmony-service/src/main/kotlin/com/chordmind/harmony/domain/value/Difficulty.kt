package com.chordmind.harmony.domain.value

import jakarta.persistence.Embeddable

/**
 * 난이도 값 객체
 * 불변 객체로 비즈니스 규칙과 검증 로직을 포함
 */
@Embeddable
data class Difficulty private constructor(
    val level: Int,
    val maxScore: Int = 100
) : Comparable<Difficulty> {
    
    companion object {
        const val MIN_LEVEL = 1
        const val MAX_LEVEL = 5
        
        fun of(level: Int): Difficulty = Difficulty(level)
        
        fun beginner(): Difficulty = Difficulty(1)
        fun elementary(): Difficulty = Difficulty(2)
        fun intermediate(): Difficulty = Difficulty(3)
        fun advanced(): Difficulty = Difficulty(4)
        fun expert(): Difficulty = Difficulty(5)
        
        fun fromScore(score: Int): Difficulty {
            return when {
                score >= 90 -> expert()
                score >= 80 -> advanced()
                score >= 70 -> intermediate()
                score >= 60 -> elementary()
                else -> beginner()
            }
        }
        
        fun getBeginnerLevels(): List<Difficulty> = listOf(beginner(), elementary())
        fun getIntermediateLevels(): List<Difficulty> = listOf(elementary(), intermediate(), advanced())
        fun getAllLevels(): List<Difficulty> = (MIN_LEVEL..MAX_LEVEL).map { of(it) }
    }
    
    init {
        require(level in 1..5) { 
            "난이도는 1에서 5 사이여야 합니다. 현재 값: $level" 
        }
        require(maxScore > 0) { 
            "최고 점수는 0보다 커야 합니다. 현재 값: $maxScore" 
        }
    }
    
    val displayName: String
        get() = when (level) {
            1 -> "초급"
            2 -> "초중급" 
            3 -> "중급"
            4 -> "고급"
            5 -> "전문가"
            else -> "알 수 없음"
        }
    
    val description: String
        get() = when (level) {
            1 -> "음악 이론을 처음 배우는 단계"
            2 -> "기본 개념을 이해한 단계"
            3 -> "어느 정도 숙련된 단계"
            4 -> "전문적인 지식이 필요한 단계"
            5 -> "마스터 레벨의 고난도 단계"
            else -> "알 수 없는 난이도"
        }
    
    val color: String
        get() = when (level) {
            1 -> "#4CAF50"
            2 -> "#8BC34A"
            3 -> "#FF9800"
            4 -> "#FF5722"
            5 -> "#9C27B0"
            else -> "#9E9E9E"
        }
    
    val requiredScore: Int
        get() = when (level) {
            1 -> 0
            2 -> 60
            3 -> 70
            4 -> 80
            5 -> 90
            else -> 0
        }
    
    fun isBeginnerLevel(): Boolean = level <= 2
    fun isIntermediateLevel(): Boolean = level in 2..4
    fun isAdvancedLevel(): Boolean = level >= 4
    
    fun canProgressTo(targetDifficulty: Difficulty): Boolean {
        return targetDifficulty.level <= this.level + 1
    }
    
    fun nextLevel(): Difficulty? {
        return if (level < 5) of(level + 1) else null
    }
    
    fun previousLevel(): Difficulty? {
        return if (level > 1) of(level - 1) else null
    }
    
    override fun compareTo(other: Difficulty): Int = level.compareTo(other.level)
}