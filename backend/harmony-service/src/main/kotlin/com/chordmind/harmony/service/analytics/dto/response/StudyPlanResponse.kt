package com.chordmind.harmony.service.analytics.dto.response

data class StudyPlanResponse(
    val priority: String,
    val focusAreas: List<String>,
    val dailyGoals: DailyGoalsResponse,
    val estimatedImprovementWeeks: Int
)

data class DailyGoalsResponse(
    val problemsPerDay: Int,
    val focusTimeMinutes: Int,
    val reviewFrequency: String
)