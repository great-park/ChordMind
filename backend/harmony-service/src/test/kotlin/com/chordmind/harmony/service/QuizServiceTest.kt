package com.chordmind.harmony.service

import com.chordmind.harmony.domain.QuizType
import com.chordmind.harmony.dto.QuizAnswerRequest
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

class QuizServiceTest {
    private lateinit var quizService: QuizService

    @BeforeEach
    fun setUp() {
        quizService = QuizService()
    }

    @Test
    fun `랜덤 코드 이름 퀴즈를 지정 개수만큼 반환한다`() {
        val questions = quizService.getRandomQuestions(QuizType.CHORD_NAME, 2)
        assertEquals(2, questions.size)
        assertTrue(questions.all { it.type == QuizType.CHORD_NAME })
    }

    @Test
    fun `정답을 맞추면 correct true를 반환한다`() {
        val questions = quizService.getRandomQuestions(QuizType.CHORD_NAME, 1)
        val q = questions.first()
        val result = quizService.checkAnswer(QuizAnswerRequest(q.id, q.answer))
        assertTrue(result.correct)
        assertEquals(q.id, result.questionId)
        assertEquals(q.explanation, result.explanation)
    }

    @Test
    fun `오답을 제출하면 correct false를 반환한다`() {
        val questions = quizService.getRandomQuestions(QuizType.CHORD_NAME, 1)
        val q = questions.first()
        val wrong = q.choices.first { it != q.answer }
        val result = quizService.checkAnswer(QuizAnswerRequest(q.id, wrong))
        assertFalse(result.correct)
        assertEquals(q.id, result.questionId)
        assertEquals(q.explanation, result.explanation)
    }

    @Test
    fun `존재하지 않는 문제에 대해 정답 판정시 correct false와 null 해설을 반환한다`() {
        val result = quizService.checkAnswer(QuizAnswerRequest(9999L, "Cmaj7"))
        assertFalse(result.correct)
        assertEquals(9999L, result.questionId)
        assertNull(result.explanation)
    }
} 