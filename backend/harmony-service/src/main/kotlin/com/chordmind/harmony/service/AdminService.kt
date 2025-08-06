package com.chordmind.harmony.service

import com.chordmind.harmony.domain.QuizQuestion
import com.chordmind.harmony.domain.QuizType
import com.chordmind.harmony.dto.QuizQuestionRequest
import com.chordmind.harmony.service.admin.manager.ChoiceManager
import com.chordmind.harmony.service.admin.manager.QuizQuestionManager
import com.chordmind.harmony.service.admin.validator.QuizQuestionValidator
import com.chordmind.harmony.service.admin.dto.QuestionPageResponse
import com.chordmind.harmony.service.admin.dto.ValidationResponse
import org.springframework.data.domain.PageRequest
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class AdminService(
    private val questionManager: QuizQuestionManager,
    private val choiceManager: ChoiceManager,
    private val validator: QuizQuestionValidator
) {
    
    fun createQuestion(request: QuizQuestionRequest): QuizQuestion {
        val validationResult = validator.validate(request)
        if (!validationResult.isValid) {
            throw IllegalArgumentException("검증 실패: ${validationResult.errors.joinToString(", ")}")
        }
        
        return questionManager.createQuestion(request)
    }
    
    @Transactional(readOnly = true)
    fun getAllQuestions(type: QuizType?, page: Int, size: Int): QuestionPageResponse {
        val pageRequest = PageRequest.of(page, size)
        val pageResult = questionManager.findAll(type, pageRequest)
        
        return QuestionPageResponse(
            content = pageResult.content,
            totalElements = pageResult.totalElements,
            totalPages = pageResult.totalPages,
            currentPage = pageResult.number,
            size = pageResult.size
        )
    }
    
    @Transactional(readOnly = true)
    fun getQuestion(id: Long): QuizQuestion {
        return questionManager.findById(id)
    }
    
    fun updateQuestion(id: Long, request: QuizQuestionRequest): QuizQuestion {
        val validationResult = validator.validate(request)
        if (!validationResult.isValid) {
            throw IllegalArgumentException("검증 실패: ${validationResult.errors.joinToString(", ")}")
        }
        
        questionManager.updateQuestion(id, request)
        return choiceManager.updateChoices(id, request.choices)
    }
    
    fun deleteQuestion(id: Long) {
        questionManager.deleteQuestion(id)
    }
    
    fun addChoice(questionId: Long, choiceText: String): QuizQuestion {
        if (choiceText.isBlank()) {
            throw IllegalArgumentException("선택지 내용은 필수입니다")
        }
        return choiceManager.addChoice(questionId, choiceText)
    }
    
    fun deleteChoice(questionId: Long, choiceId: Long): QuizQuestion {
        return choiceManager.removeChoice(questionId, choiceId)
    }
    
    /**
     * 새로운 기능: 문제 검증
     */
    fun validateQuestion(request: QuizQuestionRequest): ValidationResponse {
        val validationResult = validator.validate(request)
        return ValidationResponse(
            isValid = validationResult.isValid,
            errors = validationResult.errors
        )
    }
    
    /**
     * 새로운 기능: 문제 존재 여부 확인
     */
    fun questionExists(id: Long): Boolean {
        return questionManager.existsById(id)
    }
} 