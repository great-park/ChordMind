package com.chordmind.harmony.service.admin.validator

import com.chordmind.harmony.dto.QuizQuestionRequest
import org.springframework.stereotype.Component

@Component
class QuizQuestionValidator {
    
    fun validate(request: QuizQuestionRequest): ValidationResult {
        val errors = mutableListOf<String>()
        
        validateQuestion(request.question, errors)
        validateAnswer(request.answer, errors)
        validateChoices(request.choices, request.answer, errors)
        validateDifficulty(request.difficulty, errors)
        
        return ValidationResult(
            isValid = errors.isEmpty(),
            errors = errors
        )
    }
    
    private fun validateQuestion(question: String, errors: MutableList<String>) {
        if (question.isBlank()) {
            errors.add("문제 내용은 필수입니다")
        }
        if (question.length > 500) {
            errors.add("문제 내용은 500자를 초과할 수 없습니다")
        }
    }
    
    private fun validateAnswer(answer: String, errors: MutableList<String>) {
        if (answer.isBlank()) {
            errors.add("정답은 필수입니다")
        }
        if (answer.length > 100) {
            errors.add("정답은 100자를 초과할 수 없습니다")
        }
    }
    
    private fun validateChoices(choices: List<String>, answer: String, errors: MutableList<String>) {
        if (choices.isEmpty()) {
            errors.add("선택지는 최소 1개 이상이어야 합니다")
            return
        }
        
        if (choices.size > 10) {
            errors.add("선택지는 최대 10개까지 가능합니다")
        }
        
        if (!choices.contains(answer)) {
            errors.add("정답이 선택지에 포함되어야 합니다")
        }
        
        if (choices.distinct().size != choices.size) {
            errors.add("중복된 선택지가 있습니다")
        }
        
        choices.forEach { choice ->
            if (choice.isBlank()) {
                errors.add("빈 선택지는 허용되지 않습니다")
            }
            if (choice.length > 100) {
                errors.add("선택지는 100자를 초과할 수 없습니다")
            }
        }
    }
    
    private fun validateDifficulty(difficulty: Int, errors: MutableList<String>) {
        if (difficulty < 1 || difficulty > 5) {
            errors.add("난이도는 1-5 사이의 값이어야 합니다")
        }
    }
}

data class ValidationResult(
    val isValid: Boolean,
    val errors: List<String>
)