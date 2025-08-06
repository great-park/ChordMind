package com.chordmind.harmony.domain.factory

import com.chordmind.harmony.domain.entity.QuizQuestion
import com.chordmind.harmony.domain.enum.QuizType
import com.chordmind.harmony.domain.value.Difficulty
import org.springframework.stereotype.Component
import kotlin.math.*

/**
 * 퀴즈 문제 생성 팩토리 (Factory Pattern)
 * 복잡한 퀴즈 문제 생성 로직을 캡슐화
 */
@Component
class QuizQuestionFactory {
    
    /**
     * 타입별 최적화된 퀴즈 문제 생성
     */
    fun createOptimizedQuestion(
        type: QuizType,
        difficulty: Difficulty,
        config: QuizConfig = QuizConfig.default()
    ): QuizQuestionBuilder {
        return when (type) {
            QuizType.CHORD_NAME -> createChordQuestion(difficulty, config)
            QuizType.PROGRESSION -> createProgressionQuestion(difficulty, config)
            QuizType.INTERVAL -> createIntervalQuestion(difficulty, config)
            QuizType.SCALE -> createScaleQuestion(difficulty, config)
        }
    }
    
    /**
     * 적응형 퀴즈 문제 생성 (사용자 성과 기반)
     */
    fun createAdaptiveQuestion(
        type: QuizType,
        userPerformance: UserPerformance,
        config: QuizConfig = QuizConfig.default()
    ): QuizQuestionBuilder {
        val adaptedDifficulty = calculateAdaptiveDifficulty(userPerformance, type)
        val adaptedConfig = adaptConfigForUser(config, userPerformance)
        
        return createOptimizedQuestion(type, adaptedDifficulty, adaptedConfig)
            .withAdaptiveFeatures(userPerformance)
    }
    
    /**
     * 시리즈 퀴즈 문제 생성 (점진적 난이도 증가)
     */
    fun createQuizSeries(
        type: QuizType,
        count: Int,
        startDifficulty: Difficulty = Difficulty.beginner(),
        progressionType: ProgressionType = ProgressionType.LINEAR
    ): List<QuizQuestionBuilder> {
        require(count > 0) { "문제 개수는 1개 이상이어야 합니다" }
        
        return (0 until count).map { index ->
            val difficulty = calculateSeriesDifficulty(startDifficulty, index, count, progressionType)
            val config = createSeriesConfig(index, count, type)
            createOptimizedQuestion(type, difficulty, config)
        }
    }
    
    /**
     * 테마별 퀴즈 문제 생성
     */
    fun createThemedQuestions(
        theme: QuizTheme,
        count: Int,
        targetDifficulty: Difficulty = Difficulty.intermediate()
    ): List<QuizQuestionBuilder> {
        val types = theme.getRelevantTypes()
        val questionsPerType = count / types.size
        val remainder = count % types.size
        
        return types.flatMapIndexed { index, type ->
            val typeCount = questionsPerType + if (index < remainder) 1 else 0
            val config = theme.getConfigForType(type)
            
            (0 until typeCount).map {
                createOptimizedQuestion(type, targetDifficulty, config)
                    .withTheme(theme)
            }
        }
    }
    
    private fun createChordQuestion(difficulty: Difficulty, config: QuizConfig): QuizQuestionBuilder {
        val template = when (difficulty.level) {
            1, 2 -> "다음 코드의 이름은 무엇인가요? 🎵"
            3, 4 -> "다음 화음의 정확한 명칭은 무엇인가요? 🎹"
            else -> "이 복합 화음의 코드 네임을 분석해보세요. 🎼"
        }
        
        return QuizQuestionBuilder()
            .type(QuizType.CHORD_NAME)
            .questionTemplate(template)
            .difficulty(difficulty)
            .choiceCount(config.choiceCount)
            .withMusicContext(config.includeContext)
    }
    
