package com.chordmind.harmony.dto

data class QuizAnswerRequest(
    val questionId: Long,
    val selected: String
)

data class QuizAnswerResult(
    val questionId: Long,
    val correct: Boolean,
    val explanation: String?
) 