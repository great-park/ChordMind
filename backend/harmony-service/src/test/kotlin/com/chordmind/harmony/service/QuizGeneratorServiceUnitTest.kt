package com.chordmind.harmony.service

import com.chordmind.harmony.domain.*
import com.chordmind.harmony.repository.*
import com.chordmind.harmony.service.quiz.factory.QuizGeneratorFactory
import com.chordmind.harmony.service.quiz.generator.ProgressionQuizGenerator
import com.chordmind.harmony.service.quiz.generator.QuizGenerator
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.mockito.Mock
import org.mockito.MockitoAnnotations
import org.mockito.Mockito
import java.math.BigDecimal

/**
 * QuizGeneratorService 단위 테스트
 * Mock을 사용한 가벼운 테스트
 */
class QuizGeneratorServiceUnitTest {

    @Mock
    private lateinit var quizQuestionRepository: QuizQuestionRepository
    @Mock
    private lateinit var quizGeneratorFactory: QuizGeneratorFactory
    @Mock
    private lateinit var progressionQuizGenerator: ProgressionQuizGenerator

    private lateinit var quizGeneratorService: QuizGeneratorService

    @BeforeEach
    fun setUp() {
        MockitoAnnotations.openMocks(this)
        quizGeneratorService = QuizGeneratorService(
            quizQuestionRepository,
            quizGeneratorFactory,
            progressionQuizGenerator
        )
    }

    @Test
    fun `코드 문제 생성 테스트`() {
        // Given
        val mockGen = Mockito.mock(QuizGenerator::class.java)
        Mockito.`when`(quizGeneratorFactory.getGenerator(QuizType.CHORD_NAME)).thenReturn(mockGen)
        val questions = (1..2).map {
            val q = QuizQuestion(
                type = QuizType.CHORD_NAME,
                question = "다음 코드의 이름은?",
                answer = "Cmaj",
                explanation = "설명",
                difficulty = 1
            )
            q.apply {
                (1..4).forEach { addChoice(QuizChoice(text = "opt$it")) }
            }
        }
        Mockito.`when`(mockGen.generate(2, 2)).thenReturn(questions)

        // When
        val generatedQuestions = quizGeneratorService.generateChordQuestions(2, 2)

        // Then
        assertEquals(2, generatedQuestions.size)
        generatedQuestions.forEach { question ->
            assertEquals(QuizType.CHORD_NAME, question.type)
            assertNotNull(question.question)
            assertNotNull(question.answer)
            assertEquals(4, question.choices.size)
        }
    }

    @Test
    fun `음정 문제 생성 테스트`() {
        // Given
        val mockGen = Mockito.mock(QuizGenerator::class.java)
        Mockito.`when`(quizGeneratorFactory.getGenerator(QuizType.INTERVAL)).thenReturn(mockGen)
        val questions = (1..2).map {
            val q = QuizQuestion(
                type = QuizType.INTERVAL,
                question = "다음 음정은?",
                answer = "P1",
                explanation = "설명",
                difficulty = 1
            )
            q.apply { (1..4).forEach { addChoice(QuizChoice(text = "opt$it")) } }
        }
        Mockito.`when`(mockGen.generate(2, 2)).thenReturn(questions)

        // When
        val generatedQuestions = quizGeneratorService.generateIntervalQuestions(2, 2)

        // Then
        assertEquals(2, generatedQuestions.size)
        generatedQuestions.forEach { question ->
            assertEquals(QuizType.INTERVAL, question.type)
            assertNotNull(question.question)
            assertNotNull(question.answer)
            assertEquals(4, question.choices.size)
        }
    }

    @Test
    fun `스케일 문제 생성 테스트`() {
        // Given
        val mockGen = Mockito.mock(QuizGenerator::class.java)
        Mockito.`when`(quizGeneratorFactory.getGenerator(QuizType.SCALE)).thenReturn(mockGen)
        val questions = (1..2).map {
            val q = QuizQuestion(
                type = QuizType.SCALE,
                question = "다음 스케일은?",
                answer = "C major",
                explanation = "설명",
                difficulty = 1
            )
            q.apply { (1..4).forEach { addChoice(QuizChoice(text = "opt$it")) } }
        }
        Mockito.`when`(mockGen.generate(2, 2)).thenReturn(questions)

        // When
        val generatedQuestions = quizGeneratorService.generateScaleQuestions(2, 2)

        // Then
        assertEquals(2, generatedQuestions.size)
        generatedQuestions.forEach { question ->
            assertEquals(QuizType.SCALE, question.type)
            assertNotNull(question.question)
            assertNotNull(question.answer)
            assertEquals(4, question.choices.size)
        }
    }

    @Test
    fun `화성 진행 문제 생성 테스트`() {
        // Given
        val questions = (1..2).map {
            val q = QuizQuestion(
                type = QuizType.PROGRESSION,
                question = "다음 진행은?",
                answer = if (it == 1) "I-IV-V" else "I-V-vi-IV",
                explanation = "설명",
                difficulty = 1
            )
            q.apply { (1..4).forEach { addChoice(QuizChoice(text = "opt$it")) } }
        }
        Mockito.`when`(progressionQuizGenerator.generate(2, 2, null)).thenReturn(questions)

        // When
        val generatedQuestions = quizGeneratorService.generateProgressionQuestions(2, 2)

        // Then
        assertEquals(2, generatedQuestions.size)
        generatedQuestions.forEach { question ->
            assertEquals(QuizType.PROGRESSION, question.type)
            assertNotNull(question.question)
            assertNotNull(question.answer)
            assertEquals(4, question.choices.size)
        }
    }

    @Test
    fun `데이터가 없을 때 예외 발생 테스트`() {
        // Given
        val mockGen = Mockito.mock(QuizGenerator::class.java)
        Mockito.`when`(quizGeneratorFactory.getGenerator(QuizType.CHORD_NAME)).thenReturn(mockGen)
        Mockito.`when`(mockGen.generate(1, 2)).thenThrow(IllegalStateException("코드 타입 또는 루트음 데이터가 부족합니다"))

        // When & Then
        assertThrows(IllegalStateException::class.java) {
            quizGeneratorService.generateChordQuestions(1, 2)
        }
    }

    @Test
    fun `장르별 화성 진행 필터링 테스트`() {
        // Given
        val questions = listOf(
            QuizQuestion(
                type = QuizType.PROGRESSION,
                question = "다음 진행은?",
                answer = "I-V-vi-IV",
                explanation = "설명",
                difficulty = 1,
                choices = mutableListOf(QuizChoice(text = "I-V-vi-IV"))
            )
        )
        Mockito.`when`(progressionQuizGenerator.generate(1, 2, "POP")).thenReturn(questions)
        val popQuestions = quizGeneratorService.generateProgressionQuestions(1, 2, "POP")
        assertEquals(1, popQuestions.size)
        assertEquals("I-V-vi-IV", popQuestions.first().answer)
    }
}