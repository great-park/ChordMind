package com.chordmind.harmony.service

import com.chordmind.harmony.domain.QuizType
import com.chordmind.harmony.repository.QuizQuestionRepository
import com.chordmind.harmony.repository.QuizResultRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
@Transactional(readOnly = true)
class AnalyticsService(
    private val quizResultRepository: QuizResultRepository,
    private val quizQuestionRepository: QuizQuestionRepository
) {
    
    fun getUserStats(userId: Long): Map<String, Any> {
        val totalAttempts = quizResultRepository.countByUserId(userId)
        val correctAnswers = quizResultRepository.countByUserIdAndCorrectTrue(userId)
        val accuracy = if (totalAttempts > 0) (correctAnswers.toDouble() / totalAttempts * 100) else 0.0
        
        val typeStats = QuizType.values().associate { type ->
            val typeAttempts = quizResultRepository.countByUserIdAndQuestionType(userId, type)
            val typeCorrect = quizResultRepository.countByUserIdAndQuestionTypeAndCorrectTrue(userId, type)
            val typeAccuracy = if (typeAttempts > 0) (typeCorrect.toDouble() / typeAttempts * 100) else 0.0
            
            type.name to mapOf(
                "attempts" to typeAttempts,
                "correct" to typeCorrect,
                "accuracy" to typeAccuracy
            )
        }
        
        return mapOf(
            "totalAttempts" to totalAttempts,
            "correctAnswers" to correctAnswers,
            "accuracy" to accuracy,
            "typeStats" to typeStats
        )
    }
    
    fun getUserProgress(userId: Long, days: Int = 30): List<Map<String, Any>> {
        val fromDate = LocalDateTime.now().minusDays(days.toLong())
        val results = quizResultRepository.findByUserIdAndAnsweredAtAfterOrderByAnsweredAt(userId, fromDate)
        
        return results.groupBy { it.answeredAt.toLocalDate() }
            .map { (date, dayResults) ->
                val correct = dayResults.count { result -> result.correct }
                val total = dayResults.size
                val accuracy = if (total > 0) (correct.toDouble() / total * 100) else 0.0
                
                mapOf(
                    "date" to date.toString(),
                    "attempts" to total,
                    "correct" to correct,
                    "accuracy" to accuracy
                )
            }
            .sortedBy { it["date"] as String }
    }
    
    fun getDifficultyAnalysis(userId: Long): Map<String, Any> {
        val results = quizResultRepository.findByUserId(userId)
        
        val difficultyStats = (1..3).associate { difficulty ->
            val difficultyQuestions = quizQuestionRepository.findByDifficulty(difficulty)
            val difficultyResults = results.filter { result ->
                difficultyQuestions.any { question -> question.id == result.question.id }
            }
            
            val attempts = difficultyResults.size
            val correct = difficultyResults.count { result -> result.correct }
            val accuracy = if (attempts > 0) (correct.toDouble() / attempts * 100) else 0.0
            
            difficulty.toString() to mapOf(
                "attempts" to attempts,
                "correct" to correct,
                "accuracy" to accuracy
            )
        }
        
        return mapOf("difficultyStats" to difficultyStats)
    }
    
    fun getWeakestAreas(userId: Long): List<Map<String, Any>> {
        val typeStats = QuizType.values().map { type ->
            val attempts = quizResultRepository.countByUserIdAndQuestionType(userId, type)
            val correct = quizResultRepository.countByUserIdAndQuestionTypeAndCorrectTrue(userId, type)
            val accuracy = if (attempts > 0) (correct.toDouble() / attempts * 100) else 0.0
            
            mapOf(
                "type" to type.name,
                "attempts" to attempts,
                "correct" to correct,
                "accuracy" to accuracy
            )
        }
        
        return typeStats.sortedBy { it["accuracy"] as Double }
    }
    
    fun getRecommendations(userId: Long): List<String> {
        val recommendations = mutableListOf<String>()
        val stats = getUserStats(userId)
        val typeStats = stats["typeStats"] as Map<String, Map<String, Any>>
        
        // 정확도가 낮은 영역 추천
        typeStats.forEach { (type, typeData) ->
            val accuracy = typeData["accuracy"] as Double
            if (accuracy < 70.0) {
                recommendations.add("$type 영역의 정확도가 낮습니다. 더 많은 연습이 필요합니다.")
            }
        }
        
        // 전체 정확도 기반 추천
        val overallAccuracy = stats["accuracy"] as Double
        when {
            overallAccuracy < 50.0 -> recommendations.add("기본 개념부터 차근차근 학습하세요.")
            overallAccuracy < 70.0 -> recommendations.add("약점 영역을 집중적으로 연습하세요.")
            overallAccuracy < 90.0 -> recommendations.add("고급 문제에 도전해보세요.")
            else -> recommendations.add("훌륭합니다! 새로운 도전을 시도해보세요.")
        }
        
        return recommendations
    }
    
    fun getGlobalStats(): Map<String, Any> {
        val totalQuestions = quizQuestionRepository.count()
        val totalResults = quizResultRepository.count()
        val totalCorrect = quizResultRepository.countByCorrectTrue()
        val globalAccuracy = if (totalResults > 0) (totalCorrect.toDouble() / totalResults * 100) else 0.0
        
        val typeDistribution = QuizType.values().associate { type ->
            val count = quizQuestionRepository.countByType(type)
            type.name to count
        }
        
        return mapOf(
            "totalQuestions" to totalQuestions,
            "totalResults" to totalResults,
            "totalCorrect" to totalCorrect,
            "globalAccuracy" to globalAccuracy,
            "typeDistribution" to typeDistribution
        )
    }
} 