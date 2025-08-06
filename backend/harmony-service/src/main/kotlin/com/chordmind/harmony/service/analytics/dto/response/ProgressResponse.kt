package com.chordmind.harmony.service.analytics.dto.response

import java.time.LocalDate

data class ProgressResponse(
    val date: String,
    val attempts: Int,
    val correct: Int,
    val accuracy: Double
)

data class LearningTrendsResponse(
    val trend: String,
    val recentAccuracy: Double,
    val earlierAccuracy: Double,
    val improvement: Double
)