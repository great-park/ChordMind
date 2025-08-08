package com.chordmind.harmony.domain.entity

import jakarta.persistence.*

/**
 * 퀴즈 선택지 도메인 모델 (Value Object 성격)
 * 주의: JPA 엔티티가 아니며, 영속성 매핑 대상이 아님
 */
class QuizChoice private constructor(
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false, length = 200)
    val text: String,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    val question: QuizQuestion,

    @Column(name = "display_order")
    val displayOrder: Int = 0,

    @Column(name = "is_distractor")
    val isDistractor: Boolean = true  // 오답 선택지인지 여부
) {
    
    val isCorrect: Boolean
        get() = question.isCorrectAnswer(text)
    
    val trimmedText: String
        get() = text.trim()
    
    val length: Int
        get() = text.length
    
    val wordCount: Int
        get() = text.split("\\s+".toRegex()).size
    
    /**
     * 선택지 텍스트 검증
     */
    fun validate(): ValidationResult {
        val errors = mutableListOf<String>()
        
        if (text.isBlank()) {
            errors.add("선택지 내용은 필수입니다")
        }
        
        if (text.length > MAX_LENGTH) {
            errors.add("선택지는 ${MAX_LENGTH}자를 초과할 수 없습니다")
        }
        
        if (text.length < MIN_LENGTH) {
            errors.add("선택지는 최소 ${MIN_LENGTH}자 이상이어야 합니다")
        }
        
        return if (errors.isEmpty()) ValidationResult.success()
               else ValidationResult.failure(errors)
    }
    
    /**
     * 다른 선택지와의 유사도 검사
     */
    fun isSimilarTo(other: QuizChoice, threshold: Double = 0.8): Boolean {
        return calculateSimilarity(this.text, other.text) >= threshold
    }
    
    /**
     * 선택지 품질 평가
     */
    fun getQuality(): ChoiceQuality {
        return when {
            isCorrect -> ChoiceQuality.CORRECT
            text.length < 3 -> ChoiceQuality.TOO_SHORT
            text.length > 50 -> ChoiceQuality.TOO_LONG
            wordCount > 5 -> ChoiceQuality.TOO_COMPLEX
            else -> ChoiceQuality.GOOD
        }
    }
    
    private fun calculateSimilarity(text1: String, text2: String): Double {
        // 간단한 유사도 계산 (실제로는 더 정교한 알고리즘 사용)
        val words1 = text1.lowercase().split("\\s+".toRegex()).toSet()
        val words2 = text2.lowercase().split("\\s+".toRegex()).toSet()
        val intersection = words1.intersect(words2).size
        val union = words1.union(words2).size
        return if (union == 0) 0.0 else intersection.toDouble() / union
    }
    
    companion object {
        const val MIN_LENGTH = 1
        const val MAX_LENGTH = 200
        
        /**
         * 팩토리 메서드
         */
        fun of(
            text: String, 
            question: QuizQuestion, 
            displayOrder: Int = 0
        ): QuizChoice {
            require(text.isNotBlank()) { "선택지 내용은 필수입니다" }
            require(text.length <= MAX_LENGTH) { 
                "선택지는 ${MAX_LENGTH}자를 초과할 수 없습니다" 
            }
            
            val isDistractor = !question.isCorrectAnswer(text)
            
            return QuizChoice(
                text = text.trim(),
                question = question,
                displayOrder = displayOrder,
                isDistractor = isDistractor
            )
        }
        
        /**
         * 선택지 목록 생성 도우미
         */
        fun createChoices(
            texts: List<String>, 
            question: QuizQuestion
        ): List<QuizChoice> {
            require(texts.isNotEmpty()) { "선택지 목록은 비어있을 수 없습니다" }
            require(texts.distinct().size == texts.size) { "중복된 선택지가 있습니다" }
            
            return texts.mapIndexed { index, text ->
                of(text, question, index)
            }
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
    
    enum class ChoiceQuality(val displayName: String) {
        CORRECT("정답"),
        GOOD("좋은 오답"),
        TOO_SHORT("너무 짧음"),
        TOO_LONG("너무 긺"),
        TOO_COMPLEX("너무 복잡함")
    }
}