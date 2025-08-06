package com.chordmind.harmony.service.admin.manager

import com.chordmind.harmony.domain.QuizQuestion
import com.chordmind.harmony.domain.QuizType
import com.chordmind.harmony.dto.QuizQuestionRequest
import com.chordmind.harmony.exception.QuizNotFoundException
import com.chordmind.harmony.repository.QuizQuestionRepository
import com.chordmind.harmony.service.quiz.builder.QuizQuestionBuilder
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

@Component
@Transactional
class QuizQuestionManager(
    private val quizQuestionRepository: QuizQuestionRepository
) {
    
    fun createQuestion(request: QuizQuestionRequest): QuizQuestion {
        val question = QuizQuestionBuilder()
            .type(request.type)
            .question(request.question)
            .answer(request.answer)
            .explanation(request.explanation ?: "")
            .difficulty(request.difficulty)
            .choices(request.choices)
            .build()
        
        return quizQuestionRepository.save(question)
    }
    
    @Transactional(readOnly = true)
    fun findById(id: Long): QuizQuestion {
        return quizQuestionRepository.findById(id)
            .orElseThrow { QuizNotFoundException("퀴즈 문제를 찾을 수 없습니다: $id") }
    }
    
    @Transactional(readOnly = true)
    fun findAll(type: QuizType?, pageRequest: PageRequest): Page<QuizQuestion> {
        return if (type != null) {
            quizQuestionRepository.findByType(type, pageRequest)
        } else {
            quizQuestionRepository.findAll(pageRequest)
        }
    }
    
    fun updateQuestion(id: Long, request: QuizQuestionRequest): QuizQuestion {
        val existingQuestion = findById(id)
        
        existingQuestion.apply {
            type = request.type
            question = request.question
            imageUrl = request.imageUrl
            answer = request.answer
            explanation = request.explanation
            difficulty = request.difficulty
        }
        
        return quizQuestionRepository.save(existingQuestion)
    }
    
    fun deleteQuestion(id: Long) {
        val question = findById(id)
        quizQuestionRepository.delete(question)
    }
    
    fun existsById(id: Long): Boolean {
        return quizQuestionRepository.existsById(id)
    }
}