    private fun createProgressionQuestion(difficulty: Difficulty, config: QuizConfig): QuizQuestionBuilder {
        val template = when (difficulty.level) {
            1, 2 -> "다음 화성 진행의 이름은 무엇인가요? 🎼"
            3, 4 -> "이 화성 진행 패턴을 분석해보세요. 🎵"
            else -> "복잡한 화성 진행의 구조를 파악해보세요. 🎹"
        }
        
        return QuizQuestionBuilder()
            .type(QuizType.PROGRESSION)
            .questionTemplate(template)
            .difficulty(difficulty)
            .choiceCount(config.choiceCount)
            .withProgressionContext(config.includeGenre)
    }
    
    private fun createIntervalQuestion(difficulty: Difficulty, config: QuizConfig): QuizQuestionBuilder {
        val template = when (difficulty.level) {
            1, 2 -> "다음 음정의 이름은 무엇인가요? 🎶"
            3, 4 -> "이 음정의 정확한 명칭과 성격은? 🎼"
            else -> "복합 음정의 특성을 분석해보세요. 🎵"
        }
        
        return QuizQuestionBuilder()
            .type(QuizType.INTERVAL)
            .questionTemplate(template)
            .difficulty(difficulty)
            .choiceCount(config.choiceCount)
            .withIntervalContext(config.includeQuality)
    }
    
    private fun createScaleQuestion(difficulty: Difficulty, config: QuizConfig): QuizQuestionBuilder {
        val template = when (difficulty.level) {
            1, 2 -> "다음 스케일의 이름은 무엇인가요? 🎹"
            3, 4 -> "이 음계의 종류와 특성은? 🎵"
            else -> "복잡한 음계 구조를 분석해보세요. 🎼"
        }
        
        return QuizQuestionBuilder()
            .type(QuizType.SCALE)
            .questionTemplate(template)
            .difficulty(difficulty)
            .choiceCount(config.choiceCount)
            .withScaleContext(config.includeMode)
    }
    
    private fun calculateAdaptiveDifficulty(performance: UserPerformance, type: QuizType): Difficulty {
        val baseLevel = performance.getAverageLevel(type)
        val trend = performance.getRecentTrend(type)
        val confidence = performance.getConfidenceLevel(type)
        
        val adjustedLevel = when {
            trend > 0.7 && confidence > 0.8 -> baseLevel + 1
            trend < -0.3 || confidence < 0.5 -> (baseLevel - 1).coerceAtLeast(1)
            else -> baseLevel
        }.coerceIn(1, 5)
        
        return Difficulty.of(adjustedLevel)
    }
    
    private fun adaptConfigForUser(config: QuizConfig, performance: UserPerformance): QuizConfig {
        return config.copy(
            choiceCount = when {
                performance.accuracy < 0.6 -> (config.choiceCount - 1).coerceAtLeast(3)
                performance.accuracy > 0.9 -> (config.choiceCount + 1).coerceAtMost(6)
                else -> config.choiceCount
            },
            includeHints = performance.accuracy < 0.7,
            timeLimit = when {
                performance.averageResponseTime < 10 -> config.timeLimit - 5
                performance.averageResponseTime > 30 -> config.timeLimit + 10
                else -> config.timeLimit
            }
        )
    }
    
    private fun calculateSeriesDifficulty(
        start: Difficulty,
        index: Int,
        total: Int,
        progression: ProgressionType
    ): Difficulty {
        val progress = index.toDouble() / (total - 1)
        
        val levelIncrease = when (progression) {
            ProgressionType.LINEAR -> progress * 2
            ProgressionType.EXPONENTIAL -> (progress * progress) * 3
            ProgressionType.LOGARITHMIC -> ln(1 + progress) / ln(2.0) * 2
            ProgressionType.STEPPED -> (progress * 4).toInt().toDouble() / 2
        }
        
        val newLevel = (start.level + levelIncrease).toInt().coerceIn(1, 5)
        return Difficulty.of(newLevel)
    }
    
