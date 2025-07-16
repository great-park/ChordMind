package com.chordmind.practice.dto

import com.chordmind.practice.domain.SessionStatus
import java.time.LocalDateTime

// 연습 세션 생성 요청
data class CreatePracticeSessionRequest(
    val userId: Long,
    val goal: String? = null
)

// 연습 세션 응답
data class PracticeSessionResponse(
    val id: Long,
    val userId: Long,
    val startedAt: LocalDateTime,
    val endedAt: LocalDateTime?,
    val status: SessionStatus,
    val goal: String?
)

data class PracticeSessionSummary(
    val id: Long,
    val songTitle: String,
    val artist: String,
    val difficulty: String,
    val accuracy: Double,
    val score: Int,
    val completed: Boolean,
    val createdAt: LocalDateTime
) 