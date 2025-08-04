package com.chordmind.harmony.dto

data class QuizAnswerRequest(
    val questionId: Long,
    val selected: String,
    val userId: Long? = null // AI 개인화를 위한 사용자 ID (선택적)
)

data class QuizAnswerResult(
    val questionId: Long,
    val correct: Boolean,
    val explanation: String?
) 