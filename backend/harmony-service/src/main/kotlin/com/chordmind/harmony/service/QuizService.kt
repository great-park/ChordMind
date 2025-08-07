package com.chordmind.harmony.service

import com.chordmind.harmony.client.AIClient
import com.chordmind.harmony.domain.QuizQuestion
import com.chordmind.harmony.domain.QuizResult
import com.chordmind.harmony.domain.QuizType
import com.chordmind.harmony.dto.*
import com.chordmind.harmony.repository.QuizQuestionRepository
import com.chordmind.harmony.repository.QuizResultRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.time.LocalDateTime

@Service
class QuizService(
    private val quizQuestionRepository: QuizQuestionRepository,
    private val quizResultRepository: QuizResultRepository,
    private val aiClient: AIClient
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
        
        // Python AI 서비스를 통한 개인화된 피드백 생성
        val aiExplanation = aiClient.generatePersonalizedFeedback(
            userId = request.userId ?: 1L, // 기본값 설정 (실제로는 세션에서 가져와야 함)
            questionType = question.type.name,
            userAnswer = request.selected,
            correctAnswer = question.answer,
            isCorrect = correct,
            previousAnswers = emptyList() // 향후 사용자 히스토리 추가 가능
        )
        
        return QuizAnswerResult(
            questionId = question.id,
            correct = correct,
            explanation = aiExplanation
        )
    }

    @Transactional
    fun saveQuizResult(request: QuizResultRequest): QuizResultResponse {
        val question = quizQuestionRepository.findById(request.questionId).orElseThrow {
            IllegalArgumentException("문제를 찾을 수 없습니다: ${request.questionId}")
        }
        
        val correct = question.answer.equals(request.selected, ignoreCase = true)
        
        val quizResult = QuizResult(
            userId = request.userId,
            question = question,
            selected = request.selected,
            correct = correct
        )
        
        val savedResult = quizResultRepository.save(quizResult)
        
        return QuizResultResponse(
            id = savedResult.id,
            userId = savedResult.userId,
            questionId = savedResult.question.id,
            selected = savedResult.selected,
            correct = savedResult.correct,
            answeredAt = savedResult.answeredAt
        )
    }

    @Transactional(readOnly = true)
    fun getQuizRankings(fromDate: LocalDate, toDate: LocalDate): List<QuizRankingDto> {
        val startDateTime = fromDate.atStartOfDay()
        val endDateTime = toDate.atTime(23, 59, 59)
        
        val rankingData = quizResultRepository.findRankingData(startDateTime, endDateTime)
        
        return rankingData.mapIndexed { index, data ->
            val userId = data[0] as Long
            val totalQuestions = (data[1] as Number).toInt()
            val correctAnswers = (data[2] as Number).toInt()
            val accuracy = if (totalQuestions > 0) {
                (correctAnswers.toDouble() / totalQuestions.toDouble()) * 100
            } else 0.0
            
            QuizRankingDto(
                userId = userId,
                userName = "사용자${userId}", // 실제로는 User Service에서 사용자 이름을 가져와야 함
                score = correctAnswers * 10, // 간단한 점수 계산 로직
                accuracy = accuracy,
                totalQuestions = totalQuestions,
                correctAnswers = correctAnswers,
                rank = index + 1
            )
        }
    }
} 