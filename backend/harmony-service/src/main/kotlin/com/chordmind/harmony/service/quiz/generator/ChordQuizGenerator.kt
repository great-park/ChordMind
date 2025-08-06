package com.chordmind.harmony.service.quiz.generator

import com.chordmind.harmony.domain.*
import com.chordmind.harmony.repository.ChordTypeRepository
import com.chordmind.harmony.repository.ScaleRootRepository
import com.chordmind.harmony.service.quiz.builder.QuizQuestionBuilder
import com.chordmind.harmony.service.quiz.choice.ChoiceGenerator
import com.chordmind.harmony.service.quiz.config.QuizConfig
import org.springframework.stereotype.Component

@Component
class ChordQuizGenerator(
    private val chordTypeRepository: ChordTypeRepository,
    private val scaleRootRepository: ScaleRootRepository,
    private val choiceGenerator: ChoiceGenerator
) : QuizGenerator() {
    
    override val quizType = QuizType.CHORD_NAME
    
    override fun generate(count: Int, maxDifficulty: Int): List<QuizQuestion> {
        validateParameters(count, maxDifficulty)
        
        val availableChordTypes = chordTypeRepository.findAll()
            .filter { it.difficultyLevelInt <= maxDifficulty }
        val availableRoots = scaleRootRepository.findAllByOrderByDegreeAsc()
        
        validateData(availableChordTypes, availableRoots)
        
        return (1..count).map {
            createChordQuestion(availableChordTypes, availableRoots)
        }
    }
    
    private fun validateData(chordTypes: List<*>, roots: List<*>) {
        if (chordTypes.isEmpty() || roots.isEmpty()) {
            throw IllegalStateException("코드 타입 또는 루트음 데이터가 부족합니다")
        }
    }
    
    private fun createChordQuestion(chordTypes: List<ChordType>, roots: List<ScaleRoot>): QuizQuestion {
        val root = roots.random()
        val chordType = chordTypes.random()
        val chord = "${root.name}${chordType.symbol}"
        
        val choices = choiceGenerator.generateChordChoices(chord, roots, chordTypes)
        
        return QuizQuestionBuilder()
            .type(quizType)
            .question(QuizConfig.getQuestionTemplate(quizType))
            .answer(chord)
            .explanation(QuizConfig.formatExplanation(chord, chordType.description))
            .difficulty(chordType.difficultyLevelInt)
            .choices(choices)
            .build()
    }
}