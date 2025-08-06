package com.chordmind.harmony.service.analytics.dto

data class DifficultyAnalysis(
    val difficultyStats: Map<Int, DifficultyStats>
)

data class DifficultyStats(
    val attempts: Int,
    val correct: Int,
    val accuracy: Double
)