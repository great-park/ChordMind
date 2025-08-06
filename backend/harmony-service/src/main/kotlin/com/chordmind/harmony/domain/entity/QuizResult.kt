package com.chordmind.harmony.domain.entity

import com.chordmind.harmony.domain.value.Score
import jakarta.persistence.*
import java.time.LocalDateTime
import java.time.temporal.ChronoUnit

/**
 * 퀴즈 결과 엔티티 (Rich Domain Model)
 * 학습 분석과 개인화를 위한 풍부한 도메인 로직 포함
 */
@Entity
@Table(name = "quiz_result")
class QuizResult private constructor(
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(name = "user_id", nullable = false)
    val userId: Long,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    val question: QuizQuestion,

    @Column(nullable = false)
    val selectedAnswer: String,

    @Column(nullable = false)
    val isCorrect: Boolean,

    @Column(name = "answered_at", nullable = false)
    val answeredAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "time_taken_seconds")
    val timeTakenSeconds: Int? = null,

    @Embedded
    @AttributeOverrides(
        AttributeOverride(name = "value", column = Column(name = "score_value")),
        AttributeOverride(name = "maxValue", column = Column(name = "score_max_value"))
    )
    val score: Score? = null,

    @Column(name = "hint_used")
    val hintUsed: Boolean = false,

    @Column(name = "attempt_count")
    val attemptCount: Int = 1,

    @Enumerated(EnumType.STRING)
    @Column(name = "confidence_level")
    val confidenceLevel: ConfidenceLevel? = null
) {
    
    val responseTime: ResponseTime?
        get() = timeTakenSeconds?.let { ResponseTime.fromSeconds(it) }
    
    val isQuickResponse: Boolean
        get() = timeTakenSeconds?.let { it <= QUICK_RESPONSE_THRESHOLD } ?: false
    
    val isSlowResponse: Boolean
        get() = timeTakenSeconds?.let { it >= SLOW_RESPONSE_THRESHOLD } ?: false
    
    val effectiveScore: Score
        get() = score ?: if (isCorrect) Score.perfect() else Score.zero()
    
    val masteryLevel: MasteryLevel
        get() = when {
            !isCorrect -> MasteryLevel.NOT_MASTERED
            isQuickResponse && !hintUsed -> MasteryLevel.MASTERED
            isCorrect && !hintUsed -> MasteryLevel.LEARNING
            else -> MasteryLevel.STRUGGLING
        }
    
    val isReliableResult: Boolean
        get() = !hintUsed && attemptCount == 1
    
    /**
     * 문제 난이도 대비 성과 분석
     */
    fun getPerformanceRating(): PerformanceRating {
        val difficulty = question.difficulty.level
        
        return when {
            !isCorrect -> when {
                difficulty <= 2 -> PerformanceRating.POOR
                difficulty <= 3 -> PerformanceRating.EXPECTED
                else -> PerformanceRating.ACCEPTABLE
            }
            isQuickResponse && !hintUsed -> when {
                difficulty >= 4 -> PerformanceRating.EXCEPTIONAL
                difficulty >= 3 -> PerformanceRating.EXCELLENT
                else -> PerformanceRating.GOOD
            }
            isCorrect && !hintUsed -> PerformanceRating.GOOD
            else -> PerformanceRating.FAIR
        }
    }
    
    /**
     * 학습 패턴 분석
     */
    fun getLearningPattern(): LearningPattern {
        return when {
            isCorrect && isQuickResponse -> LearningPattern.INTUITIVE
            isCorrect && isSlowResponse -> LearningPattern.ANALYTICAL
            !isCorrect && isQuickResponse -> LearningPattern.IMPULSIVE
            !isCorrect && isSlowResponse -> LearningPattern.STRUGGLING
            else -> LearningPattern.NORMAL
        }
    }
    
    /**
     * 다음 추천 난이도 계산
     */
    fun getRecommendedNextDifficulty(): Int {
        val currentDifficulty = question.difficulty.level
        
        return when (getPerformanceRating()) {
            PerformanceRating.EXCEPTIONAL, PerformanceRating.EXCELLENT -> 
                (currentDifficulty + 1).coerceAtMost(5)
            PerformanceRating.POOR -> 
                (currentDifficulty - 1).coerceAtLeast(1)
            else -> currentDifficulty
        }
    }
    
    /**
     * 시간 경과에 따른 결과의 신뢰도
     */
    fun getReliabilityScore(): Double {
        val daysSinceAnswer = ChronoUnit.DAYS.between(answeredAt, LocalDateTime.now())
        val baseReliability = if (isReliableResult) 1.0 else 0.7
        val timeDecay = (daysSinceAnswer / 30.0).coerceAtMost(0.5) // 30일 후 50% 감소
        
        return (baseReliability - timeDecay).coerceAtLeast(0.1)
    }
    
    companion object {
        const val QUICK_RESPONSE_THRESHOLD = 10  // 10초 이내
        const val SLOW_RESPONSE_THRESHOLD = 60   // 60초 이상
        
        /**
         * 팩토리 메서드 - 기본 결과 생성
         */
        fun create(
            userId: Long,
            question: QuizQuestion,
            selectedAnswer: String,
            timeTakenSeconds: Int? = null,
            hintUsed: Boolean = false,
            attemptCount: Int = 1,
            confidenceLevel: ConfidenceLevel? = null
        ): QuizResult {
            val isCorrect = question.isCorrectAnswer(selectedAnswer)
            val score = calculateScore(isCorrect, question.difficulty.level, timeTakenSeconds, hintUsed)
            
            return QuizResult(
                userId = userId,
                question = question,
                selectedAnswer = selectedAnswer.trim(),
                isCorrect = isCorrect,
                timeTakenSeconds = timeTakenSeconds,
                score = score,
                hintUsed = hintUsed,
                attemptCount = attemptCount,
                confidenceLevel = confidenceLevel
            )
        }
        
        private fun calculateScore(
            isCorrect: Boolean,
            difficulty: Int,
            timeTaken: Int?,
            hintUsed: Boolean
        ): Score {
            if (!isCorrect) return Score.zero()
            
            var baseScore = difficulty * 20  // 난이도별 기본 점수
            
            // 시간 보너스
            timeTaken?.let { time ->
                when {
                    time <= QUICK_RESPONSE_THRESHOLD -> baseScore += 10
                    time >= SLOW_RESPONSE_THRESHOLD -> baseScore -= 5
                }
            }
            
            // 힌트 사용 패널티
            if (hintUsed) baseScore -= 10
            
            return Score.of(baseScore.coerceAtLeast(1))
        }
    }
    
    enum class ConfidenceLevel(val displayName: String) {
        VERY_CONFIDENT("매우 확신"),
        CONFIDENT("확신"),
        UNCERTAIN("불확실"),
        GUESSING("추측")
    }
    
    enum class MasteryLevel(val displayName: String, val description: String) {
        MASTERED("숙달", "완벽하게 이해하고 있음"),
        LEARNING("학습중", "개념을 이해하고 있지만 연습 필요"),
        STRUGGLING("어려움", "개념 이해에 어려움을 겪고 있음"),
        NOT_MASTERED("미숙달", "아직 이해하지 못함")
    }
    
    enum class PerformanceRating(val displayName: String) {
        EXCEPTIONAL("탁월"),
        EXCELLENT("우수"),
        GOOD("양호"),
        FAIR("보통"),
        ACCEPTABLE("수용가능"),
        EXPECTED("예상범위"),
        POOR("미흡")
    }
    
    enum class LearningPattern(val displayName: String, val description: String) {
        INTUITIVE("직관형", "빠르게 정답을 도출"),
        ANALYTICAL("분석형", "신중하게 생각하여 정답 도출"),
        IMPULSIVE("성급형", "충분히 생각하지 않고 응답"),
        STRUGGLING("고민형", "오랜 시간 고민했지만 틀림"),
        NORMAL("일반형", "평균적인 응답 패턴")
    }
    
    data class ResponseTime(
        val seconds: Int
    ) {
        val isQuick: Boolean = seconds <= QUICK_RESPONSE_THRESHOLD
        val isSlow: Boolean = seconds >= SLOW_RESPONSE_THRESHOLD
        val category: String = when {
            isQuick -> "빠름"
            isSlow -> "느림"
            else -> "보통"
        }
        
        companion object {
            fun fromSeconds(seconds: Int): ResponseTime = ResponseTime(seconds)
        }
    }
}