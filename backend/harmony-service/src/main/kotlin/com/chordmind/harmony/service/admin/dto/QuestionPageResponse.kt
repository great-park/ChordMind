package com.chordmind.harmony.service.admin.dto

import com.chordmind.harmony.domain.QuizQuestion

data class QuestionPageResponse(
    val content: List<QuizQuestion>,
    val totalElements: Long,
    val totalPages: Int,
    val currentPage: Int,
    val size: Int
)