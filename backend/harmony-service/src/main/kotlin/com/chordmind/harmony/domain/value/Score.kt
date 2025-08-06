package com.chordmind.harmony.domain.value

import jakarta.persistence.Embeddable
import kotlin.math.round

/**
 * 점수 값 객체
 * 점수 계산과 등급 변환 로직을 포함
 */
@Embeddable
data class Score private constructor(
    val value: Int,
    val maxValue: Int = DEFAULT_MAX_VALUE
) : Comparable<Score> {
    
    init {
        require(value >= 0) { "점수는 0 이상이어야 합니다. 현재 값: $value" }
        require(value <= maxValue) { "점수는 최대값($maxValue)을 초과할 수 없습니다. 현재 값: $value" }
        require(maxValue > 0) { "최대값은 0보다 커야 합니다. 현재 값: $maxValue" }
    }
    
    val percentage: Double
        get() = if (maxValue == 0) 0.0 else (value.toDouble() / maxValue * 100)
    
    val roundedPercentage: Int
        get() = round(percentage).toInt()
    
    val grade: Grade
        get() = when {
            percentage >= 90 -> Grade.A
            percentage >= 80 -> Grade.B
            percentage >= 70 -> Grade.C
            percentage >= 60 -> Grade.D
            else -> Grade.F
        }
    
    val isPassing: Boolean
        get() = percentage >= PASSING_THRESHOLD
    
    val isExcellent: Boolean
        get() = percentage >= EXCELLENT_THRESHOLD
    
    val isPerfect: Boolean
        get() = value == maxValue
    
    fun add(points: Int): Score = of(value + points, maxValue)
    fun subtract(points: Int): Score = of((value - points).coerceAtLeast(0), maxValue)
    
    fun scaleToMax(newMaxValue: Int): Score {
        val scaledValue = if (maxValue == 0) 0 else ((value.toDouble() / maxValue) * newMaxValue).toInt()
        return of(scaledValue, newMaxValue)
    }
    
    override fun compareTo(other: Score): Int {
        return percentage.compareTo(other.percentage)
    }
    
    companion object {
        const val DEFAULT_MAX_VALUE = 100
        const val PASSING_THRESHOLD = 60.0
        const val EXCELLENT_THRESHOLD = 90.0
        
        fun of(value: Int, maxValue: Int = DEFAULT_MAX_VALUE): Score = Score(value, maxValue)
        fun zero(maxValue: Int = DEFAULT_MAX_VALUE): Score = Score(0, maxValue)
        fun perfect(maxValue: Int = DEFAULT_MAX_VALUE): Score = Score(maxValue, maxValue)
        
        fun fromPercentage(percentage: Double, maxValue: Int = DEFAULT_MAX_VALUE): Score {
            val value = (percentage / 100 * maxValue).toInt().coerceIn(0, maxValue)
            return of(value, maxValue)
        }
    }
    
    enum class Grade(val displayName: String, val description: String) {
        A("A", "우수"),
        B("B", "양호"),
        C("C", "보통"),
        D("D", "미흡"),
        F("F", "재학습 필요")
    }
}