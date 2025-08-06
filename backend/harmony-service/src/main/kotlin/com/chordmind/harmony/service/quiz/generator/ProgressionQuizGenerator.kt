package com.chordmind.harmony.service.quiz.generator

import com.chordmind.harmony.domain.*
import com.chordmind.harmony.repository.ProgressionPatternRepository
import com.chordmind.harmony.service.quiz.builder.QuizQuestionBuilder
import com.chordmind.harmony.service.quiz.choice.ChoiceGenerator
import com.chordmind.harmony.service.quiz.config.QuizConfig
import org.springframework.stereotype.Component

@Component
class ProgressionQuizGenerator(
    private val progressionPatternRepository: ProgressionPatternRepository,
    private val choiceGenerator: ChoiceGenerator
) : QuizGenerator() {
    
    override val quizType = QuizType.PROGRESSION
    
    override fun generate(count: Int, maxDifficulty: Int): List<QuizQuestion> {
        return generate(count, maxDifficulty, null)
    }
    
    fun generate(count: Int, maxDifficulty: Int, genre: String?): List<QuizQuestion> {
        validateParameters(count, maxDifficulty)
        
        val availableProgressions = progressionPatternRepository.findAll()
            .filter { progression ->
                val difficultyMatches = progression.difficultyLevelInt <= maxDifficulty
                val genreMatches = genre == null || progression.genreString.equals(genre, ignoreCase = true)
                difficultyMatches && genreMatches
            }
        
        if (availableProgressions.isEmpty()) {
            throw IllegalStateException("화성 진행 패턴 데이터가 부족합니다")
        }
        
        return (1..count).map {
            createProgressionQuestion(availableProgressions)
        }
    }
    
    private fun createProgressionQuestion(availableProgressions: List<ProgressionPattern>): QuizQuestion {
        val progressionPattern = availableProgressions.random()
        
        val choices = choiceGenerator.generateGenericChoices(
            correctAnswer = progressionPattern.pattern,
            availableOptions = availableProgressions,
            valueExtractor = { it.pattern }
        )
        
        return QuizQuestionBuilder()
            .type(quizType)
            .question(QuizConfig.getQuestionTemplate(quizType))
            .answer(progressionPattern.pattern)
            .explanation(QuizConfig.formatExplanation(progressionPattern.pattern, progressionPattern.description))
            .difficulty(progressionPattern.difficultyLevelInt)
            .choices(choices)
            .build()
    }
}