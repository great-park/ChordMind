package com.chordmind.harmony.service.quiz.generator

import com.chordmind.harmony.domain.*
import com.chordmind.harmony.repository.IntervalTypeRepository
import com.chordmind.harmony.service.quiz.builder.QuizQuestionBuilder
import com.chordmind.harmony.service.quiz.choice.ChoiceGenerator
import com.chordmind.harmony.service.quiz.config.QuizConfig
import org.springframework.stereotype.Component

@Component
class IntervalQuizGenerator(
    private val intervalTypeRepository: IntervalTypeRepository,
    private val choiceGenerator: ChoiceGenerator
) : QuizGenerator() {
    
    override val quizType = QuizType.INTERVAL
    
    override fun generate(count: Int, maxDifficulty: Int): List<QuizQuestion> {
        validateParameters(count, maxDifficulty)
        
        val availableIntervals = intervalTypeRepository.findByDifficultyLevelLessThanEqual(maxDifficulty)
        
        if (availableIntervals.isEmpty()) {
            throw IllegalStateException("음정 타입 데이터가 부족합니다")
        }
        
        return (1..count).map {
            createIntervalQuestion(availableIntervals)
        }
    }
    
    private fun createIntervalQuestion(availableIntervals: List<IntervalType>): QuizQuestion {
        val intervalType = availableIntervals.random()
        
        val choices = choiceGenerator.generateGenericChoices(
            correctAnswer = intervalType.name,
            availableOptions = availableIntervals,
            valueExtractor = { it.name }
        )
        
        return QuizQuestionBuilder()
            .type(quizType)
            .question(QuizConfig.getQuestionTemplate(quizType))
            .answer(intervalType.name)
            .explanation(QuizConfig.formatExplanation(intervalType.name, intervalType.description))
            .difficulty(intervalType.difficultyLevelInt)
            .choices(choices)
            .build()
    }
}