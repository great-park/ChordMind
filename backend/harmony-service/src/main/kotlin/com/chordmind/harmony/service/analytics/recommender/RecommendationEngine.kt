package com.chordmind.harmony.service.analytics.recommender

import com.chordmind.harmony.service.analytics.AnalyticsConfig
import com.chordmind.harmony.service.analytics.dto.TypeStats
import com.chordmind.harmony.service.analytics.dto.UserStats
import com.chordmind.harmony.service.analytics.dto.response.StudyPlanResponse
import com.chordmind.harmony.service.analytics.dto.response.DailyGoalsResponse
import org.springframework.stereotype.Component

@Component
class RecommendationEngine {
    
    fun generateRecommendations(userStats: UserStats): List<String> {
        val recommendations = mutableListOf<String>()
        
        recommendations.addAll(generateTypeBasedRecommendations(userStats.typeStats))
        recommendations.addAll(generateAccuracyBasedRecommendations(userStats.accuracy))
        
        return recommendations.distinct()
    }
    
    fun generateStudyPlan(userStats: UserStats, weakestAreas: List<TypeStats>): StudyPlanResponse {
        val priority = determinePriority(userStats.accuracy)
        val focusAreas = weakestAreas.take(2).map { 
            extractTypeFromStats(it) 
        }
        
        val dailyGoals = when (priority) {
            Priority.URGENT -> DailyGoalsResponse(
                problemsPerDay = 20,
                focusTimeMinutes = 30,
                reviewFrequency = "daily"
            )
            Priority.MODERATE -> DailyGoalsResponse(
                problemsPerDay = 15,
                focusTimeMinutes = 25,
                reviewFrequency = "every_2_days"
            )
            Priority.LIGHT -> DailyGoalsResponse(
                problemsPerDay = 10,
                focusTimeMinutes = 20,
                reviewFrequency = "weekly"
            )
        }
        
        return StudyPlanResponse(
            priority = priority.name.lowercase(),
            focusAreas = focusAreas,
            dailyGoals = dailyGoals,
            estimatedImprovementWeeks = calculateImprovementTime(userStats.accuracy)
        )
    }
    
    private fun generateTypeBasedRecommendations(typeStats: Map<String, TypeStats>): List<String> {
        return typeStats.mapNotNull { (type, stats) ->
            if (stats.accuracy < AnalyticsConfig.LOW_ACCURACY_THRESHOLD) {
                "$type ${AnalyticsConfig.Messages.LOW_ACCURACY_MESSAGE}"
            } else null
        }
    }
    
    private fun generateAccuracyBasedRecommendations(overallAccuracy: Double): List<String> {
        return listOf(
            when {
                overallAccuracy < AnalyticsConfig.POOR_ACCURACY_THRESHOLD -> 
                    AnalyticsConfig.Messages.BASIC_LEARNING_MESSAGE
                overallAccuracy < AnalyticsConfig.LOW_ACCURACY_THRESHOLD -> 
                    AnalyticsConfig.Messages.FOCUSED_PRACTICE_MESSAGE
                overallAccuracy < AnalyticsConfig.GOOD_ACCURACY_THRESHOLD -> 
                    AnalyticsConfig.Messages.ADVANCED_CHALLENGE_MESSAGE
                else -> AnalyticsConfig.Messages.EXCELLENT_MESSAGE
            }
        )
    }
    
    private fun determinePriority(accuracy: Double): Priority {
        return when {
            accuracy < AnalyticsConfig.POOR_ACCURACY_THRESHOLD -> Priority.URGENT
            accuracy < AnalyticsConfig.LOW_ACCURACY_THRESHOLD -> Priority.MODERATE
            else -> Priority.LIGHT
        }
    }
    
    private fun calculateImprovementTime(currentAccuracy: Double): Int {
        return when {
            currentAccuracy < 50 -> 8
            currentAccuracy < 70 -> 4
            else -> 2
        }
    }
    
    private fun extractTypeFromStats(typeStats: TypeStats): String {
        return typeStats.type
    }
    
    private enum class Priority {
        URGENT, MODERATE, LIGHT
    }
}