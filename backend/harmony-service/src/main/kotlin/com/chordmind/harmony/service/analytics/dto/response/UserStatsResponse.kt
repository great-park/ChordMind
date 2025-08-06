package com.chordmind.harmony.service.analytics.dto.response

data class UserStatsResponse(
    val totalAttempts: Long,
    val correctAnswers: Long,
    val accuracy: Double,
    val typeStats: Map<String, TypeStatsResponse>
)

data class TypeStatsResponse(
    val attempts: Long,
    val correct: Long,
    val accuracy: Double
)