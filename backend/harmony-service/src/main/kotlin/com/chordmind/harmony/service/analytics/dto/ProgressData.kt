package com.chordmind.harmony.service.analytics.dto

import java.time.LocalDate

data class ProgressData(
    val date: LocalDate,
    val attempts: Int,
    val correct: Int,
    val accuracy: Double
)