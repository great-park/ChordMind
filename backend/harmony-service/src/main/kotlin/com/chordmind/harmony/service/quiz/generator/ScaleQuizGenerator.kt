package com.chordmind.harmony.service.quiz.generator

import com.chordmind.harmony.domain.*
import com.chordmind.harmony.repository.ScaleTypeRepository
import com.chordmind.harmony.service.quiz.builder.QuizQuestionBuilder
import com.chordmind.harmony.service.quiz.choice.ChoiceGenerator
import com.chordmind.harmony.service.quiz.config.QuizConfig
import org.springframework.stereotype.Component

@Component
class ScaleQuizGenerator(
    private val scaleTypeRepository: ScaleTypeRepository,
    private val choiceGenerator: ChoiceGenerator
) : QuizGenerator() {
    
    override val quizType = QuizType.SCALE
    
    override fun generate(count: Int, maxDifficulty: Int): List<QuizQuestion> {
        validateParameters(count, maxDifficulty)
        
        val availableScales = scaleTypeRepository.findByDifficultyLevelLessThanEqual(maxDifficulty)
        
        if (availableScales.isEmpty()) {
            throw IllegalStateException("스케일 타입 데이터가 부족합니다")
        }
        
        return (1..count).map {
            createScaleQuestion(availableScales)
        }
    }
    
    private fun createScaleQuestion(availableScales: List<ScaleType>): QuizQuestion {
        val scaleType = availableScales.random()
        
        val choices = choiceGenerator.generateGenericChoices(
            correctAnswer = scaleType.name,
            availableOptions = availableScales,
            valueExtractor = { it.name }
        )
        
        return QuizQuestionBuilder()
            .type(quizType)
            .question(QuizConfig.getQuestionTemplate(quizType))
            .answer(scaleType.name)
            .explanation(QuizConfig.formatExplanation(scaleType.name, scaleType.description))
            .difficulty(scaleType.difficultyLevelInt)
            .choices(choices)
            .build()
    }
}