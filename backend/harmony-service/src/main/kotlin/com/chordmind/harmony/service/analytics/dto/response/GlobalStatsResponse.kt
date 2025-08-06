package com.chordmind.harmony.service.analytics.dto.response

data class GlobalStatsResponse(
    val totalQuestions: Long,
    val totalResults: Long,
    val totalCorrect: Long,
    val globalAccuracy: Double,
    val typeDistribution: Map<String, Long>
)