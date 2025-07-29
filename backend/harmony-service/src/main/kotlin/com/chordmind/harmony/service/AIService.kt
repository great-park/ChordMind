package com.chordmind.harmony.service

import com.chordmind.harmony.domain.QuizType
import com.chordmind.harmony.repository.QuizResultRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
@Transactional(readOnly = true)
class AIService(
    private val aiExplanationService: AIExplanationService,
    private val analyticsService: AnalyticsService,
    private val quizResultRepository: QuizResultRepository
) {
    
    fun generatePersonalizedFeedback(
        userId: Long,
        questionType: QuizType,
        userAnswer: String,
        correctAnswer: String,
        isCorrect: Boolean,
        timeSpent: Long? = null
    ): Map<String, Any> {
        val userHistory = getUserHistory(userId)
        val feedback = aiExplanationService.generatePersonalizedFeedback(
            userId = userId,
            questionType = questionType,
            userAnswer = userAnswer,
            correctAnswer = correctAnswer,
            isCorrect = isCorrect,
            userHistory = userHistory
        )
        
        val behaviorAnalysis = aiExplanationService.analyzeUserBehavior(userHistory)
        val learningStyle = behaviorAnalysis["learningStyle"] as? String ?: "균형잡힌 학습자"
        
        return mapOf(
            "feedback" to feedback,
            "learningStyle" to learningStyle,
            "timeAnalysis" to analyzeTimeSpent(timeSpent, userHistory),
            "improvementSuggestion" to generateImprovementSuggestion(userHistory, questionType, isCorrect),
            "timestamp" to LocalDateTime.now()
        )
    }
    
    fun generateAdaptiveLearningPath(userId: Long): Map<String, Any> {
        val userStats = analyticsService.getUserStats(userId)
        val learningPath = aiExplanationService.generateLearningPath(userId, userStats)
        val behaviorAnalysis = aiExplanationService.analyzeUserBehavior(getUserHistory(userId))
        
        val adaptivePath = enhanceLearningPath(learningPath, behaviorAnalysis)
        
        return mapOf(
            "learningPath" to adaptivePath,
            "behaviorAnalysis" to behaviorAnalysis,
            "estimatedCompletionTime" to calculateCompletionTime(adaptivePath),
            "difficultyProgression" to generateDifficultyProgression(userStats),
            "generatedAt" to LocalDateTime.now()
        )
    }
    
    fun generateSmartHints(
        userId: Long,
        questionType: QuizType,
        difficulty: Int,
        showDetailed: Boolean = false
    ): Map<String, Any> {
        val userHistory = getUserHistory(userId)
        val userPerformance = aiExplanationService.analyzeUserPerformance(userHistory, questionType)
        val accuracy = userPerformance["accuracy"] as? Double ?: 0.0
        
        val baseHints = generateBaseHints(questionType, difficulty)
        val adaptiveHints = adaptHintsToUser(baseHints, accuracy, userHistory)
        
        return mapOf(
            "hints" to adaptiveHints,
            "difficulty" to difficulty,
            "questionType" to questionType,
            "userAccuracy" to accuracy,
            "hintCount" to adaptiveHints.size,
            "showDetailed" to showDetailed,
            "generatedAt" to LocalDateTime.now()
        )
    }
    
    fun generateLearningRecommendations(userId: Long): Map<String, Any> {
        val userStats = analyticsService.getUserStats(userId)
        val weakestAreas = analyticsService.getWeakestAreas(userId)
        val recommendations = analyticsService.getRecommendations(userId)
        val behaviorAnalysis = aiExplanationService.analyzeUserBehavior(getUserHistory(userId))
        
        val personalizedRecommendations = personalizeRecommendations(
            recommendations, 
            weakestAreas, 
            userStats, 
            behaviorAnalysis
        )
        
        return mapOf(
            "recommendations" to personalizedRecommendations,
            "weakestAreas" to weakestAreas,
            "learningStyle" to behaviorAnalysis["learningStyle"],
            "estimatedTime" to calculateEstimatedTime(weakestAreas),
            "priorityOrder" to determinePriorityOrder(weakestAreas, userStats),
            "generatedAt" to LocalDateTime.now()
        )
    }
    
    fun analyzeLearningPatterns(userId: Long): Map<String, Any> {
        val userHistory = getUserHistory(userId)
        val behaviorAnalysis = aiExplanationService.analyzeUserBehavior(userHistory)
        val timePatterns = analyzeDetailedTimePatterns(userHistory)
        val difficultyPatterns = analyzeDifficultyPatterns(userHistory)
        val improvementTrends = analyzeImprovementTrends(userHistory)
        
        return mapOf(
            "behaviorAnalysis" to behaviorAnalysis,
            "timePatterns" to timePatterns,
            "difficultyPatterns" to difficultyPatterns,
            "improvementTrends" to improvementTrends,
            "learningEfficiency" to calculateLearningEfficiency(userHistory),
            "strengths" to identifyStrengths(userHistory),
            "weaknesses" to identifyWeaknesses(userHistory),
            "analyzedAt" to LocalDateTime.now()
        )
    }
    
    private fun getUserHistory(userId: Long): List<Map<String, Any>> {
        val results = quizResultRepository.findByUserId(userId)
        return results.map { result ->
            mapOf(
                "type" to result.question.type,
                "correct" to result.correct,
                "timeSpent" to calculateTimeSpent(result.answeredAt),
                "difficulty" to result.question.difficulty,
                "answeredAt" to result.answeredAt
            )
        }
    }
    
    private fun calculateTimeSpent(answeredAt: LocalDateTime): Long {
        // 실제로는 시작 시간과 종료 시간을 비교해야 함
        // 여기서는 샘플 데이터 반환
        return (30..120).random().toLong()
    }
    
    private fun analyzeTimeSpent(timeSpent: Long?, userHistory: List<Map<String, Any>>): Map<String, Any> {
        val avgTime = userHistory.mapNotNull { it["timeSpent"] as? Long }.average()
        val currentTime = timeSpent ?: avgTime
        
        return mapOf(
            "currentTime" to currentTime,
            "averageTime" to avgTime,
            "timeCategory" to when {
                currentTime < avgTime * 0.7 -> "빠름"
                currentTime > avgTime * 1.3 -> "느림"
                else -> "보통"
            },
            "timeEfficiency" to (avgTime / currentTime) * 100
        )
    }
    
    private fun generateImprovementSuggestion(
        userHistory: List<Map<String, Any>>,
        questionType: QuizType,
        isCorrect: Boolean
    ): String {
        val typeHistory = userHistory.filter { it["type"] == questionType }
        val accuracy = if (typeHistory.isNotEmpty()) {
            typeHistory.count { it["correct"] as? Boolean == true }.toDouble() / typeHistory.size
        } else 0.0
        
        return when {
            isCorrect && accuracy > 0.8 -> "이미 이 영역에서 뛰어난 실력을 보이고 있습니다. 고급 문제에 도전해보세요!"
            isCorrect && accuracy > 0.6 -> "좋은 진전입니다. 중급 문제로 난이도를 높여보세요."
            isCorrect -> "정답입니다! 이 영역에서 점점 실력이 향상되고 있습니다."
            !isCorrect && accuracy < 0.4 -> "이 영역에서 어려움을 겪고 계시네요. 기본 개념부터 차근차근 복습해보세요."
            !isCorrect -> "틀렸지만 괜찮습니다. 비슷한 문제를 더 연습해보세요."
            else -> "계속 연습하시면 실력이 향상될 것입니다."
        }
    }
    
    private fun enhanceLearningPath(
        learningPath: Map<String, Any>,
        behaviorAnalysis: Map<String, Any>
    ): Map<String, Any> {
        val learningStyle = behaviorAnalysis["learningStyle"] as? String ?: "균형잡힌 학습자"
        val recommendations = learningPath["recommendations"] as? List<String> ?: emptyList()
        
        val enhancedRecommendations = recommendations.map { recommendation ->
            when (learningStyle) {
                "직관적 학습자" -> "$recommendation (직관적으로 접근해보세요)"
                "분석적 학습자" -> "$recommendation (체계적으로 분석해보세요)"
                "기초 학습자" -> "$recommendation (기본부터 차근차근 학습하세요)"
                else -> recommendation
            }
        }
        
        return learningPath + mapOf(
            "enhancedRecommendations" to enhancedRecommendations,
            "learningStyle" to learningStyle
        )
    }
    
    private fun calculateCompletionTime(learningPath: Map<String, Any>): Int {
        val estimatedTime = learningPath["estimatedTime"] as? Int ?: 60
        val recommendations = learningPath["recommendations"] as? List<String> ?: emptyList()
        
        return estimatedTime + (recommendations.size * 15) // 각 추천당 15분 추가
    }
    
    private fun generateDifficultyProgression(userStats: Map<String, Any>): List<Map<String, Any>> {
        val accuracy = userStats["accuracy"] as? Double ?: 0.0
        
        return when {
            accuracy < 0.5 -> listOf(
                mapOf("level" to "기초", "focus" to "기본 개념", "duration" to "2주"),
                mapOf("level" to "초급", "focus" to "기본 문제", "duration" to "3주"),
                mapOf("level" to "중급", "focus" to "응용 문제", "duration" to "4주")
            )
            accuracy < 0.7 -> listOf(
                mapOf("level" to "중급", "focus" to "응용 문제", "duration" to "3주"),
                mapOf("level" to "고급", "focus" to "고급 문제", "duration" to "4주"),
                mapOf("level" to "전문가", "focus" to "전문 문제", "duration" to "5주")
            )
            else -> listOf(
                mapOf("level" to "고급", "focus" to "고급 문제", "duration" to "2주"),
                mapOf("level" to "전문가", "focus" to "전문 문제", "duration" to "3주"),
                mapOf("level" to "마스터", "focus" to "마스터 문제", "duration" to "4주")
            )
        }
    }
    
    private fun generateBaseHints(questionType: QuizType, difficulty: Int): List<String> {
        return when (questionType) {
            QuizType.CHORD_NAME -> when (difficulty) {
                1 -> listOf("3화음의 기본 구조를 생각해보세요", "장조는 밝고, 단조는 어둡습니다")
                2 -> listOf("7화음의 구조를 분석해보세요", "서스펜션 코드의 특징을 기억하세요")
                3 -> listOf("복합 화성의 구조를 파악하세요", "고급 화성학 이론을 적용하세요")
                else -> emptyList()
            }
            QuizType.PROGRESSION -> when (difficulty) {
                1 -> listOf("기본 화성 진행을 기억하세요", "I-IV-V 진행을 생각해보세요")
                2 -> listOf("재즈 진행의 특징을 분석하세요", "2-5-1 진행을 기억하세요")
                3 -> listOf("복합 화성 진행을 파악하세요", "고급 화성학 이론을 적용하세요")
                else -> emptyList()
            }
            QuizType.INTERVAL -> when (difficulty) {
                1 -> listOf("음정의 기본 개념을 기억하세요", "완전음정과 불완전음정을 구분하세요")
                2 -> listOf("복합음정의 구조를 분석하세요", "화성적 기능을 고려하세요")
                3 -> listOf("고급 음정 이론을 적용하세요", "색채적 기능을 분석하세요")
                else -> emptyList()
            }
            QuizType.SCALE -> when (difficulty) {
                1 -> listOf("음계의 기본 구조를 기억하세요", "장음계와 단음계를 구분하세요")
                2 -> listOf("모드의 특징을 분석하세요", "색채적 기능을 고려하세요")
                3 -> listOf("고급 스케일 이론을 적용하세요", "복합 스케일을 분석하세요")
                else -> emptyList()
            }
        }
    }
    
    private fun adaptHintsToUser(
        baseHints: List<String>,
        accuracy: Double,
        userHistory: List<Map<String, Any>>
    ): List<String> {
        val hintCount = when {
            accuracy < 0.3 -> baseHints.size // 모든 힌트 제공
            accuracy < 0.6 -> baseHints.take(2) // 2개 힌트
            else -> baseHints.take(1) // 1개 힌트
        }
        
        return baseHints.take(hintCount)
    }
    
    private fun personalizeRecommendations(
        recommendations: List<String>,
        weakestAreas: List<Map<String, Any>>,
        userStats: Map<String, Any>,
        behaviorAnalysis: Map<String, Any>
    ): List<Map<String, Any>> {
        val learningStyle = behaviorAnalysis["learningStyle"] as? String ?: "균형잡힌 학습자"
        
        return recommendations.map { recommendation ->
            mapOf(
                "recommendation" to recommendation,
                "priority" to determinePriority(recommendation, weakestAreas),
                "estimatedTime" to estimateTimeForRecommendation(recommendation),
                "learningStyle" to learningStyle,
                "difficulty" to determineDifficultyForRecommendation(recommendation, userStats)
            )
        }
    }
    
    private fun determinePriority(recommendation: String, weakestAreas: List<Map<String, Any>>): String {
        return when {
            recommendation.contains("기본") -> "높음"
            recommendation.contains("약점") -> "매우 높음"
            recommendation.contains("고급") -> "보통"
            else -> "낮음"
        }
    }
    
    private fun estimateTimeForRecommendation(recommendation: String): Int {
        return when {
            recommendation.contains("기본") -> 30
            recommendation.contains("약점") -> 60
            recommendation.contains("고급") -> 45
            else -> 20
        }
    }
    
    private fun determineDifficultyForRecommendation(
        recommendation: String,
        userStats: Map<String, Any>
    ): String {
        val accuracy = userStats["accuracy"] as? Double ?: 0.0
        
        return when {
            recommendation.contains("기본") -> "초급"
            recommendation.contains("약점") -> if (accuracy < 0.5) "초급" else "중급"
            recommendation.contains("고급") -> "고급"
            else -> "중급"
        }
    }
    
    private fun calculateEstimatedTime(weakestAreas: List<Map<String, Any>>): Int {
        return weakestAreas.size * 30 + 60 // 각 약점 영역당 30분 + 기본 60분
    }
    
    private fun determinePriorityOrder(
        weakestAreas: List<Map<String, Any>>,
        userStats: Map<String, Any>
    ): List<String> {
        val accuracy = userStats["accuracy"] as? Double ?: 0.0
        
        return if (accuracy < 0.5) {
            listOf("기본 개념", "약점 영역", "고급 문제")
        } else {
            listOf("약점 영역", "고급 문제", "기본 개념")
        }
    }
    
    private fun analyzeDetailedTimePatterns(userHistory: List<Map<String, Any>>): Map<String, Any> {
        val times = userHistory.mapNotNull { it["timeSpent"] as? Long }
        val avgTime = times.average()
        val medianTime = times.sorted().let { if (it.size % 2 == 0) (it[it.size/2-1] + it[it.size/2])/2.0 else it[it.size/2].toDouble() }
        
        return mapOf(
            "averageTime" to avgTime,
            "medianTime" to medianTime,
            "fastestTime" to times.minOrNull(),
            "slowestTime" to times.maxOrNull(),
            "timeConsistency" to calculateTimeConsistency(times),
            "timeTrend" to analyzeTimeTrend(userHistory)
        )
    }
    
    private fun analyzeDifficultyPatterns(userHistory: List<Map<String, Any>>): Map<String, Any> {
        val difficulties = userHistory.mapNotNull { it["difficulty"] as? Int }
        val avgDifficulty = difficulties.average()
        
        return mapOf(
            "averageDifficulty" to avgDifficulty,
            "difficultyRange" to "${difficulties.minOrNull()}-${difficulties.maxOrNull()}",
            "preferredDifficulty" to when {
                avgDifficulty > 2.5 -> "고급"
                avgDifficulty > 1.5 -> "중급"
                else -> "초급"
            },
            "difficultyConsistency" to calculateDifficultyConsistency(difficulties)
        )
    }
    
    private fun analyzeImprovementTrends(userHistory: List<Map<String, Any>>): Map<String, Any> {
        if (userHistory.size < 10) return mapOf("insufficientData" to true)
        
        val firstHalf = userHistory.take(userHistory.size / 2)
        val secondHalf = userHistory.takeLast(userHistory.size / 2)
        
        val firstAccuracy = firstHalf.count { it["correct"] as? Boolean == true }.toDouble() / firstHalf.size
        val secondAccuracy = secondHalf.count { it["correct"] as? Boolean == true }.toDouble() / secondHalf.size
        val improvementRate = if (firstAccuracy > 0) ((secondAccuracy - firstAccuracy) / firstAccuracy) * 100 else 0.0
        
        return mapOf(
            "firstHalfAccuracy" to firstAccuracy,
            "secondHalfAccuracy" to secondAccuracy,
            "improvementRate" to improvementRate,
            "trend" to when {
                improvementRate > 10 -> "상승"
                improvementRate > -10 -> "안정"
                else -> "하락"
            }
        )
    }
    
    private fun calculateLearningEfficiency(userHistory: List<Map<String, Any>>): Double {
        val correctAnswers = userHistory.count { it["correct"] as? Boolean == true }
        val totalAttempts = userHistory.size
        val avgTime = userHistory.mapNotNull { it["timeSpent"] as? Long }.average()
        
        return if (totalAttempts > 0 && avgTime > 0) {
            (correctAnswers.toDouble() / totalAttempts) / (avgTime / 60.0) // 정확도 / 분당 시간
        } else 0.0
    }
    
    private fun identifyStrengths(userHistory: List<Map<String, Any>>): List<String> {
        val typeStats = userHistory.groupBy { it["type"] }
            .mapValues { (_, results) ->
                results.count { it["correct"] as? Boolean == true }.toDouble() / results.size
            }
        
        return typeStats.filter { it.value > 0.7 }.keys.map { it.toString() }
    }
    
    private fun identifyWeaknesses(userHistory: List<Map<String, Any>>): List<String> {
        val typeStats = userHistory.groupBy { it["type"] }
            .mapValues { (_, results) ->
                results.count { it["correct"] as? Boolean == true }.toDouble() / results.size
            }
        
        return typeStats.filter { it.value < 0.5 }.keys.map { it.toString() }
    }
    
    private fun calculateTimeConsistency(times: List<Long>): String {
        val avgTime = times.average()
        val variance = times.map { (it - avgTime) * (it - avgTime) }.average()
        val standardDeviation = kotlin.math.sqrt(variance)
        
        return when {
            standardDeviation < avgTime * 0.2 -> "매우 일관적"
            standardDeviation < avgTime * 0.4 -> "일관적"
            standardDeviation < avgTime * 0.6 -> "보통"
            else -> "불일관적"
        }
    }
    
    private fun analyzeTimeTrend(userHistory: List<Map<String, Any>>): String {
        if (userHistory.size < 10) return "데이터 부족"
        
        val firstHalf = userHistory.take(userHistory.size / 2)
        val secondHalf = userHistory.takeLast(userHistory.size / 2)
        
        val firstAvgTime = firstHalf.mapNotNull { it["timeSpent"] as? Long }.average()
        val secondAvgTime = secondHalf.mapNotNull { it["timeSpent"] as? Long }.average()
        
        return when {
            secondAvgTime < firstAvgTime * 0.8 -> "빨라짐"
            secondAvgTime > firstAvgTime * 1.2 -> "느려짐"
            else -> "안정적"
        }
    }
    
    private fun calculateDifficultyConsistency(difficulties: List<Int>): String {
        val avgDifficulty = difficulties.average()
        val variance = difficulties.map { (it - avgDifficulty) * (it - avgDifficulty) }.average()
        val standardDeviation = kotlin.math.sqrt(variance)
        
        return when {
            standardDeviation < 0.5 -> "매우 일관적"
            standardDeviation < 1.0 -> "일관적"
            standardDeviation < 1.5 -> "보통"
            else -> "다양함"
        }
    }
} 