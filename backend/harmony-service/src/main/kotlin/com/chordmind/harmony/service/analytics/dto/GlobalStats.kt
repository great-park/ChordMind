package com.chordmind.harmony.service.analytics.dto

data class GlobalStats(
    val totalQuestions: Long,
    val totalResults: Long,
    val totalCorrect: Long,
    val globalAccuracy: Double,
    val typeDistribution: Map<String, Long>
)