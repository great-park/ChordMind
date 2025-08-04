package com.chordmind.harmony.service

import com.chordmind.harmony.HarmonyServiceApplication
import com.chordmind.harmony.config.TestConfig
import com.chordmind.harmony.domain.QuizType
import com.chordmind.harmony.dto.QuizAnswerRequest
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import org.springframework.transaction.annotation.Transactional

@SpringBootTest(
    classes = [HarmonyServiceApplication::class],
    properties = [
        "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.jpa.show-sql=true",
        "spring.jpa.properties.hibernate.format_sql=true",
        "ai.service.url=http://mock-ai-service"
    ]
)
@Import(TestConfig::class)
@Transactional
class QuizServiceTest @Autowired constructor(
    private val quizService: QuizService
) {
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
        assertNotNull(result.explanation)
        assertTrue(result.explanation!!.contains("정답입니다"))
    }

    @Test
    fun `오답을 제출하면 correct false를 반환한다`() {
        val questions = quizService.getRandomQuestions(QuizType.CHORD_NAME, 1)
        val q = questions.first()
        val wrong = q.choices.first { it.text != q.answer }.text
        val result = quizService.checkAnswer(QuizAnswerRequest(q.id, wrong))
        assertFalse(result.correct)
        assertEquals(q.id, result.questionId)
        assertNotNull(result.explanation)
        assertTrue(result.explanation!!.contains("아쉽네요") || result.explanation!!.contains("정답은"))
    }

    @Test
    fun `존재하지 않는 문제에 대해 정답 판정시 correct false와 null 해설을 반환한다`() {
        val result = quizService.checkAnswer(QuizAnswerRequest(9999L, "Cmaj7"))
        assertFalse(result.correct)
        assertEquals(9999L, result.questionId)
        assertNull(result.explanation)
    }

    @Test
    fun `코드 진행, 음정, 스케일 퀴즈도 정상 동작한다`() {
        val progression = quizService.getRandomQuestions(QuizType.PROGRESSION, 1).first()
        assertEquals(QuizType.PROGRESSION, progression.type)
        assertTrue(progression.choices.any { it.text == progression.answer })
        assertTrue(quizService.checkAnswer(QuizAnswerRequest(progression.id, progression.answer)).correct)

        val interval = quizService.getRandomQuestions(QuizType.INTERVAL, 1).first()
        assertEquals(QuizType.INTERVAL, interval.type)
        assertTrue(interval.choices.any { it.text == interval.answer })
        assertTrue(quizService.checkAnswer(QuizAnswerRequest(interval.id, interval.answer)).correct)

        val scale = quizService.getRandomQuestions(QuizType.SCALE, 1).first()
        assertEquals(QuizType.SCALE, scale.type)
        assertTrue(scale.choices.any { it.text == scale.answer })
        assertTrue(quizService.checkAnswer(QuizAnswerRequest(scale.id, scale.answer)).correct)
    }
} 