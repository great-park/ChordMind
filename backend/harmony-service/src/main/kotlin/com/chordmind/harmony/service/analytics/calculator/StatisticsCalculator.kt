package com.chordmind.harmony.service.analytics.calculator

import com.chordmind.harmony.domain.QuizType
import com.chordmind.harmony.repository.QuizQuestionRepository
import com.chordmind.harmony.repository.QuizResultRepository
import com.chordmind.harmony.service.analytics.dto.*
import org.springframework.stereotype.Component

@Component
class StatisticsCalculator(
    private val quizResultRepository: QuizResultRepository,
    private val quizQuestionRepository: QuizQuestionRepository
) {
    
    fun calculateUserStats(userId: Long): UserStats {
        val totalAttempts = quizResultRepository.countByUserId(userId)
        val correctAnswers = quizResultRepository.countByUserIdAndCorrectTrue(userId)
        val accuracy = calculateAccuracy(correctAnswers, totalAttempts)
        
        val typeStats = QuizType.values().associate { type ->
            type.name to calculateTypeStats(userId, type)
        }
        
        return UserStats(
            totalAttempts = totalAttempts,
            correctAnswers = correctAnswers,
            accuracy = accuracy,
            typeStats = typeStats
        )
    }
    
    fun calculateGlobalStats(): GlobalStats {
        val totalQuestions = quizQuestionRepository.count()
        val totalResults = quizResultRepository.count()
        val totalCorrect = quizResultRepository.countByCorrectTrue()
        val globalAccuracy = calculateAccuracy(totalCorrect, totalResults)
        
        val typeDistribution = QuizType.values().associate { type ->
            type.name to quizQuestionRepository.countByType(type)
        }
        
        return GlobalStats(
            totalQuestions = totalQuestions,
            totalResults = totalResults,
            totalCorrect = totalCorrect,
            globalAccuracy = globalAccuracy,
            typeDistribution = typeDistribution
        )
    }
    
    fun calculateDifficultyAnalysis(userId: Long): DifficultyAnalysis {
        val results = quizResultRepository.findByUserId(userId)
        
        val difficultyStats = (1..3).associate { difficulty ->
            val difficultyQuestions = quizQuestionRepository.findByDifficulty(difficulty)
            val difficultyResults = results.filter { result ->
                difficultyQuestions.any { question -> question.id == result.question.id }
            }
            
            val attempts = difficultyResults.size
            val correct = difficultyResults.count { it.correct }
            val accuracy = calculateAccuracy(correct.toLong(), attempts.toLong())
            
            difficulty to DifficultyStats(
                attempts = attempts,
                correct = correct,
                accuracy = accuracy
            )
        }
        
        return DifficultyAnalysis(difficultyStats)
    }
    
    fun calculateWeakestAreas(userId: Long): List<TypeStats> {
        return QuizType.values().map { type ->
            calculateTypeStats(userId, type)
        }.sortedBy { it.accuracy }
    }
    
    private fun calculateTypeStats(userId: Long, type: QuizType): TypeStats {
        val attempts = quizResultRepository.countByUserIdAndQuestionType(userId, type.name)
        val correct = quizResultRepository.countByUserIdAndQuestionTypeAndCorrectTrue(userId, type.name)
        val accuracy = calculateAccuracy(correct, attempts)
        
        return TypeStats(
            type = type.name,
            attempts = attempts,
            correct = correct,
            accuracy = accuracy
        )
    }
    
    private fun calculateAccuracy(correct: Long, total: Long): Double {
        return if (total > 0) (correct.toDouble() / total * 100) else 0.0
    }
}