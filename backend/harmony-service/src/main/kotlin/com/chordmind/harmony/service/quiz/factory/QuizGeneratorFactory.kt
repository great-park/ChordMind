package com.chordmind.harmony.service.quiz.factory

import com.chordmind.harmony.domain.QuizType
import com.chordmind.harmony.service.quiz.generator.*
import org.springframework.stereotype.Component

@Component
class QuizGeneratorFactory(
    private val chordQuizGenerator: ChordQuizGenerator,
    private val intervalQuizGenerator: IntervalQuizGenerator,
    private val scaleQuizGenerator: ScaleQuizGenerator,
    private val progressionQuizGenerator: ProgressionQuizGenerator
) {
    
    private val generators = mapOf(
        QuizType.CHORD_NAME to chordQuizGenerator,
        QuizType.INTERVAL to intervalQuizGenerator,
        QuizType.SCALE to scaleQuizGenerator,
        QuizType.PROGRESSION to progressionQuizGenerator
    )
    
    fun getGenerator(type: QuizType): QuizGenerator {
        return generators[type] ?: throw IllegalArgumentException("지원하지 않는 퀴즈 타입: $type")
    }
    
    fun getAllGenerators(): Map<QuizType, QuizGenerator> = generators
    
    fun getSupportedTypes(): Set<QuizType> = generators.keys
}