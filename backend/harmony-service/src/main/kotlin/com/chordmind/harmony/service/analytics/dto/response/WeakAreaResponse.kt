package com.chordmind.harmony.service.analytics.dto.response

data class WeakAreaResponse(
    val type: String,
    val attempts: Long,
    val correct: Long,
    val accuracy: Double
)