package com.chordmind.harmony.service.analytics.dto.response

data class DifficultyAnalysisResponse(
    val difficultyStats: Map<String, DifficultyStatsResponse>
)

data class DifficultyStatsResponse(
    val attempts: Int,
    val correct: Int,
    val accuracy: Double
)