package com.chordmind.harmony.domain.specification

import com.chordmind.harmony.domain.entity.QuizQuestion
import com.chordmind.harmony.domain.enum.QuizType
import com.chordmind.harmony.domain.value.Difficulty

/**
 * 퀴즈 문제 명세 인터페이스 (Specification Pattern)
 * 비즈니스 규칙을 객체로 캡슐화
 */
interface QuizSpecification {
    fun isSatisfiedBy(question: QuizQuestion): Boolean
    fun and(other: QuizSpecification): QuizSpecification = AndSpecification(this, other)
    fun or(other: QuizSpecification): QuizSpecification = OrSpecification(this, other)
    fun not(): QuizSpecification = NotSpecification(this)
}

/**
 * 논리 연산자 구현
 */
class AndSpecification(
    private val left: QuizSpecification,
    private val right: QuizSpecification
) : QuizSpecification {
    override fun isSatisfiedBy(question: QuizQuestion): Boolean {
        return left.isSatisfiedBy(question) && right.isSatisfiedBy(question)
    }
}

class OrSpecification(
    private val left: QuizSpecification,
    private val right: QuizSpecification
) : QuizSpecification {
    override fun isSatisfiedBy(question: QuizQuestion): Boolean {
        return left.isSatisfiedBy(question) || right.isSatisfiedBy(question)
    }
}

class NotSpecification(
    private val spec: QuizSpecification
) : QuizSpecification {
    override fun isSatisfiedBy(question: QuizQuestion): Boolean {
        return !spec.isSatisfiedBy(question)
    }
}

/**
 * 기본 명세 구현들
 */

/**
 * 퀴즈 타입 명세
 */
class QuizTypeSpecification(private val type: QuizType) : QuizSpecification {
    override fun isSatisfiedBy(question: QuizQuestion): Boolean {
        return question.type == type
    }
}

/**
 * 난이도 범위 명세
 */
class DifficultyRangeSpecification(
    private val minLevel: Int,
    private val maxLevel: Int
) : QuizSpecification {
    override fun isSatisfiedBy(question: QuizQuestion): Boolean {
        return question.difficulty.level in minLevel..maxLevel
    }
}

/**
 * 최대 난이도 명세
 */
class MaxDifficultySpecification(private val maxLevel: Int) : QuizSpecification {
    override fun isSatisfiedBy(question: QuizQuestion): Boolean {
        return question.difficulty.level <= maxLevel
    }
}

/**
 * 활성 상태 명세
 */
class ActiveQuestionSpecification : QuizSpecification {
    override fun isSatisfiedBy(question: QuizQuestion): Boolean {
        return question.isActive
    }
}

/**
 * 객관식 문제 명세
 */
class MultipleChoiceSpecification : QuizSpecification {
    override fun isSatisfiedBy(question: QuizQuestion): Boolean {
        return question.isMultipleChoice
    }
}

/**
 * 이미지 포함 명세
 */
class HasImageSpecification : QuizSpecification {
    override fun isSatisfiedBy(question: QuizQuestion): Boolean {
        return question.hasImage
    }
}

/**
 * 설명 포함 명세
 */
class HasExplanationSpecification : QuizSpecification {
    override fun isSatisfiedBy(question: QuizQuestion): Boolean {
        return question.hasExplanation
    }
}

/**
 * 인기 문제 명세
 */
class PopularQuestionSpecification : QuizSpecification {
    override fun isSatisfiedBy(question: QuizQuestion): Boolean {
        return question.isPopular
    }
}

/**
 * 초보자용 문제 명세
 */
class BeginnerFriendlySpecification : QuizSpecification {
    override fun isSatisfiedBy(question: QuizQuestion): Boolean {
        return question.difficulty.isBeginnerLevel() && 
               question.type.isAvailableForDifficulty(question.difficulty.level) &&
               question.choices.size <= 4  // 선택지 4개 이하
    }
}

/**
 * 고급 문제 명세
 */
class AdvancedQuestionSpecification : QuizSpecification {
    override fun isSatisfiedBy(question: QuizQuestion): Boolean {
        return question.difficulty.isAdvancedLevel() &&
               question.hasExplanation  // 고급 문제는 설명 필수
    }
}

/**
 * 퀴즈 품질 명세
 */
class HighQualityQuestionSpecification : QuizSpecification {
    override fun isSatisfiedBy(question: QuizQuestion): Boolean {
        val validation = question.validateChoices()
        return validation.isValid &&
               question.hasExplanation &&
               question.choices.size >= 3 &&
               question.questionText.content.length >= 20
    }
}

/**
 * 적응형 학습 적합 명세
 */
class AdaptiveLearningSpecification(
    private val userDifficulty: Difficulty,
    private val allowVariance: Int = 1
) : QuizSpecification {
    override fun isSatisfiedBy(question: QuizQuestion): Boolean {
        val levelDiff = kotlin.math.abs(question.difficulty.level - userDifficulty.level)
        return levelDiff <= allowVariance && question.isActive
    }
}