    private fun createSeriesConfig(index: Int, total: Int, type: QuizType): QuizConfig {
        val progress = index.toDouble() / total
        
        return QuizConfig(
            choiceCount = (3 + progress * 2).toInt().coerceIn(3, 5),
            includeContext = progress > 0.3,
            includeHints = index < total / 3,  // 초반부에만 힌트 제공
            timeLimit = (30 + type.estimatedTimeMinutes * 10).coerceAtMost(60)
        )
    }
    
    data class QuizConfig(
        val choiceCount: Int = 4,
        val includeContext: Boolean = true,
        val includeHints: Boolean = false,
        val includeGenre: Boolean = false,
        val includeQuality: Boolean = false,
        val includeMode: Boolean = false,
        val timeLimit: Int = 30  // seconds
    ) {
        companion object {
            fun default(): QuizConfig = QuizConfig()
            
            fun beginner(): QuizConfig = QuizConfig(
                choiceCount = 3,
                includeHints = true,
                timeLimit = 45
            )
            
            fun advanced(): QuizConfig = QuizConfig(
                choiceCount = 5,
                includeContext = true,
                includeGenre = true,
                includeQuality = true,
                includeMode = true,
                timeLimit = 20
            )
        }
    }
    
    data class UserPerformance(
        val accuracy: Double,
        val averageResponseTime: Int,
        val recentTrend: Double,
        val confidenceLevel: Double,
        val typePerformance: Map<QuizType, TypePerformance>
    ) {
        fun getAverageLevel(type: QuizType): Int {
            return typePerformance[type]?.averageLevel ?: 2
        }
        
        fun getRecentTrend(type: QuizType): Double {
            return typePerformance[type]?.recentTrend ?: 0.0
        }
        
        fun getConfidenceLevel(type: QuizType): Double {
            return typePerformance[type]?.confidence ?: 0.5
        }
    }
    
    data class TypePerformance(
        val averageLevel: Int,
        val recentTrend: Double,
        val confidence: Double
    )
    
    enum class ProgressionType {
        LINEAR,      // 일정한 비율로 증가
        EXPONENTIAL, // 가속도적 증가
        LOGARITHMIC, // 초기 급증 후 완만
        STEPPED      // 단계적 증가
    }
    
    enum class QuizTheme(val displayName: String) {
        BASIC_HARMONY("기초 화성학"),
        JAZZ_THEORY("재즈 이론"),
        CLASSICAL_ANALYSIS("클래식 분석"),
        POPULAR_MUSIC("대중음악"),
        MODAL_HARMONY("선법 화성"),
        ADVANCED_THEORY("고급 이론")
        ;
        
        fun getRelevantTypes(): List<QuizType> {
            return when (this) {
                BASIC_HARMONY -> listOf(QuizType.CHORD_NAME, QuizType.INTERVAL)
                JAZZ_THEORY -> listOf(QuizType.CHORD_NAME, QuizType.PROGRESSION, QuizType.SCALE)
                CLASSICAL_ANALYSIS -> listOf(QuizType.PROGRESSION, QuizType.INTERVAL)
                POPULAR_MUSIC -> listOf(QuizType.CHORD_NAME, QuizType.PROGRESSION)
                MODAL_HARMONY -> listOf(QuizType.SCALE, QuizType.PROGRESSION)
                ADVANCED_THEORY -> QuizType.values().toList()
            }
        }
        
        fun getConfigForType(type: QuizType): QuizConfig {
            return when (this) {
                BASIC_HARMONY -> QuizConfig.beginner()
                JAZZ_THEORY -> QuizConfig.advanced().copy(includeGenre = true)
                CLASSICAL_ANALYSIS -> QuizConfig.default().copy(includeContext = true)
                POPULAR_MUSIC -> QuizConfig.default().copy(includeGenre = true)
                MODAL_HARMONY -> QuizConfig.advanced().copy(includeMode = true)
                ADVANCED_THEORY -> QuizConfig.advanced()
            }
        }
    }
}