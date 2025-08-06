package com.chordmind.harmony.service.analytics.dto

data class UserStats(
    val totalAttempts: Long,
    val correctAnswers: Long,
    val accuracy: Double,
    val typeStats: Map<String, TypeStats>
)

data class TypeStats(
    val type: String,
    val attempts: Long,
    val correct: Long,
    val accuracy: Double
)