package com.chordmind.harmony.service

import com.chordmind.harmony.domain.QuizResult
import com.chordmind.harmony.dto.QuizResultRequest
import com.chordmind.harmony.dto.QuizResultResponse
import com.chordmind.harmony.dto.QuizRankingDto
import com.chordmind.harmony.repository.QuizQuestionRepository
import com.chordmind.harmony.repository.QuizResultRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class QuizResultService(
    private val quizResultRepository: QuizResultRepository,
    private val quizQuestionRepository: QuizQuestionRepository
) {
    @Transactional
    fun saveResult(request: QuizResultRequest): QuizResultResponse {
        val question = quizQuestionRepository.findById(request.questionId).orElseThrow()
        val correct = question.answer.equals(request.selected, ignoreCase = true)
        val result = quizResultRepository.save(
            QuizResult(
                userId = request.userId,
                question = question,
                selected = request.selected,
                correct = correct
            )
        )
        return QuizResultResponse(
            id = result.id,
            userId = result.userId,
            questionId = result.question.id,
            selected = result.selected,
            correct = result.correct,
            answeredAt = result.answeredAt
        )
    }

    @Transactional(readOnly = true)
    fun getRankings(from: LocalDateTime, to: LocalDateTime): List<QuizRankingDto> {
        return quizResultRepository.findRankings(from, to)
            .map { QuizRankingDto(userId = (it[0] as Number).toLong(), score = (it[1] as Number).toLong()) }
    }
} 