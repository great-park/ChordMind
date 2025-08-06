package com.chordmind.harmony.domain.service

import com.chordmind.harmony.domain.entity.QuizQuestion
import com.chordmind.harmony.domain.entity.QuizResult
import com.chordmind.harmony.domain.enum.QuizType
import com.chordmind.harmony.domain.factory.QuizQuestionFactory
import com.chordmind.harmony.domain.specification.QuizSpecification
import com.chordmind.harmony.domain.specification.QuizSpecifications
import com.chordmind.harmony.domain.value.Difficulty
import com.chordmind.harmony.domain.value.Score
import org.springframework.stereotype.Service

/**
 * 퀴즈 도메인 서비스
 * 복잡한 비즈니스 로직과 여러 엔티티 간의 상호작용을 담당
 */
@Service
class QuizDomainService(
    private val quizQuestionFactory: QuizQuestionFactory
) {
    
    /**
     * 사용자 맞춤형 퀴즈 생성
     */
    fun generatePersonalizedQuiz(
        userId: Long,
        preferences: LearningPreferences,
        performanceHistory: List<QuizResult>
    ): PersonalizedQuizResult {
        
        val userPerformance = analyzeUserPerformance(performanceHistory)
        val recommendedTypes = determineRecommendedTypes(userPerformance, preferences)
        val targetDifficulty = calculateTargetDifficulty(userPerformance, preferences)
        
        val questions = mutableListOf<QuizQuestion>()
        
        recommendedTypes.forEach { (type, weight) ->
            val questionCount = (preferences.totalQuestions * weight).toInt()
            if (questionCount > 0) {
                val typeQuestions = generateQuestionsForType(
                    type = type,
                    count = questionCount,
                    targetDifficulty = targetDifficulty,
                    userPerformance = userPerformance,
                    preferences = preferences
                )
                questions.addAll(typeQuestions)
            }
        }
        
        return PersonalizedQuizResult(
            questions = questions.shuffled(),
            recommendationReason = generateRecommendationReason(userPerformance, recommendedTypes),
            estimatedDuration = calculateEstimatedDuration(questions),
            difficultyProgression = calculateDifficultyProgression(questions)
        )
    }
    
    /**
     * 적응형 난이도 조정
     */
    fun adjustDifficultyBasedOnPerformance(
        currentDifficulty: Difficulty,
        recentResults: List<QuizResult>,
        adjustmentStrategy: DifficultyAdjustmentStrategy = DifficultyAdjustmentStrategy.CONSERVATIVE
    ): DifficultyAdjustment {
        
        if (recentResults.isEmpty()) {
            return DifficultyAdjustment(
                newDifficulty = currentDifficulty,
                reason = "충분한 데이터가 없음",
                confidence = 0.0
            )
        }
        
        val performance = PerformanceMetrics.from(recentResults)
        val adjustment = when (adjustmentStrategy) {
            DifficultyAdjustmentStrategy.AGGRESSIVE -> calculateAggressiveAdjustment(performance)
            DifficultyAdjustmentStrategy.CONSERVATIVE -> calculateConservativeAdjustment(performance)
            DifficultyAdjustmentStrategy.BALANCED -> calculateBalancedAdjustment(performance)
        }
        
        val newLevel = (currentDifficulty.level + adjustment.levelChange).coerceIn(1, 5)
        val newDifficulty = Difficulty.of(newLevel)
        
        return DifficultyAdjustment(
            newDifficulty = newDifficulty,
            reason = adjustment.reason,
            confidence = adjustment.confidence
        )
    }
    
    /**
     * 퀴즈 완료 후 성과 분석
     */
    fun analyzeQuizCompletion(
        questions: List<QuizQuestion>,
        results: List<QuizResult>
    ): QuizCompletionAnalysis {
        
        require(questions.size == results.size) { "문제 수와 결과 수가 일치하지 않습니다" }
        
        val totalScore = results.sumOf { it.effectiveScore.value }
        val maxPossibleScore = results.sumOf { it.effectiveScore.maxValue }
        val overallScore = Score.of(totalScore, maxPossibleScore)
        
        val typePerformance = analyzeTypePerformance(questions, results)
        val difficultyPerformance = analyzeDifficultyPerformance(questions, results)
        val learningInsights = generateLearningInsights(questions, results)
        val nextRecommendations = generateNextStepRecommendations(typePerformance, difficultyPerformance)
        
        return QuizCompletionAnalysis(
            overallScore = overallScore,
            typePerformance = typePerformance,
            difficultyPerformance = difficultyPerformance,
            learningInsights = learningInsights,
            nextRecommendations = nextRecommendations,
            timeAnalysis = analyzeResponseTimes(results),
            masteryProgress = calculateMasteryProgress(results)
        )
    }
    
    /**
     * 학습 경로 추천
     */
    fun recommendLearningPath(
        currentLevel: Difficulty,
        targetLevel: Difficulty,
        focusTypes: List<QuizType>,
        timeConstraints: TimeConstraints
    ): LearningPath {
        
        val totalLevels = targetLevel.level - currentLevel.level + 1
        val phases = mutableListOf<LearningPhase>()
        
        for (level in currentLevel.level..targetLevel.level) {
            val phaseDifficulty = Difficulty.of(level)
            val phaseTypes = if (level == currentLevel.level) {
                // 첫 단계는 모든 타입을 포함하여 기초 다지기
                QuizType.values().toList()
            } else {
                // 이후 단계는 집중 타입 위주
                focusTypes
            }
            
            val estimatedQuestions = calculatePhaseQuestions(phaseDifficulty, phaseTypes, timeConstraints)
            val estimatedDuration = estimatePhaseTime(estimatedQuestions, phaseDifficulty)
            
            phases.add(
                LearningPhase(
                    level = phaseDifficulty,
                    focusTypes = phaseTypes,
                    estimatedQuestions = estimatedQuestions,
                    estimatedDuration = estimatedDuration,
                    milestones = generatePhaseMilestones(phaseDifficulty, phaseTypes)
                )
            )
        }
        
        return LearningPath(
            phases = phases,
            totalEstimatedTime = phases.sumOf { it.estimatedDuration },
            completionCriteria = generateCompletionCriteria(targetLevel, focusTypes)
        )
    }
    
    /**
     * 퀴즈 품질 평가
     */
    fun evaluateQuestionQuality(question: QuizQuestion): QuestionQualityAssessment {
        val qualityChecks = listOf(
            checkContentQuality(question),
            checkChoiceQuality(question),
            checkDifficultyAppropriate(question),
            checkExplanationQuality(question),
            checkAccessibility(question)
        )
        
        val overallScore = qualityChecks.map { it.score }.average()
        val issues = qualityChecks.flatMap { it.issues }
        val suggestions = qualityChecks.flatMap { it.suggestions }
        
        return QuestionQualityAssessment(
            overallScore = overallScore,
            qualityChecks = qualityChecks,
            issues = issues,
            suggestions = suggestions,
            isApproved = overallScore >= QUALITY_THRESHOLD && issues.isEmpty()
        )
    }
    
    /**
     * 학습 패턴 분석
     */
    fun analyzeLearningPattern(results: List<QuizResult>): LearningPatternAnalysis {
        if (results.isEmpty()) {
            return LearningPatternAnalysis.empty()
        }
        
        val patterns = mutableMapOf<String, Double>()
        
        // 시간 패턴 분석
        val timePattern = analyzeTimePattern(results)
        patterns["quick_response"] = timePattern.quickResponseRate
        patterns["consistent_timing"] = timePattern.consistency
        
        // 정확도 패턴 분석
        val accuracyPattern = analyzeAccuracyPattern(results)
        patterns["accuracy_trend"] = accuracyPattern.trend
        patterns["consistency"] = accuracyPattern.consistency
        
        // 난이도별 패턴 분석
        val difficultyPattern = analyzeDifficultyPattern(results)
        patterns["difficulty_progression"] = difficultyPattern.adaptability
        
        // 타입별 선호도 분석
        val typePreference = analyzeTypePreference(results)
        
        return LearningPatternAnalysis(
            dominantPattern = identifyDominantPattern(patterns),
            patterns = patterns,
            typePreferences = typePreference,
            learningStyle = inferLearningStyle(patterns),
            recommendations = generatePatternBasedRecommendations(patterns)
        )
    }
    
    private fun analyzeUserPerformance(results: List<QuizResult>): QuizQuestionFactory.UserPerformance {
        if (results.isEmpty()) {
            return QuizQuestionFactory.UserPerformance(
                accuracy = 0.5,
                averageResponseTime = 30,
                recentTrend = 0.0,
                confidenceLevel = 0.5,
                typePerformance = emptyMap()
            )
        }
        
        val accuracy = results.count { it.isCorrect }.toDouble() / results.size
        val averageResponseTime = results.mapNotNull { it.timeTakenSeconds }.average().toInt()
        val recentTrend = calculateTrend(results.takeLast(10))
        
        val typePerformance = QuizType.values().associateWith { type ->
            val typeResults = results.filter { it.question.type == type }
            if (typeResults.isNotEmpty()) {
                QuizQuestionFactory.TypePerformance(
                    averageLevel = typeResults.map { it.question.difficulty.level }.average().toInt(),
                    recentTrend = calculateTrend(typeResults.takeLast(5)),
                    confidence = typeResults.count { it.isCorrect }.toDouble() / typeResults.size
                )
            } else {
                QuizQuestionFactory.TypePerformance(2, 0.0, 0.5)
            }
        }
        
        return QuizQuestionFactory.UserPerformance(
            accuracy = accuracy,
            averageResponseTime = averageResponseTime,
            recentTrend = recentTrend,
            confidenceLevel = accuracy,
            typePerformance = typePerformance
        )
    }
    
    private fun calculateTrend(results: List<QuizResult>): Double {
        if (results.size < 2) return 0.0
        
        val firstHalf = results.take(results.size / 2)
        val secondHalf = results.drop(results.size / 2)
        
        val firstAccuracy = firstHalf.count { it.isCorrect }.toDouble() / firstHalf.size
        val secondAccuracy = secondHalf.count { it.isCorrect }.toDouble() / secondHalf.size
        
        return secondAccuracy - firstAccuracy
    }
    
    // ... 기타 private 메서드들은 구현 상세사항이므로 생략 ...
    
    companion object {
        private const val QUALITY_THRESHOLD = 0.8
    }
    
    // 데이터 클래스들
    data class LearningPreferences(
        val totalQuestions: Int = 10,
        val preferredTypes: List<QuizType> = QuizType.values().toList(),
        val maxDifficulty: Difficulty = Difficulty.intermediate(),
        val includeExplanations: Boolean = true,
        val timePerQuestion: Int = 30
    )
    
    data class PersonalizedQuizResult(
        val questions: List<QuizQuestion>,
        val recommendationReason: String,
        val estimatedDuration: Int,
        val difficultyProgression: List<Int>
    )
    
    data class DifficultyAdjustment(
        val newDifficulty: Difficulty,
        val reason: String,
        val confidence: Double
    )
    
    data class QuizCompletionAnalysis(
        val overallScore: Score,
        val typePerformance: Map<QuizType, Double>,
        val difficultyPerformance: Map<Int, Double>,
        val learningInsights: List<String>,
        val nextRecommendations: List<String>,
        val timeAnalysis: TimeAnalysis,
        val masteryProgress: Map<QuizType, Double>
    )
    
    data class LearningPath(
        val phases: List<LearningPhase>,
        val totalEstimatedTime: Int,
        val completionCriteria: List<String>
    )
    
    data class LearningPhase(
        val level: Difficulty,
        val focusTypes: List<QuizType>,
        val estimatedQuestions: Int,
        val estimatedDuration: Int,
        val milestones: List<String>
    )
    
    data class QuestionQualityAssessment(
        val overallScore: Double,
        val qualityChecks: List<QualityCheck>,
        val issues: List<String>,
        val suggestions: List<String>,
        val isApproved: Boolean
    )
    
    data class QualityCheck(
        val name: String,
        val score: Double,
        val issues: List<String>,
        val suggestions: List<String>
    )
    
    data class LearningPatternAnalysis(
        val dominantPattern: String,
        val patterns: Map<String, Double>,
        val typePreferences: Map<QuizType, Double>,
        val learningStyle: LearningStyle,
        val recommendations: List<String>
    ) {
        companion object {
            fun empty(): LearningPatternAnalysis = LearningPatternAnalysis(
                dominantPattern = "insufficient_data",
                patterns = emptyMap(),
                typePreferences = emptyMap(),
                learningStyle = LearningStyle.BALANCED,
                recommendations = listOf("더 많은 문제를 풀어보세요")
            )
        }
    }
    
    data class TimeAnalysis(
        val averageTime: Double,
        val timeDistribution: Map<String, Int>,
        val timeEfficiency: Double
    )
    
    data class TimeConstraints(
        val dailyMinutes: Int,
        val weeklyGoal: Int,
        val flexibleSchedule: Boolean
    )
    
    data class PerformanceMetrics(
        val accuracy: Double,
        val averageTime: Double,
        val consistency: Double,
        val improvement: Double
    ) {
        companion object {
            fun from(results: List<QuizResult>): PerformanceMetrics {
                val accuracy = results.count { it.isCorrect }.toDouble() / results.size
                val averageTime = results.mapNotNull { it.timeTakenSeconds }.average()
                val timeVariance = calculateTimeVariance(results)
                val consistency = 1.0 - (timeVariance / averageTime).coerceAtMost(1.0)
                val improvement = calculateImprovement(results)
                
                return PerformanceMetrics(accuracy, averageTime, consistency, improvement)
            }
            
            private fun calculateTimeVariance(results: List<QuizResult>): Double {
                val times = results.mapNotNull { it.timeTakenSeconds?.toDouble() }
                if (times.isEmpty()) return 0.0
                val mean = times.average()
                return times.map { (it - mean) * (it - mean) }.average()
            }
            
            private fun calculateImprovement(results: List<QuizResult>): Double {
                if (results.size < 4) return 0.0
                val firstQuarter = results.take(results.size / 4)
                val lastQuarter = results.takeLast(results.size / 4)
                val firstAccuracy = firstQuarter.count { it.isCorrect }.toDouble() / firstQuarter.size
                val lastAccuracy = lastQuarter.count { it.isCorrect }.toDouble() / lastQuarter.size
                return lastAccuracy - firstAccuracy
            }
        }
    }
    
    enum class DifficultyAdjustmentStrategy {
        AGGRESSIVE,    // 빠른 난이도 조정
        CONSERVATIVE,  // 안전한 난이도 조정
        BALANCED      // 균형잡힌 조정
    }
    
    enum class LearningStyle {
        VISUAL,       // 시각적 학습자
        AUDITORY,     // 청각적 학습자
        KINESTHETIC,  // 체감각적 학습자
        ANALYTICAL,   // 분석적 학습자
        INTUITIVE,    // 직관적 학습자
        BALANCED      // 균형잡힌 학습자
    }
    
    // private 메서드들의 스텁 구현
    private fun determineRecommendedTypes(
        performance: QuizQuestionFactory.UserPerformance,
        preferences: LearningPreferences
    ): Map<QuizType, Double> = preferences.preferredTypes.associateWith { 1.0 / preferences.preferredTypes.size }
    
    private fun calculateTargetDifficulty(
        performance: QuizQuestionFactory.UserPerformance,
        preferences: LearningPreferences
    ): Difficulty = Difficulty.of((performance.accuracy * 5).toInt().coerceIn(1, 5))
    
    private fun generateQuestionsForType(
        type: QuizType,
        count: Int,
        targetDifficulty: Difficulty,
        userPerformance: QuizQuestionFactory.UserPerformance,
        preferences: LearningPreferences
    ): List<QuizQuestion> = emptyList() // 실제 구현에서는 QuizQuestionFactory 사용
    
    private fun generateRecommendationReason(
        performance: QuizQuestionFactory.UserPerformance,
        types: Map<QuizType, Double>
    ): String = "사용자 성과 분석에 기반한 추천"
    
    private fun calculateEstimatedDuration(questions: List<QuizQuestion>): Int =
        questions.sumOf { it.type.estimatedTimeMinutes }
    
    private fun calculateDifficultyProgression(questions: List<QuizQuestion>): List<Int> =
        questions.map { it.difficulty.level }
    
    private fun calculateAggressiveAdjustment(metrics: PerformanceMetrics): AdjustmentResult =
        AdjustmentResult(if (metrics.accuracy > 0.8) 1 else if (metrics.accuracy < 0.6) -1 else 0, 
                        "성과 기반 적극적 조정", metrics.accuracy)
    
    private fun calculateConservativeAdjustment(metrics: PerformanceMetrics): AdjustmentResult =
        AdjustmentResult(if (metrics.accuracy > 0.9) 1 else if (metrics.accuracy < 0.5) -1 else 0,
                        "안전한 조정", metrics.accuracy * 0.8)
    
    private fun calculateBalancedAdjustment(metrics: PerformanceMetrics): AdjustmentResult =
        AdjustmentResult(if (metrics.accuracy > 0.85) 1 else if (metrics.accuracy < 0.55) -1 else 0,
                        "균형잡힌 조정", metrics.accuracy * 0.9)
    
    private fun analyzeTypePerformance(questions: List<QuizQuestion>, results: List<QuizResult>): Map<QuizType, Double> =
        QuizType.values().associateWith { type ->
            val typeResults = results.filter { it.question.type == type }
            if (typeResults.isNotEmpty()) typeResults.count { it.isCorrect }.toDouble() / typeResults.size
            else 0.0
        }
    
    private fun analyzeDifficultyPerformance(questions: List<QuizQuestion>, results: List<QuizResult>): Map<Int, Double> =
        (1..5).associateWith { level ->
            val levelResults = results.filter { it.question.difficulty.level == level }
            if (levelResults.isNotEmpty()) levelResults.count { it.isCorrect }.toDouble() / levelResults.size
            else 0.0
        }
    
    private fun generateLearningInsights(questions: List<QuizQuestion>, results: List<QuizResult>): List<String> =
        listOf("분석 결과 기반 학습 인사이트")
    
    private fun generateNextStepRecommendations(
        typePerformance: Map<QuizType, Double>,
        difficultyPerformance: Map<Int, Double>
    ): List<String> = listOf("다음 단계 추천사항")
    
    private fun analyzeResponseTimes(results: List<QuizResult>): TimeAnalysis {
        val times = results.mapNotNull { it.timeTakenSeconds }
        return TimeAnalysis(
            averageTime = if (times.isNotEmpty()) times.average() else 0.0,
            timeDistribution = mapOf(
                "quick" to times.count { it <= 10 },
                "normal" to times.count { it in 11..30 },
                "slow" to times.count { it > 30 }
            ),
            timeEfficiency = 0.8 // 계산된 효율성
        )
    }
    
    private fun calculateMasteryProgress(results: List<QuizResult>): Map<QuizType, Double> =
        QuizType.values().associateWith { type ->
            val typeResults = results.filter { it.question.type == type }
            typeResults.count { it.masteryLevel.name == "MASTERED" }.toDouble() / 
            (typeResults.size.takeIf { it > 0 } ?: 1)
        }
    
    private fun calculatePhaseQuestions(difficulty: Difficulty, types: List<QuizType>, constraints: TimeConstraints): Int =
        (constraints.dailyMinutes / 2).coerceIn(5, 20)
    
    private fun estimatePhaseTime(questions: Int, difficulty: Difficulty): Int =
        questions * (difficulty.level + 1) * 2
    
    private fun generatePhaseMilestones(difficulty: Difficulty, types: List<QuizType>): List<String> =
        listOf("${difficulty.displayName} 수준 ${types.size}개 타입 마스터")
    
    private fun generateCompletionCriteria(targetLevel: Difficulty, focusTypes: List<QuizType>): List<String> =
        listOf("${targetLevel.displayName} 수준 달성", "모든 집중 타입에서 80% 이상 정확도")
    
    private fun checkContentQuality(question: QuizQuestion): QualityCheck =
        QualityCheck("내용 품질", 0.9, emptyList(), emptyList())
    
    private fun checkChoiceQuality(question: QuizQuestion): QualityCheck =
        QualityCheck("선택지 품질", 0.8, emptyList(), emptyList())
    
    private fun checkDifficultyAppropriate(question: QuizQuestion): QualityCheck =
        QualityCheck("난이도 적절성", 0.85, emptyList(), emptyList())
    
    private fun checkExplanationQuality(question: QuizQuestion): QualityCheck =
        QualityCheck("설명 품질", if (question.hasExplanation) 0.9 else 0.6, emptyList(), emptyList())
    
    private fun checkAccessibility(question: QuizQuestion): QualityCheck =
        QualityCheck("접근성", 0.95, emptyList(), emptyList())
    
    private fun analyzeTimePattern(results: List<QuizResult>): TimePattern {
        val quickCount = results.count { it.isQuickResponse }
        return TimePattern(
            quickResponseRate = quickCount.toDouble() / results.size,
            consistency = 0.8 // 계산된 일관성
        )
    }
    
    private fun analyzeAccuracyPattern(results: List<QuizResult>): AccuracyPattern =
        AccuracyPattern(trend = 0.1, consistency = 0.7)
    
    private fun analyzeDifficultyPattern(results: List<QuizResult>): DifficultyPattern =
        DifficultyPattern(adaptability = 0.6)
    
    private fun analyzeTypePreference(results: List<QuizResult>): Map<QuizType, Double> =
        QuizType.values().associateWith { 0.5 }
    
    private fun identifyDominantPattern(patterns: Map<String, Double>): String =
        patterns.maxByOrNull { it.value }?.key ?: "balanced"
    
    private fun inferLearningStyle(patterns: Map<String, Double>): LearningStyle = LearningStyle.BALANCED
    
    private fun generatePatternBasedRecommendations(patterns: Map<String, Double>): List<String> =
        listOf("패턴 기반 추천사항")
    
    data class AdjustmentResult(val levelChange: Int, val reason: String, val confidence: Double)
    data class TimePattern(val quickResponseRate: Double, val consistency: Double)
    data class AccuracyPattern(val trend: Double, val consistency: Double)
    data class DifficultyPattern(val adaptability: Double)
}