package com.chordmind.harmony.service

import com.chordmind.harmony.domain.QuizQuestion
import com.chordmind.harmony.domain.QuizResult
import com.chordmind.harmony.domain.QuizType
import com.chordmind.harmony.repository.QuizQuestionRepository
import com.chordmind.harmony.repository.QuizResultRepository
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class AIService(
    private val quizQuestionRepository: QuizQuestionRepository,
    private val quizResultRepository: QuizResultRepository,
    private val aiExplanationService: AIExplanationService
) {

    fun generatePersonalizedRecommendations(userId: Long): Map<String, Any> {
        val userHistory = getUserHistory(userId)
        val userStats = calculateUserStats(userHistory)
        val weakestAreas = identifyWeakestAreas(userHistory)
        val behaviorAnalysis = aiExplanationService.analyzeUserBehavior(userHistory)
        
        val personalizedRecommendations = generateRecommendations(weakestAreas, userStats, behaviorAnalysis)
        
        return mapOf(
            "recommendations" to personalizedRecommendations,
            "weakestAreas" to weakestAreas,
            "learningStyle" to (behaviorAnalysis["learningStyle"] as? String ?: "균형잡힌 학습자"),
            "estimatedTime" to calculateEstimatedTime(weakestAreas),
            "priorityOrder" to determinePriorityOrder(weakestAreas, userStats),
            "generatedAt" to LocalDateTime.now()
        )
    }

    fun analyzeLearningPatterns(userId: Long): Map<String, Any> {
        val userHistory = getUserHistory(userId)
        val behaviorAnalysis = aiExplanationService.analyzeUserBehavior(userHistory)
        val timePatterns = analyzeTimePatterns(userHistory)
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

    private fun calculateUserStats(userHistory: List<Map<String, Any>>): Map<String, Any> {
        val totalQuestions = userHistory.size
        val correctAnswers = userHistory.count { it["correct"] as? Boolean == true }
        val accuracy = if (totalQuestions > 0) correctAnswers.toDouble() / totalQuestions else 0.0
        
        return mapOf(
            "totalQuestions" to totalQuestions,
            "correctAnswers" to correctAnswers,
            "accuracy" to accuracy,
            "averageTime" to userHistory.mapNotNull { it["timeSpent"] as? Long }.average()
        )
    }

    private fun identifyWeakestAreas(userHistory: List<Map<String, Any>>): List<Map<String, Any>> {
        val typeStats = userHistory.groupBy { it["type"] }
            .mapValues { (_, results) ->
                results.count { it["correct"] as? Boolean == true }.toDouble() / results.size
            }
        
        return typeStats.filter { it.value < 0.6 }
            .map { (type, accuracy) ->
                mapOf(
                    "type" to type.toString(),
                    "accuracy" to accuracy,
                    "priority" to if (accuracy < 0.4) "높음" else "보통"
                )
            }
    }

    private fun generateRecommendations(
        weakestAreas: List<Map<String, Any>>,
        userStats: Map<String, Any>,
        behaviorAnalysis: Map<String, Any>
    ): List<String> {
        val recommendations = mutableListOf<String>()
        
        weakestAreas.forEach { area ->
            val type = area["type"] as? String ?: ""
            val accuracy = area["accuracy"] as? Double ?: 0.0
            
            when {
                accuracy < 0.4 -> recommendations.add("$type 기본 개념부터 차근차근 학습하세요")
                accuracy < 0.6 -> recommendations.add("$type 중급 문제로 실력을 향상시키세요")
                else -> recommendations.add("$type 고급 문제에 도전해보세요")
            }
        }
        
        return recommendations
    }

    private fun analyzeTimePatterns(userHistory: List<Map<String, Any>>): Map<String, Any> {
        val times = userHistory.mapNotNull { it["timeSpent"] as? Long }
        val avgTime = if (times.isNotEmpty()) times.average() else 60.0
        
        return mapOf(
            "averageTime" to avgTime,
            "fastestTime" to (times.minOrNull() ?: 0L),
            "slowestTime" to (times.maxOrNull() ?: 0L),
            "timeConsistency" to calculateTimeConsistency(times)
        )
    }

    private fun analyzeDifficultyPatterns(userHistory: List<Map<String, Any>>): Map<String, Any> {
        val difficulties = userHistory.mapNotNull { it["difficulty"] as? Int }
        val avgDifficulty = if (difficulties.isNotEmpty()) difficulties.average() else 1.0
        
        return mapOf(
            "averageDifficulty" to avgDifficulty,
            "difficultyRange" to "${difficulties.minOrNull() ?: 1}-${difficulties.maxOrNull() ?: 3}",
            "preferredDifficulty" to when {
                avgDifficulty > 2.5 -> "고급"
                avgDifficulty > 1.5 -> "중급"
                else -> "초급"
            }
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
            (correctAnswers.toDouble() / totalAttempts) / (avgTime / 60.0)
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
        if (times.isEmpty()) return "데이터 부족"
        
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

    private fun calculateEstimatedTime(weakestAreas: List<Map<String, Any>>): Int {
        return weakestAreas.size * 30 + 60
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
} 