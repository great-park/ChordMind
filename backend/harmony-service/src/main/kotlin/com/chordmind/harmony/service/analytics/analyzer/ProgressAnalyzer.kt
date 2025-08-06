package com.chordmind.harmony.service.analytics.analyzer

import com.chordmind.harmony.repository.QuizResultRepository
import com.chordmind.harmony.service.analytics.AnalyticsConfig
import com.chordmind.harmony.service.analytics.dto.ProgressData
import com.chordmind.harmony.service.analytics.dto.response.LearningTrendsResponse
import org.springframework.stereotype.Component
import java.time.LocalDateTime

@Component
class ProgressAnalyzer(
    private val quizResultRepository: QuizResultRepository
) {
    
    fun analyzeUserProgress(userId: Long, days: Int = AnalyticsConfig.DEFAULT_PROGRESS_DAYS): List<ProgressData> {
        val fromDate = LocalDateTime.now().minusDays(days.toLong())
        val results = quizResultRepository.findByUserIdAndAnsweredAtAfterOrderByAnsweredAt(userId, fromDate)
        
        return results
            .groupBy { it.answeredAt.toLocalDate() }
            .map { (date, dayResults) ->
                val correct = dayResults.count { it.correct }
                val total = dayResults.size
                val accuracy = calculateAccuracy(correct, total)
                
                ProgressData(
                    date = date,
                    attempts = total,
                    correct = correct,
                    accuracy = accuracy
                )
            }
            .sortedBy { it.date }
    }
    
    fun findLearningTrends(progressData: List<ProgressData>): LearningTrendsResponse {
        if (progressData.size < 2) {
            return LearningTrendsResponse(
                trend = "insufficient_data",
                recentAccuracy = 0.0,
                earlierAccuracy = 0.0,
                improvement = 0.0
            )
        }
        
        val recentAccuracy = progressData.takeLast(7).map { it.accuracy }.average()
        val earlierAccuracy = progressData.take(progressData.size - 7).map { it.accuracy }.average()
        
        val trend = when {
            recentAccuracy > earlierAccuracy + 5 -> "improving"
            recentAccuracy < earlierAccuracy - 5 -> "declining"
            else -> "stable"
        }
        
        return LearningTrendsResponse(
            trend = trend,
            recentAccuracy = recentAccuracy,
            earlierAccuracy = earlierAccuracy,
            improvement = recentAccuracy - earlierAccuracy
        )
    }
    
    private fun calculateAccuracy(correct: Int, total: Int): Double {
        return if (total > 0) (correct.toDouble() / total * 100) else 0.0
    }
}