package com.chordmind.harmony.dto

import com.chordmind.harmony.domain.QuizType
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Min

data class PersonalizedFeedbackRequest(
    @field:NotNull(message = "사용자 ID는 필수입니다.")
    val userId: Long,
    
    @field:NotNull(message = "퀴즈 타입은 필수입니다.")
    val questionType: QuizType,
    
    @field:NotNull(message = "사용자 답변은 필수입니다.")
    val userAnswer: String,
    
    @field:NotNull(message = "정답은 필수입니다.")
    val correctAnswer: String,
    
    val isCorrect: Boolean,
    
    val timeSpent: Long? = null,
    
    val difficulty: Int? = null
)

data class AdaptiveQuestionRequest(
    @field:NotNull(message = "사용자 ID는 필수입니다.")
    val userId: Long,
    
    @field:NotNull(message = "퀴즈 타입은 필수입니다.")
    val questionType: QuizType,
    
    @field:Min(value = 1, message = "문제 개수는 1개 이상이어야 합니다.")
    val count: Int = 1
)

data class SmartHintsRequest(
    @field:NotNull(message = "사용자 ID는 필수입니다.")
    val userId: Long,
    
    @field:NotNull(message = "퀴즈 타입은 필수입니다.")
    val questionType: QuizType,
    
    @field:Min(value = 1, message = "난이도는 1 이상이어야 합니다.")
    val difficulty: Int,
    
    val showDetailedHints: Boolean = false
)

data class LearningRecommendationRequest(
    @field:NotNull(message = "사용자 ID는 필수입니다.")
    val userId: Long,
    
    val includeWeakestAreas: Boolean = true,
    
    val includeTimeEstimate: Boolean = true,
    
    val maxRecommendations: Int = 5
) 