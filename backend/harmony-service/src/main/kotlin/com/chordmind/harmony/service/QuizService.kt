package com.chordmind.harmony.service

import com.chordmind.harmony.domain.QuizQuestion
import com.chordmind.harmony.domain.QuizType
import com.chordmind.harmony.dto.QuizAnswerRequest
import com.chordmind.harmony.dto.QuizAnswerResult
import com.chordmind.harmony.repository.QuizQuestionRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class QuizService(
    private val quizQuestionRepository: QuizQuestionRepository
) {
    @Transactional(readOnly = true)
    fun getRandomQuestions(type: QuizType, count: Int): List<QuizQuestion> {
        return quizQuestionRepository.findByType(type).shuffled().take(count)
    }

    @Transactional(readOnly = true)
    fun checkAnswer(request: QuizAnswerRequest): QuizAnswerResult {
        val question = quizQuestionRepository.findById(request.questionId).orElse(null)
            ?: return QuizAnswerResult(request.questionId, false, null)
        val correct = question.answer.equals(request.selected, ignoreCase = true)
        return QuizAnswerResult(
            questionId = question.id,
            correct = correct,
            explanation = question.explanation
        )
    }
} 