package com.chordmind.harmony.service

import com.chordmind.harmony.client.AIClient
import com.chordmind.harmony.domain.QuizQuestion
import com.chordmind.harmony.domain.QuizType
import com.chordmind.harmony.dto.QuizAnswerRequest
import com.chordmind.harmony.dto.QuizAnswerResult
import com.chordmind.harmony.repository.QuizQuestionRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class QuizService(
    private val quizQuestionRepository: QuizQuestionRepository,
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
} 