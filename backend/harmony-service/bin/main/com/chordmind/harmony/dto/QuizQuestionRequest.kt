package com.chordmind.harmony.dto

import com.chordmind.harmony.domain.QuizType
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size

data class QuizQuestionRequest(
    @field:NotNull(message = "퀴즈 타입은 필수입니다.")
    val type: QuizType,
    
    @field:NotBlank(message = "문제는 필수입니다.")
    @field:Size(max = 500, message = "문제는 500자 이하여야 합니다.")
    val question: String,
    
    val imageUrl: String? = null,
    
    @field:NotBlank(message = "정답은 필수입니다.")
    val answer: String,
    
    val explanation: String? = null,
    
    val difficulty: Int = 1,
    
    @field:Size(min = 2, max = 6, message = "선택지는 2개 이상 6개 이하여야 합니다.")
    val choices: List<String> = emptyList()
) 