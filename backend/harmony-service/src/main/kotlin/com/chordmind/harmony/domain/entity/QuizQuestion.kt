package com.chordmind.harmony.domain.entity

import com.chordmind.harmony.domain.enum.QuizType
import com.chordmind.harmony.domain.value.Difficulty
import com.chordmind.harmony.domain.value.QuestionText
import jakarta.persistence.*
import java.time.LocalDateTime

/**
 * 퀴즈 문제 도메인 모델 (Rich Domain Model)
 * 주의: JPA 엔티티가 아니며, 영속성 매핑 대상이 아님
 */
class QuizQuestion private constructor(
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val type: QuizType,

    @Embedded
    val questionText: QuestionText,

    @Column(name = "image_url")
    val imageUrl: String? = null,

    @Column(nullable = false)
    val answer: String,

    @Column(columnDefinition = "TEXT")
    val explanation: String? = null,

    @Embedded
    val difficulty: Difficulty,

    @OneToMany(mappedBy = "question", cascade = [CascadeType.ALL], fetch = FetchType.EAGER, orphanRemoval = true)
    private val _choices: MutableList<QuizChoice> = mutableListOf(),

    @Column(name = "created_at")
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "updated_at")
    val updatedAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "is_active")
    val isActive: Boolean = true,

    @Column(name = "usage_count")
    private var _usageCount: Long = 0
) {
    
    // 불변 컬렉션으로 노출
    val choices: List<QuizChoice> 
        get() = _choices.toList()
    
    val usageCount: Long
        get() = _usageCount
    
    val isMultipleChoice: Boolean
        get() = _choices.size > 1
    
    val hasImage: Boolean
        get() = !imageUrl.isNullOrBlank()
    
    val hasExplanation: Boolean
        get() = !explanation.isNullOrBlank()
    
    val isPopular: Boolean
        get() = _usageCount > POPULAR_THRESHOLD
    
    val effectiveDifficulty: Double
        get() = if (_usageCount == 0L) difficulty.level.toDouble()
               else calculateActualDifficulty()
    
    /**
     * 선택지 추가 (도메인 규칙 적용)
     */
    fun addChoice(choiceText: String): QuizQuestion {
        require(choiceText.isNotBlank()) { "선택지 내용은 필수입니다" }
        require(_choices.size < MAX_CHOICES) { "선택지는 최대 ${MAX_CHOICES}개까지 가능합니다" }
        require(_choices.none { it.text.equals(choiceText, ignoreCase = true) }) { 
            "중복된 선택지가 있습니다: $choiceText" 
        }
        
        val choice = QuizChoice.of(choiceText, this)
        _choices.add(choice)
        return this
    }
    
    /**
     * 정답 검증
     */
    fun isCorrectAnswer(userAnswer: String): Boolean {
        return answer.equals(userAnswer.trim(), ignoreCase = true)
    }
    
    /**
     * 사용 횟수 증가
     */
    fun incrementUsage(): QuizQuestion {
        _usageCount++
        return this
    }
    
    /**
     * 선택지 유효성 검증
     */
    fun validateChoices(): ValidationResult {
        val errors = mutableListOf<String>()
        
        if (_choices.isEmpty()) {
            errors.add("선택지가 필요합니다")
        }
        
        if (_choices.size < MIN_CHOICES) {
            errors.add("선택지는 최소 ${MIN_CHOICES}개 이상이어야 합니다")
        }
        
        if (!_choices.any { it.text.equals(answer, ignoreCase = true) }) {
            errors.add("정답이 선택지에 포함되어야 합니다")
        }
        
        return if (errors.isEmpty()) ValidationResult.success()
               else ValidationResult.failure(errors)
    }
    
    /**
     * 문제 복제 (새로운 인스턴스 생성)
     */
    fun copy(
        newQuestionText: String? = null,
        newAnswer: String? = null,
        newDifficulty: Difficulty? = null
    ): QuizQuestion {
        val question = QuizQuestion(
            type = this.type,
            questionText = newQuestionText?.let { QuestionText.of(it) } ?: this.questionText,
            imageUrl = this.imageUrl,
            answer = newAnswer ?: this.answer,
            explanation = this.explanation,
            difficulty = newDifficulty ?: this.difficulty
        )
        
        _choices.forEach { choice ->
            question.addChoice(choice.text)
        }
        
        return question
    }
    
    /**
     * 실제 정답률 기반 난이도 계산
     */
    private fun calculateActualDifficulty(): Double {
        // 실제 구현에서는 정답률 통계를 활용
        // 현재는 사용 횟수 기반 근사치
        val popularityFactor = (_usageCount.toDouble() / 1000).coerceAtMost(1.0)
        return difficulty.level + (popularityFactor * 0.5)
    }
    
    companion object {
        const val MIN_CHOICES = 2
        const val MAX_CHOICES = 10
        const val POPULAR_THRESHOLD = 100L
        
        /**
         * 팩토리 메서드 - 기본 문제 생성
         */
        fun create(
            type: QuizType,
            questionText: String,
            answer: String,
            difficulty: Difficulty,
            imageUrl: String? = null,
            explanation: String? = null
        ): QuizQuestion {
            require(questionText.isNotBlank()) { "문제 내용은 필수입니다" }
            require(answer.isNotBlank()) { "정답은 필수입니다" }
            require(type.isAvailableForDifficulty(difficulty.level)) { 
                "해당 문제 유형에서는 난이도 ${difficulty.level}을 사용할 수 없습니다" 
            }
            
            return QuizQuestion(
                type = type,
                questionText = QuestionText.of(questionText),
                imageUrl = imageUrl,
                answer = answer.trim(),
                explanation = explanation,
                difficulty = difficulty
            )
        }
        
        /**
         * 팩토리 메서드 - 객관식 문제 생성
         */
        fun createMultipleChoice(
            type: QuizType,
            questionText: String,
            answer: String,
            choices: List<String>,
            difficulty: Difficulty,
            imageUrl: String? = null,
            explanation: String? = null
        ): QuizQuestion {
            require(choices.isNotEmpty()) { "선택지는 최소 1개 이상이어야 합니다" }
            require(choices.contains(answer)) { "정답이 선택지에 포함되어야 합니다" }
            
            val question = create(type, questionText, answer, difficulty, imageUrl, explanation)
            choices.forEach { choice ->
                question.addChoice(choice)
            }
            
            return question
        }
    }
    
    data class ValidationResult(
        val isValid: Boolean,
        val errors: List<String>
    ) {
        companion object {
            fun success(): ValidationResult = ValidationResult(true, emptyList())
            fun failure(errors: List<String>): ValidationResult = ValidationResult(false, errors)
        }
    }
}