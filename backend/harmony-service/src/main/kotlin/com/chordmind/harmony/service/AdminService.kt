package com.chordmind.harmony.service

import com.chordmind.harmony.domain.QuizChoice
import com.chordmind.harmony.domain.QuizQuestion
import com.chordmind.harmony.domain.QuizType
import com.chordmind.harmony.dto.QuizQuestionRequest
import com.chordmind.harmony.exception.QuizNotFoundException
import com.chordmind.harmony.repository.QuizQuestionRepository
import org.springframework.data.domain.PageRequest
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class AdminService(
    private val quizQuestionRepository: QuizQuestionRepository
) {
    
    fun createQuestion(request: QuizQuestionRequest): QuizQuestion {
        val question = QuizQuestion(
            type = request.type,
            question = request.question,
            imageUrl = request.imageUrl,
            answer = request.answer,
            explanation = request.explanation,
            difficulty = request.difficulty
        )
        
        // 선택지 추가
        request.choices.forEach { choiceText ->
            val choice = QuizChoice(text = choiceText)
            question.addChoice(choice)
        }
        
        return quizQuestionRepository.save(question)
    }
    
    @Transactional(readOnly = true)
    fun getAllQuestions(type: QuizType?, page: Int, size: Int): Map<String, Any> {
        val pageRequest = PageRequest.of(page, size)
        val pageResult = if (type != null) {
            quizQuestionRepository.findByType(type, pageRequest)
        } else {
            quizQuestionRepository.findAll(pageRequest)
        }
        
        return mapOf(
            "content" to pageResult.content,
            "totalElements" to pageResult.totalElements,
            "totalPages" to pageResult.totalPages,
            "currentPage" to pageResult.number,
            "size" to pageResult.size
        )
    }
    
    @Transactional(readOnly = true)
    fun getQuestion(id: Long): QuizQuestion {
        return quizQuestionRepository.findById(id)
            .orElseThrow { QuizNotFoundException("퀴즈 문제를 찾을 수 없습니다: $id") }
    }
    
    fun updateQuestion(id: Long, request: QuizQuestionRequest): QuizQuestion {
        val existingQuestion = getQuestion(id)
        
        existingQuestion.apply {
            type = request.type
            question = request.question
            imageUrl = request.imageUrl
            answer = request.answer
            explanation = request.explanation
            difficulty = request.difficulty
        }
        
        // 기존 선택지 제거
        existingQuestion.choices.clear()
        
        // 새로운 선택지 추가
        request.choices.forEach { choiceText ->
            val choice = QuizChoice(text = choiceText)
            existingQuestion.addChoice(choice)
        }
        
        return quizQuestionRepository.save(existingQuestion)
    }
    
    fun deleteQuestion(id: Long) {
        val question = getQuestion(id)
        quizQuestionRepository.delete(question)
    }
    
    fun addChoice(questionId: Long, choiceText: String): QuizQuestion {
        val question = getQuestion(questionId)
        val choice = QuizChoice(text = choiceText)
        question.addChoice(choice)
        return quizQuestionRepository.save(question)
    }
    
    fun deleteChoice(questionId: Long, choiceId: Long): QuizQuestion {
        val question = getQuestion(questionId)
        val choiceToRemove = question.choices.find { it.id == choiceId }
            ?: throw IllegalArgumentException("선택지를 찾을 수 없습니다: $choiceId")
        
        question.choices.remove(choiceToRemove)
        return quizQuestionRepository.save(question)
    }
} 