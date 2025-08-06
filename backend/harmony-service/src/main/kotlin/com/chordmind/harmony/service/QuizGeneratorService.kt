package com.chordmind.harmony.service

import com.chordmind.harmony.domain.*
import com.chordmind.harmony.repository.QuizQuestionRepository
import com.chordmind.harmony.service.quiz.factory.QuizGeneratorFactory
import com.chordmind.harmony.service.quiz.generator.ProgressionQuizGenerator
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class QuizGeneratorService(
    private val quizQuestionRepository: QuizQuestionRepository,
    private val quizGeneratorFactory: QuizGeneratorFactory,
    private val progressionQuizGenerator: ProgressionQuizGenerator
) {
    
    fun generateChordQuestions(count: Int, maxDifficulty: Int = 3): List<QuizQuestion> {
        return quizGeneratorFactory.getGenerator(QuizType.CHORD_NAME)
            .generate(count, maxDifficulty)
    }
    
    fun generateProgressionQuestions(count: Int, maxDifficulty: Int = 3, genre: String? = null): List<QuizQuestion> {
        return progressionQuizGenerator.generate(count, maxDifficulty, genre)
    }
    
    fun generateIntervalQuestions(count: Int, maxDifficulty: Int = 3): List<QuizQuestion> {
        return quizGeneratorFactory.getGenerator(QuizType.INTERVAL)
            .generate(count, maxDifficulty)
    }
    
    fun generateScaleQuestions(count: Int, maxDifficulty: Int = 3): List<QuizQuestion> {
        return quizGeneratorFactory.getGenerator(QuizType.SCALE)
            .generate(count, maxDifficulty)
    }
    
    /**
     * 타입별 문제 생성
     */
    @Transactional
    fun generateQuestionsByType(type: QuizType, count: Int, maxDifficulty: Int = 3): List<QuizQuestion> {
        return quizGeneratorFactory.getGenerator(type).generate(count, maxDifficulty)
    }
    
    /**
     * 혼합 문제 생성
     */
    @Transactional
    fun generateMixedQuestions(totalCount: Int, maxDifficulty: Int = 3): List<QuizQuestion> {
        val supportedTypes = quizGeneratorFactory.getSupportedTypes().toList()
        val countPerType = totalCount / supportedTypes.size
        val remainder = totalCount % supportedTypes.size
        
        return supportedTypes.mapIndexed { index, type ->
            val count = countPerType + if (index < remainder) 1 else 0
            generateQuestionsByType(type, count, maxDifficulty)
        }.flatten().shuffled()
    }
    
    /**
     * 문제 생성 후 저장
     */
    @Transactional
    fun generateAndSaveQuestions(type: QuizType, count: Int, maxDifficulty: Int = 3): List<QuizQuestion> {
        val questions = generateQuestionsByType(type, count, maxDifficulty)
        return quizQuestionRepository.saveAll(questions)
    }
}