/**
 * 학습 목표 달성 명세
 */
class LearningObjectiveSpecification(
    private val targetTypes: List<QuizType>,
    private val minDifficulty: Difficulty,
    private val requireExplanation: Boolean = true
) : QuizSpecification {
    override fun isSatisfiedBy(question: QuizQuestion): Boolean {
        return question.type in targetTypes &&
               question.difficulty >= minDifficulty &&
               (!requireExplanation || question.hasExplanation)
    }
}

/**
 * 시간 제한 적합 명세
 */
class TimeLimitSpecification(private val maxTimeMinutes: Int) : QuizSpecification {
    override fun isSatisfiedBy(question: QuizQuestion): Boolean {
        return question.type.estimatedTimeMinutes <= maxTimeMinutes
    }
}

/**
 * 접근성 명세 (장애인 접근성 고려)
 */
class AccessibilitySpecification : QuizSpecification {
    override fun isSatisfiedBy(question: QuizQuestion): Boolean {
        return !question.type.isInteractive ||  // 비상호작용 문제이거나
               question.hasExplanation           // 상호작용 문제면 설명 필수
    }
}

/**
 * 명세 팩토리 및 편의 메서드
 */
object QuizSpecifications {
    
    fun ofType(type: QuizType): QuizSpecification = QuizTypeSpecification(type)
    
    fun maxDifficulty(level: Int): QuizSpecification = MaxDifficultySpecification(level)
    
    fun difficultyRange(min: Int, max: Int): QuizSpecification = 
        DifficultyRangeSpecification(min, max)
    
    fun active(): QuizSpecification = ActiveQuestionSpecification()
    
    fun multipleChoice(): QuizSpecification = MultipleChoiceSpecification()
    
    fun hasImage(): QuizSpecification = HasImageSpecification()
    
    fun hasExplanation(): QuizSpecification = HasExplanationSpecification()
    
    fun popular(): QuizSpecification = PopularQuestionSpecification()
    
    fun beginnerFriendly(): QuizSpecification = BeginnerFriendlySpecification()
    
    fun advanced(): QuizSpecification = AdvancedQuestionSpecification()
    
    fun highQuality(): QuizSpecification = HighQualityQuestionSpecification()
    
    fun adaptiveFor(userDifficulty: Difficulty): QuizSpecification = 
        AdaptiveLearningSpecification(userDifficulty)
    
    fun learningObjective(
        types: List<QuizType>,
        minDifficulty: Difficulty,
        requireExplanation: Boolean = true
    ): QuizSpecification = LearningObjectiveSpecification(types, minDifficulty, requireExplanation)
    
    fun withinTimeLimit(maxMinutes: Int): QuizSpecification = TimeLimitSpecification(maxMinutes)
    
    fun accessible(): QuizSpecification = AccessibilitySpecification()
    
    /**
     * 조합 명세 생성기
     */
    fun forBeginnerPractice(): QuizSpecification {
        return beginnerFriendly()
            .and(active())
            .and(multipleChoice())
            .and(hasExplanation())
    }
    
    fun forAdvancedAssessment(): QuizSpecification {
        return advanced()
            .and(active())
            .and(highQuality())
            .and(hasExplanation())
    }
    
    fun forQuickReview(maxMinutes: Int = 2): QuizSpecification {
        return active()
            .and(withinTimeLimit(maxMinutes))
            .and(multipleChoice())
            .and(difficultyRange(1, 3))
    }
    
    fun forAdaptiveLearning(
        userDifficulty: Difficulty,
        targetTypes: List<QuizType>
    ): QuizSpecification {
        return adaptiveFor(userDifficulty)
            .and(active())
            .and(targetTypes.map { ofType(it) }.reduce { acc, spec -> acc.or(spec) })
            .and(multipleChoice())
    }
    
    fun forAccessibleLearning(): QuizSpecification {
        return accessible()
            .and(active())
            .and(hasExplanation())
            .and(multipleChoice())
    }
    
    fun forComprehensiveAssessment(): QuizSpecification {
        return active()
            .and(highQuality())
            .and(hasExplanation())
            .and(difficultyRange(1, 5))
    }
}

/**
 * 명세 기반 필터링을 위한 확장 함수
 */
fun List<QuizQuestion>.satisfying(spec: QuizSpecification): List<QuizQuestion> {
    return this.filter { spec.isSatisfiedBy(it) }
}

fun List<QuizQuestion>.count(spec: QuizSpecification): Int {
    return this.count { spec.isSatisfiedBy(it) }
}

fun List<QuizQuestion>.any(spec: QuizSpecification): Boolean {
    return this.any { spec.isSatisfiedBy(it) }
}

fun List<QuizQuestion>.all(spec: QuizSpecification): Boolean {
    return this.all { spec.isSatisfiedBy(it) }
}