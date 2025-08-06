package com.chordmind.harmony.service.admin.manager

import com.chordmind.harmony.domain.QuizChoice
import com.chordmind.harmony.domain.QuizQuestion
import com.chordmind.harmony.repository.QuizQuestionRepository
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

@Component
@Transactional
class ChoiceManager(
    private val quizQuestionRepository: QuizQuestionRepository,
    private val questionManager: QuizQuestionManager
) {
    
    fun addChoice(questionId: Long, choiceText: String): QuizQuestion {
        val question = questionManager.findById(questionId)
        val choice = QuizChoice(text = choiceText)
        question.addChoice(choice)
        return quizQuestionRepository.save(question)
    }
    
    fun updateChoices(questionId: Long, choices: List<String>): QuizQuestion {
        val question = questionManager.findById(questionId)
        
        // 기존 선택지 제거
        question.choices.clear()
        
        // 새로운 선택지 추가
        choices.forEach { choiceText ->
            val choice = QuizChoice(text = choiceText)
            question.addChoice(choice)
        }
        
        return quizQuestionRepository.save(question)
    }
    
    fun removeChoice(questionId: Long, choiceId: Long): QuizQuestion {
        val question = questionManager.findById(questionId)
        val choiceToRemove = question.choices.find { it.id == choiceId }
            ?: throw IllegalArgumentException("선택지를 찾을 수 없습니다: $choiceId")
        
        question.choices.remove(choiceToRemove)
        return quizQuestionRepository.save(question)
    }
    
    fun validateChoices(choices: List<String>, answer: String): Boolean {
        return choices.isNotEmpty() && 
               choices.contains(answer) && 
               choices.size >= 2 &&
               choices.distinct().size == choices.size  // 중복 제거
    }
}