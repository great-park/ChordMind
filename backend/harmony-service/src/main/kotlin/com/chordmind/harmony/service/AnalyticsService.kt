package com.chordmind.harmony.service

import com.chordmind.harmony.service.analytics.analyzer.ProgressAnalyzer
import com.chordmind.harmony.service.analytics.calculator.StatisticsCalculator
import com.chordmind.harmony.service.analytics.recommender.RecommendationEngine
import com.chordmind.harmony.service.analytics.dto.response.*
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional(readOnly = true)
class AnalyticsService(
    private val statisticsCalculator: StatisticsCalculator,
    private val progressAnalyzer: ProgressAnalyzer,
    private val recommendationEngine: RecommendationEngine
) {
    
    fun getUserStats(userId: Long): UserStatsResponse {
        val stats = statisticsCalculator.calculateUserStats(userId)
        
        return UserStatsResponse(
            totalAttempts = stats.totalAttempts,
            correctAnswers = stats.correctAnswers,
            accuracy = stats.accuracy,
            typeStats = stats.typeStats.mapValues { (_, typeStats) ->
                TypeStatsResponse(
                    attempts = typeStats.attempts,
                    correct = typeStats.correct,
                    accuracy = typeStats.accuracy
                )
            }
        )
    }
    
    fun getUserProgress(userId: Long, days: Int = 30): List<ProgressResponse> {
        val progressData = progressAnalyzer.analyzeUserProgress(userId, days)
        
        return progressData.map { data ->
            ProgressResponse(
                date = data.date.toString(),
                attempts = data.attempts,
                correct = data.correct,
                accuracy = data.accuracy
            )
        }
    }
    
    fun getDifficultyAnalysis(userId: Long): DifficultyAnalysisResponse {
        val analysis = statisticsCalculator.calculateDifficultyAnalysis(userId)
        
        val difficultyStats = analysis.difficultyStats.mapKeys { it.key.toString() }
            .mapValues { (_, stats) ->
                DifficultyStatsResponse(
                    attempts = stats.attempts,
                    correct = stats.correct,
                    accuracy = stats.accuracy
                )
            }
        
        return DifficultyAnalysisResponse(difficultyStats = difficultyStats)
    }
    
    fun getWeakestAreas(userId: Long): List<WeakAreaResponse> {
        val weakestAreas = statisticsCalculator.calculateWeakestAreas(userId)
        
        return weakestAreas.map { stats ->
            WeakAreaResponse(
                type = stats.type,
                attempts = stats.attempts,
                correct = stats.correct,
                accuracy = stats.accuracy
            )
        }
    }
    
    fun getRecommendations(userId: Long): List<String> {
        val userStats = statisticsCalculator.calculateUserStats(userId)
        return recommendationEngine.generateRecommendations(userStats)
    }
    
    fun getGlobalStats(): GlobalStatsResponse {
        val stats = statisticsCalculator.calculateGlobalStats()
        
        return GlobalStatsResponse(
            totalQuestions = stats.totalQuestions,
            totalResults = stats.totalResults,
            totalCorrect = stats.totalCorrect,
            globalAccuracy = stats.globalAccuracy,
            typeDistribution = stats.typeDistribution
        )
    }
    
    /**
     * 새로운 기능: 학습 계획 생성
     */
    fun getStudyPlan(userId: Long): StudyPlanResponse {
        val userStats = statisticsCalculator.calculateUserStats(userId)
        val weakestAreas = statisticsCalculator.calculateWeakestAreas(userId)
        return recommendationEngine.generateStudyPlan(userStats, weakestAreas)
    }
    
    /**
     * 새로운 기능: 학습 트렌드 분석
     */
    fun getLearningTrends(userId: Long, days: Int = 30): LearningTrendsResponse {
        val progressData = progressAnalyzer.analyzeUserProgress(userId, days)
        return progressAnalyzer.findLearningTrends(progressData)
    }
} 