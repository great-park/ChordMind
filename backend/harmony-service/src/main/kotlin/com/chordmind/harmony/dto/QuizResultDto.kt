package com.chordmind.harmony.dto

import java.time.LocalDateTime

// 퀴즈 결과 저장 요청
data class QuizResultRequest(
    val userId: Long,
    val questionId: Long,
    val selected: String
)

// 퀴즈 결과 저장 응답
data class QuizResultResponse(
    val id: Long,
    val userId: Long,
    val questionId: Long,
    val selected: String,
    val correct: Boolean,
    val answeredAt: LocalDateTime
)

// 랭킹 응답
data class QuizRankingDto(
    val userId: Long,
    val score: Long
) 