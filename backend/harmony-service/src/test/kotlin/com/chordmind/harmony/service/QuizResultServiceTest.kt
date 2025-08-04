package com.chordmind.harmony.service

import com.chordmind.harmony.config.TestConfig
import com.chordmind.harmony.domain.QuizType
import com.chordmind.harmony.dto.QuizResultRequest
import com.chordmind.harmony.repository.QuizQuestionRepository
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@SpringBootTest(
    properties = [
        "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "ai.service.url=http://mock-ai-service"
    ]
)
@Import(TestConfig::class)
@Transactional
class QuizResultServiceTest @Autowired constructor(
    private val quizResultService: QuizResultService,
    private val quizQuestionRepository: QuizQuestionRepository
) {
    @Test
    fun `퀴즈 결과 저장 및 정답 판정이 정상 동작한다`() {
        val question = quizQuestionRepository.findByType(QuizType.CHORD_NAME).first()
        val req = QuizResultRequest(userId = 1L, questionId = question.id, selected = question.answer)
        val res = quizResultService.saveResult(req)
        assertTrue(res.correct)
        assertEquals(req.userId, res.userId)
        assertEquals(req.questionId, res.questionId)
        assertEquals(req.selected, res.selected)
        assertNotNull(res.answeredAt)
    }

    @Test
    fun `퀴즈 랭킹 조회가 정상 동작한다`() {
        val question = quizQuestionRepository.findByType(QuizType.CHORD_NAME).first()
        // 3명의 유저가 각각 2, 1, 0회 정답
        repeat(2) { quizResultService.saveResult(QuizResultRequest(1, question.id, question.answer)) }
        quizResultService.saveResult(QuizResultRequest(2, question.id, question.answer))
        quizResultService.saveResult(QuizResultRequest(3, question.id, "오답"))
        val from = LocalDateTime.now().minusDays(1)
        val to = LocalDateTime.now().plusDays(1)
        val rankings = quizResultService.getRankings(from, to)
        assertEquals(2, rankings[0].score)
        assertEquals(1, rankings[1].score)
        assertEquals(1L, rankings[0].userId)
        assertEquals(2L, rankings[1].userId)
    }
} 